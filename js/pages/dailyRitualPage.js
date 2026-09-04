/* ============================================================
   SMRITI — Daily Ritual Mode
   Morning Check-in → Recommended Mind Activity → Evening Reflection
   ============================================================ */

import Storage from '../storage.js';
import AIService from '../aiService.js';
import TTS from '../tts.js';

export default function DailyRitualPage(container) {
  const user = Storage.getUser();
  const prefs = Storage.getPreferences();
  const displayName = prefs.preferredName || (user ? user.name.split(' ')[0] : 'Friend');
  let todayMood = Storage.getTodayMood();
  const recommended = AIService.recommendActivity(todayMood?.mood);
  
  let currentStep = 1; // 1: Morning check-in | 2: Activity | 3: Evening reflection
  let reflectionText = '';

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 680px; padding: 20px 15px 3.5rem 15px;">
        
        <!-- Header -->
        <div class="card card-elevated text-center mb-md" style="background: linear-gradient(135deg, #FFF9F2, #FEF3C7); border: 2px solid #FDE68A; padding: 1.75rem 1.25rem; border-radius: 20px;">
          <div style="font-size: 3.5rem; margin-bottom: 0.35rem;">🌅🕊️</div>
          <h2 style="color: var(--maroon); font-size: 1.85rem; margin-bottom: 0.25rem;">
            Today's Gentle Daily Ritual
          </h2>
          <p style="color: var(--gray-700); font-size: 1.05rem; margin: 0;">
            A peaceful 3-step rhythm to nourish your mind, spirit, and memory.
          </p>
        </div>

        <!-- 3 Step Progress Tracker -->
        <div style="display: flex; justify-content: space-between; position: relative; margin-bottom: 2rem; padding: 0 1rem;">
          <div style="text-align: center; flex: 1;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: ${currentStep >= 1 ? 'var(--teal)' : '#E2E8F0'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.4rem auto;">1</div>
            <span style="font-size: 0.85rem; font-weight: 600; color: ${currentStep === 1 ? 'var(--maroon)' : 'var(--gray-500)'};">Morning Check-in</span>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: ${currentStep >= 2 ? 'var(--teal)' : '#E2E8F0'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.4rem auto;">2</div>
            <span style="font-size: 0.85rem; font-weight: 600; color: ${currentStep === 2 ? 'var(--maroon)' : 'var(--gray-500)'};">Mind Activity</span>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: ${currentStep >= 3 ? 'var(--teal)' : '#E2E8F0'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; margin: 0 auto 0.4rem auto;">3</div>
            <span style="font-size: 0.85rem; font-weight: 600; color: ${currentStep === 3 ? 'var(--maroon)' : 'var(--gray-500)'};">Evening Reflection</span>
          </div>
        </div>

        <!-- Step 1: Morning Check-in -->
        ${currentStep === 1 ? `
          <div class="card card-elevated" style="padding: 1.5rem; border-radius: 20px;">
            <h3 style="color: var(--maroon); font-size: 1.3rem; margin: 0 0 0.5rem 0;">
              Step 1: Morning Awakening & Mood Check
            </h3>
            <p style="color: var(--gray-600); font-size: 1rem; margin-bottom: 1.25rem;">
              Good day, ${displayName}! How is your heart and mind feeling this morning?
            </p>

            <div style="display: flex; justify-content: space-around; gap: 0.5rem; margin-bottom: 1.5rem;">
              <button class="mood-btn ${todayMood?.mood === 'great' ? 'active' : ''}" data-mood="great" data-emoji="😊" data-label="Great">
                <span class="mood-emoji">😊</span><span class="mood-label">Great</span>
              </button>
              <button class="mood-btn ${todayMood?.mood === 'good' ? 'active' : ''}" data-mood="good" data-emoji="🙂" data-label="Good">
                <span class="mood-emoji">🙂</span><span class="mood-label">Good</span>
              </button>
              <button class="mood-btn ${todayMood?.mood === 'okay' ? 'active' : ''}" data-mood="okay" data-emoji="😐" data-label="Okay">
                <span class="mood-emoji">😐</span><span class="mood-label">Okay</span>
              </button>
              <button class="mood-btn ${todayMood?.mood === 'low' ? 'active' : ''}" data-mood="low" data-emoji="😔" data-label="Low">
                <span class="mood-emoji">😔</span><span class="mood-label">Low</span>
              </button>
              <button class="mood-btn ${todayMood?.mood === 'worried' ? 'active' : ''}" data-mood="worried" data-emoji="😟" data-label="Worried">
                <span class="mood-emoji">😟</span><span class="mood-label">Worried</span>
              </button>
            </div>

            <button id="btn-ritual-next-1" class="btn btn-primary btn-block" style="min-height: 52px; font-size: 1.15rem; font-weight: 700;">
              Continue to Step 2 ➔
            </button>
          </div>
        ` : ''}

        <!-- Step 2: Recommended Mind Activity -->
        ${currentStep === 2 ? `
          <div class="card card-elevated" style="padding: 1.5rem; border-radius: 20px;">
            <h3 style="color: var(--maroon); font-size: 1.3rem; margin: 0 0 0.5rem 0;">
              Step 2: Today’s Mind Nourishment
            </h3>
            <p style="color: var(--gray-600); font-size: 1rem; margin-bottom: 1.25rem;">
              A gentle exercise specially recommended for you today.
            </p>

            <div style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: #FDF8F3; border: 1.5px solid #E2E8F0; border-radius: 16px; margin-bottom: 1.5rem;">
              <div style="font-size: 3rem; background: white; width: 70px; height: 70px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${recommended.icon || '🎯'}
              </div>
              <div>
                <h4 style="margin: 0; color: var(--maroon); font-size: 1.25rem;">${recommended.name}</h4>
                <p style="margin: 0.25rem 0 0 0; color: var(--gray-600); font-size: 0.95rem;">${recommended.desc}</p>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button id="btn-play-ritual-game" class="btn btn-primary btn-block" style="min-height: 52px; font-size: 1.15rem; font-weight: 700;">
                ▶ Play ${recommended.name}
              </button>
              <button id="btn-ritual-next-2" class="btn btn-outline btn-block" style="min-height: 48px; font-size: 1.05rem;">
                Skip to Evening Reflection ➔
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Step 3: Evening Peaceful Reflection -->
        ${currentStep === 3 ? `
          <div class="card card-elevated" style="padding: 1.5rem; border-radius: 20px;">
            <h3 style="color: var(--maroon); font-size: 1.3rem; margin: 0 0 0.5rem 0;">
              Step 3: Evening Gratitude & Reflection
            </h3>
            <p style="color: var(--gray-600); font-size: 1rem; margin-bottom: 1.25rem;">
              As the day winds down, what was one sweet moment or memory that brought you comfort today?
            </p>

            <textarea id="ritual-reflection-input" class="form-input" rows="3" placeholder="e.g. Enjoyed sweet ginger tea, heard birds in the courtyard, spoke with grandson..." style="font-size: 1.05rem; padding: 0.75rem; margin-bottom: 1.5rem;"></textarea>

            <button id="btn-finish-ritual" class="btn btn-primary btn-block" style="min-height: 52px; font-size: 1.15rem; font-weight: 700; background: #059669;">
              ✨ Complete Today’s Daily Ritual
            </button>
          </div>
        ` : ''}

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Mood selection
    container.querySelectorAll('.mood-btn').forEach(b => {
      b.addEventListener('click', () => {
        const mood = b.getAttribute('data-mood');
        const emoji = b.getAttribute('data-emoji');
        const label = b.getAttribute('data-label');
        Storage.addMoodEntry(mood, emoji, label);
        todayMood = { mood, emoji, label };
        render();
      });
    });

    const next1 = container.querySelector('#btn-ritual-next-1');
    if (next1) {
      next1.addEventListener('click', () => {
        currentStep = 2;
        render();
      });
    }

    const playBtn = container.querySelector('#btn-play-ritual-game');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        window.location.hash = recommended.route;
      });
    }

    const next2 = container.querySelector('#btn-ritual-next-2');
    if (next2) {
      next2.addEventListener('click', () => {
        currentStep = 3;
        render();
      });
    }

    const finishBtn = container.querySelector('#btn-finish-ritual');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        const text = container.querySelector('#ritual-reflection-input')?.value.trim();
        if (text) {
          Storage.addMoodEntry('great', '🌟', 'Daily Reflection', text);
        }
        if (window.SmritiToast) {
          window.SmritiToast.show('Wonderful! Today’s daily ritual is complete. Peace and blessings to you. 🌸', 'success');
        }
        if (TTS && TTS.isSupported()) {
          TTS.speak(`Wonderful ${displayName}. Your daily ritual is complete. May you rest peacefully.`);
        }
        setTimeout(() => {
          window.location.hash = '#/home';
        }, 800);
      });
    }
  }

  render();

  return { cleanup() {} };
}
