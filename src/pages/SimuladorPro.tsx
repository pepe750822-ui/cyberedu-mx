import React, { useState, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
    ArrowLeft,
    Sparkles,
} from "lucide-react";
import { checkExamAchievements } from "@/utils/achievements";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Question, ExamMode, BankSelection } from "@/data/simuladorData";
import { ESCUELAS, Escuela } from "@/data/escuelas";
import { SimulatorStart } from "@/components/simulator/SimulatorStart";
import { SimulatorActive } from "@/components/simulator/SimulatorActive";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { ProgressPanel } from "@/components/simulator/ProgressPanel";
import { RestoreModal } from "@/components/simulator/RestoreModal";
import { trackSimuladorStart, trackSimuladorPause, trackSimuladorResume, trackSimuladorComplete } from "@/hooks/useAnalytics";

const EXAM_TIME_SECONDS = 3 * 60 * 60;
const PRACTICE_QUESTION_COUNT = 20;

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

const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    if (isToday) return `Hoy, ${timeStr}`;
    
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 1) return `Ayer, ${timeStr}`;
    
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }) + ` · ${timeStr}`;
};

const SimuladorPro = () => {
    const { user, profile, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // UI state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
    const [isExamActive, setIsExamActive] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [savedState, setSavedState] = useState<any | null>(null);
    const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [bankData, setBankData] = useState<Record<string, Question[]>>({
        bank1: [],
        bank2: [],
        bank3: [],
        bank4: [],
        bank6: [],
        bank7: [],
        bank8: [],
        bank9: [],
        bank10: [],
        bank11: [],
    });
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [examMode, setExamMode] = useState<ExamMode>('full');
    const [selectedArea, setSelectedArea] = useState<string>('all');
    const [selectedBank, setSelectedBank] = useState<BankSelection>('bank1');
    const [selectedEscuela, setSelectedEscuela] = useState<Escuela | null>(() => {
        try {
            const saved = localStorage.getItem('user_target_school');
            return saved ? (ESCUELAS.find(e => e.nombre === saved) ?? null) : null;
        } catch { return null; }
    });
    const [showCharts, setShowCharts] = useState(false);
    const [chartData, setChartData] = useState<Array<{ fecha: string; porcentaje: number; modo: string; banco?: string; area_filtro?: string }> | null>(null);
    const [chartsLoading, setChartsLoading] = useState(false);
    const [rankingPuntaje, setRankingPuntaje] = useState<any[] | null>(null);
    const [rankingActivos, setRankingActivos] = useState<any[] | null>(null);
    const [rankingPorArea, setRankingPorArea] = useState<any[] | null>(null);
    const [rankingLoading, setRankingLoading] = useState(false);

    // SEO Dynamic Tags
    useEffect(() => {
        document.title = "Simulador Pro ECOEMS 2026 - 512 Reactivos | CyberEdu MX";
    }, []);

    // Load banks
    useEffect(() => {
        const loadAllBanks = async () => {
            setIsLoadingData(true);
            try {
                const fetchBank = async (path: string) => {
                    const res = await fetch(path);
                    if (!res.ok) throw new Error(`Failed to load ${path}`);
                    return res.json();
                };
                const [b1, b2, b3, b4] = await Promise.all([
                    fetchBank('/data/questions.json'),
                    fetchBank('/data/questions2.json'),
                    fetchBank('/data/questions3.json'),
                    fetchBank('/data/questions4.json'),
                ]);

                // Lazy load large banks to speed up initial page load
                const [mod6, mod7, mod8, mod9, mod10, mod11] = await Promise.all([
                    import("@/data/simuladorData6"),
                    import("@/data/simuladorData7"),
                    import("@/data/simuladorData8"),
                    import("@/data/simuladorData9"),
                    import("@/data/simuladorData10"),
                    import("@/data/simuladorData11"),
                ]);

                setBankData(prev => ({
                    ...prev,
                    bank1: b1,
                    bank2: b2,
                    bank3: b3,
                    bank4: b4,
                    bank6: mod6.bank6Questions,
                    bank7: mod7.bank7Questions,
                    bank8: mod8.bank8Questions,
                    bank9: mod9.bank9Questions,
                    bank10: mod10.bank10Questions,
                    bank11: mod11.bank11Questions,
                }));
            } catch (error) {
                logger.error("Error loading question banks", error);
                toast({
                    variant: "destructive",
                    title: "Error de carga",
                    description: "No se pudieron cargar las preguntas. Por favor, recarga la página.",
                });
            } finally {
                setIsLoadingData(false);
            }
        };
        loadAllBanks();
    }, [toast]);

    // Check for saved state
    useEffect(() => {
        const saved = localStorage.getItem('simulador_estado');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                if (state.activo) {
                    setSavedState(state);
                    setShowRestoreModal(true);
                }
            } catch (e) {
                logger.error("Error parsing saved state", e);
            }
        }
    }, []);

    const fetchChartData = async () => {
        if (!user) return;
        setChartsLoading(true);
        try {
            const { data, error } = await supabase
                .from('simulador_results')
                .select('created_at, porcentaje, modo, banco, area')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });
            
            if (error) {
                console.error("Error fetching chart data:", error);
                return;
            }

            if (data) {
                setChartData(data.map(d => ({
                    fecha: d.created_at || '',
                    porcentaje: Number(d.porcentaje),
                    modo: d.modo || '',
                    banco: (d as any).banco || '',
                    area_filtro: (d as any).area || 'all',
                })));
            }
        } catch (err) {
            console.error("Chart data catch error:", err);
        } finally {
            setChartsLoading(false);
        }
    };

    const fetchRanking = async () => {
        setRankingLoading(true);
        try {
            console.log("Fetching rankings...");
            const { data: puntaje, error: err1 } = await supabase
                .from('simulador_ranking_puntaje')
                .select('*')
                .limit(10);
            
            if (err1) console.error("Ranking Puntaje Error:", err1);

            const { data: activos, error: err2 } = await supabase
                .from('simulador_ranking_actividad')
                .select('*')
                .limit(10);

            if (err2) console.error("Ranking Actividad Error:", err2);

            const { data: porArea, error: err3 } = await supabase
                .from('simulador_top_per_area')
                .select('*');

            if (err3) console.error("Ranking Por Area Error:", err3);

            console.log("Ranking data received:", { puntaje, activos, porArea });

            if (puntaje) setRankingPuntaje(puntaje);
            if (activos) setRankingActivos(activos);
            if (porArea) setRankingPorArea(porArea);
        } catch (err) {
            console.error("Ranking catch error:", err);
        } finally {
            setRankingLoading(false);
        }
    };

    const saveStateToLocalStorage = useCallback((overrides: any = {}) => {
        const answersArray = activeQuestions.map(q => userAnswers[q.id] ?? null);
        const state = {
            activo: true,
            fechaInicio: new Date(startTime || Date.now()).toISOString(),
            tiempoTotal: EXAM_TIME_SECONDS,
            tiempoRestante: timeLeft,
            preguntaActual: currentQuestionIndex,
            respuestas: answersArray,
            pausado: isPaused,
            timestamp: Date.now(),
            examMode,
            ...overrides
        };
        localStorage.setItem('simulador_estado', JSON.stringify(state));
        localStorage.setItem('simulador_questions', JSON.stringify(activeQuestions));
        localStorage.setItem('simulador_revision', JSON.stringify(markedForReview));
    }, [currentQuestionIndex, userAnswers, timeLeft, isPaused, startTime, markedForReview, activeQuestions, examMode]);

    const handleRestore = () => {
        if (!savedState) return;
        const savedQs = localStorage.getItem('simulador_questions');
        const savedRev = localStorage.getItem('simulador_revision');
        if (savedQs) {
            try {
                const qs = JSON.parse(savedQs);
                setActiveQuestions(qs);
                if (savedRev) setMarkedForReview(JSON.parse(savedRev));
                
                if (savedState.respuestas) {
                    const answers: Record<string, number> = {};
                    savedState.respuestas.forEach((ans: number | null, idx: number) => {
                        if (ans !== null && qs[idx]) {
                            answers[qs[idx].id] = ans;
                        }
                    });
                    setUserAnswers(answers);
                }

                setExamMode(savedState.examMode || 'full');
                setTimeLeft(savedState.tiempoRestante || EXAM_TIME_SECONDS);
                setCurrentQuestionIndex(savedState.preguntaActual || 0);
                setIsExamActive(true);
                setShowRestoreModal(false);
                trackSimuladorResume();
            } catch (e) {
                logger.error("Error restoring state", e);
                handleNewExam();
            }
        }
    };

    const handleNewExam = () => {
        localStorage.removeItem('simulador_estado');
        localStorage.removeItem('simulador_revision');
        localStorage.removeItem('simulador_questions');
        setShowRestoreModal(false);
        setSavedState(null);
    };

    const handleSaveAndExit = () => {
        saveStateToLocalStorage();
        navigate('/');
        toast({ title: "Simulador guardado", description: "Podrás continuarlo la próxima vez que regreses." });
    };

    const handlePause = () => {
        setIsPaused(true);
        trackSimuladorPause();
        saveStateToLocalStorage({ pausado: true });
    };

    const handleResume = () => {
        setIsPaused(false);
        trackSimuladorResume();
    };

    // Auto-save on every answer
    useEffect(() => {
        if (isExamActive && !showResults && Object.keys(userAnswers).length > 0) {
            saveStateToLocalStorage();
        }
    }, [userAnswers]);

    // Auto-save interval (fallback every 30s)
    useEffect(() => {
        if (isExamActive && !showResults) {
            const interval = setInterval(() => saveStateToLocalStorage(), 30000);
            return () => clearInterval(interval);
        }
    }, [isExamActive, showResults, saveStateToLocalStorage]);

    // Result synchronization logic
    useEffect(() => {
        if (!showResults || activeQuestions.length === 0) return;

        const savedScore = calculateScore();
        const savedPct = Math.round((savedScore / activeQuestions.length) * 100);
        const escuelaMeta = selectedEscuela?.nombre || 'Ninguna';
        const puntajeMeta = selectedEscuela?.puntaje || 0;

        const areaBreakdown: Record<string, { correctas: number, total: number }> = {};
        activeQuestions.forEach(q => {
            if (!areaBreakdown[q.area]) areaBreakdown[q.area] = { correctas: 0, total: 0 };
            areaBreakdown[q.area].total++;
            if (userAnswers[q.id] === q.correctIndex) areaBreakdown[q.area].correctas++;
        });

        const payload = {
            escuela_meta: escuelaMeta,
            puntaje_meta: puntajeMeta,
            total_preguntas: activeQuestions.length,
            aciertos: savedScore,
            porcentaje: savedPct,
            modo: examMode,
            banco: selectedBank,
            area: selectedArea,
            resultados_por_area: areaBreakdown
        };

        if (!user) {
            localStorage.setItem('pending_simulador_result', JSON.stringify(payload));
            return;
        }

        const doInsert = async () => {
            const { error } = await supabase.from('simulador_results').insert({ ...payload, user_id: user.id });
            if (!error) {
                // Check achievements
                const { count } = await supabase.from('simulador_results').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
                const areaScores: Record<string, number> = {};
                Object.entries(areaBreakdown).forEach(([area, stats]) => {
                    areaScores[area] = Math.round((stats.correctas / stats.total) * 100);
                });

                const targetPct = selectedEscuela ? Math.round((selectedEscuela.puntaje / 128) * 100) : 0;
                const newlyGranted = await checkExamAchievements(user.id, {
                    total_examenes: count || 1,
                    porcentaje: savedPct,
                    area_scores: areaScores,
                    meta_success: savedPct >= targetPct && targetPct > 0
                });

                newlyGranted.forEach(medal => {
                    toast({
                        title: "¡Nueva Medalla Desbloqueada! 🏅",
                        description: `Has ganado el logro: ${medal}`,
                    });
                });
            }
        };
        doInsert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showResults]);

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isExamActive && examMode === 'full' && timeLeft > 0 && !isPaused) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (examMode === 'full' && timeLeft === 0 && isExamActive) {
            handleFinishExam();
        }
        return () => clearInterval(timer);
    }, [isExamActive, timeLeft, isPaused, examMode]);

    const buildPool = (area: string): Question[] => {
        const fromSource = (src: Question[]) => {
            if (!src || src.length === 0) return [];
            if (area === 'all') return src;
            if (area === 'habilidades') return src.filter(q => q.area.startsWith('Habilidad'));
            return src.filter(q => q.area === area);
        };
        if (selectedBank === 'bank1') return fromSource(bankData.bank1);
        if (selectedBank === 'bank2') return fromSource(bankData.bank2);
        if (selectedBank === 'bank3') return fromSource(bankData.bank3);
        if (selectedBank === 'bank4') return fromSource(bankData.bank4);
        if (selectedBank === 'bank6') return fromSource(bankData.bank6);
        if (selectedBank === 'bank7') return fromSource(bankData.bank7);
        if (selectedBank === 'bank8') return fromSource(bankData.bank8);
        if (selectedBank === 'bank9') return fromSource(bankData.bank9);
        if (selectedBank === 'bank10') return fromSource(bankData.bank10);
        if (selectedBank === 'bank11') return fromSource(bankData.bank11);
        return [
            ...fromSource(bankData.bank1), ...fromSource(bankData.bank2),
            ...fromSource(bankData.bank3), ...fromSource(bankData.bank4)
        ];
    };

    const handleSelectBank = async (bank: BankSelection) => {
        // bank8, bank9, bank10, bank11: free 10-question preview — select freely, upsell after results
        if (['bank8', 'bank9', 'bank10', 'bank11'].includes(bank)) {
            setSelectedBank(bank);
            return;
        }
        if (['bank6', 'bank7'].includes(bank)) {
            if (!user) {
                navigate('/auth?ref=simulador&reason=guias');
                return;
            }
        }
        setSelectedBank(bank);
    };

    // Handler para desbloquear bancos con tokens directamente desde SimulatorStart
    const handleRedeemUnlock = async (
        bankKey: string,
        cost: number,
        updates: Record<string, boolean>
    ) => {
        if (!user || !profile) {
            toast.error("Debes iniciar sesión para canjear tokens");
            return;
        }
        const currentTokens = (profile as any)?.tokens ?? 0;
        if (currentTokens < cost) {
            toast.error(`Necesitas ${cost} tokens. Tu balance actual es ${currentTokens}.`);
            return;
        }
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    tokens: currentTokens - cost,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;
            await refreshProfile();
            toast.success(`¡Banco desbloqueado! Se descontaron ${cost} tokens. 🎉`);
        } catch (err: any) {
            toast.error('Error al canjear: ' + err.message);
        }
    };

    const handleReportQuestion = async (questionId: string): Promise<boolean> => {
        console.log('[Reporte] user_id:', user?.id ?? 'NO SESSION');
        console.log('[Reporte] question_id:', questionId);
        const { data, error, status, statusText } = await (supabase.from('question_reports' as any) as any)
            .insert({ question_id: questionId, user_id: user?.id ?? null })
            .select();
        console.log('[Reporte] data:', data);
        console.log('[Reporte] error:', error);
        console.log('[Reporte] status:', status, statusText);
        if (error) {
            console.error('[question_reports] INSERT failed:', error);
            return false;
        }
        if (!data || data.length === 0) {
            console.warn('[question_reports] INSERT silently blocked (RLS?) — no rows returned');
            return false;
        }
        return true;
    };

    const handleStartExam = async (mode: ExamMode = 'full') => {
        const bank8Unlocked  = (profile as any)?.bank8_unlocked  === true || (profile as any)?.paquete_completo === true;
        const bank9Unlocked  = (profile as any)?.bank9_unlocked  === true || (profile as any)?.paquete_completo === true;
        const bank10Unlocked =
            (profile as any)?.bank10_unlocked === true ||
            (profile as any)?.guia2026_unlocked === true ||
            (profile as any)?.paquete_completo === true;
        const bank11Unlocked =
            (profile as any)?.bank11_unlocked === true ||
            (profile as any)?.paquete_completo === true;
        const isPreview =
            (selectedBank === 'bank8'  && !bank8Unlocked)  ||
            (selectedBank === 'bank9'  && !bank9Unlocked)  ||
            (selectedBank === 'bank10' && !bank10Unlocked) ||
            (selectedBank === 'bank11' && !bank11Unlocked);

        const pool = buildPool(selectedArea);
        let questions: Question[];
        if (isPreview) {
            // First 10 as consistent sample, only shuffle options within each question
            questions = pool.slice(0, 10).map(shuffleQuestionOptions);
        } else {
            questions = shuffleArray(pool).map(shuffleQuestionOptions);
            if (mode === 'practice') questions = questions.slice(0, PRACTICE_QUESTION_COUNT);
        }

        setIsPreviewMode(isPreview);
        setActiveQuestions(questions);
        setExamMode(mode);
        setIsExamActive(true);
        setStartTime(Date.now());
        setUserAnswers({});
        setMarkedForReview({});
        setCurrentQuestionIndex(0);
        setTimeLeft(EXAM_TIME_SECONDS);
        setShowResults(false);
        trackSimuladorStart();
    };

    const calculateScore = () => {
        let correct = 0;
        activeQuestions.forEach(q => { if (userAnswers[q.id] === q.correctIndex) correct++; });
        return correct;
    };

    const handleFinishExam = () => {
        setIsExamActive(false);
        setShowResults(true);
        const finalScore = calculateScore();
        const totalTime = examMode === 'full' ? EXAM_TIME_SECONDS - timeLeft : 0;
        const pct = Math.round((finalScore / activeQuestions.length) * 100);
        trackSimuladorComplete(finalScore, totalTime, pct >= 70 ? 'aprobado' : 'reprobado');
        localStorage.removeItem('simulador_estado');
        localStorage.removeItem('simulador_revision');
        localStorage.removeItem('simulador_questions');
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Brain className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
                </div>
                <p className="mt-8 text-slate-400 font-black uppercase tracking-widest text-sm animate-pulse">Cargando reactivos...</p>
            </div>
        );
    }

    if (showRestoreModal) return <RestoreModal onRestore={handleRestore} onNew={handleNewExam} />;

    if (showResults) {
        const totalBankQuestions = bankData[selectedBank as keyof typeof bankData]?.length ?? 0;
        return (
            <SimulatorResults
                user={user}
                activeQuestions={activeQuestions}
                userAnswers={userAnswers}
                markedForReview={markedForReview}
                examMode={examMode}
                selectedEscuela={selectedEscuela}
                onRestartFull={() => handleStartExam('full')}
                onRestartPractice={() => handleStartExam('practice')}
                onBackToDashboard={() => navigate('/')}
            >
                <ProgressPanel
                    userId={user?.id ?? null}
                    onNavigateToAuth={() => navigate('/auth?ref=simulador')}
                    showCharts={showCharts}
                    setShowCharts={setShowCharts}
                    chartData={chartData}
                    chartsLoading={chartsLoading}
                    rankingPuntaje={rankingPuntaje}
                    rankingActivos={rankingActivos}
                    rankingPorArea={rankingPorArea}
                    rankingLoading={rankingLoading}
                    fetchChartData={fetchChartData}
                    fetchRanking={fetchRanking}
                    formatFecha={formatFecha}
                    selectedEscuela={selectedEscuela}
                    myPercentage={Math.round((calculateScore() / activeQuestions.length) * 100)}
                    targetPercentage={selectedEscuela ? Math.round((selectedEscuela.puntaje / 128) * 100) : 0}
                    metaDiff={selectedEscuela ? (Math.round((selectedEscuela.puntaje / 128) * 100) - Math.round((calculateScore() / activeQuestions.length) * 100)) : 0}
                    metaSuccess={selectedEscuela ? (Math.round((calculateScore() / activeQuestions.length) * 100) >= Math.round((selectedEscuela.puntaje / 128) * 100)) : false}
                    metaClose={selectedEscuela ? (Math.round((selectedEscuela.puntaje / 128) * 100) - Math.round((calculateScore() / activeQuestions.length) * 100) <= 5) : false}
                />
                {isPreviewMode && (
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-2xl p-6 text-center">
                        <div className="text-4xl mb-2">🔓</div>
                        <h3 className="text-white font-black text-xl mb-2">
                            ¿Te gustó la muestra?
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Desbloquea las {totalBankQuestions} preguntas completas por solo 50 tokens
                        </p>
                        <button
                            onClick={() => navigate('/tokens')}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-xl"
                        >
                            🪙 Desbloquear por 50 tokens
                        </button>
                    </div>
                )}
            </SimulatorResults>
        );
    }

    if (isExamActive) {
        return (
            <SimulatorActive
                currentQuestionIndex={currentQuestionIndex}
                activeQuestions={activeQuestions}
                userAnswers={userAnswers}
                markedForReview={markedForReview}
                timeLeft={timeLeft}
                isPaused={isPaused}
                examMode={examMode}
                onSelectAnswer={(idx) => {
                    const q = activeQuestions[currentQuestionIndex];
                    if (q) setUserAnswers(prev => ({ ...prev, [q.id]: idx }));
                }}
                onNext={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, activeQuestions.length - 1))}
                onPrev={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                onPause={handlePause}
                onResume={handleResume}
                onFinish={handleFinishExam}
                onSaveAndExit={handleSaveAndExit}
                onToggleMark={() => {
                    const q = activeQuestions[currentQuestionIndex];
                    if (q) setMarkedForReview(prev => ({ ...prev, [q.id]: !prev[q.id] }));
                }}
                onJumpToQuestion={setCurrentQuestionIndex}
                onReportQuestion={handleReportQuestion}
                formatTime={(s) => {
                    const h = Math.floor(s / 3600);
                    const m = Math.floor((s % 3600) / 60);
                    const sec = s % 60;
                    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
                }}
            />
        );
    }

    return (
        <SimulatorStart
            selectedBank={selectedBank}
            onSelectBank={handleSelectBank}
            selectedArea={selectedArea}
            onSelectArea={setSelectedArea}
            selectedEscuela={selectedEscuela}
            onSelectEscuela={(e) => {
                setSelectedEscuela(e);
                if (e) localStorage.setItem('user_target_school', e.nombre);
                else localStorage.removeItem('user_target_school');
            }}
            onStartExam={handleStartExam}
            fullModeCount={(() => {
                const b8u  = (profile as any)?.bank8_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b9u  = (profile as any)?.bank9_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b10u = (profile as any)?.bank10_unlocked === true || (profile as any)?.guia2026_unlocked === true || (profile as any)?.paquete_completo === true;
                const b11u = (profile as any)?.bank11_unlocked === true || (profile as any)?.paquete_completo === true;
                if (selectedBank === 'bank8'  && !b8u)  return 10;
                if (selectedBank === 'bank9'  && !b9u)  return 10;
                if (selectedBank === 'bank10' && !b10u) return 10;
                if (selectedBank === 'bank11' && !b11u) return 10;
                return buildPool(selectedArea).length;
            })()}
            practiceModeCount={(() => {
                const b8u  = (profile as any)?.bank8_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b9u  = (profile as any)?.bank9_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b10u = (profile as any)?.bank10_unlocked === true || (profile as any)?.guia2026_unlocked === true || (profile as any)?.paquete_completo === true;
                const b11u = (profile as any)?.bank11_unlocked === true || (profile as any)?.paquete_completo === true;
                if (selectedBank === 'bank8'  && !b8u)  return 10;
                if (selectedBank === 'bank9'  && !b9u)  return 10;
                if (selectedBank === 'bank10' && !b10u) return 10;
                if (selectedBank === 'bank11' && !b11u) return 10;
                return Math.min(PRACTICE_QUESTION_COUNT, buildPool(selectedArea).length);
            })()}
            onBackToHome={() => navigate('/')}
            userTokens={profile?.tokens ?? 0}
            bank6Unlocked={(profile as any)?.bank6_unlocked === true}
            bank7Unlocked={(profile as any)?.bank7_unlocked === true}
            bank8Unlocked={(profile as any)?.bank8_unlocked === true}
            bank9Unlocked={(profile as any)?.bank9_unlocked === true}
            bank10Unlocked={(profile as any)?.bank10_unlocked === true}
            bank11Unlocked={(profile as any)?.bank11_unlocked === true}
            guia2026Unlocked={(profile as any)?.guia2026_unlocked === true}
            paqueteCompleto={(profile as any)?.paquete_completo === true}
            isLoggedIn={!!user}
            onNavigateToGuias={() => navigate('/auth?ref=simulador&reason=guias')}
            onRedeemUnlock={handleRedeemUnlock}
        >
            <ProgressPanel
                userId={user?.id ?? null}
                onNavigateToAuth={() => navigate('/auth?ref=simulador')}
                showCharts={showCharts}
                setShowCharts={setShowCharts}
                chartData={chartData}
                chartsLoading={chartsLoading}
                rankingPuntaje={rankingPuntaje}
                rankingActivos={rankingActivos}
                rankingPorArea={rankingPorArea}
                rankingLoading={rankingLoading}
                fetchChartData={fetchChartData}
                fetchRanking={fetchRanking}
                formatFecha={formatFecha}
            />
        </SimulatorStart>
    );
};

export default SimuladorPro;
