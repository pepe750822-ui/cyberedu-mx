import { useState, useEffect } from "react";
import { FileText, Headphones, Image, ClipboardList, CheckCircle2, XCircle, ChevronDown, ChevronUp, Play, Pause, Download, ZoomIn, PenLine, Sparkles } from "lucide-react";
import { materiales } from "@/data/materialComplementario";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface MaterialComplementarioProps {
  videoId: string;
}

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
      <source src={url} type="audio/mpeg" />
      Tu navegador no soporta el reproductor de audio.
    </audio>
  </div>
);

const InfografiaViewer = ({ url, descripcion }: { url: string; descripcion: string }) => (
  <div className="border border-border rounded-lg p-6 bg-muted/5 flex flex-col items-center">
    <div className="w-full max-h-[600px] overflow-y-auto custom-scrollbar rounded-md bg-black/20 flex justify-center">
      <img src={url} alt={descripcion} className="max-w-full h-auto object-contain" loading="lazy" />
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

const MaterialComplementario = ({ videoId }: MaterialComplementarioProps) => {
  const material = materiales[videoId];

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'quiz-aprobado' && e.data?.videoId === videoId) {
        localStorage.setItem(`quiz_aprobado_${videoId}`, 'true');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoId]);

  if (!material) return null;

  const hasPodcast = !!material.podcast?.url;
  const hasInfografia = !!material.infografia?.url;
  const hasPdf = !!material.pdf?.url;
  const hasQuiz = !!material.quiz?.url;
  const hasAny = hasPodcast || hasInfografia || hasPdf || hasQuiz;

  if (!hasAny) return null;

  // REORDERED LOGIC: QUIZ -> Infografia -> PDF -> Podcast
  const defaultTab = hasQuiz
    ? "quiz"
    : hasInfografia
      ? "infografia"
      : hasPdf
        ? "pdf"
        : "podcast";

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Reset tab to Quiz whenever a new video is selected
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [videoId, defaultTab]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Material Complementario
        </h3>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1 mb-6">
            {hasQuiz && (
              <TabsTrigger value="quiz" className="gap-1.5 text-xs sm:text-sm font-black uppercase tracking-tighter">
                <PenLine className="h-4 w-4 text-secondary" />
                📝 QUIZ Inteligente
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
          </TabsList>

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
        </Tabs>
      </div>
    </div>
  );
};

export default MaterialComplementario;
