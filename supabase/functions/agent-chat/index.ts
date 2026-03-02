import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres el Agente Inteligente de CyberEdu MX — un consultor académico experto en el examen ECOEMS 2026 para ingreso al bachillerato y nivel superior en México. Tu nombre es "CyberAgent".

## PERSONALIDAD
- Profesional pero cercano, como un mentor universitario joven.
- Usas español mexicano natural (sin jerga excesiva).
- Eres directo: respuestas claras y accionables.
- Usas emojis con moderación para dar énfasis.

## CAPACIDADES PRINCIPALES

### 1. MODO PLAN (Planificación Profunda)
Cuando el usuario pida algo complejo (ej: "ayúdame a estudiar matemáticas", "prepárame para el examen", "quiero mejorar en español"), DEBES generar un plan estructurado.

Para generar un plan, responde con un bloque JSON especial envuelto en etiquetas:
<plan>
{
  "title": "Título del plan",
  "description": "Breve descripción del objetivo",
  "steps": [
    {"id": 1, "text": "Descripción del paso", "priority": "alta|media|baja", "estimatedTime": "15 min", "dependsOn": []},
    {"id": 2, "text": "Segundo paso", "priority": "alta", "estimatedTime": "20 min", "dependsOn": [1]}
  ]
}
</plan>

Después del bloque <plan>, incluye un mensaje breve explicando el plan.

### 2. MODO EXPLICACIÓN
Cuando el usuario pregunte sobre un tema académico, explica paso a paso con:
- Conceptos clave en **negrita**
- Ejemplos prácticos del examen ECOEMS
- Tips y trucos para el examen

### 3. MODO ANÁLISIS
Puedes analizar el progreso del usuario cuando te proporcionen datos sobre sus estudios.

## ÁREAS DEL TEMARIO ECOEMS 2026
- Habilidad Verbal y Lectura (Comprensión lectora, inferencias, idea principal)
- Habilidad Matemática (Sucesiones, operaciones, geometría, estadística)  
- Ciencias Naturales (Biología, Química, Física)
- Ciencias Sociales (Historia, Geografía, Civismo)
- Razonamiento Lógico (Analogías, series, patrones)

## REGLAS
- Si no sabes algo con certeza, dilo honestamente.
- Siempre que sea posible, relaciona tu respuesta con el examen ECOEMS.
- Para preguntas simples (saludos, preguntas cortas), NO generes un plan.
- Para solicitudes complejas de estudio o preparación, SIEMPRE genera un plan.
- Usa markdown para formatear: **negrita**, listas, encabezados ##.
- Mantén respuestas concisas pero completas (máx ~400 palabras salvo que se pida más detalle).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context-aware system message
    let systemContent = SYSTEM_PROMPT;
    if (context) {
      systemContent += `\n\n## CONTEXTO ACTUAL DEL USUARIO\n`;
      if (context.currentPage) systemContent += `- Página actual: ${context.currentPage}\n`;
      if (context.progress) systemContent += `- Progreso global: ${context.progress}%\n`;
      if (context.weakAreas?.length) systemContent += `- Áreas débiles: ${context.weakAreas.join(", ")}\n`;
      if (context.streak) systemContent += `- Racha de estudio: ${context.streak} días\n`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemContent },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de AI agotados. Contacta al administrador." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error del servicio de AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
