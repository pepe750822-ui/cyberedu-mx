import { useState, useMemo } from "react";
import { GraduationCap, BookOpen, Video, CheckCircle, ArrowUpDown, Goal, Trophy, RotateCcw } from "lucide-react";
import { areas } from "@/data/areas";
import { getAreaNotebookKeys } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import AreaCard from "@/components/AreaCard";
import Header from "@/components/Header";
import ProgresoDashboard from "@/components/ProgresoDashboard";
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
      <section className="relative overflow-hidden mb-12">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Estudiantes preparándose" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient opacity-85" />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-left duration-700">
              <GraduationCap className="h-4 w-4" />
              Examen de Educación Media Superior
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight text-balance animate-in fade-in slide-in-from-left duration-1000">
              Tu camino al éxito empieza aquí
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed max-w-lg animate-in fade-in slide-in-from-left duration-1000 delay-150">
              Prepárate con {totalVideos} videos organizados en {areas.length} áreas de conocimiento. Estudia a tu ritmo, desde cualquier lugar.
            </p>
            <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
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

      {/* Dashboard de Progreso Personalizado */}
      <section className="container mx-auto px-4 relative z-10 -mt-20 md:-mt-24 mb-16">
        <ProgresoDashboard />
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
