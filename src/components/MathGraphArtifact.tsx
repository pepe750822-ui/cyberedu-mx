import React, { useState, useEffect, useMemo } from "react";
import { GitCommit, TrendingUp, SlidersHorizontal, Info, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MathGraphProps {
  graph: {
    title: string;
    type: "lineal" | "cuadratica";
    default_values: Record<string, number>;
    description: string;
  };
}

export const MathGraphArtifact: React.FC<MathGraphProps> = ({ graph }) => {
  if (!graph || !graph.type) return null;

  const [values, setValues] = useState<Record<string, number>>(graph.default_values || {});

  useEffect(() => {
    setValues(graph.default_values || {});
  }, [graph]);

  const handleSliderChange = (key: string, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setValues(graph.default_values || {});
  };

  const getConfig = () => {
    if (graph.type === "lineal") {
      return {
        formula: `y = ${values.m}x ${values.b >= 0 ? '+' : '-'} ${Math.abs(values.b)}`,
        sliders: [
          { key: "m", label: "Pendiente (m)", min: -10, max: 10, step: 0.5 },
          { key: "b", label: "Intersección Y (b)", min: -10, max: 10, step: 1 }
        ],
        calculateY: (x: number) => (values.m || 0) * x + (values.b || 0)
      };
    } else if (graph.type === "cuadratica") {
      const a = values.a || 0;
      const b = values.b || 0;
      const c = values.c || 0;
      return {
        formula: `y = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`,
        sliders: [
          { key: "a", label: "Coeficiente a", min: -5, max: 5, step: 0.5 },
          { key: "b", label: "Coeficiente b", min: -10, max: 10, step: 1 },
          { key: "c", label: "Intersección Y (c)", min: -10, max: 10, step: 1 }
        ],
        calculateY: (x: number) => a * Math.pow(x, 2) + b * x + c
      };
    }
    return null;
  };

  const config = getConfig();

  // SVG dimensions and scaling
  const width = 300;
  const height = 250;
  const scale = 12; // pixels per unit
  const xOffset = width / 2;
  const yOffset = height / 2;

  const pathData = useMemo(() => {
    if (!config) return "";
    let d = "";
    for (let px = 0; px <= width; px += 2) {
      // Convert pixel X to logical X
      const logicalX = (px - xOffset) / scale;
      // Calculate logical Y
      const logicalY = config.calculateY(logicalX);
      // Convert logical Y to pixel Y (inverted because SVG Y goes down)
      const py = yOffset - (logicalY * scale);
      
      if (px === 0) {
        d += `M ${px} ${py} `;
      } else {
        d += `L ${px} ${py} `;
      }
    }
    return d;
  }, [values, config]);

  if (!config) return null;

  return (
    <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-sm mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-rose-500/30 bg-rose-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center relative shadow-inner">
            <TrendingUp className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight leading-none text-white">{graph.title}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80 text-rose-400">
              Graficador Algebraico
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
        
        {/* Formula Display */}
        <div className="bg-black/30 p-3 rounded-2xl border border-white/10 text-center">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Ecuación Actual</p>
            <p className="text-xl font-mono font-bold text-white">{config.formula}</p>
        </div>

        {/* Interactive Canvas */}
        <div className="relative w-full rounded-2xl border border-white/10 bg-slate-800 overflow-hidden shadow-inner flex justify-center" style={{ height }}>
          <svg width={width} height={height} className="absolute inset-0 mx-auto">
            {/* Grid lines */}
            {Array.from({ length: 21 }).map((_, i) => {
              const pos = (i - 10) * scale + (i === 10 ? xOffset : (i < 10 ? xOffset : xOffset)); // offset logic
              const exactX = xOffset + (i - 10) * scale;
              const exactY = yOffset + (i - 10) * scale;
              return (
                <React.Fragment key={i}>
                  <line x1={exactX} y1="0" x2={exactX} y2={height} stroke="rgba(255,255,255,0.05)" strokeWidth={exactX === xOffset ? 2 : 1} />
                  <line x1="0" y1={exactY} x2={width} y2={exactY} stroke="rgba(255,255,255,0.05)" strokeWidth={exactY === yOffset ? 2 : 1} />
                </React.Fragment>
              );
            })}
            {/* Axes */}
            <line x1={xOffset} y1="0" x2={xOffset} y2={height} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
            <line x1="0" y1={yOffset} x2={width} y2={yOffset} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
            
            {/* The Math Graph Path */}
            <path d={pathData} fill="none" stroke="#f43f5e" strokeWidth={3} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          </svg>

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 opacity-60">
             <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e]" />
             <span className="text-[9px] font-black text-white uppercase font-mono tracking-widest">Plano Cartesiano</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          {config.sliders.map(slider => (
            <div key={slider.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3" /> {slider.label}
                </label>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                  {values[slider.key] !== undefined ? values[slider.key] : slider.min}
                </span>
              </div>
              <input 
                type="range" 
                min={slider.min} 
                max={slider.max} 
                step={slider.step}
                value={values[slider.key] !== undefined ? values[slider.key] : slider.min}
                onChange={(e) => handleSliderChange(slider.key, parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg appearance-none cursor-pointer transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
           <div className="flex items-center gap-2 mb-2">
             <Info className="h-3.5 w-3.5 text-rose-500" />
             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Interpretación Gráfica</p>
           </div>
           <p className="text-xs text-slate-300 italic leading-relaxed">
             {graph.description}
           </p>
        </div>
      </div>

      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
           <GitCommit className="h-3 w-3" /> ÁLGEBRA Y GEOMETRÍA ECOEMS
        </p>
      </div>
    </div>
  );
};

export default MathGraphArtifact;
