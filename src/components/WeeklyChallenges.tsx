import React, { useMemo } from "react";
import {
    Zap,
    Target,
    Clock,
    CheckCircle,
    Calendar,
    Sparkles,
    Trophy
} from "lucide-react";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { areas } from "@/data/areas";

const WeeklyChallenges = () => {
    const { isViewed, obtenerProgresoVideo } = useVideoProgress();

    // Get start of the current week (Monday)
    const startOfWeek = useMemo(() => {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday.getTime();
    }, []);

    // Calculate weekly stats
    const weeklyStats = useMemo(() => {
        let videosVistosEstaSemana = 0;
        let quizzesAprobadosEstaSemana = 0;
        let minutosEstudiadosEstaSemana = 0;

        areas.forEach(area => {
            area.videos.forEach(v => {
                // Check video seen this week
                const seenData = obtenerProgresoVideo(v.id);
                if (seenData && seenData.lastUpdate >= startOfWeek && seenData.completed) {
                    videosVistosEstaSemana++;
                }

                // Check quiz approved this week
                const quizKey = `quiz_aprobado_${v.id}`;
                const quizUpdateKey = `quiz_update_${v.id}`;
                const approved = localStorage.getItem(quizKey) === "true";
                const updateTime = parseInt(localStorage.getItem(quizUpdateKey) || "0");

                if (approved && updateTime >= startOfWeek) {
                    quizzesAprobadosEstaSemana++;
                }

                // Time studied this week
                if (seenData && seenData.lastUpdate >= startOfWeek) {
                    minutosEstudiadosEstaSemana += (seenData.seconds / 60);
                }
            });
        });

        return {
            videos: videosVistosEstaSemana,
            quizzes: quizzesAprobadosEstaSemana,
            minutos: Math.round(minutosEstudiadosEstaSemana)
        };
    }, [obtenerProgresoVideo, startOfWeek]);

    const challenges = [
        {
            id: "weekly_videos",
            title: "Explorador de Áreas",
            description: "Ver 5 videos nuevos esta semana",
            icon: Zap,
            current: weeklyStats.videos,
            target: 5,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            id: "weekly_quizzes",
            title: "Cerebro Maestro",
            description: "Aprobar 3 quizzes magistrales",
            icon: Target,
            current: weeklyStats.quizzes,
            target: 3,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            id: "weekly_time",
            title: "En el Flow de Estudio",
            description: "Acumular 30 minutos de estudio",
            icon: Clock,
            current: weeklyStats.minutos,
            target: 30,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        }
    ];

    return (
        <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 relative overflow-hidden">
            {/* Decorative Grid */}
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">CyberEdu Missions</span>
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Retos Semanales</h2>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center gap-4">
                        <Trophy className="h-8 w-8 text-amber-500" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progreso Semanal</p>
                            <p className="text-lg font-black text-white italic">Faltan {challenges.reduce((acc, c) => acc + Math.max(0, c.target - c.current), 0)} pasos</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {challenges.map((challenge) => {
                        const Icon = challenge.icon;
                        const percentage = Math.min(100, (challenge.current / challenge.target) * 100);
                        const isCompleted = percentage === 100;

                        return (
                            <div
                                key={challenge.id}
                                className={cn(
                                    "p-6 rounded-3xl border transition-all duration-500 relative group",
                                    isCompleted
                                        ? "bg-emerald-500/10 border-emerald-500/30"
                                        : "bg-white/5 border-white/10 hover:border-primary/30"
                                )}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn("p-3 rounded-2xl", challenge.bg, challenge.color)}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    {isCompleted && (
                                        <div className="bg-emerald-500 text-black p-1 rounded-full animate-bounce">
                                            <CheckCircle className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-black uppercase tracking-tight text-lg mb-1 group-hover:text-primary transition-colors">
                                    {challenge.title}
                                </h3>
                                <p className="text-xs text-muted-foreground font-medium mb-6">
                                    {challenge.description}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className={cn(isCompleted ? "text-emerald-400" : "text-muted-foreground")}>
                                            {isCompleted ? "Completado" : `${challenge.current} / ${challenge.target}`}
                                        </span>
                                        <span className="text-white">{Math.round(percentage)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000 ease-out relative",
                                                isCompleted ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-primary"
                                            )}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            {!isCompleted && (
                                                <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-12 animate-pulse" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Reward Micro-interaction */}
                                {isCompleted && (
                                    <div className="mt-4 flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-amber-500" />
                                        <span className="text-[9px] font-black text-amber-500 uppercase">+50 XP Academia</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WeeklyChallenges;
