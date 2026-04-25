import React, { useState } from 'react';
import { Beaker, RotateCcw, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Atom {
  id: string;
  symbol: string;
  valanceElectrons: number;
  electrons: number[]; // positions 0-7
}

const LewisStructureArtifact: React.FC = () => {
  const [atoms, setAtoms] = useState<Atom[]>([
    { id: '1', symbol: 'H', valanceElectrons: 1, electrons: [1, 0, 0, 0, 0, 0, 0, 0] },
    { id: '2', symbol: 'O', valanceElectrons: 6, electrons: [1, 1, 1, 1, 1, 1, 0, 0] },
    { id: '3', symbol: 'H', valanceElectrons: 1, electrons: [1, 0, 0, 0, 0, 0, 0, 0] },
  ]);

  const toggleElectron = (atomId: string, index: number) => {
    setAtoms(prev => prev.map(atom => {
      if (atom.id !== atomId) return atom;
      const newElectrons = [...atom.electrons];
      newElectrons[index] = newElectrons[index] ? 0 : 1;
      return { ...atom, electrons: newElectrons };
    }));
  };

  const getElectronPos = (index: number) => {
    const angle = (index * 45) * Math.PI / 180;
    const r = 35;
    return {
      x: 40 + r * Math.cos(angle),
      y: 40 + r * Math.sin(angle)
    };
  };

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Beaker className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Modelador de Lewis</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Editor Interactivo de Enlaces Químicos</p>
        </div>
      </div>

      <div className="p-8">
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-12 min-h-[300px] flex items-center justify-center gap-12 flex-wrap">
          <AnimatePresence>
            {atoms.map((atom, atomIdx) => (
              <motion.div 
                key={atom.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-20 h-20 bg-slate-800 rounded-full border-2 border-white/10 flex items-center justify-center group"
              >
                <span className="text-2xl font-black text-white select-none">{atom.symbol}</span>
                
                {/* Electrons */}
                {atom.electrons.map((active, idx) => {
                  const pos = getElectronPos(idx);
                  return (
                    <motion.div
                      key={idx}
                      onClick={() => toggleElectron(atom.id, idx)}
                      className={`absolute w-3 h-3 rounded-full cursor-pointer transition-all ${
                        active ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]' : 'bg-white/5 border border-white/10 hover:bg-white/20'
                      }`}
                      style={{ left: pos.x - 6, top: pos.y - 6 }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  );
                })}

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                    e⁻ de valencia: {atom.electrons.filter(e => e).length}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Instrucciones</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs text-white/70">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 border border-emerald-500/20">1</div>
                <p>Haz clic en los puntos grises para agregar electrones.</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 border border-emerald-500/20">2</div>
                <p>Forma la molécula de <span className="text-emerald-400 font-bold">H₂O</span> (Agua).</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 border border-emerald-500/20">3</div>
                <p>Recuerda la <span className="text-emerald-400 font-bold">Regla del Octeto</span> para el Oxígeno.</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            {atoms[1].electrons.filter(e => e).length === 8 ? (
              <>
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-3" />
                <p className="text-sm font-black text-white uppercase tracking-tight">¡Octeto Completado!</p>
                <p className="text-[10px] text-emerald-400/60 font-bold uppercase mt-1">Configuración Estable</p>
              </>
            ) : (
              <>
                <AlertCircle className="h-10 w-10 text-white/10 mb-3" />
                <p className="text-sm font-black text-white/40 uppercase tracking-tight">Estructura Incompleta</p>
                <p className="text-[10px] text-white/20 font-bold uppercase mt-1">Sigue intentando</p>
              </>
            )}
            <button 
              onClick={() => {
                setAtoms([
                  { id: '1', symbol: 'H', valanceElectrons: 1, electrons: [1, 0, 0, 0, 0, 0, 0, 0] },
                  { id: '2', symbol: 'O', valanceElectrons: 6, electrons: [1, 1, 1, 1, 1, 1, 0, 0] },
                  { id: '3', symbol: 'H', valanceElectrons: 1, electrons: [1, 0, 0, 0, 0, 0, 0, 0] },
                ]);
              }}
              className="mt-6 flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-white uppercase tracking-widest transition-all"
            >
              <RotateCcw className="h-3 w-3" /> Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-emerald-400 mt-0.5" />
          <p className="text-[11px] text-white/60 leading-relaxed">
            <span className="font-bold text-white">Concepto:</span> La estructura de Lewis representa los electrones de valencia como puntos. Los átomos tienden a ganar, perder o compartir electrones para completar 8 en su capa externa (Regla del Octeto).
          </p>
        </div>
      </div>
    </div>
  );
};

export default LewisStructureArtifact;
