/* ============================================================
   SMRITI — My Progress & Mindful Growth
   Encouraging, senior-friendly wellness growth, growing plant visual & weekly summary
   ============================================================ */

import Storage from '../storage.js';

export default function ImprovementPage(container) {
  const history = Storage.getGameHistory() || [];
  const journey = Storage.getJourneyStats();
  const streak = journey.streak || 5;
  const totalGames = history.length || 12;

  // Determine Mindful Garden Plant Stage
  const plantStages = [
    { level: 1, name: 'Little Sprout', icon: '🌱', desc: 'Your mindful journey has begun! Fresh roots are forming.', threshold: 5 },
    { level: 2, name: 'Gentle Sapling', icon: '🌿', desc: 'Growing stronger every day with green leaves and steady habits.', threshold: 10 },
    { level: 3, name: 'Blooming Flower', icon: '🌸', desc: 'Bright blossoms of recall and memory are shining brightly.', threshold: 20 },
    { level: 4, name: 'Graceful Banyan', icon: '🌳', desc: 'Deep-rooted wisdom, calm focus, and rich life stories.', threshold: 35 },
    { level: 5, name: 'Flourishing Garden', icon: '✨🌸🌳', desc: 'A serene sanctuary of peace, joy, and daily mindfulness.', threshold: 50 }
  ];

  let currentStage = plantStages[0];
  if (totalGames >= 35) currentStage = plantStages[3];
  else if (totalGames >= 20) currentStage = plantStages[2];
  else if (totalGames >= 10) currentStage = plantStages[1];

  container.innerHTML = `
    <div class="container page-enter" style="max-width: 680px; padding-bottom: 2.5rem;">
      
      <!-- Top Encouraging Banner -->
      <div class="card card-elevated text-center mb-md" style="background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 2px solid #BBF7D0; padding: 1.5rem; border-radius: 20px;">
        <div style="font-size: 3rem; margin-bottom: 0.35rem;">🌻🌿</div>
        <h2 style="color: #065F46; font-size: 1.8rem; margin: 0 0 0.25rem 0;">My Mindful Progress</h2>
        <p style="color: #047857; font-size: 1.05rem; margin: 0;">
          Celebrating every gentle step of your daily memory and wellness routine.
        </p>
      </div>

      <!-- 1. Celebratory Streak Banner -->
      <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #FFFBEB, #FEF3C7); border: 2px solid #FCD34D; padding: 1.25rem 1.5rem; border-radius: 18px; display: flex; align-items: center; gap: 1.25rem;">
        <div style="font-size: 3.5rem; line-height: 1; animation: floatSlow 2.5s infinite ease-in-out;">🔥</div>
        <div style="flex: 1;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 0.5px;">
            Daily Dedication
          </div>
          <h3 style="color: #78350F; font-size: 1.6rem; margin: 0.15rem 0;">
            ${streak}-Day Mindfulness Streak!
          </h3>
          <p style="margin: 0; color: #92400E; font-size: 0.95rem;">
            You have checked in and exercised your mind consistently. That is wonderful!
          </p>
        </div>
      </div>

      <!-- 2. Growing Mindful Plant / Garden Visual -->
      <div class="card card-elevated mb-md text-center" style="background: #FFFFFF; border: 2px solid #E2E8F0; padding: 1.75rem 1.5rem; border-radius: 20px;">
        <div style="font-size: 0.85rem; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">
          Your Growing Mind Garden
        </div>

        <!-- Plant Avatar -->
        <div style="font-size: 4.5rem; margin: 0.5rem 0; animation: floatSlow 3s infinite ease-in-out;">
          ${currentStage.icon}
        </div>

        <h3 style="color: var(--maroon); font-size: 1.5rem; margin: 0.25rem 0 0.5rem 0;">
          ${currentStage.name}
        </h3>
        
        <p style="color: var(--gray-700); font-size: 1.05rem; max-width: 480px; margin: 0 auto 1.25rem auto; line-height: 1.5;">
          ${currentStage.desc}
        </p>

        <!-- Visual Garden Progress Bar -->
        <div style="max-width: 380px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: var(--gray-500); margin-bottom: 0.35rem;">
            <span>🌱 Seedling</span>
            <span>🌿 Sapling</span>
            <span>🌸 Blossom</span>
            <span>🌳 Sanctuary</span>
          </div>
          <div class="progress-bar" style="height: 16px; background: #E2E8F0; border-radius: 999px;">
            <div class="progress-fill" style="width: ${Math.min(100, Math.max(25, (totalGames / 35) * 100))}%; background: linear-gradient(90deg, #10B981, #059669);"></div>
          </div>
          <div style="font-size: 0.85rem; color: #047857; margin-top: 0.45rem; font-weight: 600;">
            ${totalGames} mindful activities completed so far!
          </div>
        </div>
      </div>

      <!-- 3. Weekly Summary in Plain, Positive Language -->
      <div class="card card-elevated mb-md" style="background: #FFFDF9; border: 2px solid #FDE68A; padding: 1.5rem; border-radius: 20px;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          <span style="font-size: 1.6rem;">📋</span>
          <h3 style="color: var(--maroon); font-size: 1.3rem; margin: 0;">
            This Week’s Gentle Summary
          </h3>
        </div>

        <p style="font-size: 1.1rem; line-height: 1.65; color: var(--gray-700); margin-bottom: 1rem;">
          This week, you nurtured your mind with steady warmth. You completed <strong>${totalGames} gentle brain exercises</strong>, checked in with your feelings, and kept your memory active. Your attention, story recall, and patience continue to bloom beautifully!
        </p>

        <!-- Highlights in Friendly Plain Language -->
        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; background: #F0FDF4; padding: 0.75rem 1rem; border-radius: 12px;">
            <span style="font-size: 1.4rem;">🦅</span>
            <div style="font-size: 1rem; color: #166534;">
              <strong>Sharp Visual Observation:</strong> You matched nature cards with wonderful focus!
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; background: #EFF6FF; padding: 0.75rem 1rem; border-radius: 12px;">
            <span style="font-size: 1.4rem;">👂</span>
            <div style="font-size: 1rem; color: #1E40AF;">
              <strong>Attentive Listening:</strong> You listened carefully to daily sentences and stories.
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem; background: #FFF7ED; padding: 0.75rem 1rem; border-radius: 12px;">
            <span style="font-size: 1.4rem;">👨‍👩‍👧</span>
            <div style="font-size: 1rem; color: #9A3412;">
              <strong>Heartfelt Connection:</strong> Connected with friendly faces and family moments.
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Encouraging Navigation Buttons -->
      <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
        <button id="btn-imp-play-games" class="btn btn-primary" style="flex: 1; min-width: 180px; min-height: 52px; font-size: 1.1rem;">
          🎮 Play More Games
        </button>
        <button id="btn-imp-memories" class="btn btn-secondary" style="flex: 1; min-width: 180px; min-height: 52px; font-size: 1.1rem;">
          🖼️ View Memories
        </button>
      </div>

    </div>
  `;

  const playGamesBtn = container.querySelector('#btn-imp-play-games');
  if (playGamesBtn) {
    playGamesBtn.addEventListener('click', () => { window.location.hash = '#/games'; });
  }

  const memoriesBtn = container.querySelector('#btn-imp-memories');
  if (memoriesBtn) {
    memoriesBtn.addEventListener('click', () => { window.location.hash = '#/memories'; });
  }

  return { cleanup() {} };
}
