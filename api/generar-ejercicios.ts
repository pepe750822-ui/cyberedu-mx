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
    `Genera 2 ejercicios similares SIN incluir la respuesta correcta dentro de la pregunta ni de las opciones. Solo pregunta y opciones en esas líneas.\n` +
    `Genera exactamente 2 ejercicios similares al siguiente para que el estudiante practique el mismo concepto:\n` +
    `${preguntaOriginal}\n\n` +
    `Para cada ejercicio, proporciona la pregunta seguida de las opciones A, B, C, D en líneas separadas.\n` +
    `La línea "Respuesta correcta" va SIEMPRE al final de cada ejercicio, en su propia línea, y nunca debe mencionarse ni insinuarse dentro del texto de la pregunta o de las opciones.\n` +
    `Formato para cada ejercicio:\n` +
    `1. Texto de la pregunta 1\n` +
    `   A. Opción A\n` +
    `   B. Opción B\n` +
    `   C. Opción C\n` +
    `   D. Opción D\n` +
    `   Respuesta correcta: [a/b/c/d]\n\n` +
    `2. Texto de la pregunta 2\n` +
    `   A. Opción A\n` +
    `   B. Opción B\n` +
    `   C. Opción C\n` +
    `   D. Opción D\n` +
    `   Respuesta correcta: [a/b/c/d]\n\n` +
    `No incluyas texto adicional ni bloques de Markdown fuera de los ejercicios. Solo el texto con el formato especificado.`;

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