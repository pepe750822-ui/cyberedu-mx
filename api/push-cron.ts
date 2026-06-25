// Edge runtime — daily push notification cron
export const config = { runtime: "edge" };

const EXAM_DATE = new Date("2026-06-20T08:00:00");

const COUNTDOWN_MESSAGES: Record<number, { title: string; body: string }> = {
  30: { title: "📅 30 días para el ECOEMS", body: "Enfócate en Matemáticas y Habilidad Verbal. ¡Cada día cuenta!" },
  15: { title: "⚡ 15 días para el ECOEMS", body: "¿Ya hiciste el simulador completo? 512 reactivos te esperan." },
  7:  { title: "🔥 Solo 7 días", body: "Repasa tus áreas débiles con el AITutor. ¡Tú puedes!" },
  3:  { title: "💪 3 días para el examen", body: "Descansa bien, come bien y repasa conceptos clave." },
  1:  { title: "🌟 Mañana es el gran día", body: "Duerme temprano. ¡Todo tu esfuerzo valió la pena!" },
  0:  { title: "🎯 HOY ES EL ECOEMS", body: "Lee bien cada pregunta. ¡Mucho éxito! CyberEdu MX cree en ti 💙" },
};

const WEEKLY_TIPS = [
  { title: "💡 Tip: Matemáticas", body: "La proporcionalidad directa e inversa siempre cae en el ECOEMS." },
  { title: "💡 Tip: Historia", body: "La Revolución Mexicana 1910-1917 es el tema más frecuente." },
  { title: "💡 Tip: Biología", body: "Fotosíntesis y respiración celular aparecen cada año." },
  { title: "💡 Tip: Física", body: "Ley de Newton y Ley de Ohm son favoritas del examen." },
  { title: "💡 Tip: Química", body: "Tabla periódica y enlaces químicos — pregúntale al AITutor." },
  { title: "💡 Tip: Habilidad Verbal", body: "Lee el texto completo antes de responder. El contexto lo es todo." },
];

// ─── Base64url helpers ────────────────────────────────────────────────────────

function b64urlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad), (c) => c.charCodeAt(0));
}

function bytesToB64url(b: Uint8Array): string {
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function objToB64url(o: unknown): string {
  return bytesToB64url(new TextEncoder().encode(JSON.stringify(o)));
}

// ─── VAPID JWT ────────────────────────────────────────────────────────────────

async function signVapidJwt(audience: string, privB64url: string, pubB64url: string) {
  const pub = b64urlToBytes(pubB64url);
  const key = await crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", d: privB64url, x: bytesToB64url(pub.slice(1, 33)), y: bytesToB64url(pub.slice(33, 65)) },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
  const input = `${objToB64url({ typ: "JWT", alg: "ES256" })}.${objToB64url({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 43200,
    sub: "mailto:pepe750822@gmail.com",
  })}`;
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(input));
  return `${input}.${bytesToB64url(new Uint8Array(sig))}`;
}

// ─── RFC 8291 payload encryption ─────────────────────────────────────────────

async function encryptPayload(sub: { keys: { p256dh: string; auth: string } }, payload: string) {
  const enc = new TextEncoder();
  const clientPub = b64urlToBytes(sub.keys.p256dh);
  const auth = b64urlToBytes(sub.keys.auth);

  const serverKP = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const serverPubRaw = new Uint8Array(await crypto.subtle.exportKey("raw", serverKP.publicKey));

  const clientKey = await crypto.subtle.importKey("raw", clientPub as unknown as ArrayBuffer, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: clientKey }, serverKP.privateKey, 256));
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const hkdf = async (ikm: Uint8Array, saltV: Uint8Array, info: Uint8Array, bits: number) => {
    const k = await crypto.subtle.importKey("raw", ikm as unknown as ArrayBuffer, "HKDF", false, ["deriveBits"]);
    return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: saltV as unknown as ArrayBuffer, info: info as unknown as ArrayBuffer }, k, bits));
  };

  const prk = await hkdf(shared, auth, enc.encode("Content-Encoding: auth\0"), 256);
  const context = new Uint8Array([...enc.encode("P-256\0"), 0, 65, ...clientPub, 0, 65, ...serverPubRaw]);
  const cekBits = await hkdf(prk, salt, new Uint8Array([...enc.encode("Content-Encoding: aesgcm\0"), ...context]), 128);
  const nonceBits = await hkdf(prk, salt, new Uint8Array([...enc.encode("Content-Encoding: nonce\0"), ...context]), 96);

  const cek = await crypto.subtle.importKey("raw", cekBits, "AES-GCM", false, ["encrypt"]);
  const plain = new Uint8Array([0, 0, ...enc.encode(payload)]);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonceBits }, cek, plain));

  return { body: ciphertext, salt: bytesToB64url(salt), serverPub: bytesToB64url(serverPubRaw) };
}

