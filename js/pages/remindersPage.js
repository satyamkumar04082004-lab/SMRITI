/* ============================================================
   SMRITI — Gentle Daily Reminders Page
   Medication, hydration, sunlight walks, family calls & rest
   ============================================================ */

import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';

export default function RemindersPage(container) {
  let reminders = Storage.getReminders();
  let showAddModal = false;
  let activeFilter = 'all'; // all | morning | afternoon | evening | night

  function render() {
    const lang = I18n.lang;
    let pageTitle = "Daily Gentle Reminders";
    let pageSub = "Caring prompts for your medicines, hydration, fresh air and family calls.";
    let addBtnText = "➕ Add Reminder";
    let filterAll = "All Day 🗓️";
    let filterMorn = "Morning ☀️";
    let filterAft = "Afternoon 🌤️";
    let filterEve = "Evening 🌆";
    let filterNight = "Night 🌙";

    if (lang === 'hi') {
      pageTitle = "दैनिक सौम्य अनुस्मारक";
      pageSub = "दवाइयों, पानी पीने, ताज़ी हवा और पारिवारिक बातचीत के लिए प्यार भरे संकेत।";
      addBtnText = "➕ नया अनुस्मारक जोड़ें";
      filterAll = "पूरा दिन 🗓️";
      filterMorn = "सुबह ☀️";
      filterAft = "दोपहर 🌤️";
      filterEve = "शाम 🌆";
      filterNight = "रात 🌙";
    } else if (lang === 'bn') {
      pageTitle = "দৈনিক যত্নশীল অনুস্মারক";
      pageSub = "ওষুধ, পর্যাপ্ত জলপান, মুক্ত বাতাস ও পরিবারের সাথে কথার সময় মনে রাখার সহায়ক।";
      addBtnText = "➕ নতুন অনুস্মারক যোগ করুন";
      filterAll = "সারাদিন 🗓️";
      filterMorn = "সকাল ☀️";
      filterAft = "দুপুর 🌤️";
      filterEve = "সন্ধ্যা 🌆";
      filterNight = "রাত 🌙";
    }

    const filtered = activeFilter === 'all' 
      ? reminders 
      : reminders.filter(r => r.period.toLowerCase() === activeFilter);

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 780px; padding: 20px 15px 3.5rem 15px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h2 style="color: var(--maroon); margin: 0; font-size: 1.85rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>⏰</span> ${pageTitle}
            </h2>
            <p style="color: var(--gray-600); margin: 0.25rem 0 0 0; font-size: 1rem;">
              ${pageSub}
            </p>
          </div>
          <button id="btn-open-add-rem" class="btn btn-primary btn-sm" style="min-height: 46px; font-size: 1rem; padding: 0.5rem 1.2rem;">
            ${addBtnText}
          </button>
        </div>

        <!-- Filter Chips -->
        <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1.25rem;">
          <button class="chip-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">${filterAll}</button>
          <button class="chip-btn ${activeFilter === 'morning' ? 'active' : ''}" data-filter="morning">${filterMorn}</button>
          <button class="chip-btn ${activeFilter === 'afternoon' ? 'active' : ''}" data-filter="afternoon">${filterAft}</button>
          <button class="chip-btn ${activeFilter === 'evening' ? 'active' : ''}" data-filter="evening">${filterEve}</button>
          <button class="chip-btn ${activeFilter === 'night' ? 'active' : ''}" data-filter="night">${filterNight}</button>
        </div>

        <!-- Add Modal (Conditional) -->
        ${showAddModal ? `
          <div class="card card-elevated mb-md" style="background: #FFFDF9; border: 2px solid var(--teal); padding: 1.25rem; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="margin: 0; color: var(--teal-dark); font-size: 1.2rem;">✨ Schedule a Gentle Reminder</h3>
              <button id="btn-close-add-modal" class="btn btn-ghost btn-sm" style="font-size: 1.2rem;">✕</button>
            </div>
            <form id="form-new-reminder" style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div>
                <label class="form-label" style="font-weight: 600;">Reminder Title</label>
                <input type="text" id="new-rem-title" class="form-input" placeholder="e.g. Drink Warm Water, Evening Walk, BP Medicine" required />
              </div>
              
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 130px;">
                  <label class="form-label" style="font-weight: 600;">Time</label>
                  <input type="text" id="new-rem-time" class="form-input" placeholder="e.g. 09:30 AM" required />
                </div>
                <div style="flex: 1; min-width: 130px;">
                  <label class="form-label" style="font-weight: 600;">Part of Day</label>
                  <select id="new-rem-period" class="form-select">
                    <option value="Morning">Morning ☀️</option>
                    <option value="Afternoon">Afternoon 🌤️</option>
                    <option value="Evening">Evening 🌆</option>
                    <option value="Night">Night 🌙</option>
                  </select>
                </div>
                <div style="flex: 1; min-width: 130px;">
                  <label class="form-label" style="font-weight: 600;">Category</label>
                  <select id="new-rem-cat" class="form-select">
                    <option value="medication">💊 Medicine</option>
                    <option value="hydration">💧 Hydration</option>
                    <option value="activity">🚶 Walk / Activity</option>
                    <option value="call">📞 Family Call</option>
                    <option value="custom">⭐ General</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="form-label" style="font-weight: 600;">Gentle Instructions / Dose</label>
                <input type="text" id="new-rem-notes" class="form-input" placeholder="e.g. 1 tablet with warm water, or wear comfortable shoes" />
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
                <button type="button" id="btn-cancel-add-rem" class="btn btn-outline btn-sm">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm" style="padding: 0.6rem 1.5rem;">Save Reminder</button>
              </div>
            </form>
          </div>
        ` : ''}

        <!-- Reminders List -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${filtered.length === 0 ? `
            <div class="card text-center" style="padding: 2.5rem 1rem; color: var(--gray-500);">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🕊️</div>
              <p style="font-size: 1.1rem; margin: 0;">No reminders in this time period.</p>
            </div>
          ` : filtered.map(r => {
            const isCompleted = r.completedToday;
            const isSnoozed = r.snoozedUntil && r.snoozedUntil > Date.now();
            const minutesLeft = isSnoozed ? Math.ceil((r.snoozedUntil - Date.now()) / 60000) : 0;

            return `
              <div class="card card-elevated" style="padding: 1.25rem; border-radius: 16px; border-left: 6px solid ${isCompleted ? '#10B981' : 'var(--teal)'}; background: ${isCompleted ? '#F0FDF4' : '#FFFFFF'}; transition: all 0.25s ease;">
                
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 0.85rem; flex: 1; min-width: 240px;">
                    <div style="font-size: 2rem; background: ${isCompleted ? '#DCFCE7' : '#FDF8F3'}; width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      ${r.icon || '⏰'}
                    </div>
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <h4 style="margin: 0; font-size: 1.2rem; color: var(--maroon); text-decoration: ${isCompleted ? 'line-through' : 'none'};">
                          ${r.title}
                        </h4>
                        ${isCompleted ? `<span style="background: #10B981; color: #FFF; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 10px;">Done ✨</span>` : ''}
                        ${isSnoozed ? `<span style="background: #FEF3C7; color: #92400E; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 10px;">Snoozed (${minutesLeft}m) ⏳</span>` : ''}
                      </div>
                      <p style="margin: 0.25rem 0 0 0; color: var(--gray-600); font-size: 0.95rem;">
                        ${r.notes || 'Gentle daily reminder'} • <strong style="color: var(--teal-dark);">${r.time} (${r.period})</strong>
                      </p>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn btn-ghost btn-sm btn-del-reminder" data-id="${r.id}" title="Delete reminder" style="color: #9CA3AF; padding: 0.25rem 0.5rem;">
                      🗑️
                    </button>
                  </div>
                </div>

                <!-- Action Buttons: Large and Senior Accessible -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-top: 1.1rem; padding-top: 0.85rem; border-top: 1px solid ${isCompleted ? '#BBF7D0' : '#F1F5F9'};">
                  ${!isCompleted ? `
                    <button class="btn btn-secondary btn-rem-done" data-id="${r.id}" style="min-height: 52px; font-size: 1.05rem; font-weight: 700; background: #059669; justify-content: center;">
                      ${lang === 'hi' ? '✅ पूरा हुआ' : (lang === 'bn' ? '✅ সম্পন্ন হয়েছে' : '✅ Mark Done')}
                    </button>
                    <!-- Super easy to tap Remind in 10 mins button -->
                    <button class="btn btn-outline btn-rem-snooze" data-id="${r.id}" style="min-height: 52px; font-size: 1.05rem; font-weight: 700; border-color: #D97706; color: #B45309; background: #FFFBEB; justify-content: center;">
                      ${lang === 'hi' ? '⏰ 10 मिनट बाद याद दिलाएं' : (lang === 'bn' ? '⏰ ১০ মিনিট পর মনে করান' : '⏰ Remind in 10 mins')}
                    </button>
                  ` : `
                    <button class="btn btn-outline btn-rem-done" data-id="${r.id}" style="min-height: 48px; font-size: 0.95rem; border-color: #10B981; color: #065F46; justify-content: center;">
                      ${lang === 'hi' ? '✓ आज के लिए पूर्ण' : (lang === 'bn' ? '✓ আজকের জন্য সম্পন্ন' : '✓ Completed for Today')}
                    </button>
                  `}
                </div>

              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Filter chips
    container.querySelectorAll('.chip-btn').forEach(b => {
      b.addEventListener('click', () => {
        activeFilter = b.getAttribute('data-filter');
        render();
      });
    });

    // Modal toggle
    const btnOpenAdd = container.querySelector('#btn-open-add-rem');
    if (btnOpenAdd) {
      btnOpenAdd.addEventListener('click', () => {
        showAddModal = true;
        render();
      });
    }

    const btnCloseAdd = container.querySelector('#btn-close-add-modal');
    const btnCancelAdd = container.querySelector('#btn-cancel-add-rem');
    if (btnCloseAdd) btnCloseAdd.addEventListener('click', () => { showAddModal = false; render(); });
    if (btnCancelAdd) btnCancelAdd.addEventListener('click', () => { showAddModal = false; render(); });

    // New reminder form
    const formNew = container.querySelector('#form-new-reminder');
    if (formNew) {
      formNew.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#new-rem-title').value.trim();
        const time = container.querySelector('#new-rem-time').value.trim();
        const period = container.querySelector('#new-rem-period').value;
        const category = container.querySelector('#new-rem-cat').value;
        const notes = container.querySelector('#new-rem-notes').value.trim();

        const iconMap = {
          medication: '💊',
          hydration: '💧',
          activity: '🚶',
          call: '📞',
          custom: '⭐'
        };

        Storage.addReminder({
          title,
          time,
          period,
          category,
          icon: iconMap[category] || '⏰',
          notes: notes || 'Daily gentle reminder'
        });

        showAddModal = false;
        reminders = Storage.getReminders();
        if (window.SmritiToast) {
          window.SmritiToast.show('Gentle reminder scheduled! 🌸', 'success');
        }
        render();
      });
    }

    // Mark Done
    container.querySelectorAll('.btn-rem-done').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        Storage.markReminderDone(id);
        reminders = Storage.getReminders();
        if (window.SmritiToast) {
          window.SmritiToast.show('Well done! Task marked as completed. 🌿', 'success');
        }
        render();
      });
    });

    // Remind in 10 mins (Snooze)
    container.querySelectorAll('.btn-rem-snooze').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        Storage.snoozeReminder(id, 10);
        reminders = Storage.getReminders();
        if (window.SmritiToast) {
          window.SmritiToast.show('We will gently remind you again in 10 minutes! 🕊️', 'info');
        }
        if (TTS && TTS.isSupported()) {
          TTS.speak('Got it. We will remind you in ten minutes.');
        }
        render();
      });
    });

    // Delete
    container.querySelectorAll('.btn-del-reminder').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        if (confirm('Do you want to remove this reminder?')) {
          Storage.deleteReminder(id);
          reminders = Storage.getReminders();
          render();
        }
      });
    });
  }

  render();

  return { cleanup() {} };
}
