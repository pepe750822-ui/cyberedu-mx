import React, { useState, useEffect, useMemo } from "react";
import { Calculator, RotateCcw, Info, Hash } from "lucide-react";
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
  // --- Safety Guard ---
  if (!calculator || typeof calculator !== 'object') {
    return (
      <div className="my-4 p-4 rounded-2xl border border-white/10 bg-slate-900/50 text-slate-400 text-sm text-center">
        <Calculator className="h-5 w-5 mx-auto mb-2 text-primary animate-pulse" />
        Cargando calculadora...
      </div>
    );
  }

  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  // Initialize values when calculator changes
  useEffect(() => {
    const fresh: Record<string, string> = {};
    if (calculator.variables) {
      calculator.variables.forEach(v => { fresh[v.name] = ""; });
    }
    setValues(fresh);
    setResult(null);
  }, [calculator]);

  // Dynamic Calculation Logic
  const calculateResult = (currentValues: Record<string, string>) => {
    const formula = (calculator.formula || "").toLowerCase();
    const vars = calculator.variables || [];
    
    // Check if all variables have numbers
    const params: Record<string, number> = {};
    for (const v of vars) {
      const val = parseFloat(currentValues[v.name]);
      if (isNaN(val)) return null;
      // Normalizar nombres a minúsculas para coincidir con la fórmula lowercased
      params[v.name.toLowerCase()] = val;
    }

    try {
      // Clean formula: remove "Result =" or "ΣF =" if present
      let cleanFormula = formula;
      if (formula.includes("=")) {
        cleanFormula = formula.split("=")[1].trim();
      }
      
      // Normalizar operadores comunes que el AI suele usar
      cleanFormula = cleanFormula
        .replace(/÷/g, "/")
        .replace(/×/g, "*");

      // Normalizar superíndices Unicode (², ³, ⁴, etc.) → **N
      cleanFormula = cleanFormula
        .replace(/⁰/g, "**0")
        .replace(/¹/g, "**1")
        .replace(/²/g, "**2")
        .replace(/³/g, "**3")
        .replace(/⁴/g, "**4")
        .replace(/⁵/g, "**5")
        .replace(/⁶/g, "**6")
        .replace(/⁷/g, "**7")
        .replace(/⁸/g, "**8")
        .replace(/⁹/g, "**9");

      // Replace 'x' only when it's used as multiplication operator (not a variable)
      if (params['x'] === undefined) {
        cleanFormula = cleanFormula.replace(/x/g, "*");
      }

      // --- PRIMARY: Try safe JS evaluation with variable substitution ---
      // This handles repeated variables like "l * l * l" correctly
      // Sort variable names by length (longest first) to avoid partial replacements
      const sortedVarNames = Object.keys(params).sort((a, b) => b.length - a.length);
      let evalFormula = cleanFormula;
      for (const varName of sortedVarNames) {
        // Replace variable names with their values (word boundaries)
        const regex = new RegExp(`\\b${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
        evalFormula = evalFormula.replace(regex, params[varName].toString());
      }

      // Handle common math functions
      evalFormula = evalFormula
        .replace(/π|pi/gi, Math.PI.toString())
        .replace(/\^/g, "**")
        .replace(/√\(([^)]+)\)/g, "Math.sqrt($1)")
        .replace(/sqrt\(([^)]+)\)/g, "Math.sqrt($1)")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(");

      // Safety: only allow numbers, basic math operators, Math functions and parentheses
      if (/^[0-9.+\-*/().\s,Math.sqrtsincotan**]+$/.test(evalFormula)) {
        // Avoid division by zero
        if (evalFormula.includes("/0") && !evalFormula.includes("/0.")) return null;
        const evalResult = Function(`"use strict"; return (${evalFormula})`)();
        if (typeof evalResult === 'number' && isFinite(evalResult)) {
          return evalResult;
        }
      }

      // --- FALLBACK HEURISTICS (only if JS eval didn't work) ---

      // Auto-sum heuristic: if formula has "+" or "Σ"
      if (cleanFormula.includes("+") || formula.includes("Σ")) {
        return vars.reduce((acc, v) => acc + (params[v.name.toLowerCase()] || 0), 0);
      }

      // Newton's Second Law: F = m * a
      if (cleanFormula.includes("m * a") || cleanFormula.includes("m*a") || (vars.some(v => v.name === 'm') && vars.some(v => v.name === 'a'))) {
        return (params.m || params.masa || 0) * (params.a || params.aceleracion || 0);
      }
      
      // Linear Function: y = mx + b
      if (cleanFormula.includes("mx + b") || cleanFormula.includes("m * x + b")) {
        return (params.m || 0) * (params.x || 0) + (params.b || 0);
      }

      // Area of Triangle: (b * h) / 2
      if (cleanFormula.includes("/ 2") && (cleanFormula.includes("base") || cleanFormula.includes("altura"))) {
        const b = params.base || params.b || 0;
        const h = params.altura || params.h || 0;
        return (b * h) / 2;
      }

      // Multi-variable multiplication (only when each var appears once)
      if (cleanFormula.includes("*") && !cleanFormula.includes("/") && !cleanFormula.includes("+")) {
        return vars.reduce((acc, v) => acc * (params[v.name.toLowerCase()] || 0), 1);
      }

    } catch (e) {
      console.warn("Calculation failed:", e);
    }
    return null;
  };

  const handleChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    const res = calculateResult(newValues);
    setResult(res !== null ? Number(res.toFixed(4)) : null);
  };

  const reset = () => {
    const fresh: Record<string, string> = {};
    if (calculator.variables) {
      calculator.variables.forEach(v => { fresh[v.name] = ""; });
    }
    setValues(fresh);
    setResult(null);
  };

  return (
    <div className="my-6 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-primary/20 p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30 text-primary">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{calculator.title || "Calculadora"}</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-1 opacity-70">Calculadora Especializada</p>
          </div>
        </div>
        <button onClick={reset} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Formula Display */}
        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2 italic">Expresión Matemática</p>
          <code className="text-xl font-mono text-primary font-bold">{calculator.formula}</code>
        </div>

        {/* Dynamic Inputs */}
        <div className="grid grid-cols-1 gap-4">
          {calculator.variables?.map((v) => (
            <div key={v.name} className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{v.label}</label>
              <div className="relative group">
                <input
                  type="number"
                  value={values[v.name] || ""}
                  onChange={(e) => handleChange(v.name, e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all focus:ring-2 ring-primary/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase bg-slate-900 px-2 py-1 rounded-md border border-white/5">
                  {v.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        <div className={cn(
          "relative p-6 rounded-2xl border transition-all duration-500 text-center overflow-hidden",
          result !== null
            ? "bg-primary/20 border-primary/40 scale-100 opacity-100 shadow-lg shadow-primary/10"
            : "bg-slate-800/10 border-white/5 scale-[0.98] opacity-50"
        )}>
          {result !== null && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          )}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            {result !== null ? "Resultado Final" : "Esperando valores..."}
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-black text-white tracking-tighter">
              {result !== null ? result.toLocaleString() : "—"}
            </span>
            <span className="text-sm font-bold text-primary uppercase">
              {result !== null ? calculator.result_unit : ""}
            </span>
          </div>
          
          {result !== null && calculator.explanation && (
            <div className="mt-4 pt-4 border-t border-primary/20 flex items-start gap-2 text-left">
              <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 italic leading-relaxed">
                {calculator.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex justify-center items-center gap-4">
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">ECOEMS 2026 • Asistente de Cálculo Preciso</p>
      </div>
    </div>
  );
};

export default CalculatorArtifact;
