import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Bot, User, Loader2, Brain, RefreshCw, GraduationCap,
  CheckCircle2, Circle, Clock, Zap, ChevronRight, ListChecks,
  ThumbsUp, ThumbsDown, AlertTriangle, Play, Lightbulb, ChevronDown,
  BookOpen, Target, History, Layers, Plus, Trash2, Eye, XCircle,
  BarChart3, Sparkles, Search, TrendingUp, Award, ArrowRight,
  Shield, ShieldCheck, ShieldAlert, Wrench, Activity, AlertCircle,
  Maximize2, Minimize2, Mic, MicOff, Volume2, VolumeX, PanelRightClose, PanelRightOpen, LayoutDashboard, Ticket, TicketSlash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAITutorSkills, ProgressAnalysis, PersonalizedQuiz, ContentRecommendation } from "@/hooks/useAITutorSkills";
import { useAppDiagnostics, DiagnosticsResult, DiagnosticCheck } from "@/hooks/useAppDiagnostics";
import { useStudyPlans, PlanEstudio } from "@/hooks/useStudyPlans";
import { useAnalisisRendimiento } from "@/hooks/useAnalisisRendimiento";
import { useTaskQueue, AgentTask } from "@/hooks/useTaskQueue";
import { useChatAnalytics } from "@/hooks/useChatAnalytics";
import { areas } from "@/data/areas";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Mermaid from "./Mermaid";
import ChartRenderer, { ChartData } from "./ChartRenderer";
import EduImageViewer from "./EduImageViewer";
import { imageByKey, EduImage, educationalImages, availableImageKeys } from "@/data/educationalImages";
import { materiales } from "@/data/materialComplementario";
import { Image as ImageIcon } from "lucide-react";

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
  "HIST-M": "historia-mexico",
  "HIST-U": "historia-universal",
  "HIST": "historia-universal",
  "HIS": "historia-universal",
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
  "HIST-M": "hm-mx",
  "HIST-U": "hu",
  "HIST": "hu",
  "HIS": "hu",
  "GEO": "geo",
  "FCE": "fce"
};

// ─── Semantic Matching ───
export function resolveVideoId(areaId: string, videoId: string): { areaId: string, videoId: string } {
  const cleanAreaId = String(areaId || "").toLowerCase();
  const rawVideoId = String(videoId || "");
  const cleanVideoId = rawVideoId.toLowerCase().replace(/[-_]/g, ' ');

  let targetArea = areas.find(a => a.id.toLowerCase() === cleanAreaId);

  // 1. Fuzzy match Area
  if (!targetArea) {
    const searchTerms = cleanAreaId.split(/[\s]+/).filter(t => t.length > 3);
    targetArea = areas.find(a => 
      searchTerms.some(term => a.name.toLowerCase().includes(term) || a.id.toLowerCase().includes(term))
    ) || areas[0];
  }

  // 2. Fuzzy match Video
  let targetVideoId = "";
  const exactVideo = targetArea.videos.find(v => v.id.toLowerCase() === rawVideoId.toLowerCase());
  
  if (exactVideo) {
    targetVideoId = exactVideo.id;
  } else {
    const partialMatch = targetArea.videos.find(v => v.id.endsWith(`-${rawVideoId}`));
    if (partialMatch) {
      targetVideoId = partialMatch.id;
    } else {
      const videoTerms = cleanVideoId.split(/[\s]+/).filter(t => t.length > 2);
      const matchedVideo = targetArea.videos.find(v => 
        videoTerms.some(term => v.title.toLowerCase().includes(term)) ||
        videoTerms.some(term => v.description.toLowerCase().includes(term))
      );

      if (matchedVideo) {
        targetVideoId = matchedVideo.id;
      } else {
        targetVideoId = targetArea.videos[0]?.id || "0";
      }
    }
  }

  return { areaId: targetArea.id, videoId: targetVideoId };
}

// ─── Navigation Helper ───
function getUrlForPaso(type: string, id: string, title?: string, areaHint?: string): string {
  
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
    
    // Quick Check: Is areaHint literally any of the area IDs?
    const explicitArea = areas.find(a => areaHint && (a.id === areaHint.toLowerCase() || a.id.replace('-', '') === areaHint.toLowerCase().replace('-', '')));
    if (explicitArea) targetAreaId = explicitArea.id;

    if (!targetAreaId) {
      const areaMap: Record<string, string> = {
        'habilidad': 'habilidades', 'verbal': 'habilidades', 'razonamiento': 'habilidades',
        'matemática': 'matematicas', 'número': 'matematicas', 'álgebra': 'matematicas', 'geometría': 'matematicas',
        'biología': 'biologia', 'célula': 'biologia', 'seres vivos': 'biologia', 'genética': 'biologia', 'biologia': 'biologia',
        'física': 'fisica', 'movimiento': 'fisica', 'fuerza': 'fisica', 'energía': 'fisica', 'cinemática': 'fisica', 'fisica': 'fisica',
        'química': 'quimica', 'átomo': 'quimica', 'reacción': 'quimica', 'materia': 'quimica', 'quimica': 'quimica',
        'geografía': 'geografia', 'mapa': 'geografia', 'población': 'geografia', 'geografia': 'geografia',
        'español': 'espanol', 'lectura': 'espanol', 'gramática': 'espanol', 'puntuación': 'espanol', 'espanol': 'espanol',
        'méxico': 'historia-mexico', 'mexico': 'historia-mexico', 'historia de méxico': 'historia-mexico', 'historia de mexico': 'historia-mexico',
        'universal': 'historia-universal', 'siglo': 'historia-universal', 'historia universal': 'historia-universal',
        'cívica': 'formacion-civica', 'civica': 'formacion-civica', 'ética': 'formacion-civica', 'etica': 'formacion-civica', 'democracia': 'formacion-civica'
      };
      
      for (const [key, val] of Object.entries(areaMap)) {
        if (context.includes(key)) {
          targetAreaId = val;
          break;
        }
      }
    }

    // If we found an area and ID is a number, try to resolve it to a real video ID
    if (targetAreaId && /^\d+$/.test(id)) {
      const area = areas.find(a => a.id === targetAreaId);
      if (area) {
        const firstVideoId = area.videos[0]?.id || '';
        const prefix = firstVideoId.split('-')[0] || '';
        targetVideoId = prefix ? `${prefix}-${id}` : id;
      }
    }
  }

  // If still no area, try to find ANY match in keywords from areas names
  if (!targetAreaId) {
    const foundArea = areas.find(a => cleanTitle.includes(a.id) || a.name.toLowerCase().includes(cleanTitle));
    if (foundArea) targetAreaId = foundArea.id;
  }

  targetAreaId = targetAreaId || 'habilidades';
  
  // 4. Final Validation: Ensure targetVideoId actually exists in the targetAreaId
  const finalArea = areas.find(a => a.id === targetAreaId);
  if (finalArea) {
    const exists = finalArea.videos.some(v => v.id === targetVideoId);
    if (!exists) {
      // If the ID is a number and not found, try prefixes
      const prefixes = ['hv', 'hm', 'bio', 'fis', 'qui', 'mat', 'esp', 'hu', 'hm-mx', 'geo', 'fce'];
      let found = false;
      for (const p of prefixes) {
        const potentialId = `${p}-${targetVideoId}`;
        if (finalArea.videos.some(v => v.id === potentialId)) {
          targetVideoId = potentialId;
          found = true;
          break;
        }
      }
      // If still not found, default to first video of area instead of "0"
      if (!found) {
        targetVideoId = finalArea.videos[0]?.id || targetVideoId;
      }
    }
  }

  if (type === 'quiz') return `/area/${targetAreaId}?tab=quiz&video=${targetVideoId}`;
  if (type === 'infografia') return `/area/${targetAreaId}?tab=infografia&video=${targetVideoId}`;
  if (type === 'flashcards') return `/area/${targetAreaId}?tab=flashcards&video=${targetVideoId}`;
  if (type === 'pdf') return `/area/${targetAreaId}?tab=pdf&video=${targetVideoId}`;
  if (type === 'guia') return `/area/${targetAreaId}?tab=guia&video=${targetVideoId}`;
  if (type === 'podcast') return `/area/${targetAreaId}?tab=podcast&video=${targetVideoId}`;
  if (type === 'simulador') return `/area/${targetAreaId}?tab=studio&video=${targetVideoId}`;
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
  charts?: ChartData[];
  eduImages?: EduImage[];
  isFromCache?: boolean;
  cacheType?: 'simple' | 'complex' | null;
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
// Siempre apunta a Vercel como backend canónico del chat.
// Esto garantiza que el ambiente de producción y cualquier otro ambiente
// usen el mismo endpoint optimizado: Haiku 4.5 + prompt caching + analytics.
// Para sobreescribir en desarrollo local, define VITE_CHAT_URL en .env
const CHAT_URL = import.meta.env.VITE_CHAT_URL || "https://cyberedu-mx.vercel.app/api/chat";
const MEMORY_KEY = "cyberagent_memory_v2";
const HISTORY_KEY = "ai_agent_history_v2";

