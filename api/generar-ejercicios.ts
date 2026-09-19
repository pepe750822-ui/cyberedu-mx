export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  // @ts-ignore
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  let preguntaOriginal: string;
  try {
    const body = await req.json();
    preguntaOriginal = String(body.pregunta ?? '').trim();
    if (!preguntaOriginal) throw new Error('missing pregunta');
  } catch {
    return new Response(JSON.stringify({ error: 'pregunta es requerida' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: 'DeepSeek no configurado en el servidor' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const prompt =
    `Eres un profesor de Matemáticas IV ENP UNAM.\n` +
    `Genera 2 ejercicios similares al siguiente para que el estudiante practique el mismo concepto:\n` +
    `${preguntaOriginal}\n` +
    `Solo escribe los ejercicios numerados con sus opciones A, B, C, D. Sin respuestas. En español.`;

  const dsRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-v4-flash',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
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

  return new Response(JSON.stringify({ ejercicios: content }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}