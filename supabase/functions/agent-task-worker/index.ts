import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres el Agente Inteligente de CyberEdu MX — un consultor académico experto en el examen ECOEMS 2026 para ingreso al bachillerato y nivel superior en México. Tu nombre es "CyberAgent".

## PERSONALIDAD
- Profesional pero cercano.
- Directo y analítico.
- Resuelve tareas complejas en segundo plano.

## MODO RAZONAMIENTO Y TAREA (SIEMPRE ACTIVO)
Genera el contenido dividiendo siempre tu proceso en <reasoning> y brindando respuestas accionables.
Si te piden un plan, siempre devuelve <plan>{...}</plan> estructural sin markdown.

Mantén tus respuestas formatedas para Markdown.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskId } = await req.json();

    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    // Use service role to guarantee updates or explicitly use anon context depending on environment.

    // 1. Fetch Task
    const { data: task, error: fetchError } = await supabaseClient
      .from('ai_agent_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) {
        return new Response(JSON.stringify({ error: "Tarea no encontrada" }), { status: 404, headers: corsHeaders });
    }

    if (task.status !== 'queued') {
        return new Response(JSON.stringify({ error: "Tarea ya en progreso o terminada" }), { status: 400, headers: corsHeaders });
    }

    // Immediately respond to the client so it's a true background task
    // Using EdgeRuntime background function context if possible, or just fire-and-forget in Deno
    const processBackgroundTask = async () => {
        try {
            // Update to running
            await supabaseClient.from('ai_agent_tasks').update({ status: 'running', started_at: new Date().toISOString() }).eq('id', taskId);

            const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
            if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

            // Build context
            let systemContent = SYSTEM_PROMPT;
            if (task.context) {
                systemContent += `\n\n## CONTEXTO DE TAREA\n${JSON.stringify(task.context)}`;
            }
            if (task.memory) {
                systemContent += `\n\n## MEMORIA_ACTUAL\n${JSON.stringify(task.memory)}`;
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
                        { role: "user", content: task.prompt }
                    ],
                    stream: false, // Wait fully
                }),
            });

            if (!response.ok) {
                throw new Error("AI Gateway Error");
            }

            const jsonResponse = await response.json();
            let resultText = jsonResponse.choices[0].message.content;

            // Strip raw tags
            resultText = resultText
                .replace(/<(reasoning|decision|plan)>[\s\S]*?(<\/\1>|$)/g, "")
                .trim();

            await supabaseClient.from('ai_agent_tasks').update({ 
                status: 'done', 
                result: resultText,
                completed_at: new Date().toISOString() 
            }).eq('id', taskId);

        } catch (error: any) {
            console.error("Fallo tarea UUID:", taskId, error);
            await supabaseClient.from('ai_agent_tasks').update({ 
                status: 'error', 
                error_msg: error.message || "Error desconocido",
                completed_at: new Date().toISOString()
            }).eq('id', taskId);
        }
    };

    // Deno Deploy generic background execution
    processBackgroundTask().catch(console.error);

    return new Response(JSON.stringify({ success: true, message: "Tarea encolada y ejecutando en segundo plano" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("agent-task-worker error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
