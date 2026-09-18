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
  // Active Role Tab: 'patient' | 'caregiver' | 'doctor'
  let activeRole = 'patient';
  // Auth Method: 'password' (Primary) | 'otp' (Fallback/Recovery)
  let authMethod = 'password';

  let otpSent = false;
  let timerInterval = null;
  let cooldown = 0;

  function render() {
    renderTabbedAuth();
  }

  function renderTabbedAuth() {
    const roleConfig = {
      patient: {
        title: 'Elderly / Patient Portal',
        subtitle: 'Personal memory companion, daily reminders & gentle games',
        icon: '🌸',
        defaultUser: 'meera_das',
        accent: '#800020',
        bg: '#FFFDF9',
        badgeBg: '#FEF3C7',
        badgeColor: '#92400E'
      },
      caregiver: {
        title: 'Caregiver & Family Portal',
        subtitle: 'Monitor medication compliance, schedule reminders & clinical alerts',
        icon: '🤝',
        defaultUser: 'raj_caregiver',
        accent: '#0D9488',
        bg: '#F0FDFA',
        badgeBg: '#CCFBF1',
        badgeColor: '#0F766E'
      },
      doctor: {
        title: 'Doctor & Specialist Portal',
        subtitle: 'Clinical cognitive trends, prescription records & caregiver notes',
        icon: '🩺',
        defaultUser: 'dr_barua',
        accent: '#0284C7',
        bg: '#F0F9FF',
        badgeBg: '#E0F2FE',
        badgeColor: '#0369A1'
      }
    };

    const cfg = roleConfig[activeRole];

    container.innerHTML = `
      <div class="login-container card max-w-xl mx-auto my-6 p-6 sm:p-8 rounded-3xl shadow-xl border-2 transition-all duration-300" style="background: ${cfg.bg}; border-color: ${cfg.accent}20;">
        <!-- Header & Logo -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2 text-3xl shadow-sm" style="background: #FFFFFF; border: 2px solid ${cfg.accent}30;">
            ${cfg.icon}
          </div>
          <h1 class="text-2xl sm:text-3xl font-black tracking-tight" style="color: ${cfg.accent};">SMRITI (स्मृति)</h1>
          <p class="text-gray-600 font-medium text-sm sm:text-base mt-1">${cfg.title}</p>
          <div class="inline-block px-3 py-1 rounded-full text-xs font-bold mt-2" style="background: ${cfg.badgeBg}; color: ${cfg.badgeColor};">
            ${cfg.subtitle}
          </div>
        </div>

        <!-- 1. Senior-Accessible Role Tabs (Min 48px Touch Target) -->
        <div class="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl mb-6" role="tablist">
          <button id="tab-role-patient" class="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm min-h-[50px] transition-all cursor-pointer ${activeRole === 'patient' ? 'bg-white shadow-md text-[#800020] border border-[#800020]/20 font-black' : 'text-gray-600 hover:text-gray-900'}" role="tab" aria-selected="${activeRole === 'patient'}">
            <span class="text-lg mb-0.5">🌸</span>
            <span>Patient</span>
          </button>
          <button id="tab-role-caregiver" class="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm min-h-[50px] transition-all cursor-pointer ${activeRole === 'caregiver' ? 'bg-white shadow-md text-[#0D9488] border border-[#0D9488]/20 font-black' : 'text-gray-600 hover:text-gray-900'}" role="tab" aria-selected="${activeRole === 'caregiver'}">
            <span class="text-lg mb-0.5">🤝</span>
            <span>Caregiver</span>
          </button>
          <button id="tab-role-doctor" class="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm min-h-[50px] transition-all cursor-pointer ${activeRole === 'doctor' ? 'bg-white shadow-md text-[#0284C7] border border-[#0284C7]/20 font-black' : 'text-gray-600 hover:text-gray-900'}" role="tab" aria-selected="${activeRole === 'doctor'}">
            <span class="text-lg mb-0.5">🩺</span>
            <span>Doctor</span>
          </button>
        </div>

        <!-- Method Switcher: Password (Primary) vs OTP (Fallback/Recovery) -->
        <div class="flex items-center justify-center gap-4 mb-5">
          <button id="toggle-method-pass" class="px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] cursor-pointer ${authMethod === 'password' ? 'bg-gray-900 text-white shadow' : 'bg-white text-gray-700 border border-gray-300'}">
            🔑 Username & Password
          </button>
          <button id="toggle-method-otp" class="px-4 py-2 rounded-xl text-sm font-bold transition-all min-h-[44px] cursor-pointer ${authMethod === 'otp' ? 'bg-gray-900 text-white shadow' : 'bg-white text-gray-700 border border-gray-300'}">
            📱 Mobile & OTP (Recovery)
          </button>
        </div>

        <!-- Auth Form Area -->
        <div id="auth-form-container" class="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
          ${authMethod === 'password' ? renderPasswordFormHtml(cfg) : renderOtpFormHtml(cfg)}
        </div>

        <!-- Demo Quick-Fill Profiles -->
        <div class="mt-6 pt-4 border-t border-gray-200 text-center">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">⚡ 1-Tap Quick Demo Credentials</p>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <button id="btn-fill-meera" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 cursor-pointer">
              🌸 Patient (meera_das)
            </button>
            <button id="btn-fill-raj" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 cursor-pointer">
              🤝 Caregiver (raj_caregiver)
            </button>
            <button id="btn-fill-barua" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 cursor-pointer">
              🩺 Doctor (dr_barua)
            </button>
          </div>
        </div>
      </div>
    `;

    attachTabbedEvents();
  }

  function renderPasswordFormHtml(cfg) {
    return `
      <form id="form-password-login" onsubmit="return false;" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-800 mb-1.5">Username *</label>
          <div class="relative">
            <span class="absolute left-3.5 top-3.5 text-gray-400 font-bold">@</span>
            <input type="text" id="inp-username" value="${cfg.defaultUser}" placeholder="e.g. ${cfg.defaultUser}" required class="w-full pl-8 pr-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-[${cfg.accent}] focus:outline-none min-h-[50px]" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-800 mb-1.5">Password *</label>
          <input type="password" id="inp-password" value="password123" placeholder="Enter your password" required class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-[${cfg.accent}] focus:outline-none min-h-[50px]" />
          <p class="text-xs text-gray-500 mt-1">Default demo password: <code>password123</code></p>
        </div>

        <button type="submit" id="btn-submit-pass" class="w-full py-3.5 px-6 rounded-xl text-white font-black text-base shadow-lg hover:brightness-110 active:scale-[0.99] transition-all min-h-[52px] cursor-pointer" style="background: ${cfg.accent};">
          Sign In as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} ➔
        </button>
      </form>
    `;
  }

  function renderOtpFormHtml(cfg) {
    return `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-800 mb-1.5">Registered Mobile Number *</label>
          <input type="tel" id="inp-otp-phone" value="9876543210" placeholder="10-digit mobile number" class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:border-[${cfg.accent}] focus:outline-none min-h-[50px]" />
        </div>

        <div id="otp-alert-box" class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold" style="display: ${otpSent ? 'block' : 'none'};">
          📱 Demo Mock OTP: <strong class="text-sm bg-amber-200 px-2 py-0.5 rounded">1234</strong>
        </div>

        <div id="otp-input-area" style="display: ${otpSent ? 'block' : 'none'};">
          <label class="block text-sm font-bold text-gray-800 mb-1.5">Enter 4-Digit OTP *</label>
          <div class="flex gap-2 justify-center">
            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[${cfg.accent}] focus:outline-none" />
            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[${cfg.accent}] focus:outline-none" />
            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[${cfg.accent}] focus:outline-none" />
            <input type="text" maxlength="1" class="otp-box w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-[${cfg.accent}] focus:outline-none" />
          </div>
          <p class="text-xs text-center text-gray-500 mt-2">Enter <code>1234</code> to authenticate</p>
        </div>

        ${!otpSent ? `
          <button id="btn-send-otp" class="w-full py-3.5 px-6 rounded-xl text-white font-black text-base shadow-lg hover:brightness-110 active:scale-[0.99] transition-all min-h-[52px] cursor-pointer" style="background: ${cfg.accent};">
            Send OTP to Mobile ➔
          </button>
        ` : `
          <button id="btn-verify-otp" class="w-full py-3.5 px-6 rounded-xl text-white font-black text-base shadow-lg hover:brightness-110 active:scale-[0.99] transition-all min-h-[52px] cursor-pointer" style="background: ${cfg.accent};">
            Verify OTP & Sign In ➔
          </button>
        `}
      </div>
    `;
  }

  function attachTabbedEvents() {
    // Role tab switches
    container.querySelector('#tab-role-patient')?.addEventListener('click', () => {
      activeRole = 'patient';
      otpSent = false;
      render();
    });
    container.querySelector('#tab-role-caregiver')?.addEventListener('click', () => {
      activeRole = 'caregiver';
      otpSent = false;
      render();
    });
    container.querySelector('#tab-role-doctor')?.addEventListener('click', () => {
      activeRole = 'doctor';
      otpSent = false;
      render();
    });

    // Auth method switches
    container.querySelector('#toggle-method-pass')?.addEventListener('click', () => {
      authMethod = 'password';
      render();
    });
    container.querySelector('#toggle-method-otp')?.addEventListener('click', () => {
      authMethod = 'otp';
      render();
    });

    // 1-Tap Quick-Fill Profiles
    container.querySelector('#btn-fill-meera')?.addEventListener('click', () => {
      activeRole = 'patient';
      authMethod = 'password';
      render();
    });
    container.querySelector('#btn-fill-raj')?.addEventListener('click', () => {
      activeRole = 'caregiver';
      authMethod = 'password';
      render();
    });
    container.querySelector('#btn-fill-barua')?.addEventListener('click', () => {
      activeRole = 'doctor';
      authMethod = 'password';
      render();
    });

    // Password Login Submit
    container.querySelector('#form-password-login')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = container.querySelector('#inp-username')?.value.trim();
      const password = container.querySelector('#inp-password')?.value;

      const res = Auth.loginWithPassword({ username, password, role: activeRole });
      if (res.success) {
        onAuthSuccess(res.user);
      } else {
        alert(res.message);
      }
    });

    // Send OTP
    container.querySelector('#btn-send-otp')?.addEventListener('click', () => {
      const phone = container.querySelector('#inp-otp-phone')?.value.trim();
      const res = Auth.sendOTP(phone);
      if (res.success) {
        otpSent = true;
        render();
        setTimeout(() => {
          const boxes = container.querySelectorAll('.otp-box');
          if (boxes.length === 4) {
            // Auto fill 1 2 3 4 for smooth senior flow
            boxes[0].value = '1';
            boxes[1].value = '2';
            boxes[2].value = '3';
            boxes[3].value = '4';
          }
        }, 300);
      } else {
        alert(res.message);
      }
    });

    // OTP Input auto-advance
    const otpBoxes = container.querySelectorAll('.otp-box');
    otpBoxes.forEach((box, idx) => {
      box.addEventListener('input', (e) => {
        if (e.target.value && idx < otpBoxes.length - 1) {
          otpBoxes[idx + 1].focus();
        }
      });
    });

    // Verify OTP
    container.querySelector('#btn-verify-otp')?.addEventListener('click', () => {
      const phone = container.querySelector('#inp-otp-phone')?.value.trim();
      const otp = Array.from(otpBoxes).map(b => b.value).join('');

      const res = Auth.verifyOTP(phone, otp);
      if (res.success) {
        // Complete login
        const user = Auth.login({
          name: activeRole === 'patient' ? 'Meera Das' : activeRole === 'caregiver' ? 'Raj Das' : 'Dr. A. K. Barua',
          username: activeRole === 'patient' ? 'meera_das' : activeRole === 'caregiver' ? 'raj_caregiver' : 'dr_barua',
          phone: phone || '9876543210',
          role: activeRole,
          linkedPatientUsername: 'meera_das'
        });
        onAuthSuccess(user);
      } else {
        alert(res.message);
      }
    });
  }

  function onAuthSuccess(user) {
    if (window.SmritiToast) {
      window.SmritiToast.show(`Welcome, ${user.name}!`, 'success', 2500);
    }
    // Route cleanly based on role with NO full page reload
    if (user.role === 'caregiver') {
      window.location.hash = '#/dashboard';
    } else if (user.role === 'doctor') {
      window.location.hash = '#/doctor';
    } else {
      window.location.hash = '#/home';
    }
  }

  // Initial render
  render();
  return { cleanup() {} };
}