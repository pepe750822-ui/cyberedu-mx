-- Migration: Implement token-based system for AI Chat
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tokens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_daily_free DATE,
ADD COLUMN IF NOT EXISTS daily_questions_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP DEFAULT now();

COMMENT ON COLUMN public.profiles.tokens IS 'Créditos disponibles para usar el Tutor IA.';
COMMENT ON COLUMN public.profiles.trial_used IS 'Indica si el usuario ya agotó su periodo de prueba de 7 días.';
COMMENT ON COLUMN public.profiles.daily_questions_count IS 'Contador de preguntas realizadas en el día actual.';
