import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Manejo de CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Validation: Resend API Key
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
            console.error("RESEND_API_KEY no está configurada");
            return new Response(JSON.stringify({ error: "Configuración incompleta: RESEND_API_KEY falta" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Validation: Authentication
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            {
                global: {
                    headers: { Authorization: req.headers.get("Authorization")! },
                },
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            console.error("Error de autenticación:", authError);
            return new Response(JSON.stringify({ error: "No autorizado" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const resend = new Resend(resendApiKey);

        // Intentar parsear el body con manejo de errores
        let body;
        try {
            body = await req.json();
        } catch (e) {
            console.error("Error al parsear el body:", e);
            return new Response(JSON.stringify({ error: "No se recibió un JSON válido en el body" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { to, subject, html } = body;
        console.log(`Petición recibida de ${user.email} para: ${to}`);

        // Validación mínima
        if (!to) {
            return new Response(JSON.stringify({ error: "Falta el destinatario (to)" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { data, error } = await resend.emails.send({
            from: "CyberEdu MX <onboarding@resend.dev>",
            to: to,
            subject: subject || "Prueba desde CyberEdu MX",
            html: html || "<h1>Hola!</h1><p>Esta es una prueba real.</p>",
        });

        if (error) {
            console.error("Error de la API de Resend:", error);
            return new Response(JSON.stringify({ error: "Resend API Error: " + (error.message || JSON.stringify(error)) }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        console.log("Email enviado exitosamente:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("Error crítico en la Edge Function:", err.message);
        return new Response(JSON.stringify({ error: "Error interno: " + err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

