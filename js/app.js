/* ============================================================
   SMRITI (स्मृति) — SPA Router & App Initialization
   Google Stitch Sanctuary Design System & Antigravity Workflow Engine
   Features:
     - Sticky Stitch Header with regional date, audio, voice, SOS, language dropdown & coins
     - Fixed 4-Tab Bottom Navigation with active indicator dots
     - Persistent Floating Saathi Mascot with .pulse-halo animation
     - Slide-Out Saathi Drawer with Web Speech API recognition & TTS read-aloud
     - Robust multi-language reactivity across en, hi, bn, as
   ============================================================ */

import Storage from './storage.js';
import I18n, { LanguageContext } from './i18n.js';
import Auth from './auth.js';
import Coins from './coins.js';
import TTS from './tts.js';
import AIService from './aiService.js';
import AmbientAudio from './ambientAudio.js';
import ReminderScheduler from './reminders.js';

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
import FeelingLostPage from './pages/feelingLostPage.js';
import DailyRitualPage from './pages/dailyRitualPage.js';
import EntertainmentPage from './pages/entertainmentPage.js';
import SocialPlayPage from './pages/socialPlayPage.js';
import DoctorPage from './pages/doctorPage.js';
import RewardsPage from './pages/rewardsPage.js';

// --- Game imports ---
import HornbillMemoryNest from './games/hornbillMemoryNest.js';
import MemoryMoments from './games/memoryMoments.js';
import FamiliarFaces from './games/familiarFaces.js';
import RememberHome from './games/rememberHome.js';
import MyDay from './games/myDay.js';
import ListenRemember from './games/listenRemember.js';
import BambooSequence from './games/bambooSequence.js';

// --- Toast notification system ---
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
  '#/doctor': { page: DoctorPage, auth: true, nav: true },
  '#/report': { page: DoctorPage, auth: true, nav: true },
  '#/doctor-report': { page: DoctorPage, auth: true, nav: true },
  '#/reminders': { page: RemindersPage, auth: true, nav: true },
  '#/entertainment': { page: EntertainmentPage, auth: true, nav: true },
  '#/rewards': { page: RewardsPage, auth: true, nav: true },
  '#/social': { page: SocialPlayPage, auth: true, nav: true },
  '#/ritual': { page: DailyRitualPage, auth: true, nav: true },
  '#/lost': { page: FeelingLostPage, auth: true, nav: false },
  '#/personalisation': { page: PersonalisationPage, auth: true, nav: true },
  '#/settings': { page: SettingsPage, auth: true, nav: true },
};

// --- App State & DOM Elements ---
let currentCleanup = null;
let headerEl = null;
let navEl = null;
let contentEl = null;
let floatingMascotEl = null;
let saathiDrawerEl = null;
let quickHelpModalEl = null;

// --- Regional Date Formatter ---
function getFormattedRegionalDate() {
  const istDate = new Date();
  const options = { day: 'numeric', month: 'short', weekday: 'short' };
  const lang = I18n.lang || 'en';
  const localeMap = {
    hi: 'hi-IN',
    bn: 'bn-IN',
    as: 'as-IN',
    mni: 'mni-IN',
    brx: 'brx-IN',
    ne: 'ne-NP',
    en: 'en-IN'
  };
  return istDate.toLocaleDateString(localeMap[lang] || 'en-IN', options);
};
  return istDate.toLocaleDateString(I18n.lang === 'hi' ? 'hi-IN' : I18n.lang === 'bn' ? 'bn-IN' : I18n.lang === 'as' ? 'as-IN' : 'en-IN', options);
}