// ─── Helpfully sanitize Mermaid syntax for v11 ───
const sanitizeMermaidContent = (content: string): string => content
  .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
  .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ü/g, 'u')
  .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I')
  .replace(/Ó/g, 'O').replace(/Ú/g, 'U')
  .replace(/ñ/g, 'n').replace(/Ñ/g, 'N')
  .replace(/¿/g, '').replace(/¡/g, '')
  .replace(/\(/g, ' ').replace(/\)/g, ' ')
  .replace(/:/g, ' -')
  .replace(/"/g, "'");

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
    let cleaned = str.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    // Extraer solo la parte JSON en caso de que la IA agregue texto charlado dentro del bloque (ej. "Aquí tienes: { ... }")
    const matchJsonObj = cleaned.match(/({[\s\S]*})/);
    const matchJsonArr = cleaned.match(/(\[[\s\S]*\])/);
    
    if (matchJsonObj && matchJsonArr) {
       // usar el más grande o el que empiece antes
       cleaned = matchJsonObj[0].length > matchJsonArr[0].length ? matchJsonObj[0] : matchJsonArr[0];
    } else if (matchJsonObj) {
       cleaned = matchJsonObj[0];
    } else if (matchJsonArr) {
       cleaned = matchJsonArr[0];
    }

    // Elimina comas al final de listas u objetos que rompen el JSON estándar
    cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");
    // Elimina comillas simples por dobles si el AI se equivoca (arriesgado pero útil en edge cases simples sin contracciones)
    if (!cleaned.includes('"')) {
       cleaned = cleaned.replace(/'/g, '"');
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parse Error:", err, "Raw string:", str);
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
  if (!parsed) {
    return { plan: null, cleanContent: content.replace(/<plan>[\s\S]*?<\/plan>/, "\n\n> ⚠️ *Error de sistema: Intenté generar un Plan de Estudio aquí pero falló el formato (JSON inválido).*").trim() };
  }
  
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

function parseQuizFromContent(content: string): { quiz: PersonalizedQuiz | null; cleanContent: string } {
  const quizMatch = content.match(/<quiz>([\s\S]*?)<\/quiz>/);
  if (!quizMatch) return { quiz: null, cleanContent: content };
  
  const parsed = safeParseJSON(quizMatch[1]);
  if (!parsed) {
    // Si la IA generó el tag <quiz> pero el JSON está corrupto/ilegible, advertimos al usuario
    return { 
      quiz: null, 
      cleanContent: content.replace(/<quiz>[\s\S]*?<\/quiz>/, "\n\n> ⚠️ *Error de sistema: CyberAgent intentó generar un reto interactivo aquí pero hubo un problema de formato interno (JSON inválido). Por favor pídele: 'Vuelve a generar el quiz, asegúrate de enviar un formato JSON perfecto'.*\n\n").trim() 
    };
  }
  
  const quizObj = parsed as PersonalizedQuiz;
  
  if (!quizObj || !Array.isArray(quizObj.questions)) {
    return { 
      quiz: null, 
      cleanContent: content.replace(/<quiz>[\s\S]*?<\/quiz>/, "\n\n> ⚠️ *El Agente intentó generar un Quiz, pero el formato interno fue inválido (faltaron las preguntas). Dile que lo vuelva a intentar.*\n\n").trim() 
    };
  }

  if (quizObj && Array.isArray(quizObj.questions)) {
    quizObj.questions = quizObj.questions.map(q => {
      let ci: any = q.correctIndex !== undefined ? q.correctIndex : (q as any).correct_index;
      const options = q.options || [];
      const explanation = (q.explanation || "").toLowerCase();
      const upperCi = String(ci).toUpperCase().trim();
      
      let bestIdx = -1;

      // PRIORITY 0: Already a valid 0-based integer — use directly
      if (typeof ci === 'number' && Number.isInteger(ci) && ci >= 0 && ci < options.length) {
        bestIdx = ci;
      }

      // 1. Letter-based (A, B, C, D) — most common AI mistake
      if (bestIdx === -1) {
        if (upperCi === 'A' || upperCi.startsWith('A)') || upperCi.startsWith('OPCION A') || upperCi.startsWith('OPCIÓN A')) bestIdx = 0;
        else if (upperCi === 'B' || upperCi.startsWith('B)') || upperCi.startsWith('OPCION B') || upperCi.startsWith('OPCIÓN B')) bestIdx = 1;
        else if (upperCi === 'C' || upperCi.startsWith('C)') || upperCi.startsWith('OPCION C') || upperCi.startsWith('OPCIÓN C')) bestIdx = 2;
        else if (upperCi === 'D' || upperCi.startsWith('D)') || upperCi.startsWith('OPCION D') || upperCi.startsWith('OPCIÓN D')) bestIdx = 3;
      }

      // 2. Exact text match: ci equals the option text
      if (bestIdx === -1 && typeof ci === 'string' && ci.trim().length > 2) {
        const cleanCi = ci.toLowerCase().trim();
        const exactIdx = options.findIndex(o => String(o).toLowerCase().trim() === cleanCi);
        if (exactIdx !== -1) bestIdx = exactIdx;
      }

      // 3. Partial text match: ci contains the option or vice versa
      if (bestIdx === -1 && typeof ci === 'string' && ci.trim().length > 5) {
        const cleanCi = ci.toLowerCase().trim();
        const partialIdx = options.findIndex(o => {
          const optLower = String(o).toLowerCase().trim();
          return optLower.length > 4 && (optLower.includes(cleanCi) || cleanCi.includes(optLower));
        });
        if (partialIdx !== -1) bestIdx = partialIdx;
      }

      // 4. Cross-reference explanation with option text
      if (bestIdx === -1) {
        for (let i = 0; i < options.length; i++) {
          const optText = String(options[i]).toLowerCase().trim();
          if (optText.length < 3) continue;
          if (
            explanation.includes(`**${optText}**`) ||
            explanation.includes(`"${optText}"`) ||
            explanation.includes(`'${optText}'`)
          ) {
            bestIdx = i;
            break;
          }
        }
      }

      // 5. Numeric string fallback
      if (bestIdx === -1) {
        const matchNum = String(ci).match(/\d+/);
        if (matchNum) {
          const num = parseInt(matchNum[0], 10);
          if (upperCi.includes('OPCION') || upperCi.includes('OPCIÓN')) {
            bestIdx = num - 1; // "Opción 1" -> index 0
          } else if (num > 0 && num <= options.length) {
            bestIdx = num - 1; // likely 1-based
          } else {
            bestIdx = num; // 0-based as string
          }
        }
      }

      let finalCi = Number(bestIdx);
      if (isNaN(finalCi) || finalCi < 0 || finalCi >= options.length) {
        console.warn(`[QuizParser] Could not resolve correctIndex '${ci}'. Defaulting to 0.`);
        finalCi = 0;
      }

      return { ...q, correctIndex: finalCi };
    });
  }

  return { 
    quiz: quizObj, 
    cleanContent: content.replace(/<quiz>[\s\S]*?<\/quiz>/, "").trim() 
  };
}

function parseChartsFromContent(content: string): { charts: ChartData[]; cleanContent: string } {
  const charts: ChartData[] = [];
  let cleaned = content;
  const regex = /<chart>([\s\S]*?)<\/chart>/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const parsed = safeParseJSON(m[1]);
    if (parsed) charts.push(parsed as ChartData);
  }
  cleaned = content.replace(/<chart>[\s\S]*?<\/chart>/g, "").trim();
  return { charts, cleanContent: cleaned };
}

function parseImagesFromContent(content: string): { eduImages: EduImage[]; cleanContent: string } {
  const found: EduImage[] = [];
  // Busca patrones [IMG:clave] en el contenido
  const regex = /\[IMG:([a-z0-9-]+)\]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const key = m[1];
    const img = imageByKey[key];
    if (img && !found.find((f) => f.key === key)) found.push(img);
  }
  // Elimina los tokens del contenido visible
  const cleanContent = content.replace(/\[IMG:[a-z0-9-]+\]/g, "").trim();
  return { eduImages: found, cleanContent };
}

function parseAllBlocks(content: string) {
  const { reasoning, cleanContent: c1 } = parseReasoningFromContent(content);
  const { decisions, cleanContent: c2 } = parseDecisionsFromContent(c1);
  const { plan, cleanContent: c3 } = parsePlanFromContent(c2);
  const { quiz, cleanContent: c4 } = parseQuizFromContent(c3);
  const { charts, cleanContent: c5 } = parseChartsFromContent(c4);
  const { eduImages, cleanContent: c6 } = parseImagesFromContent(c5);
  return { reasoning, decisions, plan, quiz, charts, eduImages, cleanContent: c6 };
}

function stripStreamingBlocks(content: string): string {
  // Oculta bloques XML crudos pero deja un placeholder para evitar saltos bruscos de altura
  let cleaned = content
    .replace(/<(reasoning|decision|plan|quiz|chart)>[\s\S]*?(<\/\1>|$)/g, (match, tag) => {
      const names: Record<string, string> = {
        reasoning: "pensando",
        decision: "decisión",
        plan: "plan de estudio",
        quiz: "quiz interactivo",
        chart: "gráfica"
      };
      return `\n\n> 🧩 *Generando ${names[tag] || tag}...*\n\n`;
    });

  // Ocultar diagramas Mermaid mientras se están escribiendo para evitar errores de sintaxis y parpadeos
  cleaned = cleaned.replace(/```mermaid[\s\S]*?(```|$)/g, (match) => {
    if (match.endsWith('```')) return match;
    return `\n\n> 📊 *Generando diagrama...*\n\n`;
  });

  // Ocultar imágenes inacabadas (Markdown)
  cleaned = cleaned.replace(/!\[.*?\]\((.*?)\)?/g, (match) => {
    if (match.endsWith(')')) return match;
    return `\n\n> 🖼️ *Cargando imagen...*\n\n`;
  });

  return cleaned.trim();
}

// ─── Streaming helper ───
async function streamChat({
  messages,
  context,
  memory,
  onDelta,
  onDone,
  onUsage,
  onCache,
  signal,
  token,
}: {
  messages: { role: string; content: string }[];
  context?: any;
  memory?: AgentMemory;
  onDelta: (text: string) => void;
  onDone: (fromCache?: boolean) => void;
  onUsage?: (usage: any) => void;
  onCache?: (cacheType?: 'simple' | 'complex') => void;
  signal?: AbortSignal;
  token?: string;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      // Solo enviar Authorization si hay token real de usuario — la publishable key de Supabase
      // no es un JWT de usuario y causaría 401 en el backend.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages, context, memory }),
  });

  if (!resp.ok || !resp.body) {
    const errBody = await resp.json().catch(() => ({}));
    const error = new Error(errBody.error || errBody.message || `Error ${resp.status}`);
    Object.assign(error, errBody);
    (error as any).status = resp.status;
    throw error;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;
  let aggregatedUsage: any = {};

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
      if (line.startsWith("event: ")) continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.usage) aggregatedUsage = { ...aggregatedUsage, ...parsed.usage };
        if (parsed.usage_delta) aggregatedUsage = { ...aggregatedUsage, ...parsed.usage_delta };
        // Detect cache hit flag
        if (parsed.fromCache === true && onCache) onCache(parsed.cacheType || 'simple');

        let c: string | undefined;
        // Formato nuevo Edge Function: { content: "texto" }
        if (parsed.content !== undefined) {
          c = parsed.content;
        }
        // Soporte para formato OpenAI (Lovable) 
        else if (parsed.choices?.[0]?.delta?.content) {
          c = parsed.choices[0].delta.content;
        } 
        // Soporte para formato Anthropic (Claude) raw
        else if (parsed.type === "content_block_delta" && parsed.delta?.text) {
          c = parsed.delta.text;
        }
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
      if (raw.startsWith("event: ")) continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.usage) aggregatedUsage = { ...aggregatedUsage, ...parsed.usage };
        if (parsed.usage_delta) aggregatedUsage = { ...aggregatedUsage, ...parsed.usage_delta };
        let c: string | undefined;
        // Formato nuevo Edge Function: { content: "texto" }
        if (parsed.content !== undefined) {
          c = parsed.content;
        } else if (parsed.choices?.[0]?.delta?.content) {
          c = parsed.choices[0].delta.content;
        } else if (parsed.type === "content_block_delta" && parsed.delta?.text) {
          c = parsed.delta.text;
        }
        if (c) onDelta(c);
      } catch { /* ignore */ }
    }
  }
  if (onUsage && Object.keys(aggregatedUsage).length > 0) {
    onUsage(aggregatedUsage);
  }
  onDone();
}

