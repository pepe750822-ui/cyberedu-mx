import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type TaskPriority = "alta" | "media" | "baja";
export type TaskStatus = "queued" | "running" | "done" | "error";

export interface AgentTask {
  id: string;
  prompt: string;
  priority: TaskPriority;
  status: TaskStatus;
  result?: string;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

interface AgentMemory {
  decisions: any[];
  topics: string[];
  insights: string[];
  lastUpdated: number;
}

const WORKER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-task-worker`;

export function useTaskQueue(memory: AgentMemory, context: any) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize and load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const loadTasks = async () => {
      const { data, error } = await (supabase as any)
        .from("ai_agent_tasks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) return;

      if (data) {
        setTasks(
          data.map((row: any) => ({
            id: row.id,
            prompt: row.prompt,
            priority: row.priority,
            status: row.status,
            result: row.result,
            error: row.error_msg,
            createdAt: new Date(row.created_at).getTime(),
            startedAt: row.started_at ? new Date(row.started_at).getTime() : undefined,
            completedAt: row.completed_at ? new Date(row.completed_at).getTime() : undefined,
          }))
        );
      }
    };

    loadTasks();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("task_queue_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ai_agent_tasks",
        },
        (payload: any) => {
          const row = payload.new || payload.old;
          const mappedTask: AgentTask = {
            id: row.id,
            prompt: row.prompt,
            priority: row.priority,
            status: row.status,
            result: row.result,
            error: row.error_msg,
            createdAt: new Date(row.created_at).getTime(),
            startedAt: row.started_at ? new Date(row.started_at).getTime() : undefined,
            completedAt: row.completed_at ? new Date(row.completed_at).getTime() : undefined,
          };

          if (payload.event === "INSERT") {
            setTasks((prev) => {
               // Evitar duplicados si lo acabamos de insertar locaLmente
               if (prev.find(t => t.id === mappedTask.id)) return prev;
               return [mappedTask, ...prev];
            });
          } else if (payload.event === "UPDATE") {
            setTasks((prev) => prev.map((t) => (t.id === mappedTask.id ? mappedTask : t)));
            
            // Notify when specific task states change
            if (mappedTask.status === "done") toast.success("Tarea completada", { description: mappedTask.prompt.slice(0, 50) });
            if (mappedTask.status === "error") toast.error("Error en tarea", { description: mappedTask.error || "Fallo inesperado" });
          } else if (payload.event === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== row.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTask = useCallback(
    async (prompt: string, priority: TaskPriority = "media") => {
      // 1. Inserción inicial local optimista + insert en base de datos
      const localId = `temp_${Date.now()}`;
      setTasks((prev) => [
        {
          id: localId,
          prompt,
          priority,
          status: "queued",
          createdAt: Date.now(),
        },
        ...prev,
      ]);

      toast.info(`Tarea enviada a segundo plano (${priority})`, {
        description: prompt.slice(0, 60),
      });

      // Insert en base de datos
      const res = await (supabase as any)
        .from("ai_agent_tasks")
        .insert({
          user_id: userId,
          prompt,
          priority,
          status: "queued",
          context,
          memory,
        })
        .select()
        .single();
        
      const data = res.data;
      const error = res.error;

      if (error || !data) {
        toast.error("No se pudo insertar la tarea en la cola central.");
        setTasks((prev) => prev.filter((t) => t.id !== localId));
        return;
      }

      // Reemplazo optimista
      setTasks((prev) => prev.map((t) => (t.id === localId ? { ...t, id: data.id } : t)));

      // 2. Ejecutar la función en segundo plano asíncronamente
      fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ taskId: data.id }),
      }).catch(console.error);

      return data.id;
    },
    [userId, context, memory]
  );

  const removeTask = useCallback(async (id: string) => {
    // Delete local first
    setTasks((prev) => prev.filter((t) => t.id !== id));
    // Remove from DB
    if (!id.startsWith("temp_")) {
        await (supabase as any).from("ai_agent_tasks").delete().eq("id", id);
    }
  }, []);

  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter((t) => t.status === "done" || t.status === "error").map(t => t.id);
    
    // Clear local quickly
    setTasks((prev) => prev.filter((t) => t.status === "queued" || t.status === "running"));
    
    // Wipe DB
    const realIds = completedIds.filter(id => !id.startsWith("temp_"));
    if (realIds.length > 0) {
      await (supabase as any).from("ai_agent_tasks").delete().in("id", realIds);
    }
  }, [tasks]);

  return { tasks, addTask, removeTask, clearCompleted };
}
