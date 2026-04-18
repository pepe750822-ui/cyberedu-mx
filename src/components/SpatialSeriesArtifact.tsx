import React, { useState, useMemo } from 'react';
import { Brain, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type Difficulty = 'easy' | 'medium' | 'hard';
type ExType = 'numeric' | 'spatial' | 'figure';
type ShapeKind = 'circle' | 'square' | 'triangle' | 'diamond' | 'pentagon';

interface NumericEx {
  id: string; type: 'numeric'; difficulty: Difficulty;
  question: string;
  series: (number | '?')[];
  options: number[];
  correctIndex: number;
  explanation: string;
}
interface SpatialEx {
  id: string; type: 'spatial'; difficulty: Difficulty;
  question: string;
  shapePath: string;
  optionTransforms: string[];
  correctIndex: number;
  explanation: string;
}
interface FigureEx {
  id: string; type: 'figure'; difficulty: Difficulty;
  question: string;
  pattern: (ShapeKind | '?')[];
  options: ShapeKind[];
  correctIndex: number;
  explanation: string;
}
type Exercise = NumericEx | SpatialEx | FigureEx;

// ── SVG primitives ─────────────────────────────────────────────────────────
const SHAPE_PATH: Record<ShapeKind, string> = {
  circle:   'M30,8 A22,22 0 1,1 29.99,8 Z',
  square:   'M8,8 L52,8 L52,52 L8,52 Z',
  triangle: 'M30,6 L54,54 L6,54 Z',
  diamond:  'M30,6 L54,30 L30,54 L6,30 Z',
  pentagon: 'M30,4 L56,22 L46,52 L14,52 L4,22 Z',
};
const SHAPE_COLOR: Record<ShapeKind, string> = {
  circle: '#60a5fa', square: '#34d399', triangle: '#f472b6',
  diamond: '#fb923c', pentagon: '#a78bfa',
};

const ShapeIcon: React.FC<{ kind: ShapeKind; size?: number }> = ({ kind, size = 38 }) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    <path d={SHAPE_PATH[kind]} fill={SHAPE_COLOR[kind]} fillOpacity="0.85" />
  </svg>
);

// Asymmetric shapes for spatial exercises
const ARROW_PATH = 'M5,22 L32,22 L32,12 L55,30 L32,48 L32,38 L5,38 Z';
const L_PATH     = 'M8,8 L38,8 L38,28 L28,28 L28,52 L8,52 Z';
const F_PATH     = 'M8,8 L52,8 L52,22 L22,22 L22,32 L46,32 L46,44 L22,44 L22,52 L8,52 Z';

const SpatialShape: React.FC<{
  path: string; transform?: string; fill?: string; size?: number;
}> = ({ path, transform, fill = '#60a5fa', size = 60 }) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    <path d={path} transform={transform} fill={fill} fillOpacity="0.85" />
  </svg>
);

