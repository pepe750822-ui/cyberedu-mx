import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'nodejs',
};

// ── Constants ─────────────────────────────────────────────────────────────────

const EXAM_DATE = new Date('2026-06-20T06:00:00Z'); // midnight CST

const COUNTDOWN_MESSAGES: Record<number, string> = {
  30: '📅 *30 días para el ECOEMS.* Tip: enfócate en Matemáticas y Habilidad Verbal primero 🎯',
  15: '⚡ *15 días.* ¿Ya hiciste el simulador completo? → cyberedumx.com/simulador-pro',
  7:  '🔥 *7 días.* Repasa tus áreas débiles con el AITutor. ¿En qué materia necesitas ayuda?',
  3:  '💪 *3 días.* Descansa bien, come bien, repasa conceptos clave. ¡Tú puedes!',
  1:  '🌟 Mañana es el gran día. Duerme temprano. ¡Todo tu esfuerzo valió la pena!',
  0:  '🎯 *HOY ES EL ECOEMS.* Lee bien cada pregunta. ¡Mucho éxito! CyberEdu MX cree en ti 💙',
};

const WEEKLY_TIPS = [
  '💡 *Matemáticas:* La proporcionalidad directa e inversa siempre cae en el ECOEMS \\[MAT 2\\.10\\]',
  '💡 *Historia:* La Revolución Mexicana 1910\\-1917 es el tema más frecuente \\[HIS\\-M 9\\.1\\]',
  '💡 *Biología:* Fotosíntesis y respiración celular aparecen cada año \\[BIO 3\\.1\\]',
  '💡 *Física:* Ley de Newton y Ley de Ohm son favoritas del examen \\[FIS 2\\.1\\]',
  '💡 *Química:* Tabla periódica y enlaces químicos \\[QUI 2\\.1\\] — pregúntame sobre cualquier elemento',
  '💡 *Habilidad Verbal:* Lee el texto completo antes de responder\\. El contexto lo es todo',
];

const WELCOME_DAY2 =
  '¿Sabías que tenemos simulador ECOEMS con 128 preguntas? Pruébalo gratis 🎯\n→ cyberedumx.com/simulador-pro';

const WELCOME_DAY3 =
  '💡 Tip del día: El AITutor puede mostrarte laboratorios interactivos de física, química y matemáticas.\nPregúntame *"Ley de Ohm"* y mira la magia ⚡';

const LIMIT_PROMO =
  'Ya usaste tus preguntas de hoy 🎓\n¿Quieres ilimitadas? Consigue tokens desde $29 MXN\n→ cyberedumx.com/tokens';

const DELAY_MS = 50; // respect Telegram 30 msg/sec limit

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000);
}

async function logSent(
  supabase: SupabaseClient,
  chatId: string,
  messageType: string,
  message: string,
  success: boolean
) {
  await supabase.from('telegram_broadcast_log').insert({
    chat_id: chatId,
    message_type: messageType,
    message_preview: message.slice(0, 200),
    success,
  });
}

async function markBlocked(supabase: SupabaseClient, chatId: string) {
  await supabase.from('telegram_users').update({ blocked: true }).eq('chat_id', chatId);
}

