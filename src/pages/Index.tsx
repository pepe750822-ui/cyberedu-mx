import { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  ExternalLink,
  ShoppingCart,
  Star,
  Brain,
  Award,
  ShieldCheck,
  Download,
  Share2,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { PredictiveFeedback } from "@/components/PredictiveFeedback";
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
    // SEO Dynamic Tags
    document.title = "BioReto Pro v3.0 - Simulador ECOEMS 2026 & Guía UNAM | CyberEdu MX";
    
    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Estudia para el ECOEMS 2026 y UNAM con BioReto Pro v3.0. Simuladores inteligentes, 90+ videos y seguimiento de progreso. ¡Acceso 100% gratuito!");
    }

    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "CyberEdu MX",
      "url": "https://cyberedumx.com",
      "logo": "https://cyberedumx.com/icons/icon-512x512.png",
      "description": "Plataforma educativa líder en preparación para exámenes de ingreso a media superior en México.",
      "sameAs": [
        "https://www.facebook.com/CyberEduMX",
        "https://twitter.com/CyberEduMX"
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);

    if (location.hash === "#areas") {
      const element = document.getElementById("areas");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }

    return () => {
      document.head.removeChild(script);
    };
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

  const [searchQuery, setSearchQuery] = useState("");
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const results: Array<{ areaId: string; videoId: string; title: string; areaName: string }> = [];
    
    areas.forEach(area => {
      area.videos.forEach(video => {
        const title = video.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (title.includes(query) || area.name.toLowerCase().includes(query)) {
          results.push({
            areaId: area.id,
            videoId: video.id,
            title: video.title,
            areaName: area.name
          });
        }
      });
    });
    
    return results.slice(0, 10);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden mb-12 border-b border-primary/20">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Estudiantes preparándose" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/70" />
          <div className="absolute inset-0 hero-gradient opacity-95" />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-sm font-medium px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-left duration-700 neon-border-purple">
              <GraduationCap className="h-4 w-4" />
              Examen de Educación Media Superior
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground mb-6 leading-tight text-balance animate-in fade-in slide-in-from-left duration-1000">
              Tu camino al <span className="text-gradient-purple underline decoration-primary/30 underline-offset-8">éxito</span> <br /> empieza aquí
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg animate-in fade-in slide-in-from-left duration-1000 delay-150">
              Prepárate con esta plataforma de <span className="text-accent font-bold">última generación</span>. 100% gratuita y diseñada para que entres a la primera.
            </p>
            <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <div className="flex items-center gap-2 text-foreground/90 glass-card px-4 py-2 rounded-lg">
                <Video className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">{totalVideos} Videos HD</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/90 glass-card px-4 py-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{areas.length} Áreas Críticas</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/90 glass-card px-4 py-2 rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">{stats.completos} Completados</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/reportes")}
                className="flex items-center gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 px-4 py-2 rounded-lg transition-all font-bold"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Ver Analíticos</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 📚 Buscador de Contenido Gratuito */}
      <section className="container mx-auto px-4 relative z-20 mb-12">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-card/80 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-visible">
            <div className="absolute -right-10 -top-10 opacity-[0.05] pointer-events-none">
              <Search className="h-64 w-64 text-primary" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Acceso 100% Libre</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground max-w-4xl text-balance">
                📚 Busca tu tema y accede al material completo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 italic">
                  Videos + Infografías + PDFs + Podcasts + Quizzes — Todo GRATIS
                </span>
              </h2>
              
              <div className="w-full max-w-2xl relative">
                <div className="relative h-16 md:h-20 group/input">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none"></div>
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input 
                    type="text" 
                    placeholder="Ej: Biología Celular, Leyes de Newton, Geometría..."
                    className="h-full w-full pl-16 pr-6 rounded-2xl bg-slate-950/50 border-2 border-border focus:border-primary/50 text-lg md:text-xl font-medium transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Search Results */}
                <AnimatePresence>
                  {filteredTopics.length > 0 && (
                    <motion.div 
                      style={{ position: "absolute", zIndex: 100 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="top-full left-0 right-0 mt-4 bg-card/95 backdrop-blur-2xl border border-border rounded-2xl p-2 shadow-2xl overflow-y-auto max-h-[400px] divide-y divide-border scrollbar-thin scrollbar-thumb-primary/20"
                    >
                      {filteredTopics.map((topic, i) => (
                        <button
                          key={`${topic.areaId}-${topic.videoId}-${i}`}
                          onClick={() => navigate(`/area/${topic.areaId}?video=${topic.videoId}`)}
                          className="w-full flex items-center justify-between p-4 hover:bg-primary/5 transition-colors text-left group first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-0.5">{topic.areaName}</p>
                            <p className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">{topic.title}</p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-emerald-500" /> Sin registro forzoso</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-blue-500" /> Multimedia Premium</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-violet-500" /> Disponible 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard de Progreso Personalizado */}
      <section className="container mx-auto px-4 relative z-10 mt-12 mb-16 space-y-12">
        <PredictiveFeedback />
        <PlanEstudioDiario />
        <UltimoVideoCard />

        {/* Simuladores Premium Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-card border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Trophy className="h-48 w-48 text-foreground -rotate-12" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Zap className="h-4 w-4 animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-widest">NUEVO: Acceso Libre</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                  Simulador <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500 italic">Oficial ECOEMS</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl font-medium leading-relaxed">
                  Pon a prueba tus conocimientos con una réplica exacta del examen real. Cronómetro oficial, resultados con predicción AI y explicaciones paso a paso.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border">
                    <Target className="h-3 w-3 text-emerald-500" /> 128 Reactivos
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border">
                    <Clock className="h-3 w-3 text-indigo-500" /> 3 Horas
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border">
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
                  className="h-14 rounded-2xl border-border hover:bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground group transition-all"
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

        {/* 🎯 Metas del Mes Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Persistencia",
              desc: "Completa 5 días seguidos de estudio",
              progress: Math.min(Math.round((parseInt(localStorage.getItem('study_streak_count') || '0') / 5) * 100), 100),
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              icon: Zap
            },
            {
              title: "Maestro de Área",
              desc: "Llega al 100% en al menos un área",
              progress: Math.min(Math.round((completedAreas / 1) * 100), 100),
              color: "text-purple-400",
              bg: "bg-purple-500/10",
              icon: Brain
            },
            {
              title: "Simulacro",
              desc: "Realiza tu primer simulador integral",
              progress: parseInt(localStorage.getItem('completed_simulators') || '0') > 0 ? 100 : 0,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              icon: Trophy
            }
          ].map((goal, i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-3xl group shadow-sm hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className={cn("p-3 rounded-2xl", goal.bg, goal.color)}>
                  <goal.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tighter text-sm text-foreground">{goal.title}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Meta Mensual</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-1">{goal.desc}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Progreso</span>
                  <span className={goal.color}>{goal.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-1000", goal.progress === 100 ? "bg-emerald-500" : "bg-primary")}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🏆 Digital Certifications Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-card border border-amber-500/20 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-xl shadow-amber-500/5">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Award className="h-48 w-48 text-amber-600 rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-6 text-center lg:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500">
                  <Star className="h-3.5 w-3.5 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Recompensa Académica</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                  Obtén tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-200 dark:to-amber-500 italic">Certificación Digital</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl font-medium leading-relaxed">
                  Al completar tus simuladores con éxito, desbloquearás diplomas premium que avalan tu nivel de preparación. Descárgalos en PDF y compártelos en tus redes profesionales.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  {[
                    { label: "Válido p/ ECOEMS", icon: ShieldCheck },
                    { label: "PDF Alta Calidad", icon: Download },
                    { label: "Compartible", icon: Share2 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <item.icon className="h-3.5 w-3.5 text-amber-500" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <Button
                  onClick={() => navigate("/certificaciones")}
                  className="h-20 w-full lg:w-72 rounded-3xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xl font-black uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95 group"
                >
                  <Award className="mr-3 h-6 w-6" />
                  MIS LOGROS
                  <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Digital ECOEMS Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-card border border-border rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <BookOpen className="h-48 w-48 text-foreground -rotate-12" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Guía Completa</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                  Manual <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 italic">Digital ECOEMS</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl font-medium leading-relaxed">
                  Tu guía estratégica completa para dominar el examen. Temas desglosados, tips de estudio, ejercicios resueltos y todo lo que necesitas en un solo lugar.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border">
                    <BookOpen className="h-3 w-3 text-amber-500" /> Temario Completo
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border">
                    <Target className="h-3 w-3 text-orange-500" /> Ejercicios Resueltos
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border">
                    <Sparkles className="h-3 w-3 text-rose-500" /> Tips Estratégicos
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button
                  onClick={() => window.open("https://cyberedumx.com/libro/manual_digital_ECOEMS.html", "_blank")}
                  className="h-20 px-10 rounded-3xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-lg font-black uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95 group"
                >
                  <BookOpen className="mr-2 h-6 w-6" />
                  ABRIR MANUAL
                  <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Curso de Udemy - ECOEMS 2026: 128 Preguntas Resueltas con NotebookLM */}
        <div className="relative group" id="curso-udemy">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/40 rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.07] pointer-events-none">
              <Brain className="h-56 w-56 text-emerald-400 -rotate-12" />
            </div>
            <div className="absolute bottom-0 left-0 p-8 opacity-[0.04] pointer-events-none">
              <Star className="h-40 w-40 text-yellow-400 rotate-12" />
            </div>
            {/* Animated sparkles */}
            <div className="absolute top-6 left-1/4 h-2 w-2 bg-emerald-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-12 right-1/3 h-1.5 w-1.5 bg-yellow-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/3 right-1/4 h-1 w-1 bg-teal-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-5 text-center md:text-left flex-1">
                {/* Badges row */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 animate-bounce" style={{ animationDuration: '2s' }}>
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Curso de Paga</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                    <Brain className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">NotebookLM AI</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                    <Star className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Guía 2025 → 2026</span>
                  </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-tight">
                  ECOEMS 2026: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-300 dark:via-green-400 dark:to-teal-400 italic">128 Preguntas</span>
                  <br />
                  <span className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-300 dark:to-amber-400">Resueltas con NotebookLM</span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-xl font-medium leading-relaxed">
                  El <span className="text-emerald-500 font-bold">único recurso de paga</span> de la plataforma. Domina las 128 preguntas del examen con explicaciones detalladas potenciadas por IA con Google NotebookLM. Preparación definitiva para tu examen.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl border border-border">
                    <Target className="h-3.5 w-3.5 text-emerald-500" /> 128 Reactivos Resueltos
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl border border-border">
                    <Brain className="h-3.5 w-3.5 text-teal-400" /> Explicaciones con IA
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl border border-border">
                    <Video className="h-3.5 w-3.5 text-purple-400" /> Videos en Udemy
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl border border-border">
                    <Star className="h-3.5 w-3.5 text-yellow-500" /> Acceso de por Vida
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
                {/* Main CTA Button */}
                <a
                  href="https://www.udemy.com/course/ecoems2026conia/?referralCode=B2F05026985A2564FAAC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 h-20 px-10 rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 text-white text-lg font-black uppercase tracking-[0.15em] shadow-[0_10px_50px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_15px_60px_rgba(16,185,129,0.5)] group"
                >
                  <ShoppingCart className="h-6 w-6" />
                  IR AL CURSO
                  <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

                {/* Secondary info */}
                <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                  <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1">📚 Disponible en Udemy</p>
                  <p className="text-slate-400 text-[10px] font-medium">Este es el único recurso de paga de toda la plataforma</p>
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
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-foreground">Consola Studio: Por Materia</h2>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mt-1">Entrenamiento Intensivo (630+ Reactivos)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.filter(a => studioMapping[a.id]).map((area) => (
              <div
                key={area.id}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${area.gradientClass.split(' ')[1]}`} />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <area.icon className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-bold text-foreground text-sm">{area.name}</h4>
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
                      className="flex items-center justify-between w-full p-3 rounded-xl bg-muted/30 hover:bg-muted/60 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border"
                    >
                      <span className="truncate mr-2 uppercase tracking-tight">{sim.name}</span>
                      <ChevronRight className="h-3 w-3 text-primary shrink-0" />
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
