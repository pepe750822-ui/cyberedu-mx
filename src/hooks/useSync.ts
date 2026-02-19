import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Sync Hook
 * Handles automatic synchronization of progress data with the server.
 * Uses Background Sync API when available, falls back to periodic polling.
 */

const SYNC_QUEUE_KEY = "sync_queue";
const LAST_SYNC_KEY = "last_sync_timestamp";
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface SyncItem {
    id: string;
    type: "progress" | "streak" | "quiz_result" | "preferences";
    data: Record<string, unknown>;
    timestamp: number;
    retries: number;
}

export function useSync() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(
        localStorage.getItem(LAST_SYNC_KEY)
    );
    const [pendingCount, setPendingCount] = useState(0);
    const syncTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load pending items count
    useEffect(() => {
        const queue = getSyncQueue();
        setPendingCount(queue.length);
    }, []);

    // Get sync queue from localStorage
    const getSyncQueue = useCallback((): SyncItem[] => {
        try {
            const stored = localStorage.getItem(SYNC_QUEUE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }, []);

    // Save sync queue
    const saveSyncQueue = useCallback((queue: SyncItem[]) => {
        localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
        setPendingCount(queue.length);
    }, []);

    // Add item to sync queue
    const addToSyncQueue = useCallback(
        (type: SyncItem["type"], data: Record<string, unknown>) => {
            const queue = getSyncQueue();
            const item: SyncItem = {
                id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                type,
                data,
                timestamp: Date.now(),
                retries: 0,
            };
            queue.push(item);
            saveSyncQueue(queue);

            // Trigger background sync if available
            if ("serviceWorker" in navigator && "SyncManager" in window) {
                navigator.serviceWorker.ready.then((reg) => {
                    (reg as any).sync.register("sync-progress").catch(() => {
                        // Background sync not allowed, will fallback to polling
                    });
                });
            }
        },
        [getSyncQueue, saveSyncQueue]
    );

    // Process sync queue
    const processQueue = useCallback(async () => {
        if (isSyncing || !navigator.onLine) return;

        const queue = getSyncQueue();
        if (queue.length === 0) return;

        setIsSyncing(true);

        const remaining: SyncItem[] = [];

        for (const item of queue) {
            try {
                // For now, we sync to localStorage as the backend.
                // When Supabase sync is configured, this will POST to an endpoint.
                await syncItemToServer(item);
            } catch {
                if (item.retries < 3) {
                    remaining.push({ ...item, retries: item.retries + 1 });
                }
                // Drop items after 3 retries
            }
        }

        saveSyncQueue(remaining);
        const now = new Date().toISOString();
        localStorage.setItem(LAST_SYNC_KEY, now);
        setLastSyncTime(now);
        setIsSyncing(false);
    }, [isSyncing, getSyncQueue, saveSyncQueue]);

    // Sync a single item to server
    const syncItemToServer = async (item: SyncItem): Promise<void> => {
        // This is the extensibility point — when you add a Supabase sync endpoint,
        // you can POST the item data here.
        // For now, we mark it as synced locally.
        const syncLog: Record<string, string> = JSON.parse(
            localStorage.getItem("sync_log") || "{}"
        );
        syncLog[item.id] = new Date().toISOString();
        localStorage.setItem("sync_log", JSON.stringify(syncLog));
    };

    // Queue current progress for sync
    const syncProgress = useCallback(() => {
        const progressData: Record<string, unknown> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (
                key &&
                (key.startsWith("video-") ||
                    key.startsWith("progreso-") ||
                    key.startsWith("quiz_aprobado_") ||
                    key === "study_streak_count" ||
                    key === "last_study_date")
            ) {
                progressData[key] = localStorage.getItem(key);
            }
        }
        addToSyncQueue("progress", progressData);
    }, [addToSyncQueue]);

    // Sync streak data
    const syncStreak = useCallback(() => {
        addToSyncQueue("streak", {
            streak: localStorage.getItem("study_streak_count"),
            lastDate: localStorage.getItem("last_study_date"),
            timestamp: Date.now(),
        });
    }, [addToSyncQueue]);

    // Listen for SW sync requests
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            const handler = (event: MessageEvent) => {
                if (event.data?.type === "SYNC_REQUESTED") {
                    processQueue();
                }
                if (event.data?.type === "STREAK_SYNC_REQUESTED") {
                    syncStreak();
                }
            };
            navigator.serviceWorker.addEventListener("message", handler);
            return () => navigator.serviceWorker.removeEventListener("message", handler);
        }
    }, [processQueue, syncStreak]);

    // Periodic sync interval (fallback)
    useEffect(() => {
        syncTimerRef.current = setInterval(() => {
            if (navigator.onLine) {
                processQueue();
            }
        }, SYNC_INTERVAL);

        return () => {
            if (syncTimerRef.current) clearInterval(syncTimerRef.current);
        };
    }, [processQueue]);

    // Sync on coming back online
    useEffect(() => {
        const handler = () => {
            setTimeout(() => processQueue(), 2000);
        };
        window.addEventListener("online", handler);
        return () => window.removeEventListener("online", handler);
    }, [processQueue]);

    // Sync on visibility change (app comes back to foreground)
    useEffect(() => {
        const handler = () => {
            if (document.visibilityState === "visible" && navigator.onLine) {
                processQueue();
            }
        };
        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    }, [processQueue]);

    return {
        isSyncing,
        lastSyncTime,
        pendingCount,
        syncProgress,
        syncStreak,
        addToSyncQueue,
        processQueue,
    };
}
