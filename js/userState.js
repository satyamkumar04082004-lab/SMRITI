/* ============================================================
   SMRITI — Global User State Context
   Reactive single source of truth for user profile, name,
   demographics, medical profile, and role across all modules.
   ============================================================ */

import Storage from './storage.js';

class GlobalUserState {
  constructor() {
    this._listeners = new Set();
    this._user = null;
    this.init();
  }

  init() {
    this._user = Storage.getUser();
    window.addEventListener('smritiUserChanged', (e) => {
      this._user = e.detail?.user || Storage.getUser();
      this._notify();
    });
    window.addEventListener('userProfileUpdated', (e) => {
      this._user = e.detail?.user || Storage.getUser();
      this._notify();
    });
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.includes('currentUser')) {
        this._user = Storage.getUser();
        this._notify();
      }
    });
  }

  getUser() {
    if (!this._user) {
      this._user = Storage.getUser();
    }
    return this._user || { name: 'Meera Das', phone: '9876543210', role: 'patient', patientId: 'patient_meera_01' };
  }

  getDisplayName() {
    const user = this.getUser();
    const prefs = Storage.getPreferences();
    return prefs.preferredName || (user.name ? user.name.split(' ')[0] : 'Friend');
  }

  getFullName() {
    const user = this.getUser();
    return user.name || 'Friend';
  }

  getPatientProfile() {
    return Storage.getPatientProfile(this._user?.patientId || 'patient_meera_01');
  }

  updateName(newName, preferredName = '') {
    const current = this.getUser();
    const updated = {
      ...current,
      name: newName
    };
    Storage.setUser(updated);

    const profile = Storage.getPatientProfile(current.patientId || 'patient_meera_01');
    if (profile.patient) {
      profile.patient.name = newName;
      if (preferredName) {
        profile.patient.preferredName = preferredName;
      }
    }
    if (profile.preferences) {
      profile.preferences.preferredName = preferredName || newName.split(' ')[0] || newName;
    }
    Storage.savePatientProfile(profile);

    this._user = updated;
    this._notify();

    window.dispatchEvent(new CustomEvent('userProfileUpdated', {
      detail: { user: updated, prefs: profile.preferences }
    }));
  }

  updateProfile(patch) {
    const current = this.getUser();
    const updatedUser = { ...current, ...patch };
    Storage.setUser(updatedUser);

    const profile = Storage.getPatientProfile(current.patientId || 'patient_meera_01');
    if (profile.patient) {
      Object.assign(profile.patient, patch);
    }
    Storage.savePatientProfile(profile);

    this._user = updatedUser;
    this._notify();
  }

  subscribe(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  _notify() {
    const user = this.getUser();
    this._listeners.forEach(cb => {
      try { cb(user); } catch (err) { console.warn('UserState listener error:', err); }
    });
    document.querySelectorAll('[data-user-name]').forEach(el => {
      el.textContent = this.getFullName();
    });
    document.querySelectorAll('[data-user-display]').forEach(el => {
      el.textContent = this.getDisplayName();
    });
  }
}

const UserState = new GlobalUserState();
export default UserState;
