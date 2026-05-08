-- Migration: Create ranking views for simulator with user names
CREATE OR REPLACE VIEW public.simulador_ranking_puntaje AS
SELECT 
    sr.user_id,
    p.name as user_name,
    MAX(sr.porcentaje) as porcentaje,
    MAX(sr.aciertos) as aciertos,
    MAX(sr.total_preguntas) as total_preguntas,
    sr.area
FROM public.simulador_results sr
LEFT JOIN public.profiles p ON sr.user_id = p.id
WHERE sr.created_at > now() - interval '7 days'
GROUP BY sr.user_id, p.name, sr.area
ORDER BY porcentaje DESC;

CREATE OR REPLACE VIEW public.simulador_ranking_actividad AS
SELECT 
    sr.user_id,
    p.name as user_name,
    COUNT(*) as total_examenes,
    SUM(sr.aciertos) as total_aciertos
FROM public.simulador_results sr
LEFT JOIN public.profiles p ON sr.user_id = p.id
WHERE sr.created_at > now() - interval '7 days'
GROUP BY sr.user_id, p.name
ORDER BY total_examenes DESC;
