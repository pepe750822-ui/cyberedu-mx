import React, { useState, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { simuladoECOEMS, Question } from "@/data/simuladorData";
import { trackSimuladorStart, trackSimuladorPause, trackSimuladorResume, trackSimuladorComplete } from "@/hooks/useAnalytics";

const EXAM_TIME_SECONDS = 3 * 60 * 60; // 3 hours

interface SimuladorState {
    activo: boolean;
    fechaInicio: string;
    tiempoTotal: number;
    tiempoRestante: number;
    preguntaActual: number;
    respuestas: (number | null)[];
    correctas: boolean[];
    pausado: boolean;
    timestamp: number;
}


const SimuladorPro = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
    const [isExamActive, setIsExamActive] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [savedState, setSavedState] = useState<SimuladorState | null>(null);

    // Load saved state on mount
    useEffect(() => {
        const saved = localStorage.getItem('simulador_estado');
        if (saved) {
            try {
                const state: SimuladorState = JSON.parse(saved);
                if (state.activo) {
                    setSavedState(state);
                    setShowRestoreModal(true);
                }
            } catch (e) {
                logger.error("Error parsing saved state", e);
            }
        }
    }, []);

    const saveStateToLocalStorage = useCallback((overrides: Partial<SimuladorState> = {}) => {
        const answersArray = simuladoECOEMS.map(q => userAnswers[q.id] ?? null);
        const state: SimuladorState = {
            activo: true,
            fechaInicio: new Date(startTime || Date.now()).toISOString(),
            tiempoTotal: EXAM_TIME_SECONDS,
            tiempoRestante: timeLeft,
            preguntaActual: currentQuestionIndex,
            respuestas: answersArray,
            correctas: simuladoECOEMS.map(q => userAnswers[q.id] === q.correctIndex),
            pausado: isPaused,
            timestamp: Date.now(),
            ...overrides
        };
        localStorage.setItem('simulador_estado', JSON.stringify(state));
        // Save marked for review separately or include it in state? 
        // The interface didn't mention it, but it's needed for the 🟡 state.
        localStorage.setItem('simulador_revision', JSON.stringify(markedForReview));
    }, [currentQuestionIndex, userAnswers, timeLeft, isPaused, startTime, markedForReview]);

    const handleRestore = () => {
        if (savedState) {
            setIsExamActive(true);
            setCurrentQuestionIndex(savedState.preguntaActual);
            setTimeLeft(savedState.tiempoRestante);
            setStartTime(new Date(savedState.fechaInicio).getTime());

            const restoredAnswers: Record<string, number> = {};
            savedState.respuestas.forEach((ans, idx) => {
                if (ans !== null && simuladoECOEMS[idx]) {
                    restoredAnswers[simuladoECOEMS[idx].id] = ans;
                }
            });
            setUserAnswers(restoredAnswers);

            const savedRevision = localStorage.getItem('simulador_revision');
            if (savedRevision) {
                setMarkedForReview(JSON.parse(savedRevision));
            }

            setIsPaused(savedState.pausado);
            setShowRestoreModal(false);
        }
    };

    const handleNewExam = () => {
        localStorage.removeItem('simulador_estado');
        localStorage.removeItem('simulador_revision');
        handleStartExam();
        setShowRestoreModal(false);
    };

    const handlePause = () => {
        setIsPaused(true);
        trackSimuladorPause();
        saveStateToLocalStorage({ pausado: true });
        toast({
            title: "Simulador Pausado",
            description: "Puedes continuar más tarde. Tu progreso está guardado.",
        });
    };

    const handleResume = () => {
        setIsPaused(false);
        trackSimuladorResume();
        saveStateToLocalStorage({ pausado: false });
    };

    const handleSaveAndExit = () => {
        saveStateToLocalStorage();
        toast({
            title: "Progreso Guardado",
            description: "Vuelve cuando quieras a continuar tu examen.",
        });
        navigate("/");
    };

    // Auto-save on important actions
    useEffect(() => {
        if (isExamActive && !showResults) {
            const timer = setTimeout(() => {
                saveStateToLocalStorage();
            }, 10000); // Auto-save every 10 seconds
            return () => clearTimeout(timer);
        }
    }, [isExamActive, showResults, currentQuestionIndex, userAnswers, timeLeft, isPaused, saveStateToLocalStorage]);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isExamActive && timeLeft > 0 && !isPaused) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleFinishExam();
        }
        return () => clearInterval(timer);
    }, [isExamActive, timeLeft, isPaused]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = simuladoECOEMS[currentQuestionIndex];

    const handleStartExam = () => {
        trackSimuladorStart();
        setIsExamActive(true);
        setStartTime(Date.now());
        setUserAnswers({});
        setMarkedForReview({});
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

        // Save results for the achievement system
        const finalScore = calculateScore();
        const totalTime = EXAM_TIME_SECONDS - timeLeft;
        const pct = Math.round((finalScore / simuladoECOEMS.length) * 100);
        const prediccion = pct >= 70 ? 'aprobado' : 'reprobado';
        trackSimuladorComplete(finalScore, totalTime, prediccion);

        localStorage.setItem('quiz_score_simulador_pro', finalScore.toString());
        localStorage.setItem('last_sim_time_left', timeLeft.toString());

        // Mark as completed for stats
        const completedSims = parseInt(localStorage.getItem('completed_simulators') || '0');
        localStorage.setItem('completed_simulators', (completedSims + 1).toString());

        localStorage.removeItem('simulador_estado');
        localStorage.removeItem('simulador_revision');
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

    if (showRestoreModal) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-8 backdrop-blur-xl">
                    <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                        <RotateCcw className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-white">¿Continuar Anterior?</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Detectamos un simulador en progreso. ¿Deseas retomarlo exactamente donde lo dejaste?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={handleRestore} className="h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold uppercase">
                            Sí, Continuar
                        </Button>
                        <Button onClick={handleNewExam} variant="outline" className="h-14 rounded-2xl border-white/10 text-white font-bold uppercase">
                            No, Nuevo
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                            <span className="text-sm font-bold text-white">128 Reactivos</span>
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
                        Simulación generada por CyberEdu Mx v3.0
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

                    {/* Performance Map */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-400" /> Mapa de Desempeño
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Correctas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Incorrectas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full border-2 border-amber-500" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Marcadas</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-2 p-2">
                            {simuladoECOEMS.map((q, idx) => {
                                const isCorrect = userAnswers[q.id] === q.correctIndex;
                                const isMarked = markedForReview[q.id];
                                return (
                                    <a
                                        key={q.id}
                                        href={`#question-${q.id}`}
                                        className={cn(
                                            "h-8 w-8 rounded-full text-[10px] font-black flex items-center justify-center transition-all hover:scale-110",
                                            isCorrect ? "bg-emerald-500 text-white" : "bg-red-500 text-white",
                                            isMarked && "ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950"
                                        )}
                                        title={`Pregunta ${idx + 1}: ${isCorrect ? 'Correcta' : 'Incorrecta'}${isMarked ? ' (Marcada para revisión)' : ''}`}
                                    >
                                        {idx + 1}
                                    </a>
                                );
                            })}
                        </div>
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
                                    <div
                                        key={q.id}
                                        id={`question-${q.id}`}
                                        className={cn("p-6 rounded-3xl border transition-all scroll-mt-24", isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20")}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reactivo {idx + 1} - {q.area}</span>
                                            {isCorrect ? <CheckCircle2 className="text-emerald-500 h-5 w-5" /> : <XSquare className="text-red-500 h-5 w-5" />}
                                        </div>
                                        <p className="text-sm font-bold text-white mb-6">{q.text}</p>

                                        {q.imageUrl && (
                                            <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                                                <img src={q.imageUrl} alt={`Imagen reactivo ${idx + 1}`} className="max-h-64 mx-auto object-contain" />
                                            </div>
                                        )}

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
                <div className="container mx-auto flex items-center justify-between gap-4">
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

                    <div className="hidden lg:flex flex-1 max-w-md mx-4 flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                            <span>Preguntas respondidas</span>
                            <span>{Object.keys(userAnswers).length} de {simuladoECOEMS.length}</span>
                        </div>
                        <Progress value={(Object.keys(userAnswers).length / simuladoECOEMS.length) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={isPaused ? handleResume : handlePause}
                            variant="outline"
                            className="hidden md:flex rounded-xl px-4 h-12 text-[10px] font-black uppercase tracking-widest border-white/10 text-white"
                        >
                            {isPaused ? "▶️ Continuar" : "⏸️ Pausar"}
                        </Button>
                        <Button
                            onClick={handleSaveAndExit}
                            variant="outline"
                            className="hidden md:flex rounded-xl px-4 h-12 text-[10px] font-black uppercase tracking-widest border-white/10 text-white"
                        >
                            💾 Guardar y salir
                        </Button>
                        <Button onClick={handleFinishExam} variant="destructive" className="rounded-xl px-6 h-12 text-[10px] font-black uppercase tracking-widest">
                            🏁 Finalizar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Question Main Area */}
            <div className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
                {isPaused && (
                    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
                        <div className="max-w-md w-full text-center space-y-6">
                            <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                                <Timer className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Simulador Pausado</h2>
                            <p className="text-slate-400">Puedes continuar más tarde. Tu progreso está guardado.</p>
                            <Button onClick={handleResume} className="w-full h-16 rounded-2xl bg-primary text-lg font-black uppercase tracking-widest">
                                Reanudar Simulador
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">

                    {/* Navigation Panel */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Panel de Navegación (128 Preguntas)</h3>
                        <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 p-4 bg-black/20 rounded-2xl border border-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {simuladoECOEMS.map((q, idx) => {
                                const isCurrent = currentQuestionIndex === idx;
                                const isAnswered = userAnswers[q.id] !== undefined;
                                const isMarked = markedForReview[q.id];

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={cn(
                                            "h-8 w-8 rounded-full text-[10px] font-black transition-all flex items-center justify-center shrink-0 shadow-sm border-2",
                                            isCurrent ? "bg-white text-blue-600 border-blue-600 scale-110 z-10 shadow-[0_0_15px_rgba(37,99,235,0.4)]" :
                                                isMarked ? "bg-amber-500 text-white border-amber-600 animate-pulse" : // Máxima prioridad si está marcada
                                                    isAnswered ? "bg-blue-600 text-white border-blue-700" : // Respondida normal
                                                        "bg-slate-800 text-slate-500 border-white/5 hover:border-white/20" // Sin responder
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
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

                        {currentQuestion.imageUrl && (
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20 p-4">
                                <img
                                    src={currentQuestion.imageUrl}
                                    alt="Visual del reactivo"
                                    className="max-h-80 mx-auto object-contain animate-in fade-in zoom-in duration-500"
                                />
                            </div>
                        )}
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

                    <div className="flex gap-4 items-center">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setMarkedForReview(prev => ({
                                    ...prev,
                                    [currentQuestion.id]: !prev[currentQuestion.id]
                                }));
                            }}
                            className={cn(
                                "rounded-xl border-white/10 px-4 h-12 text-[10px] font-black uppercase tracking-widest",
                                markedForReview[currentQuestion.id] ? "bg-amber-500/20 border-amber-500 text-amber-500" : "text-slate-400 hover:bg-white/5"
                            )}
                        >
                            <AlertCircle className="mr-1 h-3 w-3" /> {markedForReview[currentQuestion.id] ? "Marcada" : "Marcar Revisión"}
                        </Button>

                        <div className="hidden sm:flex gap-2 text-[10px] font-black text-slate-600 uppercase">
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
