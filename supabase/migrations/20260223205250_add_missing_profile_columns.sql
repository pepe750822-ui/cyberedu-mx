
-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS weekly_reminders BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS area_of_interest TEXT;

-- Update the handle_new_user function to ensure it continues to work correctly 
-- (it already uses SET search_path = public, which is good practice)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email')
  );
  RETURN NEW;
END;
$$;
