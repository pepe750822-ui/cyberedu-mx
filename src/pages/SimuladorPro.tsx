import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Timer,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    XSquare,
    AlertCircle,
    Trophy,
    BarChart3,
    RotateCcw,
    LayoutDashboard,
    Brain,
    Zap,
    Clock,
    ExternalLink,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { simuladoECOEMS, Question } from "@/data/simuladorData";

const EXAM_TIME_SECONDS = 3 * 60 * 60; // 3 hours

const SimuladorPro = () => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
    const [isExamActive, setIsExamActive] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isExamActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleFinishExam();
        }
        return () => clearInterval(timer);
    }, [isExamActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = simuladoECOEMS[currentQuestionIndex];

    const handleStartExam = () => {
        setIsExamActive(true);
        setStartTime(Date.now());
        setUserAnswers({});
        setCurrentQuestionIndex(0);
        setTimeLeft(EXAM_TIME_SECONDS);
        setShowResults(false);
    };

    const handleSelectAnswer = (optionIndex: number) => {
        if (showResults) return;
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < simuladoECOEMS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleFinishExam = () => {
        setIsExamActive(false);
        setShowResults(true);
    };

    // Calculations for results
    const calculateScore = () => {
        let correct = 0;
        simuladoECOEMS.forEach(q => {
            if (userAnswers[q.id] === q.correctIndex) {
                correct++;
            }
        });
        return correct;
    };

    if (!isExamActive && !showResults) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-8 backdrop-blur-xl">
                    <div className="h-24 w-24 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                        <Brain className="h-12 w-12 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Simulador Pro ECOEMS</h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                            Estás por iniciar una réplica exacta del examen oficial.
                            Tendrás 128 reactivos y un tiempo límite de 3 horas.
                            Asegúrate de estar en un lugar tranquilo.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Duración</span>
                            <span className="text-sm font-bold text-white">3 Horas</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Reactivos</span>
                            <span className="text-sm font-bold text-white">ECOEMS Oficial</span>
                        </div>
                    </div>
                    <Button
                        onClick={handleStartExam}
                        className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 group"
                    >
                        Comenzar Examen
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <Zap className="h-3 w-3 text-amber-500" />
                        Simulación generada por CyberEdu Mx v2.0
                    </p>
                </div>
            </div>
        );
    }

    const score = calculateScore();
    const percentage = (score / simuladoECOEMS.length) * 100;

    if (showResults) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header Results */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                                <Trophy className="h-10 w-10" />
                            </div>
                            <h2 className="text-3xl font-black uppercase text-white">Resultado del Examen</h2>
                            <div className="flex gap-4 items-end">
                                <span className="text-7xl font-black text-white">{score}</span>
                                <span className="text-2xl font-black text-slate-500 mb-2">/ {simuladoECOEMS.length}</span>
                            </div>
                            <Progress value={percentage} className="h-3 w-full max-w-sm" />
                            <p className="text-slate-400 text-sm">
                                Has superado el <span className="text-emerald-400 font-bold">{percentage.toFixed(0)}%</span> de los reactivos correctamente.
                            </p>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Predicción AI</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Probabilidad de Ingreso</span>
                                    <span className="text-sm font-black text-white">{percentage > 80 ? "ALTA" : percentage > 60 ? "MEDIA" : "EN MEJORA"}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Promedio Usuarios</span>
                                    <span className="text-sm font-black text-white">74 / 128</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Tu Desempeño</span>
                                    <span className={cn("text-sm font-black", score > 74 ? "text-emerald-400" : "text-amber-400")}>
                                        {score > 74 ? "+ Superior al Promedio" : "- Bajo el Promedio"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button onClick={handleStartExam} variant="outline" className="flex-1 h-14 rounded-xl border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest">
                            <RotateCcw className="mr-2 h-4 w-4" /> Reintentar Simulador
                        </Button>
                        <Button onClick={() => navigate("/")} className="flex-1 h-14 rounded-xl bg-primary text-xs font-black uppercase tracking-widest">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Volver al Dashboard
                        </Button>
                    </div>

                    {/* Review Questions */}
                    <div className="space-y-6 pt-10 border-t border-white/5">
                        <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" /> Análisis de Respuestas
                        </h3>
                        <div className="grid gap-4">
                            {simuladoECOEMS.map((q, idx) => {
                                const isCorrect = userAnswers[q.id] === q.correctIndex;
                                return (
                                    <div key={q.id} className={cn("p-6 rounded-3xl border transition-all", isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reactivo {idx + 1} - {q.area}</span>
                                            {isCorrect ? <CheckCircle2 className="text-emerald-500 h-5 w-5" /> : <XSquare className="text-red-500 h-5 w-5" />}
                                        </div>
                                        <p className="text-sm font-bold text-white mb-6">{q.text}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                            {q.options.map((opt, i) => (
                                                <div key={i} className={cn(
                                                    "p-3 rounded-xl text-xs font-medium border",
                                                    i === q.correctIndex ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-100" :
                                                        i === userAnswers[q.id] ? "bg-red-500/20 border-red-500/30 text-red-100" : "bg-white/5 border-white/5 text-slate-400"
                                                )}>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-black uppercase text-primary mb-2">Explicación Pro</p>
                                            <p className="text-xs text-slate-300 italic">"{q.explanation}"</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Exam Active View
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* HUD Header */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 p-4 md:p-6 sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center">
                            <Timer className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase">Tiempo Restante</p>
                            <p className={cn("text-xl font-black text-white tabular-nums", timeLeft < 300 && "text-red-500 animate-pulse")}>
                                {formatTime(timeLeft)}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-md mx-10 flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                            <span>Progreso del Examen</span>
                            <span>{currentQuestionIndex + 1} de {simuladoECOEMS.length}</span>
                        </div>
                        <Progress value={((currentQuestionIndex + 1) / simuladoECOEMS.length) * 100} className="h-2" />
                    </div>

                    <Button onClick={handleFinishExam} variant="destructive" className="rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest">
                        Finalizar
                    </Button>
                </div>
            </div>

            {/* Question Main Area */}
            <div className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">

                    {/* Quick Navigator Bar */}
                    <div className="flex flex-wrap gap-2 mb-8 p-4 bg-black/20 rounded-2xl border border-white/5 max-h-32 overflow-y-auto custom-scrollbar">
                        {simuladoECOEMS.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={cn(
                                    "h-8 w-8 rounded-lg text-[10px] font-black transition-all",
                                    currentQuestionIndex === idx ? "bg-primary text-white scale-110 shadow-lg" :
                                        userAnswers[q.id] !== undefined ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30" :
                                            "bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10"
                                )}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    {/* Subtle Area Indicator */}
                    <div className="absolute top-0 right-0 p-8">
                        <span className="text-[40px] font-black text-white/5 uppercase select-none pointer-events-none">
                            {currentQuestion.area}
                        </span>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                                {currentQuestion.area}
                            </span>
                            <span className="text-slate-600 text-[10px] font-bold">Reactivo {currentQuestionIndex + 1}</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                            {currentQuestion.text}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectAnswer(idx)}
                                className={cn(
                                    "p-6 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 group",
                                    userAnswers[currentQuestion.id] === idx
                                        ? "bg-primary/20 border-primary text-white shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                                        : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20"
                                )}
                            >
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors",
                                    userAnswers[currentQuestion.id] === idx ? "bg-primary text-white" : "bg-white/10 text-slate-500 group-hover:bg-white/20"
                                )}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-sm md:text-base font-medium">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="bg-slate-950 border-t border-white/10 p-6">
                <div className="container mx-auto max-w-4xl flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="rounded-xl border-white/10 hover:bg-white/5 px-6 h-12 text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>

                    <div className="flex gap-2 text-[10px] font-black text-slate-600 uppercase">
                        {userAnswers[currentQuestion.id] !== undefined ? (
                            <div className="flex items-center gap-1 text-emerald-500">
                                <CheckCircle2 className="h-3 w-3" /> Respuesta Guardada
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Sin Responder
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={currentQuestionIndex === simuladoECOEMS.length - 1 ? handleFinishExam : handleNext}
                        className="rounded-xl bg-primary px-8 h-12 text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                        {currentQuestionIndex === simuladoECOEMS.length - 1 ? "Finalizar" : "Siguiente"} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SimuladorPro;
