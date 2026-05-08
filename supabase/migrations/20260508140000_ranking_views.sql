-- Migration: Create ranking views for simulator
CREATE OR REPLACE VIEW public.simulador_ranking_puntaje AS
SELECT 
    user_id,
    MAX(porcentaje) as porcentaje,
    MAX(aciertos) as aciertos,
    MAX(total_preguntas) as total_preguntas,
    area
FROM public.simulador_results
WHERE fecha > now() - interval '7 days'
GROUP BY user_id, area
ORDER BY porcentaje DESC;

CREATE OR REPLACE VIEW public.simulador_ranking_actividad AS
SELECT 
    user_id,
    COUNT(*) as total_examenes,
    SUM(aciertos) as total_aciertos
FROM public.simulador_results
WHERE fecha > now() - interval '7 days'
GROUP BY user_id
ORDER BY total_examenes DESC;
