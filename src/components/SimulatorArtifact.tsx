import React, { useState } from "react";
import { PlayCircle, ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorStep {
  id: number;
  label: string;
  description: string;
  color: string;
}

interface SimulatorProps {
  simulator: {
    title: string;
    steps: SimulatorStep[];
    summary: string;
  };
}

export const SimulatorArtifact: React.FC<SimulatorProps> = ({ simulator }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm sm:max-w-md mx-auto">
      {/* Header */}
      <div className="bg-primary/20 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <PlayCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{simulator.title}</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-1 opacity-70">
              Simulador Visual
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Steps Flow */}
        <div className="flex flex-col gap-3">
          {simulator.steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                className={cn(
                  "relative flex flex-col items-start w-full p-4 rounded-2xl border transition-all duration-300 text-left",
                  activeStep === step.id 
                    ? "bg-white/10 border-white/20 scale-[1.02]" 
                    : "bg-slate-800/50 border-white/5 hover:bg-slate-800/80"
                )}
                style={{
                  borderLeftColor: step.color,
                  borderLeftWidth: activeStep === step.id ? '6px' : '4px'
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <div 
                    className="flex items-center justify-center h-8 w-8 rounded-full font-black text-sm shrink-0 shadow-lg text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.id}
                  </div>
                  <span className="font-bold text-white uppercase tracking-wider text-sm flex-1">
                    {step.label}
                  </span>
                </div>

                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-300 w-full pl-11",
                    activeStep === step.id ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </button>
              
              {index < simulator.steps.length - 1 && (
                <div className="flex justify-center -my-2 opacity-50">
                  <ArrowRight className="h-4 w-4 text-slate-500 rotate-90" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Summary Area */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-2">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
            {simulator.summary}
          </p>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">ECOEMS 2026 • Simulador Visual</p>
      </div>
    </div>
  );
};

export default SimulatorArtifact;
