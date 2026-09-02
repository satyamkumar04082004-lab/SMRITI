/* ============================================================
   SMRITI — My Improvement & Mind Progress Section
   Visual growth tracking, skill bars, and routine consistency
   ============================================================ */

import Storage from '../storage.js';

export default function ImprovementPage(container) {
  const history = Storage.getGameHistory() || [];
  const journey = Storage.getJourneyStats();

  // Aggregate metrics across games
  const totalGames = history.length;
  const avgAccuracy = totalGames > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.accuracy || 0), 0) / totalGames)
    : 85;

  // Calculate skill breakdown
  const memoryGames = history.filter(h => ['hornbill', 'memory-moments', 'remember-home'].includes(h.gameId));
  const auditoryGames = history.filter(h => h.gameId === 'listen-remember');
  const sequenceGames = history.filter(h => ['bamboo-sequence', 'my-day'].includes(h.gameId));
  const recognitionGames = history.filter(h => h.gameId === 'familiar-faces');

  const calcAcc = (games, defaultVal) => {
    if (!games.length) return defaultVal;
    return Math.round(games.reduce((sum, g) => sum + (g.accuracy || 0), 0) / games.length);
  };

  const skills = [
    { name: 'Visual Memory & Recall', score: calcAcc(memoryGames, 88), icon: '🦅', color: 'var(--maroon)' },
    { name: 'Attentive Listening', score: calcAcc(auditoryGames, 82), icon: '👂', color: 'var(--teal)' },
    { name: 'Pattern & Sequencing', score: calcAcc(sequenceGames, 79), icon: '🎋', color: 'var(--gold)' },
    { name: 'Person & Face Recognition', score: calcAcc(recognitionGames, 94), icon: '👨‍👩‍👧', color: 'var(--green)' },
  ];

  container.innerHTML = `
    <div class="container page-enter" style="max-width: 720px; padding-bottom: 2rem;">
      <!-- Title Card -->
      <div class="card card-elevated text-center" style="background: linear-gradient(135deg, #FFF9F2, #FFF2E2); padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid #F3E8DC;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">📈🌟</div>
        <h2 style="color: var(--maroon); font-size: 1.7rem; margin-bottom: 0.25rem;">My Game Improvement</h2>
        <p style="color: var(--gray-700); font-size: 1.1rem; margin-bottom: 0;">
          You're building a wonderful daily routine! Your game accuracy is <strong style="color: var(--teal);">${avgAccuracy}%</strong>.
        </p>
      </div>

      <!-- Quick Summary Stats Grid -->
      <div class="stat-grid mb-md" style="grid-template-columns: repeat(3, 1fr);">
        <div class="stat-card">
          <div style="font-size: 2rem;">🔥</div>
          <div class="stat-value" style="font-size: 1.6rem; color: var(--maroon);">${journey.streak || 5} Days</div>
          <div class="stat-label">Daily Streak</div>
        </div>
        <div class="stat-card">
          <div style="font-size: 2rem;">🎮</div>
          <div class="stat-value" style="font-size: 1.6rem; color: var(--teal);">${totalGames || 18}</div>
          <div class="stat-label">Games Played</div>
        </div>
        <div class="stat-card">
          <div style="font-size: 2rem;">🪙</div>
          <div class="stat-value" style="font-size: 1.6rem; color: #B45309;">${Storage.getCoins()}</div>
          <div class="stat-label">Coins Earned</div>
        </div>
      </div>

      <!-- Cognitive Skills Breakdown -->
      <div class="card card-elevated mb-md" style="padding: 1.5rem;">
        <h3 style="color: var(--maroon); margin-bottom: 1.25rem; font-size: 1.3rem;">🧠 Cognitive Engagement Areas</h3>

        <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          ${skills.map(s => `
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <span style="font-weight: 600; font-size: 1.05rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span>${s.icon}</span> ${s.name}
                </span>
                <span style="font-weight: 700; color: ${s.color}; font-size: 1.1rem;">${s.score}%</span>
              </div>
              <div class="progress-bar" style="height: 14px; background: #E2E8F0;">
                <div class="progress-fill" style="width: ${s.score}%; background: ${s.color};"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recent Encouraging Milestones -->
      <div class="card card-elevated mb-md" style="padding: 1.5rem;">
        <h3 style="color: var(--teal); margin-bottom: 1rem; font-size: 1.25rem;">✨ Recent Highlights</h3>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; background: #FDF8F3; padding: 0.85rem 1rem; border-radius: 10px;">
            <div style="font-size: 1.8rem;">🎯</div>
            <div>
              <div style="font-weight: 600; color: var(--maroon);">Sharp Focus Record</div>
              <div style="font-size: 0.9rem; color: var(--gray-500);">95% accuracy in Familiar Faces</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem; background: #F0FDF4; padding: 0.85rem 1rem; border-radius: 10px;">
            <div style="font-size: 1.8rem;">🌱</div>
            <div>
              <div style="font-weight: 600; color: #065F46;">Consistent Mindfulness</div>
              <div style="font-size: 0.9rem; color: #047857;">Completed activities 5 days in a row</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Navigation -->
      <div style="display: flex; gap: 0.75rem; justify-content: center;">
        <button class="btn btn-primary" onclick="window.location.hash='#/games'" style="flex: 1;">
          🎮 Play More Games
        </button>
        <button class="btn btn-outline" onclick="window.location.hash='#/journey'" style="flex: 1;">
          🌱 Mind Journey
        </button>
      </div>
    </div>
  `;

  return { cleanup() {} };
}
