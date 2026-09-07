import Storage from '../storage.js';
import I18n from '../i18n.js';
import Auth from '../auth.js';
import UserState from '../userState.js';

export default function Login(container) {
  let step = 1;
  
  // Registration / Onboarding state
  const state = {
    name: '',
    preferredName: '',
    role: 'patient',
    phone: '',
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
    firstFamCue: 'Your loving eldest son who visits on weekends.'
  };

  let otpData = null;
  let timerInterval = null;

  function render() {
    if (step === 1) {
      // Step 1: Basic Identity & Role
      container.innerHTML = `
        <div class="login-container card" style="max-width: 480px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 3rem;">🧠🌸</div>
            <h2 style="color: var(--maroon, #9B2C2C); font-size: 1.6rem; margin-top: 5px;">Welcome to SMRITI</h2>
            <p style="color: var(--gray-700, #4A5568); font-size: 1.05rem;">Step 1 of 5: Personal Identity</p>
          </div>

          <div style="margin-bottom: 18px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700; font-size: 1.05rem;">Full Name *</label>
            <input type="text" id="inp-name" class="input-field" placeholder="e.g. Meera Das" style="width: 100%; padding: 14px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; box-sizing: border-box;" value="${state.name}">
          </div>

          <div style="margin-bottom: 18px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700; font-size: 1.05rem;">What do you like to be called? (Preferred / Pet Name)</label>
            <input type="text" id="inp-pref-name" class="input-field" placeholder="e.g. Meera / Maa / Dadu" style="width: 100%; padding: 14px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; box-sizing: border-box;" value="${state.preferredName}">
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Age</label>
              <input type="number" id="inp-age" class="input-field" value="${state.age}" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; box-sizing: border-box;">
            </div>
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Role</label>
              <select id="inp-role" class="input-field" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;">
                <option value="patient" ${state.role === 'patient' ? 'selected' : ''}>Elderly / Patient</option>
                <option value="caregiver" ${state.role === 'caregiver' ? 'selected' : ''}>Caregiver / ASHA</option>
                <option value="doctor" ${state.role === 'doctor' ? 'selected' : ''}>Doctor / Clinician</option>
              </select>
            </div>
          </div>

          <button id="btn-to-step-2" class="btn" style="width: 100%; min-height: 54px; background: #0D9488; color: white; border: none; border-radius: 10px; font-size: 1.15rem; font-weight: 700; cursor: pointer;">
            Next: Health & Care Details ➔
          </button>

          <div style="margin-top: 24px; border-top: 1.5px dashed #CBD5E1; padding-top: 16px; text-align: center;">
            <p style="font-size: 0.9rem; color: #64748B; margin-bottom: 10px; font-weight: 600;">⚡ Instant Quick Demo Portals:</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button id="btn-demo-patient" class="btn" style="width: 100%; min-height: 48px; background: #FEF3C7; color: #92400E; border: 1.5px solid #FCD34D; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer;">
                🌸 Demo Elderly: Meera Das (Assam)
              </button>
              <button id="btn-demo-caregiver" class="btn" style="width: 100%; min-height: 48px; background: #E6F4F1; color: #0D9488; border: 1.5px solid #99F6E4; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer;">
                🤝 Demo Caregiver: Raj Das (Family)
              </button>
              <button id="btn-demo-doctor" class="btn" style="width: 100%; min-height: 48px; background: #EFF6FF; color: #1D4ED8; border: 1.5px solid #BFDBFE; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer;">
                👨‍⚕️ Demo Clinician: Dr. A. K. Barua
              </button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-to-step-2').addEventListener('click', () => {
        state.name = container.querySelector('#inp-name').value.trim();
        state.preferredName = container.querySelector('#inp-pref-name').value.trim() || state.name.split(' ')[0];
        state.age = parseInt(container.querySelector('#inp-age').value) || 72;
        state.role = container.querySelector('#inp-role').value;
        if (!state.name) return alert('Please enter your name');
        step = 2;
        render();
      });

      container.querySelector('#btn-demo-patient').addEventListener('click', () => {
        Auth.login({ name: 'Meera Das', phone: '9876543210', role: 'patient', patientId: 'patient_meera_01' });
        UserState.updateName('Meera Das', 'Meera');
        window.location.hash = '#/home';
      });

      container.querySelector('#btn-demo-caregiver').addEventListener('click', () => {
        Auth.login({ name: 'Raj Das', phone: '9876543210', role: 'caregiver', patientId: 'patient_meera_01' });
        window.location.hash = '#/dashboard';
      });

      container.querySelector('#btn-demo-doctor').addEventListener('click', () => {
        Auth.login({ name: 'Dr. A. K. Barua', phone: '9876543212', role: 'doctor', patientId: 'patient_meera_01' });
        window.location.hash = '#/doctor';
      });

    } else if (step === 2) {
      // Step 2: Medical & Cognitive Stage
      container.innerHTML = `
        <div class="login-container card" style="max-width: 480px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">🩺📋</div>
            <h2 style="color: var(--maroon, #9B2C2C); font-size: 1.5rem; margin-top: 5px;">Care & Clinical Profile</h2>
            <p style="color: var(--gray-700, #4A5568); font-size: 1rem;">Step 2 of 5: Adapting SMRITI to your comfort</p>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Cognitive / Memory Stage</label>
            <select id="inp-stage" class="input-field" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem;">
              <option value="Mild MCI" ${state.stage === 'Mild MCI' ? 'selected' : ''}>Early-Stage Mild Cognitive Impairment (MCI)</option>
              <option value="Moderate MCI" ${state.stage === 'Moderate MCI' ? 'selected' : ''}>Moderate Memory Assistance Needed</option>
              <option value="Preventative" ${state.stage === 'Preventative' ? 'selected' : ''}>Healthy Senior / Preventative Mind Fitness</option>
            </select>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Known Medical Conditions</label>
            <input type="text" id="inp-conditions" class="input-field" placeholder="e.g. Hypertension, Diabetes, MCI" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;" value="${state.conditions}">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Known Allergies (if any)</label>
            <input type="text" id="inp-allergies" class="input-field" placeholder="e.g. Penicillin, Dust" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;" value="${state.allergies}">
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-1" class="btn" style="flex: 1; min-height: 52px; background: transparent; border: 1.5px solid #CBD5E1; color: #475569; border-radius: 10px; font-size: 1.05rem; cursor: pointer; font-weight: 600;">⬅ Back</button>
            <button id="btn-to-step-3" class="btn" style="flex: 2; min-height: 52px; background: #0D9488; color: white; border: none; border-radius: 10px; font-size: 1.1rem; cursor: pointer; font-weight: 700;">Next: Culture & Diet ➔</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-1').addEventListener('click', () => { step = 1; render(); });
      container.querySelector('#btn-to-step-3').addEventListener('click', () => {
        state.stage = container.querySelector('#inp-stage').value;
        state.conditions = container.querySelector('#inp-conditions').value.trim();
        state.allergies = container.querySelector('#inp-allergies').value.trim();
        step = 3;
        render();
      });

    } else if (step === 3) {
      // Step 3: Cultural Background & Dietary Preferences
      container.innerHTML = `
        <div class="login-container card" style="max-width: 480px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">🌺🍵</div>
            <h2 style="color: var(--maroon, #9B2C2C); font-size: 1.5rem; margin-top: 5px;">Cultural & Dietary Roots</h2>
            <p style="color: var(--gray-700, #4A5568); font-size: 1rem;">Step 3 of 5: Personalizing regional stories and memory cues</p>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">North Eastern State / Region *</label>
            <select id="inp-region" class="input-field" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem;">
              <option value="Assam" ${state.regionalState === 'Assam' ? 'selected' : ''}>🌺 Assam</option>
              <option value="Meghalaya" ${state.regionalState === 'Meghalaya' ? 'selected' : ''}>🌧️ Meghalaya</option>
              <option value="Manipur" ${state.regionalState === 'Manipur' ? 'selected' : ''}>🪷 Manipur</option>
              <option value="Mizoram" ${state.regionalState === 'Mizoram' ? 'selected' : ''}>🎋 Mizoram</option>
              <option value="Nagaland" ${state.regionalState === 'Nagaland' ? 'selected' : ''}>🦅 Nagaland</option>
              <option value="Tripura" ${state.regionalState === 'Tripura' ? 'selected' : ''}>🏛️ Tripura</option>
              <option value="Arunachal Pradesh" ${state.regionalState === 'Arunachal Pradesh' ? 'selected' : ''}>🏔️ Arunachal Pradesh</option>
              <option value="Sikkim" ${state.regionalState === 'Sikkim' ? 'selected' : ''}>🌸 Sikkim</option>
            </select>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Native Hometown / Village</label>
            <input type="text" id="inp-hometown" class="input-field" placeholder="e.g. Guwahati, Jorhat, Shillong, Imphal" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;" value="${state.nativePlace}">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Dietary Habits & Comfort Foods</label>
            <input type="text" id="inp-food" class="input-field" placeholder="e.g. Warm ginger tea, Coconut pitha, Fish curry" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;" value="${state.favoriteFood}">
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-2" class="btn" style="flex: 1; min-height: 52px; background: transparent; border: 1.5px solid #CBD5E1; color: #475569; border-radius: 10px; font-size: 1.05rem; cursor: pointer; font-weight: 600;">⬅ Back</button>
            <button id="btn-to-step-4" class="btn" style="flex: 2; min-height: 52px; background: #0D9488; color: white; border: none; border-radius: 10px; font-size: 1.1rem; cursor: pointer; font-weight: 700;">Next: Family & Face ➔</button>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-2').addEventListener('click', () => { step = 2; render(); });
      container.querySelector('#btn-to-step-4').addEventListener('click', () => {
        state.regionalState = container.querySelector('#inp-region').value;
        state.nativePlace = container.querySelector('#inp-hometown').value.trim();
        state.favoriteFood = container.querySelector('#inp-food').value.trim();
        step = 4;
        render();
      });

    } else if (step === 4) {
      // Step 4: First Loved One / Familiar Face
      container.innerHTML = `
        <div class="login-container card" style="max-width: 480px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">👨‍👩‍👧📸</div>
            <h2 style="color: var(--maroon, #9B2C2C); font-size: 1.5rem; margin-top: 5px;">A Familiar Face You Love</h2>
            <p style="color: var(--gray-700, #4A5568); font-size: 1rem;">Step 4 of 5: Setup someone special to practice recognizing</p>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Loved One's Name *</label>
            <input type="text" id="inp-fam-name" class="input-field" placeholder="e.g. Raj Das" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;" value="${state.firstFamName}">
          </div>

          <div style="margin-bottom: 14px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Relationship</label>
            <input type="text" id="inp-fam-rel" class="input-field" placeholder="e.g. Son / Daughter / Grandchild" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;" value="${state.firstFamRelation}">
          </div>

          <div style="margin-bottom: 14px; background: #FFFFFF; padding: 12px; border-radius: 10px; border: 1.5px dashed #CBD5E1;">
            <label style="display: block; margin-bottom: 6px; color: var(--teal-dark, #0F766E); font-weight: 700;">Upload Their Photo</label>
            <input type="file" id="inp-fam-file" accept="image/*" style="width: 100%; font-size: 0.95rem;">
            <div id="fam-preview-box" style="display: ${state.firstFamPhoto ? 'block' : 'none'}; margin-top: 10px; text-align: center;">
              <img id="fam-preview-img" src="${state.firstFamPhoto}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #0D9488; margin: 0 auto;">
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Gentle Memory Cue</label>
            <input type="text" id="inp-fam-cue" class="input-field" placeholder="e.g. Visits on Sundays and brings warm tea" style="width: 100%; padding: 12px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.05rem; box-sizing: border-box;" value="${state.firstFamCue}">
          </div>

          <div style="display: flex; gap: 10px;">
            <button id="btn-back-3" class="btn" style="flex: 1; min-height: 52px; background: transparent; border: 1.5px solid #CBD5E1; color: #475569; border-radius: 10px; font-size: 1.05rem; cursor: pointer; font-weight: 600;">⬅ Back</button>
            <button id="btn-to-step-5" class="btn" style="flex: 2; min-height: 52px; background: #0D9488; color: white; border: none; border-radius: 10px; font-size: 1.1rem; cursor: pointer; font-weight: 700;">Next: Phone & Verify ➔</button>
          </div>
        </div>
      `;

      const fileInp = container.querySelector('#inp-fam-file');
      fileInp.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            state.firstFamPhoto = re.target.result;
            const prevBox = container.querySelector('#fam-preview-box');
            const prevImg = container.querySelector('#fam-preview-img');
            prevImg.src = state.firstFamPhoto;
            prevBox.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });

      container.querySelector('#btn-back-3').addEventListener('click', () => { step = 3; render(); });
      container.querySelector('#btn-to-step-5').addEventListener('click', () => {
        state.firstFamName = container.querySelector('#inp-fam-name').value.trim() || 'Raj Das';
        state.firstFamRelation = container.querySelector('#inp-fam-rel').value.trim() || 'Family Member';
        state.firstFamCue = container.querySelector('#inp-fam-cue').value.trim();
        step = 5;
        render();
      });

    } else if (step === 5) {
      // Step 5: Mobile Number & OTP Verification
      container.innerHTML = `
        <div class="login-container card" style="max-width: 480px; margin: 30px auto; padding: 32px; background: #FDF8F3; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 2.8rem;">📱🔐</div>
            <h2 style="color: var(--maroon, #9B2C2C); font-size: 1.5rem; margin-top: 5px;">Secure Mobile Verification</h2>
            <p style="color: var(--gray-700, #4A5568); font-size: 1rem;">Step 5 of 5: Connect and protect your account</p>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; color: #2D3748; font-weight: 700;">Mobile Number *</label>
            <input type="tel" id="inp-phone" class="input-field" placeholder="10-digit number" style="width: 100%; padding: 14px; border: 1.5px solid #CBD5E1; border-radius: 10px; font-size: 1.1rem; box-sizing: border-box;" value="${state.phone || '9876543210'}">
          </div>

          <div id="otp-area" style="display: none; margin-bottom: 16px;">
            <p style="text-align: center; color: #4A5568; margin-bottom: 10px; font-size: 1.05rem;">Enter the 4-digit code:</p>
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 12px;">
              <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
              <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
              <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
              <input type="text" maxlength="1" class="otp-box input-field" style="width: 52px; height: 52px; text-align: center; font-size: 1.5rem; border: 1.5px solid #CBD5E1; border-radius: 10px;">
            </div>
            <div id="otp-toast" style="padding: 10px; background: #E6F4F1; border-left: 4px solid #0D9488; color: #0D9488; font-weight: bold; border-radius: 4px; text-align: center; margin-bottom: 12px;"></div>
          </div>

          <button id="btn-send-otp" class="btn" style="width: 100%; min-height: 54px; background: #0D9488; color: white; border: none; border-radius: 10px; font-size: 1.15rem; font-weight: 700; cursor: pointer; margin-bottom: 10px;">
            Send OTP
          </button>
          
          <button id="btn-complete-login" class="btn" style="display: none; width: 100%; min-height: 54px; background: #16A34A; color: white; border: none; border-radius: 10px; font-size: 1.15rem; font-weight: 700; cursor: pointer; margin-bottom: 10px;">
            Complete Registration & Enter SMRITI ✨
          </button>

          <button id="btn-back-4" class="btn" style="width: 100%; min-height: 48px; background: transparent; border: none; color: #64748B; font-size: 1.05rem; cursor: pointer;">
            ⬅ Back to Step 4
          </button>
        </div>
      `;

      container.querySelector('#btn-back-4').addEventListener('click', () => { step = 4; render(); });

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
        state.phone = phone;

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

        const verifyRes = Auth.verifyOTP(state.phone, otp);
        if (verifyRes.success) {
          // Persist user and full structured profile
          const patientId = 'patient_' + (state.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'user');
          const userPayload = {
            name: state.name,
            phone: state.phone,
            role: state.role,
            patientId
          };

          Auth.login(userPayload);

          // Update storage patient profile with all wizard inputs
          const profile = Storage.getPatientProfile(patientId);
          profile.patient = Object.assign(profile.patient || {}, {
            id: patientId,
            name: state.name,
            preferredName: state.preferredName,
            age: state.age,
            phone: state.phone,
            stage: state.stage,
            nativePlace: state.nativePlace,
            state: state.regionalState,
            diagnosisNotes: `Onboarded with: ${state.conditions}. Stage: ${state.stage}`
          });

          profile.patient.medicalHistory = {
            conditions: state.conditions.split(',').map(s => s.trim()),
            allergies: state.allergies.split(',').map(s => s.trim())
          };

          profile.patient.culturalBackground = {
            region: state.regionalState,
            hometown: state.nativePlace
          };

          profile.patient.dietaryPreferences = {
            comfortFoods: state.favoriteFood.split(',').map(s => s.trim()),
            dietType: state.dietType
          };

          profile.preferences = Object.assign(profile.preferences || {}, {
            preferredName: state.preferredName,
            regionalState: state.regionalState,
            nativePlace: state.nativePlace,
            foodPreferences: state.favoriteFood
          });

          // Add customized initial familiar face if provided
          if (state.firstFamName) {
            profile.familyMembers.unshift({
              id: 'fam_onboarded_' + Date.now(),
              name: state.firstFamName,
              relation: state.firstFamRelation,
              photo: state.firstFamPhoto || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
              memoryCue: state.firstFamCue || `Your loved one ${state.firstFamName}`,
              hints: [`This is your ${state.firstFamRelation}`, `Name starts with ${state.firstFamName[0]}`, state.firstFamCue]
            });
          }

          Storage.savePatientProfile(profile);
          Storage.setPreferences(profile.preferences);

          // Reactive notification across entire app
          UserState.updateName(state.name, state.preferredName);
          I18n.applyCulturalTheme(Storage.getLanguage() || 'en');

          // Route to destination
          window.location.hash = state.role === 'caregiver' ? '#/dashboard' : state.role === 'doctor' ? '#/doctor' : '#/home';
        } else {
          alert(verifyRes.message);
        }
      });
    }
  }

  render();

  return {
    cleanup() {
      if (timerInterval) clearInterval(timerInterval);
    }
  };
}