// --- Emergency Help Modal Dialog ---
function showQuickHelpModal() {
  if (quickHelpModalEl) quickHelpModalEl.remove();

  const emergency = Storage.getEmergencyContacts();

  quickHelpModalEl = document.createElement('div');
  quickHelpModalEl.className = 'modal-overlay';
  quickHelpModalEl.innerHTML = `
    <div class="modal-content text-center" style="max-width: 400px; padding: 2rem 1.5rem; background: #FFFFFF; border-radius: 24px; border: 2px solid #FECDD3;">
      <div style="font-size: 3.5rem; margin-bottom: 0.5rem; animation: gentlePulse 2s infinite ease-in-out;">🛟</div>
      <h3 style="color: var(--maroon); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.35rem;">${I18n.t('grid.emergency')}</h3>
      <p class="text-muted" style="font-size: 1rem; margin-bottom: 1.25rem;">How can we assist you right now?</p>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <button id="modal-call-family" class="btn btn-primary" style="background: #DC2626; min-height: 52px; font-size: 1.05rem; font-weight: 800; justify-content: center;">
          📞 Call Primary: ${emergency.primaryName || 'Raj Das'}
        </button>
        <button id="modal-feeling-lost" class="btn btn-outline" style="border-color: #0D9488; color: #0F766E; background: #F0FDFA; min-height: 52px; font-size: 1.05rem; font-weight: 700; justify-content: center;">
          🧭 "I'm Feeling Lost" (Calm & Orient)
        </button>
        <button id="modal-emergency-hub" class="btn btn-outline" style="border-color: #EF4444; color: #DC2626; min-height: 52px; font-size: 1.05rem; font-weight: 700; justify-content: center;">
          🚨 Open Emergency Hub
        </button>
        <button id="modal-talk-saathi" class="btn btn-secondary" style="min-height: 52px; font-size: 1.05rem; font-weight: 700; justify-content: center;">
          🤖 Talk to Saathi Companion
        </button>
      </div>

      <button id="modal-close-help" class="btn btn-ghost mt-md" style="color: var(--gray-500); font-size: 0.95rem;">
        ${I18n.t('close')}
      </button>
    </div>
  `;

  document.body.appendChild(quickHelpModalEl);

  quickHelpModalEl.querySelector('#modal-call-family').addEventListener('click', () => {
    quickHelpModalEl.remove();
    window.location.hash = '#/emergency';
  });

  quickHelpModalEl.querySelector('#modal-feeling-lost').addEventListener('click', () => {
    quickHelpModalEl.remove();
    window.location.hash = '#/lost';
  });

  quickHelpModalEl.querySelector('#modal-emergency-hub').addEventListener('click', () => {
    quickHelpModalEl.remove();
    window.location.hash = '#/emergency';
  });

  quickHelpModalEl.querySelector('#modal-talk-saathi').addEventListener('click', () => {
    quickHelpModalEl.remove();
    toggleSaathiDrawer(true);
  });

  quickHelpModalEl.querySelector('#modal-close-help').addEventListener('click', () => {
    quickHelpModalEl.remove();
  });
}
window.triggerEmergencySOSModal = showQuickHelpModal;

