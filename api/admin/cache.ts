export const config = {
  runtime: 'nodejs',
};

const UPSTASH_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN  || process.env.UPSTASH_REDIS_REST_TOKEN;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return new Response(JSON.stringify({
      error: 'Upstash Redis no configurado. Conecta una integración de Redis en el Vercel Dashboard.',
      setupUrl: 'https://vercel.com/dashboard/integrations',
      usingMemoryCache: true,
      keys: [],
      count: 0,
    }), { status: 200, headers: corsHeaders });
  }

  try {
    // LIST all chat cache keys
    const keysRes = await fetch(`${UPSTASH_URL}/keys/chat:*`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    const keysData = await keysRes.json() as { result: string[] };
    const keys = keysData.result ?? [];

    if (req.method === 'DELETE') {
      // DELETE all cache keys
      let deleted = 0;
      for (const key of keys) {
        await fetch(`${UPSTASH_URL}/del/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        });
        deleted++;
      }
      return new Response(JSON.stringify({ cleared: deleted, message: `${deleted} entradas eliminadas de la caché.` }), {
        status: 200, headers: corsHeaders
      });
    }

    // GET: return list of keys with their values
    const entries: Array<{ key: string; preview: string }> = [];
    for (const key of keys.slice(0, 50)) { // max 50 in UI
      const valRes = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      const valData = await valRes.json() as { result: string | null };
      entries.push({
        key: key.replace(/^chat:/, ''),
        preview: (valData.result ?? '').slice(0, 120) + '...',
      });
    }

    return new Response(JSON.stringify({
      count: keys.length,
      keys: entries,
      upstashConfigured: true,
    }), { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}
