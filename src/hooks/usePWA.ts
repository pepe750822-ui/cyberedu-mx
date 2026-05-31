import { useState, useEffect, useCallback, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWA() {
    // useRef avoids stale-closure bug in useCallback — state updates cause
    // installApp to capture an old null value if the component re-renders
    // between the beforeinstallprompt event and the user's click.
    const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
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

        const mq = window.matchMedia("(display-mode: standalone)");
        const handler = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    // Listen for install prompt + installed event
    useEffect(() => {
        const handleBefore = (e: Event) => {
            e.preventDefault();
            deferredPromptRef.current = e as BeforeInstallPromptEvent;
            setIsInstallable(true);
        };
        const handleInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            deferredPromptRef.current = null;
        };

        window.addEventListener("beforeinstallprompt", handleBefore);
        window.addEventListener("appinstalled", handleInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBefore);
            window.removeEventListener("appinstalled", handleInstalled);
        };
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

    // Trigger install — reads from ref so it never captures a stale null.
    // Consume the ref immediately to prevent a double-call if the user
    // taps the button twice before the dialog appears.
    const installApp = useCallback(async () => {
        const prompt = deferredPromptRef.current;
        if (!prompt) return false;
        deferredPromptRef.current = null;
        setIsInstallable(false);
        try {
            await prompt.prompt();
            const { outcome } = await prompt.userChoice;
            return outcome === "accepted";
        } catch {
            return false;
        }
    }, []); // no deps — always reads fresh value from ref

    return {
        isInstallable,
        isInstalled,
        isOnline,
        installApp,
    };
}
