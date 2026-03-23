-- Migration: Add subscription and trial fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial';

COMMENT ON COLUMN public.profiles.trial_started_at IS 'Fecha en la que el usuario inició su periodo de prueba gratuito.';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Estado de la suscripción: trial, active, expired, canceled.';
