export const config = {
  runtime: 'edge',
};

const SUSPICIOUS_PATTERN = /^(kulero|usuario|test|bot|spam|fake)\d+@/i;

export default async function handler(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://www.cyberedumx.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ allowed: false, reason: 'method_not_allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  let body: { email?: string; honeypot?: string; elapsed?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ allowed: false, reason: 'invalid_body' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { email, honeypot, elapsed } = body;

  if (honeypot) {
    return new Response(JSON.stringify({ allowed: false, reason: 'bot_detected' }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (typeof elapsed === 'number' && elapsed < 3000) {
    return new Response(JSON.stringify({ allowed: false, reason: 'too_fast' }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (typeof email === 'string' && SUSPICIOUS_PATTERN.test(email)) {
    return new Response(JSON.stringify({ allowed: false, reason: 'suspicious_email' }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ allowed: true }), {
    status: 200,
    headers: corsHeaders,
  });
}
