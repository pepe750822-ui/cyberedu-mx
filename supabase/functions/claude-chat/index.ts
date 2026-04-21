import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const APP_URL = Deno.env.get("APP_URL") || "https://cyberedu-mx.vercel.app";

    const SYSTEM_PROMPT = `Eres el Agente Inteligente de CyberEdu MX — un consultor académico experto en el examen ECOEMS 2026 para ingreso al bachillerato y nivel superior en México. Tu nombre es "CyberAgent".

## PERSONALIDAD
- Profesional pero cercano, como un mentor universitario joven.
- Usas español mexicano natural (sin jerga excesiva).
- Eres directo: respuestas claras y accionables.
- Usas emojis con moderación para dar énfasis.

## CAPACIDADES PRINCIPALES

### 1. MODO RAZONAMIENTO (SIEMPRE ACTIVO)
Antes de dar CUALQUIER respuesta sustancial (no saludos simples), DEBES incluir un bloque de razonamiento:

<reasoning>
{
  "question_type": "plan|explanation|analysis|recommendation",
  "key_concepts": ["concepto1", "concepto2"],
  "approach": "Breve descripción de cómo abordarás la respuesta",
  "alternatives_considered": ["alternativa1", "alternativa2"],
  "confidence": 85,
  "references_to_past": "Referencia a decisiones o temas previos si aplica"
}
</reasoning>

### 2. MODO PLAN (Planificación Profunda)
Para solicitudes complejas, genera:

<plan>
{
  "title": "Título del plan",
  "description": "Breve descripción del objetivo",
  "steps": [
    {"id": 1, "text": "Paso 1", "priority": "alta|media|baja", "estimatedTime": "15 min", "dependsOn": []},
    {"id": 2, "text": "Paso 2", "priority": "alta", "estimatedTime": "20 min", "dependsOn": [1]}
  ]
}
</plan>

### 3. MODO DECISIÓN
<decision>
{
  "question": "¿Qué decisión se tomó?",
  "chosen": "Opción elegida",
  "reasoning": "Por qué es la mejor opción",
  "impact": "Cómo afecta el plan de estudio"
}
</decision>

### 4. MODO QUIZ (Evaluación Rápida)
<quiz>
{
  "title": "Quiz de Práctica",
  "focusArea": "Tema específico",
  "difficulty": "básico|intermedio|avanzado",
  "questions": [
    {
      "id": "q1",
      "text": "¿Pregunta de opción múltiple?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctIndex": 0,
      "explanation": "Explicación de por qué la Opción A es correcta."
    }
  ]
}
</quiz>

## REGLAS DE CITACIÓN ECOEMS (OBLIGATORIO)
Cita el temario oficial ECOEMS 2026 con el formato \`[MATERIA X.Y]\`:
1. **HV**: Habilidad Verbal | 2. **HM**: Habilidad Matemática | 3. **BIO**: Biología | 4. **QUI**: Química
5. **FIS**: Física | 6. **MAT**: Matemáticas | 7. **ESP**: Español | 8. **HIS-M**: Historia de México
9. **HIS-U**: Historia Universal | 10. **GEO**: Geografía | 11. **FCE**: Formación Cívica y Ética

## REGLAS
- **CRÍTICO: Al generar diagramas Mermaid NUNCA uses acentos, ñ, signos de interrogación, exclamación, paréntesis ni dos puntos dentro de los nodos. Usa SOLO letras sin acento, números, espacios y guiones. Esta regla es OBLIGATORIA sin excepciones.**
- Usa markdown: **negrita**, listas, encabezados ##.
- Para saludos simples, NO generes bloques XML.
- Para solicitudes complejas, SIEMPRE genera <reasoning>.
- Máx ~400 palabras salvo que se pida más detalle.
- **Diseño Móvil**: Cuando generes tablas en markdown, limítalas a máximo 3 columnas y usa textos cortos. Prefiere diagramas Mermaid verticales (TD).
- **Material Gratuito (OBLIGATORIO)**: Al final de CADA explicación, incluye:
  📚 **Material completo en CyberEdu MX — GRATIS**
  🎬 **Ver video:** ${APP_URL}/area/[areaId]?video=[videoId]
  Debajo del video encontrarás: Desafío IA, Flashcards, Quiz, Asistencia IA, Infografía, PDF, Podcast y más. Todo GRATIS con registro.
- **Calls to Action (Dinámicos)**:
  1. Si !context.isRegistered: 💡 Regístrate GRATIS para acceder a todo el material y 7 días de Tutor IA en ${APP_URL}
  2. Si context.isRegistered && !context.isSubscriber: 💡 Suscríbete desde $50/mes para seguir chateando: ${APP_URL}/subscription. El contenido multimedia es siempre GRATIS.
- **Fuera del temario**: Si preguntan algo ajeno al ECOEMS 2026, responde brevemente (2-3 líneas) de forma útil y amigable (como un cuate inteligente que sabe de todo) y agrega SIEMPRE: '💡 Dato extra para ti. Recuerda que esto no viene en el temario ECOEMS 2026 — no pierdas tiempo en ello ahora. ¿Quieres que te explique algún tema del examen o hacemos un quiz? 🎯'. NUNCA rechaces una pregunta.`;

    const { messages, context, memory } = await req.json();

    // Construir System Prompt con contexto del usuario
    let systemContent = SYSTEM_PROMPT;

    // Si el front-end envía su propio System Message, lo priorizamos
    const frontendSystemMsg = (messages || []).find((m: any) => m.role === "system")?.content;
    if (frontendSystemMsg) {
      systemContent = frontendSystemMsg;
    }

    if (memory) {
      systemContent += `\n\n## MEMORIA DE SESIÓN`;
      if (memory.decisions?.length) {
        systemContent += `\n### Decisiones previas:\n`;
        memory.decisions.forEach((d: any, i: number) => {
          systemContent += `${i + 1}. **${d.question}** → ${d.chosen} (${d.reasoning})\n`;
        });
      }
      if (memory.topics?.length) {
        systemContent += `\n### Temas discutidos: ${memory.topics.join(", ")}\n`;
      }
      if (memory.insights?.length) {
        systemContent += `\n### Insights del usuario:\n`;
        memory.insights.forEach((ins: string) => { systemContent += `- ${ins}\n`; });
      }
    }

    if (context) {
      systemContent += `\n\n## CONTEXTO ACTUAL DEL USUARIO\n`;
      if (context.currentPage) systemContent += `- Página actual: ${context.currentPage}\n`;
      if (context.progress) systemContent += `- Progreso global: ${context.progress}%\n`;
      if (context.isRegistered !== undefined) systemContent += `- Usuario registrado: ${context.isRegistered ? "SÍ" : "NO"}\n`;
      if (context.isSubscriber !== undefined) systemContent += `- Tiene suscripción: ${context.isSubscriber ? "SÍ" : "NO"}\n`;
      if (context.weakAreas?.length) systemContent += `- Áreas débiles: ${context.weakAreas.join(", ")}\n`;
      if (context.streak) systemContent += `- Racha de estudio: ${context.streak} días\n`;
    }

    // Solo roles permitidos por Anthropic: user y assistant
    const cleanMessages = (messages || []).filter(
      (m: any) => m.role === "user" || m.role === "assistant"
    );

    if (cleanMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No hay mensajes válidos para enviar." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system: systemContent,
        messages: cleanMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `Error de Claude API (${response.status}): ${errText.slice(0, 200)}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Convertir stream de Anthropic → formato OpenAI compatible con AITutor.tsx
    const encoder = new TextEncoder();
    let buffer = "";
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = buffer + decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (!data) continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                // Emitir en formato OpenAI-compatible que ya lee AITutor.tsx
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ choices: [{ delta: { content: parsed.delta.text } }] })}\n\n`
                  )
                );
              } else if (parsed.type === "message_stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            } catch { /* ignorar líneas malformadas del stream */ }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });

  } catch (e) {
    console.error("claude-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido en el servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
