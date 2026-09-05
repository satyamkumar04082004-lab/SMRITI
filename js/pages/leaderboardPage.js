import Leaderboard from '../leaderboard.js';
import I18n from '../i18n.js';
import Storage from '../storage.js';

export default function LeaderboardPage(container) {
  const rankings = Leaderboard.getRankings() || [];
  const journey = Storage.getJourneyStats();

  const gentleEncouragements = [
    { title: '🌟 Continuous Sunshine', text: '5-Day Mindful Activity Streak' },
    { title: '🌸 Gentle Explorer', text: 'Enjoyed games and story reflection' },
    { title: '🕊️ Peaceful Spirit', text: 'Practiced calming breathing & calm focus' },
    { title: '💖 Family Pillar', text: 'Celebrated cherished life memories' }
  ];

  const getPositiveBadge = (index) => {
    if (index === 0) return '⭐ Star Participant';
    if (index === 1) return '🌸 Gentle Shiner';
    if (index === 2) return '🌿 Diligent Mind';
    return '✨ Joyful Explorer';
  };

  container.innerHTML = `
    <div class="leaderboard-container container page-enter" style="max-width: 720px; margin: 0 auto; padding: 20px; padding-bottom: 3rem;">
      
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem; animation: floatSlow 3s ease-in-out infinite;">🌟✨</div>
        <h2 style="color: var(--maroon); margin: 0 0 0.4rem 0; font-size: 2rem;">This Week's Stars</h2>
        <p class="text-muted" style="font-size: 1.15rem; margin: 0;">
          Our Encouragement Board — Celebrating every gentle step, streak, and joyful participation!
        </p>
      </div>

      <!-- User's Personal Encouragement Card -->
      <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #FEF3C7, #FFFBEB); border: 2px solid #FDE68A; border-radius: 18px; padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-size: 3rem; background: #FFF; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-sm);">
            ${journey.levelIcon || '🌱'}
          </div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #92400E; text-transform: uppercase;">You Are Doing Beautifully!</div>
            <h3 style="color: #78350F; margin: 0.2rem 0; font-size: 1.4rem;">${journey.streak || 5}-Day Wellness Streak 🌸</h3>
            <p style="margin: 0; color: #B45309; font-size: 0.95rem;">Keep shining! Every mindful moment enriches your health.</p>
          </div>
        </div>
        <div style="text-align: right;">
          <span style="background: #10B981; color: white; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 0.95rem;">
            Well Done! ✨
          </span>
        </div>
      </div>

      <!-- Encouragement Board Participants -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem 1.5rem; border-radius: 18px;">
        <h3 style="color: var(--maroon); font-size: 1.3rem; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
          <span>🌻</span> Daily Encouragement Circle
        </h3>

        ${rankings.length === 0 ? `
          <div style="text-align: center; padding: 30px; background: #FDF8F3; border-radius: 14px;">
            <p style="font-size: 1.15rem; color: var(--gray-700); margin: 0;">Play a game or log a mood to light up your star here today! 🌿</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${rankings.map((r, i) => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.2rem; background: ${i === 0 ? '#FEFCE8' : '#FFFDF9'}; border: 1.5px solid ${i === 0 ? '#FEF08A' : '#F3E8DC'}; border-radius: 14px; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="font-size: 1.8rem;">
                    ${i === 0 ? '🌟' : (i === 1 ? '🌸' : (i === 2 ? '🌼' : '🌱'))}
                  </div>
                  <div>
                    <div style="font-size: 1.15rem; font-weight: 700; color: var(--maroon);">${r.name || 'Friend'}</div>
                    <div style="font-size: 0.9rem; color: #047857; font-weight: 600;">
                      ${getPositiveBadge(i)} • ${gentleEncouragements[i % gentleEncouragements.length].text}
                    </div>
                  </div>
                </div>

                <div style="text-align: right;">
                  <span style="background: #E6F4F1; color: var(--teal-dark); font-weight: 700; padding: 4px 10px; border-radius: 10px; font-size: 0.9rem;">
                    ${r.totalSessions || 1} mindful sessions
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Uplifting Affirmation -->
      <div style="text-align: center; background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 14px; padding: 1rem; margin-bottom: 1.5rem; color: #166534; font-size: 1.05rem; font-weight: 600;">
        🕊️ “Every mind has its own rhythm and beauty. Take your time, enjoy each moment, and remember that you are deeply loved.”
      </div>

      <div style="text-align: center;">
         <button class="btn btn-primary" onclick="window.location.hash='#/games'" style="min-height: 54px; font-size: 1.15rem; padding: 10px 32px; border-radius: 14px;">
           ⬅ Back to Games Hub
         </button>
      </div>
    </div>
  `;

  return { cleanup() {} };
}
