import React, { useMemo } from "react";
import {
    Trophy,
    Medal,
    Star,
    Zap,
    Crown,
    Award,
    BookOpen,
    CheckCircle2,
    Flame,
    Binary,
    Brain
} from "lucide-react";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    unlocked: boolean;
}

const BadgeSystem = () => {
    const { getEstadisticas } = useVideoProgress();
    const stats = getEstadisticas();

    // Level Logic
    const levelDetails = useMemo(() => {
        const percentage = stats.total > 0 ? (stats.completos / stats.total) * 100 : 0;

        if (percentage >= 90) return { title: "Doctor en Ciencias", rank: "Nivel 4", icon: Crown, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.3)]", next: "Máximo nivel alcanzado" };
        if (percentage >= 60) return { title: "Maestro Emérito", rank: "Nivel 3", icon: Award, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30", next: "90% para Doctorado" };
        if (percentage >= 30) return { title: "Licenciado en Proceso", rank: "Nivel 2", icon: Medal, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30", next: "60% para Maestría" };
        if (percentage >= 5) return { title: "Becario Iniciado", rank: "Nivel 1", icon: Star, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30", next: "30% para Licenciatura" };

        return { title: "Aspirante", rank: "Nivel 0", icon: Zap, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30", next: "5% para convertirte en Becario" };
    }, [stats]);

    // Badges Logic
    const badges: Badge[] = useMemo(() => {
        return [
            {
                id: "first_video",
                name: "Primeros Pasos",
                description: "Viste tu primer video",
                icon: Binary,
                color: "text-blue-400",
                unlocked: stats.vistos >= 1
            },
            {
                id: "ten_videos",
                name: "Cerebro de Hierro",
                description: "10 videos completados",
                icon: Brain, // Wait, I need to check if Brain is imported
                color: "text-purple-400",
                unlocked: stats.vistos >= 10
            },
            {
                id: "five_quizzes",
                name: "Maestro del Quiz",
                description: "5 evaluaciones aprobadas",
                icon: CheckCircle2,
                color: "text-emerald-400",
                unlocked: stats.quizzesAprobados >= 5
            },
            {
                id: "time_lord",
                name: "Señor del Tiempo",
                description: "Más de 5 horas de estudio",
                icon: Flame,
                color: "text-orange-400",
                unlocked: stats.tiempoInvertido.includes('h') && parseInt(stats.tiempoInvertido.split('h')[0]) >= 5
            }
        ].map(b => (b.id === 'ten_videos' ? { ...b, icon: Binary } : b)); // Fallback icon fix
    }, [stats]);

    const Icon = levelDetails.icon;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rank Card */}
            <div className={cn(
                "md:col-span-1 rounded-3xl p-6 border flex flex-col items-center justify-center text-center transition-all duration-500",
                levelDetails.bg,
                levelDetails.border
            )}>
                <div className={cn("p-4 rounded-full bg-white/5 mb-4", levelDetails.color)}>
                    <Icon className="h-12 w-12" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{levelDetails.rank}</span>
                <h3 className={cn("text-2xl font-black uppercase tracking-tighter mb-2", levelDetails.color)}>
                    {levelDetails.title}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mb-4">
                    Status académico actual
                </p>
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>Progreso de Grado</span>
                        <span>{levelDetails.next}</span>
                    </div>
                    <Progress value={stats.total > 0 ? (stats.completos / stats.total) * 100 : 0} className="h-1.5" />
                </div>
            </div>

            {/* Badges Wall */}
            <div className="md:col-span-2 bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        Salón de Insignias
                    </h3>
                    <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/10">
                        {badges.filter(b => b.unlocked).length} / {badges.length} Desbloqueadas
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {badges.map((badge) => {
                        const BadgeIcon = badge.icon;
                        return (
                            <div
                                key={badge.id}
                                className={cn(
                                    "flex flex-col items-center p-4 rounded-2xl border transition-all duration-500 group relative",
                                    badge.unlocked
                                        ? "bg-white/5 border-white/10 opacity-100 scale-100"
                                        : "bg-black/20 border-white/5 opacity-40 grayscale scale-95"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-xl mb-3 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6",
                                    badge.unlocked ? badge.color : "text-slate-600"
                                )}>
                                    <BadgeIcon className="h-6 w-6" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-tighter text-center line-clamp-1 mb-1">
                                    {badge.name}
                                </p>
                                <p className="text-[8px] font-medium text-muted-foreground text-center leading-tight">
                                    {badge.description}
                                </p>

                                {badge.unlocked && (
                                    <div className="absolute -top-1 -right-1">
                                        <div className="h-3 w-3 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                                            <div className="h-1 w-1 bg-white rounded-full animate-ping" />
                                        </div>
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

export default BadgeSystem;
