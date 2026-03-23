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
    9. FUERA DEL TEMARIO: Si preguntan algo ajeno al ECOEMS 2026, responde brevemente (2-3 líneas) de forma útil y amigable (como un cuate inteligente que sabe de todo) y agrega SIEMPRE: '💡 Dato extra para ti. Recuerda que esto no viene en el temario ECOEMS 2026 — no pierdas tiempo en ello ahora. ¿Quieres que te explique algún tema del examen o hacemos un quiz? 🎯'. NUNCA rechaces una pregunta.
    10. COMPATIBILIDAD MERMAID: Cuando generes diagramas Mermaid NUNCA uses acentos (á,é,í,ó,ú,ü,ñ,Á,É,Í,Ó,Ú,Ñ) ni paréntesis () dentro de los nodos — reemplaza acentos por vocales sin acento y paréntesis por corchetes []. Esto es obligatorio para compatibilidad con Mermaid v11.
    11. TABLAS: Cuando generes tablas en markdown, limítalas a máximo 3 columnas y usa textos cortos en cada celda — los usuarios acceden desde celular y las tablas anchas no se ven bien.
    12. DISEÑO MÓVIL: Cuando generes diagramas Mermaid, prefiere el formato vertical (TD) y evita que sean demasiado anchos para que no se salgan de la pantalla en celulares.
    13. RECOMENDACIONES: Al final de cada explicación de un tema, recomienda SIEMPRE el material de CyberEdu MX de forma explícita. Menciona el título del video relacionado y motiva al usuario a practicar en el 'Simulador Pro'. 
    14. LINKS DIRECTOS (CRITICO): Para que el usuario acceda rápido al contenido GRATUITO, incluye SIEMPRE al final de tu respuesta (después de las recomendaciones) los tags de recomendación correspondientes:
        - <recommendation>{ "type": "video", "videoId": "ID_DEL_VIDEO", "title": "Nombre del Video", "priority": "alta", "reason": "Ver explicación en video" }</recommendation>
        - Si hay infografías, PDFs o Quizzes disponibles en el temario, agrégalos también:
        - <recommendation>{ "type": "infografia", "videoId": "ID_DEL_VIDEO", "title": "Infografía del tema", "priority": "media", "reason": "Refuerzo visual" }</recommendation>
        Note: El videoId debe ser el ID interno (ej: 'bio-1', 'hv-3', 'mat-5'). Revisa areas.ts y materialComplementario.ts para los IDs correctos. NUNCA inventes IDs.

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
