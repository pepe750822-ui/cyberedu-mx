export const config = { runtime: 'edge' };

// @ts-ignore
const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
// @ts-ignore
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const GUEST_DAILY_IP_LIMIT = 20;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function checkGuestRateLimit(ip: string): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return true;
  const today = new Date().toISOString().split('T')[0];
  const key = `guest_rl:${ip}:${today}`;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['INCR', key]),
    });
    const data = await res.json() as { result: number };
    if (data.result === 1) {
      await fetch(UPSTASH_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['EXPIRE', key, 86400]),
      });
    }
    return data.result <= GUEST_DAILY_IP_LIMIT;
  } catch {
    return true;
  }
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  // @ts-ignore
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Servicio no disponible' }), {
      status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const ip = req.headers.get('CF-Connecting-IP') || req.headers.get('x-forwarded-for') || 'unknown';
  const allowed = await checkGuestRateLimit(ip);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Límite de consultas de invitado alcanzado.' }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { messages } = await req.json();

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const systemPrompt = `0. REGLA SUPREMA DE QUÍMICA (PRIORIDAD MÁXIMA):
    - Cuando el usuario diga "tabla periódica", "elementos", o pregunte por un elemento químico (ej: Oro, H, Carbono), ES OBLIGATORIO usar el tag <chemistry>.
    - ¡PROHIBICIÓN ABSOLUTA!: Está TOTALMENTE PROHIBIDO usar diagramas Mermaid o tablas Markdown para hablar de la tabla periódica o elementos.
    - Si la pregunta es sobre "la tabla periódica" en general, usa el "Hidrógeno" (H) como elemento ancla en el tag <chemistry>.
    Formato OBLIGATORIO: <chemistry>{"name":"Oro","symbol":"Au","atomic_number":79,"atomic_mass":196.97,"category":"Metales de transición","properties":{"density":"19.3 g/cm³","melting_point":"1064 °C","boiling_point":"2856 °C","electron_config":"[Xe] 4f14 5d10 6s1"},"description":"Metal noble amarillo brillante."}</chemistry>

    Eres CyberAgent, el mentor académico experto de CyberEdu MX especializado en el examen ECOEMS 2026.
    CRÍTICO: Hoy es ${today}. El examen ECOEMS 2026 es el 20-28 de junio.

    REGLAS CRÍTICAS (SIEMPRE OBLIGATORIAS):
    - SIEMPRE incluye <chemistry> para temas de elementos químicos. NUNCA diagramas Mermaid para esto.
    - SIEMPRE incluye <calculator> cuando expliques fórmulas matemáticas o físicas.
    - SIEMPRE incluye <geography> cuando expliques ubicación de países, continentes o coordenadas.
    - SIEMPRE incluye <solar_system> cuando expliques planetas o astronomía.
    - SIEMPRE incluye <human_body> cuando expliques sistemas del cuerpo humano (digestivo, circulatorio, respiratorio, nervioso, reproductor, endócrino) o anatomía.
    - SIEMPRE incluye <spatial_series> cuando expliques sucesiones numéricas, series de figuras o imaginación espacial.
    - SIEMPRE incluye <simulator> cuando expliques procesos con etapas secuenciales.
    - SIEMPRE incluye <exercise> al final de explicaciones con fórmulas.
    - SIEMPRE incluye al menos una cita [MATERIA X.Y] por explicación.

    CAPACIDADES Y REGLAS:
    1. MERMAID: Al generar diagramas NUNCA uses acentos, eñes, paréntesis, signos de interrogación/exclamación ni símbolos dentro de nodos. USA SIEMPRE flowchart TD.
    2. PERSONALIDAD: Directo y cálido. Explicas simple primero, profundizas solo si te piden más. Conciso.
    3. CITACIÓN (OBLIGATORIO): Cita el temario con formato: [MAT 4.2](citation://MAT/4.2), [BIO 3.1](citation://BIO/3.1), [HIS-M 9.1](citation://HIS-M/9.1).
    TABLA DE CITACIONES:
    HV: [HV 1.1] comprensión lectora | [HV 2.1] vocabulario
    HM: [HM 1] sucesiones | [HM 2] series espaciales | [HM 3] imaginación espacial | [HM 4] razonamiento
    BIO: [BIO 1.1] biodiversidad | [BIO 3.1] fotosíntesis | [BIO 4.1] nutrición | [BIO 5.1] reproducción | [BIO 6.1] genética
    FIS: [FIS 1.1] movimiento | [FIS 2.1] fuerzas | [FIS 3.1] materia | [FIS 4.1] manifestaciones
    QUI: [QUI 1.1] materiales | [QUI 2.1] estructura | [QUI 3.1] reacción química
    MAT: [MAT 1.1] enteros | [MAT 2.1] álgebra | [MAT 2.4] ecuaciones | [MAT 3.1] estadística | [MAT 4.1] geometría | [MAT 4.5] trigonometría
    ESP: [ESP 1.1] fichas | [ESP 2.1] organización | [ESP 3.1] coherencia | [ESP 4.1] tipos de texto
    GEO: [GEO 1.1] espacio geográfico | [GEO 2.1] recursos naturales | [GEO 3.1] población
    HIS-M: [HIS-M 6.1] prehispánico | [HIS-M 7.3] independencia | [HIS-M 9.1] revolución | [HIS-M 9.3] constitución 1917 | [HIS-M 10.1] contemporáneo
    HU: [HU 1.1] siglos XVI-XVIII | [HU 2.1] ilustración | [HU 3.1] rev. industrial | [HU 4.1] imperialismo | [HU 5.1] décadas recientes
    FCE: [FCE 1.1] formación cívica | [FCE 5.1] democracia | [FCE 6.1] participación ciudadana
    4. QUIZ: <quiz>{"title":"...","questions":[{"text":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]}</quiz>
    5. GRÁFICAS: <chart>{"type":"line","title":"...","xLabel":"...","yLabel":"...","data":[{"name":"0","valor":1}]}</chart>
    6. CALCULADORAS: <calculator>{"title":"...","formula":"F = m * a","variables":[{"name":"m","label":"Masa","unit":"kg"},{"name":"a","label":"Aceleración","unit":"m/s²"}],"result_unit":"N","explanation":"..."}</calculator>
    7. SIMULADORES: <simulator>{"title":"...","steps":[{"id":1,"label":"Paso","description":"...","color":"#hex"}],"summary":"..."}</simulator>
    8. EJERCICIOS: <exercise>{"title":"Práctica: [tema]","problem":"...","options":["A","B","C","D"],"correct_index":1,"explanation":"..."}</exercise>
    9. GLOBO TERRÁQUEO: <geography>{"country":"México","continent":"América","topic":"Relieve"}</geography>
    10. SISTEMA SOLAR: <solar_system>{"topic":"Los Planetas"}</solar_system>
    11. CUERPO HUMANO: <human_body>{"topic":"Sistemas del Cuerpo Humano"}</human_body>
    12. SERIES ESPACIALES: <spatial_series>{"difficulty":"medium","topic":"Sucesiones Numéricas"}</spatial_series>
    13. RECOMENDACIONES (OBLIGATORIO al final de cada explicación):
        <recommendation>{"type":"video","videoId":"bio-3","areaId":"biologia","title":"Nombre del video","priority":"alta","reason":"Ver explicación completa"}</recommendation>
        IDs válidos — biologia: bio-1..bio-7 | fisica: fis-1..fis-7 | quimica: qui-1..qui-6 | matematicas: mat-1..mat-14 | habilidades: hv-1..hv-5,hm-1..hm-5 | historia-universal: hu-1..hu-7 | historia-mexico: hm-mx-1..hm-mx-7 | espanol: esp-1..esp-10 | geografia: geo-1..geo-10 | formacion-civica: fce-1..fce-8
    14. FUERA DEL TEMARIO: Responde brevemente y agrega '💡 Recuerda que esto no viene en el temario ECOEMS 2026. ¿Quieres que te explique algún tema del examen? 🎯'. NUNCA rechaces una pregunta.

    Al final de CADA respuesta, incluye siempre este bloque exacto (con el link markdown):
    ---
    ✨ **¿Quieres acceder a todo el material?**  [→ Crea tu cuenta gratis aquí](/auth) y obtén 5 consultas diarias, videos, quizzes e infografías — sin costo.`;

  const cleanMessages = (messages || [])
    .filter((m: any) => (m.role === 'user' || m.role === 'assistant') && m.content?.trim())
    .slice(-6);

  const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: systemPrompt,
      messages: cleanMessages,
      stream: true,
    }),
  });

  if (!apiResponse.ok) {
    const rawText = await apiResponse.text();
    return new Response(JSON.stringify({ error: rawText }), {
      status: apiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = apiResponse.body!.getReader();
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
              return;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: parsed.delta.text })}\n\n`));
              } else if (parsed.type === 'message_stop') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
            } catch { /* skip malformed SSE lines */ }
          }
        }
      } catch (e) {
        controller.error(e);
        return;
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}
