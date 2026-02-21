
import React from 'react';
import { useAchievements } from '@/hooks/useAchievements';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const NextAchievementCard = () => {
    const { getNextAchievement } = useAchievements();
    const next = getNextAchievement();

    if (!next) return (
        <div className="bg-slate-900/50 border border-amber-500/20 rounded-3xl p-6 text-center">
            <LucideIcons.Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">¡Todos los logros desbloqueados!</p>
        </div>
    );

    const IconName = next.icon as keyof typeof LucideIcons;
    const Icon = (LucideIcons[IconName] as any) || LucideIcons.Award;
    const progressPercent = (next.currentValue / next.targetValue) * 100;

    return (
        <div className="group relative overflow-hidden bg-slate-900/80 border border-white/5 rounded-3xl p-6 backdrop-blur-sm hover:border-white/10 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                <Icon className="h-24 w-24 text-white" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                        "p-2.5 rounded-xl bg-white/5",
                        next.type === 'platinum' ? "text-purple-400" : "text-amber-500"
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Próximo Logro</p>
                        <h4 className="text-sm font-black uppercase tracking-tight text-white">{next.title}</h4>
                    </div>
                </div>

                <p className="text-[11px] text-slate-400 mb-4 h-8 line-clamp-2 leading-relaxed">
                    {next.description}
                </p>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Progreso</span>
                        <span className={next.type === 'platinum' ? "text-purple-400" : "text-amber-500"}>
                            {next.currentValue} / {next.targetValue}
                        </span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5" />
                </div>
            </div>
        </div>
    );
};

export default NextAchievementCard;
