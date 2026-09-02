/* ============================================================
   SMRITI — Game Timer System
   Countdown and elapsed timers with display formatting
   ============================================================ */

const Timer = {
  /**
   * Create a new timer instance
   * @param {'countdown'|'elapsed'} mode
   * @param {number} duration - seconds (for countdown)
   * @returns {TimerInstance}
   */
  create(mode = 'elapsed', duration = 0) {
    return new TimerInstance(mode, duration);
  },
};

class TimerInstance {
  constructor(mode, duration) {
    this.mode = mode;
    this.duration = duration;
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;
    this.intervalId = null;
    this.onTick = null;
    this.onComplete = null;
    this.displayEl = null;
  }

  /**
   * Bind to a DOM element for live display
   * @param {HTMLElement} el
   */
  bindDisplay(el) {
    this.displayEl = el;
  }

  /**
   * Start the timer
   */
  start() {
    if (this.running) return;
    this.startTime = Date.now();
    this.running = true;
    this.intervalId = setInterval(() => this._tick(), 100);
  }

  /**
   * Pause the timer
   */
  pause() {
    if (!this.running) return;
    this.elapsed += (Date.now() - this.startTime) / 1000;
    this.running = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  /**
   * Resume after pause
   */
  resume() {
    if (this.running) return;
    this.startTime = Date.now();
    this.running = true;
    this.intervalId = setInterval(() => this._tick(), 100);
  }

  /**
   * Stop and return final time in seconds
   * @returns {number}
   */
  stop() {
    if (this.running) {
      this.elapsed += (Date.now() - this.startTime) / 1000;
      this.running = false;
    }
    clearInterval(this.intervalId);
    this.intervalId = null;
    return Math.round(this.elapsed);
  }

  /**
   * Get current elapsed seconds
   * @returns {number}
   */
  getElapsed() {
    let total = this.elapsed;
    if (this.running) {
      total += (Date.now() - this.startTime) / 1000;
    }
    return Math.round(total);
  }

  /**
   * Get remaining seconds (countdown mode)
   * @returns {number}
   */
  getRemaining() {
    if (this.mode !== 'countdown') return 0;
    return Math.max(0, this.duration - this.getElapsed());
  }

  /**
   * Format seconds to mm:ss
   * @param {number} secs
   * @returns {string}
   */
  static format(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  /**
   * Internal tick
   */
  _tick() {
    const currentElapsed = this.getElapsed();
    
    // Update display
    if (this.displayEl) {
      if (this.mode === 'countdown') {
        const remaining = this.getRemaining();
        this.displayEl.textContent = TimerInstance.format(remaining);
        if (remaining <= 0) {
          this.stop();
          if (this.onComplete) this.onComplete();
          return;
        }
      } else {
        this.displayEl.textContent = TimerInstance.format(currentElapsed);
      }
    }

    if (this.onTick) this.onTick(currentElapsed);
  }

  /**
   * Destroy timer
   */
  destroy() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.running = false;
    this.displayEl = null;
    this.onTick = null;
    this.onComplete = null;
  }
}

export { Timer, TimerInstance };
export default Timer;
