import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Video, ChevronDown, Zap } from "lucide-react";

interface VideoItem {
  id: string;
  materia: string;
  subindice: string;
  titulo: string;
  youtube_url: string | null;
  descripcion: string | null;
  orden: number | null;
}

const MATERIAS = [
  { nombre: "Español",          emoji: "📝", header: "bg-gradient-to-r from-rose-700 to-rose-500"   },
  { nombre: "Matemáticas",      emoji: "🔢", header: "bg-gradient-to-r from-blue-700 to-blue-500"   },
  { nombre: "Biología",         emoji: "🧬", header: "bg-gradient-to-r from-green-700 to-green-500" },
  { nombre: "Física",           emoji: "⚛️", header: "bg-gradient-to-r from-purple-700 to-purple-500" },
  { nombre: "Química",          emoji: "⚗️", header: "bg-gradient-to-r from-amber-700 to-amber-500" },
  { nombre: "Historia",         emoji: "📜", header: "bg-gradient-to-r from-orange-700 to-orange-500" },
  { nombre: "Geografía",        emoji: "🌎", header: "bg-gradient-to-r from-teal-700 to-teal-500"   },
  { nombre: "Formación Cívica", emoji: "🏛️", header: "bg-gradient-to-r from-indigo-700 to-indigo-500" },
];

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function Videos() {
  const [openMateria, setOpenMateria] = useState<string | null>(null);
  const [videosPorMateria, setVideosPorMateria] = useState<Record<string, VideoItem[]>>({});
  const [loadingMateria, setLoadingMateria] = useState<string | null>(null);
  const [intro, setIntro] = useState<VideoItem[]>([]);
  const [introPlaying, setIntroPlaying] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("cyberedu_videos" as any)
      .select("*")
      .eq("materia", "Introducción")
      .eq("activo", true)
      .order("orden", { ascending: true })
      .then(({ data }) => setIntro((data as VideoItem[]) ?? []));
  }, []);

  const toggleMateria = (nombre: string) => {
    if (openMateria === nombre) {
      setOpenMateria(null);
      return;
    }
    setOpenMateria(nombre);
    if (!videosPorMateria[nombre]) {
      setLoadingMateria(nombre);
      supabase
        .from("cyberedu_videos" as any)
        .select("*")
        .eq("materia", nombre)
        .eq("activo", true)
        .order("orden", { ascending: true })
        .then(({ data }) => {
          setVideosPorMateria((prev) => ({ ...prev, [nombre]: (data as VideoItem[]) ?? [] }));
          setLoadingMateria(null);
        });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col cyber-grid">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-10 pb-24 space-y-8 relative">
        {/* Page header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Zap className="h-3 w-3 text-violet-400" />
            Videos por Tema · ECOEMS
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
            Videos por{" "}
            <span className="text-violet-400 not-italic">Subíndice</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Selecciona una materia para ver los videos organizados por subíndice.
          </p>
        </div>

        {/* Introducción */}
        {intro.length > 0 && (
          <div className="rounded-2xl border border-violet-500/30 overflow-hidden bg-slate-900/60 backdrop-blur-sm">
            <div className="px-5 py-4 bg-gradient-to-r from-violet-700 to-violet-500 flex items-center gap-2">
              <Video className="h-4 w-4 text-white" />
              <h2 className="text-sm font-black uppercase tracking-wide text-white">🎬 Introducción</h2>
            </div>
            <div className="px-5 py-5 flex flex-col gap-4">
              {intro.map((v) => {
                const ytId = v.youtube_url ? getYouTubeId(v.youtube_url) : null;
                const playing = introPlaying === v.id;
                return (
                  <div key={v.id}>
                    <p className="font-black text-sm text-white mb-1 uppercase tracking-wide">{v.titulo}</p>
                    {v.descripcion && (
                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{v.descripcion}</p>
                    )}
                    {ytId && !playing && (
                      <button
                        onClick={() => setIntroPlaying(v.id)}
                        className="w-full aspect-video rounded-xl overflow-hidden relative group bg-black/40 border border-violet-500/20 flex items-center justify-center"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                          alt={v.titulo}
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                        <div className="relative z-10 h-16 w-16 rounded-full bg-violet-600/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Video className="h-9 w-9 text-white" />
                        </div>
                      </button>
                    )}
                    {playing && ytId && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          title={v.titulo}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Materias accordion */}
        <div className="space-y-3">
          {MATERIAS.map((m) => {
            const isOpen = openMateria === m.nombre;
            const videos = videosPorMateria[m.nombre] ?? [];
            const subindices = [...new Set(videos.map((v) => v.subindice))];
            const isLoading = loadingMateria === m.nombre;

            return (
              <div
                key={m.nombre}
                className="rounded-2xl border border-white/10 overflow-hidden bg-slate-900/60 backdrop-blur-sm"
              >
                {/* Materia header */}
                <button
                  onClick={() => toggleMateria(m.nombre)}
                  className={`w-full flex items-center justify-between px-5 py-4 ${m.header} text-white font-black text-sm uppercase tracking-wide hover:opacity-90 transition-opacity`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{m.emoji}</span>
                    {m.nombre}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </motion.span>
                </button>

                {/* Videos content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {isLoading && (
                        <div className="px-5 py-8 text-center text-slate-500 text-sm">
                          Cargando videos...
                        </div>
                      )}

                      {!isLoading && videos.length === 0 && (
                        <div className="px-5 py-10 flex flex-col items-center gap-2">
                          <span className="text-4xl animate-pulse">🎬</span>
                          <p className="text-sm font-bold text-slate-500 animate-pulse">Próximamente</p>
                          <p className="text-xs text-slate-600 mt-1">
                            Aún no hay videos publicados para esta materia
                          </p>
                        </div>
                      )}

                      {!isLoading && subindices.length > 0 && (
                        <div>
                          {subindices.map((sub) => {
                            const subVideos = videos.filter((v) => v.subindice === sub);
                            return (
                              <div key={sub}>
                                {/* Subindice label */}
                                <div className="px-5 py-2 bg-white/3 border-t border-white/5">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    {sub}
                                  </p>
                                </div>

                                {/* Videos for this subindice */}
                                <div className="divide-y divide-white/5">
                                  {subVideos.map((v) => {
                                    const ytId = v.youtube_url ? getYouTubeId(v.youtube_url) : null;
                                    return (
                                      <div key={v.id} className="px-5 py-4">
                                        <p className="text-sm font-black text-white mb-1 uppercase tracking-wide leading-snug">
                                          {v.titulo}
                                        </p>
                                        {v.descripcion && (
                                          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                                            {v.descripcion}
                                          </p>
                                        )}
                                        {ytId ? (
                                          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                                            <iframe
                                              src={`https://www.youtube.com/embed/${ytId}`}
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                              className="w-full h-full"
                                              title={v.titulo}
                                            />
                                          </div>
                                        ) : (
                                          <div className="aspect-video w-full rounded-xl border border-dashed border-white/10 bg-white/3 flex flex-col items-center justify-center gap-2">
                                            <span className="text-3xl animate-pulse">🎬</span>
                                            <p className="text-sm font-bold text-slate-500 animate-pulse">
                                              Próximamente
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
