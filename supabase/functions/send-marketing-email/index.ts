import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const ADMIN_EMAILS = ["pepe750822@gmail.com"];
const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
// Resend batch API accepts up to 100 emails per request
const BATCH_SIZE = 100;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // 1. Read env vars (Deno runtime)
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
            console.error("RESEND_API_KEY not configured");
            return new Response(JSON.stringify({ error: "Server configuration error" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. Verify JWT
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace("Bearer ", "")
        );

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Admin check: query profiles directly (no rpc dependency)
        // is_admin column does not exist in profiles table — check by email only
        const { data: callerProfile, error: profileError } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", user.id)
            .single();

        const isAdmin =
            !profileError &&
            callerProfile &&
            ADMIN_EMAILS.includes(callerProfile.email?.toLowerCase() ?? "");

        if (!isAdmin) {
            console.warn("Forbidden attempt by user:", user.id, user.email);
            return new Response(JSON.stringify({ error: "Forbidden: admin required" }), {
                status: 403,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 4. Parse body
        let body: { to?: string | string[]; subject?: string; html?: string; bulk?: boolean };
        try {
            body = await req.json();
        } catch {
            return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { to, subject, html, bulk } = body;

        if (!subject || !html) {
            return new Response(JSON.stringify({ error: "Missing required fields: subject, html" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 5. Resolve recipients
        let recipients: string[] = [];

        if (bulk) {
            const { data: optedInUsers, error: fetchError } = await supabase
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

            recipients = (optedInUsers ?? [])
                .map((u: { email: string | null }) => u.email)
                .filter((e): e is string => !!e);

            if (recipients.length === 0) {
                return new Response(JSON.stringify({ error: "No recipients with marketing_opt_in found" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            console.log(`Bulk send: ${recipients.length} recipients`);
        } else {
            if (!to) {
                return new Response(JSON.stringify({ error: "Missing required field: to" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }
            recipients = Array.isArray(to) ? to : [to];
        }

        // 6. Send via Resend batch API (up to 100 per request, parallel batches)
        const results = { sent: 0, failed: 0, failed_recipients: [] as string[] };

        // Split into chunks of BATCH_SIZE
        const batches: string[][] = [];
        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            batches.push(recipients.slice(i, i + BATCH_SIZE));
        }

        // Fire all batches in parallel
        await Promise.all(
            batches.map(async (batch) => {
                const payload = batch.map((recipient) => ({
                    from: "CyberEdu MX <noreply@cyberedumx.com>",
                    to: [recipient],
                    subject,
                    html,
                }));

                try {
                    const res = await fetch(RESEND_BATCH_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${resendApiKey}`,
                        },
                        body: JSON.stringify(payload),
                    });

                    if (!res.ok) {
                        const errBody = await res.text();
                        console.error(`Batch failed (${res.status}):`, errBody);
                        results.failed += batch.length;
                        results.failed_recipients.push(...batch);
                        return;
                    }

                    const data = await res.json();
                    // Resend batch returns array of { id } or { error } per item
                    if (Array.isArray(data)) {
                        data.forEach((item: { id?: string; error?: string }, idx: number) => {
                            if (item.error) {
                                results.failed++;
                                results.failed_recipients.push(batch[idx]);
                            } else {
                                results.sent++;
                            }
                        });
                    } else {
                        // Fallback: treat whole batch as sent if response is 200
                        results.sent += batch.length;
                    }
                } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : String(e);
                    console.error("Batch exception:", msg);
                    results.failed += batch.length;
                    results.failed_recipients.push(...batch);
                }
            })
        );

        console.log(`Done: ${results.sent} sent, ${results.failed} failed`);

        return new Response(JSON.stringify({
            success: true,
            total: recipients.length,
            batches: batches.length,
            sent: results.sent,
            failed: results.failed,
            ...(results.failed_recipients.length > 0 && { failed_recipients: results.failed_recipients }),
        }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Unexpected error:", msg);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
