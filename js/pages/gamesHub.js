/* ============================================================
   SMRITI — AI Adaptive Cognitive Games Hub
   6 Clinical Cognitive Training Domains:
   1. Hornbill Memory Nest (Visual Working Memory)
   2. Memory Moments (Episodic Recall)
   3. Familiar Faces (Facial Recognition & Social Familiarity)
   4. Remember Home (Spatial Orientation & Attention)
   5. My Day (Daily Living Sequencing & Executive Function)
   6. Listen & Remember (Auditory Working Memory)
   Adaptive Difficulty Progression: >75% accuracy unlocks next level.
   ============================================================ */

import Storage from '../storage.js';
import I18n from '../i18n.js';
import Coins from '../coins.js';

export default function GamesHub(container) {
  const user = Storage.getUser() || { name: 'Friend' };
  const coins = Coins.getBalance();
  const lang = (I18n.lang || 'en').toUpperCase();

  const games = [
    { id: 'hornbill', icon: '🦅', titleKey: 'g1Title', descKey: 'g1Desc', tagKey: 'g1Tag', route: '#/games/hornbill' },
    { id: 'memory-moments', icon: '📖', titleKey: 'g2Title', descKey: 'g2Desc', tagKey: 'g2Tag', route: '#/games/memory-moments' },
    { id: 'familiar-faces', icon: '👨‍👩‍👧', titleKey: 'g3Title', descKey: 'g3Desc', tagKey: 'g3Tag', route: '#/games/familiar-faces' },
    { id: 'remember-home', icon: '🏠', titleKey: 'g4Title', descKey: 'g4Desc', tagKey: 'g4Tag', route: '#/games/remember-home' },
    { id: 'my-day', icon: '☀️', titleKey: 'g5Title', descKey: 'g5Desc', tagKey: 'g5Tag', route: '#/games/my-day' },
    { id: 'listen-remember', icon: '👂', titleKey: 'g6Title', descKey: 'g6Desc', tagKey: 'g6Tag', route: '#/games/listen-remember' }
  ];

  container.innerHTML = `
    <div class="games-hub-container" style="max-width: 860px; margin: 0 auto; padding: 20px 16px 40px 16px;">
      <!-- Header Banner -->
      <div class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; background: linear-gradient(135deg, #FFF9F5, #FEF2F2); padding: 18px 20px; border-radius: 16px; border: 1.5px solid #FEE2E2; box-shadow: var(--shadow-sm); flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="color: var(--maroon); margin: 0; font-size: 1.6rem; font-weight: 800;">
            ${I18n.t('greeting') || 'Namaste'}, ${user.name.split(' ')[0]}! 🌸
          </h2>
          <p style="margin: 4px 0 0 0; color: #78350F; font-size: 0.95rem;">
            Cognitive Gym: Daily gentle brain training with adaptive difficulty (>75% unlocks next level).
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span class="badge" style="background: #D97706; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 1.05rem; box-shadow: 0 2px 4px rgba(217,119,6,0.2);">
            🪙 ${coins}
          </span>
          <span class="badge" style="background: #0D9488; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 800; font-size: 1.05rem;">
            🌐 ${lang}
          </span>
        </div>
      </div>
      
      <!-- 6 Adaptive Cognitive Games Grid -->
      <div class="games-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 20px;">
        ${games.map(g => {
          const progress = Storage.getGameLevelStatus(g.id);
          const lvl2Unlocked = progress.level2 && progress.level2.unlocked;
          const lvl3Unlocked = progress.level3 && progress.level3.unlocked;

          return `
            <div class="game-card card" onclick="window.location.hash='${g.route}'" style="background: #FFFFFF; padding: 22px; border-radius: 16px; border: 1.5px solid #E2E8F0; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 3.2rem; margin-bottom: 8px; text-align: center;">${g.icon}</div>
                <h3 style="color: var(--maroon); text-align: center; margin: 0 0 8px 0; font-size: 1.35rem; font-weight: 800;">
                  ${I18n.t(g.titleKey) || g.id}
                </h3>
                <p style="color: #475569; text-align: center; font-size: 0.95rem; margin-bottom: 14px; min-height: 44px; line-height: 1.4;">
                  ${I18n.t(g.descKey) || ''}
                </p>
                <div style="text-align: center; margin-bottom: 12px;">
                  <span style="background: #E6F4F1; color: #0D9488; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 700;">
                    ${I18n.t(g.tagKey) || 'Cognitive'}
                  </span>
                </div>
              </div>

              <!-- Adaptive Level Badges -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 8px 10px; margin-top: 10px;">
                <div style="font-size: 0.78rem; font-weight: 700; color: #64748B; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px;">
                  Adaptive Levels:
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
                  <span style="color: #059669; font-weight: 700;">🟢 L1 Unlocked</span>
                  <span style="font-weight: 700; color: ${lvl2Unlocked ? '#059669' : '#94A3B8'};">
                    ${lvl2Unlocked ? '🟢 L2 Unlocked' : '🔒 L2 (>75%)'}
                  </span>
                  <span style="font-weight: 700; color: ${lvl3Unlocked ? '#059669' : '#94A3B8'};">
                    ${lvl3Unlocked ? '🟢 L3 Unlocked' : '🔒 L3 (>75%)'}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      
      <div style="margin-top: 36px; text-align: center;">
         <button class="btn btn-ghost" onclick="window.location.hash='#/home'" style="min-height: 48px; font-size: 1.1rem; font-weight: 700; cursor: pointer; color: #475569;">
           ⬅ Back to Dashboard
         </button>
      </div>
    </div>
  `;

  // Senior touch target hover effect
  const cards = container.querySelectorAll('.game-card');
  cards.forEach(c => {
    c.addEventListener('mouseenter', () => { c.style.transform = 'translateY(-4px)'; c.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)'; });
    c.addEventListener('mouseleave', () => { c.style.transform = 'translateY(0)'; c.style.boxShadow = '0 4px 10px rgba(0,0,0,0.04)'; });
  });

  return { cleanup() {} };
}
