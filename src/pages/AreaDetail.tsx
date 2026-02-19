import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Video, BookOpen, RotateCcw, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AreaDetail = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const [searchParams] = useSearchParams();

  // Flatten all videos for global index calculation
  const allVideos = useMemo(() => areas.flatMap(a => a.videos.map(v => ({ ...v, areaId: a.id }))), []);

  const [activeGlobalIndex, setActiveGlobalIndex] = useState(0);
  const activeVideo = allVideos[activeGlobalIndex];
  const area = areas.find((a) => a.id === activeVideo?.areaId);

  // Expanded areas in accordion
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);

  // Handle initialization and URL params
  useEffect(() => {
    const videoParam = searchParams.get("video");
    let targetIndex = -1;

    if (videoParam) {
      targetIndex = allVideos.findIndex((v) => v.id === videoParam);
    } else if (areaId) {
      targetIndex = allVideos.findIndex((v) => v.areaId === areaId);
    }

    if (targetIndex >= 0) {
      setActiveGlobalIndex(targetIndex);
      // Auto-expand the area of the active video
      const vAreaId = allVideos[targetIndex].areaId;
      setExpandedAreas(prev => prev.includes(vAreaId) ? prev : [...prev, vAreaId]);
    }
  }, [searchParams, areaId, allVideos]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeGlobalIndex]);

  const {
    markAsViewed,
    isViewed,
    viewedCount,
    totalVideos,
    resetProgress,
    obtenerProgresoVideo
  } = useVideoProgress();

  if (!activeVideo || !area) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Contenido no encontrado</h1>
          <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const Icon = area.icon || GraduationCap;
  const notebookUrl = getNotebookUrl(activeVideo.id);
  const notebookKey = getNotebookKey(activeVideo.id);

  const handleOpenNotebook = () => {
    if (notebookKey) markAsViewed(notebookKey);
  };

  const progressPercent = totalVideos > 0 ? (viewedCount / totalVideos) * 100 : 0;

  const initialTime = (() => {
    const timeParam = searchParams.get("t") || searchParams.get("tiempo");
    if (timeParam) return parseInt(timeParam);
    const stored = obtenerProgresoVideo(activeVideo.id);
    if (stored && !stored.completed) return stored.seconds;
    return 0;
  })();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Area Header */}
      <div className={`${area.gradientClass} text-white`}>
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-4">
            <ArrowLeft className="h-4 w-4" />
            Volver a inicio
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{area.name}</h1>
              <p className="text-white/80 mt-1 italic text-xs">{area.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
              <div className="aspect-video bg-black overflow-hidden relative">
                <YouTubePlayer
                  videoId={activeVideo.id}
                  videoUrl={activeVideo.videoUrl}
                  tiempoInicial={initialTime}
                  autoPlay={true}
                />
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-foreground uppercase italic leading-tight">
                      {activeGlobalIndex}. {activeVideo.title}
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">{activeVideo.description}</p>
                  </div>
                  {notebookUrl && (
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <a href={notebookUrl} target="_blank" rel="noopener noreferrer" onClick={handleOpenNotebook}>
                        <BookOpen className="h-4 w-4 mr-2 text-primary" />
                        Notebook
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <MaterialComplementario videoId={activeVideo.id} />
              <div className="p-6 border-t border-border/50 bg-muted/5">
                <RecommendedVideos currentVideoId={activeVideo.id} currentAreaId={activeVideo.areaId} />
              </div>
            </div>
          </div>

          {/* Sidebar - Branching Global Navigation */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Tu Ruta (0-90)</span>
                <span className="text-[10px] font-black uppercase text-emerald-500">{Math.round(progressPercent)}% OK</span>
              </div>
              <Progress value={progressPercent} className="h-1.5 bg-muted [&>div]:bg-emerald-500" />
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Estructura del Curso
                </h3>
              </div>

              <div className="p-2 lg:max-h-[700px] overflow-y-auto custom-scrollbar">
                <Accordion type="multiple" value={expandedAreas} onValueChange={setExpandedAreas} className="space-y-1">
                  {areas.map((areaObj) => {
                    const areaVideos = allVideos.filter(v => v.areaId === areaObj.id);
                    const startIndex = allVideos.findIndex(v => v.areaId === areaObj.id);
                    const isCurrentArea = areaObj.id === activeVideo.areaId;
                    const AreaIcon = areaObj.icon;

                    return (
                      <AccordionItem key={areaObj.id} value={areaObj.id} className="border-none">
                        <AccordionTrigger className={cn(
                          "px-3 py-3 rounded-xl hover:no-underline hover:bg-muted/50 transition-all text-left",
                          isCurrentArea ? "bg-primary/5 text-primary border border-primary/10" : "text-muted-foreground"
                        )}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                              isCurrentArea ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}>
                              <AreaIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-tight truncate leading-none">
                                {areaObj.name}
                              </p>
                              <p className="text-[9px] font-bold opacity-60 mt-1">
                                Videos {startIndex}-{startIndex + areaObj.videoCount - 1}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-1 space-y-1 pl-4">
                          {areaVideos.map((video) => {
                            const globalIdx = allVideos.findIndex(v => v.id === video.id);
                            const isActive = globalIdx === activeGlobalIndex;
                            const vKey = getNotebookKey(video.id);
                            const viewed = vKey ? isViewed(vKey) : false;

                            return (
                              <button
                                key={video.id}
                                onClick={() => setActiveGlobalIndex(globalIdx)}
                                className={cn(
                                  "w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 group relative border",
                                  isActive
                                    ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                                    : "bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground"
                                )}
                              >
                                <div className={cn(
                                  "h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0",
                                  isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                )}>
                                  {globalIdx}
                                </div>
                                <span className="text-[11px] font-bold font-display truncate pr-4">
                                  {video.title}
                                </span>
                                {viewed && (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-500 absolute right-2" />
                                )}
                              </button>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AreaDetail;
