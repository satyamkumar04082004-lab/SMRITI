/* ============================================================
   SMRITI — My Medicines & Prescription Scanner Section
   Prescription upload, OCR extraction, medicine cards & reminder alerts
   ============================================================ */

import AIService from '../aiService.js';
import Storage from '../storage.js';

export default function MedicinesPage(container) {
  let medicines = Storage.getMedicines();
  let reminders = Storage.getMedicineReminders();
  let isScanning = false;
  let ocrResult = null;
  let showEditModal = false;
  let editingMed = null;
  let pendingReminderPrompt = null;

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 720px; padding-bottom: 2rem;">
        <!-- Header Banner -->
        <div class="card card-elevated text-center" style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border: 1px solid #BFDBFE; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">💊📋</div>
          <h2 style="color: #1E40AF; font-size: 1.7rem; margin-bottom: 0.25rem;">My Medicines & Prescriptions</h2>
          <p style="color: #1D4ED8; font-size: 1.05rem; margin-bottom: 0;">Easily scan prescriptions, view medication cards, and set gentle reminders.</p>
        </div>

        <!-- Scanner Actions Card -->
        <div class="card card-elevated mb-md" style="padding: 1.5rem; text-align: center; border: 2px dashed #93C5FD; background: #F8FAFC;">
          <h3 style="color: var(--maroon); margin-bottom: 0.5rem; font-size: 1.3rem;">📷 Prescription Scanner</h3>
          <p class="text-muted" style="margin-bottom: 1.25rem;">Upload or scan a photo of your doctor's prescription for quick review.</p>

          <input type="file" id="prescription-file-input" accept="image/*,.pdf" style="display: none;" />

          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button id="btn-scan-camera" class="btn btn-primary" style="flex: 1; min-width: 180px;">
              📷 Scan Prescription
            </button>
            <button id="btn-upload-file" class="btn btn-secondary" style="flex: 1; min-width: 180px;">
              📁 Upload Image / PDF
            </button>
          </div>

          ${isScanning ? `
            <div style="margin-top: 1.25rem; padding: 1rem; background: #FEF3C7; border-radius: 10px; color: #92400E; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span class="tts-icon">⏳</span> Analyzing prescription document with Smart AI...
            </div>
          ` : ''}
        </div>

        <!-- Safety Label Notice -->
        <div class="safety-notice mb-md" style="background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; border-radius: 12px; padding: 0.9rem 1.1rem;">
          <span class="notice-icon" style="font-size: 1.3rem;">⚠️</span>
          <div style="font-size: 0.95rem; line-height: 1.5;">
            <strong>Important Safety Notice:</strong> Information extracted from uploaded prescriptions is for your reference only. Always verify dosages with your original paper document, doctor, or pharmacist before taking medications.
          </div>
        </div>

        <!-- Pending Reminder Confirmation Modal / Prompt -->
        ${pendingReminderPrompt ? `
          <div class="card card-elevated mb-md" style="background: #ECFDF5; border: 2px solid #10B981; padding: 1.25rem;">
            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <div style="font-size: 2rem;">⏰</div>
              <div style="flex: 1;">
                <h4 style="color: #065F46; font-size: 1.2rem; margin-bottom: 0.25rem;">Create Medicine Reminder?</h4>
                <p style="color: #047857; margin-bottom: 0.75rem; font-size: 1rem;">
                  We found instruction for <strong>${pendingReminderPrompt.name}</strong> (${pendingReminderPrompt.frequency}). Would you like to create daily reminder alerts?
                </p>
                <div style="display: flex; gap: 0.75rem;">
                  <button id="btn-confirm-reminder" class="btn btn-primary btn-sm" style="background: #059669;">
                    ✓ Confirm Reminders
                  </button>
                  <button id="btn-dismiss-reminder" class="btn btn-ghost btn-sm">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Active Reminders Section -->
        <div class="card card-elevated mb-md" style="padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="color: var(--teal); font-size: 1.3rem; margin-bottom: 0;">⏰ Daily Medicine Reminders</h3>
            <button id="btn-add-reminder-manual" class="btn btn-ghost btn-sm" style="color: var(--teal); font-weight: 700;">+ Add Time</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${reminders.map((rem, idx) => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #FDF8F3; border-radius: 12px; border: 1px solid #F5EDE3;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div style="font-size: 1.8rem; background: #FFF; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: var(--shadow-sm);">
                    💊
                  </div>
                  <div>
                    <div style="font-weight: 700; color: var(--maroon); font-size: 1.05rem;">${rem.medName}</div>
                    <div style="font-size: 0.85rem; color: var(--gray-500);">${rem.dose} (${rem.period})</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-weight: 700; color: var(--teal-dark); font-size: 1.1rem; background: #E6F4F1; padding: 4px 10px; border-radius: 20px;">
                    ${rem.time}
                  </span>
                  <button class="btn-toggle-reminder" data-idx="${idx}" style="background: none; border: none; font-size: 1.4rem; cursor: pointer;">
                    ${rem.active ? '🔔' : '🔕'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Prescribed Medicines List -->
        <div class="card card-elevated mb-md" style="padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="color: var(--maroon); font-size: 1.3rem; margin-bottom: 0;">📋 Prescribed Medicine List</h3>
            <button id="btn-add-med-manual" class="btn btn-secondary btn-sm">+ Add Medicine</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${medicines.map((med, idx) => `
              <div class="card" style="padding: 1.25rem; border: 2px solid #E2E8F0; background: var(--white); border-radius: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <div>
                    <h4 style="color: var(--maroon); font-size: 1.25rem; margin-bottom: 0.15rem;">${med.name}</h4>
                    <span style="display: inline-block; background: #DBEAFE; color: #1E40AF; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.85rem;">
                      Strength: ${med.strength}
                    </span>
                  </div>
                  <button class="btn-edit-med btn btn-ghost btn-sm" data-idx="${idx}" style="color: var(--teal); font-size: 0.95rem;">✏️ Edit</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.95rem; margin-top: 0.75rem; color: var(--gray-700);">
                  <div><strong>Instruction:</strong> ${med.instructions}</div>
                  <div><strong>Frequency:</strong> ${med.frequency}</div>
                  <div><strong>Duration:</strong> ${med.duration}</div>
                  <div><strong>Doctor:</strong> ${med.doctor || 'Dr. Barua'}</div>
                </div>

                ${med.notes ? `
                  <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--gray-500); background: #F8FAFC; padding: 0.4rem 0.6rem; border-radius: 6px;">
                    📝 <em>${med.notes}</em>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Manual Edit / Add Modal -->
        ${showEditModal ? `
          <div class="modal-overlay">
            <div class="modal-content" style="max-width: 480px;">
              <h3 style="color: var(--maroon); margin-bottom: 1rem;">${editingMed?.id ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              
              <div class="form-group">
                <label class="form-label">Medicine Name</label>
                <input type="text" id="edit-med-name" class="form-input" value="${editingMed?.name || ''}" placeholder="e.g. Paracetamol" />
              </div>

              <div class="form-group">
                <label class="form-label">Strength</label>
                <input type="text" id="edit-med-strength" class="form-input" value="${editingMed?.strength || ''}" placeholder="e.g. 500 mg" />
              </div>

              <div class="form-group">
                <label class="form-label">Instructions</label>
                <input type="text" id="edit-med-instructions" class="form-input" value="${editingMed?.instructions || ''}" placeholder="e.g. 1 tablet after breakfast" />
              </div>

              <div class="form-group">
                <label class="form-label">Frequency</label>
                <input type="text" id="edit-med-frequency" class="form-input" value="${editingMed?.frequency || ''}" placeholder="e.g. Twice daily" />
              </div>

              <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                <button id="btn-save-med-modal" class="btn btn-primary" style="flex: 1;">Save</button>
                <button id="btn-cancel-med-modal" class="btn btn-outline" style="flex: 1;">Cancel</button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const fileInput = container.querySelector('#prescription-file-input');
    const scanBtn = container.querySelector('#btn-scan-camera');
    const uploadBtn = container.querySelector('#btn-upload-file');

    const triggerOCR = () => {
      isScanning = true;
      render();

      AIService.extractPrescription('sample_prescription').then(res => {
        isScanning = false;
        if (res.success && res.medicines.length) {
          // Add first medicine as example
          const newMed = res.medicines[0];
          medicines.push(newMed);
          Storage.setMedicines(medicines);

          pendingReminderPrompt = newMed;
          if (window.SmritiToast) {
            window.SmritiToast.show('Prescription processed! ' + res.medicines.length + ' medicines identified.', 'success');
          }
        }
        render();
      });
    };

    if (scanBtn) scanBtn.addEventListener('click', () => { triggerOCR(); });
    if (uploadBtn) uploadBtn.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        triggerOCR();
      });
    }

    // Pending reminder actions
    const confirmRemBtn = container.querySelector('#btn-confirm-reminder');
    const dismissRemBtn = container.querySelector('#btn-dismiss-reminder');

    if (confirmRemBtn && pendingReminderPrompt) {
      confirmRemBtn.addEventListener('click', () => {
        reminders.push({
          id: 'rem_' + Date.now(),
          medName: pendingReminderPrompt.name,
          time: '08:30 AM',
          period: 'Morning',
          active: true,
          dose: pendingReminderPrompt.instructions
        });
        Storage.setMedicineReminders(reminders);
        pendingReminderPrompt = null;
        if (window.SmritiToast) window.SmritiToast.show('Medicine reminder created!', 'success');
        render();
      });
    }

    if (dismissRemBtn) {
      dismissRemBtn.addEventListener('click', () => {
        pendingReminderPrompt = null;
        render();
      });
    }

    // Toggle reminder active
    container.querySelectorAll('.btn-toggle-reminder').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        reminders[idx].active = !reminders[idx].active;
        Storage.setMedicineReminders(reminders);
        render();
      });
    });

    // Add / Edit modals
    const addMedBtn = container.querySelector('#btn-add-med-manual');
    if (addMedBtn) {
      addMedBtn.addEventListener('click', () => {
        editingMed = { name: '', strength: '', instructions: '', frequency: '' };
        showEditModal = true;
        render();
      });
    }

    container.querySelectorAll('.btn-edit-med').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        editingMed = { ...medicines[idx], _idx: idx };
        showEditModal = true;
        render();
      });
    });

    const saveMedBtn = container.querySelector('#btn-save-med-modal');
    const cancelMedBtn = container.querySelector('#btn-cancel-med-modal');

    if (saveMedBtn) {
      saveMedBtn.addEventListener('click', () => {
        const name = container.querySelector('#edit-med-name').value.trim();
        const strength = container.querySelector('#edit-med-strength').value.trim();
        const instructions = container.querySelector('#edit-med-instructions').value.trim();
        const frequency = container.querySelector('#edit-med-frequency').value.trim();

        if (!name) return alert('Please enter medicine name');

        if (editingMed && editingMed._idx !== undefined) {
          medicines[editingMed._idx] = { ...medicines[editingMed._idx], name, strength, instructions, frequency };
        } else {
          medicines.push({ id: 'med_' + Date.now(), name, strength, instructions, frequency, duration: '30 days', doctor: 'Dr. Barua' });
        }

        Storage.setMedicines(medicines);
        showEditModal = false;
        render();
      });
    }

    if (cancelMedBtn) {
      cancelMedBtn.addEventListener('click', () => {
        showEditModal = false;
        render();
      });
    }
  }

  render();

  return { cleanup() {} };
}