// ── Exercise bank ──────────────────────────────────────────────────────────
const EXERCISES: Exercise[] = [
  // ── Numeric — easy ───────────────────────────────────────────────────────
  { id:'n1', type:'numeric', difficulty:'easy',
    question:'¿Qué número falta en la serie?',
    series:[2,4,6,8,'?'], options:[10,9,11,12], correctIndex:0,
    explanation:'La serie aumenta de 2 en 2 (sucesión aritmética). 8 + 2 = 10.' },
  { id:'n2', type:'numeric', difficulty:'easy',
    question:'¿Qué número falta en la serie?',
    series:[5,10,15,20,'?'], options:[25,20,30,22], correctIndex:0,
    explanation:'Son múltiplos de 5. 20 + 5 = 25.' },
  { id:'n3', type:'numeric', difficulty:'easy',
    question:'¿Qué número falta en la serie?',
    series:[1,3,5,7,'?'], options:[9,8,10,11], correctIndex:0,
    explanation:'Son los números impares consecutivos. 7 + 2 = 9.' },

  // ── Numeric — medium ─────────────────────────────────────────────────────
  { id:'n4', type:'numeric', difficulty:'medium',
    question:'¿Qué número falta en la serie?',
    series:[1,4,9,16,'?'], options:[25,20,24,36], correctIndex:0,
    explanation:'Son cuadrados perfectos: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25.' },
  { id:'n5', type:'numeric', difficulty:'medium',
    question:'¿Qué número falta en la serie?',
    series:[3,6,12,24,'?'], options:[48,36,42,60], correctIndex:0,
    explanation:'Progresión geométrica ×2. 24 × 2 = 48.' },
  { id:'n6', type:'numeric', difficulty:'medium',
    question:'Serie de Fibonacci — ¿qué número sigue?',
    series:[1,1,2,3,5,'?'], options:[8,7,9,6], correctIndex:0,
    explanation:'Cada número es la suma de los dos anteriores: 3 + 5 = 8.' },

  // ── Numeric — hard ───────────────────────────────────────────────────────
  { id:'n7', type:'numeric', difficulty:'hard',
    question:'Analiza las diferencias y encuentra el número faltante.',
    series:[2,3,5,8,12,'?'], options:[17,16,18,15], correctIndex:0,
    explanation:'Las diferencias son 1,2,3,4,5 (crecen +1). 12 + 5 = 17.' },
  { id:'n8', type:'numeric', difficulty:'hard',
    question:'¿Qué número falta? (Pista: factoriales)',
    series:[1,2,6,24,'?'], options:[120,48,96,100], correctIndex:0,
    explanation:'Son factoriales: 1!=1, 2!=2, 3!=6, 4!=24, 5!=120.' },
  { id:'n9', type:'numeric', difficulty:'hard',
    question:'¿Qué número falta en la serie?',
    series:[2,5,10,17,26,'?'], options:[37,33,35,39], correctIndex:0,
    explanation:'Las diferencias son 3,5,7,9,11 (impares crecientes). 26 + 11 = 37.' },

  // ── Spatial — easy ───────────────────────────────────────────────────────
  { id:'s1', type:'spatial', difficulty:'easy',
    question:'¿Cuál opción muestra la flecha rotada 90° en sentido horario (→ apunta hacia ↓)?',
    shapePath: ARROW_PATH,
    optionTransforms:['rotate(90,30,30)','rotate(180,30,30)','rotate(0,30,30)','rotate(270,30,30)'],
    correctIndex:0,
    explanation:'Rotar 90° en sentido horario: la flecha (→) queda apuntando hacia abajo (↓). Opción A es correcta.' },

  // ── Spatial — medium ─────────────────────────────────────────────────────
  { id:'s2', type:'spatial', difficulty:'medium',
    question:'¿Cuál opción es un reflejo horizontal (espejo) de la figura L?',
    shapePath: L_PATH,
    optionTransforms:['translate(60,0) scale(-1,1)','rotate(90,30,30)','rotate(180,30,30)','rotate(270,30,30)'],
    correctIndex:0,
    explanation:'El reflejo horizontal invierte la figura de izquierda a derecha, como un espejo. Las otras opciones son rotaciones.' },

  // ── Spatial — hard ───────────────────────────────────────────────────────
  { id:'s3', type:'spatial', difficulty:'hard',
    question:'¿Cuál opción NO puede obtenerse solo rotando la figura F? (Requiere voltearla)',
    shapePath: F_PATH,
    optionTransforms:['rotate(90,30,30)','rotate(180,30,30)','rotate(270,30,30)','translate(60,0) scale(-1,1)'],
    correctIndex:3,
    explanation:'A, B y C son rotaciones válidas de F. La opción D es un reflejo (espejo horizontal), que NUNCA se obtiene solo con rotaciones.' },

  // ── Figure — easy ────────────────────────────────────────────────────────
  { id:'f1', type:'figure', difficulty:'easy',
    question:'¿Qué figura completa el patrón?',
    pattern:['circle','square','circle','square','?'],
    options:['circle','square','triangle','diamond'], correctIndex:0,
    explanation:'El patrón alterna: círculo → cuadrado → círculo → cuadrado → círculo.' },
  { id:'f2', type:'figure', difficulty:'easy',
    question:'¿Qué figura completa el patrón?',
    pattern:['triangle','triangle','circle','triangle','triangle','?'],
    options:['square','triangle','circle','diamond'], correctIndex:2,
    explanation:'El patrón es: triángulo × 2, luego círculo. Se repite: triángulo, triángulo, círculo.' },

  // ── Figure — medium ──────────────────────────────────────────────────────
  { id:'f3', type:'figure', difficulty:'medium',
    question:'¿Qué figura completa el patrón?',
    pattern:['triangle','circle','square','triangle','circle','?'],
    options:['triangle','circle','square','diamond'], correctIndex:2,
    explanation:'El patrón se repite cada 3 figuras: triángulo → círculo → cuadrado. La siguiente es cuadrado.' },
  { id:'f4', type:'figure', difficulty:'medium',
    question:'¿Qué figura completa el patrón?',
    pattern:['circle','diamond','circle','diamond','circle','?'],
    options:['pentagon','circle','diamond','triangle'], correctIndex:2,
    explanation:'El patrón alterna: círculo → diamante. Después de círculo viene diamante.' },

  // ── Figure — hard ────────────────────────────────────────────────────────
  { id:'f5', type:'figure', difficulty:'hard',
    question:'¿Qué figura completa el patrón de 4 figuras cíclicas?',
    pattern:['diamond','circle','square','triangle','diamond','circle','square','?'],
    options:['triangle','diamond','circle','pentagon'], correctIndex:0,
    explanation:'El patrón se repite cada 4: diamante→círculo→cuadrado→triángulo. La posición 8 es triángulo.' },
  { id:'f6', type:'figure', difficulty:'hard',
    question:'¿Qué figura completa el patrón? (Observa tamaño y forma)',
    pattern:['circle','circle','square','circle','circle','square','circle','?'],
    options:['circle','triangle','square','diamond'], correctIndex:0,
    explanation:'El patrón es [círculo, círculo, cuadrado] repetido. Posición 8 = primer elemento del 3er ciclo = círculo.' },
];

