import React, { useState, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
    Target,
    Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { simuladoECOEMS, Question } from "@/data/simuladorData";
import { simuladoECOEMS2 } from "@/data/simuladorData2";
import { simuladoECOEMS3 } from "@/data/simuladorData3";
import { simuladoECOEMS4 } from "@/data/simuladorData4";
import { trackSimuladorStart, trackSimuladorPause, trackSimuladorResume, trackSimuladorComplete } from "@/hooks/useAnalytics";

const EXAM_TIME_SECONDS = 3 * 60 * 60;
const PRACTICE_QUESTION_COUNT = 20;

type ExamMode = 'full' | 'practice';
type BankSelection = 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'mixed';

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Shuffle options within a question and update correctIndex
function shuffleQuestionOptions(q: Question): Question {
    const indices = shuffleArray([0, 1, 2, 3].slice(0, q.options.length));
    return {
        ...q,
        options: indices.map(i => q.options[i]),
        correctIndex: indices.indexOf(q.correctIndex),
    };
}

const AREA_FILTERS: { label: string; value: string }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Matemáticas', value: 'Matemáticas' },
    { label: 'Física', value: 'Física' },
    { label: 'Química', value: 'Química' },
    { label: 'Biología', value: 'Biología' },
    { label: 'Historia', value: 'Historia' },
    { label: 'Geografía', value: 'Geografía' },
    { label: 'Español', value: 'Español' },
    { label: 'Cívica', value: 'Formación Cívica y Ética' },
    { label: 'Habilidades', value: 'habilidades' },
];

interface Escuela { id: string; nombre: string; tipo: 'UNAM' | 'IPN'; puntaje: number }

const ESCUELAS: Escuela[] = [
    { id: 'cch_sur', nombre: 'CCH Sur', tipo: 'UNAM', puntaje: 95 },
    { id: 'cch_oriente', nombre: 'CCH Oriente', tipo: 'UNAM', puntaje: 87 },
    { id: 'cch_vallejo', nombre: 'CCH Vallejo', tipo: 'UNAM', puntaje: 90 },
    { id: 'cch_azcapo', nombre: 'CCH Azcapotzalco', tipo: 'UNAM', puntaje: 88 },
    { id: 'cch_naucalpan', nombre: 'CCH Naucalpan', tipo: 'UNAM', puntaje: 86 },
    { id: 'prepa1', nombre: 'Prepa 1 UNAM', tipo: 'UNAM', puntaje: 100 },
    { id: 'prepa2', nombre: 'Prepa 2 UNAM', tipo: 'UNAM', puntaje: 96 },
    { id: 'prepa3', nombre: 'Prepa 3 UNAM', tipo: 'UNAM', puntaje: 98 },
    { id: 'prepa4', nombre: 'Prepa 4 UNAM', tipo: 'UNAM', puntaje: 94 },
    { id: 'prepa5', nombre: 'Prepa 5 UNAM', tipo: 'UNAM', puntaje: 97 },
    { id: 'prepa6', nombre: 'Prepa 6 UNAM', tipo: 'UNAM', puntaje: 99 },
    { id: 'cecyt1', nombre: 'CECyT 1 Gonzalo Vázquez', tipo: 'IPN', puntaje: 85 },
    { id: 'cecyt2', nombre: 'CECyT 2 Miguel Bernard', tipo: 'IPN', puntaje: 83 },
    { id: 'cecyt3', nombre: 'CECyT 3 Estanislao Ramírez', tipo: 'IPN', puntaje: 82 },
    { id: 'cecyt4', nombre: 'CECyT 4 Lázaro Cárdenas', tipo: 'IPN', puntaje: 84 },
    { id: 'cecyt5', nombre: 'CECyT 5 Benito Juárez', tipo: 'IPN', puntaje: 86 },
    { id: 'cecyt6', nombre: 'CECyT 6 Miguel Othón', tipo: 'IPN', puntaje: 81 },
    { id: 'cecyt7', nombre: 'CECyT 7 Cuauhtémoc', tipo: 'IPN', puntaje: 83 },
    { id: 'cecyt9', nombre: 'CECyT 9 Juan de Dios Bátiz', tipo: 'IPN', puntaje: 87 },
    { id: 'cecyt10', nombre: 'CECyT 10 Carlos Vallejo', tipo: 'IPN', puntaje: 82 },
    { id: 'cecyt11', nombre: 'CECyT 11 Wilfrido Massieu', tipo: 'IPN', puntaje: 88 },
];

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
    examMode: ExamMode;
}

