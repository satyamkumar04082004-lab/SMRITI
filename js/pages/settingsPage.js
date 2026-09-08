/* ============================================================
   SMRITI — Settings & App Preferences
   Language selection, profile overview, demo reset & customization
   ============================================================ */

import Storage from '../storage.js';
import I18n from '../i18n.js';
import Auth from '../auth.js';
import TTS from '../tts.js';
import UserState from '../userState.js';

export default function SettingsPage(container) {
  let user = UserState.getUser() || { name: 'Meera Das', phone: '9876543210', role: 'patient', age: 72 };
  let emergency = Storage.getEmergencyContacts();
  const languages = I18n.getAvailableLanguages();
  const currentLang = I18n.lang;
  let isEditingProfile = false;

  function render() {
    const isHi = I18n.lang === 'hi';
    const isAs = I18n.lang === 'as';

    container.innerHTML = `
    <div class="settings-container container page-enter" style="max-width: 600px; padding: 20px; padding-bottom: 2.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h2 style="color: var(--maroon); margin: 0; font-size: 1.8rem;">⚙️ ${I18n.t('settingsTitle')} & ${I18n.t('settings') || 'Preferences'}</h2>
        <button class="btn btn-ghost btn-sm" onclick="window.history.back()">⬅ ${I18n.t('back')}</button>
      </div>

      <!-- Profile & Personal Info Section -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="color: var(--maroon); margin: 0; font-size: 1.25rem;">👤 ${I18n.t('settingsProfile') || 'Personal & Care Details'}</h3>
          <button id="btn-toggle-edit-profile" class="btn btn-secondary btn-sm">
            ${isEditingProfile ? ('✖ ' + I18n.t('cancel')) : ('✏️ ' + (isHi ? 'विवरण बदलें' : (isAs ? 'তথ্য সম্পাদনা' : 'Edit Info')))}
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
        <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 10px; font-size: 1.25rem;">🌐 ${I18n.t('settingsLanguage')}</h3>
        <select id="lang-select" class="form-select" style="font-size: 1.1rem;">
          ${languages.map(l => `
            <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.name}</option>
          `).join('')}
        </select>
        <p class="text-muted" style="font-size: 0.85rem; margin-top: 8px; margin-bottom: 0;">Updates game titles, instructions, and companion speech text.</p>
      </div>

      <!-- Voice-First Guidance & Spoken Audio -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 8px; font-size: 1.25rem;">🎙️ ${I18n.t('voiceGuide')}</h3>
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

      <!-- Family & Familiar Faces Management (Item 7) -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h3 style="color: var(--maroon); margin: 0; font-size: 1.25rem;">👨‍👩‍👧 Family & Familiar Faces</h3>
            <p class="text-muted" style="font-size: 0.85rem; margin: 0.2rem 0 0 0;">Manage real loved ones used in the Familiar Faces game and quick calls.</p>
          </div>
          <button id="btn-add-family-member" class="btn btn-secondary btn-sm">+ Add Loved One</button>
        </div>

        <!-- Add/Edit Family Member Form (Toggleable) -->
        <div id="panel-family-form" style="display: none; background: #FFFDF9; border: 1.5px dashed var(--teal); border-radius: 14px; padding: 1rem; margin-bottom: 1rem;">
          <h4 id="family-form-title" style="margin: 0 0 0.75rem 0; color: var(--teal-dark); font-size: 1.1rem;">✨ Add Family Member</h4>
          <form id="form-family-member" style="display: flex; flex-direction: column; gap: 0.75rem;">
            <input type="hidden" id="fam-member-id" value="" />
            <input type="hidden" id="fam-member-photo-data" value="" />

            <!-- Profile Picture Section with Circular Avatar Placeholder -->
            <div style="background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 12px; padding: 12px; text-align: center;">
              <label class="form-label" style="font-size: 0.95rem; font-weight: 700; color: var(--teal-dark); margin-bottom: 8px; display: block; text-align: left;">
                📸 Add Profile Picture
              </label>
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 10px;">
                <div id="fam-avatar-preview-box" style="width: 84px; height: 84px; border-radius: 50%; border: 3px solid var(--teal, #0D9488); background: #E6F4F1; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <span id="fam-avatar-default-icon">👤</span>
                  <img id="fam-avatar-preview-img" src="" alt="Avatar" style="display: none; width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <span style="font-size: 0.75rem; color: var(--gray-500); margin-top: 4px;">Photo Preview</span>
              </div>
              <label for="fam-member-photo-input" class="btn btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; padding: 6px 12px; font-weight: 700; border-radius: 8px; font-size: 0.85rem; width: 100%;">
                📁 Upload Profile Photo
              </label>
              <input type="file" id="fam-member-photo-input" accept="image/*" style="display: none;" />
              <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 4px;">Images remain safely on device (never displayed as raw URLs)</div>
            </div>

            <div>
              <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Full Name *</label>
              <input type="text" id="fam-member-name" class="form-input" placeholder="e.g. Raj Das" required />
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <div style="flex: 1;">
                <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Relation *</label>
                <input type="text" id="fam-member-relation" class="form-input" placeholder="e.g. Son" required />
              </div>
              <div style="flex: 1;">
                <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Phone Number</label>
                <input type="tel" id="fam-member-phone" class="form-input" placeholder="+91..." />
              </div>
            </div>
            <div>
              <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Memory Cue / Clue</label>
              <input type="text" id="fam-member-cue" class="form-input" placeholder="e.g. Brings hot tea on Sunday mornings" />
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.25rem;">
              <button type="button" id="btn-cancel-family-form" class="btn btn-ghost btn-sm">Cancel</button>
              <button type="submit" class="btn btn-primary btn-sm">Save Member</button>
            </div>
          </form>
        </div>

        <!-- Family Members List -->
        <div id="settings-family-list" style="display: flex; flex-direction: column; gap: 0.65rem;">
          ${(Storage.getFamilyMembers() || []).map(fm => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0.9rem; background: #FFFDF9; border: 1px solid #E2E8F0; border-radius: 12px;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="font-size: 1.8rem; background: #F3E8DC; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  ${fm.photo ? `<img src="${fm.photo}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />` : (fm.emoji || '👤')}
                </div>
                <div>
                  <div style="font-weight: 700; color: var(--maroon); font-size: 1.05rem;">${fm.name}</div>
                  <div style="font-size: 0.85rem; color: var(--teal-dark); font-weight: 600;">${fm.relation} ${fm.phone ? `• ${fm.phone}` : ''}</div>
                  ${fm.memoryCue ? `<div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 2px;">💡 ${fm.memoryCue}</div>` : ''}
                </div>
              </div>
              <div style="display: flex; gap: 0.4rem;">
                <button class="btn btn-outline btn-sm btn-edit-family" data-id="${fm.id}" style="padding: 0.3rem 0.6rem; font-size: 0.85rem;">✏️</button>
                <button class="btn btn-ghost btn-sm btn-delete-family" data-id="${fm.id}" style="padding: 0.3rem 0.6rem; font-size: 0.85rem; color: #DC2626;">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Cultural Personalisation -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem;">
        <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 8px; font-size: 1.25rem;">🎨 ${I18n.t('persTitle')}</h3>
        <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 12px;">Customize native place, favorite foods, festivals, and memory notes.</p>
        <button class="btn btn-gold btn-block" onclick="window.location.hash='#/personalisation'">
          ✏️ Edit Personalisation Notes
        </button>
      </div>



      <!-- Logout -->
      <button id="btn-logout" class="btn btn-outline btn-block" style="border-color: var(--maroon); color: var(--maroon);">
        🚪 ${I18n.t('logout')}
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

        // Update reactive global UserState so name changes instantly update across all components
        UserState.updateName(name, name.split(' ')[0] || name);

        emergency = {
          ...emergency,
          primaryName: emgName || emergency.primaryName,
          primaryPhone: emgPhone || emergency.primaryPhone,
          doctorName: docName || emergency.doctorName,
          doctorPhone: docPhone || emergency.doctorPhone
        };
        Storage.setEmergencyContacts(emergency);

        // Dispatch profile update event so any open screens/headers refresh immediately
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: { user, prefs: Storage.getPreferences() } }));

        isEditingProfile = false;
        if (window.SmritiToast) {
          window.SmritiToast.show('Personal details saved successfully! ✨', 'success');
        }
        render();
      });
    }

    // Family Member Form Toggle & Submit
    const btnAddFam = container.querySelector('#btn-add-family-member');
    const panelFamForm = container.querySelector('#panel-family-form');
    const btnCancelFam = container.querySelector('#btn-cancel-family-form');
    const formFam = container.querySelector('#form-family-member');

    if (btnAddFam && panelFamForm) {
      btnAddFam.addEventListener('click', () => {
        container.querySelector('#family-form-title').textContent = '✨ Add Family Member';
        container.querySelector('#fam-member-id').value = '';
        container.querySelector('#fam-member-name').value = '';
        container.querySelector('#fam-member-relation').value = '';
        container.querySelector('#fam-member-phone').value = '';
        container.querySelector('#fam-member-cue').value = '';
        container.querySelector('#fam-member-photo-data').value = '';
        const prevImg = container.querySelector('#fam-avatar-preview-img');
        const defIcon = container.querySelector('#fam-avatar-default-icon');
        if (prevImg && defIcon) {
          prevImg.src = '';
          prevImg.style.display = 'none';
          defIcon.style.display = 'block';
        }
        panelFamForm.style.display = panelFamForm.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (btnCancelFam && panelFamForm) {
      btnCancelFam.addEventListener('click', () => {
        panelFamForm.style.display = 'none';
      });
    }

    if (formFam) {
      formFam.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = container.querySelector('#fam-member-id').value.trim();
        const name = container.querySelector('#fam-member-name').value.trim();
        const relation = container.querySelector('#fam-member-relation').value.trim();
        const phone = container.querySelector('#fam-member-phone').value.trim();
        const cue = container.querySelector('#fam-member-cue').value.trim();

        if (!name || !relation) return;

        const photo = container.querySelector('#fam-member-photo-data').value.trim();
        if (id) {
          Storage.updateFamilyMember(id, { name, relation, phone, memoryCue: cue, ...(photo ? { photo } : {}) });
          if (window.SmritiToast) window.SmritiToast.show(`${name} updated successfully! 🌸`, 'success');
        } else {
          Storage.addFamilyMember({
            name,
            relation,
            phone,
            memoryCue: cue,
            photo: photo || null,
            emoji: '👤'
          });
          if (window.SmritiToast) window.SmritiToast.show(`${name} added to family! 🌸`, 'success');
        }
        render();
      });
    }

    // Edit Family Member
    container.querySelectorAll('.btn-edit-family').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const member = (Storage.getFamilyMembers() || []).find(m => m.id === id);
        if (member && panelFamForm) {
          panelFamForm.style.display = 'block';
          container.querySelector('#family-form-title').textContent = `✏️ Edit ${member.name}`;
          container.querySelector('#fam-member-id').value = member.id;
          container.querySelector('#fam-member-name').value = member.name;
          container.querySelector('#fam-member-relation').value = member.relation;
          container.querySelector('#fam-member-phone').value = member.phone || '';
          container.querySelector('#fam-member-cue').value = member.memoryCue || '';
          const photoData = container.querySelector('#fam-member-photo-data');
          const prevImg = container.querySelector('#fam-avatar-preview-img');
          const defIcon = container.querySelector('#fam-avatar-default-icon');
          if (photoData) photoData.value = member.photo || '';
          if (prevImg && defIcon) {
            if (member.photo) {
              prevImg.src = member.photo;
              prevImg.style.display = 'block';
              defIcon.style.display = 'none';
            } else {
              prevImg.src = '';
              prevImg.style.display = 'none';
              defIcon.style.display = 'block';
            }
          }
          panelFamForm.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });


    const photoFileInput = container.querySelector('#fam-member-photo-input');
    if (photoFileInput) {
      photoFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            const photoHidden = container.querySelector('#fam-member-photo-data');
            const prevImg = container.querySelector('#fam-avatar-preview-img');
            const defIcon = container.querySelector('#fam-avatar-default-icon');
            if (photoHidden) photoHidden.value = dataUrl;
            if (prevImg && defIcon) {
              prevImg.src = dataUrl;
              prevImg.style.display = 'block';
              defIcon.style.display = 'none';
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Delete Family Member
    container.querySelectorAll('.btn-delete-family').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this family member?')) {
          Storage.deleteFamilyMember(id);
          if (window.SmritiToast) window.SmritiToast.show('Family member removed.', 'info');
          render();
        }
      });
    });
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



    const logoutBtn = container.querySelector('#btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
        window.location.hash = '#/login';
        window.location.reload();
      });
    }
  }

  const onLangChange = () => {
    render();
  };
  window.addEventListener('languageChanged', onLangChange);

  render();

  return {
    cleanup() {
      window.removeEventListener('languageChanged', onLangChange);
    }
  };
}
