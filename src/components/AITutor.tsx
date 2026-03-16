import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  X, Send, Bot, User, Loader2, Brain, RefreshCw, GraduationCap,
  CheckCircle2, Circle, Clock, Zap, ChevronRight, ListChecks,
  ThumbsUp, ThumbsDown, AlertTriangle, Play, Lightbulb, ChevronDown,
  BookOpen, Target, History, Layers, Plus, Trash2, Eye, XCircle,
  BarChart3, Sparkles, Search, TrendingUp, Award, ArrowRight,
  Shield, ShieldCheck, ShieldAlert, Wrench, Activity, AlertCircle,
  Maximize2, Minimize2, Mic, MicOff, Volume2, VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAITutorSkills, ProgressAnalysis, PersonalizedQuiz, ContentRecommendation } from "@/hooks/useAITutorSkills";
import { useAppDiagnostics, DiagnosticsResult, DiagnosticCheck } from "@/hooks/useAppDiagnostics";
import { useStudyPlans, PlanEstudio } from "@/hooks/useStudyPlans";
import { useAnalisisRendimiento } from "@/hooks/useAnalisisRendimiento";
import { useTaskQueue, AgentTask } from "@/hooks/useTaskQueue";
import { areas } from "@/data/areas";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import Mermaid from "./Mermaid";

// ─── ECOEMS Citation Mapping ───
const MATERIA_TO_AREA: Record<string, string> = {
  "HV": "habilidades",
  "HM": "habilidades",
  "BIO": "biologia",
  "QUI": "quimica",
  "FIS": "fisica",
  "MAT": "matematicas",
  "ESP": "espanol",
  "HIS-M": "historia-mexico",
  "HIS-U": "historia-universal",
  "GEO": "geografia",
  "FCE": "formacion-civica"
};

const MATERIA_PREFIX: Record<string, string> = {
  "HV": "hv",
  "HM": "hm",
  "BIO": "bio",
  "QUI": "qui",
  "FIS": "fis",
  "MAT": "mat",
  "ESP": "esp",
  "HIS-M": "hm-mx",
  "HIS-U": "hu",
  "GEO": "geo",
  "FCE": "fce"
};

// ─── Navigation Helper ───
function getUrlForPaso(type: string, id: string, title?: string, areaHint?: string): string {
  if (type === 'simulador') return '/simulador-pro';
  
  const cleanTitle = (title || "").toLowerCase();
  let targetAreaId = "";
  let targetVideoId = id;

  // 1. Precise ID Check: If ID already has a prefix (e.g. "bio-1"), find its area
  if (id.includes('-')) {
    const prefix = id.split('-')[0];
    const area = areas.find(a => 
      a.id.startsWith(prefix) || 
      a.videos.some(v => v.id === id)
    );
    if (area) {
      targetAreaId = area.id;
      targetVideoId = id;
    }
  }

  // 2. Title Search: If no area found or ID is suspicious, search all videos
  if (!targetAreaId) {
    for (const area of areas) {
      const match = area.videos.find(v => 
        cleanTitle.includes(v.title.toLowerCase()) || 
        v.title.toLowerCase().includes(cleanTitle)
      );
      if (match) {
        targetAreaId = area.id;
        targetVideoId = match.id;
        break;
      }
    }
  }

  // 3. Heuristic / Area Hint Fallback
  if (!targetAreaId) {
    const context = (cleanTitle + " " + (areaHint || "")).toLowerCase();
    const areaMap: Record<string, string> = {
      'habilidad': 'habilidades', 'verbal': 'habilidades', 'razonamiento': 'habilidades',
      'matemática': 'matematicas', 'número': 'matematicas', 'álgebra': 'matematicas', 'geometría': 'matematicas',
      'biología': 'biologia', 'célula': 'biologia', 'seres vivos': 'biologia', 'genética': 'biologia',
      'física': 'fisica', 'movimiento': 'fisica', 'fuerza': 'fisica', 'energía': 'fisica', 'cinemática': 'fisica',
      'química': 'quimica', 'átomo': 'quimica', 'reacción': 'quimica', 'materia': 'quimica',
      'geografía': 'geografia', 'mapa': 'geografia', 'población': 'geografia',
      'español': 'espanol', 'lectura': 'espanol', 'gramática': 'espanol', 'puntuación': 'espanol',
      'historia de méxico': 'historia-mexico', 'méxico': 'historia-mexico',
      'historia universal': 'historia-universal', 'siglo': 'historia-universal',
      'cívica': 'formacion-civica', 'ética': 'formacion-civica', 'democracia': 'formacion-civica'
    };
    
    for (const [key, val] of Object.entries(areaMap)) {
      if (context.includes(key)) {
        targetAreaId = val;
        // If it's a number like "1", try to match it with the area prefix
        if (/^\d+$/.test(id)) {
          const area = areas.find(a => a.id === val);
          if (area) {
             const firstVideoId = area.videos[0]?.id || '';
             const prefix = firstVideoId.split('-')[0] || '';
             // If prefix is "hv" or "hm" (habilidades), we need to be careful
             targetVideoId = prefix ? `${prefix}-${id}` : id;
          }
        }
        break;
      }
    }
  }

  // If still no area, try to find ANY match in keywords from areas names
  if (!targetAreaId) {
    const foundArea = areas.find(a => cleanTitle.includes(a.id) || a.name.toLowerCase().includes(cleanTitle));
    if (foundArea) targetAreaId = foundArea.id;
  }

  targetAreaId = targetAreaId || 'habilidades';
  
  if (type === 'quiz') return `/area/${targetAreaId}?tab=quiz&video=${targetVideoId}`;
  if (type === 'infografia') return `/area/${targetAreaId}?tab=recursos&video=${targetVideoId}`;
  return `/area/${targetAreaId}?video=${targetVideoId}`;
}

// ─── Types ───
interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  plan?: Plan | null;
  reasoning?: Reasoning | null;
  decisions?: Decision[];
  feedback?: "up" | "down";
  analysis?: ProgressAnalysis;
  quiz?: PersonalizedQuiz;
  recommendations?: ContentRecommendation[];
  diagnostics?: DiagnosticsResult;
  studyPlans?: PlanEstudio[];
  report?: any;
  alerts?: any[];
}

