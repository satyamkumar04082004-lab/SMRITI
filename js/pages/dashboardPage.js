/* ============================================================
   SMRITI — Caregiver Hub & Clinical Care Management
   People, memories, routines, medicines, mood history & AI settings
   ============================================================ */

import Storage from '../storage.js';

export default function DashboardPage(container) {
  const history = Storage.getGameHistory() || [];
  const coins = Storage.getCoins();
  const contacts = Storage.getFamilyContacts();
  const prefs = Storage.getPreferences();
  const moodHistory = Storage.getMoodHistory();
  const medicines = Storage.getMedicines();
  const emergency = Storage.getEmergencyContacts();
  let aiSettings = Storage.getAISettings();

  let activeTab = 'overview'; // overview | people | mood | medicines | ai

  let totalSessions = history.length;
  let avgAccuracy = 0;
  if (totalSessions > 0) {
    avgAccuracy = Math.round(history.reduce((sum, h) => sum + (h.accuracy || 0), 0) / totalSessions);
  }

  // Game breakdown
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

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 850px; padding-bottom: 2.5rem;">
        
        <!-- Header Banner -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h2 style="color: var(--maroon); margin: 0; font-size: 1.8rem;">Caregiver Hub</h2>
            <p class="text-muted" style="margin: 0; font-size: 0.95rem;">Monitoring support, routines, memories and wellness</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.location.hash='#/settings'">
            ⚙️ Settings
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="quick-prompts-scroll" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1.25rem;">
          <button class="chip-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">📊 Overview</button>
          <button class="chip-btn ${activeTab === 'people' ? 'active' : ''}" data-tab="people">👨‍👩‍👧 Family & Memories</button>
          <button class="chip-btn ${activeTab === 'mood' ? 'active' : ''}" data-tab="mood">🌈 Mood History</button>
          <button class="chip-btn ${activeTab === 'medicines' ? 'active' : ''}" data-tab="medicines">💊 Medicines</button>
          <button class="chip-btn ${activeTab === 'ai' ? 'active' : ''}" data-tab="ai">🤖 AI & Emergency</button>
        </div>

        <!-- Tab 1: Overview -->
        ${activeTab === 'overview' ? `
          <div class="stat-grid mb-md" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));">
            <div class="stat-card">
              <div class="stat-label">Total Sessions</div>
              <div class="stat-value" style="color: var(--teal);">${totalSessions}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Avg Accuracy</div>
              <div class="stat-value" style="color: var(--maroon);">${avgAccuracy}%</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Total Coins</div>
              <div class="stat-value" style="color: #B45309;">🪙 ${coins}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Best Game</div>
              <div style="font-size: 1.1rem; font-weight: 700; color: var(--maroon); margin-top: 0.25rem;">${bestGame}</div>
            </div>
          </div>

          <!-- Game Breakdown Table -->
          <div class="card card-elevated mb-md" style="padding: 1.25rem;">
            <h3 style="color: var(--maroon); margin-bottom: 1rem; font-size: 1.25rem;">🎮 Game Performance Breakdown</h3>
            ${Object.keys(breakdown).length === 0 ? `
              <p class="text-muted" style="margin: 0;">No game data available yet.</p>
            ` : `
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <thead>
                    <tr style="border-bottom: 2px solid #E2E8F0; color: var(--gray-700);">
                      <th style="padding: 0.6rem 0.5rem;">Game</th>
                      <th style="padding: 0.6rem 0.5rem; text-align: center;">Sessions</th>
                      <th style="padding: 0.6rem 0.5rem; text-align: right;">Avg Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${Object.keys(breakdown).map(id => `
                      <tr style="border-bottom: 1px solid #F1F5F9;">
                        <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--maroon);">${breakdown[id].name || id}</td>
                        <td style="padding: 0.75rem 0.5rem; text-align: center;">${breakdown[id].count}</td>
                        <td style="padding: 0.75rem 0.5rem; text-align: right; font-weight: 700; color: var(--teal);">${Math.round(breakdown[id].totalAcc / breakdown[id].count)}%</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        ` : ''}

        <!-- Tab 2: Family & Memories -->
        ${activeTab === 'people' ? `
          <div class="card card-elevated mb-md" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="color: var(--maroon); font-size: 1.25rem; margin: 0;">👨‍👩‍👧 Saved Family Contacts</h3>
              <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#/personalisation'">Edit Cultural Notes</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${contacts.map(c => `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.85rem; background: #FDF8F3; border-radius: 12px; border: 1px solid #E2E8F0;">
                  <div style="font-size: 2.2rem; background: #FFF; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                    ${c.photo || '👤'}
                  </div>
                  <div style="flex: 1;">
                    <div style="font-weight: 700; color: var(--maroon); font-size: 1.05rem;">${c.name} (${c.relation})</div>
                    <div style="font-size: 0.9rem; color: var(--gray-700);">${c.phone}</div>
                    <div style="font-size: 0.85rem; color: var(--gray-500); margin-top: 0.15rem;">📝 ${c.notes}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card card-elevated" style="padding: 1.25rem;">
            <h3 style="color: var(--teal); font-size: 1.2rem; margin-bottom: 0.75rem;">📖 Cultural Personalisation Profile</h3>
            <div style="font-size: 0.95rem; color: var(--gray-700); display: flex; flex-direction: column; gap: 0.4rem;">
              <div><strong>Preferred Name:</strong> ${prefs.preferredName || 'Not set'}</div>
              <div><strong>Native Place:</strong> ${prefs.nativePlace || 'Not set'}</div>
              <div><strong>Festivals:</strong> ${prefs.festivals || 'Not set'}</div>
              <div><strong>Food Preferences:</strong> ${prefs.foodPreferences || 'Not set'}</div>
              <div><strong>Memory Notes:</strong> ${prefs.memoryNotes || 'Not set'}</div>
            </div>
          </div>
        ` : ''}

        <!-- Tab 3: Mood History -->
        ${activeTab === 'mood' ? `
          <div class="card card-elevated mb-md" style="padding: 1.25rem;">
            <h3 style="color: var(--maroon); font-size: 1.25rem; margin-bottom: 1rem;">🌈 Daily Mood Check-In History</h3>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${moodHistory.map(m => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="font-size: 2rem;">${m.emoji}</div>
                    <div>
                      <div style="font-weight: 700; color: var(--gray-700); font-size: 1.05rem;">${m.label}</div>
                      <div style="font-size: 0.85rem; color: var(--gray-500);">${m.note || 'Regular daily check-in'}</div>
                    </div>
                  </div>
                  <div style="font-weight: 600; color: var(--teal); font-size: 0.9rem;">
                    ${m.date}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Tab 4: Medicines -->
        ${activeTab === 'medicines' ? `
          <div class="card card-elevated mb-md" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="color: var(--maroon); font-size: 1.25rem; margin: 0;">💊 Current Medicines</h3>
              <button class="btn btn-primary btn-sm" onclick="window.location.hash='#/medicines'">Open Scanner</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${medicines.map(m => `
                <div style="padding: 0.85rem 1rem; background: #EFF6FF; border-radius: 10px; border: 1px solid #BFDBFE;">
                  <div style="font-weight: 700; color: #1E40AF; font-size: 1.05rem;">${m.name} (${m.strength})</div>
                  <div style="font-size: 0.9rem; color: #1E3A8A; margin-top: 0.2rem;">${m.instructions} • ${m.frequency}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Tab 5: AI & Emergency -->
        ${activeTab === 'ai' ? `
          <div class="card card-elevated mb-md" style="padding: 1.25rem;">
            <h3 style="color: var(--maroon); font-size: 1.25rem; margin-bottom: 1rem;">🤖 Smriti AI Companion Settings</h3>

            <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0;">
              <div>
                <strong style="color: var(--gray-700);">Voice Spoken Responses</strong>
                <p class="text-muted" style="margin: 0; font-size: 0.85rem;">Smriti speaks companion messages aloud</p>
              </div>
              <input type="checkbox" id="toggle-ai-voice" ${aiSettings.autoSpeak !== false ? 'checked' : ''} style="width: 24px; height: 24px;" />
            </div>

            <div class="form-group mt-sm">
              <label class="form-label">Speech Rate (Elderly Comfort Speed)</label>
              <select id="select-ai-rate" class="form-select">
                <option value="0.75" ${aiSettings.speechRate === 0.75 ? 'selected' : ''}>Gentle & Slow (0.75x)</option>
                <option value="0.85" ${aiSettings.speechRate === 0.85 ? 'selected' : ''}>Comfortable Standard (0.85x)</option>
                <option value="1.0" ${aiSettings.speechRate === 1.0 ? 'selected' : ''}>Normal (1.0x)</option>
              </select>
            </div>
          </div>

          <div class="card card-elevated" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h3 style="color: #DC2626; font-size: 1.2rem; margin: 0;">🚨 Emergency Direct Line</h3>
              <button class="btn btn-outline btn-sm" onclick="window.location.hash='#/emergency'">Edit Help Hub</button>
            </div>
            <div style="font-size: 0.95rem; color: var(--gray-700);">
              <div><strong>Primary Contact:</strong> ${emergency.primaryName} (${emergency.primaryPhone})</div>
              <div><strong>Doctor:</strong> ${emergency.doctorName} (${emergency.doctorPhone})</div>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    container.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    const voiceToggle = container.querySelector('#toggle-ai-voice');
    if (voiceToggle) {
      voiceToggle.addEventListener('change', (e) => {
        aiSettings.autoSpeak = e.target.checked;
        Storage.setAISettings(aiSettings);
      });
    }

    const rateSelect = container.querySelector('#select-ai-rate');
    if (rateSelect) {
      rateSelect.addEventListener('change', (e) => {
        aiSettings.speechRate = parseFloat(e.target.value);
        Storage.setAISettings(aiSettings);
      });
    }
  }

  render();

  return { cleanup() {} };
}
