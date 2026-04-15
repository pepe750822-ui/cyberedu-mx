import React, { useState } from "react";
import { Beaker, Atom, Thermometer, Weight, Info, Grid, X, CheckCircle2 } from "lucide-react";
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

// Basic periodic table layout for the first 36 elements (up to Kr) - sufficient for ECOEMS
const PT_MINI = [
  { s: "H", n: 1, r: 1, c: 1, cat: "No metales" },
  { s: "He", n: 2, r: 1, c: 18, cat: "Gases nobles" },
  { s: "Li", n: 3, r: 2, c: 1, cat: "Alcalinos" },
  { s: "Be", n: 4, r: 2, c: 2, cat: "Metales Alcalinotérreos" },
  { s: "B", n: 5, r: 2, c: 13, cat: "Metaloides" },
  { s: "C", n: 6, r: 2, c: 14, cat: "No metales" },
  { s: "N", n: 7, r: 2, c: 15, cat: "No metales" },
  { s: "O", n: 8, r: 2, c: 16, cat: "No metales" },
  { s: "F", n: 9, r: 2, c: 17, cat: "Halógenos" },
  { s: "Ne", n: 10, r: 2, c: 18, cat: "Gases nobles" },
  { s: "Na", n: 11, r: 3, c: 1, cat: "Alcalinos" },
  { s: "Mg", n: 12, r: 3, c: 2, cat: "Metales Alcalinotérreos" },
  { s: "Al", n: 13, r: 3, c: 13, cat: "Otros metales" },
  { s: "Si", n: 14, r: 3, c: 14, cat: "Metaloides" },
  { s: "P", n: 15, r: 3, c: 15, cat: "No metales" },
  { s: "S", n: 16, r: 3, c: 16, cat: "No metales" },
  { s: "Cl", n: 17, r: 3, c: 17, cat: "Halógenos" },
  { s: "Ar", n: 18, r: 3, c: 18, cat: "Gases nobles" },
  { s: "K", n: 19, r: 4, c: 1, cat: "Alcalinos" },
  { s: "Ca", n: 20, r: 4, c: 2, cat: "Metales Alcalinotérreos" },
  { s: "Sc", n: 21, r: 4, c: 3, cat: "Metales de transición" },
  { s: "Ti", n: 22, r: 4, c: 4, cat: "Metales de transición" },
  { s: "V", n: 23, r: 4, c: 5, cat: "Metales de transición" },
  { s: "Cr", n: 24, r: 4, c: 6, cat: "Metales de transición" },
  { s: "Mn", n: 25, r: 4, c: 7, cat: "Metales de transición" },
  { s: "Fe", n: 26, r: 4, c: 8, cat: "Metales de transición" },
  { s: "Co", n: 27, r: 4, c: 9, cat: "Metales de transición" },
  { s: "Ni", n: 28, r: 4, c: 10, cat: "Metales de transición" },
  { s: "Cu", n: 29, r: 4, c: 11, cat: "Metales de transición" },
  { s: "Zn", n: 30, r: 4, c: 12, cat: "Metales de transición" },
  { s: "Ga", n: 31, r: 4, c: 13, cat: "Otros metales" },
  { s: "Ge", n: 32, r: 4, c: 14, cat: "Metaloides" },
  { s: "As", n: 33, r: 4, c: 15, cat: "Metaloides" },
  { s: "Se", n: 34, r: 4, c: 16, cat: "No metales" },
  { s: "Br", n: 35, r: 4, c: 17, cat: "Halógenos" },
  { s: "Kr", n: 36, r: 4, c: 18, cat: "Gases nobles" },
];

