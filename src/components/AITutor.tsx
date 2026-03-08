import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  X, Send, Bot, User, Loader2, Brain, RefreshCw, GraduationCap,
  CheckCircle2, Circle, Clock, Zap, ChevronRight, ListChecks,
  ThumbsUp, ThumbsDown, AlertTriangle, Play, Lightbulb, ChevronDown,
  BookOpen, Target, History, Layers, Plus, Trash2, Eye, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAITutorSkills } from "@/hooks/useAITutorSkills";
import { useTaskQueue, AgentTask, TaskPriority } from "@/hooks/useTaskQueue";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

// ─── Types ───
interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  plan?: Plan | null;
  reasoning?: Reasoning | null;
  decisions?: Decision[];
  feedback?: "up" | "down";
}

interface PlanStep {
  id: number;
  text: string;
  priority: "alta" | "media" | "baja";
  estimatedTime: string;
  dependsOn: number[];
  status?: "pending" | "approved" | "rejected";
}

interface Plan {
  title: string;
  description: string;
  steps: PlanStep[];
  status: "pending" | "approved" | "rejected" | "executing";
}

interface Reasoning {
  question_type: string;
  key_concepts: string[];
  approach: string;
  alternatives_considered: string[];
  confidence: number;
  references_to_past: string;
}

interface Decision {
  question: string;
  chosen: string;
  reasoning: string;
  impact: string;
}

interface AgentMemory {
  decisions: Decision[];
  topics: string[];
  insights: string[];
  lastUpdated: number;
}