// ── Labels & colors ────────────────────────────────────────────────────────
const DIFF_LABEL: Record<Difficulty, string> = { easy:'Fácil', medium:'Medio', hard:'Difícil' };
const DIFF_COLOR: Record<Difficulty, string> = { easy:'#22c55e', medium:'#f59e0b', hard:'#ef4444' };
const TYPE_LABEL: Record<ExType, string> = {
  numeric:'Sucesión Numérica', spatial:'Imaginación Espacial', figure:'Serie de Figuras',
};

// ── Option button helper ───────────────────────────────────────────────────
function optStyle(i: number, correct: number, selected: number | null, revealed: boolean) {
  if (!revealed) {
    const sel = selected === i;
    return {
      borderColor: sel ? '#7c3aed80' : 'rgba(255,255,255,0.08)',
      backgroundColor: sel ? '#7c3aed18' : 'transparent',
      color: 'rgba(255,255,255,0.85)',
      cursor: 'pointer' as const,
    };
  }
  if (i === correct) return { borderColor:'#22c55e80', backgroundColor:'#22c55e18', color:'#22c55e', cursor:'default' as const };
  if (selected === i) return { borderColor:'#ef444480', backgroundColor:'#ef444418', color:'#ef4444', cursor:'default' as const };
  return { borderColor:'rgba(255,255,255,0.06)', backgroundColor:'transparent', color:'rgba(255,255,255,0.25)', cursor:'default' as const };
}

