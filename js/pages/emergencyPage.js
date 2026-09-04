/* ============================================================
   SMRITI — Emergency Help & Quick Call Hub
   Senior-accessible emergency buttons, primary contact calling & safety confirmations
   ============================================================ */

import Storage from '../storage.js';

export default function EmergencyPage(container) {
  let contacts = Storage.getEmergencyContacts();
  let showConfirmCallModal = false;
  let callTarget = null;
  let isEditing = false;

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 650px; padding-bottom: 2rem;">
        <!-- Banner -->
        <div class="card card-elevated text-center" style="background: linear-gradient(135deg, #FEF2F2, #FEE2E2); border: 2px solid #FCA5A5; padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 18px;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🆘 🛟</div>
          <h2 style="color: var(--maroon); font-size: 1.8rem; margin-bottom: 0.25rem;">Emergency & Family Help</h2>
          <p style="color: #991B1B; font-size: 1.05rem; margin-bottom: 0;">Quick, direct access to your primary contact, doctor, and emergency assistance.</p>
        </div>

        <!-- Giant Primary Contact Call Button -->
        <div class="card card-elevated text-center mb-md" style="padding: 1.75rem 1rem; border: 3px solid #EF4444; background: linear-gradient(180deg, #FFFFFF, #FFF5F5); border-radius: 20px;">
          <div style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; color: #DC2626; font-weight: 700; margin-bottom: 0.5rem;">
            Primary Family Contact
          </div>
          
          <button id="btn-call-primary" class="btn btn-primary btn-block" style="min-height: 76px; font-size: 1.55rem; border-radius: 16px; background: #DC2626; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.35); display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
            🛟 CALL ${contacts.primaryName.toUpperCase()}
          </button>

          <div style="margin-top: 0.75rem; color: var(--gray-500); font-size: 1rem;">
            📞 <strong>${contacts.primaryPhone}</strong> (${contacts.relation})
          </div>
        </div>

        <!-- Emergency Services Grid -->
        <div class="card card-elevated mb-md" style="padding: 1.5rem;">
          <h3 style="color: var(--maroon); font-size: 1.25rem; margin-bottom: 1rem;">🚨 Emergency Quick Services</h3>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <!-- Emergency Ambulance -->
            <button class="btn btn-outline btn-block btn-trigger-call" data-name="Emergency Services" data-phone="${contacts.ambulancePhone}" style="min-height: 60px; justify-content: space-between; border-color: #EF4444; color: #DC2626; font-size: 1.15rem; background: #FFF;">
              <span style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.5rem;">🚑</span> Emergency Services
              </span>
              <span style="font-weight: 700; background: #FEE2E2; padding: 4px 10px; border-radius: 8px;">
                ${contacts.ambulancePhone}
              </span>
            </button>

            <!-- Family Doctor -->
            <button class="btn btn-outline btn-block btn-trigger-call" data-name="${contacts.doctorName}" data-phone="${contacts.doctorPhone}" style="min-height: 60px; justify-content: space-between; border-color: var(--teal); color: var(--teal-dark); font-size: 1.15rem; background: #FFF;">
              <span style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.5rem;">🏥</span> ${contacts.doctorName}
              </span>
              <span style="font-weight: 700; background: #CCFBF1; padding: 4px 10px; border-radius: 8px;">
                Doctor
              </span>
            </button>

            <!-- Transport Support -->
            <button class="btn btn-outline btn-block btn-trigger-call" data-name="Emergency Transport" data-phone="${contacts.transportPhone}" style="min-height: 60px; justify-content: space-between; border-color: var(--gold); color: #B45309; font-size: 1.15rem; background: #FFF;">
              <span style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.5rem;">🚕</span> Emergency Transport
              </span>
              <span style="font-weight: 700; background: #FEF3C7; padding: 4px 10px; border-radius: 8px;">
                Transport
              </span>
            </button>
          </div>
        </div>

        <!-- Edit Contacts Setting -->
        <div class="card card-elevated mb-md" style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="color: var(--gray-700); font-size: 1.15rem; margin-bottom: 0;">⚙️ Configure Contacts</h3>
            <button id="btn-toggle-edit" class="btn btn-ghost btn-sm" style="color: var(--teal); font-weight: 700;">
              ${isEditing ? 'Close' : '✏️ Edit Numbers'}
            </button>
          </div>

          ${isEditing ? `
            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.85rem;">
              <div class="form-group">
                <label class="form-label">Primary Contact Name</label>
                <input type="text" id="edit-primary-name" class="form-input" value="${contacts.primaryName}" />
              </div>
              <div class="form-group">
                <label class="form-label">Primary Phone Number</label>
                <input type="text" id="edit-primary-phone" class="form-input" value="${contacts.primaryPhone}" />
              </div>
              <div class="form-group">
                <label class="form-label">Doctor Phone Number</label>
                <input type="text" id="edit-doctor-phone" class="form-input" value="${contacts.doctorPhone}" />
              </div>
              <button id="btn-save-contacts" class="btn btn-primary btn-block mt-sm">Save Contacts</button>
            </div>
          ` : ''}
        </div>

        <!-- Safety Confirmation Call Modal -->
        ${showConfirmCallModal && callTarget ? `
          <div class="modal-overlay">
            <div class="modal-content text-center" style="max-width: 400px; padding: 2rem 1.5rem;">
              <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">📞 🛟</div>
              <h3 style="color: var(--maroon); font-size: 1.4rem; margin-bottom: 0.5rem;">Call Confirmation</h3>
              <p style="color: var(--gray-700); font-size: 1.1rem; margin-bottom: 1.5rem;">
                Would you like to initiate a phone call to <strong>${callTarget.name}</strong> at <strong>${callTarget.phone}</strong>?
              </p>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="tel:${callTarget.phone.replace(/[^0-9+]/g, '')}" id="btn-execute-call" class="btn btn-primary" style="background: #DC2626; text-decoration: none; font-size: 1.25rem;">
                  📞 CALL NOW
                </a>
                <button id="btn-cancel-call" class="btn btn-outline">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Primary call button
    const callPrimaryBtn = container.querySelector('#btn-call-primary');
    if (callPrimaryBtn) {
      callPrimaryBtn.addEventListener('click', () => {
        callTarget = { name: contacts.primaryName, phone: contacts.primaryPhone };
        showConfirmCallModal = true;
        render();
      });
    }

    // Other emergency call buttons
    container.querySelectorAll('.btn-trigger-call').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const phone = btn.getAttribute('data-phone');
        callTarget = { name, phone };
        showConfirmCallModal = true;
        render();
      });
    });

    // Cancel modal
    const cancelCallBtn = container.querySelector('#btn-cancel-call');
    if (cancelCallBtn) {
      cancelCallBtn.addEventListener('click', () => {
        showConfirmCallModal = false;
        callTarget = null;
        render();
      });
    }

    // Toggle edit
    const toggleEditBtn = container.querySelector('#btn-toggle-edit');
    if (toggleEditBtn) {
      toggleEditBtn.addEventListener('click', () => {
        isEditing = !isEditing;
        render();
      });
    }

    // Save contacts
    const saveContactsBtn = container.querySelector('#btn-save-contacts');
    if (saveContactsBtn) {
      saveContactsBtn.addEventListener('click', () => {
        contacts.primaryName = container.querySelector('#edit-primary-name').value.trim() || contacts.primaryName;
        contacts.primaryPhone = container.querySelector('#edit-primary-phone').value.trim() || contacts.primaryPhone;
        contacts.doctorPhone = container.querySelector('#edit-doctor-phone').value.trim() || contacts.doctorPhone;
        Storage.setEmergencyContacts(contacts);
        isEditing = false;
        if (window.SmritiToast) window.SmritiToast.show('Emergency contacts updated!', 'success');
        render();
      });
    }
  }

  render();

  return { cleanup() {} };
}
