import Leaderboard from '../leaderboard.js';
import I18n from '../i18n.js';
import Storage from '../storage.js';

export default function LeaderboardPage(container) {
  const rankings = Leaderboard.getRankings() || [];

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '#' + (index + 1);
  };

  container.innerHTML = `
    <div class="leaderboard-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #9B2C2C; text-align: center; margin-bottom: 30px; font-size: 2rem;">🏆 Leaderboard</h2>
      
      ${rankings.length === 0 ? `
        <div style="text-align: center; padding: 40px; background: #FDF8F3; border-radius: 12px;">
          <p style="font-size: 1.2rem; color: #666;">No data yet. Play some games to appear here!</p>
        </div>
      ` : `
        <div class="leaderboard-list" style="background: white; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          ${rankings.map((r, i) => `
            <div style="display: flex; align-items: center; padding: 15px 20px; border-bottom: 1px solid #E2E8F0; background: ${i % 2 === 0 ? '#fafafa' : '#fff'};">
              <div style="font-size: 1.5rem; width: 50px; text-align: center; font-weight: bold; color: ${i < 3 ? '#D4AF37' : '#666'};">${getMedal(i)}</div>
              <div style="flex: 1; padding-left: 15px;">
                <div style="font-size: 1.2rem; font-weight: bold; color: #333;">${r.name || 'Anonymous'}</div>
                <div style="font-size: 0.9rem; color: #666;">${r.totalSessions} Sessions • Avg Acc: ${Math.round(r.avgAccuracy)}%</div>
              </div>
              <div style="font-size: 1.2rem; font-weight: bold; color: #D4AF37; display: flex; align-items: center; gap: 5px;">
                🪙 ${r.totalCoins}
              </div>
            </div>
          `).join('')}
        </div>
      `}
      
      <div style="margin-top: 30px; text-align: center;">
         <button class="btn" onclick="window.location.hash='#/games'" style="min-height: 56px; font-size: 1.2rem; background: #0D9488; color: white; border: none; border-radius: 8px; cursor: pointer; padding: 10px 30px;">⬅ Back to Games Hub</button>
      </div>
    </div>
  `;

  return { cleanup() {} };
}