// --- Voice Navigation Modal ---
function showVoiceNavigationModal() {
  const existing = document.querySelector('.voice-nav-modal-overlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay voice-nav-modal-overlay';
  modal.innerHTML = `
    <div class="modal-content text-center" style="max-width: 440px; padding: 2rem 1.5rem; background: #FFFFFF; border-radius: 24px;">
      <div id="voice-nav-icon" style="font-size: 3.5rem; margin-bottom: 0.5rem; transition: transform 0.3s ease;">🎙️✨</div>
      <h3 style="color: var(--maroon); font-size: 1.4rem; font-weight: 800; margin-bottom: 0.35rem;">Voice Navigation</h3>
      <p style="color: var(--gray-700); font-size: 1.05rem; min-height: 48px; margin-bottom: 1.25rem; line-height: 1.4;" id="voice-nav-status">
        Listening... Speak destination clearly: <strong>Home, Games, Memories, Wellness, or Help</strong>
      </p>

      <div style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 1.25rem;">
        <button id="btn-voice-retry" class="btn btn-secondary btn-sm" style="font-weight: 700; padding: 0.5rem 1rem;">
          🎙️ Speak Again
        </button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.25rem;">
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/home">🏠 Home</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/games">🎮 Games</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/memories">🖼️ Memories</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/wellness">🌿 Wellness</button>
        <button class="btn btn-outline btn-sm btn-voice-dest" data-route="#/emergency" style="border-color: #EF4444; color: #DC2626;">🛟 Help</button>
      </div>

      <button id="btn-close-voice-nav" class="btn btn-ghost" style="color: var(--gray-500);">
        ${I18n.t('close')}
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
      rec.lang = I18n.lang === 'hi' ? 'hi-IN' : I18n.lang === 'bn' ? 'bn-IN' : I18n.lang === 'as' ? 'as-IN' : 'en-IN';

      if (statusEl) statusEl.innerHTML = 'Listening now... <em>Speak your destination clearly</em>';
      if (iconEl) iconEl.style.transform = 'scale(1.2)';

      rec.onresult = (event) => {
        const text = (event.results[0][0].transcript || '').toLowerCase();
        handleVoiceDestination(text);
      };

      rec.onerror = () => {
        if (iconEl) iconEl.style.transform = 'scale(1)';
        if (statusEl) statusEl.innerHTML = 'Could not catch that clearly. Tap <strong>"🎙️ Speak Again"</strong> or choose below:';
      };

      rec.onend = () => {
        if (iconEl) iconEl.style.transform = 'scale(1)';
      };

      rec.start();
    } catch (err) {
      console.warn('SpeechRecognition start failed:', err);
    }
  }

  function handleVoiceDestination(text) {
    const statusEl = modal.querySelector('#voice-nav-status');
    let target = null;
    let name = '';

    if (text.includes('game') || text.includes('khel') || text.includes('play')) {
      target = '#/games'; name = 'Games Hub';
    } else if (text.includes('memory') || text.includes('memories') || text.includes('story') || text.includes('photo')) {
      target = '#/memories'; name = 'Life Story Memories';
    } else if (text.includes('wellness') || text.includes('breath') || text.includes('health') || text.includes('shanti')) {
      target = '#/wellness'; name = 'Wellness';
    } else if (text.includes('medicine') || text.includes('dawa') || text.includes('pill')) {
      target = '#/medicines'; name = 'Medicines';
    } else if (text.includes('emergency') || text.includes('help') || text.includes('sos') || text.includes('doctor')) {
      target = '#/emergency'; name = 'Emergency Help';
    } else if (text.includes('home') || text.includes('ghar') || text.includes('bari')) {
      target = '#/home'; name = 'Home';
    }

    if (target) {
      if (statusEl) statusEl.innerHTML = `Navigating to <strong>${name}</strong>...`;
      if (TTS && TTS.isSupported()) TTS.speak(`Opening ${name}`);
      setTimeout(() => {
        modal.remove();
        if (rec) { try { rec.stop(); } catch {} }
        window.location.hash = target;
      }, 600);
    }
  }

  modal.querySelector('#btn-voice-retry').addEventListener('click', startListening);
  modal.querySelectorAll('.btn-voice-dest').forEach(b => {
    b.addEventListener('click', () => {
      modal.remove();
      if (rec) { try { rec.stop(); } catch {} }
      window.location.hash = b.getAttribute('data-route');
    });
  });
  modal.querySelector('#btn-close-voice-nav').addEventListener('click', () => {
    if (rec) { try { rec.stop(); } catch {} }
    modal.remove();
  });

  startListening();
}

// --- Header Component ---
function renderHeader() {
  if (headerEl) headerEl.remove();
  if (!Auth.isLoggedIn()) return;

  const currentLangCode = (I18n.lang || 'en').toUpperCase();
  const regionalDate = getFormattedRegionalDate();
  const hasRedeemedReward = !!localStorage.getItem('smriti_reward_redeemed');

  headerEl = document.createElement('header');
  headerEl.className = 'stitch-header';
  headerEl.setAttribute('data-purpose', 'site-header');
  headerEl.innerHTML = `
    <div class="stitch-header-inner">
      <!-- Brand Logo, Redeemed Badge, Online Dot & Regional Date -->
      <div style="display: flex; align-items: center; gap: 0.65rem; flex-shrink: 0;">
        <div class="stitch-brand" id="app-brand" title="SMRITI Sanctuary Home">
          <span class="brand-logo" id="app-logo">🧠</span>
          <span class="brand-name">SMRITI</span>
        </div>
        ${hasRedeemedReward ? `
          <div id="header-redeemed-badge" class="stitch-redeemed-badge" title="Reward Claimed! Tap to view Rewards & Badges" onclick="window.location.hash='#/rewards'">
            <span>✨</span>
            <span>${I18n.t('redeemed') || 'Redeemed'}</span>
          </div>
        ` : ''}
        <span class="stitch-online-badge" id="header-sync-status" title="Connection Status">
          <span class="stitch-online-dot"></span>
          <span id="sync-text">${navigator.onLine ? I18n.t('status.online') : I18n.t('status.offline')}</span>
        </span>
        <span class="desktop-only" style="font-size: 0.82rem; font-weight: 700; color: #78350F; background: #FEF3C7; padding: 0.25rem 0.6rem; border-radius: 999px;">
          📅 ${regionalDate}
        </span>
      </div>

      <!-- Quick Controls: Audio, Voice, SOS, Language Switcher, Coins -->
      <div class="stitch-controls">
        <!-- Ambient Nature Audio Toggle -->
        <button id="btn-ambient-sound" class="stitch-pill-btn" style="background: ${AmbientAudio.isPlaying() ? '#ECFDF5' : '#FFFFFF'}; color: ${AmbientAudio.isPlaying() ? '#047857' : '#475569'}; border-color: ${AmbientAudio.isPlaying() ? '#6EE7B7' : '#E5E7EB'};" title="Toggle Nature Audio">
          <span>🎵</span>
          <span class="desktop-only">${I18n.t('nav.sound')}</span>
        </button>

        <!-- Voice Navigation -->
        <button id="btn-voice-nav" class="stitch-pill-btn" style="background: #E6F4F1; color: var(--teal-dark); border-color: #99F6E4;" title="Voice Navigation">
          <span>🎙️</span>
          <span class="desktop-only">${I18n.t('nav.voice')}</span>
        </button>

        <!-- SOS Quick Button -->
        <button id="btn-quick-sos" class="stitch-pill-btn stitch-sos-btn" title="Emergency SOS Help">
          <span style="animation: gentlePulse 1.5s infinite ease-in-out;">🚨</span>
          <span>${I18n.t('nav.sos')}</span>
        </button>

        <!-- Multilingual Language Dropdown (en, hi, bn, as) -->
        <div style="position: relative; display: inline-block;">
          <button id="lang-menu-btn" class="stitch-pill-btn" style="background: #E0F2FE; color: #0369A1; border-color: #BAE6FD;" aria-haspopup="true" aria-expanded="false" title="Switch Language">
            <span>🌐</span>
            <span id="current-lang-display">${currentLangCode}</span>
          </button>
          <div id="lang-dropdown-panel" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 6px; background: #FFFFFF; border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.15); border: 1.5px solid #E5E7EB; padding: 6px 0; z-index: 100; min-width: 195px; max-height: 380px; overflow-y: auto;">
            ${I18n.getAvailableLanguages().map(l => `
              <button class="lang-opt-btn ${l.code === (I18n.lang || 'en') ? 'active-lang' : ''}" data-lang="${l.code}" style="min-height: 48px; width: 100%; text-align: left; padding: 12px 18px; font-size: 0.98rem; font-weight: 700; border: none; background: ${l.code === (I18n.lang || 'en') ? '#EFF6FF' : 'transparent'}; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: #111827; transition: background 0.15s ease;">
                <span style="display: flex; align-items: center; gap: 8px;">
                  ${l.code === (I18n.lang || 'en') ? '<span style="color: #2563EB; font-size: 1.1rem;">●</span>' : '<span style="color: transparent; font-size: 1.1rem;">●</span>'}
                  ${l.native}
                </span>
                <span style="font-size: 0.76rem; color: #6B7280; font-family: monospace; font-weight: 800; background: #F3F4F6; padding: 2px 6px; border-radius: 6px;">${l.code.toUpperCase()}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Live Coins Counter -->
        <div id="header-coin-badge" class="stitch-coin-badge" title="Memory Rewards & Coins" onclick="window.location.hash='#/rewards'">
          <span>🪙</span>
          <span id="coin-balance">${Coins.getBalance()}</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('root').prepend(headerEl);

  // Attach safe header event listeners
  const brandEl = headerEl.querySelector('#app-brand');
  if (brandEl) {
    brandEl.addEventListener('click', (e) => {
      e.preventDefault();
      const user = Auth.getUser();
      window.location.hash = (user && user.role === 'caregiver') ? '#/dashboard' : '#/home';
    });
  }

  headerEl.querySelector('#btn-ambient-sound').addEventListener('click', () => {
    AmbientAudio.toggle();
    renderHeader();
  });

  headerEl.querySelector('#btn-voice-nav').addEventListener('click', () => {
    showVoiceNavigationModal();
  });

  headerEl.querySelector('#btn-quick-sos').addEventListener('click', () => {
    showQuickHelpModal();
  });

  // Language Dropdown Toggle & Selection
  const langBtn = headerEl.querySelector('#lang-menu-btn');
  const langPanel = headerEl.querySelector('#lang-dropdown-panel');
  if (langBtn && langPanel) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = langPanel.style.display === 'block';
      langPanel.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', () => {
      if (langPanel) langPanel.style.display = 'none';
    });

    langPanel.querySelectorAll('.lang-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute('data-lang');
        langPanel.style.display = 'none';
        LanguageContext ? LanguageContext.setLanguage(selectedLang) : I18n.setLanguage(selectedLang);
        if (window.SmritiToast) {
          window.SmritiToast.show(`Language switched to ${btn.querySelector('span').textContent} 🌐`, 'success');
        }
      });
    });
  }
}

// --- Bottom Navigation (Fixed 4-Tab Bar with Active Indicator Dots) ---
function renderNav(activeHash) {
  if (navEl) navEl.remove();

  if (!Auth.isLoggedIn()) {
    document.body.classList.remove('has-nav');
    return;
  }

  const user = Auth.getUser();
  const isCaregiver = user && user.role === 'caregiver';

  const navItems = isCaregiver
    ? [
        { hash: '#/dashboard', icon: '📋', label: I18n.t('nav.caregiver') },
        { hash: '#/medicines', icon: '💊', label: I18n.t('grid.medicines') },
        { hash: '#/doctor', icon: '🩺', label: 'Doctor' },
        { hash: '#/settings', icon: '⚙️', label: I18n.t('nav.settings') }
      ]
    : [
        { hash: '#/home', icon: '🏠', label: I18n.t('nav.home') },
        { hash: '#/games', icon: '🎮', label: I18n.t('nav.games') },
        { hash: '#/memories', icon: '🖼️', label: I18n.t('nav.memories') },
        { hash: '#/wellness', icon: '🌿', label: I18n.t('nav.wellness') }
      ];

  navEl = document.createElement('nav');
  navEl.className = 'stitch-bottom-nav';
  navEl.setAttribute('aria-label', 'Main Bottom Navigation');
  navEl.innerHTML = navItems.map(item => `
    <a href="${item.hash}" class="stitch-nav-item ${activeHash.startsWith(item.hash) ? 'active' : ''}" data-hash="${item.hash}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
      <span class="nav-dot"></span>
    </a>
  `).join('');

  document.body.appendChild(navEl);
  document.body.classList.add('has-nav');

  navEl.querySelectorAll('.stitch-nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = btn.dataset.hash;
    });
  });
}

// --- Persistent Floating Saathi Mascot with .pulse-halo ---
function renderFloatingSaathi() {
  if (floatingMascotEl) floatingMascotEl.remove();
  if (!Auth.isLoggedIn()) return;

  floatingMascotEl = document.createElement('button');
  floatingMascotEl.className = 'saathi-floating-trigger pulse-halo';
  floatingMascotEl.id = 'floating-saathi-btn';
  floatingMascotEl.setAttribute('aria-label', 'Open Saathi Voice & Memory Companion');
  floatingMascotEl.title = 'Saathi AI Companion';
  floatingMascotEl.innerHTML = '🤖';

  floatingMascotEl.addEventListener('click', () => {
    toggleSaathiDrawer(true);
  });

  document.body.appendChild(floatingMascotEl);
}

// --- Slide-out Saathi Drawer with Speech & TTS ---
let saathiDrawerOpen = false;
let saathiMessages = [];

function toggleSaathiDrawer(open) {
  saathiDrawerOpen = open;
  if (!saathiDrawerEl) {
    renderSaathiDrawer();
  }
  const overlay = document.getElementById('saathi-drawer-overlay');
  if (overlay) {
    if (open) {
      overlay.classList.add('open');
      const input = overlay.querySelector('#saathi-text-input');
      if (input) setTimeout(() => input.focus(), 300);
    } else {
      overlay.classList.remove('open');
    }
  }
}
window.toggleSaathiDrawer = toggleSaathiDrawer;

function renderSaathiDrawer() {
  const existing = document.getElementById('saathi-drawer-overlay');
  if (existing) existing.remove();

  if (saathiMessages.length === 0) {
    saathiMessages.push({
      sender: 'saathi',
      text: I18n.t('saathi.welcome')
    });
  }

  saathiDrawerEl = document.createElement('div');
  saathiDrawerEl.id = 'saathi-drawer-overlay';
  saathiDrawerEl.className = `saathi-drawer-overlay ${saathiDrawerOpen ? 'open' : ''}`;
  saathiDrawerEl.innerHTML = `
    <div class="saathi-drawer" role="dialog" aria-labelledby="saathi-drawer-title">
      <!-- Drawer Header -->
      <div class="saathi-drawer-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; color: var(--maroon); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; box-shadow: var(--shadow-sm);">
            🤖
          </div>
          <div>
            <h2 id="saathi-drawer-title" style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #FFFFFF;">
              ${I18n.t('saathi.title')}
            </h2>
            <p style="margin: 0; font-size: 0.8rem; color: #FCD34D;">
              ${I18n.t('saathi.badge')}
            </p>
          </div>
        </div>
        <button id="btn-close-saathi-drawer" class="btn-icon" style="background: transparent; border: none; color: #FFFFFF; font-size: 1.5rem; cursor: pointer;" aria-label="Close Saathi Drawer">
          ✕
        </button>
      </div>

      <!-- Messages Conversation Container -->
      <div id="saathi-messages-box" class="saathi-drawer-messages">
        ${saathiMessages.map((m, idx) => `
          <div style="display: flex; flex-direction: column; align-items: ${m.sender === 'user' ? 'flex-end' : 'flex-start'};">
            <div style="max-width: 85%; padding: 0.85rem 1rem; border-radius: 18px; font-size: 0.98rem; line-height: 1.5; ${
              m.sender === 'user'
                ? 'background: #800020; color: #FFFFFF; border-bottom-right-radius: 4px;'
                : 'background: #FFFFFF; color: #1F2937; border: 1.5px solid #E5E7EB; border-bottom-left-radius: 4px; box-shadow: var(--shadow-sm);'
            }">
              ${m.text}
            </div>
            ${m.sender === 'saathi' ? `
              <button class="btn-speak-msg" data-idx="${idx}" style="background: transparent; border: none; color: #64748B; font-size: 0.85rem; font-weight: 700; cursor: pointer; margin-top: 4px; display: inline-flex; align-items: center; gap: 0.25rem;">
                🔊 Listen
              </button>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Quick Suggested Question Chips -->
      <div style="padding: 0.5rem 0.85rem 0 0.85rem; background: #FFFFFF; border-top: 1px solid #E5E7EB;">
        <div class="saathi-chips-scroll">
          <button class="saathi-chip" data-query="When is my morning medicine scheduled?">
            ${I18n.t('saathi.quick_meds')}
          </button>
          <button class="saathi-chip" data-query="How do I use Emergency SOS?">
            ${I18n.t('saathi.quick_sos')}
          </button>
          <button class="saathi-chip" data-query="Tell me about Bamboo Sequence game">
            ${I18n.t('saathi.quick_game')}
          </button>
          <button class="saathi-chip" data-query="Give me a good thought for today">
            ${I18n.t('saathi.quick_tips')}
          </button>
        </div>
      </div>

      <!-- Input Footer -->
      <div class="saathi-drawer-footer">
        <div class="saathi-input-row">
          <button id="btn-saathi-mic" class="btn-icon" style="width: 48px; height: 48px; border-radius: 50%; background: #F3F4F6; border: 1.5px solid #D1D5DB; font-size: 1.3rem; cursor: pointer;" title="Speak to Saathi">
            🎤
          </button>
          <input type="text" id="saathi-text-input" class="form-input" placeholder="${I18n.t('saathi.placeholder')}" style="flex: 1; height: 48px; font-size: 1rem; border-radius: 999px; padding: 0 1rem;" />
          <button id="btn-saathi-send" class="btn btn-primary" style="height: 48px; padding: 0 1.25rem; border-radius: 999px; background: #800020; font-weight: 800;">
            ${I18n.t('saathi.send')}
          </button>
        </div>
        <div style="font-size: 0.8rem; color: #64748B; text-align: center;">
          ${I18n.t('saathi.voice_note')}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(saathiDrawerEl);

  // Close drawer on overlay click or button click
  saathiDrawerEl.querySelector('#btn-close-saathi-drawer').addEventListener('click', () => {
    toggleSaathiDrawer(false);
  });
  saathiDrawerEl.addEventListener('click', (e) => {
    if (e.target === saathiDrawerEl) toggleSaathiDrawer(false);
  });

  // Attach speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = saathiDrawerEl.querySelector('#btn-saathi-mic');
  let saathiRec = null;

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (!SpeechRecognition) {
        if (window.SmritiToast) window.SmritiToast.show('Speech recognition not supported in this browser', 'info');
        return;
      }
      try {
        if (saathiRec) {
          saathiRec.stop();
          saathiRec = null;
          micBtn.style.background = '#F3F4F6';
          return;
        }
        saathiRec = new SpeechRecognition();
        saathiRec.continuous = false;
        saathiRec.interimResults = false;
        saathiRec.lang = I18n.lang === 'hi' ? 'hi-IN' : I18n.lang === 'bn' ? 'bn-IN' : I18n.lang === 'as' ? 'as-IN' : 'en-IN';
        
        micBtn.style.background = '#FECDD3';
        saathiRec.onresult = (ev) => {
          const txt = ev.results[0][0].transcript;
          micBtn.style.background = '#F3F4F6';
          sendSaathiMessage(txt);
        };
        saathiRec.onerror = () => { micBtn.style.background = '#F3F4F6'; };
        saathiRec.onend = () => { micBtn.style.background = '#F3F4F6'; };
        saathiRec.start();
      } catch (err) {
        console.warn('Saathi mic error:', err);
      }
    });
  }

  // Handle message sending
  const inputEl = saathiDrawerEl.querySelector('#saathi-text-input');
  const sendBtn = saathiDrawerEl.querySelector('#btn-saathi-send');

  const onSend = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    sendSaathiMessage(text);
  };

  if (sendBtn) sendBtn.addEventListener('click', onSend);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onSend();
    });
  }

  // Quick chips
  saathiDrawerEl.querySelectorAll('.saathi-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      sendSaathiMessage(q);
    });
  });

  // TTS buttons on messages
  saathiDrawerEl.querySelectorAll('.btn-speak-msg').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      const m = saathiMessages[idx];
      if (m && m.text) TTS.speak(m.text);
    });
  });
}

