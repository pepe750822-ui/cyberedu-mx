import React, { useState, useMemo } from 'react';
import { Zap, Power, RotateCcw, Lightbulb, Battery, Cpu, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CircuitLabProps {
  voltage?: number;
  resistance?: number;
}

const CircuitLabArtifact: React.FC<CircuitLabProps> = ({ voltage: initialVoltage, resistance: initialResistance }) => {
  const [voltage, setVoltage] = useState(initialVoltage ?? 9);
  const [resistance, setResistance] = useState(initialResistance ?? 10);
  const [isOpen, setIsOpen] = useState(true);

  const current = useMemo(() => {
    return isOpen ? 0 : voltage / (resistance || 0.1);
  }, [voltage, resistance, isOpen]);


  // Brightness factor for the bulb
  const brightness = useMemo(() => {
    if (isOpen) return 0;
    return Math.min(current * 10, 100);
  }, [current, isOpen]);

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <Zap className="h-5 w-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Laboratorio de Circuitos DC</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Simulación Interactiva de la Ley de Ohm</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Schematic Area */}
        <div className="relative bg-slate-900/50 rounded-2xl border border-white/5 p-8 flex items-center justify-center min-h-[250px]">
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-[300px]">
            {/* Wires */}
            <path d="M 100 150 L 100 50 L 300 50 L 300 150" fill="none" stroke="#334155" strokeWidth="4" />
            <path d="M 100 150 L 100 250 L 300 250 L 300 150" fill="none" stroke="#334155" strokeWidth="4" />
            
            {/* Electrons Animation */}
            {!isOpen && current > 0 && (
              <circle r="3" fill="#facc15">
                <animateMotion 
                  dur={`${Math.max(0.5, 2 / current)}s`} 
                  repeatCount="indefinite" 
                  path="M 100 150 L 100 50 L 300 50 L 300 150 L 300 250 L 100 250 Z" 
                />
              </circle>
            )}

            {/* Battery */}
            <g transform="translate(80, 130)">
              <rect width="40" height="40" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <rect x="15" y="-5" width="10" height="5" fill="#ef4444" rx="1" />
              <rect x="15" y="40" width="10" height="5" fill="#3b82f6" rx="1" />
              <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">V</text>
            </g>

            {/* Resistor */}
            <g transform="translate(180, 35)">
              <rect width="40" height="30" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <path d="M 5 15 L 10 5 L 20 25 L 30 5 L 35 15" fill="none" stroke="#94a3b8" strokeWidth="2" />
              <text x="20" y="45" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="black">Ω</text>
            </g>

            {/* Switch */}
            <g transform="translate(180, 235)" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <circle cx="0" cy="15" r="5" fill="#334155" />
              <circle cx="40" cy="15" r="5" fill="#334155" />
              <line
                x1="0" y1="15" x2="40" y2={isOpen ? -10 : 15}
                stroke={isOpen ? "#ef4444" : "#10b981"} strokeWidth="4" strokeLinecap="round"
              />
            </g>

            {/* Lightbulb */}
            <g transform="translate(280, 130)">
              <motion.circle 
                cx="20" cy="15" r="25" 
                fill={isOpen ? "#1e293b" : `rgba(250, 204, 21, ${brightness / 100})`}
                stroke={isOpen ? "#475569" : "#facc15"} strokeWidth="2"
              />
              <path d="M 15 35 L 25 35 M 10 40 L 30 40" stroke="#64748b" strokeWidth="3" />
              <AnimatePresence>
                {!isOpen && (
                  <motion.g 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                      <line 
                        key={deg} x1="20" y1="15" x2="20" y2="-10" 
                        transform={`rotate(${deg}, 20, 15)`} 
                        stroke="#facc15" strokeWidth="2" strokeLinecap="round" 
                      />
                    ))}
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          </svg>
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${isOpen ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
              {isOpen ? 'Circuito Abierto' : 'Circuito Cerrado'}
            </div>
          </div>
        </div>

        {/* Controls and Stats */}
        <div className="space-y-6">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <Battery className="h-3 w-3" /> Voltaje (V)
                </label>
                <span className="text-sm font-black text-white">{voltage}V</span>
              </div>
              <input 
                type="range" min="1" max="24" step="1" value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="h-3 w-3" /> Resistencia (R)
                </label>
                <span className="text-sm font-black text-white">{resistance} Ω</span>
              </div>
              <input 
                type="range" min="1" max="100" step="1" value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl text-center">
              <p className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">Corriente (I)</p>
              <p className="text-2xl font-black text-emerald-400">{current.toFixed(2)} A</p>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-2xl text-center">
              <p className="text-[9px] font-black text-yellow-500/50 uppercase tracking-widest mb-1">Potencia (P)</p>
              <p className="text-2xl font-black text-yellow-400">{(voltage * current).toFixed(1)} W</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                isOpen ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              <Power className="h-4 w-4" /> {isOpen ? 'Cerrar Interruptor' : 'Abrir Interruptor'}
            </button>
            <button 
              onClick={() => { setVoltage(9); setResistance(10); setIsOpen(true); }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5">
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-400 mt-0.5" />
          <p className="text-[11px] text-white/60 leading-relaxed">
            <span className="font-bold text-white">Ley de Ohm:</span> La intensidad de la corriente (I) es directamente proporcional al voltaje (V) e inversamente proporcional a la resistencia (R). 
            <span className="text-blue-400 font-mono ml-2">I = V / R</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CircuitLabArtifact;
