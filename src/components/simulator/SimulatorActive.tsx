import React, { useState, useEffect } from "react";
import {
    Timer,
    Zap,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Question } from "@/data/simuladorData";

interface SimulatorActiveProps {
    currentQuestionIndex: number;
    activeQuestions: Question[];
    userAnswers: Record<string, number>;
    markedForReview: Record<string, boolean>;
    timeLeft: number;
    isPaused: boolean;
    examMode: 'full' | 'practice';
    onSelectAnswer: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    onPause: () => void;
    onResume: () => void;
    onFinish: () => void;
    onSaveAndExit: () => void;
    onToggleMark: () => void;
    onJumpToQuestion: (index: number) => void;
    onReportQuestion: (questionId: string) => Promise<boolean>;
    formatTime: (seconds: number) => string;
}

export const SimulatorActive: React.FC<SimulatorActiveProps> = ({
    currentQuestionIndex,
    activeQuestions,
    userAnswers,
    markedForReview,
    timeLeft,
    isPaused,
    examMode,
    onSelectAnswer,
    onNext,
    onPrev,
    onPause,
    onResume,
    onFinish,
    onSaveAndExit,
    onToggleMark,
    onJumpToQuestion,
    onReportQuestion,
    formatTime
}) => {
    const currentQuestion = activeQuestions[currentQuestionIndex];

    // Local feedback state — resets or pre-populates when question changes
    const [feedbackIndex, setFeedbackIndex] = useState<number | null>(null);
    const [reported, setReported] = useState(false);

    useEffect(() => {
        const existing = currentQuestion ? userAnswers[currentQuestion.id] : undefined;
        setFeedbackIndex(existing !== undefined ? existing : null);
        setReported(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestionIndex]);

    const handleAnswerSelect = (idx: number) => {
        if (feedbackIndex !== null) return; // lock after first answer
        setFeedbackIndex(idx);
        onSelectAnswer(idx);
    };

    const handleNext = () => {
        currentQuestionIndex === activeQuestions.length - 1 ? onFinish() : onNext();
    };

    const handleReport = async () => {
        if (!currentQuestion || reported) return;
        setReported(true);
        const ok = await onReportQuestion(currentQuestion.id);
        if (!ok) setReported(false);
    };

    const handleAskTutor = () => {
        if (!currentQuestion) return;
        const correct = currentQuestion.options[currentQuestion.correctIndex];
        const message = `Explícame esta pregunta del ECOEMS:\n"${currentQuestion.text}"\n\nLa respuesta correcta es: "${correct}"\n\n${currentQuestion.explanation}`;
        window.dispatchEvent(new CustomEvent('cyberedu:open-chat', { detail: { message } }));
    };

    // Enter key → ask Tutor IA when feedback is visible
    useEffect(() => {
        if (feedbackIndex === null) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !(e.target as HTMLElement).closest('button')) {
                e.preventDefault();
                handleAskTutor();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [feedbackIndex, currentQuestionIndex]);

    const isCorrect = feedbackIndex !== null && feedbackIndex === currentQuestion?.correctIndex;

    const optionClass = (idx: number) => {
        if (feedbackIndex === null) {
            return userAnswers[currentQuestion?.id] === idx
                ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20";
        }
        if (idx === currentQuestion.correctIndex)
            return "bg-green-500/20 border-green-500/60 text-white";
        if (idx === feedbackIndex)
            return "bg-red-500/20 border-red-500/60 text-white";
        return "bg-white/5 border-white/5 text-slate-500 opacity-40";
    };

    const badgeClass = (idx: number) => {
        if (feedbackIndex === null) {
            return userAnswers[currentQuestion?.id] === idx
                ? "bg-primary text-white"
                : "bg-white/10 text-slate-500 group-hover:bg-white/20";
        }
        if (idx === currentQuestion.correctIndex) return "bg-green-500 text-white";
        if (idx === feedbackIndex) return "bg-red-500 text-white";
        return "bg-white/10 text-slate-500";
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* HUD Header */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 md:p-6 sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                            {examMode === 'practice'
                                ? <Zap className="h-6 w-6 text-amber-400" />
                                : <Timer className="h-6 w-6 text-primary" />
                            }
                        </div>
                        <div>
                            {examMode === 'full' ? (
                                <>
                                    <p className="text-[10px] font-black text-slate-500 uppercase">Tiempo Restante</p>
                                    <p className={cn("text-xl font-black text-white tabular-nums", timeLeft < 300 && "text-red-500 animate-pulse")}>
                                        {formatTime(timeLeft)}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-[10px] font-black text-slate-500 uppercase">Modo Práctica</p>
                                    <p className="text-xl font-black text-amber-400">Sin límite</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-1 max-w-md mx-4 flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                            <span>Preguntas respondidas</span>
                            <span>{Object.keys(userAnswers).length} de {activeQuestions.length}</span>
                        </div>
                        <Progress value={(Object.keys(userAnswers).length / activeQuestions.length) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2">
                        {examMode === 'full' && (
                            <Button
                                onClick={isPaused ? onResume : onPause}
                                variant="outline"
                                className="hidden md:flex rounded-xl px-4 h-12 text-[10px] font-black uppercase tracking-widest border-white/10 text-white"
                            >
                                {isPaused ? "▶️ Continuar" : "⏸️ Pausar"}
                            </Button>
                        )}
                        <Button
                            onClick={onSaveAndExit}
                            variant="outline"
                            className="hidden md:flex rounded-xl px-4 h-12 text-[10px] font-black uppercase tracking-widest border-white/10 text-white"
                        >
                            💾 Guardar y salir
                        </Button>
                        <Button onClick={onFinish} variant="destructive" className="rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest">
                            🏁 Finalizar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Question Main Area */}
            <div className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
                {isPaused && examMode === 'full' && (
                    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
                        <div className="max-w-md w-full text-center space-y-6">
                            <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                                <Timer className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Simulador Pausado</h2>
                            <p className="text-slate-400">Puedes continuar más tarde. Tu progreso está guardado.</p>
                            <Button onClick={onResume} className="w-full h-16 rounded-2xl bg-primary text-lg font-black uppercase tracking-widest">
                                Reanudar Simulador
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
                    {/* Navigation Panel */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Panel de Navegación ({activeQuestions.length} Preguntas)
                        </h3>
                        <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 p-4 bg-black/20 rounded-2xl border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {activeQuestions.map((q, idx) => {
                                const isCurrent = currentQuestionIndex === idx;
                                const isAnswered = userAnswers[q.id] !== undefined;
                                const isMarked = markedForReview[q.id];

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => onJumpToQuestion(idx)}
                                        className={cn(
                                            "h-8 w-8 rounded-full text-[10px] font-black transition-all flex items-center justify-center shrink-0 shadow-sm border-2",
                                            isCurrent ? "bg-white text-blue-600 border-blue-600 scale-110 z-10 shadow-[0_0_15px_rgba(37,99,235,0.4)]" :
                                                isMarked ? "bg-amber-500 text-white border-amber-600 animate-pulse" :
                                                    isAnswered ? "bg-blue-600 text-white border-blue-700" :
                                                        "bg-slate-800 text-slate-500 border-white/5 hover:border-white/20"
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                                {currentQuestion?.area}
                            </span>
                            <span className="text-slate-600 text-[10px] font-bold">Reactivo {currentQuestionIndex + 1}</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                            {currentQuestion?.text}
                        </h2>

                        {currentQuestion?.imageUrl && (
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20 p-4">
                                <img
                                    src={currentQuestion.imageUrl}
                                    alt="Visual del reactivo"
                                    className="max-h-80 mx-auto object-contain animate-in fade-in zoom-in duration-500"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>

                    {/* Answer options */}
                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {currentQuestion?.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(idx)}
                                disabled={feedbackIndex !== null}
                                className={cn(
                                    "p-6 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 group disabled:cursor-default",
                                    optionClass(idx)
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors",
                                    badgeClass(idx)
                                )}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-sm md:text-base font-medium">{option}</span>
                            </button>
                        ))}
                    </div>

                    {/* Immediate feedback panel */}
                    {feedbackIndex !== null && currentQuestion && (
                        <div className={cn(
                            "rounded-2xl p-5 border animate-in fade-in slide-in-from-bottom-2 duration-300",
                            isCorrect
                                ? "bg-green-500/15 border-green-500/40"
                                : "bg-red-500/15 border-red-500/40"
                        )}>
                            <div className="flex items-center gap-2 mb-2">
                                {isCorrect
                                    ? <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                                    : <XSquare className="h-5 w-5 text-red-400 shrink-0" />
                                }
                                <p className={cn("font-black text-base", isCorrect ? "text-green-300" : "text-red-300")}>
                                    {isCorrect ? "¡Correcto!" : "Incorrecto"}
                                </p>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {currentQuestion.explanation}
                            </p>
                            <button
                                onClick={handleNext}
                                className="mt-4 w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
                            >
                                {currentQuestionIndex === activeQuestions.length - 1
                                    ? "Finalizar simulador"
                                    : "Siguiente pregunta →"}
                            </button>
                            <button
                                onClick={handleAskTutor}
                                className="mt-2 w-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/40 hover:border-violet-400/60 text-violet-300 hover:text-violet-200 font-bold text-[11px] py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                🧠 Preguntar al Tutor IA
                                <span className="text-[9px] text-violet-500 font-black uppercase tracking-widest">[Enter]</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Report question */}
            <div className="container mx-auto max-w-4xl flex justify-end px-4 pb-1">
                <button
                    onClick={handleReport}
                    disabled={reported}
                    className={cn(
                        "text-[10px] transition-colors",
                        reported
                            ? "text-green-500 cursor-default"
                            : "text-slate-600 hover:text-slate-400 underline"
                    )}
                >
                    {reported ? "✅ Reporte enviado" : "⚠️ Reportar problema con esta pregunta"}
                </button>
            </div>

            {/* Navigation Footer */}
            <div className="bg-slate-950 border-t border-white/10 p-4">
                <div className="container mx-auto max-w-4xl flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={onPrev}
                        disabled={currentQuestionIndex === 0}
                        className="flex-1 rounded-xl border-white/10 hover:bg-white/5 h-12 min-h-[44px] text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                    </Button>

                    <Button
                        onClick={currentQuestionIndex === activeQuestions.length - 1 ? onFinish : onNext}
                        className="flex-1 rounded-xl bg-primary h-12 min-h-[44px] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                        {currentQuestionIndex === activeQuestions.length - 1 ? "Finalizar" : "Siguiente"} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onToggleMark}
                        className={cn(
                            "flex-1 rounded-xl border-white/10 hover:bg-white/5 h-12 min-h-[44px] text-[10px] font-black uppercase tracking-widest",
                            markedForReview[currentQuestion?.id] && "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        )}
                    >
                        {markedForReview[currentQuestion?.id] ? "⭐ Marcada" : "🔖 Marcar"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
