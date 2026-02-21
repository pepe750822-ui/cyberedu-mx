import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend("re_AKjBcgh5_NUpA5VASD41sdv2dRazRz1w2");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { to, subject, html } = await req.json();

        const { data, error } = await resend.emails.send({
            from: "CyberEdu MX <onboarding@resend.dev>",
            to: [to || "pepe750822@gmail.com"],
            subject: subject || "Prueba desde CyberEdu MX",
            html: html || "<h1>Hola!</h1><p>Esta es una prueba real.</p>",
        });

        if (error) {
            return new Response(JSON.stringify({ error }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
