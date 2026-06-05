import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PromoBloqueo from '@/components/PromoBloqueo';
import { cn } from '@/lib/utils';
import { Question } from '@/data/simuladorData';
import { SimulatorActive } from '@/components/simulator/SimulatorActive';
import { SimulatorResults } from '@/components/simulator/SimulatorResults';
import {
    generarSimuladorPersonalizado,
    ALL_MATERIAS,
    DISTRIBUCION_OFICIAL,
} from '@/data/adaptadorPreguntas';

const AREA_GROUPS = [
    { emoji: '📐', label: 'Matemáticas', areas: ['Habilidad Matemática', 'Matemáticas'] },
    { emoji: '📝', label: 'Español / Verbal', areas: ['Habilidad Verbal', 'Español'] },
    { emoji: '🧪', label: 'Ciencias', areas: ['Biología', 'Física', 'Química'] },
    { emoji: '🌎', label: 'Ciencias Sociales', areas: ['Historia', 'Geografía', 'Formación Cívica y Ética'] },
] as const;

const SECONDS_PER_QUESTION = 84.375;
const STORAGE_KEY = 'simulador_infinito_estado';

const formatTime = (s: number): string => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

const formatearTiempo = (segundos: number): string => {
    const horas = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    if (horas > 0 && mins > 0) return `${horas}h ${mins}min`;
    if (horas > 0) return `${horas}h`;
    return `${mins} min`;
};

type PageState = 'config' | 'loading' | 'exam' | 'results';