// ─── Constants ───
const MEMORY_TTL = 7 * 24 * 60 * 60 * 1000;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`;
const MEMORY_KEY = "cyberagent_memory_v2";
const HISTORY_KEY = "ai_agent_history_v2";

// ─── Memory Manager ───
function loadMemory(): AgentMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) {
      const mem = JSON.parse(raw);
      if (Date.now() - mem.lastUpdated < MEMORY_TTL) return mem;
    }
  } catch { /* ignore */ }
  return { decisions: [], topics: [], insights: [], lastUpdated: Date.now() };
}

function saveMemory(memory: AgentMemory) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify({ ...memory, lastUpdated: Date.now() }));
}

// ─── Content Parsers ───
function parseReasoningFromContent(content: string): { reasoning: Reasoning | null; cleanContent: string } {
  const match = content.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
  if (!match) return { reasoning: null, cleanContent: content };
  try {
    const parsed = JSON.parse(match[1]);
    return { reasoning: parsed, cleanContent: content.replace(/<reasoning>[\s\S]*?<\/reasoning>/, "").trim() };
  } catch {
    return { reasoning: null, cleanContent: content };
  }
}

function parseDecisionsFromContent(content: string): { decisions: Decision[]; cleanContent: string } {
  const decisions: Decision[] = [];
  let cleaned = content;
  const regex = /<decision>([\s\S]*?)<\/decision>/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    try {
      decisions.push(JSON.parse(m[1]));
    } catch { /* skip */ }
  }
  cleaned = content.replace(/<decision>[\s\S]*?<\/decision>/g, "").trim();
  return { decisions, cleanContent: cleaned };
}

function parsePlanFromContent(content: string): { plan: Plan | null; cleanContent: string } {
  const planMatch = content.match(/<plan>([\s\S]*?)<\/plan>/);
  if (!planMatch) return { plan: null, cleanContent: content };
  try {
    const parsed = JSON.parse(planMatch[1]);
    const plan: Plan = {
      title: parsed.title || "Plan de estudio",
      description: parsed.description || "",
      steps: (parsed.steps || []).map((s: any) => ({ ...s, status: "pending" as const })),
      status: "pending",
    };
    return { plan, cleanContent: content.replace(/<plan>[\s\S]*?<\/plan>/, "").trim() };
  } catch {
    return { plan: null, cleanContent: content };
  }
}

function parseAllBlocks(content: string) {
  const { reasoning, cleanContent: c1 } = parseReasoningFromContent(content);
  const { decisions, cleanContent: c2 } = parseDecisionsFromContent(c1);
  const { plan, cleanContent: c3 } = parsePlanFromContent(c2);
  return { reasoning, decisions, plan, cleanContent: c3 || "He analizado tu solicitud:" };
}

// ─── Streaming helper ───
async function streamChat({
  messages,
  context,
  memory,
  onDelta,
  onDone,
}: {
  messages: { role: string; content: string }[];
  context?: any;
  memory?: AgentMemory;
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, context, memory }),
  });

  if (!resp.ok || !resp.body) {
    const errBody = await resp.json().catch(() => ({}));
    throw new Error(errBody.error || `Error ${resp.status}`);
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });
    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const c = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const c = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch { /* ignore */ }
    }
  }
  onDone();
}

// ─── Reasoning Card ───
const ReasoningCard: React.FC<{ reasoning: Reasoning }> = ({ reasoning }) => {
  const [open, setOpen] = useState(false);
  const confidenceColor = reasoning.confidence >= 80 ? "text-emerald-400" : reasoning.confidence >= 50 ? "text-amber-400" : "text-red-400";

  return (
    <div className="mb-3 border border-amber-500/20 bg-amber-500/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-3 text-left hover:bg-amber-500/10 transition-colors"
      >
        <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
        <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex-1">
          Razonamiento del agente
        </span>
        <span className={cn("text-[10px] font-bold", confidenceColor)}>
          {reasoning.confidence}% confianza
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-amber-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2 text-[11px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-slate-400">Tipo:</span>
            <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-[9px] font-bold uppercase">
              {reasoning.question_type}
            </span>
          </div>

          <div>
            <p className="text-slate-500 font-bold mb-1">Enfoque:</p>
            <p className="text-slate-300">{reasoning.approach}</p>
          </div>

          {reasoning.key_concepts.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {reasoning.key_concepts.map((c, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-slate-400">
                  {c}
                </span>
              ))}
            </div>
          )}

          {reasoning.alternatives_considered.length > 0 && (
            <div>
              <p className="text-slate-500 font-bold mb-1">Alternativas consideradas:</p>
              <ul className="space-y-0.5">
                {reasoning.alternatives_considered.map((a, i) => (
                  <li key={i} className="text-slate-400 flex items-start gap-1.5">
                    <ChevronRight className="h-3 w-3 text-slate-600 mt-0.5 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reasoning.references_to_past && (
            <div className="flex items-start gap-1.5 p-2 bg-primary/5 border border-primary/10 rounded-lg">
              <History className="h-3 w-3 text-primary mt-0.5 shrink-0" />
              <p className="text-slate-400">{reasoning.references_to_past}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Decision Card ───
const DecisionCard: React.FC<{ decision: Decision }> = ({ decision }) => (
  <div className="my-2 border border-blue-500/20 bg-blue-500/5 rounded-xl p-3 space-y-1.5">
    <div className="flex items-center gap-2">
      <BookOpen className="h-4 w-4 text-blue-400" />
      <span className="text-[11px] font-black text-blue-300 uppercase tracking-wider">Decisión registrada</span>
    </div>
    <p className="text-[12px] font-semibold text-slate-200">{decision.question}</p>
    <p className="text-[11px] text-emerald-400">→ {decision.chosen}</p>
    <p className="text-[10px] text-slate-500">{decision.reasoning}</p>
    {decision.impact && (
      <p className="text-[10px] text-amber-400/80 flex items-start gap-1">
        <Zap className="h-3 w-3 shrink-0 mt-0.5" /> {decision.impact}
      </p>
    )}
  </div>
);

// ─── Plan Step Component ───
const PlanStepItem: React.FC<{ step: PlanStep; onToggle: (id: number) => void }> = ({ step, onToggle }) => {
  const priorityColor = {
    alta: "text-red-400 bg-red-500/10 border-red-500/20",
    media: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    baja: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <button
      onClick={() => onToggle(step.id)}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
        step.status === "approved" ? "bg-emerald-500/10 border-emerald-500/20"
          : step.status === "rejected" ? "bg-red-500/5 border-red-500/10 opacity-50 line-through"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      )}
    >
      {step.status === "approved" ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        : step.status === "rejected" ? <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
        : <Circle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-slate-200 leading-snug">{step.text}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={cn("px-1.5 py-0.5 text-[9px] font-black uppercase rounded border", priorityColor[step.priority])}>
            {step.priority}
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {step.estimatedTime}
          </span>
          {step.dependsOn.length > 0 && (
            <span className="text-[10px] text-slate-600">→ Depende de: {step.dependsOn.join(", ")}</span>
          )}
        </div>
      </div>
    </button>
  );
};

// ─── Plan Card Component ───
const PlanCard: React.FC<{
  plan: Plan;
  onApprove: () => void;
  onReject: () => void;
  onToggleStep: (id: number) => void;
}> = ({ plan, onApprove, onReject, onToggleStep }) => {
  const approvedCount = plan.steps.filter(s => s.status === "approved").length;
  const progress = plan.steps.length > 0 ? (approvedCount / plan.steps.length) * 100 : 0;

  return (
    <div className="mt-3 border border-primary/20 bg-primary/5 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <ListChecks className="h-4 w-4 text-primary" />
          <h4 className="text-[13px] font-black text-white uppercase tracking-tight">{plan.title}</h4>
        </div>
        <p className="text-[11px] text-slate-400">{plan.description}</p>
        <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[9px] text-slate-500 mt-1">{approvedCount}/{plan.steps.length} pasos seleccionados</p>
      </div>

      <div className="p-3 space-y-2">
        {plan.steps.map(step => (
          <PlanStepItem key={step.id} step={step} onToggle={onToggleStep} />
        ))}
      </div>

      {plan.status === "pending" && (
        <div className="p-3 border-t border-white/5 flex gap-2">
          <Button onClick={onApprove} size="sm" className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase">
            <Play className="h-3 w-3" /> Aprobar Plan
          </Button>
          <Button onClick={onReject} size="sm" variant="ghost" className="text-[11px] font-black uppercase text-slate-500 hover:text-red-400">
            Rechazar
          </Button>
        </div>
      )}
      {plan.status === "approved" && (
        <div className="p-3 border-t border-emerald-500/20 bg-emerald-500/5 text-center">
          <p className="text-[11px] font-black text-emerald-400 uppercase flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Plan aprobado — ¡Manos a la obra!
          </p>
        </div>
      )}
      {plan.status === "rejected" && (
        <div className="p-3 border-t border-red-500/20 bg-red-500/5 text-center">
          <p className="text-[11px] font-black text-red-400 uppercase flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Plan rechazado
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Task Queue Panel ───
const TaskQueuePanel: React.FC<{
  tasks: AgentTask[];
  onRemove: (id: string) => void;
  onClearCompleted: () => void;
  onViewResult: (task: AgentTask) => void;
}> = ({ tasks, onRemove, onClearCompleted, onViewResult }) => {
  if (tasks.length === 0) return (
    <div className="p-4 text-center">
      <Layers className="h-8 w-8 text-slate-600 mx-auto mb-2" />
      <p className="text-[11px] text-slate-500 font-bold">No hay tareas en la cola</p>
      <p className="text-[9px] text-slate-600 mt-1">Usa "/tarea" para encolar prompts en segundo plano</p>
    </div>
  );

  const statusIcon = (t: AgentTask) => {
    if (t.status === "running") return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin shrink-0" />;
    if (t.status === "done") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
    if (t.status === "error") return <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />;
    return <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />;
  };

  const priorityBadge = (p: TaskPriority) => {
    const colors = {
      alta: "text-red-400 bg-red-500/10 border-red-500/20",
      media: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      baja: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
    return <span className={cn("px-1 py-0.5 text-[8px] font-black uppercase rounded border", colors[p])}>{p}</span>;
  };

  const doneCount = tasks.filter(t => t.status === "done" || t.status === "error").length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {tasks.filter(t => t.status === "queued").length} en cola · {tasks.filter(t => t.status === "running").length} procesando
        </span>
        {doneCount > 0 && (
          <button onClick={onClearCompleted} className="text-[9px] text-slate-500 hover:text-white transition-colors">
            Limpiar completadas
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {tasks.map(t => (
          <div key={t.id} className={cn(
            "flex items-start gap-2 p-2.5 rounded-xl border transition-all",
            t.status === "running" ? "bg-primary/5 border-primary/20" :
            t.status === "done" ? "bg-emerald-500/5 border-emerald-500/10" :
            t.status === "error" ? "bg-red-500/5 border-red-500/10" :
            "bg-white/5 border-white/5"
          )}>
            {statusIcon(t)}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-slate-200 font-medium truncate">{t.prompt}</p>
              <div className="flex items-center gap-2 mt-1">
                {priorityBadge(t.priority)}
                {t.completedAt && t.startedAt && (
                  <span className="text-[9px] text-slate-600">{((t.completedAt - t.startedAt) / 1000).toFixed(1)}s</span>
                )}
              </div>
              {t.status === "error" && t.error && (
                <p className="text-[9px] text-red-400 mt-1 truncate">{t.error}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {t.status === "done" && (
                <button onClick={() => onViewResult(t)} className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-colors">
                  <Eye className="h-3 w-3" />
                </button>
              )}
              {(t.status === "done" || t.status === "error" || t.status === "queued") && (
                <button onClick={() => onRemove(t.id)} className="p-1 hover:bg-red-500/10 rounded text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Memory Badge ───
const MemoryBadge: React.FC<{ memory: AgentMemory }> = ({ memory }) => {
  const total = memory.decisions.length + memory.topics.length + memory.insights.length;
  if (total === 0) return null;

  return (
    <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8px] font-bold text-primary uppercase">
      {total} memorias
    </span>
  );
};

// ─── Main Component ───
const AITutor = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { analyzeUserProgress } = useAITutorSkills();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [memory, setMemory] = useState<AgentMemory>(loadMemory);
  const [activeTab, setActiveTab] = useState<"chat" | "queue">("chat");

  // Load messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const { data, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < MEMORY_TTL) return data;
      } catch { /* ignore */ }
    }
    return [{
      role: "assistant" as const,
      content: "¡Hola! Soy **CyberAgent**, tu consultor académico inteligente con razonamiento multi-paso. Puedo analizar tu progreso, crear planes personalizados, recordar tus decisiones y explicarte cualquier tema del ECOEMS 2026.\n\n¿En qué te ayudo hoy?",
      id: "initial",
    }];
  });

  // Persist messages & memory
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ data: messages, timestamp: Date.now() }));
  }, [messages]);

  useEffect(() => { saveMemory(memory); }, [memory]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isStreaming]);

  const buildContext = useCallback(() => {
    try {
      const analysis = analyzeUserProgress();
      return {
        currentPage: location.pathname,
        progress: analysis.totalProgress,
        weakAreas: analysis.weakAreas.map((a: any) => a.name),
        streak: analysis.streak,
      };
    } catch {
      return { currentPage: location.pathname };
    }
  }, [location.pathname, analyzeUserProgress]);

  const { tasks, addTask, removeTask, clearCompleted } = useTaskQueue(memory, buildContext());

  const handleViewTaskResult = useCallback((task: AgentTask) => {
    const resultMsg: Message = {
      role: "assistant",
      content: `📋 **Resultado de tarea en cola:**\n\n> _"${task.prompt}"_\n\n---\n\n${task.result || "Sin resultado"}`,
      id: `task-${task.id}`,
    };
    setMessages(prev => [...prev, resultMsg]);
    setActiveTab("chat");
  }, []);

  const contextualSuggestions = useMemo(() => {
    const path = location.pathname;
    if (path === "/simulador-pro") return ["Dame una pista para esta pregunta", "Explica la estrategia del simulador"];
    if (path.includes("/area/")) return ["Crea un plan de estudio para esta área", "Resumen rápido de los temas clave"];
    return ["¿Cómo voy en mi progreso?", "Crea un plan de estudio personalizado", "Explícame razonamiento lógico"];
  }, [location.pathname]);

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(MEMORY_KEY);
    setMemory({ decisions: [], topics: [], insights: [], lastUpdated: Date.now() });
    setMessages([{
      role: "assistant",
      content: "¡Historial y memoria reiniciados! Empezamos desde cero. ¿Qué te gustaría trabajar?",
      id: Date.now().toString(),
    }]);
    toast.info("Conversación y memoria reiniciadas");
  };

  const handleFeedback = (id: string, type: "up" | "down") => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback: type } : m));
    if (type === "down") {
      setMemory(prev => ({
        ...prev,
        insights: [...prev.insights.slice(-9), "El usuario indicó insatisfacción con una respuesta reciente"],
      }));
    }
    toast.success(type === "up" ? "¡Gracias por tu feedback!" : "Tomaré nota para mejorar.");
  };

  const handlePlanAction = (messageId: string, action: "approve" | "reject") => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.plan) return m;
      return { ...m, plan: { ...m.plan, status: action === "approve" ? "approved" : "rejected" } };
    }));
    if (action === "approve") {
      setMemory(prev => ({
        ...prev,
        decisions: [...prev.decisions.slice(-9), {
          question: "Plan de estudio aprobado",
          chosen: messages.find(m => m.id === messageId)?.plan?.title || "Plan",
          reasoning: "Aprobado por el usuario",
          impact: "Se seguirán los pasos del plan",
        }],
      }));
    }
    toast.success(action === "approve" ? "¡Plan aprobado!" : "Plan rechazado.");
  };

  const handleToggleStep = (messageId: string, stepId: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.plan) return m;
      const newSteps = m.plan.steps.map(s => {
        if (s.id !== stepId) return s;
        const next = s.status === "pending" ? "approved" : s.status === "approved" ? "rejected" : "pending";
        return { ...s, status: next as PlanStep["status"] };
      });
      return { ...m, plan: { ...m.plan, steps: newSteps } };
    }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Handle /tarea command: /tarea [alta|media|baja] <prompt>
    const tareaMatch = text.trim().match(/^\/tarea\s+(?:(alta|media|baja)\s+)?(.+)/i);
    if (tareaMatch) {
      const priority = (tareaMatch[1]?.toLowerCase() as TaskPriority) || "media";
      const prompt = tareaMatch[2];
      addTask(prompt, priority);
      setInput("");
      setMessages(prev => [...prev, {
        role: "user" as const, content: text.trim(), id: Date.now().toString()
      }, {
        role: "assistant" as const,
        content: `✅ Tarea encolada con prioridad **${priority}**. Puedes ver su progreso en la pestaña **Cola de Tareas**.\n\n> _"${prompt}"_`,
        id: (Date.now() + 1).toString(),
      }]);
      setActiveTab("queue");
      return;
    }

    const userMsg: Message = { role: "user", content: text.trim(), id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Extract topics from user message
    const words = text.toLowerCase().split(/\s+/);
    const topicKeywords = ["matemática", "verbal", "lectura", "ciencias", "historia", "lógico", "simulador", "examen"];
    const foundTopics = topicKeywords.filter(t => words.some(w => w.includes(t)));
    if (foundTopics.length > 0) {
      setMemory(prev => ({
        ...prev,
        topics: [...new Set([...prev.topics, ...foundTopics])].slice(-15),
      }));
    }

    let assistantContent = "";
    const assistantId = (Date.now() + 1).toString();

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id === assistantId) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
        }
        return [...prev, { role: "assistant", content: assistantContent, id: assistantId }];
      });
    };

    try {
      const history = [...messages, userMsg]
        .filter(m => m.id !== "initial")
        .slice(-12)
        .map(m => ({ role: m.role, content: m.content }));

      await streamChat({
        messages: history,
        context: buildContext(),
        memory,
        onDelta: upsertAssistant,
        onDone: () => {
          const { reasoning, decisions, plan, cleanContent } = parseAllBlocks(assistantContent);

          // Save decisions to memory
          if (decisions.length > 0) {
            setMemory(prev => ({
              ...prev,
              decisions: [...prev.decisions, ...decisions].slice(-20),
            }));
          }

          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content: cleanContent, reasoning, decisions: decisions.length > 0 ? decisions : undefined, plan }
              : m
          ));
          setIsStreaming(false);
        },
      });
    } catch (err: any) {
      console.error("Agent chat error:", err);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        const errContent = `⚠️ ${err.message || "Error de conexión. Intenta de nuevo."}`;
        if (last?.role === "assistant" && last.id === assistantId) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: errContent } : m);
        }
        return [...prev, { role: "assistant", content: errContent, id: assistantId }];
      });
      setIsStreaming(false);
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-[100] transition-all duration-500 flex items-center justify-center",
          isOpen
            ? "bg-slate-900 border border-white/10 rotate-90"
            : "bg-primary hover:scale-110 active:scale-95 shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative">
            <GraduationCap className="h-8 w-8 text-primary-foreground animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-primary" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div className={cn(
        "fixed bottom-24 right-6 w-[95vw] sm:w-[440px] h-[650px] bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] z-[100] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-40 pointer-events-none"
      )}>
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-primary/20 via-slate-900/40 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center relative">
                <Brain className="h-6 w-6 text-primary" />
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 rounded-full border-[3px] border-slate-950" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-[0.15em]">CyberAgent</h4>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Razonamiento v6.0
                  </p>
                  <MemoryBadge memory={memory} />
                </div>
              </div>
            </div>
            <button
              onClick={clearHistory}
              title="Reiniciar chat y memoria"
              className="p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col gap-1.5 max-w-[92%] animate-in fade-in slide-in-from-bottom-3 duration-400",
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn("flex items-end gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
                  msg.role === "user" ? "bg-slate-800 border-white/10" : "bg-primary/20 border-primary/30"
                )}>
                  {msg.role === "user" ? <User className="h-3.5 w-3.5 text-slate-400" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
                </div>

                <div className={cn(
                  "px-4 py-3 text-[13px] leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary rounded-2xl rounded-tr-none text-primary-foreground shadow-xl"
                    : "bg-white/5 border border-white/5 rounded-2xl rounded-tl-none text-slate-200"
                )}>
                  {/* Reasoning block */}
                  {msg.reasoning && <ReasoningCard reasoning={msg.reasoning} />}

                  {/* Decisions */}
                  {msg.decisions?.map((d, i) => <DecisionCard key={i} decision={d} />)}

                  {/* Content */}
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 prose-strong:text-white prose-a:text-primary">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span>{msg.content}</span>
                  )}

                  {/* Plan */}
                  {msg.plan && (
                    <PlanCard
                      plan={msg.plan}
                      onApprove={() => handlePlanAction(msg.id, "approve")}
                      onReject={() => handlePlanAction(msg.id, "reject")}
                      onToggleStep={(stepId) => handleToggleStep(msg.id, stepId)}
                    />
                  )}
                </div>
              </div>

              {/* Feedback */}
              {msg.role === "assistant" && msg.id !== "initial" && !isStreaming && (
                <div className="flex items-center gap-2 px-9">
                  <button
                    onClick={() => handleFeedback(msg.id, "up")}
                    className={cn("p-1 rounded-lg transition-colors", msg.feedback === "up" ? "text-emerald-500 bg-emerald-500/10" : "text-slate-600 hover:text-white hover:bg-white/5")}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, "down")}
                    className={cn("p-1 rounded-lg transition-colors", msg.feedback === "down" ? "text-red-500 bg-red-500/10" : "text-slate-600 hover:text-white hover:bg-white/5")}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-4 w-fit animate-pulse">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Razonando...</span>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {!isStreaming && (
          <div className="px-5 py-2 flex flex-wrap gap-1.5">
            {contextualSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="px-3 py-1.5 bg-slate-800/50 hover:bg-primary/20 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 hover:text-white transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-5 bg-slate-900/50 border-t border-white/5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Pregunta algo o pide un plan de estudio..."
              disabled={isStreaming}
              className="flex-1 bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all focus:ring-2 ring-primary/10 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.15em] text-center mt-3 flex items-center justify-center gap-1">
            <Zap className="h-3 w-3" /> CyberAgent v6.0 — Razonamiento Multi-Paso
          </p>
        </div>
      </div>
    </>
  );
};

export default AITutor;
