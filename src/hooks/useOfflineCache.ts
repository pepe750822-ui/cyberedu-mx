import { useState, useEffect, useCallback } from "react";

/**
 * Offline Cache Hook
 * Manages caching of viewed content for offline access using the Service Worker.
 */

const CACHE_LOG_KEY = "offline_cached_items";

interface CacheInfo {
    url: string;
    cachedAt: string;
    type: "video" | "quiz" | "material" | "page";
    label: string;
}

export function useOfflineCache() {
    const [cachedItems, setCachedItems] = useState<CacheInfo[]>(() => {
        try {
            const stored = localStorage.getItem(CACHE_LOG_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [cacheCount, setCacheCount] = useState(0);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(CACHE_LOG_KEY, JSON.stringify(cachedItems));
    }, [cachedItems]);

    // Get cache size from SW
    useEffect(() => {
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            const channel = new MessageChannel();
            channel.port1.onmessage = (event) => {
                if (event.data && typeof event.data.count === "number") {
                    setCacheCount(event.data.count);
                }
            };
            navigator.serviceWorker.controller.postMessage(
                { type: "GET_CACHE_SIZE" },
                [channel.port2]
            );
        }
    }, [cachedItems]);

    // Cache URLs for offline access
    const cacheForOffline = useCallback(
        (urls: string[], meta: { type: CacheInfo["type"]; label: string }) => {
            if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) return;

            const validUrls = urls.filter((u) => u && u.startsWith("/"));

            navigator.serviceWorker.controller.postMessage({
                type: "CACHE_VIEWED_CONTENT",
                urls: validUrls,
            });

            // Track in our local log
            const newItems: CacheInfo[] = validUrls.map((url) => ({
                url,
                cachedAt: new Date().toISOString(),
                type: meta.type,
                label: meta.label,
            }));

            setCachedItems((prev) => {
                const existing = new Set(prev.map((i) => i.url));
                const unique = newItems.filter((i) => !existing.has(i.url));
                return [...prev, ...unique];
            });
        },
        []
    );

    // Cache a quiz page for offline
    const cacheQuiz = useCallback(
        (quizUrl: string, quizLabel: string) => {
            cacheForOffline([quizUrl], { type: "quiz", label: quizLabel });
        },
        [cacheForOffline]
    );

    // Cache a video's material page
    const cacheMaterial = useCallback(
        (materialUrl: string, materialLabel: string) => {
            cacheForOffline([materialUrl], { type: "material", label: materialLabel });
        },
        [cacheForOffline]
    );

    // Auto-cache current page on view
    const cacheCurrentPage = useCallback(() => {
        const url = window.location.pathname;
        cacheForOffline([url], { type: "page", label: document.title });
    }, [cacheForOffline]);

    // Clear all offline cache
    const clearOfflineCache = useCallback(() => {
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: "CLEAR_OFFLINE_CACHE",
            });
        }
        setCachedItems([]);
        setCacheCount(0);
    }, []);

    // Check if a URL is cached
    const isCached = useCallback(
        (url: string) => {
            return cachedItems.some((item) => item.url === url);
        },
        [cachedItems]
    );

    return {
        cachedItems,
        cacheCount,
        cacheForOffline,
        cacheQuiz,
        cacheMaterial,
        cacheCurrentPage,
        clearOfflineCache,
        isCached,
    };
}
