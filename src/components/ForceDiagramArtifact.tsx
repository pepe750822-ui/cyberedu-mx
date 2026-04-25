import React, { useState, useMemo } from 'react';
import { ArrowUp, RotateCcw, Info, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const ForceDiagramArtifact: React.FC = () => {
  const [angle, setAngle] = useState(30);
  const [mass, setMass] = useState(5);
  const [friction, setFriction] = useState(0.2);
  
  const g = 9.81;
  const weight = mass * g;
  
  // Calculate forces
  const rad = (angle * Math.PI) / 180;
  const wParallel = weight * Math.sin(rad);
  const wNormal = weight * Math.cos(rad);
  const fNormal = wNormal;
  const fFrictionMax = friction * fNormal;
  
  const isMoving = wParallel > fFrictionMax;
  const netForce = isMoving ? wParallel - fFrictionMax : 0;
  const acceleration = netForce / mass;

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <ArrowUp className="h-5 w-5 text-orange-400 rotate-45" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Modelador de Fuerzas</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Diagrama de Cuerpo Libre (Plano Inclinado)</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visualizer Area */}
        <div className="relative bg-slate-900/50 rounded-2xl border border-white/5 p-4 flex items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Ground */}
            <line x1="50" y1="250" x2="350" y2="250" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Incline */}
            <motion.path 
              d={`M 50 250 L 350 250 L 350 ${250 - 300 * Math.tan(rad)} Z`}
              fill="rgba(255,255,255,0.05)" stroke="#64748b" strokeWidth="2"
              animate={{ d: `M 50 250 L 350 250 L 350 ${250 - 300 * Math.tan(rad)} Z` }}
            />

            {/* Block and Forces Group */}
            <motion.g 
              animate={{ rotate: -angle }}
              style={{ originX: '200px', originY: '180px' }}
            >
              {/* Block */}
              <rect x="175" y="155" width="50" height="50" rx="4" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
              
              {/* Force Vectors */}
              {/* Normal Force */}
              <line x1="200" y1="180" x2="200" y2="100" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrowBlue)" />
              <text x="205" y="95" fill="#3b82f6" fontSize="10" fontWeight="bold">Normal (N)</text>
              
              {/* Friction */}
              <line x1="200" y1="180" x2="280" y2="180" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowRed)" />
              <text x="285" y="185" fill="#ef4444" fontSize="10" fontWeight="bold">Fricción (f)</text>
              
              {/* Weight Components (Internal) */}
              <line x1="200" y1="180" x2="200" y2="260" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
              
              {/* Weight (Real Gravity) - We need to un-rotate this to point straight down */}
              <g transform={`rotate(${angle}, 200, 180)`}>
                <line x1="200" y1="180" x2="200" y2="280" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowGreen)" />
                <text x="205" y="275" fill="#10b981" fontSize="10" fontWeight="bold">Peso (mg)</text>
              </g>
            </motion.g>

            {/* Markers */}
            <defs>
              <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
              </marker>
              <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
              </marker>
              <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orientation="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
              </marker>
            </defs>
          </svg>
          
          <div className="absolute bottom-4 left-4 bg-slate-950/80 px-3 py-2 rounded-xl border border-white/10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Ángulo (θ)</p>
            <p className="text-sm font-black text-orange-400">{angle}°</p>
          </div>
        </div>

        {/* Controls and Calculations */}
        <div className="space-y-6 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <label className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                Inclinación (θ): <span className="text-orange-400">{angle}°</span>
              </label>
              <input 
                type="range" min="0" max="60" step="1" value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <label className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                Masa (kg): <span className="text-indigo-400">{mass} kg</span>
              </label>
              <input 
                type="range" min="1" max="20" step="1" value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <label className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                Coef. Fricción (μ): <span className="text-red-400">{friction}</span>
              </label>
              <input 
                type="range" min="0" max="1" step="0.05" value={friction}
                onChange={(e) => setFriction(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-5 border border-white/5 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-white/40 uppercase tracking-wider">Fuerza Normal</span>
              <span className="text-blue-400">{fNormal.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-white/40 uppercase tracking-wider">F. Paralela al Plano</span>
              <span className="text-green-400">{wParallel.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-white/40 uppercase tracking-wider">F. Fricción Máxima</span>
              <span className="text-red-400">{fFrictionMax.toFixed(1)} N</span>
            </div>
            <div className="pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Resultado:</span>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isMoving ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {isMoving ? `Acelera: ${acceleration.toFixed(2)} m/s²` : 'En Reposo'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5 flex gap-3">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <Box className="h-4 w-4 text-orange-400" />
        </div>
        <p className="text-[11px] text-white/60 leading-relaxed">
          <span className="font-bold text-white">Análisis:</span> El objeto se moverá solo si el componente del peso paralelo al plano (<span className="text-green-400">mg·sinθ</span>) es mayor que la fuerza de fricción estática máxima (<span className="text-red-400">μ·mg·cosθ</span>).
        </p>
      </div>
    </div>
  );
};

export default ForceDiagramArtifact;
