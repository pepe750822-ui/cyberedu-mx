-- Migration: Add area column to simulador_results
ALTER TABLE public.simulador_results 
ADD COLUMN IF NOT EXISTS area TEXT;

COMMENT ON COLUMN public.simulador_results.area IS 'Área o materia filtrada durante el simulacro (e.g., all, Química, Matemáticas).';
