import React, { useState } from "react";
import { Target, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseData {
  title: string;
  problem: string;
  hint: string;
  answer: number | string;
  answer_unit?: string;
  explanation: string;
}

export const ExerciseArtifact: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const checkAnswer = () => {
    if (!value.trim()) return;
    const normalize = (s: string) =>
      s.toLowerCase().replace(/\s+/g, "").replace(",", ".").replace(/[^0-9.]/g, "");
    const userNum = parseFloat(normalize(value));
    const correctNum = parseFloat(String(exercise.answer).replace(",", "."));
    // Accept ±1% tolerance for floating point
    const isMatch = !isNaN(userNum) && !isNaN(correctNum) && Math.abs(userNum - correctNum) / (Math.abs(correctNum) || 1) < 0.01;
    if (isMatch) {
      setStatus("correct");
      setShowExplanation(true);
    } else {
      setStatus("incorrect");
    }
  };

  return (
    <div className="my-3 rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
      {/* Header compacto */}
      <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
        <Target className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-xs font-black text-white uppercase tracking-wider truncate">
          {exercise.title || "Ejercicio Práctico"}
        </span>
        <span className="ml-auto text-[9px] font-black text-primary/60 uppercase tracking-widest shrink-0">
          Reto Interactivo
        </span>
      </div>

      <div className="px-3 py-3 space-y-3">
        {/* Problema */}
        <p className="text-sm text-slate-200 leading-relaxed">{exercise.problem}</p>

        {/* Input + botón */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              value={value}
              onChange={(e) => { setValue(e.target.value); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              disabled={status === "correct"}
              placeholder={`Tu respuesta${exercise.answer_unit ? ` (${exercise.answer_unit})` : ""}...`}
              className={cn(
                "w-full bg-slate-800/80 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-all",
                status === "idle" && "border-white/10 focus:border-primary/50",
                status === "correct" && "border-emerald-500/50 bg-emerald-500/10 text-emerald-200",
                status === "incorrect" && "border-rose-500/50 bg-rose-500/10 text-rose-200"
              )}
            />
            {exercise.answer_unit && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold pointer-events-none">
                {exercise.answer_unit}
              </span>
            )}
          </div>
          <button
            onClick={checkAnswer}
            disabled={status === "correct" || !value.trim()}
            className="px-3 py-2 bg-primary/20 hover:bg-primary/40 border border-primary/30 rounded-lg text-xs font-black text-primary transition-all disabled:opacity-40 whitespace-nowrap"
          >
            Verificar
          </button>
        </div>

        {/* Feedback incorrecto */}
        {status === "incorrect" && (
          <div className="flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-rose-400 font-bold flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5 shrink-0" /> Respuesta incorrecta. Inténtalo de nuevo.
            </p>
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="text-[10px] uppercase tracking-widest font-black text-yellow-500/80 hover:text-yellow-400 transition-colors flex items-center gap-1 shrink-0"
              >
                <Lightbulb className="h-3 w-3" /> Pista
              </button>
            )}
          </div>
        )}

        {/* Pista */}
        {showHint && status !== "correct" && (
          <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg animate-in fade-in duration-200">
            <p className="text-xs text-yellow-400 font-medium italic flex items-start gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {exercise.hint}
            </p>
            <button
              onClick={() => setShowExplanation(true)}
              className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors underline"
            >
              Ver respuesta
            </button>
          </div>
        )}

        {/* Explicación (correcto o rendido) */}
        {showExplanation && (
          <div
            className={cn(
              "p-3 rounded-lg border animate-in fade-in slide-in-from-top-1 duration-300",
              status === "correct"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-primary/10 border-primary/20"
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {status === "correct" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <Target className="h-4 w-4 text-primary shrink-0" />
              )}
              <p className={cn("text-xs font-black uppercase tracking-wider",
                status === "correct" ? "text-emerald-400" : "text-primary"
              )}>
                {status === "correct" ? "¡Excelente trabajo!" : "Solución"}
              </p>
              {status !== "correct" && (
                <span className="ml-auto text-xs font-bold text-white">
                  {exercise.answer}{exercise.answer_unit ? ` ${exercise.answer_unit}` : ""}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{exercise.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          ECOEMS 2026 • Evaluación Rápida
        </p>
      </div>
    </div>
  );
};

export default ExerciseArtifact;
