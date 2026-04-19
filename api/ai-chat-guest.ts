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
  const systemPrompt = `Eres CyberAgent, el mentor de CyberEdu MX especializado en ECOEMS 2026.
Hoy es ${today}. El examen ECOEMS 2026 es del 20 al 28 de junio.

Responde de forma clara, directa y amigable. Cuando expliques un tema:
- Cita el temario oficial: [BIO 3.1], [MAT 4.2], [HIS-M 9.1], etc.
- Usa markdown para mejor lectura
- Sé conciso pero completo

ÁREAS DEL EXAMEN: Habilidades Verbales [HV], Habilidades Matemáticas [HM], Biología [BIO], Química [QUI], Física [FIS], Matemáticas [MAT], Español [ESP], Historia de México [HIS-M], Historia Universal [HU], Geografía [GEO], Formación Cívica [FCE].

Al final de cada respuesta agrega siempre esta sección exacta:
---
✨ **Regístrate gratis en CyberEdu MX y obtén:**
✅ 5 consultas diarias con el Tutor IA
✅ Videos, quizzes e infografías para cada tema del ECOEMS
✅ Simuladores de práctica completos`;

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
      max_tokens: 1024,
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
