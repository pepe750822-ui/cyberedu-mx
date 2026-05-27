// =============================================================================
// CyberEdu MX — Service Worker v3.1
// Features: Install, Offline Mode, Push Notifications, Background Sync
// Precache: injected by vite-plugin-pwa (self.__WB_MANIFEST)
// =============================================================================

const CACHE_VERSION = 'v3';
const STATIC_CACHE = `cyberedu-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `cyberedu-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `cyberedu-offline-${CACHE_VERSION}`;
const MAX_DYNAMIC_ITEMS = 120;

// Core shell assets cached on install
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/icons/icon-72x72.png',
    '/icons/icon-maskable-192x192.png',
    '/offline.html',
];

// Vite build assets injected automatically by vite-plugin-pwa (deduplicated)
const BUILD_ASSETS = [...new Set(
    (self.__WB_MANIFEST || []).map(entry => entry.url).filter(url => !STATIC_ASSETS.includes(url))
)];

// Offline fallback page
const OFFLINE_FALLBACK = '/offline.html';

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll([...STATIC_ASSETS, ...BUILD_ASSETS]);
        })
    );
    self.skipWaiting();
});

// ─── Activate: clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE];
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => !validCaches.includes(key))
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// ─── Fetch Strategy Router ───────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and cross-origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    // 1) Navigation requests → Network-first with offline fallback
    if (request.mode === 'navigate') {
        event.respondWith(networkFirstWithFallback(request));
        return;
    }

    // 2) Video/media assets → Cache-first for viewed content
    if (url.pathname.match(/\.(mp4|webm|m3u8)$/) || url.pathname.startsWith('/videos/')) {
        event.respondWith(cacheFirstDynamic(request));
        return;
    }

    // 3) Quiz + material complementario pages → Cache for offline
    if (url.pathname.startsWith('/quiz/') || url.pathname.startsWith('/material/')) {
        event.respondWith(networkFirstCache(request, OFFLINE_CACHE));
        return;
    }

    // 4) Static build assets (JS, CSS, images, fonts) → Stale-while-revalidate
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?|ttf|eot)$/) ||
        url.pathname.startsWith('/assets/')
    ) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // 5) API calls → Network-only with timeout
    if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
        event.respondWith(networkOnlyWithTimeout(request, 8000));
        return;
    }

    // Default: network-first
    event.respondWith(networkFirstCache(request, DYNAMIC_CACHE));
});

// ─── Caching Strategies ──────────────────────────────────────────────────────

async function networkFirstWithFallback(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        const offlinePage = await caches.match(OFFLINE_FALLBACK);
        if (offlinePage) return offlinePage;
        return caches.match('/');
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request)
        .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
        })
        .catch(() => cached);
    return cached || fetchPromise;
}

async function cacheFirstDynamic(request) {
    const cache = await caches.open(OFFLINE_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
            await trimCache(OFFLINE_CACHE, MAX_DYNAMIC_ITEMS);
        }
        return response;
    } catch {
        return new Response('Offline — contenido no disponible', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function networkFirstCache(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await caches.match(request);
        return cached || new Response('Offline', { status: 503 });
    }
}

async function networkOnlyWithTimeout(request, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(request, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch {
        clearTimeout(timeoutId);
        return new Response(
            JSON.stringify({ error: 'offline', message: 'Sin conexión a internet' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        await cache.delete(keys[0]);
        return trimCache(cacheName, maxItems);
    }
}

// ─── Offline Content Caching (called from app) ──────────────────────────────
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_VIEWED_CONTENT') {
        const urls = event.data.urls || [];
        event.waitUntil(
            caches.open(OFFLINE_CACHE).then((cache) =>
                Promise.allSettled(
                    urls.map((url) =>
                        fetch(url).then((res) => {
                            if (res.ok) cache.put(url, res.clone());
                        })
                    )
                )
            )
        );
    }

    if (event.data && event.data.type === 'CLEAR_OFFLINE_CACHE') {
        event.waitUntil(caches.delete(OFFLINE_CACHE));
    }

    if (event.data && event.data.type === 'GET_CACHE_SIZE') {
        caches.open(OFFLINE_CACHE).then((cache) =>
            cache.keys().then((keys) => {
                event.ports[0].postMessage({ count: keys.length });
            })
        );
    }

    if (event.data && event.data.type === 'SYNC_PROGRESS') {
        event.waitUntil(syncProgressToServer(event.data.payload));
    }
});

// ─── Background Sync ────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgressFromQueue());
    }
    if (event.tag === 'sync-streak') {
        event.waitUntil(syncStreakData());
    }
});

async function syncProgressFromQueue() {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({ type: 'SYNC_REQUESTED' });
    });
}

async function syncStreakData() {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({ type: 'STREAK_SYNC_REQUESTED' });
    });
}

async function syncProgressToServer(payload) {
    try {
        if (payload && payload.url) {
            await fetch(payload.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload.data)
            });
        }
    } catch {
        console.log('[SW] Sync failed, will retry later');
    }
}

// ─── Push Notifications ──────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
    let data = {
        title: 'CyberEdu MX',
        body: '¡Hora de estudiar! 📚',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'cyberedu-notification'
    };

    if (event.data) {
        try {
            data = { ...data, ...event.data.json() };
        } catch {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/icons/icon-192x192.png',
            badge: data.badge || '/icons/icon-72x72.png',
            vibrate: [200, 100, 200, 100, 200],
            tag: data.tag || 'cyberedu-notification',
            renotify: true,
            data: { url: data.url || '/', dateOfArrival: Date.now() },
            actions: [
                { action: 'study', title: '📖 Estudiar ahora' },
                { action: 'dismiss', title: '⏰ Después' }
            ]
        })
    );
});

// ─── Notification Click ──────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'dismiss') return;
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            const existingClient = clients.find((c) => c.url.includes(self.location.origin));
            if (existingClient) {
                existingClient.navigate(urlToOpen);
                return existingClient.focus();
            }
            return self.clients.openWindow(urlToOpen);
        })
    );
});

// ─── Periodic Background Sync ────────────────────────────────────────────────
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'streak-reminder') {
        event.waitUntil(showStreakReminder());
    }
});

async function showStreakReminder() {
    const clients = await self.clients.matchAll();
    if (clients.length === 0) {
        await self.registration.showNotification('🔥 ¡Tu racha te necesita!', {
            body: 'No pierdas tu racha de estudio. ¡Solo unos minutos bastan!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [100, 50, 100],
            tag: 'streak-reminder',
            data: { url: '/' },
            actions: [
                { action: 'study', title: '🔥 Estudiar' },
                { action: 'dismiss', title: 'Después' }
            ]
        });
    }
}
