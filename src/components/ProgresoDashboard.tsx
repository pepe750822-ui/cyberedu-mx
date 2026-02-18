import React, { useMemo, useEffect, useState } from "react";
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
  Hourglass
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { areas } from "@/data/areas";
import { getAreaNotebookKeys, getNotebookKey } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { cn } from "@/lib/utils";

const ProgresoDashboard = () => {
  const { isViewed } = useVideoProgress();
  const [streak, setStreak] = useState(0);

  // 1. Calculate Progress per Area
  const areaData = useMemo(() => {
    return areas.map((area) => {
      const keys = getAreaNotebookKeys(area.id);
      const viewedCount = keys.filter((k) => isViewed(k)).length;
      const totalCount = keys.length || 1; // avoid division by zero
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

  // 2. Heatmap Data (Colors)
  const getHeatmapColor = (percent: number) => {
    if (percent === 0) return "bg-slate-200 dark:bg-slate-800";
    if (percent < 25) return "bg-emerald-200";
    if (percent < 50) return "bg-emerald-400";
    if (percent < 75) return "bg-emerald-600";
    return "bg-emerald-800";
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

  // 4. Streak Logic
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
        // Continue streak - this would normally be triggered by an action, 
        // but for the dashboard viewing we'll just show the current value.
        setStreak(currentStreak);
      } else if (lastDate) {
        // Streak broken
        // setStreak(0);
        // But for display purposes, let's keep it until they study today?
        setStreak(currentStreak);
      } else {
        setStreak(0);
      }
    }
    
    // Simple mock: if user is on this dashboard and has seen at least 1 video, give them a streak of 1 if 0
    if (currentStreak === 0 && Object.keys(localStorage).some(k => k.startsWith("video-"))) {
        localStorage.setItem("study_streak_count", "1");
        localStorage.setItem("last_study_date", today);
        setStreak(1);
    }
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Racha de estudio</p>
                <h3 className="text-3xl font-bold mt-1">{streak} {streak === 1 ? 'Día' : 'Días'}</h3>
              </div>
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm animate-pulse">
                <Flame className="h-8 w-8 fill-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Card */}
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">Tiempo invertido</p>
                <h3 className="text-2xl font-bold mt-1">{timeStats.invested}</h3>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-blue-100">
                <span>Total estimado: {timeStats.total}</span>
                <span>{Math.round(timeStats.percentage)}%</span>
              </div>
              <Progress value={timeStats.percentage} className="h-1.5 bg-blue-900/30 [&>div]:bg-white" />
            </div>
          </CardContent>
        </Card>

        {/* Heatmap Card */}
        <Card className="lg:col-span-2 shadow-sm border-border">
          <CardHeader className="pb-2 pt-4 px-6 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-emerald-500" />
              Mapa de Dominio por Área
            </CardTitle>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Intensidad = % Avance</span>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
              {areaData.map((area) => (
                <div 
                  key={area.id}
                  className={cn(
                    "aspect-square rounded-sm relative group transition-all duration-300 hover:scale-110 cursor-help",
                    getHeatmapColor(area.percentage)
                  )}
                  title={`${area.name}: ${area.percentage}%`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md pointer-events-none border border-border">
                    {area.name}: {area.percentage}%
                  </div>
                </div>
              ))}
              {/* Fill remaining with empty squares if needed, but we have 11 areas */}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Section */}
        <Card className="lg:col-span-2 shadow-sm border-border overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Avance por Asignatura
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="shortName" 
                  type="category" 
                  width={100} 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border border-border p-2 shadow-sm rounded-lg text-xs">
                          <p className="font-bold">{data.name}</p>
                          <p className="text-primary">{payload[0].value}% completado</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  radius={[0, 4, 4, 0]} 
                  barSize={16}
                >
                  {areaData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.percentage === 100 ? '#10b981' : '#6366f1'} 
                      className="transition-all duration-500"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success / Next Steps Card */}
        <Card className="shadow-sm border-border bg-slate-50 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Logros y Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white dark:bg-card rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-bold text-muted-foreground uppercase">Siguiente Objetivo</span>
              </div>
              <p className="text-sm font-semibold">Examen ECOEMS 2026</p>
              <p className="text-xs text-muted-foreground mt-1">¡Sigue así, vas por excelente camino!</p>
            </div>

            <div className="p-4 bg-white dark:bg-card rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Hourglass className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-bold text-muted-foreground uppercase">Hito más cercano</span>
              </div>
              <p className="text-sm font-semibold">
                {areaData.find(a => a.percentage < 100 && a.percentage > 0)?.name || "¡Nueva área!"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Falta poco para completar este módulo.</p>
            </div>

            <Button className="w-full mt-2 group" variant="default">
              Continuar estudiando
              <Trophy className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgresoDashboard;
