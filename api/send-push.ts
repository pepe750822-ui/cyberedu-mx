import webpush from "web-push";

// Vercel Hobby: nodejs functions max 10s
export const config = { runtime: "nodejs", maxDuration: 10 };

webpush.setVapidDetails(
  "mailto:pepe750822@gmail.com",
  process.env.VITE_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const sendSecret = process.env.REACTIVATION_SEND_SECRET;
  if (sendSecret && body.secret !== sendSecret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, message, url } = body;
  if (!title || !message) {
    return new Response("Missing title or message", { status: 400 });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "SUPABASE_SERVICE_ROLE_KEY not set in Vercel env vars" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Fetch subscriptions with 5s timeout
  const controller = new AbortController();
  const fetchTimeout = setTimeout(() => controller.abort(), 5000);

  let subs: { subscription: any }[] = [];
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/push_subscriptions?select=subscription`,
      {
        signal: controller.signal,
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );
    clearTimeout(fetchTimeout);

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({ ok: false, error: `Supabase error ${res.status}: ${text}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    subs = await res.json();
  } catch (err: any) {
    clearTimeout(fetchTimeout);
    return new Response(
      JSON.stringify({ ok: false, error: `Supabase fetch failed: ${err.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (subs.length === 0) {
    return new Response(
      JSON.stringify({ ok: true, total: 0, sent: 0, failed: 0, note: "No subscribers yet" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const payload = JSON.stringify({
    title,
    body: message,
    url: url || "https://www.cyberedumx.com",
  });

  const results = await Promise.allSettled(
    subs.map((row) => webpush.sendNotification(row.subscription, payload))
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`[send-push] total=${subs.length} sent=${sent} failed=${failed}`);

  return new Response(
    JSON.stringify({ ok: true, total: subs.length, sent, failed }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
