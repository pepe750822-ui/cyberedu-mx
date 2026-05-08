-- Migration: Create simulador_results table and policies
-- This table tracks exam results from the Simulador Pro

CREATE TABLE IF NOT EXISTS public.simulador_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    aciertos INTEGER NOT NULL DEFAULT 0,
    total_preguntas INTEGER NOT NULL DEFAULT 0,
    porcentaje NUMERIC(5,2),
    modo TEXT, -- 'completo' or 'rapido'
    banco TEXT, -- 'simulador' or 'banco'
    fecha TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    escuela_meta TEXT,
    puntaje_meta INTEGER,
    resultados_por_area JSONB,
    
    -- Safety constraint
    CONSTRAINT valid_score CHECK (aciertos <= total_preguntas)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sim_results_user ON public.simulador_results(user_id);
CREATE INDEX IF NOT EXISTS idx_sim_results_score ON public.simulador_results(aciertos DESC);

-- Enable RLS
ALTER TABLE public.simulador_results ENABLE ROW LEVEL SECURITY;

-- 1. Users can insert their own results
DROP POLICY IF EXISTS "Users can insert own results" ON public.simulador_results;
CREATE POLICY "Users can insert own results" ON public.simulador_results
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 2. Users can view their own full results
DROP POLICY IF EXISTS "Users can view own results" ON public.simulador_results;
CREATE POLICY "Users can view own results" ON public.simulador_results
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 3. Authenticated users can view basic result info for rankings
DROP POLICY IF EXISTS "Authenticated users can view ranking" ON public.simulador_results;
CREATE POLICY "Authenticated users can view ranking" ON public.simulador_results
    FOR SELECT TO authenticated
    USING (true);

-- 4. Admin manage all
DROP POLICY IF EXISTS "Admin manage simulador_results" ON public.simulador_results;
CREATE POLICY "Admin manage simulador_results" ON public.simulador_results
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

COMMENT ON TABLE public.simulador_results IS 'Almacena los resultados de los exámenes realizados en el Simulador Pro.';
