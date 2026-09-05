export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  // @ts-ignore
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  // @ts-ignore
  const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  // @ts-ignore
  const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  // @ts-ignore
  const APP_URL = process.env.APP_URL || 'https://cyberedu-mx.vercel.app';

  const allowedOrigins = [
    'https://cyberedumx.com',
    'https://www.cyberedumx.com',
    APP_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  const origin = req.headers.get('origin');
  const corsOrigin = !origin
    ? 'https://cyberedumx.com'
    : allowedOrigins.includes(origin)
    ? origin
    : 'https://cyberedumx.com';

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  let titulo: string, materia: string;
  try {
    const body = await req.json();
    titulo = String(body.titulo ?? '').trim();
    materia = String(body.materia ?? '').trim();
    if (!titulo || !materia) throw new Error('missing fields');
  } catch {
    return new Response(JSON.stringify({ error: 'titulo y materia son requeridos' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const cacheKey = `vc2:${materia}:${titulo}`.toLowerCase().slice(0, 220);

  // ── Cache read (Upstash) ────────────────────────────────────────
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(cacheKey)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (r.ok) {
        const d = (await r.json()) as { result: unknown };
        if (d.result) {
          let cached: string;
          if (typeof d.result === 'string') {
            // Unwrap if previously stored as double-encoded JSON or array string
            try {
              const inner = JSON.parse(d.result);
              cached = typeof inner === 'string' ? inner
                : Array.isArray(inner) ? String(inner[0])
                : d.result;
            } catch {
              cached = d.result;
            }
          } else if (Array.isArray(d.result)) {
            cached = String(d.result[0]);
          } else {
            cached = String(d.result);
          }
          if (cached) {
            return new Response(JSON.stringify({ content: cached, cached: true }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }
    } catch { /* no cache — continue */ }
  }

  if (!DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: 'DeepSeek no configurado en el servidor' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── DeepSeek call ───────────────────────────────────────────────
  const prompt =
    `Eres un profesor experto en el ECOEMS 2027. ` +
    `Explica el tema "${titulo}" de la materia "${materia}" en 2-3 párrafos claros ` +
    `para un estudiante de secundaria. ` +
    `Incluye un ejemplo práctico del tipo que aparece en el examen ECOEMS. ` +
    `Responde solo en español, sin markdown. ` +
    `Termina siempre con una oración completa. No dejes oraciones a medias.`;

  const dsRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.7,
    }),
  });

  if (!dsRes.ok) {
    const detail = await dsRes.text().catch(() => '');
    return new Response(
      JSON.stringify({ error: `DeepSeek error ${dsRes.status}`, detail }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const dsData = (await dsRes.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = dsData.choices?.[0]?.message?.content?.trim() ?? '';

  // ── Cache write (7 days) ────────────────────────────────────────
  if (UPSTASH_URL && UPSTASH_TOKEN && content) {
    fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([['SET', cacheKey, content, 'EX', '604800']]),
    }).catch(() => {});
  }

  return new Response(JSON.stringify({ content }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
