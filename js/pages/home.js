/* ============================================================
   SMRITI — Modernized Wellness & Memory Home Page
   Warm, consumer-friendly daily companion hub
   ============================================================ */

import Storage from '../storage.js';
import AIService from '../aiService.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';

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

  function getMoodAdaptive(moodKey) {
    const lang = I18n.lang;
    if (moodKey === 'low' || moodKey === 'worried') {
      let text = "I see you’re feeling a bit low or worried today. Would you like a gentle breathing exercise or a peaceful memory game to bring calm and warmth?";
      let bLabel = '🫁 Calming Breathing';
      let gLabel = '🦅 Gentle Memory Game';
      let sLabel = '🤖 Talk to Smriti';
      if (lang === 'hi') {
        text = "हम समझते हैं कि आज आप थोड़ा उदास महसूस कर रहे हैं। क्या आप एक शांत श्वास व्यायाम या सुखद स्मृति खेल खेलना चाहेंगे?";
        bLabel = '🫁 शांतिदायक सांस';
        gLabel = '🦅 शांत स्मृति खेल';
        sLabel = '🤖 स्मृति से बात करें';
      } else if (lang === 'bn') {
        text = "আমরা বুঝতে পারছি আজ আপনার মন কিছুটা ভারী। আপনি কি একটু গভীর নিঃশ্বাস নেওয়ার শান্ত অনুশীলন বা মধুর স্মৃতি খেলা খেলতে চান?";
        bLabel = '🫁 শান্ত শ্বাস ব্যায়াম';
        gLabel = '🦅 মধুর স্মৃতি খেলা';
        sLabel = '🤖 স্মৃতির সাথে কথা বলুন';
      }
      return {
        text,
        bg: '#FFF7ED',
        border: '#FED7AA',
        color: '#9A3412',
        actions: [
          { label: bLabel, route: '#/wellness' },
          { label: gLabel, route: '#/games/hornbill' },
          { label: sLabel, route: '#/smriti' }
        ]
      };
    } else if (moodKey === 'great' || moodKey === 'good') {
      let text = "Wonderful! Let’s keep this positive, vibrant energy going with today’s mindful activity.";
      let aLabel = '▶ Start Today’s Game';
      let sLabel = '📖 Story Recall Game';
      if (lang === 'hi') {
        text = "अद्भुत! इस सकारात्मक और ऊर्जावान मन के साथ आज की मानसिक गतिविधि शुरू करें।";
        aLabel = '▶ आज का खेल शुरू करें';
        sLabel = '📖 कहानी स्मरण खेल';
      } else if (lang === 'bn') {
        text = "চমৎকার! এই সুন্দর মনোভাব নিয়ে চলুন আজকের আনন্দের মনচর্চা খেলা শুরু করি।";
        aLabel = '▶ আজকের খেলা শুরু করুন';
        sLabel = '📖 গল্পের স্মৃতি খেলা';
      }
      return {
        text,
        bg: '#F0FDF4',
        border: '#BBF7D0',
        color: '#166534',
        actions: [
          { label: aLabel, route: recommendedGame.route },
          { label: sLabel, route: '#/games/memory-moments' }
        ]
      };
    } else { // 'okay'
      let text = "Steady and peaceful. A gentle brain exercise or browsing fond family memories can bring a pleasant spark to your day.";
      let aLabel = '▶ Start Mindful Activity';
      let mLabel = '🖼️ Life Story & Memories';
      if (lang === 'hi') {
        text = "शांत और संतुलित। एक हल्का दिमागी अभ्यास या पारिवारिक यादें देखना आपके दिन में आनंद लाएगा।";
        aLabel = '▶ मन की गतिविधि शुरू करें';
        mLabel = '🖼️ जीवन की यादें';
      } else if (lang === 'bn') {
        text = "শান্ত ও প্রফুল্ল। একটি সুন্দর মনচর্চা বা পরিবারের সোনালী স্মৃতি দেখা আপনার দিনটি সুন্দর করবে।";
        aLabel = '▶ মনচর্চা শুরু করুন';
        mLabel = '🖼️ জীবনের মধুর স্মৃতি';
      }
      return {
        text,
        bg: '#F0FDFA',
        border: '#99F6E4',
        color: '#0F766E',
        actions: [
          { label: aLabel, route: recommendedGame.route },
          { label: mLabel, route: '#/memories' }
        ]
      };
    }
  }

  function render() {
    const user = Storage.getUser() || { name: 'Friend' };
    const prefs = Storage.getPreferences();
    const displayName = prefs.preferredName || user.name.split(' ')[0] || user.name || 'Friend';

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

    const recommended = AIService.recommendActivity(todayMood?.mood);
    const adaptive = todayMood ? getMoodAdaptive(todayMood.mood) : null;
    const reminders = Storage.getReminders();
    const activeReminders = reminders.filter(r => r.active && !r.completedToday);
    const lang = I18n.lang;
    let welcomeSub = "Welcome to your daily memory and wellness sanctuary.";
    let callLovedOne = "Call Loved One";
    let dailyRitualLabel = "Daily Ritual";
    let ritualStep = "3-Step Guide ➔";
    let howFeel = "How are you feeling today?";
    let checkDoneLabel = "✅ Mark Done";
    let snoozeLabel = "⏰ Remind in 10 mins";

    if (lang === 'hi') {
      welcomeSub = "आपके दैनिक स्मृति और मानसिक स्वास्थ्य साथी में आपका स्वागत है।";
      callLovedOne = "प्रियजन को कॉल करें";
      dailyRitualLabel = "दैनिक नियम";
      ritualStep = "३-चरणीय अभ्यास ➔";
      howFeel = "आज आप कैसा महसूस कर रहे हैं?";
      checkDoneLabel = "✅ पूरा हुआ";
      snoozeLabel = "⏰ 10 मिनट बाद याद दिलाएं";
    } else if (lang === 'bn') {
      welcomeSub = "আপনার স্মৃতি ও মনের যত্নের ভালোবাসার ঠিকানায় স্বাগতম।";
      callLovedOne = "প্রিয়জনকে ফোন করুন";
      dailyRitualLabel = "দৈনিক নিয়ম";
      ritualStep = "৩-ধাপের গাইড ➔";
      howFeel = "আজ আপনার মন কেমন আছে?";
      checkDoneLabel = "✅ সম্পন্ন হয়েছে";
      snoozeLabel = "⏰ ১০ মিনিট পর মনে করান";
    }

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
                ${welcomeSub}
              </p>
            </div>
            <div style="font-size: 3.5rem; animation: floatSlow 3s ease-in-out infinite;">
              🌸
            </div>
          </div>
        </div>

        <!-- Quick Family Call & Daily Ritual Action Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
          <!-- 📞 One-Tap Family Call Card -->
          <div id="btn-home-quick-call" class="card card-elevated" style="padding: 1rem 1.1rem; border-radius: 16px; background: #FEF2F2; border: 2px solid #FECACA; cursor: pointer; display: flex; align-items: center; gap: 0.85rem;">
            <div style="font-size: 2rem; background: #FEE2E2; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              📞
            </div>
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #DC2626; text-transform: uppercase;">${callLovedOne}</div>
              <div style="font-weight: 700; color: var(--maroon); font-size: 1.05rem;">${Storage.getEmergencyContacts().primaryName}</div>
            </div>
          </div>

          <!-- 🌅 Daily Ritual 3-Step Mode -->
          <div onclick="window.location.hash='#/ritual'" class="card card-elevated" style="padding: 1rem 1.1rem; border-radius: 16px; background: #F0FDF4; border: 2px solid #BBF7D0; cursor: pointer; display: flex; align-items: center; gap: 0.85rem;">
            <div style="font-size: 2rem; background: #DCFCE7; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              🌅
            </div>
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #16A34A; text-transform: uppercase;">${dailyRitualLabel}</div>
              <div style="font-weight: 700; color: #14532D; font-size: 1.05rem;">${ritualStep}</div>
            </div>
          </div>
        </div>

        <!-- Gentle Reminder Banner (If pending) -->
        ${nextReminder ? `
          <div class="card card-elevated mb-md" style="padding: 1.25rem 1.4rem; border-radius: 16px; border-left: 6px solid #D97706; background: #FFFBEB;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-size: 0.85rem; font-weight: 700; color: #B45309; text-transform: uppercase; letter-spacing: 0.5px;">⏰ Next Gentle Reminder</span>
              <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/reminders'" style="color: #B45309; font-size: 0.95rem; font-weight: 600; padding: 0;">View All Reminders ➔</button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1rem;">
              <div style="font-size: 2.2rem; background: #FEF3C7; width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${nextReminder.icon || '⏰'}
              </div>
              <div>
                <h4 style="margin: 0; color: var(--maroon); font-size: 1.2rem;">${nextReminder.title}</h4>
                <p style="margin: 0.2rem 0 0 0; color: var(--gray-700); font-size: 0.95rem;">
                  ${nextReminder.notes} • <strong style="color: #B45309;">${nextReminder.time} (${nextReminder.period})</strong>
                </p>
              </div>
            </div>

            <!-- Very Easy To Tap Action Buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <button class="btn btn-secondary btn-home-rem-done" data-id="${nextReminder.id}" style="min-height: 52px; font-size: 1.05rem; font-weight: 700; background: #059669; justify-content: center;">
                ✅ Mark Done
              </button>
              <button class="btn btn-outline btn-home-rem-snooze" data-id="${nextReminder.id}" style="min-height: 52px; font-size: 1.05rem; font-weight: 700; border-color: #D97706; color: #B45309; background: #FFFFFF; justify-content: center;">
                ⏰ Remind in 10 mins
              </button>
            </div>
          </div>
        ` : ''}

        <!-- 1. Daily Mood Section with Meaningful Adaptive Responses -->
        <div class="card card-elevated mb-md" style="padding: 1.25rem 1.5rem; border-radius: 16px;">
          <h3 style="color: var(--maroon); font-size: 1.2rem; margin-bottom: 0.75rem; text-align: center;">
            ${howFeel}
          </h3>

          <div class="mood-selector-grid" style="display: flex; justify-content: space-around; gap: 0.5rem; margin-bottom: 0.5rem;">
            <button class="mood-btn ${todayMood?.mood === 'great' ? 'active' : ''}" data-mood="great" data-emoji="😊" data-label="${lang === 'hi' ? 'बहुत अच्छा' : (lang === 'bn' ? 'দারুণ' : 'Great')}">
              <span class="mood-emoji">😊</span>
              <span class="mood-label">${lang === 'hi' ? 'बहुत अच्छा' : (lang === 'bn' ? 'দারুণ' : 'Great')}</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'good' ? 'active' : ''}" data-mood="good" data-emoji="🙂" data-label="${lang === 'hi' ? 'अच्छा' : (lang === 'bn' ? 'ভালো' : 'Good')}">
              <span class="mood-emoji">🙂</span>
              <span class="mood-label">${lang === 'hi' ? 'अच्छा' : (lang === 'bn' ? 'ভালো' : 'Good')}</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'okay' ? 'active' : ''}" data-mood="okay" data-emoji="😐" data-label="${lang === 'hi' ? 'सामान्य' : (lang === 'bn' ? 'মোটামুটি' : 'Okay')}">
              <span class="mood-emoji">😐</span>
              <span class="mood-label">${lang === 'hi' ? 'सामान्य' : (lang === 'bn' ? 'মোটামুটি' : 'Okay')}</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'low' ? 'active' : ''}" data-mood="low" data-emoji="😔" data-label="${lang === 'hi' ? 'उदास' : (lang === 'bn' ? 'মন খারাপ' : 'Low')}">
              <span class="mood-emoji">😔</span>
              <span class="mood-label">${lang === 'hi' ? 'उदास' : (lang === 'bn' ? 'মন খারাপ' : 'Low')}</span>
            </button>
            <button class="mood-btn ${todayMood?.mood === 'worried' ? 'active' : ''}" data-mood="worried" data-emoji="😟" data-label="${lang === 'hi' ? 'चिंतित' : (lang === 'bn' ? 'চিন্তিত' : 'Worried')}">
              <span class="mood-emoji">😟</span>
              <span class="mood-label">${lang === 'hi' ? 'चिंतित' : (lang === 'bn' ? 'চিন্তিত' : 'Worried')}</span>
            </button>
          </div>

          <!-- Meaningful Adaptive Response Card (Max 3 buttons) -->
          ${adaptive ? `
            <div class="mood-adaptive-card" style="background: ${adaptive.bg}; border: 2px solid ${adaptive.border}; border-radius: 14px; padding: 1rem 1.15rem; margin-top: 0.85rem;">
              <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <div style="font-size: 2.2rem; line-height: 1;">${todayMood.emoji}</div>
                <div style="flex: 1;">
                  <div style="font-weight: 700; color: ${adaptive.color}; font-size: 1.05rem; margin-bottom: 0.2rem;">
                    Checked in as ${todayMood.label}
                  </div>
                  <p style="color: ${adaptive.color}; margin: 0 0 0.75rem 0; font-size: 1rem; line-height: 1.45;">
                    “${adaptive.text}”
                  </p>
                  <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                    ${adaptive.actions.map(act => `
                      <button class="btn btn-sm btn-mood-action" data-route="${act.route}" style="background: white; border: 1.5px solid ${adaptive.border}; color: ${adaptive.color}; font-weight: 700; border-radius: 8px; padding: 0.45rem 0.85rem; font-size: 0.95rem; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.06);">
                        ${act.label}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 2. Today's Personalized Activity Recommendation -->
        <div class="card card-elevated mb-md" style="padding: 1.5rem; border-radius: 16px; border-left: 6px solid var(--teal); background: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.8rem;">🎯</span>
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 0.5px;">
                  Today's Personalized Activity
                </div>
                <h3 style="color: var(--maroon); margin: 0; font-size: 1.25rem;">
                  ${recommended.name}
                </h3>
              </div>
            </div>
            <span class="card-tag" style="background: #E6F4F1; color: var(--teal-dark);">
              ${recommended.tag}
            </span>
          </div>

          <p class="text-muted" style="margin: 0.4rem 0 0.6rem 0; font-size: 0.95rem;">
            ${recommended.desc}
          </p>

          <!-- Dynamic Personalized Reason -->
          ${recommended.reason ? `
            <div style="background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 10px; padding: 0.55rem 0.85rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.92rem; color: #166534; font-weight: 600;">
              <span style="font-size: 1.15rem;">💡</span>
              <span>${recommended.reason}</span>
            </div>
          ` : ''}

          <button id="btn-start-activity" data-route="${recommended.route}" class="btn btn-primary btn-block" style="min-height: 52px; font-size: 1.15rem;">
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
          <button id="btn-talk-smriti-teaser" class="btn btn-secondary btn-sm" style="white-space: nowrap; padding: 0.6rem 1.1rem;">
            🎤 Talk
          </button>
        </div>

        <!-- 5. My Journey Widget -->
        <div id="widget-journey-home" class="card card-elevated mb-md" style="padding: 1.25rem 1.5rem; border-radius: 16px; cursor: pointer;">
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
            ❤️ ${lang === 'hi' ? 'त्वरित नेविगेशन' : (lang === 'bn' ? 'দ্রুত মেনু' : 'Quick Navigation')}
          </h3>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center;">
            <div class="card card-game home-nav-card" data-route="#/games" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🎮</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--maroon);">${lang === 'hi' ? 'खेल' : (lang === 'bn' ? 'খেলাধুলো' : 'Games Hub')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/memories" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🖼️</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #B45309;">${lang === 'hi' ? 'जीवन की यादें' : (lang === 'bn' ? 'স্মৃতিমালা' : 'Life Story')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/wellness" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🌿</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #065F46;">${lang === 'hi' ? 'स्वास्थ्य' : (lang === 'bn' ? 'সুস্থতা' : 'Wellness')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/improvement" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">📈</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--teal-dark);">${lang === 'hi' ? 'प्रगति' : (lang === 'bn' ? 'অগ্রগতি' : 'Progress')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/medicines" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">💊</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #1E40AF;">${lang === 'hi' ? 'दवाइयाँ' : (lang === 'bn' ? 'ওষুধ' : 'Medicines')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/emergency" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🛟</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #DC2626;">${lang === 'hi' ? 'आपातकाल' : (lang === 'bn' ? 'জরুরি সাহায্য' : 'Emergency')}</div>
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

        // Spoken voice comforting response on mood selection
        const lang = I18n.lang;
        const curUser = Storage.getUser();
        const curPrefs = Storage.getPreferences();
        const curName = curPrefs.preferredName || (curUser ? curUser.name.split(' ')[0] : 'Friend');

        let spokenMessage = '';
        if (mood === 'low' || mood === 'worried') {
          if (lang === 'hi') {
            spokenMessage = `मैं समझ सकता हूँ कि आप थोड़ा उदास महसूस कर रहे हैं, ${curName}। क्या आप एक आरामदायक सांस का व्यायाम करना चाहेंगे?`;
          } else if (lang === 'bn') {
            spokenMessage = `আমি বুঝতে পারছি আজ আপনার মন কিছুটা খারাপ, ${curName}। আপনি কি একটু গভীর শ্বাস নেওয়ার শান্ত অনুশীলন করতে চান?`;
          } else {
            spokenMessage = `I see you’re feeling a bit low today, ${curName}. Would you like a gentle breathing exercise?`;
          }
        } else if (mood === 'great' || mood === 'good') {
          if (lang === 'hi') {
            spokenMessage = `बहुत बढ़िया ${curName}! यह जानकर बहुत खुशी हुई। आइए आज का मनपसंद खेल खेलें।`;
          } else if (lang === 'bn') {
            spokenMessage = `অসাধারণ ${curName}! জেনে খুব আনন্দ হলো। চলুন আজকের মনচর্চা শুরু করি।`;
          } else {
            spokenMessage = `Wonderful ${curName}! So glad you are feeling good today. Let's enjoy today's mindful activity.`;
          }
        } else { // okay
          if (lang === 'hi') {
            spokenMessage = `नमस्ते ${curName}। एक शांत और सुखद दिन के लिए हम हमेशा आपके साथ हैं।`;
          } else if (lang === 'bn') {
            spokenMessage = `নমস্কার ${curName}। একটি শান্ত ও সুন্দর দিনের জন্য আমরা আপনার সাথেই আছি।`;
          } else {
            spokenMessage = `Hello ${curName}. Take it easy and enjoy a peaceful day.`;
          }
        }

        if (spokenMessage && TTS && TTS.isSupported()) {
          TTS.speak(spokenMessage);
        }

        render();
      });
    });

    // Home reminder action buttons
    const btnDone = container.querySelector('.btn-home-rem-done');
    if (btnDone) {
      btnDone.addEventListener('click', () => {
        const id = btnDone.getAttribute('data-id');
        Storage.markReminderDone(id);
        if (window.SmritiToast) {
          window.SmritiToast.show('Wonderful! Reminder completed for today. 🌿', 'success');
        }
        render();
      });
    }

    const btnSnooze = container.querySelector('.btn-home-rem-snooze');
    if (btnSnooze) {
      btnSnooze.addEventListener('click', () => {
        const id = btnSnooze.getAttribute('data-id');
        Storage.snoozeReminder(id, 10);
        if (window.SmritiToast) {
          window.SmritiToast.show('We will gently remind you in 10 minutes! 🕊️', 'info');
        }
        if (TTS && TTS.isSupported()) {
          TTS.speak('Got it. Reminding you in ten minutes.');
        }
        render();
      });
    }

    // Quick Call loved one action
    const btnQuickCall = container.querySelector('#btn-home-quick-call');
    if (btnQuickCall) {
      btnQuickCall.addEventListener('click', () => {
        const emergency = Storage.getEmergencyContacts();
        if (window.confirm(`Call ${emergency.primaryName} (${emergency.primaryPhone}) now?`)) {
          window.location.href = `tel:${emergency.primaryPhone}`;
        }
      });
    }

    // Adaptive mood action buttons
    container.querySelectorAll('.btn-mood-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const route = btn.getAttribute('data-route');
        if (route) window.location.hash = route;
      });
    });

    // Start activity button
    const startActBtn = container.querySelector('#btn-start-activity');
    if (startActBtn) {
      startActBtn.addEventListener('click', () => {
        const targetRoute = startActBtn.getAttribute('data-route') || '#/games';
        window.location.hash = targetRoute;
      });
    }

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

    // Smriti teaser
    const talkSmritiBtn = container.querySelector('#btn-talk-smriti-teaser');
    if (talkSmritiBtn) {
      talkSmritiBtn.addEventListener('click', () => {
        window.location.hash = '#/smriti';
      });
    }

    // Journey widget
    const journeyWidget = container.querySelector('#widget-journey-home');
    if (journeyWidget) {
      journeyWidget.addEventListener('click', () => {
        window.location.hash = '#/journey';
      });
    }

    // Quick navigation cards
    container.querySelectorAll('.home-nav-card').forEach(card => {
      card.addEventListener('click', () => {
        const targetRoute = card.getAttribute('data-route');
        if (targetRoute) window.location.hash = targetRoute;
      });
    });
  }

  const profileUpdateHandler = () => {
    render();
  };
  window.addEventListener('userProfileUpdated', profileUpdateHandler);

  render();

  return {
    cleanup() {
      TTS.stop();
      window.removeEventListener('userProfileUpdated', profileUpdateHandler);
    }
  };
}
