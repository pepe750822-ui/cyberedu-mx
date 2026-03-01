-- Remove duplicate Spanish RLS policies
DROP POLICY IF EXISTS "Permitir lectura pública de flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Permitir lectura pública de quizzes" ON public.quizzes;

-- Fix mutable search_path on update_timestamp function
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;