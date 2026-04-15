import React, { useState, useEffect } from "react";
import { Activity, Rocket, Wind, Zap, RefreshCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhysicsProps {
  simulation: {
    title: string;
    type: "free_fall" | "mru" | "fma";
    default_values: Record<string, number>;
    description: string;
  };
}

export const PhysicsArtifact: React.FC<PhysicsProps> = ({ simulation }) => {
  if (!simulation || !simulation.type) return null;

  const [values, setValues] = useState<Record<string, number>>(simulation.default_values || {});
  const [results, setResults] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize values when simulation changes
  useEffect(() => {
    setValues(simulation.default_values || {});
  }, [simulation]);

  const handleSliderChange = (key: string, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  // Calculation Logic depending on simulation type
  useEffect(() => {
    const calc = () => {
      if (simulation.type === "free_fall") {
        // h = 1/2 g t^2 => t = sqrt(2h/g)
        // v = gt
        const h = values.height || 0;
        const g = values.gravity || 9.81;
        const t = Math.sqrt((2 * h) / g);
        const v = g * t;
        setResults({
          time: t.toFixed(2) + " s",
          velocity: v.toFixed(2) + " m/s",
        });
      } else if (simulation.type === "mru") {
        // v = d / t
        const d = values.distance || 0;
        const t = values.time || 1;
        const v = d / t;
        setResults({
          velocity: v.toFixed(2) + " m/s",
        });
      } else if (simulation.type === "fma") {
        // F = m * a
        const m = values.mass || 0;
        const a = values.acceleration || 0;
        const f = m * a;
        setResults({
          force: f.toFixed(2) + " N",
        });
      }
    };
    calc();
  }, [values, simulation.type]);

  const reset = () => {
    setValues(simulation.default_values || {});
    setIsPlaying(false);
  };

  const getConfig = () => {
    switch (simulation.type) {
      case "free_fall":
        return {
          icon: <Wind className="h-6 w-6 text-cyan-400" />,
          color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-500",
          sliders: [
            { key: "height", label: "Altura (h)", min: 0, max: 500, step: 1, unit: "m" },
            { key: "gravity", label: "Gravedad (g)", min: 1, max: 25, step: 0.1, unit: "m/s²" }
          ],
          resultsMap: [
            { label: "Tiempo de Caída", key: "time" },
            { label: "Velocidad Final", key: "velocity" }
          ]
        };
      case "mru":
        return {
          icon: <Rocket className="h-6 w-6 text-fuchsia-400" />,
          color: "bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-500",
          sliders: [
            { key: "distance", label: "Distancia (d)", min: 0, max: 1000, step: 10, unit: "m" },
            { key: "time", label: "Tiempo (t)", min: 0.1, max: 100, step: 0.1, unit: "s" }
          ],
          resultsMap: [
            { label: "Velocidad Constante", key: "velocity" }
          ]
        };
      case "fma":
        return {
          icon: <Zap className="h-6 w-6 text-amber-400" />,
          color: "bg-amber-500/20 border-amber-500/30 text-amber-500",
          sliders: [
            { key: "mass", label: "Masa (m)", min: 1, max: 1000, step: 1, unit: "kg" },
            { key: "acceleration", label: "Aceleración (a)", min: 1, max: 50, step: 0.5, unit: "m/s²" }
          ],
          resultsMap: [
            { label: "Fuerza Resultante (F)", key: "force" }
          ]
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config) return null;

  return (
    <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
      {/* Header */}
      <div className={cn("p-4 border-b border-white/10 flex items-center justify-between", config.color.split(" text-")[0])}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center relative shadow-inner">
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight leading-none text-white">{simulation.title}</h3>
            <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80", config.color.match(/text-([a-z]+-500)/)?.[0])}>
              Simulador Interactivo
            </p>
          </div>
        </div>
        <button 
          onClick={reset}
          className="p-2.5 rounded-xl bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/30 transition-all ml-2 text-white"
          title="Reiniciar Valores"
        >
          <RefreshCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        
        {/* Sliders */}
        <div className="space-y-4 bg-black/20 p-4 rounded-2xl border border-white/5">
          {config.sliders.map(slider => (
            <div key={slider.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{slider.label}</label>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                  {values[slider.key]} {slider.unit}
                </span>
              </div>
              <input 
                type="range" 
                min={slider.min} 
                max={slider.max} 
                step={slider.step}
                value={values[slider.key] || slider.min}
                onChange={(e) => handleSliderChange(slider.key, parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Results Board */}
        <div className="grid grid-cols-1 gap-2">
           {config.resultsMap.map(res => (
             <div key={res.key} className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-[11px] text-primary font-black uppercase tracking-widest">{res.label}</span>
                <span className="text-lg font-black text-white">{results[res.key]}</span>
             </div>
           ))}
        </div>

        {/* Description */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
           <div className="flex items-center gap-2 mb-2">
             <Info className="h-3.5 w-3.5 text-slate-400" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concepto Físico</p>
           </div>
           <p className="text-xs text-slate-300 italic leading-relaxed">
             {simulation.description}
           </p>
        </div>
      </div>

      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
           <Activity className="h-3 w-3" /> FÍSICA CINEMÁTICA ECOEMS
        </p>
      </div>
    </div>
  );
};

export default PhysicsArtifact;