// ─── Reasoning Card ───
const ReasoningCard: React.FC<{ reasoning: Reasoning }> = ({ reasoning }) => {
  const [open, setOpen] = useState(false);
  const confidenceColor = (reasoning?.confidence || 0) >= 80 ? "text-emerald-400" : (reasoning?.confidence || 0) >= 50 ? "text-amber-400" : "text-red-400";

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

          {Array.isArray(reasoning?.key_concepts) && reasoning.key_concepts.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {reasoning.key_concepts.map((c, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-sm text-slate-400">
                  {c}
                </span>
              ))}
            </div>
          )}

          {Array.isArray(reasoning?.alternatives_considered) && reasoning.alternatives_considered.length > 0 && (
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

          {reasoning?.references_to_past && (
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
    <p className="text-sm font-semibold text-slate-200">{decision.question}</p>
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
    if (text.includes("infografía") || text.includes("infografia")) return "infografia";
    if (text.includes("flashcard") || text.includes("tarjeta")) return "flashcards";
    if (text.includes("pdf") || text.includes("documento")) return "pdf";
    if (text.includes("guía") || text.includes("guia")) return "guia";
    if (text.includes("podcast") || text.includes("audio")) return "podcast";
    return "video";
  };

  return (
    <div className={cn(
      "group relative flex items-stretch gap-0 p-0 rounded-2xl border transition-all overflow-hidden",
      step.status === "approved" ? "bg-emerald-500/10 border-emerald-500/20"
        : step.status === "rejected" ? "bg-red-500/5 border-red-500/10 opacity-50"
        : "bg-white/5 border-white/10 hover:bg-white/10"
    )}>
      {/* 1. SECCIÓN DE ESTADO (Checkmark) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(step.id);
        }}
        className={cn(
          "w-12 flex items-center justify-center shrink-0 border-r transition-colors",
          step.status === "approved" ? "bg-emerald-500/20 border-emerald-500/20 text-emerald-400"
            : "bg-white/5 border-white/5 text-slate-500 hover:text-emerald-400 hover:bg-white/10"
        )}
        title={step.status === "approved" ? "Marcado como completado" : "Marcar como completado"}
      >
        {step.status === "approved" ? <CheckCircle2 className="h-5 w-5" />
          : step.status === "rejected" ? <XCircle className="h-5 w-5 text-red-400" />
          : <Circle className="h-5 w-5" />}
      </button>

      {/* 2. SECCIÓN DE CONTENIDO (Navegación al hacer clic) */}
      <button
        onClick={() => {
          const resolved = resolveVideoId(step.areaId || planTitle || "", step.videoId || step.text || step.id.toString());
          const generatedUrl = getUrlForPaso(
            getStepType(), 
            resolved.videoId, 
            step.text,
            resolved.areaId
          );
          onNavigate(generatedUrl);
        }}
        className="flex-1 flex flex-col p-3 text-left min-w-0 pr-14 group/step"
        title="Clic para ir al contenido"
      >
        <div className="flex items-center gap-2 mb-1">
          <p className={cn(
            "text-sm font-bold text-slate-100 leading-snug transition-colors group-hover/step:text-primary",
            step.status === "approved" && "text-emerald-300",
            step.status === "rejected" && "line-through opacity-50"
          )}>
            {step.text}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn("px-1.5 py-0.5 text-[9px] font-black uppercase rounded border tracking-widest", priorityColor[step.priority])}>
            {step.priority}
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
            <Clock className="h-3 w-3" /> {step.estimatedTime}
          </span>
          {Array.isArray(step?.dependsOn) && step.dependsOn.length > 0 && (
            <span className="text-[9px] text-slate-600 font-bold">→ ID: {step.dependsOn.join(", ")}</span>
          )}
        </div>
      </button>

      {/* 3. ACCIÓN RÁPIDA (Derecha) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform">
        <ArrowRight className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100" />
      </div>
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
          <h4 className="text-base font-black text-white uppercase tracking-tight">{plan.title}</h4>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

    {Array.isArray(analysis?.weakAreas) && analysis.weakAreas.length > 0 && (
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

    {Array.isArray(analysis?.recommendations) && analysis.recommendations.length > 0 && (
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
const QuizCard: React.FC<{ quiz: PersonalizedQuiz; onAnswer: (qId: string, idx: number) => void; answers: Record<string, number> }> = ({ quiz, onAnswer, answers }) => {
  const isEvaluated = Array.isArray(quiz?.questions) && quiz.questions.length > 0 && quiz.questions.every((q, qi) => answers[q.id || `q${qi}`] !== undefined);

  return (
    <div className="my-5 space-y-5">
      <div className="p-5 border-b-2 border-indigo-500/20 bg-indigo-500/5 rounded-t-[2rem] rounded-b-xl shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-tighter">{quiz.title}</h3>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mt-0.5">Nivel: {quiz.difficulty} · {quiz?.questions?.length || 0} reactivos</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-5">
        {Array.isArray(quiz?.questions) && quiz.questions.map((q, qi) => {
          const actualId = q.id || `q${qi}`;
          const selectedOption = answers[actualId];
          const answered = selectedOption !== undefined;
          const isCorrect = answered && selectedOption === Number(q.correctIndex || 0);
          
          return (
            <div key={actualId} className="bg-slate-900 border border-white/5 rounded-[2rem] p-5 md:p-6 shadow-xl relative overflow-hidden">
              {answered && (
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  isCorrect ? "bg-emerald-500" : "bg-rose-500"
                )} />
              )}

              <h4 className="text-base md:text-lg font-bold text-white mb-5 leading-tight">
                <span className="text-indigo-400 mr-1">{qi + 1}.</span> {q.text || (q as any).question || (q as any).pregunta}
              </h4>

              <div className="space-y-2.5">
                {Array.isArray(q?.options) && q.options.map((opt, oi) => {
                  const isOptCorrect = oi === Number(q.correctIndex || 0);
                  const isSelected = oi === selectedOption;

                  return (
                    <button
                      key={oi}
                      onClick={() => !answered && onAnswer(actualId, oi)}
                      disabled={answered}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group",
                        !answered && "border-white/5 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5",
                        answered && isOptCorrect && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                        answered && isSelected && !isOptCorrect && "border-rose-500/50 bg-rose-500/10 text-rose-400",
                        answered && !isSelected && !isOptCorrect && "border-white/5 bg-white/5 opacity-40"
                      )}
                    >
                      <span className="font-bold text-sm">{opt}</span>
                      {answered && isOptCorrect && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                      {answered && isSelected && !isOptCorrect && <XCircle className="h-5 w-5 shrink-0" />}
                      {!answered && <Circle className="h-5 w-5 shrink-0 text-white/20 group-hover:text-white/40" />}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "mt-5 p-4 rounded-2xl border shadow-lg",
                      isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
                    )}
                  >
                    <div className="flex gap-4">
                      <div className={cn(
                        "p-2 rounded-xl h-fit",
                        isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      )}>
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explicación</p>
                        <p className="text-xs font-medium text-slate-300 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {isEvaluated && (() => {
        const correctCount = Array.isArray(quiz?.questions) ? quiz.questions.filter((q, qi) => {
          const userPick = answers[q.id || `q${qi}`];
          const target = Number(q.correctIndex);
          return userPick !== undefined && userPick === target;
        }).length : 0;
        
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 mt-4 rounded-[2rem] bg-slate-900 border border-white/5 shadow-xl text-center flex flex-col items-center justify-center"
          >
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Resultado Final</p>
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[100px]">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Aciertos</p>
                  <p className="text-3xl font-black text-emerald-400">{correctCount}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 min-w-[100px]">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-3xl font-black text-white">{quiz.questions.length}</p>
              </div>
            </div>
          </motion.div>
        );
      })()}
    </div>
  );
};

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
      <span className="text-sm font-black text-white uppercase tracking-wider">Plan de Acción Recomendado</span>
    </div>
    <div className="p-3 space-y-2">
      {recs.map((r, i) => {
        const icons = { video: <Play className="h-3.5 w-3.5" />, area: <BookOpen className="h-3.5 w-3.5" />, simulador: <Target className="h-3.5 w-3.5" /> };
        const prioColors = { alta: "text-red-400 bg-red-500/10 border-red-500/20", media: "text-amber-400 bg-amber-500/10 border-amber-500/20", baja: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
        return (() => {
          const resolved = resolveVideoId(r.areaId || "", r.videoId || r.title || "");
          const generatedUrl = getUrlForPaso(r.type === 'area' ? 'video' : r.type, resolved.videoId, r.title, resolved.areaId);
          const resolvedVideoId = resolved.videoId;
          const infoUrl = resolvedVideoId ? getUrlForPaso('infografia', resolvedVideoId, r.title, resolved.areaId) : '';
          const hasInfo = resolvedVideoId ? !!materiales[resolvedVideoId]?.infografia : false;

          return (
            <div key={i} className="relative group/rec w-full">
              <button
                onClick={() => onNavigate(generatedUrl)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all text-left group pr-20"
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
              </button>
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none group-hover/rec:pointer-events-auto">
                {hasInfo && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(infoUrl);
                    }}
                    className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg opacity-0 group-hover/rec:opacity-100 hover:bg-emerald-500/20 hover:scale-110 active:scale-95 transition-all border border-emerald-500/20"
                    title="Ver Infografía"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(generatedUrl);
                  }}
                  className="p-1.5 bg-primary/10 text-primary rounded-lg opacity-50 group-hover/rec:opacity-100 hover:bg-primary/20 hover:scale-110 active:scale-95 transition-all border border-primary/20"
                  title="Ir al video"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })();
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

// ─── Message Bubble Component (Memoized) ───
const MessageBubble = React.memo(({ 
  msg, 
  isExpanded, 
  handleFeedback, 
  handlePlanAction, 
  handleToggleStep, 
  handleQuizAnswer, 
  quizAnswers, 
  togglePaso, 
  deletePlan, 
  agentNavigate,
  fixingCheckId,
  setFixingCheckId,
  setMessages,
  runDiagnostics,
  setLatestDiagnostics,
  markdownComponents,
  isStreaming,
  speakMessage,
  isSpeaking
}: any) => {
  const isAssistant = msg.role === "assistant";
  
  const msgAnswers = useMemo<Record<string, number>>(() => {
    if (!msg.quiz) return {};
    return Object.fromEntries(
      Object.entries(quizAnswers)
        .filter(([k]) => k.startsWith(msg.id + '_'))
        .map(([k, v]) => [k.substring(msg.id.length + 1), v])
    ) as Record<string, number>;
  }, [quizAnswers, msg.id, msg.quiz]);

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 max-w-[85%] animate-in fade-in slide-in-from-bottom-3 duration-400",
        !isAssistant ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div className={cn("flex items-end gap-2", !isAssistant ? "flex-row-reverse" : "flex-row")}>
        <div className={cn(
          "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border",
          !isAssistant ? "bg-slate-800 border-white/10" : "bg-primary/20 border-primary/30"
        )}>
          {!isAssistant ? <User className="h-3.5 w-3.5 text-slate-400" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
        </div>

        {/* Cache badge — shown when response came from server cache */}
        {isAssistant && msg.isFromCache && (
          <span className={cn(
            "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full select-none mb-0.5",
            msg.cacheType === 'complex' 
              ? "text-fuchsia-300 bg-fuchsia-500/20 border border-fuchsia-500/30" 
              : "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
          )}>
            {msg.cacheType === 'complex' ? '🧠 Caché Experto' : '📦 Caché'}
          </span>
        )}

        <div className={cn(
          "px-4 py-3 text-sm md:text-base font-medium leading-relaxed max-w-full overflow-x-auto min-w-0 break-words scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
          !isAssistant
            ? "bg-primary rounded-2xl rounded-tr-none text-primary-foreground shadow-xl font-bold"
            : "bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-slate-200"
        )}>
          {msg.reasoning && <ReasoningCard reasoning={msg.reasoning} />}
          {msg.decisions?.map((d: any, i: number) => <DecisionCard key={i} decision={d} />)}
          {msg.analysis && <AnalysisCard analysis={msg.analysis} onNavigate={agentNavigate} />}
          {msg.report && <ReportCard report={msg.report} />}
          {msg.alerts?.map((a: any, i: number) => <AlertCard key={i} alert={a} />)}
          {msg.quiz && (
            <QuizCard 
              quiz={msg.quiz} 
              answers={msgAnswers} 
              onAnswer={(qId, idx) => handleQuizAnswer(msg.id, msg.quiz!, qId, idx)} 
            />
          )}
          {msg.charts?.map((chart: any, i: number) => <ChartRenderer key={i} chart={chart} />)}
          {msg.eduImages && msg.eduImages.length > 0 && <EduImageViewer images={msg.eduImages} />}
          {msg.recommendations && <RecommendationsCard recs={msg.recommendations} onNavigate={agentNavigate} />}
          {msg.diagnostics && <DiagnosticsCard 
            result={msg.diagnostics} 
            fixingId={fixingCheckId} 
            isFixingAll={fixingCheckId === 'all'}
            onFixAll={async () => {
              const fixable = msg.diagnostics!.checks.filter((c: any) => (c.status === "error" || c.status === "warning") && c.fix);
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
              
              const newResult = await runDiagnostics();
              setLatestDiagnostics(newResult);
              setMessages((prev: any[]) => prev.map(m =>
                m.id === msg.id ? { ...m, diagnostics: newResult } : m
              ));
              setFixingCheckId(null);
            }}
            onFix={async (checkId) => {
              const check = msg.diagnostics!.checks.find((c: any) => c.id === checkId);
              if (!check?.fix) return;
              setFixingCheckId(checkId);
              try {
                const fixResult = await check.fix();
                toast.success(`Auto-corrección: ${fixResult}`);
                const newResult = await runDiagnostics();
                setLatestDiagnostics(newResult);
                setMessages((prev: any[]) => prev.map(m =>
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
          {isAssistant ? (
            <div className={cn("prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 prose-strong:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300 w-full overflow-x-auto min-w-0 break-words", isExpanded ? "prose-base" : "prose-sm")}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={markdownComponents}
              >
                {msg.content
                  .replace(/<recommendation>[\s\S]*?<\/recommendation>/g, "")
                  .replace(
                    /(?<!\()https:\/\/([^\s\n\)]+)(?!\))/g, 
                    (match) => `[${match}](${match})`
                  )
                  .replace(
                    /(?<!\(|\[)\/(area|tokens|planes|diagnostico|registro|auth)([^\s\n\)]*)(?!\))/g, 
                    (match) => `[${match}](${match})`
                  )
                  .replace(
                    /\[([A-Z-]{2,7})\s+(\d+(\.\d+)?)([^\]]*)\]/g, 
                    (match, materia, code) => `[${match}](citation://${materia}/${code})`
                  )
                  .replace(/([^\n])\n\|/g, '$1\n\n|')
                  .replace(/\|\s*\n\s*\n\s*\|/g, '|\n|')
                }
              </ReactMarkdown>
            </div>
          ) : (
            <span>{msg.content}</span>
          )}
        </div>
      </div>

      {isAssistant && msg.id !== "initial" && !isStreaming && (
        <div className="flex items-center gap-2 px-9">
          <button
            onClick={() => speakMessage(msg.content, msg.id)}
            className={cn(
              "p-1.5 rounded-lg transition-all flex items-center gap-1.5",
              isSpeaking === msg.id 
                ? "bg-primary text-white scale-110 shadow-lg" 
                : "hover:bg-white/10 text-slate-500 hover:text-white"
            )}
            title={isSpeaking === msg.id ? "Detener voz" : "Escuchar respuesta"}
          >
            {isSpeaking === msg.id ? <VolumeX className="h-3 w-3 animate-pulse" /> : <Volume2 className="h-3 w-3" />}
          </button>
          
          <button
            onClick={() => handleFeedback(msg.id, "up")}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              msg.feedback === "up" ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400"
            )}
          >
            <ThumbsUp className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleFeedback(msg.id, "down")}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              msg.feedback === "down" ? "bg-rose-500/20 text-rose-400" : "hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"
            )}
          >
            <ThumbsDown className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
});

// ─── Main Component ───
const AITutor = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { analyzeUserProgress, generatePersonalizedQuiz, getRecommendations, getExplanationContext } = useAITutorSkills();
  const { runDiagnostics, errorCount, clearErrors } = useAppDiagnostics();
  const { plans: studyPlans, addPlan, deletePlan, togglePaso, getActivePlans, getCompletedPlans } = useStudyPlans();
  const { getWeeklyReport, getRecomendacionesDiarias, getAlertasRiesgo } = useAnalisisRendimiento();
  const { addMetric, addError } = useChatAnalytics();
  const { user, profile, isSubscriber, hasTokens, trialDaysRemaining, session, refreshProfile } = useAuth();

  // ─── Topic extractor ───
  const extractTopic = (text: string): string => {
    const lower = text.toLowerCase();
    const topicMap: [string[], string][] = [
      [['biolog', 'célula', 'fotosíntesis', 'dna', 'genética', 'organismo', 'carbono', 'ecosistema'], 'biología'],
      [['físic', 'movimiento', 'fuerza', 'energía', 'newton', 'cinemática', 'óptica'], 'física'],
      [['químic', 'átomo', 'molécula', 'reacción', 'elemento', 'tabla periódica'], 'química'],
      [['matemát', 'álgebra', 'geometría', 'ecuación', 'fracción', 'trigonometría', 'estadística'], 'matemáticas'],
      [['español', 'lectura', 'comprensión', 'gramática', 'ortografía', 'puntuación'], 'español'],
      [['historia', 'revolución', 'guerra', 'siglo', 'cultura', 'civilización'], 'historia'],
      [['geografía', 'mapa', 'continente', 'población', 'clima', 'relieve'], 'geografía'],
      [['cívica', 'democracia', 'ciudadanía', 'ética', 'derechos', 'constitución'], 'formación cívica'],
      [['habilidad', 'verbal', 'razonamiento', 'lógico', 'sucesión', 'analogía'], 'habilidades'],
      [['ecoems', 'examen', 'simulacro', 'quiz', 'estudiar', 'repaso'], 'preparación ECOEMS'],
    ];
    for (const [keywords, topic] of topicMap) {
      if (keywords.some(k => lower.includes(k))) return topic;
    }
    return 'general';
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isMobile);
  const [showAgentSidebar, setShowAgentSidebar] = useState(false);
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
  const [showPromoBanner, setShowPromoBanner] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("cyberedu_banner_ia_aviso");
    }
    return false;
  });

  const [dailyLimitBanner, setDailyLimitBanner] = useState<{ visible: boolean, message: string }>(() => {
    if (typeof window !== "undefined") {
      const todayInMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
      const tzDate = new Date(todayInMexico);
      const localToday = tzDate.getFullYear() + "-" + String(tzDate.getMonth() + 1).padStart(2, '0') + "-" + String(tzDate.getDate()).padStart(2, '0');
      
      if (localStorage.getItem("cyberedu_daily_limit_dismissed") === localToday) {
         return { visible: false, message: "Alcanzaste el límite de preguntas gratuitas de hoy." };
      }
      if (localStorage.getItem("cyberedu_daily_limit_reached") === localToday) {
        return { visible: true, message: "Alcanzaste el límite de preguntas gratuitas de hoy. Regresa mañana o consigue tokens para continuar ahora." };
      }
    }
    return { visible: false, message: "" };
  });

  const agentNavigate = useAgentNavigation(setIsOpen);

  const [usageStats, setUsageStats] = useState<{ used: number, limit: number, tokens: number, isSubscriber: boolean } | null>(null);

  const fetchUsageStats = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch("/api/usage", {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsageStats(data);
        
        // Auto-unblock if backend says we have questions left (avoids false positives from legacy localStorage)
        if (data.used < data.limit && dailyLimitBanner.visible) {
          console.log("Desbloqueando tutor basado en uso real del servidor");
          setDailyLimitBanner({ visible: false, message: "" });
          localStorage.removeItem("cyberedu_daily_limit_reached");
        }
      }
    } catch (e) {
      console.error("Failed to fetch usage stats", e);
    }
  }, [session?.access_token]);

  useEffect(() => {
    fetchUsageStats();
  }, [fetchUsageStats]);

  const closeBanner = () => {
    setShowPromoBanner(false);
    localStorage.setItem("cyberedu_banner_ia_aviso", "true");
  };

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
        today: new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        current_time: new Date().toLocaleTimeString('es-MX'),
        currentPage: location.pathname,
        progress: `${analysis.totalProgress}% general completado`,
        weakAreas: analysis.weakAreas.map((a: any) => a.name),
        streak: `${analysis.streak} días seguidos`,
        isRegistered: !!user,
        isSubscriber: !!isSubscriber,
        detailedSyllabus,
        system_instructions: `Eres CyberAgent, el tutor experto de BioReto Academy especializado en la GUÍA OFICIAL ECOEMS 2025/2026. Tu conocimiento se basa en el temario numerado: ${JSON.stringify(detailedSyllabus)}. Si preguntan algo ajeno al ECOEMS 2026, responde brevemente (2-3 líneas) de forma útil y amigable como un cuate inteligente que sabe de todo, y agrega SIEMPRE: 💡 Dato extra para ti. Recuerda que esto no viene en el temario ECOEMS 2026 — no pierdas tiempo en ello ahora. ¿Quieres que te explique algún tema del examen o hacemos un quiz? 🎯 NUNCA rechaces una pregunta. Cuando generes tablas en markdown, limítalas a máximo 3 columnas y usa textos cortos en cada celda. Prefiere diagramas Mermaid verticales (TD).
        
        RECOMENDACIONES Y MATERIAL GRATUITO (OBLIGATORIO): Al final de CADA explicación de un tema, incluye SIEMPRE esta sección de material completo:
        📚 **Material completo en CyberEdu MX — GRATIS**
        🎬 **Ver video:** /area/[areaId]?video=[videoId]

        Todo completamente GRATIS con registro.
        
        CALLS TO ACTION SEGÚN USUARIO:
        - Si !context.isRegistered: 💡 Regístrate GRATIS en /
        - Si el usuario no tiene tokens: 💡 Consigue tokens desde $10 para seguir chateando: /tokens`
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
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "es-MX";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error("Permiso de micrófono denegado");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) { /* ignore */ }
      }
    };
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

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);




  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup AbortController on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
    // Limit and persist
    const limitedMessages = messages.slice(-20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ data: limitedMessages, timestamp: Date.now() }));
  }, [messages]);

  useEffect(() => { saveMemory(memory); }, [memory]);
 
  // Update initial message once performance data is loaded from hook
  useEffect(() => {
    const report = getWeeklyReport();
    const alerts = getAlertasRiesgo();
    const performanceRecs = getRecomendacionesDiarias();

    if (report.totalQuizzes > 0 || performanceRecs.length > 0 || alerts.length > 0) {
      setMessages(prev => prev.map(m => {
        if (m.id !== 'initial' || (m as any).hydrated) return m;

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
          alerts: alerts.length > 0 ? alerts : undefined,
          hydrated: true
        };
      }));
    }
  }, [getWeeklyReport, getAlertasRiesgo, getRecomendacionesDiarias]);

  // Auto-scroll smoother (optimized for streaming)
  useEffect(() => {
    if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 250;
        
        // Always scroll if streaming or if user was already at the bottom
        if (isNearBottom || isStreaming) {
           scrollRef.current.scrollTo({
              top: scrollHeight,
              behavior: isStreaming ? 'auto' : 'smooth'
           });
        }
    }
  }, [messages, isStreaming]);

  const contextualSuggestions = useMemo(() => {
    const path = location.pathname;
    if (path === "/simulador-pro") return ["Dame una pista para esta pregunta", "Explica la estrategia del simulador"];
    if (path.includes("/area/")) return ["Crea un plan de estudio para esta área", "Resumen rápido de los temas clave"];
    return ["¿Cómo voy en mi progreso?", "Crea un plan de estudio personalizado", "Explícame razonamiento lógico"];
  }, [location.pathname]);

  const clearHistory = () => {
    localStorage.removeItem(MEMORY_KEY);
    localStorage.removeItem("cyberagent_quiz_answers");
    setQuizAnswers({});
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

  const handleFeedback = useCallback((id: string, type: "up" | "down") => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback: type } : m));
    if (type === "down") {
      setMemory(prev => ({
        ...prev,
        insights: [...prev.insights.slice(-9), "El usuario indicó insatisfacción con una respuesta reciente"],
      }));
    }
    toast.success(type === "up" ? "¡Gracias por tu feedback!" : "Tomaré nota para mejorar.");
  }, []);

  const handlePlanAction = useCallback((messageId: string, action: "approve" | "reject") => {
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
          chosen: "Plan sugerido",
          reasoning: "Aprobado por el usuario",
          impact: "Se seguirán los pasos del plan guardado",
        }],
      }));
      toast.success("¡Plan aprobado y guardado! Escribe /planes para verlo en detalle.");
    } else {
      toast.error("Plan rechazado.");
    }
  }, [addPlan]);

  const handleToggleStep = useCallback((messageId: string, stepId: number) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== messageId || !m.plan) return m;
      const newSteps = m.plan.steps.map(s => {
        if (s.id !== stepId) return s;
        const next = s.status === "pending" ? "approved" : s.status === "approved" ? "rejected" : "pending";
        return { ...s, status: next as PlanStep["status"] };
      });
      return { ...m, plan: { ...m.plan, steps: newSteps } };
    }));
  }, []);

  const handleQuizAnswer = useCallback((msgId: string, quiz: PersonalizedQuiz, qId: string, selectedIdx: number) => {
    setQuizAnswers(prev => {
      const newState = { ...prev, [`${msgId}_${qId}`]: selectedIdx };

      const question = quiz.questions.find((q, i) => (q.id || `q${i}`) === qId);
      if (question) {
        const isCorrect = Number(selectedIdx) === Number(question.correctIndex);
        setMemory(mem => ({
          ...mem,
          insights: [
            ...mem.insights,
            `El usuario respondió ${isCorrect ? "correctamente" : "incorrectamente"} la pregunta: "${question.text || (question as any).question || (question as any).pregunta}"`
          ].slice(-20)
        }));
      }

      const allKeys = quiz.questions.map((q, i) => `${msgId}_${q.id || `q${i}`}`);
      const isComplete = allKeys.every(k => newState[k] !== undefined);

      if (isComplete) {
        let score = 0;
        quiz.questions.forEach((q, i) => {
          const userPick = newState[`${msgId}_${q.id || `q${i}`}`];
          if (userPick !== undefined && Number(userPick) === Number(q.correctIndex)) {
            score++;
          }
        });

        setMemory(mem => ({
          ...mem,
          topics: [...new Set([...mem.topics, quiz.focusArea])].slice(-15),
          insights: [
            ...mem.insights,
            `El usuario completó el quiz "${quiz.title}" con ${score} aciertos de ${quiz.questions.length}.`
          ].slice(-20)
        }));
      }

      return newState;
    });
  }, []);

  const markdownComponents = useMemo(() => ({
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match && match[1] === 'mermaid') {
        const rawContent = String(children).replace(/\n$/, '');
        const sanitized = sanitizeMermaidContent(rawContent);
        return <Mermaid chart={sanitized} />;
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a({ href, children }: any) {
      const isInternalScheme = href?.startsWith('citation://');
      const isInternalPath = href?.startsWith('/') && !href?.startsWith('//');
      // Links que incluyan el nombre de nuestra app también deben ser internos
      const isExternalInternal = href?.includes('cyberedu-mx.vercel.app') || href?.includes('cyberedumx.com');
      // Links internos navegan con agentNavigate para preservar la sesión
      const isAreaLink = href?.includes('/area/');
      
      const isProbablyInternal = isInternalScheme || isInternalPath || isExternalInternal || isAreaLink || !href?.startsWith('http');

      if (isInternalScheme) {
        const url = href.replace('citation://', '');
        const [materia, code] = url.split('/');
        const cleanMateria = materia.toUpperCase().trim();
        return (
          <button 
            onClick={() => {
              const areaId = MATERIA_TO_AREA[cleanMateria];
              if (!areaId) {
                 toast.error(`Materia "${cleanMateria}" no reconocida.`);
                 return;
              }
              const area = areas.find(a => a.id === areaId);
              if (!area) return;
              const chapter = code.split('.')[0];
              const prefix = MATERIA_PREFIX[cleanMateria] || cleanMateria.toLowerCase();
              const targetVideoId = `${prefix}-${chapter}`;
              const videoExists = area.videos.some(v => v.id === targetVideoId);
              
              if (videoExists) {
                  agentNavigate(`/area/${areaId}?video=${targetVideoId}`);
              } else {
                  agentNavigate(`/area/${areaId}`);
              }
            }}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-black text-[10px] uppercase tracking-tighter mx-0.5 align-middle shadow-sm hover:scale-105 active:scale-95 shrink-0"
            title={`Ref: ${cleanMateria} ${code} - Clic para ver temario`}
          >
            <BookOpen className="h-2.5 w-2.5" />
            <span className="truncate max-w-[150px]">{children}</span>
          </button>
        );
      }

      if (isProbablyInternal) {
        let finalHref = href || '/';
        if (isExternalInternal && !isInternalPath) {
          try {
            const urlObj = new URL(href);
            finalHref = urlObj.pathname + urlObj.search;
          } catch(e) {}
        }
        
        // Si el link tiene formato de área, intentamos resolver el video exacto
        if (finalHref.includes('/area/')) {
          try {
            const urlStr = finalHref.startsWith('/') ? window.location.origin + finalHref : finalHref;
            const urlObj = new URL(urlStr);
            const pathParts = urlObj.pathname.split('/');
            const areaIndex = pathParts.indexOf('area');
            if (areaIndex !== -1 && pathParts[areaIndex + 1]) {
               const rawAreaId = pathParts[areaIndex + 1];
               const rawVideoId = urlObj.searchParams.get('video') || '';
               const resolved = resolveVideoId(rawAreaId, rawVideoId);
               urlObj.pathname = `/area/${resolved.areaId}`;
               urlObj.searchParams.set('video', resolved.videoId);
               finalHref = urlObj.pathname + urlObj.search;
               if (!finalHref.startsWith('http')) finalHref = finalHref.replace(window.location.origin, '');
            }
          } catch(e) {}
        }

        return (
          <button
            onClick={() => agentNavigate(finalHref)}
            className="text-cyan-400 underline hover:text-cyan-300 cursor-pointer font-bold transition-colors bg-transparent border-none p-0 inline align-baseline"
          >
            {children}
          </button>
        );
      }

      // Enlace externo real
      return (
        <a 
          href={href} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline hover:text-cyan-300 cursor-pointer font-bold transition-colors"
        >
          {children}
        </a>
      );
    },
    table({ children }: any) {
      return (
        <div className="w-full overflow-x-auto my-4 border border-white/10 rounded-xl scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <table className="min-w-full border-collapse text-[11px] md:text-xs">
            {children}
          </table>
        </div>
      );
    },
    td({ children }: any) {
      return <td className="border border-white/10 p-2 text-slate-300">{children}</td>;
    },
    th({ children }: any) {
      return <th className="border border-white/10 p-2 bg-white/5 text-primary font-black uppercase tracking-widest text-[9px]">{children}</th>;
    },
    img({ src, alt }: any) {
      return (
        <div className="my-4 group relative cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 max-w-sm sm:max-w-md mx-auto shadow-2xl" onClick={() => window.open(src, '_blank')}>
          <img src={src} loading="lazy" alt={alt} className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-widest text-shadow">Ampliar</span>
            </div>
          </div>
        </div>
      );
    },
    table({ children }: any) {
      return (
        <div className="my-4 overflow-x-auto w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl custom-scrollbar">
          <table className="min-w-full text-left border-collapse">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }: any) {
      return <thead className="bg-primary/20 border-b border-white/10">{children}</thead>;
    },
    th({ children }: any) {
      return <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-primary-foreground/90 bg-primary/20">{children}</th>;
    },
    td({ children }: any) {
      return <td className="px-4 py-3 text-xs sm:text-sm text-slate-300 border-b border-white/5">{children}</td>;
    },
    tr({ children }: any) {
      return <tr className="hover:bg-white/5 transition-colors odd:bg-white/[0.02]">{children}</tr>;
    }
  }), [isExpanded, agentNavigate]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const trimmed = text.trim().toLowerCase();
    const isCommand = ['/quiz', '/reporte', '/analisis', '/análisis', '/diagnostico', '/diagnóstico'].some(cmd => trimmed.startsWith(cmd));

    // Validaciones de Suscripción/Prueba (Solo para chat normal, los comandos son gratis)
    if (!isCommand) {
      if (!user) {
        const assistantId = Date.now().toString();
        setMessages(prev => [
          ...prev, 
          { role: "user", content: text.trim(), id: (Date.now() - 1).toString() },
          { role: "assistant", content: "Regístrate gratis para chatear con el Tutor IA 🎓", id: assistantId }
        ]);
        setInput("");
        return;
      }

    }

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

    // Se eliminó la validación estricta local de tokens (probadita). 
    // Ahora delegamos que el backend aplique el límite de 5 consultas diarias y retorne el banner 403.

    // /explica <tema> - Enhanced explanation via AI with context
    const explicaMatch = text.trim().match(/^\/explica\s+(.+)/i);
    if (explicaMatch) {
      const topic = explicaMatch[1];
      const explanationContext = getExplanationContext(topic);
      // Inject context into the prompt and let AI handle it
      const enrichedPrompt = `Explícame detalladamente el tema "${topic}" para el examen ECOEMS.\n\nContexto de la plataforma:\n${explanationContext || 'No hay contenido específico disponible.'}`;
      // Fall through to normal AI processing with enriched prompt
      const userMsg: Message = { role: "user", content: text.trim(), id: Date.now().toString() };
      setMessages(prev => [...prev, userMsg].slice(-20));
      setInput("");
      setIsStreaming(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();
      let lastUiUpdate = 0;
      const upsertAssistant = (chunk: string) => {
        assistantContent += chunk;
        const now = Date.now();
        if (now - lastUiUpdate < 100) return;
        lastUiUpdate = now;

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
          signal: abortControllerRef.current.signal,
          token: session?.access_token,
          onDone: () => {
            const { reasoning, decisions, plan, quiz, charts, eduImages, cleanContent } = parseAllBlocks(assistantContent);
            if (decisions.length > 0) setMemory(prev => ({ ...prev, decisions: [...prev.decisions, ...decisions].slice(-20) }));
            
            let finalCleanContent = cleanContent;
            if (!isSubscriber && trialDaysRemaining <= 0 && !hasTokens) {
              const usedFree = localStorage.getItem('cyberedu_used_free_message');
              if (!usedFree) {
                localStorage.setItem('cyberedu_used_free_message', 'true');
                finalCleanContent += '\n\n---\n💡 ¿Te ayudé? Con tokens puedo explicarte más a fondo — desde $10 pesos en cyberedumx.com/tokens';
              }
            }

            setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: finalCleanContent, reasoning, decisions: decisions.length > 0 ? decisions : undefined, plan, quiz, charts: charts.length > 0 ? charts : undefined, eduImages: eduImages.length > 0 ? eduImages : undefined } : m));
            setIsStreaming(false);
            fetchUsageStats();
          },
        });
      } catch (err: any) {
        console.error("Explica error:", err);
        
        // Detectar si el backend rechazó por límites o tokens (unificado)
        const isTokenError = err.status === 403 || 
                             err.message?.includes('límite gratuito') ||
                             err.message?.includes('Compra tokens') ||
                             err.message?.includes('Alcanzaste');

        if (isTokenError) {
          if (err.reason === "daily_limit" || err.message?.includes('Alcanzaste')) {
            const todayInMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
            const tzDate = new Date(todayInMexico);
            const localToday = tzDate.getFullYear() + "-" + String(tzDate.getMonth() + 1).padStart(2, '0') + "-" + String(tzDate.getDate()).padStart(2, '0');
            localStorage.setItem('cyberedu_daily_limit_reached', localToday);
            setDailyLimitBanner({ visible: true, message: err.message || err.reason });
            setIsStreaming(false);
            return;
          }
          
          toast.info("Sin tokens disponibles. Recarga para continuar.");
          agentNavigate("/tokens");
          setIsStreaming(false);
          return;
        }

        setMessages(prev => {
          const isRateLimit = err.message.includes("límite diario");
          const errContent = isRateLimit 
            ? "🚫 **Has alcanzado tu límite diario.**\n\nHas llegado al tope de 50 consultas diarias. Vuelve mañana para seguir estudiando con CyberAgent. 🎯"
            : `⚠️ ${err.message || "Error de conexión."}`;
          
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id === assistantId) return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: errContent } : m);
          return [...prev, { role: "assistant", content: errContent, id: assistantId }];
        });
        setIsStreaming(false);
      }
      return;
    }


    const userMsg: Message = { role: "user", content: text.trim(), id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg].slice(-20));
    setInput("");
    setIsStreaming(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

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

    let lastUiUpdate = 0;
    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      
      const now = Date.now();
      if (now - lastUiUpdate < 100) return; // Limitar a 10 actualizaciones por segundo
      lastUiUpdate = now;

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
        role: "system" as const, 
        id: "system-instruction",
        content: `Eres CyberAgent, el tutor de élite de BioReto Academy especializado EXCLUSIVAMENTE en la GUÍA OFICIAL ECOEMS 2025/2026. 
        
        TEMARIO OFICIAL NUMERADO: ${JSON.stringify(detailedSyllabus)}. 
        
        CATÁLOGO DE ÁREAS E IDS (USA ESTOS PARA PLANES):
        - Habilidades (hv-0 a hv-5, hm-1 a hm-5) -> areaId: "habilidades"
        - Biología (bio-1 a bio-7) -> areaId: "biologia"
        - Física (fis-1 a fis-7) -> areaId: "fisica"
        - Química (qui-1 a qui-6) -> areaId: "quimica"
        - Matemáticas (mat-1 a mat-7) -> areaId: "matematicas"
        - Español (esp-1 a esp-7) -> areaId: "espanol"
        - Historia de México (hm-mx-1 a hm-mx-7) -> areaId: "historia-mexico"
        - Historia Universal (hu-1 a hu-7) -> areaId: "historia-universal"
        - Geografía (geo-1 a geo-7) -> areaId: "geografia"
        - Formación Cívica (fce-1 a fce-7) -> areaId: "formacion-civica"

        REGLAS DE ORO DE RESPUESTA:
        1. CITACIÓN NUMERADA: Menciona el número exacto del temario (Ej: 4.2 Álgebra).
        2. ESTRUCTURA: Usa 'X.Y [Nombre del Tema]'.
        3. ACCESO A MATERIALES (PRIORIDAD ALTA):
           Si el usuario pide una "infografía", "PDF", "Guía", "Simulador" o "Material" de un tema o video (ej: hv-1), DEBES responder con un bloque <plan> indicando "videoId" y "areaId". 
           ¡ESTO ES OBLIGATORIO para crear los botones de redirección! No generes diagramas Mermaid en este caso.
        4. DIAGRAMAS (Solo para explicaciones):
           Genera diagramas mermaid para temas complejos SOLO si no se ha pedido material oficial.
           REGLA CRÍTICA MERMAID v11: 
           - USA SIEMPRE 'flowchart TD' o 'flowchart LR' y COMILLAS DOBLES en etiquetas con acentos o paréntesis (Ej: A["Física (Mecánica)"]).
        5. QUIZ INTERACTIVO (REGLAS MUY IMPORTANTES):
           Genera tu respuesta estrictamente encapsulada en la etiqueta <quiz> usando JSON válido. 
           EJEMPLO OBLIGATORIO DE ESTRUCTURA:
           <quiz>
           {
             "title": "Título del Quiz",
             "difficulty": "Difícil",
             "focusArea": "biologia",
             "questions": [
               {
                 "text": "¿Pregunta de ejemplo?",
                 "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                 "correctIndex": 0,
                 "explanation": "Explicación breve de por qué es la correcta."
               }
             ]
           }
           </quiz>
           - CRÍTICO: "correctIndex" DEBE ser un número entero 0-basado correspondondiente al arreglo options.
           - PROHIBIDO usar letras, índices 1-basados o texto fuera del JSON dentro de la etiqueta <quiz>.
        6. GRÁFICAS: Usa bloque <chart> para datos numéricos o funciones.
        7. BANCO DE IMÁGENES EDUCATIVAS: Usa [IMG:clave] para apoyo visual. Claves disponibles: ${availableImageKeys.join(', ')}.
         8. FUERA DEL TEMARIO: Si preguntan algo ajeno al ECOEMS 2026, responde brevemente (2-3 líneas) de forma útil y amigable como un cuate inteligente que sabe de todo, y agrega SIEMPRE: 💡 Dato extra para ti. Recuerda que esto no viene en el temario ECOEMS 2026 — no pierdas tiempo en ello ahora. ¿Quieres que te explique algún tema del examen o hacemos un quiz? 🎯 NUNCA rechaces una pregunta.
          9. TABLAS: Cuando generes tablas en markdown, limítalas a máximo 3 columnas y usa textos cortos en cada celda — los usuarios acceden desde celular y las tablas anchas no se ven bien.
          10. DISEÑO MÓVIL: En diagramas Mermaid, prefiere 'flowchart TD' y evita que sean demasiado anchos para pantallas pequeñas.
          11. RECOMENDACIONES Y MATERIAL GRATUITO (OBLIGATORIO): Al final de CADA explicación de un tema, incluye SIEMPRE esta sección de material completo:
              📚 **Material completo en CyberEdu MX — GRATIS**
              🎬 **Ver video:** /area/[areaId]?video=[videoId]

              Debajo del video encontrarás:
              🎯 Desafío IA — NotebookLM
              🎴 Flashcards interactivas
              📝 Quiz original del tema
              🧠 Asistencia IA
              🖼️ Infografía descargable
              📄 Documento técnico PDF
              🎙️ Podcast de repaso
              📘 Guía de estudio intensiva
              🚀 Entrenamiento Studio

              Todo completamente GRATIS con registro.
          12. CALLS TO ACTION SEGÚN USUARIO (REVISA EL CONTEXTO):
              - Si !context.isRegistered:
                💡 **¿Quieres acceder a todo este material?**
                ✅ Regístrate GRATIS en /
                ✅ 7 días de acceso completo al Tutor IA incluidos
                ✅ Sin tarjeta de crédito
              - Si context.isRegistered && !context.isSubscriber:
                💡 **¿Quieres seguir chateando con el Tutor IA?**
                ✅ Paquetes desde $10 pesos (10 tokens)
                ✅ Plan Maestro Ilimitado por $200/mes
                ✅ Todo el contenido multimedia siempre GRATIS
                🔗 Comprar tokens: /tokens`
      };

      // Always include the system message at the start, then the last N messages
      const conversationHistory = messages
        .filter(m => m.id !== "initial")
        .slice(-12)
        .map(m => ({ role: m.role, content: m.content }));

      const history = [
        { role: systemMsg.role, content: systemMsg.content },
        { 
          role: "system" as const, 
          content: `MEMORIA DE ACTIVIDAD RECIENTE:
          - Tópicos visitados: ${memory.topics.join(', ')}
          - Insights de aprendizaje: ${memory.insights.slice(-5).join(' | ')}
          - Resultados de Quizes: ${memory.insights.filter(i => i.includes('completó el quiz')).slice(-3).join(' | ')}`
        },
        ...conversationHistory,
        { role: userMsg.role, content: userMsg.content }
      ];

      const startTime = Date.now();
      let hitCache = false;
      let cacheTypeHit: 'simple' | 'complex' | null = null;

      await streamChat({
        messages: history,
        context: buildContext(),
        memory,
        onDelta: upsertAssistant,
        signal: abortControllerRef.current.signal,
        token: session?.access_token,
        onCache: (type) => { hitCache = true; cacheTypeHit = type || 'simple'; },
        onUsage: (usage: any) => {
          // Usage data is captured here; we store it in a ref-like variable for onDone
          (window as any).__lastChatUsage = usage;
        },
        onDone: () => {
          const { reasoning, decisions, plan, quiz, charts, eduImages, cleanContent } = parseAllBlocks(assistantContent);
          const responseTime = Date.now() - startTime;
          const usage = (window as any).__lastChatUsage || {};
          delete (window as any).__lastChatUsage;

          // Haiku 4.5 pricing (USD per million tokens, as of March 2026)
          const INPUT_PRICE = 0.80 / 1_000_000;
          const OUTPUT_PRICE = 4.00 / 1_000_000;
          const CACHE_READ_PRICE = 0.08 / 1_000_000;
          const inputTokens = usage.input_tokens || 0;
          const outputTokens = usage.output_tokens || 0;
          const cachedTokens = usage.cache_read_input_tokens || 0;
          const cost = hitCache ? 0 : inputTokens * INPUT_PRICE + outputTokens * OUTPUT_PRICE + cachedTokens * CACHE_READ_PRICE;

          addMetric({
            id: assistantId,
            timestamp: new Date().toISOString(),
            question: text.trim().slice(0, 200),
            questionTopic: extractTopic(text),
            responseTime,
            tokensInput: inputTokens,
            tokensOutput: outputTokens,
            tokensCached: cachedTokens,
            cost,
            hasChart: charts.length > 0,
            hasMermaid: assistantContent.includes('```mermaid'),
            feedback: null,
            cacheType: cacheTypeHit,
          });

          // Save decisions to memory
          if (decisions.length > 0) {
            setMemory(prev => ({
              ...prev,
              decisions: [...prev.decisions, ...decisions].slice(-20),
            }));
          }

          let finalCleanContent = cleanContent;
          if (!isSubscriber && trialDaysRemaining <= 0 && !hasTokens) {
            const usedFree = localStorage.getItem('cyberedu_used_free_message');
            if (!usedFree) {
              localStorage.setItem('cyberedu_used_free_message', 'true');
              finalCleanContent += '\n\n---\n💡 ¿Te ayudé? Con tokens puedo explicarte más a fondo — desde $10 pesos en cyberedumx.com/tokens';
            }
          }

          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content: finalCleanContent, reasoning, decisions: decisions.length > 0 ? decisions : undefined, plan, quiz, charts: charts.length > 0 ? charts : undefined, eduImages: eduImages.length > 0 ? eduImages : undefined, isFromCache: hitCache, cacheType: cacheTypeHit }
              : m
          ));
          setIsStreaming(false);
          refreshProfile();
          fetchUsageStats();
        },
      });
    } catch (err: any) {
      console.error("Agent chat error:", err);
      addError(err.message || 'Error desconocido en el chat', err.status);

      // Detectar si el backend rechazó por falta de tokens (403 isAccessDenied)
      const isTokenError = err.message?.includes('límite gratuito') ||
                           err.message?.includes('Compra tokens') ||
                           err.message?.includes('alcanzado el límite') ||
                           err.status === 403;

      if (isTokenError) {
        if (err.reason === "daily_limit" || err.message?.includes('Alcanzaste') || err.message?.includes('límite gratuito')) {
          const todayInMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
          const tzDate = new Date(todayInMexico);
          const localToday = tzDate.getFullYear() + "-" + String(tzDate.getMonth() + 1).padStart(2, '0') + "-" + String(tzDate.getDate()).padStart(2, '0');
          localStorage.setItem('cyberedu_daily_limit_reached', localToday);
          setDailyLimitBanner({ visible: true, message: err.message || err.reason });
          setIsStreaming(false);
          return;
        }

        localStorage.setItem('cyberedu_pending_question', JSON.stringify({
          question: text.trim(),
          timestamp: Date.now()
        }));
        toast.info("Sin tokens disponibles. Tu pregunta está guardada — responderemos en cuanto recargues.");
        agentNavigate("/tokens");
        setIsStreaming(false);
        return;
      }

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

  // Auto-enviar pregunta pendiente cuando el usuario regresa con tokens
  useEffect(() => {
    const raw = localStorage.getItem('cyberedu_pending_question');
    if (!raw || !user) return;
    try {
      const { question, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp < 1800000) {
        // Pregunta válida (menos de 30 min) — limpiar y enviar automáticamente
        localStorage.removeItem('cyberedu_pending_question');
        // Pequeño delay para que el componente esté completamente montado
        const timer = setTimeout(() => {
          setIsOpen(true);
          sendMessage(question);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        // Expirada — limpiar sin enviar
        localStorage.removeItem('cyberedu_pending_question');
      }
    } catch {
      localStorage.removeItem('cyberedu_pending_question');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {/* Floating Toggle — se oculta en fullscreen móvil para no sobreponerse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-[100] transition-all duration-500 flex items-center justify-center",
          isOpen && isExpanded
            ? "scale-0 opacity-0 pointer-events-none"
            : isOpen
            ? "bg-slate-900 border border-white/10 rotate-90 scale-100 opacity-100"
            : "bg-primary hover:scale-110 active:scale-95 shadow-[0_0_30px_hsl(var(--primary)/0.5)] scale-100 opacity-100"
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
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowTasks(!showTasks)}
                title="Tareas"
                className={cn("p-1.5 sm:p-2 rounded-xl transition-all relative flex", showTasks ? "bg-primary text-white" : "hover:bg-white/10 text-slate-500 hover:text-white")}
              >
                <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {tasks.filter(t => t.status === "queued" || t.status === "running").length > 0 && (
                    <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setShowAgentSidebar(!showAgentSidebar)}
                title={showAgentSidebar ? "Ocultar memoria" : "Ver memoria del agente"}
                className="hidden md:flex p-1.5 sm:p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-colors"
              >
                {showAgentSidebar ? <PanelRightClose className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <PanelRightOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              </button>
              {/* Expand/Collapse — solo visible en desktop */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Contraer chat" : "Expandir chat"}
                className="hidden sm:flex p-1.5 sm:p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-colors"
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
              {/* Botón cerrar visible solo en móvil — el botón flotante se oculta en fullscreen */}
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar tutor"
                className="flex sm:hidden p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {(!isSubscriber && trialDaysRemaining > 0 && trialDaysRemaining <= 3) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md overflow-hidden relative shrink-0"
            >
              <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 flex items-start gap-3">
                <div className="flex-1 text-[10px] sm:text-xs font-bold text-amber-200/90 leading-relaxed pr-6 text-left">
                  ⏰ Te quedan <span className="text-white font-black">{trialDaysRemaining}</span> {trialDaysRemaining === 1 ? 'día' : 'días'} de prueba gratuita. ¡Suscríbete para mantener tu acceso ilimitado al AITutor! 🎓
                </div>
                <button
                  onClick={() => agentNavigate("/tokens")}
                  className="px-2 py-1 bg-amber-500 text-black text-[10px] font-black uppercase rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Ver planes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className={cn("flex-1 flex overflow-hidden relative", isExpanded ? "flex-row" : "flex-col")}>
          {/* Chat Column */}
          <div className="flex-1 flex flex-col min-w-0 bg-white/[0.02]">
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative bg-slate-950/20 shadow-inner">
                <div className={cn(
                  "space-y-6 transition-all duration-500 pb-20",
                  isExpanded
                    ? (showAgentSidebar ? "max-w-3xl mx-auto px-6 lg:px-10" : "max-w-5xl mx-auto px-6 lg:px-12")
                    : "max-w-4xl mx-auto w-full px-4"
                )}>
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
                    <MessageBubble 
                      key={msg.id}
                      msg={msg}
                      isExpanded={isExpanded}
                      handleFeedback={handleFeedback}
                      handlePlanAction={handlePlanAction}
                      handleToggleStep={handleToggleStep}
                      handleQuizAnswer={handleQuizAnswer}
                      quizAnswers={quizAnswers}
                      togglePaso={togglePaso}
                      deletePlan={deletePlan}
                      agentNavigate={agentNavigate}
                      fixingCheckId={fixingCheckId}
                      setFixingCheckId={setFixingCheckId}
                      setMessages={setMessages}
                      runDiagnostics={runDiagnostics}
                      setLatestDiagnostics={setLatestDiagnostics}
                      markdownComponents={markdownComponents}
                      isStreaming={isStreaming && messages[messages.length-1].id === msg.id}
                      speakMessage={speakMessage}
                      isSpeaking={isSpeaking}
                    />
                  ))}
               </div>
            </div>

            {/* Suggestions */}
            {!isStreaming && contextualSuggestions.length > 0 && (
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
                  {/* Improved Token/Trial Status Bar */}
                  <div className="mb-4 flex items-center justify-between px-2 bg-slate-900/30 p-2 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex flex-col">
                      {(() => {
                        // Use usageStats as the source of truth for daily usage and tokens
                        const tokens = usageStats?.tokens || profile?.tokens || 0;
                        const actualDailyCount = usageStats?.used || 0;
                        const dailyLimit = usageStats?.limit || 5;
                        const isSubscriber = usageStats?.isSubscriber || profile?.subscription_status === 'active' || profile?.is_premium === true;

                        return (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[10px] font-black uppercase text-white flex items-center gap-1.5">
                                    <Ticket className="h-3.5 w-3.5 text-primary" /> 
                                    Balance: <span className={cn("px-1.5 py-0.5 rounded-md", tokens > 0 ? "bg-primary/20 text-primary border border-primary/30" : "bg-slate-800 text-slate-500 border border-white/5")}>
                                      {tokens} {tokens === 1 ? 'TOKEN' : 'TOKENS'}
                                    </span>
                                </p>
                            </div>
                            
                            {!isSubscriber && tokens <= 0 && (
                                <div className="flex flex-col gap-1 mt-1 border-t border-white/5 pt-1">
                                    {dailyLimit - actualDailyCount === 1 ? (
                                        <p className="text-[9px] font-black uppercase text-amber-500 animate-pulse flex items-center gap-1">
                                            ⚠️ Te queda 1 pregunta gratuita hoy — ¡Úsala bien!
                                        </p>
                                    ) : dailyLimit - actualDailyCount <= 0 ? (
                                        <p className="text-[9px] font-black uppercase text-rose-500 flex items-center gap-1">
                                            🔒 Agotaste tus preguntas gratuitas de hoy. Vuelve mañana o compra tokens.
                                        </p>
                                    ) : (
                                        <p className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
                                            <span className="text-primary text-[11px]">🎁</span> 
                                            GRATIS HOY: {actualDailyCount}/{dailyLimit} preguntas realizadas
                                        </p>
                                    )}
                                    {/* Visual Progress Bar */}
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-0.5">
                                      <div 
                                        className={cn(
                                          "h-full transition-all duration-700 ease-out",
                                          (actualDailyCount / dailyLimit) >= 1 ? "bg-rose-500" : 
                                          (actualDailyCount / dailyLimit) >= 0.8 ? "bg-amber-500" : "bg-primary"
                                        )}
                                        style={{ width: `${Math.min(100, (actualDailyCount / dailyLimit) * 100)}%` }}
                                      />
                                    </div>
                                </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <button 
                      onClick={() => agentNavigate("/tokens")}
                      className="px-3 py-1.5 h-auto rounded-xl bg-primary/10 border border-primary/30 text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md shadow-primary/10 flex items-center gap-2"
                    >
                      <Ticket className="h-3 w-3 " />
                      Comprar más
                    </button>
                  </div>

                  {/* Banner Límite Diario */}
                  {dailyLimitBanner.visible && (
                    <div className="mb-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl relative overflow-hidden animate-in slide-in-from-bottom-2 fade-in">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l" />
                      <p className="text-xs text-red-100 font-medium mb-2 pl-2 shadow-sm">{dailyLimitBanner.message}</p>
                      <div className="flex flex-wrap gap-2 pl-2">
                        <button 
                          onClick={() => agentNavigate("/tokens")}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 hover:text-white border border-red-500/50 text-[10px] font-black text-red-200 uppercase tracking-widest transition-all shadow-md flex items-center gap-1"
                        >
                          <Ticket className="h-3 w-3" /> Conseguir tokens
                        </button>
                        <button 
                          onClick={() => {
                            const todayInMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
                            const tzDate = new Date(todayInMexico);
                            const localToday = tzDate.getFullYear() + "-" + String(tzDate.getMonth() + 1).padStart(2, '0') + "-" + String(tzDate.getDate()).padStart(2, '0');
                            localStorage.setItem("cyberedu_daily_limit_dismissed", localToday);
                            setDailyLimitBanner(prev => ({ ...prev, visible: false }));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black text-slate-300 uppercase tracking-widest transition-all"
                        >
                          Entendido
                        </button>
                      </div>
                    </div>
                  )}

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

                    <div className="text-right mb-2">
                       {!usageStats && !isSubscriber && (
                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
                           Sincronizando uso...
                         </span>
                       )}
                       {usageStats && !usageStats.isSubscriber && (
                         <>
                           {usageStats.tokens > 0 ? (
                             <div className="flex flex-col items-end gap-1">
                               <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 flex items-center gap-1.5">
                                 <Ticket className="h-3 w-3" /> {usageStats.tokens} tokens disponibles
                               </span>
                               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                                 Límite gratuito: {usageStats.used}/{usageStats.limit} hoy
                               </span>
                             </div>
                           ) : (
                             <span className={cn(
                               "text-[10px] font-black uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5",
                               usageStats.used >= usageStats.limit ? "text-rose-500 border-rose-500/30" : 
                               usageStats.used >= usageStats.limit - 1 ? "text-amber-500 animate-pulse" : "text-slate-400"
                             )}>
                               🎁 {usageStats.used}/{usageStats.limit} preguntas hoy
                             </span>
                           )}
                         </>
                       )}
                    </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                        placeholder={isListening ? "Escuchando..." : (dailyLimitBanner.visible ? "Límite diario alcanzado" : "Pregunta algo o usa un comando...")}
                        disabled={isStreaming || dailyLimitBanner.visible}
                        className={cn(
                          "w-full bg-slate-800/80 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all focus:ring-2 ring-primary/10 disabled:opacity-50",
                          isListening && "border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                        )}
                      />
                      <button
                        onClick={toggleListening}
                        disabled={isStreaming || dailyLimitBanner.visible}
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
                      disabled={!input.trim() || isStreaming || dailyLimitBanner.visible}
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
          {showAgentSidebar && (
            <div className={cn(
               "border-l border-white/5 bg-slate-900/95 backdrop-blur-3xl flex flex-col p-5 space-y-6 overflow-y-auto transition-all duration-500 z-[60]",
               isExpanded ? "md:relative md:w-72 lg:w-80 md:translate-x-0" : "fixed inset-y-0 right-0 w-[85%] sm:w-80 shadow-2xl",
               showAgentSidebar ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
            )}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <History className="h-3 w-3" /> Memoria del Agente
                </h3>
                <button 
                  onClick={() => setShowAgentSidebar(false)}
                  className="p-1 hover:bg-white/10 rounded text-slate-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

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

              <div className="flex-1 mt-6">
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
          )}
        </div>
      </div>
    </>
  );
};

export default AITutor;
