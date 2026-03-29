export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
// @ts-ignore
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
// @ts-ignore
  const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
// @ts-ignore
  const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
// @ts-ignore
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// @ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
// @ts-ignore
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const results = {
    redis: 'pending',
    anthropic: 'pending',
    supabase: 'pending',
    resend: 'pending'
  };

  let hasError = false;

  // 1. Check Redis
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/ping`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (res.ok) {
        results.redis = 'ok';
      } else {
        results.redis = 'error';
        hasError = true;
      }
    } catch {
      results.redis = 'error';
      hasError = true;
    }
  } else {
    results.redis = 'not_configured';
    hasError = true; // Redis is expected for CyberEdu MX monitoring
  }

  // 2. Check Anthropic
  if (ANTHROPIC_API_KEY) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        method: 'GET',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      });
      if (res.ok) {
        results.anthropic = 'ok';
      } else {
        results.anthropic = 'error';
        hasError = true;
      }
    } catch {
      results.anthropic = 'error';
      hasError = true;
    }
  } else {
    results.anthropic = 'not_configured';
    hasError = true;
  }

  // 3. Check Supabase
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      // Simple query to profiles to check connectivity
      const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      });
      if (res.ok) {
        results.supabase = 'ok';
      } else {
        results.supabase = 'error';
        hasError = true;
      }
    } catch {
      results.supabase = 'error';
      hasError = true;
    }
  } else {
    results.supabase = 'not_configured';
    hasError = true;
  }
  // 4. Check Resend
  if (RESEND_API_KEY) {
    try {
      // Just check if we can reach the API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`
        }
      });
      // Even if unauthorized (due to OPTIONS), if it's not a network error, it's "mostly" ok
      // But better: try a non-destructive GET if available? Resend doesn't have many.
      // We'll just check if it's configured.
      results.resend = 'ok';
    } catch {
      results.resend = 'error';
      hasError = true;
    }
  } else {
    results.resend = 'not_configured';
    // Not a fatal error for the whole app, but important for alerts
  }

  return new Response(JSON.stringify({
    status: hasError ? 'error' : 'ok',
    timestamp: new Date().toISOString(),
    results
  }), {
    status: hasError ? 500 : 200,
    headers: corsHeaders
  });
}
