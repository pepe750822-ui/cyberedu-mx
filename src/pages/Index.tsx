import { useState, useMemo } from "react";
import { GraduationCap, BookOpen, Video, CheckCircle, ArrowUpDown, Goal, Trophy, RotateCcw } from "lucide-react";
import { areas } from "@/data/areas";
import { getAreaNotebookKeys } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import AreaCard from "@/components/AreaCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-education.jpg";

const Index = () => {
  const totalVideos = areas.reduce((acc, area) => acc + area.videoCount, 0);
  const { isViewed, viewedCount, totalVideos: total, resetProgress } = useVideoProgress();
  const [sortByProgress, setSortByProgress] = useState(false);

  const areaProgress = useMemo(() => {
    const map: Record<string, { viewed: number; total: number }> = {};
    for (const area of areas) {
      const keys = getAreaNotebookKeys(area.id);
      const viewed = keys.filter((k) => isViewed(k)).length;
      map[area.id] = { viewed, total: keys.length };
    }
    return map;
  }, [isViewed]);

  const sortedAreas = useMemo(() => {
    if (!sortByProgress) return areas;
    return [...areas].sort((a, b) => {
      const pA = areaProgress[a.id];
      const pB = areaProgress[b.id];
      const percA = pA.total > 0 ? pA.viewed / pA.total : 0;
      const percB = pB.total > 0 ? pB.viewed / pB.total : 0;
      return percB - percA;
    });
  }, [sortByProgress, areaProgress]);

  const globalPercent = total > 0 ? Math.round((viewedCount / total) * 100) : 0;

  const completedAreas = useMemo(() => {
    return areas.filter((area) => {
      const ap = areaProgress[area.id];
      return ap && ap.total > 0 && ap.viewed === ap.total;
    }).length;
  }, [areaProgress]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Estudiantes preparándose" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient opacity-85" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-4 w-4" />
              Examen de Educación Media Superior
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight text-balance">
              Tu camino al éxito empieza aquí
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed max-w-lg">
              Prepárate con {totalVideos} videos organizados en {areas.length} áreas de conocimiento. Estudia a tu ritmo, desde cualquier lugar.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <Video className="h-5 w-5" />
                <span className="text-sm font-medium">{totalVideos} Videos</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">{areas.length} Áreas</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">100% Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Progress */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <Card className="border-border shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Goal className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">Tu progreso general</h3>
                  <p className="text-sm text-muted-foreground">
                    Has completado {viewedCount} de {total} materiales
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <Progress value={globalPercent} className="h-3 flex-1 bg-secondary [&>div]:bg-primary" />
                    <span className="text-sm font-bold text-foreground min-w-[3ch]">{globalPercent}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 md:gap-8">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-foreground">{globalPercent}%</p>
                  <p className="text-xs text-muted-foreground">📊 Completado</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-foreground">{completedAreas}</p>
                  <p className="text-xs text-muted-foreground">🏆 Áreas listas</p>
                </div>
                <Button variant="outline" size="sm" onClick={resetProgress}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reiniciar todo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Areas Section */}
      <section id="areas" className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Áreas de Conocimiento
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Selecciona un área para comenzar a estudiar con nuestros videos
          </p>
        </div>
        <div className="flex justify-end mb-4">
          <Button
            variant={sortByProgress ? "default" : "outline"}
            size="sm"
            onClick={() => setSortByProgress((v) => !v)}
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {sortByProgress ? "Orden original" : "Ordenar por progreso"}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedAreas.map((area, index) => {
            const ap = areaProgress[area.id];
            return (
              <AreaCard
                key={area.id}
                area={area}
                index={index}
                viewedCount={ap?.viewed ?? 0}
                totalCount={ap?.total}
              />
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 PrepáraTE — Preparación para el examen de educación media superior
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
