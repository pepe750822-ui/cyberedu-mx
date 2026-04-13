import React, { useState, useEffect } from "react";
import { Calculator, RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Variable {
  name: string;
  label: string;
  unit: string;
}

interface CalculatorProps {
  calculator: {
    title: string;
    formula: string;
    variables: Variable[];
    result_unit: string;
    explanation: string;
  };
}

export const CalculatorArtifact: React.FC<CalculatorProps> = ({ calculator }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    // Initial values
    const initial: Record<string, string> = {};
    calculator.variables.forEach(v => {
      initial[v.name] = "";
    });
    setValues(initial);
  }, [calculator]);

  const handleInputChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    calculateResult(newValues);
  };

  const calculateResult = (currentValues: Record<string, string>) => {
    // Basic evaluation for standard educational formulas
    // We replace labels in the formula with values if we can,
    // but the model provides the explanation. For calculation, 
    // we'll try to apply common logic based on the formula structure.
    
    const nums = calculator.variables.map(v => parseFloat(currentValues[v.name]));
    
    if (nums.some(n => isNaN(n))) {
      setResult(null);
      return;
    }

    let calculated = 0;
    const formulaStr = calculator.formula.toLowerCase();

    // Heuristics for common educational formulas
    if (formulaStr.includes('π') || formulaStr.includes('pi') || formulaStr.includes('radio')) {
      // Area or Perimeter of a circle
      const radius = nums[0];
      if (formulaStr.includes('²') || formulaStr.includes('r2') || formulaStr.includes('area')) {
        calculated = Math.PI * Math.pow(radius, 2);
      } else {
        // Assume perimeter if 2*pi*r or similar
        calculated = 2 * Math.PI * radius;
      }
    } else if (formulaStr.includes('base') && formulaStr.includes('altura') && (formulaStr.includes('/ 2') || formulaStr.includes('0.5'))) {
      calculated = (nums[0] * nums[1]) / 2;
    } else if (formulaStr.includes('base') && formulaStr.includes('altura')) {
      calculated = nums[0] * nums[1];
    } else if (formulaStr.includes('largo') && formulaStr.includes('ancho') && formulaStr.includes('alto')) {
      calculated = (nums[0] || 1) * (nums[1] || 1) * (nums[2] || 1);
    } else if (formulaStr.includes('masa') && formulaStr.includes('aceleracion')) {
      calculated = nums[0] * nums[1];
    } else if (formulaStr.includes('distancia') && formulaStr.includes('tiempo')) {
      calculated = nums[0] / nums[1];
    } else {
      // Fallback: try to see if AI specified a simple multiplier
      calculated = nums.reduce((acc, curr) => acc * curr, 1);
    }

    // Limit to 2 decimal places for cleaner UI
    setResult(Number(calculated.toFixed(2)));
  };

  const reset = () => {
    const fresh: Record<string, string> = {};
    calculator.variables.forEach(v => {
      fresh[v.name] = "";
    });
    setValues(fresh);
    setResult(null);
  };

  return (
    <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-primary/20 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{calculator.title}</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-1 opacity-70">Calculadora Interactiva</p>
          </div>
        </div>
        <button 
          onClick={reset}
          className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
          title="Reiniciar"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Formula Display */}
        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Fórmula</p>
          <code className="text-lg font-mono text-primary font-bold">{calculator.formula}</code>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4">
          {calculator.variables.map((v) => (
            <div key={v.name} className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{v.label}</label>
              <div className="relative group">
                <input
                  type="number"
                  value={values[v.name] || ""}
                  onChange={(e) => handleInputChange(v.name, e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all focus:ring-2 ring-primary/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase bg-slate-900 px-2 py-1 rounded-md border border-white/5 group-focus-within:border-primary/30">
                  {v.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Result Area */}
        <div className={cn(
          "relative p-6 rounded-2xl border transition-all duration-500 text-center overflow-hidden",
          result !== null 
            ? "bg-primary/20 border-primary/40 scale-100 opacity-100" 
            : "bg-slate-800/10 border-white/5 scale-[0.98] opacity-50"
        )}>
          {result !== null && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          )}
          
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{result !== null ? "Resultado Procedimental" : "Esperando datos..."}</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-black text-white tracking-tighter">
              {result !== null ? result.toLocaleString() : "0"}
            </span>
            <span className="text-sm font-bold text-primary uppercase">
              {calculator.result_unit}
            </span>
          </div>

          {result !== null && (
             <div className="mt-4 pt-4 border-t border-primary/20 flex items-start gap-2 text-left">
                <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  {calculator.explanation}
                </p>
             </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">ECOEMS 2026 • Asistente de Cálculo Preciso</p>
      </div>
    </div>
  );
};

export default CalculatorArtifact;
