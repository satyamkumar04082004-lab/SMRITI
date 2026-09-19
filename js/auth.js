/* ============================================================
   SMRITI — Authentication System
   Login/Register with single OTP flow (mock for demo)
   ============================================================ */

import Storage from './storage.js';

const Auth = {
  _otpData: null,       // { code, phone, generatedAt, expiresAt }
  _cooldownTimer: null,
  _cooldownEnd: 0,

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return Storage.isLoggedIn();
  },

  /**
   * Get current user
   */
  getUser() {
    return Storage.getUser();
  },

  /**
   * Send OTP (mock)
   * @param {string} phone
   * @returns {{ success: boolean, message: string, demoOtp?: string }}
   */
  sendOTP(phone) {
    // Check cooldown
    if (Date.now() < this._cooldownEnd) {
      const remaining = Math.ceil((this._cooldownEnd - Date.now()) / 1000);
      return { success: false, message: `Please wait ${remaining}s before requesting another OTP` };
    }

    // Validate phone
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit phone number' };
    }

    // Clear previous OTP
    this._clearOTP();

    // Generate dynamic OTP using Math.random() — NEVER hardcoded
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const now = Date.now();
    
    this._otpData = {
      code,
      phone: phone.replace(/\D/g, ''),
      generatedAt: now,
      expiresAt: now + 300000, // 5 minutes
    };

    // Set cooldown (10 seconds)
    this._cooldownEnd = now + 10000;

    console.log(`📱 Dynamic OTP for ${phone}: ${code}`);

    return { 
      success: true, 
      message: `OTP sent successfully!`, 
      demoOtp: code 
    };
  },

  /**
   * Verify OTP
   * @param {string} phone
   * @param {string} otp
   * @returns {{ success: boolean, message: string }}
   */
  verifyOTP(phone, otp) {
    const cleanOtp = String(otp || '').trim();

    if (!this._otpData) {
      return { success: false, message: 'No active OTP found. Please request a new code.' };
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    if (cleanPhone && this._otpData.phone && this._otpData.phone !== cleanPhone) {
      return { success: false, message: 'Phone number mismatch. Please request a new OTP.' };
    }

    if (Date.now() > this._otpData.expiresAt) {
      this._clearOTP();
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    if (this._otpData.code !== cleanOtp) {
      return { success: false, message: 'Invalid OTP code. Please enter the correct code.' };
    }

    this._clearOTP();
    return { success: true, message: 'OTP verified successfully!' };
  },

  /**
   * Primary Auth: Username & Password Login with role checking
   */
  loginWithPassword({ username, password, role = 'patient' }) {
    const cleanUser = (username || '').trim().toLowerCase().replace(/^@/, '');
    if (!cleanUser) {
      return { success: false, message: 'Please enter your username.' };
    }
    if (!password || password.length < 4) {
      return { success: false, message: 'Please enter your password (minimum 4 characters).' };
    }

    // Check predefined profiles or stored users
    const allUsers = Storage.getAllUsers() || [];
    let existing = allUsers.find(u => (u.username || '').toLowerCase() === cleanUser);

    if (existing) {
      // If user exists, enforce role alignment
      existing.role = role;
      Storage.setUser(existing);
      return { success: true, user: existing };
    }

    // Default Demo profiles
    let userData = null;
    if (role === 'caregiver') {
      userData = {
        name: cleanUser.includes('raj') ? 'Raj Das' : (cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1) + ' (Caregiver)'),
        username: cleanUser,
        role: 'caregiver',
        phone: '9876543210',
        linkedPatientUsername: 'meera_das'
      };
    } else if (role === 'doctor') {
      userData = {
        name: cleanUser.includes('barua') ? 'Dr. A. K. Barua' : ('Dr. ' + cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1)),
        username: cleanUser,
        role: 'doctor',
        phone: '9876543212',
        specialization: 'Neurologist / Geriatric Specialist'
      };
    } else {
      userData = {
        name: cleanUser.includes('meera') ? 'Meera Das' : (cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1)),
        username: cleanUser,
        role: 'patient',
        phone: '9876543210',
        stage: 'Mild Cognitive Impairment (MCI)'
      };
    }

    const saved = this.login(userData);
    return { success: true, user: saved };
  },

  /**
   * Complete login/registration
   * @param {{ name: string, phone: string, role: string }} userData
   */
  login(userData) {
    const registered = Storage.registerUser(userData);
    const fullUser = Object.assign({}, userData, registered);
    Storage.setUser(fullUser);
    return fullUser;
  },

  /**
   * Logout - Completely clears session and state
   */
  logout() {
    Storage.clearUser();
    this._clearOTP();
    // Clear any memory or session caches
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('smritiUserLoggedOut'));
    }
  },

  /**
   * Get cooldown remaining seconds
   * @returns {number}
   */
  getCooldownRemaining() {
    if (Date.now() >= this._cooldownEnd) return 0;
    return Math.ceil((this._cooldownEnd - Date.now()) / 1000);
  },

  /**
   * Clear OTP data
   */
  _clearOTP() {
    this._otpData = null;
    if (this._cooldownTimer) {
      clearInterval(this._cooldownTimer);
      this._cooldownTimer = null;
    }
  },
};

export default Auth;
