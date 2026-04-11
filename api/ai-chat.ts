import { createClient } from '@supabase/supabase-js';
// Removed resend SDK to use raw fetch for better Edge compatibility

export const config = {
  runtime: 'edge',
};

// ─── Upstash Redis helpers (REST API, no package needed) ───────
// These env vars are automatically set when you connect an Upstash Redis
// integration from the Vercel dashboard (Integrations → Marketplace → Redis).
// @ts-ignore
const UPSTASH_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
// @ts-ignore
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN  || process.env.UPSTASH_REDIS_REST_TOKEN;
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

// ─── Redis Rate Limiting (Safety Layer) ───────────────────────
async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return { allowed: true, remaining: 999 };
  
  const today = new Date().toISOString().split('T')[0];
  const rateLimitKey = `ratelimit:${userId}:${today}`;
  const LIMIT = 50;

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

// @ts-ignore
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
// @ts-ignore
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// @ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!userId || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Sesión inválida o configuración faltante' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const today = new Date().toISOString().split('T')[0];

  // 1. Fetch profile and check rate limit
  const [profileResult, rateLimit] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    checkRateLimit(userId)
  ]);

  const { data: profile, error: profileErr } = profileResult;

  if (profileErr || !profile) {
    return new Response(JSON.stringify({ error: 'Perfil no encontrado' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Safety check: Global Daily Limit (Redis)
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ 
      error: '⚠️ Límite de seguridad diario excedido (50 consultas). Por favor contacta a soporte si crees que es un error.',
      isAccessDenied: true,
      reason: 'global_rate_limit'
    }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 2. Determine access & Consume resource
  const todayInMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
  const tzDate = new Date(todayInMexico);
  const localToday = tzDate.getFullYear() + "-" + String(tzDate.getMonth() + 1).padStart(2, '0') + "-" + String(tzDate.getDate()).padStart(2, '0');

  // Rule 1: Subscriber -> pasa sin límite
  if (profile.subscription_status === 'active' || profile.is_premium === true) {
    // No consume tokens ni límite diario
  }
  // Rule 2: hasTokens -> descuenta 1 token y pasa
  else if ((profile.tokens || 0) > 0) {
    await supabase.from('profiles').update({ 
      tokens: Math.max(0, profile.tokens - 1),
      updated_at: new Date().toISOString()
    }).eq('id', userId);
  } 
  // Rule 3: Límite diario (5 max)
  else {
    const { data: usageData } = await supabase
      .from('daily_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('date', localToday)
      .single();

    const currentCount = usageData?.count || 0;
    const dailyLimit = 5;

    if (currentCount < dailyLimit) {
      await supabase.from('daily_usage').upsert({
        user_id: userId,
        date: localToday,
        count: currentCount + 1
      }, { onConflict: 'user_id, date' });
    } else {
      const msg = `Alcanzaste tus ${dailyLimit} preguntas gratuitas de hoy. Regresa mañana o consigue tokens para continuar ahora — desde $10 pesos.`;
        
      return new Response(JSON.stringify({ 
        error: msg,
        isAccessDenied: true, 
        reason: "daily_limit", 
        message: msg
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

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

    const SYSTEM_PROMPT = `${context ? `## CONTEXTO REAL (SITUACION ACTUAL): ${JSON.stringify(context)}` : ''}
    ${memory ? `## MEMORIA RECIENTE: ${JSON.stringify(memory)}` : ''}

    Eres CyberAgent, el mentor académico experto de CyberEdu MX especializado en el examen ECOEMS 2026.
    
    CRÍTICO: Hoy es ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Si te preguntan por la fecha o el presidente actual, usa esta fecha. (Ej: En abril 2026, Donald Trump ya es presidente).

    El examen ECOEMS 2026 es el 20-28 de junio. Cada sesión cuenta.

    CAPACIDADES Y REGLAS:
    1. CRÍTICO (REGLA DE ORO): Al generar diagramas Mermaid NUNCA uses acentos (á,é,í,ó,ú), eñes (ñ), signos de interrogación, exclamación, paréntesis, comas, dos puntos ni símbolos como &, #, %, $, @ dentro de los nodos o etiquetas. Usa SOLO letras de la A a la Z (sin acento), números, espacios y guiones. Ejemplo: En lugar de "Historia de México & Revolución", usa "Historia de Mexico y Revolucion". Esta regla es OBLIGATORIA para evitar errores de renderizado. NUNCA cierres un bloque de código mermaid de forma incorrecta.
    2. PERSONALIDAD: Directo y cálido, como un amigo que sabe mucho — no un libro de texto. Explicas simple primero, profundizas solo si te piden más. Nunca haces sentir tonto al estudiante. Conciso — dos líneas si bastan, no párrafos enormes. Honesto: si una pregunta tiene trampa, la señalas. A veces la mejor respuesta es una pregunta de regreso.
    3. CITACIÓN (OBLIGATORIO): Cita siempre el temario oficial usando el formato de enlace: [MATERIA X.Y](citation://MATERIA/X.Y). Ejemplo: [MAT 4.2](citation://MAT/4.2). NUNCA escribas solo el texto entre corchetes sin el enlace.
    4. DIAGRAMAS (REGLA DE ORO): Para temas complejos, genera diagramas Mermaid usando ```mermaid``` con 'flowchart TD' o 'flowchart LR'. NUNCA uses acentos (á,é,í,ó,ú), eñes (ñ), paréntesis (), signos de interrogación ¿?, exclamación ¡!, comas, dos puntos ni símbolos matemáticos dentro de los nodos. Usa SOLO letras A-Z, números y espacios. Ejemplo: En lugar de "Historia de México (Revolución)", usa "Historia de Mexico Revolucion".
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
    11. TABLAS: NUNCA uses tablas markdown para recomendar material o enlaces. Usa siempre listas.
    12. DISEÑO MÓVIL: Cuando generes diagramas Mermaid, prefiere el formato vertical (TD) y evita que sean demasiado anchos para que no se salgan de la pantalla en celulares.
    13. RECOMENDACIONES Y MATERIAL GRATUITO (OBLIGATORIO): Al final de CADA explicación técnica o teórica, incluye SIEMPRE la sección de material completo. 
        - REGLA DE ORO: El enlace al video DEBE ser un link de Markdown: [Ver video: Nombre](/area/[areaId]?video=[videoId])
        - REGLA DE CODIGOS: Tus citas internas DEBEN usar corchetes y códigos de materia CORTOS de hasta 15 letras, ej: [HIS-M 8.2], [HU 7.1], [FCE 3.2]. NUNCA uses nombres de materia largos como [HISTORIA 8.2] para evitar errores de enlace.
        
        📚 **Material completo en CyberEdu MX — GRATIS** 
        - [Ver video: [Nombre del Video]](/area/[areaId]?video=[videoId])

        Debajo del video en la plataforma encontrarás:
        - 🎯 Desafío IA — NotebookLM
        - 🎴 Flashcards interactivas
        - 📝 Quiz original del tema
        - 🧠 Asistencia IA
        - 🚀 Entrenamiento Studio
        
        Todo completamente GRATIS con registro.

        IMPORTANTE: Después de este texto, incluye siempre el tag <recommendation> para generar el botón interactivo.

    14. CALLS TO ACTION SEGÚN USUARIO (REVISA EL CONTEXTO): 
    - Si !context.isRegistered:
      💡 **¿Quieres acceder a todo este material?**
      ✅ Regístrate GRATIS en /
      ✅ 7 días de acceso completo al Tutor IA incluidos
      ✅ Sin tarjeta de crédito
    - Si context.isRegistered && !context.isSubscriber:
      💡 **¿Quieres seguir chateando con el Tutor IA?**
      ✅ Paquetes desde $10 pesos (10 tokens)
      ✅ Plan Maestro Ilimitado por $200/mes
      ✅ Todo el contenido multimedia siempre GRATIS
      🔗 Comprar tokens: /tokens

    15. IMPORTANTE: El contenido multimedia (biología, física, matemáticas, etc.) es SIEMPRE gratuito y nunca se bloquea. Solo el chat con IA tiene costo tras el periodo de prueba.
    
    16. LINKS DIRECTOS (INTERNAL TAGS): Inmediatamente después del texto de recomendación, incluye OBLIGATORIAMENTE este tag JSON para que la interfaz renderice el botón de navegación:
        <recommendation>{ "type": "video", "videoId": "ID_DEL_VIDEO", "areaId": "AREA_ID", "title": "Nombre del Video", "priority": "alta", "reason": "Ver video ahora" }</recommendation>
        Note: El videoId y areaId deben ser los del catálogo (punto 17). NUNCA inventes IDs. Si el tema es general, usa el video de introducción del área.

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
    hm-mx-1: Culturas Prehispánicas
    hm-mx-2: Conquista de México
    hm-mx-3: Virreinato de Nueva España
    hm-mx-4: Independencia de México
    hm-mx-5: México Siglo XIX
    hm-mx-6: Revolución Mexicana
    hm-mx-7: México Contemporáneo

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
