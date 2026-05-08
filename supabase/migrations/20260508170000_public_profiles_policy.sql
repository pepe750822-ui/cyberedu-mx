-- Migration: Allow public reading of profiles (limited columns) for rankings
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: We already have RLS enabled, this policy allows seeing others' names/avatars.
