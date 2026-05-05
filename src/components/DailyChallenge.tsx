import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle, Zap, Brain, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const CHALLENGES = [
  { question: "¿Cuál es el valor de x en la ecuación 2x + 5 = 15?", options: ["x = 10", "x = 5", "x = 2", "x = 20"], correct: 1, area: "Matemáticas" },
  { question: "¿En qué año inició la Revolución Mexicana?", options: ["1810", "1910", "1921", "1857"], correct: 1, area: "Historia" },
  { question: "Elemento químico más abundante en el universo.", options: ["Oxígeno", "Helio", "Hidrógeno", "Carbono"], correct: 2, area: "Química" },
  { question: "Organelo responsable de la respiración celular.", options: ["Núcleo", "Ribosoma", "Mitocondria", "Cloroplasto"], correct: 2, area: "Biología" },
  { question: "¿Cuál es la fórmula de la Segunda Ley de Newton?", options: ["F = m/a", "F = m-a", "F = m+a", "F = m*a"], correct: 3, area: "Física" }
];

export const DailyChallenge = () => {
  const [completed, setCompleted] = useState(false);
  const [challenge, setChallenge] = useState(CHALLENGES[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Pick a daily challenge based on date
    const day = new Date().getDate();
    setChallenge(CHALLENGES[day % CHALLENGES.length]);
    
    // Check if already completed today
    const lastCompleted = localStorage.getItem('daily_challenge_date');
    const todayStr = new Date().toISOString().split('T')[0];
    if (lastCompleted === todayStr) {
      setCompleted(true);
    }
  }, []);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    
    if (idx === challenge.correct) {
      // Success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "¡Respuesta Correcta! 🔥",
        description: "Has ganado +1 día en tu racha de estudio.",
      });

      // Update streak
      const currentStreak = parseInt(localStorage.getItem('study_streak_count') || '0');
      localStorage.setItem('study_streak_count', (currentStreak + 1).toString());
      localStorage.setItem('last_study_date', new Date().toISOString().split('T')[0]);
      localStorage.setItem('daily_challenge_date', new Date().toISOString().split('T')[0]);
      
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

  if (completed) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-emerald-500">Reto Diario Completado</h3>
            <p className="text-xs text-slate-400 font-medium">¡Racha protegida! Vuelve mañana por otra pregunta.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400">
          <Flame className="h-5 w-5" />
          <span className="font-black text-sm">{localStorage.getItem('study_streak_count') || '1'} Días</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-xl">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Brain className="h-32 w-32 text-amber-500 -rotate-12" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <Zap className="h-3 w-3" />
            <span className="text-[10px] font-black uppercase tracking-widest">Reto Diario Express</span>
          </div>
          <h3 className="text-xl font-black text-white">{challenge.question}</h3>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Materia: {challenge.area}</p>
        </div>

        <div className="w-full md:w-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {challenge.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleSelect(idx)}
              className={cn(
                "p-3 rounded-xl border text-sm font-bold transition-all text-center",
                selected === idx 
                  ? (idx === challenge.correct ? "bg-emerald-500 border-emerald-400 text-white" : "bg-red-500 border-red-400 text-white")
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
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
