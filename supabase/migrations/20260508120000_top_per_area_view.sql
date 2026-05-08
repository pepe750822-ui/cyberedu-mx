-- Migration: Create view for top scorers per area
CREATE OR REPLACE VIEW public.simulador_top_per_area AS
WITH RankedResults AS (
    SELECT 
        sr.area,
        sr.user_id,
        sr.porcentaje,
        sr.aciertos,
        sr.total_preguntas,
        p.name as user_name,
        ROW_NUMBER() OVER (PARTITION BY sr.area ORDER BY sr.porcentaje DESC, sr.fecha DESC) as rank
    FROM public.simulador_results sr
    JOIN public.profiles p ON sr.user_id = p.id
    WHERE sr.area IS NOT NULL AND sr.area != 'all'
)
SELECT 
    area,
    user_id,
    porcentaje,
    aciertos,
    total_preguntas,
    user_name
FROM RankedResults
WHERE rank = 1;

COMMENT ON VIEW public.simulador_top_per_area IS 'Muestra al estudiante con el mejor puntaje por cada materia específica.';
