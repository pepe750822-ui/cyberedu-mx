import React, { useState } from "react";
import { Target, CheckCircle2, XCircle, Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseProps {
  exercise: {
    title: string;
    problem: string;
    placeholder?: string;
    expected_answer: string;
    hint: string;
    explanation: string;
  };
}

export const ExerciseArtifact: React.FC<ExerciseProps> = ({ exercise }) => {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const checkAnswer = () => {
    if (!value.trim()) return;
    
    // Basic normalization for comparison
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').replace(',', '.');
    const isMatch = normalize(value) === normalize(exercise.expected_answer);
    
    if (isMatch) {
      setStatus("correct");
      setShowExplanation(true);
    } else {
      setStatus("incorrect");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") checkAnswer();
  };

  return (
    <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm sm:max-w-md mx-auto">
      {/* Header */}
      <div className="bg-primary/20 p-4 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
          <Target className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">{exercise.title || "Ejercicio Práctico"}</h3>
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-1 opacity-70">
            Reto Interactivo
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Plantear Problema */}
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {exercise.problem}
        </p>

        {/* Área de Entrada */}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setStatus("idle");
            }}
            onKeyDown={handleKeyDown}
            disabled={status === "correct"}
            placeholder={exercise.placeholder || "Escribe tu respuesta aquí..."}
            className={cn(
              "w-full bg-slate-800/80 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all pr-12",
              status === "idle" ? "border-white/10 focus:border-primary/50 focus:ring-2 ring-primary/10" :
              status === "correct" ? "border-green-500/50 bg-green-500/10 text-green-200" :
              "border-red-500/50 bg-red-500/10 text-red-200"
            )}
          />
          <button
            onClick={checkAnswer}
            disabled={status === "correct" || !value.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 hover:bg-primary/40 rounded-lg text-primary transition-colors disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Feedback Messages */}
        {status === "incorrect" && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <p className="text-xs text-red-400 font-bold flex items-center gap-2">
              <XCircle className="h-4 w-4" /> Respuesta incorrecta. Inténtalo de nuevo.
            </p>
            {!showHint && (
              <button 
                onClick={() => setShowHint(true)}
                className="mt-3 text-[11px] uppercase tracking-widest font-black text-primary/80 hover:text-primary transition-colors flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3" /> Ver pista
              </button>
            )}
          </div>
        )}

        {showHint && status !== "correct" && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl animate-in fade-in duration-300">
            <p className="text-xs text-yellow-500 font-medium italic flex items-start gap-2">
              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
              {exercise.hint}
            </p>
            <button 
                onClick={() => setShowExplanation(true)}
                className="mt-3 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition-colors underline"
              >
                Me rindo, ver respuesta
            </button>
          </div>
        )}

        {/* Explicación (Success or Gave up) */}
        {showExplanation && (
          <div className={cn(
            "p-4 rounded-xl border animate-in zoom-in-95 duration-500",
            status === "correct" ? "bg-green-500/10 border-green-500/30" : "bg-primary/10 border-primary/30"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {status === "correct" ? (
                 <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : (
                 <Target className="h-5 w-5 text-primary" />
              )}
              <h4 className={cn("text-xs font-black uppercase tracking-wider", status === "correct" ? "text-green-400" : "text-primary")}>
                {status === "correct" ? "¡Excelente trabajo!" : "Solución"}
              </h4>
            </div>
            
            {status !== "correct" && (
               <p className="text-sm font-bold text-white mb-2">
                 Respuesta esperada: <span className="text-primary">{exercise.expected_answer}</span>
               </p>
            )}
            
            <p className="text-sm text-slate-300 leading-relaxed">
              {exercise.explanation}
            </p>
          </div>
        )}

      </div>
      
      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">ECOEMS 2026 • Evaluación Rápida</p>
      </div>
    </div>
  );
};

export default ExerciseArtifact;
