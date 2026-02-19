import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Download, X, Smartphone, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PWA Install Banner
 * Shows a beautiful floating banner prompting the user to install the app.
 * Auto-dismisses after install or user dismissal.
 */

const DISMISS_KEY = "pwa_install_dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const PWAInstallBanner = () => {
    const { isInstallable, isInstalled, installApp } = usePWA();
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    useEffect(() => {
        if (isInstalled) {
            setIsVisible(false);
            return;
        }

        if (!isInstallable) return;

        // Check if user has recently dismissed
        const dismissedAt = localStorage.getItem(DISMISS_KEY);
        if (dismissedAt) {
            const elapsed = Date.now() - parseInt(dismissedAt);
            if (elapsed < DISMISS_DURATION) return;
        }

        // Show after a 3 second delay
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }, [isInstallable, isInstalled]);

    const handleInstall = async () => {
        setIsInstalling(true);
        const accepted = await installApp();
        setIsInstalling(false);
        if (accepted) {
            setShowSuccessAnimation(true);
            setTimeout(() => setIsVisible(false), 2000);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-6 md:bottom-6 md:max-w-sm",
                "animate-in slide-in-from-bottom-8 fade-in duration-700"
            )}
        >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/20 border border-white/10">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 opacity-95" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020M40%2040V20L20%2040%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

                <div className="relative p-5">
                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Cerrar"
                    >
                        <X className="h-3.5 w-3.5 text-white/70" />
                    </button>

                    {showSuccessAnimation ? (
                        <div className="flex flex-col items-center py-4 gap-3 animate-in zoom-in duration-500">
                            <div className="p-3 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                            </div>
                            <p className="text-white font-bold text-sm">¡App instalada con éxito!</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 shadow-inner">
                                    <Smartphone className="h-7 w-7 text-white" />
                                </div>
                                <div className="flex-1 pr-6">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-yellow-200">
                                            Nueva app disponible
                                        </span>
                                    </div>
                                    <h3 className="text-white font-black text-sm leading-tight mb-1">
                                        Instala CyberEdu MX
                                    </h3>
                                    <p className="text-white/70 text-xs leading-relaxed">
                                        Acceso rápido, modo offline y notificaciones de tu racha. ¡Sin ocupar espacio!
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={handleInstall}
                                    disabled={isInstalling}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
                                        "bg-white text-indigo-700 font-black text-xs uppercase tracking-wider",
                                        "hover:bg-white/90 active:scale-[0.98] transition-all duration-200",
                                        "shadow-lg shadow-black/20",
                                        "disabled:opacity-70 disabled:cursor-wait"
                                    )}
                                >
                                    {isInstalling ? (
                                        <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4" />
                                    )}
                                    {isInstalling ? "Instalando..." : "Instalar App"}
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 font-bold text-[10px] uppercase tracking-wider transition-all border border-white/10"
                                >
                                    Ahora no
                                </button>
                            </div>

                            {/* Features row */}
                            <div className="mt-3 flex items-center justify-center gap-4 text-[9px] font-bold text-white/50 uppercase tracking-widest">
                                <span>📴 Offline</span>
                                <span className="text-white/20">•</span>
                                <span>🔔 Notificaciones</span>
                                <span className="text-white/20">•</span>
                                <span>⚡ Rápida</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PWAInstallBanner;
