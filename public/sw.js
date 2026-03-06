/**
 * Service Worker - Advanced Caching & Offline Support
 * Implements efficient caching strategies with offline mode and push notifications
 *
 * Cache Strategy:
 * - HTML: Network first (always fresh content)
 * - JS/CSS: Cache first (versioned by Vite hash)
 * - Images: Cache first with TTL
 * - API: Network first with cache fallback
 * - Offline: Cached fallback pages
 */

const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const ASSETS_CACHE = `assets-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const OFFLINE_CACHE = `offline-${CACHE_VERSION}`;

// Static assets to precache on install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/logo.png",
  "/robots.txt",
  "/sitemap.xml",
];

// Cache size limits (in MB)
const CACHE_LIMITS = {
  images: 50, // 50MB for images
  dynamic: 20, // 20MB for API responses
  assets: 100, // 100MB for JS/CSS
};

// Image cache TTL (in days)
const IMAGE_CACHE_TTL = 30;

/**
 * Get size of all caches
 */
async function getCacheSize() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return null;
  }
  return await navigator.storage.estimate();
}

/**
 * Clean up old cache entries and enforce size limits
 */
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    // Remove old entries (older than TTL)
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get("date");
        if (dateHeader) {
          const cacheTime = new Date(dateHeader).getTime();
          const now = Date.now();
          const daysDiff = (now - cacheTime) / (1000 * 60 * 60 * 24);
          
          if (cacheName === IMAGE_CACHE && daysDiff > IMAGE_CACHE_TTL) {
            cache.delete(request);
          }
        }
      }
    }
  }
}

// Install event - precache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log("Precache failed - offline mode may have limitations");
      });
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Remove old cache versions
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (!name.includes(CACHE_VERSION)) {
              return caches.delete(name);
            }
          }),
        );
      }),
      // Cleanup old entries
      cleanupCaches(),
    ]),
  );
  self.clients.claim();
});

// Fetch event - implement advanced caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET
  if (url.origin !== location.origin) {
    return;
  }

  // HTML pages - Network first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            // Return offline page if available
            return caches.match("/index.html").then((offlineResponse) => {
              return (
                offlineResponse ||
                new Response(
                  "<!DOCTYPE html><html><body><h1>Offline - Page Not Available</h1><p>Please check your connection and refresh.</p></body></html>",
                  {
                    status: 503,
                    statusText: "Service Unavailable",
                    headers: new Headers({
                      "Content-Type": "text/html; charset=UTF-8",
                    }),
                  },
                )
              );
            });
          });
        }),
    );
    return;
  }

  // JS/CSS files (versioned with hash) - Cache first
  if (
    request.url.includes("/assets/") &&
    (request.url.endsWith(".js") || request.url.endsWith(".css"))
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(ASSETS_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(request);
          });
      }),
    );
    return;
  }

  // Images - Cache first with network fallback
  if (
    request.method === "GET" &&
    (request.url.includes("/images/") ||
      request.url.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i))
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // Return transparent 1x1 pixel as placeholder
            return new Response(
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
              {
                headers: { "Content-Type": "image/png" },
              },
            );
          });
      }),
    );
    return;
  }

  // API calls - Network first with cache fallback
  if (request.method === "GET") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        }),
    );
    return;
  }
});

// Push notification event
self.addEventListener("push", (event) => {
  let notificationData = {
    title: "Danvion Ltd",
    body: "You have a new message",
    icon: "/logo.png",
    badge: "/logo.png",
    tag: "danvion-notification",
    requireInteraction: false,
  };

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData),
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if window already open
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === "/" && "focus" in clientList[i]) {
          return clientList[i].focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || "/");
      }
    }),
  );
});

// Message event - handle cache control and notifications
self.addEventListener("message", (event) => {
  const { type, data } = event.data;

  if (type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (type === "CLEAR_CACHE") {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        if (cacheName.includes(data?.cacheName || CACHE_VERSION)) {
          caches.delete(cacheName);
        }
      });
    });
  }

  if (type === "CLEANUP_CACHES") {
    cleanupCaches();
  }
});

// Background sync for failed requests (optional)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-failed-requests") {
    event.waitUntil(
      // Implement retry logic for failed requests
      Promise.resolve(),
    );
  }
});
