/* ============================================================
   SMRITI — Settings & App Preferences
   Language selection, profile overview, demo reset & customization
   ============================================================ */

import Storage from '../storage.js';
import I18n from '../i18n.js';
import Auth from '../auth.js';

export default function SettingsPage(container) {
  const user = Storage.getUser();
  const languages = I18n.getAvailableLanguages();
  const currentLang = I18n.lang;

  container.innerHTML = `
    <div class="settings-container container page-enter" style="max-width: 600px; padding: 20px; padding-bottom: 2.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h2 style="color: var(--maroon); margin: 0; font-size: 1.8rem;">⚙️ Settings & Preferences</h2>
        <button class="btn btn-ghost btn-sm" onclick="window.history.back()">⬅ Back</button>
      </div>

      <!-- Profile Summary -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 12px; font-size: 1.25rem;">👤 Profile Details</h3>
        ${user ? `
          <div style="font-size: 1.05rem; color: var(--gray-700); margin-bottom: 8px;"><strong>Name:</strong> ${user.name}</div>
          <div style="font-size: 1.05rem; color: var(--gray-700); margin-bottom: 8px;"><strong>Phone:</strong> ${user.phone}</div>
          <div style="font-size: 1.05rem; color: var(--gray-700); margin-bottom: 8px;"><strong>Role:</strong> <span style="background: #E6F4F1; color: var(--teal-dark); padding: 3px 10px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; text-transform: capitalize;">${user.role}</span></div>
        ` : `<div style="color: #666;">Guest / Not signed in.</div>`}
      </div>

      <!-- App Language -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 10px; font-size: 1.25rem;">🌐 App Language</h3>
        <select id="lang-select" class="form-select" style="font-size: 1.1rem;">
          ${languages.map(l => `
            <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.name}</option>
          `).join('')}
        </select>
        <p class="text-muted" style="font-size: 0.85rem; margin-top: 8px; margin-bottom: 0;">Updates game titles, instructions, and companion speech text.</p>
      </div>

      <!-- Voice-First Guidance & Spoken Audio -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 8px; font-size: 1.25rem;">🎙️ Voice Guidance & Spoken Companion</h3>
        <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 12px;">Make the app speak instructions, give encouraging feedback, and navigate by voice.</p>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-weight: 600; color: var(--gray-700);">Enable Voice Guidance</span>
            <input type="checkbox" id="toggle-voice-enabled" style="width: 22px; height: 22px; cursor: pointer;" />
          </label>

          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 0.95rem; color: var(--gray-700);">Auto-Read Game Instructions</span>
            <input type="checkbox" id="toggle-voice-instructions" style="width: 22px; height: 22px; cursor: pointer;" />
          </label>

          <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
            <span style="font-size: 0.95rem; color: var(--gray-700);">Voice Feedback on Game Finish</span>
            <input type="checkbox" id="toggle-voice-feedback" style="width: 22px; height: 22px; cursor: pointer;" />
          </label>

          <div style="margin-top: 0.35rem;">
            <button id="btn-test-voice" class="btn btn-outline btn-sm" style="width: 100%;">
              🔊 Test Spoken Voice
            </button>
          </div>
        </div>
      </div>

      <!-- Cultural Personalisation -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 8px; font-size: 1.25rem;">🎨 Cultural Personalisation</h3>
        <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 12px;">Customize native place, favorite foods, festivals, and memory notes.</p>
        <button class="btn btn-gold btn-block" onclick="window.location.hash='#/personalisation'">
          ✏️ Edit Personalisation Notes
        </button>
      </div>

      <!-- Hackathon Demo Preset Button -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem; background: #F0FDF4; border: 2px solid #86EFAC;">
        <h3 style="color: #065F46; margin-top: 0; margin-bottom: 6px; font-size: 1.25rem;">🌟 Hackathon Demo Preset</h3>
        <p style="color: #166534; font-size: 0.9rem; margin-bottom: 12px;">
          Instantly populates realistic demo records (sample games, mood checks, medicines, emergency contacts, reminders) for testing.
        </p>
        <button id="btn-reset-demo" class="btn btn-secondary btn-block" style="background: #059669;">
          🔄 Load Full Demo Preset
        </button>
      </div>

      <!-- Logout -->
      <button id="btn-logout" class="btn btn-outline btn-block" style="border-color: var(--maroon); color: var(--maroon);">
        🚪 Logout
      </button>
    </div>
  `;

  // Event handlers
  const voiceSettings = Storage.getVoiceSettings();
  const toggleVoiceEnabled = container.querySelector('#toggle-voice-enabled');
  const toggleVoiceInstructions = container.querySelector('#toggle-voice-instructions');
  const toggleVoiceFeedback = container.querySelector('#toggle-voice-feedback');
  const btnTestVoice = container.querySelector('#btn-test-voice');

  if (toggleVoiceEnabled) {
    toggleVoiceEnabled.checked = voiceSettings.voiceGuidanceEnabled !== false;
    toggleVoiceEnabled.addEventListener('change', (e) => {
      voiceSettings.voiceGuidanceEnabled = e.target.checked;
      Storage.setVoiceSettings(voiceSettings);
    });
  }

  if (toggleVoiceInstructions) {
    toggleVoiceInstructions.checked = voiceSettings.autoReadInstructions !== false;
    toggleVoiceInstructions.addEventListener('change', (e) => {
      voiceSettings.autoReadInstructions = e.target.checked;
      Storage.setVoiceSettings(voiceSettings);
    });
  }

  if (toggleVoiceFeedback) {
    toggleVoiceFeedback.checked = voiceSettings.voiceFeedback !== false;
    toggleVoiceFeedback.addEventListener('change', (e) => {
      voiceSettings.voiceFeedback = e.target.checked;
      Storage.setVoiceSettings(voiceSettings);
    });
  }

  if (btnTestVoice) {
    btnTestVoice.addEventListener('click', () => {
      TTS.speak("Hello! I am Smriti, your daily voice companion. I am here to guide you with love and patience.");
    });
  }

  const langSelect = container.querySelector('#lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      I18n.setLanguage(e.target.value);
      if (window.SmritiToast) {
        window.SmritiToast.show('Language changed to ' + e.target.options[e.target.selectedIndex].text, 'info');
      }
    });
  }

  const demoBtn = container.querySelector('#btn-reset-demo');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      Storage.resetDemoData();
      if (window.SmritiToast) {
        window.SmritiToast.show('Full Demo Preset Loaded! Explore all features.', 'success');
      }
      setTimeout(() => {
        window.location.hash = '#/home';
      }, 700);
    });
  }

  const logoutBtn = container.querySelector('#btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.logout();
      window.location.hash = '#/login';
    });
  }

  return { cleanup() {} };
}
