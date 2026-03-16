import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FileText,
  Headphones,
  Image,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Download,
  ZoomIn,
  PenLine,
  Sparkles,
  Brain,
  Lightbulb,
  BookCopy,
  ExternalLink,
  Layers,
  GraduationCap
} from "lucide-react";
import { materiales } from "@/data/materialComplementario";
import { aiContent } from "@/data/aiContent";
import { areas } from "@/data/areas";
import { studioMapping } from "@/data/studioMap";
import StudioModal from "@/components/StudioModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useNotebookLMContent } from "@/hooks/useNotebookLMContent";
import { FlashcardViewer } from "@/components/FlashcardViewer";
import { AITutorQuiz } from "@/components/AITutorQuiz";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { trackQuizStart, trackQuizComplete } from "@/hooks/useAnalytics";

interface MaterialComplementarioProps {
  videoId: string;
}

// ─── Image Proxy Helper ───
const getProxiedUrl = (url: string) => {
  if (url.includes("upload.wikimedia.org/wikipedia/commons")) {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return `https://commons.wikimedia.org/w/thumb.php?f=${filename}&w=800`;
  }
  return url;
};

const PodcastPlayer = ({ url, duracion }: { url: string; duracion?: string }) => (
  <div className="border border-border rounded-lg p-5 sm:p-8 flex flex-col items-center gap-4 bg-muted/5">
    <div className="p-4 sm:p-5 bg-primary/10 rounded-full">
      <Headphones className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
    </div>
    <div className="text-center">
      <p className="text-foreground font-bold text-base sm:text-lg">Podcast del tema</p>
      {duracion && <p className="text-xs sm:text-sm text-muted-foreground mt-1">Duración: {duracion}</p>}
    </div>
    <audio controls className="w-full max-w-md mt-2" preload="none">
      <source src={url} />
      Tu navegador no soporta el reproductor de audio.
    </audio>
  </div>
);

const InfografiaViewer = ({ url, descripcion }: { url: string; descripcion: string }) => (
  <div className="border border-border rounded-lg p-6 bg-muted/5 flex flex-col items-center">
    <div className="w-full max-h-[600px] overflow-y-auto custom-scrollbar rounded-md bg-black/20 flex justify-center p-2">
      <img src={getProxiedUrl(url)} alt={descripcion} className="max-w-full h-auto object-contain bg-white p-2 rounded-xl" loading="lazy" />
    </div>
    <p className="text-sm font-medium text-foreground mt-4 text-center">{descripcion}</p>
    <div className="grid grid-cols-2 gap-3 w-full mt-4">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="outline" className="w-full">
          <ZoomIn className="h-4 w-4 mr-1" />
          Ampliar
        </Button>
      </a>
      <a href={url} download>
        <Button size="sm" variant="secondary" className="w-full">
          <Download className="h-4 w-4 mr-1" />
          Descargar
        </Button>
      </a>
    </div>
  </div>
);

const PdfViewer = ({ url, titulo }: { url: string; titulo: string }) => (
  <div className="border border-border rounded-lg overflow-hidden flex flex-col items-center gap-4 bg-muted/10">
    <div className="w-full h-[400px] sm:h-[600px] bg-background">
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        width="100%"
        height="100%"
        title={titulo}
        className="border-none"
      />
    </div>
    <div className="p-4 flex flex-col sm:flex-row gap-3 w-full items-center sm:justify-between border-t border-border bg-card">
      <p className="text-sm font-bold text-foreground flex items-center gap-2 max-w-full truncate">
        <FileText className="h-4 w-4 text-primary shrink-0" />
        <span className="truncate">{titulo}</span>
      </p>
      <div className="flex gap-2 w-full sm:w-auto">
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
          <Button size="sm" variant="outline" className="h-8 w-full">
            <ZoomIn className="h-4 w-4 mr-1" />
            Full
          </Button>
        </a>
        <a href={url} download className="flex-1 sm:flex-initial">
          <Button size="sm" variant="secondary" className="h-8 w-full">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </a>
      </div>
    </div>
  </div>
);

