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

        // 3. Role-based authorization: only admins can send marketing emails
        const { data: roleCheck, error: roleError } = await supabaseClient
            .rpc('has_role', { _user_id: user.id, _role: 'admin' });

        if (roleError || !roleCheck) {
            console.warn("Unauthorized email send attempt by user:", user.id);
            return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), {
                status: 403,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

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

        const { to, subject, html, bulk } = body;

        if (!subject || !html) {
            return new Response(JSON.stringify({ error: "Missing required fields (subject, html)" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 5. Determine recipients
        let recipients: string[] = [];

        if (bulk) {
            // Fetch all users with marketing_opt_in enabled
            const { data: optedInUsers, error: fetchError } = await supabaseClient
                .from("profiles")
                .select("email")
                .eq("marketing_opt_in", true)
                .not("email", "is", null);

            if (fetchError) {
                console.error("Error fetching opted-in users:", fetchError);
                return new Response(JSON.stringify({ error: "Failed to fetch recipients" }), {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            recipients = (optedInUsers || [])
                .map((u: { email: string | null }) => u.email)
                .filter((e): e is string => !!e);

            if (recipients.length === 0) {
                return new Response(JSON.stringify({ error: "No recipients with marketing opt-in found" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            console.log(`Bulk send: ${recipients.length} recipients found`);
        } else {
            if (!to) {
                return new Response(JSON.stringify({ error: "Missing required field: to" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }
            recipients = Array.isArray(to) ? to : [to];
        }

        // 6. Send emails
        const results = { sent: 0, failed: 0, errors: [] as string[] };

        for (const recipient of recipients) {
            try {
                const { error } = await resend.emails.send({
                    from: "CyberEdu MX <noreply@cyberedumx.com>",
                    to: recipient,
                    subject: subject,
                    html: html,
                });

                if (error) {
                    console.error(`Failed to send to ${recipient}:`, error);
                    results.failed++;
                    results.errors.push(recipient);
                } else {
                    results.sent++;
                }
            } catch (sendErr: any) {
                console.error(`Exception sending to ${recipient}:`, sendErr.message);
                results.failed++;
                results.errors.push(recipient);
            }
        }

        console.log(`Send complete: ${results.sent} sent, ${results.failed} failed`);

        return new Response(JSON.stringify({
            success: true,
            total: recipients.length,
            sent: results.sent,
            failed: results.failed,
            ...(results.errors.length > 0 && { failed_recipients: results.errors }),
        }), {
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
