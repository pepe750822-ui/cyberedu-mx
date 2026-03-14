-- Create enums
CREATE TYPE public.agent_task_status AS ENUM ('queued', 'running', 'done', 'error');
CREATE TYPE public.agent_task_priority AS ENUM ('alta', 'media', 'baja');

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

-- Trigger to auto-update updated_at timestamp if we had one (optional, keeping it simple)
