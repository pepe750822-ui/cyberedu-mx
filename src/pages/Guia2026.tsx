import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, ImageIcon, FileText, CheckCircle, Circle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tema {
  id: number;
  titulo: string;
  materia: string;
  color: string;
  video?: string;
  infografia?: string;
  pdf?: string;
}

const TEMAS: Tema[] = [
  // Habilidad Matemática (8)
  { id: 1,  titulo: 'Series numéricas',                      materia: 'Habilidad Matemática', color: 'indigo' },
  { id: 2,  titulo: 'Analogías matemáticas',                 materia: 'Habilidad Matemática', color: 'indigo' },
  { id: 3,  titulo: 'Sucesiones de figuras',                 materia: 'Habilidad Matemática', color: 'indigo' },
  { id: 4,  titulo: 'Operaciones con conjuntos',             materia: 'Habilidad Matemática', color: 'indigo' },
  { id: 5,  titulo: 'Razonamiento numérico',                 materia: 'Habilidad Matemática', color: 'indigo' },
  { id: 6,  titulo: 'Secuencias lógicas',                    materia: 'Habilidad Matemática', color: 'indigo' },
  { id: 7,  titulo: 'Razonamiento espacial',                 materia: 'Habilidad Matemática', color: 'indigo' },
  { id: 8,  titulo: 'Diagramas y tablas de datos',           materia: 'Habilidad Matemática', color: 'indigo' },
  // Biología (4)
  { id: 9,  titulo: 'La célula y sus funciones',             materia: 'Biología',             color: 'green'  },
  { id: 10, titulo: 'Genética y herencia',                   materia: 'Biología',             color: 'green'  },
  { id: 11, titulo: 'Ecosistemas y biodiversidad',           materia: 'Biología',             color: 'green'  },
  { id: 12, titulo: 'El cuerpo humano y su salud',           materia: 'Biología',             color: 'green'  },
  // Español (4)
  { id: 13, titulo: 'Comprensión lectora',                   materia: 'Español',              color: 'amber'  },
  { id: 14, titulo: 'Gramática y ortografía',                materia: 'Español',              color: 'amber'  },
  { id: 15, titulo: 'Redacción y coherencia textual',        materia: 'Español',              color: 'amber'  },
  { id: 16, titulo: 'Tipos de textos y características',     materia: 'Español',              color: 'amber'  },
  // Química (4)
  { id: 17, titulo: 'Estructura atómica y tabla periódica',  materia: 'Química',              color: 'cyan'   },
  { id: 18, titulo: 'Enlace químico y compuestos',           materia: 'Química',              color: 'cyan'   },
  { id: 19, titulo: 'Reacciones químicas',                   materia: 'Química',              color: 'cyan'   },
  { id: 20, titulo: 'Soluciones y concentración',            materia: 'Química',              color: 'cyan'   },
  // Historia (4)
  { id: 21, titulo: 'México prehispánico y conquista',       materia: 'Historia',             color: 'orange' },
  { id: 22, titulo: 'Época colonial e independencia',        materia: 'Historia',             color: 'orange' },
  { id: 23, titulo: 'México siglo XIX y Reforma',            materia: 'Historia',             color: 'orange' },
  { id: 24, titulo: 'México siglo XX y contemporáneo',       materia: 'Historia',             color: 'orange' },
  // Matemáticas (4)
  { id: 25, titulo: 'Álgebra y ecuaciones',                  materia: 'Matemáticas',          color: 'violet' },
  { id: 26, titulo: 'Geometría y trigonometría',             materia: 'Matemáticas',          color: 'violet' },
  { id: 27, titulo: 'Aritmética y números',                  materia: 'Matemáticas',          color: 'violet' },
  { id: 28, titulo: 'Estadística y probabilidad',            materia: 'Matemáticas',          color: 'violet' },
  // Habilidad Verbal (4)
  { id: 29, titulo: 'Comprensión de textos',                 materia: 'Habilidad Verbal',     color: 'pink'   },
  { id: 30, titulo: 'Analogías verbales',                    materia: 'Habilidad Verbal',     color: 'pink'   },
  { id: 31, titulo: 'Sinónimos y antónimos',                 materia: 'Habilidad Verbal',     color: 'pink'   },
  { id: 32, titulo: 'Ordenamiento de ideas',                 materia: 'Habilidad Verbal',     color: 'pink'   },
  // Geografía (4)
  { id: 33, titulo: 'Geografía de México',                   materia: 'Geografía',            color: 'blue'   },
  { id: 34, titulo: 'Geografía física y climática',          materia: 'Geografía',            color: 'blue'   },
  { id: 35, titulo: 'Demografía y población',                materia: 'Geografía',            color: 'blue'   },
  { id: 36, titulo: 'Mapas y cartografía',                   materia: 'Geografía',            color: 'blue'   },
  // Física (4)
  { id: 37, titulo: 'Movimiento y cinemática',               materia: 'Física',               color: 'red'    },
  { id: 38, titulo: 'Fuerzas y dinámica',                    materia: 'Física',               color: 'red'    },
  { id: 39, titulo: 'Energía y trabajo',                     materia: 'Física',               color: 'red'    },
  { id: 40, titulo: 'Ondas, sonido y luz',                   materia: 'Física',               color: 'red'    },
  // Formación Cívica (4)
  { id: 41, titulo: 'Derechos humanos y ciudadanía',         materia: 'Formación Cívica y Ética', color: 'emerald' },
  { id: 42, titulo: 'Democracia y gobierno en México',       materia: 'Formación Cívica y Ética', color: 'emerald' },
  { id: 43, titulo: 'Valores y ética ciudadana',             materia: 'Formación Cívica y Ética', color: 'emerald' },
  { id: 44, titulo: 'Globalización y sociedad',              materia: 'Formación Cívica y Ética', color: 'emerald' },
];

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  badge: 'bg-indigo-500/20 text-indigo-300',  text: 'text-indigo-400'  },
  green:   { bg: 'bg-green-500/10',   border: 'border-green-500/30',   badge: 'bg-green-500/20 text-green-300',    text: 'text-green-400'   },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   badge: 'bg-amber-500/20 text-amber-300',    text: 'text-amber-400'   },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    badge: 'bg-cyan-500/20 text-cyan-300',      text: 'text-cyan-400'    },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  badge: 'bg-orange-500/20 text-orange-300',  text: 'text-orange-400'  },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  badge: 'bg-violet-500/20 text-violet-300',  text: 'text-violet-400'  },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/30',    badge: 'bg-pink-500/20 text-pink-300',      text: 'text-pink-400'    },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    badge: 'bg-blue-500/20 text-blue-300',      text: 'text-blue-400'    },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/30',     badge: 'bg-red-500/20 text-red-300',        text: 'text-red-400'     },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300',text: 'text-emerald-400' },
};

