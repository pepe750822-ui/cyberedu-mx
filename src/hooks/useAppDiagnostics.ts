import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ───
export type CheckStatus = "ok" | "warning" | "error" | "checking";

export interface DiagnosticCheck {
  id: string;
  category: "connectivity" | "storage" | "session" | "data";
  label: string;
  status: CheckStatus;
  detail: string;
  fixLabel?: string;
  fix?: () => Promise<string>;
}

export interface DiagnosticsResult {
  checks: DiagnosticCheck[];
  overallStatus: CheckStatus;
  timestamp: number;
  jsErrors: CapturedError[];
}

interface CapturedError {
  message: string;
  source?: string;
  timestamp: number;
}

const MAX_ERRORS = 50;
const MEMORY_KEY = "cyberagent_memory_v2";
const HISTORY_KEY = "ai_agent_history_v2";

// ─── Hook ───
export function useAppDiagnostics() {
  const errorsRef = useRef<CapturedError[]>([]);
  const [errorCount, setErrorCount] = useState(0);

  // Passive JS error monitoring
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      errorsRef.current = [
        ...errorsRef.current.slice(-(MAX_ERRORS - 1)),
        { message: event.message, source: event.filename, timestamp: Date.now() },
      ];
      setErrorCount(errorsRef.current.length);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const msg = event.reason?.message || String(event.reason);
      errorsRef.current = [
        ...errorsRef.current.slice(-(MAX_ERRORS - 1)),
        { message: `Unhandled: ${msg}`, timestamp: Date.now() },
      ];
      setErrorCount(errorsRef.current.length);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  const clearErrors = useCallback(() => {
    errorsRef.current = [];
    setErrorCount(0);
  }, []);

  // ─── Individual Checks ───

  const checkApiConnectivity = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "api",
      category: "connectivity",
      label: "API Conectividad",
    };
    try {
      const { error } = await supabase.auth.getSession();
      if (error) return { ...base, status: "warning", detail: `Respuesta con error: ${error.message}`, fixLabel: "Reintentar", fix: async () => { await supabase.auth.getSession(); return "Reintento ejecutado"; } };
      return { ...base, status: "ok", detail: "Conexión exitosa" };
    } catch {
      return { ...base, status: "error", detail: "No se pudo conectar a la API", fixLabel: "Reintentar", fix: async () => { await supabase.auth.getSession(); return "Reintento ejecutado"; } };
    }
  }, []);

  const checkEdgeFunction = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "edge",
      category: "connectivity",
      label: "Edge Function (agent-chat)",
    };
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`, {
        method: "OPTIONS",
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      if (resp.ok || resp.status === 204) return { ...base, status: "ok", detail: `Disponible (${resp.status})` };
      return { ...base, status: "warning", detail: `Respondió con status ${resp.status}` };
    } catch {
      return { ...base, status: "error", detail: "Edge function no disponible" };
    }
  }, []);

  const checkSession = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "session",
      category: "session",
      label: "Sesión de usuario",
    };
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) return { ...base, status: "error", detail: error.message, fixLabel: "Refrescar token", fix: async () => { await supabase.auth.refreshSession(); return "Token refrescado"; } };
      if (!session) return { ...base, status: "warning", detail: "Sin sesión activa (no logueado)" };
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const remaining = expiresAt - Date.now();
      if (remaining < 5 * 60 * 1000 && remaining > 0) {
        return { ...base, status: "warning", detail: "Token por expirar", fixLabel: "Refrescar token", fix: async () => { await supabase.auth.refreshSession(); return "Token refrescado"; } };
      }
      return { ...base, status: "ok", detail: "Sesión activa y válida" };
    } catch {
      return { ...base, status: "error", detail: "Error verificando sesión" };
    }
  }, []);

  const checkLocalStorage = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "storage",
      category: "storage",
      label: "localStorage espacio",
    };
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)!;
        totalSize += key.length + (localStorage.getItem(key)?.length || 0);
      }
      const sizeMB = (totalSize * 2) / (1024 * 1024); // UTF-16
      if (sizeMB > 4) {
        return {
          ...base, status: "warning", detail: `${sizeMB.toFixed(2)} MB usado (~límite)`,
          fixLabel: "Limpiar datos antiguos",
          fix: async () => {
            const keysToClean: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i)!;
              if (k.startsWith("progreso-")) keysToClean.push(k);
            }
            keysToClean.forEach(k => localStorage.removeItem(k));
            return `${keysToClean.length} entradas de progreso limpiadas`;
          },
        };
      }
      return { ...base, status: "ok", detail: `${sizeMB.toFixed(2)} MB usado` };
    } catch {
      return { ...base, status: "error", detail: "No se pudo acceder a localStorage" };
    }
  }, []);

  const checkAgentMemory = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "memory",
      category: "data",
      label: "Memoria del agente",
    };
    try {
      const raw = localStorage.getItem(MEMORY_KEY);
      if (!raw) return { ...base, status: "ok", detail: "Sin memoria guardada" };
      const mem = JSON.parse(raw);
      if (!mem.decisions || !mem.topics || !mem.insights) {
        return {
          ...base, status: "error", detail: "Estructura de memoria corrupta",
          fixLabel: "Reiniciar memoria",
          fix: async () => { localStorage.removeItem(MEMORY_KEY); return "Memoria reiniciada"; },
        };
      }
      const age = Date.now() - (mem.lastUpdated || 0);
      const days = Math.floor(age / (1000 * 60 * 60 * 24));
      return { ...base, status: "ok", detail: `${mem.decisions.length} decisiones, ${mem.topics.length} temas (${days}d)` };
    } catch {
      return {
        ...base, status: "error", detail: "Memoria corrupta (JSON inválido)",
        fixLabel: "Reiniciar memoria",
        fix: async () => { localStorage.removeItem(MEMORY_KEY); return "Memoria reiniciada"; },
      };
    }
  }, []);

  const checkChatHistory = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "history",
      category: "data",
      label: "Historial del chat",
    };
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return { ...base, status: "ok", detail: "Sin historial guardado" };
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.data)) {
        return {
          ...base, status: "error", detail: "Historial corrupto",
          fixLabel: "Limpiar historial",
          fix: async () => { localStorage.removeItem(HISTORY_KEY); return "Historial limpiado"; },
        };
      }
      return { ...base, status: "ok", detail: `${parsed.data.length} mensajes` };
    } catch {
      return {
        ...base, status: "error", detail: "Historial corrupto (JSON inválido)",
        fixLabel: "Limpiar historial",
        fix: async () => { localStorage.removeItem(HISTORY_KEY); return "Historial limpiado"; },
      };
    }
  }, []);

  const checkVideoProgress = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "videos",
      category: "data",
      label: "Progreso de videos",
    };
    let count = 0;
    let corrupted = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith("video-")) count++;
      if (k.startsWith("progreso-")) {
        try { JSON.parse(localStorage.getItem(k)!); } catch { corrupted++; }
      }
    }
    if (corrupted > 0) {
      return {
        ...base, status: "warning", detail: `${count} videos marcados, ${corrupted} datos de progreso corruptos`,
        fixLabel: "Limpiar corruptos",
        fix: async () => {
          let cleaned = 0;
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i)!;
            if (k.startsWith("progreso-")) {
              try { JSON.parse(localStorage.getItem(k)!); } catch { localStorage.removeItem(k); cleaned++; }
            }
          }
          return `${cleaned} entradas corruptas eliminadas`;
        },
      };
    }
    return { ...base, status: "ok", detail: `${count} videos marcados como vistos` };
  }, []);

  const checkJsErrors = useCallback(async (): Promise<DiagnosticCheck> => {
    const base: Omit<DiagnosticCheck, "status" | "detail"> = {
      id: "js_errors",
      category: "data",
      label: "Errores JS recientes",
    };
    const count = errorsRef.current.length;
    if (count === 0) return { ...base, status: "ok", detail: "Sin errores capturados" };
    if (count < 5) return { ...base, status: "warning", detail: `${count} errores capturados`, fixLabel: "Limpiar buffer", fix: async () => { clearErrors(); return "Buffer limpiado"; } };
    return { ...base, status: "error", detail: `${count} errores capturados`, fixLabel: "Limpiar buffer", fix: async () => { clearErrors(); return "Buffer limpiado"; } };
  }, [clearErrors]);

  // ─── Run All Checks ───
  const runDiagnostics = useCallback(async (): Promise<DiagnosticsResult> => {
    const checks = await Promise.all([
      checkApiConnectivity(),
      checkEdgeFunction(),
      checkSession(),
      checkLocalStorage(),
      checkAgentMemory(),
      checkChatHistory(),
      checkVideoProgress(),
      checkJsErrors(),
    ]);

    const hasError = checks.some(c => c.status === "error");
    const hasWarning = checks.some(c => c.status === "warning");

    return {
      checks,
      overallStatus: hasError ? "error" : hasWarning ? "warning" : "ok",
      timestamp: Date.now(),
      jsErrors: [...errorsRef.current],
    };
  }, [checkApiConnectivity, checkEdgeFunction, checkSession, checkLocalStorage, checkAgentMemory, checkChatHistory, checkVideoProgress, checkJsErrors]);

  return {
    runDiagnostics,
    errorCount,
    clearErrors,
  };
}
