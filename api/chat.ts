import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API Key de Anthropic no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { messages, context, memory } = await req.json();

    const SYSTEM_PROMPT = `Eres el Agente Inteligente de CyberEdu MX — un mentor académico experto en el examen ECOEMS 2026.

    REGLAS IMPORTANTES:
    1. Responde de forma DIRECTA y profesional en español mexicano.
    2. NO incluyas bloques XML como <reasoning>, <plan> o similares.
    3. Usa markdown (**negritas**, listas) para que tu respuesta sea legible.
    4. Cita el temario oficial ECOEMS [MATERIA X.Y] si es relevante.

    ${memory ? `## MEMORIA: ${JSON.stringify(memory)}` : ''}
    ${context ? `## CONTEXTO: ${JSON.stringify(context)}` : ''}`;

    const cleanMessages = (messages || []).filter(
      (m: any) => m.role === 'user' || m.role === 'assistant'
    );

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: cleanMessages,
        stream: false, // Desactivamos stream para estabilidad inicial
      }),
    });

    if (!apiResponse.ok) {
       const err = await apiResponse.text();
       return new Response(JSON.stringify({ error: err }), { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    const finalContent = data.content?.[0]?.text || '';

    // AITutor.tsx (Línea 549) detecta el formato: { content: "texto" }
    // Enviar data: JSON + [DONE] para simular un fin inmediato
    const payload = `data: ${JSON.stringify({ content: finalContent })}\n\ndata: [DONE]\n\n`;

    return new Response(payload, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
