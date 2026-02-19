import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, PlayCircle, TrendingUp, Target, UserCheck } from "lucide-react";
import { areas, Area, Video } from "@/data/areas";
import { getAreaNotebookKeys, getNotebookKey } from "@/data/notebookMap";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import { cn } from "@/lib/utils";

interface RecommendedVideosProps {
    currentVideoId?: string;
    currentAreaId?: string;
    className?: string;
}

const RecommendedVideos: React.FC<RecommendedVideosProps> = ({
    currentVideoId,
    currentAreaId,
    className
}) => {
    const { isViewed } = useVideoProgress();

    // 1. Logic for Low Progress Areas
    const lowProgressRecommendations = useMemo(() => {
        const areaStats = areas.map(area => {
            const keys = getAreaNotebookKeys(area.id);
            const viewedCount = keys.filter(k => isViewed(k)).length;
            const progress = keys.length > 0 ? (viewedCount / keys.length) * 100 : 0;
            return { area, progress };
        });

        // Pick areas with least progress (but > 0 if possible, or just lowest)
        const weakAreas = areaStats
            .filter(a => a.progress < 100)
            .sort((a, b) => a.progress - b.progress)
            .slice(0, 2);

        const recs: { video: Video; area: Area; reason: string; icon: any }[] = [];

        weakAreas.forEach(({ area }) => {
            const firstUnseen = area.videos.find(v => !isViewed(getNotebookKey(v.id) || ""));
            if (firstUnseen) {
                recs.push({
                    video: firstUnseen,
                    area,
                    reason: `Refuerza ${area.name}`,
                    icon: Target
                });
            }
        });

        return recs;
    }, [isViewed]);

    // 2. Related Videos (from current area)
    const relatedRecommendations = useMemo(() => {
        if (!currentAreaId) return [];
        const area = areas.find(a => a.id === currentAreaId);
        if (!area) return [];

        return area.videos
            .filter(v => v.id !== currentVideoId && !isViewed(getNotebookKey(v.id) || ""))
            .slice(0, 2)
            .map(v => ({
                video: v,
                area,
                reason: "Siguiente en este módulo",
                icon: TrendingUp
            }));
    }, [currentAreaId, currentVideoId, isViewed]);

    // 3. Simulated "Others Viewed" (Popular)
    const popularRecommendations = useMemo(() => {
        // Pick some "flagship" videos that are often unseen
        const flagshipIds = ["hv-1", "hm-1", "bio-1", "fis-1"];
        const recs: { video: Video; area: Area; reason: string; icon: any }[] = [];

        areas.forEach(area => {
            area.videos.forEach(v => {
                if (flagshipIds.includes(v.id) && v.id !== currentVideoId && !isViewed(getNotebookKey(v.id) || "")) {
                    recs.push({
                        video: v,
                        area,
                        reason: "Tendencia en CyberEdu",
                        icon: UserCheck
                    });
                }
            });
        });

        return recs.slice(0, 2);
    }, [currentVideoId, isViewed]);

    const allRecommendations = [...relatedRecommendations, ...lowProgressRecommendations, ...popularRecommendations]
        .filter((v, i, a) => a.findIndex(t => t.video.id === v.video.id) === i) // Unique
        .slice(0, 4);

    if (allRecommendations.length === 0) return null;

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                <h3 className="text-lg font-black uppercase tracking-tighter">Sugerencias para ti</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allRecommendations.map(({ video, area, reason, icon: Icon }) => (
                    <Link
                        key={video.id + reason}
                        to={`/area/${area.id}?video=${video.id}`}
                        className="group block bg-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-primary/50 transition-all hover:scale-[1.02] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Icon className="h-12 w-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="h-3 w-3 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{reason}</span>
                            </div>

                            <h4 className="font-bold text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                {video.title}
                            </h4>

                            <div className="flex items-center justify-between mt-3 text-[10px] font-bold uppercase text-muted-foreground">
                                <span className="bg-muted px-2 py-0.5 rounded-full">{area.name.split(" ")[0]}</span>
                                <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                                    <PlayCircle className="h-3 w-3" />
                                    <span>Ver ahora</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecommendedVideos;
