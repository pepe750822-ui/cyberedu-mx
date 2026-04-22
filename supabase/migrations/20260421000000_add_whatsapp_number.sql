-- Migration to add whatsapp_number and manychat_subscriber_id to profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS manychat_subscriber_id TEXT;
