/* ============================================================
   SMRITI — Active Background Reminder Scheduler & Alarm System
   - Constant background checking interval (compares current local time)
   - Native HTML5 Audio looping alarm with synthetic Web Audio chime fallback
   - High z-index accessible custom modal popup with Stop Alarm & Mark Done
   ============================================================ */

import Storage from './storage.js';
import TTS from './tts.js';

const ReminderScheduler = {
  _intervalId: null,
  _activeAlertModal: null,
  _activeAlarmAudio: null,
  _activeOscillatorInterval: null,
  _triggeredToday: new Set(), // Map of reminderId_time to avoid duplicate triggers within the same minute

  init() {
    if (this._intervalId) return;
    
    // Request native browser notification permission if available
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission();
      } catch (e) {
        console.warn('Notification permission request:', e);
      }
    }

    // Check immediately upon initialization
    this.checkReminders();

    // Constant background checker comparing current time
    this._intervalId = setInterval(() => {
      this.checkReminders();
    }, 1000); // Check every second for exact minute match

    window.addEventListener('smritiDataUpdated', () => {
      this.checkReminders();
    });
  },

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this.stopAlarmSound();
  },

  // Normalizes time strings into standardized HH:MM AM/PM or 24h format for comparison
  normalizeTime(timeStr) {
    if (!timeStr) return '';
    let clean = timeStr.trim().toUpperCase();
    // Handle '8:30 AM' -> '08:30 AM'
    const parts = clean.split(' ');
    if (parts.length === 2) {
      let [hours, mins] = parts[0].split(':');
      hours = hours.padStart(2, '0');
      return `${hours}:${mins} ${parts[1]}`;
    }
    return clean;
  },

  startAlarmSound() {
    this.stopAlarmSound();

    try {
      // 1. Attempt native HTML5 audio element
      // Using a data URI chime melody or synthesized tone generator
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        let isPlaying = true;

        const playBeep = () => {
          if (!isPlaying || ctx.state === 'closed') return;
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.45);

            setTimeout(() => {
              if (!isPlaying || ctx.state === 'closed') return;
              const osc2 = ctx.createOscillator();
              const gain2 = ctx.createGain();
              osc2.type = 'triangle';
              osc2.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
              gain2.gain.setValueAtTime(0, ctx.currentTime);
              gain2.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.05);
              gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
              osc2.connect(gain2);
              gain2.connect(ctx.destination);
              osc2.start(ctx.currentTime);
              osc2.stop(ctx.currentTime + 0.55);
            }, 200);
          } catch (err) {
            console.warn('Alarm tone error:', err);
          }
        };

        playBeep();
        this._activeOscillatorInterval = setInterval(playBeep, 1400);
        this._activeAlarmAudio = {
          stop: () => {
            isPlaying = false;
            clearInterval(this._activeOscillatorInterval);
            this._activeOscillatorInterval = null;
            try { ctx.close(); } catch (e) {}
          }
        };
      }
    } catch (e) {
      console.warn('Audio alarm initialization:', e);
    }
  },

  stopAlarmSound() {
    if (this._activeAlarmAudio && typeof this._activeAlarmAudio.stop === 'function') {
      try {
        this._activeAlarmAudio.stop();
      } catch (e) {}
      this._activeAlarmAudio = null;
    }
    if (this._activeOscillatorInterval) {
      clearInterval(this._activeOscillatorInterval);
      this._activeOscillatorInterval = null;
    }
  },

  checkReminders() {
    const reminders = Storage.getReminders() || [];
    const now = new Date();

    // Format current time in 12-hour format: e.g. "08:30 AM"
    let current12 = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    current12 = this.normalizeTime(current12);

    // Also get 24h format for comparisons: "08:30"
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMins = String(now.getMinutes()).padStart(2, '0');
    const current24 = `${currentHours}:${currentMins}`;

    const nowMinuteKey = `${now.getFullYear()}_${now.getMonth()}_${now.getDate()}_${currentHours}_${currentMins}`;

    for (const rem of reminders) {
      if (!rem.active || rem.completedToday) continue;

      // Check snooze
      if (rem.snoozedUntil && Date.now() < rem.snoozedUntil) {
        continue;
      }

      if (rem.snoozedUntil && Date.now() >= rem.snoozedUntil) {
        const triggerKey = `${rem.id}_snooze_${nowMinuteKey}`;
        if (!this._triggeredToday.has(triggerKey)) {
          this._triggeredToday.add(triggerKey);
          delete rem.snoozedUntil;
          this.triggerAlert(rem);
          break;
        }
      }

      if (rem.time) {
        const remNormalized = this.normalizeTime(rem.time);
        const matches12 = remNormalized === current12;
        const matches24 = rem.time.trim() === current24;

        if (matches12 || matches24) {
          const triggerKey = `${rem.id}_${nowMinuteKey}`;
          if (!this._triggeredToday.has(triggerKey)) {
            this._triggeredToday.add(triggerKey);
            this.triggerAlert(rem);
            break;
          }
        }
      }
    }
  },

  triggerAlert(reminder) {
    // 1. Play persistent alarm audio
    this.startAlarmSound();

    // 2. Native Browser Notification Popup if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(`⏰ SMRITI Alert: ${reminder.title}`, {
          body: `Scheduled for ${reminder.time}. ${reminder.notes || 'Gentle daily routine reminder.'}`,
          icon: '/css/icon-192.svg',
          badge: '/css/icon-192.svg',
          tag: 'reminder_' + reminder.id,
          requireInteraction: true
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }

    // 3. Spoken voice guidance
    const textToSpeak = 'Attention please. Gentle reminder for ' + reminder.title + '. ' + (reminder.notes || '');
    const aiSettings = Storage.getAISettings();
    if (aiSettings.autoSpeak !== false && TTS && TTS.isSupported()) {
      setTimeout(() => {
        TTS.speak(textToSpeak);
      }, 500);
    }

    // 4. Custom high-z-index modal popup with "Stop Alarm / Mark Done"
    this.showModal(reminder);
  },

  showModal(reminder) {
    if (this._activeAlertModal) {
      this._activeAlertModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay smriti-alarm-modal-overlay';
    modal.style.zIndex = '9999999';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0, 0, 0, 0.75)';
    modal.style.backdropFilter = 'blur(6px)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '1rem';

    modal.innerHTML = `
      <div class="modal-content text-center page-enter" style="max-width: 460px; width: 100%; padding: 2.2rem 1.8rem; border-radius: 24px; border: 3.5px solid #F59E0B; background: #FFFDF9; box-shadow: 0 25px 50px rgba(0,0,0,0.35); animation: pulseAlarm 1.5s infinite alternate;">
        <div style="font-size: 4rem; margin-bottom: 0.25rem; animation: floatSlow 2s ease-in-out infinite;">
          ${reminder.icon || '⏰'}
        </div>
        <div style="font-size: 0.95rem; font-weight: 800; color: #B45309; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.25rem;">
          🔔 Alarm Triggered
        </div>
        <h2 style="color: var(--maroon, #9B2C2C); margin: 0.25rem 0 0.5rem 0; font-size: 1.8rem; font-weight: 800; line-height: 1.3;">
          ${reminder.title}
        </h2>
        <div style="font-size: 1.25rem; font-weight: 800; color: var(--teal, #0D9488); margin-bottom: 1rem;">
          ⏰ Scheduled Time: ${reminder.time}
        </div>
        ${reminder.notes ? `
          <p style="background: #FEF3C7; color: #78350F; padding: 1rem 1.25rem; border-radius: 14px; font-size: 1.15rem; font-weight: 700; margin: 0 0 1.5rem 0; border: 1.5px solid #FDE68A; line-height: 1.45;">
            ${reminder.notes}
          </p>
        ` : '<div style="margin-bottom: 1.5rem;"></div>'}

        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <button id="btn-stop-alarm-done" class="btn btn-primary" style="min-height: 58px; font-size: 1.25rem; font-weight: 800; border-radius: 14px; background: #059669; border-color: #059669; box-shadow: 0 4px 14px rgba(5,150,105,0.4);">
            ✓ Stop Alarm / Mark Done
          </button>
          <button id="btn-stop-alarm-snooze" class="btn btn-secondary" style="min-height: 52px; font-size: 1.1rem; font-weight: 700; border-radius: 14px; background: #FFFFFF; border: 2px solid #CBD5E1; color: #334155;">
            ⏳ Stop & Remind in 10 Mins
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this._activeAlertModal = modal;

    modal.querySelector('#btn-stop-alarm-done').addEventListener('click', () => {
      this.stopAlarmSound();
      Storage.markReminderDone(reminder.id);
      if (window.SmritiToast) {
        window.SmritiToast.show('Alarm stopped. Completed ' + reminder.title + ' 🌸', 'success');
      }
      modal.remove();
      this._activeAlertModal = null;
    });

    modal.querySelector('#btn-stop-alarm-snooze').addEventListener('click', () => {
      this.stopAlarmSound();
      Storage.snoozeReminder(reminder.id, 10);
      if (window.SmritiToast) {
        window.SmritiToast.show('Alarm stopped. We will remind you again in 10 minutes.', 'info');
      }
      modal.remove();
      this._activeAlertModal = null;
    });
  }
};

export default ReminderScheduler;
