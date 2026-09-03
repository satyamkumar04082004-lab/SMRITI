/* ============================================================
   SMRITI — Mind Journey & Smriti Levels
   Fun game engagement progression, XP growth & unlocked badges
   ============================================================ */

import Storage from '../storage.js';

export default function JourneyPage(container) {
  const journey = Storage.getJourneyStats();

  const allLevels = [
    { level: 1, name: 'New Explorer', icon: '🌱', xp: '0–200 XP', desc: 'Starting your mindful brain exercises' },
    { level: 2, name: 'Curious Mind', icon: '🌿', xp: '200–500 XP', desc: 'Engaging your memory and focus daily' },
    { level: 3, name: 'Memory Explorer', icon: '🌸', xp: '500–1000 XP', desc: 'Building consistent cognitive routines' },
    { level: 4, name: 'Mind Master', icon: '🌳', xp: '1000–2000 XP', desc: 'Sharp, joyful, and deeply engaged explorer' },
    { level: 5, name: 'Grand Companion', icon: '✨', xp: '2000+ XP', desc: 'Master of mindfulness, stories and wellness' }
  ];

  const badges = [
    { id: 'first_game', icon: '🎯', name: 'First Game', desc: 'Completed your first cognitive activity', unlocked: true },
    { id: 'consistent_3day', icon: '🔥', name: '3-Day Streak', desc: 'Played games 3 days consecutively', unlocked: true },
    { id: 'cheerful_mood', icon: '🌻', name: 'Cheerful Spirit', desc: 'Checked in with daily moods 5 times', unlocked: true },
    { id: 'memory_master', icon: '🏆', name: 'Memory Ace', desc: 'Scored 90%+ in a visual memory match', unlocked: journey.level >= 3 },
    { id: 'grand_explorer', icon: '👑', name: 'Master Explorer', desc: 'Reached Level 4 in Mind Journey', unlocked: journey.level >= 4 }
  ];

  container.innerHTML = `
    <div class="container page-enter" style="max-width: 720px; padding-bottom: 2rem;">
      <!-- Current Level Banner -->
      <div class="card card-elevated text-center" style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); padding: 1.75rem 1.25rem; border: 2px solid #FCD34D; margin-bottom: 1.5rem; border-radius: 20px;">
        <div style="font-size: 4rem; animation: coinPop 0.6s ease;">${journey.levelIcon}</div>
        <h2 style="color: #78350F; font-size: 1.8rem; margin: 0.25rem 0;">Level ${journey.level}: ${journey.levelName}</h2>
        <p style="color: #92400E; font-size: 1.1rem; margin-bottom: 1rem;">${journey.levelDesc}</p>

        <!-- XP Progress Bar -->
        <div style="max-width: 420px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; color: #78350F; margin-bottom: 0.35rem;">
            <span>${journey.currentXP} Total XP</span>
            <span>Next Level: ${journey.nextLevelXP} XP</span>
          </div>
          <div class="progress-bar" style="height: 18px; background: rgba(255,255,255,0.7); border-radius: 999px;">
            <div class="progress-fill" style="width: ${journey.progressPercent}%; background: linear-gradient(90deg, #D97706, #B45309);"></div>
          </div>
          <div style="font-size: 0.85rem; color: #92400E; margin-top: 0.35rem;">
            ${100 - journey.progressPercent}% more XP to reach your next milestone!
          </div>
        </div>
      </div>

      <!-- AI Adaptive Pace Note -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem; background: #F0FDFA; border: 1px solid #CCFBF1;">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div style="font-size: 2.2rem;">🤖💡</div>
          <div>
            <h3 style="color: var(--teal-dark); font-size: 1.15rem; margin-bottom: 0.25rem;">Adaptive Game Journey</h3>
            <p style="color: #115E59; font-size: 0.95rem; margin-bottom: 0;">
              Smriti automatically tunes each game's pace and hints to your preferred comfort level, ensuring every session feels enjoyable, encouraging, and relaxing.
            </p>
          </div>
        </div>
      </div>

      <!-- Journey Path Map -->
      <div class="card card-elevated mb-md" style="padding: 1.5rem;">
        <h3 style="color: var(--maroon); margin-bottom: 1.25rem; font-size: 1.3rem;">🗺️ Exploration Path</h3>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${allLevels.map(lvl => {
            const isCurrent = lvl.level === journey.level;
            const isPassed = lvl.level < journey.level;
            return `
              <div style="display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-radius: 12px; border: 2px solid ${isCurrent ? 'var(--maroon)' : isPassed ? '#86EFAC' : '#E2E8F0'}; background: ${isCurrent ? '#FFF5F5' : isPassed ? '#F0FDF4' : 'var(--white)'};">
                <div style="font-size: 2.2rem; width: 50px; text-align: center;">${lvl.icon}</div>
                <div style="flex: 1;">
                  <div style="font-weight: 700; color: ${isCurrent ? 'var(--maroon)' : isPassed ? '#166534' : 'var(--gray-700)'}; font-size: 1.1rem;">
                    Level ${lvl.level} — ${lvl.name}
                    ${isCurrent ? '<span style="background: var(--maroon); color: white; font-size: 0.75rem; padding: 2px 8px; border-radius: 999px; margin-left: 6px;">CURRENT</span>' : ''}
                    ${isPassed ? '<span style="color: #16A34A; font-size: 0.9rem; margin-left: 6px;">✓ Completed</span>' : ''}
                  </div>
                  <div style="font-size: 0.9rem; color: var(--gray-500);">${lvl.desc} (${lvl.xp})</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Badges & Achievements -->
      <div class="card card-elevated mb-md" style="padding: 1.5rem;">
        <h3 style="color: var(--maroon); margin-bottom: 1rem; font-size: 1.3rem;">🏅 Unlocked Milestone Badges</h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
          ${badges.map(b => `
            <div style="text-align: center; padding: 1rem 0.5rem; background: ${b.unlocked ? '#FFFDF9' : '#F1F5F9'}; border: 1px solid ${b.unlocked ? '#FDE68A' : '#E2E8F0'}; border-radius: 12px; opacity: ${b.unlocked ? 1 : 0.45};">
              <div style="font-size: 2.5rem; margin-bottom: 0.25rem;">${b.icon}</div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--gray-700);">${b.name}</div>
              <div style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.2rem;">${b.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Action Button -->
      <div class="text-center">
        <button id="btn-journey-play" class="btn btn-primary" style="padding: 0.75rem 2.5rem;">
          🎮 Play Games & Earn XP
        </button>
      </div>
    </div>
  `;

  const playBtn = container.querySelector('#btn-journey-play');
  if (playBtn) {
    playBtn.addEventListener('click', () => { window.location.hash = '#/games'; });
  }

  return { cleanup() {} };
}