async function sendSaathiMessage(text) {
  if (!text) return;
  saathiMessages.push({ sender: 'user', text });
  renderSaathiDrawer();

  // Scroll to bottom
  const msgBox = document.getElementById('saathi-messages-box');
  if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;

  // Assistant response placeholder
  const botIdx = saathiMessages.length;
  saathiMessages.push({ sender: 'saathi', text: '...' });
  renderSaathiDrawer();

  try {
    let accumulatedText = '';
    await AIService.streamChatWithSmriti(
      text,
      (token, isFinal) => {
        accumulatedText += token;
        saathiMessages[botIdx].text = accumulatedText;
        const currentBox = document.getElementById('saathi-messages-box');
        if (currentBox) {
          const lastMsg = currentBox.querySelector('div:last-child div');
          if (lastMsg) lastMsg.textContent = accumulatedText;
          currentBox.scrollTop = currentBox.scrollHeight;
        }
        if (isFinal) {
          renderSaathiDrawer();
          TTS.speak(accumulatedText);
        }
      },
      (toolCall) => {
        if (toolCall.name === 'startGame') {
          setTimeout(() => {
            toggleSaathiDrawer(false);
            window.location.hash = `#/games/${toolCall.args.gameId}`;
          }, 1200);
        } else if (toolCall.name === 'triggerSOS') {
          setTimeout(() => {
            toggleSaathiDrawer(false);
            showQuickHelpModal();
          }, 1200);
        }
      }
    );
  } catch (err) {
    const fallback = AIService.chatWithSmriti(text);
    saathiMessages[botIdx].text = fallback;
    renderSaathiDrawer();
    TTS.speak(fallback);
  }
}

