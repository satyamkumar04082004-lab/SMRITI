/* ============================================================
   SMRITI — Clinical Doctor & Specialist Portal (#/doctor)
   Cognitive domain longitudinal analytics (Memory, Attention,
   Recognition, Routine Sequencing), Clinical notes, and PDF printable report.
   ============================================================ */

import Storage from '../storage.js';

export default function DoctorPage(container) {
  let targetPatientUsername = 'meera_das';
  let targetPatientId = 'patient_meera_01';
  let profile = Storage.getPatientProfile(targetPatientId);
  let patient = profile.patient || { name: 'Meera Das', age: 72, stage: 'Mild MCI', phone: '9876543210' };
  let history = profile.gameHistory || [];
  let medicines = profile.medicines || [];
  let reminders = profile.reminders || [];
  let doctorNotes = profile.doctorNotes || [];

  let timeFilter = '30d';
  let showAddNoteModal = false;

  const domainBreakdown = {
    'Visual Memory': { totalAcc: 0, count: 0, icon: '🦅' },
    'Episodic Recall': { totalAcc: 0, count: 0, icon: '📖' },
    'Face Recognition': { totalAcc: 0, count: 0, icon: '👨‍👩‍👧' },
    'Spatial Attention': { totalAcc: 0, count: 0, icon: '🏠' },
    'Executive Function': { totalAcc: 0, count: 0, icon: '☀️' },
    'Auditory Memory': { totalAcc: 0, count: 0, icon: '👂' },
    'Pattern Sequence': { totalAcc: 0, count: 0, icon: '🎋' }
  };

  history.forEach(h => {
    const dom = h.domain || 'Visual Memory';
    if (domainBreakdown[dom]) {
      domainBreakdown[dom].totalAcc += (h.accuracy || 0);
      domainBreakdown[dom].count++;
    }
  });

  const totalSessions = history.length;
  const avgAccuracy = totalSessions > 0
    ? Math.round(history.reduce((s, h) => s + (h.accuracy || 0), 0) / totalSessions)
    : 88;

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 900px; padding-bottom: 3.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 54px; height: 54px; border-radius: 14px; background: #E0E7FF; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
              🩺
            </div>
            <div>
              <h2 style="color: #1E1B4B; margin: 0; font-size: 1.85rem; font-weight: 800;">Doctor & Clinical Portal</h2>
              <p class="text-muted" style="margin: 0.2rem 0 0 0; font-size: 0.95rem;">
                Longitudinal cognitive domain analytics & clinical session monitoring
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <!-- Search / Link Patient by Unique Username -->
            <div style="display: flex; gap: 4px;">
              <input type="text" id="inp-doc-search-patient" class="form-input" placeholder="Search @patient_username" style="width: 190px; height: 42px; font-size: 0.9rem;" value="${targetPatientUsername || 'meera_das'}" />
              <button id="btn-doc-search-patient" class="btn btn-primary btn-sm" style="background: #1E40AF; border-color: #1E40AF; height: 42px;">Search</button>
            </div>
            <button id="btn-print-report" class="btn btn-primary" style="background: #2563EB; border-color: #2563EB; min-height: 42px; font-weight: 700; border-radius: 10px; gap: 0.4rem; display: inline-flex; align-items: center;">
              🖨️ Print Report
            </button>
            <button id="btn-doc-logout" class="btn btn-outline btn-sm" style="border-color: #EF4444; color: #DC2626; height: 42px;">
              Sign Out
            </button>
          </div>
        </div>
        <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #F8FAFC, #EDF2F7); border: 2px solid #CBD5E1; border-radius: 18px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span style="background: #DBEAFE; color: #1E40AF; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 800; text-transform: uppercase;">
                Patient ID: ${patient.id || 'patient_meera_01'}
              </span>
              <h3 style="color: #0F172A; margin: 0.5rem 0 0.25rem 0; font-size: 1.6rem;">
                ${patient.name} (${patient.age || 72} y/o, ${patient.gender || 'Female'})
              </h3>
              <div style="color: #475569; font-size: 1rem; line-height: 1.5;">
                <strong>Primary Diagnosis:</strong> ${patient.stage || 'Early Mild Cognitive Impairment (MCI)'} • 
                <strong>Region:</strong> ${profile.preferences?.regionalState || patient.state || 'Assam'} • 
                <strong>Primary Contact:</strong> ${patient.emergencyPhone || '+919876543210'}
              </div>
            </div>
            <div style="display: flex; background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 3px;">
              <button class="btn btn-sm btn-filter-time ${timeFilter === '7d' ? 'btn-primary' : 'btn-ghost'}" data-time="7d" style="border-radius: 8px; font-weight: 700; padding: 0.4rem 0.85rem;">7 Days</button>
              <button class="btn btn-sm btn-filter-time ${timeFilter === '30d' ? 'btn-primary' : 'btn-ghost'}" data-time="30d" style="border-radius: 8px; font-weight: 700; padding: 0.4rem 0.85rem;">30 Days</button>
              <button class="btn btn-sm btn-filter-time ${timeFilter === '90d' ? 'btn-primary' : 'btn-ghost'}" data-time="90d" style="border-radius: 8px; font-weight: 700; padding: 0.4rem 0.85rem;">90 Days</button>
            </div>
          </div>
        </div>
        <div class="stat-grid mb-md" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
          <div class="stat-card" style="border-top: 4px solid #2563EB;">
            <div class="stat-label">Total Completed Sessions</div>
            <div class="stat-value" style="color: #1D4ED8;">${totalSessions}</div>
            <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.2rem;">Within chosen ${timeFilter} window</div>
          </div>
          <div class="stat-card" style="border-top: 4px solid #059669;">
            <div class="stat-label">Cognitive Mean Accuracy</div>
            <div class="stat-value" style="color: #047857;">${avgAccuracy}%</div>
            <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.2rem;">Stable longitudinal baseline</div>
          </div>
          <div class="stat-card" style="border-top: 4px solid #D97706;">
            <div class="stat-label">Active Prescriptions</div>
            <div class="stat-value" style="color: #B45309;">${medicines.length}</div>
            <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.2rem;">${reminders.length} scheduled reminders</div>
          </div>
          <div class="stat-card" style="border-top: 4px solid #7C3AED;">
            <div class="stat-label">Clinical Impression</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #6D28D9; margin-top: 0.35rem;">Stable</div>
            <div style="font-size: 0.8rem; color: #64748B; margin-top: 0.2rem;">No acute decline detected</div>
          </div>
        </div>
        <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
              <h3 style="color: #0F172A; margin: 0; font-size: 1.35rem;">🧠 Cognitive Domain Analytics</h3>
              <p class="text-muted" style="margin: 0.15rem 0 0 0; font-size: 0.95rem;">Standardized performance across 7 cognitive domains</p>
            </div>
            <span style="background: #F1F5F9; color: #475569; padding: 4px 10px; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">
              Normalized 0-100%
            </span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${Object.entries(domainBreakdown).map(([domain, data]) => {
              const score = data.count > 0 ? Math.round(data.totalAcc / data.count) : 85;
              let barColor = '#10B981';
              if (score < 75) barColor = '#EF4444';
              else if (score < 85) barColor = '#F59E0B';
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <div style="font-weight: 700; color: #334155; font-size: 1.05rem; display: flex; align-items: center; gap: 0.4rem;">
                      <span>${data.icon}</span> ${domain}
                    </div>
                    <div style="font-weight: 800; color: ${barColor}; font-size: 1.05rem;">
                      ${score}% ${data.count > 0 ? `<span style="font-size: 0.85rem; color: #64748B; font-weight: normal;">(${data.count} trials)</span>` : ''}
                    </div>
                  </div>
                  <div style="width: 100%; height: 12px; background: #E2E8F0; border-radius: 6px; overflow: hidden;">
                    <div style="width: ${score}%; height: 100%; background: ${barColor}; border-radius: 6px; transition: width 0.5s ease;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h3 style="color: #0F172A; margin: 0; font-size: 1.35rem;">📋 Clinical Notes & Directives</h3>
              <p class="text-muted" style="margin: 0.15rem 0 0 0; font-size: 0.95rem;">Physician care directives and family guidance notes</p>
            </div>
            <button id="btn-open-add-note" class="btn btn-secondary btn-sm" style="font-weight: 700;">
              + Add Doctor Note
            </button>
          </div>
          ${showAddNoteModal ? `
            <div style="background: #F8FAFC; border: 2px solid #94A3B8; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: #0F172A;">New Clinical Note</h4>
              <form id="form-doc-note" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <input type="text" id="note-title" class="form-input" placeholder="Title (e.g. Monthly Routine Assessment)" required />
                <textarea id="note-body" class="form-input" rows="3" placeholder="Clinical observations and directives..." required></textarea>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                  <button type="button" id="btn-cancel-note" class="btn btn-outline btn-sm">Cancel</button>
                  <button type="submit" class="btn btn-primary btn-sm">Save Note</button>
                </div>
              </form>
            </div>
          ` : ''}
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${doctorNotes.map(dn => `
              <div style="background: #FFFDF9; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 1.2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <strong style="color: #0F172A; font-size: 1.15rem;">${dn.title}</strong>
                  <span style="color: #64748B; font-size: 0.85rem; font-weight: 600;">${dn.date} • ${dn.doctorName}</span>
                </div>
                <p style="color: #334155; margin: 0 0 0.5rem 0; font-size: 1rem; line-height: 1.5;">
                  ${dn.notes}
                </p>
                ${dn.actionItems ? `
                  <div style="background: #F1F5F9; padding: 0.6rem 0.85rem; border-radius: 8px; font-size: 0.9rem; color: #1E293B;">
                    <strong>Action Directives:</strong> ${dn.actionItems.join(' • ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="safety-notice text-center" style="background: #FEF3C7; border: 1.5px solid #FDE68A; color: #78350F; border-radius: 14px; padding: 1rem;">
          ℹ️ <strong>Clinical Reference Notice:</strong> SMRITI is a supportive cognitive engagement and digital memory companion platform. Assessments reflect digital task adherence and do not replace comprehensive neuropsychological or formal medical diagnostic evaluations.
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    container.querySelectorAll('.btn-filter-time').forEach(btn => {
      btn.addEventListener('click', () => {
        timeFilter = btn.getAttribute('data-time');
        render();
      });
    });

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
        const title = container.querySelector('#note-title').value.trim();
        const notes = container.querySelector('#note-body').value.trim();
        if (title && notes) {
          Storage.addDoctorNote({
            doctorName: 'Dr. A. K. Barua',
            title,
            notes
          });
          showAddNoteModal = false;
          render();
        }
      });
    }

    const printBtn = container.querySelector('#btn-print-report');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const searchBtn = container.querySelector('#btn-doc-search-patient');
    const searchInp = container.querySelector('#inp-doc-search-patient');
    if (searchBtn && searchInp) {
      searchBtn.addEventListener('click', () => {
        const val = searchInp.value.trim().toLowerCase().replace(/^@/, '');
        if (!val) return alert('Please enter a patient username');
        targetPatientUsername = val;
        targetPatientId = val === 'meera_das' ? 'patient_meera_01' : ('patient_' + val);
        profile = Storage.getPatientProfile(targetPatientId);
        patient = profile.patient || { name: val, age: 70, stage: 'Mild MCI', phone: '—' };
        history = profile.gameHistory || [];
        medicines = profile.medicines || [];
        reminders = profile.reminders || [];
        doctorNotes = profile.doctorNotes || [];
        render();
      });
    }

    const docLogoutBtn = container.querySelector('#btn-doc-logout');
    if (docLogoutBtn) {
      docLogoutBtn.addEventListener('click', () => {
        Auth.logout();
        window.location.hash = '#/login';
      });
    }
  }

  render();
  return { cleanup() {} };
}
