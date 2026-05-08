-- Migration: Add last_challenge_reward to track daily challenge token rewards
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_challenge_reward DATE;

COMMENT ON COLUMN public.profiles.last_challenge_reward IS 'Fecha de la última vez que el usuario reclamó su recompensa por el reto diario.';
