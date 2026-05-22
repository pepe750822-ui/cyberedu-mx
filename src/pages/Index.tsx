import { useMemo, useEffect, useState, lazy, Suspense, useRef } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
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
  Search,
  X,
  Bot,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { areas } from "@/data/areas";
import { studioMapping, fullSimulators } from "@/data/studioMap";
import { getAreaNotebookKeys } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import AreaCard from "@/components/AreaCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DailyChallenge } from "@/components/DailyChallenge";

// Lazy loading heavy dashboard components for CWV optimization
const ProgresoDashboard = lazy(() => import("@/components/ProgresoDashboard"));
const RecommendedVideos = lazy(() => import("@/components/RecommendedVideos"));
const UltimoVideoCard = lazy(() => import("@/components/UltimoVideoCard"));
const BadgeSystem = lazy(() => import("@/components/BadgeSystem"));
const WeeklyChallenges = lazy(() => import("@/components/WeeklyChallenges"));
const PlanEstudioDiario = lazy(() => import("@/components/PlanEstudioDiario"));
const NewsECOEMS = lazy(() => import("@/components/NewsECOEMS"));
const CountdownExam = lazy(() => import("@/components/CountdownExam"));
const StudioModal = lazy(() => import("@/components/StudioModal"));
const PredictiveFeedback = lazy(() => import("@/components/PredictiveFeedback").then(m => ({ default: m.PredictiveFeedback })));

const AI_TUTOR_DISMISSED_KEY = 'cyberedu_ai_tutor_banner_dismissed';

// Deterministic particle positions — no random on each render
const PARTICLES = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: +((i * 7.3 + 11) % 100).toFixed(1),
  y: +((i * 13.7 + 5) % 100).toFixed(1),
  size: (i % 3) + 1,
  dur: (i % 4) + 2,
  delay: +((i % 5) * 0.7).toFixed(1),
}));

// 20 neuron positions arranged in a brain-like bilateral cluster
const NEURON_POSITIONS: [number, number, number][] = [
  [-1.2, 0.6, 0.1], [-0.8, 0.9, -0.3], [-1.4, 0.2, -0.2],
  [-0.6, 0.3, 0.6], [-1.0, -0.2, 0.4], [-0.5, 0.7, -0.6],
  [-0.3, -0.4, 0.2], [-1.1, 0.5, 0.5], [-0.7, -0.6, -0.1],
  [-0.3, 0.1, -0.5], [ 1.2, 0.6, 0.1], [ 0.8, 0.9, -0.3],
  [ 1.4, 0.2, -0.2], [ 0.6, 0.3, 0.6], [ 1.0, -0.2, 0.4],
  [ 0.5, 0.7, -0.6], [ 0.3, -0.4, 0.2], [ 1.1, 0.5, 0.5],
  [ 0.7, -0.6, -0.1], [ 0.3, 0.1, -0.5],
];

// Compute edges between neurons closer than threshold — runs once at module load
const CONNECTIONS: [number, number][] = (() => {
  const edges: [number, number][] = [];
  for (let i = 0; i < NEURON_POSITIONS.length; i++) {
    for (let j = i + 1; j < NEURON_POSITIONS.length; j++) {
      const [x1, y1, z1] = NEURON_POSITIONS[i];
      const [x2, y2, z2] = NEURON_POSITIONS[j];
      const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
      if (d < 1.0) edges.push([i, j]);
    }
  }
  return edges;
})();

