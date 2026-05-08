-- Migration: Create advanced simulator analytics views
CREATE OR REPLACE VIEW public.simulador_global_stats AS
SELECT 
    COUNT(*) as total_examenes,
    AVG(porcentaje) as promedio_global,
    COUNT(DISTINCT user_id) as usuarios_unicos,
    (SELECT escuela_meta FROM public.simulador_results WHERE escuela_meta != 'Ninguna' GROUP BY escuela_meta ORDER BY COUNT(*) DESC LIMIT 1) as escuela_mas_buscada,
    COUNT(*) FILTER (WHERE modo = 'full') as examenes_completos,
    COUNT(*) FILTER (WHERE modo = 'practice') as practicas_rapidas
FROM public.simulador_results;

-- This view aggregates per-area stats from the JSONB field
-- Note: It will only work for new results that have the JSONB breakdown
CREATE OR REPLACE VIEW public.simulador_area_performance AS
WITH AreaStats AS (
    SELECT 
        (jsonb_each(resultados_por_area)).key as materia,
        ((jsonb_each(resultados_por_area)).value->>'correctas')::int as correctas,
        ((jsonb_each(resultados_por_area)).value->>'total')::int as total
    FROM public.simulador_results
    WHERE resultados_por_area IS NOT NULL
)
SELECT 
    materia,
    AVG((correctas::float / NULLIF(total, 0)) * 100) as promedio_acierto,
    SUM(correctas) as total_aciertos,
    SUM(total) as total_preguntas,
    COUNT(*) as veces_evaluada
FROM AreaStats
GROUP BY materia
ORDER BY promedio_acierto ASC;
