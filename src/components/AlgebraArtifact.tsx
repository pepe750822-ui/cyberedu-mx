import React, { useState } from 'react';
import { Calculator, ChevronRight, RefreshCw, CheckCircle, BookOpen, Play } from 'lucide-react';

interface Step { label: string; expression: string; explanation: string; }

interface LinearResult { type: 'linear'; steps: Step[]; answer: string; valid: boolean; }
interface QuadResult   { type: 'quadratic'; steps: Step[]; roots: string[]; discriminant: number; valid: boolean; }
type SolveResult = LinearResult | QuadResult | null;

function fmt(n: number, decimals = 2): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(decimals);
}

function solveLinear(a: number, b: number, c: number): LinearResult {
  if (a === 0) return { type: 'linear', steps: [], answer: '', valid: false };

  const steps: Step[] = [];

  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  steps.push({
    label: '1. Ecuación original',
    expression: `${a}x ${bSign} = ${c}`,
    explanation: `Identificamos: coeficiente de x = ${a}, término independiente = ${b}, resultado = ${c}.`,
  });

  if (b !== 0) {
    const rhs = c - b;
    const op = b > 0 ? `restar ${b}` : `sumar ${Math.abs(b)}`;
    steps.push({
      label: `2. ${b > 0 ? 'Restar' : 'Sumar'} ${Math.abs(b)} a ambos lados`,
      expression: `${a}x = ${c} ${b > 0 ? '-' : '+'} ${Math.abs(b)} = ${rhs}`,
      explanation: `Pasamos ${b > 0 ? `+${b}` : b} al otro lado cambiando de signo para ${op} y dejar sola la x.`,
    });
  }

  const rhs = c - b;
  const answer = rhs / a;

  if (a !== 1) {
    steps.push({
      label: `3. Dividir ambos lados entre ${a}`,
      expression: `x = ${rhs} ÷ ${a} = ${fmt(answer)}`,
      explanation: `Para despejar completamente x, dividimos ambos lados entre el coeficiente ${a}.`,
    });
  }

  const check = a * answer + b;
  steps.push({
    label: '4. ✅ Verificación',
    expression: `${a}(${fmt(answer)}) ${bSign} = ${fmt(check)} ${Math.abs(check - c) < 0.001 ? '✓' : '✗'}`,
    explanation: `Sustituimos x = ${fmt(answer)} en la ecuación original para confirmar.`,
  });

  return { type: 'linear', steps, answer: fmt(answer), valid: true };
}

function solveQuadratic(a: number, b: number, c: number): QuadResult {
  if (a === 0) return { type: 'quadratic', steps: [], roots: [], discriminant: 0, valid: false };

  const disc = b * b - 4 * a * c;
  const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const cSign = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;

  const steps: Step[] = [
    {
      label: '1. Ecuación cuadrática',
      expression: `${a}x² ${bSign}x ${cSign} = 0`,
      explanation: `Forma estándar ax² + bx + c = 0. Aquí: a = ${a}, b = ${b}, c = ${c}.`,
    },
    {
      label: '2. Fórmula general ("chicharronera")',
      expression: 'x = (−b ± √(b² − 4ac)) / 2a',
      explanation: 'Esta fórmula siempre funciona para cualquier ecuación cuadrática.',
    },
    {
      label: '3. Calcular discriminante Δ = b² − 4ac',
      expression: `Δ = (${b})² − 4(${a})(${c}) = ${b * b} − ${4 * a * c} = ${disc}`,
      explanation: disc > 0 ? 'Δ > 0 → dos raíces reales distintas.' : disc === 0 ? 'Δ = 0 → una raíz doble (raíz repetida).' : 'Δ < 0 → no existen raíces reales.',
    },
  ];

  const roots: string[] = [];

  if (disc >= 0) {
    const sqrtDisc = Math.sqrt(disc);
    const x1 = (-b + sqrtDisc) / (2 * a);
    const x2 = (-b - sqrtDisc) / (2 * a);

    steps.push({
      label: '4. Calcular x₁ y x₂',
      expression: disc === 0
        ? `x = −(${b}) / 2(${a}) = ${fmt(-b)} / ${2 * a} = ${fmt(x1)}`
        : `x₁ = (−${b} + ${fmt(sqrtDisc)}) / ${2 * a} = ${fmt(x1)}\nx₂ = (−${b} − ${fmt(sqrtDisc)}) / ${2 * a} = ${fmt(x2)}`,
      explanation: disc === 0 ? 'Raíz doble.' : `Aplicamos + para x₁ y − para x₂.`,
    });

    roots.push(fmt(x1));
    if (disc > 0) roots.push(fmt(x2));

    const check1 = a * x1 * x1 + b * x1 + c;
    steps.push({
      label: '5. ✅ Verificación',
      expression: `${a}(${fmt(x1)})² ${bSign}(${fmt(x1)}) ${cSign} ≈ ${fmt(check1, 4)} ✓`,
      explanation: `Sustituimos x₁ = ${fmt(x1)} en la ecuación para confirmar que da 0.`,
    });
  } else {
    steps.push({
      label: '4. Sin solución real',
      expression: '√(número negativo) → no existe en ℝ',
      explanation: 'Cuando Δ < 0 la ecuación no tiene raíces reales (solo complejas).',
    });
  }

  return { type: 'quadratic', steps, roots, discriminant: disc, valid: true };
}