export const ChemistryArtifact: React.FC<ChemistryProps> = ({ element }) => {
  const [showTable, setShowTable] = useState(false);
  const [selectedInModal, setSelectedInModal] = useState<any>(null);

  if (!element || !element.symbol) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Metales de transición": return "bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/40";
      case "Gases nobles": return "bg-indigo-500/20 text-indigo-500 border-indigo-500/30 hover:bg-indigo-500/40";
      case "No metales": return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/40";
      case "Alcalinos": return "bg-rose-500/20 text-rose-500 border-rose-500/30 hover:bg-rose-500/40";
      case "Metales Alcalinotérreos": return "bg-pink-500/20 text-pink-500 border-pink-500/30 hover:bg-pink-500/40";
      case "Halógenos": return "bg-cyan-500/20 text-cyan-500 border-cyan-500/30 hover:bg-cyan-500/40";
      case "Metaloides": return "bg-orange-500/20 text-orange-500 border-orange-500/30 hover:bg-orange-500/40";
      case "Otros metales": return "bg-teal-500/20 text-teal-500 border-teal-500/30 hover:bg-teal-500/40";
      default: return "bg-primary/20 text-primary border-primary/30 hover:bg-primary/40";
    }
  };

  const colorStyle = getCategoryColor(element.category);

  return (
    <>
      <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
        {/* Element Card Header */}
        <div className={cn("p-4 border-b border-white/10 flex items-center justify-between", colorStyle.split(' hover:')[0])}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center relative shadow-inner hover:scale-105 transition-transform cursor-pointer" onClick={() => setShowTable(true)} title="Ver en Tabla Periódica">
              <span className="text-2xl font-black">{element.symbol}</span>
              <span className="absolute top-1 right-1.5 text-[10px] font-bold opacity-60">{element.atomic_number}</span>
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight leading-none text-white">{element.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{element.category}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowTable(!showTable)}
            className="p-2.5 rounded-xl bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/30 transition-all ml-2"
            title="Ver Tabla Periódica"
          >
            <Grid className="h-5 w-5" />
          </button>
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
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
             <Atom className="h-3 w-3" /> Ficha Química Interactiva
          </p>
        </div>
      </div>

      {/* Modal Tabla Periódica */}
      {showTable && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                  <Grid className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Tabla Periódica</h3>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Primeros 36 Elementos (Nivel ECOEMS)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTable(false)}
                className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-auto flex-1 custom-scrollbar flex items-center justify-center">
              <div 
                className="grid gap-1 md:gap-2 mx-auto" 
                style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', width: 'fit-content' }}
              >
                {PT_MINI.map(el => {
                  const isHighlighted = el.s === element.symbol;
                  return (
                    <button
                      key={el.n}
                      onClick={() => setSelectedInModal(el)}
                      style={{ gridRow: el.r, gridColumn: el.c }}
                      className={cn(
                        "relative flex flex-col justify-between items-center w-8 h-10 md:w-12 md:h-14 rounded-lg md:rounded-xl border transition-all cursor-pointer p-0.5 md:p-1 overflow-hidden group",
                        getCategoryColor(el.cat),
                        isHighlighted && "ring-2 ring-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10"
                      )}
                    >
                      <span className="text-[8px] md:text-[9px] font-black opacity-60 self-start ml-0.5">{el.n}</span>
                      <span className="text-[11px] md:text-sm font-black leading-none">{el.s}</span>
                      <span className="text-[0px] md:text-[7px] text-transparent leading-none h-0 opacity-0">{el.cat}</span>
                      
                      {isHighlighted && <div className="absolute inset-0 border-2 border-white rounded-lg md:rounded-xl opacity-50" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedInModal ? (
              <div className={cn("p-4 border-t border-white/5 flex gap-4 items-center animate-in slide-in-from-bottom-2", getCategoryColor(selectedInModal.cat).split(' ')[0])}>
                 <div className="h-12 w-12 bg-black/20 rounded-xl flex items-center justify-center text-xl font-black shrink-0 border border-white/10">
                   {selectedInModal.s}
                 </div>
                 <div className="flex-1">
                   <p className="text-sm font-black text-white">{selectedInModal.cat}</p>
                   <p className="text-xs text-slate-300">Elemento #{selectedInModal.n}</p>
                 </div>
                 <button 
                   onClick={() => setSelectedInModal(null)}
                   className="p-2 hover:bg-black/20 rounded-lg text-slate-400 transition-colors"
                 >
                   <X className="h-4 w-4" />
                 </button>
              </div>
            ) : (
              <div className="p-4 border-t border-white/5 text-center bg-slate-800/30">
                <p className="text-xs text-slate-400 font-medium">Haz clic en cualquier elemento para explorarlo.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChemistryArtifact;
