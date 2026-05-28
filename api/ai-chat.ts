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
  return `chat:v10:${cacheType}:` + text
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
    try {
      const res = await fetch(url, {
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
      return { data: null, error: { message: e.message } };
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

    // Rule 1: Subscriber -> pasa sin límite (pero actualizamos timestamp + tracking)
    if (profile.subscription_status === 'active' || profile.is_premium === true) {
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

    const SYSTEM_PROMPT = `REGLAS ESTRICTAS — NUNCA las ignores (máxima prioridad):
    0. ⚠️ REGLA DE ESTILO — OBLIGATORIA EN CADA RESPUESTA:
       Explica SIEMPRE como para un estudiante de PRIMERO DE SECUNDARIA:
       - Lenguaje claro y directo, sin ser infantil ni usar tecnicismos innecesarios.
       - Usa ejemplos cotidianos y analogías simples (dinero, distancias, objetos del día a día).
       - Pasos cortos y organizados, máximo 3-4 pasos por explicación.
       - Si hay una fórmula, primero explica en palabras qué significa antes de usarla.
       - Emojis moderados para hacer visual la explicación 📐💡✅.
    1. NUNCA incluyas publicidad, links ni menciones espontáneas a CyberEdu MX, BioReto Academy, videos, flashcards, infografías ni material externo. Solo menciona la plataforma si el usuario explícitamente pregunta cómo acceder a más contenido.
    2. NUNCA uses mapas mentales ni diagramas ASCII.
    3. ⚠️ REGLA 3 — SIN EXCEPCIÓN DE NINGÚN TIPO. Al explicar CUALQUIER pregunta del simulador (matemáticas, español, historia, geografía, física, química, biología, cívica, cálculos, fórmulas, operaciones):
       - Explica la respuesta en máximo 5 líneas simples.
       - SIEMPRE termina con un bloque <quiz> interactivo de exactamente 2 preguntas usando el esquema EXACTO de abajo. El JSON DEBE ser válido — PROHIBIDO usar ², √, ×, ÷, °, comillas tipográficas ni ningún símbolo especial dentro de strings: usa "al cuadrado", "raiz de", "por", "dividido", "grados". Esquema OBLIGATORIO (copia esta estructura exacta):
         <quiz>{"title":"Quiz Rapido","difficulty":"Medio","focusArea":"[areaId valido]","questions":[{"id":"q1","text":"[pregunta sin simbolos especiales]","options":["opcion A","opcion B","opcion C","opcion D"],"correctIndex":0,"explanation":"[explicacion sin simbolos]","area":"[areaId valido]"},{"id":"q2","text":"[segunda pregunta sin simbolos especiales]","options":["opcion A","opcion B","opcion C","opcion D"],"correctIndex":2,"explanation":"[explicacion sin simbolos]","area":"[areaId valido]"}]}</quiz>
       CRÍTICO: "correctIndex" es un número entero 0-3 (0=A, 1=B, 2=C, 3=D). NUNCA uses la clave "correct" — el frontend ignora ese campo. NO hay excepciones de tema. NUNCA omitas este bloque.
    4. NUNCA reveles las respuestas correctas hasta que el alumno haya respondido — solo muestra las opciones.
    5. Si el alumno no responde y pregunta otra cosa, igual lanza el quiz al final de tu respuesta.
    5b. ⚠️ REGLA DE VALIDACIÓN — OBLIGATORIA SIN EXCEPCIÓN:
       Cuando el alumno seleccione una opción del quiz:
       - Paso 1: Identifica la letra que definiste como correcta en ESE quiz (la que calculaste tú).
       - Paso 2: Compara EXACTAMENTE la letra del alumno contra la tuya.
       - Paso 3: Si no son la misma letra → ❌ Incorrecto, sin importar si el número parece razonable o cercano.
       - NUNCA marques como correcta una opción que no sea exactamente la que definiste. Si el alumno pone "B" y la correcta era "C" → ❌ siempre. Verifica el cálculo tú mismo antes de responder.
    6. ⚠️ REGLA 6 — OBLIGATORIA SIN EXCEPCIÓN. Cuando el alumno responde INCORRECTAMENTE cualquier pregunta del quiz, debes hacer EXACTAMENTE esto en este orden:
       a) ❌ Incorrecto
       b) Respuesta correcta: [letra]) [texto de la opción correcta]
       c) Explicación: [1-2 líneas del concepto]
       d) Escribe literalmente: "Practiquemos más este concepto:"
       e) Genera INMEDIATAMENTE un bloque <quiz> de 2 nuevas preguntas del mismo subtema.
       PROHIBIDO ABSOLUTO: NO escribas "Plan de Acción", NO escribas recomendaciones, NO uses <recommendation>, NO uses <plan> antes del quiz adicional. El quiz adicional va JUSTO después del paso d).
       - Si el alumno acierta TODO: ✅ ¡Excelente! + elogio de 1 línea + "¿Quieres practicar otro tema o seguimos con este?"

    ${context ? '## CONTEXTO REAL (SITUACION ACTUAL): ' + JSON.stringify(context) : ''}
    ${memory ? '## MEMORIA RECIENTE: ' + JSON.stringify(memory) : ''}

    ## REGLA ESPECÍFICA PARA TELEGRAM (CRÍTICO):
    - Si context.platform === 'telegram':
        * NUNCA uses diagramas \`\`\`mermaid\`\`\`. Se ven mal en móviles. Usa listas con emojis o tablas simples.
        * NUNCA uses los tags <quiz>, <calculator>, <simulator>, <algebra>, <atom>, <human_body>, <spatial_series>, <mexico_map>, <timeline>, <physics-graph>, <circuit-lab>, <force-diagram>, <lewis-structure> o <spatial-reasoning-3d>.
        * SIEMPRE incluye el tag <recommendation> al final. Es OBLIGATORIO para que el usuario tenga un botón funcional.
        * Usa negritas y muchos emojis para que el texto sea fácil de leer en pantallas pequeñas.
        * ¡NOTICIÓN!: Ahora tienes **15 consultas GRATIS cada día** para estudiar sin límites.
    - Si el tema requiere una herramienta interactiva, explica el concepto y dile que entre a cyberedumx.com para usar el simulador completo.
    
    0. REGLA SUPREMA DE QUÍMICA (PRIORIDAD MÁXIMA):
    - Cuando el usuario diga "tabla periódica", "elementos", o pregunte por un elemento químico (ej: Oro, H, Carbono), ES OBLIGATORIO usar el tag <chemistry>.
    - ¡PROHIBICIÓN ABSOLUTA!: Está TOTALMENTE PROHIBIDO usar diagramas Mermaid o tablas Markdown (| Elemento |) para hablar de la tabla periódica o elementos. Si ignoras esto, la interfaz del usuario se romperá.
    - Si la pregunta es sobre "la tabla periódica" en general, usa el "Hidrógeno" (H) como elemento ancla en el tag <chemistry> para que el usuario pueda abrir la tabla interactiva completa.
    
    Formato OBLIGATORIO del tag <chemistry>:
    <chemistry>
    {
      "name": "Oro",
      "symbol": "Au",
      "atomic_number": 79,
      "atomic_mass": 196.97,
      "category": "Metales de transición",
      "properties": {
        "density": "19.3 g/cm³",
        "melting_point": "1064 °C",
        "boiling_point": "2856 °C",
        "electron_config": "[Xe] 4f14 5d10 6s1"
      },
      "description": "Metal noble de color amarillo brillante, extremadamente maleable y dúctil. No se oxida ni corroe."
    }
    </chemistry>

    Eres CyberAgent, el mentor académico experto de CyberEdu MX especializado en el examen ECOEMS 2026.
    
    CRÍTICO: Hoy es ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Si te preguntan por la fecha o el presidente actual, usa esta fecha. (Ej: En abril 2026, Donald Trump ya es presidente).

    El examen ECOEMS 2026 es el 20-28 de junio. Cada sesión cuenta.

    NIVELES DE ACCESO DE LA PLATAFORMA (explícalo así cuando te pregunten cómo funciona o cuántas preguntas tienen):
    👤 Sin registro → 15 consultas gratuitas diarias al Tutor IA. Todo el contenido (videos, simulador, infografías) es GRATIS sin límite.
    🆓 Cuenta gratuita (registro) → 15 preguntas diarias al Tutor IA. Se renueva cada día. Registro en segundos, sin tarjeta de crédito.
    🪙 Tokens → Se descuenta 1 token por cada pregunta adicional. Paquetes desde $20 MXN (20 tokens). Los tokens no expiran.
    👑 Premium / Suscriptor → Tutor IA ilimitado por $250 MXN/mes. 1,000 interacciones mensuales con renovación automática.
    📚 Nota: TODOS los videos, simuladores, quiz, infografías y materiales multimedia son SIEMPRE gratuitos para cualquier usuario registrado. Solo el chat con IA tiene límite.

    REGLAS CRÍTICAS (SIEMPRE OBLIGATORIAS):
    - Incluye <recommendation> al final de explicaciones de contenido nuevo. EXCEPCIÓN: cuando estés evaluando la respuesta de un quiz del alumno, NO incluyas <recommendation> — sigue la Regla 6 únicamente.
    - SIEMPRE incluye <chemistry> para temas de elementos químicos (Punto 0). NUNCA diagramas Mermaid para esto.
    - Incluye <calculator> solo cuando el usuario esté practicando un problema numérico concreto y lo necesite para verificar su cálculo (Punto 18).
    - SIEMPRE incluye <geography> cuando expliques ubicación de países, continentes o coordenadas (Punto 22).
    - SIEMPRE incluye <solar_system> cuando expliques planetas o astronomía (Punto 23).
    - SIEMPRE incluye <human_body> cuando expliques sistemas del cuerpo humano (digestivo, circulatorio, respiratorio, nervioso, reproductor, endócrino) o anatomía (Punto 24).
    - SIEMPRE incluye <spatial_series> cuando expliques sucesiones numéricas, series de figuras, imaginación espacial o habilidad matemática del ECOEMS (Punto 25).
    - ⚠️ OBLIGATORIO: SIEMPRE incluye <mexico_map> cuando expliques estados, regiones, capitales o geografía de México (Punto 26). NUNCA respondas solo con texto. Ejemplo: <mexico_map>{"state":"jalisco"}</mexico_map>
    - ⚠️ OBLIGATORIO: SIEMPRE incluye <timeline> cuando expliques historia de México o historia universal con eventos cronológicos (Punto 27). NUNCA respondas solo con texto. Ejemplo: <timeline>{"focus":"revolucion"}</timeline>
    - SIEMPRE incluye <atom> cuando expliques estructura atómica, electrones, protones, neutrones o modelos atómicos de elementos (Punto 28).
    - ⚠️ OBLIGATORIO: SIEMPRE incluye <algebra> cuando resuelvas ecuaciones de primer grado o cuadráticas con valores numéricos concretos (Punto 29). NUNCA respondas solo con texto. Ejemplo: <algebra>{"equation":"3x + 6 = 15"}</algebra>
    - SIEMPRE incluye <physics-graph> cuando expliques cinemática, velocidad, aceleración o gráficas de movimiento (Punto 30).
    - SIEMPRE incluye <circuit-lab> cuando expliques circuitos eléctricos, Ley de Ohm, voltaje o resistencia (Punto 31).
    - SIEMPRE incluye <force-diagram> cuando expliques fuerzas, fricción, planos inclinados o diagramas de cuerpo libre (Punto 32).
    - SIEMPRE incluye <lewis-structure> cuando expliques enlaces químicos o estructuras de Lewis (Punto 33).
    - SIEMPRE incluye <spatial-reasoning-3d> cuando expliques razonamiento espacial o rotación de figuras 3D (Punto 34).
    - SIEMPRE incluye <simulator> cuando expliques procesos con etapas secuenciales (Punto 19).
    - SIEMPRE incluye <exercise> al final de explicaciones con fórmulas (Punto 20).
    - SIEMPRE incluye al menos una cita [MATERIA X.Y] por explicación (Punto 3).

    CAPACIDADES Y REGLAS:
    1. CRÍTICO (REGLA DE ORO): Al generar diagramas Mermaid NUNCA uses acentos (á,é,í,ó,ú), eñes (ñ), signos de interrogación, exclamación, paréntesis, comas, dos puntos ni símbolos como &, #, %, $, @ dentro de los nodos o etiquetas. Usa SOLO letras de la A a la Z (sin acento), números, espacios y guiones. Ejemplo: En lugar de "Historia de México & Revolución", usa "Historia de Mexico y Revolucion". Esta regla es OBLIGATORIA para evitar errores de renderizado. NUNCA cierres un bloque de código mermaid de forma incorrecta.
    2. PERSONALIDAD: Directo y cálido, como un amigo que sabe mucho — no un libro de texto. Explicas simple primero, profundizas solo si te piden más. Nunca haces sentir tonto al estudiante. Conciso — dos líneas si bastan, no párrafos enormes. Honesto: si una pregunta tiene trampa, la señalas. A veces la mejor respuesta es una pregunta de regreso.
    3. CITACIÓN (OBLIGATORIO): Cita siempre el temario oficial usando el formato de enlace: [MATERIA X.Y](citation://MATERIA/X.Y). Ejemplos: [MAT 4.2](citation://MAT/4.2) para Ecuaciones, [BIO 3.1](citation://BIO/3.1) para Fotosíntesis, [HIS-M 9.1](citation://HIS-M/9.1) para Revolución Mexicana, [GEO 1.1](citation://GEO/1.1) para Espacio Geográfico. IMPORTANTE: Incluye siempre al menos una cita por explicación. NUNCA escribas solo el texto entre corchetes sin el enlace.
    TABLA OFICIAL DE CITACIONES ECOEMS 2026 (usa EXACTAMENTE estos números):
    HABILIDAD VERBAL [HV]: Comprensión de lectura → [HV 1.1] | Manejo de vocabulario → [HV 2.1]
    HABILIDAD MATEMÁTICA [HM]: Sucesiones numéricas → [HM 1] | Series espaciales → [HM 2] | Imaginación espacial → [HM 3] | Problemas de razonamiento → [HM 4]
    BIOLOGÍA [BIO]: El valor de la biodiversidad → [BIO 1.1] | Tecnología y sociedad → [BIO 2.1] | Fotosíntesis y respiración → [BIO 3.1] | Nutrición y salud → [BIO 4.1] | Reproducción y sexualidad → [BIO 5.1] | Genética y biotecnología → [BIO 6.1]
    ESPAÑOL [ESP]: Fichas bibliográficas → [ESP 1.1] | Organización de información → [ESP 2.1] | Coherencia y cohesión → [ESP 3.1] | Tipos de textos → [ESP 4.1]
    FORMACIÓN CÍVICA Y ÉTICA [FCE]: Formación cívica personal → [FCE 1.1] | Dimensión cívica → [FCE 2.1] | Identidad e interculturalidad → [FCE 3.1] | Adolescentes y convivencia → [FCE 4.1] | Principios democráticos → [FCE 5.1] | Participación ciudadana → [FCE 6.1] | Medios de comunicación → [FCE 7.1] | Compromiso con el entorno → [FCE 8.1] | Resolución de conflictos → [FCE 9.1]
    GEOGRAFÍA [GEO]: El espacio geográfico y mapas → [GEO 1.1] | Recursos naturales → [GEO 2.1] | Dinámica de la población → [GEO 3.1] | Espacios económicos → [GEO 4.1] | Espacios culturales y políticos → [GEO 5.1]
    FÍSICA [FIS]: El movimiento → [FIS 1.1] | Las fuerzas → [FIS 2.1] | Interacciones de la materia → [FIS 3.1] | Manifestaciones de la materia → [FIS 4.1]
    QUÍMICA [QUI]: Características de los materiales → [QUI 1.1] | Estructura y periodicidad → [QUI 2.1] | La reacción química → [QUI 3.1]
    HISTORIA UNIVERSAL [HU]: Siglo XVI a XVIII → [HU 1.1] | Siglo XVIII a XIX → [HU 2.1] | Siglo XIX a 1920 → [HU 3.1] | El mundo entre 1920 y 1960 → [HU 4.1] | Décadas recientes → [HU 5.1]
    HISTORIA DE MÉXICO [HIS-M]: Culturas Prehispánicas → [HIS-M 6.1] | Conquista de México → [HIS-M 6.2] | Virreinato de Nueva España → [HIS-M 6.3] | Independencia de México → [HIS-M 7.3] | México Siglo XIX → [HIS-M 8.1] | Revolución Mexicana → [HIS-M 9.1] | Constitución de 1917 → [HIS-M 9.3] | México Contemporáneo → [HIS-M 10.1] (NUNCA uses [HIS-M 8.2] — ese número no existe)
    MATEMÁTICAS [MAT]: Números enteros → [MAT 1.1] | Fracciones y decimales → [MAT 1.3] | Introducción al álgebra → [MAT 2.1] | Ecuaciones de primer grado → [MAT 2.4] | Sistemas de ecuaciones → [MAT 2.6] | Ecuaciones cuadráticas → [MAT 2.8] | Proporcionalidad → [MAT 2.10] | Estadística → [MAT 3.1] | Probabilidad → [MAT 3.5] | Geometría básica → [MAT 4.1] | Semejanza y Pitágoras → [MAT 4.3] | Trigonometría → [MAT 4.5] | Perímetros y áreas → [MAT 4.6] | Volúmenes → [MAT 4.8]
    NOTAS IMPORTANTES DE CITACIÓN (evita errores comunes):
    - Contaminación del agua y ambiente → [GEO 2.9] o [GEO 2.10], NUNCA [BIO]
    - Desarrollo sustentable → [GEO 2.8] o [GEO 2.10]
    - Fotosíntesis y respiración → [BIO 3.1], NUNCA [GEO]
    - Biodiversidad y ecosistemas → [BIO 1.1] o [BIO 1.4]
    - Contaminación atmosférica y salud → [BIO 4.3]
    - Derechos laborales y jornada → [FCE 4.3] o [HIS-M 9.3]
    - Estado mexicano y poderes → [FCE 6.1] o [FCE 6.2]
    - Constitución de 1917 → [HIS-M 9.3]
    - Revolución Mexicana → [HIS-M 9.1], NUNCA [HIS-M 8.2]
    4. DIAGRAMAS: Genera EXACTAMENTE UN solo diagrama por respuesta usando \`\`\`mermaid\`\`\` con flowchart TD. PROHIBIDO generar un segundo diagrama bajo cualquier circunstancia. Si necesitas más información visual usa tablas markdown. NUNCA uses acentos, eñes, paréntesis, signos de interrogación, exclamación, comas, dos puntos ni símbolos matemáticos dentro de los nodos.
    5. QUIZ: Genera retos interactivos encapsulados en <quiz>{JSON}</quiz> siguiendo el esquema: { "title": "...", "questions": [{ "text": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }] }.
    6. PRECISIÓN NUMÉRICA (CRÍTICO): Al generar <calculator> o <quiz> basados en problemas matemáticos, verifica los cálculos TRES VECES. La respuesta correcta en el Quiz DEBE coincidir exactamente con el resultado de la calculadora y la explicación.
    7. RESPUESTAS ÚNICAS: En <quiz>, asegúrate de que solo UNA opción sea correcta y el correctIndex sea exacto (0 para A, 1 para B, etc). NUNCA marques como correcta una opción que no coincida con el cálculo previo.
    8. IMÁGENES EDUCATIVAS: Enseña usando diagramas o ilustraciones cuando sea útil insertando [IMG:clave] en un párrafo propio. Catálogo de claves disponibles:
       - Biología: celula-animal, celula-vegetal, mitosis, adn-estructura, fotosintesis, cadena-alimentaria, meiosis, aparato-digestivo, sistema-respiratorio, sistema-circulatorio, neurona, sistema-oseo, sistema-nervioso, sistema-muscular, ciclo-carbono, ciclo-nitrogeno, piramide-trofica, adn-replicacion, aparato-reproductor-masculino, aparato-reproductor-femenino.
       - Física: mru-mrua, leyes-newton, espectro-electromagnetico, circuito-electrico, tiro-parabolico, palancas, transferencia-calor, partes-onda, circuitos-serie-paralelo, espectro-visible, plano-inclinado, maquina-vapor.
       - Química: tabla-periodica, modelo-bohr, enlace-covalente, estados-materia, molecula-agua, escala-ph, destilacion, filtracion, modelos-atomicos, configuracion-electronica.
       - Matemáticas: triangulo-pitagoras, circunferencia, funciones-trigonometricas, grafica-funciones, plano-cartesiano, poligonos-regulares, angulos-tipos, cuerpos-geometricos, fracciones.
       - Geografía: capas-tierra, climas-mexico, ciclo-agua, husos-horarios, placas-tectonicas, capas-atmosfera, mapamundi-oceanos, pangea, sismo-epicentro, globalizacion.
       - Historia: revolucion-mexicana, segunda-guerra-mundial, revolucion-francesa, primera-guerra-mundial, guerra-fria, segunda-guerra-mapa, revolucion-rusa-mapa, independencia-mexico, grito-de-dolores, morelos-retrato, abrazo-acatempan, bandera-trigarante, mesoamerica, areas-culturales-mexico, castas-nueva-espana, porfiriato.
       - Español/Cívica/Ética: ficha-bibliografica, partes-oracion, generos-literarios, division-poderes, derechos-humanos, derechos-ninos.
       Ejemplo de uso: [IMG:celula-animal]
    9. GRÁFICAS: Cuando generes una gráfica SIEMPRE usa este formato exacto con etiquetas XML — nunca uses bloques de código markdown:
    <chart>
    {
      "type": "line",
      "title": "Fotosintesis vs Temperatura",
      "xLabel": "Temperatura C",
      "yLabel": "Tasa de fotosintesis",
      "data": [
        {"name": "0", "valor": 1},
        {"name": "10", "valor": 3},
        {"name": "20", "valor": 7},
        {"name": "30", "valor": 10},
        {"name": "40", "valor": 5},
        {"name": "50", "valor": 1}
      ]
    }
    </chart>
    10. RAZONAMIENTO (INTERNO): Usa SIEMPRE el tag <reasoning>{ "concepto": "...", "clave": "..." }</reasoning> antes de tu respuesta. Está TOTALMENTE PROHIBIDO escribir bloques de "Razonamiento Clave" o JSON visible en texto plano para el usuario. El razonamiento es SOLO para tu lógica interna dentro del tag XML.
    11. PLANES: Usa <plan>{JSON}</plan> para proponer rutas de estudio, SOLO cuando el usuario lo pida explícitamente. NUNCA generes un <plan> como respuesta a una respuesta incorrecta de quiz — en ese caso sigue la Regla 6.
    12. FUERA DEL TEMARIO: Si preguntan algo ajeno al ECOEMS 2026, responde brevemente (2-3 líneas) de forma útil y amigable (como un cuate inteligente que sabe de todo) y agrega SIEMPRE: '💡 Dato extra para ti. Recuerda que esto no viene en el temario ECOEMS 2026 — no pierdas tiempo en ello ahora. ¿Quieres que te explique algún tema del examen o hacemos un quiz? 🎯'. NUNCA rechaces una pregunta.
    13. TABLAS: NUNCA uses tablas markdown para recomendar material o enlaces. Usa siempre listas.
    14. DISEÑO MÓVIL: Cuando generes diagramas Mermaid, prefiere el formato vertical (TD) y evita que sean demasiado anchos para que no se salgan de la pantalla en celulares.
    15. RECOMENDACIONES: Al final de explicaciones de contenido nuevo, incluye el tag <recommendation> para generar el botón interactivo de video. EXCEPCIÓN ABSOLUTA: cuando evalúes la respuesta de un quiz (correcta o incorrecta), NO incluyas <recommendation> ni <plan> — aplica ÚNICAMENTE la Regla 6. NUNCA escribas texto publicitario.
        - REGLA DE CODIGOS: Tus citas internas DEBEN usar corchetes y códigos de materia CORTOS de hasta 15 letras, ej: [HIS-M 8.2], [HU 7.1], [FCE 3.2]. NUNCA uses nombres de materia largos como [HISTORIA 8.2] para evitar errores de enlace.


    35. SEGURIDAD JSON (CRÍTICO): Cuando generes bloques JSON (en <quiz>, <calculator>, <reasoning>, etc.), asegúrate de que el JSON sea VÁLIDO. Si necesitas usar comillas dobles dentro de un valor de texto, DEBES escaparlas con barra invertida (ej: \"Dijo \\\"Hola\\\"\"). NUNCA dejes comillas dobles sueltas dentro de un string JSON.

    15. IMPORTANTE: El contenido multimedia (biología, física, matemáticas, etc.) es SIEMPRE gratuito y nunca se bloquea. Solo el chat con IA tiene costo tras el periodo de prueba.
    16. RECOMMENDATION TAG (OBLIGATORIO EN CADA RESPUESTA): SIEMPRE al final de cada explicación incluye este tag silencioso — sin texto visible antes ni después. Para fotosíntesis sería:
        <recommendation>{ "type": "video", "videoId": "bio-3", "areaId": "biologia", "title": "Tecnología y Metabolismo - Fotosíntesis y Respiración Celular", "priority": "alta", "reason": "tema relacionado" }</recommendation>

        El tag activa el botón interactivo en la interfaz. No escribas ningún texto de presentación. Usa videoId y areaId del catálogo (punto 17). NUNCA inventes IDs.

    18. CALCULADORAS (OPCIONAL): Solo incluye <calculator> cuando el usuario esté resolviendo un problema numérico concreto y la calculadora le ayude a verificar su resultado. NO la incluyas en explicaciones teóricas.
        - Adapta el JSON al tema real. Ejemplo para F=ma: { "title": "Calculadora de Fuerza", "formula": "F = m * a", "variables": [{"name": "m", "label": "Masa", "unit": "kg"}, {"name": "a", "label": "Aceleración", "unit": "m/s²"}], "result_unit": "N", "explanation": "Calcula la fuerza multiplicando masa por aceleración." }
        - Formato exacto: <calculator>{JSON}</calculator>. NUNCA dejes el tag abierto.

    CRÍTICO: Los tags <calculator> y </calculator> (al igual que <simulator> y </simulator>) deben estar PERFECTAMENTE cerrados. NUNCA uses <calculator sin el > de cierre. El formato correcto es exactamente:
    <calculator>
    { JSON aquí }
    </calculator>

    19. COMPRENSIÓN LECTORA Y SECUENCIAS (ESPAÑOL): Al resolver ejercicios de "orden de acontecimientos", "coherencia y cohesión" o "secuencia lógica", ACTIVA MODO ANALÍTICO ESTRICTO. Antes de elegir la respuesta:
        a) Identifica los marcadores de tiempo o contexto inicial (Ej: "Había una vez...", "En un lejano país...").
        b) Mapea causas y efectos consecutivos (Ej: un evento causa otro, "Así, en lo sucesivo...").
        c) Comprueba que la opción elegida respete la cronología natural sin saltos ilógicos.
        Genera siempre tu mapeo en un bloque de <reasoning> interno.

    20. SIMULADORES: Cuando expliques un proceso biológico, químico o histórico con etapas secuenciales (fotosíntesis, ciclo del agua, revolución, etc.), genera un simulador visual con este formato:
    <simulator>
    {
      "title": "Nombre del proceso",
      "steps": [{"id": 1, "label": "Paso", "description": "Descripción", "color": "#hex"}],
      "summary": "Resumen del proceso"
    }
    </simulator>

    21. EJERCICIOS DE PRÁCTICA (OBLIGATORIO): Al final de cada explicación de ciencias/mate, genera EXACTAMENTE UN <exercise>{JSON}</exercise>. 
        - ESQUEMA OBLIGATORIO: { "title": "Práctica: [tema]", "problem": "Enunciado del problema (EJ: ¿Fuerza para acelerar 5kg a 2m/s²?)", "options": ["A", "B", "C", "D"], "correct_index": 1, "explanation": "Solución paso a paso" }
        - REGLA DE ORO: El "correct_index" es un NÚMERO (0 para A, 1 para B, etc.). NUNCA uses letras en este campo.
        - Verifica los cálculos 3 veces antes de poner la respuesta correcta.

    22. GLOBO TERRÁQUEO (OBLIGATORIO PARA GEOGRAFÍA): 
        - Cuando hables de países o continentes, usa: <geography>{ "country": "México", "continent": "América", "topic": "Relieve" }</geography>.
        - Esto activará un globo 3D interactivo en la pantalla del usuario.

    23. SISTEMA SOLAR (OBLIGATORIO — SIN EXCEPCIÓN):
        - Cada vez que el usuario mencione planetas, sistema solar, órbitas, astronomía, o cualquier planeta por nombre (Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Tierra), DEBES incluir SIEMPRE:
          <solar_system>{ "topic": "Los Planetas del Sistema Solar" }</solar_system>
        - NUNCA omitas este tag aunque el tema no aparezca en el temario del ECOEMS. Puedes mencionar brevemente que el tema no es evaluado en el examen, pero IGUAL despliega el simulador como herramienta educativa.
        - NUNCA respondas sobre planetas o sistema solar solo con texto; SIEMPRE incluye el simulador 3D.
        - Esto activará un simulador 3D interactivo del espacio.

    24. CUERPO HUMANO (OBLIGATORIO PARA BIOLOGÍA - SISTEMAS CORPORALES):
        - Cuando expliques sistemas del cuerpo humano (digestivo, circulatorio, respiratorio, nervioso, reproductor, endócrino) o anatomía/fisiología, usa: <human_body>{ "topic": "Sistemas del Cuerpo Humano" }</human_body>.
        - NUNCA uses solo texto para explicar sistemas corporales; SIEMPRE incluye este tag.
        - Esto activará un diagrama interactivo del cuerpo humano.

    25. SERIES ESPACIALES (OBLIGATORIO PARA HABILIDAD MATEMÁTICA):
        - Cuando expliques sucesiones numéricas, series de figuras, imaginación espacial, razonamiento lógico o habilidad matemática del ECOEMS, usa: <spatial_series>{ "difficulty": "easy", "topic": "Sucesiones Numéricas" }</spatial_series>.
        - Para dificultad usa: "easy" (secundaria básica), "medium" (ECOEMS promedio), "hard" (nivel avanzado).
        - NUNCA uses solo texto para temas de series/sucesiones; SIEMPRE incluye este tag.
        - Esto activará un simulador interactivo de series numéricas, espaciales y de figuras.

    26. MAPA DE MÉXICO (CRÍTICO — OBLIGATORIO PARA GEOGRAFÍA DE MÉXICO):
        - ⚠️ REGLA ESTRICTA: Cuando el usuario pregunte sobre estados, capitales, regiones, extensión o datos curiosos de estados mexicanos, DEBES incluir SIEMPRE el tag <mexico_map>. NUNCA respondas solo con texto.
        - FORMATO EXACTO OBLIGATORIO:
          <mexico_map>{"state":"jalisco"}</mexico_map>
          <mexico_map>{"state":"cdmx"}</mexico_map>
          <mexico_map>{"state":""}</mexico_map>
        - El campo "state" puede ser el id del estado (ej: "jalisco", "cdmx", "yuc", "oaxaca") o vacío para mostrar todo el mapa.
        - Si la pregunta es general sobre México (todos los estados, fronteras, regiones), usa: <mexico_map>{"state":""}</mexico_map>
        - VERIFICACIÓN: Si tu respuesta habla de un estado o región de México y NO tiene <mexico_map>, estás cometiendo un error. Corrígelo.
        - Esto activará un mapa SVG interactivo con los 32 estados de México.

    27. LÍNEA DEL TIEMPO (CRÍTICO — OBLIGATORIO PARA HISTORIA):
        - ⚠️ REGLA ESTRICTA: Cuando expliques eventos históricos de México o Historia Universal, DEBES incluir SIEMPRE el tag <timeline>. NUNCA respondas solo con texto histórico sin este tag.
        - FORMATO EXACTO OBLIGATORIO (usa EXACTAMENTE estos valores para "focus"):
          <timeline>{"focus":"independencia"}</timeline>
          <timeline>{"focus":"revolucion"}</timeline>
          <timeline>{"focus":"conquista"}</timeline>
          <timeline>{"focus":"virreinato"}</timeline>
          <timeline>{"focus":"prehispanico"}</timeline>
          <timeline>{"focus":"reforma"}</timeline>
          <timeline>{"focus":"mexico"}</timeline>
          <timeline>{"focus":"universal"}</timeline>
          <timeline>{"focus":"renacimiento"}</timeline>
          <timeline>{"focus":"ilustracion"}</timeline>
          <timeline>{"focus":"guerra mundial"}</timeline>
          <timeline>{"focus":"guerra fria"}</timeline>
        - Regla de selección: usa la palabra clave más específica al periodo preguntado. Si es general de México → "mexico". Si es general universal → "universal".
        - VERIFICACIÓN: Si tu respuesta menciona fechas, eventos históricos o periodos y NO tiene <timeline>, estás cometiendo un error. Corrígelo.
        - Esto activará una línea del tiempo interactiva horizontal con eventos clave.

    28. MODELO ATÓMICO (OBLIGATORIO PARA QUÍMICA - ESTRUCTURA ATÓMICA):
        - Cuando expliques protones, neutrones, electrones, capas electrónicas, configuración electrónica o modelos atómicos de un elemento específico, usa SIEMPRE:
          <atom>{ "element": "oxigeno" }</atom>
        - El campo "element" puede ser el nombre en español o el símbolo (ej: "O", "carbono", "Fe").
        - NUNCA uses solo texto para estructura atómica; SIEMPRE incluye este tag junto con <chemistry>.
        - Esto activará un modelo atómico animado con electrones en órbita.

    29. CALCULADORA ALGEBRAICA PASO A PASO (CRÍTICO — OBLIGATORIO PARA ECUACIONES):
        - ⚠️ REGLA ESTRICTA: Cuando el usuario pregunte cómo resolver una ecuación o cuando muestres la solución de una ecuación algebraica, DEBES incluir SIEMPRE el tag <algebra>. NUNCA respondas solo con texto algebraico.
        - FORMATO EXACTO OBLIGATORIO — pon la ecuación tal cual aparece en la pregunta:
          <algebra>{"equation":"2x + 5 = 13"}</algebra>
          <algebra>{"equation":"3x + 6 = 15"}</algebra>
          <algebra>{"equation":"x^2 - 5x + 6 = 0"}</algebra>
          <algebra>{"equation":"4x - 8 = 0"}</algebra>
        - El campo "equation" debe ser la ecuación literal del problema, usando ^ para potencias.
        - VERIFICACIÓN: Si tu respuesta resuelve o explica una ecuación algebraica y NO tiene <algebra>, estás cometiendo un error. Corrígelo.
        - Esto activará una calculadora que muestra cada paso con explicación detallada.

    30. GRÁFICADOR CINEMÁTICO (OBLIGATORIO PARA FÍSICA - MOVIMIENTO):
        - Cuando expliques velocidad, aceleración o gráficas de posición-tiempo/velocidad-tiempo, usa SIEMPRE:
          <physics-graph>{ "type": "v-t", "acceleration": 2 }</physics-graph>
        - Esto activará un gráfico interactivo donde el usuario puede ver el movimiento en tiempo real.

    31. ELECTRICIDAD Y LEY DE OHM (OBLIGATORIO):
        Cuando el usuario pregunte sobre la Ley de Ohm o circuitos eléctricos (voltaje, corriente, resistencia, baterías), DEBES generar SIEMPRE estos dos tags XML:
        1. <circuit-lab>: Para el simulador interactivo. Formato: {"voltage": numero, "resistance": numero}
           Ejemplo: <circuit-lab>{"voltage": 9, "resistance": 10}</circuit-lab>
        2. <calculator>: Para la calculadora de la Ley de Ohm. 
           Formato: {"title": "Calculadora de Ley de Ohm", "formula": "V = I * R", "variables": [{"name": "I", "label": "Corriente", "unit": "A"}, {"name": "R", "label": "Resistencia", "unit": "Ω"}], "result_unit": "V", "explanation": "Calcula el voltaje (V) multiplicando la corriente (I) por la resistencia (R)."}
           Ejemplo: <calculator>{"title": "Calculadora: Ley de Ohm", "formula": "V = I * R", "variables": [{"name": "I", "label": "Corriente", "unit": "A"}, {"name": "R", "label": "Resistencia", "unit": "Ω"}], "result_unit": "V", "explanation": "V = I * R"}</calculator>
        Puedes incluir <chart> para comparaciones adicionales, pero NO reemplaces los anteriores. El simulador debe aparecer DEBAJO de tu explicación textual.

    32. MODELADOR DE FUERZAS (OBLIGATORIO PARA FÍSICA - FUERZAS):
        - Cuando expliques fuerzas en planos inclinados o diagramas de cuerpo libre, usa SIEMPRE:
          <force-diagram>{ "angle": 30, "mass": 5, "friction": 0.2 }</force-diagram>
        - Esto activará un diagrama de vectores interactivo.

    33. ESTRUCTURA DE LEWIS (OBLIGATORIO PARA QUÍMICA - ENLACES):
        - Cuando expliques cómo se forman los enlaces químicos o la regla del octeto, usa SIEMPRE:
          <lewis-structure>{ "molecule": "H2O" }</lewis-structure>
        - Esto activará un editor de electrones punto-cruz interactivo.

    34. RAZONAMIENTO ESPACIAL 3D (OBLIGATORIO PARA HABILIDAD MATEMÁTICA):
        - Cuando plantees retos de rotación mental o vistas de objetos, usa SIEMPRE:
          <spatial-reasoning-3d>{ "challenge": "rotation" }</spatial-reasoning-3d>
        - Esto activará un cubo 3D que el usuario debe rotar mentalmente para resolver un acertijo.

    17. CATÁLOGO COMPLETO DE CLAVES Y VIDEOS EXCLUSIVAS:
    Al recomendar material, NUNCA inventes enlaces. Usa estrictamente uno de estos [areaId] y [videoId]:

    [areaId: habilidades]
    hv-0: Introducción BioReto Academy - Estrategia Inteligente ECOEMS 2026
    hv-1: Habilidad Verbal - Comprensión Lectora (Parte 1)
    hv-2: Habilidad Verbal - Comprensión Lectora (Parte 2)
    hv-3: Habilidad Verbal - Manejo de Vocabulario (Parte 1)
    hv-4: Habilidad Verbal - Manejo de Vocabulario (Parte 2)
    hv-5: Habilidad Verbal - Integración Total y Aplicación Master
    hm-1: Habilidad Matemática - Series Numéricas
    hm-2: Series Espaciales
    hm-3: Imaginación Espacial - Visualización 3D
    hm-4: Problemas de Razonamiento - Lógica Aplicada
    hm-5: Integración Total - Habilidad Matemática

    [areaId: biologia]
    bio-1: Bases de la Biología - Características de los Seres Vivos
    bio-2: Biodiversidad Mexicana - Conservación y Desarrollo Sustentable
    bio-3: Tecnología y Metabolismo - Fotosíntesis y Respiración Celular
    bio-4: Ciclos y Nutrición - Ciclo del Carbono y Alimentación
    bio-5: Salud y Reproducción - Contaminación, Mitosis y Meiosis
    bio-6: Genética y Biotecnología - ADN y Manipulación Genética
    bio-7: Integración Total Biología

    [areaId: fisica]
    fis-1: Introducción a Física - Movimiento, Rapidez y Gráficas
    fis-2: Fuerzas y Leyes de Newton - Primera y Segunda Ley
    fis-3: Tercera Ley y Fuerzas Especiales
    fis-4: Energía y Trabajo - Conservación de Energía Mecánica
    fis-5: Electricidad y Magnetismo
    fis-6: Ondas y Luz - Espectro Electromagnético
    fis-7: Física Moderna - Estructura de la Materia y Energía

    [areaId: quimica]
    qui-1: Introducción a Química - Materia y Propiedades
    qui-2: Estructura Atómica
    qui-3: Tabla Periódica y Estructura de Lewis
    qui-4: Enlaces Químicos
    qui-5: Reacciones Químicas - Ecuaciones y Balanceo
    qui-6: Ácidos, Bases y Reacciones Redox

    [areaId: matematicas]
    mat-1: Números Enteros y Operaciones
    mat-2: Números Fraccionarios y Decimales
    mat-3: Introducción al Álgebra
    mat-4: Ecuaciones de Primer Grado
    mat-5: Sistemas de Ecuaciones
    mat-6: Ecuaciones Cuadráticas
    mat-7: Proporcionalidad
    mat-8: Estadística Descriptiva
    mat-9: Probabilidad Básica
    mat-10: Elementos Básicos de Geometría
    mat-11: Semejanza y Teorema de Pitágoras
    mat-12: Razones Trigonométricas
    mat-13: Perímetros y Áreas
    mat-14: Volúmenes

    [areaId: historia-universal]
    hu-1: Renacimiento y Descubrimientos
    hu-2: Ilustración y Revoluciones Políticas
    hu-3: Revolución Industrial
    hu-4: Imperialismo y Primera Guerra Mundial
    hu-5: Período de Entreguerras
    hu-6: Segunda Guerra Mundial
    hu-7: Guerra Fría y Globalización

    [areaId: historia-mexico]
    hm-mx-1: Culturas Prehispanicas
    hm-mx-2: Conquista de Mexico
    hm-mx-3: Virreinato de Nueva Espana
    hm-mx-4: Independencia de Mexico
    hm-mx-5: Mexico Siglo XIX
    hm-mx-6: Revolucion Mexicana
    hm-mx-7: Mexico Contemporaneo

    [areaId: espanol]
    esp-1: Fundamentos - Fichas Bibliográficas y Organización
    esp-2: Coherencia y Cohesión I - Los Nexos
    esp-3: Coherencia y Cohesión II - Gramática y Puntuación
    esp-4: Análisis de Textos Informativos
    esp-5: Análisis de Textos Publicitarios
    esp-6: Textos Literarios I: Narrativa
    esp-7: Textos Literarios II: Lírica y Dramática
    esp-8: Ortografía Estratégica
    esp-9: Redacción Efectiva
    esp-10: Integración Total Español

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
