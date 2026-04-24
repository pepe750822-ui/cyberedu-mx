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

  // Auth check
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

  try {
    // 1. Obtener todos los usuarios de Telegram
    const { data: tgUsers, error: tgError } = await supabase
      .from('telegram_users')
      .select('*, profiles(email, name, tokens, subscription_status)')
      .order('created_at', { ascending: false });

    if (tgError) throw tgError;

    // 2. Obtener uso acumulado (opcionalmente podrías filtrar por hoy)
    const { data: usageData, error: usageError } = await supabase
      .from('telegram_guest_usage')
      .select('*');

    if (usageError) throw usageError;

    // Agrupar uso por chat_id
    const usageMap: Record<string, number> = {};
    const today = new Date().toISOString().split('T')[0];
    const todayUsageMap: Record<string, number> = {};

    for (const row of usageData) {
      usageMap[row.chat_id] = (usageMap[row.chat_id] || 0) + (row.questions_count || 0);
      if (row.usage_date === today) {
        todayUsageMap[row.chat_id] = row.questions_count || 0;
      }
    }

    const stats = tgUsers.map(u => ({
      ...u,
      total_questions: usageMap[u.chat_id] || 0,
      today_questions: todayUsageMap[u.chat_id] || 0,
    }));

    return new Response(JSON.stringify({ stats }), {
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
