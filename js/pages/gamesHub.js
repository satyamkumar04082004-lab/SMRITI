import Storage from '../storage.js';
import I18n from '../i18n.js';
import Coins from '../coins.js';

export default function GamesHub(container) {
  const user = Storage.getUser() || { name: 'Guest' };
  const coins = Coins.getBalance();
  const lang = I18n.lang.toUpperCase();

  const games = [
    { id: 'hornbill', icon: '🦅', titleKey: 'g1Title', descKey: 'g1Desc', tagKey: 'g1Tag', route: '#/games/hornbill' },
    { id: 'memory-moments', icon: '📖', titleKey: 'g2Title', descKey: 'g2Desc', tagKey: 'g2Tag', route: '#/games/memory-moments' },
    { id: 'familiar-faces', icon: '👨‍👩‍👧', titleKey: 'g3Title', descKey: 'g3Desc', tagKey: 'g3Tag', route: '#/games/familiar-faces' },
    { id: 'remember-home', icon: '🏠', titleKey: 'g4Title', descKey: 'g4Desc', tagKey: 'g4Tag', route: '#/games/remember-home' },
    { id: 'my-day', icon: '☀️', titleKey: 'g5Title', descKey: 'g5Desc', tagKey: 'g5Tag', route: '#/games/my-day' },
    { id: 'listen-remember', icon: '👂', titleKey: 'g6Title', descKey: 'g6Desc', tagKey: 'g6Tag', route: '#/games/listen-remember' },
    { id: 'bamboo-sequence', icon: '🎋', titleKey: 'g7Title', descKey: 'g7Desc', tagKey: 'g7Tag', route: '#/games/bamboo-sequence' }
  ];

  container.innerHTML = `
    <div class="games-hub-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <div class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; background: #FDF8F3; padding: 15px; border-radius: 12px; border: 1px solid #E2E8F0;">
        <h2 style="color: #9B2C2C; margin: 0;">Hi, ${user.name}</h2>
        <div style="display: flex; gap: 15px;">
          <span class="badge" style="background: #D4AF37; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 1.1rem;">🪙 ${coins}</span>
          <span class="badge" style="background: #0D9488; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 1.1rem;">🌐 ${lang}</span>
        </div>
      </div>
      
      <div class="games-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        ${games.map(g => `
          <div class="game-card card" onclick="window.location.hash='${g.route}'" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E2E8F0; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="font-size: 3rem; margin-bottom: 10px; text-align: center;">${g.icon}</div>
            <h3 style="color: #9B2C2C; text-align: center; margin-bottom: 10px; font-size: 1.4rem;">${I18n.t(g.titleKey) || g.id}</h3>
            <p style="color: #555; text-align: center; font-size: 1.1rem; margin-bottom: 15px; min-height: 50px;">${I18n.t(g.descKey) || ''}</p>
            <div style="text-align: center;">
              <span style="background: #E6F4F1; color: #0D9488; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem; font-weight: bold;">${I18n.t(g.tagKey) || 'Cognitive'}</span>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 30px; text-align: center;">
         <button class="btn" onclick="window.location.hash='#/home'" style="min-height: 56px; font-size: 1.2rem; background: transparent; color: #666; border: none; cursor: pointer;">⬅ Back to Home</button>
      </div>
    </div>
  `;

  // Hover effects
  const cards = container.querySelectorAll('.game-card');
  cards.forEach(c => {
    c.addEventListener('mouseenter', () => { c.style.transform = 'translateY(-5px)'; c.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)'; });
    c.addEventListener('mouseleave', () => { c.style.transform = 'translateY(0)'; c.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; });
  });

  return { cleanup() {} };
}
