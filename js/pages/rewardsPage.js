/* ============================================================
   SMRITI — Gamification Economy & Rewards Store
   Digital Milestone Badges & Physical Wellness Claims
   Accessible WCAG AAA Senior-friendly UI
   ============================================================ */

import Storage from '../storage.js';
import Coins from '../coins.js';
import I18n from '../i18n.js';
import TTS from '../tts.js';

export const DIGITAL_BADGES = [
  {
    id: 'memory_champion',
    name: 'Memory Champion',
    icon: '🧠',
    cost: 50,
    desc: 'Celebrates dedication to daily visual memory and pattern recall exercises.',
    benefit: 'Special Gold Aura on your profile and games avatar'
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    icon: '🧘',
    cost: 80,
    desc: 'Awarded for completing mindful deep breathing and peaceful audio sessions.',
    benefit: 'Unlocks exclusive serene mountain chime sounds'
  },
  {
    id: 'golden_recall',
    name: 'Golden Recall',
    icon: '✨',
    cost: 100,
    desc: 'Demonstrates stellar accuracy in recognizing cherished family moments and faces.',
    benefit: 'Special Golden Badge ribbon displayed on Leaderboard'
  },
  {
    id: 'grand_storyteller',
    name: 'Grand Storyteller',
    icon: '📖',
    cost: 150,
    desc: 'Master of nostalgic cultural tales and auditory comprehension journeys.',
    benefit: 'Honorary Storyteller title with lifetime achievement recognition'
  }
];

export const PHYSICAL_GIFTS = [
  {
    id: 'gift_greentea',
    name: 'Organic Assam Herbal Green Tea',
    icon: '🍵',
    cost: 200,
    desc: 'Soothing organic green tea leaves harvested fresh from Assam estates, promoting gentle calm.',
    delivery: 'Shipped to patient home address via Caregiver dispatch'
  },
  {
    id: 'gift_lavender',
    name: 'Aromatherapy Lavender Sachet',
    icon: '💐',
    cost: 250,
    desc: 'Natural dried lavender blossom pouch to place beside the pillow for restful, sweet sleep.',
    delivery: 'Handcrafted natural care pack delivered to registered address'
  },
  {
    id: 'gift_frame',
    name: 'Custom Wooden Photo Keepsake Frame',
    icon: '🖼️',
    cost: 300,
    desc: 'Beautiful polished wood photo frame engraved with patient\'s name to hold a family portrait.',
    delivery: 'Personalized handcrafted frame dispatched within 7 business days'
  }
];

