-- Migration: Create daily_challenges table and initial data
CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings
    correct_index INTEGER NOT NULL,
    area TEXT NOT NULL,
    active_date DATE UNIQUE, -- To specify which day this challenge belongs to
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active daily challenges"
ON public.daily_challenges FOR SELECT
USING (true);

-- Initial seed data
INSERT INTO public.daily_challenges (question, options, correct_index, area, active_date)
VALUES 
('¿Cuál es el valor de x en la ecuación 2x + 5 = 15?', '["x = 10", "x = 5", "x = 2", "x = 20"]', 1, 'Matemáticas', CURRENT_DATE),
('¿En qué año inició la Revolución Mexicana?', '["1810", "1910", "1921", "1857"]', 1, 'Historia', CURRENT_DATE + INTERVAL '1 day'),
('Elemento químico más abundante en el universo.', '["Oxígeno", "Helio", "Hidrógeno", "Carbono"]', 2, 'Química', CURRENT_DATE + INTERVAL '2 days'),
('Organelo responsable de la respiración celular.', '["Núcleo", "Ribosoma", "Mitocondria", "Cloroplasto"]', 2, 'Biología', CURRENT_DATE + INTERVAL '3 days'),
('¿Cuál es la fórmula de la Segunda Ley de Newton?', '["F = m/a", "F = m-a", "F = m+a", "F = m*a"]', 3, 'Física', CURRENT_DATE + INTERVAL '4 days');
