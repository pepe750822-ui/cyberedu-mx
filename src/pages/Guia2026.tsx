import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, ImageIcon, FileText, CheckCircle, Circle, BookOpen, Lock, X, Play, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Tema {
  id: number;
  preguntas: string;
  tema: string;
  materia: string;
  youtubeUrl: string | null;
  infografia?: string;
  pdf?: string;
}

const getYoutubeId = (url: string) => {
  if (!url) return '';
  const shortMatch = url.match(/youtu\.be\/([^?&\n]+)/);
  if (shortMatch) return shortMatch[1];
  const longMatch = url.match(/[?&]v=([^&\n]+)/);
  return longMatch?.[1] ?? '';
};

const getThumbnail = (url: string) => {
  const id = getYoutubeId(url);
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
};

const TEMAS: Tema[] = [
  { id: 1,  preguntas: "1-3",     tema: "Ficha bibliográfica, tema del texto, recursos explicativos",                    materia: "Español",                  youtubeUrl: "https://youtu.be/ASmp-UMTuKQ", infografia: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/video1-infografia.png", pdf: "/guia2026/video1.pdf" },
  { id: 2,  preguntas: "4-5",     tema: "Nexos que introducen ideas, conectores de orden",                               materia: "Español",                  youtubeUrl: "https://youtu.be/IPy_JspRZaQ", infografia: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/video2-infografia.png", pdf: "/guia2026/video2.pdf" },
  { id: 3,  preguntas: "6-8",     tema: "Signos de puntuación, oración principal, presente histórico",                   materia: "Español",                  youtubeUrl: "https://youtu.be/14RAqK7iyLc", infografia: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/video3-infografia.png", pdf: "/guia2026/video3.pdf" },
  { id: 4,  preguntas: "9-11",    tema: "Tiempos verbales (copretérito), aposiciones, hecho vs opinión",                 materia: "Español",                  youtubeUrl: "https://youtu.be/ZxE-B_pxz64", infografia: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/video4-infografia.png", pdf: "/guia2026/video4.pdf" },
  { id: 5,  preguntas: "12",      tema: "Exageración en publicidad",                                                     materia: "Español",                  youtubeUrl: "https://youtu.be/49USboa54CM", infografia: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/video5-infografia.png", pdf: "/guia2026/video5.pdf" },
  { id: 6,  preguntas: "13-16",   tema: "Texto El contador de cuentos (completo)",                                       materia: "Español",                  youtubeUrl: "https://youtu.be/0TruKrDj2VI", infografia: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/video6-infografia.png", pdf: "/guia2026/video6.pdf" },
  { id: 7,  preguntas: "17-19",   tema: "Texto Los agujeros negros",                                                     materia: "Habilidad Verbal",         youtubeUrl: "https://youtu.be/N8z8xUcafqQ", infografia: "https://lruwnuldlltwktdfrwho.supabase.co/storage/v1/object/public/simulador-imagenes/guia2026/video7-infografia.png", pdf: "/guia2026/video7.pdf" },
  { id: 8,  preguntas: "20-22",   tema: "Analogías",                                                                     materia: "Habilidad Verbal",         youtubeUrl: null },
  { id: 9,  preguntas: "23-25",   tema: "Antónimos",                                                                     materia: "Habilidad Verbal",         youtubeUrl: null },
  { id: 10, preguntas: "26-28",   tema: "Sinónimos",                                                                     materia: "Habilidad Verbal",         youtubeUrl: null },
  { id: 11, preguntas: "29-30",   tema: "Jerarquía de operaciones y porcentajes",                                         materia: "Matemáticas",              youtubeUrl: null },
  { id: 12, preguntas: "31-32",   tema: "Simplificación de potencias y expresiones algebraicas",                         materia: "Matemáticas",              youtubeUrl: null },
  { id: 13, preguntas: "33-35",   tema: "Perímetro con álgebra, factorización, ecuaciones",                              materia: "Matemáticas",              youtubeUrl: null },
  { id: 14, preguntas: "36-37",   tema: "Frecuencia relativa y probabilidad",                                             materia: "Matemáticas",              youtubeUrl: null },
  { id: 15, preguntas: "38-40",   tema: "Semejanza, trigonometría, áreas",                                               materia: "Matemáticas",              youtubeUrl: null },
  { id: 16, preguntas: "41-44",   tema: "Sucesiones numéricas",                                                          materia: "Habilidad Matemática",     youtubeUrl: null },
  { id: 17, preguntas: "45-47",   tema: "Series de figuras",                                                             materia: "Habilidad Matemática",     youtubeUrl: null },
  { id: 18, preguntas: "48-50",   tema: "Series espaciales (dados, cubos)",                                              materia: "Habilidad Matemática",     youtubeUrl: null },
  { id: 19, preguntas: "51-52",   tema: "Imaginación espacial (contar cubos, dados girados)",                            materia: "Habilidad Matemática",     youtubeUrl: null },
  { id: 20, preguntas: "53-56",   tema: "Problemas de razonamiento",                                                     materia: "Habilidad Matemática",     youtubeUrl: null },
  { id: 21, preguntas: "57-60",   tema: "Célula, biodiversidad, áreas protegidas, transgénicos",                         materia: "Biología",                 youtubeUrl: null },
  { id: 22, preguntas: "61-63",   tema: "Fotosíntesis, aerobios/anaerobios, heterótrofos",                               materia: "Biología",                 youtubeUrl: null },
  { id: 23, preguntas: "64-65",   tema: "Nutrición y salud respiratoria",                                                materia: "Biología",                 youtubeUrl: null },
  { id: 24, preguntas: "66-68",   tema: "Reproducción, anticonceptivos, beneficios de transgénicos",                     materia: "Biología",                 youtubeUrl: null },
  { id: 25, preguntas: "69-70",   tema: "Gráficas velocidad-tiempo",                                                     materia: "Física",                   youtubeUrl: null },
  { id: 26, preguntas: "71-72",   tema: "Leyes de Newton (F=ma)",                                                        materia: "Física",                   youtubeUrl: null },
  { id: 27, preguntas: "73-75",   tema: "Electrización, calor/temperatura, Pascal",                                      materia: "Física",                   youtubeUrl: null },
  { id: 28, preguntas: "76-78",   tema: "Conservación de energía, conductividad, campos magnéticos",                     materia: "Física",                   youtubeUrl: null },
  { id: 29, preguntas: "79-80",   tema: "Movimiento ondulatorio, luz (longitud de onda, frecuencia)",                   materia: "Física",                   youtubeUrl: null },
  { id: 30, preguntas: "81-84",   tema: "Modelos atómicos, propiedades físicas, masa/volumen, cambios de estado",        materia: "Química",                  youtubeUrl: null },
  { id: 31, preguntas: "85-88",   tema: "Electrones externos, número atómico, representación H•, tabla periódica",       materia: "Química",                  youtubeUrl: null },
  { id: 32, preguntas: "89-92",   tema: "Metales, agua como reactivo, mol, redox",                                       materia: "Química",                  youtubeUrl: null },
  { id: 33, preguntas: "93-95",   tema: "Humanismo, Ilustración, nacionalismo",                                          materia: "Historia",                 youtubeUrl: null },
  { id: 34, preguntas: "96-98",   tema: "Fascismo, revolución electrónica, globalización",                               materia: "Historia",                 youtubeUrl: null },
  { id: 35, preguntas: "99-101",  tema: "Inquisición, absolutismo ilustrado, Reforma",                                   materia: "Historia",                 youtubeUrl: null },
  { id: 36, preguntas: "102-104", tema: "Artículo 27, Paz y Rulfo, TLCAN",                                               materia: "Historia",                 youtubeUrl: null },
  { id: 37, preguntas: "105-107", tema: "Temporalidad, coordenadas, husos horarios",                                     materia: "Geografía",                youtubeUrl: null },
  { id: 38, preguntas: "108-110", tema: "Tectónica de placas, estratosfera, riesgos sísmicos",                           materia: "Geografía",                youtubeUrl: null },
  { id: 39, preguntas: "111-113", tema: "Petróleo, puertos, turismo",                                                    materia: "Geografía",                youtubeUrl: null },
  { id: 40, preguntas: "114-116", tema: "Globalización cultural, Palenque, ZEE",                                         materia: "Geografía",                youtubeUrl: null },
  { id: 41, preguntas: "117-119", tema: "Decisiones individuales, valores estéticos, identidad",                         materia: "Formación Cívica y Ética", youtubeUrl: null },
  { id: 42, preguntas: "120-122", tema: "Derechos/obligaciones, violencia económica, discriminación",                    materia: "Formación Cívica y Ética", youtubeUrl: null },
  { id: 43, preguntas: "123-125", tema: "Poder Judicial, partidos políticos, voto",                                      materia: "Formación Cívica y Ética", youtubeUrl: null },
  { id: 44, preguntas: "126-128", tema: "Función social de medios, calidad de vida, negociación",                        materia: "Formación Cívica y Ética", youtubeUrl: null },
];

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  "Español":                  { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   badge: 'bg-amber-500/20 text-amber-300',    text: 'text-amber-400'   },
  "Habilidad Verbal":         { bg: 'bg-pink-500/10',    border: 'border-pink-500/30',    badge: 'bg-pink-500/20 text-pink-300',      text: 'text-pink-400'    },
  "Matemáticas":              { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  badge: 'bg-violet-500/20 text-violet-300',  text: 'text-violet-400'  },
  "Habilidad Matemática":     { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  badge: 'bg-indigo-500/20 text-indigo-300',  text: 'text-indigo-400'  },
  "Biología":                 { bg: 'bg-green-500/10',   border: 'border-green-500/30',   badge: 'bg-green-500/20 text-green-300',    text: 'text-green-400'   },
  "Física":                   { bg: 'bg-red-500/10',     border: 'border-red-500/30',     badge: 'bg-red-500/20 text-red-300',        text: 'text-red-400'     },
  "Química":                  { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    badge: 'bg-cyan-500/20 text-cyan-300',      text: 'text-cyan-400'    },
  "Historia":                 { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  badge: 'bg-orange-500/20 text-orange-300',  text: 'text-orange-400'  },
  "Geografía":                { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    badge: 'bg-blue-500/20 text-blue-300',      text: 'text-blue-400'    },
  "Formación Cívica y Ética": { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300',text: 'text-emerald-400' },
};

const DEFAULT_COLOR = { bg: 'bg-slate-800', border: 'border-white/10', badge: 'bg-white/10 text-slate-300', text: 'text-slate-400' };

const MATERIAS = [...new Set(TEMAS.map(t => t.materia))];

const FREE_PREVIEW_COUNT = 3;


const Guia2026 = () => {
  const navigate = useNavigate();
  const { profile, user, refreshProfile } = useAuth();
  const hasAccess =
    (profile as any)?.guia2026_unlocked === true ||
    (profile as any)?.paquete_completo === true ||
    ((profile as any)?.tokens || 0) >= 150;

  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [filterMateria, setFilterMateria] = useState<string>('all');
  const [selectedTema, setSelectedTema] = useState<Tema | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'infografia' | 'pdf'>('video');
  const [redeemingGuia, setRedeemingGuia] = useState(false);

  const redeemGuia2026 = async () => {
    if (!user || !profile) {
      toast.error('Debes iniciar sesión para canjear tokens');
      return;
    }
    const currentTokens = (profile as any)?.tokens ?? 0;
    if (currentTokens < 100) {
      toast.error(`Necesitas 100 tokens. Tu balance actual es ${currentTokens}. Obtén tokens en la sección de tokens.`);
      navigate('/tokens');
      return;
    }
    setRedeemingGuia(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bank10_unlocked: true,
          guia2026_unlocked: true,
          tokens: currentTokens - 100,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success('¡Guía 2026 desbloqueada! Ya tienes acceso a todos los videos y el simulador Banco 10. 🎉');
    } catch (err: any) {
      toast.error('Error al canjear: ' + err.message);
    } finally {
      setRedeemingGuia(false);
    }
  };

  const openModal = (tema: Tema, tab: 'video' | 'infografia' | 'pdf' = 'video') => {
    setSelectedTema(tema);
    setActiveTab(tab);
  };
  const closeModal = () => setSelectedTema(null);

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
      {/* Resource modal */}
      {selectedTema && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 overflow-y-auto p-4"
          onClick={closeModal}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-6xl mx-auto my-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-white/5">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  {selectedTema.materia} · Preguntas {selectedTema.preguntas}
                </p>
                <h3 className="text-white font-black text-base leading-snug">{selectedTema.tema}</h3>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors shrink-0 ml-4 mt-0.5">
                <X className="h-5 w-5" />
              </button>
            </div>

            {(selectedTema.youtubeUrl || selectedTema.infografia || selectedTema.pdf) ? (
              <>
                {/* Tabs */}
                <div className="flex border-b border-white/5">
                  {selectedTema.youtubeUrl && (
                    <button
                      onClick={() => setActiveTab('video')}
                      className={cn('px-5 py-3 text-sm font-black transition-all', activeTab === 'video' ? 'text-red-400 border-b-2 border-red-400' : 'text-slate-500 hover:text-slate-300')}
                    >
                      🎬 Video
                    </button>
                  )}
                  {selectedTema.infografia && (
                    <button
                      onClick={() => setActiveTab('infografia')}
                      className={cn('px-5 py-3 text-sm font-black transition-all', activeTab === 'infografia' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300')}
                    >
                      🖼️ Infografía
                    </button>
                  )}
                  {selectedTema.pdf && (
                    <button
                      onClick={() => setActiveTab('pdf')}
                      className={cn('px-5 py-3 text-sm font-black transition-all', activeTab === 'pdf' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300')}
                    >
                      📄 PDF
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {activeTab === 'video' && selectedTema.youtubeUrl && (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeId(selectedTema.youtubeUrl)}`}
                      className="w-full aspect-video rounded-xl"
                      allowFullScreen
                    />
                  )}
                  {activeTab === 'infografia' && selectedTema.infografia && (
                    <img src={selectedTema.infografia} alt="Infografía" className="w-full rounded-xl" />
                  )}
                  {activeTab === 'pdf' && selectedTema.pdf && (
                    <div className="space-y-3">
                      <iframe
                        src={selectedTema.pdf}
                        className="w-full h-screen rounded-xl border-0"
                        allowFullScreen
                      />
                      <a
                        href={selectedTema.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-black hover:bg-amber-500/30 transition-all"
                      >
                        <FileText className="h-4 w-4" />
                        Abrir PDF en nueva pestaña
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-slate-500">
                <p className="text-4xl mb-3">🔜</p>
                <p className="font-black text-sm uppercase tracking-wide">Recursos en producción</p>
                <p className="text-xs mt-1 text-slate-600">El video e infografía para este tema estarán disponibles pronto.</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-5 pb-5 pt-4 border-t border-white/5">
              <button
                onClick={() => toggleCompleted(selectedTema.id)}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
              >
                {completed[selectedTema.id]
                  ? <CheckCircle className="h-4 w-4 text-emerald-400" />
                  : <Circle className="h-4 w-4" />
                }
                {completed[selectedTema.id] ? 'Marcado como visto ✓' : 'Marcar como visto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky header */}
      <div className="border-b border-white/5 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-400" />
            <span className="font-black uppercase tracking-tight text-white text-sm hidden sm:inline">Guía IPN/UNAM 2026</span>
          </div>
          <span className="text-xs text-slate-400 font-bold">{completedCount}/{TEMAS.length} vistos</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Título y progreso */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
            📖 Guía de Estudio 2026
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            44 videos organizados por tema. Cada video cubre las preguntas indicadas de la guía oficial IPN/UNAM 2026.
          </p>
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
            Todas ({TEMAS.length})
          </button>
          {MATERIAS.map(m => {
            const c = COLOR_MAP[m] ?? DEFAULT_COLOR;
            const count = TEMAS.filter(t => t.materia === m).length;
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
                {m} ({count})
              </button>
            );
          })}
        </div>

        {/* Banner de compra — solo si no tiene acceso */}
        {!hasAccess && (
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-2xl p-6 text-center space-y-3">
            <div className="text-4xl">🎓</div>
            <h3 className="text-white font-black text-xl">¿Te gustó la muestra?</h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Accede a los <strong>44 videos completos</strong> + simulador Guía 2026 sin límite por solo <strong>100 tokens</strong> (pago único).
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              {/* Botón de canje directo si el usuario tiene suficientes tokens */}
              {user && ((profile as any)?.tokens ?? 0) >= 100 ? (
                <button
                  onClick={redeemGuia2026}
                  disabled={redeemingGuia}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-6 py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {redeemingGuia ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                  Canjear — 100 tokens
                </button>
              ) : (
                <button
                  onClick={() => navigate('/tokens')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                >
                  🪙 Obtener tokens para desbloquear
                </button>
              )}
              <button
                onClick={() => navigate('/tokens')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-xl hover:opacity-90 transition-all"
              >
                ⭐ Paquete Completo — 200 tokens
              </button>
            </div>
            <p className="text-[10px] text-slate-500">Vista previa: primeros {FREE_PREVIEW_COUNT} videos gratis</p>
          </div>
        )}

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {temasFiltrados.map((tema, globalIdx) => {
            const originalIndex = TEMAS.findIndex(t => t.id === tema.id);
            const isLocked = !hasAccess && originalIndex >= FREE_PREVIEW_COUNT;
            const c = COLOR_MAP[tema.materia] ?? DEFAULT_COLOR;
            const isDone = completed[tema.id] === true;
            return (
              <div
                key={tema.id}
                onClick={() => !isLocked && openModal(tema, tema.youtubeUrl ? 'video' : tema.infografia ? 'infografia' : 'pdf')}
                className={cn(
                  'rounded-2xl border overflow-hidden transition-all relative',
                  !isLocked && 'cursor-pointer hover:border-white/20',
                  isLocked ? 'bg-slate-900/50 border-white/5 opacity-70' : `${c.bg} ${c.border}`,
                  !isLocked && isDone && 'opacity-60'
                )}
              >
                {/* Overlay de candado */}
                {isLocked && (
                  <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-slate-950/60 z-10 gap-2">
                    <Lock className="h-6 w-6 text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Desbloquear — 100 tokens</span>
                  </div>
                )}

                {/* Thumbnail */}
                {tema.youtubeUrl ? (
                  <div className="relative">
                    <img
                      src={getThumbnail(tema.youtubeUrl)}
                      alt={tema.tema}
                      className="w-full aspect-video object-cover"
                    />
                    {!isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-red-600 rounded-full p-3 opacity-90 shadow-lg">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : !isLocked ? (
                  <div className="w-full aspect-video bg-slate-800/60 flex items-center justify-center">
                    <span className="text-4xl font-black text-slate-600">#{tema.id}</span>
                  </div>
                ) : null}

                {/* Contenido */}
                <div className="p-5 space-y-4">
                {/* Cabecera */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0', isLocked ? 'bg-white/5 text-slate-600' : c.badge)}>
                        {tema.materia}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold shrink-0">
                        Preguntas {tema.preguntas}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white leading-snug">
                      <span className={cn('mr-1 font-black', isLocked ? 'text-slate-600' : c.text)}>#{tema.id}</span>
                      {tema.tema}
                    </h3>
                  </div>
                  {!isLocked && (
                    <button
                      onClick={e => { e.stopPropagation(); toggleCompleted(tema.id); }}
                      title={isDone ? 'Marcar como pendiente' : 'Marcar como visto'}
                      className="shrink-0 mt-0.5"
                    >
                      {isDone
                        ? <CheckCircle className="h-5 w-5 text-emerald-400" />
                        : <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400 transition-colors" />
                      }
                    </button>
                  )}
                </div>

                {/* Botones de recursos */}
                {!isLocked && (
                  <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                    {tema.youtubeUrl ? (
                      <button
                        onClick={() => openModal(tema, 'video')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider hover:bg-red-500/30 transition-all"
                      >
                        <PlayCircle className="h-3 w-3" />
                        Ver Video
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-600 text-[10px] font-bold">
                        <PlayCircle className="h-3 w-3" />
                        🔜 Video
                      </span>
                    )}
                    {tema.infografia ? (
                      <button
                        onClick={() => openModal(tema, 'infografia')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-black uppercase tracking-wider hover:bg-blue-500/30 transition-all"
                      >
                        <ImageIcon className="h-3 w-3" />
                        Infografía
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-600 text-[10px] font-bold">
                        <ImageIcon className="h-3 w-3" />
                        🔜 Infografía
                      </span>
                    )}
                    {tema.pdf ? (
                      <button
                        onClick={() => openModal(tema, 'pdf')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider hover:bg-amber-500/30 transition-all"
                      >
                        <FileText className="h-3 w-3" />
                        PDF
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-600 text-[10px] font-bold">
                        <FileText className="h-3 w-3" />
                        🔜 PDF
                      </span>
                    )}
                  </div>
                )}
                </div>{/* /contenido */}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Videos y recursos se publican conforme se producen — CyberEdu MX 2026
        </p>
      </div>
    </div>
  );
};

export default Guia2026;
