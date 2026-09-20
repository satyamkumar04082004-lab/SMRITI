/* ============================================================
   SMRITI — Centralized Voice Manager & Speech Coordinator
   Provides singleton microphone locking to eliminate session collisions
   between Voice Navigation, Saathi Chatbot, Game Answers, and VoiceGuard SOS.
   ============================================================ */

import I18n from './i18n.js';

const VoiceManager = {
  _activeRecognizer: null,
  _activeOwner: null, // 'nav' | 'saathi' | 'game' | 'sos'
  _backgroundSOSHandler: null,
  _isBackgroundSOSPaused: false,
  _permissionGranted: null,

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  getSpeechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  },

  getLocaleForLang(lang = (typeof I18n !== 'undefined' && I18n.lang) || 'en') {
    const map = {
      hi: 'hi-IN',
      bn: 'bn-IN',
      as: 'as-IN',
      ne: 'ne-NP',
      brx: 'hi-IN', // Devanagari fallback for Bodo recognition
      mni: 'bn-IN', // Eastern Nagari script fallback for Manipuri
      en: 'en-IN'
    };
    return map[lang] || 'en-IN';
  },

  async checkOrRequestMicrophone() {
    if (this._permissionGranted === true) return true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        this._permissionGranted = true;
        return true;
      } catch (err) {
        console.warn('[VoiceManager] Microphone access rejected:', err);
        this._permissionGranted = false;
        if (window.SmritiToast) {
          window.SmritiToast.show('Microphone access is needed for voice features. Please allow mic in browser settings.', 'warning');
        }
        return false;
      }
    }
    return true;
  },

  registerBackgroundSOS(handler) {
    this._backgroundSOSHandler = handler;
  },

  pauseBackgroundSOS() {
    this._isBackgroundSOSPaused = true;
    if (this._activeOwner === 'sos' && this._activeRecognizer) {
      try { this._activeRecognizer.stop(); } catch (e) {}
      this._activeRecognizer = null;
      this._activeOwner = null;
    }
  },

  resumeBackgroundSOS() {
    this._isBackgroundSOSPaused = false;
    if (!this._activeOwner && typeof this._backgroundSOSHandler === 'function') {
      setTimeout(() => {
        if (!this._activeOwner && !this._isBackgroundSOSPaused) {
          try {
            this._backgroundSOSHandler();
          } catch (e) {
            console.warn('[VoiceManager] Failed to resume SOS listener:', e);
          }
        }
      }, 500);
    }
  },

  async startListening({
    owner = 'general',
    continuous = false,
    interimResults = false,
    lang = null,
    onStart = null,
    onResult = null,
    onError = null,
    onEnd = null
  }) {
    if (!this.isSupported()) {
      if (window.SmritiToast) {
        window.SmritiToast.show('Speech recognition is not supported in this browser.', 'info');
      }
      return null;
    }

    this.stopListening();

    if (owner !== 'sos') {
      this._isBackgroundSOSPaused = true;
    }

    const hasPerm = await this.checkOrRequestMicrophone();
    if (!hasPerm) {
      if (typeof onError === 'function') onError({ error: 'not-allowed' });
      return null;
    }

    const SpeechRec = this.getSpeechRecognitionConstructor();
    if (!SpeechRec) {
      if (typeof onError === 'function') onError({ error: 'not-supported' });
      return null;
    }

    let rec;
    try {
      rec = new SpeechRec();
    } catch (e) {
      console.warn('[VoiceManager] SpeechRecognition instantiation error:', e);
      if (typeof onError === 'function') onError(e);
      return null;
    }
    rec.continuous = continuous;
    rec.interimResults = interimResults;
    rec.lang = lang || this.getLocaleForLang();

    this._activeRecognizer = rec;
    this._activeOwner = owner;

    rec.onstart = () => {
      if (typeof onStart === 'function') onStart();
    };

    rec.onresult = (event) => {
      if (typeof onResult === 'function') onResult(event);
    };

    rec.onerror = (event) => {
      const errCode = event.error || 'unknown';
      console.warn(`[VoiceManager] Recognizer error (${owner}):`, errCode);

      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        this._permissionGranted = false;
      }

      if (typeof onError === 'function') onError(event);
    };

    rec.onend = () => {
      const wasOwner = this._activeOwner;
      if (this._activeRecognizer === rec) {
        this._activeRecognizer = null;
        this._activeOwner = null;
      }

      if (typeof onEnd === 'function') onEnd();

      if (wasOwner !== 'sos' && !this._activeOwner) {
        setTimeout(() => {
          if (!this._activeOwner) {
            this.resumeBackgroundSOS();
          }
        }, 800);
      }
    };

    try {
      rec.start();
      return rec;
    } catch (startErr) {
      console.warn('[VoiceManager] rec.start() error:', startErr);
      this._activeRecognizer = null;
      this._activeOwner = null;
      if (typeof onError === 'function') onError(startErr);
      return null;
    }
  },

  stopListening() {
    if (this._activeRecognizer) {
      try {
        this._activeRecognizer.stop();
      } catch (e) {}
      this._activeRecognizer = null;
      this._activeOwner = null;
    }
  },

  isActive() {
    return !!this._activeRecognizer;
  },

  getActiveOwner() {
    return this._activeOwner;
  }
};

if (typeof window !== 'undefined') {
  window.VoiceManager = VoiceManager;
}

export default VoiceManager;