// ─── Shared Navigation Handler Wrapper ───
const useAgentNavigation = (setIsOpen: (open: boolean) => void) => {
  const navigate = useNavigate();
  return (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
};

interface PlanStep {
  id: number;
  text: string;
  priority: "alta" | "media" | "baja";
  estimatedTime: string;
  dependsOn: number[];
  status?: "pending" | "approved" | "rejected";
  videoId?: string;
  areaId?: string;
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
function safeParseJSON(str: string): any {
  try {
    const cleaned = str.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function parseReasoningFromContent(content: string): { reasoning: Reasoning | null; cleanContent: string } {
  const match = content.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
  if (!match) return { reasoning: null, cleanContent: content };
  return { reasoning: safeParseJSON(match[1]), cleanContent: content.replace(/<reasoning>[\s\S]*?<\/reasoning>/, "").trim() };
}

function parseDecisionsFromContent(content: string): { decisions: Decision[]; cleanContent: string } {
  const decisions: Decision[] = [];
  let cleaned = content;
  const regex = /<decision>([\s\S]*?)<\/decision>/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const parsed = safeParseJSON(m[1]);
    if (parsed) decisions.push(parsed);
  }
  cleaned = content.replace(/<decision>[\s\S]*?<\/decision>/g, "").trim();
  return { decisions, cleanContent: cleaned };
}

function parsePlanFromContent(content: string): { plan: Plan | null; cleanContent: string } {
  const planMatch = content.match(/<plan>([\s\S]*?)<\/plan>/);
  if (!planMatch) return { plan: null, cleanContent: content };
  const parsed = safeParseJSON(planMatch[1]);
  if (!parsed) return { plan: null, cleanContent: content };
  
  const plan: Plan = {
    title: parsed.title || "Plan de estudio",
    description: parsed.description || "",
    steps: (parsed.steps || []).map((s: any) => ({ 
      ...s, 
      status: "pending" as const,
      videoId: s.videoId || s.video_id,
      areaId: s.areaId || s.area_id
    })),
    status: "pending",
  };
  return { plan, cleanContent: content.replace(/<plan>[\s\S]*?<\/plan>/, "").trim() };
}

function parseAllBlocks(content: string) {
  const { reasoning, cleanContent: c1 } = parseReasoningFromContent(content);
  const { decisions, cleanContent: c2 } = parseDecisionsFromContent(c1);
  const { plan, cleanContent: c3 } = parsePlanFromContent(c2);
  return { reasoning, decisions, plan, cleanContent: c3 };
}

function stripStreamingBlocks(content: string): string {
  // Oculta temporalmente los bloques XML crudos mientras el LLM los está escribiendo en el stream.
  return content
    .replace(/<(reasoning|decision|plan)>[\s\S]*?(<\/\1>|$)/g, "")
    .trim();
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
        <span className="text-sm font-black text-amber-300 uppercase tracking-wider flex-1">
          Razonamiento del agente
        </span>
        <span className={cn("text-xs font-bold", confidenceColor)}>
          {reasoning.confidence}% confianza
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-amber-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Target className="h-3 w-3 text-slate-500" />
            <span className="text-slate-400">Tipo:</span>
            <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded text-sm font-bold uppercase">
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
                <span key={i} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-sm text-slate-400">
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
      <span className="text-sm font-black text-blue-300 uppercase tracking-wider">Decisión registrada</span>
    </div>
    <p className="text-sm font-semibold font-semibold text-slate-200">{decision.question}</p>
    <p className="text-sm text-emerald-400">→ {decision.chosen}</p>
    <p className="text-xs text-slate-500">{decision.reasoning}</p>
    {decision.impact && (
      <p className="text-xs text-amber-400/80 flex items-start gap-1">
        <Zap className="h-3 w-3 shrink-0 mt-0.5" /> {decision.impact}
      </p>
    )}
  </div>
);

// ─── Plan Step Component ───
const PlanStepItem: React.FC<{ step: PlanStep; planTitle?: string; onToggle: (id: number) => void; onNavigate: (path: string) => void }> = ({ step, planTitle, onToggle, onNavigate }) => {
  const priorityColor = {
    alta: "text-red-400 bg-red-500/10 border-red-500/20",
    media: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    baja: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  };

  // In a plan, almost everything should be linkable if we can find a context
  const isLinkable = true; 

  const getStepType = () => {
    const text = step.text.toLowerCase();
    if (text.includes("quiz")) return "quiz";
    if (text.includes("simulador")) return "simulador";
    return "video";
  };

  return (
    <div className="group relative">
      <button
        onClick={() => onToggle(step.id)}
        className={cn(
          "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
          step.status === "approved" ? "bg-emerald-500/10 border-emerald-500/20"
            : step.status === "rejected" ? "bg-red-500/5 border-red-500/10 opacity-50 line-through"
            : "bg-white/5 border-white/10 hover:bg-white/10 pr-12"
        )}
      >
        {step.status === "approved" ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          : step.status === "rejected" ? <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          : <Circle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold font-semibold text-slate-200 leading-snug">{step.text}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn("px-1.5 py-0.5 text-xs font-black uppercase rounded border", priorityColor[step.priority])}>
              {step.priority}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {step.estimatedTime}
            </span>
             {step.dependsOn.length > 0 && (
              <span className="text-xs text-slate-600">→ Depende de: {step.dependsOn.join(", ")}</span>
            )}
          </div>
        </div>
      </button>

      {isLinkable && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(getUrlForPaso(
              getStepType(), 
              step.videoId || step.id.toString(), 
              step.text,
              step.areaId || planTitle
            ));
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all border border-primary/20 z-10"
          title="Ver contenido"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

// ─── Plan Card Component ───
const PlanCard: React.FC<{
  plan: Plan;
  onApprove: () => void;
  onReject: () => void;
  onToggleStep: (id: number) => void;
  onNavigate: (path: string) => void;
}> = ({ plan, onApprove, onReject, onToggleStep, onNavigate }) => {
  const approvedCount = plan.steps.filter(s => s.status === "approved").length;
  const progress = plan.steps.length > 0 ? (approvedCount / plan.steps.length) * 100 : 0;

  return (
    <div className="mt-3 border border-primary/20 bg-primary/5 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <ListChecks className="h-4 w-4 text-primary" />
          <h4 className="text-base font-semibold font-black text-white uppercase tracking-tight">{plan.title}</h4>
        </div>
        <p className="text-sm text-slate-400">{plan.description}</p>
        <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-slate-500 mt-1">{approvedCount}/{plan.steps.length} pasos seleccionados</p>
      </div>

      <div className="p-3 space-y-2">
        {plan.steps.map(step => (
          <PlanStepItem key={step.id} step={step} planTitle={plan.title} onToggle={onToggleStep} onNavigate={onNavigate} />
        ))}
      </div>

      {plan.status === "pending" && (
        <div className="p-3 border-t border-white/5 flex gap-2">
          <Button onClick={onApprove} size="sm" className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black uppercase">
            <Play className="h-3 w-3" /> Aprobar Plan
          </Button>
          <Button onClick={onReject} size="sm" variant="ghost" className="text-sm font-black uppercase text-slate-500 hover:text-red-400">
            Rechazar
          </Button>
        </div>
      )}
      {plan.status === "approved" && (
        <div className="p-3 border-t border-emerald-500/20 bg-emerald-500/5 text-center">
          <p className="text-sm font-black text-emerald-400 uppercase flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Plan aprobado — ¡Manos a la obra!
          </p>
        </div>
      )}
      {plan.status === "rejected" && (
        <div className="p-3 border-t border-red-500/20 bg-red-500/5 text-center">
          <p className="text-sm font-black text-red-400 uppercase flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Plan rechazado
          </p>
        </div>
      )}
    </div>
  );
};


// ─── Analysis Card ───
const AnalysisCard: React.FC<{ analysis: ProgressAnalysis; onNavigate: (path: string) => void }> = ({ analysis, onNavigate }) => {
  return (
  <div className="my-4 border border-primary/30 bg-primary/10 rounded-[1.5rem] overflow-hidden shadow-xl">
    <div className="p-4 border-b border-white/10 bg-primary/5">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-primary" />
        <span className="text-sm font-black text-white uppercase tracking-wider">Análisis de Progreso</span>
      </div>
    </div>
    <div className="p-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/50 rounded-2xl p-3 text-center border border-white/5">
          <p className="text-xl font-black text-primary leading-none mb-1">{analysis.totalProgress}%</p>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Global</p>
        </div>
        <div className="bg-slate-900/50 rounded-2xl p-3 text-center border border-white/5">
          <p className="text-xl font-black text-emerald-400 leading-none mb-1">{analysis.streak}</p>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Racha</p>
        </div>
        <div className="bg-slate-900/50 rounded-2xl p-3 text-center border border-white/5">
          <p className="text-xl font-black text-amber-500 leading-none mb-1">{analysis.estimatedReadiness}%</p>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Nivel</p>
        </div>
      </div>
    </div>

    {analysis.weakAreas.length > 0 && (
      <div className="px-5 pb-4 space-y-3">
        <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">⚠️ Temas Críticos (Click para estudiar)</p>
        <div className="space-y-2">
          {analysis.weakAreas.map((a, i) => (
            <button 
              key={i} 
              onClick={() => onNavigate(getUrlForPaso('video', a.id, a.name))}
              className="w-full space-y-1.5 group text-left hover:bg-white/5 p-1 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-300 truncate max-w-[150px] group-hover:text-primary transition-colors">{a.name}</span>
                <span className="text-rose-400 font-black">{a.percent}%</span>
              </div>
              <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-rose-500/80 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-1000" style={{ width: `${a.percent}%` }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    )}

    {analysis.recommendations.length > 0 && (
      <div className="p-5 pt-4 bg-emerald-500/5 border-t border-white/5">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">💡 Plan de Mejora</p>
        <div className="space-y-2">
          {analysis.recommendations.map((r, i) => {
            const isTopic = r.includes("Enfócate en");
            const topicName = isTopic ? r.split("Enfócate en ")[1].split(" (")[0] : "";
            
            return (
              <div 
                key={i} 
                onClick={() => {
                  if (isTopic) {
                     const area = areas.find(a => a.name === topicName || a.id === topicName.toLowerCase());
                     if (area) onNavigate(getUrlForPaso('video', area.id, area.name));
                  }
                }}
                className={cn(
                  "text-xs text-slate-300 flex items-start gap-2 bg-white/5 p-2 rounded-xl border border-white/5 transition-all",
                  isTopic && "hover:bg-primary/20 cursor-pointer border-primary/20"
                )}
              >
                <ArrowRight className={cn("h-3 w-3 mt-0.5 shrink-0 transition-colors", isTopic ? "text-primary" : "text-slate-600")} />
                <span className="leading-relaxed font-medium">{r}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
  );
};

// ─── Quiz Card ───
const QuizCard: React.FC<{ quiz: PersonalizedQuiz; onAnswer: (qId: string, idx: number) => void; answers: Record<string, number> }> = ({ quiz, onAnswer, answers }) => (
  <div className="my-3 border border-amber-500/20 bg-amber-500/5 rounded-2xl overflow-hidden">
    <div className="p-4 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span className="text-sm font-semibold font-black text-white uppercase tracking-wider">{quiz.title}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1">Nivel: {quiz.difficulty} · {quiz.questions.length} reactivos</p>
    </div>
    <div className="p-3 space-y-3">
      {quiz.questions.map((q, qi) => {
        const answered = answers[q.id] !== undefined;
        const isCorrect = answered && answers[q.id] === q.correctIndex;
        return (
          <div key={q.id} className={cn("p-3 rounded-xl border", answered ? (isCorrect ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5") : "border-white/5 bg-white/5")}>
            <p className="text-sm text-slate-200 font-medium mb-2">{qi + 1}. {q.text}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => !answered && onAnswer(q.id, oi)}
                  disabled={answered}
                  className={cn(
                    "text-xs text-left px-2.5 py-1.5 rounded-lg border transition-all",
                    answered && oi === q.correctIndex ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" :
                    answered && oi === answers[q.id] ? "border-red-500/30 bg-red-500/10 text-red-300" :
                    "border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answered && (
              <p className="text-sm text-slate-500 mt-1.5 italic">{q.explanation}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Report Card ───
const ReportCard: React.FC<{ report: any }> = ({ report }) => (
  <div className="my-4 border border-indigo-500/30 bg-indigo-500/10 rounded-[1.5rem] overflow-hidden shadow-lg mb-4">
    <div className="p-4 border-b border-white/10 bg-indigo-500/5">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-indigo-400" />
        <span className="text-sm font-black text-white uppercase tracking-wider">Rendimiento Semanal</span>
      </div>
    </div>
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Aprobados</p>
          <p className="text-2xl font-black text-white leading-none">{report.quizzesAprobados} <span className="text-sm text-slate-500">/ {report.totalQuizzes}</span></p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Precisión</p>
          <p className="text-2xl font-black text-indigo-400 leading-none">{Math.round(report.precision)}%</p>
        </div>
      </div>
      <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-black text-indigo-300/70 uppercase mb-1 tracking-widest">Fortaleza</p>
          <p className="text-sm font-black text-emerald-400 uppercase truncate">{report.areaMasEstudiada}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Award className="h-6 w-6 text-emerald-400" />
        </div>
      </div>
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest flex items-center gap-1">
          <Target className="h-3 w-3" /> Meta de la Semana
        </p>
        <p className="text-sm text-slate-200 font-bold leading-relaxed">{report.metaSemanal}</p>
      </div>
    </div>
  </div>
);

// ─── Alert Card ───
const AlertCard: React.FC<{ alert: any }> = ({ alert }) => (
  <div className="my-3 border border-rose-500/30 bg-rose-500/10 rounded-2xl p-4 flex gap-4 animate-in fade-in slide-in-from-left-2 transition-all shadow-md">
    <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0 ring-1 ring-rose-500/30">
      <AlertCircle className="h-5 w-5 text-rose-400" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Alerta de Riesgo</p>
      <p className="text-sm text-white font-bold leading-snug mb-3">{alert.message}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500">
          <span>Dominio actual</span>
          <span className="text-rose-500">{Math.round(alert.score)}%</span>
        </div>
        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-all duration-1000" style={{ width: `${alert.score}%` }} />
        </div>
      </div>
    </div>
  </div>
);

// ─── Recommendations Card ───
const RecommendationsCard: React.FC<{ recs: ContentRecommendation[]; onNavigate: (path: string) => void }> = ({ recs, onNavigate }) => {
  return (
  <div className="my-3 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl overflow-hidden shadow-lg shadow-emerald-500/5">
    <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-emerald-500/10">
      <TrendingUp className="h-4 w-4 text-emerald-400" />
      <span className="text-sm font-semibold font-black text-white uppercase tracking-wider">Plan de Acción Recomendado</span>
    </div>
    <div className="p-3 space-y-2">
      {recs.map((r, i) => {
        const icons = { video: <Play className="h-3.5 w-3.5" />, area: <BookOpen className="h-3.5 w-3.5" />, simulador: <Target className="h-3.5 w-3.5" /> };
        const prioColors = { alta: "text-red-400 bg-red-500/10 border-red-500/20", media: "text-amber-400 bg-amber-500/10 border-amber-500/20", baja: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
        return (
          <button
            key={i}
            onClick={() => {
              onNavigate(getUrlForPaso(r.type === 'area' ? 'video' : r.type, r.videoId || r.areaId || '0', r.title));
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all text-left group"
          >
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {icons[r.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-slate-200 truncate uppercase tracking-tight">{r.title}</p>
                <span className={cn("px-1.5 py-0.5 text-[9px] font-black uppercase rounded border shrink-0", prioColors[r.priority])}>
                  {r.priority}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 group-hover:text-slate-300 transition-colors">{r.reason}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-primary transition-all group-hover:translate-x-1" />
          </button>
        );
      })}
    </div>
  </div>
  );
};

// ─── Diagnostics Card ───
const DiagnosticsCard: React.FC<{ 
  result: DiagnosticsResult; 
  onFix: (checkId: string) => void; 
  onFixAll: () => void;
  fixingId: string | null;
  isFixingAll?: boolean;
}> = ({ result, onFix, onFixAll, fixingId, isFixingAll }) => {
  const statusIcon = (s: DiagnosticCheck["status"]) => {
    if (s === "ok") return <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
    if (s === "warning") return <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
    if (s === "error") return <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />;
    return <Loader2 className="h-3.5 w-3.5 text-slate-500 animate-spin shrink-0" />;
  };

  const overallColor = result.overallStatus === "ok" ? "border-emerald-500/20 bg-emerald-500/5"
    : result.overallStatus === "warning" ? "border-amber-500/20 bg-amber-500/5"
    : "border-red-500/20 bg-red-500/5";

  const overallIcon = result.overallStatus === "ok" ? <ShieldCheck className="h-4 w-4 text-emerald-400" />
    : result.overallStatus === "warning" ? <ShieldAlert className="h-4 w-4 text-amber-400" />
    : <XCircle className="h-4 w-4 text-red-400" />;

  const overallLabel = result.overallStatus === "ok" ? "Todo funcionando correctamente"
    : result.overallStatus === "warning" ? "Algunos problemas detectados"
    : "Se encontraron errores";

  const categories: { key: DiagnosticCheck["category"]; label: string }[] = [
    { key: "connectivity", label: "Conectividad" },
    { key: "session", label: "Sesión" },
    { key: "storage", label: "Almacenamiento" },
    { key: "data", label: "Datos" },
  ];

  return (
    <div className={cn("my-3 border rounded-2xl overflow-hidden", overallColor)}>
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold font-black text-white uppercase tracking-wider">Diagnóstico del Sistema</span>
        </div>
        <div className="flex items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 flex-1">
            {overallIcon}
            <span className="text-sm text-slate-300 font-medium">{overallLabel}</span>
          </div>
          {result.checks.some(c => (c.status === "error" || c.status === "warning") && c.fix) && (
            <Button
              onClick={onFixAll}
              disabled={!!fixingId || isFixingAll}
              size="sm"
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-black uppercase tracking-tighter text-[10px] h-9"
            >
              {isFixingAll ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Wrench className="h-3 w-3 mr-1" />}
              Autocorregir Todo
            </Button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-3">
        {categories.map(cat => {
          const catChecks = result.checks.filter(c => c.category === cat.key);
          if (catChecks.length === 0) return null;
          return (
            <div key={cat.key}>
              <p className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1.5">{cat.label}</p>
              <div className="space-y-1">
                {catChecks.map(check => (
                  <div key={check.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    {statusIcon(check.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium">{check.label}</p>
                      <p className="text-sm text-slate-500 truncate">{check.detail}</p>
                    </div>
                    {check.fix && check.fixLabel && (
                      <button
                        onClick={() => onFix(check.id)}
                        disabled={fixingId === check.id}
                        className="px-2 py-1 text-sm font-bold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1"
                      >
                        {fixingId === check.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wrench className="h-3 w-3" />}
                        {check.fixLabel}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {result.jsErrors.length > 0 && (
        <div className="px-3 pb-3">
          <p className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1.5">Últimos errores JS</p>
          <div className="max-h-24 overflow-y-auto space-y-0.5 custom-scrollbar">
            {result.jsErrors.slice(-5).map((e, i) => (
              <p key={i} className="text-sm text-red-400/80 font-mono truncate">{e.message}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Task Queue Components ───
const TaskItem: React.FC<{ task: AgentTask; onRemove: (id: string) => void; onRetry: (id: string) => void }> = ({ task, onRemove, onRetry }) => {
  const statusConfig = {
    queued: { color: "text-slate-400", icon: <Clock className="h-3 w-3 animate-pulse" />, label: "En cola" },
    running: { color: "text-primary", icon: <Loader2 className="h-3 w-3 animate-spin" />, label: "Procesando" },
    done: { color: "text-emerald-400", icon: <CheckCircle2 className="h-3 w-3" />, label: "Terminado" },
    error: { color: "text-red-400", icon: <AlertCircle className="h-3 w-3" />, label: "Error" },
  };

  const config = statusConfig[task.status];

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
      <div className={cn("mt-1 p-1 rounded bg-black/20", config.color)}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-[10px] font-black uppercase tracking-widest", config.color)}>
            {config.label}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.status === "error" && (
                <button onClick={() => onRetry(task.id)} className="p-1 hover:bg-white/10 rounded-lg text-primary transition-colors">
                    <RefreshCw className="h-3 w-3" />
                </button>
            )}
            <button onClick={() => onRemove(task.id)} className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        <p className="text-sm font-semibold text-slate-200 truncate mt-0.5">{task.prompt}</p>
        {(task.status === "done" || task.status === "error") && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 italic">
                {task.status === "done" ? task.result : task.error}
            </p>
        )}
      </div>
    </div>
  );
};

const TaskCenter: React.FC<{ 
    tasks: AgentTask[]; 
    onRemove: (id: string) => void; 
    onRetry: (id: string) => void;
    onClear: () => void;
    onClose: () => void;
}> = ({ tasks, onRemove, onRetry, onClear, onClose }) => {
  const activeCount = tasks.filter(t => t.status === "queued" || t.status === "running").length;

  return (
    <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter">Centro de Tareas</h2>
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">
                {activeCount} en curso · {tasks.length} totales
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
          <Minimize2 className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
            <Bot className="h-16 w-16 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">No hay tareas pendientes</p>
            <p className="text-xs">Las tareas complejas que envíes aparecerán aquí</p>
          </div>
        ) : (
          tasks.map(task => <TaskItem key={task.id} task={task} onRemove={onRemove} onRetry={onRetry} />)
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
        <Button onClick={onClear} variant="ghost" className="flex-1 text-slate-400 hover:text-white text-xs font-black uppercase" disabled={tasks.length === 0}>
            Limpiar Completados
        </Button>
      </div>
    </div>
  );
};

const StudyPlanCards: React.FC<{
  plans: PlanEstudio[];
  onToggle: (planId: string, pasoId: string) => void;
  onDelete: (planId: string) => void;
  onNavigate: (path: string) => void;
}> = ({ plans, onToggle, onDelete, onNavigate }) => {
  return (
  <div className="space-y-3 my-3">
    {plans.map(plan => {
      const done = plan.pasos.filter(p => p.completado).length;
      const total = plan.pasos.length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return (
        <div key={plan.id} className={cn("rounded-xl border p-3 text-sm", plan.completado ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-800/50 border-white/10")}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-bold text-white text-xs">{plan.titulo}</p>
              <p className="text-slate-400 text-sm">{plan.area} · {new Date(plan.fecha).toLocaleDateString('es-MX')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-bold", plan.completado ? "text-emerald-400" : "text-primary")}>{pct}%</span>
              <button onClick={() => onDelete(plan.id)} className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full mb-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="space-y-1">
            {plan.pasos.map(paso => (
              <button
                key={paso.id}
                onClick={() => onToggle(plan.id, paso.id)}
                className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors",
                  paso.completado ? "bg-emerald-500/10 text-emerald-300" : "hover:bg-white/5 text-slate-300"
                )}
              >
                {paso.completado ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Circle className="h-3.5 w-3.5 text-slate-500 shrink-0" />}
                <span className={cn("text-xs", paso.completado && "line-through opacity-70")}>{paso.titulo}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[9px] text-slate-500 uppercase font-black tracking-tight">{paso.tipo}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(getUrlForPaso(paso.tipo, paso.id, paso.titulo, plan.titulo + " " + plan.area));
                    }}
                    className="p-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-primary transition-all"
                    title="Ver contenido"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
  );
};


const MemoryBadge: React.FC<{ memory: AgentMemory }> = ({ memory }) => {
  const total = memory.decisions.length + memory.topics.length + memory.insights.length;
  if (total === 0) return null;

  return (
    <span className="hidden xs:inline-block px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] sm:text-xs font-bold text-primary uppercase">
      {total} memorias
    </span>
  );
};

// ─── Main Component ───
const AITutor = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { analyzeUserProgress, generatePersonalizedQuiz, getRecommendations, getExplanationContext } = useAITutorSkills();
  const { runDiagnostics, errorCount, clearErrors } = useAppDiagnostics();
  const { plans: studyPlans, addPlan, deletePlan, togglePaso, getActivePlans, getCompletedPlans } = useStudyPlans();
  const { getWeeklyReport, getRecomendacionesDiarias, getAlertasRiesgo } = useAnalisisRendimiento();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAgentSidebar, setShowAgentSidebar] = useState(true);
  const [showTasks, setShowTasks] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [memory, setMemory] = useState<AgentMemory>(loadMemory);
  const recognitionRef = useRef<any>(null);
  
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [fixingCheckId, setFixingCheckId] = useState<string | null>(null);
  const [latestDiagnostics, setLatestDiagnostics] = useState<DiagnosticsResult | null>(null);

  const agentNavigate = useAgentNavigation(setIsOpen);

  const buildContext = useCallback(() => {
    try {
      const analysis = analyzeUserProgress();
      const detailedSyllabus = {
        "1. Habilidad Verbal": ["1.1 Comprensión de lectura", "1.2 Manejo de vocabulario"],
        "2. Habilidad Matemática": ["2.1 Sucesiones numéricas y espaciales", "2.2 Imaginación espacial", "2.3 Razonamiento lógico"],
        "3. Español": ["3.1 Estructura de textos", "3.2 Tipos de textos", "3.3 Ortografía y gramática", "3.4 Organización de información"],
        "4. Matemáticas": ["4.1 Significado y uso de los números", "4.2 Álgebra", "4.3 Geometría", "4.4 Trigonometría", "4.5 Estadística y Probabilidad"],
        "5. Ciencias I (Biología)": ["5.1 Biodiversidad", "5.2 Materia y energía", "5.3 Salud", "5.4 Genética"],
        "6. Ciencias II (Física)": ["6.1 Movimiento, fuerzas y energía", "6.2 Interacciones de la materia", "6.3 Estructura interna de la materia"],
        "7. Ciencias III (Química)": ["7.1 Características de materiales", "7.2 Estructura y periodicidad"],
        "8. Historia": ["8.1 Historia Universal", "8.2 Historia de México"],
        "9. Geografía": ["9.1 Mapas", "9.2 Recursos y ambiente", "9.3 Población", "9.4 Economía", "9.5 Cultura"],
        "10. Formación Cívica": ["10.1 Valores", "10.2 Democracia", "10.3 Ciudadanía", "10.4 Solución de conflictos"]
      };
      
      return {
        currentPage: location.pathname,
        progress: analysis.totalProgress,
        weakAreas: analysis.weakAreas.map((a: any) => a.name),
        streak: analysis.streak,
        detailedSyllabus,
        system_instructions: `Eres CyberAgent, el tutor experto de BioReto Academy especializado en la GUÍA OFICIAL ECOEMS 2025/2026. Tu conocimiento se limita estrictamente al temario numerado: ${JSON.stringify(detailedSyllabus)}. Si te preguntan sobre temas fuera de este temario (como Inglés), indica amablemente que no forman parte del examen oficial.`
      };
    } catch {
      return { 
        currentPage: location.pathname,
        system_instructions: "Tutor experto en ECOEMS 2025. Enfoque en el temario oficial de ingreso a bachillerato."
      };
    }
  }, [location.pathname, analyzeUserProgress]);

  const ctxForQueue = useMemo(() => buildContext(), [buildContext]);
  const { tasks, addTask, removeTask, clearCompleted, retryTask } = useTaskQueue(memory, ctxForQueue);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "es-MX";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error("Permiso de micrófono denegado");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Tu navegador no soporta dictado por voz");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info("Escuchando...");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const speakMessage = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error("Tu navegador no soporta salida de voz");
      return;
    }

    if (isSpeaking === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Clean markdown and XML tags for better speech
    const cleanText = text
      .replace(/<reasoning>[\s\S]*?<\/reasoning>/g, "")
      .replace(/<plan>[\s\S]*?<\/plan>/g, "")
      .replace(/<decision>[\s\S]*?<\/decision>/g, "")
      .replace(/[\*\#\_]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "es-MX";
    utterance.rate = 1;
    
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Load messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const { data, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < MEMORY_TTL) return data;
      } catch { /* ignore */ }
    }

    const report = getWeeklyReport();
    const performanceRecs = getRecomendacionesDiarias();
    const alerts = getAlertasRiesgo();

    let welcomeText = "¡Hola! Soy **CyberAgent**, tu tutor experto especializado exclusivamente en el **Temario ECOEMS 2026**.\n\n";
    
    if (performanceRecs.length > 0) {
      welcomeText += `🔍 **Análisis Predictivo:** He detectado áreas del temario que podemos reforzar.\n\n`;
    }
    
    welcomeText += "Mi conocimiento está optimizado para las áreas de **Habilidades, Ciencias, Matemáticas, Historia, Español, Cívica y Geografía**. Si preguntas sobre otros temas (como Inglés), te ayudaré pero te recordaré que no forman parte del examen oficial.\n\n";

    welcomeText += "**¿En qué área del temario nos enfocamos hoy?**\n- Escribe `/reporte` para ver tu rendimiento.\n- Escribe `/analisis` para ver tus temas críticos.\n- Escribe `/recomienda` para un plan de acción ECOEMS.\n- Escribe `/explica [tema]` para conceptos del examen.\n- O simplemente hazme una consulta académica.";

    return [{
      role: "assistant" as const,
      content: welcomeText,
      id: "initial",
      report: report.totalQuizzes > 0 ? report : undefined,
      alerts: alerts.length > 0 ? alerts : undefined
    }];
  });

  // Persist messages & memory
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ data: messages, timestamp: Date.now() }));
  }, [messages]);

  useEffect(() => { saveMemory(memory); }, [memory]);
 
  // Update initial message once performance data is loaded from hook
  useEffect(() => {
    const report = getWeeklyReport();
    const alerts = getAlertasRiesgo();
    const performanceRecs = getRecomendacionesDiarias();

    if (report.totalQuizzes > 0 || performanceRecs.length > 0 || alerts.length > 0) {
      setMessages(prev => prev.map(m => {
        if (m.id !== 'initial' || m.report) return m;

        let welcomeText = "¡Hola de nuevo! He analizado tu rendimiento en el temario ECOEMS.\n\n";
        
        if (performanceRecs.length > 0) {
          welcomeText += `🔍 **Análisis Predictivo:** Tenemos temas pendientes en las áreas oficiales.\n\n`;
        }
        if (alerts.length > 0) {
          welcomeText += `🚨 **Alertas de Temario:** Hay temas de ECOEMS que requieren tu atención inmediata.\n\n`;
        }

        welcomeText += "**¿Qué te gustaría estudiar hoy?**\n- Escribe `/reporte` para ver tu rendimiento.\n- Escribe `/analisis` para ver tus áreas débiles.\n- Escribe `/recomienda` para un **Plan de Acción ECOEMS**.\n- O simplemente hazme una consulta sobre los temas del examen.";

        return { 
          ...m, 
          content: welcomeText,
          report: report.totalQuizzes > 0 ? report : undefined,
          alerts: alerts.length > 0 ? alerts : undefined
        };
      }));
    }
  }, [getWeeklyReport, getAlertasRiesgo, getRecomendacionesDiarias]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isStreaming]);

  const contextualSuggestions = useMemo(() => {
    const path = location.pathname;
    if (path === "/simulador-pro") return ["Dame una pista para esta pregunta", "Explica la estrategia del simulador"];
    if (path.includes("/area/")) return ["Crea un plan de estudio para esta área", "Resumen rápido de los temas clave"];
    return ["¿Cómo voy en mi progreso?", "Crea un plan de estudio personalizado", "Explícame razonamiento lógico"];
  }, [location.pathname]);

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(MEMORY_KEY);
    setMemory(prev => ({ ...prev, decisions: [], topics: [], insights: [], lastUpdated: Date.now() }));
    const report = getWeeklyReport();
    const performanceRecs = getRecomendacionesDiarias();
    const alerts = getAlertasRiesgo();

    let welcomeText = "¡Historial de memoria y chat reiniciados! Empecemos de nuevo. \n\n";
    
    if (performanceRecs.length > 0) {
      welcomeText += `🔍 **Análisis Predictivo:** He detectado que podrías mejorar en algunas áreas.\n\n`;
    }
    if (alerts.length > 0) {
      welcomeText += `🚨 **Alertas de Riesgo:** Se han identificado posibles riesgos en tu progreso.\n\n`;
    }

    welcomeText += "**¿Cómo puedes usarme?**\n- Escribe `/reporte` para ver tu rendimiento semanal.\n- Escribe `/analisis` para ver tu diagnóstico de áreas débiles.\n- Escribe `/recomienda` para generarte un **Plan de Acción** en base a tus resultados.\n- Escribe `/explica [tema]` para que te explique cualquier concepto con contexto del examen.\n- Escribe `/planes` para ver los planes que hemos construido juntos.\n- O simplemente platica conmigo y hazme preguntas.\n\n¿Con qué empezamos hoy?";

    setMessages([{
      role: "assistant",
      content: welcomeText,
      id: Date.now().toString(),
      report: report.totalQuizzes > 0 ? report : undefined,
      alerts: alerts.length > 0 ? alerts : undefined
    }]);
    setIsOpen(false);
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

      // Auto-save the plan if approved
      if (action === "approve") {
        const approvedSteps = m.plan.steps.filter(s => s.status === "approved" || s.status === "pending");
        if (approvedSteps.length > 0) {
           addPlan({
             area: "Plan Personalizado por IA",
             titulo: m.plan.title || "Plan de Acción",
             pasos: approvedSteps.map(s => ({
               id: s.id.toString(),
               titulo: s.text,
               tipo: "video",
               completado: false
             }))
           });
        }
      }

      return { ...m, plan: { ...m.plan, status: action === "approve" ? "approved" : "rejected" } };
    }));
    if (action === "approve") {
      setMemory(prev => ({
        ...prev,
        decisions: [...prev.decisions.slice(-20), {
          question: "Plan de estudio aprobado",
          chosen: messages.find(m => m.id === messageId)?.plan?.title || "Plan",
          reasoning: "Aprobado por el usuario",
          impact: "Se seguirán los pasos del plan guardado",
        }],
      }));
      toast.success("¡Plan aprobado y guardado! Escribe /planes para verlo en detalle.");
    } else {
      toast.error("Plan rechazado.");
    }
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

    // Handle skill commands
    const trimmed = text.trim().toLowerCase();

    // /diagnostico - System diagnostics
    if (trimmed === '/diagnostico' || trimmed === '/diagnóstico') {
      setInput("");
      const userMsg: Message = { role: "user", content: text.trim(), id: Date.now().toString() };
      const loadingId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, userMsg, {
        role: "assistant" as const,
        content: "🔍 Ejecutando diagnóstico del sistema...",
        id: loadingId,
      }]);
      const result = await runDiagnostics();
      setLatestDiagnostics(result);
      setMessages(prev => prev.map(m =>
        m.id === loadingId ? {
          ...m,
          content: result.overallStatus === "ok"
            ? "✅ Diagnóstico completo — Todo funciona correctamente:"
            : result.overallStatus === "warning"
            ? "⚠️ Diagnóstico completo — Se encontraron algunos problemas:"
            : "❌ Diagnóstico completo — Se detectaron errores:",
          diagnostics: result,
        } : m
      ));
      return;
    }

    // /reporte - Performance report
    if (trimmed === '/reporte') {
      const report = getWeeklyReport();
      setInput("");
      setMessages(prev => [...prev, {
        role: "user" as const, content: text.trim(), id: Date.now().toString()
      }, {
        role: "assistant" as const,
        content: report.totalQuizzes > 0 
          ? `📈 Aquí tienes tu resumen de rendimiento de esta semana. ¡Sigue así!` 
          : "📭 Aún no tienes suficiente actividad esta semana para generar un reporte detallado. ¡Completa algunos quizzes!",
        id: (Date.now() + 1).toString(),
        report: report.totalQuizzes > 0 ? report : undefined,
      }]);
      return;
    }

    // /analisis - Deep progress analysis
    if (trimmed === '/analisis' || trimmed === '/análisis') {
      const analysis = analyzeUserProgress();
      setInput("");
      setMessages(prev => [...prev, {
        role: "user" as const, content: text.trim(), id: Date.now().toString()
      }, {
        role: "assistant" as const,
        content: `📊 Aquí tienes tu análisis completo de progreso:`,
        id: (Date.now() + 1).toString(),
        analysis,
      }]);
      return;
    }

    // /quiz [area] - Personalized quiz
    const quizMatch = text.trim().match(/^\/quiz\s*(.*)/i);
    if (quizMatch) {
      const areaName = quizMatch[1]?.trim() || undefined;
      const quiz = generatePersonalizedQuiz(areaName, 5);
      setInput("");
      if (!quiz) {
        setMessages(prev => [...prev, {
          role: "user" as const, content: text.trim(), id: Date.now().toString()
        }, {
          role: "assistant" as const,
          content: '⚠️ No pude generar un quiz. Intenta con `/quiz matemática` o `/quiz verbal`.',
          id: (Date.now() + 1).toString(),
        }]);
        return;
      }
      setQuizAnswers({});
      setMessages(prev => [...prev, {
        role: "user" as const, content: text.trim(), id: Date.now().toString()
      }, {
        role: "assistant" as const,
        content: `🎯 Quiz personalizado generado. ¡Demuestra lo que sabes!`,
        id: (Date.now() + 1).toString(),
        quiz,
      }]);
      return;
    }

    // /recomienda - Content recommendations + auto-save plan
    if (trimmed === '/recomienda' || trimmed === '/recomendaciones') {
      const recs = getRecommendations();
      setInput("");

      // Auto-save as study plan if there are recommendations
      if (recs.length > 0) {
        const topArea = recs[0].areaId || 'general';
        const areaName = recs[0].reason?.match(/:\s*(.+?)\s*\(/)?.[1] || 'Estudio personalizado';
        addPlan({
          area: areaName,
          titulo: `Plan recomendado — ${new Date().toLocaleDateString('es-MX')}`,
          pasos: recs.map(r => ({
            tipo: r.type === 'simulador' ? 'simulador' as const : r.type === 'area' ? 'video' as const : 'video' as const,
            id: r.videoId || r.areaId || r.title,
            titulo: r.title,
            completado: false,
          })),
        });
        toast.success('📋 Plan de estudio guardado automáticamente');
      }

      setMessages(prev => [...prev, {
        role: "user" as const, content: text.trim(), id: Date.now().toString()
      }, {
        role: "assistant" as const,
        content: recs.length > 0 ? '🚀 Aquí tienes recomendaciones personalizadas basadas en tu progreso:\n\n📋 *Plan guardado automáticamente.* Escribe `/planes` para verlo.' : '✅ ¡No hay recomendaciones pendientes! Estás al día.',
        id: (Date.now() + 1).toString(),
        recommendations: recs.length > 0 ? recs : undefined,
      }]);
      return;
    }

    // /cola - View agent tasks
    if (trimmed === '/cola' || trimmed === '/tareas') {
      setInput("");
      setShowTasks(true);
      setMessages(prev => [...prev, {
        role: "user" as const, content: text.trim(), id: Date.now().toString()
      }, {
        role: "assistant" as const,
        content: `📋 He abierto el **Centro de Tareas**. Aquí puedes ver los procesos que estoy ejecutando en segundo plano para ti.`,
        id: (Date.now() + 1).toString(),
      }]);
      return;
    }

    // /background - Send current thought to background
    const bgMatch = text.trim().match(/^\/(bg|background|cola)\s+(.+)/i);
    if (bgMatch) {
        const prompt = bgMatch[2];
        await addTask(prompt, "media");
        setInput("");
        setMessages(prev => [...prev, {
            role: "user" as const, content: text.trim(), id: Date.now().toString()
          }, {
            role: "assistant" as const,
            content: `⚙️ Entendido. He movido la tarea "**${prompt}**" a la cola de procesamiento en segundo plano. Te avisaré por aquí cuando termine.`,
            id: (Date.now() + 1).toString(),
        }]);
        return;
    }

    // /planes - View saved study plans
    if (trimmed === '/planes' || trimmed === '/plan') {
      setInput("");
      const active = getActivePlans();
      const completed = getCompletedPlans();
      setMessages(prev => [...prev, {
        role: "user" as const, content: text.trim(), id: Date.now().toString()
      }, {
        role: "assistant" as const,
        content: studyPlans.length > 0
          ? `📚 Tienes **${active.length}** plan(es) activo(s) y **${completed.length}** completado(s):`
          : '📭 No tienes planes guardados aún. Usa `/recomienda` para generar uno.',
        id: (Date.now() + 1).toString(),
        studyPlans: studyPlans.length > 0 ? studyPlans : undefined,
      }]);
      return;
    }

    // /explica <tema> - Enhanced explanation via AI with context
    const explicaMatch = text.trim().match(/^\/explica\s+(.+)/i);
    if (explicaMatch) {
      const topic = explicaMatch[1];
      const explanationContext = getExplanationContext(topic);
      // Inject context into the prompt and let AI handle it
      const enrichedPrompt = `Explícame detalladamente el tema "${topic}" para el examen ECOEMS.\n\nContexto de la plataforma:\n${explanationContext || 'No hay contenido específico disponible.'}`;
      // Fall through to normal AI processing with enriched prompt
      const userMsg: Message = { role: "user", content: text.trim(), id: Date.now().toString() };
      setMessages(prev => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);

      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();
      const upsertAssistant = (chunk: string) => {
        assistantContent += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          const displayContent = stripStreamingBlocks(assistantContent);
          
          if (last?.role === "assistant" && last.id === assistantId) {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: displayContent } : m);
          }
          return [...prev, { role: "assistant", content: displayContent, id: assistantId }];
        });
      };

      try {
        await streamChat({
          messages: [{ role: "user", content: enrichedPrompt }],
          context: buildContext(),
          memory,
          onDelta: upsertAssistant,
          onDone: () => {
            const { reasoning, decisions, plan, cleanContent } = parseAllBlocks(assistantContent);
            if (decisions.length > 0) setMemory(prev => ({ ...prev, decisions: [...prev.decisions, ...decisions].slice(-20) }));
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: cleanContent, reasoning, decisions: decisions.length > 0 ? decisions : undefined, plan } : m));
            setIsStreaming(false);
          },
        });
      } catch (err: any) {
        setMessages(prev => {
          const errContent = `⚠️ ${err.message || "Error de conexión."}`;
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id === assistantId) return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: errContent } : m);
          return [...prev, { role: "assistant", content: errContent, id: assistantId }];
        });
        setIsStreaming(false);
      }
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
        const displayContent = stripStreamingBlocks(assistantContent);

        if (last?.role === "assistant" && last.id === assistantId) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: displayContent } : m);
        }
        return [...prev, { role: "assistant", content: displayContent, id: assistantId }];
      });
    };

    try {
      const detailedSyllabus = {
        "1. Habilidad Verbal": ["1.1 Comprensión de lectura", "1.2 Manejo de vocabulario (Analogías, Sinónimos, Antónimos)"],
        "2. Habilidad Matemática": ["2.1 Sucesiones numéricas y espaciales", "2.2 Imaginación espacial", "2.3 Razonamiento lógico"],
        "3. Español": ["3.1 Estructura de textos", "3.2 Tipos de textos", "3.3 Ortografía y gramática", "3.4 Organización de información"],
        "4. Matemáticas": ["4.1 Significado y uso de los números", "4.2 Álgebra (Ecuaciones, Factorización)", "4.3 Geometría (Pitágoras, Áreas)", "4.4 Trigonometría", "4.5 Estadística y Probabilidad"],
        "5. Ciencias I (Biología)": ["5.1 Biodiversidad y evolución", "5.2 Materia y energía (Fotosíntesis)", "5.3 Salud", "5.4 Genética"],
        "6. Ciencias II (Física)": ["6.1 Movimiento, fuerzas y energía", "6.2 Interacciones de la materia", "6.3 Estructura interna de la materia"],
        "7. Ciencias III (Química)": ["7.1 Características de materiales", "7.2 Estructura y periodicidad (Tabla Periódica)"],
        "8. Historia": ["8.1 Historia Universal", "8.2 Historia de México"],
        "9. Geografía": ["9.1 Mapas", "9.2 Recursos y ambiente", "9.3 Población", "9.4 Economía", "9.5 Cultura"],
        "10. Formación Cívica": ["10.1 Valores y autonomía", "10.2 Democracia", "10.3 Ciudadanía y Participación", "10.4 Solución de conflictos"]
      };

      const systemMsg = { 
        role: "system", 
        id: "system-instruction",
        content: `Eres CyberAgent, el tutor de élite de BioReto Academy especializado EXCLUSIVAMENTE en la GUÍA OFICIAL ECOEMS 2025/2026. 
        
        TEMARIO OFICIAL NUMERADO: ${JSON.stringify(detailedSyllabus)}. 

        REGLAS DE ORO DE RESPUESTA:
        1. CITACIÓN NUMERADA: Es OBLIGATORIO que siempre que expliques un tema menciones el número exacto del temario. Ejemplo: "Sobre el punto 4.2 Álgebra, específicamente en ecuaciones..." o "De acuerdo al temario oficial en el subtema 2.1 Sucesiones...".
        2. ESTRUCTURA: Usa el formato 'X.Y [Nombre del Tema]' para dar estructura a tus respuestas.
        3. DIAGRAMAS VISUALES: Si el tema es complejo, genera un diagrama mermaid.
        4. BLOQUEO: Si preguntan fuera del ECOEMS, rechaza amablemente mencionando que no está en el temario numerado.
        5. PLANES: Al dar un <plan>, incluye "videoId" y "areaId" para que los links funcionen.`
      };

      // Always include the system message at the start, then the last N messages
      const conversationHistory = messages
        .filter(m => m.id !== "initial")
        .slice(-12)
        .map(m => ({ role: m.role, content: m.content }));

      const history = [
        { role: systemMsg.role, content: systemMsg.content },
        ...conversationHistory,
        { role: userMsg.role, content: userMsg.content }
      ];

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
            {errorCount >= 3 ? (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-primary flex items-center justify-center">
                <Activity className="h-2.5 w-2.5 text-white" />
              </div>
            ) : (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-primary" />
            )}
          </div>
        )}
      </button>

      <div className={cn(
        "fixed transition-all duration-500 origin-bottom-right z-[100] flex flex-col overflow-hidden bg-slate-950/90 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] rounded-[2rem]",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-40 pointer-events-none",
        isExpanded 
          ? "bottom-0 right-0 w-full h-[100dvh] sm:rounded-none border-none z-[1000]" 
          : "bottom-20 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-6 w-[95vw] sm:w-[550px] h-[650px] max-h-[75vh]"
      )}>
        {/* Header */}
        <div className="p-3 sm:p-5 border-b border-white/5 bg-gradient-to-r from-primary/20 via-slate-900/40 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center relative shrink-0">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-emerald-500 rounded-full border-[2px] sm:border-[3px] border-slate-950" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-[0.1em] sm:tracking-[0.15em] truncate">
                  Cyber<span className="hidden xs:inline">Agent</span>
                </h4>
                <div className="flex items-center gap-1 sm:gap-2">
                  <p className="text-[9px] sm:text-xs text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-0.5 sm:gap-1">
                    <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                    v6.0
                  </p>
                  <MemoryBadge memory={memory} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowTasks(!showTasks)}
                title="Tareas"
                className={cn("p-1.5 sm:p-2 rounded-xl transition-all relative hidden xs:flex", showTasks ? "bg-primary text-white" : "hover:bg-white/10 text-slate-500 hover:text-white")}
              >
                <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {tasks.filter(t => t.status === "queued" || t.status === "running").length > 0 && (
                    <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
                )}
              </button>
              {isExpanded && (
                <button
                  onClick={() => setShowAgentSidebar(!showAgentSidebar)}
                  title={showAgentSidebar ? "Ocultar panel lateral" : "Mostrar panel lateral"}
                  className={cn("p-1.5 sm:p-2 rounded-xl transition-all hidden xs:flex", showAgentSidebar ? "bg-primary/20 text-primary" : "hover:bg-white/10 text-slate-500")}
                >
                  <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Contraer chat" : "Expandir chat"}
                className="p-1.5 sm:p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-colors"
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              </button>
              <button
                onClick={clearHistory}
                title="Reiniciar chat y memoria"
                className="p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={cn("flex-1 flex overflow-hidden", isExpanded ? "flex-row" : "flex-col")}>
          {/* Chat Column */}
          <div className="flex-1 flex flex-col min-w-0 bg-white/[0.02]">
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
                <div className={cn("space-y-5", isExpanded && "max-w-6xl mx-auto px-4 lg:px-12")}>
                  {showTasks && !isExpanded && (
                      <TaskCenter 
                        tasks={tasks} 
                        onRemove={removeTask} 
                        onRetry={retryTask} 
                        onClear={clearCompleted} 
                        onClose={() => setShowTasks(false)} 
                      />
                  )}
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
                      "px-4 py-3 text-sm md:text-base font-medium leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary rounded-2xl rounded-tr-none text-primary-foreground shadow-xl font-bold"
                        : "bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-slate-200"
                    )}>
                      {msg.reasoning && <ReasoningCard reasoning={msg.reasoning} />}
                      {msg.decisions?.map((d, i) => <DecisionCard key={i} decision={d} />)}
                      {msg.analysis && <AnalysisCard analysis={msg.analysis} onNavigate={agentNavigate} />}
                      {msg.report && <ReportCard report={msg.report} />}
                      {msg.alerts?.map((a, i) => <AlertCard key={i} alert={a} />)}
                      {msg.quiz && <QuizCard quiz={msg.quiz} answers={quizAnswers} onAnswer={(qId, idx) => setQuizAnswers(prev => ({ ...prev, [qId]: idx }))} />}
                      {msg.recommendations && <RecommendationsCard recs={msg.recommendations} onNavigate={agentNavigate} />}
                      {msg.diagnostics && <DiagnosticsCard 
                        result={msg.diagnostics} 
                        fixingId={fixingCheckId} 
                        isFixingAll={fixingCheckId === 'all'}
                        onFixAll={async () => {
                          const fixable = msg.diagnostics!.checks.filter(c => (c.status === "error" || c.status === "warning") && c.fix);
                          if (fixable.length === 0) return;
                          
                          setFixingCheckId('all');
                          let successCount = 0;
                          for (const check of fixable) {
                            try {
                              await check.fix!();
                              successCount++;
                            } catch (e) {
                              console.error(`Error fixing ${check.id}:`, e);
                            }
                          }
                          
                          toast.success(`Corrección masiva completa: ${successCount} problemas resueltos`);
                          
                          // Re-run diagnostics
                          const newResult = await runDiagnostics();
                          setLatestDiagnostics(newResult);
                          setMessages(prev => prev.map(m =>
                            m.id === msg.id ? { ...m, diagnostics: newResult } : m
                          ));
                          setFixingCheckId(null);
                        }}
                        onFix={async (checkId) => {
                          const check = msg.diagnostics!.checks.find(c => c.id === checkId);
                          if (!check?.fix) return;
                          setFixingCheckId(checkId);
                          try {
                            const fixResult = await check.fix();
                            toast.success(`Auto-corrección: ${fixResult}`);
                            // Re-run diagnostics
                            const newResult = await runDiagnostics();
                            setLatestDiagnostics(newResult);
                            setMessages(prev => prev.map(m =>
                              m.id === msg.id ? { ...m, diagnostics: newResult } : m
                            ));
                          } catch { toast.error("Error al aplicar corrección"); }
                          setFixingCheckId(null);
                        }}
                      />}
                      {msg.studyPlans && <StudyPlanCards plans={msg.studyPlans} onToggle={togglePaso} onDelete={deletePlan} onNavigate={agentNavigate} />}
                      {msg.plan && (
                        <PlanCard
                          plan={msg.plan}
                          onApprove={() => handlePlanAction(msg.id, "approve")}
                          onReject={() => handlePlanAction(msg.id, "reject")}
                          onToggleStep={(stepId) => handleToggleStep(msg.id, stepId)}
                          onNavigate={agentNavigate}
                        />
                      )}
                      {msg.role === "assistant" ? (
                        <div className={cn("prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 prose-strong:text-white prose-a:text-primary", isExpanded ? "prose-base" : "prose-sm")}>
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                if (!inline && match && match[1] === 'mermaid') {
                                  return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                                }
                                return (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                              a({ href, children }: any) {
                                if (href?.startsWith('citation://')) {
                                  const url = href.replace('citation://', '');
                                  const [materia, code] = url.split('/');
                                  return (
                                    <button 
                                      onClick={() => {
                                        const areaId = MATERIA_TO_AREA[materia];
                                        if (!areaId) {
                                           toast.error(`Materia "${materia}" no reconocida.`);
                                           return;
                                        }
                                        const area = areas.find(a => a.id === areaId);
                                        if (!area) return;
                                        const chapter = code.split('.')[0];
                                        const prefix = MATERIA_PREFIX[materia] || materia.toLowerCase();
                                        const targetVideoId = `${prefix}-${chapter}`;
                                        const videoExists = area.videos.some(v => v.id === targetVideoId);
                                        
                                        if (videoExists) {
                                            agentNavigate(`/area/${areaId}?video=${targetVideoId}`);
                                        } else {
                                            agentNavigate(`/area/${areaId}`);
                                        }
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-black text-[10px] uppercase tracking-tighter mx-0.5 align-middle shadow-sm hover:scale-105 active:scale-95"
                                      title={`Ref: ${materia} ${code} - Clic para ver temario`}
                                    >
                                      <BookOpen className="h-2.5 w-2.5" />
                                      {children}
                                    </button>
                                  );
                                }

                                  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
                                },
                                img({ src, alt }: any) {
                                  return (
                                    <div className="my-4 group relative cursor-zoom-in overflow-hidden rounded-2xl border border-white/10" onClick={() => window.open(src, '_blank')}>
                                      <img src={src} alt={alt} className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                                          <Maximize2 className="h-4 w-4 text-white" />
                                          <span className="text-xs font-bold text-white uppercase tracking-widest">Abrir en grande</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                            }}
                          >
                            {msg.content.replace(
                              /\[([A-Z-]{2,5})\s+(\d+(\.\d+)?)\]/g, 
                              (match, materia, code) => `[${match}](citation://${materia}/${code})`
                            )}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span>{msg.content}</span>
                      )}
                    </div>
                  </div>

                  {msg.role === "assistant" && msg.id !== "initial" && !isStreaming && (
                    <div className="flex items-center gap-2 px-9">
                      <button
                        onClick={() => speakMessage(msg.content, msg.id)}
                        className={cn("p-1 rounded-lg transition-colors", isSpeaking === msg.id ? "text-primary bg-primary/10" : "text-slate-600 hover:text-white hover:bg-white/5")}
                        title={isSpeaking === msg.id ? "Detener voz" : "Escuchar respuesta"}
                      >
                        {isSpeaking === msg.id ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </button>
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
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Razonando...</span>
                </div>
              )}
              </div>
            </div>

            {/* Suggestions */}
            {!isStreaming && (
              <div className={cn("px-5 py-2 flex flex-wrap gap-1.5", isExpanded && "max-w-3xl mx-auto w-full")}>
                {contextualSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 bg-slate-800/50 hover:bg-primary/20 border border-white/5 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Overlay for chat */}
            <div className="p-5 bg-slate-900/50 border-t border-white/5">
              <div className={cn("w-full mx-auto", isExpanded && "max-w-3xl")}>
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
                    {[
                      { label: "📈 Reporte", cmd: "/reporte" },
                      { label: "📊 Análisis", cmd: "/analisis" },
                      { label: "✨ Planes IA", cmd: "/recomienda" },
                      { label: "📚 Mis Planes", cmd: "/planes" },
                      { label: "🧠 Explica...", cmd: "/explica " },
                      { label: "🧩 Quiz...", cmd: "/quiz " },
                      { label: "🔧 Sistema", cmd: "/diagnostico" }
                    ].map((btn, i) => (
                      <button
                        key={i}
                        onClick={() => btn.cmd.endsWith(" ") ? setInput(btn.cmd) : sendMessage(btn.cmd)}
                        disabled={isStreaming}
                        className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:bg-primary/20 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                        placeholder={isListening ? "Escuchando..." : "Pregunta algo o usa un comando..."}
                        disabled={isStreaming}
                        className={cn(
                          "w-full bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all focus:ring-2 ring-primary/10 disabled:opacity-50",
                          isListening && "border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                        )}
                      />
                      <button
                        onClick={toggleListening}
                        disabled={isStreaming}
                        className={cn(
                          "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all",
                          isListening ? "text-primary animate-pulse" : "text-slate-500 hover:text-white hover:bg-white/5"
                        )}
                        title="Dictado por voz"
                      >
                        {isListening ? <Mic className="h-5 w-5" /> : <Mic className="h-5 w-5 opacity-50" />}
                      </button>
                    </div>
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isStreaming}
                      className="h-12 w-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] text-center mt-3 opacity-50">
                    Propulsado por CyberAgent IA v8.4
                  </p>
                </div>
              </div>
            </div>

          {/* Sidebar for Expanded Mode */}
          {isExpanded && showAgentSidebar ? (
            <div className="w-80 border-l border-white/5 bg-slate-900/30 flex flex-col p-6 space-y-8 overflow-y-auto hidden lg:flex animate-in slide-in-from-right duration-300">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History className="h-3 w-3" /> Memoria del Agente
                </h3>
                <div className="space-y-4">
                  {memory.topics.length > 0 && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-[10px] font-black text-primary uppercase mb-2">Temas Recientes</p>
                        <div className="flex flex-wrap gap-1">
                          {memory.topics.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-[10px] text-primary-foreground font-bold">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                  )}
                  {memory.decisions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Últimas Decisiones</p>
                        {memory.decisions.slice(-3).map((d, i) => (
                           <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 text-[10px]">
                              <p className="text-white font-bold truncate">{d.question}</p>
                              <p className="text-slate-500 italic truncate">{d.chosen}</p>
                           </div>
                        ))}
                      </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers className="h-3 w-3" /> Actividad en Cola
                </h3>
                <div className="space-y-2">
                   {tasks.length === 0 ? (
                       <p className="text-[10px] text-slate-600 italic">No hay procesos activos...</p>
                   ) : (
                       tasks.slice(0, 5).map(task => (
                           <div key={task.id} className="p-3 rounded-xl bg-black/20 border border-white/5">
                               <div className="flex items-center justify-between gap-2 mb-1">
                                   <span className={cn("text-[9px] font-black uppercase", task.status === "running" ? "text-primary" : "text-slate-500")}>
                                       {task.status === "running" ? "Procesando" : task.status}
                                   </span>
                                   {task.status === "running" && <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />}
                               </div>
                               <p className="text-[11px] font-bold text-slate-300 truncate">{task.prompt}</p>
                           </div>
                       ))
                   )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
                    <p className="text-[10px] font-black text-white uppercase mb-1">Tu Nivel Actual</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-primary">84%</span>
                        <span className="text-[10px] text-emerald-400 font-bold mb-1 tracking-tighter">↑ 12% este mes</span>
                    </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AITutor;
