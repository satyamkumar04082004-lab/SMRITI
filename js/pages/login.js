import Storage from '../storage.js';
import I18n from '../i18n.js';
import Auth from '../auth.js';

export default function Login(container) {
  let step = 1;
  let name = '';
  let role = 'patient';
  let phone = '';
  let otpData = null;
  let timerInterval = null;

  function render() {
    if (step === 1) {
      container.innerHTML = `
        <div class="login-container card" style="max-width: 400px; margin: 40px auto; padding: 30px; background: #FDF8F3; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #9B2C2C; text-align: center; margin-bottom: 20px;">Welcome to SMRITI</h2>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; color: #333; font-size: 1.1rem;">Your Name</label>
            <input type="text" id="login-name" class="input-field" placeholder="Enter your name" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box;" value="${name}">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; color: #333; font-size: 1.1rem;">Select Role</label>
            <div style="display: flex; gap: 10px;">
              <div id="role-patient" class="role-card" style="flex: 1; padding: 15px; text-align: center; border: 2px solid ${role === 'patient' ? '#0D9488' : '#ccc'}; border-radius: 8px; cursor: pointer; background: ${role === 'patient' ? '#E6F4F1' : 'white'};">
                <div style="font-size: 2rem;">👤</div>
                <div style="font-weight: bold; margin-top: 5px;">Patient</div>
              </div>
              <div id="role-caregiver" class="role-card" style="flex: 1; padding: 15px; text-align: center; border: 2px solid ${role === 'caregiver' ? '#0D9488' : '#ccc'}; border-radius: 8px; cursor: pointer; background: ${role === 'caregiver' ? '#E6F4F1' : 'white'};">
                <div style="font-size: 2rem;">🤝</div>
                <div style="font-weight: bold; margin-top: 5px;">Caregiver</div>
              </div>
            </div>
          </div>
          <button id="btn-next-1" class="btn" style="width: 100%; min-height: 56px; background: #0D9488; color: white; border: none; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">Next ➔</button>

          <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 15px; text-align: center;">
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">For Testing & Demo:</p>
            <button id="btn-demo-login" class="btn" style="width: 100%; min-height: 48px; background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; border-radius: 8px; font-size: 1.05rem; cursor: pointer; font-weight: 700; margin-bottom: 8px;">
              🚀 Instant Demo Login (Meera Das)
            </button>
            <button id="btn-demo-caregiver" class="btn" style="width: 100%; min-height: 48px; background: #E6F4F1; color: #0D9488; border: 1px solid #99F6E4; border-radius: 8px; font-size: 1.05rem; cursor: pointer; font-weight: 700;">
              👨‍⚕️ Caregiver Hub Demo (Dr. Verma)
            </button>
          </div>
        </div>
      `;

      container.querySelector('#role-patient').addEventListener('click', () => { role = 'patient'; render(); });
      container.querySelector('#role-caregiver').addEventListener('click', () => { role = 'caregiver'; render(); });

      const proceedStep1 = () => {
        name = container.querySelector('#login-name').value.trim();
        if (!name) return alert('Please enter your name');
        step = 2;
        render();
      };

      container.querySelector('#btn-next-1').addEventListener('click', proceedStep1);
      container.querySelector('#login-name').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') proceedStep1();
      });

      container.querySelector('#btn-demo-login').addEventListener('click', () => {
        Auth.login({ name: 'Meera Das', phone: '9876543210', role: 'patient' });
        window.location.hash = '#/home';
      });

      container.querySelector('#btn-demo-caregiver').addEventListener('click', () => {
        Auth.login({ name: 'Dr. Verma', phone: '9876543212', role: 'caregiver' });
        window.location.hash = '#/dashboard';
      });
    } else if (step === 2) {
      container.innerHTML = `
        <div class="login-container card" style="max-width: 400px; margin: 40px auto; padding: 30px; background: #FDF8F3; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #9B2C2C; text-align: center; margin-bottom: 20px;">Phone Number</h2>
          <p style="text-align: center; color: #666; margin-bottom: 20px; font-size: 1.1rem;">We will send you a 4-digit OTP</p>
          <div style="margin-bottom: 20px;">
            <input type="tel" id="login-phone" class="input-field" placeholder="Mobile Number" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box;" value="${phone}">
          </div>
          <button id="btn-send-otp" class="btn" style="width: 100%; min-height: 56px; background: #0D9488; color: white; border: none; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">Send OTP</button>
          <button id="btn-back-1" class="btn" style="width: 100%; min-height: 56px; background: transparent; color: #666; border: none; font-size: 1.1rem; margin-top: 10px; cursor: pointer;">⬅ Back</button>
          <div id="demo-toast" style="display: none; margin-top: 15px; padding: 10px; background: #E6F4F1; border-left: 4px solid #0D9488; color: #0D9488; font-weight: bold; border-radius: 4px;"></div>
        </div>
      `;

      updateOtpButtonState(container.querySelector('#btn-send-otp'));

      container.querySelector('#btn-back-1').addEventListener('click', () => { step = 1; render(); });
      container.querySelector('#btn-send-otp').addEventListener('click', () => {
        const phoneInput = container.querySelector('#login-phone').value.trim();
        if (!phoneInput || phoneInput.length < 5) return alert('Enter a valid phone number');
        phone = phoneInput;
        otpData = Auth.sendOTP(phone);
        if (otpData.success) {
          const toast = container.querySelector('#demo-toast');
          toast.textContent = 'Demo OTP: ' + otpData.demoOtp;
          toast.style.display = 'block';
          setTimeout(() => {
            step = 3;
            render();
          }, 2000);
        } else {
          alert(otpData.message);
        }
      });
    } else if (step === 3) {
      container.innerHTML = `
        <div class="login-container card" style="max-width: 400px; margin: 40px auto; padding: 30px; background: #FDF8F3; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #9B2C2C; text-align: center; margin-bottom: 10px;">Enter OTP</h2>
          <p style="text-align: center; color: #666; margin-bottom: 20px; font-size: 1.1rem;">Sent to ${phone}</p>
          <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 1px solid #ccc; border-radius: 8px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 1px solid #ccc; border-radius: 8px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 1px solid #ccc; border-radius: 8px;">
            <input type="text" maxlength="1" class="otp-box input-field" style="width: 50px; height: 50px; text-align: center; font-size: 1.5rem; border: 1px solid #ccc; border-radius: 8px;">
          </div>
          <button id="btn-verify" class="btn" style="width: 100%; min-height: 56px; background: #0D9488; color: white; border: none; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">Verify & Login</button>
          <button id="btn-resend" class="btn" style="width: 100%; min-height: 56px; background: transparent; color: #9B2C2C; border: none; font-size: 1.1rem; margin-top: 10px; cursor: pointer;">Resend OTP</button>
          <button id="btn-back-2" class="btn" style="width: 100%; min-height: 56px; background: transparent; color: #666; border: none; font-size: 1.1rem; margin-top: 5px; cursor: pointer;">⬅ Back</button>
          <div id="demo-toast" style="display: none; margin-top: 15px; padding: 10px; background: #E6F4F1; border-left: 4px solid #0D9488; color: #0D9488; font-weight: bold; border-radius: 4px;"></div>
        </div>
      `;

      if (otpData && otpData.demoOtp) {
         const toast = container.querySelector('#demo-toast');
         toast.textContent = 'Demo OTP: ' + otpData.demoOtp;
         toast.style.display = 'block';
      }

      const otpBoxes = container.querySelectorAll('.otp-box');
      otpBoxes.forEach((box, index) => {
        box.addEventListener('input', (e) => {
          if (e.target.value && index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus();
          }
        });
      });

      updateOtpButtonState(container.querySelector('#btn-resend'));

      container.querySelector('#btn-back-2').addEventListener('click', () => { step = 2; render(); });
      container.querySelector('#btn-resend').addEventListener('click', () => {
        if (Auth.getCooldownRemaining() > 0) return;
        otpData = Auth.sendOTP(phone);
        if (otpData.success) {
          const toast = container.querySelector('#demo-toast');
          toast.textContent = 'Demo OTP: ' + otpData.demoOtp;
          toast.style.display = 'block';
        } else {
          alert(otpData.message);
        }
      });

      container.querySelector('#btn-verify').addEventListener('click', () => {
        const otp = Array.from(otpBoxes).map(b => b.value).join('');
        if (otp.length !== 4) return alert('Enter full 4-digit OTP');
        
        const res = Auth.verifyOTP(phone, otp);
        if (res.success) {
          Auth.login({ name, phone, role });
          window.location.hash = role === 'caregiver' ? '#/dashboard' : '#/home';
        } else {
          alert(res.message);
        }
      });
    }
  }

  function updateOtpButtonState(btn) {
    if (timerInterval) clearInterval(timerInterval);
    const update = () => {
      if (!btn) return;
      const remaining = Auth.getCooldownRemaining();
      if (remaining > 0) {
        btn.disabled = true;
        btn.textContent = `Wait ${remaining}s`;
        btn.style.opacity = '0.5';
      } else {
        btn.disabled = false;
        btn.textContent = step === 2 ? 'Send OTP' : 'Resend OTP';
        btn.style.opacity = '1';
        clearInterval(timerInterval);
      }
    };
    update();
    timerInterval = setInterval(update, 1000);
  }

  render();

  return {
    cleanup() {
      if (timerInterval) clearInterval(timerInterval);
    }
  };
}
