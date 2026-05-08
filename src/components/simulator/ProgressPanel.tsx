import React from "react";
import { BarChart3, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Escuela } from "@/data/escuelas";

const AREA_EMOJI: Record<string, string> = {
    'Matemáticas': '📐',
    'Pensamiento Matemático': '📐',
    'Pensamiento Analítico': '🧩',
    'Estructura de la Lengua': '✍️',
    'Comprensión Lectora': '📖',
    'Inglés': '🌍',
    'Física': '⚛️',
    'Química': '🧪',
    'Biología': '🌿',
    'Historia': '📜',
    'Geografía': '🗺️',
    'Español': '📚',
    'Formación Cívica y Ética': '⚖️',
    'Habilidades': '🧠'
};

interface ProgressPanelProps {
    userId: string | null;
    onNavigateToAuth: () => void;
    showCharts: boolean;
    setShowCharts: (v: boolean) => void;
    chartData: Array<{ fecha: string; porcentaje: number; modo: string }> | null;
    chartsLoading: boolean;
    rankingPuntaje: any[] | null;
    rankingActivos: any[] | null;
    rankingPorArea?: any[] | null;
    rankingLoading: boolean;
    fetchChartData: () => void;
    fetchRanking: () => void;
    areaBarData?: Array<{ area: string; correctas: number; incorrectas: number }>;
    selectedEscuela?: Escuela | null;
    myPercentage?: number;
    targetPercentage?: number;
    metaDiff?: number;
    metaSuccess?: boolean;
    metaClose?: boolean;
    formatFecha: (fecha: string) => string;
}

