import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

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
    // Obtener todos los perfiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name, tokens, updated_at, is_premium, subscription_status')
      .order('updated_at', { ascending: false })
      .limit(100);

    if (profilesError) throw profilesError;

    // Calcular fecha de hoy en CDMX (UTC-6)
    const now = new Date();
    const mexicoTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
    const localToday = mexicoTime.toISOString().split('T')[0];

    // Uso de hoy
    let todayUsage: any[] = [];
    try {
      const { data, error } = await supabase
        .from('daily_usage')
        .select('user_id, count')
        .eq('date', localToday);
      if (!error && data) todayUsage = data;
    } catch (e) {
      console.warn('Error fetching today usage:', e);
    }

    // Uso histórico TOTAL agrupado por usuario (toda la tabla daily_usage)
    let allTimeUsage: any[] = [];
    try {
      const { data, error } = await supabase
        .from('daily_usage')
        .select('user_id, count');
      if (!error && data) allTimeUsage = data;
    } catch (e) {
      console.warn('Error fetching all-time usage:', e);
    }

    // Agrupar uso histórico por user_id
    const totalByUser: Record<string, number> = {};
    for (const row of allTimeUsage) {
      if (!row.user_id) continue;
      totalByUser[row.user_id] = (totalByUser[row.user_id] || 0) + (row.count || 0);
    }

    // Combinar con perfiles
    const activeUsers = profiles
      .map(p => ({
        ...p,
        todayCount: todayUsage.find(u => u.user_id === p.id)?.count || 0,
        totalCount: totalByUser[p.id] || 0,
      }))
      // Ordenar: primero los que tienen uso histórico, luego por fecha
      .sort((a, b) => {
        if (b.totalCount !== a.totalCount) return b.totalCount - a.totalCount;
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
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
