import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, RotateCcw, Clock, ArrowRight } from "lucide-react";
import { areas } from "@/data/areas";
import { useVideoProgress, ProgressiveVideoData } from "@/hooks/useVideoProgress";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const UltimoVideoCard = () => {
    const { obtenerUltimoVideo } = useVideoProgress();
    const navigate = useNavigate();

    const lastVideoData = obtenerUltimoVideo();

    const details = useMemo(() => {
        if (!lastVideoData) return null;

        for (const area of areas) {
            const video = area.videos.find(v => v.id === lastVideoData.videoId);
            if (video) return { video, area };
        }
        return null;
    }, [lastVideoData]);

    if (!lastVideoData || !details) return null;

    const { video, area } = details;
    const percentage = Math.round((lastVideoData.seconds / lastVideoData.duration) * 100) || 0;

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const isCompleted = lastVideoData.completed;

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black shadow-2xl p-6 transition-all hover:border-primary/30">
            {/* Background Accent */}
            <div className={cn(
                "absolute -top-12 -right-12 h-32 w-32 rounded-full blur-[60px] opacity-20 transition-opacity group-hover:opacity-40",
                isCompleted ? "bg-emerald-500" : "bg-primary"
            )} />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                {/* Thumbnail Preview Area */}
                <div className="relative w-full md:w-48 aspect-video rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
                    <img
                        src={`https://img.youtube.com/vi/${video.videoUrl.split('embed/')[1]?.split('?')[0] || video.id}/mqdefault.jpg`}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                        alt={video.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary/20 backdrop-blur-md p-2 rounded-full border border-white/20">
                            <PlayCircle className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    {isCompleted && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-widest">
                            Completado
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            {area.name}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                            <Clock className="h-3 w-3" />
                            <span>Visto por última vez</span>
                        </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-white mb-4 line-clamp-1">
                        {video.title}
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-muted-foreground px-1">
                                <span>Progreso: {percentage}%</span>
                                <span>{formatTime(lastVideoData.seconds)} / {formatTime(lastVideoData.duration)}</span>
                            </div>
                            <Progress value={percentage} className={cn(
                                "h-1.5 bg-white/5",
                                isCompleted ? "[&>div]:bg-emerald-500" : "[&>div]:bg-primary"
                            )} />
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Button
                                onClick={() => navigate(`/area/${area.id}?video=${video.id}&t=${lastVideoData.seconds}`)}
                                className={cn(
                                    "h-10 px-6 font-black uppercase tracking-widest text-xs shadow-lg transition-all",
                                    isCompleted
                                        ? "bg-white text-black hover:bg-white/90"
                                        : "bg-primary text-white hover:bg-primary/90"
                                )}
                            >
                                {isCompleted ? (
                                    <>Ver de nuevo <RotateCcw className="ml-2 h-4 w-4" /></>
                                ) : (
                                    <>Reanudar <PlayCircle className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => navigate(`/area/${area.id}`)}
                                className="h-10 text-white/60 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest"
                            >
                                Ir al área <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UltimoVideoCard;
