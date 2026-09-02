/* ============================================================
   SMRITI — SPA Router & App Initialization
   Hash-based routing, auth guard, header badges & persistent 🆘 Help
   ============================================================ */

import Storage from './storage.js';
import I18n from './i18n.js';
import Auth from './auth.js';
import Coins from './coins.js';

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
      <div style="font-size: 3rem; margin-bottom: 0.25rem;">🆘❤️</div>
      <h3 style="color: var(--maroon); font-size: 1.4rem; margin-bottom: 0.25rem;">Quick Support</h3>
      <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1.25rem;">How can we help you right now?</p>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <button id="modal-call-family" class="btn btn-primary" style="background: #DC2626; min-height: 52px; font-size: 1.1rem; justify-content: flex-start; padding-left: 1.25rem;">
          ❤️ Call ${emergency.primaryName}
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
        <!-- 🆘 Persistent Quick Help Button -->
        <button id="btn-quick-sos" class="btn-sos-badge" title="Quick Help">
          🆘 Help
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