const AISupport = ({ videoId }: { videoId: string }) => {
  const content = aiContent[videoId];
  if (!content) return (
    <div className="p-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
      <Brain className="h-10 w-10 text-slate-600 mx-auto mb-3 opacity-50" />
      <p className="text-sm font-medium text-slate-500 italic">
        El Tutor AI está procesando el material extendido para este video...
      </p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Resumen Automático */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Resumen AI</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed italic">"{content.summary}"</p>
        </div>

        <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Análisis del Experto</h4>
          </div>
          <p className="text-sm text-indigo-100/80 leading-relaxed font-medium">{content.deepExplanation}</p>
        </div>
      </div>

      {/* Material Extra Recomendado */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <BookCopy className="h-4 w-4 text-emerald-500" />
          <h4 className="text-xs font-black uppercase tracking-widest text-white">Ruta de Ampliación</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {content.extraMaterials.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="px-2 py-0.5 rounded bg-white/10 text-[8px] font-black uppercase text-slate-400">
                  {item.type}
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white">{item.title}</span>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-primary" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const MaterialComplementario = ({ videoId }: MaterialComplementarioProps) => {
  const material = materiales[videoId];
  const { flashcards, quiz: aiQuiz, loading: loadingAI } = useNotebookLMContent(videoId);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'quiz-aprobado' && e.data?.videoId === videoId) {
        localStorage.setItem(`quiz_aprobado_${videoId}`, 'true');
        localStorage.setItem(`quiz_update_${videoId}`, Date.now().toString());
        
        // Track original quiz completion
        trackQuizComplete(`original_${videoId}`, 100, 100, true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId]);

  if (!material) return null;

  const hasPodcast = !!material.podcast?.url;
  const hasInfografia = !!material.infografia?.url;
  const hasPdf = !!material.pdf?.url;
  const hasGuia = !!material.guia?.url;
  const hasQuiz = !!material.quiz?.url;
  const hasAI = !!aiContent[videoId];
  const hasFlashcards = flashcards.length > 0;
  const hasAIQuiz = !!aiQuiz;

  const areaId = areas.find(a => a.videos.some(v => v.id === videoId))?.id;
  const studioSims = areaId ? studioMapping[areaId] : [];
  const hasStudio = studioSims && studioSims.length > 0;

  const hasAny = hasPodcast || hasInfografia || hasPdf || hasGuia || hasQuiz || hasAI || hasStudio || hasFlashcards || hasAIQuiz;

  if (!hasAny) return null;

  // REORDERED LOGIC: AI Quiz -> Flashcards -> Normal Quiz -> AI Tutor -> Infografia -> PDF -> Podcast -> Guia
  const defaultTab = hasAIQuiz
    ? "ai-quiz"
    : (hasFlashcards
      ? "flashcards"
      : (hasQuiz
        ? "quiz"
        : (hasAI ? "ai-tutor" : (hasInfografia ? "infografia" : (hasPdf ? "pdf" : (hasPodcast ? "podcast" : "guia"))))));

  const validTabs = ["ai-quiz", "flashcards", "quiz", "ai-tutor", "infografia", "pdf", "podcast", "guia", "studio"];
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");
  
  // Helper to find the best default tab based on priority
  const getBestDefaultTab = () => {
    if (hasAIQuiz) return "ai-quiz";
    if (hasFlashcards) return "flashcards";
    if (hasQuiz) return "quiz";
    if (hasAI) return "ai-tutor";
    if (hasInfografia) return "infografia";
    if (hasPdf) return "pdf";
    if (hasPodcast) return "podcast";
    return "guia";
  };

  const [activeTab, setActiveTab] = useState(() => {
    if (urlTab && validTabs.includes(urlTab)) return urlTab;
    return getBestDefaultTab();
  });

  const [activeSimulator, setActiveSimulator] = useState<{ url: string; title: string; description?: string } | null>(null);

  // 1. Sync state with URL parameter if it changes (External navigation)
  useEffect(() => {
    if (urlTab && validTabs.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab, activeTab]);

  // 2. Sync state when video changes (Reset to default unless URL has a tab)
  useEffect(() => {
    if (!urlTab || !validTabs.includes(urlTab)) {
      const targetDefault = getBestDefaultTab();
      if (activeTab !== targetDefault) {
        setActiveTab(targetDefault);
      }
    }
  }, [videoId, urlTab, hasAIQuiz, hasFlashcards, hasQuiz, hasAI, hasInfografia, hasPdf, hasPodcast, hasGuia]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Centro de Aprendizaje Avanzado
        </h3>
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
            setSearchParams(prev => {
              prev.set("tab", value);
              return prev;
            }, { replace: true });
            
            if (value === "quiz") {
              trackQuizStart(`original_${videoId}`, videoId);
            } else if (value === "ai-quiz") {
              trackQuizStart(`ai_${videoId}`, videoId);
            }
          }}
        >
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1 mb-6">

            {hasAIQuiz && (
              <TabsTrigger value="ai-quiz" className="gap-1.5 text-xs sm:text-sm font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                <GraduationCap className="h-4 w-4" />
                🎯 Desafío IA
              </TabsTrigger>
            )}
            {hasFlashcards && (
              <TabsTrigger value="flashcards" className="gap-1.5 text-xs sm:text-sm font-black uppercase tracking-tighter">
                <Layers className="h-4 w-4 text-amber-500" />
                🎴 Flashcards
              </TabsTrigger>
            )}
            {hasQuiz && (
              <TabsTrigger value="quiz" className="gap-1.5 text-xs sm:text-sm font-black uppercase tracking-tighter">
                <PenLine className="h-4 w-4 text-secondary" />
                📝 QUIZ Original
              </TabsTrigger>
            )}
            {hasAI && (
              <TabsTrigger value="ai-tutor" className="gap-1.5 text-xs sm:text-sm font-black uppercase tracking-tighter">
                <Brain className="h-4 w-4 text-primary" />
                🧠 Asistencia AI
              </TabsTrigger>
            )}
            {hasInfografia && (
              <TabsTrigger value="infografia" className="gap-1.5 text-xs sm:text-sm">
                <Image className="h-4 w-4" />
                Infografía
              </TabsTrigger>
            )}
            {hasPdf && (
              <TabsTrigger value="pdf" className="gap-1.5 text-xs sm:text-sm">
                <FileText className="h-4 w-4" />
                Documento Técnico
              </TabsTrigger>
            )}
            {hasPodcast && (
              <TabsTrigger value="podcast" className="gap-1.5 text-xs sm:text-sm">
                <Headphones className="h-4 w-4" />
                Podcast de Repaso
              </TabsTrigger>
            )}
            {hasGuia && (
              <TabsTrigger value="guia" className="gap-1.5 text-xs sm:text-sm font-black uppercase tracking-tighter bg-amber-500/10 text-amber-500 border border-amber-500/20 data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all">
                <BookCopy className="h-4 w-4" />
                📘 Guía de Estudio
              </TabsTrigger>
            )}

            {hasStudio && (
              <TabsTrigger value="studio" className="gap-1.5 text-xs sm:text-sm font-black uppercase tracking-tighter bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">
                <Sparkles className="h-4 w-4" />
                🚀 ENTRENAMIENTO STUDIO
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="ai-quiz" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {aiQuiz && <AITutorQuiz quiz={aiQuiz} videoId={videoId} />}
          </TabsContent>

          <TabsContent value="flashcards" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <FlashcardViewer flashcards={flashcards} />
          </TabsContent>

          <TabsContent value="ai-tutor" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AISupport videoId={videoId} />
          </TabsContent>

          {hasQuiz && (
            <TabsContent value="quiz" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="border border-border rounded-lg overflow-hidden shadow-inner bg-slate-950">
                <iframe
                  src={material.quiz!.url}
                  width="100%"
                  height="800"
                  frameBorder="0"
                  title="Quiz"
                  className="bg-background opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </TabsContent>
          )}

          {hasInfografia && (
            <TabsContent value="infografia" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <InfografiaViewer url={material.infografia!.url} descripcion={material.infografia!.descripcion} />
            </TabsContent>
          )}

          {hasPdf && (
            <TabsContent value="pdf" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <PdfViewer url={material.pdf!.url} titulo={material.pdf!.titulo} />
            </TabsContent>
          )}

          {hasPodcast && (
            <TabsContent value="podcast" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <PodcastPlayer url={material.podcast!.url} duracion={material.podcast!.duracion} />
            </TabsContent>
          )}

          {hasGuia && (
            <TabsContent value="guia" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookCopy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm sm:text-base leading-none">
                        {material.guia!.titulo}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        Contenido interactivo generado con asistencia de IA
                      </p>
                    </div>
                  </div>
                  <a href={material.guia!.url} download>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Descargar .md
                    </Button>
                  </a>
                </div>

                <MarkdownViewer url={material.guia!.url} />
              </div>
            </TabsContent>
          )}

          {hasStudio && (
            <TabsContent value="studio" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl border border-indigo-500/30 p-6 sm:p-10 text-center shadow-xl">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="h-16 w-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                    <Sparkles className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tighter text-white">Simuladores de Entrenamiento Intensivo</h4>
                  <p className="text-sm text-indigo-200/70">
                    Domina cada subíndice de esta materia con reactivos extraídos de guías oficiales y exámenes pasados.
                  </p>
                  <div className="grid gap-3 pt-4">
                    {studioSims.map((sim, sIdx) => (
                      <Button
                        key={sIdx}
                        onClick={() => {
                          setActiveSimulator({
                            url: sim.path,
                            title: sim.name,
                            description: sim.description
                          });
                          trackQuizStart(`studio_${sim.name}`, videoId);
                        }}
                        className="h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {sim.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Studio Modal for simulators */}
        <StudioModal
          isOpen={activeSimulator !== null}
          onClose={() => setActiveSimulator(null)}
          url={activeSimulator?.url || ""}
          title={activeSimulator?.title || ""}
          description={activeSimulator?.description}
        />
      </div>
    </div>
  );
};

export default MaterialComplementario;
