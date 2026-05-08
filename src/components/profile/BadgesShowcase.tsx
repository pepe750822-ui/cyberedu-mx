import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

export const BadgesShowcase = ({ userId }: { userId: string | null }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earned, setEarned] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [achResp, earnedResp] = await Promise.all([
          supabase.from('achievements').select('*'),
          supabase.from('user_achievements').select('achievement_id').eq('user_id', userId)
        ]);

        if (achResp.data) setAchievements(achResp.data);
        if (earnedResp.data) {
          const earnedIds = new Set(earnedResp.data.map(e => e.achievement_id));
          setEarned(earnedIds);
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (!userId) return null;

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-24 animate-pulse bg-white/5 rounded-2xl border border-white/5" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Trophy className="h-3 w-3 text-amber-500" /> Mis Medallas y Logros
          </h4>
          <p className="text-[9px] text-slate-600 font-bold uppercase">Completa desafíos para desbloquear insignias exclusivas</p>
        </div>
        <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full shadow-sm">
          {earned.size} / {achievements.length} Desbloqueados
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {achievements.map((ach) => {
          const isEarned = earned.has(ach.id);
          return (
            <motion.div
              key={ach.id}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "relative group p-5 rounded-[2rem] border flex flex-col items-center justify-center text-center transition-all overflow-hidden",
                isEarned 
                  ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30 shadow-[0_8px_20px_-10px_rgba(245,158,11,0.2)]" 
                  : "bg-slate-900/60 border-white/5 opacity-50 grayscale"
              )}
            >
              <div className={cn(
                "text-4xl mb-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
                isEarned ? "filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : ""
              )}>
                {ach.icon}
              </div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">
                {ach.title}
              </h5>
              
              {!isEarned && (
                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                   <div className="flex flex-col items-center gap-2">
                     <Lock className="h-4 w-4 text-slate-500" />
                     <p className="text-[8px] text-slate-400 font-bold leading-tight uppercase tracking-tighter">
                        {ach.description}
                     </p>
                   </div>
                </div>
              )}

              {isEarned && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
