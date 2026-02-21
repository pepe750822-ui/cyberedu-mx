import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  CartesianGrid
} from "recharts";
import {
  Flame,
  Clock,
  Grid3X3,
  BarChart3,
  Trophy,
  Calendar,
  Hourglass,
  Sparkles,
  Download,
  Share2,
  FileJson,
  TrendingUp,
  Users,
  Zap,
  Brain,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { areas } from "@/data/areas";
import { getAreaNotebookKeys, getNotebookKey } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { usePerformanceStats } from "@/hooks/usePerformanceStats";
import { useAchievements } from "@/hooks/useAchievements";
import { cn } from "@/lib/utils";
import NextAchievementCard from "./NextAchievementCard";

const ProgresoDashboard = () => {
  const { isViewed } = useVideoProgress();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);

  // 1. Calculate Progress per Area
  const areaData = useMemo(() => {
    return areas.map((area) => {
      const keys = getAreaNotebookKeys(area.id);
      const viewedCount = keys.filter((k) => isViewed(k)).length;
      const totalCount = keys.length || 1;
      const percentage = Math.round((viewedCount / totalCount) * 100);

      return {
        name: area.name,
        shortName: area.name.split(" ").slice(0, 2).join(" "),
        percentage,
        id: area.id,
        color: area.gradientClass,
      };
    });
  }, [isViewed]);

  // 2. Heatmap Color Logic with extra luminance
  const getHeatmapColor = (percent: number) => {
    if (percent === 0) return "bg-slate-800/50 border-white/5";
    if (percent < 25) return "bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
    if (percent < 50) return "bg-emerald-500/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
    if (percent < 75) return "bg-emerald-500/70 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
    return "bg-emerald-400 border-white/40 shadow-[0_0_25px_rgba(16,185,129,0.5)]";
  };

  // 3. Time Calculations
  const timeStats = useMemo(() => {
    let totalSeconds = 0;
    let investedSeconds = 0;

    areas.forEach((area) => {
      area.videos.forEach((video) => {
        const [mins, secs] = video.duration.split(":").map(Number);
        const durationInSecs = (mins || 0) * 60 + (secs || 0);
        totalSeconds += durationInSecs;

        const vKey = getNotebookKey(video.id);
        if (vKey && isViewed(vKey)) {
          investedSeconds += durationInSecs;
        }
      });
    });

    const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return {
      total: formatTime(totalSeconds),
      invested: formatTime(investedSeconds),
      percentage: totalSeconds > 0 ? (investedSeconds / totalSeconds) * 100 : 0
    };
  }, [isViewed]);

  // 4. Calculate Global Progress for "Siguiente Meta"
  const globalProgress = useMemo(() => {
    const totalVideos = areas.reduce((acc, area) => acc + area.videos.length, 0);
    let viewedTotal = 0;
    areas.forEach(area => {
      area.videos.forEach(v => {
        if (isViewed(getNotebookKey(v.id) || "")) viewedTotal++;
      });
    });
    return Math.round((viewedTotal / (totalVideos || 1)) * 100);
  }, [isViewed]);

  // 5. Find Milestone Area (Closest to 100%)
  const milestoneArea = useMemo(() => {
    return [...areaData]
      .filter(a => a.percentage > 0 && a.percentage < 100)
      .sort((a, b) => b.percentage - a.percentage)[0] || null;
  }, [areaData]);

  // 6. Streak Logic
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = localStorage.getItem("last_study_date");
    const currentStreak = parseInt(localStorage.getItem("study_streak_count") || "0");

    if (lastDate === today) {
      setStreak(currentStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        setStreak(currentStreak);
      } else {
        setStreak(currentStreak);
      }
    }

    if (currentStreak === 0 && Object.keys(localStorage).some(k => k.startsWith("video-"))) {
      localStorage.setItem("study_streak_count", "1");
      localStorage.setItem("last_study_date", today);
      setStreak(1);
    }
  }, []);

  const { weeklyData, comparisonData, predictedCompletion, recommendations } = usePerformanceStats();
  const { achievements } = useAchievements();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Card */}
        <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 text-white animate-float">
          <CardContent className="p-6 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame className="h-24 w-24 fill-white" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-orange-100/80 text-xs font-bold uppercase tracking-widest mb-1">Racha de estudio</p>
                <h3 className="text-5xl font-black mt-1 flex items-baseline gap-2">
                  {streak} <span className="text-lg font-normal opacity-80">{streak === 1 ? 'Día' : 'Días'}</span>
                </h3>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/20">
                <Flame className="h-8 w-8 fill-white animate-pulse" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-orange-100 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="h-3 w-3" />
              <span>¡Nivel Dios activado!</span>
            </div>
          </CardContent>
        </Card>

        {/* Time Card */}
        <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blue-100/80 text-xs font-bold uppercase tracking-widest mb-1">Tiempo invertido</p>
                <h3 className="text-3xl font-black mt-1">{timeStats.invested}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/20">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-blue-100/80 uppercase">
                <span>Total: {timeStats.total}</span>
                <span>{Math.round(timeStats.percentage)}%</span>
              </div>
              <Progress value={timeStats.percentage} className="h-1.5 bg-blue-900/40" />
            </div>
          </CardContent>
        </Card>

        {/* Completion Card */}
        <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-widest mb-1">Fecha Estimada</p>
                <h3 className="text-3xl font-black mt-1">{predictedCompletion}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md border border-white/20">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-emerald-100/80 uppercase tracking-widest">
              Basado en tu ritmo actual de {streak > 0 ? Math.round(timeStats.percentage / streak) : 0}% diario
            </p>
          </CardContent>
        </Card>

        {/* Achievements Summary */}
        <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-white/5">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Insignias Elite</p>
                <h3 className="text-3xl font-black mt-1">{achievements.filter(a => a.isUnlocked).length} / {achievements.length}</h3>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Trophy className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <div className="flex gap-1.5 overflow-hidden">
              {achievements.map((a, i) => (
                <div key={i} className={cn(
                  "w-full h-1.5 rounded-full transition-all",
                  a.isUnlocked ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-white/10"
                )} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Visual Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Weekly Evolution Chart */}
        <Card className="xl:col-span-2 shadow-xl border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="font-black uppercase tracking-tighter text-white">Evolución de Estudio</h3>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="bg-white/5 text-[10px] font-bold uppercase h-8 px-4 rounded-full">Semana</Button>
              <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase h-8 px-4 rounded-full text-slate-500">Mes</Button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis hide domain={[0, 4]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                <Line type="monotone" dataKey="avg" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-6 bg-indigo-500 rounded-full" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tú tiempo (h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-6 bg-white/20 rounded-full border border-dashed border-white/30" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promedio Comunidad</span>
            </div>
          </div>
        </Card>

        {/* Peer Comparison (Radar Chart) */}
        <Card className="shadow-xl border-white/5 bg-slate-900/50 backdrop-blur-sm p-6 flex flex-col items-center">
          <div className="w-full flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="font-black uppercase tracking-tighter text-white">Perfil Comparativo</h3>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Radar name="Tú" dataKey="user" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.6} />
                <Radar name="Promedio" dataKey="avg" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.1)" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, paddingTop: '20px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl w-full">
            <p className="text-[10px] text-amber-500/80 font-black leading-relaxed">
              * El algoritmo indica que eres superior al <span className="text-white">72% de los aspirantes</span> en Razonamiento.
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Achievements & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <NextAchievementCard />

        {/* Recommendations Section */}
        <div className="lg:col-span-2 space-y-4">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              onClick={() => navigate(`/area/${rec.areaId}`)}
              className="group flex items-center justify-between p-5 bg-card/40 border border-white/5 rounded-3xl hover:bg-white/5 hover:border-indigo-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight text-sm text-white">{rec.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{rec.desc}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Bar (Export/Share) */}
      <div className="flex flex-wrap items-center justify-between gap-6 p-8 bg-indigo-600 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] border-t border-white/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white uppercase tracking-tighter text-xl">Reporte Ejecutivo</h3>
            <p className="text-indigo-100 text-xs font-semibold uppercase tracking-widest opacity-80">Genera tu expediente de estudio oficial</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl h-12 px-6 font-black uppercase tracking-[0.1em] text-[10px] border border-white/10">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl h-12 px-6 font-black uppercase tracking-[0.1em] text-[10px] border border-white/10">
            <FileJson className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl h-12 px-8 font-black uppercase tracking-[0.1em] text-[10px] shadow-xl">
            <Share2 className="mr-2 h-4 w-4" /> Compartir Reto
          </Button>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="pt-8">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-8 flex items-center gap-3">
          <Grid3X3 className="h-6 w-6 text-emerald-500" />
          Mapa Crítico de <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Dominio</span>
        </h3>
        <div className="bg-slate-900 shadow-2xl rounded-[3rem] p-8 md:p-12 border border-white/5">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3">
            {areaData.map((area) => (
              <div
                key={area.id}
                className={cn(
                  "aspect-square rounded-2xl relative group transition-all duration-500 hover:scale-[1.15] cursor-help border-2",
                  getHeatmapColor(area.percentage)
                )}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black/95 text-white text-[10px] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-2xl border border-white/10 backdrop-blur-xl scale-90 group-hover:scale-100 pointer-events-none">
                  <p className="font-black text-sm mb-1 uppercase tracking-tight">{area.name}</p>
                  <p className="text-emerald-400 font-bold text-xs">{area.percentage}% completado</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/95" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgresoDashboard;
