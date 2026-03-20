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

    const SYSTEM_PROMPT = `Eres el Agente Inteligente de CyberEdu MX — un consultor académico experto en el examen ECOEMS 2026.
    
    ## MEMORIA Y CONTEXTO
    ${memory ? JSON.stringify(memory) : ''}
    ${context ? JSON.stringify(context) : ''}`;

    const cleanMessages = (messages || []).filter(
      (m: any) => m.role === 'user' || m.role === 'assistant'
    );

    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
        stream: true,
      }),
    });

    // Convertimos el stream de Anthropic al formato compatible con OpenAI que espera AITutor.tsx
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (!data || data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              // Traducimos el 'text' de Anthropic al 'content' de OpenAI
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                const text = parsed.delta.text;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`
                  )
                );
              } else if (parsed.type === "message_stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            } catch { /* Ignorar líneas incompletas */ }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
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
