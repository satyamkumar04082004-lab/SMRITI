/* ============================================================
   SMRITI — Multi-Role Authentication & Role-Specific Wizards
   Three distinct, isolated registration & onboarding flows:
   1. Patient Signup: Standard demographic, cognitive & cultural data
   2. Caregiver Signup: Nested attached patient details & username linking
   3. Doctor Signup: Clinician credentials & patient username linking
   ============================================================ */

import Storage from '../storage.js';
import I18n from '../i18n.js';
import Auth from '../auth.js';
import UserState from '../userState.js';

export default function Login(container) {
  // Mode: 'role_select' | 'patient_flow' | 'caregiver_flow' | 'doctor_flow' | 'login_flow'
  let currentFlow = 'role_select';
  let flowStep = 1;

  // Shared / Role-specific Registration State
  const regState = {
    // Role
    role: 'patient', // 'patient' | 'caregiver' | 'doctor'
    
    // User Identity
    name: '',
    username: '',
    phone: '',
    
    // Patient Specific Fields
    preferredName: '',
    gender: 'Female',
    age: 72,
    stage: 'Mild MCI',
    conditions: 'Mild Cognitive Impairment (MCI), Mild Hypertension',
    allergies: 'Penicillin',
    nativePlace: 'Guwahati, Assam',
    regionalState: 'Assam',
    primaryLanguage: 'Assamese',
    favoriteFood: 'Warm Assam ginger tea, Coconut Pitha',
    dietType: 'Vegetarian with fish',
    emergencyPhone: '9876543210',
    emergencyContactName: 'Raj Das (Son)',
    firstFamName: 'Raj Das',
    firstFamRelation: 'Son',
    firstFamPhoto: '',
    firstFamCue: 'Your loving eldest son who visits on weekends.',

    // Caregiver Specific Fields (Attached Patient Info)
    caregiverRelation: 'Son / Daughter',
    linkedPatientUsername: '',
    patientIntro: 'Independent with daily prompts, enjoys gardening and quiet mornings.',
    patientConditions: 'Mild Cognitive Impairment (MCI)',
    patientPrescriptions: 'Ecosprin 75mg (Morning), Multivitamin (Afternoon)',
    patientCareRequirements: 'Morning medicine reminder, hydration tracking, evening family call',
    patientCulturalState: 'Assam',

    // Doctor Specific Fields
    hospitalClinic: 'Guwahati Neurological Care Center',
    specialization: 'Neurologist / Geriatric Specialist',
    licenseNumber: 'MCI-84920'
  };

  let otpData = null;
  let timerInterval = null;

  function render() {
    if (currentFlow === 'role_select') {
      renderRoleSelect();
    } else if (currentFlow === 'patient_flow') {
      renderPatientFlow();
    } else if (currentFlow === 'caregiver_flow') {
      renderCaregiverFlow();
    } else if (currentFlow === 'doctor_flow') {
      renderDoctorFlow();
    } else if (currentFlow === 'login_flow') {
      renderDirectLogin();
    }
  }

  // -------------------------------------------------------------
  // 1. Role Selection Screen (Role-Specific Gateway)
  // -------------------------------------------------------------
  function renderRoleSelect() {
    container.innerHTML = `
      <div class="login-container card" style="max-width: 520px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 3.2rem;">🧠🌸</div>
          <h2 style="color: var(--maroon, #9B2C2C); font-size: 1.8rem; margin: 6px 0 2px 0; font-weight: 800;">SMRITI Platform</h2>
          <p style="color: #4B5563; font-size: 1.05rem;">Cognitive Care & Dignified Living</p>
          <div style="display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; margin-top: 4px;">
            Choose Your Profile Type
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
          <!-- Patient Option -->
          <div class="role-select-card" data-role="patient" style="display: flex; align-items: center; gap: 16px; padding: 16px; background: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; cursor: pointer; transition: all 0.2s ease;">
            <div style="font-size: 2.4rem; background: #FFF7ED; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
              🌸
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0; color: #9B2C2C; font-size: 1.2rem; font-weight: 800;">Elderly / Patient</h3>
              <p style="margin: 3px 0 0 0; color: #64748B; font-size: 0.92rem;">Daily mindful memory games, calm routine guidance & AI companion.</p>
            </div>
            <div style="color: #9B2C2C; font-size: 1.3rem;">➔</div>
          </div>

          <!-- Caregiver Option -->
          <div class="role-select-card" data-role="caregiver" style="display: flex; align-items: center; gap: 16px; padding: 16px; background: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; cursor: pointer; transition: all 0.2s ease;">
            <div style="font-size: 2.4rem; background: #ECFDF5; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
              🤝
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0; color: #065F46; font-size: 1.2rem; font-weight: 800;">Caregiver / Family</h3>
              <p style="margin: 3px 0 0 0; color: #64748B; font-size: 0.92rem;">Link attached elder by username, monitor reminders, mood & clinical reports.</p>
            </div>
            <div style="color: #065F46; font-size: 1.3rem;">➔</div>
          </div>

          <!-- Doctor Option -->
          <div class="role-select-card" data-role="doctor" style="display: flex; align-items: center; gap: 16px; padding: 16px; background: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 14px; cursor: pointer; transition: all 0.2s ease;">
            <div style="font-size: 2.4rem; background: #EFF6FF; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
              🩺
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0; color: #1E40AF; font-size: 1.2rem; font-weight: 800;">Doctor / Clinician</h3>
              <p style="margin: 3px 0 0 0; color: #64748B; font-size: 0.92rem;">Search patients by unique username, inspect 7 cognitive domains & add remarks.</p>
            </div>
            <div style="color: #1E40AF; font-size: 1.3rem;">➔</div>
          </div>
        </div>

        <div style="text-align: center; border-top: 1.5px solid #E2E8F0; padding-top: 18px;">
          <button id="btn-show-login-flow" class="btn btn-ghost" style="color: #4B5563; font-weight: 600; font-size: 1rem;">
            Already have an account? <strong>Sign In with Username & Phone</strong>
          </button>
        </div>

        <!-- Quick Demo Portals -->
        <div style="margin-top: 20px; border-top: 1.5px dashed #CBD5E1; padding-top: 16px;">
          <p style="font-size: 0.88rem; color: #64748B; text-align: center; margin-bottom: 10px; font-weight: 700;">⚡ Instant Quick Demo Sign-Ins:</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="btn-quick-patient" class="btn" style="width: 100%; min-height: 44px; background: #FEF3C7; color: #92400E; border: 1.5px solid #FCD34D; border-radius: 8px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
              🌸 Patient: Meera Das (@meera_das)
            </button>
            <button id="btn-quick-caregiver" class="btn" style="width: 100%; min-height: 44px; background: #E6F4F1; color: #0D9488; border: 1.5px solid #99F6E4; border-radius: 8px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
              🤝 Caregiver: Raj Das (Linked to @meera_das)
            </button>
            <button id="btn-quick-doctor" class="btn" style="width: 100%; min-height: 44px; background: #EFF6FF; color: #1D4ED8; border: 1.5px solid #BFDBFE; border-radius: 8px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
              🩺 Clinician: Dr. A. K. Barua
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.role-select-card').forEach(card => {
      card.addEventListener('click', () => {
        const role = card.getAttribute('data-role');
        regState.role = role;
        flowStep = 1;
        if (role === 'patient') currentFlow = 'patient_flow';
        else if (role === 'caregiver') currentFlow = 'caregiver_flow';
        else if (role === 'doctor') currentFlow = 'doctor_flow';
        render();
      });
    });

    container.querySelector('#btn-show-login-flow')?.addEventListener('click', () => {
      currentFlow = 'login_flow';
      render();
    });

    container.querySelector('#btn-quick-patient')?.addEventListener('click', () => {
      quickLogin('patient', 'meera_das', 'Meera Das', '9876543210', 'patient_meera_01');
    });
    container.querySelector('#btn-quick-caregiver')?.addEventListener('click', () => {
      quickLogin('caregiver', 'raj_caregiver', 'Raj Das', '9876543211', 'patient_meera_01', 'meera_das');
    });
    container.querySelector('#btn-quick-doctor')?.addEventListener('click', () => {
      quickLogin('doctor', 'dr_barua', 'Dr. A. K. Barua', '9876543212', 'patient_meera_01');
    });
  }

  function quickLogin(role, username, name, phone, patientId, linkedPatientUsername = null) {
    const userPayload = {
      username,
      name,
      phone,
      role,
      patientId,
      linkedPatientUsername: linkedPatientUsername || (role === 'caregiver' ? 'meera_das' : null)
    };
    Auth.login(userPayload);
    if (role === 'patient') {
      UserState.updateName(name, name.split(' ')[0]);
      window.location.hash = '#/home';
    } else if (role === 'caregiver') {
      window.location.hash = '#/dashboard';
    } else {
      window.location.hash = '#/doctor';
    }
  }

  // -------------------------------------------------------------
  // 2. PATIENT SIGNUP WIZARD (Demographics + Culture + Phone + OTP)
  // -------------------------------------------------------------
  function renderPatientFlow() {
    if (flowStep === 1) {
      // Step 1: Patient Identity & Unique Username
      container.innerHTML = `
        <div class="login-container card" style="max-width: 500px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">🌸👤</div>
            <h2 style="color: var(--maroon); font-size: 1.6rem; margin-top: 5px;">Patient Registration</h2>
            <p style="color: #64748B; font-size: 0.95rem;">Step 1 of 3: Identity & Unique Username</p>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Full Name *</label>
            <input type="text" id="inp-p-name" class="input-field" placeholder="e.g. Meera Das" value="${regState.name}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">
              Unique Username * <span style="font-weight: normal; font-size: 0.85rem; color: #64748B;">(Caregivers & Doctors link using this)</span>
            </label>
            <div style="position: relative;">
              <span style="position: absolute; left: 12px; top: 12px; font-weight: 700; color: #94A3B8;">@</span>
              <input type="text" id="inp-p-username" class="input-field" placeholder="e.g. meera_das" value="${regState.username}" style="width: 100%; padding: 12px 12px 12px 30px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
            </div>
            <div id="username-msg" style="font-size: 0.85rem; margin-top: 4px; display: none;"></div>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Age</label>
              <input type="number" id="inp-p-age" class="input-field" value="${regState.age}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Pet / Calling Name</label>
              <input type="text" id="inp-p-pref" class="input-field" placeholder="e.g. Meera" value="${regState.preferredName}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-role" class="btn btn-outline" style="flex: 1; min-height: 50px;">⬅ Cancel</button>
            <button id="btn-to-p2" class="btn btn-primary" style="flex: 2; min-height: 50px; background: #0D9488; border-color: #0D9488;">Next: Culture & Care ➔</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-role')?.addEventListener('click', () => { currentFlow = 'role_select'; render(); });
      container.querySelector('#btn-to-p2')?.addEventListener('click', () => {
        const name = container.querySelector('#inp-p-name').value.trim();
        const username = container.querySelector('#inp-p-username').value.trim().toLowerCase().replace(/^@/, '');
        const age = parseInt(container.querySelector('#inp-p-age').value) || 72;
        const pref = container.querySelector('#inp-p-pref').value.trim() || name.split(' ')[0];

        if (!name) return alert('Please enter your full name');
        if (!username) return alert('Please choose a unique username');

        // Check if username is already taken
        if (Storage.isUsernameTaken(username)) {
          const msgEl = container.querySelector('#username-msg');
          msgEl.style.display = 'block';
          msgEl.style.color = '#DC2626';
          msgEl.textContent = '❌ This username is already taken. Please choose another.';
          return;
        }

        regState.name = name;
        regState.username = username;
        regState.age = age;
        regState.preferredName = pref;
        flowStep = 2;
        render();
      });

    } else if (flowStep === 2) {
      // Step 2: Regional Culture & Health Details
      container.innerHTML = `
        <div class="login-container card" style="max-width: 500px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">🌺🍵</div>
            <h2 style="color: var(--maroon); font-size: 1.6rem; margin-top: 5px;">Cultural & Health Care</h2>
            <p style="color: #64748B; font-size: 0.95rem;">Step 2 of 3: Personalizing regional stories & reminders</p>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">North Eastern Region *</label>
            <select id="inp-p-region" class="input-field" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem;">
              <option value="Assam" ${regState.regionalState === 'Assam' ? 'selected' : ''}>🌺 Assam</option>
              <option value="Meghalaya" ${regState.regionalState === 'Meghalaya' ? 'selected' : ''}>🌧️ Meghalaya</option>
              <option value="Manipur" ${regState.regionalState === 'Manipur' ? 'selected' : ''}>🪷 Manipur</option>
              <option value="Mizoram" ${regState.regionalState === 'Mizoram' ? 'selected' : ''}>🎋 Mizoram</option>
              <option value="Nagaland" ${regState.regionalState === 'Nagaland' ? 'selected' : ''}>🦅 Nagaland</option>
              <option value="Tripura" ${regState.regionalState === 'Tripura' ? 'selected' : ''}>🏛️ Tripura</option>
              <option value="Arunachal Pradesh" ${regState.regionalState === 'Arunachal Pradesh' ? 'selected' : ''}>🏔️ Arunachal Pradesh</option>
              <option value="Sikkim" ${regState.regionalState === 'Sikkim' ? 'selected' : ''}>🌸 Sikkim</option>
            </select>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Native Hometown</label>
            <input type="text" id="inp-p-hometown" class="input-field" placeholder="e.g. Guwahati, Jorhat" value="${regState.nativePlace}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Memory / Care Stage</label>
            <select id="inp-p-stage" class="input-field" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem;">
              <option value="Mild MCI" ${regState.stage === 'Mild MCI' ? 'selected' : ''}>Early-Stage Mild Cognitive Impairment (MCI)</option>
              <option value="Moderate MCI" ${regState.stage === 'Moderate MCI' ? 'selected' : ''}>Moderate Memory Support</option>
              <option value="Preventative" ${regState.stage === 'Preventative' ? 'selected' : ''}>Healthy Senior / Preventative Mind Care</option>
            </select>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Favorite Comfort Foods / Tea</label>
            <input type="text" id="inp-p-food" class="input-field" placeholder="e.g. Warm ginger tea, Coconut Pitha" value="${regState.favoriteFood}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-p1" class="btn btn-outline" style="flex: 1; min-height: 50px;">⬅ Back</button>
            <button id="btn-to-p3" class="btn btn-primary" style="flex: 2; min-height: 50px; background: #0D9488; border-color: #0D9488;">Next: Phone & Verify ➔</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-p1')?.addEventListener('click', () => { flowStep = 1; render(); });
      container.querySelector('#btn-to-p3')?.addEventListener('click', () => {
        regState.regionalState = container.querySelector('#inp-p-region').value;
        regState.nativePlace = container.querySelector('#inp-p-hometown').value.trim();
        regState.stage = container.querySelector('#inp-p-stage').value;
        regState.favoriteFood = container.querySelector('#inp-p-food').value.trim();
        flowStep = 3;
        render();
      });

    } else if (flowStep === 3) {
      renderPhoneOtpVerification(() => {
        // Completion callback for Patient
        const patientId = 'patient_' + regState.username;
        const userPayload = {
          name: regState.name,
          username: regState.username,
          phone: regState.phone,
          role: 'patient',
          patientId
        };
        Auth.login(userPayload);

        // Save customized patient profile
        const profile = Storage.getPatientProfile(patientId);
        profile.patient = Object.assign(profile.patient || {}, {
          id: patientId,
          name: regState.name,
          preferredName: regState.preferredName,
          age: regState.age,
          phone: regState.phone,
          stage: regState.stage,
          nativePlace: regState.nativePlace,
          state: regState.regionalState,
          diagnosisNotes: `Registered patient stage: ${regState.stage}`
        });
        profile.preferences = Object.assign(profile.preferences || {}, {
          preferredName: regState.preferredName,
          regionalState: regState.regionalState,
          nativePlace: regState.nativePlace,
          foodPreferences: regState.favoriteFood
        });
        profile.coins = 0; // Explicitly initialize 0 coins for new patient signup
        profile.gameHistory = [];
        profile.journeyStats = {
          totalXP: 0,
          streak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          unlockedBadges: []
        };
        Storage.savePatientProfile(profile);
        Storage.setPreferences(profile.preferences);

        UserState.updateName(regState.name, regState.preferredName);
        I18n.applyCulturalTheme(Storage.getLanguage() || 'en');
        window.location.hash = '#/home';
      });
    }
  }

  // -------------------------------------------------------------
  // 3. CAREGIVER SIGNUP WIZARD (Nested Attached Patient Details & Link)
  // -------------------------------------------------------------
  function renderCaregiverFlow() {
    if (flowStep === 1) {
      // Step 1: Caregiver Identity & Linked Patient Username
      container.innerHTML = `
        <div class="login-container card" style="max-width: 520px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">🤝📋</div>
            <h2 style="color: #065F46; font-size: 1.6rem; margin-top: 5px;">Caregiver & Family Registration</h2>
            <p style="color: #64748B; font-size: 0.95rem;">Step 1 of 3: Caregiver Profile & Linking Patient</p>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Your Full Name (Caregiver) *</label>
            <input type="text" id="inp-c-name" class="input-field" placeholder="e.g. Raj Das" value="${regState.name}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Your Caregiver Username *</label>
            <div style="position: relative;">
              <span style="position: absolute; left: 12px; top: 12px; font-weight: 700; color: #94A3B8;">@</span>
              <input type="text" id="inp-c-username" class="input-field" placeholder="e.g. raj_caregiver" value="${regState.username}" style="width: 100%; padding: 12px 12px 12px 30px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
            </div>
          </div>

          <div style="margin-bottom: 18px; background: #F0FDF4; border: 2px solid #86EFAC; border-radius: 12px; padding: 14px;">
            <label style="display: block; margin-bottom: 6px; color: #065F46; font-weight: 800; font-size: 1rem;">
              Attach Patient by Unique Username *
            </label>
            <p style="color: #166534; font-size: 0.85rem; margin: 0 0 8px 0;">Enter the unique username of the patient you care for (e.g. meera_das)</p>
            <div style="position: relative;">
              <span style="position: absolute; left: 12px; top: 12px; font-weight: 700; color: #0D9488;">@</span>
              <input type="text" id="inp-c-link-patient" class="input-field" placeholder="patient_username" value="${regState.linkedPatientUsername || 'meera_das'}" style="width: 100%; padding: 12px 12px 12px 30px; border: 1.5px solid #10B981; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
            </div>
            <div id="patient-link-status" style="margin-top: 6px; font-size: 0.88rem;"></div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Relationship to Patient</label>
            <select id="inp-c-rel" class="input-field" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem;">
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Spouse">Spouse</option>
              <option value="Grandchild">Grandchild</option>
              <option value="Professional Caregiver">Professional Caregiver / ASHA</option>
            </select>
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-role-c" class="btn btn-outline" style="flex: 1; min-height: 50px;">⬅ Cancel</button>
            <button id="btn-to-c2" class="btn btn-primary" style="flex: 2; min-height: 50px; background: #059669; border-color: #059669;">Next: Patient Details Form ➔</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-role-c')?.addEventListener('click', () => { currentFlow = 'role_select'; render(); });
      container.querySelector('#btn-to-c2')?.addEventListener('click', () => {
        const name = container.querySelector('#inp-c-name').value.trim();
        const username = container.querySelector('#inp-c-username').value.trim().toLowerCase().replace(/^@/, '');
        const linkedPatient = container.querySelector('#inp-c-link-patient').value.trim().toLowerCase().replace(/^@/, '');
        const rel = container.querySelector('#inp-c-rel').value;

        if (!name) return alert('Please enter your name');
        if (!username) return alert('Please choose a username');
        if (!linkedPatient) return alert('Please specify the unique username of the patient you care for');

        if (Storage.isUsernameTaken(username)) {
          return alert('This caregiver username is already in use. Please select a different one.');
        }

        regState.name = name;
        regState.username = username;
        regState.linkedPatientUsername = linkedPatient;
        regState.caregiverRelation = rel;
        flowStep = 2;
        render();
      });

    } else if (flowStep === 2) {
      // Step 2: Nested Patient Details (Introduction, Prescriptions, Medical Conditions, Cultural Background, Care Requirements)
      container.innerHTML = `
        <div class="login-container card" style="max-width: 540px; margin: 25px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">🩺📑</div>
            <h2 style="color: #065F46; font-size: 1.55rem; margin-top: 5px;">Patient Care Profile Setup</h2>
            <p style="color: #64748B; font-size: 0.95rem;">Step 2 of 3: Provide clinical & daily care parameters for @${regState.linkedPatientUsername}</p>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; margin-bottom: 5px; color: #2D3748; font-weight: 700; font-size: 0.95rem;">
              1. Patient Introduction & Routine
            </label>
            <textarea id="inp-c-p-intro" class="form-input" rows="2" placeholder="e.g. Independent with prompts, enjoys tea on porch, requires gentle reminders." style="width: 100%; box-sizing: border-box;">${regState.patientIntro}</textarea>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; margin-bottom: 5px; color: #2D3748; font-weight: 700; font-size: 0.95rem;">
              2. Medical Conditions & Diagnoses
            </label>
            <input type="text" id="inp-c-p-cond" class="input-field" placeholder="e.g. Mild Cognitive Impairment, Hypertension" value="${regState.patientConditions}" style="width: 100%; padding: 10px; border: 1.5px solid #CBD5E1; border-radius: 8px; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; margin-bottom: 5px; color: #2D3748; font-weight: 700; font-size: 0.95rem;">
              3. Prescriptions & Medication Schedule
            </label>
            <textarea id="inp-c-p-presc" class="form-input" rows="2" placeholder="e.g. Ecosprin 75mg (Morning with water), Multivitamin (Afternoon)" style="width: 100%; box-sizing: border-box;">${regState.patientPrescriptions}</textarea>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; margin-bottom: 5px; color: #2D3748; font-weight: 700; font-size: 0.95rem;">
              4. Cultural State & Language Background
            </label>
            <select id="inp-c-p-region" class="input-field" style="width: 100%; padding: 10px; border: 1.5px solid #CBD5E1; border-radius: 8px;">
              <option value="Assam" ${regState.patientCulturalState === 'Assam' ? 'selected' : ''}>🌺 Assam</option>
              <option value="Meghalaya" ${regState.patientCulturalState === 'Meghalaya' ? 'selected' : ''}>🌧️ Meghalaya</option>
              <option value="Manipur" ${regState.patientCulturalState === 'Manipur' ? 'selected' : ''}>🪷 Manipur</option>
              <option value="Mizoram" ${regState.patientCulturalState === 'Mizoram' ? 'selected' : ''}>🎋 Mizoram</option>
              <option value="Nagaland" ${regState.patientCulturalState === 'Nagaland' ? 'selected' : ''}>🦅 Nagaland</option>
              <option value="Tripura" ${regState.patientCulturalState === 'Tripura' ? 'selected' : ''}>🏛️ Tripura</option>
              <option value="Arunachal Pradesh" ${regState.patientCulturalState === 'Arunachal Pradesh' ? 'selected' : ''}>🏔️ Arunachal</option>
              <option value="Sikkim" ${regState.patientCulturalState === 'Sikkim' ? 'selected' : ''}>🌸 Sikkim</option>
            </select>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #2D3748; font-weight: 700; font-size: 0.95rem;">
              5. Daily Care & Hydration Requirements
            </label>
            <input type="text" id="inp-c-p-req" class="input-field" placeholder="e.g. 6 glasses of warm water, evening stroll, 8 PM pill reminder" value="${regState.patientCareRequirements}" style="width: 100%; padding: 10px; border: 1.5px solid #CBD5E1; border-radius: 8px; box-sizing: border-box;">
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-c1" class="btn btn-outline" style="flex: 1; min-height: 50px;">⬅ Back</button>
            <button id="btn-to-c3" class="btn btn-primary" style="flex: 2; min-height: 50px; background: #059669; border-color: #059669;">Next: Mobile & Verify ➔</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-c1')?.addEventListener('click', () => { flowStep = 1; render(); });
      container.querySelector('#btn-to-c3')?.addEventListener('click', () => {
        regState.patientIntro = container.querySelector('#inp-c-p-intro').value.trim();
        regState.patientConditions = container.querySelector('#inp-c-p-cond').value.trim();
        regState.patientPrescriptions = container.querySelector('#inp-c-p-presc').value.trim();
        regState.patientCulturalState = container.querySelector('#inp-c-p-region').value;
        regState.patientCareRequirements = container.querySelector('#inp-c-p-req').value.trim();
        flowStep = 3;
        render();
      });

    } else if (flowStep === 3) {
      renderPhoneOtpVerification(() => {
        // Find or create the attached patient profile
        const targetPatientId = 'patient_' + regState.linkedPatientUsername;
        const profile = Storage.getPatientProfile(targetPatientId);

        // Update profile with Caregiver nested inputs
        profile.patient = Object.assign(profile.patient || {}, {
          id: targetPatientId,
          state: regState.patientCulturalState,
          diagnosisNotes: regState.patientIntro,
          caregiverPhone: regState.phone,
          medicalHistory: {
            conditions: regState.patientConditions.split(',').map(s => s.trim()),
            careRequirements: regState.patientCareRequirements
          }
        });

        // Add caregiver to emergency contacts
        profile.emergencyContacts = Object.assign(profile.emergencyContacts || {}, {
          primaryName: regState.name + ' (' + regState.caregiverRelation + ')',
          primaryPhone: regState.phone
        });

        Storage.savePatientProfile(profile);

        const userPayload = {
          name: regState.name,
          username: regState.username,
          phone: regState.phone,
          role: 'caregiver',
          patientId: targetPatientId,
          linkedPatientUsername: regState.linkedPatientUsername
        };

        Auth.login(userPayload);
        window.location.hash = '#/dashboard';
      });
    }
  }

  // -------------------------------------------------------------
  // 4. DOCTOR SIGNUP WIZARD (Minimal Demographics + Patient Search)
  // -------------------------------------------------------------
  function renderDoctorFlow() {
    if (flowStep === 1) {
      container.innerHTML = `
        <div class="login-container card" style="max-width: 500px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">🩺👨‍⚕️</div>
            <h2 style="color: #1E40AF; font-size: 1.6rem; margin-top: 5px;">Clinician Portal Onboarding</h2>
            <p style="color: #64748B; font-size: 0.95rem;">Step 1 of 2: Professional Credentials</p>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Doctor / Clinician Name *</label>
            <input type="text" id="inp-d-name" class="input-field" placeholder="e.g. Dr. A. K. Barua" value="${regState.name || 'Dr. A. K. Barua'}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Unique Doctor Username *</label>
            <div style="position: relative;">
              <span style="position: absolute; left: 12px; top: 12px; font-weight: 700; color: #94A3B8;">@</span>
              <input type="text" id="inp-d-username" class="input-field" placeholder="e.g. dr_barua" value="${regState.username}" style="width: 100%; padding: 12px 12px 12px 30px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Hospital / Clinic</label>
            <input type="text" id="inp-d-clinic" class="input-field" placeholder="e.g. Guwahati Neurological Center" value="${regState.hospitalClinic}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Specialty</label>
            <input type="text" id="inp-d-spec" class="input-field" placeholder="e.g. Neurologist / Geriatrician" value="${regState.specialization}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-role-d" class="btn btn-outline" style="flex: 1; min-height: 50px;">⬅ Cancel</button>
            <button id="btn-to-d2" class="btn btn-primary" style="flex: 2; min-height: 50px; background: #1D4ED8; border-color: #1D4ED8;">Next: Mobile & Verify ➔</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-role-d')?.addEventListener('click', () => { currentFlow = 'role_select'; render(); });
      container.querySelector('#btn-to-d2')?.addEventListener('click', () => {
        const name = container.querySelector('#inp-d-name').value.trim();
        const username = container.querySelector('#inp-d-username').value.trim().toLowerCase().replace(/^@/, '');
        if (!name) return alert('Please enter clinician name');
        if (!username) return alert('Please enter a doctor username');

        if (Storage.isUsernameTaken(username)) {
          return alert('This username is already in use. Please select another.');
        }

        regState.name = name;
        regState.username = username;
        regState.hospitalClinic = container.querySelector('#inp-d-clinic').value.trim();
        regState.specialization = container.querySelector('#inp-d-spec').value.trim();
        flowStep = 2;
        render();
      });

    } else if (flowStep === 2) {
      renderPhoneOtpVerification(() => {
        const userPayload = {
          name: regState.name,
          username: regState.username,
          phone: regState.phone,
          role: 'doctor',
          patientId: 'patient_meera_01' // Default baseline patient for clinical viewing
        };
        Auth.login(userPayload);
        window.location.hash = '#/doctor';
      });
    }
  }

  // -------------------------------------------------------------
  // Shared Phone & OTP Verification Step
  // -------------------------------------------------------------
  function renderPhoneOtpVerification(onSuccess) {
    container.innerHTML = `
      <div class="login-container card" style="max-width: 480px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 2.8rem;">📱🔐</div>
          <h2 style="color: var(--maroon); font-size: 1.55rem; margin-top: 5px;">Mobile Verification</h2>
          <p style="color: #64748B; font-size: 0.95rem;">Protecting your SMRITI account</p>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Mobile Number *</label>
          <input type="tel" id="inp-phone" class="input-field" placeholder="10-digit number" style="width: 100%; padding: 14px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; box-sizing: border-box;" value="${regState.phone || '9876543210'}">
        </div>

        <div id="otp-area" style="display: none; margin-bottom: 16px;">
          <p style="text-align: center; color: #4A5568; margin-bottom: 10px; font-size: 1rem;">Enter the 4-digit code:</p>
          <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 12px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
          </div>
          <div id="otp-toast" style="padding: 10px; background: #E6F4F1; border-left: 4px solid #0D9488; color: #0D9488; font-weight: bold; border-radius: 4px; text-align: center; margin-bottom: 12px;"></div>
        </div>

        <button id="btn-send-otp" class="btn" style="width: 100%; min-height: 52px; background: #0D9488; color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 700; cursor: pointer; margin-bottom: 10px;">
          Send OTP
        </button>
        
        <button id="btn-complete-login" class="btn" style="display: none; width: 100%; min-height: 52px; background: #16A34A; color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 700; cursor: pointer; margin-bottom: 10px;">
          Verify & Enter SMRITI ✨
        </button>

        <button id="btn-back-step" class="btn btn-ghost" style="width: 100%; min-height: 44px; color: #64748B;">
          ⬅ Back
        </button>
      </div>
    `;

    container.querySelector('#btn-back-step')?.addEventListener('click', () => {
      flowStep--;
      render();
    });

    const sendBtn = container.querySelector('#btn-send-otp');
    const completeBtn = container.querySelector('#btn-complete-login');
    const otpArea = container.querySelector('#otp-area');
    const otpToast = container.querySelector('#otp-toast');
    const otpBoxes = container.querySelectorAll('.otp-box');

    otpBoxes.forEach((box, index) => {
      box.addEventListener('input', (e) => {
        if (e.target.value && index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      });
    });

    sendBtn.addEventListener('click', () => {
      const phone = container.querySelector('#inp-phone').value.trim();
      if (!phone || phone.length < 5) return alert('Enter a valid phone number');
      regState.phone = phone;

      otpData = Auth.sendOTP(phone);
      if (otpData.success) {
        otpArea.style.display = 'block';
        otpToast.textContent = 'Demo OTP: ' + otpData.demoOtp;
        sendBtn.style.display = 'none';
        completeBtn.style.display = 'block';
        if (otpBoxes[0]) otpBoxes[0].focus();
      } else {
        alert(otpData.message);
      }
    });

    completeBtn.addEventListener('click', () => {
      const otp = Array.from(otpBoxes).map(b => b.value).join('');
      if (otp.length !== 4) return alert('Please enter the full 4-digit OTP');

      const verifyRes = Auth.verifyOTP(regState.phone, otp);
      if (verifyRes.success) {
        onSuccess();
      } else {
        alert(verifyRes.message);
      }
    });
  }

  // -------------------------------------------------------------
  // Direct Login by Existing Username & Phone
  // -------------------------------------------------------------
  function renderDirectLogin() {
    container.innerHTML = `
      <div class="login-container card" style="max-width: 480px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 2.8rem;">🔐👤</div>
          <h2 style="color: var(--maroon); font-size: 1.6rem; margin-top: 5px;">Sign In to SMRITI</h2>
          <p style="color: #64748B; font-size: 0.95rem;">Enter your unique username and verified phone</p>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Unique Username *</label>
          <div style="position: relative;">
            <span style="position: absolute; left: 12px; top: 12px; font-weight: 700; color: #94A3B8;">@</span>
            <input type="text" id="inp-login-username" class="input-field" placeholder="e.g. meera_das / raj_caregiver" style="width: 100%; padding: 12px 12px 12px 30px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Registered Phone Number *</label>
          <input type="tel" id="inp-login-phone" class="input-field" placeholder="10-digit number" value="9876543210" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
        </div>

        <button id="btn-do-login" class="btn btn-primary" style="width: 100%; min-height: 50px; background: #0D9488; border-color: #0D9488; font-size: 1.1rem; font-weight: 700;">
          Sign In ➔
        </button>

        <div style="text-align: center; margin-top: 16px;">
          <button id="btn-back-to-roles" class="btn btn-ghost" style="color: #64748B;">
            Don't have an account? <strong>Register New Profile</strong>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btn-back-to-roles')?.addEventListener('click', () => {
      currentFlow = 'role_select';
      render();
    });

    container.querySelector('#btn-do-login')?.addEventListener('click', () => {
      const username = container.querySelector('#inp-login-username').value.trim().toLowerCase().replace(/^@/, '');
      const phone = container.querySelector('#inp-login-phone').value.trim();

      if (!username) return alert('Please enter your username');
      if (!phone) return alert('Please enter your phone number');

      const foundUser = Storage.findUserByUsername(username);
      if (foundUser) {
        Auth.login(foundUser);
        if (foundUser.role === 'caregiver') window.location.hash = '#/dashboard';
        else if (foundUser.role === 'doctor') window.location.hash = '#/doctor';
        else {
          UserState.updateName(foundUser.name, foundUser.preferredName || foundUser.name.split(' ')[0]);
          window.location.hash = '#/home';
        }
      } else {
        // Allow fallback or prompt
        const inferredRole = username.includes('caregiver') || username.includes('raj') ? 'caregiver' : username.includes('dr') ? 'doctor' : 'patient';
        const userPayload = {
          name: username.replace(/_/g, ' ').toUpperCase(),
          username,
          phone,
          role: inferredRole,
          patientId: inferredRole === 'patient' ? ('patient_' + username) : 'patient_meera_01'
        };
        Auth.login(userPayload);
        window.location.hash = inferredRole === 'caregiver' ? '#/dashboard' : inferredRole === 'doctor' ? '#/doctor' : '#/home';
      }
    });
  }

  render();

  return {
    cleanup() {
      if (timerInterval) clearInterval(timerInterval);
    }
  };
}
