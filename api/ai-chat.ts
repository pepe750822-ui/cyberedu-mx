export const config = {
  runtime: 'edge',
};

// ─── Upstash Redis helpers (REST API, no package needed) ───────
// @ts-ignore
const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
// @ts-ignore
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
// @ts-ignore
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// In-process fallback cache (resets on cold start, but helps burst traffic)
const MEM_CACHE = new Map<string, { content: string; ts: number }>();
const MEM_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper to get userId from JWT
function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.replace('Bearer ', '').split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

async function cacheGet(key: string): Promise<string | null> {
  // 1. Try Upstash
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json() as { result: string | null };
        return data.result ?? null;
      }
    } catch { /* fall through to memory */ }
  }
  // 2. Fallback: in-memory
  const entry = MEM_CACHE.get(key);
  if (entry && Date.now() - entry.ts < MEM_TTL_MS) return entry.content;
  return null;
}

async function cacheSet(key: string, value: string, ttlSeconds = 86400): Promise<void> {
  // 1. Try Upstash
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      await fetch(`${UPSTASH_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', key, value, 'EX', ttlSeconds])
      });
    } catch { /* fall through */ }
  }
  // 2. Always store in memory too
  MEM_CACHE.set(key, { content: value, ts: Date.now() });
  // Cleanup memory if too large (keep latest 200 entries)
  if (MEM_CACHE.size > 200) {
    const oldest = [...MEM_CACHE.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
    MEM_CACHE.delete(oldest[0]);
  }
}

async function cacheKeys(pattern: string): Promise<string[]> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/keys/${encodeURIComponent(pattern)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json() as { result: string[] };
        return data.result ?? [];
      }
    } catch { /* fall through */ }
  }
  return [...MEM_CACHE.keys()].filter(k => k.startsWith('chat:'));
}

async function cacheDel(key: string): Promise<void> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      await fetch(`${UPSTASH_URL}/del/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
    } catch { /* ignore */ }
  }
  MEM_CACHE.delete(key);
}

