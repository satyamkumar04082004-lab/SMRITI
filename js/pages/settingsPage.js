/* ============================================================
   SMRITI — Settings & App Preferences
   Language selection, profile overview, demo reset & customization
   ============================================================ */

import Storage from '../storage.js';
import I18n from '../i18n.js';
import Auth from '../auth.js';
import TTS from '../tts.js';

export default function SettingsPage(container) {
  let user = Storage.getUser() || { name: 'Meera Das', phone: '9876543210', role: 'patient', age: 72 };
  let emergency = Storage.getEmergencyContacts();
  const languages = I18n.getAvailableLanguages();
  const currentLang = I18n.lang;
  let isEditingProfile = false;

  function render() {
    container.innerHTML = `
    <div class="settings-container container page-enter" style="max-width: 600px; padding: 20px; padding-bottom: 2.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h2 style="color: var(--maroon); margin: 0; font-size: 1.8rem;">⚙️ Settings & Preferences</h2>
        <button class="btn btn-ghost btn-sm" onclick="window.history.back()">⬅ Back</button>
      </div>

      <!-- Profile & Personal Info Section -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="color: var(--maroon); margin: 0; font-size: 1.25rem;">👤 Personal & Care Details</h3>
          <button id="btn-toggle-edit-profile" class="btn btn-secondary btn-sm">
            ${isEditingProfile ? '✖ Cancel' : '✏️ Edit Info'}
          </button>
        </div>

        ${!isEditingProfile ? `
          <!-- Read-only View -->
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 1.05rem; color: var(--gray-700);">
            <div><strong>Name:</strong> ${user.name}</div>
            <div><strong>Age:</strong> ${user.age || '72'} years</div>
            <div><strong>Phone:</strong> ${user.phone}</div>
            <div><strong>Role:</strong> <span style="background: #E6F4F1; color: var(--teal-dark); padding: 3px 10px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; text-transform: capitalize;">${user.role}</span></div>
            <div style="border-top: 1px dashed #E2E8F0; margin-top: 6px; padding-top: 8px;">
              <div style="font-size: 0.9rem; color: var(--gray-500); margin-bottom: 4px;">EMERGENCY & MEDICAL CONTACTS:</div>
              <div><strong>Primary Contact:</strong> ${emergency.primaryName} (${emergency.primaryPhone})</div>
              <div><strong>Doctor:</strong> ${emergency.doctorName} (${emergency.doctorPhone})</div>
            </div>
          </div>
        ` : `
          <!-- Edit Form -->
          <form id="form-edit-profile" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label class="form-label" style="font-weight: 600;">Your Full Name</label>
              <input type="text" id="input-prof-name" class="form-input" value="${user.name || ''}" required />
            </div>

            <div style="display: flex; gap: 12px;">
              <div style="flex: 1;">
                <label class="form-label" style="font-weight: 600;">Age</label>
                <input type="number" id="input-prof-age" class="form-input" value="${user.age || 72}" min="40" max="120" />
              </div>
              <div style="flex: 1;">
                <label class="form-label" style="font-weight: 600;">Role</label>
                <select id="select-prof-role" class="form-select">
                  <option value="patient" ${user.role === 'patient' ? 'selected' : ''}>Elder / Patient</option>
                  <option value="caregiver" ${user.role === 'caregiver' ? 'selected' : ''}>Caregiver / Family</option>
                </select>
              </div>
            </div>

            <div>
              <label class="form-label" style="font-weight: 600;">Phone Number</label>
              <input type="tel" id="input-prof-phone" class="form-input" value="${user.phone || ''}" required />
            </div>

            <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; margin-top: 4px;">
              <h4 style="margin: 0 0 8px 0; color: #DC2626; font-size: 1.05rem;">🛟 Emergency Contacts</h4>
              
              <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                <input type="text" id="input-prof-emg-name" class="form-input" style="flex: 1;" placeholder="Primary Contact Name" value="${emergency.primaryName || ''}" />
                <input type="tel" id="input-prof-emg-phone" class="form-input" style="flex: 1;" placeholder="Phone" value="${emergency.primaryPhone || ''}" />
              </div>

              <div style="display: flex; gap: 10px;">
                <input type="text" id="input-prof-doc-name" class="form-input" style="flex: 1;" placeholder="Doctor Name" value="${emergency.doctorName || ''}" />
                <input type="tel" id="input-prof-doc-phone" class="form-input" style="flex: 1;" placeholder="Doctor Phone" value="${emergency.doctorPhone || ''}" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="margin-top: 6px; min-height: 48px; font-size: 1.05rem;">
              💾 Save Personal Information
            </button>
          </form>
        `}
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

    attachEvents();
  }

  function attachEvents() {
    // Profile Edit Toggle
    const btnToggleEdit = container.querySelector('#btn-toggle-edit-profile');
    if (btnToggleEdit) {
      btnToggleEdit.addEventListener('click', () => {
        isEditingProfile = !isEditingProfile;
        render();
      });
    }

    // Profile Form Save
    const formEdit = container.querySelector('#form-edit-profile');
    if (formEdit) {
      formEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = container.querySelector('#input-prof-name').value.trim();
        const age = parseInt(container.querySelector('#input-prof-age').value.trim(), 10) || 72;
        const role = container.querySelector('#select-prof-role').value;
        const phone = container.querySelector('#input-prof-phone').value.trim();

        const emgName = container.querySelector('#input-prof-emg-name').value.trim();
        const emgPhone = container.querySelector('#input-prof-emg-phone').value.trim();
        const docName = container.querySelector('#input-prof-doc-name').value.trim();
        const docPhone = container.querySelector('#input-prof-doc-phone').value.trim();

        if (!name || !phone) {
          alert('Please enter your name and phone number.');
          return;
        }

        user = { ...user, name, age, role, phone };
        Storage.setUser(user);

        emergency = {
          ...emergency,
          primaryName: emgName || emergency.primaryName,
          primaryPhone: emgPhone || emergency.primaryPhone,
          doctorName: docName || emergency.doctorName,
          doctorPhone: docPhone || emergency.doctorPhone
        };
        Storage.setEmergencyContacts(emergency);

        isEditingProfile = false;
        if (window.SmritiToast) {
          window.SmritiToast.show('Personal details saved successfully! ✨', 'success');
        }
        render();
      });
    }

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
  }

  render();

  return { cleanup() {} };
}