// ── Main handler ──────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ── Diagnostic: log env var presence (never log actual values) ───────────────
  const CRON_SECRET  = process.env.CRON_SECRET;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  const TG_TOKEN     = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL  || process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('[CRON] env check:', JSON.stringify({
    TELEGRAM_BOT_TOKEN:        !!process.env.TELEGRAM_BOT_TOKEN,
    VITE_TELEGRAM_BOT_TOKEN:   !!process.env.VITE_TELEGRAM_BOT_TOKEN,
    TG_TOKEN_resolved:         !!TG_TOKEN,
    SUPABASE_URL:              !!process.env.SUPABASE_URL,
    VITE_SUPABASE_URL:         !!process.env.VITE_SUPABASE_URL,
    SUPABASE_URL_resolved:     !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_KEY,
    CRON_SECRET:               !!CRON_SECRET,
    ADMIN_SECRET:              !!ADMIN_SECRET,
  }));

  // Auth: Bearer header OR ?secret= query param (for manual testing)
  const authHeader = (req.headers['authorization'] as string) || '';
  const headerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  const queryToken  = (req.query?.secret as string) || '';
  const token = headerToken || queryToken;

  const validSecrets = [CRON_SECRET, ADMIN_SECRET].filter(Boolean) as string[];
  console.log('[CRON] auth header present:', !!authHeader, '| query secret present:', !!queryToken, '| valid secrets count:', validSecrets.length);

  if (!validSecrets.includes(token)) {
    console.log('[CRON] auth FAILED — token does not match any valid secret');
    return res.status(401).json({ error: 'No autorizado' });
  }
  console.log('[CRON] auth OK');

  if (!TG_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
    const missing = [
      !TG_TOKEN     && 'TELEGRAM_BOT_TOKEN',
      !SUPABASE_URL && 'SUPABASE_URL',
      !SUPABASE_KEY && 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean);
    console.log('[CRON] missing env vars:', missing);
    return res.status(500).json({ error: `Configuración incompleta: faltan ${missing.join(', ')}` });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  const now = new Date();

  // Date helpers
  const todayUtc      = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const dayOfWeek     = now.getUTCDay();                 // 0=Sun 1=Mon
  const weekNum       = isoWeekNumber(now);
  const daysUntilExam = daysBetween(now, EXAM_DATE);

  // ── Load data ────────────────────────────────────────────────────────────────

  // Use `neq(true)` instead of `eq(false)` so rows where blocked IS NULL are included.
  // PostgreSQL: NULL = false → false, NULL != true → true. This matches all non-blocked rows.
  const { data: allUsers, error: usersError } = await supabase
    .from('telegram_users')
    .select('chat_id, user_id, created_at, last_user_message_at, blocked')
    .neq('blocked', true);

  console.log('[CRON] telegram_users fetched:', allUsers?.length ?? 0, '| error:', usersError?.message ?? null);

  if (usersError) {
    return res.status(500).json({ error: `Error al leer telegram_users: ${usersError.message}` });
  }

  if (!allUsers || allUsers.length === 0) {
    return res.status(200).json({ sent: 0, skipped: 0, message: 'No hay usuarios activos' });
  }

  // Recent broadcast log (last 30 days) for dedup
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString();
  const { data: recentLog } = await supabase
    .from('telegram_broadcast_log')
    .select('chat_id, message_type, sent_at')
    .gte('sent_at', thirtyDaysAgo)
    .eq('success', true);

  // Map<chat_id, entries[]>
  const logByChatId = new Map<string, Array<{ message_type: string; sent_at: string }>>();
  for (const entry of recentLog ?? []) {
    if (!logByChatId.has(entry.chat_id)) logByChatId.set(entry.chat_id, []);
    logByChatId.get(entry.chat_id)!.push(entry);
  }

  // Users already messaged today
  const messagedToday = new Set<string>();
  for (const [chatId, entries] of logByChatId) {
    if (entries.some(e => e.sent_at.startsWith(todayUtc))) messagedToday.add(chatId);
  }

  // Last usage date from telegram_guest_usage
  const { data: usageData } = await supabase
    .from('telegram_guest_usage')
    .select('chat_id, usage_date')
    .order('usage_date', { ascending: false });

  const lastUsageByChat = new Map<string, string>();
  for (const row of usageData ?? []) {
    if (!lastUsageByChat.has(row.chat_id)) lastUsageByChat.set(row.chat_id, row.usage_date);
  }

  // ── Anti-spam helpers ────────────────────────────────────────────────────────

  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  function wasRecentlyActive(user: (typeof allUsers)[0]): boolean {
    if (!user.last_user_message_at) return false;
    return new Date(user.last_user_message_at) > twoHoursAgo;
  }

  function alreadySentInCurrentPeriod(chatId: string, msgType: string): boolean {
    const entries = logByChatId.get(chatId) ?? [];
    const user = allUsers.find(u => u.chat_id === chatId);
    const lastActive = user?.last_user_message_at ? new Date(user.last_user_message_at) : null;
    return entries.some(e => {
      if (e.message_type !== msgType) return false;
      if (!lastActive) return true;
      return new Date(e.sent_at) > lastActive;
    });
  }

  function canSend(chatId: string): boolean {
    if (messagedToday.has(chatId)) return false;
    const user = allUsers.find(u => u.chat_id === chatId);
    if (!user) return false;
    return !wasRecentlyActive(user);
  }

  function markSentToday(chatId: string) { messagedToday.add(chatId); }

  // ── Stats ────────────────────────────────────────────────────────────────────
  let sent = 0, skipped = 0, errors = 0;

  async function dispatch(chatId: string, msgType: string, message: string) {
    if (!canSend(chatId)) { skipped++; return; }

    const tgRes = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
    });

    const ok        = tgRes.ok;
    const isBlocked = tgRes.status === 403;

    if (isBlocked) {
      await markBlocked(supabase, chatId);
      errors++;
    } else if (ok) {
      sent++;
      markSentToday(chatId);
    } else {
      errors++;
    }

    await logSent(supabase, chatId, msgType, message, ok && !isBlocked);
    await sleep(DELAY_MS);
  }

  // ── STEP 1: Process pending queue (limit_promo) ───────────────────────────────
  const { data: pending } = await supabase
    .from('telegram_sequences')
    .select('id, chat_id, sequence_type')
    .is('sent_at', null)
    .lte('scheduled_at', now.toISOString());

  for (const seq of pending ?? []) {
    if (seq.sequence_type !== 'limit_promo') continue;

    const entries = logByChatId.get(seq.chat_id) ?? [];
    const sentLast24h = entries.some(
      e => e.message_type === 'limit_promo' &&
           new Date(e.sent_at) > new Date(now.getTime() - 86_400_000)
    );
    const user = allUsers.find(u => u.chat_id === seq.chat_id);
    if (!sentLast24h && user && !wasRecentlyActive(user)) {
      const tgRes = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: seq.chat_id, text: LIMIT_PROMO, parse_mode: 'Markdown' }),
      });
      const ok = tgRes.ok && tgRes.status !== 403;
      if (tgRes.status === 403) await markBlocked(supabase, seq.chat_id);
      await logSent(supabase, seq.chat_id, 'limit_promo', LIMIT_PROMO, ok);
      if (ok) { sent++; markSentToday(seq.chat_id); }
      await sleep(DELAY_MS);
    }

    await supabase
      .from('telegram_sequences')
      .update({ sent_at: now.toISOString() })
      .eq('id', seq.id);
  }

  // ── STEP 2: Welcome sequences (day 2 and day 3) ───────────────────────────────
  for (const user of allUsers) {
    const daysOld = daysBetween(new Date(user.created_at), now);
    if (daysOld === 1 && !alreadySentInCurrentPeriod(user.chat_id, 'welcome_day2')) {
      await dispatch(user.chat_id, 'welcome_day2', WELCOME_DAY2);
    } else if (daysOld === 2 && !alreadySentInCurrentPeriod(user.chat_id, 'welcome_day3')) {
      await dispatch(user.chat_id, 'welcome_day3', WELCOME_DAY3);
    }
  }

  // ── STEP 3: Reactivation sequences ───────────────────────────────────────────
  const countdownSentToday = new Set(
    [...messagedToday].filter(chatId =>
      (logByChatId.get(chatId) ?? []).some(
        e => e.message_type === 'countdown' && e.sent_at.startsWith(todayUtc)
      )
    )
  );

  for (const user of allUsers) {
    if (countdownSentToday.has(user.chat_id)) continue;

    const lastUsageDate = lastUsageByChat.get(user.chat_id);
    const candidates = [
      user.last_user_message_at,
      lastUsageDate ? `${lastUsageDate}T12:00:00Z` : null,
      user.created_at,
    ].filter(Boolean) as string[];
    const lastActive    = new Date(Math.max(...candidates.map(d => new Date(d).getTime())));
    const daysInactive  = daysBetween(lastActive, now);

    if (daysInactive >= 3 && daysInactive < 7) {
      if (!alreadySentInCurrentPeriod(user.chat_id, 'reactivation_3d')) {
        const msg = `¡Oye! El ECOEMS es el 20 de junio y quedan *${daysUntilExam} días*. ¿Seguimos estudiando? 📚`;
        await dispatch(user.chat_id, 'reactivation_3d', msg);
      }
    } else if (daysInactive >= 7 && daysInactive < 14) {
      if (!alreadySentInCurrentPeriod(user.chat_id, 'reactivation_7d')) {
        await dispatch(user.chat_id, 'reactivation_7d',
          'Te extrañamos 😢 Tienes *15 preguntas gratis* esperándote hoy. Un tema rápido y listo 💪');
      }
    } else if (daysInactive >= 14) {
      if (!alreadySentInCurrentPeriod(user.chat_id, 'reactivation_14d')) {
        await dispatch(user.chat_id, 'reactivation_14d',
          'Último aviso — el examen se acerca. CyberEdu MX es *GRATIS*. Solo entra y pregunta algo 🚀');
      }
    }
  }

  // ── STEP 4: Countdown to exam ─────────────────────────────────────────────────
  if (daysUntilExam in COUNTDOWN_MESSAGES) {
    const msg = COUNTDOWN_MESSAGES[daysUntilExam];
    for (const user of allUsers) {
      if (!alreadySentInCurrentPeriod(user.chat_id, 'countdown')) {
        await dispatch(user.chat_id, 'countdown', msg);
      }
    }
  }

  // ── STEP 5: Weekly tips (Mondays only) ───────────────────────────────────────
  if (dayOfWeek === 1) {
    const tipIndex = weekNum % WEEKLY_TIPS.length;
    const tip      = WEEKLY_TIPS[tipIndex];
    const tipType  = `weekly_tip_${tipIndex}`;

    for (const user of allUsers) {
      const entries = logByChatId.get(user.chat_id) ?? [];
      const sentThisWeek = entries.some(
        e => e.message_type === tipType && daysBetween(new Date(e.sent_at), now) < 7
      );
      if (!sentThisWeek) await dispatch(user.chat_id, tipType, tip);
    }
  }

  return res.status(200).json({
    sent,
    skipped,
    errors,
    total: allUsers.length,
    daysUntilExam,
    isMonday:     dayOfWeek === 1,
    weekTip:      dayOfWeek === 1 ? weekNum % WEEKLY_TIPS.length : null,
    countdownDay: daysUntilExam in COUNTDOWN_MESSAGES ? daysUntilExam : null,
    processedAt:  now.toISOString(),
  });
}
