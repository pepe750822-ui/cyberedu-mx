import { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Video,
  CheckCircle,
  ArrowUpDown,
  Trophy,
  Zap,
  Target,
  Clock,
  BarChart3,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { areas } from "@/data/areas";
import { studioMapping, fullSimulators } from "@/data/studioMap";
import { getAreaNotebookKeys } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import AreaCard from "@/components/AreaCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgresoDashboard from "@/components/ProgresoDashboard";
import RecommendedVideos from "@/components/RecommendedVideos";
import UltimoVideoCard from "@/components/UltimoVideoCard";
import BadgeSystem from "@/components/BadgeSystem";
import WeeklyChallenges from "@/components/WeeklyChallenges";
import PlanEstudioDiario from "@/components/PlanEstudioDiario";
import NewsECOEMS from "@/components/NewsECOEMS";
import CountdownExam from "@/components/CountdownExam";
import StudioModal from "@/components/StudioModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-education.jpg";

const Index = () => {
  const navigate = useNavigate();
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

  const [activeSimulator, setActiveSimulator] = useState<{ url: string; title: string; description?: string } | null>(null);

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
        <PlanEstudioDiario />
        <UltimoVideoCard />

        {/* Simuladores Premium Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Trophy className="h-48 w-48 text-white -rotate-12" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <Zap className="h-4 w-4 animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest">NUEVO: Acceso Libre</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                  Simulador <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 italic">Oficial ECOEMS</span>
                </h2>
                <p className="text-slate-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                  Pon a prueba tus conocimientos con una réplica exacta del examen real. Cronómetro oficial, resultados con predicción AI y explicaciones paso a paso.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <Target className="h-3 w-3 text-emerald-500" /> 128 Reactivos
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <Clock className="h-3 w-3 text-indigo-500" /> 3 Horas
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <BarChart3 className="h-3 w-3 text-amber-500" /> Predicción AI
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button
                  onClick={() => navigate("/simulador-pro")}
                  className="h-20 px-10 rounded-3xl bg-primary hover:bg-primary/90 text-lg font-black uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95 group"
                >
                  SIMULADOR REAL
                  <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "https://cyberedumx.com/studio/nguia.html"}
                  className="h-14 rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 group transition-all"
                >
                  CONSOLA STUDIO (PRO)
                  <Zap className="ml-2 h-4 w-4 text-yellow-500 group-hover:scale-125 transition-transform" />
                </Button>

                {/* Nuevos Simuladores PHP */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `https://cyberedumx.com/simulador-ecoems-completo?origin=${encodeURIComponent(window.location.origin)}`}
                    className="flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-tighter border border-white/5 hover:bg-white/10 transition-all text-indigo-300 hover:text-indigo-200"
                  >
                    Simulador ECOEMS (Completo)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = `https://cyberedumx.com/ecoems2026/simuladores/simulador_politecnico.php?origin=${encodeURIComponent(window.location.origin)}`}
                    className="flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-tighter border border-white/5 hover:bg-white/10 transition-all text-rose-400 hover:text-rose-300"
                  >
                    Simulador POLI (IPN)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CountdownExam />
        <NewsECOEMS />
        <BadgeSystem />
        <WeeklyChallenges />
        <ProgresoDashboard />
        <RecommendedVideos className="p-6 bg-card/20 backdrop-blur-xl border border-border/50 rounded-3xl" />

        {/* Studio Simulators Section */}
        <div className="pt-16 pb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Consola Studio: Por Materia</h2>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Entrenamiento Intensivo (630+ Reactivos)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.filter(a => studioMapping[a.id]).map((area) => (
              <div
                key={area.id}
                className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/40 transition-all group relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${area.gradientClass.split(' ')[1]}`} />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <area.icon className="h-4 w-4 text-white/70" />
                    </div>
                    <h4 className="font-bold text-white text-sm">{area.name}</h4>
                  </div>
                </div>
                <div className="space-y-2">
                  {studioMapping[area.id].map((sim, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSimulator({
                        url: sim.path,
                        title: sim.name,
                        description: sim.description
                      })}
                      className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 hover:text-white transition-all border border-transparent hover:border-indigo-500/20"
                    >
                      <span className="truncate mr-2 uppercase tracking-tight">{sim.name}</span>
                      <ChevronRight className="h-3 w-3 text-indigo-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
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

export default Index;
