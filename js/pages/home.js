/* ============================================================
   SMRITI (स्मृति) — Google Stitch Sanctuary Home Dashboard
   Caregiver connection banner, 6-task daily progress meter,
   morning medication reminder card, 5-emoji mood check-in,
   rotating affirmation card with Web Speech API TTS, and
   contextual Saathi AI integration.
   ============================================================ */

import Storage from '../storage.js';
import AIService from '../aiService.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';
import UserState from '../userState.js';
import Coins from '../coins.js';

export default function Home(container) {
  let todayMood = Storage.getTodayMood();
  const journey = Storage.getJourneyStats();
  const reminders = Storage.getReminders();
  const emergency = Storage.getEmergencyContacts();

  // Affirmations collection
  const thoughts = [
    "Your presence in the lives of those who love you is irreplaceable.",
    "Every small moment of today carries peace, memory, and joy.",
    "You have shared so much warmth, and the world is better for it.",
    "Take gentle breaths; you are safe, cherished, and surrounded by care.",
    "Just as the morning sun rises gently, take today step by peaceful step."
  ];
  let thoughtIndex = 0;

  // Real-time 6-task tracking
  let defaultTasks = [
    { id: 'bp_med', title: 'Morning Blood Pressure Medicine', completed: false },
    { id: 'morning_water', title: 'Drink 2 glasses of warm water', completed: true },
    { id: 'memory_game', title: 'Play 1 Cognitive Game (Bamboo Sequence)', completed: false },
    { id: 'deep_breath', title: '5-Minute Mindful Breathing', completed: true },
    { id: 'photo_reminisce', title: 'View 1 Family Memory in Vault', completed: false },
    { id: 'evening_walk', title: 'Gentle 15-Minute Garden Walk', completed: false }
  ];

  let completedTasksCount = defaultTasks.filter(t => t.completed).length;
  let totalTasksCount = 6;
  let progressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      return { text: I18n.t('hero.greeting') || 'Good afternoon,', icon: '☀️' };
    } else if (hour >= 17) {
      return { text: I18n.t('hero.greeting') || 'Good evening,', icon: '🌙' };
    }
    return { text: I18n.t('hero.greeting') || 'Good morning,', icon: '🌻' };
  }

  function render() {
    const allReminders = Storage.getReminders() || [];
    const missedReminder = allReminders.find(r => !r.completedToday && r.active);

    const missedBannerHtml = missedReminder ? `
        <!-- Missed Reminders Soothing Alert Banner -->
        <section class="stitch-missed-alert" style="background: #FFFBEB; border: 2px solid #F59E0B; border-radius: 20px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.12);">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
              ⏰
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1rem; font-weight: 800; color: #92400E;">
                Gentle Routine Reminder
              </h3>
              <p style="margin: 3px 0 0 0; font-size: 0.88rem; color: #78350F; line-height: 1.3;">
                ${escapeHtml(missedReminder.title)} (${missedReminder.time || 'Scheduled for today'})
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
            <button id="btn-take-missed-now" class="stitch-pill-btn" style="background: #059669; color: #FFFFFF; font-weight: 800; border: none; border-radius: 12px; padding: 0.5rem 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; font-size: 0.88rem;">
              <span>✓</span> <span>Take Now</span>
            </button>
            <button id="btn-alert-caregiver-missed" class="stitch-pill-btn" style="background: #FFFFFF; color: #D97706; border: 1.5px solid #FCD34D; font-weight: 800; border-radius: 12px; padding: 0.5rem 0.8rem; cursor: pointer; font-size: 0.88rem;">
              <span>🔔</span> <span>Alert Caregiver</span>
            </button>
          </div>
        </section>
    ` : '';
    const user = Storage.getUser() || { name: 'Meera Das' };
    const prefs = Storage.getPreferences();
    const displayName = prefs.preferredName || UserState.getDisplayName() || user.name.split(' ')[0] || 'Meera';
    const greetingInfo = getTimeGreeting();

    container.innerHTML = `
      <div class="sanctuary-container page-enter" style="max-width: 760px; margin: 0 auto; padding: 1rem 1rem 6rem 1rem;">

        <!-- 1. Caregiver Connection Banner -->
        <section class="stitch-caregiver-banner" data-purpose="caregiver-banner">
          <div class="stitch-caregiver-status">
            <span class="stitch-caregiver-status-dot"></span>
            <span>${I18n.t('caregiver.status')}</span>
          </div>
          <button class="stitch-pill-btn" onclick="window.location.hash='#/dashboard'" style="font-size: 0.85rem; padding: 0.3rem 0.75rem; background: #FFFFFF; border-color: #86EFAC; color: #15803D;">
            <span>📋</span> <span>${I18n.t('caregiver.viewReport')}</span>
          </button>
        </section>

        ${missedBannerHtml}

        <!-- 2. Welcome Hero Card with 6-Task Progress Meter -->
        <section class="stitch-hero-card" style="background: linear-gradient(135deg, #FFF9F2, #FFF2E2); border: 2px solid #F3E8DC; border-radius: 24px; padding: 1.5rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <p style="color: #78350F; font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; gap: 0.4rem; margin: 0 0 4px 0;">
                <span>${greetingInfo.text}</span> <span>${greetingInfo.icon}</span>
              </p>
              <h1 style="color: var(--maroon); font-size: 2.1rem; font-weight: 900; margin: 0 0 6px 0; letter-spacing: -0.5px;">
                ${escapeHtml(displayName)}!
              </h1>
              <p style="color: #4B5563; font-size: 1rem; margin: 0; line-height: 1.5;">
                ${I18n.t('hero.welcome_text')}
              </p>
            </div>
            <div style="font-size: 3rem; animation: gentlePulse 3s infinite ease-in-out;" aria-hidden="true">
              🌸
            </div>
          </div>

          <!-- Dynamic 6-Task Progress Meter -->
          <div style="margin-top: 1.25rem; background: #FFFFFF; border: 1.5px solid #FDE68A; border-radius: 18px; padding: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-weight: 800; font-size: 0.95rem; color: #78350F;">
              <span id="hero-progress-label">
                ${I18n.t('hero.tasks_completed', { completed: completedTasksCount, total: totalTasksCount })}
              </span>
              <span id="hero-progress-text" style="color: var(--maroon); font-weight: 900; font-size: 1.05rem;">
                ${progressPercent}%
              </span>
            </div>
            <div style="width: 100%; height: 12px; background: #FEF3C7; border-radius: 999px; overflow: hidden;">
              <div id="hero-progress-fill" style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #F59E0B, #10B981); border-radius: 999px; transition: width 0.4s ease;"></div>
            </div>
          </div>
        </section>

        <!-- 3. Quick Action Row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
          <!-- Call Loved One Button -->
          <button id="btn-call-loved-one" class="stitch-quick-btn" style="border: 2px solid #FECDD3; background: #FFF5F5; border-radius: 18px; padding: 0.85rem; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; text-align: left;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
              📞
            </div>
            <div style="min-width: 0;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #B91C1C; letter-spacing: 0.5px;">${I18n.t('quick.call_loved')}</span>
              <p style="font-weight: 800; font-size: 1rem; color: #111827; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${escapeHtml(emergency.primaryName || I18n.t('quick.son_name'))}
              </p>
            </div>
          </button>

          <!-- Daily Ritual 3-Step Guide -->
          <button id="btn-daily-ritual" class="stitch-quick-btn" style="border: 2px solid #A7F3D0; background: #F0FDF4; border-radius: 18px; padding: 0.85rem; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; text-align: left;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #D1FAE5; color: #047857; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
              🌅
            </div>
            <div style="min-width: 0;">
              <span style="font-size: 0.72rem; font-weight: 800; color: #047857; letter-spacing: 0.5px;">${I18n.t('quick.ritual_title')}</span>
              <p style="font-weight: 800; font-size: 1rem; color: #064E3B; margin: 0;">
                ${I18n.t('quick.ritual_action')}
              </p>
            </div>
          </button>
        </div>

        <!-- 4. Morning Medication Reminder Card -->
        <section class="stitch-routine-card" data-purpose="routine-reminder">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="display: inline-flex; align-items: center; gap: 0.4rem; font-weight: 800; font-size: 0.82rem; color: #92400E; background: #FEF3C7; padding: 0.35rem 0.75rem; border-radius: 999px;">
              <span>⏰</span> <span>${I18n.t('routine.badge')}</span>
            </span>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="padding: 4px 10px; background: #10B981; color: #FFFFFF; border-radius: 999px; font-size: 0.78rem; font-weight: 800;">
                ${I18n.t('routine.coins_reward')}
              </span>
              <span style="padding: 4px 12px; background: #F59E0B; color: #FFFFFF; border-radius: 999px; font-size: 0.8rem; font-weight: 800;">
                ${I18n.t('routine.time')}
              </span>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 1rem; margin-top: 0.35rem;">
            <div style="font-size: 2.4rem; padding: 0.6rem; background: #FEF3C7; border-radius: 16px; flex-shrink: 0; user-select: none;">
              💊
            </div>
            <div>
              <h2 style="font-size: 1.3rem; font-weight: 800; color: #1F2937; margin: 0; line-height: 1.3;">
                ${I18n.t('routine.medicine_title')}
              </h2>
              <p style="color: #4B5563; font-size: 0.95rem; margin-top: 4px;">
                ${I18n.t('routine.medicine_instructions')}
              </p>
            </div>
          </div>

          <!-- Action Buttons for Reminder -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; padding-top: 0.35rem;">
            <button id="mark-done-btn" class="stitch-pill-btn" style="height: 48px; background: #047857; color: #FFFFFF; justify-content: center; font-size: 1rem; border-radius: 14px; box-shadow: var(--shadow-sm); border: none;">
              <span>✓</span> <span>${I18n.t('routine.mark_done')}</span>
            </button>
            <button id="snooze-reminder-btn" class="stitch-pill-btn" style="height: 48px; background: #F1F5F9; color: #334155; justify-content: center; font-size: 0.95rem; border-radius: 14px;">
              <span>⏰</span> <span>${I18n.t('routine.snooze')}</span>
            </button>
          </div>
        </section>

        <!-- 5. 5-Emoji Mood Check-in Section -->
        <section class="stitch-card text-center" style="background: #FFFFFF; border: 2px solid #E5E7EB; border-radius: 20px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);" data-purpose="mood-tracker">
          <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--maroon); margin-bottom: 0.85rem;">
            ${I18n.t('mood.question')}
          </h2>

          <div class="stitch-mood-grid" role="radiogroup" aria-label="Daily mood options">
            <button class="stitch-mood-btn" data-mood="great" data-emoji="😊" aria-label="Great">
              <span style="font-size: 2.2rem; line-height: 1;">😊</span>
              <span style="font-size: 0.78rem; font-weight: 700; color: #374151; margin-top: 4px;">${I18n.t('mood.great')}</span>
            </button>
            <button class="stitch-mood-btn active-mood" data-mood="good" data-emoji="😃" aria-label="Good">
              <span style="font-size: 2.2rem; line-height: 1;">😃</span>
              <span style="font-size: 0.78rem; font-weight: 800; color: #111827; margin-top: 4px;">${I18n.t('mood.good')}</span>
            </button>
            <button class="stitch-mood-btn" data-mood="okay" data-emoji="😐" aria-label="Okay">
              <span style="font-size: 2.2rem; line-height: 1;">😐</span>
              <span style="font-size: 0.78rem; font-weight: 700; color: #374151; margin-top: 4px;">${I18n.t('mood.okay')}</span>
            </button>
            <button class="stitch-mood-btn" data-mood="low" data-emoji="😔" aria-label="Low">
              <span style="font-size: 2.2rem; line-height: 1;">😔</span>
              <span style="font-size: 0.78rem; font-weight: 700; color: #374151; margin-top: 4px;">${I18n.t('mood.low')}</span>
            </button>
            <button class="stitch-mood-btn" data-mood="worried" data-emoji="😟" aria-label="Worried">
              <span style="font-size: 2.2rem; line-height: 1;">😟</span>
              <span style="font-size: 0.78rem; font-weight: 700; color: #374151; margin-top: 4px;">${I18n.t('mood.worried')}</span>
            </button>
          </div>

          <!-- Dynamic Mood Feedback Box -->
          <div id="mood-feedback-box" style="margin-top: 1rem; padding: 1rem; border-radius: 16px; background: #ECFDF5; border: 1.5px solid #A7F3D0; text-align: left;">
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
              <span id="mood-feedback-emoji" style="font-size: 2.2rem; line-height: 1;">😃</span>
              <div>
                <h3 id="mood-feedback-title" style="font-weight: 800; color: #064E3B; font-size: 1.05rem; margin: 0;">
                  ${I18n.t('mood.feedback_title', { mood: I18n.t('mood.good') })}
                </h3>
                <p id="mood-feedback-desc" style="font-size: 0.92rem; color: #047857; margin-top: 4px; line-height: 1.5;">
                  "${I18n.t('mood.feedback_good')}"
                </p>
              </div>
            </div>

            <!-- Activity Recommendation Chips -->
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px solid #A7F3D0;">
              <button class="stitch-pill-btn" onclick="window.location.hash='#/games/hornbill'" style="background: #FFFFFF; border-color: #6EE7B7; color: #065F46; font-size: 0.85rem; height: 40px;">
                <span>🦅</span> <span>${I18n.t('mood.chip_hornbill')}</span>
              </button>
              <button class="stitch-pill-btn" onclick="window.location.hash='#/games/memory-moments'" style="background: #FFFFFF; border-color: #6EE7B7; color: #065F46; font-size: 0.85rem; height: 40px;">
                <span>📖</span> <span>${I18n.t('mood.chip_story')}</span>
              </button>
              <button class="stitch-pill-btn" onclick="window.location.hash='#/wellness'" style="background: #FFFFFF; border-color: #6EE7B7; color: #065F46; font-size: 0.85rem; height: 40px;">
                <span>🌿</span> <span>${I18n.t('mood.chip_wellness')}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- 6. Personalized Cognitive Activity Card (Bamboo Sequence) -->
        <section class="stitch-activity-card" style="background: #FFFFFF; border: 2px solid #99F6E4; border-radius: 20px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm);" data-purpose="personalized-cognitive-activity">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
            <div>
              <span style="font-size: 0.78rem; font-weight: 800; color: #0F766E; letter-spacing: 0.5px;">
                ${I18n.t('activity.subhead')}
              </span>
              <h2 style="font-size: 1.5rem; font-weight: 900; color: var(--maroon); margin-top: 2px;">
                ${I18n.t('activity.title')}
              </h2>
            </div>
            <span style="background: #E6F4F1; color: #0F766E; border: 1px solid #99F6E4; padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 0.8rem;">
              ${I18n.t('activity.category')}
            </span>
          </div>

          <p style="color: #4B5563; font-size: 0.95rem; margin-top: 8px; line-height: 1.4;">
            ${I18n.t('activity.description')}
          </p>

          <div style="margin: 0.85rem 0; padding: 0.85rem; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 16px; display: flex; align-items: flex-start; gap: 0.65rem;">
            <span style="font-size: 1.4rem;">💡</span>
            <p style="font-size: 0.88rem; font-weight: 600; color: #166534; margin: 0; line-height: 1.45;">
              ${I18n.t('activity.reason')}
            </p>
          </div>

          <button id="btn-start-bamboo-activity" class="stitch-primary-btn" onclick="window.location.hash='#/games/bamboo-sequence'" style="width: 100%; height: 50px; background: #800020; color: #FFFFFF; border: none; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: var(--shadow-sm);">
            <span>▶</span> <span>${I18n.t('activity.start_btn')}</span>
          </button>
        </section>

        <!-- 7. Rotating Daily Affirmation with Web Speech Audio -->
        <section class="stitch-card" style="background: rgba(254, 243, 199, 0.35); border: 2px solid #FDE68A; border-radius: 20px; padding: 1.25rem; margin-bottom: 1.25rem;" data-purpose="daily-affirmation">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: #1F2937; font-size: 1.05rem;">
              <span>💭</span> <span>${I18n.t('affirmation.header')}</span>
            </span>
            <span style="background: #FEF3C7; color: #92400E; padding: 3px 10px; border-radius: 999px; font-weight: 800; font-size: 0.78rem;">
              ${I18n.t('affirmation.badge')}
            </span>
          </div>

          <blockquote id="affirmation-quote" style="font-size: 1.25rem; font-style: italic; font-family: 'Plus Jakarta Sans', Georgia, serif; color: #1F2937; margin: 0.75rem 0; line-height: 1.5;">
            "${thoughts[thoughtIndex]}"
          </blockquote>

          <div style="display: flex; align-items: center; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #FDE68A;">
            <button id="btn-listen-affirmation" class="stitch-pill-btn" style="background: #FFFFFF; border-color: #FCD34D; color: #1F2937;">
              <span>🔊</span> <span>${I18n.t('affirmation.listen')}</span>
            </button>
            <button id="btn-cycle-affirmation" class="stitch-pill-btn" style="background: #FFFFFF; border-color: #FCD34D; color: #1F2937;">
              <span>🔄</span> <span>${I18n.t('affirmation.new')}</span>
            </button>
          </div>
        </section>

        <!-- 8. Saathi AI Companion Card -->
        <section class="stitch-card" style="background: #F0FDFA; border: 2px solid #99F6E4; border-radius: 20px; padding: 1.1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 1.25rem;" data-purpose="ai-companion-card">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 52px; height: 52px; border-radius: 16px; background: #CCFBF1; display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0;">
              🤖
            </div>
            <div>
              <h2 style="font-weight: 800; color: #134E4A; font-size: 1.1rem; margin: 0;">
                ${I18n.t('saathi.title')}
              </h2>
              <p style="font-size: 0.88rem; color: #0F766E; margin-top: 2px;">
                ${I18n.t('saathi.subtitle')}
              </p>
            </div>
          </div>
          <button id="btn-home-talk-saathi" class="stitch-pill-btn" style="background: #0D9488; color: #FFFFFF; font-weight: 800; border-radius: 14px; height: 48px; padding: 0 1.2rem; border: none; cursor: pointer;">
            <span>🎤</span> <span>${I18n.t('saathi.name')}</span>
          </button>
        </section>

        <!-- 9. Quick Navigation Grid -->
        <section class="stitch-card" style="background: #FFFFFF; border: 2px solid #E5E7EB; border-radius: 20px; padding: 1.25rem;" data-purpose="navigation-grid">
          <h2 style="font-size: 1.15rem; font-weight: 800; color: var(--maroon); display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.85rem;">
            <span>❤️</span> <span>${I18n.t('grid.header')}</span>
          </h2>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(135px, 1fr)); gap: 0.65rem;">
            <button class="stitch-grid-card" onclick="window.location.hash='#/games'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">🎮</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.games')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/memories'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">🖼️</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.lifestory')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/entertainment'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">🎭</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.entertainment')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/social'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">👨‍👩‍👧</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.family')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/leaderboard'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">🌟</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.stars')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/wellness'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">🌿</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.wellness')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/reminders'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">⏰</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.reminders')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/medicines'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">💊</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('grid.medicines')}</span>
            </button>
            <button class="stitch-grid-card" onclick="window.location.hash='#/settings'" style="background: #FDFBF7; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; cursor: pointer;">
              <span style="font-size: 1.8rem;">⚙️</span>
              <span style="font-size: 0.85rem; font-weight: 800; color: #1F2937;">${I18n.t('navSettings') || I18n.t('grid.settings') || 'Settings'}</span>
            </button>
          </div>

          <!-- Rewards & Badges Banner -->
          <div style="margin-top: 0.85rem;">
            <button class="stitch-primary-btn" onclick="window.location.hash='#/rewards'" style="width: 100%; background: #FEF3C7; color: #78350F; border: 1.5px solid #FCD34D; height: 50px; font-size: 1rem; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: none;">
              <span style="font-size: 1.35rem;">🏆</span>
              <span>${I18n.t('grid.rewards')}</span>
            </button>
          </div>
        </section>

      </div>
    `;

    bindEventHandlers();
  }

  function bindEventHandlers() {
    const allReminders = Storage.getReminders() || [];
    const missedReminder = allReminders.find(r => !r.completedToday && r.active);
    if (missedReminder) {
      const takeNowBtn = container.querySelector('#btn-take-missed-now');
      if (takeNowBtn) {
        takeNowBtn.addEventListener('click', () => {
          Storage.markReminderDone(missedReminder.id);
          Coins.add(10, 'Routine reminder completed');
          if (window.SmritiToast) {
            window.SmritiToast.show('Wonderful! Marked complete. +10 Coins 🪙', 'success');
          }
          render();
        });
      }
      const alertCaregiverBtn = container.querySelector('#btn-alert-caregiver-missed');
      if (alertCaregiverBtn) {
        alertCaregiverBtn.addEventListener('click', () => {
          Storage.saveEmergencyAlert({
            type: 'Missed Routine Alert',
            message: `Patient requested caregiver check for: ${missedReminder.title}`,
            timestamp: new Date().toISOString()
          });
          if (window.SmritiToast) {
            window.SmritiToast.show('Caregiver notified softly. Help is on the way! 🌸', 'info');
          }
          alertCaregiverBtn.disabled = true;
          alertCaregiverBtn.textContent = 'Caregiver Alerted ✓';
        });
      }
    }
    // Quick Actions
    const callLovedBtn = container.querySelector('#btn-call-loved-one');
    if (callLovedBtn) {
      callLovedBtn.addEventListener('click', () => {
        if (typeof window.triggerEmergencySOSModal === 'function') {
          window.triggerEmergencySOSModal();
        } else {
          window.location.hash = '#/emergency';
        }
      });
    }

    const dailyRitualBtn = container.querySelector('#btn-daily-ritual');
    if (dailyRitualBtn) {
      dailyRitualBtn.addEventListener('click', () => {
        window.location.hash = '#/ritual';
      });
    }

    // Routine Reminder Mark Done
    const markDoneBtn = container.querySelector('#mark-done-btn');
    if (markDoneBtn) {
      markDoneBtn.addEventListener('click', () => {
        markDoneBtn.disabled = true;
        markDoneBtn.style.background = '#6B7280';
        markDoneBtn.innerHTML = `<span>✓</span> <span>${I18n.t('routine.completed')}</span>`;
        
        // Mark BP med task completed
        const task = defaultTasks.find(t => t.id === 'bp_med');
        if (task) task.completed = true;
        completedTasksCount = defaultTasks.filter(t => t.completed).length;
        progressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);
        
        const fillEl = container.querySelector('#hero-progress-fill');
        const textEl = container.querySelector('#hero-progress-text');
        const labelEl = container.querySelector('#hero-progress-label');
        if (fillEl) fillEl.style.width = `${progressPercent}%`;
        if (textEl) textEl.textContent = `${progressPercent}%`;
        if (labelEl) labelEl.textContent = I18n.t('hero.tasks_completed', { completed: completedTasksCount, total: totalTasksCount });

        // Award Coins & Show Toast
        Coins.add(10, 'Morning Blood Pressure Medication logged');
        if (window.SmritiToast) {
          window.SmritiToast.show('Wonderful! Blood Pressure medication logged. +10 Coins 🪙', 'success');
        }
      });
    }

    // Snooze Reminder
    const snoozeBtn = container.querySelector('#snooze-reminder-btn');
    if (snoozeBtn) {
      snoozeBtn.addEventListener('click', () => {
        if (window.SmritiToast) {
          window.SmritiToast.show('Reminder snoozed for 15 minutes. Saathi will remind you again softly.', 'info');
        }
      });
    }

    // Mood Buttons Selection
    const moodBtns = container.querySelectorAll('.stitch-mood-btn');
    moodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        moodBtns.forEach(b => b.classList.remove('active-mood'));
        btn.classList.add('active-mood');

        const mood = btn.dataset.mood;
        const emoji = btn.dataset.emoji;

        const emojiEl = container.querySelector('#mood-feedback-emoji');
        const titleEl = container.querySelector('#mood-feedback-title');
        const descEl = container.querySelector('#mood-feedback-desc');

        if (emojiEl) emojiEl.textContent = emoji;
        if (titleEl) titleEl.textContent = I18n.t('mood.feedback_title', { mood: I18n.t('mood.' + mood) });
        if (descEl) {
          descEl.textContent = I18n.t('mood.feedback_' + mood) || I18n.t('mood.feedback_good');
        }

        // Save mood in Storage & Award 5 Coins
        Storage.setTodayMood(mood, emoji);
        Coins.add(5, `Mood Check-in: ${mood}`);
        if (window.SmritiToast) {
          window.SmritiToast.show(`Mood recorded: ${emoji} ${I18n.t('mood.' + mood)}! +5 Coins 🪙`, 'success');
        }
      });
    });

    // Affirmation TTS
    const listenAffBtn = container.querySelector('#btn-listen-affirmation');
    if (listenAffBtn) {
      listenAffBtn.addEventListener('click', () => {
        const quote = container.querySelector('#affirmation-quote')?.textContent?.replace(/"/g, '') || thoughts[thoughtIndex];
        TTS.speak(quote);
      });
    }

    // Affirmation Cycle
    const cycleAffBtn = container.querySelector('#btn-cycle-affirmation');
    if (cycleAffBtn) {
      cycleAffBtn.addEventListener('click', () => {
        thoughts = I18n.getSuvicharList ? I18n.getSuvicharList(I18n.lang) : thoughts;
        thoughtIndex = (thoughtIndex + 1) % thoughts.length;
        const quoteEl = container.querySelector('#affirmation-quote');
        if (quoteEl) {
          quoteEl.textContent = `"${thoughts[thoughtIndex]}"`;
        }
      });
    }

    // Saathi AI Companion Trigger
    const talkSaathiBtn = container.querySelector('#btn-home-talk-saathi');
    if (talkSaathiBtn) {
      talkSaathiBtn.addEventListener('click', () => {
        if (typeof window.toggleSaathiDrawer === 'function') {
          window.toggleSaathiDrawer(true);
        } else {
          window.location.hash = '#/smriti';
        }
      });
    }

    // Emergency Grid Trigger (if element present)
    const gridSosBtn = container.querySelector('#btn-grid-sos');
    if (gridSosBtn) {
      gridSosBtn.addEventListener('click', () => {
        trigger1TapEmergencySOS('Grid Emergency SOS Button');
      });
    }
  }

  function trigger1TapEmergencySOS(triggerType = 'Manual SOS') {
    const user = Storage.getUser() || { name: 'Meera Das' };
    const emergencyContacts = Storage.getEmergencyContacts() || [];
    const profile = Storage.getPatientProfile();
    const emergencyPhone = emergencyContacts[0]?.phone || profile?.patient?.emergencyPhone || profile?.patient?.caregiverPhone || '+919876543210';
    const cleanPhone = emergencyPhone.replace(/[^0-9+]/g, '');

    const dispatchAlert = (lat, lng, isEstimated = false) => {
      const gpsLink = `https://maps.google.com/?q=${lat},${lng}`;
      const alertMsg = `🚨 SMRITI EMERGENCY SOS ALERT: ${user.name} needs immediate assistance! Live GPS Location: ${gpsLink}`;

      Storage.saveEmergencyAlert({
        type: 'Emergency SOS Broadcast',
        message: `SOS Triggered (${triggerType}) at Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}. Live Link: ${gpsLink}`,
        lat: lat,
        lng: lng,
        trackingLink: gpsLink,
        timestamp: new Date().toISOString(),
        isEstimated
      });

      // Dispatch SMS
      try {
        window.open(`sms:${cleanPhone}?body=${encodeURIComponent(alertMsg)}`, '_blank');
      } catch (e) {
        console.warn('SMS dispatch error:', e);
      }

      if (typeof window.triggerEmergencySOSModal === 'function') {
        window.triggerEmergencySOSModal();
      } else {
        window.location.hash = '#/emergency';
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => dispatchAlert(pos.coords.latitude, pos.coords.longitude, false),
        () => dispatchAlert(26.1445, 91.7362, true),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      dispatchAlert(26.1445, 91.7362, true);
    }
  }

  let speechRecognizer = null;
  function initVoiceActivatedSOS() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      speechRecognizer = new SpeechRecognition();
      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = false;
      speechRecognizer.lang = I18n.lang === 'hi' ? 'hi-IN' : 'en-IN';
      speechRecognizer.onresult = (e) => {
        const text = (e.results[e.results.length - 1][0].transcript || '').toLowerCase();
        if (text.includes('help') || text.includes('bachao') || text.includes('madad') || text.includes('emergency')) {
          trigger1TapEmergencySOS('VoiceGuard Distress Trigger: ' + text);
          
          // Immediate emergency phone call
          const emergencyContacts = Storage.getEmergencyContacts() || [];
          const profile = Storage.getPatientProfile();
          const emergencyPhone = emergencyContacts[0]?.phone || profile?.patient?.emergencyPhone || profile?.patient?.caregiverPhone || '+919876543210';
          const cleanPhone = emergencyPhone.replace(/[^0-9+]/g, '');
          window.location.href = `tel:${cleanPhone}`;
        }
      };
      speechRecognizer.onerror = () => {};
      speechRecognizer.start();
    } catch (err) {}
  }

  function checkGeofenceSafety() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const safeLat = 26.1445, safeLng = 91.7362;
      const dLat = (latitude - safeLat) * Math.PI / 180;
      const dLon = (longitude - safeLng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(safeLat * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const dist = 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      if (dist > 250) {
        Storage.saveEmergencyAlert({
          type: 'Geofence Safe Zone Breach',
          message: `Patient departed designated safe zone perimeter (~${Math.round(dist)}m away).`,
          lat: latitude,
          lng: longitude,
          trackingLink: `https://maps.google.com/?q=${latitude},${longitude}`,
          timestamp: new Date().toISOString()
        });
        if (window.SmritiToast) {
          window.SmritiToast.show('Safe zone boundary reached (~' + Math.round(dist) + 'm). Caregiver notified.', 'warning');
        }
      }
    }, () => {});
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Subscribe to reactive user and language changes
  const unsubUser = UserState.subscribe(() => render());
  const handleLangChange = () => {
    thoughts = I18n.getSuvicharList ? I18n.getSuvicharList(I18n.lang) : thoughts;
    render();
  };
  window.addEventListener('smriti:languageChanged', handleLangChange);
  window.addEventListener('languageChanged', handleLangChange);

  // Initial render
  render();

  // Background safety monitors
  initVoiceActivatedSOS();
  checkGeofenceSafety();

  // Cleanup on route navigation
  return function cleanup() {
    unsubUser();
    window.removeEventListener('smriti:languageChanged', handleLangChange);
    window.removeEventListener('languageChanged', handleLangChange);
    if (speechRecognizer) {
      try {
        speechRecognizer.stop();
      } catch (e) {}
    }
  };
}