// ── Sub-components ─────────────────────────────────────────────────────────
const NumericView: React.FC<{ ex: NumericEx }> = ({ ex }) => (
  <div className="flex items-center justify-center gap-1.5 py-4 flex-wrap">
    {ex.series.map((n, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl font-black text-lg border ${
          n === '?' ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 text-2xl'
                    : 'bg-white/5 border-white/10 text-white'
        }`}>{n}</div>
        {i < ex.series.length - 1 && <span className="text-white/20 text-xs">→</span>}
      </React.Fragment>
    ))}
  </div>
);

const SpatialView: React.FC<{
  ex: SpatialEx; selected: number | null; onSelect:(i:number)=>void; revealed:boolean;
}> = ({ ex, selected, onSelect, revealed }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Original:</span>
      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
        <SpatialShape path={ex.shapePath} size={56} />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {ex.optionTransforms.map((tr, i) => {
        const st = optStyle(i, ex.correctIndex, selected, revealed);
        const fill = revealed
          ? i === ex.correctIndex ? '#22c55e' : selected === i ? '#ef4444' : '#60a5fa55'
          : '#60a5fa';
        return (
          <button key={i} onClick={() => !revealed && onSelect(i)}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all"
            style={st}>
            <SpatialShape path={ex.shapePath} transform={tr} fill={fill} size={48} />
            <span className="text-[9px] font-black text-white/30 uppercase">{String.fromCharCode(65+i)}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const FigureView: React.FC<{
  ex: FigureEx; selected: number | null; onSelect:(i:number)=>void; revealed:boolean;
}> = ({ ex, selected, onSelect, revealed }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-center gap-1.5 flex-wrap py-2">
      {ex.pattern.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`flex items-center justify-center w-11 h-11 rounded-xl border ${
            s === '?' ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 text-2xl font-black'
                      : 'bg-white/5 border-white/10'
          }`}>
            {s === '?' ? '?' : <ShapeIcon kind={s} size={32} />}
          </div>
          {i < ex.pattern.length - 1 && <span className="text-white/20 text-xs">→</span>}
        </React.Fragment>
      ))}
    </div>
    <div className="grid grid-cols-4 gap-2">
      {ex.options.map((kind, i) => {
        const st = optStyle(i, ex.correctIndex, selected, revealed);
        return (
          <button key={i} onClick={() => !revealed && onSelect(i)}
            className="flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all"
            style={st}>
            <ShapeIcon kind={kind} size={34} />
            <span className="text-[9px] font-black text-white/30 uppercase">{String.fromCharCode(65+i)}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
const SpatialSeriesArtifact: React.FC<{ difficulty?: string; topic?: string }> = ({
  difficulty, topic,
}) => {
  const initDiff: Difficulty =
    difficulty === 'medium' || difficulty === 'hard' ? difficulty : 'easy';

  const [diff, setDiff]       = useState<Difficulty>(initDiff);
  const [idx, setIdx]         = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore]     = useState({ correct: 0, total: 0 });

  const pool = useMemo(() => EXERCISES.filter(e => e.difficulty === diff), [diff]);
  const ex   = pool[idx % pool.length];

  const changeDiff = (d: Difficulty) => {
    setDiff(d); setIdx(0); setSelected(null); setRevealed(false);
  };

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    setScore(s => ({ correct: s.correct + (i === ex.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => { setIdx(i => (i + 1) % pool.length); setSelected(null); setRevealed(false); };
  const reset = () => { setIdx(0); setSelected(null); setRevealed(false); setScore({ correct:0, total:0 }); };

  const isCorrect = revealed && selected === ex.correctIndex;

  return (
    <div className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl my-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/40">
        <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-black text-white text-sm uppercase tracking-tighter">Habilidad Matemática — Series</h3>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
            {topic || 'ECOEMS · Razonamiento Espacial'}
          </p>
        </div>
        {score.total > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] font-black" style={{ color: score.correct / score.total >= 0.6 ? '#22c55e' : '#f59e0b' }}>
              {score.correct}/{score.total}
            </span>
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width:`${(score.correct/score.total)*100}%`,
                  backgroundColor: score.correct/score.total >= 0.6 ? '#22c55e' : '#ef4444' }} />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Difficulty tabs */}
        <div className="flex gap-2">
          {(['easy','medium','hard'] as Difficulty[]).map(d => (
            <button key={d} onClick={() => changeDiff(d)}
              className="flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all"
              style={{
                borderColor: diff===d ? DIFF_COLOR[d]+'80' : 'rgba(255,255,255,0.08)',
                backgroundColor: diff===d ? DIFF_COLOR[d]+'18' : 'transparent',
                color: diff===d ? DIFF_COLOR[d] : 'rgba(255,255,255,0.3)',
              }}>
              {DIFF_LABEL[d]}
            </button>
          ))}
        </div>

        {/* Type badge + counter */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg"
            style={{ backgroundColor: DIFF_COLOR[diff]+'18', color: DIFF_COLOR[diff] }}>
            {TYPE_LABEL[ex.type]}
          </span>
          <span className="text-[9px] text-white/20 font-bold">
            {(idx % pool.length)+1} / {pool.length}
          </span>
        </div>

        {/* Question */}
        <p className="text-white/80 text-[13px] font-bold leading-snug">{ex.question}</p>

        {/* Exercise body */}
        {ex.type === 'numeric' && <NumericView ex={ex as NumericEx} />}
        {ex.type === 'spatial' && (
          <SpatialView ex={ex as SpatialEx} selected={selected} onSelect={handleSelect} revealed={revealed} />
        )}
        {ex.type === 'figure' && (
          <FigureView ex={ex as FigureEx} selected={selected} onSelect={handleSelect} revealed={revealed} />
        )}

        {/* Numeric options (shown separately for numeric type) */}
        {ex.type === 'numeric' && (
          <div className="grid grid-cols-4 gap-2">
            {(ex as NumericEx).options.map((opt, i) => {
              const st = optStyle(i, ex.correctIndex, selected, revealed);
              return (
                <button key={i} onClick={() => handleSelect(i)}
                  className="py-3 rounded-xl text-lg font-black border transition-all"
                  style={st}>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback */}
        {revealed && (
          <div className="flex items-start gap-3 p-3 rounded-xl border"
            style={{
              borderColor: isCorrect ? '#22c55e30' : '#ef444430',
              backgroundColor: isCorrect ? '#22c55e08' : '#ef444408',
            }}>
            {isCorrect
              ? <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
              : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: isCorrect ? '#22c55e' : '#ef4444' }}>
                {isCorrect ? '¡Correcto!' : `Incorrecto — respuesta: ${String.fromCharCode(65+ex.correctIndex)}`}
              </p>
              <p className="text-white/50 text-[11px] leading-relaxed">{ex.explanation}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-2">
          <button onClick={reset}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all"
            title="Reiniciar puntuación">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button onClick={next}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">
            {revealed ? 'Siguiente ejercicio' : 'Saltar'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpatialSeriesArtifact;
