-- Security Hardening Migration
-- Date: 2026-04-23

-- 1. Enable RLS on all tables
ALTER TABLE IF EXISTS public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.whatsapp_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Announcements Policies
DROP POLICY IF EXISTS "Public read announcements" ON public.announcements;
CREATE POLICY "Public read announcements" ON public.announcements
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin manage announcements" ON public.announcements;
CREATE POLICY "Admin manage announcements" ON public.announcements
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. WhatsApp Leads Policies
DROP POLICY IF EXISTS "Admin view leads" ON public.whatsapp_leads;
CREATE POLICY "Admin view leads" ON public.whatsapp_leads
    FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- No public access to whatsapp_leads. Service role key bypasses RLS.

-- 4. Profiles Policies (Refining existing ones)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 5. NotebookLM Tables (Flashcards & Quizzes)
DROP POLICY IF EXISTS "Allow public read access to flashcards" ON public.flashcards;
CREATE POLICY "Allow public read access to flashcards" ON public.flashcards
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to quizzes" ON public.quizzes;
CREATE POLICY "Allow public read access to quizzes" ON public.quizzes
    FOR SELECT USING (true);

-- Restrict writing to flashcards/quizzes to admins
DROP POLICY IF EXISTS "Admin manage flashcards" ON public.flashcards;
CREATE POLICY "Admin manage flashcards" ON public.flashcards
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admin manage quizzes" ON public.quizzes;
CREATE POLICY "Admin manage quizzes" ON public.quizzes
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. AI Agent Tasks (Refining)
DROP POLICY IF EXISTS "Users can manage their tasks" ON public.ai_agent_tasks;
CREATE POLICY "Users can manage their tasks" ON public.ai_agent_tasks
    FOR ALL USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
    WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 7. User Roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
