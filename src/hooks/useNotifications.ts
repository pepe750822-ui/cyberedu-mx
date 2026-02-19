import { useState, useEffect, useCallback } from "react";

/**
 * Push Notifications Hook
 * Handles notification permission, streak reminders, and local scheduling.
 */

const STREAK_REMINDER_TIMES = [
    { hour: 8, minute: 0, label: "mañana" },
    { hour: 20, minute: 0, label: "noche" },
];

const NOTIFICATION_PREFS_KEY = "notification_preferences";

interface NotificationPrefs {
    enabled: boolean;
    streakReminders: boolean;
    dailyDigest: boolean;
    lastPermissionAsk: string | null;
    reminderHour: number;
}

const DEFAULT_PREFS: NotificationPrefs = {
    enabled: false,
    streakReminders: true,
    dailyDigest: true,
    lastPermissionAsk: null,
    reminderHour: 20,
};

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>(
        typeof Notification !== "undefined" ? Notification.permission : "default"
    );
    const [prefs, setPrefs] = useState<NotificationPrefs>(() => {
        try {
            const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
            return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
        } catch {
            return DEFAULT_PREFS;
        }
    });

    // Save prefs to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
    }, [prefs]);

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (typeof Notification === "undefined") return false;

        if (Notification.permission === "granted") {
            setPermission("granted");
            setPrefs((p) => ({ ...p, enabled: true }));
            return true;
        }

        if (Notification.permission === "denied") {
            setPermission("denied");
            return false;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        setPrefs((p) => ({
            ...p,
            enabled: result === "granted",
            lastPermissionAsk: new Date().toISOString(),
        }));
        return result === "granted";
    }, []);

    // Show local streak notification
    const showStreakNotification = useCallback(
        (streak: number, type: "reminder" | "congrats" | "lost" = "reminder") => {
            if (permission !== "granted") return;

            const messages = {
                reminder: {
                    title: `🔥 ¡${streak} días de racha!`,
                    body: "¡No pierdas tu racha! Estudia al menos un video hoy.",
                    icon: "/icons/icon-192x192.png",
                    tag: "streak-reminder",
                },
                congrats: {
                    title: `🎉 ¡Racha de ${streak} días!`,
                    body: `¡Increíble! Llevas ${streak} días consecutivos estudiando. ¡Sigue así!`,
                    icon: "/icons/icon-192x192.png",
                    tag: "streak-congrats",
                },
                lost: {
                    title: "😢 ¡Tu racha se perdió!",
                    body: "No estudiaste ayer. ¡Empieza una nueva racha ahora!",
                    icon: "/icons/icon-192x192.png",
                    tag: "streak-lost",
                },
            };

            const msg = messages[type];

            if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(msg.title, {
                        body: msg.body,
                        icon: msg.icon,
                        badge: "/icons/icon-72x72.png",
                        vibrate: [200, 100, 200],
                        tag: msg.tag,
                        renotify: true,
                        data: { url: "/" },
                        actions: [
                            { action: "study", title: "📖 Estudiar" },
                            { action: "dismiss", title: "Después" },
                        ],
                    } as NotificationOptions);
                });
            } else {
                // Fallback to basic Notification API
                new Notification(msg.title, {
                    body: msg.body,
                    icon: msg.icon,
                    tag: msg.tag,
                });
            }
        },
        [permission]
    );

    // Schedule streak reminders using timers
    const scheduleStreakReminders = useCallback(() => {
        if (permission !== "granted" || !prefs.streakReminders) return;

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const lastStudyDate = localStorage.getItem("last_study_date");
        const streak = parseInt(localStorage.getItem("study_streak_count") || "0");

        // If already studied today, no reminder needed
        if (lastStudyDate === today) return;

        const reminderHour = prefs.reminderHour;
        const reminderTime = new Date();
        reminderTime.setHours(reminderHour, 0, 0, 0);

        if (now >= reminderTime) {
            // Time has passed, show immediately if not studied
            const lastReminder = localStorage.getItem("last_streak_reminder");
            if (lastReminder !== today) {
                if (streak > 0) {
                    showStreakNotification(streak, "reminder");
                }
                localStorage.setItem("last_streak_reminder", today);
            }
        } else {
            // Schedule for later today
            const msUntil = reminderTime.getTime() - now.getTime();
            setTimeout(() => {
                const todayCheck = new Date().toISOString().split("T")[0];
                const hasStudied = localStorage.getItem("last_study_date") === todayCheck;
                if (!hasStudied && streak > 0) {
                    showStreakNotification(streak, "reminder");
                    localStorage.setItem("last_streak_reminder", todayCheck);
                }
            }, msUntil);
        }
    }, [permission, prefs.streakReminders, prefs.reminderHour, showStreakNotification]);

    // Auto-schedule on mount
    useEffect(() => {
        if (permission === "granted") {
            scheduleStreakReminders();
        }
    }, [permission, scheduleStreakReminders]);

    // Register periodic sync for streak (if supported)
    useEffect(() => {
        if (permission === "granted" && "serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then(async (registration) => {
                if ("periodicSync" in registration) {
                    try {
                        await (registration as any).periodicSync.register("streak-reminder", {
                            minInterval: 12 * 60 * 60 * 1000, // 12 hours
                        });
                    } catch {
                        // Periodic sync not available or permission denied
                    }
                }
            });
        }
    }, [permission]);

    // Update preferences
    const updatePrefs = useCallback((updates: Partial<NotificationPrefs>) => {
        setPrefs((p) => ({ ...p, ...updates }));
    }, []);

    return {
        permission,
        isSupported: typeof Notification !== "undefined",
        prefs,
        requestPermission,
        showStreakNotification,
        scheduleStreakReminders,
        updatePrefs,
    };
}