const EXAMPLES = [
  { label: '2x + 5 = 13',       type: 'linear',    a: 2,  b: 5,  c: 13 },
  { label: '3x − 7 = 8',        type: 'linear',    a: 3,  b: -7, c: 8  },
  { label: '−4x + 12 = 0',      type: 'linear',    a: -4, b: 12, c: 0  },
  { label: 'x² − 5x + 6 = 0',   type: 'quadratic', a: 1,  b: -5, c: 6  },
  { label: '2x² + 3x − 2 = 0',  type: 'quadratic', a: 2,  b: 3,  c: -2 },
  { label: 'x² − 4 = 0',        type: 'quadratic', a: 1,  b: 0,  c: -4 },
  { label: 'x² + 2x + 1 = 0',   type: 'quadratic', a: 1,  b: 2,  c: 1  },
];

export default function AlgebraArtifact({ equation = '' }: { equation?: string }) {
  const [mode, setMode] = useState<'linear' | 'quadratic'>('linear');
  const [a, setA] = useState('2');
  const [b, setB] = useState('5');
  const [c, setC] = useState('13');
  const [result, setResult] = useState<SolveResult>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const equationPreview = mode === 'linear'
    ? `${a || '?'}x ${(parseFloat(b) || 0) >= 0 ? '+' : ''} ${b || '?'} = ${c || '?'}`
    : `${a || '?'}x² ${(parseFloat(b) || 0) >= 0 ? '+' : ''} ${b || '?'}x ${(parseFloat(c) || 0) >= 0 ? '+' : ''} ${c || '?'} = 0`;

  const solve = () => {
    const na = parseFloat(a) || 0;
    const nb = parseFloat(b) || 0;
    const nc = parseFloat(c) || 0;
    if (mode === 'linear') setResult(solveLinear(na, nb, nc));
    else setResult(solveQuadratic(na, nb, nc));
    setActiveStep(0);
  };

  const loadExample = (ex: typeof EXAMPLES[0]) => {
    setMode(ex.type as 'linear' | 'quadratic');
    setA(String(ex.a));
    setB(String(ex.b));
    setC(String(ex.c));
    setResult(null);
    setActiveStep(null);
  };

  const reset = () => { setResult(null); setActiveStep(null); setA(''); setB(''); setC(''); };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <Calculator className="h-4 w-4 text-violet-400" />
        <span className="text-sm font-black uppercase tracking-widest text-white">Álgebra Paso a Paso</span>
        <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-slate-500">Estilo ECOEMS</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          {(['linear', 'quadratic'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setResult(null); setActiveStep(null); }}
              className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>
              {m === 'linear' ? 'Lineal  ax + b = c' : 'Cuadrática  ax² + bx + c = 0'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'a', val: a, set: setA },
            { label: 'b', val: b, set: setB },
            { label: 'c', val: c, set: setC },
          ].map(({ label, val, set }) => (
            <div key={label} className="flex items-center gap-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label} =</label>
              <input
                type="number"
                value={val}
                onChange={e => { set(e.target.value); setResult(null); }}
                className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm font-black text-white text-center outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          ))}
          <div className="ml-auto flex gap-2">
            <button onClick={reset} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-white/10">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button onClick={solve}
              disabled={!a}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 text-white font-black text-[11px] uppercase tracking-widest transition-all">
              <Play className="h-3 w-3" /> Resolver
            </button>
          </div>
        </div>

        {/* Equation preview */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ecuación</p>
          <p className="text-lg font-black text-violet-300 font-mono">{equationPreview}</p>
        </div>

        {/* Examples */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
            <BookOpen className="h-2.5 w-2.5" /> Ejemplos tipo ECOEMS
          </p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map(ex => (
              <button key={ex.label} onClick={() => loadExample(ex)}
                className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all font-mono">
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && !result.valid && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 font-bold">
            ⚠️ Coeficiente "a" no puede ser 0 para este tipo de ecuación.
          </div>
        )}

        {result?.valid && (
          <div className="space-y-3">
            {/* Answer banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Resultado</p>
                {result.type === 'linear' && (
                  <p className="text-base font-black text-white">x = {result.answer}</p>
                )}
                {result.type === 'quadratic' && result.roots.length > 0 && (
                  <p className="text-base font-black text-white">
                    {result.roots.length === 1 ? `x = ${result.roots[0]} (raíz doble)` : `x₁ = ${result.roots[0]},  x₂ = ${result.roots[1]}`}
                  </p>
                )}
                {result.type === 'quadratic' && result.roots.length === 0 && (
                  <p className="text-sm font-black text-slate-400">Sin raíces reales (Δ &lt; 0)</p>
                )}
              </div>
            </div>

            {/* Steps */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Desarrollo paso a paso</p>
              <div className="space-y-2">
                {result.steps.map((step, i) => (
                  <button
                    key={i}
                    className={`w-full text-left rounded-xl border transition-all ${activeStep === i ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/5 bg-white/3 hover:bg-white/5'}`}
                    onClick={() => setActiveStep(activeStep === i ? null : i)}
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${activeStep === i ? 'bg-violet-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                        {i + 1}
                      </span>
                      <span className="text-[11px] font-black text-slate-300 flex-1">{step.label}</span>
                      <span className="text-[10px] font-mono font-bold text-violet-300 text-right max-w-[160px] truncate">{step.expression.split('\n')[0]}</span>
                      <ChevronRight className={`h-3 w-3 text-slate-500 shrink-0 transition-transform ${activeStep === i ? 'rotate-90' : ''}`} />
                    </div>
                    {activeStep === i && (
                      <div className="px-4 pb-3 space-y-1.5">
                        <pre className="text-sm font-mono font-bold text-violet-200 bg-violet-500/5 rounded-lg px-3 py-2 whitespace-pre-wrap">
                          {step.expression}
                        </pre>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{step.explanation}</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
