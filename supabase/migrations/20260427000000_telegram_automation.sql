-- Telegram Automation: sequences queue + broadcast log
-- Date: 2026-04-27

-- 1. Message queue for time-delayed automated messages
CREATE TABLE IF NOT EXISTS public.telegram_sequences (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id     text        NOT NULL,
  sequence_type text      NOT NULL,  -- 'welcome','reactivation','countdown','limit_promo','weekly_tip'
  step        integer     NOT NULL DEFAULT 1,
  scheduled_at timestamptz NOT NULL,
  sent_at     timestamptz,
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tg_seq_chat_id   ON public.telegram_sequences(chat_id);
CREATE INDEX IF NOT EXISTS idx_tg_seq_pending   ON public.telegram_sequences(scheduled_at) WHERE sent_at IS NULL;

-- 2. Log of every automated message sent (for dedup + metrics)
CREATE TABLE IF NOT EXISTS public.telegram_broadcast_log (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id      text        NOT NULL,
  message_type text        NOT NULL,
  message_preview text,
  sent_at      timestamptz DEFAULT now() NOT NULL,
  success      boolean     DEFAULT true NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tg_log_chat_id ON public.telegram_broadcast_log(chat_id);
CREATE INDEX IF NOT EXISTS idx_tg_log_sent_at ON public.telegram_broadcast_log(sent_at);

-- 3. Track when user last sent a message (for 2h anti-spam + reactivation)
ALTER TABLE public.telegram_users
  ADD COLUMN IF NOT EXISTS last_user_message_at timestamptz;

-- 4. RLS: only service role key accesses these tables
ALTER TABLE public.telegram_sequences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_broadcast_log ENABLE ROW LEVEL SECURITY;
