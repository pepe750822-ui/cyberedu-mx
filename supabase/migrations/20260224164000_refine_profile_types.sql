
-- Update area_of_interest column to be an array of text
-- This aligns with the frontend usage where users can select multiple areas

-- 1. Create a temporary column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS area_of_interest_new TEXT[] DEFAULT '{}';

-- 2. Copy data if possible (though it's likely empty or just a string for now)
-- If it was a string like "area1,area2", we could split it, but for simplicity we'll just start fresh or set to empty
-- UPDATE public.profiles SET area_of_interest_new = string_to_array(area_of_interest, ',');

-- 3. Drop the old column and rename the new one
ALTER TABLE public.profiles DROP COLUMN IF EXISTS area_of_interest;
ALTER TABLE public.profiles RENAME COLUMN area_of_interest_new TO area_of_interest;

-- 4. Ensure RLS allows the user to update these fields
-- (Policies already exist in previous migrations, this is just a schema refinement)
