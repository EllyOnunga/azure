// Azure Bay Service Worker
const CACHE_NAME = "azurebay-v1";
const OFFLINE_URL = "index.html";

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/css/custom.min.css",
    "/css/bootstrap.min.css",
    "/js/jquery-3.7.1.min.js",
    "/images/logo.svg",
    "/images/loader.svg",
    "/404.html",
];

// Install event - cache core assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("Service Worker: Caching core assets");
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting()),
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log("Service Worker: Clearing old cache:", name);
                            return caches.delete(name);
                        }),
                );
            })
            .then(() => self.clients.claim()),
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== "GET") {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith("http")) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone the response for caching
                const responseClone = response.clone();

                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Return offline page for navigation requests
                    if (request.mode === "navigate") {
                        return caches.match(OFFLINE_URL);
                    }

                    // Return a default fallback for other requests
                    return new Response("Offline - Content not available", {
                        status: 503,
                        statusText: "Service Unavailable",
                        headers: new Headers({
                            "Content-Type": "text/plain",
                        }),
                    });
                });
            }),
    );
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