export default function RewardsPage(container) {
  let activeTab = 'badges'; // 'badges' | 'physical'

  function getProfile() {
    return Storage.getPatientProfile() || {};
  }

  function getCoinsBalance() {
    return Coins.get();
  }

  function getUnlockedBadges() {
    const profile = getProfile();
    return (profile.journeyStats && profile.journeyStats.unlockedBadges) || [];
  }

  function getPhysicalClaims() {
    const profile = getProfile();
    return profile.physicalClaims || [];
  }

  function handleClaimBadge(badge) {
    const currentCoins = getCoinsBalance();
    if (currentCoins < badge.cost) {
      if (window.SmritiToast) {
        window.SmritiToast.show(I18n.t('rewardsNotEnough') || 'Keep playing to earn more coins!', 'warning');
      }
      return;
    }

    const confirmBuy = window.confirm(`Redeem "${badge.name}" badge for ${badge.cost} 🪙?`);
    if (!confirmBuy) return;

    Coins.deduct(badge.cost, `Redeemed ${badge.name} badge`);

    const profile = getProfile();
    if (!profile.journeyStats) profile.journeyStats = {};
    if (!profile.journeyStats.unlockedBadges) profile.journeyStats.unlockedBadges = [];
    if (!profile.journeyStats.unlockedBadges.includes(badge.id)) {
      profile.journeyStats.unlockedBadges.push(badge.id);
    }
    Storage.savePatientProfile(profile);

    if (window.SmritiToast) {
      window.SmritiToast.show(`🎉 ${I18n.t('rewardsCongratBadge') || 'You unlocked:'} ${badge.name}!`, 'success');
    }
    if (TTS && TTS.isSupported()) {
      TTS.speak(`Congratulations! You have unlocked the ${badge.name} badge.`);
    }

    render();
  }

  function handleClaimPhysical(gift) {
    const currentCoins = getCoinsBalance();
    if (currentCoins < gift.cost) {
      if (window.SmritiToast) {
        window.SmritiToast.show(I18n.t('rewardsNotEnough') || 'Keep playing to earn more coins!', 'warning');
      }
      return;
    }

    const confirmBuy = window.confirm(`Redeem "${gift.name}" for ${gift.cost} 🪙? A delivery request will be initiated for your home address.`);
    if (!confirmBuy) return;

    Coins.deduct(gift.cost, `Redeemed ${gift.name}`);

    const profile = getProfile();
    if (!profile.physicalClaims) profile.physicalClaims = [];
    profile.physicalClaims.push({
      claimId: 'claim_' + Date.now(),
      giftId: gift.id,
      giftName: gift.name,
      cost: gift.cost,
      claimedAt: new Date().toISOString(),
      status: 'Processing Dispatch'
    });
    Storage.savePatientProfile(profile);

    if (window.SmritiToast) {
      window.SmritiToast.show(`🎁 ${I18n.t('rewardsCongratGift') || 'Wellness gift claim logged!'} ${gift.name}`, 'success');
    }
    if (TTS && TTS.isSupported()) {
      TTS.speak(`Wonderful! Your gift claim for ${gift.name} has been placed successfully.`);
    }

    render();
  }

  function render() {
    const currentCoins = getCoinsBalance();
    const unlockedBadges = getUnlockedBadges();
    const physicalClaims = getPhysicalClaims();

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 800px; padding-bottom: 3.5rem;">
        
        <!-- Header Banner -->
        <div class="card card-elevated text-center mb-md" style="background: linear-gradient(135deg, #FFFBEB, #FEF3C7); border: 2px solid #FDE68A; padding: 1.5rem; border-radius: 18px;">
          <div style="font-size: 3rem; margin-bottom: 0.35rem;">🏆🪙</div>
          <h2 style="color: #92400E; margin: 0; font-size: 1.85rem; font-weight: 800;">
            ${I18n.t('rewardsTitle') || 'Rewards & Badges'}
          </h2>
          <p class="text-muted" style="margin: 0.35rem 0 1rem 0; font-size: 1.05rem;">
            ${I18n.t('rewardsSubtitle') || 'Redeem your hard-earned coins for digital achievement badges and physical wellness gifts!'}
          </p>

          <!-- Coin Balance Capsule -->
          <div style="display: inline-flex; align-items: center; gap: 0.6rem; background: #FFFFFF; border: 2px solid #F59E0B; padding: 0.5rem 1.25rem; border-radius: 999px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);">
            <span style="font-size: 1.4rem;">🪙</span>
            <span style="font-size: 1.15rem; font-weight: 800; color: #78350F;">
              Current Balance: <span style="font-size: 1.35rem; color: #B45309;">${currentCoins}</span> Coins
            </span>
          </div>
        </div>

        <!-- Store Category Switchers -->
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
          <button class="btn btn-rewards-tab ${activeTab === 'badges' ? 'btn-primary text-white' : 'btn-outline'}" data-tab="badges" style="flex: 1; padding: 0.85rem; font-size: 1.05rem; font-weight: 700; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>🎖️</span> ${I18n.t('rewardsBadgeStore') || 'Digital Milestone Badges'}
          </button>
          <button class="btn btn-rewards-tab ${activeTab === 'physical' ? 'btn-primary text-white' : 'btn-outline'}" data-tab="physical" style="flex: 1; padding: 0.85rem; font-size: 1.05rem; font-weight: 700; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>📦</span> ${I18n.t('rewardsPhysicalStore') || 'Physical Wellness Gifts'}
          </button>
        </div>

        <!-- Digital Badges Section -->
        ${activeTab === 'badges' ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;">
            ${DIGITAL_BADGES.map(badge => {
              const isUnlocked = unlockedBadges.includes(badge.id);
              const canAfford = currentCoins >= badge.cost;

              return `
                <div class="card card-elevated" style="background: #FFFFFF; border: 2px solid ${isUnlocked ? '#10B981' : '#E2E8F0'}; border-radius: 16px; padding: 1.35rem; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                  ${isUnlocked ? `
                    <div style="position: absolute; top: 12px; right: 12px; background: #ECFDF5; color: #047857; font-size: 0.8rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid #A7F3D0;">
                      ✓ UNLOCKED
                    </div>
                  ` : ''}

                  <div>
                    <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.75rem;">
                      <div style="font-size: 2.5rem; background: #F8FAFC; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 14px; border: 1px solid #E2E8F0;">
                        ${badge.icon}
                      </div>
                      <div>
                        <h4 style="margin: 0; color: #1E293B; font-size: 1.2rem; font-weight: 800;">${badge.name}</h4>
                        <div style="font-weight: 700; color: #D97706; font-size: 1rem; margin-top: 2px;">
                          🪙 ${badge.cost} Coins
                        </div>
                      </div>
                    </div>

                    <p style="color: #64748B; font-size: 0.95rem; line-height: 1.45; margin: 0 0 0.75rem 0;">
                      ${badge.desc}
                    </p>

                    <div style="background: #F1F5F9; border-radius: 8px; padding: 0.5rem 0.75rem; font-size: 0.85rem; color: #475569; margin-bottom: 1.25rem;">
                      <strong>Reward Perk:</strong> ${badge.benefit}
                    </div>
                  </div>

                  <div>
                    ${isUnlocked ? `
                      <button class="btn btn-secondary btn-block" disabled style="opacity: 0.8; font-weight: 700; border-radius: 10px;">
                        ${I18n.t('rewardsClaimed') || 'Unlocked ✓'}
                      </button>
                    ` : `
                      <button class="btn btn-primary btn-block btn-redeem-badge" data-id="${badge.id}" ${canAfford ? '' : 'disabled'} style="font-weight: 700; border-radius: 10px; ${canAfford ? 'background: #D97706; border-color: #B45309;' : 'opacity: 0.6;'}">
                        ${canAfford ? `Redeem for ${badge.cost} 🪙` : `Need ${badge.cost - currentCoins} More 🪙`}
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- Physical Gifts Section -->
        ${activeTab === 'physical' ? `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${PHYSICAL_GIFTS.map(gift => {
              const claimsCount = physicalClaims.filter(c => c.giftId === gift.id).length;
              const canAfford = currentCoins >= gift.cost;

              return `
                <div class="card card-elevated" style="background: #FFFFFF; border: 2px solid #E2E8F0; border-radius: 16px; padding: 1.35rem; display: flex; flex-direction: column; gap: 1rem;">
                  <div style="display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap;">
                    <div style="font-size: 3rem; background: #FEF3C7; width: 75px; height: 75px; min-width: 75px; display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1.5px solid #FDE68A;">
                      ${gift.icon}
                    </div>

                    <div style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
                        <h4 style="margin: 0; color: #1E293B; font-size: 1.25rem; font-weight: 800;">${gift.name}</h4>
                        <div style="font-weight: 800; color: #B45309; font-size: 1.15rem; background: #FFFBEB; padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid #FCD34D;">
                          🪙 ${gift.cost} Coins
                        </div>
                      </div>

                      <p style="color: #64748B; font-size: 0.95rem; line-height: 1.45; margin: 0.5rem 0 0.5rem 0;">
                        ${gift.desc}
                      </p>

                      <div style="font-size: 0.85rem; color: #047857; font-weight: 600;">
                        🚚 ${gift.delivery}
                      </div>

                      ${claimsCount > 0 ? `
                        <div style="margin-top: 0.5rem; font-size: 0.85rem; color: #0284C7; font-weight: 700;">
                          📦 You have claimed this gift (${claimsCount} order${claimsCount > 1 ? 's' : ''} logged)
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <div style="display: flex; justify-content: flex-end;">
                    <button class="btn btn-primary btn-redeem-physical" data-id="${gift.id}" ${canAfford ? '' : 'disabled'} style="min-width: 200px; font-weight: 700; border-radius: 10px; ${canAfford ? 'background: #0D9488; border-color: #0F766E;' : 'opacity: 0.6;'}">
                      ${canAfford ? `Claim Gift (${gift.cost} 🪙)` : `Need ${gift.cost - currentCoins} More 🪙`}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- Quick Navigation Footer -->
        <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem;">
          <a href="#/games" class="btn btn-outline" style="font-weight: 700; border-radius: 12px; text-decoration: none;">
            🎮 Play Games to Earn Coins
          </a>
          <a href="#/home" class="btn btn-ghost" style="font-weight: 700; border-radius: 12px; text-decoration: none;">
            🏠 Back Home
          </a>
        </div>

      </div>
    `;

    // Wire Tab Switchers
    container.querySelectorAll('.btn-rewards-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // Wire Badge Redemption
    container.querySelectorAll('.btn-redeem-badge').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const badge = DIGITAL_BADGES.find(b => b.id === id);
        if (badge) handleClaimBadge(badge);
      });
    });

    // Wire Physical Gift Claim
    container.querySelectorAll('.btn-redeem-physical').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const gift = PHYSICAL_GIFTS.find(g => g.id === id);
        if (gift) handleClaimPhysical(gift);
      });
    });
  }

  render();

  return {
    cleanup() {}
  };
}
