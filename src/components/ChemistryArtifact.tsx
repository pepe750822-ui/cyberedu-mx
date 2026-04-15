import React from "react";
import { Beaker, Atom, Thermometer, Weight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChemistryProps {
  element: {
    name: string;
    symbol: string;
    atomic_number: number;
    atomic_mass: number;
    category: string;
    properties: {
      density: string;
      melting_point: string;
      boiling_point: string;
      electron_config: string;
    };
    description: string;
  };
}

export const ChemistryArtifact: React.FC<ChemistryProps> = ({ element }) => {
  if (!element || !element.symbol) return null;

  const categoryColors: Record<string, string> = {
    "Metales de transición": "bg-amber-500/20 text-amber-500 border-amber-500/30",
    "Gases nobles": "bg-indigo-500/20 text-indigo-500 border-indigo-500/30",
    "No metales": "bg-emerald-500/20 text-emerald-500 border-emerald-500/30",
    "Alcalinos": "bg-rose-500/20 text-rose-500 border-rose-500/30",
    "Halógenos": "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
    "Metaloides": "bg-orange-500/20 text-orange-500 border-orange-500/30",
  };

  const colorStyle = categoryColors[element.category] || "bg-primary/20 text-primary border-primary/30";

  return (
    <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
      {/* Element Card Header */}
      <div className={cn("p-4 border-b border-white/10 flex items-center justify-between", colorStyle)}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center relative shadow-inner">
            <span className="text-2xl font-black">{element.symbol}</span>
            <span className="absolute top-1 right-1.5 text-[10px] font-bold opacity-60">{element.atomic_number}</span>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight leading-none text-white">{element.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{element.category}</p>
          </div>
        </div>
        <Atom className="h-6 w-6 opacity-40" />
      </div>

      <div className="p-5 space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
            <Weight className="h-4 w-4 text-slate-500 mb-1" />
            <p className="text-xs font-black text-slate-200">{element.atomic_mass} u</p>
            <p className="text-[9px] text-slate-500 uppercase font-black">Masa Atómica</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
            <Atom className="h-4 w-4 text-slate-500 mb-1" />
            <p className="text-xs font-black text-slate-200">{element.atomic_number}</p>
            <p className="text-[9px] text-slate-500 uppercase font-black">Protones/Electrones</p>
          </div>
        </div>

        {/* Properties List */}
        <div className="space-y-2">
           <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2">
                <Thermometer className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-slate-400 font-bold">Punto de Fusión</span>
              </div>
              <span className="text-xs font-black text-white">{element.properties.melting_point}</span>
           </div>
           <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2">
                <Beaker className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs text-slate-400 font-bold">Config. Electrónica</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white">{element.properties.electron_config}</span>
           </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
           <div className="flex items-center gap-2 mb-2">
             <Info className="h-3.5 w-3.5 text-primary" />
             <p className="text-[10px] font-black text-primary uppercase tracking-widest">Dato del Tutor</p>
           </div>
           <p className="text-xs text-slate-300 italic leading-relaxed">
             {element.description}
           </p>
        </div>
      </div>

      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">ECOEMS 2026 • Tutoría de Química Avanzada</p>
      </div>
    </div>
  );
};

export default ChemistryArtifact;
