/* ============================================================
   SMRITI — Modernized Wellness & Memory Home Page
   Warm, consumer-friendly daily companion hub
   Reactive: subscribes to UserState for name updates
   ============================================================ */

import Storage from '../storage.js';
import AIService from '../aiService.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';
import UserState from '../userState.js';

export default function Home(container) {
  let currentThought = AIService.generateGoodThought();
  let todayMood = Storage.getTodayMood();
  const journey = Storage.getJourneyStats();
  const recommendedGame = AIService.recommendActivity();

  // Reactive display name — updates across all renders without reload
  let displayName = UserState.getDisplayName() || 'Friend';

  // Subscribe to name changes from UserState (e.g. after Settings, Login wizard)
  const unsubscribeHome = UserState.subscribe(() => {
    displayName = UserState.getDisplayName() || 'Friend';
  });

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

  // Dictionary mapping distinct moods to tailored, empathetic dynamic responses
  const moodResponseDictionary = {
    great: {
      en: {
        text: "You are feeling wonderful today! Let's celebrate this radiant energy with a joyful cognitive puzzle or share a happy memory with family.",
        actions: [
          { label: '🎮 Play Bamboo Sequence', route: '#/games/bamboo-sequence' },
          { label: '📸 Family Memories', route: '#/memories' },
          { label: '🎭 Music & Melodies', route: '#/entertainment' }
        ]
      },
      hi: {
        text: "आज आप बहुत ऊर्जावान और प्रसन्न महसूस कर रहे हैं! आइए इस सुनहरे पल को एक आनंददायक खेल या पारिवारिक यादों के साथ साझा करें।",
        actions: [
          { label: '🎮 बांसुरी क्रम खेल', route: '#/games/bamboo-sequence' },
          { label: '📸 पारिवारिक यादें', route: '#/memories' },
          { label: '🎭 संगीत और धुनें', route: '#/entertainment' }
        ]
      },
      bn: {
        text: "আজ আপনার মন দারুণ আনন্দে ভরে আছে! চলুন একটি সুন্দর মনের খেলা বা পরিবারের মধুর স্মৃতি দেখে দিনটি উদযাপন করি।",
        actions: [
          { label: '🎮 স্মৃতি খেলা', route: '#/games/bamboo-sequence' },
          { label: '📸 পরিবারের স্মৃতি', route: '#/memories' },
          { label: '🎭 মধুর সুর ও গান', route: '#/entertainment' }
        ]
      },
      bg: '#ECFDF5',
      border: '#6EE7B7',
      color: '#065F46'
    },
    good: {
      en: {
        text: "Glad to see you in good spirits! Engaging your mind now helps build long-term memory resilience.",
        actions: [
          { label: '🦅 Play Hornbill Memory', route: '#/games/hornbill' },
          { label: '📖 Visual Story Recall', route: '#/games/memory-moments' },
          { label: '🌿 Daily Wellness Guide', route: '#/wellness' }
        ]
      },
      hi: {
        text: "आपको अच्छे मन में देखकर खुशी हुई! एक हल्का दिमागी खेल आपकी याददाश्त को और मजबूत बनाएगा।",
        actions: [
          { label: '🦅 हॉर्नबिल स्मृति खेल', route: '#/games/hornbill' },
          { label: '📖 कहानी स्मरण', route: '#/games/memory-moments' },
          { label: '🌿 स्वास्थ्य नियम', route: '#/wellness' }
        ]
      },
      bn: {
        text: "আপনার ভালো মনের অনুভবে আমরা আনন্দিত! একটি সহজ মনচর্চা আপনার স্মৃতিশক্তিকে আরও সতেজ রাখবে।",
        actions: [
          { label: '🦅 স্মৃতি মেলানো খেলা', route: '#/games/hornbill' },
          { label: '📖 গল্পের স্মৃতি', route: '#/games/memory-moments' },
          { label: '🌿 মনের যত্ন গাইড', route: '#/wellness' }
        ]
      },
      bg: '#F0FDF4',
      border: '#BBF7D0',
      color: '#166534'
    },
    okay: {
      en: {
        text: "Steady and peaceful. A gentle brain exercise or browsing fond family photographs can bring a comforting spark to your day.",
        actions: [
          { label: '👨‍👩‍👧 Familiar Faces Game', route: '#/games/familiar-faces' },
          { label: '🪈 Relaxing Instrumental', route: '#/entertainment' },
          { label: '🤖 Talk to Smriti', route: '#/smriti' }
        ]
      },
      hi: {
        text: "शांत और संतुलित। एक शांत गतिविधि या परिचित चेहरों का खेल आपके दिन में सुखद रोशनी लाएगा।",
        actions: [
          { label: '👨‍👩‍👧 परिचित चेहरे खेल', route: '#/games/familiar-faces' },
          { label: '🪈 शांतिदायक संगीत', route: '#/entertainment' },
          { label: '🤖 स्मृति से बात करें', route: '#/smriti' }
        ]
      },
      bn: {
        text: "শান্ত ও স্বাভাবিক। প্রিয়জনদের মুখ চেনার খেলা বা মিষ্টি সুর শোনা আপনার দিনটি মধুর করে তুলবে।",
        actions: [
          { label: '👨‍👩‍👧 পরিচিত মুখ চেনা', route: '#/games/familiar-faces' },
          { label: '🪈 মিষ্টি বাঁশির সুর', route: '#/entertainment' },
          { label: '🤖 স্মৃতির সাথে কথা বলুন', route: '#/smriti' }
        ]
      },
      bg: '#F0FDFA',
      border: '#99F6E4',
      color: '#0F766E'
    },
    low: {
      en: {
        text: "I'm sorry you're feeling down. Let's try some relaxing music, gentle breathing, or talk together to bring warmth.",
        actions: [
          { label: '🫁 4-4 Calming Breathing', route: '#/wellness' },
          { label: '🎵 Soothing Melodies', route: '#/entertainment' },
          { label: '🤖 Chat with Smriti', route: '#/smriti' }
        ]
      },
      hi: {
        text: "मुझे खेद है कि आप उदास महसूस कर रहे हैं। आइए कुछ शांतिदायक संगीत सुनें या गहरी सांसों का अभ्यास करें। आप अकेले नहीं हैं।",
        actions: [
          { label: '🫁 शांतिदायक सांस', route: '#/wellness' },
          { label: '🎵 सुखद धुनें', route: '#/entertainment' },
          { label: '🤖 स्मृति से बात करें', route: '#/smriti' }
        ]
      },
      bn: {
        text: "মন খারাপ থাকা স্বাভাবিক, কিন্তু আপনি একা নন। চলুন কিছু শান্ত সুর শুনি বা গভীর নিঃশ্বাসের ব্যায়াম করি।",
        actions: [
          { label: '🫁 শান্ত শ্বাস ব্যায়াম', route: '#/wellness' },
          { label: '🎵 মধুর সঙ্গীত', route: '#/entertainment' },
          { label: '🤖 স্মৃতির সাথে কথা বলুন', route: '#/smriti' }
        ]
      },
      bg: '#FFF7ED',
      border: '#FED7AA',
      color: '#9A3412'
    },
    worried: {
      en: {
        text: "It is completely okay to feel anxious. Take slow, deep breaths with us or connect with your loved ones right away.",
        actions: [
          { label: '📞 Call Loved One', route: '#/emergency' },
          { label: '🧭 Orientation Guide', route: '#/lost' },
          { label: '🫁 Guided Calming Breath', route: '#/wellness' }
        ]
      },
      hi: {
        text: "चिंता महसूस होना स्वाभाविक है। एक गहरी और शांत सांस लें। यदि चाहें तो तुरंत अपने प्रियजन से बात करें।",
        actions: [
          { label: '📞 प्रियजन को कॉल करें', route: '#/emergency' },
          { label: '🧭 सहारा व मार्गदर्शन', route: '#/lost' },
          { label: '🫁 शांत सांस लें', route: '#/wellness' }
        ]
      },
      bn: {
        text: "দুশ্চিন্তা হতেই পারে। ধীরে ধীরে শান্ত শ্বাস নিন। আপনি চাইলে এখনি প্রিয়জনকে ফোন করতে পারেন।",
        actions: [
          { label: '📞 প্রিয়জনকে কল করুন', route: '#/emergency' },
          { label: '🧭 সান্ত্বনা ও সাহায্য', route: '#/lost' },
          { label: '🫁 শান্ত শ্বাস ব্যায়াম', route: '#/wellness' }
        ]
      },
      bg: '#FFF1F2',
      border: '#FECDD3',
      color: '#9F1239'
    }
  };

  function getMoodAdaptive(moodKey) {
    const lang = I18n.lang || 'en';
    const entry = moodResponseDictionary[moodKey] || moodResponseDictionary.okay;
    const localized = entry[lang] || entry.en;
    return {
      text: localized.text,
      actions: localized.actions,
      bg: entry.bg,
      border: entry.border,
      color: entry.color
    };
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
    const nextReminder = activeReminders.length > 0 ? activeReminders[0] : null;
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

    const totalTasksCount = reminders.length > 0 ? reminders.length : 3;
    const completedTasksCount = reminders.filter(r => r.completedToday).length;
    const progressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 680px; padding-bottom: 2.5rem;">
        
        <!-- Top Welcome Greeting Banner with Real-Time Task Progress Bar (Items 11 & 12) -->
        <div class="card card-elevated greeting-card mb-md" style="background: #FFF9F0; border: 2px solid #F3E8DC; padding: 1.5rem; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <div style="font-size: 1.15rem; color: #404040; font-weight: 700;">
                ${timeGreeting}, ${timeIcon}
              </div>
              <h1 style="color: #9B2C2C; font-size: 2.2rem; margin: 0.15rem 0 0.35rem 0; font-weight: 800;">
                ${displayName}!
              </h1>
              <p style="margin: 0; color: #1A1A1A; font-size: 1.1rem; font-weight: 500;">
                ${welcomeSub}
              </p>
            </div>
            <div style="font-size: 3.5rem; animation: floatSlow 3s ease-in-out infinite;">
              🌸
            </div>
          </div>

          <!-- Real-Time Visual Progress Bar -->
          <div style="background: #FFFFFF; border: 1.5px solid #FDE68A; border-radius: 14px; padding: 0.85rem 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span style="font-size: 0.95rem; font-weight: 800; color: #78350F;">
                Daily Tasks: ${completedTasksCount} of ${totalTasksCount} Completed
              </span>
              <span style="font-size: 0.95rem; font-weight: 800; color: #B45309;">
                ${progressPercent}%
              </span>
            </div>
            <div style="width: 100%; height: 12px; background: #F3F4F6; border-radius: 999px; overflow: hidden;">
              <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #F59E0B, #10B981); border-radius: 999px; transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>

        <!-- Quick Family Call & Daily Ritual Action Cards (High contrast & elder-accessible) -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
          <!-- 📞 One-Tap Family Call Card (Light red #FFEBEE background, dark red text) -->
          <div id="btn-home-quick-call" class="card card-elevated" style="padding: 1.1rem; border-radius: 16px; background: #FFEBEE; border: 2px solid #FFCDD2; cursor: pointer; display: flex; align-items: center; gap: 0.85rem; min-height: 72px;">
            <div style="font-size: 2.2rem; background: #FFCDD2; width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              📞
            </div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #B71C1C; text-transform: uppercase; letter-spacing: 0.5px;">${callLovedOne}</div>
              <div style="font-weight: 800; color: #7F0000; font-size: 1.1rem;">${Storage.getEmergencyContacts().primaryName}</div>
            </div>
          </div>

          <!-- 🌅 Daily Ritual 3-Step Mode (Mint green #E8F5E9 background, dark green text) -->
          <div onclick="window.location.hash='#/ritual'" class="card card-elevated" style="padding: 1.1rem; border-radius: 16px; background: #E8F5E9; border: 2px solid #C8E6C9; cursor: pointer; display: flex; align-items: center; gap: 0.85rem; min-height: 72px;">
            <div style="font-size: 2.2rem; background: #C8E6C9; width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              🌅
            </div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 800; color: #1B5E20; text-transform: uppercase; letter-spacing: 0.5px;">${dailyRitualLabel}</div>
              <div style="font-weight: 800; color: #004D40; font-size: 1.1rem;">${ritualStep}</div>
            </div>
          </div>
        </div>

        <!-- High Visibility Medication / Reminder Card -->
        ${nextReminder ? `
          <div class="card card-elevated mb-md" style="padding: 1.35rem 1.4rem; border-radius: 18px; border-left: 8px solid #D97706; background: #FFF9F0; border-top: 2px solid #FDE68A; border-right: 2px solid #FDE68A; border-bottom: 2px solid #FDE68A;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <span style="font-size: 0.85rem; font-weight: 800; color: #92400E; text-transform: uppercase; letter-spacing: 0.5px;">
                ⏰ Scheduled Routine Reminder
              </span>
              <!-- Pill Badge -->
              <span style="background: #F59E0B; color: #FFFFFF; font-weight: 800; font-size: 0.85rem; padding: 4px 10px; border-radius: 999px;">
                ${nextReminder.time} (${nextReminder.period || 'Scheduled'})
              </span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.15rem;">
              <div style="font-size: 2.4rem; background: #FEF3C7; width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${nextReminder.icon || '💊'}
              </div>
              <div>
                <h3 style="margin: 0; color: #1A1A1A; font-size: 1.35rem; font-weight: 800;">${nextReminder.title}</h3>
                <p style="margin: 0.25rem 0 0 0; color: #404040; font-size: 1.05rem; font-weight: 600;">
                  ${nextReminder.notes}
                </p>
              </div>
            </div>

            <!-- Highly accessible primary green & secondary gray action buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <button class="btn btn-home-rem-done" data-id="${nextReminder.id}" style="min-height: 52px; font-size: 1.15rem; font-weight: 800; background: #2E7D32; color: #FFFFFF; border-radius: 14px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
                ✓ Mark Done
              </button>
              <button class="btn btn-home-rem-snooze" data-id="${nextReminder.id}" style="min-height: 52px; font-size: 1.1rem; font-weight: 700; background: #E0E0E0; color: #1A1A1A; border: 1.5px solid #CCCCCC; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
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

            <div class="card card-game home-nav-card" data-route="#/entertainment" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🎭</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #9333EA;">${lang === 'hi' ? 'संगीत व मनोरंजन' : (lang === 'bn' ? 'গান ও গল্প' : 'Entertainment')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/social" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">👨‍👩‍👧</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #D97706;">${lang === 'hi' ? 'परिवार के साथ खेलें' : (lang === 'bn' ? 'পরিবারের সাথে খেলা' : 'Family Play')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/leaderboard" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🌟</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #B45309;">${lang === 'hi' ? 'सप्ताह के सितारे' : (lang === 'bn' ? 'সপ্তাহের তারা' : 'Weekly Stars')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/wellness" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">🌿</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: #065F46;">${lang === 'hi' ? 'स्वास्थ्य' : (lang === 'bn' ? 'সুস্থতা' : 'Wellness')}</div>
            </div>

            <div class="card card-game home-nav-card" data-route="#/reminders" style="padding: 1rem 0.5rem; cursor: pointer;">
              <div style="font-size: 2.2rem; margin-bottom: 0.25rem;">⏰</div>
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--teal-dark);">${lang === 'hi' ? 'अनुस्मारक' : (lang === 'bn' ? 'অনুস্মারক' : 'Reminders')}</div>
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

        const adaptiveResp = getMoodAdaptive(mood);
        const spokenMessage = adaptiveResp ? adaptiveResp.text : `Hello ${curName}. Take it easy and enjoy a peaceful day.`;

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
  window.addEventListener('languageChanged', profileUpdateHandler);

  render();

  return {
    cleanup() {
      TTS.stop();
      window.removeEventListener('userProfileUpdated', profileUpdateHandler);
      window.removeEventListener('languageChanged', profileUpdateHandler);
      if (typeof unsubscribeHome === 'function') unsubscribeHome();
    }
  };
}
