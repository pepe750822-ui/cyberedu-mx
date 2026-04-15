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

// All supported operations for the geometry calculator
const OPERATIONS = [
  { id: "area_triangulo",    label: "Área del Triángulo",     formula: "A = (base × altura) / 2",    inputs: [{ name: "base", label: "Base", unit: "cm" }, { name: "altura", label: "Altura", unit: "cm" }], calc: (v: number[]) => (v[0] * v[1]) / 2, unit: "cm²" },
  { id: "area_rectangulo",   label: "Área del Rectángulo",    formula: "A = largo × ancho",           inputs: [{ name: "largo", label: "Largo", unit: "cm" }, { name: "ancho", label: "Ancho", unit: "cm" }], calc: (v: number[]) => v[0] * v[1], unit: "cm²" },
  { id: "area_circulo",      label: "Área del Círculo",       formula: "A = π × r²",                  inputs: [{ name: "radio", label: "Radio", unit: "cm" }], calc: (v: number[]) => Math.PI * Math.pow(v[0], 2), unit: "cm²" },
  { id: "perimetro_rect",    label: "Perímetro del Rectángulo", formula: "P = 2(largo + ancho)",      inputs: [{ name: "largo", label: "Largo", unit: "cm" }, { name: "ancho", label: "Ancho", unit: "cm" }], calc: (v: number[]) => 2 * (v[0] + v[1]), unit: "cm" },
  { id: "perimetro_circ",    label: "Circunferencia",         formula: "C = 2 × π × r",               inputs: [{ name: "radio", label: "Radio", unit: "cm" }], calc: (v: number[]) => 2 * Math.PI * v[0], unit: "cm" },
  { id: "volumen_cubo",      label: "Volumen del Cubo",       formula: "V = lado³",                   inputs: [{ name: "lado", label: "Lado", unit: "cm" }], calc: (v: number[]) => Math.pow(v[0], 3), unit: "cm³" },
  { id: "volumen_rect",      label: "Volumen Rectangular",    formula: "V = largo × ancho × alto",    inputs: [{ name: "largo", label: "Largo", unit: "cm" }, { name: "ancho", label: "Ancho", unit: "cm" }, { name: "alto", label: "Alto", unit: "cm" }], calc: (v: number[]) => v[0] * v[1] * v[2], unit: "cm³" },
  { id: "volumen_cilindro",  label: "Volumen del Cilindro",   formula: "V = π × r² × h",              inputs: [{ name: "radio", label: "Radio", unit: "cm" }, { name: "altura", label: "Altura", unit: "cm" }], calc: (v: number[]) => Math.PI * Math.pow(v[0], 2) * v[1], unit: "cm³" },
];

// Try to auto-select the best operation based on formula from AI
const guessOperation = (formula: string): string => {
  const f = formula.toLowerCase();
  if (f.includes("/ 2") || f.includes("triángulo") || f.includes("triangulo")) return "area_triangulo";
  if (f.includes("π") && (f.includes("r²") || f.includes("r2")) && !f.includes("h")) return "area_circulo";
  if (f.includes("π") && (f.includes("h") || f.includes("altura"))) return "volumen_cilindro";
  if (f.includes("2π") || f.includes("2 × π") || f.includes("circunferencia")) return "perimetro_circ";
  if (f.includes("lado³") || f.includes("lado^3") || f.includes("cubo")) return "volumen_cubo";
  if ((f.includes("largo") || f.includes("ancho")) && f.includes("alto")) return "volumen_rect";
  if (f.includes("2(") || f.includes("perímetro") || f.includes("perimetro")) return "perimetro_rect";
  if ((f.includes("largo") || f.includes("ancho")) && !f.includes("alto")) return "area_rectangulo";
  return "area_triangulo"; // default
};

export const CalculatorArtifact: React.FC<CalculatorProps> = ({ calculator }) => {
  // --- Safety Guard: prevent crash if data is malformed/incomplete ---
  if (!calculator || typeof calculator !== 'object') {
    return (
      <div className="my-4 p-4 rounded-2xl border border-white/10 bg-slate-900/50 text-slate-400 text-sm text-center">
        <Calculator className="h-5 w-5 mx-auto mb-2 text-primary animate-pulse" />
        Cargando calculadora...
      </div>
    );
  }

  const safeCalc = {
    title: calculator.title || "Calculadora de Geometría",
    formula: calculator.formula || "",
    variables: Array.isArray(calculator.variables) ? calculator.variables : [],
    result_unit: calculator.result_unit || "",
    explanation: calculator.explanation || "",
  };

  const defaultOpId = guessOperation(safeCalc.formula);
  const [selectedOpId, setSelectedOpId] = useState(defaultOpId);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  const selectedOp = OPERATIONS.find(op => op.id === selectedOpId) || OPERATIONS[0];

  // Reset inputs when operation changes
  useEffect(() => {
    const fresh: Record<string, string> = {};
    selectedOp.inputs.forEach(i => { fresh[i.name] = ""; });
    setValues(fresh);
    setResult(null);
  }, [selectedOpId]);

  const handleChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    const nums = selectedOp.inputs.map(i => parseFloat(newValues[i.name]));
    if (nums.some(n => isNaN(n) || n < 0)) {
      setResult(null);
    } else {
      setResult(Number(selectedOp.calc(nums).toFixed(4)));
    }
  };

  const reset = () => {
    const fresh: Record<string, string> = {};
    selectedOp.inputs.forEach(i => { fresh[i.name] = ""; });
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
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{calculator.title || "Calculadora de Geometría"}</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none mt-1 opacity-70">Calculadora Interactiva</p>
          </div>
        </div>
        <button onClick={reset} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all" title="Reiniciar">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Operation Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Cálculo</label>
          <div className="grid grid-cols-2 gap-2">
            {OPERATIONS.map(op => (
              <button
                key={op.id}
                onClick={() => setSelectedOpId(op.id)}
                className={cn(
                  "text-left px-3 py-2 rounded-xl border text-[11px] font-bold transition-all",
                  selectedOpId === op.id
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-slate-800/40 border-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                )}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formula */}
        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 text-center">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Fórmula</p>
          <code className="text-lg font-mono text-primary font-bold">{selectedOp.formula}</code>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4">
          {selectedOp.inputs.map((v) => (
            <div key={v.name} className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{v.label}</label>
              <div className="relative group">
                <input
                  type="number"
                  value={values[v.name] || ""}
                  onChange={(e) => handleChange(v.name, e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all focus:ring-2 ring-primary/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-500 uppercase bg-slate-900 px-2 py-1 rounded-md border border-white/5 group-focus-within:border-primary/30">
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
            ? "bg-primary/20 border-primary/40 scale-100 opacity-100"
            : "bg-slate-800/10 border-white/5 scale-[0.98] opacity-50"
        )}>
          {result !== null && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          )}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            {result !== null ? "Resultado" : "Ingresa los valores"}
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-black text-white tracking-tighter">
              {result !== null ? result.toLocaleString() : "—"}
            </span>
            <span className="text-sm font-bold text-primary uppercase">
              {result !== null ? selectedOp.unit : ""}
            </span>
          </div>
          {result !== null && (
            <div className="mt-4 pt-4 border-t border-primary/20 flex items-start gap-2 text-left">
              <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 italic leading-relaxed">
                {selectedOp.formula} = {result.toLocaleString()} {selectedOp.unit}
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
