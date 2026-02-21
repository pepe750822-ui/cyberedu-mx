import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
        const resendApiKey = Deno.env.get("RESEND_API_KEY") || "re_AKjBcgh5_NUpA5VASD41sdv2dRazRz1w2";
        const resend = new Resend(resendApiKey);

        const { to, subject, html } = await req.json();

        console.log(`Intentando enviar email a: ${to}`);

        const { data, error } = await resend.emails.send({
            from: "CyberEdu MX <onboarding@resend.dev>",
            to: [to || "pepe750822@gmail.com"],
            subject: subject || "Prueba desde CyberEdu MX",
            html: html || "<h1>Hola!</h1><p>Esta es una prueba real.</p>",
        });

        if (error) {
            console.error("Error de Resend:", error);
            return new Response(JSON.stringify({ error: error.message || error }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        console.log("Email enviado con éxito:", data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("Error inesperado en la función:", err.message);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});

