-- Create enums if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_task_status') THEN
        CREATE TYPE public.agent_task_status AS ENUM ('queued', 'running', 'done', 'error');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_task_priority') THEN
        CREATE TYPE public.agent_task_priority AS ENUM ('alta', 'media', 'baja');
    END IF;
END $$;

-- Create table
CREATE TABLE IF NOT EXISTS public.ai_agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    priority public.agent_task_priority NOT NULL DEFAULT 'media',
    status public.agent_task_status NOT NULL DEFAULT 'queued',
    result TEXT,
    error_msg TEXT,
    context JSONB,
    memory JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.ai_agent_tasks ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own tasks, or anon if no user_id (for development testing)
-- We drop it first to avoid "already exists" errors on multiple runs
DROP POLICY IF EXISTS "Users can manage their tasks" ON public.ai_agent_tasks;
CREATE POLICY "Users can manage their tasks"
    ON public.ai_agent_tasks
    FOR ALL
    TO anon, authenticated
    USING (
      (auth.uid() = user_id) OR (user_id IS NULL)
    )
    WITH CHECK (
      (auth.uid() = user_id) OR (user_id IS NULL)
    );
