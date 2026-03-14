
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Trophy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quiz, QuizQuestion } from '@/hooks/useNotebookLMContent';
import { cn } from '@/lib/utils';
import { trackQuizComplete } from '@/hooks/useAnalytics';

interface Props {
    quiz: Quiz;
    videoId: string;
    onComplete?: (score: number) => void;
}

export const AITutorQuiz: React.FC<Props> = ({ quiz, videoId, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = quiz.questions[currentIndex];

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === currentQuestion.correct_index) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < quiz.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
            const passed = score >= (quiz.questions.length * 0.7); // 70% to pass
            trackQuizComplete(`ai_${videoId}`, score, quiz.questions.length, passed);
            if (onComplete) onComplete(score);
        }
    };

    if (isFinished) {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        return (
            <div className="text-center p-12 bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl">
                <div className="inline-flex p-6 rounded-[2rem] bg-indigo-500/10 text-indigo-400 mb-8">
                    <Trophy className="h-12 w-12" />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">¡Desafío Completado!</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Resultado del Quiz IA</p>

                <div className="text-6xl font-black text-white mb-8">{percentage}%</div>

                <div className="flex justify-center gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Correctas</p>
                        <p className="text-xl font-black text-emerald-400">{score}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-xl font-black text-white">{quiz.questions.length}</p>
                    </div>
                </div>

                <Button
                    onClick={() => window.location.reload()}
                    className="mt-12 h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs"
                >
                    Reiniciar Desafío
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Progress */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{quiz.title}</h3>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pregunta {currentIndex + 1} de {quiz.questions.length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Aciertos</p>
                        <p className="text-xl font-black text-emerald-500">{score}</p>
                    </div>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-indigo-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight">
                    {currentQuestion.question}
                </h4>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        const isCorrect = idx === currentQuestion.correct_index;
                        const isSelected = idx === selectedOption;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isAnswered}
                                className={cn(
                                    "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group",
                                    !isAnswered && "border-white/5 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5",
                                    isAnswered && isCorrect && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                                    isAnswered && isSelected && !isCorrect && "border-rose-500/50 bg-rose-500/10 text-rose-400",
                                    isAnswered && !isSelected && !isCorrect && "border-white/5 bg-white/5 opacity-40"
                                )}
                            >
                                <span className="font-bold text-sm md:text-base">{option}</span>
                                {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                                {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 shrink-0" />}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "mt-8 p-6 rounded-2xl border shadow-lg",
                                selectedOption === currentQuestion.correct_index
                                    ? "bg-emerald-500/5 border-emerald-500/20"
                                    : "bg-amber-500/5 border-amber-500/20"
                            )}
                        >
                            <div className="flex gap-4">
                                <div className={cn(
                                    "p-2 rounded-xl h-fit",
                                    selectedOption === currentQuestion.correct_index ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                )}>
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explicación</p>
                                    <p className="text-xs md:text-sm font-medium text-slate-300 leading-relaxed">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Button
                                    onClick={handleNext}
                                    className="bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl"
                                >
                                    {currentIndex === quiz.questions.length - 1 ? "Ver Resultados" : "Siguiente"}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
