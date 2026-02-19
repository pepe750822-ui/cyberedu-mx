import React, { useState, useMemo } from "react";
import {
    Calendar,
    Clock,
    Target,
    PlayCircle,
    Sparkles,
    ArrowRight,
    Lightbulb,
    CheckSquare,
    ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { areas, Area, Video } from "@/data/areas";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { getAreaNotebookKeys } from "@/data/notebookMap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PlanEstudioDiario = () => {
    const [showPlan, setShowPlan] = useState(false);
    const { isViewed, getEstadisticas, obtenerUltimoVideo } = useVideoProgress();
    const navigate = useNavigate();
    const lastVideo = obtenerUltimoVideo();

    // Calculation Logic for the Daily Plan - Improved to avoid duplicity
    const dailyPlan = useMemo(() => {
        // 1. Calculate progress per area
        const areaStats = areas.map(area => {
            const keys = getAreaNotebookKeys(area.id);
            const viewed = keys.filter(k => isViewed(k)).length;
            const progress = keys.length > 0 ? (viewed / keys.length) * 100 : 0;
            return { area, progress };
        });

        // 2. Filter out the last video seen so we don't repeat it
        const lastVideoId = lastVideo?.videoId;

        // 3. Find 3 specific videos (next unseen in areas with lowest progress)
        const recommendedVideos: { video: Video; area: Area }[] = [];

        // Sort areas by lowest progress
        const sortedAreas = [...areaStats].sort((a, b) => a.progress - b.progress);

        for (const { area } of sortedAreas) {
            if (recommendedVideos.length >= 3) break;

            const nextVideo = area.videos.find(v =>
                !isViewed(v.id) && v.id !== lastVideoId
            );

            if (nextVideo) {
                recommendedVideos.push({ video: nextVideo, area });
            }
        }

        // Fallback if we still need more videos and low progress areas didn't provide enough
        if (recommendedVideos.length < 3) {
            for (const area of areas) {
                if (recommendedVideos.length >= 3) break;
                const nextVideo = area.videos.find(v =>
                    !isViewed(v.id) &&
                    v.id !== lastVideoId &&
                    !recommendedVideos.some(r => r.video.id === v.id)
                );
                if (nextVideo) recommendedVideos.push({ video: nextVideo, area });
            }
        }

        return recommendedVideos;
    }, [isViewed, lastVideo]);

    const handleStartStudy = (areaId: string, videoId: string) => {
        navigate(`/area/${areaId}?video=${videoId}`);
    };

    if (dailyPlan.length === 0) return null;

    return (
        <div className="w-full">
            {!showPlan ? (
                <Button
                    onClick={() => setShowPlan(true)}
                    className="w-full h-16 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(124,58,237,0.3)] transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="flex items-center gap-3 relative z-10">
                        <Sparkles className="h-6 w-6 animate-pulse" />
                        <span>Generar Plan de Estudio Diario</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                </Button>
            ) : (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                        {/* Background Accent */}
                        <div className="absolute -top-24 -left-24 h-64 w-64 bg-primary/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-indigo-500/10 rounded-full blur-[80px]" />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/30">
                                        <Calendar className="h-3 w-3" />
                                        Misión de hoy: {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                                        Tu Ruta de Éxito
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                                        <Clock className="h-6 w-6 text-amber-500" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Inversión</p>
                                            <p className="text-lg font-black text-white italic">45 Minutos</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                                        <Target className="h-6 w-6 text-emerald-500" />
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Meta Diaria</p>
                                            <p className="text-lg font-black text-white italic">2 Módulos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {dailyPlan.map(({ video, area }, index) => (
                                    <div
                                        key={video.id}
                                        className="group bg-slate-900/50 hover:bg-slate-900/80 border border-white/5 hover:border-primary/50 rounded-3xl p-6 transition-all duration-500 hover:scale-[1.03] flex flex-col h-full"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">
                                                {index + 1}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Sugerido</span>
                                        </div>

                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{area.name}</p>
                                            <h4 className="text-lg font-black text-white leading-tight mb-3 group-hover:text-primary transition-colors">
                                                {video.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{video.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CheckSquare className="h-3 w-3" />
                                                    <span>Con Quiz</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleStartStudy(area.id, video.id)}
                                            variant="outline"
                                            className="w-full border-white/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all font-black uppercase text-[10px] tracking-widest h-11"
                                        >
                                            Comenzar ahora
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
                                <div className="p-3 bg-primary/20 rounded-2xl">
                                    <Lightbulb className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-white uppercase tracking-tight">Consejo del día</p>
                                    <p className="text-sm text-muted-foreground">
                                        Hemos filtrado estas clases para que no se repitan con tu actividad reciente.
                                        Enfocarte en estas áreas críticas es la estrategia más rápida para subir tu puntaje promedio.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => setShowPlan(false)}
                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
                                >
                                    Ocultar plan y volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanEstudioDiario;
