import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!ADMIN_SECRET || !TELEGRAM_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: 'Configuración incompleta' }), { status: 500 });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  let body: { message: string; segment?: 'all' | 'linked' | 'guest' };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body inválido' }), { status: 400 });
  }

  const { message, segment = 'all' } = body;
  if (!message || message.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Mensaje vacío' }), { status: 400 });
  }
  if (message.length > 4096) {
    return new Response(JSON.stringify({ error: 'Mensaje muy largo (máx 4096 chars)' }), { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });

  let query = supabase
    .from('telegram_users')
    .select('chat_id, user_id')
    .eq('blocked', false);

  if (segment === 'linked') {
    query = query.not('user_id', 'is', null);
  } else if (segment === 'guest') {
    query = query.is('user_id', null);
  }

  const { data: users, error: dbError } = await query;

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 500 });
  }

  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
  let sent = 0;
  let failed = 0;
  let blocked = 0;

  for (const user of users ?? []) {
    try {
      const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: user.chat_id,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (res.status === 403) {
        blocked++;
        await supabase
          .from('telegram_users')
          .update({ blocked: true })
          .eq('chat_id', user.chat_id);
      } else if (res.ok) {
        sent++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }

    // Telegram rate limit: max 30 msg/sec → 50ms delay
    await delay(50);
  }

  return new Response(
    JSON.stringify({ sent, failed, blocked, total: (users ?? []).length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
