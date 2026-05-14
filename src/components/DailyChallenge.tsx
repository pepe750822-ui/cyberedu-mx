import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle, Zap, Brain, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell } from 'lucide-react';

export const DailyChallenge = () => {
  const [completed, setCompleted] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<{
    id: string;
    question: string;
    options: string[];
    correct_index: number;
    area: string;
  } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, session, refreshProfile, profile } = useAuth();
  const { subscribe } = usePushNotifications();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(localStorage.getItem('push_subscribed') === 'true');

  useEffect(() => {
    const fetchTodayChallenge = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const examDate = new Date('2026-06-20');
        const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const dailySeed = Math.max(0, daysUntilExam);

        const alreadyClaimedOnServer = profile?.last_challenge_reward === todayStr;
        const lastCompletedLocal = localStorage.getItem('daily_challenge_date');

        if (alreadyClaimedOnServer || lastCompletedLocal === todayStr) {
          setCompleted(true);
          setLoading(false);
          return;
        }

        // 1. Exact date match (challenges manually scheduled in DB)
        const { data: exactMatch } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('active_date', todayStr)
          .maybeSingle();

        if (exactMatch) {
          setChallenge(exactMatch);
          return;
        }

        // 2. Seeded daily selection — unique question each day until exam (seed = days remaining)
        const { data: allChallenges } = await supabase
          .from('daily_challenges')
          .select('*')
          .order('created_at', { ascending: true });

        if (allChallenges && allChallenges.length > 0) {
          const idx = dailySeed % allChallenges.length;
          setChallenge(allChallenges[idx]);
        } else {
          setChallenge({
            id: 'fallback-1',
            question: '¿Qué órgano del cuerpo humano es el encargado de bombear la sangre?',
            options: ['Pulmones', 'Cerebro', 'Corazón', 'Hígado'],
            correct_index: 2,
            area: 'Biología'
          });
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayChallenge();
  }, [profile]);

  const handleSelect = async (idx: number) => {
    if (!challenge) return;
    setSelected(idx);
    
    if (idx === challenge.correct_index) {
      // Success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      const todayStr = new Date().toISOString().split('T')[0];

      // 1. Claim token reward if logged in
      if (user && session) {
        setClaiming(true);
        try {
          const resp = await fetch('/api/claim-challenge-reward', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          const data = await resp.json();
          if (data.success) {
            toast({
              title: "¡Respuesta Correcta! 🔥",
              description: "Has ganado +1 día en tu racha y +1 Token de Tutor IA.",
            });
            await refreshProfile();
          } else {
            console.error("Reward claim failed:", data.error);
            toast({
              title: "¡Respuesta Correcta! 🔥",
              description: "Has ganado +1 día en tu racha.",
            });
          }
        } catch (e) {
          console.error("Error claiming reward:", e);
        } finally {
          setClaiming(false);
        }
      } else {
        toast({
          title: "¡Respuesta Correcta! 🔥",
          description: "Has ganado +1 día en tu racha. Inicia sesión para ganar tokens.",
        });
      }

      // 2. Update streak
      const currentStreak = parseInt(localStorage.getItem('study_streak_count') || '0');
      localStorage.setItem('study_streak_count', (currentStreak + 1).toString());
      localStorage.setItem('last_study_date', todayStr);
      localStorage.setItem('daily_challenge_date', todayStr);
      localStorage.setItem('daily_challenge_sync', Date.now().toString());
      
      setTimeout(() => {
        setCompleted(true);
        // Force update on other components like ProgresoDashboard
        window.dispatchEvent(new Event('storage'));
      }, 1500);

    } else {
      toast({
        variant: "destructive",
        title: "Incorrecto",
        description: "Inténtalo de nuevo. Piensa bien tu respuesta.",
      });
      setTimeout(() => setSelected(null), 1000);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas una cuenta para activar recordatorios.",
      });
      return;
    }
    
    setIsSubscribing(true);
    const success = await subscribe(user.id);
    setIsSubscribing(false);
    
    if (success) {
      setIsSubscribed(true);
      localStorage.setItem('push_subscribed', 'true');
      toast({
        title: "¡Recordatorios Activados! 🔔",
        description: "Te avisaremos cuando tu reto diario esté listo.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No pudimos activar las notificaciones. Revisa los permisos de tu navegador.",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 flex items-center justify-center min-h-[160px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cargando Reto...</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-emerald-500">Reto Diario Completado</h3>
            <p className="text-xs text-slate-400 font-medium">¡Racha protegida y recompensas obtenidas! Vuelve mañana.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isSubscribed && (
            <button 
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2"
              title="Activar recordatorios"
            >
              {isSubscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4 text-amber-400" />}
              <span className="text-[10px] font-black uppercase hidden md:inline">Recordarme</span>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400">
            <Flame className="h-5 w-5" />
            <span className="font-black text-sm">{localStorage.getItem('study_streak_count') || '1'} Días</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="relative overflow-hidden bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Brain className="h-32 w-32 text-amber-500 -rotate-12" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
            {claiming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {claiming ? 'Procesando Recompensa...' : 'Reto Diario Express'}
            </span>
          </div>
          <h3 className="text-xl font-black text-white leading-tight">{challenge.question}</h3>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <div className="flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Materia: {challenge.area}</p>
             </div>
             <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
               <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
               <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black">¡GANA 1 TOKEN IA GRATIS!</p>
             </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {challenge.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selected !== null || claiming}
              onClick={() => handleSelect(idx)}
              className={cn(
                "p-4 rounded-2xl border text-sm font-bold transition-all text-center",
                selected === idx 
                  ? (idx === challenge.correct_index ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-red-500 border-red-400 text-white")
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]",
                claiming && "opacity-50 cursor-not-allowed"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
