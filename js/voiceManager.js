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
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  getSpeechRecognitionConstructor() {
    if (typeof window === 'undefined') return null;
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
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        if (status.state === 'granted') {
          this._permissionGranted = true;
          return true;
        } else if (status.state === 'denied') {
          this._permissionGranted = false;
          return false;
        }
      } catch (e) {
        // Fallback to native SpeechRecognition permission management
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
    rec.maxAlternatives = 3;
    rec.lang = lang || this.getLocaleForLang();

    this._activeRecognizer = rec;
    this._activeOwner = owner;

    rec.onstart = () => {
      this._permissionGranted = true;
      if (typeof onStart === 'function') onStart();
    };

    rec.onresult = (event) => {
      let fullTranscript = '';
      let latestTranscript = '';
      if (event && event.results) {
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item && item[0]) {
            fullTranscript += (fullTranscript ? ' ' : '') + item[0].transcript;
          }
        }
        const last = event.results[event.results.length - 1];
        if (last && last[0]) {
          latestTranscript = last[0].transcript;
        }
      }
      const cleanTranscript = (fullTranscript || latestTranscript || '').trim();

      if (typeof onResult === 'function') {
        try {
          onResult(event, cleanTranscript);
        } catch (cbErr) {
          console.error('[VoiceManager] onResult callback error:', cbErr);
        }
      }

      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('smriti:voiceTranscript', {
          detail: { owner, transcript: cleanTranscript, event }
        }));
      }
    };

    rec.onerror = (event) => {
      const errCode = event?.error || 'unknown';
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        this._permissionGranted = false;
      }
      if (typeof onError === 'function') {
        try {
          onError(event);
        } catch (cbErr) {
          console.error('[VoiceManager] onError callback error:', cbErr);
        }
      }
    };

    rec.onend = () => {
      const wasOwner = this._activeOwner;
      if (this._activeRecognizer === rec) {
        this._activeRecognizer = null;
        this._activeOwner = null;
      }

      if (typeof onEnd === 'function') {
        try {
          onEnd();
        } catch (cbErr) {
          console.error('[VoiceManager] onEnd callback error:', cbErr);
        }
      }

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