// ─── Send one push ────────────────────────────────────────────────────────────

async function sendOne(sub: any, title: string, body: string, url: string, vp: string, vs: string): Promise<boolean> {
  try {
    const audience = new URL(sub.endpoint).origin;
    const jwt = await signVapidJwt(audience, vs, vp);
    const headers: Record<string, string> = { Authorization: `vapid t=${jwt},k=${vp}`, TTL: "86400" };
    let pushBody: BodyInit | null = null;

    if (sub.keys?.p256dh && sub.keys?.auth) {
      const payload = JSON.stringify({ title, body, url });
      const { body: enc, salt, serverPub } = await encryptPayload(sub, payload);
      headers["Content-Encoding"] = "aesgcm";
      headers["Content-Type"] = "application/octet-stream";
      headers["Encryption"] = `salt=${salt}`;
      headers["Crypto-Key"] = `dh=${serverPub};vapid t=${jwt},k=${vp}`;
      pushBody = enc;
    }

    const r = await fetch(sub.endpoint, { method: "POST", headers, body: pushBody });
    return r.status === 200 || r.status === 201 || r.status === 202;
  } catch {
    return false;
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: Request) {
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const cronSecret  = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;
  const vp = process.env.VITE_VAPID_PUBLIC_KEY;
  const vs = process.env.VAPID_PRIVATE_KEY;
  const su = process.env.VITE_SUPABASE_URL;
  const sk = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Auth: Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  const url = new URL(req.url);
  const queryToken = url.searchParams.get("secret") || "";
  const provided = token || queryToken;
  const valid = [cronSecret, adminSecret].filter(Boolean) as string[];
  if (valid.length > 0 && !valid.includes(provided)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const missing = [!vp && "VITE_VAPID_PUBLIC_KEY", !vs && "VAPID_PRIVATE_KEY", !su && "VITE_SUPABASE_URL", !sk && "SUPABASE_SERVICE_ROLE_KEY"].filter(Boolean);
  if (missing.length) return new Response(JSON.stringify({ error: `Missing env: ${missing.join(", ")}` }), { status: 500 });

  // Fetch subscriptions
  const res = await fetch(`${su}/rest/v1/push_subscriptions?select=subscription`, {
    headers: { apikey: sk!, Authorization: `Bearer ${sk}` },
  });
  if (!res.ok) return new Response(JSON.stringify({ error: `Supabase ${res.status}` }), { status: 500 });

  const subs: { subscription: any }[] = await res.json();
  if (subs.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0, note: "No subscribers" }), { status: 200 });
  }

  // Pick the message for today
  const now = new Date();
  const daysUntilExam = Math.max(0, Math.ceil((EXAM_DATE.getTime() - now.getTime()) / 86_400_000));
  const dayOfWeek = now.getUTCDay();
  const weekNum = Math.ceil((now.getUTCDate() + new Date(now.getUTCFullYear(), now.getUTCMonth(), 1).getUTCDay()) / 7);

  let title: string;
  let body: string;
  const pushUrl = "https://www.cyberedumx.com";

  if (daysUntilExam in COUNTDOWN_MESSAGES) {
    ({ title, body } = COUNTDOWN_MESSAGES[daysUntilExam]);
  } else if (dayOfWeek === 1) {
    ({ title, body } = WEEKLY_TIPS[weekNum % WEEKLY_TIPS.length]);
  } else {
    title = "📚 ¡Es hora de estudiar!";
    body = `Faltan ${daysUntilExam} días para el ECOEMS. Práctica un tema hoy.`;
  }

  // Send to all subscribers
  const results = await Promise.allSettled(
    subs.map(({ subscription: sub }) => sendOne(sub, title, body, pushUrl, vp!, vs!))
  );

  const sent   = results.filter((r) => r.status === "fulfilled" && r.value === true).length;
  const failed = results.length - sent;

  return new Response(
    JSON.stringify({ ok: true, total: subs.length, sent, failed, title, daysUntilExam }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
