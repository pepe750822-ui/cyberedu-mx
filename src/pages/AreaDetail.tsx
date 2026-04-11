import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Video, BookOpen, RotateCcw, GraduationCap, ChevronRight, CheckCircle2, Brain } from "lucide-react";
import { areas } from "@/data/areas";
import { studioMapping } from "@/data/studioMap";
import { getNotebookUrl, getNotebookKey } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { trackVideoStart, trackVideoComplete } from "@/hooks/useAnalytics";
import VideoCard from "@/components/VideoCard";
import YouTubePlayer from "@/components/YouTubePlayer";
import MaterialComplementario from "@/components/MaterialComplementario";
import RecommendedVideos from "@/components/RecommendedVideos";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StudioModal from "@/components/StudioModal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const AreaDetail = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const [searchParams] = useSearchParams();

  // Flatten all videos for global index calculation
  const allVideos = useMemo(() => areas.flatMap(a => a.videos.map(v => ({ ...v, areaId: a.id }))), []);

  const [activeGlobalIndex, setActiveGlobalIndex] = useState(() => {
    // Attempt to determine the correct index before first render
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get("video");
    const pathParts = window.location.pathname.split("/");
    const areaIdFromPath = pathParts[pathParts.length - 1];
    
    if (videoId) {
      const idx = allVideos.findIndex(v => v.id === videoId);
      if (idx >= 0) return idx;
    }
    
    if (areaIdFromPath) {
      const idx = allVideos.findIndex(v => v.areaId === areaIdFromPath);
      if (idx >= 0) return idx;
    }
    
    return 0;
  });
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
      
      // Force scroll to player when navigating from external (like AITutor)
      if (videoParam) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [searchParams, areaId, allVideos]);

  useEffect(() => {
    // Scroll to top only on mount or area change, but be careful with mid-page video changes
  }, [activeVideo?.id]);

  const {
    markAsViewed,
    isViewed,
    viewedCount,
    totalVideos,
    getEstadisticas,
    obtenerProgresoVideo
  } = useVideoProgress();

  // Scroll to material section if a tab is specified in URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      // Small timeout to allow MaterialComplementario to render the tab content
      const timer = setTimeout(() => {
        const el = document.getElementById("material-complementario");
        if (el) {
          const yOffset = -100; // Extra offset for visibility
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const [activeSimulator, setActiveSimulator] = useState<{ url: string; title: string; description?: string } | null>(null);

  const stats = getEstadisticas();

  // Track video start when active video changes
  useEffect(() => {
    if (activeVideo && area) {
      trackVideoStart(activeVideo.id, activeVideo.title, area.name);
    }
  }, [activeVideo?.id]);

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
    if (notebookKey) {
      markAsViewed(notebookKey);
      trackVideoComplete(activeVideo.id, activeVideo.title, area.name);
    }
  };

  const progressPercent = totalVideos > 0 ? (viewedCount / totalVideos) * 100 : 0;

  const initialTime = (() => {
    const timeParam = searchParams.get("t") || searchParams.get("tiempo");
    if (timeParam) return parseInt(timeParam);
    const stored = obtenerProgresoVideo(activeVideo.id);
    if (stored && !stored.completed) return stored.seconds;
    return 0;
  })();

  // SEO: Dynamic Metadata & Schema Markup
  useEffect(() => {
    if (activeVideo && area) {
      // 1. Update Title & Meta Description
      const pageTitle = `${activeVideo.title} | ${area.name} - CyberEdu MX`;
      const pageDesc = `Aprende sobre ${activeVideo.title} en el curso de ${area.name}. ${activeVideo.description}. 100% gratuito para ECOEMS 2026.`;

      document.title = pageTitle;

      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", pageDesc);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", pageDesc);
        document.head.appendChild(metaDesc);
      }

      // 2. Inject JSON-LD Schema (Course & VideoObject)
      const schemaId = `schema-course-${activeVideo.id}`;
      let script = document.getElementById(schemaId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": activeVideo.title,
        "description": activeVideo.description,
        "provider": {
          "@type": "Organization",
          "name": "CyberEdu MX",
          "sameAs": "https://cyberedumx.com"
        },
        "courseCode": activeVideo.id,
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "Online",
          "instructor": {
            "@type": "Organization",
            "name": "CyberEdu MX"
          }
        }
      };

      const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": activeVideo.title,
        "description": activeVideo.description,
        "thumbnailUrl": [
          `https://img.youtube.com/vi/${activeVideo.videoUrl.split('/').pop()}/maxresdefault.jpg`
        ],
        "uploadDate": "2025-01-01T08:00:00+08:00", // Placeholder
        "duration": "PT5M",
        "contentUrl": activeVideo.videoUrl,
        "embedUrl": activeVideo.videoUrl,
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": { "@type": "WatchAction" },
          "userInteractionCount": 1234
        }
      };

      script.text = JSON.stringify([courseSchema, videoSchema]);

      return () => {
        // Cleanup script on unmount or video change
        const oldScript = document.getElementById(schemaId);
        if (oldScript) oldScript.remove();
      };
    }
  }, [activeVideo, area]);

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
                  key={activeVideo.id}
                  videoId={activeVideo.id}
                  videoUrl={activeVideo.videoUrl}
                  tiempoInicial={initialTime}
                  autoPlay={!searchParams.get("tab")}
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

              <div id="material-complementario">
                <MaterialComplementario videoId={activeVideo.id} />
              </div>
              <div className="p-6 border-t border-border/50 bg-muted/5">
                <RecommendedVideos currentVideoId={activeVideo.id} currentAreaId={activeVideo.areaId} />
              </div>
            </div>
          </div>

          {/* Sidebar - Branching Global Navigation */}
          <div className="lg:sticky lg:top-24 h-fit max-h-[calc(100vh-120px)] flex flex-col space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Tu Ruta (0-90)</span>
                <span className="text-[10px] font-black uppercase text-emerald-500">{Math.round(progressPercent)}% OK</span>
              </div>
              <Progress value={progressPercent} className="h-1.5 bg-muted [&>div]:bg-emerald-500" />
            </div>

            {/* ZONA STUDIO: Entrenamiento por Subíndices */}
            {area && studioMapping[area.id] && (
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/30 p-5 shadow-xl shadow-indigo-500/10 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Brain className="h-3 w-3 text-indigo-400" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Zona Studio (Pro)</h3>
                </div>
                <p className="text-[10px] font-medium text-indigo-200/60 leading-relaxed italic">
                  Especializado en subíndices de {area.name}
                </p>
                <div className="grid gap-2">
                  {studioMapping[area.id].map((sim, sIdx) => (
                    <Button
                      key={sIdx}
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSimulator({
                        url: sim.path,
                        title: sim.name,
                        description: sim.description
                      })}
                      className="w-full justify-start h-10 bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-400/50 group transition-all"
                    >
                      <div className="flex items-center w-full">
                        <div className="h-6 w-6 rounded bg-indigo-500/20 flex items-center justify-center mr-3 group-hover:bg-indigo-500 transition-colors">
                          <CheckCircle2 className="h-3 w-3 text-indigo-100" />
                        </div>
                        <span className="text-[10px] font-black uppercase text-indigo-100 truncate">{sim.name}</span>
                        <ChevronRight className="h-3 w-3 ml-auto text-indigo-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg flex flex-col">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Estructura del Curso
                </h3>
              </div>

              <div className="p-2 overflow-y-auto overflow-x-hidden max-h-[60vh] lg:max-h-[calc(100vh-350px)] scrollbar-visible">
                <style dangerouslySetInnerHTML={{
                  __html: `
                  .scrollbar-visible::-webkit-scrollbar {
                    width: 6px;
                    display: block !important;
                  }
                  .scrollbar-visible::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 10px;
                  }
                  .scrollbar-visible::-webkit-scrollbar-thumb {
                    background: rgba(var(--primary), 0.5);
                    background-color: #3b82f6; /* Blue thumb for high visibility */
                    border-radius: 10px;
                  }
                `}} />
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

      {/* Studio Modal for simulators */}
      <StudioModal
        isOpen={activeSimulator !== null}
        onClose={() => setActiveSimulator(null)}
        url={activeSimulator?.url || ""}
        title={activeSimulator?.title || ""}
        description={activeSimulator?.description}
      />
    </div>
  );
};

export default AreaDetail;
