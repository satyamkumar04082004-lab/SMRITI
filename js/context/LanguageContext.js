/* ============================================================
   SMRITI — Global React-Style LanguageContext & State Handler
   Provides live in-place language switching, reactivity, subscriber hooks,
   and zero-reload component updates across all views.
   ============================================================ */

import I18n from '../i18n.js';
import Storage from '../storage.js';

export const LanguageContext = {
  currentLanguage: 'en',
  subscribers: new Set(),

  init() {
    this.currentLanguage = Storage.getLanguage() || I18n.lang || 'en';
    I18n.init();
    return this.currentLanguage;
  },

  getLanguage() {
    return I18n.lang || this.currentLanguage || 'en';
  },

  setLanguage(lang) {
    if (!lang) return;
    this.currentLanguage = lang;
    
    // Update I18n engine
    I18n.setLanguage(lang);

    // Dispatch global events for DOM & external listeners
    const detail = { lang, language: lang };
    window.dispatchEvent(new CustomEvent('smriti:languageChanged', { detail }));
    window.dispatchEvent(new CustomEvent('languageChanged', { detail }));

    // Notify all subscribed components
    this.notify();
  },

  subscribe(callback) {
    if (typeof callback !== 'function') return () => {};
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },

  notify() {
    const lang = this.getLanguage();
    this.subscribers.forEach(cb => {
      try {
        cb(lang);
      } catch (e) {
        console.warn('LanguageContext subscriber error:', e);
      }
    });
  },

  t(key, vars = {}) {
    return I18n.t(key, vars);
  },

  getAvailableLanguages() {
    return I18n.getAvailableLanguages();
  }
};

// React hook simulation / interop
export function useLanguage() {
  return {
    language: LanguageContext.getLanguage(),
    setLanguage: (lang) => LanguageContext.setLanguage(lang),
    t: (key, vars) => LanguageContext.t(key, vars),
    availableLanguages: LanguageContext.getAvailableLanguages()
  };
}

// Attach to window for global runtime availability
if (typeof window !== 'undefined') {
  window.LanguageContext = LanguageContext;
  window.useLanguage = useLanguage;
}

export default LanguageContext;
