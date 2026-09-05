import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Video, ChevronDown, Zap, PlayCircle, X } from "lucide-react";
import { colorMap } from "@/data/temarioData";
import { videoAreas as areas } from "@/data/temarioVideoData";

interface VideoItem {
  id: string;
  materia: string;
  subindice: string;
  titulo: string;
  youtube_url: string | null;
  descripcion: string | null;
  orden: number | null;
}

function createSlug(text: string): string {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function isSubindice(contenido: string): boolean {
  const lower = contenido.toLowerCase();
  return !lower.startsWith("tip ") && !lower.startsWith("tip:");
}

function getLabel(contenido: string): string {
  return contenido.split(":")[0].trim();
}

function findVideo(videos: VideoItem[], contenido: string): VideoItem | null {
  const slug = createSlug(getLabel(contenido));
  return (
    videos.find((v) => createSlug(v.subindice) === slug) ??
    videos.find((v) => {
      const vs = createSlug(v.subindice);
      return slug.startsWith(vs) || vs.startsWith(slug);
    }) ??
    null
  );
}

const accentBorderMap: Record<string, string> = {
  blue:    "border-l-blue-500",
  purple:  "border-l-purple-500",
  yellow:  "border-l-yellow-400",
  emerald: "border-l-emerald-500",
  orange:  "border-l-orange-500",
  cyan:    "border-l-cyan-500",
  red:     "border-l-red-500",
  teal:    "border-l-teal-500",
  pink:    "border-l-pink-500",
  indigo:  "border-l-indigo-500",
  green:   "border-l-green-500",
};

export default function Videos() {
  const [openArea, setOpenArea] = useState<number | null>(null);
  const [videosPorMateria, setVideosPorMateria] = useState<Record<string, VideoItem[]>>({});
  const [loadingMateria, setLoadingMateria] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
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

  const toggleArea = (idx: number) => {
    if (openArea === idx) {
      setOpenArea(null);
      setExpandedKey(null);
      return;
    }
    setOpenArea(idx);
    setExpandedKey(null);
    const nombre = areas[idx].nombre;
    if (!videosPorMateria[nombre]) {
      setLoadingMateria(nombre);
      supabase
        .from("cyberedu_videos" as any)
        .select("*")
        .eq("materia", nombre)
        .eq("activo", true)
        .order("orden", { ascending: true })
        .then(({ data }) => {
          setVideosPorMateria((prev) => ({
            ...prev,
            [nombre]: (data as VideoItem[]) ?? [],
          }));
          setLoadingMateria(null);
        });
    }
  };

  const toggleVideo = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col cyber-grid">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-10 pb-24 space-y-8 relative">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Zap className="h-3 w-3 text-violet-400" />
            Videos por Subíndice · ECOEMS
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
            Videos por{" "}
            <span className="text-violet-400 not-italic">Tema</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Selecciona una materia y encuentra el video de cada subíndice del temario oficial.
          </p>
        </div>

        {intro.length > 0 && (
          <div className="rounded-2xl border border-violet-500/30 overflow-hidden bg-slate-900/60 backdrop-blur-sm">
            <div className="px-5 py-4 bg-gradient-to-r from-violet-700 to-violet-500 flex items-center gap-2">
              <Video className="h-4 w-4 text-white" />
              <h2 className="text-sm font-black uppercase tracking-wide text-white">
                🎬 Introducción
              </h2>
            </div>
            <div className="px-5 py-5 flex flex-col gap-5">
              {intro.map((v) => {
                const ytId = v.youtube_url ? getYouTubeId(v.youtube_url) : null;
                const playing = introPlaying === v.id;
                return (
                  <div key={v.id}>
                    <p className="font-black text-sm text-white mb-1 uppercase tracking-wide">
                      {v.titulo}
                    </p>
                    {v.descripcion && (
                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                        {v.descripcion}
                      </p>
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

        <div className="space-y-3">
          {areas.map((area, aIdx) => {
            const colors = colorMap[area.color] ?? colorMap.blue;
            const accentBorder = accentBorderMap[area.color] ?? "border-l-blue-500";
            const isOpen = openArea === aIdx;
            const videos = videosPorMateria[area.nombre] ?? [];
            const isLoading = loadingMateria === area.nombre;

            return (
              <div
                key={aIdx}
                className="rounded-2xl border border-white/10 overflow-hidden bg-slate-900/60 backdrop-blur-sm"
              >
                <button
                  onClick={() => toggleArea(aIdx)}
                  className={`w-full flex items-center justify-between px-5 py-4 ${colors.header} text-white font-black text-sm uppercase tracking-wide hover:opacity-90 transition-opacity`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{area.icono}</span>
                    {area.nombre}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <ChevronDown className="h-4 w-4 opacity-80" />
                  </motion.span>
                </button>

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

                      {!isLoading && (
                        <div>
                          {area.subtemas.map((subtema, sIdx) => {
                            const subindices = subtema.contenido.filter(isSubindice);
                            if (subindices.length === 0) return null;
                            const secNum = sIdx + 1;

                            return (
                              <div key={sIdx}>
                                {/* Sección */}
                                <div className={`px-5 py-3 bg-white/[0.04] border-t border-white/8 border-l-4 ${accentBorder}`}>
                                  <p className="text-xs font-black uppercase tracking-widest text-slate-300">
                                    {secNum}. {subtema.titulo}
                                  </p>
                                </div>

                                {/* Subíndices */}
                                <div className="divide-y divide-white/5">
                                  {subindices.map((item, cIdx) => {
                                    const label = item;
                                    const video = findVideo(videos, item);
                                    const key = `${aIdx}-${sIdx}-${cIdx}`;
                                    const isExpanded = expandedKey === key;
                                    const ytId = video?.youtube_url
                                      ? getYouTubeId(video.youtube_url)
                                      : null;
                                    const hasVideo = !!(video && ytId);

                                    return (
                                      <div key={cIdx}>
                                        <div className="flex items-center justify-between px-5 py-3.5 gap-4 hover:bg-white/[0.03] transition-colors">
                                          <div className="flex items-center gap-3 min-w-0">
                                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 tabular-nums ${colors.tag}`}>
                                              {secNum}.{cIdx + 1}
                                            </span>
                                            <p className="text-sm font-medium text-slate-200 leading-snug">
                                              {label}
                                            </p>
                                          </div>

                                          {hasVideo && (
                                            <button
                                              onClick={() => toggleVideo(key)}
                                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide shrink-0 transition-all ${
                                                isExpanded
                                                  ? `${colors.btn} text-white`
                                                  : "bg-white/8 text-slate-300 hover:bg-white/15"
                                              }`}
                                            >
                                              {isExpanded ? (
                                                <>
                                                  <X className="h-3 w-3" />
                                                  Cerrar
                                                </>
                                              ) : (
                                                <>
                                                  <PlayCircle className="h-3.5 w-3.5" />
                                                  Ver video
                                                </>
                                              )}
                                            </button>
                                          )}
                                        </div>

                                        <AnimatePresence initial={false}>
                                          {isExpanded && ytId && (
                                            <motion.div
                                              key="video"
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.25 }}
                                              className="overflow-hidden"
                                            >
                                              <div className="px-5 pb-5 pt-2">
                                                {video?.descripcion && (
                                                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                                                    {video.descripcion}
                                                  </p>
                                                )}
                                                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                                                  <iframe
                                                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full h-full"
                                                    title={video?.titulo ?? label}
                                                  />
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
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
