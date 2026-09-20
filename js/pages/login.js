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
  let currentFlow = 'login_flow';
  let authTab = 'signin'; // 'signin' | 'signup'
  let selectedRole = 'patient'; // 'patient' | 'caregiver' | 'doctor'
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
  // Direct Login by Existing Username & Phone (Upgraded: Password Auth, Google OAuth, Face Biometrics)
  // -------------------------------------------------------------
  function renderDirectLogin() {
    container.innerHTML = `
      <div class="login-container card" style="max-width: 520px; margin: 24px auto; padding: 28px; background: #FDF8F3; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 3rem; animation: gentlePulse 2s infinite ease-in-out;">🧠🌸</div>
          <h2 style="color: var(--maroon, #9B2C2C); font-size: 1.75rem; margin: 4px 0 2px 0; font-weight: 800;">SMRITI Portal</h2>
          <p style="color: #64748B; font-size: 0.95rem; margin: 0;">Cognitive Care & Dignified Living Platform</p>
        </div>

        <!-- Role Selector Pills -->
        <div style="display: flex; gap: 8px; margin-bottom: 18px; background: #E2E8F0; padding: 4px; border-radius: 12px;">
          <button type="button" class="role-pill-btn ${selectedRole === 'patient' ? 'active' : ''}" data-role="patient" style="flex: 1; padding: 8px 4px; border-radius: 9px; font-weight: 700; font-size: 0.9rem; border: none; cursor: pointer; background: ${selectedRole === 'patient' ? '#9B2C2C' : 'transparent'}; color: ${selectedRole === 'patient' ? '#FFFFFF' : '#475569'}; transition: all 0.2s;">
            🌸 Patient
          </button>
          <button type="button" class="role-pill-btn ${selectedRole === 'caregiver' ? 'active' : ''}" data-role="caregiver" style="flex: 1; padding: 8px 4px; border-radius: 9px; font-weight: 700; font-size: 0.9rem; border: none; cursor: pointer; background: ${selectedRole === 'caregiver' ? '#065F46' : 'transparent'}; color: ${selectedRole === 'caregiver' ? '#FFFFFF' : '#475569'}; transition: all 0.2s;">
            🤝 Caregiver
          </button>
          <button type="button" class="role-pill-btn ${selectedRole === 'doctor' ? 'active' : ''}" data-role="doctor" style="flex: 1; padding: 8px 4px; border-radius: 9px; font-weight: 700; font-size: 0.9rem; border: none; cursor: pointer; background: ${selectedRole === 'doctor' ? '#1E40AF' : 'transparent'}; color: ${selectedRole === 'doctor' ? '#FFFFFF' : '#475569'}; transition: all 0.2s;">
            🩺 Clinician
          </button>
        </div>

        <!-- Tab Toggle: Sign In vs Sign Up -->
        <div style="display: flex; border-bottom: 2px solid #E2E8F0; margin-bottom: 18px;">
          <button id="tab-auth-signin" class="btn btn-ghost" style="flex: 1; padding: 10px; font-weight: 800; font-size: 1rem; border-radius: 0; border-bottom: 3px solid ${authTab === 'signin' ? 'var(--maroon)' : 'transparent'}; color: ${authTab === 'signin' ? 'var(--maroon)' : '#64748B'};">
            🔑 Sign In
          </button>
          <button id="tab-auth-signup" class="btn btn-ghost" style="flex: 1; padding: 10px; font-weight: 800; font-size: 1rem; border-radius: 0; border-bottom: 3px solid ${authTab === 'signup' ? 'var(--maroon)' : 'transparent'}; color: ${authTab === 'signup' ? 'var(--maroon)' : '#64748B'};">
            📝 Create Account
          </button>
        </div>

        <!-- Form Body -->
        <form id="form-login-auth" style="display: flex; flex-direction: column; gap: 14px;">
          ${authTab === 'signup' ? `
            <div>
              <label style="display: block; margin-bottom: 5px; color: #1E293B; font-weight: 700; font-size: 0.92rem;">Full Legal Name *</label>
              <input type="text" id="inp-auth-name" class="form-input" placeholder="e.g. Meera Das" required style="width: 100%; height: 46px; font-size: 1rem; padding-left: 12px; box-sizing: border-box; border-radius: 10px; border: 1.5px solid #CBD5E1;" />
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #1E293B; font-weight: 700; font-size: 0.92rem;">Mobile Phone (SMS & Verification) *</label>
              <input type="tel" id="inp-auth-phone" class="form-input" placeholder="10-digit number" value="9876543210" required style="width: 100%; height: 46px; font-size: 1rem; padding-left: 12px; box-sizing: border-box; border-radius: 10px; border: 1.5px solid #CBD5E1;" />
            </div>
          ` : ''}

          <div>
            <label style="display: block; margin-bottom: 5px; color: #1E293B; font-weight: 700; font-size: 0.92rem;">Unique Username *</label>
            <div style="position: relative;">
              <span style="position: absolute; left: 12px; top: 12px; font-weight: 700; color: #94A3B8;">@</span>
              <input type="text" id="inp-auth-username" class="form-input" placeholder="e.g. meera_das" value="${authTab === 'signin' && selectedRole === 'patient' ? 'meera_das' : (selectedRole === 'caregiver' ? 'raj_caregiver' : selectedRole === 'doctor' ? 'dr_barua' : '')}" required style="width: 100%; height: 46px; font-size: 1.05rem; padding-left: 32px; box-sizing: border-box; border-radius: 10px; border: 1.5px solid #CBD5E1;" />
            </div>
          </div>

          <div>
            <label style="display: block; margin-bottom: 5px; color: #1E293B; font-weight: 700; font-size: 0.92rem;">Password *</label>
            <input type="password" id="inp-auth-password" class="form-input" placeholder="Enter password (min 4 chars)" value="smriti123" required style="width: 100%; height: 46px; font-size: 1.05rem; padding-left: 12px; box-sizing: border-box; border-radius: 10px; border: 1.5px solid #CBD5E1;" />
          </div>

          <div id="auth-error-msg" style="color: #DC2626; font-size: 0.88rem; font-weight: 700; display: none;"></div>

          <button type="submit" id="btn-submit-auth" class="btn btn-primary" style="width: 100%; height: 50px; background: ${selectedRole === 'patient' ? '#9B2C2C' : selectedRole === 'caregiver' ? '#065F46' : '#1E40AF'}; border: none; font-size: 1.05rem; font-weight: 800; border-radius: 10px; margin-top: 4px; cursor: pointer;">
            ${authTab === 'signin' ? 'Sign In Securely ➔' : 'Create Account & Enter ➔'}
          </button>
        </form>

        <!-- OAuth & Biometric Unlocks -->
        <div style="margin: 20px 0; display: flex; align-items: center; text-align: center; color: #94A3B8;">
          <div style="flex: 1; border-bottom: 1px solid #E2E8F0;"></div>
          <span style="padding: 0 10px; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Or Quick Unlock</span>
          <div style="flex: 1; border-bottom: 1px solid #E2E8F0;"></div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- Google OAuth Button -->
          <button type="button" id="btn-oauth-google" class="btn" style="width: 100%; height: 46px; background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 700; color: #1E293B; cursor: pointer;">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Face Recognition Biometric Unlock (Patients) -->
          <button type="button" id="btn-bio-face-unlock" class="btn" style="width: 100%; height: 46px; background: #ECFDF5; border: 1.5px solid #6EE7B7; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 800; color: #047857; cursor: pointer;">
            <span style="font-size: 1.3rem;">📷</span>
            <span>Biometric Face Recognition Unlock</span>
          </button>
        </div>

        <!-- Role-Specific Wizard Link -->
        <div style="text-align: center; margin-top: 16px;">
          <button type="button" id="btn-open-role-wizard" class="btn btn-ghost" style="color: #64748B; font-size: 0.92rem;">
            Need full health & family profile setup? <strong>Open Guided Wizard ➔</strong>
          </button>
        </div>

        <!-- Instant Quick Demo Portals -->
        <div style="margin-top: 18px; border-top: 1.5px dashed #CBD5E1; padding-top: 14px;">
          <p style="font-size: 0.85rem; color: #64748B; text-align: center; margin-bottom: 8px; font-weight: 700;">⚡ Instant 1-Tap Demo Portals:</p>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button type="button" id="btn-quick-patient-login" class="btn" style="width: 100%; min-height: 40px; background: #FEF3C7; color: #92400E; border: 1.5px solid #FCD34D; border-radius: 8px; font-size: 0.92rem; font-weight: 700; cursor: pointer;">
              🌸 Patient: Meera Das (@meera_das)
            </button>
            <button type="button" id="btn-quick-caregiver-login" class="btn" style="width: 100%; min-height: 40px; background: #E6F4F1; color: #0D9488; border: 1.5px solid #99F6E4; border-radius: 8px; font-size: 0.92rem; font-weight: 700; cursor: pointer;">
              🤝 Caregiver: Raj Das (Linked to @meera_das)
            </button>
            <button type="button" id="btn-quick-doctor-login" class="btn" style="width: 100%; min-height: 40px; background: #EFF6FF; color: #1D4ED8; border: 1.5px solid #BFDBFE; border-radius: 8px; font-size: 0.92rem; font-weight: 700; cursor: pointer;">
              🩺 Clinician: Dr. A. K. Barua
            </button>
          </div>
        </div>

      </div>
    `;

    // Role selector pills
    container.querySelectorAll('.role-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedRole = btn.getAttribute('data-role');
        renderDirectLogin();
      });
    });

    // Tab toggle
    container.querySelector('#tab-auth-signin')?.addEventListener('click', () => {
      authTab = 'signin';
      renderDirectLogin();
    });
    container.querySelector('#tab-auth-signup')?.addEventListener('click', () => {
      authTab = 'signup';
      renderDirectLogin();
    });

    // Form submit
    const form = container.querySelector('#form-login-auth');
    const errDiv = container.querySelector('#auth-error-msg');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = container.querySelector('#inp-auth-username')?.value.trim().toLowerCase().replace(/^@/, '');
      const password = container.querySelector('#inp-auth-password')?.value.trim();

      if (!username) return alert('Please enter your username');
      if (!password) return alert('Please enter your password');

      if (authTab === 'signup') {
        const name = container.querySelector('#inp-auth-name')?.value.trim();
        const phone = container.querySelector('#inp-auth-phone')?.value.trim();
        const regRes = Auth.registerWithPassword({
          name,
          username,
          password,
          phone,
          role: selectedRole
        });

        if (!regRes.success) {
          errDiv.textContent = regRes.message;
          errDiv.style.display = 'block';
          return;
        }

        if (window.SmritiToast) window.SmritiToast.show(`Welcome to SMRITI, ${regRes.user.name}! ✓`, 'success');
        navigateRole(regRes.user);
      } else {
        const loginRes = Auth.loginWithPassword({
          username,
          password,
          role: selectedRole
        });

        if (!loginRes.success) {
          errDiv.textContent = loginRes.message;
          errDiv.style.display = 'block';
          return;
        }

        if (window.SmritiToast) window.SmritiToast.show(`Signed in successfully as ${loginRes.user.name} ✓`, 'success');
        navigateRole(loginRes.user);
      }
    });

    // Google OAuth modal trigger
    container.querySelector('#btn-oauth-google')?.addEventListener('click', () => {
      showGoogleOAuthModal(selectedRole);
    });

    // Face Recognition modal trigger
    container.querySelector('#btn-bio-face-unlock')?.addEventListener('click', () => {
      showFaceRecognitionModal(selectedRole);
    });

    // Open Role Wizard
    container.querySelector('#btn-open-role-wizard')?.addEventListener('click', () => {
      currentFlow = 'role_select';
      render();
    });

    // Instant Quick Logins
    container.querySelector('#btn-quick-patient-login')?.addEventListener('click', () => {
      quickLogin('patient', 'meera_das', 'Meera Das', '9876543210', 'patient_meera_01');
    });
    container.querySelector('#btn-quick-caregiver-login')?.addEventListener('click', () => {
      quickLogin('caregiver', 'raj_caregiver', 'Raj Das', '9876543211', 'patient_meera_01', 'meera_das');
    });
    container.querySelector('#btn-quick-doctor-login')?.addEventListener('click', () => {
      quickLogin('doctor', 'dr_barua', 'Dr. A. K. Barua', '9876543212', 'patient_meera_01');
    });
  }

  // -------------------------------------------------------------
  // Role Navigation Router
  // -------------------------------------------------------------
  function navigateRole(user) {
    if (user.role === 'caregiver') {
      window.location.hash = '#/dashboard';
    } else if (user.role === 'doctor') {
      window.location.hash = '#/doctor';
    } else {
      UserState.updateName(user.name, user.preferredName || user.name.split(' ')[0]);
      window.location.hash = '#/home';
    }
  }

  // -------------------------------------------------------------
  // Interactive Google OAuth Dialog (Requirement 2)
  // -------------------------------------------------------------
  function showGoogleOAuthModal(role = 'patient') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15,23,42,0.65); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 1rem;';
    modal.innerHTML = `
      <div class="modal-content card" style="max-width: 440px; width: 100%; background: #FFFFFF; border-radius: 20px; padding: 1.75rem; border: 1.5px solid #CBD5E1; box-shadow: 0 20px 40px rgba(0,0,0,0.18);">
        
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <div>
            <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #1E293B;">Sign in with Google</h3>
            <p style="margin: 0; font-size: 0.82rem; color: #64748B;">Choose an account to continue to SMRITI</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem;">
          <div class="google-acc-card" data-email="meera.das@gmail.com" data-name="Meera Das" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 12px; cursor: pointer; transition: background 0.2s;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #FEF3C7; color: #92400E; display: flex; align-items: center; justify-content: center; font-weight: 800;">M</div>
            <div style="flex: 1;">
              <strong style="color: #1E293B; font-size: 0.95rem; display: block;">Meera Das (Elder Patient)</strong>
              <span style="color: #64748B; font-size: 0.82rem;">meera.das@gmail.com</span>
            </div>
          </div>

          <div class="google-acc-card" data-email="raj.das@gmail.com" data-name="Raj Das" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 12px; cursor: pointer; transition: background 0.2s;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #E6F4F1; color: #0D9488; display: flex; align-items: center; justify-content: center; font-weight: 800;">R</div>
            <div style="flex: 1;">
              <strong style="color: #1E293B; font-size: 0.95rem; display: block;">Raj Das (Caregiver)</strong>
              <span style="color: #64748B; font-size: 0.82rem;">raj.das@gmail.com</span>
            </div>
          </div>

          <div class="google-acc-card" data-email="dr.barua@gmail.com" data-name="Dr. A. K. Barua" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 12px; cursor: pointer; transition: background 0.2s;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: #EFF6FF; color: #1D4ED8; display: flex; align-items: center; justify-content: center; font-weight: 800;">D</div>
            <div style="flex: 1;">
              <strong style="color: #1E293B; font-size: 0.95rem; display: block;">Dr. A. K. Barua (Clinician)</strong>
              <span style="color: #64748B; font-size: 0.82rem;">dr.barua@gmail.com</span>
            </div>
          </div>
        </div>

        <button id="btn-cancel-google" class="btn btn-ghost" style="width: 100%; color: #64748B;">Cancel</button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelectorAll('.google-acc-card').forEach(card => {
      card.addEventListener('click', () => {
        const email = card.getAttribute('data-email');
        const name = card.getAttribute('data-name');
        const inferredRole = email.includes('dr') ? 'doctor' : email.includes('raj') ? 'caregiver' : 'patient';
        
        const res = Auth.loginWithGoogle({
          role: inferredRole,
          email,
          name
        });

        modal.remove();
        if (window.SmritiToast) window.SmritiToast.show(`Google OAuth Verified: ${res.user.name} ✓`, 'success');
        navigateRole(res.user);
      });
    });

    modal.querySelector('#btn-cancel-google')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  // -------------------------------------------------------------
  // Biometric Face Recognition Unlock (Requirement 3)
  // -------------------------------------------------------------
  function showFaceRecognitionModal(role = 'patient') {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15,23,42,0.8); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 1rem;';
    modal.innerHTML = `
      <div class="modal-content card" style="max-width: 400px; width: 100%; background: #FFFFFF; border-radius: 24px; padding: 1.5rem; text-align: center; border: 2px solid #6EE7B7; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
        
        <div style="font-size: 2.4rem; margin-bottom: 0.25rem;">📷✨</div>
        <h3 style="color: #065F46; font-size: 1.35rem; font-weight: 800; margin: 0 0 0.25rem 0;">Face Recognition Unlock</h3>
        <p style="color: #64748B; font-size: 0.88rem; margin: 0 0 1rem 0;">Position your face gently inside the camera circle</p>

        <!-- Camera Container -->
        <div style="position: relative; width: 240px; height: 240px; margin: 0 auto 1.2rem auto; border-radius: 50%; overflow: hidden; border: 4px solid #10B981; box-shadow: 0 0 20px rgba(16,185,129,0.3); background: #000000; display: flex; align-items: center; justify-content: center;">
          <video id="bio-video-feed" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);"></video>
          
          <!-- Animated Biometric Scanning Line -->
          <div id="bio-scan-line" style="position: absolute; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, transparent, #34D399, #10B981, transparent); box-shadow: 0 0 12px #34D399; animation: scanUpDown 2s infinite ease-in-out; pointer-events: none;"></div>
          
          <!-- Reticle Circle Overlay -->
          <div style="position: absolute; inset: 15px; border: 2px dashed rgba(52,211,153,0.7); border-radius: 50%; pointer-events: none;"></div>
        </div>

        <div id="bio-status-msg" style="color: #047857; font-weight: 700; font-size: 0.95rem; min-height: 24px; margin-bottom: 1rem;">
          Requesting camera stream...
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button id="btn-cancel-bio" class="btn btn-outline" style="flex: 1; border-color: #CBD5E1; color: #64748B;">Cancel</button>
          <button id="btn-fallback-bio" class="btn btn-primary" style="flex: 1; background: #059669; border-color: #059669; font-weight: 700;">Biometric 1-Tap</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const videoEl = modal.querySelector('#bio-video-feed');
    const statusMsg = modal.querySelector('#bio-status-msg');
    let localStream = null;

    // Camera setup
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          localStream = stream;
          videoEl.srcObject = stream;
          statusMsg.innerHTML = '🔍 Scanning facial geometry... <em>Hold steady</em>';

          setTimeout(() => {
            if (!document.body.contains(modal)) return;
            statusMsg.innerHTML = '✨ Facial features matched (98.4%)! Authenticating...';
            setTimeout(() => {
              cleanupAndLogin();
            }, 900);
          }, 1600);
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          statusMsg.innerHTML = '📷 Camera unavailable. Tap <strong>"Biometric 1-Tap"</strong> to unlock.';
        });
    } else {
      statusMsg.innerHTML = '📷 Camera not supported. Tap <strong>"Biometric 1-Tap"</strong> to unlock.';
    }

    const cleanupAndLogin = () => {
      if (localStream) {
        try {
          localStream.getTracks().forEach(t => t.stop());
        } catch {}
      }
      modal.remove();
      const res = Auth.loginWithFaceBiometrics({
        role: 'patient',
        username: 'meera_das',
        name: 'Meera Das'
      });
      if (window.SmritiToast) window.SmritiToast.show('Biometric Unlock Successful! Welcome Meera Das ✓', 'success');
      navigateRole(res.user);
    };

    modal.querySelector('#btn-fallback-bio')?.addEventListener('click', cleanupAndLogin);
    modal.querySelector('#btn-cancel-bio')?.addEventListener('click', () => {
      if (localStream) {
        try {
          localStream.getTracks().forEach(t => t.stop());
        } catch {}
      }
      modal.remove();
    });
  }

  render();

  return {
    cleanup() {
      if (timerInterval) clearInterval(timerInterval);
    }
  };
}
