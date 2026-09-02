/* ============================================================
   SMRITI — Coin Economy System
   Award, track, and display coins with encouraging messages
   ============================================================ */

import Storage from './storage.js';
import I18n from './i18n.js';

const Coins = {
  /**
   * Calculate coins earned for a game session
   * @param {number} accuracy - 0-100
   * @param {number} timeTaken - seconds
   * @param {number} parTime - expected time in seconds (optional)
   * @returns {{ total: number, base: number, accuracyBonus: number, speedBonus: number }}
   */
  calculate(accuracy, timeTaken, parTime = 60) {
    const base = 5;
    const accuracyBonus = Math.floor(accuracy / 20); // 0-5
    const speedBonus = (parTime > 0 && timeTaken < parTime) ? 2 : 0;
    const total = base + accuracyBonus + speedBonus;
    return { total, base, accuracyBonus, speedBonus };
  },

  /**
   * Award coins and persist
   * @param {number} amount
   * @param {string} reason
   * @returns {number} new balance
   */
  add(amount, reason = '') {
    const current = Storage.getCoins();
    const newBalance = current + Math.max(0, amount);
    Storage.setCoins(newBalance);
    console.log(`🪙 +${amount} coins (${reason}). Balance: ${newBalance}`);
    return newBalance;
  },

  /**
   * Get current balance
   * @returns {number}
   */
  getBalance() {
    return Storage.getCoins();
  },

  /**
   * Get encouraging message based on coins earned
   * @param {number} coinsEarned
   * @returns {string}
   */
  getMessage(coinsEarned) {
    if (coinsEarned >= 10) return `🌟 ${I18n.t('excellent')} +${coinsEarned} 🪙`;
    if (coinsEarned >= 7) return `👏 ${I18n.t('greatJob')} +${coinsEarned} 🪙`;
    if (coinsEarned >= 5) return `😊 ${I18n.t('wellDone')} +${coinsEarned} 🪙`;
    return `💪 ${I18n.t('goodEffort')} +${coinsEarned} 🪙`;
  },

  /**
   * Update coin badge in header
   */
  updateBadge() {
    const badge = document.getElementById('coin-balance');
    if (badge) {
      badge.textContent = this.getBalance();
    }
  },
};

export default Coins;
