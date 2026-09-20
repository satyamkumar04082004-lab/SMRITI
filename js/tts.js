/* ============================================================
   SMRITI — Text-to-Speech Helper
   Web Speech API wrapper with language support and fallback
   ============================================================ */

import I18n from './i18n.js';

const TTS = {
  _supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  _speaking: false,

  /**
   * Check if TTS is available
   */
  isSupported() {
    return this._supported;
  },

  /**
   * Speak text in the selected language
   * @param {string} text
   * @param {string} lang - BCP47 language code (defaults to current i18n language)
   */
  speak(text, lang = null) {
    if (!this._supported) return;

    // Stop any current speech
    this.stop();

    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'as': 'as-IN',
      'bn': 'bn-IN',
      'mni': 'mni-IN',
      'brx': 'brx-IN',
      'ne': 'ne-NP',
      'lus': 'en-IN',
      'nag': 'en-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN'
    };

    const targetLang = lang || (typeof I18n !== 'undefined' ? I18n.lang : null) || 'en';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[targetLang] || 'en-IN';
    utterance.rate = 0.85; // Slower for elderly
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => { this._speaking = true; };
    utterance.onend = () => { this._speaking = false; };
    utterance.onerror = () => { this._speaking = false; };

    speechSynthesis.speak(utterance);
  },

  /**
   * Stop current speech
   */
  stop() {
    if (this._supported) {
      speechSynthesis.cancel();
      this._speaking = false;
    }
  },

  /**
   * Check if currently speaking
   */
  isSpeaking() {
    return this._speaking;
  },

  /**
   * Create a TTS button element
   * @param {string} text - text to speak
   * @param {string} label - button label
   * @returns {HTMLElement}
   */
  createButton(text, label = null) {
    const btn = document.createElement('button');
    btn.className = 'tts-btn';
    btn.innerHTML = `<span class="tts-icon">🔊</span> ${label || I18n.t('readInstruction')}`;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.speak(text);
    });
    return btn;
  },
};

export default TTS;
