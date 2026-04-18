import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const ADMIN_EMAILS = ['pepe750822@gmail.com'];

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Falta configuración de DB' }), { status: 500 });
  }

  // --- Auth: verificar que el caller es admin ---
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }
  const token = authHeader.slice(7);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: { user: callerUser }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !callerUser) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
  }
  if (!ADMIN_EMAILS.includes(callerUser.email?.toLowerCase() ?? '')) {
    return new Response(JSON.stringify({ error: 'Acceso denegado' }), { status: 403 });
  }
  // --- Fin auth ---

  try {
    // Perfiles con created_at incluido
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name, tokens, created_at, updated_at, is_premium, subscription_status')
      .order('updated_at', { ascending: false })
      .limit(100);

    if (profilesError) throw profilesError;

    // last_sign_in_at desde auth.users (fuente autoritativa de última sesión)
    const { data: authData, error: authUsersError } = await supabase.auth.admin.listUsers({ perPage: 100 });
    const authUsersMap: Record<string, string | null> = {};
    if (!authUsersError && authData?.users) {
      for (const u of authData.users) {
        authUsersMap[u.id] = u.last_sign_in_at ?? null;
      }
    }

    // Calcular fecha de hoy en CDMX (UTC-6)
    const now = new Date();
    const mexicoTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
    const localToday = mexicoTime.toISOString().split('T')[0];

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

    let allTimeUsage: any[] = [];
    try {
      const { data, error } = await supabase
        .from('daily_usage')
        .select('user_id, count');
      if (!error && data) allTimeUsage = data;
    } catch (e) {
      console.warn('Error fetching all-time usage:', e);
    }

    const totalByUser: Record<string, number> = {};
    for (const row of allTimeUsage) {
      if (!row.user_id) continue;
      totalByUser[row.user_id] = (totalByUser[row.user_id] || 0) + (row.count || 0);
    }

    const activeUsers = profiles
      .map(p => ({
        ...p,
        last_sign_in_at: authUsersMap[p.id] ?? null,
        todayCount: todayUsage.find(u => u.user_id === p.id)?.count || 0,
        totalCount: totalByUser[p.id] || 0,
      }))
      .sort((a, b) => {
        if (b.totalCount !== a.totalCount) return b.totalCount - a.totalCount;
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      });

    return new Response(JSON.stringify({ users: activeUsers }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
