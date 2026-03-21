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

  const allowedOrigins = [
    'https://cyberedumx.lovable.app',
    'https://cyberedu-mx.vercel.app',
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
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { messages, context, memory } = await req.json();

    const SYSTEM_PROMPT = `Eres CyberAgent, el mentor académico experto de CyberEdu MX especializado en el examen ECOEMS 2026.
    
    CAPACIDADES Y REGLAS:
    1. PERSONALIDAD: Profesional, motivador y directo (español mexicano).
    2. CITACIÓN: Cita siempre el temario oficial [MATERIA X.Y] (Ej: [MAT 4.2]).
    3. DIAGRAMAS: Para temas complejos, genera diagramas Mermaid usando \`\`\`mermaid\`\`\` con 'flowchart TD' o 'flowchart LR'. Usa comillas dobles en etiquetas con acentos.
    4. QUIZ: Genera retos interactivos encapsulados en <quiz>{JSON}</quiz> siguiendo el esquema: { "title": "...", "questions": [{ "text": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }] }.
    5. IMÁGENES: Usa [IMG:clave] para apoyo visual.
    6. GRÁFICAS: Usa <chart>{JSON}</chart> para datos estadísticos.
    7. RAZONAMIENTO: Incluye un breve bloque <reasoning>{JSON}</reasoning> antes de respuestas complejas.
    8. PLANES: Usa <plan>{JSON}</plan> para proponer rutas de estudio.

    ${memory ? `## MEMORIA: ${JSON.stringify(memory)}` : ''}
    ${context ? `## CONTEXTO: ${JSON.stringify(context)}` : ''}`;

    const frontendSystemMsg = (messages || []).find((m: any) => m.role === 'system')?.content;
    const finalSystemPrompt = frontendSystemMsg || SYSTEM_PROMPT;

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
        model: 'claude-sonnet-4-6',
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
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: parsed.delta.text } }] })}\n\n`));
                } else if (parsed.type === 'message_stop') {
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
        // Handle client-side cancellation
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
        'Connection': 'keep-alive'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
