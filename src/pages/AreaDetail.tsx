import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Video, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { areas } from "@/data/areas";
import { getNotebookUrl, getNotebookKey } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import VideoCard from "@/components/VideoCard";
import YouTubePlayer from "@/components/YouTubePlayer";
import MaterialComplementario from "@/components/MaterialComplementario";
import RecommendedVideos from "@/components/RecommendedVideos";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const AreaDetail = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const [searchParams] = useSearchParams();
  const area = areas.find((a) => a.id === areaId);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Handle ?video= query param from search
  useEffect(() => {
    if (!area) return;
    const videoParam = searchParams.get("video");
    if (videoParam) {
      const idx = area.videos.findIndex((v) => v.id === videoParam);
      if (idx >= 0) setActiveVideoIndex(idx);
    }
  }, [searchParams, area]);

  // Always scroll to top when area or video changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [areaId, activeVideoIndex]);

  const {
    markAsViewed,
    isViewed,
    viewedCount,
    totalVideos,
    resetProgress,
    obtenerProgresoVideo
  } = useVideoProgress();

  if (!area) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Área no encontrada</h1>
          <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const Icon = area.icon;
  const activeVideo = area.videos[activeVideoIndex];
  const notebookUrl = getNotebookUrl(activeVideo.id);
  const notebookKey = getNotebookKey(activeVideo.id);

  const handleOpenNotebook = () => {
    if (notebookKey) {
      markAsViewed(notebookKey);
    }
  };

  const progressPercent = totalVideos > 0 ? (viewedCount / totalVideos) * 100 : 0;

  // Logic to determine initial time
  const getInitialTime = () => {
    // 1. Check URL param
    const timeParam = searchParams.get("t") || searchParams.get("tiempo");
    if (timeParam) return parseInt(timeParam);

    // 2. Check local storage
    const stored = obtenerProgresoVideo(activeVideo.id);
    if (stored && !stored.completed) return stored.seconds;

    return 0;
  };

  const initialTime = getInitialTime();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Area Header */}
      <div className={`${area.gradientClass} text-white`}>
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a áreas
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">{area.name}</h1>
              <p className="text-white/80 mt-1">{area.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player + Notebook */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
              <div className="aspect-video bg-foreground/5 overflow-hidden">
                {activeVideo.videoUrl ? (
                  <YouTubePlayer
                    videoId={activeVideo.id}
                    videoUrl={activeVideo.videoUrl}
                    tiempoInicial={initialTime}
                    autoPlay={true}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-900">
                    <Video className="h-16 w-16 text-muted-foreground/40 mb-4" />
                    <p className="text-white font-medium">Video próximamente</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Este contenido está siendo procesado por el equipo de CyberEdu Mx.
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">{activeVideo.title}</h2>
                    <p className="text-muted-foreground">{activeVideo.description}</p>
                  </div>
                  {notebookUrl && (
                    <a
                      href={notebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      onClick={handleOpenNotebook}
                    >
                      <Button size="sm" variant="outline" type="button">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Abrir Notebook
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Material Complementario */}
              <MaterialComplementario videoId={activeVideo.id} />

              {/* Sugerencias Personalizadas */}
              <div className="p-6 border-t border-border/50">
                <RecommendedVideos
                  currentVideoId={activeVideo.id}
                  currentAreaId={areaId}
                />
              </div>
            </div>
          </div>

          {/* Video List */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Progress Bar */}
            <div className="bg-card rounded-xl border border-border p-4 mb-4 card-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">
                  📊 Progreso: {viewedCount}/{totalVideos} materiales vistos
                </span>
                <button
                  onClick={resetProgress}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                  title="Reiniciar progreso"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reiniciar
                </button>
              </div>
              <Progress value={progressPercent} className="h-2.5 bg-muted [&>div]:bg-green-500" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Lista de videos</h3>
              <span className="text-sm text-muted-foreground">{area.videoCount} videos</span>
            </div>
            <div className="space-y-2 lg:max-h-[800px] overflow-y-auto pr-1 custom-scrollbar">
              {area.videos.map((video, index) => {
                const vKey = getNotebookKey(video.id);
                return (
                  <VideoCard
                    key={video.id}
                    video={video}
                    index={index}
                    isActive={index === activeVideoIndex}
                    isViewed={vKey ? isViewed(vKey) : false}
                    onClick={() => setActiveVideoIndex(index)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AreaDetail;
