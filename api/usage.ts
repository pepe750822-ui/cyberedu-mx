import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'nodejs',
};

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

export default async function handler(req: Request) {
// @ts-ignore
  const APP_URL = process.env.APP_URL || 'https://cyberedu-mx.vercel.app';
  const allowedOrigins = [
    'https://cyberedumx.lovable.app',
    APP_URL,
    'http://localhost:5173'
  ];
  const origin = req.headers.get('origin');
  const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  const userId = getUserIdFromToken(authHeader);
// @ts-ignore
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// @ts-ignore
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!userId || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Sesión inválida o configuración faltante' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const todayInMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
  const tzDate = new Date(todayInMexico);
  const localToday = tzDate.getFullYear() + "-" + String(tzDate.getMonth() + 1).padStart(2, '0') + "-" + String(tzDate.getDate()).padStart(2, '0');

  const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
    Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

  let profileResult, usageResult;
  try {
    [profileResult, usageResult] = await withTimeout(Promise.all([
      supabase.from('profiles').select('tokens, subscription_status, is_premium').eq('id', userId).single(),
      supabase.from('daily_usage').select('count').eq('user_id', userId).eq('date', localToday).single()
    ]), 8000);
  } catch {
    return new Response(JSON.stringify({ error: 'Tiempo de espera agotado' }), {
      status: 504,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const profile = (profileResult.data as Record<string, any>) || {};
  const isSubscriber = profile.subscription_status === 'active' || profile.is_premium === true;
  const tokens = profile.tokens || 0;
  const used = usageResult.data?.count || 0;
  const dailyLimit = 25;

  return new Response(JSON.stringify({
    used,
    limit: dailyLimit,
    tokens,
    isSubscriber
  }), {
    status: 200,
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    },
  });
}
