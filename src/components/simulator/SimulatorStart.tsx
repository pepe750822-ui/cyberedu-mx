import React from "react";
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

type BankSelection = 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'bank5' | 'bank6' | 'bank7' | 'bank8' | 'bank9' | 'mixed';
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
    bank5Unlocked?: boolean;
    bank6Unlocked?: boolean;
    bank7Unlocked?: boolean;
    bank8Unlocked?: boolean;
    bank9Unlocked?: boolean;
    isLoggedIn?: boolean;
    onNavigateToGuias?: () => void;
    children?: React.ReactNode; // ProgressPanel
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
    bank5Unlocked = false,
    bank6Unlocked = false,
    bank7Unlocked = false,
    bank8Unlocked = false,
    bank9Unlocked = false,
    isLoggedIn = false,
    onNavigateToGuias,
    children
}) => {
    const hasTokens = userTokens >= 50;
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
                        {/* Bank 5 — Premium (pago único) */}
                        <button
                            onClick={() => onSelectBank('bank5')}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                selectedBank === 'bank5'
                                    ? bank5Unlocked ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                    : bank5Unlocked
                                    ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                    : hasTokens
                                    ? "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                                    : "bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 opacity-60"
                            )}
                        >
                            {bank5Unlocked ? '📚' : hasTokens ? '📚' : <Lock className="w-3 h-3 shrink-0" />}
                            Banco 5 — Guías UNAM 2024-25
                            {bank5Unlocked ? (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                    ✅ DESBLOQUEADO
                                </span>
                            ) : (
                                <>
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-white/5 text-slate-500 border-white/10">
                                        🔒 Pago único
                                    </span>
                                    <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full border bg-white/5 text-slate-600 border-white/10">
                                        <Coins className="w-2.5 h-2.5" />
                                        50
                                    </span>
                                </>
                            )}
                        </button>
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
                        {/* Bank 8 — Premium (pago único) */}
                        <button
                            onClick={() => onSelectBank('bank8')}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                selectedBank === 'bank8'
                                    ? bank8Unlocked ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                    : bank8Unlocked
                                    ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                    : hasTokens
                                    ? "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                                    : "bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 opacity-60"
                            )}
                        >
                            {bank8Unlocked ? '📚' : hasTokens ? '📚' : <Lock className="w-3 h-3 shrink-0" />}
                            Banco 8 — Guía UNAM 2023
                            {bank8Unlocked ? (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                    ✅ DESBLOQUEADO
                                </span>
                            ) : (
                                <>
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-white/5 text-slate-500 border-white/10">
                                        🔒 Pago único
                                    </span>
                                    <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full border bg-white/5 text-slate-600 border-white/10">
                                        <Coins className="w-2.5 h-2.5" />
                                        50
                                    </span>
                                </>
                            )}
                        </button>
                        {/* Bank 9 — Premium (pago único) */}
                        <button
                            onClick={() => onSelectBank('bank9')}
                            className={cn(
                                "relative px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5",
                                selectedBank === 'bank9'
                                    ? bank9Unlocked ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-500 text-black border-amber-500"
                                    : bank9Unlocked
                                    ? "bg-white/5 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                    : hasTokens
                                    ? "bg-white/5 text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                                    : "bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 opacity-60"
                            )}
                        >
                            {bank9Unlocked ? '📚' : hasTokens ? '📚' : <Lock className="w-3 h-3 shrink-0" />}
                            Banco 9 — Guía UNAM 2024
                            {bank9Unlocked ? (
                                <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                                    ✅ DESBLOQUEADO
                                </span>
                            ) : (
                                <>
                                    <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-black bg-white/5 text-slate-500 border-white/10">
                                        🔒 Pago único
                                    </span>
                                    <span className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full border bg-white/5 text-slate-600 border-white/10">
                                        <Coins className="w-2.5 h-2.5" />
                                        50
                                    </span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Banner banks */}
                    {['bank5', 'bank8', 'bank9'].includes(selectedBank) && (
                        (selectedBank === 'bank5' && !bank5Unlocked) ||
                        (selectedBank === 'bank8' && !bank8Unlocked) ||
                        (selectedBank === 'bank9' && !bank9Unlocked)
                    ) && (
                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-center text-sm">
                            <span className="text-yellow-400 font-semibold">
                                ✨ Pago único de 50 tokens — Acceso de por vida a este Banco Oficial
                            </span>
                        </div>
                    )}
                    {['bank5', 'bank8', 'bank9'].includes(selectedBank) && (
                        (selectedBank === 'bank5' && bank5Unlocked) ||
                        (selectedBank === 'bank8' && bank8Unlocked) ||
                        (selectedBank === 'bank9' && bank9Unlocked)
                    ) && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-sm">
                            <span className="text-green-400 font-semibold">
                                ✅ Ya tienes acceso — ¡Practica con este Banco Oficial sin límite!
                            </span>
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
