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

                const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
                if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

                // Build context
                let systemContent = SYSTEM_PROMPT;
                if (task.context) {
                    systemContent += `\n\n## CONTEXTO DE TAREA\n${JSON.stringify(task.context)}`;
                }
                if (task.memory) {
                    systemContent += `\n\n## MEMORIA_ACTUAL\n${JSON.stringify(task.memory)}`;
                }

                const response = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: {
                        "x-api-key": ANTHROPIC_API_KEY,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "claude-sonnet-4-6",
                        max_tokens: 4096,
                        system: systemContent,
                        messages: [
                            { role: "user", content: task.prompt }
                        ],
                        stream: false,
                    }),
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Anthropic API Error: ${errText}`);
                }

                const jsonResponse = await response.json();
                let resultText = jsonResponse.content[0].text;

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

        // Deno Deploy / Supabase background execution
        const promise = processBackgroundTask();

        // @ts-ignore - EdgeRuntime is available in some environments to keep the process alive
        if (typeof EdgeRuntime !== 'undefined') {
            // @ts-ignore
            EdgeRuntime.waitUntil(promise);
        } else {
            // Fallback for standard Deno
            promise.catch(console.error);
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Tarea recibida y ejecutando en segundo plano",
            taskId
        }), {
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
