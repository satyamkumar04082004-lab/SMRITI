/* ============================================================
   SMRITI — Clinical Doctor & Specialist Portal (#/doctor)
   - Doctor Signout: cleanly wipes doctor session and navigates to #/login
   - Doctor Patient Search: queries registered patients case-insensitively by username or name,
     rendering patient details or a clean "No patient found" empty state
   - Authentic Zero-State Baseline: 0 sessions = 0%, no fake placeholder stats
   - Caregiver Notes Sync: displays synced clinical behavioral observations
   - Next Appointment Sync: displays next clinical appointment schedule
   - PatientReport View: aggregates cognitive domain trends, mood history, task completion,
     active medications, and dedicated print layout with window.print()
   ============================================================ */

import Storage from '../storage.js';
import Auth from '../auth.js';

export default function DoctorPage(container) {
  const currentDoctor = Auth.getUser() || { name: 'Dr. A. K. Barua', role: 'doctor' };

  // Current queried patient state
  let searchQuery = 'meera_das';
  let activePatient = null;
  let activeProfile = null;
  let searchFailed = false;
  let timeFilter = '30d';
  let showAddNoteModal = false;

  function loadPatientData(query) {
    const clean = (query || '').trim().toLowerCase().replace(/^@/, '');
    const allUsers = Storage.getAllUsers() || [];
    
    // Query users database for role === 'patient' matching username OR name case-insensitively
    let matchedUser = allUsers.find(u => {
      const isPatient = (u.role || 'patient').toLowerCase() === 'patient';
      const userMatch = (u.username || '').toLowerCase() === clean;
      const nameMatch = (u.name || '').toLowerCase().includes(clean);
      return isPatient && (userMatch || nameMatch);
    });

    // Special fallback for default demo patient
    if (!matchedUser && (clean === 'meera' || clean === 'meera_das' || clean === 'meera das' || clean === '')) {
      matchedUser = {
        username: 'meera_das',
        name: 'Meera Das',
        phone: '9876543210',
        role: 'patient',
        patientId: 'patient_meera_01'
      };
    }

    if (matchedUser) {
      searchFailed = false;
      const pId = matchedUser.patientId || ('patient_' + matchedUser.username);
      activeProfile = Storage.getPatientProfile(pId);
      activePatient = Object.assign({}, activeProfile.patient || {}, matchedUser);
    } else {
      searchFailed = true;
      activePatient = null;
      activeProfile = null;
    }
  }

  // Initial load
  loadPatientData(searchQuery);

  function render() {
    const patient = activePatient || { name: '—', age: '—', stage: '—', phone: '—' };
    const pUsername = patient.username || searchQuery;
    const history = (activeProfile && activeProfile.gameHistory) || [];
    const medicines = (activeProfile && activeProfile.medicines) || [];
    const reminders = (activeProfile && activeProfile.reminders) || [];
    const doctorNotes = (activeProfile && activeProfile.doctorNotes) || [];
    const moodHistory = (activeProfile && activeProfile.moodHistory) || [];
    const caregiverNotes = Storage.getClinicalNotes(pUsername);
    const nextAppt = Storage.getNextAppointment(pUsername);

    // 6 Clinical Cognitive Training Domains
    const domainBreakdown = {
      'Visual Memory': { totalAcc: 0, count: 0, icon: '🦅' },
      'Episodic Recall': { totalAcc: 0, count: 0, icon: '📖' },
      'Face Recognition': { totalAcc: 0, count: 0, icon: '👨‍👩‍👧' },
      'Spatial Attention': { totalAcc: 0, count: 0, icon: '🏠' },
      'Executive Function': { totalAcc: 0, count: 0, icon: '☀️' },
      'Auditory Memory': { totalAcc: 0, count: 0, icon: '👂' }
    };

    history.forEach(h => {
      const dom = h.domain || 'Visual Memory';
      if (domainBreakdown[dom]) {
        domainBreakdown[dom].totalAcc += (h.accuracy || 0);
        domainBreakdown[dom].count++;
      }
    });

    // Authentic Zero-State Baseline: No fake 88% or 85% stats
    const totalSessions = history.length;
    const isNewBaseline = totalSessions === 0;
    const avgAccuracy = isNewBaseline
      ? 0
      : Math.round(history.reduce((s, h) => s + (h.accuracy || 0), 0) / totalSessions);

    // Daily task completion rate
    const completedReminders = reminders.filter(r => r.completedToday).length;
    const taskCompletionRate = reminders.length > 0
      ? Math.round((completedReminders / reminders.length) * 100)
      : 0;

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 920px; padding-bottom: 3.5rem;">
        
        <!-- Doctor Top Bar -->
        <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #1E1B4B, #312E81); color: #FFFFFF; border-radius: 18px; padding: 1.25rem 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="width: 52px; height: 52px; border-radius: 14px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                🩺
              </div>
              <div>
                <div style="font-size: 0.85rem; color: #A5B4FC; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  Clinical Specialist Portal
                </div>
                <h2 style="color: #FFFFFF; margin: 0; font-size: 1.6rem; font-weight: 800;">
                  ${currentDoctor.name || 'Dr. A. K. Barua'}
                </h2>
              </div>
            </div>

            <!-- Header Actions: Search, Print & Safe Signout -->
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <button id="btn-print-report" class="btn btn-primary btn-print-keep" style="background: #2563EB; border-color: #2563EB; min-height: 42px; font-weight: 700; border-radius: 10px; display: inline-flex; align-items: center; gap: 0.4rem;">
                🖨️ Download / Print PDF Report
              </button>
              <button id="btn-doc-logout" class="btn btn-outline" style="border-color: #F87171; color: #FCA5A5; background: rgba(239,68,68,0.1); min-height: 42px; font-weight: 700; border-radius: 10px; cursor: pointer;">
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>

        <!-- 1. PATIENT SEARCH BAR (By Username or Name) -->
        <div class="card card-elevated mb-md" style="padding: 1.25rem; border-radius: 16px; background: #FFFFFF; border: 2px solid #E2E8F0;">
          <label style="display: block; font-weight: 800; color: #1E293B; font-size: 1rem; margin-bottom: 0.4rem;">
            🔍 Search Registered Patients (by Unique Username or Full Name)
          </label>
          <div style="display: flex; gap: 0.5rem;">
            <div style="position: relative; flex: 1;">
              <input type="text" id="inp-doc-search-patient" class="form-input" placeholder="Enter username (e.g. meera_das) or patient name..." value="${searchQuery}" style="width: 100%; height: 48px; font-size: 1.05rem; padding-left: 1rem; box-sizing: border-box;" />
            </div>
            <button id="btn-doc-search-patient" class="btn btn-primary" style="background: #1D4ED8; border-color: #1D4ED8; min-width: 120px; font-weight: 700; font-size: 1.05rem;">
              Search Patient
            </button>
          </div>
        </div>

        <!-- EMPTY STATE (If No Patient Found) -->
        ${searchFailed ? `
          <div class="card card-elevated text-center mb-md page-enter" style="padding: 3rem 1.5rem; background: #FFF7ED; border: 2px dashed #F97316; border-radius: 18px;">
            <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">🔍👤</div>
            <h3 style="color: #9A3412; font-size: 1.5rem; font-weight: 800; margin: 0 0 0.5rem 0;">
              No patient found with that username
            </h3>
            <p style="color: #C2410C; font-size: 1.05rem; max-width: 500px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
              We couldn't find any registered patient matching "<strong>${searchQuery}</strong>". Please verify the unique username or full name entered.
            </p>
            <button id="btn-reset-search" class="btn btn-secondary" style="font-weight: 700;">
              View Default Patient (@meera_das)
            </button>
          </div>
        ` : `

          <!-- 2. PATIENT OVERVIEW & REPORT VIEW -->
          <div id="patient-report-document" class="patient-report-container">
            
            <!-- Patient Header Summary Card -->
            <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #F8FAFC, #EFF6FF); border: 2px solid #BFDBFE; border-radius: 18px; padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: #1E40AF; color: #FFFFFF; padding: 3px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase;">
                      Patient ID: ${patient.patientId || patient.id || ('patient_' + (patient.username || 'user'))}
                    </span>
                    <span style="color: #1D4ED8; font-weight: 700; font-size: 0.95rem;">
                      @${patient.username || 'meera_das'}
                    </span>
                  </div>
                  <h3 style="color: #0F172A; margin: 0.5rem 0 0.25rem 0; font-size: 1.7rem; font-weight: 800;">
                    ${patient.name} (${patient.age || 72} y/o, ${patient.gender || 'Female'})
                  </h3>
                  <div style="color: #475569; font-size: 1rem; line-height: 1.5;">
                    <strong>Stage:</strong> ${patient.stage || 'Mild Cognitive Impairment (MCI)'} • 
                    <strong>State:</strong> ${activeProfile?.preferences?.regionalState || patient.state || 'Assam'} • 
                    <strong>Phone:</strong> ${patient.phone || '+919876543210'}
                  </div>
                </div>

                <!-- Window Filter -->
                <div style="display: flex; background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 3px;">
                  <button class="btn btn-sm btn-filter-time ${timeFilter === '7d' ? 'btn-primary' : 'btn-ghost'}" data-time="7d" style="border-radius: 8px; font-weight: 700; padding: 0.4rem 0.85rem;">7 Days</button>
                  <button class="btn btn-sm btn-filter-time ${timeFilter === '30d' ? 'btn-primary' : 'btn-ghost'}" data-time="30d" style="border-radius: 8px; font-weight: 700; padding: 0.4rem 0.85rem;">30 Days</button>
                  <button class="btn btn-sm btn-filter-time ${timeFilter === '90d' ? 'btn-primary' : 'btn-ghost'}" data-time="90d" style="border-radius: 8px; font-weight: 700; padding: 0.4rem 0.85rem;">90 Days</button>
                </div>
              </div>
            </div>

            <!-- Authentic Zero-State Baseline Notice (Module 6) -->
            ${isNewBaseline ? `
              <div class="card card-elevated mb-md" style="background: #F0FDF4; border: 2px solid #86EFAC; border-radius: 14px; padding: 1.25rem; display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 2rem;">🌱</div>
                <div>
                  <h4 style="margin: 0; color: #166534; font-size: 1.1rem; font-weight: 800;">Authentic Clinical Zero-Baseline Recorded</h4>
                  <p style="margin: 3px 0 0 0; color: #15803D; font-size: 0.92rem;">
                    This patient profile has 0 recorded cognitive game trials. Baseline assessment is actively tracking in real time with no synthetic placeholder metrics.
                  </p>
                </div>
              </div>
            ` : ''}

            <!-- High Level Key Metrics Grid -->
            <div class="stat-grid mb-md" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
              <div class="stat-card" style="border-top: 4px solid #2563EB;">
                <div class="stat-label">Cognitive Trials</div>
                <div class="stat-value" style="color: #1D4ED8;">${totalSessions}</div>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">${isNewBaseline ? 'Pending trials' : 'Completed sessions'}</div>
              </div>
              <div class="stat-card" style="border-top: 4px solid #059669;">
                <div class="stat-label">Mean Accuracy</div>
                <div class="stat-value" style="color: ${isNewBaseline ? '#64748B' : '#047857'};">${avgAccuracy}%</div>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">${isNewBaseline ? 'Baseline in progress' : 'Longitudinal stability'}</div>
              </div>
              <div class="stat-card" style="border-top: 4px solid #D97706;">
                <div class="stat-label">Task Adherence</div>
                <div class="stat-value" style="color: #B45309;">${taskCompletionRate}%</div>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">${reminders.length} scheduled routines</div>
              </div>
              <div class="stat-card" style="border-top: 4px solid #7C3AED;">
                <div class="stat-label">Active Prescriptions</div>
                <div class="stat-value" style="color: #6D28D9;">${medicines.length}</div>
                <div style="font-size: 0.8rem; color: #64748B; margin-top: 2px;">OCR & tracked records</div>
              </div>
            </div>

            <!-- Next Scheduled Clinical Visit (Caregiver Sync - Module 4 & 6) -->
            <div class="card card-elevated mb-md" style="padding: 1.25rem 1.5rem; border-radius: 16px; background: linear-gradient(135deg, #EFF6FF, #F8FAFC); border: 2px solid #BFDBFE;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 800; color: #1E40AF; text-transform: uppercase;">
                    🩺 Upcoming Clinical Appointment (Synced)
                  </div>
                  <div style="font-size: 1.2rem; font-weight: 800; color: #0F172A; margin-top: 2px;">
                    ${nextAppt.doctorName} • ${nextAppt.hospitalClinic}
                  </div>
                  <div style="font-size: 0.9rem; color: #475569; margin-top: 2px;">
                    <strong>Date & Time:</strong> ${nextAppt.date} at ${nextAppt.time} • <strong>Type:</strong> ${nextAppt.type}
                  </div>
                </div>
                <div style="font-size: 0.88rem; color: #1E3A8A; background: #DBEAFE; padding: 6px 12px; border-radius: 8px;">
                  ${nextAppt.instructions ? `Note: ${nextAppt.instructions}` : 'Confirmed appointment'}
                </div>
              </div>
            </div>

            <!-- Cognitive Domain Longitudinal Breakdown -->
            <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div>
                  <h3 style="color: #0F172A; margin: 0; font-size: 1.35rem; font-weight: 800;">
                    🧠 Cognitive Domain Longitudinal Trends
                  </h3>
                  <p class="text-muted" style="margin: 0.15rem 0 0 0; font-size: 0.95rem;">
                    Standardized performance across 6 clinical cognitive training domains
                  </p>
                </div>
                <span style="background: #F1F5F9; color: #475569; padding: 4px 10px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">
                  Normalized 0–100%
                </span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${Object.entries(domainBreakdown).map(([domain, data]) => {
                  const score = data.count > 0 ? Math.round(data.totalAcc / data.count) : 0;
                  let barColor = '#10B981';
                  if (score === 0) barColor = '#94A3B8';
                  else if (score < 75) barColor = '#EF4444';
                  else if (score < 85) barColor = '#F59E0B';
                  return `
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                        <div style="font-weight: 700; color: #334155; font-size: 1.05rem; display: flex; align-items: center; gap: 0.4rem;">
                          <span>${data.icon}</span> ${domain}
                        </div>
                        <div style="font-weight: 800; color: ${barColor}; font-size: 1.05rem;">
                          ${score > 0 ? `${score}%` : '0%'} ${data.count > 0 ? `<span style="font-size: 0.85rem; color: #64748B; font-weight: normal;">(${data.count} trials)</span>` : '<span style="font-size: 0.82rem; color: #94A3B8; font-weight: normal;">(Awaiting trials)</span>'}
                        </div>
                      </div>
                      <div style="width: 100%; height: 12px; background: #E2E8F0; border-radius: 6px; overflow: hidden;">
                        <div style="width: ${score}%; height: 100%; background: ${barColor}; border-radius: 6px;"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Mood History Longitudinal Trend -->
            <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 18px;">
              <h3 style="color: #0F172A; margin: 0 0 0.75rem 0; font-size: 1.3rem; font-weight: 800;">
                🌈 Mood & Emotional Stability Record
              </h3>
              <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                ${moodHistory.length === 0 ? '<p class="text-muted">No mood check-ins recorded.</p>' : moodHistory.slice(-5).reverse().map(m => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 1.6rem;">${m.emoji || '🙂'}</span>
                      <div>
                        <strong style="color: #1E293B; text-transform: capitalize;">${m.label || m.mood}</strong>
                        <div style="font-size: 0.85rem; color: #64748B;">${m.note || 'Patient daily check-in'}</div>
                      </div>
                    </div>
                    <span style="font-size: 0.88rem; color: #2563EB; font-weight: 700;">${m.date}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Active Prescriptions Overview -->
            <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 18px;">
              <h3 style="color: #1E40AF; margin: 0 0 0.75rem 0; font-size: 1.3rem; font-weight: 800;">
                💊 Active Prescriptions & Regimen
              </h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${medicines.length === 0 ? '<p class="text-muted">No prescriptions recorded.</p>' : medicines.map(m => `
                  <div style="padding: 0.85rem 1.15rem; background: #EFF6FF; border-radius: 10px; border: 1.5px solid #BFDBFE;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <strong style="color: #1E40AF; font-size: 1.1rem;">${m.name} (${m.strength || 'Standard'})</strong>
                      <span style="font-size: 0.82rem; color: #1E3A8A; font-weight: 600;">Prescribed: ${m.date || 'Active'}</span>
                    </div>
                    <div style="font-size: 0.95rem; color: #1E3A8A; margin-top: 4px;">${m.instructions || ''} • ${m.frequency || ''}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Synced Caregiver Behavioral Notes (Module 4 & 6 Sync) -->
            <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 18px; background: #FAF5FF; border: 2px solid #E9D5FF;">
              <h3 style="color: #581C87; margin: 0 0 0.75rem 0; font-size: 1.35rem; font-weight: 800;">
                📝 Caregiver Behavioral Observations (Synced in Real-Time)
              </h3>
              <p style="color: #6B21A8; font-size: 0.9rem; margin: 0 0 1rem 0;">
                Live clinical field logs pushed by patient's primary caregiver for physician review.
              </p>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${caregiverNotes.length === 0 ? `
                  <p class="text-muted" style="margin: 0;">No caregiver notes logged yet for @${pUsername}.</p>
                ` : caregiverNotes.map(n => `
                  <div style="background: #FFFFFF; border: 1.5px solid #DDD6FE; border-radius: 12px; padding: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <span style="background: #EDE9FE; color: #6B21A8; font-weight: 700; font-size: 0.82rem; padding: 2px 8px; border-radius: 8px;">
                        ${n.behavior || 'Observation'}
                      </span>
                      <span style="font-size: 0.85rem; color: #7C3AED; font-weight: 700;">${n.date} • Logged by ${n.author || 'Caregiver'}</span>
                    </div>
                    <p style="margin: 0; font-size: 0.95rem; color: #334155; line-height: 1.5;">${n.observation}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Clinical Remarks & Directives Section -->
            <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                  <h3 style="color: #0F172A; margin: 0; font-size: 1.35rem; font-weight: 800;">
                    📋 Doctor Directives & Clinical Notes
                  </h3>
                  <p class="text-muted" style="margin: 0.15rem 0 0 0; font-size: 0.95rem;">
                    Observations, routine adjustments, and neurological feedback
                  </p>
                </div>
                <button id="btn-open-add-note" class="btn btn-secondary btn-sm" style="font-weight: 700;">
                  + Add Clinical Note
                </button>
              </div>

              ${showAddNoteModal ? `
                <div style="background: #F8FAFC; border: 2px solid #94A3B8; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem;">
                  <h4 style="margin: 0 0 0.75rem 0; color: #0F172A;">Record New Clinical Note for ${patient.name}</h4>
                  <form id="form-doc-note" style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <input type="text" id="note-title" class="form-input" placeholder="Title (e.g. Monthly Routine Assessment)" required />
                    <textarea id="note-body" class="form-input" rows="3" placeholder="Clinical observations, dosage tweaks, or cognitive progress feedback..." required></textarea>
                    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                      <button type="button" id="btn-cancel-note" class="btn btn-outline btn-sm">Cancel</button>
                      <button type="submit" class="btn btn-primary btn-sm" style="background: #1D4ED8; border-color: #1D4ED8;">Save Clinical Note</button>
                    </div>
                  </form>
                </div>
              ` : ''}

              <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                ${doctorNotes.length === 0 ? '<p class="text-muted">No physician notes recorded yet.</p>' : doctorNotes.map(dn => `
                  <div style="background: #FFFDF9; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 1.2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                      <strong style="color: #0F172A; font-size: 1.15rem;">${dn.title}</strong>
                      <span style="color: #64748B; font-size: 0.85rem; font-weight: 600;">${dn.date} • ${dn.doctorName}</span>
                    </div>
                    <p style="color: #334155; margin: 0 0 0.5rem 0; font-size: 1rem; line-height: 1.5;">
                      ${dn.notes || dn.note}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Footer Notice -->
            <div class="safety-notice text-center" style="background: #FEF3C7; border: 1.5px solid #FDE68A; color: #78350F; border-radius: 14px; padding: 1rem;">
              ℹ️ <strong>Clinical Handover & Reference Notice:</strong> SMRITI is a supportive cognitive engagement and digital memory companion platform. Assessments reflect digital task adherence and assist clinical decision-making.
            </div>

          </div>
        `}

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Time filter
    container.querySelectorAll('.btn-filter-time').forEach(btn => {
      btn.addEventListener('click', () => {
        timeFilter = btn.getAttribute('data-time');
        render();
      });
    });

    // Patient Search (By username or name)
    const searchBtn = container.querySelector('#btn-doc-search-patient');
    const searchInp = container.querySelector('#inp-doc-search-patient');
    const handleSearch = () => {
      const q = searchInp.value.trim();
      if (!q) return alert('Please enter a username or full name');
      searchQuery = q;
      loadPatientData(searchQuery);
      render();
    };

    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (searchInp) {
      searchInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }

    // Reset search button on empty state
    const resetBtn = container.querySelector('#btn-reset-search');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchQuery = 'meera_das';
        loadPatientData(searchQuery);
        render();
      });
    }

    // Doctor Signout (Fix for white screen / crash)
    const docLogoutBtn = container.querySelector('#btn-doc-logout');
    if (docLogoutBtn) {
      docLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
        window.location.hash = '#/login';
      });
    }

    // Print Report
    const printBtn = container.querySelector('#btn-print-report');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Clinical Notes Form
    const addNoteBtn = container.querySelector('#btn-open-add-note');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => {
        showAddNoteModal = true;
        render();
      });
    }

    const cancelNoteBtn = container.querySelector('#btn-cancel-note');
    if (cancelNoteBtn) {
      cancelNoteBtn.addEventListener('click', () => {
        showAddNoteModal = false;
        render();
      });
    }

    const noteForm = container.querySelector('#form-doc-note');
    if (noteForm) {
      noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#note-title')?.value.trim();
        const notes = container.querySelector('#note-body')?.value.trim();
        if (title && notes && activeProfile) {
          const newNote = {
            doctorName: currentDoctor.name || 'Dr. A. K. Barua',
            title,
            notes,
            date: new Date().toLocaleDateString('en-IN')
          };
          activeProfile.doctorNotes = activeProfile.doctorNotes || [];
          activeProfile.doctorNotes.unshift(newNote);
          Storage.savePatientProfile(activeProfile);
          showAddNoteModal = false;
          render();
        }
      });
    }
  }

  render();
  return { cleanup() {} };
}
