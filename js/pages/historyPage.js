import Storage from '../storage.js';
import I18n from '../i18n.js';

export default function HistoryPage(container) {
  let history = Storage.getGameHistory() || [];
  let filter = 'all';

  const icons = {
    'hornbill': '🦅',
    'memory-moments': '📖',
    'familiar-faces': '👨‍👩‍👧',
    'remember-home': '🏠',
    'my-day': '☀️',
    'listen-remember': '👂',
    'bamboo-sequence': '🎋'
  };

  const renderList = () => {
    const listContainer = container.querySelector('#history-list');
    
    // Sort by newest first
    let displayList = [...history].reverse();
    if (filter !== 'all') {
      displayList = displayList.filter(h => h.gameId === filter);
    }

    if (displayList.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #FDF8F3; border-radius: 12px; border: 1px solid #E2E8F0;">
          <p style="font-size: 1.2rem; color: #666;">No history found.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = displayList.map(h => {
      const icon = icons[h.gameId] || '🎮';
      const d = new Date(h.date);
      const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      return `
        <div class="history-item" style="display: flex; align-items: center; padding: 15px; border: 1px solid #E2E8F0; border-radius: 12px; margin-bottom: 15px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <div style="font-size: 2.5rem; margin-right: 20px; width: 60px; text-align: center;">${icon}</div>
          <div style="flex: 1;">
            <h4 style="margin: 0 0 5px 0; color: #9B2C2C; font-size: 1.2rem;">${h.gameName || h.gameId}</h4>
            <div style="color: #666; font-size: 0.95rem; display: flex; flex-wrap: wrap; gap: 15px;">
              <span><strong>Score:</strong> ${h.score}</span>
              <span><strong>Accuracy:</strong> ${Math.round(h.accuracy)}%</span>
              <span><strong>Time:</strong> ${h.timeTaken}s</span>
              <span><strong>Difficulty:</strong> ${h.difficulty || 'N/A'}</span>
            </div>
            <div style="color: #999; font-size: 0.85rem; margin-top: 5px;">${dateStr}</div>
          </div>
          <div style="font-size: 1.2rem; font-weight: bold; color: #D4AF37; text-align: right; min-width: 80px;">
            +🪙 ${h.coinsEarned || 0}
          </div>
        </div>
      `;
    }).join('');
  };

  container.innerHTML = `
    <div class="history-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #9B2C2C; margin-bottom: 20px; font-size: 2rem;">Activity History</h2>
      
      <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <select id="game-filter" style="padding: 10px; font-size: 1.1rem; border-radius: 8px; border: 1px solid #ccc;">
          <option value="all">All Games</option>
          <option value="hornbill">Hornbill</option>
          <option value="memory-moments">Memory Moments</option>
          <option value="familiar-faces">Familiar Faces</option>
          <option value="remember-home">Remember Home</option>
          <option value="my-day">My Day</option>
          <option value="listen-remember">Listen & Remember</option>
          <option value="bamboo-sequence">Bamboo Sequence</option>
        </select>
        
        <button class="btn" onclick="window.history.back()" style="padding: 10px 20px; background: transparent; border: 1px solid #9B2C2C; color: #9B2C2C; border-radius: 8px; cursor: pointer; font-size: 1.1rem;">⬅ Back</button>
      </div>
      
      <div id="history-list"></div>
    </div>
  `;

  container.querySelector('#game-filter').addEventListener('change', (e) => {
    filter = e.target.value;
    renderList();
  });

  renderList();

  return { cleanup() {} };
}
