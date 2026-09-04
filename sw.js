/* ============================================================
   SMRITI — Service Worker for Offline Resilience & Low Data Mode
   ============================================================ */

const CACHE_NAME = 'smriti-v3';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/icon-192.svg',
  './css/icon-512.svg',
  './js/app.js',
  './js/storage.js',
  './js/auth.js',
  './js/i18n.js',
  './js/tts.js',
  './js/coins.js',
  './js/timer.js',
  './js/aiService.js',
  './js/gameShell.js',
  './js/leaderboard.js',
  './js/pages/home.js',
  './js/pages/login.js',
  './js/pages/gamesHub.js',
  './js/pages/smritiPage.js',
  './js/pages/historyPage.js',
  './js/pages/leaderboardPage.js',
  './js/pages/dashboardPage.js',
  './js/pages/personalisationPage.js',
  './js/pages/settingsPage.js',
  './js/pages/memoryGalleryPage.js',
  './js/pages/medicinesPage.js',
  './js/pages/remindersPage.js',
  './js/pages/emergencyPage.js',
  './js/pages/improvementPage.js',
  './js/pages/wellnessPage.js',
  './js/pages/journeyPage.js',
  './js/pages/feelingLostPage.js',
  './js/pages/dailyRitualPage.js',
  './js/ambientAudio.js',
  './js/games/hornbillMemoryNest.js',
  './js/games/memoryMoments.js',
  './js/games/familiarFaces.js',
  './js/games/rememberHome.js',
  './js/games/myDay.js',
  './js/games/listenRemember.js',
  './js/games/bambooSequence.js'
];

// Install: Pre-cache essential app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Some precache assets could not be cached:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first for same-origin static assets; fallback to network; graceful offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For external resources (e.g. CDNs or external image links), try network first, then cache
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Same-origin: Cache-first strategy for instant loading and offline capability
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate cache (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline, ignore */});

        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
