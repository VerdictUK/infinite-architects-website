/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INFINITE ARCHITECTS - Premium Service Worker
 * Full PWA Support: Offline, Caching, Background Sync, Push Ready
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CACHE_VERSION = 'ia-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Critical resources to pre-cache immediately
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/InfiniteArchitectsKindle20260103.jpg',
    '/site.webmanifest',
    '/favicon.ico',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/bbc-willow.jpg',
    '/author-photo.jpg',
    '/london-night.mp4',
    '/images/pillar-1.webp',
    '/images/pillar-2.webp',
    '/images/pillar-3.webp',
    '/images/hrih-hero.webp',
    '/images/love-core-ai.webp',
    '/images/art-eden-greenhouse.webp',
    '/images/hero-background.webp'
];

// External resources to cache on first use
const EXTERNAL_CACHE_URLS = [
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap',
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Mono:wght@400&family=JetBrains+Mono:wght@400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// ═══════════════════════════════════════════════════════════════════════════
// INSTALL EVENT - Pre-cache critical assets
// ═══════════════════════════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Pre-caching critical assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                console.log('[SW] Pre-cache complete');
                // Force activation without waiting
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Pre-cache failed:', error);
            })
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// ACTIVATE EVENT - Clean up old caches
// ═══════════════════════════════════════════════════════════════════════════
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old version caches
                            return cacheName.startsWith('ia-') &&
                                   !cacheName.startsWith(CACHE_VERSION);
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Claiming clients');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// FETCH EVENT - Smart caching strategies
// ═══════════════════════════════════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) return;

    // Strategy selection based on request type
    if (request.destination === 'document' || request.mode === 'navigate') {
        // HTML: Network-first with offline fallback
        event.respondWith(networkFirstWithOfflineFallback(request));
    } else if (request.destination === 'image') {
        // Images: Cache-first with network fallback
        event.respondWith(cacheFirstWithNetworkFallback(request, IMAGE_CACHE));
    } else if (
        url.hostname === 'fonts.googleapis.com' ||
        url.hostname === 'fonts.gstatic.com' ||
        url.hostname === 'cdnjs.cloudflare.com' ||
        url.hostname === 'unpkg.com'
    ) {
        // External resources: Cache-first (they don't change often)
        event.respondWith(cacheFirstWithNetworkFallback(request, STATIC_CACHE));
    } else if (
        request.destination === 'script' ||
        request.destination === 'style' ||
        request.destination === 'font'
    ) {
        // Static assets: Stale-while-revalidate
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    } else {
        // Everything else: Network-first with cache fallback
        event.respondWith(networkFirstWithCacheFallback(request, DYNAMIC_CACHE));
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// CACHING STRATEGIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Network-first with offline fallback (for HTML)
 * Try network, fall back to cache, then offline page
 */
async function networkFirstWithOfflineFallback(request) {
    try {
        const networkResponse = await fetch(request);
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // No cache, return offline page
        return caches.match('/offline.html');
    }
}

/**
 * Cache-first with network fallback (for images, fonts)
 * Try cache first, fall back to network
 */
async function cacheFirstWithNetworkFallback(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Return placeholder for images if offline
        if (request.destination === 'image') {
            return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="#1a1a2e" width="100" height="100"/><text fill="#d4a84b" x="50" y="50" text-anchor="middle" dy=".3em" font-size="12">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
            );
        }
        throw error;
    }
}

/**
 * Network-first with cache fallback (for API calls, dynamic content)
 */
async function networkFirstWithCacheFallback(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

/**
 * Stale-while-revalidate (for static assets)
 * Return cached immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Fetch fresh version in background
    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cachedResponse);

    // Return cached version immediately if available
    return cachedResponse || fetchPromise;
}

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND SYNC - For offline form submissions (future use)
// ═══════════════════════════════════════════════════════════════════════════
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-newsletter') {
        event.waitUntil(syncNewsletter());
    }
});

async function syncNewsletter() {
    // Future: Handle offline newsletter signups
    console.log('[SW] Syncing newsletter subscriptions...');
}

// ═══════════════════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS - Ready for future implementation
// ═══════════════════════════════════════════════════════════════════════════
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

    const options = {
        body: event.data ? event.data.text() : 'New update from Infinite Architects',
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-32x32.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'explore', title: 'Read More', icon: '/favicon-32x32.png' },
            { action: 'close', title: 'Dismiss', icon: '/favicon-32x32.png' }
        ],
        tag: 'ia-notification',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification('Infinite Architects', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE HANDLER - Communication with main thread
// ═══════════════════════════════════════════════════════════════════════════
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }

    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }

    if (event.data.action === 'getCacheSize') {
        event.waitUntil(
            getCacheSize().then((size) => {
                event.ports[0].postMessage({ cacheSize: size });
            })
        );
    }
});

async function getCacheSize() {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.clone().blob();
                totalSize += blob.size;
            }
        }
    }

    return totalSize;
}

// ═══════════════════════════════════════════════════════════════════════════
// PERIODIC BACKGROUND SYNC - For content updates (Chrome only)
// ═══════════════════════════════════════════════════════════════════════════
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-content') {
        event.waitUntil(updateContent());
    }
});

async function updateContent() {
    console.log('[SW] Periodic sync: updating content...');
    // Future: Fetch and cache new content
}

console.log('[SW] Service Worker loaded - Infinite Architects PWA Ready');
