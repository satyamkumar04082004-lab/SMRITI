/* ============================================================
   SMRITI — Ambient Nature Sounds & Soothing Audio
   Web Audio API synthesized calm stream & gentle chimes
   100% offline, zero network data usage
   ============================================================ */

const AmbientAudio = {
  _ctx: null,
  _isPlaying: false,
  _gainNode: null,
  _timer: null,

  init() {
    if (!this._ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this._ctx = new AudioContext();
      }
    }
  },

  isPlaying() {
    return this._isPlaying;
  },

  start() {
    this.init();
    if (!this._ctx) return false;

    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }

    if (this._isPlaying) return true;

    try {
      // Master Gain
      this._gainNode = this._ctx.createGain();
      this._gainNode.gain.setValueAtTime(0.01, this._ctx.currentTime);
      this._gainNode.gain.exponentialRampToValueAtTime(0.12, this._ctx.currentTime + 2);
      this._gainNode.connect(this._ctx.destination);

      // Pink noise buffer for soft flowing stream / breeze
      const bufferSize = this._ctx.sampleRate * 2;
      const noiseBuffer = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this._ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter to make it gentle and warm like a distant mountain brook
      const filter = this._ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(340, this._ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this._gainNode);
      whiteNoise.start(0);
      this._whiteNoise = whiteNoise;

      // Periodic gentle musical chime (pentatonic scale for peaceful relaxation)
      const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C D E G A C
      const playChime = () => {
        if (!this._isPlaying) return;
        try {
          const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
          const osc = this._ctx.createOscillator();
          const oscGain = this._ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this._ctx.currentTime);

          oscGain.gain.setValueAtTime(0, this._ctx.currentTime);
          oscGain.gain.linearRampToValueAtTime(0.03, this._ctx.currentTime + 0.3);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, this._ctx.currentTime + 3.5);

          osc.connect(oscGain);
          oscGain.connect(this._gainNode);

          osc.start();
          osc.stop(this._ctx.currentTime + 3.6);
        } catch {}

        const nextTime = Math.random() * 3000 + 2500;
        this._timer = setTimeout(playChime, nextTime);
      };

      this._timer = setTimeout(playChime, 1200);
      this._isPlaying = true;

      // Dispatch event for UI buttons
      window.dispatchEvent(new CustomEvent('ambientSoundChanged', { detail: { playing: true } }));
      return true;
    } catch (err) {
      console.warn('Ambient audio start failed:', err);
      return false;
    }
  },

  stop() {
    if (!this._isPlaying) return;
    try {
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
      if (this._gainNode && this._ctx) {
        this._gainNode.gain.setValueAtTime(this._gainNode.gain.value, this._ctx.currentTime);
        this._gainNode.gain.exponentialRampToValueAtTime(0.0001, this._ctx.currentTime + 0.8);
      }
      setTimeout(() => {
        if (this._whiteNoise) {
          try { this._whiteNoise.stop(); } catch {}
          this._whiteNoise = null;
        }
        this._isPlaying = false;
        window.dispatchEvent(new CustomEvent('ambientSoundChanged', { detail: { playing: false } }));
      }, 800);
    } catch {
      this._isPlaying = false;
    }
  },

  toggle() {
    if (this._isPlaying) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }
};

export default AmbientAudio;