// --- Main Router Navigation Handler ---
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

  // Cleanup active view
  if (currentCleanup) {
    try {
      if (typeof currentCleanup === 'function') currentCleanup();
      else if (currentCleanup.cleanup) currentCleanup.cleanup();
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
    currentCleanup = null;
  }

  // Auth Guard
  if (!route || (route.auth && !Auth.isLoggedIn())) {
    if (window.location.hash !== '#/login') {
      window.location.hash = '#/login';
      return;
    }
    route = routes['#/login'];
  }

  // Redirect logged in user from login
  if (hash === '#/login' && Auth.isLoggedIn()) {
    const user = Auth.getUser();
    const target = (user && user.role === 'caregiver') ? '#/dashboard' : '#/home';
    window.location.hash = target;
    return;
  }

  // Role routing checks
  if (hash === '#/home' && Auth.isLoggedIn()) {
    const user = Auth.getUser();
    if (user && user.role === 'caregiver') {
      window.location.hash = '#/dashboard';
      return;
    } else if (user && user.role === 'doctor') {
      window.location.hash = '#/doctor';
      return;
    }
  }

  if (!route) {
    route = routes['#/login'];
  }

  // DOM Mount Construction
  const root = document.getElementById('root');
  if (!root) return;
  root.innerHTML = '';

  // Render Header
  if (route.auth && Auth.isLoggedIn()) {
    renderHeader();
  }

  // Content Container
  contentEl = document.createElement('main');
  contentEl.id = 'page-content';
  contentEl.setAttribute('role', 'main');
  root.appendChild(contentEl);

  // Render Page Content
  try {
    currentCleanup = route.page(contentEl);
  } catch (err) {
    console.error('Page render error:', err);
    contentEl.innerHTML = `<div class="container" style="color:red;padding:2rem;"><h3>Error rendering page</h3><p>${err.message}</p></div>`;
  }

  // Render Bottom Navigation & Floating Saathi
  if (route.nav && Auth.isLoggedIn()) {
    renderNav(hash);
    renderFloatingSaathi();
  } else {
    if (navEl) navEl.remove();
    if (floatingMascotEl) floatingMascotEl.remove();
    document.body.classList.remove('has-nav');
  }
}

