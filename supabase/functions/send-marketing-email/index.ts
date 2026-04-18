import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const ADMIN_EMAILS = ["pepe750822@gmail.com"];
const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
const BATCH_SIZE = 100;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // 1. RESEND_API_KEY
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        console.log("[1] RESEND_API_KEY present:", !!resendApiKey);
        if (resendApiKey) {
            console.log("[1] RESEND_API_KEY prefix:", resendApiKey.slice(0, 10) + "...");
        }
        if (!resendApiKey) {
            console.error("[1] RESEND_API_KEY not configured — aborting");
            return new Response(JSON.stringify({ error: "Server configuration error" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. JWT
        const authHeader = req.headers.get("Authorization");
        console.log("[2] Authorization header present:", !!authHeader);
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        console.log("[2] SUPABASE_URL present:", !!supabaseUrl);
        console.log("[2] SERVICE_ROLE_KEY present:", !!serviceKey);

        const supabase = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace("Bearer ", "")
        );
        console.log("[2] auth.getUser — user:", user?.email ?? "null", "| error:", authError?.message ?? "none");

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 3. Admin check — first try auth.users email (most reliable),
        //    fall back to profiles table query
        const authEmail = user.email?.toLowerCase() ?? "";
        const isAdminByAuth = ADMIN_EMAILS.includes(authEmail);
        console.log("[3] auth email:", authEmail, "| isAdminByAuth:", isAdminByAuth);

        let isAdmin = isAdminByAuth;

        if (!isAdmin) {
            const { data: callerProfile, error: profileError } = await supabase
                .from("profiles")
                .select("email")
                .eq("id", user.id)
                .single();
            console.log("[3] profiles query — email:", callerProfile?.email ?? "null", "| error:", profileError?.message ?? "none");
            isAdmin = !profileError && callerProfile &&
                ADMIN_EMAILS.includes(callerProfile.email?.toLowerCase() ?? "");
        }

        console.log("[3] isAdmin:", isAdmin);

        if (!isAdmin) {
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
        console.log("[4] body — bulk:", bulk, "| to:", to, "| subject:", subject?.slice(0, 40));

        if (!subject || !html) {
            return new Response(JSON.stringify({ error: "Missing required fields: subject, html" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 5. Resolve recipients
        let recipients: string[] = [];

        if (bulk) {
            const { data: allUsers, error: fetchError } = await supabase
                .from("profiles")
                .select("email")
                .not("email", "is", null);

            console.log("[5] bulk recipients fetched:", allUsers?.length ?? 0, "| error:", fetchError?.message ?? "none");

            if (fetchError) {
                return new Response(JSON.stringify({ error: "Failed to fetch recipients" }), {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            recipients = (allUsers ?? [])
                .map((u: { email: string | null }) => u.email)
                .filter((e): e is string => !!e);

            if (recipients.length === 0) {
                return new Response(JSON.stringify({ error: "No users with email found" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }
        } else {
            // Test send — deliver directly to the provided address, no opt-in filter
            if (!to) {
                return new Response(JSON.stringify({ error: "Missing required field: to" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }
            recipients = Array.isArray(to) ? to : [to];
            console.log("[5] test send to:", recipients[0]);
        }

        console.log("[5] final recipients count:", recipients.length);

        // 6. Send via Resend batch API
        const results = { sent: 0, failed: 0, failed_recipients: [] as string[] };

        const batches: string[][] = [];
        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            batches.push(recipients.slice(i, i + BATCH_SIZE));
        }

        console.log("[6] batches to send:", batches.length, "| RESEND_BATCH_URL:", RESEND_BATCH_URL);

        await Promise.all(
            batches.map(async (batch, batchIdx) => {
                const payload = batch.map((recipient) => ({
                    from: "CyberEdu MX <noreply@cyberedumx.com>",
                    to: [recipient],
                    subject,
                    html,
                }));

                console.log(`[6] batch[${batchIdx}] PRE-FETCH — recipients:`, batch, "| payload[0].from:", payload[0]?.from);
                try {
                    const res = await fetch(RESEND_BATCH_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${resendApiKey}`,
                        },
                        body: JSON.stringify(payload),
                    });

                    const rawBody = await res.text();
                    console.log(`[6] batch[${batchIdx}] Resend status:`, res.status);

                    if (!res.ok) {
                        let resendBody: unknown;
                        try { resendBody = JSON.parse(rawBody); } catch { resendBody = rawBody; }
                        console.log("[resend error]", JSON.stringify(resendBody));
                        results.failed += batch.length;
                        results.failed_recipients.push(...batch);
                        return;
                    }

                    let data: unknown;
                    try { data = JSON.parse(rawBody); } catch { data = null; }

                    if (Array.isArray(data)) {
                        (data as { id?: string; error?: string }[]).forEach((item, idx) => {
                            if (item.error) {
                                console.error(`[6] batch[${batchIdx}] item[${idx}] error:`, item.error);
                                results.failed++;
                                results.failed_recipients.push(batch[idx]);
                            } else {
                                results.sent++;
                            }
                        });
                    } else {
                        results.sent += batch.length;
                    }
                } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : String(e);
                    console.error(`[6] batch[${batchIdx}] exception:`, msg);
                    results.failed += batch.length;
                    results.failed_recipients.push(...batch);
                }
            })
        );

        console.log(`[7] done — sent: ${results.sent}, failed: ${results.failed}`);

        const allFailed = results.sent === 0 && results.failed > 0;
        return new Response(JSON.stringify({
            success: !allFailed,
            total: recipients.length,
            batches: batches.length,
            sent: results.sent,
            failed: results.failed,
            ...(results.failed_recipients.length > 0 && { failed_recipients: results.failed_recipients }),
        }), {
            // Return 422 when every send failed so the client can surface the error
            status: allFailed ? 422 : 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[!] Unexpected error:", msg);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
