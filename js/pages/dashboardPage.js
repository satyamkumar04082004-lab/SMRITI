/* ============================================================
   SMRITI — Caregiver Hub & Clinical Care Management
   Contextually isolated dashboard:
   - Exclusively displays the attached Patient's Analytics, Medicine Reminders,
     Scheduled Appointments, Clinical Behavioral Notes (synced to Doctor),
     Safety & GPS Alerts, and Printable Clinical Handover.
   - Strictly references linkedPatient.name instead of currentUser.name.
   - Secure patient linking via Username + Patient OTP verification (1234).
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

  let activeTab = 'analytics'; // analytics | medicines | appointments | notes | safety | print

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
    const clinicalNotes = Storage.getClinicalNotes(linkedPatientUsername);
    const nextAppt = Storage.getNextAppointment(linkedPatientUsername);
    const emergencyAlerts = Storage.getEmergencyAlerts();

    // Stats calculations for the attached patient
    const totalSessions = history.length;
    const avgAccuracy = totalSessions > 0
      ? Math.round(history.reduce((sum, h) => sum + (h.accuracy || 0), 0) / totalSessions)
      : (linkedPatientUsername === 'meera_das' ? 88 : 0);

    // Game breakdown for the attached patient
    const breakdown = {};
    history.forEach(h => {
      if (!breakdown[h.gameId]) {
        breakdown[h.gameId] = { count: 0, totalAcc: 0, name: h.gameName };
      }
      breakdown[h.gameId].count++;
      breakdown[h.gameId].totalAcc += (h.accuracy || 0);
    });

    let bestGame = totalSessions > 0 ? 'Hornbill Memory Nest' : 'None yet';
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

            <!-- Secure Patient Linking via OTP (Module 4) -->
            <div style="display: flex; flex-direction: column; gap: 6px; min-width: 240px;">
              <div style="display: flex; gap: 6px;">
                <input type="text" id="inp-switch-patient" class="form-input" placeholder="Patient @username" value="${linkedPatientUsername}" style="font-size: 0.88rem; padding: 6px 10px; height: 42px;" />
                <button id="btn-switch-patient" class="btn btn-sm btn-primary" style="background: #0D9488; border-color: #0D9488; height: 42px; white-space: nowrap; font-weight: 700; cursor: pointer;">
                  🔒 Link with OTP
                </button>
              </div>
              <button id="btn-caregiver-logout" class="btn btn-sm btn-outline" style="border-color: #EF4444; color: #DC2626; align-self: flex-end; cursor: pointer;">
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>

        <!-- Caregiver Scope Tabs: 1. Analytics | 2. Remote Reminders | 3. Appointments | 4. Clinical Notes | 5. Safety Alerts | 6. Print -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.75rem; margin-bottom: 1.5rem; overflow-x: auto;">
          <button class="chip-btn ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics" style="min-height: 48px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
            📊 Patient Analytics
          </button>
          <button class="chip-btn ${activeTab === 'medicines' ? 'active' : ''}" data-tab="medicines" style="min-height: 48px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
            ⏰ Remote Reminders
          </button>
          <button class="chip-btn ${activeTab === 'appointments' ? 'active' : ''}" data-tab="appointments" style="min-height: 48px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
            🩺 Appointments
          </button>
          <button class="chip-btn ${activeTab === 'notes' ? 'active' : ''}" data-tab="notes" style="min-height: 48px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
            📝 Clinical Notes (Doctor Sync)
          </button>
          <button class="chip-btn ${activeTab === 'safety' ? 'active' : ''}" data-tab="safety" style="min-height: 48px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
            🚨 Safety & GPS Alerts (${emergencyAlerts.length})
          </button>
          <button class="chip-btn ${activeTab === 'print' ? 'active' : ''}" data-tab="print" style="min-height: 48px; font-size: 0.95rem; font-weight: 700; cursor: pointer;">
            🖨️ Print Summary
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
              ${moodHistory.length === 0 ? '<p class="text-muted" style="margin:0;">No mood entries recorded yet.</p>' : moodHistory.slice(-4).reverse().map(m => `
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

        <!-- 3. APPOINTMENTS TAB (Remote Scheduler & Push Alarms - Module 4) -->
        ${activeTab === 'appointments' ? `
          <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 16px;">
            <div style="margin-bottom: 1.25rem;">
              <h3 style="color: #1E3A8A; margin: 0; font-size: 1.35rem;">🩺 Remote Appointments & Clinical Visits</h3>
              <p style="font-size: 0.9rem; color: #64748B; margin: 0.2rem 0 0 0;">Synchronized between Caregiver, Patient alerts, and Doctor Portal.</p>
            </div>

            <!-- Current Scheduled Appointment Card -->
            <div style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border: 2px solid #93C5FD; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <span style="background: #1E40AF; color: #FFFFFF; font-size: 0.8rem; font-weight: 800; padding: 3px 10px; border-radius: 12px; text-transform: uppercase;">
                    Next Confirmed Visit
                  </span>
                  <h4 style="margin: 0.5rem 0 0.25rem 0; font-size: 1.4rem; color: #1E3A8A;">${nextAppt.doctorName}</h4>
                  <div style="font-weight: 600; color: #2563EB; font-size: 0.95rem;">${nextAppt.specialization || 'Clinical Specialist'} • ${nextAppt.hospitalClinic}</div>
                </div>
                <div style="text-align: right; background: #FFFFFF; padding: 0.5rem 1rem; border-radius: 10px; border: 1.5px solid #BFDBFE;">
                  <div style="font-size: 0.85rem; color: #64748B;">Date & Time</div>
                  <div style="font-size: 1.2rem; font-weight: 800; color: #1E40AF;">${nextAppt.date}</div>
                  <div style="font-size: 0.9rem; font-weight: 700; color: #059669;">${nextAppt.time}</div>
                </div>
              </div>
              <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #BFDBFE; font-size: 0.95rem; color: #1E3A8A;">
                <strong>Instructions for Patient:</strong> ${nextAppt.instructions || 'Bring health records and daily logs.'}
              </div>
            </div>

            <!-- Schedule/Update Appointment Form -->
            <div style="background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 14px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: #1E293B;">Schedule / Reschedule Appointment</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                <input type="text" id="inp-appt-doc" class="form-input" placeholder="Doctor Name (e.g. Dr. A. K. Barua)" value="${nextAppt.doctorName || ''}" />
                <input type="text" id="inp-appt-clinic" class="form-input" placeholder="Hospital / Clinic (e.g. Neurological Care Center)" value="${nextAppt.hospitalClinic || ''}" />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                <input type="date" id="inp-appt-date" class="form-input" value="${nextAppt.date || ''}" />
                <input type="text" id="inp-appt-time" class="form-input" placeholder="Time (e.g. 11:00 AM)" value="${nextAppt.time || ''}" />
                <input type="text" id="inp-appt-type" class="form-input" placeholder="Purpose (e.g. Memory Review)" value="${nextAppt.type || 'Cognitive Review'}" />
              </div>
              <input type="text" id="inp-appt-notes" class="form-input mb-sm" placeholder="Preparation Notes (e.g. Bring fasting blood reports)" value="${nextAppt.instructions || ''}" />
              <div style="display: flex; justify-content: flex-end;">
                <button type="button" id="btn-save-appt" class="btn btn-primary" style="background: #2563EB; border-color: #2563EB; font-weight: 700;">
                  💾 Save & Push to Patient & Doctor
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 4. CLINICAL NOTES TAB (Syncing Directly to Doctor Portal - Module 4 & 6) -->
        ${activeTab === 'notes' ? `
          <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 16px;">
            <div style="margin-bottom: 1.25rem;">
              <h3 style="color: #6B21A8; margin: 0; font-size: 1.35rem;">📝 Daily Behavioral & Clinical Observations</h3>
              <p style="font-size: 0.9rem; color: #64748B; margin: 0.2rem 0 0 0;">These observations are synced in real-time to the Doctor Specialist Portal for @${linkedPatientUsername}.</p>
            </div>

            <!-- Add Note Form -->
            <div style="background: #FAF5FF; border: 2px solid #E9D5FF; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: #581C87;">Record Daily Behavioral Note for ${linkedPatient.name}</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div>
                  <label style="font-size: 0.85rem; font-weight: 700; color: #6B21A8; display: block; margin-bottom: 4px;">Observed Behavioral State</label>
                  <select id="inp-note-behavior" class="form-select" style="width: 100%;">
                    <option value="Calm & cheerful">Calm & cheerful 😊</option>
                    <option value="Mild morning confusion">Mild morning confusion 🤔</option>
                    <option value="Evening sundowning restlessness">Evening sundowning restlessness 🌆</option>
                    <option value="Alert and socially engaged">Alert and socially engaged 🌟</option>
                    <option value="Hesitant with medication">Hesitant with medication 💊</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.85rem; font-weight: 700; color: #6B21A8; display: block; margin-bottom: 4px;">Date of Observation</label>
                  <input type="date" id="inp-note-date" class="form-input" value="${new Date().toISOString().split('T')[0]}" style="width: 100%;" />
                </div>
              </div>
              <div style="margin-bottom: 0.75rem;">
                <label style="font-size: 0.85rem; font-weight: 700; color: #6B21A8; display: block; margin-bottom: 4px;">Clinical Observation / Notes</label>
                <textarea id="inp-note-text" class="form-input" rows="3" placeholder="Describe memory recall, mood fluctuations, sleep quality, or response to daily prompts..."></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button type="button" id="btn-save-note" class="btn btn-primary" style="background: #7C3AED; border-color: #7C3AED; font-weight: 700;">
                  📤 Sync Note to Doctor Portal
                </button>
              </div>
            </div>

            <!-- Notes List -->
            <div>
              <h4 style="margin: 0 0 0.75rem 0; color: #1E293B;">Synchronized Clinical Notes History (${clinicalNotes.length})</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${clinicalNotes.length === 0 ? `
                  <p class="text-muted" style="margin: 0;">No clinical notes recorded yet for @${linkedPatientUsername}. Add your first note above to sync with the doctor.</p>
                ` : clinicalNotes.map(n => `
                  <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="background: #EDE9FE; color: #6B21A8; font-weight: 700; font-size: 0.82rem; padding: 2px 8px; border-radius: 8px;">
                          ${n.behavior || 'Observation'}
                        </span>
                        <span style="font-size: 0.85rem; color: #64748B;">By: <strong>${n.author || 'Caregiver'}</strong></span>
                      </div>
                      <span style="font-size: 0.85rem; font-weight: 700; color: #7C3AED;">${n.date}</span>
                    </div>
                    <p style="margin: 0; font-size: 0.95rem; color: #334155; line-height: 1.5;">${n.observation}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 5. SAFETY & GPS ALERTS TAB (Module 3 & 4) -->
        ${activeTab === 'safety' ? `
          <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 16px;">
            <div style="margin-bottom: 1.25rem;">
              <h3 style="color: #991B1B; margin: 0; font-size: 1.35rem;">🚨 Safety, GPS Tracking & Geofence Logs</h3>
              <p style="font-size: 0.9rem; color: #64748B; margin: 0.2rem 0 0 0;">Real-time notifications triggered by patient SOS or safe perimeter departures.</p>
            </div>

            <!-- Safe Zone Geofence Info -->
            <div style="background: #FEF2F2; border: 2px solid #FECACA; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <div style="font-weight: 800; color: #991B1B; font-size: 1.05rem;">📍 Designated Safe Perimeter: Guwahati Residence</div>
                <div style="font-size: 0.88rem; color: #7F1D1D; margin-top: 2px;">Anchor: 26.1445° N, 91.7362° E • Allowed Geofence Radius: 200 meters</div>
              </div>
              <span style="background: #16A34A; color: #FFFFFF; font-weight: 800; font-size: 0.85rem; padding: 6px 14px; border-radius: 20px;">
                🟢 Geofence Active
              </span>
            </div>

            <!-- Emergency Alerts Feed -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${emergencyAlerts.length === 0 ? `
                <div style="text-align: center; padding: 2rem; background: #F0FDF4; border-radius: 12px; border: 1.5px solid #BBF7D0;">
                  <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛡️✅</div>
                  <h4 style="margin: 0; color: #166534;">All Safety Parameters Clear</h4>
                  <p style="margin: 0.35rem 0 0 0; color: #15803D; font-size: 0.9rem;">No emergency SOS triggers or perimeter departures recorded for ${linkedPatient.name}.</p>
                </div>
              ` : emergencyAlerts.map(a => `
                <div style="background: #FFFDF9; border: 2px solid ${a.type === 'GEOFENCE_BREACH' ? '#F59E0B' : '#EF4444'}; border-radius: 12px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="background: ${a.type === 'GEOFENCE_BREACH' ? '#FEF3C7' : '#FEE2E2'}; color: ${a.type === 'GEOFENCE_BREACH' ? '#B45309' : '#991B1B'}; font-weight: 800; font-size: 0.8rem; padding: 3px 8px; border-radius: 8px;">
                        ${a.type === 'GEOFENCE_BREACH' ? '⚠️ GEOFENCE BREACH' : '🚨 EMERGENCY SOS'}
                      </span>
                      <strong style="color: #1E293B;">${a.patientName || linkedPatient.name}</strong>
                    </div>
                    <div style="font-size: 0.88rem; color: #64748B; margin-top: 4px;">
                      Triggered at: <strong>${a.timestamp || new Date().toLocaleTimeString()}</strong> • Lat: ${a.lat?.toFixed ? a.lat.toFixed(4) : a.lat}, Lng: ${a.lng?.toFixed ? a.lng.toFixed(4) : a.lng}
                    </div>
                  </div>
                  <a href="https://maps.google.com/?q=${a.lat},${a.lng}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" style="background: #DC2626; border-color: #DC2626; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 700;">
                    🗺️ View Live GPS Map
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 6. PRINT CLINICAL DETAILS OPTION -->
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

    // Patient switcher with Secure OTP verification (Module 4)
    const switchBtn = container.querySelector('#btn-switch-patient');
    const switchInp = container.querySelector('#inp-switch-patient');
    if (switchBtn && switchInp) {
      switchBtn.addEventListener('click', () => {
        const queryUsername = switchInp.value.trim().toLowerCase().replace(/^@/, '');
        if (!queryUsername) return alert('Enter a patient username to link');
        
        const enteredOtp = window.prompt(`[SECURITY VERIFICATION]\nEnter 4-digit OTP sent to @${queryUsername}'s registered mobile (Demo OTP: 1234):`);
        if (enteredOtp === null) return; // User cancelled
        if (enteredOtp.trim() === '1234') {
          currentUser.linkedPatientUsername = queryUsername;
          currentUser.patientId = 'patient_' + queryUsername;
          Storage.setUser(currentUser);
          linkedPatientUsername = queryUsername;
          targetPatientId = currentUser.patientId;
          alert(`✅ Securely verified and linked to @${queryUsername}!`);
          render();
        } else {
          alert('❌ Invalid OTP verification code. Enter 1234 to link.');
        }
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

    // Save Next Appointment (Module 4)
    const saveApptBtn = container.querySelector('#btn-save-appt');
    if (saveApptBtn) {
      saveApptBtn.addEventListener('click', () => {
        const doctorName = container.querySelector('#inp-appt-doc')?.value.trim() || 'Dr. A. K. Barua';
        const hospitalClinic = container.querySelector('#inp-appt-clinic')?.value.trim() || 'Neurological Care Center';
        const date = container.querySelector('#inp-appt-date')?.value || new Date().toISOString().split('T')[0];
        const time = container.querySelector('#inp-appt-time')?.value.trim() || '11:00 AM';
        const type = container.querySelector('#inp-appt-type')?.value.trim() || 'Cognitive Review';
        const instructions = container.querySelector('#inp-appt-notes')?.value.trim() || '';

        Storage.saveNextAppointment({
          patientUsername: linkedPatientUsername,
          doctorName,
          hospitalClinic,
          date,
          time,
          type,
          instructions
        });

        alert('✅ Clinical appointment saved and synced with Patient Alarms & Doctor Portal!');
        render();
      });
    }

    // Save Clinical Behavioral Note (Module 4 & 6)
    const saveNoteBtn = container.querySelector('#btn-save-note');
    if (saveNoteBtn) {
      saveNoteBtn.addEventListener('click', () => {
        const behavior = container.querySelector('#inp-note-behavior')?.value || 'Calm & cheerful';
        const date = container.querySelector('#inp-note-date')?.value || new Date().toISOString().split('T')[0];
        const observation = container.querySelector('#inp-note-text')?.value.trim();

        if (!observation) return alert('Please enter observation details');

        Storage.saveClinicalNote({
          patientUsername: linkedPatientUsername,
          author: currentUser.name,
          behavior,
          date,
          observation
        });

        alert('✅ Clinical observation synced directly to Doctor Portal!');
        render();
      });
    }

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
