import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Video } from "lucide-react";

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
  { nombre: "Español",           emoji: "📝", color: "rose",   bg: "bg-rose-500/10",   border: "border-rose-500/30",   text: "text-rose-400",   hover: "hover:bg-rose-500/20" },
  { nombre: "Matemáticas",       emoji: "🔢", color: "blue",   bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-400",   hover: "hover:bg-blue-500/20" },
  { nombre: "Biología",          emoji: "🧬", color: "green",  bg: "bg-green-500/10",  border: "border-green-500/30",  text: "text-green-400",  hover: "hover:bg-green-500/20" },
  { nombre: "Física",            emoji: "⚛️", color: "purple", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", hover: "hover:bg-purple-500/20" },
  { nombre: "Química",           emoji: "⚗️", color: "amber",  bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-400",  hover: "hover:bg-amber-500/20" },
  { nombre: "Historia",          emoji: "📜", color: "orange", bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", hover: "hover:bg-orange-500/20" },
  { nombre: "Geografía",         emoji: "🌎", color: "teal",   bg: "bg-teal-500/10",   border: "border-teal-500/30",   text: "text-teal-400",   hover: "hover:bg-teal-500/20" },
  { nombre: "Formación Cívica",  emoji: "🏛️", color: "indigo", bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", hover: "hover:bg-indigo-500/20" },
];

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function SubindiceCard({ subindice, videos, color }: { subindice: string; videos: VideoItem[]; color: typeof MATERIAS[0] }) {
  return (
    <div className={`rounded-2xl border ${color.border} overflow-hidden bg-card/40`}>
      {/* Header morado/color de materia */}
      <div className={`px-5 py-3 ${color.bg} border-b ${color.border}`}>
        <h3 className={`font-black text-base ${color.text} tracking-tight`}>{subindice}</h3>
      </div>

      {/* Videos del subíndice */}
      <div className="divide-y divide-border/40">
        {videos.map((v) => {
          const ytId = v.youtube_url ? getYouTubeId(v.youtube_url) : null;
          return (
            <div key={v.id} className="px-5 py-4">
              {/* Descripción breve */}
              {v.descripcion && (
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{v.descripcion}</p>
              )}

              {/* Embed o Próximamente */}
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
                <div className="aspect-video w-full rounded-xl border border-dashed border-border/60 bg-card/60 flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl animate-pulse">🎬</span>
                  <p className="text-sm font-bold text-muted-foreground animate-pulse">Próximamente</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Videos() {
  const [materiaActiva, setMateriaActiva] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (!materiaActiva) return;
    setLoading(true);
    supabase
      .from("cyberedu_videos" as any)
      .select("*")
      .eq("materia", materiaActiva)
      .eq("activo", true)
      .order("orden", { ascending: true })
      .then(({ data }) => {
        setVideos((data as VideoItem[]) ?? []);
        setLoading(false);
      });
  }, [materiaActiva]);

  const subindices = materiaActiva
    ? [...new Set(videos.map((v) => v.subindice))]
    : [];

  const colorActivo = MATERIAS.find((m) => m.nombre === materiaActiva);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Video className="h-7 w-7 text-violet-400" />
            <h1 className="text-3xl font-black text-foreground tracking-tight">Videos por Tema</h1>
          </div>
          <p className="text-muted-foreground text-sm">Selecciona una materia para ver los videos por subíndice</p>
        </div>

        {/* Introducción */}
        {intro.length > 0 && (
          <div className="mb-10 rounded-2xl border border-violet-500/30 bg-violet-500/5 overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center gap-2">
              <Video className="h-5 w-5 text-violet-400" />
              <h2 className="text-base font-black text-violet-400 uppercase tracking-widest">🎬 Introducción</h2>
            </div>
            <div className="px-5 pb-5 flex flex-col gap-4">
              {intro.map((v) => {
                const ytId = v.youtube_url ? getYouTubeId(v.youtube_url) : null;
                const playing = introPlaying === v.id;
                return (
                  <div key={v.id}>
                    <p className="font-bold text-foreground text-sm mb-1">{v.titulo}</p>
                    {v.descripcion && <p className="text-xs text-muted-foreground mb-3">{v.descripcion}</p>}
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

        {/* Materias grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {MATERIAS.map((m) => {
            const active = materiaActiva === m.nombre;
            return (
              <button
                key={m.nombre}
                onClick={() => {
                  setMateriaActiva(active ? null : m.nombre);
                  setVideos([]);
                }}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all font-bold text-sm
                  ${active
                    ? `${m.bg} ${m.border} ${m.text} scale-[1.02] shadow-lg`
                    : `bg-card border-border text-muted-foreground hover:${m.text} ${m.hover} hover:border-transparent`
                  }`}
              >
                <span className="text-3xl leading-none">{m.emoji}</span>
                <span className="text-center leading-tight">{m.nombre}</span>
              </button>
            );
          })}
        </div>

        {/* Subindices section */}
        {materiaActiva && colorActivo && (
          <div>
            <h2 className={`text-lg font-black mb-4 ${colorActivo.text} flex items-center gap-2`}>
              <span>{colorActivo.emoji}</span>
              {materiaActiva}
            </h2>

            {loading && (
              <div className="text-center py-12 text-muted-foreground text-sm">Cargando videos...</div>
            )}

            {!loading && videos.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                <Video className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40 animate-pulse" />
                <p className="text-muted-foreground text-sm font-bold animate-pulse">Próximamente</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Aún no hay videos publicados para esta materia</p>
              </div>
            )}

            {!loading && subindices.length > 0 && (
              <div className="flex flex-col gap-5">
                {subindices.map((sub) => (
                  <SubindiceCard
                    key={sub}
                    subindice={sub}
                    videos={videos.filter((v) => v.subindice === sub)}
                    color={colorActivo}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
