// Edge runtime — Web Crypto API nativa, sin dependencias npm
export const config = { runtime: "edge" };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// ─── Base64url helpers ────────────────────────────────────────────────────────

function b64urlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  return Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad), (c) =>
    c.charCodeAt(0)
  );
}

function bytesToB64url(b: Uint8Array): string {
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function objToB64url(o: unknown): string {
  return bytesToB64url(new TextEncoder().encode(JSON.stringify(o)));
}

// ─── VAPID JWT (ES256 / P-256) ────────────────────────────────────────────────

async function signVapidJwt(audience: string, privB64url: string, pubB64url: string) {
  const pub = b64urlToBytes(pubB64url); // 65 bytes: 0x04 || x(32) || y(32)
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

// ─── RFC 8291 payload encryption (aesgcm) ────────────────────────────────────

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
    const key = await crypto.subtle.importKey("raw", ikm as unknown as ArrayBuffer, "HKDF", false, ["deriveBits"]);
    return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: saltV as unknown as ArrayBuffer, info: info as unknown as ArrayBuffer }, key, bits));
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

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const vp = process.env.VITE_VAPID_PUBLIC_KEY;
  const vs = process.env.VAPID_PRIVATE_KEY;
  const su = process.env.VITE_SUPABASE_URL;
  const sk = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missing = [!vp && "VITE_VAPID_PUBLIC_KEY", !vs && "VAPID_PRIVATE_KEY", !su && "VITE_SUPABASE_URL", !sk && "SUPABASE_SERVICE_ROLE_KEY"].filter(Boolean);
  if (missing.length) return json({ ok: false, error: `Missing env vars: ${missing.join(", ")}` }, 500);

  let body: any;
  try { body = await req.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }

  const secret = process.env.REACTIVATION_SEND_SECRET;
  if (secret && body.secret !== secret) return new Response("Unauthorized", { status: 401 });

  const { title, message, url } = body;
  if (!title || !message) return json({ ok: false, error: "Missing title or message" }, 400);

  // Fetch subscriptions from Supabase
  const res = await fetch(`${su}/rest/v1/push_subscriptions?select=subscription`, {
    headers: { apikey: sk!, Authorization: `Bearer ${sk}` },
  });
  if (!res.ok) return json({ ok: false, error: `Supabase ${res.status}: ${await res.text()}` }, 500);

  const subs: { subscription: any }[] = await res.json();
  if (subs.length === 0) return json({ ok: true, total: 0, sent: 0, failed: 0, note: "No subscribers yet" });

  const payload = JSON.stringify({ title, body: message, url: url || "https://www.cyberedumx.com" });

  const results = await Promise.allSettled(
    subs.map(async ({ subscription: sub }) => {
      const audience = new URL(sub.endpoint).origin;
      const jwt = await signVapidJwt(audience, vs!, vp!);
      const headers: Record<string, string> = { Authorization: `vapid t=${jwt},k=${vp}`, TTL: "86400" };
      let pushBody: BodyInit | null = null;

      if (sub.keys?.p256dh && sub.keys?.auth) {
        const { body: enc, salt, serverPub } = await encryptPayload(sub, payload);
        headers["Content-Encoding"] = "aesgcm";
        headers["Content-Type"] = "application/octet-stream";
        headers["Encryption"] = `salt=${salt}`;
        headers["Crypto-Key"] = `dh=${serverPub};vapid t=${jwt},k=${vp}`;
        pushBody = enc;
      }

      const r = await fetch(sub.endpoint, { method: "POST", headers, body: pushBody });
      if (r.status !== 200 && r.status !== 201 && r.status !== 202) throw new Error(`${r.status}`);
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  return json({ ok: true, total: subs.length, sent, failed });
}
