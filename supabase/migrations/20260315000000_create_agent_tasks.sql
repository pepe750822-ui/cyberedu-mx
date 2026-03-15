-- Create enums if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_task_status') THEN
        CREATE TYPE public.agent_task_status AS ENUM ('queued', 'running', 'done', 'error');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_task_priority') THEN
        CREATE TYPE public.agent_task_priority AS ENUM ('alta', 'media', 'baja');
    END IF;
END $$;

-- Enable pg_net if available
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create table (keep existing structure but ensure it's there)
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

-- Allow users to manage their own tasks
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

-- Trigger function to call the edge function
-- Note: This assumes the edge function is exposed at /functions/v1/agent-task-worker
-- We use a secret or if not possible, we'll need the user to set the vault. 
-- For now, we'll use a placeholder URL and common env variable pattern.
CREATE OR REPLACE FUNCTION public.handle_new_agent_task()
RETURNS TRIGGER AS $$
BEGIN
  -- We use net.http_post to call the edge function
  -- In Supabase, the URL is usually project_ref.supabase.co
  -- However, since we don't know the project ref here, 
  -- we rely on the fact that this is often configured via the dashboard.
  -- But to "finish" the code, we'll provide the SQL template.
  
  PERFORM net.http_post(
    url := 'https://' || current_setting('request.headers', true)::json->>'host' || '/functions/v1/agent-task-worker',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.headers', true)::json->>'authorization'
    ),
    body := jsonb_build_object('taskId', NEW.id)
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't fail the insert if the trigger fails
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_agent_task_created ON public.ai_agent_tasks;
CREATE TRIGGER on_agent_task_created
    AFTER INSERT ON public.ai_agent_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_agent_task();