export const ProgressPanel: React.FC<ProgressPanelProps> = ({
    userId, onNavigateToAuth, showCharts, setShowCharts,
    chartData, chartsLoading, rankingPuntaje, rankingActivos, rankingPorArea, rankingLoading,
    fetchChartData, fetchRanking,
    areaBarData, selectedEscuela, myPercentage, targetPercentage,
    metaDiff = 0, metaSuccess, metaClose,
    formatFecha
}) => (
    <div className="space-y-4">
        <button
            type="button"
            onClick={() => {
                if (!showCharts) { setShowCharts(true); fetchChartData(); fetchRanking(); }
                else { setShowCharts(false); }
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-900/50 border border-white/10 hover:bg-white/5 text-white font-black py-4 px-6 rounded-2xl transition-all text-sm uppercase tracking-widest"
        >
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            {showCharts ? "Ocultar Progreso" : "📊 Ver mi Progreso"}
        </button>

        {showCharts && (
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 space-y-10">
                {!userId ? (
                    <div className="p-6 bg-violet-500/10 border border-violet-500/30 rounded-2xl text-center">
                        <p className="text-2xl mb-2">🏆</p>
                        <p className="text-white font-bold text-lg">¿Quieres ver tu posición en el ranking?</p>
                        <p className="text-slate-400 text-sm mt-1 mb-4">
                            Regístrate gratis para guardar tu progreso, ver tus gráficas y competir con otros estudiantes.
                        </p>
                        <button type="button" onClick={onNavigateToAuth}
                            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
                            Crear cuenta gratis →
                        </button>
                    </div>
                ) : chartsLoading ? (
                    <div className="text-center py-8 text-slate-500 text-sm animate-pulse">Cargando historial…</div>
                ) : (
                    <>
                        {/* Sección 1 — Historial */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">📈 Historial de Puntajes</h4>
                            {(!chartData || chartData.length === 0) ? (
                                <p className="text-sm text-slate-600 text-center py-4">
                                    Es tu primer simulacro guardado — ¡completa más para ver tu progreso!
                                </p>
                            ) : (
                                <div className="flex flex-wrap items-end gap-2 justify-center py-2">
                                    {chartData.map((item, i) => {
                                        const prev = chartData[i - 1];
                                        const diff = prev ? item.porcentaje - prev.porcentaje : null;
                                        const isLatest = i === chartData.length - 1;
                                        return (
                                            <React.Fragment key={i}>
                                                {i > 0 && (
                                                    <span className={cn("text-lg font-black mb-4",
                                                        diff! > 0 ? "text-emerald-400" : diff! < 0 ? "text-red-400" : "text-slate-500")}>
                                                        {diff! > 0 ? "↗" : diff! < 0 ? "↘" : "→"}
                                                    </span>
                                                )}
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 transition-all",
                                                        isLatest ? "bg-violet-600/30 border-violet-400 scale-110" : "bg-slate-800 border-white/10"
                                                    )}>
                                                        <span className={cn("text-sm font-black leading-none",
                                                            isLatest ? "text-violet-200" : "text-slate-300")}>
                                                            {item.porcentaje}%
                                                        </span>
                                                        {diff !== null && (
                                                            <span className={cn("text-[10px] font-bold mt-0.5",
                                                                diff > 0 ? "text-emerald-400" : diff < 0 ? "text-red-400" : "text-slate-500")}>
                                                                {diff > 0 ? `+${diff}` : diff}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[9px] text-slate-500 text-center leading-tight">{formatFecha(item.fecha)}</span>
                                                    <span className="text-[9px] text-slate-600 text-center leading-tight">
                                                        {item.modo === 'full' ? '📝 Examen completo' : '⚡ Práctica rápida'}
                                                    </span>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Sección 2 — Materias (solo en resultados) */}
                        {areaBarData && areaBarData.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">📊 Aciertos por Materia — Este Simulacro</h4>
                                <div className="space-y-3">
                                    {areaBarData.map(item => {
                                        const total = item.correctas + item.incorrectas;
                                        const pct = total > 0 ? Math.round((item.correctas / total) * 100) : 0;
                                        const barColor = pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
                                        const textColor = pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';
                                        const bgShade = pct >= 70 ? 'bg-emerald-500/10' : pct >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10';
                                        return (
                                            <div key={item.area} className={cn("space-y-2 p-4 rounded-2xl border border-white/5 shadow-inner", bgShade)}>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                                                        {AREA_EMOJI[item.area] ?? '📖'} {item.area}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className={cn("text-xs font-black px-2 py-0.5 rounded-lg bg-black/20", textColor)}>{pct}%</span>
                                                        <span className={cn("text-base font-black tabular-nums", textColor)}>{item.correctas}/{total}</span>
                                                    </div>
                                                </div>
                                                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={cn("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Sección 3 — Puntaje vs meta (solo en resultados) */}
                        {selectedEscuela && myPercentage !== undefined && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">🎯 Tu Puntaje vs Meta</h4>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-300 font-bold">Tu puntaje</span>
                                            <span className="text-sm font-black text-violet-400">{myPercentage}%</span>
                                        </div>
                                        <div className="h-5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-600 rounded-full transition-all duration-700" style={{ width: `${myPercentage}%` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-300 font-bold">Meta: {selectedEscuela.nombre}</span>
                                            <span className="text-sm font-black text-amber-400">{targetPercentage}%</span>
                                        </div>
                                        <div className="h-5 bg-white/5 rounded-full overflow-hidden border border-amber-500/30 border-dashed">
                                            <div className="h-full bg-amber-500/50 rounded-full transition-all duration-700" style={{ width: `${targetPercentage}%` }} />
                                        </div>
                                    </div>
                                    <div className={cn("p-4 rounded-2xl text-center text-sm font-bold",
                                        metaSuccess ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : metaClose ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                            : "bg-red-500/10 text-red-400 border border-red-500/20")}>
                                        {metaSuccess ? `¡Lo lograste! Superas la meta por ${Math.abs(metaDiff)}% 🎉`
                                            : metaClose ? `¡Casi! Te faltan solo ${metaDiff}% 💪`
                                            : `Necesitas ${metaDiff}% más para llegar a tu meta 📚`}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rankings */}
                        <div className="border-t border-white/10 pt-8 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">🏆 Ranking de Puntaje — Esta Semana</h4>
                                {rankingLoading ? (
                                    <div className="text-center py-6 text-slate-500 text-sm animate-pulse">Cargando ranking…</div>
                                ) : !rankingPuntaje || rankingPuntaje.length === 0 ? (
                                    <p className="text-sm text-slate-600 text-center py-4">Sé el primero en aparecer en el ranking esta semana 🚀</p>
                                ) : (() => {
                                    const maxPct = rankingPuntaje[0]?.porcentaje ?? 100;
                                    return (
                                        <div className="space-y-2">
                                            {rankingPuntaje.map((r: any, i: number) => {
                                                const isMe = r.user_id === userId;
                                                const medalStr = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                                                return (
                                                    <div key={`rank-${r.user_id}-${i}`} className={cn("p-3 rounded-2xl border",
                                                        isMe ? "bg-violet-600/15 border-violet-500/40" : "bg-white/[0.03] border-white/5")}>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg w-7 shrink-0 text-center">{medalStr}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className={cn("text-sm font-bold truncate", isMe ? "text-violet-300" : "text-slate-200")}>
                                                                        {r.user_name || 'Anónimo'}
                                                                        {isMe && <span className="ml-2 text-[10px] text-violet-400 font-black">← Tú</span>}
                                                                    </span>
                                                                    {r.area && r.area !== 'all' && (
                                                                        <span className="block text-[9px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                                                                            🎯 {r.area}
                                                                        </span>
                                                                    )}
                                                                    <div className="flex flex-col items-end shrink-0 ml-2">
                                                                        <span className={cn("text-sm font-black", isMe ? "text-violet-300" : "text-slate-200")}>{r.porcentaje}%</span>
                                                                        <span className="text-[9px] text-slate-500 font-bold">📝 {r.aciertos}/{r.total_preguntas}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
                                                                    <div className={cn("h-full rounded-full transition-all duration-700",
                                                                        isMe ? "bg-violet-500" : "bg-slate-700")} 
                                                                        style={{ width: `${Math.round((r.porcentaje / maxPct) * 100)}%` }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Ranking por Materia */}
                            {rankingPorArea && rankingPorArea.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 whitespace-nowrap">👑 Maestros de la Materia</h4>
                                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {rankingPorArea.map((r, i) => (
                                            <div key={`area-rank-${i}`} className="p-4 bg-white/[0.03] border border-indigo-500/10 rounded-2xl flex items-center justify-between group hover:bg-indigo-500/5 transition-all relative overflow-hidden">
                                                <div className="absolute -top-1 -right-1 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <Trophy className="h-12 w-12 text-indigo-400" />
                                                </div>
                                                <div className="flex items-center gap-3 relative z-10">
                                                    <span className="text-xl">{AREA_EMOJI[r.area] || '📖'}</span>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{r.area}</p>
                                                        <p className="text-sm font-bold text-white truncate max-w-[120px] flex items-center gap-1.5">
                                                            {r.user_name}
                                                            <Trophy className="h-3 w-3 text-amber-500" />
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right relative z-10">
                                                    <p className="text-xs font-black text-indigo-400">{r.porcentaje}%</p>
                                                    <p className="text-[9px] text-slate-600 font-bold">🎯 {r.aciertos} aciertos</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        )}
    </div>
);