function NeuralBrain() {
  const groupRef = useRef<any>(null);
  const pulseRefs = useRef<(any | null)[]>([]);
  // Stagger pulse start positions so they don't all move in sync
  const progress = useRef<number[]>(
    CONNECTIONS.map((_, i) => (i / CONNECTIONS.length))
  );

  useFrame((state, delta) => {
    // Slow auto-rotation + gentle oscillation on X
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
    // Move each pulse along its connection using direct position mutation (no re-render)
    CONNECTIONS.forEach(([a, b], i) => {
      const speed = 0.3 + (i % 4) * 0.08;
      progress.current[i] = (progress.current[i] + delta * speed) % 1;
      const p = progress.current[i];
      const [x1, y1, z1] = NEURON_POSITIONS[a];
      const [x2, y2, z2] = NEURON_POSITIONS[b];
      if (pulseRefs.current[i]) {
        pulseRefs.current[i].position.set(
          x1 + (x2 - x1) * p,
          y1 + (y2 - y1) * p,
          z1 + (z2 - z1) * p
        );
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Neuron nodes */}
      {NEURON_POSITIONS.map((pos, i) => (
        <mesh key={`n-${i}`} position={pos}>
          <sphereGeometry args={[i % 5 === 0 ? 0.10 : 0.065, 16, 16]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#f59e0b" : "#7c3aed"}
            emissive={i % 4 === 0 ? "#f59e0b" : "#7c3aed"}
            emissiveIntensity={i % 4 === 0 ? 2.5 : 1.8}
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Synaptic connections */}
      {CONNECTIONS.map(([a, b], i) => (
        <Line
          key={`l-${i}`}
          points={[NEURON_POSITIONS[a], NEURON_POSITIONS[b]]}
          color="#7c3aed"
          lineWidth={0.8}
          opacity={0.28}
          transparent
        />
      ))}

      {/* Traveling light pulses — positions updated imperatively in useFrame */}
      {CONNECTIONS.map(([a, b], i) => {
        const [x1, y1, z1] = NEURON_POSITIONS[a];
        const [x2, y2, z2] = NEURON_POSITIONS[b];
        const p = progress.current[i];
        return (
          <mesh
            key={`p-${i}`}
            ref={(el) => { pulseRefs.current[i] = el; }}
            position={[x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, z1 + (z2 - z1) * p]}
          >
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#f59e0b" : "#a855f7"}
              emissive={i % 3 === 0 ? "#f59e0b" : "#a855f7"}
              emissiveIntensity={5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
        setTilt({ x: y, y: x });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Real-time countdown to exam
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const EXAM = new Date("2026-06-20T00:00:00").getTime();
    const tick = () => {
      const diff = EXAM - Date.now();
      if (diff > 0) {
        setCountdown({
          d: Math.floor(diff / 86400000),
          h: Math.floor((diff % 86400000) / 3600000),
          m: Math.floor((diff % 3600000) / 60000),
          s: Math.floor((diff % 60000) / 1000),
        });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Urgency date logic for COMIPEMS 2026
  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  const registroFin = new Date("2026-05-22");
  registroFin.setHours(0, 0, 0, 0);
  const examenFecha = new Date("2026-06-20");
  examenFecha.setHours(0, 0, 0, 0);
  const isRegistroOpen = nowDate <= registroFin;
  const daysToExam = Math.ceil((examenFecha.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("open") === "tutor") {
      window.dispatchEvent(new CustomEvent("cyberedu:open-chat"));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    document.title = "CyberEdu MX — Prepárate para el ECOEMS 2026";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Domina el ECOEMS 2026 con CyberEdu MX. Tutor IA 24/7, 19 Laboratorios Virtuales, simuladores inteligentes y 90+ videos. ¡15 preguntas gratis al día!");
    }

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
  const [aiTutorDismissed, setAiTutorDismissed] = useState(
    () => localStorage.getItem(AI_TUTOR_DISMISSED_KEY) === "true"
  );

  const dismissAiTutor = () => {
    localStorage.setItem(AI_TUTOR_DISMISSED_KEY, "true");
    setAiTutorDismissed(true);
  };

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const results: Array<{ areaId: string; videoId: string; title: string; areaName: string }> = [];

    areas.forEach(area => {
      area.videos.forEach(video => {
        const title = video.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
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
    // Root div with forced dark class so all dark: Tailwind variants activate
    <div className="min-h-screen dark" style={{ background: "#0a0a0f" }}>
      <Header />

      {/* ── Urgency Banner ── */}
      <div className="min-h-[48px]">
        {isRegistroOpen ? (
          <div className="w-full bg-red-600 text-white text-center py-3 px-4 font-black text-sm md:text-base animate-pulse">
            ⚠️ ÚLTIMO DÍA para registrarte al COMIPEMS — Cierra el 22 de mayo ⚠️
          </div>
        ) : daysToExam > 0 ? (
          <div className="w-full bg-orange-600 text-white text-center py-3 px-4 font-black text-sm md:text-base">
            🗓️ El examen COMIPEMS es en <span className="underline">{daysToExam} días</span> — ¡Sigue entrenando!
          </div>
        ) : null}
      </div>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#0a0a0f" }}>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-violet-400 opacity-20 animate-pulse"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(124,58,237,0.18)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(245,158,11,0.1)", filter: "blur(60px)" }} />

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — text + countdown */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border text-violet-400 text-[11px] font-black px-4 py-2 rounded-full mb-6 uppercase tracking-widest" style={{ background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.3)" }}>
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
                </span>
                ECOEMS 2026 · 20-28 Junio · Prepárate Ya
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 leading-tight">
                {daysToExam <= 30 ? (
                  <>
                    ¡Último mes!<br />
                    <span style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      El ECOEMS es en {daysToExam} días
                    </span>
                  </>
                ) : (
                  <>
                    Aprueba el ECOEMS<br />
                    <span style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      en {daysToExam} días
                    </span>
                  </>
                )}
              </h1>

              {/* Live countdown */}
              <div className="flex gap-3 mb-8">
                {[
                  { val: countdown.d, label: "Días" },
                  { val: countdown.h, label: "Horas" },
                  { val: countdown.m, label: "Min" },
                  { val: countdown.s, label: "Seg" },
                ].map(({ val, label }) => (
                  <div key={label} className="text-center rounded-2xl px-3 py-3 md:px-5" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                    <div className="text-3xl md:text-4xl font-black text-white tabular-nums">{String(val).padStart(2, "0")}</div>
                    <div className="text-[10px] text-violet-400 font-black uppercase tracking-widest mt-1">{label}</div>
                  </div>
                ))}
              </div>

              <p className="text-lg text-slate-300 mb-6 leading-relaxed max-w-lg">
                <span className="text-white font-bold">Tutor IA disponible 24/7</span> +{" "}
                <span className="text-violet-400 font-bold">19 Laboratorios Virtuales</span> para dominar cada tema del examen.
              </p>

              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-violet-500/30" />
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-violet-400 flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Powered by Claude AI
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Video className="h-5 w-5 text-violet-400" />
                  <span className="text-sm font-semibold text-white">{totalVideos} Videos HD</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <BookOpen className="h-5 w-5 text-violet-400" />
                  <span className="text-sm font-semibold text-white">{areas.length} Áreas Críticas</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">{stats.completos} Completados</span>
                </div>
              </div>

              {/* Primary CTA — violet glow */}
              <button
                onClick={() => navigate("/simulador-pro")}
                className="font-black px-8 py-5 rounded-2xl text-white text-base md:text-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  boxShadow: "0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.15)",
                }}
              >
                🚀 Practica ahora — El examen es en {daysToExam} días
              </button>
            </div>

            {/* Right — 3D floating sphere */}
            <div className="hidden lg:flex items-center justify-center" style={{ height: "480px" }}>
              <Suspense fallback={null}>
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 45 }}
                  gl={{ alpha: true }}
                  style={{ background: "transparent" }}
                >
                  <ambientLight intensity={0.5} />
                  <pointLight position={[5, 5, 5]} intensity={2.5} color="#7c3aed" />
                  <pointLight position={[-5, -5, 5]} intensity={1.2} color="#f59e0b" />
                  <pointLight position={[0, -5, -5]} intensity={0.5} color="#a855f7" />
                  <NeuralBrain />
                </Canvas>
              </Suspense>
            </div>

          </div>
        </div>

        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0a0a0f)" }} />
      </section>

      {/* ── STATS (glassmorphism) ─────────────────────────── */}
      <section className="relative z-10 mx-4 mb-6 -mt-4">
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { num: "2,800+", label: "Estudiantes preparándose", icon: "🎓" },
            { num: "512",    label: "Reactivos tipo examen",    icon: "📝" },
            { num: "44",     label: "Videos Guía 2026",         icon: "🎬" },
          ].map((stat) => (
            <div
              key={stat.num}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl md:text-2xl font-black text-white">{stat.num}</div>
              <div className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Promo Paquete Completo (3D tilt) ─────────────── */}
      <TiltCard className="mx-4 mb-4">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/40 rounded-2xl p-5">
          <div className="text-center mb-3">
            <span className="bg-yellow-400 text-black font-black text-xs px-3 py-1 rounded-full">🔥 OFERTA ESPECIAL</span>
          </div>
          <h2 className="text-white font-black text-xl text-center mb-2">
            Paquete Completo — 100 tokens
          </h2>
          <div className="text-gray-300 text-sm mb-4 space-y-1">
            <div>✅ 44 videos Guía 2026 con infografías y PDFs</div>
            <div>✅ Todos los simuladores desbloqueados</div>
            <div>✅ Guías Oficiales UNAM 2021-2026 <span className="bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-full ml-1">🆕 NUEVA</span></div>
            <div>✅ Acceso de por vida</div>
          </div>
          <button
            onClick={() => navigate("/tokens")}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3 rounded-xl text-lg hover:scale-105 transition-transform"
          >
            🪙 Obtener con 100 tokens — desde $20 MXN
          </button>
        </div>
      </TiltCard>

      {/* ── Banner Temario 2026 ───────────────────────────── */}
      <div className="mx-4 mb-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
        <p className="text-blue-300 text-sm font-semibold mb-3">
          📋 <strong>Nuevo Temario 2026:</strong> Temas actualizados de Formación Cívica, Historia moderna y Geografía digital.
        </p>
        <button
          onClick={() => navigate("/guia2026")}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black py-3 rounded-xl hover:scale-105 transition-transform"
        >
          📖 Ver Guía de Estudio 2026 — 44 Videos
        </button>
      </div>

      {/* ── Última Hora COMIPEMS 2026 ────────────────────── */}
      <section className="w-full bg-yellow-400 text-yellow-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🚨</span>
            <h2 className="text-xl font-black uppercase tracking-wide">Última Hora COMIPEMS 2026</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-yellow-900/10 rounded-2xl p-4 flex items-start gap-3 border border-yellow-900/20">
              <span className="text-2xl leading-none animate-pulse">🔴</span>
              <div>
                <p className="font-black text-sm uppercase tracking-wide">18–22 Mayo</p>
                <p className="text-xs font-semibold mt-0.5">Registro al COMIPEMS — ¡No pierdas tu lugar!</p>
              </div>
            </div>
            <div className="bg-yellow-900/10 rounded-2xl p-4 flex items-start gap-3 border border-yellow-900/20">
              <span className="text-2xl leading-none">🟡</span>
              <div>
                <p className="font-black text-sm uppercase tracking-wide">23 Mayo</p>
                <p className="text-xs font-semibold mt-0.5">Cierre definitivo de registro COMIPEMS</p>
              </div>
            </div>
            <div className="bg-yellow-900/10 rounded-2xl p-4 flex items-start gap-3 border border-yellow-900/20">
              <span className="text-2xl leading-none">🟢</span>
              <div>
                <p className="font-black text-sm uppercase tracking-wide">20 Junio 2026</p>
                <p className="text-xs font-semibold mt-0.5">Día del examen — Quedan {daysToExam} días para prepararte</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reto Diario Express ──────────────────────────── */}
      <div className="container mx-auto px-4 pt-12 -mb-8 min-h-[120px]">
        <DailyChallenge />
      </div>

      {/* ── Areas Section ────────────────────────────────── */}
      <section id="areas" className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-black mb-4 text-white">
              Sistemas de Aprendizaje
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
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
            <div
              onClick={() => navigate("/simulador-pro")}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-card border-2 border-indigo-500/30 shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:text-indigo-400 transition-colors">
                    Simulador ECOEMS 2026
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    512 reactivos · 4 bancos · Modo mixto · Aleatorio
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-6 flex items-center text-sm font-bold text-indigo-500 uppercase tracking-widest">
                Iniciar Simulacro <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            {sortedAreas.map((area, index) => {
              const ap = areaProgress[area.id];
              return (
                <AreaCard
                  key={area.id}
                  area={area}
                  index={index + 1}
                  viewedCount={ap?.viewed ?? 0}
                  totalCount={ap?.total}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI Tutor Showcase ────────────────────────────── */}
      <AnimatePresence>
        {!aiTutorDismissed && (
          <motion.section
            key="ai-tutor-banner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-4 mb-12"
          >
            <div className="relative">
              <div className="relative bg-slate-900 border border-slate-700 rounded-[2rem] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">

                <button
                  onClick={dismissAiTutor}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                        <Bot className="h-6 w-6 text-violet-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-display font-black text-white leading-tight">
                          Tu Tutor IA para el ECOEMS 2026
                        </h2>
                        <p className="text-sm text-slate-400 font-medium mt-0.5">
                          Powered by <span className="text-violet-400 font-bold">Claude AI · Anthropic</span>
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-black uppercase tracking-widest text-violet-400 w-fit">
                      <Sparkles className="h-3 w-3" /> Nuevo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
                    {[
                      { emoji: "🌍", query: "Muéstrame México en el globo terráqueo interactivo", label: 'Escribe "México"', desc: "aparece el globo interactivo" },
                      { emoji: "🫀", query: "sistema circulatorio", label: 'Escribe "sistema circulatorio"', desc: "cuerpo humano 3D" },
                      { emoji: "☀️", query: "sistema solar", label: 'Escribe "sistema solar"', desc: "navega los planetas" },
                      { emoji: "🔢", query: "resolver ecuaciones", label: "Pide resolver ecuaciones", desc: "paso a paso" },
                      { emoji: "📅", query: "Independencia de México", label: "Pregunta Historia", desc: "línea del tiempo interactiva" },
                    ].map((item) => (
                      <button
                        key={item.emoji}
                        onClick={() => window.dispatchEvent(new CustomEvent("cyberedu:open-chat", { detail: { message: item.query } }))}
                        className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-violet-900/30 hover:border-violet-600/20 transition-all text-left group/cap"
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className="text-[11px] font-black text-white leading-snug group-hover/cap:text-violet-400 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">→ {item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {user ? (
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("cyberedu:open-chat"))}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-sm"
                      >
                        <Bot className="h-4 w-4" />
                        Ir al Tutor IA
                      </button>
                    ) : (
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent("cyberedu:open-chat"))}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm uppercase tracking-widest transition-all shadow-sm"
                      >
                        <Zap className="h-4 w-4" />
                        Pruébalo gratis
                      </button>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      Sin registro: 15 preguntas gratis al instante · Con cuenta gratuita: 15 preguntas diarias · También en Telegram: <span className="text-cyan-400 font-bold">@CyberEduMXBot</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Buscador de Contenido ────────────────────────── */}
      <section className="bg-slate-900 border-b border-slate-700">
        <div className="container mx-auto px-4 py-12 relative z-20">
          <div className="relative bg-slate-900 border border-slate-700 rounded-[2rem] p-8 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-visible">
            <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none">
              <Search className="h-64 w-64 text-white" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-900/30 border border-violet-600/20 text-violet-400">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Acceso 100% Libre</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-display font-black text-white max-w-4xl text-balance">
                Busca tu tema y accede al material completo <br />
                <span className="text-slate-400 text-2xl md:text-3xl font-semibold">
                  Videos · Infografías · PDFs · Podcasts — Todo GRATIS
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

                <AnimatePresence>
                  {filteredTopics.length > 0 && (
                    <motion.div
                      style={{ position: "absolute", zIndex: 100 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="top-full left-0 right-0 mt-4 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-y-auto max-h-[400px] divide-y divide-slate-700"
                    >
                      {filteredTopics.map((topic, i) => (
                        <button
                          key={`${topic.areaId}-${topic.videoId}-${i}`}
                          onClick={() => navigate(`/area/${topic.areaId}?video=${topic.videoId}`)}
                          className="w-full flex items-center justify-between p-4 hover:bg-violet-900/30 transition-colors text-left group first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-0.5">{topic.areaName}</p>
                            <p className="text-sm md:text-base font-bold text-white group-hover:text-violet-400 transition-colors truncate">{topic.title}</p>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-violet-900/30 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-emerald-400" /> 100% Gratis - Empieza ahora</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-violet-400" /> Multimedia Premium</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-violet-400" /> Disponible 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard & Remaining Sections ──────────────── */}
      <section className="bg-slate-800/40 border-t border-slate-700">
        <div className="container mx-auto px-4 relative z-10 py-16 space-y-12">

          <Suspense fallback={<div className="h-24 animate-pulse bg-muted rounded-3xl" />}>
            <PredictiveFeedback />
          </Suspense>
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-3xl" />}>
            <PlanEstudioDiario />
          </Suspense>
          <Suspense fallback={<div className="h-48 animate-pulse bg-muted rounded-3xl" />}>
            <UltimoVideoCard />
          </Suspense>

          {/* Simuladores Premium CTA */}
          <div className="relative">
            <div className="relative bg-gray-900 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="absolute top-0 right-0 p-12 opacity-[0.06] pointer-events-none">
                <Trophy className="h-48 w-48 text-white -rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">
                    <Zap className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Acceso Libre</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-black text-white">
                    Simulador Oficial ECOEMS
                  </h2>
                  <p className="text-white/70 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                    Pon a prueba tus conocimientos con una réplica exacta del examen real. Cronómetro oficial, resultados con predicción AI y explicaciones paso a paso.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                      <Target className="h-3 w-3 text-white/80" /> 128 Reactivos
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                      <Clock className="h-3 w-3 text-white/80" /> 3 Horas
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                      <BarChart3 className="h-3 w-3 text-white/80" /> Predicción AI
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <Button
                    onClick={() => navigate("/simulador-pro")}
                    className="h-20 px-10 rounded-3xl bg-white hover:bg-gray-100 text-gray-900 text-lg font-black uppercase tracking-[0.2em] shadow-[0_10px_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95 group"
                  >
                    SIMULADOR REAL
                    <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  <Button
                    onClick={() => window.location.href = "https://cyberedumx.com/studio/nguia.html"}
                    className="h-14 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest text-white group transition-all"
                  >
                    CONSOLA STUDIO (PRO)
                    <Zap className="ml-2 h-4 w-4 text-yellow-400 group-hover:scale-125 transition-transform" />
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.location.href = `https://cdn.cyberedumx.com/ecoems2026/simuladores/simulador_completo.php?origin=${encodeURIComponent(window.location.origin)}`}
                      className="flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-tighter bg-white/5 border border-white/10 hover:bg-white/15 transition-all text-white/70 hover:text-white"
                    >
                      Simulador ECOEMS (Completo)
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.location.href = `https://cyberedumx.com/ecoems2026/simuladores/simulador_politecnico.php?origin=${encodeURIComponent(window.location.origin)}`}
                      className="flex-1 h-12 rounded-xl text-[9px] font-black uppercase tracking-tighter bg-white/5 border border-white/10 hover:bg-white/15 transition-all text-white/70 hover:text-white"
                    >
                      Simulador POLI (IPN)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metas del Mes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Persistencia",
                desc: "Completa 5 días seguidos de estudio",
                progress: Math.min(Math.round((parseInt(localStorage.getItem("study_streak_count") || "0") / 5) * 100), 100),
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
                progress: parseInt(localStorage.getItem("completed_simulators") || "0") > 0 ? 100 : 0,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                icon: Trophy
              }
            ].map((goal, i) => (
              <div key={i} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl transition-all shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-violet-900/30">
                    <goal.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{goal.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Meta Mensual</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4 line-clamp-1">{goal.desc}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Progreso</span>
                    <span className="text-violet-400 font-black">{goal.progress}%</span>
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

          {/* Certificaciones */}
          <div className="relative">
            <div className="relative bg-slate-900 border border-slate-700 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="absolute top-0 right-0 p-12 opacity-[0.04] pointer-events-none">
                <Award className="h-48 w-48 text-white rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="space-y-6 text-center lg:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/30 border border-violet-600/20 text-violet-400">
                    <Star className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Recompensa Académica</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-black text-white">
                    Obtén tu <span className="text-violet-400">Certificación Digital</span>
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base max-w-xl font-medium leading-relaxed">
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

          {/* Manual Digital ECOEMS */}
          <div className="relative">
            <div className="relative bg-slate-900 border border-slate-700 rounded-[2rem] p-8 md:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.04] pointer-events-none">
                <BookOpen className="h-48 w-48 text-white -rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/30 border border-violet-600/20 text-violet-400">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Guía Completa</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-black text-white">
                    Manual Digital ECOEMS
                  </h2>
                  <p className="text-slate-300 text-sm md:text-base max-w-xl font-medium leading-relaxed">
                    Tu guía estratégica completa para dominar el examen. Temas desglosados, tips de estudio, ejercicios resueltos y todo lo que necesitas en un solo lugar.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      <BookOpen className="h-3 w-3 text-violet-400" /> Temario Completo
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      <Target className="h-3 w-3 text-violet-400" /> Ejercicios Resueltos
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      <Sparkles className="h-3 w-3 text-violet-400" /> Tips Estratégicos
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <Button
                    variant="primary"
                    onClick={() => window.open("/libro/manual_digital_ECOEMS.html", "_blank")}
                    className="h-20 px-10 rounded-3xl text-lg font-black uppercase tracking-[0.2em] group"
                  >
                    <BookOpen className="mr-2 h-6 w-6" />
                    ABRIR MANUAL
                    <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Curso Udemy */}
          <div className="relative group" id="curso-udemy">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/40 rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.07] pointer-events-none">
                <Brain className="h-56 w-56 text-emerald-400 -rotate-12" />
              </div>
              <div className="absolute bottom-0 left-0 p-8 opacity-[0.04] pointer-events-none">
                <Star className="h-40 w-40 text-yellow-400 rotate-12" />
              </div>
              <div className="absolute top-6 left-1/4 h-2 w-2 bg-emerald-400 rounded-full animate-ping opacity-40"></div>
              <div className="absolute bottom-12 right-1/3 h-1.5 w-1.5 bg-yellow-400 rounded-full animate-ping opacity-30" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute top-1/3 right-1/4 h-1 w-1 bg-teal-300 rounded-full animate-ping opacity-50" style={{ animationDelay: "1s" }}></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-5 text-center md:text-left flex-1">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 animate-bounce" style={{ animationDuration: "2s" }}>
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
                    ECOEMS 2026: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 italic">128 Preguntas</span>
                    <br />
                    <span className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">Resueltas con NotebookLM</span>
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base max-w-xl font-medium leading-relaxed">
                    El <span className="text-emerald-400 font-bold">único recurso de paga</span> de la plataforma. Domina las 128 preguntas del examen con explicaciones detalladas potenciadas por IA con Google NotebookLM.
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
                  <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                    <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1">📚 Disponible en Udemy</p>
                    <p className="text-slate-400 text-[10px] font-medium">Este es el único recurso de paga de toda la plataforma</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="h-48 animate-pulse bg-muted rounded-3xl" />}>
            <CountdownExam />
          </Suspense>
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-3xl" />}>
            <NewsECOEMS />
          </Suspense>
          <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-3xl" />}>
            <BadgeSystem />
          </Suspense>
          <Suspense fallback={<div className="h-48 animate-pulse bg-muted rounded-3xl" />}>
            <WeeklyChallenges />
          </Suspense>
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-3xl" />}>
            <ProgresoDashboard />
          </Suspense>
          <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-3xl" />}>
            <RecommendedVideos className="p-6 bg-card/20 backdrop-blur-xl border border-border/50 rounded-3xl" />
          </Suspense>

          {/* Studio Simulators */}
          <div className="pt-8 pb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-2xl bg-violet-900/30 flex items-center justify-center border border-violet-600/20">
                <Sparkles className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-black text-white">Consola Studio: Por Materia</h2>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">Entrenamiento Intensivo (630+ Reactivos)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.filter(a => studioMapping[a.id]).map((area) => (
                <div
                  key={area.id}
                  className="bg-slate-900 border border-slate-700 rounded-2xl p-5 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-violet-600 rounded-l-2xl" />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-900/30 rounded-lg">
                        <area.icon className="h-4 w-4 text-violet-400" />
                      </div>
                      <h4 className="font-semibold text-white text-sm">{area.name}</h4>
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
                        className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-800 hover:bg-violet-900/30 text-[11px] font-bold text-slate-400 hover:text-violet-400 transition-all border border-slate-700 hover:border-violet-600/20"
                      >
                        <span className="truncate mr-2 uppercase tracking-tight">{sim.name}</span>
                        <ChevronRight className="h-3 w-3 text-violet-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <Suspense fallback={null}>
        <StudioModal
          isOpen={activeSimulator !== null}
          onClose={() => setActiveSimulator(null)}
          url={activeSimulator?.url || ""}
          title={activeSimulator?.title || ""}
          description={activeSimulator?.description}
        />
      </Suspense>
    </div>
  );
};

export default Index;
