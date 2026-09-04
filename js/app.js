/* ============================================================
   SMRITI — SPA Router & App Initialization
   Hash-based routing, auth guard, header badges & persistent 🆘 Help
   ============================================================ */

import Storage from './storage.js';
import I18n from './i18n.js';
import Auth from './auth.js';
import Coins from './coins.js';
import TTS from './tts.js';

// --- Page imports ---
import LoginPage from './pages/login.js';
import HomePage from './pages/home.js';
import GamesHubPage from './pages/gamesHub.js';
import SmritiPage from './pages/smritiPage.js';
import WellnessPage from './pages/wellnessPage.js';
import ImprovementPage from './pages/improvementPage.js';
import JourneyPage from './pages/journeyPage.js';
import MedicinesPage from './pages/medicinesPage.js';
import EmergencyPage from './pages/emergencyPage.js';
import LeaderboardPage from './pages/leaderboardPage.js';
import HistoryPage from './pages/historyPage.js';
import DashboardPage from './pages/dashboardPage.js';
import PersonalisationPage from './pages/personalisationPage.js';
import SettingsPage from './pages/settingsPage.js';
import MemoryGalleryPage from './pages/memoryGalleryPage.js';
import RemindersPage from './pages/remindersPage.js';

// --- Game imports ---
import HornbillMemoryNest from './games/hornbillMemoryNest.js';
import MemoryMoments from './games/memoryMoments.js';
import FamiliarFaces from './games/familiarFaces.js';
import RememberHome from './games/rememberHome.js';
import MyDay from './games/myDay.js';
import ListenRemember from './games/listenRemember.js';
import BambooSequence from './games/bambooSequence.js';

