/* ============================================================
   SMRITI — Modernized Wellness & Memory Home Page
   Warm, consumer-friendly daily companion hub
   ============================================================ */

import Storage from '../storage.js';
import AIService from '../aiService.js';
import TTS from '../tts.js';

export default function Home(container) {
  const user = Storage.getUser() || { name: 'Friend' };
  const prefs = Storage.getPreferences();
  const displayName = prefs.preferredName || user.name.split(' ')[0] || 'Friend';

  let currentThought = AIService.generateGoodThought();
  let todayMood = Storage.getTodayMood();
  const journey = Storage.getJourneyStats();
  const recommendedGame = AIService.recommendActivity();

  // Determine time of day greeting
  const hour = new Date().getHours();
  let timeGreeting = 'Good morning';
  let timeIcon = '🌻';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
    timeIcon = '☀️';
  } else if (hour >= 17) {
    timeGreeting = 'Good evening';
    timeIcon = '🌙';
  }

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 680px; padding-bottom: 2.5rem;">
        
        <!-- Top Welcome Greeting Banner -->
        <div class="card card-elevated greeting-card mb-md" style="background: linear-gradient(135deg, #FFF9F2, #FFF2E2); border: 2px solid #F3E8DC; padding: 1.5rem; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 1.1rem; color: var(--gray-500); font-weight: 600;">
                ${timeGreeting}, ${timeIcon}
              </div>
              <h1 style="color: var(--maroon); font-size: 2rem; margin: 0.15rem 0 0.35rem 0;">
                ${displayName}!
              </h1>
              <p style="margin: 0; color: var(--gray-700); font-size: 1.05rem;">
                Welcome to your daily memory and wellness sanctuary.
              </p>
            </div>
            <div style="font-size: 3.5rem; animation: floatSlow 3s ease-in-out infinite;">
              🌸
            </div>
          </div>
        </div>

        <!-- 1. Daily Mood Section -->
        <div class="card card-elevated mb-md" style="padding: 1.25rem 1.5rem; border-radius: 16px;">
          <h3 style="color: var(--maroon); font-size: 1.2rem; margin-bottom: 0.75rem; text-align: center;">
            How are you feeling today?
          </h3>

          <div class="mood-selector-grid" style="display: flex; justify-content: space-around; gap: 0.5rem; margin-bottom: 0.5rem;">
            <button class="mood-btn ${todayMood?.mood === 'great' ? 'active' : ''}" data-mood="great" data-emoji="😊" data-label="Great">
              <span class="mood-emoji">😊</span>
              <span class="mood-label">Great</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'good' ? 'active' : ''}" data-mood="good" data-emoji="🙂" data-label="Good">
              <span class="mood-emoji">🙂</span>
              <span class="mood-label">Good</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'okay' ? 'active' : ''}" data-mood="okay" data-emoji="😐" data-label="Okay">
              <span class="mood-emoji">😐</span>
              <span class="mood-label">Okay</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'low' ? 'active' : ''}" data-mood="low" data-emoji="😔" data-label="Low">
              <span class="mood-emoji">😔</span>
              <span class="mood-label">Low</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'worried' ? 'active' : ''}" data-mood="worried" data-emoji="😟" data-label="Worried">
              <span class="mood-emoji">😟</span>
              <span class="mood-label">Worried</span>
            </button>
          </div>

          ${todayMood ? `
            <div class="mood-feedback-banner" style="background: #F0FDFA; padding: 0.75rem 1rem; border-radius: 10px; text-align: center; margin-top: 0.75rem; border: 1px solid #CCFBF1;">
              <span style="color: #0F766E; font-weight: 600; font-size: 0.95rem;">
                Thank you for sharing! You checked in as <strong>${todayMood.emoji} ${todayMood.label}</strong> today.
              </span>
              <div style="margin-top: 0.5rem;">
                <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#/smriti'">
                  🤖 Talk to Smriti about your day
                </button>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 2. Today's Activity Recommendation -->
        <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 16px; border-left: 6px solid var(--teal); background: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.8rem;">🎯</span>
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">
                  Today's Recommended Activity
                </div>
                <h3 style="color: var(--maroon); margin: 0; font-size: 1.25rem;">
                  ${recommendedGame.name}
                </h3>
              </div>
            </div>
            <span class="card-tag" style="background: #E6F4F1; color: var(--teal-dark);">
              ${recommendedGame.tag}
            </span>
          </div>

          <p class="text-muted" style="margin: 0.5rem 0 1rem 0; font-size: 0.95rem;">
            ${recommendedGame.desc}
          </p>

          <button class="btn btn-primary btn-block" onclick="window.location.hash='${recommendedGame.route}'" style="min-height: 52px; font-size: 1.15rem;">
            ▶ START ACTIVITY
          </button>
        </div>

        <!-- 3. Today's Good Thought Card -->
        <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #FEF3C7, #FFFBEB); border: 2px solid #FDE68A; padding: 1.5rem; border-radius: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="font-weight: 700; color: #92400E; font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>💭</span> Today's Good Thought
            </div>
            <span style="background: rgba(255,255,255,0.8); color: #B45309; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
              ${currentThought.theme}
            </span>
          </div>

          <p id="thought-text-display" style="font-size: 1.2rem; line-height: 1.5; color: #78350F; font-style: italic; margin-bottom: 1rem;">
            “${currentThought.text}”
          </p>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button id="btn-listen-thought" class="btn btn-ghost btn-sm" style="background: rgba(255,255,255,0.7); color: #92400E; font-weight: 600;">
              🔊 Listen
            </button>
            <button id="btn-new-thought" class="btn btn-ghost btn-sm" style="background: rgba(255,255,255,0.7); color: #92400E; font-weight: 600;">
              🔄 New Thought
            </button>
          </div>
        </div>

        <!-- 4. Smriti AI Companion Teaser -->
        <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #F0FDFA, #CCFBF1); border: 1px solid #99F6E4; padding: 1.25rem; border-radius: 16px; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="font-size: 2.8rem; background: #FFF; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: var(--shadow-sm);">
              🤖
            </div>
            <div>
              <h4 style="color: #0F766E; font-size: 1.2rem; margin: 0 0 0.15rem 0;">Smriti AI Companion</h4>
              <p style="color: #115E59; margin: 0; font-size: 0.95rem;">“Would you like to hear an uplifting story or chat?”</p>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#/smriti'" style="white-space: nowrap; padding: 0.6rem 1.1rem;">
            🎤 Talk
          </button>
        </div>

        <!-- 5. My Journey Widget -->
        <div class="card card-elevated mb-md" style="padding: 1.25rem 1.5rem; border-radius: 16px; cursor: pointer;" onclick="window.location.hash='#/journey'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.6rem;">${journey.levelIcon}</span>
              <span style="font-weight: 700; color: var(--maroon); font-size: 1.15rem;">
                Level ${journey.level} — ${journey.levelName}
              </span>
            </div>
            <span style="font-weight: 700; color: var(--teal); font-size: 0.95rem;">
              ${journey.progressPercent}% to next level ➔
            </span>
          </div>
          <div class="progress-bar" style="height: 12px; background: #E2E8F0;">
            <div class="progress-fill" style="width: ${journey.progressPercent}%;"></div>
          </div>
        </div>

        <!-- 6. Quick Access Navigation Grid -->
        <div class="card card-elevated" style="padding: 1.5rem; border-radius: 16px;">
          <h3 style="color: var(--maroon); font-size: 1.2rem; margin-bottom: 1rem;">
            ❤️ Quick Navigation
          </h3>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center;">
            <div class="card card-game" onclick="window.location.hash='#/games'" style="padding: 1rem 0.5rem;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🎮</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--maroon);">Games Hub</div>
            </div>

            <div class="card card-game" onclick="window.location.hash='#/wellness'" style="padding: 1rem 0.5rem;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🌿</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #065F46;">Wellness</div>
            </div>

            <div class="card card-game" onclick="window.location.hash='#/improvement'" style="padding: 1rem 0.5rem;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">📈</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--teal-dark);">Progress</div>
            </div>

            <div class="card card-game" onclick="window.location.hash='#/medicines'" style="padding: 1rem 0.5rem;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">💊</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #1E40AF;">Medicines</div>
            </div>

            <div class="card card-game" onclick="window.location.hash='#/journey'" style="padding: 1rem 0.5rem;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🌱</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #78350F;">My Journey</div>
            </div>

            <div class="card card-game" onclick="window.location.hash='#/emergency'" style="padding: 1rem 0.5rem;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🆘</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #DC2626;">Emergency</div>
            </div>
          </div>
        </div>

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Mood selection buttons
    container.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mood = btn.getAttribute('data-mood');
        const emoji = btn.getAttribute('data-emoji');
        const label = btn.getAttribute('data-label');
        Storage.addMoodEntry(mood, emoji, label);
        todayMood = { mood, emoji, label };
        if (window.SmritiToast) {
          window.SmritiToast.show(`Mood logged: ${emoji} ${label}`, 'success');
        }
        render();
      });
    });

    // Good thought controls
    const newThoughtBtn = container.querySelector('#btn-new-thought');
    if (newThoughtBtn) {
      newThoughtBtn.addEventListener('click', () => {
        currentThought = AIService.generateGoodThought();
        const display = container.querySelector('#thought-text-display');
        if (display) display.textContent = `“${currentThought.text}”`;
      });
    }

    const listenThoughtBtn = container.querySelector('#btn-listen-thought');
    if (listenThoughtBtn) {
      listenThoughtBtn.addEventListener('click', () => {
        TTS.speak(currentThought.text);
      });
    }
  }

  render();

  return {
    cleanup() {
      TTS.stop();
    }
  };
}
