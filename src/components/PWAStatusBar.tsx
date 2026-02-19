import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";
import { useSync } from "@/hooks/useSync";
import { useNotifications } from "@/hooks/useNotifications";
import { useOfflineCache } from "@/hooks/useOfflineCache";
import {
    Wifi,
    WifiOff,
    Cloud,
    CloudOff,
    RefreshCw,
    Bell,
    BellOff,
    Download,
    Smartphone,
    CheckCircle,
    AlertCircle,
    ChevronUp,
    ChevronDown,
    Settings2,
    Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PWA Status Bar
 * A floating minibar showing connection status, sync state, and offline cache info.
 * Expandable for more details and notification settings.
 */

const PWAStatusBar = () => {
    const { isOnline, isInstalled } = usePWA();
    const { isSyncing, lastSyncTime, pendingCount, processQueue } = useSync();
    const { permission, requestPermission, prefs, updatePrefs } = useNotifications();
    const { cacheCount, clearOfflineCache } = useOfflineCache();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showOfflineToast, setShowOfflineToast] = useState(false);
    const [prevOnline, setPrevOnline] = useState(isOnline);

    // Show offline toast when connection drops
    useEffect(() => {
        if (prevOnline && !isOnline) {
            setShowOfflineToast(true);
            setTimeout(() => setShowOfflineToast(false), 5000);
        }
        setPrevOnline(isOnline);
    }, [isOnline, prevOnline]);

    const formatLastSync = () => {
        if (!lastSyncTime) return "Nunca";
        const date = new Date(lastSyncTime);
        const diff = Date.now() - date.getTime();
        if (diff < 60000) return "Ahora mismo";
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)}h`;
        return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
    };

    return (
        <>
            {/* Offline Toast */}
            {showOfflineToast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="flex items-center gap-3 px-5 py-3 bg-amber-600/95 backdrop-blur-lg rounded-2xl shadow-2xl shadow-amber-900/30 border border-amber-500/30">
                        <WifiOff className="h-5 w-5 text-white animate-pulse" />
                        <div>
                            <p className="text-white font-bold text-sm">Sin conexión</p>
                            <p className="text-amber-100/80 text-xs">
                                Modo offline activado — tu contenido visto sigue disponible
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Bar (bottom-right) */}
            <div className="fixed bottom-20 right-4 z-[9998] md:bottom-6 md:right-6">
                <div
                    className={cn(
                        "rounded-2xl overflow-hidden transition-all duration-500",
                        "bg-slate-900/95 backdrop-blur-xl border border-white/10",
                        "shadow-2xl shadow-black/30",
                        isExpanded ? "w-72" : "w-auto"
                    )}
                >
                    {/* Main minibar */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-3.5 py-2.5 w-full hover:bg-white/5 transition-all"
                    >
                        {/* Online/Offline indicator */}
                        <div
                            className={cn(
                                "h-2 w-2 rounded-full shrink-0",
                                isOnline
                                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                                    : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"
                            )}
                        />

                        {/* Status icons */}
                        <div className="flex items-center gap-1.5">
                            {isOnline ? (
                                <Wifi className="h-3 w-3 text-emerald-400" />
                            ) : (
                                <WifiOff className="h-3 w-3 text-amber-400" />
                            )}

                            {isSyncing && (
                                <RefreshCw className="h-3 w-3 text-blue-400 animate-spin" />
                            )}

                            {pendingCount > 0 && (
                                <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                                    {pendingCount}
                                </span>
                            )}

                            {cacheCount > 0 && (
                                <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                                    <Download className="h-2.5 w-2.5" />
                                    {cacheCount}
                                </span>
                            )}

                            {isInstalled && (
                                <Smartphone className="h-3 w-3 text-violet-400" />
                            )}
                        </div>

                        <div
                            className={cn(
                                "transition-transform duration-300",
                                isExpanded ? "rotate-180" : ""
                            )}
                        >
                            <ChevronUp className="h-3 w-3 text-slate-500" />
                        </div>
                    </button>

                    {/* Expanded panel */}
                    {isExpanded && (
                        <div className="px-4 pb-4 pt-1 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-white/5">
                            {/* Connection */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isOnline ? (
                                        <Cloud className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                        <CloudOff className="h-4 w-4 text-amber-400" />
                                    )}
                                    <span className="text-xs font-bold text-white">
                                        {isOnline ? "Conectado" : "Sin conexión"}
                                    </span>
                                </div>
                                <span
                                    className={cn(
                                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                                        isOnline
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    )}
                                >
                                    {isOnline ? "Online" : "Offline"}
                                </span>
                            </div>

                            {/* Sync */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <RefreshCw
                                        className={cn("h-4 w-4 text-blue-400", isSyncing && "animate-spin")}
                                    />
                                    <div>
                                        <span className="text-xs font-bold text-white block">Sincronización</span>
                                        <span className="text-[10px] text-slate-400">{formatLastSync()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => processQueue()}
                                    disabled={isSyncing || !isOnline}
                                    className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-30"
                                >
                                    Sync
                                </button>
                            </div>

                            {/* Offline cache */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Download className="h-4 w-4 text-violet-400" />
                                    <div>
                                        <span className="text-xs font-bold text-white block">Contenido offline</span>
                                        <span className="text-[10px] text-slate-400">
                                            {cacheCount} elementos guardados
                                        </span>
                                    </div>
                                </div>
                                {cacheCount > 0 && (
                                    <button
                                        onClick={clearOfflineCache}
                                        className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                )}
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {permission === "granted" ? (
                                        <Bell className="h-4 w-4 text-yellow-400" />
                                    ) : (
                                        <BellOff className="h-4 w-4 text-slate-500" />
                                    )}
                                    <span className="text-xs font-bold text-white">Notificaciones</span>
                                </div>
                                {permission === "default" && (
                                    <button
                                        onClick={requestPermission}
                                        className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                                    >
                                        Activar
                                    </button>
                                )}
                                {permission === "granted" && (
                                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                                )}
                                {permission === "denied" && (
                                    <span className="text-[9px] text-red-400 font-bold">Bloqueadas</span>
                                )}
                            </div>

                            {/* Streak notifications toggle */}
                            {permission === "granted" && (
                                <div className="flex items-center justify-between pl-6">
                                    <span className="text-[10px] text-slate-400">Recordatorios de racha</span>
                                    <button
                                        onClick={() => updatePrefs({ streakReminders: !prefs.streakReminders })}
                                        className={cn(
                                            "relative w-8 h-4 rounded-full transition-colors",
                                            prefs.streakReminders
                                                ? "bg-violet-500"
                                                : "bg-slate-700"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform",
                                                prefs.streakReminders ? "translate-x-4" : "translate-x-0.5"
                                            )}
                                        />
                                    </button>
                                </div>
                            )}

                            {/* App install status */}
                            <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                                <Smartphone className="h-3.5 w-3.5 text-slate-500" />
                                <span className="text-[10px] text-slate-500 font-medium">
                                    {isInstalled ? "App instalada ✓" : "Versión web"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PWAStatusBar;
