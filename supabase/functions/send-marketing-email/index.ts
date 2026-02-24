import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // 1. Get Resend API Key from Environment
        // No hardcoded keys or fallbacks allowed for security
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
            console.error("Critical: RESEND_API_KEY is not configured in the environment.");
            return new Response(JSON.stringify({ error: "Server configuration error" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. Validate Authentication
        // Robust check for Authorization header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Use service role for internal checks if needed, but validate user
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        // Verify the user's JWT
        const { data: { user }, error: authError } = await createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            { global: { headers: { Authorization: authHeader } } }
        ).auth.getUser();

        if (authError || !user) {
            console.error("Unauthorized attempt to call edge function:", authError);
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Optional: Add additional authorization (e.g., check if user is admin)
        // For now, only authenticated users can send. 
        // In a real scenario, you'd check a database column like 'is_admin'.

        const resend = new Resend(resendApiKey);

        // 4. Parse and Validate Request Body
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { to, subject, html } = body;

        if (!to || !subject || !html) {
            return new Response(JSON.stringify({ error: "Missing required fields (to, subject, html)" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 5. Send Email
        console.log(`Sending email from ${user.email} to ${to}`);

        const { data, error } = await resend.emails.send({
            from: "CyberEdu MX <onboarding@resend.dev>",
            to: to,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Resend API error:", error);
            return new Response(JSON.stringify({ error: "Failed to send email" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err: any) {
        console.error("Unexpected error in Edge Function:", err.message);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
