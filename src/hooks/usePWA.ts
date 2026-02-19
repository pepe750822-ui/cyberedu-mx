import { useState, useEffect, useCallback } from "react";

/**
 * PWA Install & Detection Hook
 * Handles beforeinstallprompt, detects standalone mode, and triggers install.
 */

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Detect standalone mode (already installed)
    useEffect(() => {
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true ||
            document.referrer.includes("android-app://");
        setIsInstalled(isStandalone);

        // Listen for display-mode changes
        const mq = window.matchMedia("(display-mode: standalone)");
        const handler = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    // Listen for install prompt
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };
        window.addEventListener("beforeinstallprompt", handler);

        // Detect when installed
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        });

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    // Online/Offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Trigger install prompt
    const installApp = useCallback(async () => {
        if (!deferredPrompt) return false;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setIsInstallable(false);
        return outcome === "accepted";
    }, [deferredPrompt]);

    return {
        isInstallable,
        isInstalled,
        isOnline,
        installApp,
    };
}
