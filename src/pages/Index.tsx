import { useMemo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GraduationCap, BookOpen, Video, CheckCircle, ArrowUpDown } from "lucide-react";
import { areas } from "@/data/areas";
import { getAreaNotebookKeys } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import AreaCard from "@/components/AreaCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgresoDashboard from "@/components/ProgresoDashboard";
import RecommendedVideos from "@/components/RecommendedVideos";
import UltimoVideoCard from "@/components/UltimoVideoCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-education.jpg";

const Index = () => {
  const totalVideos = areas.reduce((acc, area) => acc + area.videoCount, 0);
  const {
    isViewed,
    viewedCount,
    totalVideos: total,
    resetProgress,
    getEstadisticas
  } = useVideoProgress();

  const stats = getEstadisticas();
  const [sortByProgress, setSortByProgress] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#areas") {
      const element = document.getElementById("areas");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

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
      <section className="relative overflow-hidden mb-12 border-b border-primary/20">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Estudiantes preparándose" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient opacity-90" />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-sm font-medium px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-left duration-700 neon-border-purple">
              <GraduationCap className="h-4 w-4" />
              Examen de Educación Media Superior
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight text-balance animate-in fade-in slide-in-from-left duration-1000">
              Tu camino al <span className="text-gradient-purple underline decoration-primary/30 underline-offset-8">éxito</span> <br /> empieza aquí
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-8 leading-relaxed max-w-lg animate-in fade-in slide-in-from-left duration-1000 delay-150">
              Prepárate con esta plataforma de <span className="text-accent font-bold">última generación</span>. 100% gratuita y diseñada para que entres a la primera.
            </p>
            <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="flex items-center gap-2 text-white/90 glass-card px-4 py-2 rounded-lg">
                <Video className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">{totalVideos} Videos HD</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 glass-card px-4 py-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{areas.length} Áreas Críticas</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 glass-card px-4 py-2 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">{stats.completos} Completados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard de Progreso Personalizado */}
      <section className="container mx-auto px-4 relative z-10 -mt-20 md:-mt-24 mb-16 space-y-12">
        <UltimoVideoCard />
        <ProgresoDashboard />
        <RecommendedVideos className="p-6 bg-card/20 backdrop-blur-xl border border-border/50 rounded-3xl" />
      </section>

      {/* Areas Section */}
      <section id="areas" className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-gradient-blue italic">
            Sistemas de Aprendizaje
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
            Entrena en las áreas que el examen demanda. Domina cada módulo y asegura tu lugar.
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

      <Footer />
    </div>
  );
};

export default Index;
