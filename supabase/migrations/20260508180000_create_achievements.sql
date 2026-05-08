-- Migration: Create achievements system
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL, -- Emoji or Lucide icon name
    category TEXT NOT NULL, -- 'streak', 'score', 'activity'
    criteria_type TEXT NOT NULL, -- 'streak_days', 'min_percentage', 'exams_count'
    criteria_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Users can see their own earned achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Initial Data
INSERT INTO public.achievements (id, title, description, icon, category, criteria_type, criteria_value)
VALUES 
    ('first_exam', 'Primer Paso', 'Completa tu primer simulacro profesional.', '🚀', 'activity', 'exams_count', 1),
    ('streak_7', 'Racha de Fuego', 'Mantén una racha de 7 días de estudio.', '🔥', 'streak', 'streak_days', 7),
    ('score_90_math', 'Genio Matemático', 'Obtén más del 90% en el área de Matemáticas.', '📐', 'score', 'min_percentage', 90),
    ('marathon_10', 'Maratonista', 'Completa 10 simulacros en total.', '🏃', 'activity', 'exams_count', 10),
    ('meta_reached', 'Meta Alcanzada', 'Supera el puntaje requerido para tu escuela meta.', '🎯', 'score', 'meta_success', 1)
ON CONFLICT (id) DO NOTHING;
