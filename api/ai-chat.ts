export const config = {
  runtime: 'edge',
};

// ─── Upstash Redis helpers (REST API, no package needed) ───────
// @ts-ignore
const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
// @ts-ignore
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
// @ts-ignore
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const MEM_CACHE = new Map<string, { content: string; ts: number }>();
const MEM_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.replace('Bearer ', '').split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

async function cacheGet(key: string): Promise<string | null> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json() as { result: string | null };
        return data.result ?? null;
      }
    } catch { /* fall through */ }
  }
  const entry = MEM_CACHE.get(key);
  if (entry && Date.now() - entry.ts < MEM_TTL_MS) return entry.content;
  return null;
}

async function cacheSet(key: string, value: string, ttlSeconds = 86400): Promise<void> {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      await fetch(`${UPSTASH_URL}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['SET', key, value, 'EX', ttlSeconds])
      });
    } catch { /* fall through */ }
  }
  MEM_CACHE.set(key, { content: value, ts: Date.now() });
}

async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return { allowed: true, remaining: 999 };
  const today = new Date().toISOString().split('T')[0];
  const rateLimitKey = `ratelimit:${userId}:${today}`;
  const LIMIT = 200;
  try {
    const res = await fetch(`${UPSTASH_URL}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['INCR', rateLimitKey])
    });
    if (res.ok) {
      const data = await res.json() as { result: number };
      if (data.result === 1) {
        await fetch(`${UPSTASH_URL}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(['EXPIRE', rateLimitKey, '86400'])
        });
      }
      return { allowed: data.result <= LIMIT, remaining: Math.max(0, LIMIT - data.result) };
    }
  } catch (e) { console.error('Redis Rate Limit Error:', e); }
  return { allowed: true, remaining: 999 };
}

export default async function handler(req: Request) {
  // @ts-ignore
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API Key de Anthropic no configurada' }), { status: 500 });
  }

  const allowedOrigins = ['https://cyberedumx.lovable.app', 'https://www.cyberedumx.com', 'http://localhost:5173'];
  const origin = req.headers.get('origin');
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  // --- AUTH & TELEGRAM LOGIC ---
  const authHeader = req.headers.get('Authorization');
  let body;
  try { body = await req.json(); } catch { body = {}; }
  
  const isTelegram = body.isTelegram === true;
  const userId = isTelegram ? body.userId : getUserIdFromToken(authHeader);
  
  // @ts-ignore
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  // @ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isTelegram && !userId) {
    return new Response(JSON.stringify({ error: 'Sesión inválida' }), { status: 401, headers: corsHeaders });
  }

  // --- SUPABASE REQUEST HELPER ---
  const supabaseRequest = async (path: string, options: any = {}) => {
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...options.headers,
      }
    });
    const text = await res.text();
    try { return { data: JSON.parse(text), error: null }; } catch { return { data: text, error: null }; }
  };

  // --- TOKEN DEDUCTION (If registered) ---
  if (userId) {
    const { data: profile } = await supabaseRequest(`profiles?id=eq.${userId}&select=*`);
    const userProfile = profile?.[0];
    
    if (userProfile && userProfile.subscription_status !== 'active' && userProfile.is_premium !== true) {
      const currentTokens = Number(userProfile.tokens || 0);
      if (currentTokens > 0) {
        await supabaseRequest(`profiles?id=eq.${userId}`, {
          method: 'PATCH',
          body: JSON.stringify({ tokens: currentTokens - 1, updated_at: new Date().toISOString() })
        });
      }
    }
  }

  // --- AI STREAMING ---
  const { messages, context } = body;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: messages,
        stream: true,
        system: `Eres CyberAgent, el mentor de CyberEdu MX. 
        Contexto actual: ${JSON.stringify(context || {})}
        Reglas: Cita siempre el temario ECOEMS. Usa <recommendation> al final.`
      }),
    });

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
}
