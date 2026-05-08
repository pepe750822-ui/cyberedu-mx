-- Migration: Add Admin policies for daily_challenges
CREATE POLICY "Allow admins to manage daily challenges"
ON public.daily_challenges FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'pepe750822@gmail.com'
)
WITH CHECK (
  auth.jwt() ->> 'email' = 'pepe750822@gmail.com'
);
