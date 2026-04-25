import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { Play, Pause, RotateCcw, Activity, MoveRight, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

interface PhysicsGraphArtifactProps {
  // Props que envía la IA (con alias para compatibilidad)
  acceleration?: number;
  initialA?: number;
  velocity?: number;
  initialV?: number;
  position?: number;
  initialX?: number;
  type?: 'x-t' | 'v-t' | 'both';
  title?: string;
}

const PhysicsGraphArtifact: React.FC<PhysicsGraphArtifactProps> = (props) => {
  // Mapeo inteligente de props
  const startV = props.velocity ?? props.initialV ?? 0;
  const startA = props.acceleration ?? props.initialA ?? 1;
  const startX = props.position ?? props.initialX ?? 0;
  const showType = props.type ?? 'both';
  const title = props.title ?? "Laboratorio de Cinemática";

  const [v, setV] = useState(startV);
  const [a, setA] = useState(startA);
  const [tLimit] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Sincronizar estado si las props cambian
  useEffect(() => {
    setV(startV);
    setA(startA);
    setCurrentTime(0);
  }, [startV, startA]);

  const data = useMemo(() => {
    const points = [];
    for (let t = 0; t <= tLimit; t += 0.5) {
      const x = startX + v * t + 0.5 * a * Math.pow(t, 2);
      const vel = v + a * t;
      points.push({ 
        t, 
        x: Number.isNaN(x) ? 0 : parseFloat(x.toFixed(2)), 
        v: Number.isNaN(vel) ? 0 : parseFloat(vel.toFixed(2)) 
      });
    }
    return points;
  }, [v, a, tLimit, startX]);

  const currentPos = useMemo(() => {
    return startX + v * currentTime + 0.5 * a * Math.pow(currentTime, 2);
  }, [currentTime, v, a, startX]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= tLimit) {
            setIsPlaying(false);
            return tLimit;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tLimit]);

  const reset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4 font-sans w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/50">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Activity className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">{title}</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {showType === 'x-t' ? 'Gráfica Posición-Tiempo' : showType === 'v-t' ? 'Gráfica Velocidad-Tiempo' : 'Análisis Cinemático Completo'}
          </p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <label className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
              Velocidad Inicial: <span className="text-indigo-400">{v} m/s</span>
            </label>
            <input 
              type="range" min="-10" max="10" step="1" value={v}
              onChange={(e) => { setV(Number(e.target.value)); reset(); }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <label className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
              Aceleración: <span className="text-emerald-400">{a} m/s²</span>
            </label>
            <input 
              type="range" min="-5" max="5" step="0.5" value={a}
              onChange={(e) => { setA(Number(e.target.value)); reset(); }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="relative h-24 bg-slate-900 rounded-2xl border border-white/5 overflow-hidden flex items-end px-4 pb-2">
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-10 pointer-events-none">
              {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="h-full w-px bg-white" />)}
            </div>
            
            <motion.div 
              className="relative z-10 flex flex-col items-center"
              style={{ x: `${(currentPos * 5) % 80}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="h-8 w-12 bg-indigo-500 rounded-lg shadow-lg flex items-center justify-center">
                <MoveRight className="h-5 w-5 text-white" />
              </div>
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                isPlaying ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-indigo-500 text-white'
              }`}
            >
              {isPlaying ? <><Pause className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4" /> Simular</>}
            </button>
            <button onClick={reset} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white">
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {(showType === 'x-t' || showType === 'both') && (
            <div className="h-48 bg-white/[0.02] rounded-2xl border border-white/5 p-2">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 px-2">Posición vs Tiempo (x-t)</p>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', color: '#818cf8' }}
                  />
                  <ReferenceLine x={currentTime} stroke="#fbbf24" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="x" stroke="#818cf8" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {(showType === 'v-t' || showType === 'both') && (
            <div className="h-48 bg-white/[0.02] rounded-2xl border border-white/5 p-2">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2 px-2">Velocidad vs Tiempo (v-t)</p>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="t" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', color: '#10b981' }}
                  />
                  <ReferenceLine x={currentTime} stroke="#fbbf24" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-white/5 bg-white/5 flex justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/30 uppercase">Tiempo</span>
            <span className="text-xs font-black text-indigo-400">{currentTime.toFixed(1)} s</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/30 uppercase">Posición</span>
            <span className="text-xs font-black text-white">{currentPos.toFixed(1)} m</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="h-3 w-3 text-emerald-400" />
          <span className="text-xs font-black text-emerald-400">{(v + a * currentTime).toFixed(1)} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default PhysicsGraphArtifact;
