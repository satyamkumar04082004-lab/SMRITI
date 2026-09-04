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

  // Multi-day low mood analysis
  const recentMoods = [...moodHistory].reverse().slice(0, 3);
  const lowMoodCount = recentMoods.filter(m => m.mood === 'low' || m.mood === 'worried').length;
  const showLowMoodAlert = lowMoodCount >= 2;

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
        
        <!-- Header Banner & Mode Switcher -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h2 style="color: var(--maroon); margin: 0; font-size: 1.8rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🤝</span> Caregiver & Family Hub
            </h2>
            <p class="text-muted" style="margin: 0.2rem 0 0 0; font-size: 0.95rem;">Monitoring wellness, memories, mood trends, and reminders</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#/home'">
              👤 Patient View
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.location.hash='#/settings'">
              ⚙️ Settings
            </button>
          </div>
        </div>

        <!-- Caring Alert Banner: Multi-day Low Mood Warning -->
        ${showLowMoodAlert ? `
          <div class="card card-elevated mb-md" style="background: #FFF1F2; border: 2.5px solid #F43F5E; padding: 1.25rem 1.5rem; border-radius: 16px;">
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <div style="font-size: 2.5rem; line-height: 1;">⚠️</div>
              <div style="flex: 1;">
                <div style="font-weight: 800; color: #9F1239; font-size: 1.15rem; margin-bottom: 0.25rem;">
                  Caregiver Caring Notice: Low / Worried Mood Detected for ${lowMoodCount} Days
                </div>
                <p style="color: #BE123C; margin: 0 0 0.75rem 0; font-size: 0.95rem; line-height: 1.45;">
                  Meera has checked in with low or worried moods across consecutive check-ins. Suggest reaching out with a gentle phone call, sharing an uplifting family photo story, or inviting her for a peaceful walk.
                </p>
                <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                  <button class="btn btn-sm btn-primary" onclick="window.location.hash='#/emergency'" style="background: #E11D48; border-color: #E11D48;">
                    🛟 Direct Family Line
                  </button>
                  <button class="btn btn-sm btn-outline" onclick="window.location.hash='#/memories'" style="border-color: #F43F5E; color: #BE123C;">
                    🖼️ Open Memory Gallery
                  </button>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Navigation Tabs -->
        <div class="quick-prompts-scroll" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1.25rem;">
          <button class="chip-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">📊 Overview</button>
          <button class="chip-btn ${activeTab === 'people' ? 'active' : ''}" data-tab="people">👨‍👩‍👧 Memories & Family</button>
          <button class="chip-btn ${activeTab === 'mood' ? 'active' : ''}" data-tab="mood">🌈 Mood Trends</button>
          <button class="chip-btn ${activeTab === 'medicines' ? 'active' : ''}" data-tab="medicines">⏰ Reminders & Meds</button>
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
          <!-- Family Memory Archive -->
          <div class="card card-elevated mb-md" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h3 style="color: var(--maroon); font-size: 1.25rem; margin: 0;">📸 Family Memory Stories</h3>
                <p style="font-size: 0.85rem; color: var(--gray-600); margin: 0.2rem 0 0 0;">Add photos and notes to help your elder reminisce.</p>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm" id="btn-toggle-add-memory">+ Add Memory</button>
                <button class="btn btn-primary btn-sm" onclick="window.location.hash='#/memories'">View Slideshow</button>
              </div>
            </div>

            <!-- New Memory Form (Hidden by default) -->
            <div id="add-memory-panel" style="display: none; background: #FFFDF9; border: 1.5px dashed var(--teal); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: var(--teal); font-size: 1.05rem;">✨ Upload New Family Memory</h4>
              <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                <input type="text" id="dash-mem-title" class="form-input" placeholder="Title (e.g. Picnic at Shillong Peak)" />
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="dash-mem-tag" class="form-input" style="flex: 1;" placeholder="Tag (Family, Nature, Celebration)" />
                  <input type="text" id="dash-mem-date" class="form-input" style="flex: 1;" placeholder="Approx Date / Year" />
                </div>
                <input type="url" id="dash-mem-img" class="form-input" placeholder="Photo URL (optional image link)" />
                <textarea id="dash-mem-story" class="form-input" rows="2" placeholder="Gentle story description..."></textarea>
                <input type="text" id="dash-mem-voice" class="form-input" placeholder="Voice note spoken message (optional)" />
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.3rem;">
                  <button class="btn btn-outline btn-sm" id="btn-cancel-memory">Cancel</button>
                  <button class="btn btn-primary btn-sm" id="btn-save-memory">Save to Gallery</button>
                </div>
              </div>
            </div>

            <!-- List of Existing Memories -->
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.85rem;">
              ${Storage.getMemories().map(m => `
                <div style="background: #FFF; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <div style="height: 110px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${m.image ? `<img src="${m.image}" alt="${m.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.outerHTML='<span style=\\'font-size: 2.5rem;\\'>🖼️</span>'">` : `<span style="font-size: 2.5rem;">📖</span>`}
                  </div>
                  <div style="padding: 0.75rem;">
                    <span style="display: inline-block; font-size: 0.75rem; background: #FEF3C7; color: #92400E; padding: 2px 8px; border-radius: 12px; font-weight: 600; margin-bottom: 0.3rem;">${m.tag || 'Memory'}</span>
                    <h5 style="margin: 0 0 0.3rem 0; font-size: 0.95rem; color: var(--maroon);">${m.title}</h5>
                    <p style="font-size: 0.8rem; color: var(--gray-600); margin: 0; line-clamp: 2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${m.story}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

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

        <!-- Tab 4: Medicines & Gentle Reminders -->
        ${activeTab === 'medicines' ? `
          <!-- Reminder Schedule Manager -->
          <div class="card card-elevated mb-md" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h3 style="color: var(--maroon); font-size: 1.25rem; margin: 0;">⏰ Daily Gentle Reminders</h3>
                <p style="font-size: 0.85rem; color: var(--gray-600); margin: 0.2rem 0 0 0;">Reminders for medication, hydration, morning walk & family calls.</p>
              </div>
              <button class="btn btn-primary btn-sm" id="btn-toggle-add-reminder">+ Add Reminder</button>
            </div>

            <!-- New Reminder Form (Hidden by default) -->
            <div id="add-reminder-panel" style="display: none; background: #FFFDF9; border: 1.5px dashed var(--teal); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: var(--teal); font-size: 1.05rem;">⏰ Schedule New Reminder</h4>
              <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                <input type="text" id="dash-rem-name" class="form-input" placeholder="Reminder title (e.g. Drink Warm Water, Evening Walk, BP Medicine)" />
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="dash-rem-time" class="form-input" style="flex: 1;" placeholder="Time (e.g. 09:00 AM)" />
                  <select id="dash-rem-period" class="form-select" style="flex: 1;">
                    <option value="Morning">Morning ☀️</option>
                    <option value="Afternoon">Afternoon 🌤️</option>
                    <option value="Evening">Evening 🌆</option>
                    <option value="Night">Night 🌙</option>
                  </select>
                </div>
                <input type="text" id="dash-rem-dose" class="form-input" placeholder="Instruction/Dose (e.g. 1 glass water, 1 tablet with warm milk)" />
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.3rem;">
                  <button class="btn btn-outline btn-sm" id="btn-cancel-reminder">Cancel</button>
                  <button class="btn btn-primary btn-sm" id="btn-save-reminder">Add Reminder</button>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${Storage.getMedicineReminders().map(r => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #F8FAFC; border-radius: 12px; border: 1px solid #E2E8F0;">
                  <div style="display: flex; align-items: center; gap: 0.85rem;">
                    <div style="font-size: 1.7rem; background: #E0F2FE; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 10px;">
                      ${r.period === 'Morning' ? '☀️' : r.period === 'Night' ? '🌙' : '🌤️'}
                    </div>
                    <div>
                      <div style="font-weight: 700; color: var(--maroon); font-size: 1.05rem;">${r.medName}</div>
                      <div style="font-size: 0.85rem; color: var(--gray-600);">${r.dose} • <strong style="color: var(--teal);">${r.time} (${r.period})</strong></div>
                    </div>
                  </div>
                  <button class="btn btn-outline btn-sm btn-del-rem" data-id="${r.id}" style="color: #DC2626; border-color: #FCA5A5; padding: 0.3rem 0.6rem; font-size: 0.8rem;">Remove</button>
                </div>
              `).join('')}
            </div>
          </div>

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

    // --- Tab 2: Memory Story Handlers ---
    const toggleAddMem = container.querySelector('#btn-toggle-add-memory');
    const addMemPanel = container.querySelector('#add-memory-panel');
    const cancelMem = container.querySelector('#btn-cancel-memory');
    const saveMem = container.querySelector('#btn-save-memory');

    if (toggleAddMem && addMemPanel) {
      toggleAddMem.addEventListener('click', () => {
        addMemPanel.style.display = addMemPanel.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (cancelMem && addMemPanel) {
      cancelMem.addEventListener('click', () => {
        addMemPanel.style.display = 'none';
      });
    }

    if (saveMem) {
      saveMem.addEventListener('click', () => {
        const title = container.querySelector('#dash-mem-title')?.value.trim();
        const tag = container.querySelector('#dash-mem-tag')?.value.trim() || 'Family';
        const date = container.querySelector('#dash-mem-date')?.value.trim() || 'Cherished Memory';
        const image = container.querySelector('#dash-mem-img')?.value.trim();
        const story = container.querySelector('#dash-mem-story')?.value.trim();
        const voiceNote = container.querySelector('#dash-mem-voice')?.value.trim();

        if (!title || !story) {
          alert('Please provide at least a title and a story description.');
          return;
        }

        Storage.addMemory({
          id: 'mem_' + Date.now(),
          title,
          tag,
          date,
          image: image || null,
          story,
          voiceNote: voiceNote || story
        });

        render();
      });
    }

    // --- Tab 4: Reminder Handlers ---
    const toggleAddRem = container.querySelector('#btn-toggle-add-reminder');
    const addRemPanel = container.querySelector('#add-reminder-panel');
    const cancelRem = container.querySelector('#btn-cancel-reminder');
    const saveRem = container.querySelector('#btn-save-reminder');

    if (toggleAddRem && addRemPanel) {
      toggleAddRem.addEventListener('click', () => {
        addRemPanel.style.display = addRemPanel.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (cancelRem && addRemPanel) {
      cancelRem.addEventListener('click', () => {
        addRemPanel.style.display = 'none';
      });
    }

    if (saveRem) {
      saveRem.addEventListener('click', () => {
        const name = container.querySelector('#dash-rem-name')?.value.trim();
        const time = container.querySelector('#dash-rem-time')?.value.trim() || '09:00 AM';
        const period = container.querySelector('#dash-rem-period')?.value || 'Morning';
        const dose = container.querySelector('#dash-rem-dose')?.value.trim() || 'Take with water';

        if (!name) {
          alert('Please enter a reminder title or medicine name.');
          return;
        }

        Storage.addMedicineReminder({
          id: 'rem_' + Date.now(),
          medName: name,
          time,
          period,
          dose,
          active: true
        });

        render();
      });
    }

    container.querySelectorAll('.btn-del-rem').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (id) {
          Storage.deleteMedicineReminder(id);
          render();
        }
      });
    });
  }

  render();

  return { cleanup() {} };
}
