-- Migration: Add detailed subscription fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.profiles.subscription_plan IS 'El plan contratado: mensual, trimestral, anual.';
COMMENT ON COLUMN public.profiles.subscription_expires_at IS 'Fecha en la que expira la suscripción.';
