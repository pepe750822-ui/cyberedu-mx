
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3, TrendingUp, Clock, Video, CheckCircle, Brain,
  Trophy, Target, ArrowLeft, BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { areas } from "@/data/areas";
import { getNotebookKey } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { materiales } from "@/data/materialComplementario";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell
} from "recharts";

const COLORS = [
  "hsl(270, 90%, 60%)", "hsl(190, 90%, 50%)", "hsl(150, 80%, 45%)",
  "hsl(340, 80%, 55%)", "hsl(45, 90%, 55%)", "hsl(220, 80%, 55%)",
  "hsl(30, 85%, 55%)", "hsl(0, 75%, 55%)", "hsl(160, 70%, 45%)",
  "hsl(280, 70%, 55%)", "hsl(200, 80%, 50%)"
];

export default function Reportes() {
  const navigate = useNavigate();
  const { isViewed, getEstadisticas, isVideoCompleto } = useVideoProgress();
  const stats = getEstadisticas();

  const areaProgress = useMemo(() =>
    areas.map((area, i) => {
      const total = area.videos.length;
      const viewed = area.videos.filter(v => {
        const key = getNotebookKey(v.id);
        return key ? isViewed(key) : isViewed(v.id);
      }).length;
      const completos = area.videos.filter(v => isVideoCompleto(v.id)).length;
      return {
        name: area.name.length > 14 ? area.name.slice(0, 14) + "…" : area.name,
        fullName: area.name,
        total,
        viewed,
        completos,
        percent: total > 0 ? Math.round((viewed / total) * 100) : 0,
        color: COLORS[i % COLORS.length],
        areaId: area.id
      };
    }), [isViewed, isVideoCompleto]);

  const radarData = useMemo(() =>
    areaProgress.map(a => ({
      subject: a.name,
      progreso: a.percent,
      fullMark: 100
    })), [areaProgress]);

  const pieData = useMemo(() => [
    { name: "Completados", value: stats.completos },
    { name: "Vistos (sin quiz)", value: stats.vistos - stats.completos },
    { name: "Pendientes", value: stats.total - stats.vistos }
  ].filter(d => d.value > 0), [stats]);

  const pieCols = ["hsl(150, 80%, 45%)", "hsl(45, 90%, 55%)", "hsl(215, 25%, 70%)"];

  const globalPercent = stats.total > 0 ? Math.round((stats.completos / stats.total) * 100) : 0;

  const weakAreas = useMemo(() =>
    [...areaProgress].sort((a, b) => a.percent - b.percent).slice(0, 3),
    [areaProgress]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Dashboard de Reportes</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.vistos}</p>
                <p className="text-xs text-muted-foreground">Videos vistos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completos}</p>
                <p className="text-xs text-muted-foreground">Completados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Brain className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.quizzesAprobados}</p>
                <p className="text-xs text-muted-foreground">Quizzes aprobados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.tiempoInvertido}</p>
                <p className="text-xs text-muted-foreground">Tiempo invertido</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={globalPercent} className="flex-1 h-3" />
              <span className="text-lg font-bold text-foreground">{globalPercent}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completos} de {stats.total} videos completados (video + quiz)
            </p>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart — Area Progress */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Progreso por Área
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaProgress} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={70} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(v: number) => [`${v}%`, "Progreso"]}
                    labelFormatter={(l, payload) => payload?.[0]?.payload?.fullName || l}
                  />
                  <Bar dataKey="percent" radius={[4, 4, 0, 0]}>
                    {areaProgress.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" /> Perfil de Conocimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar dataKey="progreso" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Estado de Videos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieCols[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weak Areas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-destructive" /> Áreas a Reforzar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weakAreas.map((area, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/area/${area.areaId}`)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{area.fullName}</span>
                    <span className="text-xs font-bold" style={{ color: area.color }}>{area.percent}%</span>
                  </div>
                  <Progress value={area.percent} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {area.viewed}/{area.total} vistos · {area.completos} completados
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