const MATERIAS = [...new Set(TEMAS.map(t => t.materia))];

const Guia2026 = () => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [filterMateria, setFilterMateria] = useState<string>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('guia2026_progress');
      if (saved) setCompleted(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggleCompleted = (id: number) => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    localStorage.setItem('guia2026_progress', JSON.stringify(updated));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((completedCount / TEMAS.length) * 100);

  const temasFiltrados = filterMateria === 'all'
    ? TEMAS
    : TEMAS.filter(t => t.materia === filterMateria);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </Link>
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-amber-400" />
            <span className="font-black uppercase tracking-tight text-white text-sm">Guía IPN/UNAM 2026</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">{completedCount}/{TEMAS.length} temas</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Título y progreso */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
            📖 Guía de Estudio 2026
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            44 temas organizados por materia. Marca cada tema como visto conforme avances.
          </p>

          {/* Barra de progreso */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-bold">
              <span>Has visto <span className="text-white">{completedCount}</span> de {TEMAS.length} temas</span>
              <span className={cn(pct >= 100 ? 'text-emerald-400' : 'text-amber-400')}>{pct}%</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filtro por materia */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilterMateria('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all',
              filterMateria === 'all'
                ? 'bg-white text-slate-900 border-white'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
            )}
          >
            Todas
          </button>
          {MATERIAS.map(m => {
            const tema = TEMAS.find(t => t.materia === m)!;
            const c = COLOR_MAP[tema.color];
            return (
              <button
                key={m}
                onClick={() => setFilterMateria(m)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all',
                  filterMateria === m
                    ? `${c.bg} ${c.border} ${c.text}`
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                )}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {temasFiltrados.map(tema => {
            const c = COLOR_MAP[tema.color];
            const isDone = completed[tema.id] === true;
            return (
              <div
                key={tema.id}
                className={cn(
                  'rounded-2xl border p-5 space-y-4 transition-all',
                  c.bg, c.border,
                  isDone && 'opacity-70'
                )}
              >
                {/* Número, materia y check */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full', c.badge)}>
                      {tema.materia}
                    </span>
                    <h3 className="text-sm font-black text-white leading-tight">
                      <span className={cn('mr-1.5 font-black', c.text)}>#{tema.id}</span>
                      {tema.titulo}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCompleted(tema.id)}
                    title={isDone ? 'Marcar como pendiente' : 'Marcar como visto'}
                    className="shrink-0 mt-0.5"
                  >
                    {isDone
                      ? <CheckCircle className="h-5 w-5 text-emerald-400" />
                      : <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400 transition-colors" />
                    }
                  </button>
                </div>

                {/* Botones de recursos */}
                <div className="flex flex-wrap gap-2">
                  {tema.video ? (
                    <a
                      href={tema.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/30 transition-all"
                    >
                      <PlayCircle className="h-3 w-3" />
                      Video
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                      <PlayCircle className="h-3 w-3" />
                      🔜 Video
                    </span>
                  )}

                  {tema.infografia ? (
                    <a
                      href={tema.infografia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-black uppercase tracking-wider hover:bg-blue-500/30 transition-all"
                    >
                      <ImageIcon className="h-3 w-3" />
                      Infografía
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                      <ImageIcon className="h-3 w-3" />
                      🔜 Infografía
                    </span>
                  )}

                  {tema.pdf ? (
                    <a
                      href={tema.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider hover:bg-amber-500/30 transition-all"
                    >
                      <FileText className="h-3 w-3" />
                      PDF
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                      <FileText className="h-3 w-3" />
                      🔜 PDF
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Los recursos se irán publicando conforme se produzcan — CyberEdu MX 2026
        </p>
      </div>
    </div>
  );
};

export default Guia2026;
