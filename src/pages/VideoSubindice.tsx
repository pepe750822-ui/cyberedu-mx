import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, ArrowLeft, PlayCircle } from "lucide-react";
import { videoAreas } from "@/data/temarioVideoData";
import { colorMap } from "@/data/temarioData";

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
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function VideoSubindice() {
  const { materia: materiaSlug, subindice: subNum } = useParams<{
    materia: string;
    subindice: string;
  }>();

  const [video, setVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);

  const area = videoAreas.find((a) => createSlug(a.nombre) === materiaSlug);
  const colors = area ? (colorMap[area.color] ?? colorMap.blue) : colorMap.blue;

  // Find subíndice title from temario
  let subindiceTitle = "";
  let seccionTitulo = "";
  if (area && subNum) {
    outer: for (let sIdx = 0; sIdx < area.subtemas.length; sIdx++) {
      const subtema = area.subtemas[sIdx];
      for (let cIdx = 0; cIdx < subtema.contenido.length; cIdx++) {
        if (`${sIdx + 1}.${cIdx + 1}` === subNum) {
          subindiceTitle = subtema.contenido[cIdx];
          seccionTitulo = subtema.titulo;
          break outer;
        }
      }
    }
  }

  useEffect(() => {
    if (!area || !subNum) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("cyberedu_videos" as any)
      .select("*")
      .eq("materia", area.nombre)
      .eq("subindice", subNum)
      .eq("activo", true)
      .maybeSingle()
      .then(({ data }) => {
        setVideo(data as VideoItem | null);
        setLoading(false);
      });
  }, [area?.nombre, subNum]);

  const ytId = video?.youtube_url ? getYouTubeId(video.youtube_url) : null;
  const displayTitle = video?.titulo || subindiceTitle;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col cyber-grid">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-8 pb-24 space-y-6 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link to="/videos" className="hover:text-slate-300 transition-colors">
            Videos
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <Link to="/videos" className="hover:text-slate-300 transition-colors">
            {area?.nombre ?? materiaSlug}
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="text-slate-300 font-bold">{subNum}</span>
        </nav>

        {/* Badge + título */}
        <div className="space-y-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors.tag}`}
          >
            <span>{area?.icono}</span>
            {area?.nombre} · {subNum}
          </div>
          {seccionTitulo && (
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              {seccionTitulo}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-black leading-tight text-white">
            {displayTitle || (loading ? "Cargando..." : "Subíndice no encontrado")}
          </h1>
        </div>

        {/* Descripción */}
        {!loading && (
          <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
            {video?.descripcion ? (
              <p>{video.descripcion}</p>
            ) : subindiceTitle ? (
              <>
                <p>
                  Este tema corresponde al subíndice{" "}
                  <strong className="text-slate-300">{subNum}</strong> del temario
                  oficial ECOEMS para{" "}
                  <strong className="text-slate-300">{area?.nombre}</strong>.
                </p>
                <p>
                  Dominar{" "}
                  <strong className="text-slate-300">
                    {subindiceTitle.split(":")[0].trim()}
                  </strong>{" "}
                  es parte esencial del examen de admisión. Estudia el video con
                  atención y repasa los puntos clave antes del examen.
                </p>
                <p>
                  Sección:{" "}
                  <span className="text-slate-300 italic">{seccionTitulo}</span>.
                  Practica con el simulador para reforzar lo aprendido.
                </p>
              </>
            ) : null}
          </div>
        )}

        {/* Video */}
        {loading && (
          <div className="aspect-video w-full rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-center">
            <p className="text-slate-500 text-sm">Cargando video...</p>
          </div>
        )}

        {!loading && ytId && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              title={displayTitle}
            />
          </div>
        )}

        {!loading && !ytId && (
          <div className="aspect-video w-full rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col items-center justify-center gap-3">
            <PlayCircle className="h-12 w-12 text-slate-700" />
            <p className="text-slate-500 text-sm">Video próximamente disponible</p>
          </div>
        )}

        {/* Volver */}
        <div className="pt-2">
          <Link
            to="/videos"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${colors.btn} text-white`}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a {area?.nombre ?? "Videos"}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
