import { createClient } from '@supabase/supabase-js';

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Falta configuración de DB' }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Obtener los 30 perfiles más activos recientemente para mayor visibilidad
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name, tokens, updated_at, is_premium, subscription_status')
      .order('updated_at', { ascending: false })
      .limit(30);

    if (profilesError) throw profilesError;

    // Calcular fecha de hoy en CDMX sin depender de Edge Runtime ICU
    const now = new Date();
    // Offset para CDMX (UTC-6)
    const mexicoTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
    const localToday = mexicoTime.toISOString().split('T')[0];

    let usage: any[] | null = null;
    try {
      const { data: usageData, error: usageError } = await supabase
        .from('daily_usage')
        .select('user_id, count')
        .eq('date', localToday);
      
      if (!usageError) usage = usageData;
    } catch (e) {
      console.warn('Silent error fetching usage:', e);
    }

    // Combinar datos
    const activeUsers = profiles.map(p => {
      const userUsage = usage?.find(u => u.user_id === p.id);
      return {
        ...p,
        todayCount: userUsage?.count || 0
      };
    });

    return new Response(JSON.stringify({ users: activeUsers }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
