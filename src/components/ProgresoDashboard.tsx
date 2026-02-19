import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  Flame,
  Clock,
  Grid3X3,
  BarChart3,
  Trophy,
  Calendar,
  Hourglass,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { areas } from "@/data/areas";
import { getAreaNotebookKeys, getNotebookKey } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { cn } from "@/lib/utils";

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
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
        <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white hover:scale-[1.02] transition-transform duration-500">
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
              <div className="relative h-2 w-full bg-blue-900/40 rounded-full overflow-hidden border border-white/10">
                <div
                  className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${timeStats.percentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Heatmap Card */}
        <Card className="lg:col-span-2 shadow-xl border-border/50 bg-card/50 backdrop-blur-xl cyber-grid relative">
          <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between space-y-0 text-foreground">
            <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter">
              <Grid3X3 className="h-4 w-4 text-emerald-500" />
              Mapa de Dominio
            </CardTitle>
            <div className="flex items-center gap-1.5 ring-1 ring-border p-1 px-2 rounded-full bg-background/50">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-muted-foreground uppercase font-black">Online</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-2">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2 mb-6">
              {areaData.map((area) => (
                <div
                  key={area.id}
                  className={cn(
                    "aspect-square rounded-md relative group transition-all duration-500 hover:scale-125 cursor-help border",
                    getHeatmapColor(area.percentage)
                  )}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-[#0a0a0c] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/20 backdrop-blur-md scale-90 group-hover:scale-100 pointer-events-none">
                    <p className="font-black text-xs mb-1 text-white">{area.name}</p>
                    <p className="text-emerald-400 font-black">{area.percentage}% completado</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0a0a0c]" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Leyenda:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-slate-800/50 border border-white/5" />
                    <span className="text-[9px] font-bold text-muted-foreground">0%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
                    <span className="text-[9px] font-bold text-muted-foreground">1-50%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/70 border border-emerald-500/80" />
                    <span className="text-[9px] font-bold text-muted-foreground">75%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-white/40" />
                    <span className="text-[9px] font-bold text-muted-foreground">100%</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium italic">
                * Dominio acumulado por área
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bar Chart Section */}
        <Card className="lg:col-span-2 shadow-xl border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden group">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter">
              <BarChart3 className="h-5 w-5 text-primary" />
              Análisis de Avance Profesional
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] p-6 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  dataKey="shortName"
                  type="category"
                  width={90}
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  className="font-bold uppercase text-muted-foreground pl-2"
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-black/90 border border-white/10 p-3 shadow-2xl rounded-xl backdrop-blur-xl">
                          <p className="font-black text-white text-sm uppercase tracking-tighter mb-1">{data.name}</p>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                            <p className="text-primary font-bold text-xs">{payload[0].value}% Progreso</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="percentage"
                  radius={[0, 10, 10, 0]}
                  barSize={12}
                >
                  {areaData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.percentage === 100 ? '#10b981' : '#6366f1'}
                      className="transition-all duration-1000 opacity-80 hover:opacity-100"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success / Next Steps Card */}
        <Card className="shadow-2xl border-primary/20 bg-gradient-to-b from-card to-background relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-secondary/10 rounded-full blur-[80px]" />

          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Objetivos Elite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="p-5 bg-card/80 border border-border/50 rounded-2xl shadow-lg group/item hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block">Siguiente Meta</span>
                  <span className="text-[10px] font-bold text-primary">{globalProgress}% del total</span>
                </div>
              </div>
              <p className="text-base font-black text-foreground mb-1 group-hover/item:text-primary transition-colors uppercase tracking-tight font-heading">Ecomems 2026 Core</p>
              <Progress value={globalProgress} className="h-1 bg-muted mt-2 [&>div]:bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
            </div>

            {milestoneArea && (
              <div
                onClick={() => navigate(`/area/${milestoneArea.id}`)}
                className="p-5 bg-card/80 border border-border/50 rounded-2xl shadow-lg group/item transition-all hover:border-purple-500/50 cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Hourglass className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hito de área</span>
                </div>
                <p className="text-base font-black text-foreground mb-1 uppercase tracking-tight font-heading">
                  {milestoneArea.name}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  ¡Estás al {milestoneArea.percentage}%! Solo falta un poco.
                </p>
              </div>
            )}

            <Button
              onClick={() => document.getElementById('areas')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-sm shadow-[0_8px_30px_rgb(99,102,241,0.4)] hover:shadow-[0_8px_40px_rgb(99,102,241,0.6)] border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Maximizar Estudio
                <Trophy className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgresoDashboard;
