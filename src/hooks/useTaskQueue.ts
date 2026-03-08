import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

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

const QUEUE_KEY = "cyberagent_taskqueue_v1";
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`;

function loadQueue(): AgentTask[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveQueue(tasks: AgentTask[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(tasks));
}

const PRIORITY_ORDER: Record<TaskPriority, number> = { alta: 0, media: 1, baja: 2 };

export function useTaskQueue(memory: AgentMemory, context: any) {
  const [tasks, setTasks] = useState<AgentTask[]>(loadQueue);
  const processingRef = useRef(false);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  useEffect(() => { saveQueue(tasks); }, [tasks]);

  const addTask = useCallback((prompt: string, priority: TaskPriority = "media") => {
    const task: AgentTask = {
      id: Date.now().toString(),
      prompt,
      priority,
      status: "queued",
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, task]);
    toast.info(`Tarea añadida a la cola (${priority})`, { description: prompt.slice(0, 60) });
    return task.id;
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => t.status === "queued" || t.status === "running"));
  }, []);

  const processNext = useCallback(async () => {
    if (processingRef.current) return;

    const current = tasksRef.current;
    const queued = current
      .filter(t => t.status === "queued")
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

    if (queued.length === 0) return;

    const task = queued[0];
    processingRef.current = true;

    setTasks(prev => prev.map(t =>
      t.id === task.id ? { ...t, status: "running" as const, startedAt: Date.now() } : t
    ));

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: task.prompt }],
          context,
          memory,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.error || `Error ${resp.status}`);
      }

      // Read full stream
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const p = JSON.parse(json);
            const c = p.choices?.[0]?.delta?.content;
            if (c) result += c;
          } catch {}
        }
      }

      // Strip XML tags for clean result
      const clean = result
        .replace(/<reasoning>[\s\S]*?<\/reasoning>/g, "")
        .replace(/<decision>[\s\S]*?<\/decision>/g, "")
        .replace(/<plan>[\s\S]*?<\/plan>/g, "")
        .trim();

      setTasks(prev => prev.map(t =>
        t.id === task.id ? { ...t, status: "done" as const, result: clean || result, completedAt: Date.now() } : t
      ));

      toast.success("Tarea completada", { description: task.prompt.slice(0, 50) });
    } catch (err: any) {
      setTasks(prev => prev.map(t =>
        t.id === task.id ? { ...t, status: "error" as const, error: err.message, completedAt: Date.now() } : t
      ));
      toast.error("Error en tarea", { description: err.message });
    } finally {
      processingRef.current = false;
    }
  }, [context, memory]);

  // Auto-process queue
  useEffect(() => {
    const hasQueued = tasks.some(t => t.status === "queued");
    const hasRunning = tasks.some(t => t.status === "running");
    if (hasQueued && !hasRunning) {
      const timer = setTimeout(processNext, 500);
      return () => clearTimeout(timer);
    }
  }, [tasks, processNext]);

  return { tasks, addTask, removeTask, clearCompleted };
}
