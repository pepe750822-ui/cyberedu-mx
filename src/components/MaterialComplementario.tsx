import { useState, useEffect } from "react";
import { FileText, Headphones, Image, ClipboardList, CheckCircle2, XCircle, ChevronDown, ChevronUp, Play, Pause, Download, ZoomIn, PenLine } from "lucide-react";
import { materiales, type Pregunta } from "@/data/materialComplementario";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface MaterialComplementarioProps {
  videoId: string;
}

const Cuestionario = ({ preguntas }: { preguntas: Pregunta[] }) => {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const seleccionar = (preguntaId: number, opcionIdx: number) => {
    if (mostrarResultados) return;
    setRespuestas((prev) => ({ ...prev, [preguntaId]: opcionIdx }));
  };

  const correctas = preguntas.filter((p) => respuestas[p.id] === p.respuestaCorrecta).length;
  const todasRespondidas = Object.keys(respuestas).length === preguntas.length;

  const reiniciar = () => {
    setRespuestas({});
    setMostrarResultados(false);
  };

  return (
    <div className="space-y-4">
      {mostrarResultados && (
        <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">
              Resultado: {correctas}/{preguntas.length} correctas
            </p>
            <Progress
              value={(correctas / preguntas.length) * 100}
              className="h-2 mt-2 w-48 bg-muted [&>div]:bg-green-500"
            />
          </div>
          <Button size="sm" variant="outline" onClick={reiniciar}>
            Reintentar
          </Button>
        </div>
      )}

      {preguntas.map((p, idx) => {
        const seleccionada = respuestas[p.id];
        const esCorrecta = seleccionada === p.respuestaCorrecta;

        return (
          <div key={p.id} className="border border-border rounded-lg p-4">
            <p className="font-medium text-foreground mb-3">
              {idx + 1}. {p.texto}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {p.opciones.map((op, i) => {
                let classes = "text-left p-3 rounded-md border text-sm transition-colors ";
                if (mostrarResultados) {
                  if (i === p.respuestaCorrecta) {
                    classes += "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                  } else if (i === seleccionada && !esCorrecta) {
                    classes += "border-destructive bg-destructive/10 text-destructive";
                  } else {
                    classes += "border-border text-muted-foreground opacity-60";
                  }
                } else if (seleccionada === i) {
                  classes += "border-primary bg-primary/10 text-primary";
                } else {
                  classes += "border-border hover:border-primary/40 hover:bg-muted/50 text-foreground";
                }

                return (
                  <button key={i} className={classes} onClick={() => seleccionar(p.id, i)}>
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                    {op}
                  </button>
                );
              })}
            </div>
            {mostrarResultados && (
              <div className={`mt-3 p-3 rounded-md text-sm flex items-start gap-2 ${
                esCorrecta
                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                  : "bg-destructive/10 text-destructive"
              }`}>
                {esCorrecta ? <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" /> : <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                <span>{p.explicacion}</span>
              </div>
            )}
          </div>
        );
      })}

      {!mostrarResultados && (
        <Button onClick={() => setMostrarResultados(true)} disabled={!todasRespondidas} className="w-full">
          Verificar respuestas
        </Button>
      )}
    </div>
  );
};

const PodcastPlayer = ({ url, duracion }: { url: string; duracion?: string }) => (
  <div className="border border-border rounded-lg p-6 flex flex-col items-center gap-4">
    <div className="p-4 bg-primary/10 rounded-full">
      <Headphones className="h-10 w-10 text-primary" />
    </div>
    <p className="text-foreground font-medium">Podcast del tema</p>
    {duracion && <p className="text-sm text-muted-foreground">Duración: {duracion}</p>}
    <audio controls className="w-full max-w-md" preload="none">
      <source src={url} type="audio/mpeg" />
      Tu navegador no soporta el reproductor de audio.
    </audio>
  </div>
);

const InfografiaViewer = ({ url, descripcion }: { url: string; descripcion: string }) => (
  <div className="border border-border rounded-lg p-4">
    <div className="aspect-[3/4] bg-muted/30 rounded-md overflow-hidden flex items-center justify-center">
      <img src={url} alt={descripcion} className="max-w-full max-h-full object-contain" loading="lazy" />
    </div>
    <p className="text-sm text-muted-foreground mt-3 text-center">{descripcion}</p>
    <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2">
      <Button size="sm" variant="outline" className="w-full">
        <ZoomIn className="h-4 w-4 mr-1" />
        Ver tamaño completo
      </Button>
    </a>
  </div>
);

const PdfViewer = ({ url, titulo }: { url: string; titulo: string }) => (
  <div className="border border-border rounded-lg p-6 flex flex-col items-center gap-4">
    <div className="p-4 bg-primary/10 rounded-full">
      <FileText className="h-10 w-10 text-primary" />
    </div>
    <p className="text-foreground font-medium">{titulo}</p>
    <div className="flex gap-2">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="outline">
          <ZoomIn className="h-4 w-4 mr-1" />
          Ver PDF
        </Button>
      </a>
      <a href={url} download>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1" />
          Descargar
        </Button>
      </a>
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

  const hasCuestionario = !!material.cuestionario;
  const hasPodcast = !!material.podcast;
  const hasInfografia = !!material.infografia;
  const hasPdf = !!material.pdf;
  const hasQuiz = !!material.quiz;
  const hasAny = hasCuestionario || hasPodcast || hasInfografia || hasPdf || hasQuiz;

  if (!hasAny) return null;

  const defaultTab = hasCuestionario ? "cuestionario" : hasQuiz ? "quiz" : hasPodcast ? "podcast" : hasInfografia ? "infografia" : "pdf";

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">📚 Material Complementario</h3>
        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {hasCuestionario && (
              <TabsTrigger value="cuestionario" className="gap-1.5 text-xs sm:text-sm">
                <ClipboardList className="h-4 w-4" />
                Cuestionario
              </TabsTrigger>
            )}
            {hasPodcast && (
              <TabsTrigger value="podcast" className="gap-1.5 text-xs sm:text-sm">
                <Headphones className="h-4 w-4" />
                Podcast
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
                PDF
              </TabsTrigger>
            )}
            {hasQuiz && (
              <TabsTrigger value="quiz" className="gap-1.5 text-xs sm:text-sm">
                <PenLine className="h-4 w-4" />
                📝 QUIZ
              </TabsTrigger>
            )}
          </TabsList>

          {hasCuestionario && (
            <TabsContent value="cuestionario">
              <Cuestionario preguntas={material.cuestionario!.preguntas} />
            </TabsContent>
          )}
          {hasPodcast && (
            <TabsContent value="podcast">
              <PodcastPlayer url={material.podcast!.url} duracion={material.podcast!.duracion} />
            </TabsContent>
          )}
          {hasInfografia && (
            <TabsContent value="infografia">
              <InfografiaViewer url={material.infografia!.url} descripcion={material.infografia!.descripcion} />
            </TabsContent>
          )}
          {hasPdf && (
            <TabsContent value="pdf">
              <PdfViewer url={material.pdf!.url} titulo={material.pdf!.titulo} />
            </TabsContent>
          )}
          {hasQuiz && (
            <TabsContent value="quiz">
              <div className="border border-border rounded-lg overflow-hidden">
                <iframe
                  src={material.quiz!.url}
                  width="100%"
                  height="800"
                  frameBorder="0"
                  title="Quiz"
                  className="bg-background"
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MaterialComplementario;
