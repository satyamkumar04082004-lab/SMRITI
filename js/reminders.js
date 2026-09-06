/* ============================================================
   SMRITI — Active Background Reminder Scheduler
   Monitors daily routines, triggers audio chime, spoken notification,
   and senior-friendly modal prompt (Done / Snooze 10 mins).
   ============================================================ */

import Storage from './storage.js';
import TTS from './tts.js';

const ReminderScheduler = {
  _intervalId: null,
  _activeAlertModal: null,
  _lastTriggeredId: null,
  _lastTriggeredTime: 0,

  init() {
    if (this._intervalId) return;
    this.checkReminders();
    this._intervalId = setInterval(() => {
      this.checkReminders();
    }, 30000); // Check every 30 seconds

    window.addEventListener('smritiDataUpdated', () => {
      this.checkReminders();
    });
  },

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },

  playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.4); // C5
      playTone(659.25, 0.25, 0.4); // E5
      playTone(783.99, 0.5, 0.6); // G5
      setTimeout(() => { ctx.close(); }, 1500);
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  },

  checkReminders() {
    const reminders = Storage.getReminders() || [];
    const now = new Date();
    const nowFormatted12 = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    for (const rem of reminders) {
      if (!rem.active || rem.completedToday) continue;

      if (rem.snoozedUntil && Date.now() < rem.snoozedUntil) {
        continue;
      }

      if (rem.snoozedUntil && Date.now() >= rem.snoozedUntil) {
        this.triggerAlert(rem);
        break;
      }

      if (rem.time) {
        const timeNorm = rem.time.trim().toUpperCase();
        const curNorm = nowFormatted12.trim().toUpperCase();

        if (timeNorm === curNorm) {
          if (this._lastTriggeredId === rem.id && (Date.now() - this._lastTriggeredTime < 120000)) {
            continue;
          }
          this.triggerAlert(rem);
          break;
        }
      }
    }
  },

  triggerAlert(reminder) {
    this._lastTriggeredId = reminder.id;
    this._lastTriggeredTime = Date.now();

    this.playChime();

    const textToSpeak = 'Namaste, gentle reminder for: ' + reminder.title + '. ' + (reminder.notes || '');
    const aiSettings = Storage.getAISettings();
    if (aiSettings.autoSpeak !== false) {
      setTimeout(() => {
        TTS.speak(textToSpeak);
      }, 600);
    }

    this.showModal(reminder);
  },

  showModal(reminder) {
    if (this._activeAlertModal) {
      this._activeAlertModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '999999';
    modal.innerHTML = `
      <div class="modal-content text-center" style="max-width: 440px; padding: 2rem 1.5rem; border-radius: 20px; border: 3px solid #F59E0B; background: #FFFDF9; box-shadow: 0 15px 35px rgba(0,0,0,0.25);">
        <div style="font-size: 3.8rem; margin-bottom: 0.5rem;">${reminder.icon || '⏰'}</div>
        <div style="font-size: 0.95rem; font-weight: 800; color: #B45309; text-transform: uppercase;">Gentle Daily Reminder</div>
        <h2 style="color: var(--maroon); margin: 0.4rem 0 0.5rem 0; font-size: 1.65rem; line-height: 1.3;">
          ${reminder.title}
        </h2>
        <div style="font-size: 1.15rem; font-weight: 700; color: var(--teal-dark); margin-bottom: 0.75rem;">
          ⏰ Scheduled for: ${reminder.time}
        </div>
        ${reminder.notes ? `
          <p style="background: #FEF3C7; color: #78350F; padding: 0.85rem 1rem; border-radius: 12px; font-size: 1.1rem; font-weight: 600; margin: 0 0 1.5rem 0; border: 1.5px solid #FDE68A;">
            ${reminder.notes}
          </p>
        ` : '<div style="margin-bottom: 1.5rem;"></div>'}
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <button id="btn-alert-done" class="btn btn-primary" style="min-height: 56px; font-size: 1.25rem; font-weight: 800; border-radius: 14px; background: #059669; border-color: #059669;">
            ✓ Done / Completed
          </button>
          <button id="btn-alert-snooze" class="btn btn-secondary" style="min-height: 52px; font-size: 1.1rem; font-weight: 700; border-radius: 14px;">
            ⏳ Remind Me in 10 Minutes
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this._activeAlertModal = modal;

    modal.querySelector('#btn-alert-done').addEventListener('click', () => {
      Storage.markReminderDone(reminder.id);
      if (window.SmritiToast) {
        window.SmritiToast.show('Well done! Completed ' + reminder.title + ' 🌸', 'success');
      }
      modal.remove();
      this._activeAlertModal = null;
    });

    modal.querySelector('#btn-alert-snooze').addEventListener('click', () => {
      Storage.snoozeReminder(reminder.id, 10);
      if (window.SmritiToast) {
        window.SmritiToast.show('Gentle reminder will prompt you again in 10 minutes.', 'info');
      }
      modal.remove();
      this._activeAlertModal = null;
    });
  }
};

export default ReminderScheduler;