const SimuladorPro = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const GUEST_MAX_QUESTIONS = 10;
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
    const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
    const [examMode, setExamMode] = useState<ExamMode>('full');
    const [selectedArea, setSelectedArea] = useState<string>('all');
    const [selectedBank, setSelectedBank] = useState<BankSelection>('bank1');
    const [selectedEscuela, setSelectedEscuela] = useState<Escuela | null>(() => {
        try {
            const saved = localStorage.getItem('user_target_school');
            return saved ? (ESCUELAS.find(e => e.nombre === saved) ?? null) : null;
        } catch { return null; }
    });

    // SEO Dynamic Tags for Simulador
    useEffect(() => {
        document.title = "Simulador Pro ECOEMS 2026 - 512 Reactivos | CyberEdu MX";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", "Realiza el simulador pro más avanzado para el ECOEMS 2026. 512 reactivos en 4 bancos, modo práctica sin tiempo y predicción de resultados con IA.");
        }

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Quiz",
            "name": "Simulador Pro ECOEMS 2026",
            "description": "Réplica exacta del examen oficial ECOEMS con 128 reactivos y cronómetro de 3 horas.",
            "educationalAlignment": {
                "@type": "AlignmentObject",
                "alignmentType": "educationalLevel",
                "educationalFramework": "ECOEMS",
                "targetName": "Educación Media Superior"
            },
            "author": {
                "@type": "Organization",
                "name": "CyberEdu MX"
            }
        };

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.innerHTML = JSON.stringify(structuredData);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

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
        const answersArray = activeQuestions.map(q => userAnswers[q.id] ?? null);
        const state: SimuladorState = {
            activo: true,
            fechaInicio: new Date(startTime || Date.now()).toISOString(),
            tiempoTotal: EXAM_TIME_SECONDS,
            tiempoRestante: timeLeft,
            preguntaActual: currentQuestionIndex,
            respuestas: answersArray,
            correctas: activeQuestions.map(q => userAnswers[q.id] === q.correctIndex),
            pausado: isPaused,
            timestamp: Date.now(),
            examMode,
            ...overrides
        };
        localStorage.setItem('simulador_estado', JSON.stringify(state));
        // Save full shuffled questions so restore preserves option order
        localStorage.setItem('simulador_questions', JSON.stringify(activeQuestions));
        localStorage.setItem('simulador_revision', JSON.stringify(markedForReview));
    }, [currentQuestionIndex, userAnswers, timeLeft, isPaused, startTime, markedForReview, activeQuestions, examMode]);

    const handleRestore = () => {
        if (!savedState) return;

        // Restore the exact shuffled question set (with shuffled options)
        const savedQs = localStorage.getItem('simulador_questions');
        let restoredQuestions: Question[] = simuladoECOEMS;
        if (savedQs) {
            try {
                restoredQuestions = JSON.parse(savedQs);
            } catch {
                // fall through to default
            }
        }

        setActiveQuestions(restoredQuestions);
        setExamMode(savedState.examMode || 'full');
        setIsExamActive(true);
        setCurrentQuestionIndex(savedState.preguntaActual);
        setTimeLeft(savedState.tiempoRestante);
        setStartTime(new Date(savedState.fechaInicio).getTime());

        const restoredAnswers: Record<string, number> = {};
        savedState.respuestas.forEach((ans, idx) => {
            if (ans !== null && restoredQuestions[idx]) {
                restoredAnswers[restoredQuestions[idx].id] = ans;
            }
        });
        setUserAnswers(restoredAnswers);

        const savedRevision = localStorage.getItem('simulador_revision');
        if (savedRevision) {
            setMarkedForReview(JSON.parse(savedRevision));
        }

        setIsPaused(savedState.pausado);
        setShowRestoreModal(false);
    };

    const handleNewExam = () => {
        localStorage.removeItem('simulador_estado');
        localStorage.removeItem('simulador_revision');
        localStorage.removeItem('simulador_questions');
        setShowRestoreModal(false);
    };

    const handleSelectEscuela = (escuela: Escuela | null) => {
        setSelectedEscuela(escuela);
        try {
            if (escuela) {
                localStorage.setItem('user_target_school', escuela.nombre);
                localStorage.setItem('user_target_score', escuela.puntaje.toString());
            } else {
                localStorage.removeItem('user_target_school');
                localStorage.removeItem('user_target_score');
            }
        } catch { /* localStorage blocked */ }
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

    // Auto-save every 10 seconds during exam
    useEffect(() => {
        if (isExamActive && !showResults) {
            const timer = setTimeout(() => {
                saveStateToLocalStorage();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [isExamActive, showResults, currentQuestionIndex, userAnswers, timeLeft, isPaused, saveStateToLocalStorage]);

    // Timer logic — only active in full exam mode
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isExamActive && examMode === 'full' && timeLeft > 0 && !isPaused) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (examMode === 'full' && timeLeft === 0 && isExamActive) {
            handleFinishExam();
        }
        return () => clearInterval(timer);
    }, [isExamActive, timeLeft, isPaused, examMode]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentQuestion = activeQuestions[currentQuestionIndex];

    const buildPool = (area: string): Question[] => {
        const fromSource = (src: Question[]) => {
            if (area === 'all') return src;
            if (area === 'habilidades') return src.filter(q => q.area.startsWith('Habilidad'));
            return src.filter(q => q.area === area);
        };
        if (selectedBank === 'bank1') return fromSource(simuladoECOEMS);
        if (selectedBank === 'bank2') return fromSource(simuladoECOEMS2);
        if (selectedBank === 'bank3') return fromSource(simuladoECOEMS3);
        if (selectedBank === 'bank4') return fromSource(simuladoECOEMS4);
        return [...fromSource(simuladoECOEMS), ...fromSource(simuladoECOEMS2), ...fromSource(simuladoECOEMS3), ...fromSource(simuladoECOEMS4)];
    };

    const handleStartExam = (mode: ExamMode = 'full') => {
        const pool = buildPool(selectedArea);
        let questions = shuffleArray(pool).map(shuffleQuestionOptions);
        if (mode === 'practice') {
            questions = questions.slice(0, PRACTICE_QUESTION_COUNT);
        }
        setActiveQuestions(questions);
        setExamMode(mode);
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
        if (showResults || !currentQuestion) return;
        if (!user && Object.keys(userAnswers).length >= GUEST_MAX_QUESTIONS) {
            navigate("/auth?ref=simulador&reason=limit");
            return;
        }
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < activeQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        activeQuestions.forEach(q => {
            if (userAnswers[q.id] === q.correctIndex) correct++;
        });
        return correct;
    };

    const handleFinishExam = () => {
        setIsExamActive(false);
        setShowResults(true);

        const finalScore = calculateScore();
        const totalTime = examMode === 'full' ? EXAM_TIME_SECONDS - timeLeft : 0;
        const pct = Math.round((finalScore / activeQuestions.length) * 100);
        const prediccion = pct >= 70 ? 'aprobado' : 'reprobado';
        trackSimuladorComplete(finalScore, totalTime, prediccion);

        localStorage.setItem('quiz_score_simulador_pro', finalScore.toString());
        localStorage.setItem('last_sim_time_left', timeLeft.toString());

        const completedSims = parseInt(localStorage.getItem('completed_simulators') || '0');
        localStorage.setItem('completed_simulators', (completedSims + 1).toString());

        localStorage.removeItem('simulador_estado');
        localStorage.removeItem('simulador_revision');
        localStorage.removeItem('simulador_questions');
    };

    // Counts shown in the start screen info cards
    const filteredPool = buildPool(selectedArea);
    const fullModeCount = filteredPool.length;
    const practiceModeCount = Math.min(PRACTICE_QUESTION_COUNT, filteredPool.length);

    // ── Restore modal ─────────────────────────────────────────────────────────
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

    // ── Start screen ──────────────────────────────────────────────────────────
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
                            512 reactivos en 4 bancos — preguntas y opciones aleatorizadas en cada intento.
                        </p>
                    </div>

                    {/* Bank selector */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Banco de preguntas</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {([
                                { label: 'Banco 1 — Práctica General', value: 'bank1' as BankSelection },
                                { label: 'Banco 2 — Generado por IA', value: 'bank2' as BankSelection },
                                { label: 'Banco 3 — Instituto IMEI', value: 'bank3' as BankSelection },
                                { label: 'Banco 4 — 📋 Guía Oficial IPN/UNAM 2025', value: 'bank4' as BankSelection },
                                { label: 'Mixto — 512 reactivos combinados', value: 'mixed' as BankSelection },
                            ]).map(b => (
                                <button
                                    key={b.value}
                                    onClick={() => setSelectedBank(b.value)}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border",
                                        selectedBank === b.value
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter by subject */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filtrar por materia</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {AREA_FILTERS.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setSelectedArea(f.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                                        selectedArea === f.value
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                                    )}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* School target selector */}
                    <div className="space-y-3 text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">🎯 ¿A qué escuela quieres entrar?</p>

                        <div className="flex justify-center">
                            <button
                                onClick={() => handleSelectEscuela(null)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border",
                                    !selectedEscuela
                                        ? "bg-slate-600 text-white border-slate-500"
                                        : "bg-white/5 text-slate-500 border-white/10 hover:bg-white/10"
                                )}
                            >
                                Sin meta específica
                            </button>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-400/70 text-center">UNAM</p>
                            <div className="flex flex-wrap justify-center gap-1.5">
                                {ESCUELAS.filter(e => e.tipo === 'UNAM').map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => handleSelectEscuela(e)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide transition-all border",
                                            selectedEscuela?.id === e.id
                                                ? "bg-blue-600 text-white border-blue-500"
                                                : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        {e.nombre} <span className="opacity-50">· {e.puntaje}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-red-400/70 text-center">IPN</p>
                            <div className="flex flex-wrap justify-center gap-1.5">
                                {ESCUELAS.filter(e => e.tipo === 'IPN').map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => handleSelectEscuela(e)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-black tracking-wide transition-all border",
                                            selectedEscuela?.id === e.id
                                                ? "bg-red-700 text-white border-red-600"
                                                : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        {e.nombre} <span className="opacity-50">· {e.puntaje}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedEscuela && (
                            <p className="text-center text-[10px] text-slate-500 pt-1">
                                Meta: <span className="font-black text-white">{selectedEscuela.nombre}</span>
                                {' '}— mínimo <span className="font-black text-amber-400">{selectedEscuela.puntaje} aciertos</span>
                            </p>
                        )}
                    </div>

                    {/* Mode info cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Examen Completo</span>
                            <span className="text-sm font-bold text-white">3 Horas · {fullModeCount} Reactivos</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-400" />
                            <span className="text-[10px] font-black uppercase text-slate-500">Práctica Rápida</span>
                            <span className="text-sm font-bold text-white">Sin Tiempo · {practiceModeCount} Reactivos</span>
                        </div>
                    </div>

                    {/* Mode buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button
                            onClick={() => handleStartExam('full')}
                            className="w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 group"
                        >
                            <Brain className="mr-2 h-5 w-5" />
                            Examen Completo
                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            onClick={() => handleStartExam('practice')}
                            variant="outline"
                            className="w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest border-amber-500/30 text-amber-400 hover:bg-amber-500/10 group"
                        >
                            <Zap className="mr-2 h-5 w-5" />
                            Práctica Rápida
                            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <Shuffle className="h-3 w-3 text-amber-500" />
                        Preguntas y opciones aleatorizadas — CyberEdu MX v3.0
                    </p>
                </div>
            </div>
        );
    }

    // ── Results screen ────────────────────────────────────────────────────────
    const score = calculateScore();
    const percentage = activeQuestions.length > 0 ? (score / activeQuestions.length) * 100 : 0;

    // Top wrong areas (for meta feedback)
    const wrongAreaCounts: Record<string, number> = {};
    activeQuestions.forEach(q => {
        if (userAnswers[q.id] !== q.correctIndex) {
            wrongAreaCounts[q.area] = (wrongAreaCounts[q.area] || 0) + 1;
        }
    });
    const topWrongAreas = Object.entries(wrongAreaCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([area]) => area);

    // Meta comparisons
    const myScore = Math.round(percentage);
    const metaDiff = selectedEscuela ? selectedEscuela.puntaje - myScore : 0;
    const metaSuccess = !!selectedEscuela && metaDiff <= 0;
    const metaClose = !!selectedEscuela && metaDiff > 0 && metaDiff <= 10;
    const areasText = topWrongAreas.join(', ') || 'Todas las materias';

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
                            <div className="flex items-center gap-3 flex-wrap justify-center">
                                <h2 className="text-3xl font-black uppercase text-white">Resultado del Examen</h2>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    examMode === 'practice' ? "bg-amber-500/20 text-amber-400" : "bg-primary/20 text-primary"
                                )}>
                                    {examMode === 'practice' ? 'Práctica Rápida' : 'Examen Completo'}
                                </span>
                            </div>
                            <div className="flex gap-4 items-end">
                                <span className="text-7xl font-black text-white">{score}</span>
                                <span className="text-2xl font-black text-slate-500 mb-2">/ {activeQuestions.length}</span>
                            </div>
                            <Progress value={percentage} className="h-3 w-full max-w-sm" />
                            <p className="text-slate-400 text-sm">
                                Has superado el <span className="text-emerald-400 font-bold">{percentage.toFixed(0)}%</span> de los reactivos correctamente.
                            </p>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Target className="h-32 w-32" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary relative z-10">Análisis y Meta</h3>

                            {/* Probabilidad de ingreso */}
                            <div className="space-y-2 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Probabilidad de Ingreso</span>
                                    <span className="text-sm font-black text-white">{percentage > 80 ? "ALTA" : percentage > 60 ? "MEDIA" : "EN MEJORA"}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                                </div>
                            </div>

                            {/* Meta / veredicto */}
                            <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
                                {selectedEscuela ? (
                                    <div className={cn(
                                        "p-4 rounded-2xl border",
                                        metaSuccess ? "bg-emerald-500/10 border-emerald-500/30" :
                                        metaClose   ? "bg-amber-500/10 border-amber-500/30" :
                                                      "bg-red-500/10 border-red-500/30"
                                    )}>
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl shrink-0">{metaSuccess ? "🎉" : metaClose ? "⚠️" : "❌"}</span>
                                            <div className="space-y-1 min-w-0">
                                                <p className={cn("text-sm font-black leading-snug", metaSuccess ? "text-emerald-400" : metaClose ? "text-amber-400" : "text-red-400")}>
                                                    {metaSuccess
                                                        ? `¡Alcanzas ${selectedEscuela.nombre}! Tu puntaje (${myScore}) supera el mínimo (${selectedEscuela.puntaje})`
                                                        : metaClose
                                                        ? `¡Casi! Te faltan ${metaDiff} puntos para ${selectedEscuela.nombre}.`
                                                        : `Necesitas mejorar ${metaDiff} puntos para ${selectedEscuela.nombre}.`
                                                    }
                                                </p>
                                                {!metaSuccess && (
                                                    <p className="text-xs text-slate-400">
                                                        {metaClose ? "Practica estos temas:" : "Enfócate en:"}{' '}
                                                        <span className="font-bold text-white">{areasText}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                        <p className="text-xs text-slate-500">Sin escuela meta seleccionada</p>
                                        <p className="text-[10px] text-slate-600 mt-1">Configura tu meta en la pantalla de inicio</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Tu Puntaje Final</span>
                                    <span className="text-sm font-black text-white">{score} aciertos</span>
                                </div>
                                {selectedEscuela && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400">Mínimo {selectedEscuela.nombre}</span>
                                        <span className="text-sm font-black text-amber-400">{selectedEscuela.puntaje} aciertos</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button onClick={() => handleStartExam('full')} variant="outline" className="flex-1 h-14 rounded-xl border-white/10 hover:bg-white/5 text-xs font-black uppercase tracking-widest">
                            <RotateCcw className="mr-2 h-4 w-4" /> Reintentar Completo
                        </Button>
                        <Button onClick={() => handleStartExam('practice')} variant="outline" className="flex-1 h-14 rounded-xl border-amber-500/20 text-amber-400 hover:bg-amber-500/10 text-xs font-black uppercase tracking-widest">
                            <Zap className="mr-2 h-4 w-4" /> Nueva Práctica Rápida
                        </Button>
                        <Button onClick={() => navigate("/")} className="flex-1 h-14 rounded-xl bg-primary text-xs font-black uppercase tracking-widest">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Volver al Dashboard
                        </Button>
                    </div>

                    {/* AITutor CTA */}
                    <button
                        onClick={() => {
                            const failedTopics = activeQuestions
                                .filter(q => userAnswers[q.id] !== q.correctIndex)
                                .map(q => q.area)
                                .filter((area, i, arr) => arr.indexOf(area) === i)
                                .slice(0, 3)
                                .join(", ");
                            const message = failedTopics
                                ? `Fallé preguntas sobre: ${failedTopics}. Necesito que hagamos una autopsia de mis errores. ¿Me los explicas?`
                                : "Termino de hacer el simulador. ¿Me ayudas a repasar lo que fallé?";
                            window.dispatchEvent(new CustomEvent('cyberedu:open-chat', { detail: { message } }));
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-violet-500/20 transition-all text-sm uppercase tracking-widest"
                    >
                        🧠 Hacer Autopsia de Errores con Tutor IA
                        {!user && <span className="text-[10px] opacity-75 ml-1 bg-white/20 px-2 py-0.5 rounded-full">(gratis)</span>}
                    </button>

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
                            {activeQuestions.map((q, idx) => {
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
                            {activeQuestions.map((q, idx) => {
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
                                                <img src={q.imageUrl} alt={`Imagen reactivo ${idx + 1}`} className="max-h-64 mx-auto object-contain" loading="lazy" />
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
                                        {!isCorrect && (
                                            <div className="mt-3 p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg flex items-center justify-between gap-3">
                                                <span className="text-sm text-violet-300">¿No entendiste este tema?</span>
                                                <button
                                                    onClick={() => {
                                                        const message = `Explícame el tema de ${q.area}: "${q.text.slice(0, 80)}"`;
                                                        window.dispatchEvent(new CustomEvent('cyberedu:open-chat', { detail: { message } }));
                                                    }}
                                                    className="shrink-0 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-all font-semibold"
                                                >
                                                    Preguntarle al Tutor →
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Exam Active View ──────────────────────────────────────────────────────
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
                                onClick={isPaused ? handleResume : handlePause}
                                variant="outline"
                                className="hidden md:flex rounded-xl px-4 h-12 text-[10px] font-black uppercase tracking-widest border-white/10 text-white"
                            >
                                {isPaused ? "▶️ Continuar" : "⏸️ Pausar"}
                            </Button>
                        )}
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
                {isPaused && examMode === 'full' && (
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
                                        onClick={() => setCurrentQuestionIndex(idx)}
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

                    {/* Subtle Area Indicator */}
                    <div className="absolute top-0 right-0 p-8">
                        <span className="text-[40px] font-black text-white/5 uppercase select-none pointer-events-none">
                            {currentQuestion?.area}
                        </span>
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

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {currentQuestion?.options.map((option, idx) => (
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
            <div className="bg-slate-950 border-t border-white/10 p-4">
                <div className="container mx-auto max-w-4xl flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className="flex-1 rounded-xl border-white/10 hover:bg-white/5 h-12 min-h-[44px] text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                    </Button>

                    <Button
                        onClick={currentQuestionIndex === activeQuestions.length - 1 ? handleFinishExam : handleNext}
                        className="flex-1 rounded-xl bg-primary h-12 min-h-[44px] text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                    >
                        {currentQuestionIndex === activeQuestions.length - 1 ? "Finalizar" : "Siguiente"} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            if (!currentQuestion) return;
                            setMarkedForReview(prev => ({
                                ...prev,
                                [currentQuestion.id]: !prev[currentQuestion.id]
                            }));
                        }}
                        className={cn(
                            "flex-1 rounded-xl border-white/10 h-12 min-h-[44px] text-[10px] font-black uppercase tracking-widest",
                            currentQuestion && markedForReview[currentQuestion.id] ? "bg-amber-500/20 border-amber-500 text-amber-500" : "text-slate-400 hover:bg-white/5"
                        )}
                    >
                        🔖 {currentQuestion && markedForReview[currentQuestion.id] ? "Marcada" : "Marcar"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SimuladorPro;