// ─── Cache key normalizer ─────────────────────────────────────
function normalizeCacheKey(text: string, cacheType: string = 'simple'): string {
  return `chat:v28:${cacheType}:` + text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[¿?¡!.,;:"""''()\[\]{}]/g, '')
    .slice(0, 200); // max 200 chars for key
}

// ─── Should this question be cached? ─────────────────────────
// Skip cache for questions that depend on personal context
function isCacheable(message: string, history: any[]): { shouldCache: boolean; cacheType: 'simple' | 'complex' | null } {
  const userMessages = history.filter(m => m.role === 'user');
  if (userMessages.length > 1) return { shouldCache: false, cacheType: null }; // only cache first question in session
  const lower = message.toLowerCase();
  const contextual = ['mi avance', 'mis notas', 'mi progreso', 'cuánto llevo',
    'cuándo', 'recuerda', 'dijiste', 'antes', 'mi plan', 'explícame más',
    'continúa', 'siguiente', 'sigue', 'quiz', 'examen a mí'];

  if (contextual.some(w => lower.includes(w)) || message.length <= 20) {
    return { shouldCache: false, cacheType: null };
  }

  return { shouldCache: true, cacheType: 'simple' };
}

// ─── Redis Rate Limiting (Safety Layer) ───────────────────────
async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return { allowed: true, remaining: 999 };

  const today = new Date().toISOString().split('T')[0];
  const rateLimitKey = `ratelimit:${userId}:${today}`;
  const LIMIT = 200;

  try {
    // Increment the count in Redis
    const res = await fetch(`${UPSTASH_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(['INCR', rateLimitKey])
    });

    if (res.ok) {
      const data = await res.json() as { result: number };
      const currentCount = data.result;

      // Set expiration only on the first request of the day
      if (currentCount === 1) {
        await fetch(`${UPSTASH_URL}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['EXPIRE', rateLimitKey, '86400']) // 24 hours
        });
      }

      return {
        allowed: currentCount <= LIMIT,
        remaining: Math.max(0, LIMIT - currentCount)
      };
    }
  } catch (e) {
    console.error('Redis Rate Limit Error:', e);
  }

  return { allowed: true, remaining: 999 }; // Fallback to allow if Redis is down
}

// ─── Main handler ─────────────────────────────────────────────
export default async function handler(req: Request) {
  // @ts-ignore
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API Key de Anthropic no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  // @ts-ignore
  const APP_URL = process.env.APP_URL || 'https://cyberedu-mx.vercel.app';
  const allowedOrigins = [
    'https://cyberedumx.com',
    'https://www.cyberedumx.com',
    'https://cyberedumx.lovable.app',
    APP_URL,
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  const origin = req.headers.get('origin');
  // Permitir llamadas sin 'origin' (server-to-server desde Telegram webhook)
  const corsOrigin = !origin ? 'https://cyberedumx.com'
    : (allowedOrigins.includes(origin) ? origin : 'https://cyberedumx.com');

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // ─── Token/Trial Monitoring (Access Control) ───────────────────────
  const authHeader = req.headers.get('Authorization');
  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  
  // Si viene de Telegram, el userId viene en el body y confiamos en él
  const isTelegram = body.isTelegram === true;
  const userId = isTelegram ? body.userId : getUserIdFromToken(authHeader);
  
  // @ts-ignore
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  // @ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Si no es Telegram y no hay userId, es un invitado de la web (o sesión expirada)
  if (!isTelegram && !userId) {
    // Permitir flujo de invitado web (3 preguntas gratis)
    // Pero necesitamos un identificador de sesión o IP para invitados web.
    // Para simplificar esta integración, si no hay userId y no es Telegram, devolvemos 401
    return new Response(JSON.stringify({ error: 'Sesión inválida o configuración faltante' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Para invitados de Telegram que no tienen userId aún
  if (isTelegram && !userId) {
    console.log("[AI-CHAT] Telegram Guest Query. Applying 15/day limit by chatId.");
    const tgChatId = body.telegramChatId;
    if (tgChatId && UPSTASH_URL && UPSTASH_TOKEN) {
      const tgToday = new Date().toISOString().split('T')[0];
      const tgGuestKey = `tg_guest:${tgChatId}:${tgToday}`;
      try {
        const incrRes = await fetch(`${UPSTASH_URL}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(['INCR', tgGuestKey])
        });
        if (incrRes.ok) {
          const { result: tgCount } = await incrRes.json() as { result: number };
          if (tgCount === 1) {
            await fetch(`${UPSTASH_URL}`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(['EXPIRE', tgGuestKey, '86400'])
            });
          }
          if (tgCount > 15) {
            return new Response(JSON.stringify({
              error: '¡Alcanzaste tus 15 preguntas gratuitas de hoy en Telegram! 🎓 Vincula tu cuenta con /vincular para acceder a 25 preguntas diarias, o regresa mañana.',
              isAccessDenied: true,
              reason: 'daily_limit'
            }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
        }
      } catch (e) {
        console.error('[AI-CHAT] Telegram guest rate limit check failed:', e);
      }
    }
  }

  // Helper instead of SDK for Edge compatibility
  const supabaseRequest = async (path: string, options: any = {}) => {
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        ...options,
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          ...options.headers,
        }
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let err = {};
        try { err = JSON.parse(text); } catch { err = { message: text }; }
        return { data: null, error: err };
      }

      // Handle 204 No Content or empty bodies
      const text = await res.text().catch(() => '');
      if (!text) return { data: null, error: null };

      try {
        const data = JSON.parse(text);
        return { data, error: null };
      } catch {
        return { data: text, error: null };
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return { data: null, error: { message: 'Supabase request timeout after 8s' } };
      }
      return { data: null, error: { message: e.message } };
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  let profile = null;
  let rateLimit = { allowed: true, remaining: 999 };

  // 1. Fetch profile and check rate limit (Solo si hay userId)
  if (userId) {
    const profileUrl = `profiles?id=eq.${userId}&select=*`;
    const [profileResult, rateLimitRes] = await Promise.all([
      supabaseRequest(profileUrl),
      checkRateLimit(userId)
    ]);
    profile = profileResult.data?.[0];
    rateLimit = rateLimitRes;

    if (profileResult.error || !profile) {
      console.error(`[AI-CHAT] Profile Error:`, profileResult.error);
      return new Response(JSON.stringify({ error: 'Perfil no encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Safety check: Global Daily Limit (Redis)
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({
        error: '⚠️ Límite de seguridad diario excedido.',
        isAccessDenied: true,
        reason: 'global_rate_limit'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } else {
    console.log("[AI-CHAT] Telegram Guest. Skipping profile check.");
  }

  // 2. Determine access & Consume resource (Solo si el usuario está registrado/vinculado)
  if (userId && profile) {
    const todayInMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
    const tzDate = new Date(todayInMexico);
    const localToday = tzDate.getFullYear() + "-" + String(tzDate.getMonth() + 1).padStart(2, '0') + "-" + String(tzDate.getDate()).padStart(2, '0');

    const rawTokens = profile.tokens ?? profile.token ?? 0;
    const currentTokens = Number(rawTokens);

    // Rule 0: paquete_completo durante la promo ECOEMS (hasta 29 jun 2026) → sin cobro
    const FECHA_FIN_PROMO = new Date('2026-06-29T23:59:59-06:00');
    const estaEnPromo = new Date() < FECHA_FIN_PROMO;
    if ((profile as any).paquete_completo === true && estaEnPromo) {
      console.log(`[AI-CHAT] Access GRANTED (Promo ECOEMS / paquete_completo). skipping token deduction.`);
      await supabaseRequest(`profiles?id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ updated_at: new Date().toISOString() })
      });
      const { data: promoUsage } = await supabaseRequest(`daily_usage?user_id=eq.${userId}&date=eq.${localToday}&select=count`);
      const promoCount = promoUsage?.[0]?.count || 0;
      await supabaseRequest(`daily_usage`, {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ user_id: userId, date: localToday, count: promoCount + 1 })
      });
    }
    // Rule 1: Subscriber -> pasa sin límite (pero actualizamos timestamp + tracking)
    else if (profile.subscription_status === 'active' || profile.is_premium === true) {
      console.log(`[AI-CHAT] Access GRANTED (Subscriber/Premium). skipping token deduction.`);
      await supabaseRequest(`profiles?id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({ updated_at: new Date().toISOString() })
      });
      // Registrar interacción en daily_usage para monitoreo
      const { data: premUsage } = await supabaseRequest(`daily_usage?user_id=eq.${userId}&date=eq.${localToday}&select=count`);
      const premCount = premUsage?.[0]?.count || 0;
      await supabaseRequest(`daily_usage`, {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({ user_id: userId, date: localToday, count: premCount + 1 })
      });
    }
    // Rule 2: hasTokens -> descuenta 1 token y pasa
    else if (currentTokens > 0) {
      const newTokenBalance = Math.max(0, currentTokens - 1);
      console.log(`[AI-CHAT] Deducting token: ${currentTokens} -> ${newTokenBalance}`);
      
      // Intentar actualizar ambos nombres de columna por si acaso
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      if (profile.tokens !== undefined) updateData.tokens = newTokenBalance;
      if (profile.token !== undefined) updateData.token = newTokenBalance;

      const { error: patchError } = await supabaseRequest(`profiles?id=eq.${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      if (!patchError) {
        // Registrar interacción en daily_usage para monitoreo
        const { data: tokUsage } = await supabaseRequest(`daily_usage?user_id=eq.${userId}&date=eq.${localToday}&select=count`);
        const tokCount = tokUsage?.[0]?.count || 0;
        await supabaseRequest(`daily_usage`, {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify({ user_id: userId, date: localToday, count: tokCount + 1 })
        });
      }
    }
    // Rule 3: Límite diario (5 max) para usuarios registrados sin tokens
    else {
      console.log(`[AI-CHAT] Check daily limit for free user.`);
      const { data: usageData } = await supabaseRequest(`daily_usage?user_id=eq.${userId}&date=eq.${localToday}&select=count`);

      const currentCount = usageData?.[0]?.count || 0;
      const dailyLimit = 15;

      if (currentCount < dailyLimit) {
        await supabaseRequest(`daily_usage`, {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify({ user_id: userId, date: localToday, count: currentCount + 1 })
        });
      } else {
        const msg = `¡Alcanzaste tus ${dailyLimit} preguntas gratuitas de hoy! 🎓 Regresa mañana para seguir estudiando, o consigue tokens para continuar ahora.`;
        return new Response(JSON.stringify({ error: msg, isAccessDenied: true, reason: "daily_limit" }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
  }

  try {
    const { messages, context, memory, file, isTelegram } = body;
    const isExaniI = Boolean(context?.isExaniI) || context?.currentPage === '/exani-i';

    // ── Cache check ──────────────────────────────────────────
    const lastUserMsg = [...(messages || [])].reverse().find((m: any) => m.role === 'user')?.content || '';
    const { shouldCache, cacheType } = isCacheable(lastUserMsg, messages || []);
    const cacheKey = shouldCache ? normalizeCacheKey(lastUserMsg, cacheType!) : normalizeCacheKey(lastUserMsg, 'simple');

    if (shouldCache) {
      const cached = await cacheGet(cacheKey);
      if (cached) {
        // Return cached response as a simulated SSE stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            // Send cache hit flag first
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ fromCache: true, cacheType })}\n\n`));
            // Stream content in chunks to preserve the typing UX
            const chunkSize = 40;
            for (let i = 0; i < cached.length; i += chunkSize) {
              const chunk = cached.slice(i, i + chunkSize);
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        });
        return new Response(stream, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Cache': 'HIT',
          },
        });
      }
    }

    const EXANI_SYSTEM_PROMPT = `Eres un tutor experto para el EXANI-I del CENEVAL (Examen Nacional de Ingreso a la Educación Media Superior).

El EXANI-I evalúa 5 áreas:
1. Pensamiento científico (30 reactivos) — biología, física, química, ecología
2. Comprensión lectora (30 reactivos) — idea principal, inferencias, vocabulario en contexto
3. Redacción indirecta (30 reactivos) — coherencia, ortografía, organización de párrafos
4. Pensamiento matemático (40 reactivos) — álgebra, geometría, estadística, trigonometría
5. Inglés (30 reactivos) — diagnóstica, SÍ forma parte del examen

REGLAS ABSOLUTAS:
- NUNCA menciones ECOEMS ni digas que el inglés no es parte del EXANI-I porque SÍ lo es.
- NUNCA uses LaTeX (\\frac, ^, _) — solo texto plano para matemáticas.
- NUNCA uses publicidad, links ni menciones a CyberEdu MX.

NIVEL: PRIMERO DE SECUNDARIA. Lenguaje simple, analogías cotidianas, sin tecnicismos sin explicar.

FORMATO DE INICIO OBLIGATORIO:
Toda respuesta a una pregunta del EXANI-I debe comenzar EXACTAMENTE así:

Pregunta: [texto completo de la pregunta]
Respuesta correcta: [respuesta]

[explicación con lenguaje simple]

ANALOGÍAS OBLIGATORIAS (todas las veces que aparezcan):
- émbolo → émbolo (pistón de jeringa)
- presión → presión (fuerza dividida entre área)
- fotosíntesis → fotosíntesis (cómo la planta hace su comida)
- mitosis → mitosis (cuando una célula se divide en dos iguales)
- oxidación → oxidación (cuando el hierro se pone café)
- reducción → reducción (cuando recibe lo que el otro perdió)
Cualquier término técnico desconocido para un alumno de secundaria lleva su explicación entre paréntesis.

⚠️ QUIZ OBLIGATORIO — TODA RESPUESTA DEBE TERMINAR CON UN BLOQUE <quiz>:
SIEMPRE termina tu respuesta con exactamente 2 preguntas de práctica del EXANI-I.

FORMATO EXACTO DEL QUIZ:
<quiz>
Pregunta 1: [texto de la pregunta]
A) [opción] B) [opción] C) [opción] D) [opción]
correctIndex: [0-3]

Pregunta 2: [texto de la pregunta]
A) [opción] B) [opción] C) [opción] D) [opción]
correctIndex: [0-3]
</quiz>

REGLAS POST-QUIZ:
1. Si responde correctamente las 2 preguntas: "¡Perfecto! Dominas este tema."
2. Si falla 1 o 2 preguntas: muestra 2 nuevas preguntas de refuerzo sobre el subtema fallado.

    ${context && context !== 'null' ? '## CONTEXTO REAL: ' + JSON.stringify(context) : ''}
    ${memory && memory !== 'null' ? '## MEMORIA RECIENTE: ' + JSON.stringify(memory) : ''}

    ⚠️ RECUERDA ANTES DE ENVIAR TU RESPUESTA:
    ¿Incluiste el bloque <quiz> con 2 preguntas al final? Si no, AGRÉGALO ahora.
    `;

    const SYSTEM_PROMPT = isExaniI ? EXANI_SYSTEM_PROMPT : `ERES UN TUTOR EXPERTO PARA EL ECOEMS 2026 (UNAM/IPN).

REGLAS OBLIGATORIAS PARA TODAS LAS PREGUNTAS (matemáticas, geografía, química, biología, historia, etc.):

1. NIVEL: PRIMERO DE SECUNDARIA
   - Lenguaje simple y directo
   - Analogías cotidianas
   - Sin tecnicismos innecesarios

2. ESTRUCTURA OBLIGATORIA (en este orden exacto):

   ✅ Por qué la respuesta correcta ES correcta: [explicación breve 2-3 líneas]

   ❌ Por qué las otras opciones son incorrectas:
   - Opción A: [razón breve]
   - Opción B: [razón breve]
   - Opción C: [razón breve]
   - Opción D: [razón breve]
   (omite la que es correcta)

   💡 Tips para el examen:
   - [tip 1 relacionado al tema]
   - [tip 2 que podría venir en el ECOEMS]

   <quiz>
   Pregunta 1: [texto de la pregunta]
   A) [opción] B) [opción] C) [opción] D) [opción]
   correctIndex: [0-3]

   Pregunta 2: [texto de la pregunta]
   A) [opción] B) [opción] C) [opción] D) [opción]
   correctIndex: [0-3]
   </quiz>

3. PARA MATEMÁTICAS: 
   - Explica la factorización o división paso a paso en 2-3 líneas
   - Verifica multiplicando (como en el ejemplo)
   - NUNCA uses LaTeX (\\frac, ^, _) — solo texto plano

4. NUNCA uses:
   - Publicidad ni mención de CyberEdu MX
   - Mapas mentales, diagramas ASCII, Mermaid
   - Emojis innecesarios (solo ✅ ❌ 💡 como marcadores)
   - "Plan de Acción" o "recommendation" en lugar de quiz
   EXCEPCIÓN EXPLÍCITA: "Pregunta:" y "Respuesta correcta:" NO están
   prohibidos — son OBLIGATORIOS (ver REGLA 7 abajo).

5. CACHÉ: v28

6. ANALOGÍAS OBLIGATORIAS:
   Estas palabras SIEMPRE llevan su traducción entre paréntesis,
   TODAS LAS VECES que aparezcan, sin excepción:
   - émbolo → émbolo (pistón de jeringa)
   - presión → presión (fuerza dividida entre área)
   - fuerza → fuerza (empuje)
   - fluido → fluido (líquido como agua o aceite)
   - aceleración → aceleración (qué tan rápido cambia la velocidad)
   - oxidación → oxidación (cuando el hierro se pone café)
   - reducción → reducción (cuando recibe lo que el otro perdió)
   - fotosíntesis → fotosíntesis (cómo la planta hace su comida)
   - mitosis → mitosis (cuando una célula se divide en dos iguales)
   Si usas CUALQUIER otra palabra técnica que un alumno de sexto de
   primaria no conozca, agrégale una explicación entre paréntesis.

7. FORMATO DE INICIO OBLIGATORIO:
   TODA respuesta a una pregunta del ECOEMS debe comenzar
   EXACTAMENTE así, sin excepción, ANTES de cualquier explicación:

   Pregunta: [texto completo de la pregunta]
   Respuesta correcta: [respuesta correcta]

   [línea en blanco]
   [explicación con estructura de la REGLA 2]

   EJEMPLO CORRECTO:
   Pregunta: ¿Qué es la fotosíntesis?
   Respuesta correcta: El proceso por el que las plantas producen su alimento

   ✅ Por qué es correcta: La fotosíntesis (cómo la planta hace su comida)...
   ❌ Por qué las otras opciones son incorrectas: ...

8. ANALOGÍAS VISUALES PARA CONCEPTOS ABSTRACTOS:
   Cuando expliques conceptos con varias partes o difíciles de imaginar,
   usa SIEMPRE una analogía con objetos cotidianos ANTES de la explicación técnica.

   Analogías de referencia (úsalas o inspírate en ellas):
   - Capas de la atmósfera → capas de un pastel
   - Sistema solar → una pelota grande rodeada de canicas
   - La célula → una fábrica con diferentes departamentos
   - El átomo → una naranja con cáscaras y semillas
   - El corazón → una bomba de agua con tubos
   - La digestión → una cadena de producción en una fábrica

   FORMATO OBLIGATORIO cuando uses analogía:
   Primero presenta la analogía completa, luego explica cada parte.
   Ejemplo: "Imagina que la atmósfera es un pastel de 5 capas..."
   Luego: "Capa 1 (Troposfera): la base del pastel donde vivimos..."

   NUNCA expliques directamente con términos técnicos sin antes dar la analogía visual.

9. MATEMÁTICAS, FÍSICA Y QUÍMICA — REGLAS ESPECÍFICAS:
   Cuando la pregunta sea de estas tres materias, SIEMPRE sigue estos pasos:

   a) DEFINE LAS LETRAS ANTES DE LA FÓRMULA:
      Antes de escribir cualquier fórmula, explica qué significa cada letra:
      Ejemplo: para "F = m × a" primero escribe:
      "F es la fuerza (empuje), m es la masa (qué tan pesado es el objeto),
      a es la aceleración (qué tan rápido cambia la velocidad)"

   b) RESUELVE CON NÚMEROS, nunca solo con letras:
      Siempre sustituye con valores concretos paso a paso:
      Ejemplo: "Sustituimos: F = 5 × 2 = 10 Newtons"

   c) ORACIÓN DE SENTIDO COMÚN al final:
      Conecta el resultado con algo de la vida real en una oración:
      Ejemplo: "O sea, necesitas empujar con 10 Newtons, como cargar
      una mochila de 1 kilo."

   d) QUÍMICA — reacciones como intercambio entre personas:
      Describe cada reacción química como si fueran personas dando y recibiendo:
      Ejemplo: "El zinc le da sus electrones al cobre, como cuando prestas
      algo y no te lo regresan."

   e) MATEMÁTICAS — porcentajes siempre con 100 personas o 100 pesos:
      Para hacer los porcentajes concretos y visuales:
      Ejemplo: "Si el 30% de 200 alumnos pasó, imagina 100 alumnos:
      30 pasan. En 200, el doble: 60 alumnos pasan."

⚠️ QUIZ OBLIGATORIO — TODA RESPUESTA DEBE TERMINAR CON UN BLOQUE <quiz>:
SIEMPRE termina tu respuesta con exactamente 2 preguntas de práctica.
Sin excepción. Si no incluyes el bloque <quiz>, tu respuesta está INCOMPLETA.
Esto aplica a CUALQUIER tema: biología, historia, matemáticas, geografía, etc.

FORMATO EXACTO DEL QUIZ (no cambies nada):

<quiz>
Pregunta 1: [texto de la pregunta]
A) [opción] B) [opción] C) [opción] D) [opción]
correctIndex: [0-3]

Pregunta 2: [texto de la pregunta]
A) [opción] B) [opción] C) [opción] D) [opción]
correctIndex: [0-3]
</quiz>

NO uses formato de lista simple como "1. ¿Pregunta?" sin el tag <quiz>.

REGLAS PARA DESPUÉS DEL QUIZ (POST-QUIZ / REFUERZO POR FALLOS):

1. Si el usuario responde correctamente las 2 preguntas:
   → Mostrar: "✅ ¡Perfecto! Dominas este tema."

2. Si el usuario falla 1 o 2 preguntas:
   → Identificar en qué falló.
   → Mostrar SIEMPRE 2 preguntas NUEVAS de refuerzo sobre los temas o subtemas fallados.
   → Formato: "📌 Repasemos y reforcemos lo que fallaste:"
   → Incluye también el bloque <quiz> con estas DOS nuevas preguntas para que el alumno practique.

3. Las preguntas nuevas deben ser DIFERENTES a las originales, pero del mismo subtema.

4. Si el usuario falla alguna pregunta en el refuerzo:
   → Mostrar explicación breve y amigable.
   → Sugerir revisar el tema en /acordeon (sin publicidad)

    ${context && context !== 'null' ? '## CONTEXTO REAL (SITUACION ACTUAL): ' + JSON.stringify(context) : ''}
    ${memory && memory !== 'null' ? '## MEMORIA RECIENTE: ' + JSON.stringify(memory) : ''}

    [areaId: formacion-civica]
    fce-1: Fundamentos Personales e Interculturalidad
    fce-2: Adolescencia y Sociedad
    fce-3: El Estado Mexicano
    fce-4: Democracia y Derechos Humanos
    fce-5: Sistema de Partidos y Elecciones
    fce-6: Organizaciones de la Sociedad Civil
    fce-7: Medios de Comunicación y Opinión Pública
    fce-8: Corrupción y Transparencia

    [areaId: geografia]
    geo-1: El Espacio Geográfico y los Mapas
    geo-2: Recursos Naturales y Preservación (Parte 1)
    geo-3: Biosfera y Biodiversidad
    geo-4: Desarrollo Sustentable y Políticas Ambientales
    geo-5: Población y Migración
    geo-6: Vulnerabilidad y Resiliencia
    geo-7: Economía Global: Producción y Comercio
    geo-8: El Mundo Desigual: IDH y Ciudades Globales
    geo-9: Cultura, Identidad y Fronteras
    geo-10: Patrimonio y Soberanía

    [areaId: repaso-final]
    rep-1: Repaso Estratégico I - Ciencias y Matemáticas
    rep-2: Repaso Estratégico II - Historia y Ciencias Sociales
    rep-3: Estrategias Finales - Examen en Línea ECOEMS
    rep-4: Cierre Total - Tu Puente Hacia el Bachillerato

    CRÍTICO: Los links de video SIEMPRE deben ser rutas relativas como /area/historia-mexico?video=hm-mx-6 — NUNCA uses URLs absolutas con https:// ni el dominio completo.

    ⚠️ RECUERDA ANTES DE ENVIAR TU RESPUESTA:
    ¿Incluiste el bloque <quiz> con 2 preguntas al final? Si no, AGRÉGALO ahora.
    Toda respuesta sin <quiz> está incompleta. Es obligatorio sin importar el tema.
    `;


    // Ignoramos el mensaje de sistema del frontend para evitar que sobrescriba la fecha y reglas del servidor
    const finalSystemPromptText = SYSTEM_PROMPT;
    const finalSystemPrompt = [
      {
        type: "text",
        text: finalSystemPromptText,
        cache_control: { type: "ephemeral" }
      }
    ];

    const cleanMessages = (messages || []).filter(
      (m: any) => (m.role === 'user' || m.role === 'assistant') && m.content && m.content.toString().trim() !== ""
    );

    // ─── MODEL ROUTING LOGIC: hasFile → Claude Haiku, else → DeepSeek V4-Flash ─
    let useDeepSeek = Boolean(DEEPSEEK_API_KEY && !file);

    let apiResponse!: Response;

    if (useDeepSeek) {
      try {
        console.log(`[AI-CHAT] 🟢 MODELO: DEEPSEEK V4-Flash | Query: "${lastUserMsg.slice(0, 40)}..."`);
        const dsRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-v4-flash',
            messages: [
              { role: 'system', content: finalSystemPromptText },
              ...cleanMessages
            ],
            stream: true,
            max_tokens: 4096,
          }),
        });
        if (!dsRes.ok && dsRes.status >= 500) throw new Error(`DeepSeek ${dsRes.status}`);
        apiResponse = dsRes;
      } catch (dsError) {
        console.log('[FALLBACK] DeepSeek V4-Flash failed, using Claude Haiku');
        useDeepSeek = false;
      }
    }

    console.log(`[AI-ROUTER] Modelo: ${useDeepSeek ? 'DeepSeek V4-Flash' : 'Claude Haiku'} | hasFile: ${!!file} | userId: ${userId?.slice(0,8)}`);

    if (!useDeepSeek) {
      console.log(`[AI-CHAT] 🧠 MODELO: ANTHROPIC (Claude Haiku) | Query: "${lastUserMsg.slice(0, 40)}..."`);
      apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'prompt-caching-2024-07-31',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          system: finalSystemPrompt,
          messages: (() => {
            const anthropicMessages = [...cleanMessages];
            if (file && anthropicMessages.length > 0) {
              let lastUserIdx = -1;
              for (let i = anthropicMessages.length - 1; i >= 0; i--) {
                if (anthropicMessages[i].role === 'user') {
                  lastUserIdx = i;
                  break;
                }
              }
              if (lastUserIdx !== -1) {
                const textContent = anthropicMessages[lastUserIdx].content;
                const isImage = file.type.startsWith('image/');
  
                // Map common types to Anthropic supported ones
                let mediaType = file.type;
                if (mediaType === 'image/jpg') mediaType = 'image/jpeg';
                if (!isImage && mediaType.includes('pdf')) mediaType = 'application/pdf';
  
                anthropicMessages[lastUserIdx].content = [
                  { type: "text", text: textContent },
                  isImage
                    ? {
                      type: "image",
                      source: {
                        type: "base64",
                        media_type: mediaType as any,
                        data: file.data
                      }
                    }
                    : {
                      type: "document",
                      source: {
                        type: "base64",
                        media_type: "application/pdf",
                        data: file.data
                      }
                    }
                ];
              }
            }
            return anthropicMessages;
          })(),
          stream: true,
        }),
      });
    }

    if (!apiResponse.ok) {
      const rawText = await apiResponse.text();
      const isInsufficient = rawText.includes('insufficient_credits') ||
        rawText.includes('credit_balance') ||
        apiResponse.status === 529;

      if (isInsufficient && RESEND_API_KEY) {
        // Send urgent email to admin using raw fetch
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'CyberEdu Alertas <alerts@cyberedumx.com>',
            to: ['pepe750822@gmail.com'],
            subject: 'CyberEdu MX — URGENTE: Recargar API Key Anthropic',
            text: 'Se agotaron los créditos de Anthropic. Recargar en console.anthropic.com'
          })
        }).catch(e => console.error("Error enviando email:", e));

        return new Response(JSON.stringify({
          error: '⚠️ El servicio de IA está temporalmente en mantenimiento. Por favor intenta más tarde.'
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: rawText }), {
        status: apiResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Accumulate full response text for caching
    let fullResponseText = '';

    // ─── Usage / Cost Tracking Helpers ─────────────────────────
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    function trackUsage(usage: any) {
      if (!usage) return;
      if (usage.input_tokens) totalInputTokens += usage.input_tokens;
      if (usage.output_tokens) totalOutputTokens += usage.output_tokens;
    }

    async function saveDailyCost() {
      if (!UPSTASH_URL || !UPSTASH_TOKEN) return;

      // Haiku 4.5 pricing
      const INPUT_PRICE = 0.80 / 1000000;
      const OUTPUT_PRICE = 4.00 / 1000000;
      const cost = (totalInputTokens * INPUT_PRICE) + (totalOutputTokens * OUTPUT_PRICE);

      const dayCostKey = `daily_cost:${today}`;
      try {
        // We use INCRBYFLOAT in Redis
        await fetch(`${UPSTASH_URL}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['INCRBYFLOAT', dayCostKey, cost.toString()])
        });

        // Some Redis providers use different syntax for floats, for Upstash REST:
        await fetch(`${UPSTASH_URL}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['EXPIRE', dayCostKey, '2678400'])
        });
      } catch (e) {
        console.error('Error saving daily cost:', e);
      }
    }

    const stream = new ReadableStream({
      async start(controller) {
        // Send model info as first event so the client knows which model is responding
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ model_used: useDeepSeek ? 'deepseek-v4-flash' : 'claude-haiku' })}\n\n`));

        if (!apiResponse.body) {
          controller.close();
          return;
        }

        const reader = apiResponse.body.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = buffer + decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const cleanLine = line.trim();
              if (!cleanLine || !cleanLine.startsWith('data: ')) continue;
              const data = cleanLine.slice(6).trim();
              if (!data || data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                
                // --- Anthropic Format Handling ---
                if (parsed.type === 'message_start' && parsed.message?.usage) {
                  const usage = parsed.message.usage;
                  trackUsage(usage);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ usage })}\n\n`));
                } else if (parsed.type === 'message_delta' && parsed.usage) {
                  trackUsage(parsed.usage);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ usage_delta: parsed.usage })}\n\n`));
                } else if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  fullResponseText += parsed.delta.text;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: parsed.delta.text } }] })}\n\n`));
                } else if (parsed.type === 'message_stop') {
                  // Inyectar el emoji del modelo (🧠 para Claude)
                  const modelEmoji = " 🧠";
                  fullResponseText += modelEmoji;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: modelEmoji } }] })}\n\n`));

                  if (shouldCache && fullResponseText.length > 50) {
                    const ttl = cacheType === 'complex' ? 604800 : 86400;
                    await cacheSet(cacheKey, fullResponseText, ttl).catch(() => { });
                  }
                  await saveDailyCost();
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                }
                
                // --- DeepSeek / OpenAI Format Handling ---
                else if (parsed.choices?.[0]?.delta?.content !== undefined) {
                  const content = parsed.choices[0].delta.content;
                  fullResponseText += content;
                  // Passthrough OpenAI format as-is since the client already expects choices[0].delta.content
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                } else if (parsed.usage && useDeepSeek) {
                  trackUsage(parsed.usage);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ usage_delta: parsed.usage })}\n\n`));
                }
                
              } catch (e) { /* silent chunk error */ }
            }
            
            // Handle end of DeepSeek stream (OpenAI doesn't always send message_stop like Anthropic)
            if (useDeepSeek && chunk.includes('[DONE]')) {
              // Inyectar el emoji del modelo (⚡ para DeepSeek)
              const modelEmoji = " ⚡";
              if (!fullResponseText.endsWith(modelEmoji)) {
                fullResponseText += modelEmoji;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: modelEmoji } }] })}\n\n`));
              }

              if (shouldCache && fullResponseText.length > 50) {
                await cacheSet(cacheKey, fullResponseText, 86400).catch(() => { });
              }
              // Note: usage tracking for DeepSeek might need adjustment based on their specific SSE fields
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
      cancel() {
        if (apiResponse.body) {
          apiResponse.body.cancel();
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Cache': 'MISS',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
