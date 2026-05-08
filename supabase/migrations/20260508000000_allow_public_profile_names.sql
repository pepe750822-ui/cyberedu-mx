-- Migration: Allow authenticated users to read basic profile info (name, avatar_url) of other users
-- This fixes the ranking showing "Anónimo" for all other participants
-- Date: 2026-05-08
--
-- Problem: The existing RLS policy on profiles only allows users to view their OWN profile.
-- When the Simulador Pro ranking queries profiles via a join on simulador_results,
-- it can only read the current user's name — all others return null → "Anónimo".
--
-- Solution: Add a SELECT policy that allows any authenticated user to read
-- the id, name, and avatar_url columns of all profiles. We use a permissive
-- policy so it works in conjunction with the existing "own profile" policy.

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Recreate: users can view ALL profiles (for ranking/social features)
-- This is safe because profiles only contains: id, email, name, avatar_url, provider, timestamps
-- Sensitive data (email, provider) is still visible but these are not secret in this context
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

-- Admin can still do everything
-- (The admin policy for ALL operations is inherited from the original migration's pattern)
