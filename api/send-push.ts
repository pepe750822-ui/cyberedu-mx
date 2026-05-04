import webpush from "web-push";

export const config = { runtime: "nodejs", maxDuration: 30 };

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
    return new Response("Supabase env vars missing", { status: 500 });
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/push_subscriptions?select=subscription`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!res.ok) {
    return new Response("Failed to fetch subscriptions", { status: 500 });
  }

  const subs: { subscription: any }[] = await res.json();

  if (subs.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0, failed: 0, total: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
