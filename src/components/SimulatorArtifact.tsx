import React, { useState } from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorStep {
  id: number;
  label: string;
  description: string;
  color: string;
}

export const SimulatorArtifact: React.FC<{ simulator: { title: string; steps: SimulatorStep[]; summary: string; } }> = ({ simulator }) => {
  const [activeStep, setActiveStep] = useState<number>(simulator.steps[0]?.id ?? 1);
  const active = simulator.steps.find(s => s.id === activeStep);

  return (
    <div className="my-3 rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
      {/* Header compacto */}
      <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
        <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-xs font-black text-white uppercase tracking-wider truncate">{simulator.title}</span>
      </div>

      {/* Pasos horizontales */}
      <div className="flex overflow-x-auto gap-1 p-2 custom-scrollbar">
        {simulator.steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => setActiveStep(step.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg border transition-all shrink-0 min-w-[60px] max-w-[80px]",
                activeStep === step.id ? "bg-white/15 border-white/20" : "bg-slate-800/50 border-white/5 hover:bg-slate-800/80"
              )}
            >
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                style={{ backgroundColor: step.color }}>
                {step.id}
              </div>
              <span className="text-[9px] font-bold text-slate-300 text-center leading-tight line-clamp-2">{step.label}</span>
            </button>
            {index < simulator.steps.length - 1 && (
              <div className="flex items-center shrink-0 text-slate-600 text-xs">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Descripción del paso activo */}
      {active && (
        <div className="px-3 py-2 border-t border-white/5 flex items-start gap-2">
          <div className="h-4 w-4 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: active.color }} />
          <p className="text-xs text-slate-300 leading-relaxed">{active.description}</p>
        </div>
      )}

      {/* Resumen */}
      <div className="px-3 py-1.5 bg-white/[0.02] border-t border-white/5">
        <p className="text-[9px] text-slate-500 italic">{simulator.summary}</p>
      </div>
    </div>
  );
};

export default SimulatorArtifact;