const SimuladorInfinito: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, loading } = useAuth();

    const [pageState, setPageState] = useState<PageState>('config');
    const [initError, setInitError] = useState<string | null>(null);
    const [hayEstadoGuardado, setHayEstadoGuardado] = useState(false);
    const [estadoGuardado, setEstadoGuardado] = useState<any>(null);

    // Config
    const [cantidad, setCantidad] = useState(128);
    const [customInput, setCustomInput] = useState('128');
    const [showCustom, setShowCustom] = useState(false);
    const [materias, setMaterias] = useState<string[]>([...ALL_MATERIAS]);
    const [fuente, setFuente] = useState<'bancos' | 'subindices' | 'ambas'>('ambas');
    const tiempoSimulador = Math.round(cantidad * SECONDS_PER_QUESTION);

    // Exam
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const handleFinish = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setPageState('results');
    }, []);

    // Verificar estado guardado al montar
    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        try {
            const estado = JSON.parse(raw);
            const horas = (Date.now() - estado.timestamp) / (1000 * 60 * 60);
            if (horas < 24) {
                setHayEstadoGuardado(true);
                setEstadoGuardado(estado);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (pageState !== 'exam' || isPaused) return;
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearInterval(timer); handleFinish(); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [pageState, isPaused, handleFinish]);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth?redirect=/simulador-infinito');
        }
    }, [user, loading, navigate]);

    const guardarEstado = useCallback(() => {
        const estado = {
            preguntas: questions,
            indiceActual: currentIndex,
            respuestas: userAnswers,
            marcadas: markedForReview,
            tiempoRestante: timeLeft,
            config: { cantidad, materias, fuente },
            timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    }, [questions, currentIndex, userAnswers, markedForReview, timeLeft, cantidad, materias, fuente]);

    const continuarSimulador = () => {
        if (!estadoGuardado) return;
        setQuestions(estadoGuardado.preguntas);
        setCurrentIndex(estadoGuardado.indiceActual);
        setUserAnswers(estadoGuardado.respuestas);
        setMarkedForReview(estadoGuardado.marcadas || {});
        setTimeLeft(estadoGuardado.tiempoRestante);
        if (estadoGuardado.config) {
            setCantidad(estadoGuardado.config.cantidad);
            setMaterias(estadoGuardado.config.materias);
            setFuente(estadoGuardado.config.fuente);
        }
        localStorage.removeItem(STORAGE_KEY);
        setHayEstadoGuardado(false);
        setEstadoGuardado(null);
        setPageState('exam');
    };

    const getBancosDesbloqueados = (): string[] => {
        const p = profile as any;
        const paq = p?.paquete_completo === true;
        const bancos: string[] = [];
        if (user) bancos.push('6', '7', '10');
        if (p?.bank8_unlocked || paq) bancos.push('8');
        if (p?.bank9_unlocked || paq) bancos.push('9');
        if (p?.bank11_unlocked || paq) bancos.push('11');
        if (p?.bank12_unlocked || paq) bancos.push('12');
        return bancos;
    };

    const handleIniciar = async () => {
        if (materias.length === 0) return;
        setInitError(null);
        setPageState('loading');
        try {
            const qs = await generarSimuladorPersonalizado({
                cantidad,
                materias,
                fuente,
                bancosDesbloqueados: getBancosDesbloqueados(),
                paqueteCompleto: (profile as any)?.paquete_completo === true,
            });
            if (qs.length === 0) {
                setInitError('No se encontraron preguntas con la configuración seleccionada. Intenta con más materias o cambia la fuente.');
                setPageState('config');
                return;
            }
            setQuestions(qs);
            setCurrentIndex(0);
            setUserAnswers({});
            setMarkedForReview({});
            setTimeLeft(Math.round(qs.length * SECONDS_PER_QUESTION));
            setIsPaused(false);
            setPageState('exam');
        } catch (err) {
            console.error('Error generando simulador:', err);
            setInitError('Ocurrió un error al cargar las preguntas. Intenta de nuevo.');
            setPageState('config');
        }
    };

    // Distribution preview (proportional to official weights)
    const totalOficialFiltrado = ALL_MATERIAS
        .filter(a => materias.includes(a))
        .reduce((s, a) => s + (DISTRIBUCION_OFICIAL[a] || 0), 0);

    const distribucionPreview = ALL_MATERIAS
        .filter(a => materias.includes(a))
        .map(area => ({
            area,
            count: totalOficialFiltrado > 0
                ? Math.round((DISTRIBUCION_OFICIAL[area] || 0) / totalOficialFiltrado * cantidad)
                : 0,
            oficial: DISTRIBUCION_OFICIAL[area] || 0,
        }))
        .filter(d => d.count > 0);

    const esDistribucionOficial = cantidad === 128 && materias.length === ALL_MATERIAS.length;

    // Auth guards — after all hooks
    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-950">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
        </div>
    );
    if (!user || !(profile as any)?.paquete_completo) return <PromoBloqueo titulo="Simulador Infinito" />;

    // ── Config ──────────────────────────────────────────────────────────────
    if (pageState === 'config') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-xl">

                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-4xl shrink-0">
                                ♾️
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white">Simulador Infinito</h1>
                                <p className="text-slate-400 text-sm mt-1">
                                    Personaliza tu práctica con toda la base de preguntas
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Banner: continuar simulador pausado */}
                    {hayEstadoGuardado && estadoGuardado && (
                        <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4">
                            <p className="font-semibold text-blue-400 mb-1">
                                📌 Tienes un simulador pausado
                            </p>
                            <p className="text-sm text-slate-400 mb-3">
                                Pregunta {estadoGuardado.indiceActual + 1} de{' '}
                                {estadoGuardado.preguntas.length} ·{' '}
                                Tiempo restante: {formatearTiempo(estadoGuardado.tiempoRestante)}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={continuarSimulador}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-500 transition-colors"
                                >
                                    Continuar donde lo dejé ▶
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem(STORAGE_KEY);
                                        setHayEstadoGuardado(false);
                                        setEstadoGuardado(null);
                                    }}
                                    className="px-3 py-2 text-slate-400 text-sm hover:text-white transition-colors"
                                >
                                    Descartar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN 1 — Cantidad */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            ¿Cuántas preguntas?
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                            {([10, 20, 50, 128, 200] as const).map(n => (
                                <button
                                    key={n}
                                    onClick={() => { setCantidad(n); setShowCustom(false); }}
                                    className={cn(
                                        'py-3 rounded-xl border-2 font-black text-sm transition-all flex flex-col items-center gap-0.5',
                                        cantidad === n && !showCustom
                                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                            : 'border-white/10 text-slate-400 hover:border-blue-500/40 hover:text-blue-300'
                                    )}
                                >
                                    {n}
                                    {n === 128 && (
                                        <span className="text-[8px] text-green-400 font-bold leading-none">ECOEMS</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowCustom(s => !s)}
                            className={cn(
                                'text-xs px-3 py-1.5 rounded-lg border transition-all',
                                showCustom
                                    ? 'border-blue-500 text-blue-300 bg-blue-500/10'
                                    : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400'
                            )}
                        >
                            ✏️ Número personalizado
                        </button>
                        {showCustom && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    max={200}
                                    value={customInput}
                                    onChange={e => setCustomInput(e.target.value)}
                                    onBlur={() => {
                                        const n = Math.max(1, Math.min(200, parseInt(customInput) || 50));
                                        setCustomInput(String(n));
                                        setCantidad(n);
                                    }}
                                    className="w-24 px-3 py-2 rounded-xl text-sm font-black text-center outline-none text-white"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59,130,246,0.4)' }}
                                    autoFocus
                                />
                                <span className="text-xs text-slate-500">preguntas (1–200)</span>
                            </div>
                        )}
                    </div>

                    {/* SECCIÓN 2 — Materias */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                ¿Qué materias incluir?
                            </p>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setMaterias([...ALL_MATERIAS])}
                                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all border border-white/10"
                                >
                                    Todas
                                </button>
                                <button
                                    onClick={() => setMaterias([])}
                                    className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all border border-white/10"
                                >
                                    Ninguna
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ALL_MATERIAS.map(materia => {
                                const checked = materias.includes(materia);
                                const oficial = DISTRIBUCION_OFICIAL[materia] || 0;
                                return (
                                    <button
                                        key={materia}
                                        onClick={() =>
                                            setMaterias(prev =>
                                                checked
                                                    ? prev.filter(m => m !== materia)
                                                    : [...prev, materia]
                                            )
                                        }
                                        className={cn(
                                            'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                                            checked
                                                ? 'border-blue-500/60 bg-blue-500/10'
                                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                        )}
                                    >
                                        <div className={cn(
                                            'w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center',
                                            checked ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                                        )}>
                                            {checked && <span className="text-white text-[10px] font-black leading-none">✓</span>}
                                        </div>
                                        <span className="text-sm font-bold text-white flex-1 truncate">{materia}</span>
                                        <span className="text-[10px] text-slate-500 shrink-0">{oficial} oficial</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECCIÓN 3 — Fuente */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            ¿Qué fuente de preguntas?
                        </p>
                        <div className="space-y-2">
                            {([
                                { value: 'bancos', label: 'Solo bancos SimuladorPro', desc: 'Preguntas de los bancos desbloqueados' },
                                { value: 'subindices', label: 'Solo práctica por subíndice', desc: '~3,680 preguntas clasificadas por tema' },
                                { value: 'ambas', label: 'Ambas fuentes', desc: 'Recomendado — mayor variedad', recommended: true },
                            ] as const).map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFuente(opt.value)}
                                    className={cn(
                                        'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                                        fuente === opt.value
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-white/10 bg-white/[0.02] hover:border-blue-500/30'
                                    )}
                                >
                                    <div className={cn(
                                        'w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5',
                                        fuente === opt.value ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                                    )} />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">{opt.label}</span>
                                            {opt.recommended && (
                                                <span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-black">
                                                    RECOMENDADO
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SECCIÓN 4 — Distribución resultante */}
                    {materias.length > 0 ? (
                        <div
                            className="rounded-xl p-4 space-y-3"
                            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
                        >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                    Tu simulador tendrá:
                                </p>
                                {esDistribucionOficial ? (
                                    <span className="text-[10px] bg-green-600/30 text-green-400 border border-green-500/40 px-2 py-0.5 rounded-full font-black whitespace-nowrap">
                                        ✅ Distribución oficial ECOEMS
                                    </span>
                                ) : (
                                    <span className="text-[10px] bg-yellow-600/30 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded-full font-black whitespace-nowrap">
                                        ⚠️ Distribución personalizada
                                    </span>
                                )}
                            </div>

                            {AREA_GROUPS.map(grupo => {
                                const items = grupo.areas
                                    .map(area => ({
                                        area,
                                        count: distribucionPreview.find(d => d.area === area)?.count ?? 0,
                                    }))
                                    .filter(i => i.count > 0);
                                const total = items.reduce((s, i) => s + i.count, 0);
                                if (total === 0) return null;
                                return (
                                    <div key={grupo.label} className="flex items-baseline justify-between gap-2">
                                        <div>
                                            <span className="text-white font-black text-[12px]">
                                                {grupo.emoji} {grupo.label}
                                            </span>
                                            {items.length > 1 && (
                                                <span className="text-slate-500 text-[9px] ml-1.5">
                                                    ({items.map(i => i.count).join(' + ')})
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-black text-blue-300 text-[12px] shrink-0">{total}</span>
                                    </div>
                                );
                            })}

                            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                                <p className="text-[11px] text-slate-400">
                                    Total: <span className="font-black text-white">{cantidad}</span> preguntas
                                </p>
                                <span className="text-[11px] text-blue-300 font-bold">
                                    ⏱️ {formatearTiempo(tiempoSimulador)}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl p-4 text-center text-slate-500 text-sm border border-white/10">
                            Selecciona al menos una materia para continuar
                        </div>
                    )}

                    {initError && (
                        <div className="rounded-xl px-4 py-3 text-sm font-bold text-red-300 bg-red-500/10 border border-red-500/30">
                            ⚠️ {initError}
                        </div>
                    )}

                    <button
                        onClick={handleIniciar}
                        disabled={materias.length === 0}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-base hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Iniciar Simulador ♾️
                    </button>
                </div>
            </div>
        );
    }

    // ── Loading ──────────────────────────────────────────────────────────────
    if (pageState === 'loading') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-6xl animate-pulse">♾️</div>
                    <p className="text-white font-black text-xl">Generando simulador único...</p>
                    <p className="text-slate-400 text-sm">
                        Mezclando {cantidad} preguntas de {materias.length} materias
                    </p>
                </div>
            </div>
        );
    }

    // ── Exam ─────────────────────────────────────────────────────────────────
    if (pageState === 'exam') {
        return (
            <SimulatorActive
                currentQuestionIndex={currentIndex}
                activeQuestions={questions}
                userAnswers={userAnswers}
                markedForReview={markedForReview}
                timeLeft={timeLeft}
                isPaused={isPaused}
                examMode="full"
                bankLabel="Simulador Infinito ♾️"
                onSelectAnswer={idx => {
                    const q = questions[currentIndex];
                    if (q) setUserAnswers(prev => ({ ...prev, [q.id]: idx }));
                }}
                onNext={() => setCurrentIndex(i => Math.min(i + 1, questions.length - 1))}
                onPrev={() => setCurrentIndex(i => Math.max(i - 1, 0))}
                onPause={() => { setIsPaused(true); guardarEstado(); }}
                onResume={() => setIsPaused(false)}
                onFinish={handleFinish}
                onSaveAndExit={() => { guardarEstado(); navigate('/'); }}
                onAbandon={() => { localStorage.removeItem(STORAGE_KEY); navigate('/'); }}
                onToggleMark={() => {
                    const q = questions[currentIndex];
                    if (q) setMarkedForReview(prev => ({ ...prev, [q.id]: !prev[q.id] }));
                }}
                onJumpToQuestion={setCurrentIndex}
                onReportQuestion={async () => false}
                formatTime={formatTime}
            />
        );
    }

    // ── Results ───────────────────────────────────────────────────────────────
    const porArea: Record<string, { total: number; correctas: number; oficial: number }> = {};
    questions.forEach(q => {
        const area = q.area || 'Sin área';
        if (!porArea[area]) {
            porArea[area] = { total: 0, correctas: 0, oficial: DISTRIBUCION_OFICIAL[area] || 0 };
        }
        porArea[area].total++;
        if (userAnswers[q.id] === q.correctIndex) porArea[area].correctas++;
    });

    return (
        <SimulatorResults
            user={user}
            activeQuestions={questions}
            userAnswers={userAnswers}
            markedForReview={markedForReview}
            examMode="practice"
            selectedEscuela={null}
            onRestartFull={() => setPageState('config')}
            onRestartPractice={() => setPageState('config')}
            onBackToDashboard={() => navigate('/')}
        >
            {/* Comparativa con distribución oficial ECOEMS */}
            {Object.keys(porArea).length > 0 && (
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-4 mt-4">
                    <h3 className="font-black text-white text-base">
                        Tu simulador vs Examen oficial ECOEMS
                    </h3>
                    <div className="space-y-2.5">
                        {ALL_MATERIAS.map(area => {
                            const data = porArea[area];
                            if (!data) return null;
                            const alcanzaOficial = data.total >= data.oficial;
                            return (
                                <div
                                    key={area}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span className="text-slate-300 flex-1 text-xs">{area}</span>
                                    <span className="text-slate-500 text-xs shrink-0">
                                        {data.correctas}/{data.total} correctas
                                    </span>
                                    <span className={cn(
                                        'text-xs font-bold shrink-0 w-28 text-right',
                                        alcanzaOficial ? 'text-green-400' : 'text-yellow-400'
                                    )}>
                                        {data.total} vs {data.oficial} oficial {alcanzaOficial ? '✅' : '⚠️'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-slate-600 pt-2 border-t border-white/10">
                        El examen oficial ECOEMS incluye {Object.values(DISTRIBUCION_OFICIAL).reduce((a, b) => a + b, 0)} preguntas distribuidas en 10 materias.
                    </p>
                </div>
            )}
        </SimulatorResults>
    );
};

export default SimuladorInfinito;