// --- Toast system ---
const Toast = {
  _container: null,

  init() {
    this._container = document.createElement('div');
    this._container.className = 'toast-container';
    document.body.appendChild(this._container);
  },

  show(message, type = 'info', duration = 3000) {
    if (!this._container) this.init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this._container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
};

// Make toast globally accessible
window.SmritiToast = Toast;

// --- Route definitions ---
const routes = {
  '#/login': { page: LoginPage, auth: false, nav: false },
  '#/home': { page: HomePage, auth: true, nav: true },
  '#/games': { page: GamesHubPage, auth: true, nav: true },
  '#/smriti': { page: SmritiPage, auth: true, nav: true },
  '#/memories': { page: MemoryGalleryPage, auth: true, nav: true },
  '#/wellness': { page: WellnessPage, auth: true, nav: true },
  '#/improvement': { page: ImprovementPage, auth: true, nav: true },
  '#/journey': { page: JourneyPage, auth: true, nav: true },
  '#/medicines': { page: MedicinesPage, auth: true, nav: true },
  '#/emergency': { page: EmergencyPage, auth: true, nav: true },
  '#/games/hornbill': { page: HornbillMemoryNest, auth: true, nav: false },
  '#/games/memory-moments': { page: MemoryMoments, auth: true, nav: false },
  '#/games/familiar-faces': { page: FamiliarFaces, auth: true, nav: false },
  '#/games/remember-home': { page: RememberHome, auth: true, nav: false },
  '#/games/my-day': { page: MyDay, auth: true, nav: false },
  '#/games/listen-remember': { page: ListenRemember, auth: true, nav: false },
  '#/games/bamboo-sequence': { page: BambooSequence, auth: true, nav: false },
  '#/leaderboard': { page: LeaderboardPage, auth: true, nav: true },
  '#/history': { page: HistoryPage, auth: true, nav: true },
  '#/dashboard': { page: DashboardPage, auth: true, nav: true },
  '#/reminders': { page: RemindersPage, auth: true, nav: true },
  '#/personalisation': { page: PersonalisationPage, auth: true, nav: true },
  '#/settings': { page: SettingsPage, auth: true, nav: true },
};

// --- App state ---
let currentCleanup = null;
let headerEl = null;
let navEl = null;
let contentEl = null;
let quickHelpModalEl = null;

// --- Quick Help Modal Dialog ---
function showQuickHelpModal() {
  if (quickHelpModalEl) quickHelpModalEl.remove();

  const emergency = Storage.getEmergencyContacts();

  quickHelpModalEl = document.createElement('div');
  quickHelpModalEl.className = 'modal-overlay';
  quickHelpModalEl.innerHTML = `
    <div class="modal-content text-center" style="max-width: 380px; padding: 1.75rem 1.25rem;">
      <div style="font-size: 3.2rem; margin-bottom: 0.25rem;">🛟</div>
      <h3 style="color: var(--maroon); font-size: 1.4rem; margin-bottom: 0.25rem;">Emergency & Quick Help</h3>
      <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1.25rem;">How can we assist you right now?</p>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <button id="modal-call-family" class="btn btn-primary" style="background: #DC2626; min-height: 52px; font-size: 1.1rem; justify-content: flex-start; padding-left: 1.25rem;">
          🛟 Call Primary: ${emergency.primaryName}
        </button>
        <button id="modal-emergency-hub" class="btn btn-outline" style="border-color: #EF4444; color: #DC2626; min-height: 52px; font-size: 1.05rem; justify-content: flex-start; padding-left: 1.25rem;">
          🚨 Open Emergency Hub
        </button>
        <button id="modal-talk-smriti" class="btn btn-secondary" style="min-height: 52px; font-size: 1.05rem; justify-content: flex-start; padding-left: 1.25rem;">
          🤖 Talk to Smriti Companion
        </button>
        <button id="modal-go-home" class="btn btn-ghost" style="min-height: 48px; font-size: 1rem;">
          🏠 Go to Home
        </button>
      </div>

      <button id="modal-close-help" class="btn btn-ghost mt-sm" style="color: var(--gray-500); font-size: 0.95rem;">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(quickHelpModalEl);

  quickHelpModalEl.querySelector('#modal-call-family').addEventListener('click', () => {
    quickHelpModalEl.remove();
    window.location.hash = '#/emergency';
  });

  quickHelpModalEl.querySelector('#modal-emergency-hub').addEventListener('click', () => {
    quickHelpModalEl.remove();
    window.location.hash = '#/emergency';
  });

  quickHelpModalEl.querySelector('#modal-talk-smriti').addEventListener('click', () => {
    quickHelpModalEl.remove();
    window.location.hash = '#/smriti';
  });

  quickHelpModalEl.querySelector('#modal-go-home').addEventListener('click', () => {
    quickHelpModalEl.remove();
    window.location.hash = '#/home';
  });

  quickHelpModalEl.querySelector('#modal-close-help').addEventListener('click', () => {
    quickHelpModalEl.remove();
  });
}

// --- Voice Navigation Modal ---
function showVoiceNavigationModal() {
  const existing = document.querySelector('.voice-nav-modal-overlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay voice-nav-modal-overlay';
  modal.innerHTML = `
    <div class="modal-content text-center" style="max-width: 440px; padding: 1.75rem 1.25rem;">
      <div id="voice-nav-icon" style="font-size: 3.5rem; margin-bottom: 0.5rem; transition: transform 0.3s ease;">🎙️✨</div>
      <h3 style="color: var(--maroon); font-size: 1.4rem; margin-bottom: 0.35rem;">Voice Navigation</h3>
      <p style="color: var(--gray-700); font-size: 1.05rem; min-height: 48px; margin-bottom: 1.25rem; line-height: 1.4;" id="voice-nav-status">
        Listening... Say: <strong>Home, Games, Memories, Wellness, Progress, Medicines, Reminders, or Help</strong>
      </p>

      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.25rem;">
        <button id="btn-voice-retry" class="btn btn-secondary btn-sm" style="font-weight: 600; padding: 0.5rem 1rem;">
          🎙️ Speak Again
        </button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.25rem;">
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/home">🏠 Home</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/games">🎮 Games</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/memories">🖼️ Memories</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/wellness">🌿 Wellness</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/improvement">📈 Progress</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/medicines">💊 Medicines</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/reminders">⏰ Reminders</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/emergency" style="border-color: #EF4444; color: #DC2626;">🛟 Help</button>
      </div>

      <button id="btn-close-voice-nav" class="btn btn-ghost" style="color: var(--gray-500);">
        Close
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;

  function startListening() {
    const statusEl = modal.querySelector('#voice-nav-status');
    const iconEl = modal.querySelector('#voice-nav-icon');

    if (!SpeechRecognition) {
      if (statusEl) {
        statusEl.innerHTML = 'Speech recognition is not supported in this browser. Please tap any destination below:';
      }
      return;
    }

    try {
      if (rec) {
        try { rec.stop(); } catch {}
      }
      rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      // Select speech recognition language matching UI
      const lang = I18n.lang;
      rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN';

      if (statusEl) {
        statusEl.innerHTML = 'Listening now... <em>Speak your destination clearly</em>';
      }
      if (iconEl) {
        iconEl.style.transform = 'scale(1.2)';
      }

      rec.onresult = (event) => {
        const text = (event.results[0][0].transcript || '').toLowerCase();
        handleVoiceDestination(text);
      };

      rec.onerror = (e) => {
        console.warn('Speech recognition warning:', e.error);
        if (iconEl) iconEl.style.transform = 'scale(1)';
        if (statusEl) {
          if (e.error === 'not-allowed') {
            statusEl.innerHTML = 'Microphone permission needed. Please tap <strong>Speak Again</strong> or select a destination below.';
          } else if (e.error === 'no-speech') {
            statusEl.innerHTML = 'No speech heard. Tap <strong>"🎙️ Speak Again"</strong> or choose below:';
          } else {
            statusEl.innerHTML = 'Could not catch that clearly. Tap <strong>"🎙️ Speak Again"</strong> or choose below:';
          }
        }
      };

      rec.onend = () => {
        if (iconEl) iconEl.style.transform = 'scale(1)';
      };

      rec.start();
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
      if (statusEl) {
        statusEl.innerHTML = 'Tap <strong>"🎙️ Speak Again"</strong> or choose any destination below:';
      }
    }
  }

  function handleVoiceDestination(text) {
    const statusEl = modal.querySelector('#voice-nav-status');
    let target = null;
    let name = '';

    if (text.includes('game') || text.includes('khel') || text.includes('khela') || text.includes('play')) {
      target = '#/games'; name = 'Games Hub';
    } else if (text.includes('memory') || text.includes('memories') || text.includes('story') || text.includes('yaad') || text.includes('smriti') || text.includes('chhobi')) {
      target = '#/memories'; name = 'Life Story Memories';
    } else if (text.includes('wellness') || text.includes('breath') || text.includes('health') || text.includes('swasth') || text.includes('shanti') || text.includes('saans')) {
      target = '#/wellness'; name = 'Wellness & Calm';
    } else if (text.includes('progress') || text.includes('score') || text.includes('improvement') || text.includes('garden') || text.includes('streak')) {
      target = '#/improvement'; name = 'Mind Progress Garden';
    } else if (text.includes('medicine') || text.includes('medicines') || text.includes('dawa') || text.includes('oshudh') || text.includes('pill')) {
      target = '#/medicines'; name = 'Medicines';
    } else if (text.includes('reminder') || text.includes('reminders') || text.includes('alarm') || text.includes('samay') || text.includes('somoy')) {
      target = '#/reminders'; name = 'Gentle Reminders';
    } else if (text.includes('emergency') || text.includes('help') || text.includes('sos') || text.includes('madad') || text.includes('shahajjo') || text.includes('doctor')) {
      target = '#/emergency'; name = 'Emergency Help';
    } else if (text.includes('home') || text.includes('ghar') || text.includes('bari') || text.includes('start')) {
      target = '#/home'; name = 'Home';
    }

    if (target) {
      if (statusEl) statusEl.innerHTML = `Navigating to <strong>${name}</strong>...`;
      if (TTS && TTS.isSupported()) {
        TTS.speak(`Opening ${name}`);
      }
      setTimeout(() => {
        modal.remove();
        if (rec) { try { rec.stop(); } catch {} }
        window.location.hash = target;
      }, 600);
    } else {
      if (statusEl) {
        statusEl.innerHTML = `Heard "<em>${text}</em>". Tap <strong>Speak Again</strong> or choose below:`;
      }
    }
  }

  // Bind Buttons
  modal.querySelector('#btn-voice-retry').addEventListener('click', () => {
    startListening();
  });

  modal.querySelectorAll('.btn-voice-dest').forEach(b => {
    b.addEventListener('click', () => {
      const r = b.getAttribute('data-route');
      modal.remove();
      if (rec) { try { rec.stop(); } catch {} }
      window.location.hash = r;
    });
  });

  modal.querySelector('#btn-close-voice-nav').addEventListener('click', () => {
    if (rec) { try { rec.stop(); } catch {} }
    modal.remove();
  });

  startListening();
}

// --- Header ---
function renderHeader() {
  if (headerEl) headerEl.remove();

  if (!Auth.isLoggedIn()) return;

  headerEl = document.createElement('header');
  headerEl.className = 'app-header';
  headerEl.innerHTML = `
    <div class="header-inner">
      <div class="header-brand" onclick="window.location.hash='#/home'" style="cursor: pointer;">
        <span class="header-logo">🧠</span>
        <span class="header-title">${I18n.t('appName')}</span>
      </div>
      <div class="header-actions">
        <!-- 🎙️ Voice Navigation Button -->
        <button id="btn-voice-nav" class="btn-voice-badge" title="Voice Navigation" style="background: #E6F4F1; color: var(--teal-dark); border: 1.5px solid #99F6E4; border-radius: 999px; padding: 0.35rem 0.65rem; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
          🎙️ Voice
        </button>

        <!-- 🛟 Persistent Quick Help Button -->
        <button id="btn-quick-sos" class="btn-sos-badge" title="Emergency Help">
          🛟 SOS
        </button>

        <!-- Language Badge -->
        <div class="lang-badge" id="header-lang" title="${I18n.t('settingsLanguage')}">
          🌐 ${I18n.lang.toUpperCase()}
        </div>

        <!-- Coin Balance -->
        <div class="coin-badge" onclick="window.location.hash='#/leaderboard'" style="cursor: pointer;" title="${I18n.t('coins')}">
          🪙 <span id="coin-balance">${Coins.getBalance()}</span>
        </div>
      </div>
    </div>
  `;
  document.getElementById('root').prepend(headerEl);

  headerEl.querySelector('#header-lang').addEventListener('click', () => {
    window.location.hash = '#/settings';
  });

  headerEl.querySelector('#btn-voice-nav').addEventListener('click', (e) => {
    e.stopPropagation();
    showVoiceNavigationModal();
  });

  headerEl.querySelector('#btn-quick-sos').addEventListener('click', (e) => {
    e.stopPropagation();
    showQuickHelpModal();
  });
}

// --- Bottom Navigation ---
function renderNav(activeHash) {
  if (navEl) navEl.remove();

  if (!Auth.isLoggedIn()) {
    document.body.classList.remove('has-nav');
    return;
  }

  const user = Auth.getUser();
  const isCaregiver = user && user.role === 'caregiver';

  const navItems = [
    { hash: '#/home', icon: '🏠', label: 'Home' },
    { hash: '#/games', icon: '🎮', label: 'Games' },
    { hash: '#/smriti', icon: '🤖', label: 'Smriti' },
    { hash: '#/wellness', icon: '🌿', label: 'Wellness' },
    { hash: '#/improvement', icon: '📈', label: 'Progress' },
    isCaregiver
      ? { hash: '#/dashboard', icon: '📋', label: 'Caregiver' }
      : { hash: '#/settings', icon: '⚙️', label: 'Settings' },
  ];

  navEl = document.createElement('nav');
  navEl.className = 'bottom-nav';
  navEl.innerHTML = navItems.map(item => `
    <button class="nav-item ${activeHash === item.hash ? 'active' : ''}" data-hash="${item.hash}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  document.body.appendChild(navEl);
  document.body.classList.add('has-nav');

  navEl.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.hash;
    });
  });
}

// --- Level Up Celebration Listener ---
window.addEventListener('smritiLevelUp', (e) => {
  const lvl = e.detail;
  if (!lvl) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content text-center" style="max-width: 400px; padding: 2.25rem 1.5rem; background: linear-gradient(135deg, #FEF3C7, #FFFBEB); border: 3px solid #FCD34D;">
      <div style="font-size: 4.5rem; animation: coinPop 0.6s ease;">🎉${lvl.levelIcon}</div>
      <h2 style="color: #78350F; font-size: 1.8rem; margin: 0.5rem 0 0.25rem 0;">Level Up!</h2>
      <h3 style="color: #B45309; font-size: 1.3rem; margin-bottom: 0.5rem;">Level ${lvl.level} — ${lvl.levelName}</h3>
      <p style="color: #92400E; font-size: 1.05rem; margin-bottom: 1.5rem;">
        Congratulations on your wonderful mindfulness and daily brain exercises!
      </p>
      <button id="btn-close-celebration" class="btn btn-primary btn-block" style="background: #D97706;">
        ✨ Continue Mind Journey
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#btn-close-celebration').addEventListener('click', () => {
    modal.remove();
    window.location.hash = '#/journey';
  });
});

// --- Router ---
function navigate() {
  let hash = window.location.hash;
  if (!hash || hash === '#' || hash === '#/') {
    const defaultHash = Auth.isLoggedIn() ? '#/home' : '#/login';
    if (window.location.hash !== defaultHash) {
      window.location.hash = defaultHash;
      return;
    }
    hash = defaultHash;
  }

  let route = routes[hash];

  // Cleanup previous page
  if (currentCleanup) {
    try {
      if (typeof currentCleanup === 'function') currentCleanup();
      else if (currentCleanup.cleanup) currentCleanup.cleanup();
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
    currentCleanup = null;
  }

  // Auth guard
  if (!route || (route.auth && !Auth.isLoggedIn())) {
    if (window.location.hash !== '#/login') {
      window.location.hash = '#/login';
      return;
    }
    route = routes['#/login'];
  }

  // If logged in and trying to access login, redirect
  if (hash === '#/login' && Auth.isLoggedIn()) {
    const user = Auth.getUser();
    const target = user && user.role === 'caregiver' ? '#/dashboard' : '#/home';
    window.location.hash = target;
    return;
  }

  if (!route) {
    route = routes['#/login'];
  }

  // Build layout
  const root = document.getElementById('root');
  if (!root) return;
  root.innerHTML = '';

  // Header (for authenticated pages)
  if (route.auth && Auth.isLoggedIn()) {
    renderHeader();
  }

  // Content container
  contentEl = document.createElement('main');
  contentEl.id = 'page-content';
  root.appendChild(contentEl);

  // Render page
  try {
    currentCleanup = route.page(contentEl);
  } catch (err) {
    console.error('Page render error:', err);
    contentEl.innerHTML = `<div class="container" style="color:red;padding:2rem;"><h3>Error rendering page</h3><p>${err.message}</p></div>`;
  }

  // Bottom nav
  if (route.nav && Auth.isLoggedIn()) {
    renderNav(hash);
  } else {
    if (navEl) navEl.remove();
    document.body.classList.remove('has-nav');
  }
}

// --- Init ---
function init() {
  // Initialize modules
  I18n.init();
  Toast.init();

  // Listen for hash changes
  window.addEventListener('hashchange', navigate);

  // Listen for language changes to refresh UI
  window.addEventListener('languageChanged', () => {
    renderHeader();
    const hash = window.location.hash || '#/home';
    const route = routes[hash];
    if (route && route.nav) {
      renderNav(hash);
    }
  });

  // Always invoke initial navigation directly
  navigate();
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
