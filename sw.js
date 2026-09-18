/* ============================================================
   SMRITI — Service Worker for Offline Resilience & Low Data Mode
   ============================================================ */

const CACHE_NAME = 'smriti-v20';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/icon-192.svg',
  './css/icon-512.svg',
  './js/app.js',
  './js/storage.js',
  './js/userState.js',
  './js/auth.js',
  './js/i18n.js',
  './js/tts.js',
  './js/coins.js',
  './js/timer.js',
  './js/reminders.js',
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
  './js/pages/doctorPage.js',
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
  './js/pages/entertainmentPage.js',
  './js/pages/socialPlayPage.js',
  './js/ambientAudio.js',
  './js/games/hornbillMemoryNest.js',
  './js/games/memoryMoments.js',
  './js/games/familiarFaces.js',
  './js/games/rememberHome.js',
  './js/games/myDay.js',
  './js/games/listenRemember.js'
];

// Install: Pre-cache essential app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for JS, CSS, and HTML; Cache-First for static media assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-First for code/document requests so updates are instantaneous
  if (url.origin === self.location.origin && (url.pathname.endsWith('.js') || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('.css'))) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-First for other assets (images, fonts, sounds)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
