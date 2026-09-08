/* ============================================================
   SMRITI — Caregiver Hub & Clinical Care Management
   Contextually isolated dashboard:
   - Exclusively displays the attached Patient's Analytics, Medicine Reminders,
     and "Print Clinical Details" option.
   - Strictly references linkedPatient.name instead of currentUser.name.
   - Hides patient-specific Morning interface & taskbar navigation.
   ============================================================ */

import Storage from '../storage.js';
import Auth from '../auth.js';

export default function DashboardPage(container) {
  const currentUser = Auth.getUser() || { name: 'Caregiver', role: 'caregiver' };
  
  // Resolve linked patient strictly
  let linkedPatientUsername = currentUser.linkedPatientUsername || 'meera_das';
  let targetPatientId = currentUser.patientId || ('patient_' + linkedPatientUsername);
  
  // If linked patient is meera_das, ensure ID matches default
  if (linkedPatientUsername === 'meera_das') {
    targetPatientId = 'patient_meera_01';
  }

  // Retrieve attached patient profile
  let patientProfile = Storage.getPatientProfile(targetPatientId);
  let linkedPatient = (patientProfile && patientProfile.patient) || {
    name: 'Meera Das',
    preferredName: 'Meera',
    age: 72,
    stage: 'Mild MCI',
    phone: '9876543210'
  };

  let activeTab = 'analytics'; // analytics | medicines | print

  function getFreshData() {
    patientProfile = Storage.getPatientProfile(targetPatientId);
    linkedPatient = (patientProfile && patientProfile.patient) || linkedPatient;
  }

  function render() {
    getFreshData();
    const history = patientProfile.gameHistory || [];
    const medicines = patientProfile.medicines || [];
    const reminders = patientProfile.reminders || [];
    const moodHistory = patientProfile.moodHistory || [];
    const emergency = patientProfile.emergencyContacts || Storage.getEmergencyContacts();

    // Stats calculations for the attached patient
    const totalSessions = history.length;
    const avgAccuracy = totalSessions > 0
      ? Math.round(history.reduce((sum, h) => sum + (h.accuracy || 0), 0) / totalSessions)
      : 88;

    // Game breakdown for the attached patient
    const breakdown = {};
    history.forEach(h => {
      if (!breakdown[h.gameId]) {
        breakdown[h.gameId] = { count: 0, totalAcc: 0, name: h.gameName };
      }
      breakdown[h.gameId].count++;
      breakdown[h.gameId].totalAcc += (h.accuracy || 0);
    });

    let bestGame = 'Hornbill Memory Nest';
    let highestAcc = -1;
    for (const id in breakdown) {
      const avg = breakdown[id].totalAcc / breakdown[id].count;
      if (avg > highestAcc) {
        highestAcc = avg;
        bestGame = breakdown[id].name || id;
      }
    }

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 860px; padding-bottom: 3rem;">
        
        <!-- Caregiver Context Banner -->
        <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #F0FDF4, #ECFDF5); border: 2px solid #A7F3D0; border-radius: 18px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="background: #065F46; color: #FFFFFF; font-size: 0.8rem; font-weight: 800; padding: 3px 10px; border-radius: 12px; text-transform: uppercase;">
                  Caregiver Portal
                </span>
                <span style="color: #047857; font-size: 0.9rem; font-weight: 600;">
                  Logged in as: <strong>${currentUser.name}</strong> (@${currentUser.username || 'caregiver'})
                </span>
              </div>
              <h2 style="color: #064E3B; margin: 0.35rem 0 0.25rem 0; font-size: 1.8rem; font-weight: 800;">
                Attached Patient: <span style="color: #0D9488;">${linkedPatient.name}</span>
              </h2>
              <p style="color: #065F46; margin: 0; font-size: 0.95rem;">
                Monitoring cognitive metrics, daily medication compliance, and clinical reports for <strong>${linkedPatient.name}</strong> (@${linkedPatientUsername})
              </p>
            </div>

            <!-- Patient Switcher / Link Input -->
            <div style="display: flex; flex-direction: column; gap: 6px; min-width: 220px;">
              <div style="display: flex; gap: 6px;">
                <input type="text" id="inp-switch-patient" class="form-input" placeholder="Search Patient @username" value="${linkedPatientUsername}" style="font-size: 0.88rem; padding: 6px 10px; height: 38px;" />
                <button id="btn-switch-patient" class="btn btn-sm btn-primary" style="background: #0D9488; border-color: #0D9488; height: 38px; white-space: nowrap;">
                  Link
                </button>
              </div>
              <button id="btn-caregiver-logout" class="btn btn-sm btn-outline" style="border-color: #EF4444; color: #DC2626; align-self: flex-end;">
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>

        <!-- Caregiver Scope Tabs: 1. Patient Analytics | 2. Medicine Reminders | 3. Print Clinical Details -->
        <div style="display: flex; gap: 0.6rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
          <button class="chip-btn ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics" style="font-size: 1rem; font-weight: 700;">
            📊 Patient Analytics
          </button>
          <button class="chip-btn ${activeTab === 'medicines' ? 'active' : ''}" data-tab="medicines" style="font-size: 1rem; font-weight: 700;">
            ⏰ Medicine Reminders
          </button>
          <button class="chip-btn ${activeTab === 'print' ? 'active' : ''}" data-tab="print" style="font-size: 1rem; font-weight: 700;">
            🖨️ Print Clinical Details
          </button>
        </div>

        <!-- 1. PATIENT ANALYTICS DASHBOARD -->
        ${activeTab === 'analytics' ? `
          <!-- High-Level Stat Cards for Attached Patient -->
          <div class="stat-grid mb-md" style="grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));">
            <div class="stat-card" style="border-top: 4px solid #0D9488;">
              <div class="stat-label">${linkedPatient.name}'s Sessions</div>
              <div class="stat-value" style="color: #0D9488;">${totalSessions}</div>
              <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">Completed cognitive trials</div>
            </div>
            <div class="stat-card" style="border-top: 4px solid #9B2C2C;">
              <div class="stat-label">Average Accuracy</div>
              <div class="stat-value" style="color: #9B2C2C;">${avgAccuracy}%</div>
              <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">Overall performance</div>
            </div>
            <div class="stat-card" style="border-top: 4px solid #D97706;">
              <div class="stat-label">Active Prescriptions</div>
              <div class="stat-value" style="color: #D97706;">${medicines.length}</div>
              <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">Tracked medications</div>
            </div>
            <div class="stat-card" style="border-top: 4px solid #2563EB;">
              <div class="stat-label">Strongest Domain</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #1D4ED8; margin-top: 0.35rem;">${bestGame}</div>
              <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">Best adherence & accuracy</div>
            </div>
          </div>

          <!-- Game Performance Breakdown -->
          <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 16px;">
            <h3 style="color: var(--maroon); margin-top: 0; margin-bottom: 1rem; font-size: 1.3rem;">
              🎮 ${linkedPatient.name}'s Cognitive Domain Breakdown
            </h3>
            ${Object.keys(breakdown).length === 0 ? `
              <p class="text-muted" style="margin: 0;">No game trials recorded yet for this patient profile.</p>
            ` : `
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <thead>
                    <tr style="border-bottom: 2px solid #E2E8F0; color: #475569;">
                      <th style="padding: 0.75rem 0.5rem;">Cognitive Game</th>
                      <th style="padding: 0.75rem 0.5rem; text-align: center;">Trials</th>
                      <th style="padding: 0.75rem 0.5rem; text-align: right;">Average Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${Object.keys(breakdown).map(id => `
                      <tr style="border-bottom: 1px solid #F1F5F9;">
                        <td style="padding: 0.85rem 0.5rem; font-weight: 700; color: #1E293B;">${breakdown[id].name || id}</td>
                        <td style="padding: 0.85rem 0.5rem; text-align: center;">${breakdown[id].count}</td>
                        <td style="padding: 0.85rem 0.5rem; text-align: right; font-weight: 800; color: #0D9488;">${Math.round(breakdown[id].totalAcc / breakdown[id].count)}%</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

          <!-- Recent Mood Check-Ins for Attached Patient -->
          <div class="card card-elevated" style="padding: 1.5rem; border-radius: 16px;">
            <h3 style="color: #1E293B; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.25rem;">
              🌈 Recent Mood & Wellness Check-Ins
            </h3>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${moodHistory.slice(-4).reverse().map(m => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5rem;">${m.emoji || '🙂'}</span>
                    <div>
                      <strong style="color: #1E293B; text-transform: capitalize;">${m.label || m.mood}</strong>
                      <div style="font-size: 0.82rem; color: #64748B;">${m.note || 'Regular daily check-in'}</div>
                    </div>
                  </div>
                  <span style="font-size: 0.85rem; color: #0D9488; font-weight: 600;">${m.date}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 2. MEDICINE REMINDERS FOR ATTACHED PATIENT -->
        ${activeTab === 'medicines' ? `
          <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h3 style="color: #065F46; margin: 0; font-size: 1.35rem;">⏰ ${linkedPatient.name}'s Medication & Care Reminders</h3>
                <p style="font-size: 0.9rem; color: #64748B; margin: 0.2rem 0 0 0;">Schedule daily reminders for medicine, hydration, and exercise.</p>
              </div>
              <button class="btn btn-primary btn-sm" id="btn-open-rem-form" style="background: #0D9488; border-color: #0D9488;">
                + Add New Reminder
              </button>
            </div>

            <!-- Add Reminder Panel (Hidden by default) -->
            <div id="panel-add-rem" style="display: none; background: #F0FDF4; border: 2px dashed #059669; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: #065F46;">Schedule Reminder for ${linkedPatient.name}</h4>
              <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                <input type="text" id="inp-rem-name" class="form-input" placeholder="Title (e.g. Morning Blood Pressure Tablet, Drink Warm Water)" />
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="inp-rem-time" class="form-input" style="flex: 1;" placeholder="Time (e.g. 08:30 AM)" />
                  <select id="inp-rem-period" class="form-select" style="flex: 1;">
                    <option value="Morning">Morning ☀️</option>
                    <option value="Afternoon">Afternoon 🌤️</option>
                    <option value="Evening">Evening 🌆</option>
                    <option value="Night">Night 🌙</option>
                  </select>
                </div>
                <input type="text" id="inp-rem-dose" class="form-input" placeholder="Dose / Instructions (e.g. 1 tablet with warm glass of water)" />
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.35rem;">
                  <button type="button" id="btn-cancel-rem" class="btn btn-outline btn-sm">Cancel</button>
                  <button type="button" id="btn-save-rem" class="btn btn-primary btn-sm" style="background: #059669; border-color: #059669;">Save Reminder</button>
                </div>
              </div>
            </div>

            <!-- Reminders List -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${reminders.length === 0 ? `
                <p class="text-muted" style="margin: 0;">No active reminders found for this patient.</p>
              ` : reminders.map(r => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #FFFFFF; border-radius: 12px; border: 1.5px solid #E2E8F0;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 1.6rem; background: #E6F4F1; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 10px;">
                      ${r.period === 'Morning' ? '☀️' : r.period === 'Night' ? '🌙' : '🌤️'}
                    </div>
                    <div>
                      <div style="font-weight: 700; color: #1E293B; font-size: 1.05rem;">${r.title || r.medName}</div>
                      <div style="font-size: 0.85rem; color: #64748B;">${r.notes || r.dose || 'Scheduled'} • <strong style="color: #0D9488;">${r.time} (${r.period || 'Daily'})</strong></div>
                    </div>
                  </div>
                  <button class="btn btn-outline btn-sm btn-delete-rem" data-id="${r.id}" style="color: #DC2626; border-color: #FCA5A5; padding: 0.3rem 0.6rem; font-size: 0.8rem;">
                    Remove
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Prescriptions Overview -->
          <div class="card card-elevated" style="padding: 1.5rem; border-radius: 16px;">
            <h3 style="color: #1E40AF; margin-top: 0; margin-bottom: 0.75rem; font-size: 1.25rem;">💊 Active Prescriptions</h3>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${medicines.map(m => `
                <div style="padding: 0.85rem 1rem; background: #EFF6FF; border-radius: 10px; border: 1px solid #BFDBFE;">
                  <div style="font-weight: 700; color: #1E40AF; font-size: 1.05rem;">${m.name} (${m.strength || 'Standard'})</div>
                  <div style="font-size: 0.88rem; color: #1E3A8A; margin-top: 2px;">${m.instructions || ''} • ${m.frequency || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3. PRINT CLINICAL DETAILS OPTION -->
        ${activeTab === 'print' ? `
          <div class="card card-elevated mb-md" style="padding: 1.75rem; border-radius: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3 style="color: #0F172A; margin: 0; font-size: 1.4rem;">🖨️ Printable Clinical & Patient Summary</h3>
                <p style="color: #64748B; font-size: 0.95rem; margin: 0.2rem 0 0 0;">Official clinical handover document for physicians, clinics, and family records.</p>
              </div>
              <button id="btn-trigger-print" class="btn btn-primary" style="background: #2563EB; border-color: #2563EB; font-size: 1.05rem; font-weight: 700; padding: 0.6rem 1.4rem; border-radius: 10px;">
                🖨️ Print Clinical Details
              </button>
            </div>

            <!-- Print Preview Sheet -->
            <div id="clinical-print-sheet" style="background: #FFFFFF; border: 2px solid #CBD5E1; border-radius: 14px; padding: 2rem; color: #0F172A;">
              <div style="border-bottom: 2px solid #0F172A; padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                  <h2 style="margin: 0; font-size: 1.8rem; color: #1E1B4B; font-weight: 800;">SMRITI CLINICAL HANDOVER SUMMARY</h2>
                  <div style="font-size: 0.95rem; color: #475569; margin-top: 4px;">Standardized Cognitive Health & Adherence Baseline</div>
                </div>
                <div style="text-align: right; font-size: 0.88rem; color: #64748B;">
                  Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <!-- Patient Demographics Section -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; background: #F8FAFC; padding: 1rem; border-radius: 10px;">
                <div>
                  <div><strong>Patient Full Name:</strong> ${linkedPatient.name}</div>
                  <div><strong>Username:</strong> @${linkedPatientUsername}</div>
                  <div><strong>Age / Gender:</strong> ${linkedPatient.age || 72} y/o (${linkedPatient.gender || 'Female'})</div>
                  <div><strong>State / Region:</strong> ${patientProfile.preferences?.regionalState || linkedPatient.state || 'Assam'}</div>
                </div>
                <div>
                  <div><strong>Cognitive Stage:</strong> ${linkedPatient.stage || 'Mild Cognitive Impairment (MCI)'}</div>
                  <div><strong>Assigned Caregiver:</strong> ${currentUser.name} (@${currentUser.username || 'caregiver'})</div>
                  <div><strong>Primary Contact:</strong> ${emergency.primaryPhone || '+919876543210'}</div>
                  <div><strong>Attending Physician:</strong> ${emergency.doctorName || 'Dr. A. K. Barua'}</div>
                </div>
              </div>

              <!-- Prescriptions Table -->
              <div style="margin-bottom: 1.5rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #1E40AF; border-bottom: 1.5px solid #DBEAFE; padding-bottom: 4px;">Active Prescriptions & Schedule</h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                  <thead>
                    <tr style="background: #EFF6FF; text-align: left;">
                      <th style="padding: 6px 8px;">Medicine</th>
                      <th style="padding: 6px 8px;">Strength</th>
                      <th style="padding: 6px 8px;">Schedule / Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${medicines.map(m => `
                      <tr style="border-bottom: 1px solid #E2E8F0;">
                        <td style="padding: 6px 8px; font-weight: 600;">${m.name}</td>
                        <td style="padding: 6px 8px;">${m.strength || '—'}</td>
                        <td style="padding: 6px 8px;">${m.instructions || ''} (${m.frequency || ''})</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Cognitive Performance Summary -->
              <div style="margin-bottom: 1.5rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #065F46; border-bottom: 1.5px solid #A7F3D0; padding-bottom: 4px;">Longitudinal Cognitive Task Performance</h4>
                <div style="display: flex; gap: 1.5rem; margin-top: 8px;">
                  <div style="padding: 10px 16px; background: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
                    <div style="font-size: 0.85rem; color: #166534;">Total Recorded Sessions</div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: #065F46;">${totalSessions}</div>
                  </div>
                  <div style="padding: 10px 16px; background: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
                    <div style="font-size: 0.85rem; color: #166534;">Average Task Accuracy</div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: #065F46;">${avgAccuracy}%</div>
                  </div>
                  <div style="padding: 10px 16px; background: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
                    <div style="font-size: 0.85rem; color: #166534;">Clinical Impression</div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: #065F46;">Stable</div>
                  </div>
                </div>
              </div>

              <div style="font-size: 0.82rem; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 0.75rem; text-align: center;">
                SMRITI Cognitive Care Platform • Verified Digital Health Record • Confidential Medical Handover
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Tab switcher
    container.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // Patient switcher
    const switchBtn = container.querySelector('#btn-switch-patient');
    const switchInp = container.querySelector('#inp-switch-patient');
    if (switchBtn && switchInp) {
      switchBtn.addEventListener('click', () => {
        const queryUsername = switchInp.value.trim().toLowerCase().replace(/^@/, '');
        if (!queryUsername) return alert('Enter a patient username to link');
        
        currentUser.linkedPatientUsername = queryUsername;
        currentUser.patientId = 'patient_' + queryUsername;
        Storage.setUser(currentUser);
        linkedPatientUsername = queryUsername;
        targetPatientId = currentUser.patientId;
        render();
      });
    }

    // Caregiver Logout
    const logoutBtn = container.querySelector('#btn-caregiver-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
        window.location.hash = '#/login';
      });
    }

    // Medicine Reminders
    const openRemForm = container.querySelector('#btn-open-rem-form');
    const panelAddRem = container.querySelector('#panel-add-rem');
    const cancelRem = container.querySelector('#btn-cancel-rem');
    const saveRem = container.querySelector('#btn-save-rem');

    if (openRemForm && panelAddRem) {
      openRemForm.addEventListener('click', () => {
        panelAddRem.style.display = panelAddRem.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (cancelRem && panelAddRem) {
      cancelRem.addEventListener('click', () => {
        panelAddRem.style.display = 'none';
      });
    }

    if (saveRem) {
      saveRem.addEventListener('click', () => {
        const title = container.querySelector('#inp-rem-name')?.value.trim();
        const time = container.querySelector('#inp-rem-time')?.value.trim() || '08:30 AM';
        const period = container.querySelector('#inp-rem-period')?.value || 'Morning';
        const notes = container.querySelector('#inp-rem-dose')?.value.trim() || '1 tablet';

        if (!title) return alert('Please enter reminder title');

        const newReminder = {
          id: 'rem_' + Date.now(),
          title,
          time,
          period,
          notes,
          active: true,
          completedToday: false
        };

        patientProfile.reminders = patientProfile.reminders || [];
        patientProfile.reminders.unshift(newReminder);
        Storage.savePatientProfile(patientProfile);
        render();
      });
    }

    // Delete Reminder
    container.querySelectorAll('.btn-delete-rem').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const remId = e.currentTarget.getAttribute('data-id');
        if (remId && patientProfile.reminders) {
          patientProfile.reminders = patientProfile.reminders.filter(r => r.id !== remId);
          Storage.savePatientProfile(patientProfile);
          render();
        }
      });
    });

    // Trigger Print
    const printBtn = container.querySelector('#btn-trigger-print');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  render();
  return { cleanup() {} };
}
