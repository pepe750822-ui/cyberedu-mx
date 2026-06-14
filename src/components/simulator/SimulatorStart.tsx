import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Brain,
    ArrowLeft,
    Clock,
    Zap,
    ChevronRight,
    Shuffle,
    Lock,
    Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ESCUELAS, Escuela } from "@/data/escuelas";

type BankSelection = 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'bank6' | 'bank7' | 'bank8' | 'bank9' | 'bank10' | 'bank11' | 'bank12' | 'bank13' | 'mixed' | 'mixto';
type ExamMode = 'full' | 'practice';

const AREA_FILTERS = [
    { label: 'Todas las áreas', value: 'all' },
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

interface SimulatorStartProps {
    selectedBank: BankSelection;
    onSelectBank: (bank: BankSelection) => void;
    selectedArea: string;
    onSelectArea: (area: string) => void;
    selectedEscuela: Escuela | null;
    onSelectEscuela: (escuela: Escuela | null) => void;
    onStartExam: (mode: ExamMode) => void;
    fullModeCount: number;
    practiceModeCount: number;
    onBackToHome: () => void;
    userTokens?: number;
    bank6Unlocked?: boolean;
    bank7Unlocked?: boolean;
    bank8Unlocked?: boolean;
    bank9Unlocked?: boolean;
    bank10Unlocked?: boolean;
    bank11Unlocked?: boolean;
    bank12Unlocked?: boolean;
    bank13Unlocked?: boolean;
    guia2026Unlocked?: boolean;
    paqueteCompleto?: boolean;
    isLoggedIn?: boolean;
    onNavigateToGuias?: () => void;
    onRedeemUnlock?: (bankKey: string, cost: number, updates: Record<string, boolean>) => Promise<void>;
    children?: React.ReactNode; // ProgressPanel
    onStartMixto?: () => void;
    mixtoCount?: number | 'all';
    onSetMixtoCount?: (count: number | 'all') => void;
    bancosActivosCount?: number;
    totalPreguntasMixto?: number;
    distribucionPreview?: Array<{ area: string; count: number }>;
}

export const SimulatorStart: React.FC<SimulatorStartProps> = ({
    selectedBank,
    onSelectBank,
    selectedArea,
    onSelectArea,
    selectedEscuela,
    onSelectEscuela,
    onStartExam,
    fullModeCount,
    practiceModeCount,
    onBackToHome,
    userTokens = 0,
    bank6Unlocked = false,
    bank7Unlocked = false,
    bank8Unlocked = false,
    bank9Unlocked = false,
    bank10Unlocked = false,
    bank11Unlocked = false,
    bank12Unlocked = false,
    bank13Unlocked = false,
    guia2026Unlocked = false,
    paqueteCompleto = false,
    isLoggedIn = false,
    onNavigateToGuias,
    onRedeemUnlock,
    children,
    onStartMixto,
    mixtoCount = 50,
    onSetMixtoCount,
    bancosActivosCount = 4,
    totalPreguntasMixto = 0,
    distribucionPreview = [],
}) => {
    const [customInput, setCustomInput] = React.useState('50');
    const [showCustom, setShowCustom] = React.useState(false);
    const navigate = useNavigate();
    const hasTokens = userTokens >= 50;

    const formatearTiempo = (segundos: number): string => {
        const horas = Math.floor(segundos / 3600);
        const mins = Math.floor((segundos % 3600) / 60);
        if (horas > 0 && mins > 0) return `${horas}h ${mins}min`;
        if (horas > 0) return `${horas}h`;
        return `${mins} min`;
    };
    const tiempoFull = formatearTiempo(Math.round(fullModeCount * 84.375));
    const tiempoPractica = formatearTiempo(Math.round(practiceModeCount * 84.375));

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-8 backdrop-blur-xl">
                <button
                    onClick={onBackToHome}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio
                </button>
                <div className="h-24 w-24 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                    <Brain className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Simulador Pro ECOEMS</h1>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                        512 reactivos en 4 bancos — preguntas y opciones aleatorizadas en cada intento.
                    </p>
                </div>

                {/* Banner promocional Paquete Completo */}
                <div className="mx-4 mb-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/40 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-yellow-400 text-black font-black text-xs px-2 py-0.5 rounded-full">🔥 OFERTA</span>
                        </div>
                        <p className="text-white font-bold text-sm">Paquete Completo — 100 tokens</p>
                        <p className="text-gray-400 text-xs">Todos los simuladores + 44 videos Guía 2026</p>
                    </div>
                    <button
                        onClick={() => navigate('/tokens')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-4 py-2 rounded-xl text-sm whitespace-nowrap hover:scale-105 transition-transform flex-shrink-0"
                    >
                        🪙 Ver oferta
                    </button>
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
                        ]).map(b => (
                            <button
                                key={b.value}
                                onClick={() => onSelectBank(b.value)}
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
                        {/* Bank 6 — Gratis con registro */}
                        <button
                            onClick={() => onSelectBank('bank6')}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                selectedBank === 'bank6'
                                    ? isLoggedIn ? "bg-emerald-600 text-white border-emerald-600" : "bg-violet-600 text-white border-violet-600"
                                    : isLoggedIn
                                    ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                    : "bg-white/5 text-violet-400 border-violet-500/40 hover:bg-violet-500/10"
                            )}
                        >
                            🎁
                            Banco 6 — Guía UNAM 2021
                            {isLoggedIn ? (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                    🎁 GRATIS
                                </span>
                            ) : (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-violet-500/20 text-violet-300 border-violet-500/40">
                                    🎁 GRATIS con registro
                                </span>
                            )}
                        </button>
                        {/* Bank 7 — Gratis con registro */}
                        <button
                            onClick={() => onSelectBank('bank7')}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                selectedBank === 'bank7'
                                    ? isLoggedIn ? "bg-emerald-600 text-white border-emerald-600" : "bg-violet-600 text-white border-violet-600"
                                    : isLoggedIn
                                    ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                    : "bg-white/5 text-violet-400 border-violet-500/40 hover:bg-violet-500/10"
                            )}
                        >
                            🎁
                            Banco 7 — Guía UNAM 2022
                            {isLoggedIn ? (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                    🎁 GRATIS
                                </span>
                            ) : (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-violet-500/20 text-violet-300 border-violet-500/40">
                                    🎁 GRATIS con registro
                                </span>
                            )}
                        </button>
                        {/* Bank 8 — 10 gratis preview */}
                        <button
                            onClick={() => onSelectBank('bank8')}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                selectedBank === 'bank8'
                                    ? bank8Unlocked || paqueteCompleto ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                    : bank8Unlocked || paqueteCompleto
                                    ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                    : "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                            )}
                        >
                            {bank8Unlocked || paqueteCompleto ? '📚' : <Lock className="w-3 h-3 shrink-0" />}
                            Banco 8 — Guía UNAM 2023
                            {bank8Unlocked || paqueteCompleto ? (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                    ✅ DESBLOQUEADO
                                </span>
                            ) : (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-amber-500/10 text-amber-400 border-amber-500/30">
                                    🆓 10 gratis · 🔒 50 tokens completo
                                </span>
                            )}
                        </button>
                        {/* Bank 9 — 10 gratis preview */}
                        <button
                            onClick={() => onSelectBank('bank9')}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                selectedBank === 'bank9'
                                    ? bank9Unlocked || paqueteCompleto ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                    : bank9Unlocked || paqueteCompleto
                                    ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                    : "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                            )}
                        >
                            {bank9Unlocked || paqueteCompleto ? '📚' : <Lock className="w-3 h-3 shrink-0" />}
                            Banco 9 — Guía UNAM 2024
                            {bank9Unlocked || paqueteCompleto ? (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                    ✅ DESBLOQUEADO
                                </span>
                            ) : (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-amber-500/10 text-amber-400 border-amber-500/30">
                                    🆓 10 gratis · 🔒 50 tokens completo
                                </span>
                            )}
                        </button>
                        {/* Bank 10 — Guía 2026 (incluido en paquete guía2026 o paquete completo) */}
                        {(() => {
                            const b10Unlocked = bank10Unlocked || guia2026Unlocked || paqueteCompleto;
                            return (
                                <button
                                    onClick={() => onSelectBank('bank10')}
                                    className={cn(
                                        "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                        selectedBank === 'bank10'
                                            ? b10Unlocked ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                            : b10Unlocked
                                            ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                            : "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                                    )}
                                >
                                    🆕 Banco 10 — Guía IPN/UNAM 2026
                                    {b10Unlocked ? (
                                        <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                            ✅ INCLUIDO
                                        </span>
                                    ) : (
                                        <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-purple-500/10 text-purple-400 border-purple-500/30">
                                            🔒 Regístrate gratis
                                        </span>
                                    )}
                                </button>
                            );
                        })()}
                    </div>

                    {/* Banco 11 */}
                    {(() => {
                        const b11Unlocked = bank11Unlocked || paqueteCompleto;
                        return (
                            <button
                                onClick={() => onSelectBank('bank11')}
                                className={cn(
                                    "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                    selectedBank === 'bank11'
                                        ? b11Unlocked ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                        : b11Unlocked
                                        ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                        : "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                                )}
                            >
                                📋 Banco 11 — 2do Examen Conocimientos Gen.
                                {b11Unlocked ? (
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                        ✅ INCLUIDO
                                    </span>
                                ) : (
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-amber-500/10 text-amber-400 border-amber-500/30">
                                        🆓 10 gratis · 🔒 50 tokens
                                    </span>
                                )}
                            </button>
                        );
                    })()}

                    {/* Acceso directo Guía 2026 */}
                    <button
                        onClick={() => navigate('/guia2026')}
                        className="w-full mt-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 font-bold py-2 rounded-xl text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                        🎬 Ver 44 videos — Guía 2026
                    </button>

                    {/* Banner bank8 */}
                    {selectedBank === 'bank8' && !(bank8Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-sm space-y-2">
                            <span className="text-amber-400 font-semibold block">🆓 Prueba 10 preguntas gratis ahora mismo</span>
                            <span className="text-slate-400 text-xs block">Desbloquea el banco completo con un pago único de 50 tokens — acceso de por vida</span>
                            {onRedeemUnlock && isLoggedIn && userTokens >= 50 && (
                                <button
                                    onClick={() => onRedeemUnlock('bank8_unlocked', 50, { bank8_unlocked: true })}
                                    className="mt-1 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    🔓 Desbloquear — 50 tokens
                                </button>
                            )}
                        </div>
                    )}
                    {selectedBank === 'bank8' && (bank8Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-sm">
                            <span className="text-green-400 font-semibold">✅ Banco desbloqueado — ¡Practica sin límite!</span>
                        </div>
                    )}
                    {/* Banner bank9 */}
                    {selectedBank === 'bank9' && !(bank9Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-sm space-y-2">
                            <span className="text-amber-400 font-semibold block">🆓 Prueba 10 preguntas gratis ahora mismo</span>
                            <span className="text-slate-400 text-xs block">Desbloquea el banco completo con un pago único de 50 tokens — acceso de por vida</span>
                            {onRedeemUnlock && isLoggedIn && userTokens >= 50 && (
                                <button
                                    onClick={() => onRedeemUnlock('bank9_unlocked', 50, { bank9_unlocked: true })}
                                    className="mt-1 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    🔓 Desbloquear — 50 tokens
                                </button>
                            )}
                        </div>
                    )}
                    {selectedBank === 'bank9' && (bank9Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-sm">
                            <span className="text-green-400 font-semibold">✅ Banco desbloqueado — ¡Practica sin límite!</span>
                        </div>
                    )}
                    {/* Banner bank10 — solo visible para usuarios sin cuenta */}
                    {selectedBank === 'bank10' && !(bank10Unlocked || guia2026Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center text-sm space-y-2">
                            <span className="text-purple-400 font-semibold block">
                                🔒 Banco 10 — Guía IPN/UNAM 2026
                            </span>
                            <span className="text-slate-400 text-xs block">
                                Regístrate gratis para acceder a todas las preguntas de este banco sin costo.
                            </span>
                            {onNavigateToGuias && (
                                <button
                                    onClick={onNavigateToGuias}
                                    className="mt-1 px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    ✨ Crear cuenta gratis
                                </button>
                            )}
                        </div>
                    )}
                    {selectedBank === 'bank10' && (bank10Unlocked || guia2026Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-sm">
                            <span className="text-green-400 font-semibold">
                                ✅ Incluido en tu paquete — ¡Practica sin límite!
                            </span>
                        </div>
                    )}
                    {/* Banner bank11 — preview */}
                    {selectedBank === 'bank11' && !(bank11Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-sm space-y-2">
                            <span className="text-amber-400 font-semibold block">🆓 Prueba 10 preguntas gratis ahora mismo</span>
                            <span className="text-slate-400 text-xs block">Desbloquea el banco completo con un pago único de 50 tokens — acceso de por vida</span>
                            {onRedeemUnlock && isLoggedIn && userTokens >= 50 && (
                                <button
                                    onClick={() => onRedeemUnlock('bank11_unlocked', 50, { bank11_unlocked: true })}
                                    className="mt-1 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    🔓 Desbloquear — 50 tokens
                                </button>
                            )}
                        </div>
                    )}
                    {selectedBank === 'bank11' && (bank11Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-sm">
                            <span className="text-green-400 font-semibold">✅ Banco desbloqueado — ¡Practica sin límite!</span>
                        </div>
                    )}

                    {/* Banco 12 */}
                    {(() => {
                        const b12Unlocked = bank12Unlocked || paqueteCompleto;
                        return (
                            <button
                                onClick={() => onSelectBank('bank12')}
                                className={cn(
                                    "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                    selectedBank === 'bank12'
                                        ? b12Unlocked ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                        : b12Unlocked
                                        ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                        : "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                                )}
                            >
                                📋 Banco 12 — Conocimientos Generales
                                {b12Unlocked ? (
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                        ✅ INCLUIDO
                                    </span>
                                ) : (
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-amber-500/10 text-amber-400 border-amber-500/30">
                                        🆓 10 gratis · 🔒 50 tokens
                                    </span>
                                )}
                            </button>
                        );
                    })()}
                    {/* Banner bank12 */}
                    {selectedBank === 'bank12' && !(bank12Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-sm space-y-2">
                            <span className="text-amber-400 font-semibold block">🆓 Prueba 10 preguntas gratis ahora mismo</span>
                            <span className="text-slate-400 text-xs block">Desbloquea el banco completo con un pago único de 50 tokens — acceso de por vida</span>
                            {onRedeemUnlock && isLoggedIn && userTokens >= 50 && (
                                <button
                                    onClick={() => onRedeemUnlock('bank12_unlocked', 50, { bank12_unlocked: true })}
                                    className="mt-1 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    🔓 Desbloquear — 50 tokens
                                </button>
                            )}
                        </div>
                    )}
                    {selectedBank === 'bank12' && (bank12Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-sm">
                            <span className="text-green-400 font-semibold">✅ Banco desbloqueado — ¡Practica sin límite!</span>
                        </div>
                    )}

                    {/* Banco 13 */}
                    {(() => {
                        const b13Unlocked = bank13Unlocked || paqueteCompleto;
                        return (
                            <button
                                onClick={() => onSelectBank('bank13')}
                                className={cn(
                                    "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                    selectedBank === 'bank13'
                                        ? b13Unlocked ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                        : b13Unlocked
                                        ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                        : "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                                )}
                            >
                                📋 Banco 13 — 500 Preguntas ECOEMS
                                {b13Unlocked ? (
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                        ✅ INCLUIDO
                                    </span>
                                ) : (
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-amber-500/10 text-amber-400 border-amber-500/30">
                                        🆓 10 gratis · 🔒 50 tokens
                                    </span>
                                )}
                            </button>
                        );
                    })()}
                    {/* Banner bank13 */}
                    {selectedBank === 'bank13' && !(bank13Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-sm space-y-2">
                            <span className="text-amber-400 font-semibold block">🆓 Prueba 10 preguntas gratis ahora mismo</span>
                            <span className="text-slate-400 text-xs block">Desbloquea el banco completo con un pago único de 50 tokens — acceso de por vida</span>
                            {onRedeemUnlock && isLoggedIn && userTokens >= 50 && (
                                <button
                                    onClick={() => onRedeemUnlock('bank13_unlocked', 50, { bank13_unlocked: true })}
                                    className="mt-1 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    🔓 Desbloquear — 50 tokens
                                </button>
                            )}
                        </div>
                    )}
                    {selectedBank === 'bank13' && (bank13Unlocked || paqueteCompleto) && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-sm">
                            <span className="text-green-400 font-semibold">✅ Banco desbloqueado — ¡Practica sin límite!</span>
                        </div>
                    )}

                    {['bank6', 'bank7'].includes(selectedBank) && !isLoggedIn && (
                        <div className="mt-3 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl text-center space-y-2">
                            <p className="text-violet-300 font-semibold text-sm">
                                🎁 ¡Regístrate gratis y accede a las Guías UNAM 2021 y 2022!
                            </p>
                            <button
                                onClick={onNavigateToGuias}
                                className="text-xs font-black uppercase tracking-wider text-violet-400 hover:text-violet-300 underline"
                            >
                                Crear cuenta gratis →
                            </button>
                        </div>
                    )}
                    {['bank6', 'bank7'].includes(selectedBank) && isLoggedIn && (
                        <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-sm">
                            <span className="text-emerald-400 font-semibold">
                                🎁 Acceso gratuito incluido con tu cuenta — ¡Practica sin límite!
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Simulador Mixto ── */}
                <div className={cn(
                    "border-2 rounded-2xl p-5 transition-all text-left",
                    selectedBank === 'mixto'
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-purple-500/30 bg-white/[0.02] hover:bg-purple-500/5"
                )}>
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-black text-white text-base flex items-center gap-2">
                                <Shuffle className="w-4 h-4 text-purple-400 inline" />
                                Simulador Mixto
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Mezcla preguntas de todos tus bancos desbloqueados con distribución oficial ECOEMS
                            </p>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-full font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 whitespace-nowrap shrink-0">
                            {bancosActivosCount} bancos · {totalPreguntasMixto.toLocaleString()} reactivos
                        </span>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">¿Cuántas preguntas?</p>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                        {([20, 50, 128] as const).map(cantidad => (
                            <button
                                key={String(cantidad)}
                                onClick={() => { setShowCustom(false); onSetMixtoCount?.(cantidad); }}
                                className={cn(
                                    "py-2 rounded-xl border-2 font-black text-xs transition-all",
                                    mixtoCount === cantidad && !showCustom
                                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                        : "border-white/10 text-slate-400 hover:border-purple-500/40 hover:text-purple-300"
                                )}
                            >
                                {cantidad}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                setShowCustom(true);
                                const n = Math.max(10, Math.min(200, parseInt(customInput) || 50));
                                setCustomInput(String(n));
                                onSetMixtoCount?.(n);
                            }}
                            className={cn(
                                "py-2 rounded-xl border-2 font-black text-xs transition-all",
                                showCustom
                                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                                    : "border-white/10 text-slate-400 hover:border-purple-500/40 hover:text-purple-300"
                            )}
                        >
                            ✏️ Personalizado
                        </button>
                    </div>
                    {showCustom && (
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <input
                                type="number"
                                min={10}
                                max={200}
                                value={customInput}
                                onChange={e => setCustomInput(e.target.value)}
                                onBlur={() => {
                                    const n = Math.max(10, Math.min(200, parseInt(customInput) || 50));
                                    setCustomInput(String(n));
                                    onSetMixtoCount?.(n);
                                }}
                                className="w-24 px-2 py-1.5 rounded-xl text-xs font-black text-center outline-none"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(168,85,247,0.4)', color: 'white' }}
                                placeholder="50"
                                autoFocus
                            />
                            <span className="text-[10px] text-slate-500">reactivos (10–200)</span>
                        </div>
                    )}

                    {/* Distribución por materia */}
                    {distribucionPreview.length > 0 && (
                        <div className="mb-4 rounded-xl p-3 space-y-2" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">
                                Tu simulador mixto tendrá:
                            </p>
                            {([
                                { emoji: '📐', label: 'Matemáticas', areas: ['Habilidad Matemática', 'Matemáticas'] },
                                { emoji: '📝', label: 'Verbal / Español', areas: ['Habilidad Verbal', 'Español'] },
                                { emoji: '🧪', label: 'Ciencias', areas: ['Biología', 'Física', 'Química'] },
                                { emoji: '🌎', label: 'Sociales', areas: ['Historia', 'Geografía', 'Formación Cívica y Ética'] },
                            ] as const).map(grupo => {
                                const items = grupo.areas
                                    .map(area => ({ area, count: distribucionPreview.find(d => d.area === area)?.count ?? 0 }))
                                    .filter(i => i.count > 0);
                                const total = items.reduce((s, i) => s + i.count, 0);
                                if (total === 0) return null;
                                return (
                                    <div key={grupo.label} className="flex items-baseline justify-between gap-2">
                                        <div>
                                            <span className="text-white font-black text-[11px]">{grupo.emoji} {grupo.label}</span>
                                            {items.length > 1 && (
                                                <span className="text-slate-500 text-[9px] ml-1.5">({items.map(i => i.count).join(' + ')})</span>
                                            )}
                                        </div>
                                        <span className="font-black text-purple-300 text-[11px] shrink-0">{total}</span>
                                    </div>
                                );
                            })}
                            <p className="text-[10px] text-slate-500 pt-1 border-t border-white/10">
                                Total: <span className="font-black text-white">
                                    {distribucionPreview.reduce((s, i) => s + i.count, 0)}
                                </span> preguntas
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => onStartMixto?.()}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 rounded-xl font-black text-sm hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Shuffle className="w-4 h-4" />
                        Iniciar Simulador Mixto
                    </button>
                </div>

                {/* Filter by subject */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filtrar por materia</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {AREA_FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => onSelectArea(f.value)}
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
                            onClick={() => onSelectEscuela(null)}
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
                                    onClick={() => onSelectEscuela(e)}
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
                                    onClick={() => onSelectEscuela(e)}
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

                {/* Progress Panel Slot */}
                {children}

                {/* Mode info cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                        <Clock className="h-5 w-5 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Examen Completo</span>
                        <span className="text-sm font-bold text-white">⏱️ {tiempoFull} · {fullModeCount} Reactivos</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-400" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Práctica Rápida</span>
                        <span className="text-sm font-bold text-white">⏱️ {tiempoPractica} · {practiceModeCount} Reactivos</span>
                    </div>
                </div>

                {/* Mode buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                        onClick={() => onStartExam('full')}
                        className="w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 group"
                    >
                        <Brain className="mr-2 h-5 w-5" />
                        Examen Completo
                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        onClick={() => onStartExam('practice')}
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
};