// --- App Bootstrapping ---
function init() {
  I18n.init();
  Toast.init();
  ReminderScheduler.init();

  window.addEventListener('hashchange', navigate);

  // Reactive Language Event Handlers for zero-reload live re-render
  const handleLangRefresh = () => {
    // Add smooth in-place transition class to content container
    if (contentEl) {
      contentEl.classList.remove('lang-transition-active');
      void contentEl.offsetWidth; // Trigger DOM reflow for CSS animation restart
      contentEl.classList.add('lang-transition-active');
    }

    I18n.updateAllText();
    renderHeader();
    const hash = window.location.hash || '#/home';
    const route = routes[hash];
    if (route && route.nav && Auth.isLoggedIn()) {
      renderNav(hash);
    }
    // Re-render Saathi drawer if initialized
    if (saathiDrawerEl) {
      renderSaathiDrawer();
    }
    // Instantly re-render active page content with new language in-place without modifying window.location
    if (route && contentEl && typeof route.page === 'function') {
      try {
        if (currentCleanup) {
          if (typeof currentCleanup === 'function') currentCleanup();
          else if (typeof currentCleanup.cleanup === 'function') currentCleanup.cleanup();
          currentCleanup = null;
        }
        contentEl.innerHTML = '';
        currentCleanup = route.page(contentEl);
      } catch (e) {
        console.warn('Page re-render on language change error:', e);
      }
    }

    setTimeout(() => {
      if (contentEl) contentEl.classList.remove('lang-transition-active');
    }, 300);
  };

  window.addEventListener('smriti:languageChanged', handleLangRefresh);
  window.addEventListener('languageChanged', handleLangRefresh);

  // Synchronize dynamic header redeemed badge and coins across tabs/components
  const handleRewardRedeemed = () => {
    Coins.updateBadge();
    renderHeader();
  };
  window.addEventListener('smriti:rewardRedeemed', handleRewardRedeemed);
  window.addEventListener('storage', (e) => {
    if (e.key === 'smriti_reward_redeemed' || e.key === 'smriti_coins') {
      handleRewardRedeemed();
    }
  });

  navigate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
