import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

// ─── Upstash Redis helpers (REST API, no package needed) ───────
// These env vars are automatically set when you connect an Upstash Redis
// integration from the Vercel dashboard (Integrations → Marketplace → Redis).
const UPSTASH_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN  || process.env.UPSTASH_REDIS_REST_TOKEN;

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
  return `chat:${cacheType}:` + text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[¿?¡!.,;:"""''()\[\]{}]/g, '')
    .slice(0, 200); // max 200 chars for key
}

function isComplexQuery(question: string): boolean {
  const complexIndicators = [
    /calcula/i, /resuelve/i, /desarrolla/i, /demuestra/i,
    /paso a paso/i, /procedimiento/i, /fórmula/i,
    /ejercicio/i, /problema/i, /ecuación/i,
    /compar[a|e]/i, /analiza/i, /justifica/i,
    /sistema de ecuaciones/i, /derivada/i, /integral/i,
    /probabilidad/i, /estadística/i, /trigonometría/i
  ];
  const isLong = question.length > 80;
  const hasComplexIndicator = complexIndicators.some(pattern => pattern.test(question));
  return isLong || hasComplexIndicator;
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
  
  const isComplex = isComplexQuery(message);
  return { shouldCache: true, cacheType: isComplex ? 'complex' : 'simple' };
}

// ─── Main handler ─────────────────────────────────────────────
export default async function handler(req: Request) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API Key de Anthropic no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const APP_URL = process.env.APP_URL || 'https://cyberedu-mx.vercel.app';
  const allowedOrigins = [
    'https://cyberedumx.lovable.app',
    APP_URL,
    'http://localhost:5173'
  ];
  const origin = req.headers.get('origin');
  const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

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
  const userId = getUserIdFromToken(authHeader);
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!userId || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Sesión inválida o configuración faltante' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const today = new Date().toISOString().split('T')[0];

  // 1. Fetch profile for access check
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileErr || !profile) {
    return new Response(JSON.stringify({ error: 'Perfil no encontrado' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Determine access
  let allowed = false;
  let reason = 'no_tokens';
  let consumptionType: 'token' | 'trial' | 'daily_free' | null = null;

  // Rule A: If tokens > 0, always allowed (gasta 1 token)
  if ((profile.tokens || 0) > 0) {
    allowed = true;
    consumptionType = 'token';
  } 
  // Rule B: Trial period (Days 1-7, 5 questions/day)
  else {
    const trialStartedAt = profile.trial_started_at ? new Date(profile.trial_started_at) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - trialStartedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Reset daily count if day changed
    let dailyCount = profile.daily_questions_count || 0;
    const lastDailyFree = profile.last_daily_free;
    if (lastDailyFree !== today) {
       dailyCount = 0;
    }

    if (diffDays <= 7 && dailyCount < 5) {
      allowed = true;
      reason = 'trial';
      consumptionType = 'trial';
    } 
    // Rule C: Registered (Day 8+, 1 question/day)
    else if (lastDailyFree !== today) {
      allowed = true;
      reason = 'daily_free';
      consumptionType = 'daily_free';
    }
  }

  if (!allowed) {
    return new Response(JSON.stringify({ 
      error: 'Has alcanzado el límite gratuito. ¡Compra tokens para seguir chateando!',
      isAccessDenied: true,
      reason
    }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 2. Consume resource
  const updates: any = {
    last_daily_free: today,
    daily_questions_count: (profile.last_daily_free === today ? (profile.daily_questions_count || 0) : 0) + 1,
    updated_at: new Date().toISOString()
  };

  if (consumptionType === 'token') {
    updates.tokens = Math.max(0, (profile.tokens || 1) - 1);
  }

  await supabase.from('profiles').update(updates).eq('id', userId);

  try {
    const { messages, context, memory } = await req.json();

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

    const SYSTEM_PROMPT = `Eres CyberAgent, el mentor académico experto de CyberEdu MX especializado en el examen ECOEMS 2026.
    
    CAPACIDADES Y REGLAS:
    1. CRÍTICO: Al generar diagramas Mermaid NUNCA uses acentos, ñ, signos de interrogación, exclamación, paréntesis ni dos puntos dentro de los nodos. Usa SOLO letras sin acento, números, espacios y guiones. Esta regla es OBLIGATORIA sin excepciones para compatibilidad con Mermaid v11.
    2. PERSONALIDAD: Profesional, motivador y directo (español mexicano).
    3. CITACIÓN: Cita siempre el temario oficial [MATERIA X.Y] (Ej: [MAT 4.2]).
    4. DIAGRAMAS: Para temas complejos, genera diagramas Mermaid usando \`\`\`mermaid\`\`\` con 'flowchart TD' o 'flowchart LR'.
    5. QUIZ: Genera retos interactivos encapsulados en <quiz>{JSON}</quiz> siguiendo el esquema: { "title": "...", "questions": [{ "text": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }] }.
    6. IMÁGENES: Usa [IMG:clave] para apoyo visual.
    7. GRÁFICAS: Cuando generes una gráfica SIEMPRE usa este formato exacto con etiquetas XML — nunca uses bloques de código markdown:
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
    NUNCA uses bloques de código markdown para gráficas. SIEMPRE usa las etiquetas <chart> con JSON válido adentro sin acentos en las keys.
    8. RAZONAMIENTO: Incluye un breve bloque <reasoning>{JSON}</reasoning> antes de respuestas complejas.
    9. PLANES: Usa <plan>{JSON}</plan> para proponer rutas de estudio.
    10. FUERA DEL TEMARIO: Si preguntan algo ajeno al ECOEMS 2026, responde brevemente (2-3 líneas) de forma útil y amigable (como un cuate inteligente que sabe de todo) y agrega SIEMPRE: '💡 Dato extra para ti. Recuerda que esto no viene en el temario ECOEMS 2026 — no pierdas tiempo en ello ahora. ¿Quieres que te explique algún tema del examen o hacemos un quiz? 🎯'. NUNCA rechaces una pregunta.
    11. TABLAS: Cuando generes tablas en markdown, limítalas a máximo 3 columnas y usa textos cortos en cada celda — los usuarios acceden desde celular y las tablas anchas no se ven bien.
    12. DISEÑO MÓVIL: Cuando generes diagramas Mermaid, prefiere el formato vertical (TD) y evita que sean demasiado anchos para que no se salgan de la pantalla en celulares.
    13. RECOMENDACIONES Y MATERIAL GRATUITO (OBLIGATORIO): Al final de CADA explicación de un tema, incluye SIEMPRE esta sección de material completo. Adapta los links con el areaId y videoId correctos (usa areas.ts):
        
        📚 **Material completo en CyberEdu MX — GRATIS** 
        🎬 **Ver video:** ${APP_URL}/area/[areaId]?video=[videoId]

        Debajo del video encontrarás:
        🎯 Desafío IA — NotebookLM
        🎴 Flashcards interactivas
        📝 Quiz original del tema
        🧠 Asistencia IA
        🖼️ Infografía descargable
        📄 Documento técnico PDF
        🎙️ Podcast de repaso
        📘 Guía de estudio intensiva
        🚀 Entrenamiento Studio
        
        Todo completamente GRATIS con registro.

    14. CALLS TO ACTION SEGÚN USUARIO (REVISA EL CONTEXTO): 
    - Si !context.isRegistered:
      💡 **¿Quieres acceder a todo este material?**
      ✅ Regístrate GRATIS en ${APP_URL}
      ✅ 7 días de acceso completo al Tutor IA incluidos
      ✅ Sin tarjeta de crédito
    - Si context.isRegistered && !context.isSubscriber:
      💡 **¿Quieres seguir chateando con el Tutor IA?**
      ✅ Plan Mensual desde $50 pesos/mes
      ✅ Todo el contenido multimedia siempre GRATIS
      🔗 Ver planes: ${APP_URL}/subscription

    15. IMPORTANTE: El contenido multimedia (biología, física, matemáticas, etc.) es SIEMPRE gratuito y nunca se bloquea. Solo el chat con IA tiene costo tras el periodo de prueba.
    
    16. LINKS DIRECTOS (INTERNAL TAGS): Después de los textos anteriores, incluye los tags JSON para que la interfaz los renderice:
        - <recommendation>{ "type": "video", "videoId": "ID_DEL_VIDEO", "title": "Nombre del Video", "priority": "alta", "reason": "Ver explicación en video" }</recommendation>
        Note: El videoId debe ser el ID interno (ej: 'bio-1', 'hv-3', 'mat-5'). NUNCA inventes IDs.

    ${memory ? `## MEMORIA: ${JSON.stringify(memory)}` : ''}
    ${context ? `## CONTEXTO: ${JSON.stringify(context)}` : ''}`;


    const frontendSystemMsg = (messages || []).find((m: any) => m.role === 'system')?.content;
    const finalSystemPromptText = frontendSystemMsg || SYSTEM_PROMPT;
    const finalSystemPrompt = [
      {
        type: "text",
        text: finalSystemPromptText,
        cache_control: { type: "ephemeral" }
      }
    ];

    const cleanMessages = (messages || []).filter(
      (m: any) => m.role === 'user' || m.role === 'assistant'
    );

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 4096,
        system: finalSystemPrompt,
        messages: cleanMessages,
        stream: true,
      }),
    });

    if (!apiResponse.ok) {
       const err = await apiResponse.text();
       return new Response(JSON.stringify({ error: err }), { 
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
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (!data || data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
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
                  if (shouldCache && fullResponseText.length > 50) {
                    const ttl = cacheType === 'complex' ? 604800 : 86400;
                    await cacheSet(cacheKey, fullResponseText, ttl).catch(() => {});
                  }
                  await saveDailyCost();
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                }
              } catch (e) { /* silent chunk error */ }
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
