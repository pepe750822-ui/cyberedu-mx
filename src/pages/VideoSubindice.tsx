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

const BOLD_WORDS = ["Autor", "Título", "Editorial", "ECOEMS", "ejemplo", "ficha"];

function renderAiContent(text: string) {
  const regex = new RegExp(`(${BOLD_WORDS.join("|")})`, "gi");
  return text
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((para, pIdx) => {
      const parts = para.split(regex);
      return (
        <p key={pIdx} className="text-sm leading-relaxed text-slate-300">
          {parts.map((part, i) =>
            BOLD_WORDS.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
              <strong key={i} className="text-violet-200 font-bold">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
}

export default function VideoSubindice() {
  const { materia: materiaSlug, subindice: subNum } = useParams<{
    materia: string;
    subindice: string;
  }>();

  const [video, setVideo] = useState<VideoItem | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const area = videoAreas.find((a) => createSlug(a.nombre) === materiaSlug);
  const colors = area ? (colorMap[area.color] ?? colorMap.blue) : colorMap.blue;

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

  // ── Load video from Supabase ──────────────────────────────────
  useEffect(() => {
    if (!area || !subNum) {
      setVideoLoading(false);
      return;
    }
    setVideoLoading(true);
    supabase
      .from("cyberedu_videos" as any)
      .select("*")
      .eq("materia", area.nombre)
      .eq("subindice", subNum)
      .eq("activo", true)
      .maybeSingle()
      .then(({ data }) => {
        setVideo(data as VideoItem | null);
        setVideoLoading(false);
      });
  }, [area?.nombre, subNum]);

  // ── Always generate AI content via DeepSeek ──────────────────
  useEffect(() => {
    if (videoLoading) return;
    if (!subindiceTitle || !area?.nombre) return;

    setAiLoading(true);
    fetch("/api/video-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: subindiceTitle, materia: area.nombre }),
    })
      .then((r) => r.json())
      .then((d: { content?: string }) => setAiContent(d.content ?? null))
      .catch(() => setAiContent(null))
      .finally(() => setAiLoading(false));
  }, [videoLoading, video?.descripcion, subindiceTitle, area?.nombre]);

  const ytId = video?.youtube_url ? getYouTubeId(video.youtube_url) : null;
  const displayTitle = video?.titulo || subindiceTitle;

  // SEO
  useEffect(() => {
    if (!displayTitle) return;
    document.title = `${displayTitle} | CyberEdu MX`;
    const meta = document.querySelector('meta[name="description"]');
    const content = video?.descripcion ?? `${displayTitle} — ${area?.nombre ?? ""} ECOEMS`;
    if (meta) meta.setAttribute("content", content);
  }, [displayTitle, video?.descripcion, area?.nombre]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col cyber-grid">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-8 pb-24 space-y-6 relative">
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
            {displayTitle || (videoLoading ? "Cargando..." : "Subíndice no encontrado")}
          </h1>
        </div>

        {/* ── Dos columnas: video (izq) + resumen (der) ─────────── */}
        {!videoLoading && (
          <div className="grid lg:grid-cols-2 gap-6 items-start">

            {/* ── Video embed ───────────────────────────────────── */}
            <div>
              {ytId ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    title={displayTitle}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col items-center justify-center gap-3">
                  <PlayCircle className="h-12 w-12 text-slate-700" />
                  <p className="text-slate-500 text-sm">Video próximamente disponible</p>
                </div>
              )}
            </div>

            {/* ── 📚 Resumen del tema ───────────────────────────── */}
            {subindiceTitle && (
              <div className="rounded-2xl border border-violet-500/30 bg-slate-900/60 backdrop-blur-sm p-6 space-y-4">
                <h2 className="text-sm font-black uppercase tracking-wide text-violet-300">
                  📚 Resumen del tema
                </h2>

                {aiLoading && (
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="h-4 w-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin shrink-0" />
                    <span>Generando resumen con IA...</span>
                  </div>
                )}

                {!aiLoading && aiContent && (
                  <div className="space-y-3">
                    {renderAiContent(aiContent)}
                  </div>
                )}

                {!aiLoading && !aiContent && (
                  <p className="text-sm text-slate-500 italic">
                    Resumen no disponible para este subíndice.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {videoLoading && (
          <div className="aspect-video w-full rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-center">
            <p className="text-slate-500 text-sm">Cargando video...</p>
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
