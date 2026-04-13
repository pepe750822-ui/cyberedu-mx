import React, { useState } from "react";
import { Target, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseData {
  title: string;
  problem: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export const ExerciseArtifact: React.FC<{ exercise: ExerciseData }> = ({ exercise }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setShowExplanation(true);
  };

  const isCorrect = selectedIdx === exercise.correct_index;

  return (
    <div className="my-3 rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
      {/* Header compacto */}
      <div className="px-3 py-2 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
        <Target className="h-4 w-4 text-primary shrink-0" />
        <span className="text-xs font-black text-white uppercase tracking-wider truncate">
          {exercise.title || "Ejercicio Práctico"}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            Reto IA
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Problema */}
        <p className="text-sm sm:text-base text-slate-200 font-semibold leading-relaxed">
          {exercise.problem}
        </p>

        {/* Opciones */}
        <div className="grid grid-cols-1 gap-2">
          {exercise.options.map((option, idx) => {
            const isThisSelected = selectedIdx === idx;
            const isThisCorrect = idx === exercise.correct_index;
            
            let buttonStyle = "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20";
            
            if (selectedIdx !== null) {
              if (isThisCorrect) {
                buttonStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30";
              } else if (isThisSelected) {
                buttonStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300 ring-1 ring-rose-500/30";
              } else {
                buttonStyle = "bg-white/[0.02] border-white/5 text-slate-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedIdx !== null}
                className={cn(
                  "group relative w-full flex items-center gap-3 p-3 rounded-xl border text-left text-sm font-bold transition-all duration-200 active:scale-[0.98]",
                  buttonStyle
                )}
              >
                <div className={cn(
                  "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-colors",
                  isThisSelected || (selectedIdx !== null && isThisCorrect)
                    ? "bg-current text-slate-950"
                    : "bg-white/10 text-slate-400 group-hover:bg-white/20"
                )}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1">{option}</span>
                {selectedIdx !== null && isThisCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 animate-in zoom-in-50 duration-300" />
                )}
                {isThisSelected && !isThisCorrect && (
                  <XCircle className="h-4 w-4 text-rose-400 shrink-0 animate-in zoom-in-50 duration-300" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explicación */}
        {showExplanation && (
          <div
            className={cn(
              "p-4 rounded-xl border animate-in slide-in-from-top-2 duration-400",
              isCorrect
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-primary/10 border-primary/20"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className={cn("h-4 w-4 shrink-0", isCorrect ? "text-emerald-400" : "text-primary")} />
              <p className={cn("text-xs font-black uppercase tracking-widest",
                isCorrect ? "text-emerald-400" : "text-primary"
              )}>
                {isCorrect ? "¡Respuesta Correcta!" : "Explicación Detallada"}
              </p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {exercise.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="px-3 py-2 bg-black/20 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Temario Oficial ECOEMS
          </span>
        </div>
        <p className="text-[9px] font-black text-primary/40 uppercase tracking-tighter italic">
          v3.0 Interaction Core
        </p>
      </div>
    </div>
  );
};

export default ExerciseArtifact;
