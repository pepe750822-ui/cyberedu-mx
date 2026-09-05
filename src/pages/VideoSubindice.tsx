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

interface ContentBlock {
  definition: string;
  bullets: string[];
  example: string | null;
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

function buildContent(
  descripcion: string | null,
  subindiceTitle: string,
  seccionTitulo: string,
  materiaNombre: string
): ContentBlock {
  if (descripcion) {
    const lines = descripcion
      .split(/\n|•|-\s/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 1) {
      return {
        definition: lines[0],
        bullets: autoGenerateBullets(subindiceTitle, materiaNombre),
        example: null,
      };
    }

    const [definition, ...rest] = lines;
    const bullets = rest.slice(0, 5);
    const example = rest.length > 5 ? rest.slice(5).join(" ") : null;
    return { definition, bullets, example };
  }

  // Auto-generate from temario title
  const coreTopic = subindiceTitle.split(":")[0].trim();
  return {
    definition: `${coreTopic} es un tema del subíndice ${seccionTitulo ? `dentro de "${seccionTitulo}"` : ""} en ${materiaNombre}. Dominar este concepto es clave para resolver preguntas frecuentes en el examen ECOEMS de admisión.`,
    bullets: autoGenerateBullets(subindiceTitle, materiaNombre),
    example: null,
  };
}

function autoGenerateBullets(title: string, materia: string): string[] {
  const core = title.split(":")[0].trim();
  return [
    `Identificar las características principales de: ${core}`,
    `Aplicar el concepto en ejercicios tipo ECOEMS`,
    `Distinguir ${core} de conceptos similares en ${materia}`,
    `Reconocer ejemplos prácticos en contextos cotidianos`,
    `Repasar con el simulador para reforzar lo aprendido`,
  ];
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

  // Find subíndice title and section from temario
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

  const content =
    !loading && subindiceTitle
      ? buildContent(
          video?.descripcion ?? null,
          subindiceTitle,
          seccionTitulo,
          area?.nombre ?? ""
        )
      : null;

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

        {/* ── 📚 ¿Qué aprenderás? ─────────────────────────────────── */}
        {content && (
          <div className="rounded-2xl border border-violet-500/30 bg-slate-900/60 backdrop-blur-sm p-5 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wide text-violet-300">
              📚 ¿Qué aprenderás?
            </h2>

            {/* Definición */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {content.definition}
            </p>

            {/* Puntos clave */}
            {content.bullets.length > 0 && (
              <ul className="space-y-2">
                {content.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 leading-snug">
                    <span className="shrink-0 mt-px">✅</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Ejemplo práctico */}
            {content.example && (
              <div className="mt-1 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
                  Ejemplo práctico
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {content.example}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Video embed ─────────────────────────────────────────── */}
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
