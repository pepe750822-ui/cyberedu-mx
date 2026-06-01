
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Trophy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quiz, QuizQuestion } from '@/hooks/useNotebookLMContent';
import { cn } from '@/lib/utils';
import { trackQuizComplete } from '@/hooks/useAnalytics';
import { useAnalisisRendimiento } from '@/hooks/useAnalisisRendimiento';
import { toast } from 'sonner';
import { Brain as BrainIcon } from 'lucide-react';

interface Props {
    quiz: Quiz;
    videoId: string;
    onComplete?: (score: number) => void;
    onAskHelp?: (question: string) => void;
}

const MEMORY_KEY = "cyberagent_memory_v2";
const MEMORY_TTL = 7 * 24 * 60 * 60 * 1000;

function updateAgentMemory(updater: (mem: any) => any) {
    try {
        const raw = localStorage.getItem(MEMORY_KEY);
        let mem = { decisions: [], topics: [], insights: [], lastUpdated: Date.now() };
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.lastUpdated < MEMORY_TTL) mem = parsed;
        }
        const updated = updater(mem);
        localStorage.setItem(MEMORY_KEY, JSON.stringify({ ...updated, lastUpdated: Date.now() }));
    } catch { /* ignore */ }
}

// Helper to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function shuffleQuizQuestion(q: QuizQuestion): QuizQuestion {
  const optionsWithIndex = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correct_index }));
  const shuffledOptions = shuffleArray(optionsWithIndex);
  const newCorrectIndex = shuffledOptions.findIndex(o => o.isCorrect);
  return {
    ...q,
    options: shuffledOptions.map(o => o.text),
    correct_index: newCorrectIndex
  };
}

export const AITutorQuiz: React.FC<Props> = ({ quiz: originalQuiz, videoId, onComplete }) => {
    const quiz = useMemo(() => {
        if (!originalQuiz || !originalQuiz.questions) return originalQuiz;
        return {
            ...originalQuiz,
            questions: shuffleArray(originalQuiz.questions).map(shuffleQuizQuestion)
        };
    }, [originalQuiz]);

    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz?.questions?.length || 0).fill(null));
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
    const { trackQuizResult } = useAnalisisRendimiento();

    const handleOptionSelect = (qIdx: number, oIdx: number) => {
        if (isFinished) return;
        const newAnswers = [...answers];
        newAnswers[qIdx] = oIdx;
        setAnswers(newAnswers);
    };

    const handleShowResults = () => {
        if (isFinished) return;
        
        let calculatedScore = 0;
        const incorrectQuestions: string[] = [];
        const newInsights: string[] = [];

        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_index) {
                calculatedScore++;
                newInsights.push(`El usuario respondió correctamente la pregunta interactiva: "${q.question}"`);
            } else {
                incorrectQuestions.push(q.question);
                newInsights.push(`El usuario erró la pregunta interactiva: "${q.question}" (eligió opción incorrecta)`);
            }
        });

        setScore(calculatedScore);
        setIsFinished(true);

        const passed = calculatedScore >= (quiz.questions.length * 0.7);
        trackQuizComplete(`ai_${videoId}`, calculatedScore, quiz.questions.length, passed);
        
        trackQuizResult({
            quizId: `ai_${videoId}`,
            videoId,
            score: calculatedScore,
            total: quiz.questions.length,
            incorrectQuestions
        });

        updateAgentMemory(mem => ({
            ...mem,
            topics: [...new Set([...mem.topics, quiz.title])].slice(-15),
            insights: [...mem.insights, ...newInsights, `El usuario completó el cuestionario del video/simulador "${quiz.title}" con ${calculatedScore} aciertos de ${quiz.questions.length}.`].slice(-20)
        }));

        if (onComplete) onComplete(calculatedScore);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{quiz.title}</h3>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{quiz.questions.length} Preguntas</p>
                </div>
                <div className="text-right">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                            toast.info("CyberAgent está listo. Abre el tutor y pregunta sobre este tema.");
                        }}
                        className="h-9 px-4 rounded-xl border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/5 text-[10px] font-black uppercase tracking-widest"
                    >
                        <BrainIcon className="h-3 w-3 mr-2" />
                        Ayuda IA
                    </Button>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-8">
                {quiz.questions.map((q, qIdx) => {
                    const selectedIdx = answers[qIdx];
                    const isAnswered = isFinished;

                    return (
                        <div key={qIdx} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                            <h4 className="text-xl md:text-2xl font-bold text-white mb-8 leading-tight">
                                <span className="text-indigo-400 mr-2">{qIdx + 1}.</span>
                                {q.question}
                            </h4>

                            <div className="space-y-3">
                                {q.options.map((option, oIdx) => {
                                    const isCorrect = oIdx === q.correct_index;
                                    const isSelected = oIdx === selectedIdx;

                                    return (
                                        <button
                                            key={oIdx}
                                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                                            disabled={isFinished}
                                            className={cn(
                                                "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group",
                                                !isFinished && isSelected && "border-indigo-500/50 bg-indigo-500/10 text-indigo-400",
                                                !isFinished && !isSelected && "border-white/5 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5",
                                                isFinished && isCorrect && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
                                                isFinished && isSelected && !isCorrect && "border-rose-500/50 bg-rose-500/10 text-rose-400",
                                                isFinished && !isSelected && !isCorrect && "border-white/5 bg-white/5 opacity-40"
                                            )}
                                        >
                                            <span className="font-bold text-sm md:text-base">{option}</span>
                                            {isFinished && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0" />}
                                            {isFinished && isSelected && !isCorrect && <XCircle className="h-5 w-5 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <AnimatePresence>
                                {isFinished && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "mt-8 p-6 rounded-2xl border shadow-lg",
                                            selectedIdx === q.correct_index
                                                ? "bg-emerald-500/5 border-emerald-500/20"
                                                : "bg-amber-500/5 border-amber-500/20"
                                        )}
                                    >
                                        <div className="flex gap-4">
                                            <div className={cn(
                                                "p-2 rounded-xl h-fit",
                                                selectedIdx === q.correct_index ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                            )}>
                                                <AlertCircle className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Explicación</p>
                                                <p className="text-xs md:text-sm font-medium text-slate-300 leading-relaxed">
                                                    {q.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {!isFinished ? (
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleShowResults}
                        disabled={answers.includes(null)}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl disabled:opacity-50"
                    >
                        Ver Resultados
                    </Button>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-12 bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl mt-8"
                >
                    <div className="inline-flex p-6 rounded-[2rem] bg-indigo-500/10 text-indigo-400 mb-8">
                        <Trophy className="h-12 w-12" />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">¡Desafío Completado!</h3>
                    
                    <div className="text-6xl font-black text-white mb-8">
                        {Math.round((score / quiz.questions.length) * 100)}%
                    </div>

                    <div className="flex justify-center gap-4 mb-12">
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
                        className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs"
                    >
                        {score === quiz.questions.length ? "Repasar otro tema" : "Generar nuevo quiz"}
                    </Button>
                </motion.div>
            )}
        </div>
    );
};
