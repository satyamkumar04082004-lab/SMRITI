/* ============================================================
   SMRITI — Leaderboard Logic
   Aggregate game results and rank players
   ============================================================ */

import Storage from './storage.js';

const Leaderboard = {
  /**
   * Get leaderboard data for all users
   * @returns {Array<{ name, phone, totalCoins, totalSessions, avgAccuracy, bestScores }>}
   */
  getRankings() {
    const users = Storage.getAllUsers();
    const rankings = [];

    for (const user of users) {
      // Read this user's game history
      const historyKey = `smriti_${user.phone}_gameHistory`;
      let history = [];
      try {
        const raw = localStorage.getItem(historyKey);
        history = raw ? JSON.parse(raw) : [];
      } catch { history = []; }

      if (history.length === 0) continue;

      const coinsKey = `smriti_${user.phone}_coins`;
      let totalCoins = 0;
      try {
        const raw = localStorage.getItem(coinsKey);
        totalCoins = raw ? JSON.parse(raw) : 0;
      } catch { totalCoins = 0; }

      const totalSessions = history.length;
      const avgAccuracy = Math.round(
        history.reduce((sum, h) => sum + (h.accuracy || 0), 0) / totalSessions
      );

      // Best score per game
      const bestScores = {};
      for (const h of history) {
        if (!bestScores[h.gameId] || h.score > bestScores[h.gameId]) {
          bestScores[h.gameId] = h.score;
        }
      }

      rankings.push({
        name: user.name,
        phone: user.phone,
        totalCoins,
        totalSessions,
        avgAccuracy,
        bestScores,
      });
    }

    // Sort by total coins descending
    rankings.sort((a, b) => b.totalCoins - a.totalCoins);
    return rankings;
  },

  /**
   * Get current user's rank
   * @returns {number} 1-based rank, 0 if not ranked
   */
  getCurrentRank() {
    const user = Storage.getUser();
    if (!user) return 0;
    const rankings = this.getRankings();
    const idx = rankings.findIndex(r => r.phone === user.phone);
    return idx >= 0 ? idx + 1 : 0;
  },
};

export default Leaderboard;
