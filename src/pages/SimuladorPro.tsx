import React, { useState, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import PromoBloqueo from "@/components/PromoBloqueo";
import { SimulatorActive } from "@/components/simulator/SimulatorActive";
import { SimulatorResults } from "@/components/simulator/SimulatorResults";
import { ProgressPanel } from "@/components/simulator/ProgressPanel";
import { RestoreModal } from "@/components/simulator/RestoreModal";
import { trackSimuladorStart, trackSimuladorPause, trackSimuladorResume, trackSimuladorComplete } from "@/hooks/useAnalytics";
import { clarityEvent } from "@/lib/clarity";
import { useTracking, guardarResultadoSimulador } from "@/hooks/useTracking";

const EXAM_TIME_SECONDS = 3 * 60 * 60;
const PRACTICE_QUESTION_COUNT = 20;
const SECONDS_PER_QUESTION = 84.375;
const PRACTICE_TIME_SECONDS = Math.round(PRACTICE_QUESTION_COUNT * SECONDS_PER_QUESTION);

// Distribución oficial ECOEMS — pesos para muestreo proporcional
const DISTRIBUCION_ECOEMS: Record<string, number> = {
    'Habilidad Matemática': 16,
    'Matemáticas':          16,
    'Habilidad Verbal':     16,
    'Español':              16,
    'Biología':             12,
    'Física':               12,
    'Química':              12,
    'Historia':             24, // = Historia Universal (12) + Historia de México (12) — los bancos usan "Historia" unificado
    'Geografía':            12,
    'Formación Cívica y Ética': 12,
};

export const AREA_EMOJI: Record<string, string> = {
    'Habilidad Matemática':     '📐',
    'Matemáticas':              '🔢',
    'Habilidad Verbal':         '🗣️',
    'Español':                  '📝',
    'Biología':                 '🧬',
    'Física':                   '⚡',
    'Química':                  '⚗️',
    'Historia':                 '🌎',
    'Geografía':                '🗺️',
    'Formación Cívica y Ética': '⚖️',
};

// Construcción proporcional respetando distribución ECOEMS
function buildMixtoDistribuido(pool: Question[], total: number | 'all'): Question[] {
    if (pool.length === 0) return [];
    if (total === 'all') return shuffleArray(pool).map(shuffleQuestionOptions);

    const byArea: Record<string, Question[]> = {};
    pool.forEach(q => { (byArea[q.area] ??= []).push(q); });

    const areas = Object.keys(byArea);
    const pesoTotal = areas.reduce((s, a) => s + (DISTRIBUCION_ECOEMS[a] ?? 8), 0);
    const asignacion: Record<string, number> = {};
    let asignado = 0;

    for (const area of areas) {
        const peso = DISTRIBUCION_ECOEMS[area] ?? 8;
        const cuota = Math.floor((peso / pesoTotal) * (total as number));
        asignacion[area] = Math.min(cuota, byArea[area].length);
        asignado += asignacion[area];
    }

    let restante = (total as number) - asignado;
    const conStock = areas
        .filter(a => byArea[a].length > asignacion[a])
        .sort((a, b) => (DISTRIBUCION_ECOEMS[b] ?? 8) - (DISTRIBUCION_ECOEMS[a] ?? 8));
    for (const area of conStock) {
        if (restante <= 0) break;
        asignacion[area]++;
        restante--;
    }

    const result: Question[] = [];
    for (const [area, count] of Object.entries(asignacion)) {
        result.push(...shuffleArray(byArea[area]).slice(0, count).map(shuffleQuestionOptions));
    }
    return shuffleArray(result);
}

// Previsualización de distribución (sin barajar)
export function calcularDistribucionPreview(
    pool: Question[],
    total: number | 'all'
): Array<{ area: string; count: number }> {
    if (pool.length === 0) return [];
    const t = total === 'all' ? pool.length : (total as number);

    const byArea: Record<string, number> = {};
    pool.forEach(q => { byArea[q.area] = (byArea[q.area] ?? 0) + 1; });

    const areas = Object.keys(byArea);
    const pesoTotal = areas.reduce((s, a) => s + (DISTRIBUCION_ECOEMS[a] ?? 8), 0);
    const asignacion: Record<string, number> = {};
    let asignado = 0;

    for (const area of areas) {
        const peso = DISTRIBUCION_ECOEMS[area] ?? 8;
        const cuota = Math.floor((peso / pesoTotal) * t);
        asignacion[area] = Math.min(cuota, byArea[area]);
        asignado += asignacion[area];
    }

    let restante = t - asignado;
    const conStock = areas
        .filter(a => byArea[a] > asignacion[a])
        .sort((a, b) => (DISTRIBUCION_ECOEMS[b] ?? 8) - (DISTRIBUCION_ECOEMS[a] ?? 8));
    for (const area of conStock) {
        if (restante <= 0) break;
        asignacion[area]++;
        restante--;
    }

    return Object.entries(asignacion)
        .filter(([, c]) => c > 0)
        .sort(([a], [b]) => (DISTRIBUCION_ECOEMS[b] ?? 8) - (DISTRIBUCION_ECOEMS[a] ?? 8))
        .map(([area, count]) => ({ area, count }));
}

const BANK_LABELS: Record<BankSelection, string> = {
    bank1: 'Banco 1 — Práctica General',
    bank2: 'Banco 2 — IA',
    bank3: 'Banco 3 — IMEI',
    bank4: 'Banco 4 — Guía IPN/UNAM 2025',
    bank6: 'Banco 6 — UNAM 2021',
    bank7: 'Banco 7 — UNAM 2022',
    bank8: 'Banco 8 — UNAM 2023',
    bank9: 'Banco 9 — UNAM 2024',
    bank10: 'Banco 10 — IPN/UNAM 2026',
    bank11: 'Banco 11 — 2do Conocimientos Gen.',
    bank12: 'Banco 12 — Conocimientos Generales',
    bank13: 'Banco 13 — 500 Preguntas ECOEMS',
    mixed: 'Mixto — Combinado',
    mixto: 'Simulador Mixto — Todos los bancos',
};

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
    const { user, profile, refreshProfile, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const esExaniI = searchParams.get('examen') === 'exani-i';
    const { toast } = useToast();
    const { track } = useTracking();

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
    const [mixtoCount, setMixtoCount] = useState<number | 'all'>(50);
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
        bank12: [],
        bank13: [],
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
    const [exaniSelectedOption, setExaniSelectedOption] = useState<'20' | '50' | '130' | 'custom'>('130');
    const [exaniCustomInput, setExaniCustomInput] = useState<string>('130');
    const [examInitialTime, setExamInitialTime] = useState(EXAM_TIME_SECONDS);

    // Testimonio
    const [showTestimonio, setShowTestimonio] = useState(false);
    const [textoTestimonio, setTextoTestimonio] = useState('');
    const [totalSimuladoresUser, setTotalSimuladoresUser] = useState(0);
    const [totalPreguntasUser, setTotalPreguntasUser] = useState(0);

    useEffect(() => {
        document.title = esExaniI
            ? "Simulador EXANI-I | CyberEdu MX"
            : "Simulador Pro ECOEMS 2026 - 512 Reactivos | CyberEdu MX";
    }, [esExaniI]);

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

                if (esExaniI) {
                    const exaniData = await fetchBank('/data/exani-questions.json');
                    setBankData(prev => ({ ...prev, bank1: exaniData }));
                    setIsLoadingData(false);
                    return;
                }

                const [b1, b2, b3, b4] = await Promise.all([
                    fetchBank('/data/questions.json'),
                    fetchBank('/data/questions2.json'),
                    fetchBank('/data/questions3.json'),
                    fetchBank('/data/questions4.json'),
                ]);

                // Lazy load large banks to speed up initial page load
                const [mod6, mod7, mod8, mod9, mod10, mod11, mod12, mod13] = await Promise.all([
                    import("@/data/simuladorData6"),
                    import("@/data/simuladorData7"),
                    import("@/data/simuladorData8"),
                    import("@/data/simuladorData9"),
                    import("@/data/simuladorData10"),
                    import("@/data/simuladorData11"),
                    import("@/data/simuladorData12"),
                    import("@/data/simuladorData13"),
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
                    bank12: mod12.bank12Questions,
                    bank13: mod13.bank13Questions,
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
    }, [toast, esExaniI]);

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
        navigate(esExaniI ? '/exani-i' : '/');
        toast({ title: "Simulador guardado", description: "Podrás continuarlo la próxima vez que regreses." });
    };

    const handleAbandon = () => {
        saveStateToLocalStorage();
        navigate(esExaniI ? '/exani-i' : '/simulador-pro');
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
            resultados_por_area: areaBreakdown,
            examen_tipo: esExaniI ? 'exani-i' : 'ecoems',
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

    // Timer — runs for all modes (proportional time)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isExamActive && timeLeft > 0 && !isPaused) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isExamActive) {
            handleFinishExam();
        }
        return () => clearInterval(timer);
    }, [isExamActive, timeLeft, isPaused]);

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
        if (selectedBank === 'bank12') return fromSource(bankData.bank12);
        if (selectedBank === 'bank13') return fromSource(bankData.bank13);
        return [
            ...fromSource(bankData.bank1), ...fromSource(bankData.bank2),
            ...fromSource(bankData.bank3), ...fromSource(bankData.bank4)
        ];
    };

    const handleSelectBank = async (bank: BankSelection) => {
        // bank8, bank9, bank10, bank11, bank12: free 10-question preview — select freely, upsell after results
        if (['bank8', 'bank9', 'bank10', 'bank11', 'bank12', 'bank13'].includes(bank)) {
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
        const { data, error } = await (supabase.from('question_reports' as any) as any)
            .insert({ question_id: questionId, user_id: user?.id ?? null, bank_id: selectedBank })
            .select();
        if (error || !data || data.length === 0) return false;
        return true;
    };

    // ── Simulador Mixto ─────────────────────────────────────────────────────
    const bankLabel = esExaniI ? 'EXANI-I' : BANK_LABELS[selectedBank];

    const mixtoPool = React.useMemo(() => {
        const paq = (profile as any)?.paquete_completo === true;
        const pool: Question[] = [
            ...bankData.bank1, ...bankData.bank2, ...bankData.bank3, ...bankData.bank4,
        ];
        if (user) pool.push(...(bankData.bank6 ?? []), ...(bankData.bank7 ?? []), ...(bankData.bank10 ?? []));
        if ((profile as any)?.bank8_unlocked  || paq) pool.push(...(bankData.bank8  ?? []));
        if ((profile as any)?.bank9_unlocked  || paq) pool.push(...(bankData.bank9  ?? []));
        if ((profile as any)?.bank11_unlocked || paq) pool.push(...(bankData.bank11 ?? []));
        if ((profile as any)?.bank12_unlocked || paq) pool.push(...(bankData.bank12 ?? []));
        if ((profile as any)?.bank13_unlocked || paq) pool.push(...(bankData.bank13 ?? []));
        return pool;
    }, [bankData, user, profile]);

    const bancosActivosCount = React.useMemo(() => {
        const paq = (profile as any)?.paquete_completo === true;
        return 4
            + (user ? 3 : 0)
            + ((profile as any)?.bank8_unlocked  || paq ? 1 : 0)
            + ((profile as any)?.bank9_unlocked  || paq ? 1 : 0)
            + ((profile as any)?.bank11_unlocked || paq ? 1 : 0)
            + ((profile as any)?.bank12_unlocked || paq ? 1 : 0)
            + ((profile as any)?.bank13_unlocked || paq ? 1 : 0);
    }, [user, profile]);

    const distribucionPreview = React.useMemo(
        () => calcularDistribucionPreview(mixtoPool, mixtoCount),
        [mixtoPool, mixtoCount]
    );

    const handleStartMixto = async () => {
        const questions = buildMixtoDistribuido(mixtoPool, mixtoCount);
        if (questions.length === 0) return;
        setSelectedBank('mixto');
        setIsPreviewMode(false);
        setActiveQuestions(questions);
        setExamMode('practice');
        setIsExamActive(true);
        setStartTime(Date.now());
        setUserAnswers({});
        setMarkedForReview({});
        setCurrentQuestionIndex(0);
        setTimeLeft(Math.round(questions.length * SECONDS_PER_QUESTION));
        setShowResults(false);
        trackSimuladorStart();
        clarityEvent('simulador_iniciado');
        void track('simulador_iniciado', {
            userId: user?.id,
            metadata: { modo: 'mixto', cantidad: questions.length, bancos: bancosActivosCount },
        });
    };
    // ────────────────────────────────────────────────────────────────────────

    const handleStartExam = async (mode: ExamMode = 'full') => {
        if (selectedBank === 'mixto') { await handleStartMixto(); return; }
        const bank8Unlocked  = (profile as any)?.bank8_unlocked  === true || (profile as any)?.paquete_completo === true;
        const bank9Unlocked  = (profile as any)?.bank9_unlocked  === true || (profile as any)?.paquete_completo === true;
        const bank10Unlocked =
            !!user ||
            (profile as any)?.bank10_unlocked === true ||
            (profile as any)?.guia2026_unlocked === true ||
            (profile as any)?.paquete_completo === true;
        const bank11Unlocked =
            (profile as any)?.bank11_unlocked === true ||
            (profile as any)?.paquete_completo === true;
        const bank12Unlocked =
            (profile as any)?.bank12_unlocked === true ||
            (profile as any)?.paquete_completo === true;
        const bank13Unlocked =
            (profile as any)?.bank13_unlocked === true ||
            (profile as any)?.paquete_completo === true;
        const isPreview =
            (selectedBank === 'bank8'  && !bank8Unlocked)  ||
            (selectedBank === 'bank9'  && !bank9Unlocked)  ||
            (selectedBank === 'bank10' && !bank10Unlocked) ||
            (selectedBank === 'bank11' && !bank11Unlocked) ||
            (selectedBank === 'bank12' && !bank12Unlocked) ||
            (selectedBank === 'bank13' && !bank13Unlocked);

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
        const initialTime = mode === 'practice' ? PRACTICE_TIME_SECONDS : EXAM_TIME_SECONDS;
        setTimeLeft(initialTime);
        setExamInitialTime(initialTime);
        setShowResults(false);
        trackSimuladorStart();
        clarityEvent('simulador_iniciado');
        void track('simulador_iniciado', { userId: user?.id, metadata: { banco: selectedBank, modo: mode } });
    };

    const handleStartExaniExam = () => {
        const count = exaniSelectedOption === '20' ? 20
            : exaniSelectedOption === '50' ? 50
            : exaniSelectedOption === '130' ? 130
            : Math.max(5, Math.min(550, parseInt(exaniCustomInput) || 130));
        const pool = buildPool(selectedArea);
        const questions = shuffleArray(pool).map(shuffleQuestionOptions).slice(0, Math.min(count, pool.length));
        const timeSeconds = Math.round(count * SECONDS_PER_QUESTION);
        setActiveQuestions(questions);
        setExamMode('practice');
        setIsExamActive(true);
        setStartTime(Date.now());
        setUserAnswers({});
        setMarkedForReview({});
        setCurrentQuestionIndex(0);
        setTimeLeft(timeSeconds);
        setExamInitialTime(timeSeconds);
        setShowResults(false);
        trackSimuladorStart();
        clarityEvent('simulador_iniciado');
        void track('simulador_iniciado', { userId: user?.id, metadata: { banco: 'bank1', modo: `exani-${count}` } });
    };

    const verificarTestimonio = async () => {
        if (!user?.id) return;
        const { data: yaExiste } = await supabase
            .from('testimonios')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
        if (yaExiste) return;

        const { count: totalSims } = await supabase
            .from('simulador_results')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        const { data: resultados } = await supabase
            .from('simulador_results')
            .select('total_preguntas')
            .eq('user_id', user.id);

        const totalPregs = resultados?.reduce((sum: number, r: any) => sum + (r.total_preguntas || 0), 0) || 0;

        if ((totalSims ?? 0) >= 3 || totalPregs >= 500) {
            setTotalSimuladoresUser(totalSims ?? 0);
            setTotalPreguntasUser(totalPregs);
            setShowTestimonio(true);
        }
    };

    const guardarTestimonio = async () => {
        const { error } = await supabase
            .from('testimonios')
            .insert({
                user_id: user!.id,
                texto: textoTestimonio.trim(),
                nombre: profile?.name || user!.email,
                simuladores_completados: totalSimuladoresUser,
                total_preguntas: totalPreguntasUser,
            });
        if (!error) {
            toast.success('¡Gracias por compartir tu experiencia! 🌟');
            setShowTestimonio(false);
            setTextoTestimonio('');
            void track('testimonio_enviado', { userId: user!.id });
        } else {
            toast.error('Error al guardar, intenta de nuevo');
        }
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
        const startTime_ = examInitialTime;
        const totalTime = startTime_ - timeLeft;
        const pct = Math.round((finalScore / activeQuestions.length) * 100);
        trackSimuladorComplete(finalScore, totalTime, pct >= 70 ? 'aprobado' : 'reprobado');
        void track('simulador_completado', {
            userId: user?.id,
            metadata: { banco: selectedBank, aciertos: finalScore, errores: activeQuestions.length - finalScore, total: activeQuestions.length, porcentaje: pct },
        });
        if (user?.id) {
            void guardarResultadoSimulador({
                userId: user.id,
                banco: selectedBank,
                totalPreguntas: activeQuestions.length,
                aciertos: finalScore,
                errores: activeQuestions.length - finalScore,
                tiempoSegundos: totalTime > 0 ? totalTime : undefined,
            });
            void verificarTestimonio();
        }
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

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
        );
    }

    if (!esExaniI && (!profile || !(profile as any).paquete_completo)) {
        return <PromoBloqueo titulo="Simulador Pro" />;
    }

    if (showRestoreModal) return <RestoreModal onRestore={handleRestore} onNew={handleNewExam} />;

    if (showResults) {
        const totalBankQuestions = bankData[selectedBank as keyof typeof bankData]?.length ?? 0;
        return (
            <>
            <SimulatorResults
                user={user}
                activeQuestions={activeQuestions}
                userAnswers={userAnswers}
                markedForReview={markedForReview}
                examMode={examMode}
                selectedEscuela={selectedEscuela}
                onRestartFull={() => handleStartExam('full')}
                onRestartPractice={() => handleStartExam('practice')}
                onBackToDashboard={() => navigate(esExaniI ? '/exani-i' : '/')}
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

            {/* Modal testimonio */}
            {showTestimonio && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="text-center mb-4">
                            <span className="text-5xl">🌟</span>
                            <h3 className="text-xl font-bold mt-3 text-gray-800">
                                ¡Ya llevas mucho avance!
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Completaste {totalSimuladoresUser} simuladores y respondiste {totalPreguntasUser} preguntas.
                                ¿CyberEdu MX te ha ayudado a prepararte?
                            </p>
                        </div>
                        <textarea
                            placeholder="Ej: Me ayudó muchísimo a entender los temas de matemáticas, antes reprobaba y ahora me siento más seguro..."
                            rows={4}
                            value={textoTestimonio}
                            onChange={e => setTextoTestimonio(e.target.value)}
                            maxLength={500}
                            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">
                            {textoTestimonio.length}/500
                        </p>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={guardarTestimonio}
                                disabled={textoTestimonio.trim().length < 10}
                                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Compartir mi experiencia 💜
                            </button>
                            <button
                                onClick={() => setShowTestimonio(false)}
                                className="px-4 py-3 text-gray-400 text-sm hover:text-gray-600"
                            >
                                Después
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </>
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
                    if (q) {
                        clarityEvent('pregunta_respondida');
                        setUserAnswers(prev => ({ ...prev, [q.id]: idx }));
                    }
                }}
                onNext={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, activeQuestions.length - 1))}
                onPrev={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                onPause={handlePause}
                onResume={handleResume}
                onFinish={handleFinishExam}
                onSaveAndExit={handleSaveAndExit}
                onAbandon={handleAbandon}
                onToggleMark={() => {
                    const q = activeQuestions[currentQuestionIndex];
                    if (q) setMarkedForReview(prev => ({ ...prev, [q.id]: !prev[q.id] }));
                }}
                onJumpToQuestion={setCurrentQuestionIndex}
                bankLabel={bankLabel}
                onReportQuestion={handleReportQuestion}
                formatTime={(s) => {
                    const h = Math.floor(s / 3600);
                    const m = Math.floor((s % 3600) / 60);
                    const sec = s % 60;
                    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
                }}
                onAskTutor={async (q) => {
                    if (!user?.id) return;
                    await supabase.from('tutor_uso' as any).insert({
                        user_id: user.id,
                        pregunta_id: String(q.id),
                        pregunta_texto: q.text.slice(0, 200),
                        area: q.area,
                    });
                }}
            />
        );
    }

    if (esExaniI) {
        const exaniPool = bankData.bank1 ?? [];
        const uniqueAreas = [...new Set(exaniPool.map(q => q.area))];
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <button onClick={() => navigate('/exani-i')} className="flex items-center gap-2 text-white/50 hover:text-white/80 mb-8 transition-colors text-sm">
                        ← Volver a EXANI-I
                    </button>
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">Simulador EXANI-I</h1>
                        <p className="text-white/50 mt-2">{exaniPool.length} preguntas disponibles</p>
                    </div>
                    <div className="space-y-4 mb-8">
                        <p className="text-sm font-semibold text-white/60">Filtrar por área</p>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setSelectedArea('all')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${selectedArea === 'all' ? 'bg-teal-600 text-white border-teal-600' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}>
                                Todas
                            </button>
                            {uniqueAreas.map(a => (
                                <button key={a} onClick={() => setSelectedArea(a)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${selectedArea === a ? 'bg-teal-600 text-white border-teal-600' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}>
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-semibold text-white/60 mb-3 text-center">Número de preguntas</p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {([
                                    { value: '20',     label: '20 preguntas',  sublabel: 'práctica rápida' },
                                    { value: '50',     label: '50 preguntas',  sublabel: 'práctica media' },
                                    { value: '130',    label: '130 preguntas', sublabel: 'examen real EXANI-I' },
                                    { value: 'custom', label: 'Personalizado', sublabel: 'tú eliges' },
                                ] as const).map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setExaniSelectedOption(opt.value)}
                                        className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border flex flex-col items-center min-w-[120px] ${
                                            exaniSelectedOption === opt.value
                                                ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-500/25'
                                                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        <span className="text-xs font-normal opacity-70 mt-0.5">{opt.sublabel}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {exaniSelectedOption === 'custom' && (
                            <div className="flex flex-col items-center gap-2">
                                <label className="text-sm text-white/50">¿Cuántas preguntas?</label>
                                <input
                                    type="number"
                                    min={5}
                                    max={550}
                                    value={exaniCustomInput}
                                    onChange={e => setExaniCustomInput(e.target.value)}
                                    className="w-36 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center text-lg font-bold focus:outline-none focus:border-teal-500"
                                    placeholder="130"
                                />
                                <p className="text-xs text-white/30">mínimo 5 · máximo 550</p>
                            </div>
                        )}
                        <div className="flex justify-center">
                            <button
                                onClick={handleStartExaniExam}
                                className="px-10 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all text-lg shadow-lg shadow-teal-500/25"
                            >
                                Iniciar Simulador
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
                if (selectedBank === 'mixto') return mixtoCount === 'all' ? mixtoPool.length : Math.min(mixtoCount as number, mixtoPool.length);
                const b8u  = (profile as any)?.bank8_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b9u  = (profile as any)?.bank9_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b10u = !!user || (profile as any)?.bank10_unlocked === true || (profile as any)?.guia2026_unlocked === true || (profile as any)?.paquete_completo === true;
                const b11u = (profile as any)?.bank11_unlocked === true || (profile as any)?.paquete_completo === true;
                const b12u = (profile as any)?.bank12_unlocked === true || (profile as any)?.paquete_completo === true;
                const b13u = (profile as any)?.bank13_unlocked === true || (profile as any)?.paquete_completo === true;
                if (selectedBank === 'bank8'  && !b8u)  return 10;
                if (selectedBank === 'bank9'  && !b9u)  return 10;
                if (selectedBank === 'bank10' && !b10u) return 10;
                if (selectedBank === 'bank11' && !b11u) return 10;
                if (selectedBank === 'bank12' && !b12u) return 10;
                if (selectedBank === 'bank13' && !b13u) return 10;
                return buildPool(selectedArea).length;
            })()}
            practiceModeCount={(() => {
                if (selectedBank === 'mixto') return mixtoCount === 'all' ? mixtoPool.length : Math.min(mixtoCount as number, mixtoPool.length);
                const b8u  = (profile as any)?.bank8_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b9u  = (profile as any)?.bank9_unlocked  === true || (profile as any)?.paquete_completo === true;
                const b10u = !!user || (profile as any)?.bank10_unlocked === true || (profile as any)?.guia2026_unlocked === true || (profile as any)?.paquete_completo === true;
                const b11u = (profile as any)?.bank11_unlocked === true || (profile as any)?.paquete_completo === true;
                const b12u = (profile as any)?.bank12_unlocked === true || (profile as any)?.paquete_completo === true;
                const b13u = (profile as any)?.bank13_unlocked === true || (profile as any)?.paquete_completo === true;
                if (selectedBank === 'bank8'  && !b8u)  return 10;
                if (selectedBank === 'bank9'  && !b9u)  return 10;
                if (selectedBank === 'bank10' && !b10u) return 10;
                if (selectedBank === 'bank11' && !b11u) return 10;
                if (selectedBank === 'bank12' && !b12u) return 10;
                if (selectedBank === 'bank13' && !b13u) return 10;
                return Math.min(PRACTICE_QUESTION_COUNT, buildPool(selectedArea).length);
            })()}
            onBackToHome={() => navigate(esExaniI ? '/exani-i' : '/')}
            userTokens={profile?.tokens ?? 0}
            bank6Unlocked={(profile as any)?.bank6_unlocked === true}
            bank7Unlocked={(profile as any)?.bank7_unlocked === true}
            bank8Unlocked={(profile as any)?.bank8_unlocked === true}
            bank9Unlocked={(profile as any)?.bank9_unlocked === true}
            bank10Unlocked={!!user || (profile as any)?.bank10_unlocked === true}
            bank11Unlocked={(profile as any)?.bank11_unlocked === true}
            bank12Unlocked={(profile as any)?.bank12_unlocked === true}
            bank13Unlocked={(profile as any)?.bank13_unlocked === true}
            guia2026Unlocked={(profile as any)?.guia2026_unlocked === true}
            paqueteCompleto={(profile as any)?.paquete_completo === true}
            isLoggedIn={!!user}
            onNavigateToGuias={() => navigate('/auth?ref=simulador&reason=guias')}
            onRedeemUnlock={handleRedeemUnlock}
            onStartMixto={handleStartMixto}
            mixtoCount={mixtoCount}
            onSetMixtoCount={setMixtoCount}
            bancosActivosCount={bancosActivosCount}
            totalPreguntasMixto={mixtoPool.length}
            distribucionPreview={distribucionPreview}
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
