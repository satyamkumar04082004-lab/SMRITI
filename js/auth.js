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

    // Generate new OTP
    const code = String(Math.floor(1000 + Math.random() * 9000));
    const now = Date.now();
    
    this._otpData = {
      code,
      phone: phone.replace(/\D/g, ''),
      generatedAt: now,
      expiresAt: now + 120000, // 2 minutes
    };

    // Set cooldown (30 seconds)
    this._cooldownEnd = now + 30000;

    console.log(`📱 Demo OTP for ${phone}: ${code}`);

    return { 
      success: true, 
      message: 'OTP sent successfully!', 
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
    if (!this._otpData) {
      return { success: false, message: 'No OTP was sent. Please request one first.' };
    }

    const cleanPhone = phone.replace(/\D/g, '');

    if (this._otpData.phone !== cleanPhone) {
      return { success: false, message: 'Phone number mismatch. Please request a new OTP.' };
    }

    if (Date.now() > this._otpData.expiresAt) {
      this._clearOTP();
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    if (this._otpData.code !== otp) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // Success
    this._clearOTP();
    return { success: true, message: 'OTP verified successfully!' };
  },

  /**
   * Complete login/registration
   * @param {{ name: string, phone: string, role: string }} userData
   */
  login(userData) {
    Storage.setUser(userData);
    Storage.registerUser(userData);
  },

  /**
   * Logout
   */
  logout() {
    Storage.clearUser();
    this._clearOTP();
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
