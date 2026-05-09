ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bank5_unlocked boolean DEFAULT false;

COMMENT ON COLUMN public.profiles.bank5_unlocked IS 'Permanent one-time unlock of Bank 5 (Guías UNAM Oficiales). Set to true after spending 50 tokens once.';
