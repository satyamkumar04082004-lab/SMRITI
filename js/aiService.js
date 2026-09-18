/* ============================================================
   SMRITI — Reusable AI Service Module
   Local AI intelligence + OpenAI / Gemini Multi-Tier Fallback +
   Client-Side Tool Execution Loop (16 Tools).
   ============================================================ */

import Storage from './storage.js';
import I18n from './i18n.js';

// ============================================================
// CLIENT-SIDE TOOL EXECUTION DICTIONARY (TOOL_HANDLERS)
// All 16 Platform Interactions Implemented
// ============================================================
export const TOOL_HANDLERS = {
  getPatientProfile() {
    return Storage.getPatientProfile() || { patient: { name: 'Meera Das', stage: 'Mild Cognitive Impairment' } };
  },

  getFamilyMembers() {
    const profile = Storage.getPatientProfile();
    return profile?.familyMembers || [
      { name: 'Raj Das', relation: 'Son', phone: '+91 98765 43210' },
      { name: 'Ananya Das', relation: 'Daughter', phone: '+91 98765 43211' }
    ];
  },

  getTodayRoutine() {
    const reminders = Storage.getReminders() || [];
    return {
      today: new Date().toISOString().split('T')[0],
      total: reminders.length,
      completed: reminders.filter(r => r.completedToday).length,
      tasks: reminders
    };
  },

  createReminder(args = {}) {
    const { title, time, category } = args;
    if (!title || !time) return { success: false, error: 'Title and time are required' };
    const newRem = {
      id: 'rem_' + Date.now(),
      title,
      time,
      category: category || 'general',
      active: true,
      completedToday: false
    };
    Storage.addReminder(newRem);
    window.dispatchEvent(new CustomEvent('smriti:reminderCreated', { detail: newRem }));
    return { success: true, reminder: newRem, message: `Created reminder: "${title}" at ${time}` };
  },

  getGameProgress() {
    const history = Storage.getGameHistory() || [];
    const coins = (typeof Storage.getCoins === 'function') ? Storage.getCoins() : 0;
    const avgAcc = history.length > 0 ? Math.round(history.reduce((a, b) => a + (b.accuracy || 0), 0) / history.length) : 0;
    return {
      totalGamesPlayed: history.length,
      averageAccuracy: avgAcc,
      totalCoins: coins,
      recentSessions: history.slice(-5)
    };
  },

  startGame(args = {}) {
    const { gameId } = args;
    if (!gameId) return { success: false, error: 'gameId required' };
    window.location.hash = `#/games/${gameId}`;
    return { success: true, gameId, message: `Navigating to game: ${gameId}` };
  },

  getCurrentDate() {
    const istOptionsDate = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const istOptionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    return {
      date: new Date().toLocaleDateString('en-IN', istOptionsDate),
      time: new Date().toLocaleTimeString('en-IN', istOptionsTime),
      timezone: 'Asia/Kolkata (IST)'
    };
  },

  triggerSOS(args = {}) {
    const reason = args.reason || 'Emergency assistance requested';
    window.dispatchEvent(new CustomEvent('smriti:sosTriggered', { detail: { reason } }));
    window.location.hash = '#/emergency';
    return { success: true, message: 'Emergency SOS alert activated! Caregivers notified.' };
  },

  getWeeklyInsights() {
    const history = Storage.getGameHistory() || [];
    const totalSessions = history.length;
    const avgAcc = totalSessions > 0 ? Math.round(history.reduce((a, b) => a + (b.accuracy || 0), 0) / totalSessions) : 90;
    return {
      totalSessions,
      averageAccuracy: avgAcc,
      streakDays: Math.min(totalSessions, 7),
      consistencyRating: totalSessions >= 5 ? 'Excellent' : 'Good',
      recommendation: 'Episodic story recall and morning mindfulness exercises'
    };
  },

  updateDifficulty(args = {}) {
    const level = args.level || 'medium';
    Storage.setDifficulty(level);
    window.dispatchEvent(new CustomEvent('smriti:difficultyUpdated', { detail: { level } }));
    return { success: true, level, message: `Difficulty updated to ${level}` };
  },

  updateLanguage(args = {}) {
    const lang = args.languageCode || 'en';
    I18n.setLanguage(lang);
    return { success: true, language: lang, message: `Language updated to ${lang}` };
  },

  updateAccessibilitySettings(args = {}) {
    const settings = {
      highContrast: !!args.highContrast,
      fontSize: args.fontSize || 'normal',
      soundEnabled: args.soundEnabled !== false
    };
    Storage.setPreferences(Object.assign({}, Storage.getPreferences(), settings));
    window.dispatchEvent(new CustomEvent('smriti:accessibilityUpdated', { detail: settings }));
    return { success: true, settings, message: 'Accessibility preferences updated' };
  },

  getGameRules(args = {}) {
    const rules = {
      'hornbill': 'Flip two cards to find matching Northeastern nature icons. Match all pairs to complete the nest!',
      'memory-moments': 'Observe daily life story scenes carefully, then answer questions about the sequence.',
      'familiar-faces': 'Identify familiar friends, family, and community helpers with helpful progressive hints.',
      'remember-home': 'Memorize objects in household rooms and spot their positions after they hide.',
      'my-day': 'Tap daily routine activities in their natural sequential order from morning to night.',
      'listen-remember': 'Listen to uplifting sentences spoken aloud and recall key words or details.',
      'bamboo-sequence': 'Watch the glowing bamboo pads and repeat the pattern sequence.'
    };
    const text = rules[args.gameId] || 'Exercise your cognitive memory with gentle, engaging activities.';
    return { gameId: args.gameId, rules: text };
  },

  getCurrentGameState() {
    const hash = window.location.hash || '';
    const isGame = hash.startsWith('#/games/');
    const activeGameId = isGame ? hash.replace('#/games/', '') : null;
    return { inGame: isGame, activeGameId };
  },

  giveGameHint(args = {}) {
    const hints = {
      'hornbill': 'Focus on corner cards first or try remembering the orchid icon position!',
      'familiar-faces': 'Think about where this person works or lives—they might be from the health clinic or family.',
      'remember-home': 'Notice the object placed in the center of the room.',
      'bamboo-sequence': 'Hum the rhythm of the pads as they light up to help remember the pattern!'
    };
    return { hint: hints[args.gameId] || 'Take a calm breath and trust your memory!' };
  },

  saveGameResult(args = {}) {
    const { gameId, score, accuracy } = args;
    if (!gameId) return { success: false, error: 'gameId is required' };
    const record = {
      id: 'session_' + Date.now(),
      gameId,
      score: score || 0,
      accuracy: accuracy !== undefined ? accuracy : 100,
      timestamp: new Date().toISOString()
    };
    Storage.saveGameSession(record);
    return { success: true, record, message: `Game result saved for ${gameId}` };
  }
};

const AIService = {
  // ------------------------------------------------------------
  // 1. TOOL DISPATCH ENGINE
  // ------------------------------------------------------------
  executeTool(name, args = {}) {
    if (TOOL_HANDLERS[name]) {
      try {
        return TOOL_HANDLERS[name](args);
      } catch (e) {
        console.warn(`Error executing tool ${name}:`, e);
        return { error: e.message };
      }
    }
    return { error: `Tool ${name} not recognized` };
  },

  // ------------------------------------------------------------
  // 2. TODAY'S GOOD THOUGHT ENGINE
  // ------------------------------------------------------------
  _goodThoughts: [
    { text: "Every day is a new page. You don't have to write the whole story today.", theme: "Gentle Pace", author: "Mindful Wisdom" },
    { text: "Like a tree rooted deep in the earth, your inner calm can withstand any breeze.", theme: "Nature", author: "Calm Reflection" },
    { text: "A cup of warm tea and a quiet breath can bring peace to the busiest day.", theme: "Simplicity", author: "Daily Joy" },
    { text: "Your smile is a gift to everyone you meet today. Share it freely.", theme: "Connection", author: "Warmth" },
    { text: "Be gentle with yourself. You are doing the best you can, step by step.", theme: "Kindness", author: "Self-Care" },
    { text: "The morning sun doesn't hurry, yet it lights up the entire world.", theme: "Patience", author: "Nature" },
    { text: "Cherish the little memories: the sound of birds, the aroma of spices, the warmth of a blanket.", theme: "Gratitude", author: "Mindfulness" },
    { text: "A peaceful heart sees beauty where others see only routine.", theme: "Peace", author: "Wisdom" },
    { text: "It is never too late to learn a new tune, enjoy a flower, or share a laugh.", theme: "Curiosity", author: "Joyful Living" },
    { text: "You are surrounded by people who care deeply for your happiness and well-being.", theme: "Love", author: "Family & Friendship" },
    { text: "Gentle thoughts bring quiet strength. Rest when you need to.", theme: "Rest", author: "Wellness" },
    { text: "Just like the Brahmaputra flows with grace, let today flow naturally and easily.", theme: "Northeast Nature", author: "Flow" },
    { text: "Listening with love is one of the greatest kindnesses we can offer.", theme: "Friendship", author: "Connection" },
    { text: "Every small step in exercising your mind builds resilience and joy.", theme: "Growth", author: "Mind Journey" },
    { text: "Today is an open door to comfort, good conversation, and peaceful moments.", theme: "Hope", author: "Daily Blessing" },
    { text: "Look out the window and notice one green leaf dancing in the wind.", theme: "Awareness", author: "Mindfulness" },
    { text: "Your presence in the lives of those who love you is irreplaceable.", theme: "Affirmation", author: "Love" },
    { text: "Laughter is sunshine inside the house. May you find a reason to smile today.", theme: "Joy", author: "Warmth" },
    { text: "The rhythm of a familiar melody can transport us to our fondest times.", theme: "Music & Memory", author: "Nostalgia" },
    { text: "Small acts of gentleness make a huge difference in the world.", theme: "Kindness", author: "Heart" }
  ],

  _lastThoughtIndex: -1,

  generateGoodThought() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this._goodThoughts.length);
    } while (nextIndex === this._lastThoughtIndex && this._goodThoughts.length > 1);

    this._lastThoughtIndex = nextIndex;
    return this._goodThoughts[nextIndex];
  },

  // ------------------------------------------------------------
  // 3. SMRITI AI COMPANION (STREAMING + TOOL EXECUTION + STRICT DYNAMIC LANGUAGE)
  // ------------------------------------------------------------
  async streamChatWithSmriti(userMessage, onChunk, onToolCall, history = []) {
    const profile = Storage.getPatientProfile();
    const user = Storage.getUser() || { name: 'Meera Das', role: 'patient' };

    const istOptionsDate = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const istOptionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    const todayDate = new Date().toLocaleDateString('en-IN', istOptionsDate);
    const todayTime = new Date().toLocaleTimeString('en-IN', istOptionsTime);
    const currentLang = I18n.lang || Storage.getLanguage() || 'en';
    
    const langNames = {
      'en': 'English',
      'hi': 'Hindi (हिन्दी)',
      'as': 'Assamese (অসমীয়া)',
      'bn': 'Bengali (বাংলা)',
      'mni': 'Manipuri / Meitei (মৈতৈলোন্)',
      'kha': 'Khasi',
      'lus': 'Mizo',
      'ta': 'Tamil (தமிழ்)',
      'te': 'Telugu (తెలుగు)',
      'mr': 'Marathi (मराठी)',
      'gu': 'Gujarati (ગુજરાતી)',
      'kn': 'Kannada (ಕನ್ನಡ)'
    };
    const currentLangName = langNames[currentLang] || currentLang;

    // Strict Language Directive requested in architecture specification:
    // "You must translate and respond ONLY in this exact language: ${currentLanguage}."
    const strictDirective = `You must translate and respond ONLY in this exact language: ${currentLangName} (${currentLang}).`;

    const contextualPayload = {
      message: userMessage,
      currentDate: todayDate,
      currentTime: todayTime,
      patientProfile: profile,
      role: user.role || 'patient',
      currentLanguage: currentLang,
      language: currentLang,
      languageName: currentLangName,
      strictInstruction: strictDirective,
      stream: true
    };

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contextualPayload)
      });

      const contentType = resp.headers.get('content-type') || '';
      if (resp.ok && contentType.includes('text/event-stream') && resp.body) {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data:')) {
              const dataStr = trimmed.replace(/^data:\s*/, '').trim();
              if (dataStr === '[DONE]') {
                onChunk('', true);
                return;
              }
              try {
                const parsed = JSON.parse(dataStr);
                
                // Check if tool calls were passed in SSE stream
                if (parsed.tool_calls && Array.isArray(parsed.tool_calls)) {
                  parsed.tool_calls.forEach(tc => {
                    const result = this.executeTool(tc.name, tc.args);
                    if (typeof onToolCall === 'function') onToolCall(tc, result);
                  });
                }

                const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text
                  || parsed?.choices?.[0]?.delta?.content
                  || parsed?.text
                  || '';
                if (textChunk) {
                  onChunk(textChunk, false);
                }
              } catch (parseErr) {
                if (dataStr) onChunk(dataStr, false);
              }
            }
          }
        }
        onChunk('', true);
        return;
      } else if (resp.ok) {
        const data = await resp.json();
        
        // Execute tool calls if returned
        if (data.tool_calls && Array.isArray(data.tool_calls)) {
          data.tool_calls.forEach(tc => {
            const result = this.executeTool(tc.name, tc.args);
            if (typeof onToolCall === 'function') onToolCall(tc, result);
          });
        }

        if (data && data.reply) {
          onChunk(data.reply, true);
          return;
        }
      }
    } catch (e) {
      console.warn('Streaming fetch failed, switching to local generation:', e);
    }

    // Local contextual fallback if endpoint is unavailable
    const fallbackText = this.chatWithSmriti(userMessage, history);
    
    // Check for tool intent locally
    const lower = (userMessage || '').toLowerCase();
    if (lower.includes('play hornbill') || lower.includes('start hornbill')) {
      const tc = { name: 'startGame', args: { gameId: 'hornbill' } };
      const res = this.executeTool(tc.name, tc.args);
      if (typeof onToolCall === 'function') onToolCall(tc, res);
    } else if (lower.includes('emergency') || lower.includes('sos')) {
      const tc = { name: 'triggerSOS', args: { reason: 'User requested emergency assistance' } };
      const res = this.executeTool(tc.name, tc.args);
      if (typeof onToolCall === 'function') onToolCall(tc, res);
    }

    const words = fallbackText.split(' ');
    let wIdx = 0;
    const interval = setInterval(() => {
      if (wIdx < words.length) {
        const chunk = (wIdx > 0 ? ' ' : '') + words[wIdx];
        onChunk(chunk, false);
        wIdx++;
      } else {
        clearInterval(interval);
        onChunk('', true);
      }
    }, 35);
  },

  chatWithSmriti(userMessage, history = []) {
    const profile = Storage.getPatientProfile();
    const currentLang = I18n.lang || Storage.getLanguage() || 'en';
    const patient = (profile && profile.patient) || { name: 'Meera', state: 'Assam' };
    const firstName = (patient.preferredName || patient.name || 'Friend').split(' ')[0];
    const text = (userMessage || '').trim().toLowerCase();

    const games = (profile && profile.gameHistory) || [];
    const totalGames = games.length;
    const avgAcc = totalGames > 0 ? Math.round(games.reduce((s, g) => s + (g.accuracy || 0), 0) / totalGames) : 90;
    const memories = (profile && profile.memories) || [];
    const family = (profile && profile.familyMembers) || [];
    const medicines = (profile && profile.medicines) || [];
    const reminders = Storage.getReminders() || (profile && profile.reminders) || [];
    const activeReminders = reminders.filter(r => !r.completedToday);
    const reminderDataSummary = activeReminders.length > 0
      ? activeReminders.map(r => `${r.time || ''}: ${r.title || r.task || ''}`).join(', ')
      : 'All scheduled medicines and tasks are completed for now';

    const caretakerName = profile?.caretakerName || profile?.caregiverName || family.find(f => f.relation === 'Caregiver' || f.relation === 'Son' || f.isCaregiver)?.name || 'Rahul';
    const doctorName = profile?.doctorName || profile?.doctor || family.find(f => f.relation?.toLowerCase().includes('doctor'))?.name || 'Dr. Sharma';

    const istOptionsDate = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const istOptionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    const todayDateStr = new Date().toLocaleDateString('en-IN', istOptionsDate);
    const todayTimeStr = new Date().toLocaleTimeString('en-IN', istOptionsTime);

    // Language picker helper (en, hi, as, bn, ne, mni)
    const pickLang = (enStr, hiStr, asStr, bnStr, neStr, mniStr) => {
      if (currentLang === 'hi') return hiStr;
      if (currentLang === 'as') return asStr;
      if (currentLang === 'bn') return bnStr;
      if (currentLang === 'ne') return neStr || hiStr;
      if (currentLang === 'mni') return mniStr || enStr;
      return enStr;
    };

    // 1. Safety, Crisis & SOS Handling
    if (text.includes('sos') || text.includes('emergency') || text.includes('help me') || text.includes('fall') || text.includes('chest pain') || text.includes('breathing problem') || text.includes('lost')) {
      return pickLang(
        `Please stay calm ${firstName}, you are completely safe. If you need immediate assistance, tap the bright red 🛟 SOS button on top or call your caregiver ${caretakerName} right away. 🕊️❤️`,
        `कृपया शांत रहें ${firstName}, आप पूर्णतः सुरक्षित हैं। तुरंत सहायता के लिए ऊपर दिए गए लाल 🛟 SOS बटन को दबाएं या ${caretakerName} को कॉल करें। 🕊️❤️`,
        `অনুগ্ৰহ কৰি শান্ত থাকক ${firstName}, আপুনি সুৰক্ষিত। জৰুৰী সহায়ৰ বাবে ওপৰৰ ৰঙা 🛟 SOS বুটামটো টিপক বা ${caretakerName}ক যোগাযোগ কৰক। 🕊️❤️`,
        `দয়া করে শান্ত থাকুন ${firstName}, আপনি নিরাপদ। জরুরি প্রয়োজনে ওপরের লাল 🛟 SOS বোতামটি চেপে আপনার সেবাকারী ${caretakerName}-কে জানান। 🕊️❤️`,
        `कृपया शान्त रहनुहोस् ${firstName}, हजुर पूर्ण सुरक्षित हुनुहुन्छ। आपतकालीन सहयोगका लागि रातो 🛟 SOS बटन दबाउनुहोस् वा ${caretakerName}लाई सम्पर्क गर्नुहोस्। 🕊️❤️`,
        `Ashangba lounu ${firstName}, nangbu ngak-shelbaga leiri. Awaba leirabadi angangba 🛟 SOS button nammu nattraga ${caretakerName}da call toubiyu. 🕊️❤️`
      );
    }

    // 2. Cognitive & Behavioral De-escalation (Validation Therapy)
    if (text.includes('mother') || text.includes('father') || text.includes('husband') || text.includes('wife') || text.includes('mom') || text.includes('dad') || text.includes('maa') || text.includes('pitaji')) {
      if (text.includes('where') || text.includes('want to see') || text.includes('kahan') || text.includes('dead') || text.includes('call')) {
        return pickLang(
          `It brings so much warmth to hear you speak of them, ${firstName}. They loved you so very deeply. Would you like to share a sweet story of them with me, or shall we listen to some calming music together? 🌸✨`,
          `आपकी बातें सुनकर बहुत अच्छा लगा ${firstName}। वे आपसे कितना अपार स्नेह करते थे! क्या आप मुझे उनके बारे में कुछ मीठी यादें सुनाना पसंद करेंगे? या हम साथ में बांसुरी का मधुर संगीत सुनें? 🌸✨`,
          `তেওঁলোকৰ কথা শুনি মনটো মৰমেৰে ভৰি পৰিল ${firstName}। তেওঁলোকে আপোনাক কিমান মৰম কৰিছিল! আপুনি তেওঁলোকৰ এটা সুন্দৰ স্মৃতি ক’ব নেকি বা আমি বাঁহীৰ সুৰ শুনো? 🌸✨`,
          `তাদের কথা ভেবে মনটা ভালো হয়ে গেল ${firstName}। তারা আপনাকে কতটা ভালোবাসতেন! আপনি কি তাদের কোনো সুন্দর স্মৃতির কথা বলবেন, নাকি আমরা একসাথে মিষ্টি গান শুনব? 🌸✨`,
          `हजुरको कुरा सुनेर मन हर्षित भयो ${firstName}। उहाँहरूले हजुरलाई धेरै माया गर्नुहुन्थ्यो! के उहाँहरूको कुनै मीठो सम्झना बाँड्न चाहनुहुन्छ, कि हामी शान्त बाँसुरीको धुन सुनौं? 🌸✨`,
          `Makhoigi wafam taraga pukning nungaijei ${firstName}. Makhoina nangbu yamna nungshirammi! Makhoigi nungshiba ningsingba wafam amukta hairambiragera? 🌸✨`
        );
      }
    }

    // 3. Medical Liability Prevention
    if (text.includes('diagnose') || text.includes('cure') || text.includes('stop medicine')) {
      return pickLang(
        `Dear ${firstName}, SMRITI is an assistive companion, not a medical diagnostic or treatment system. Please consult your physician ${doctorName} before making any changes to your medications! 🩺💊`,
        `प्रिय ${firstName}, स्मृति एक सहायक साथी है, कोई नैदानिक प्रणाली नहीं। कृपया अपनी दवाओं में बदलाव से पहले अपने चिकित्सक ${doctorName} से परामर्श करें! 🩺💊`,
        `মৰমৰ ${firstName}, স্মৃতি এটি সহায়ক স্মৃতি সংগীহে, কোনো চিকিৎসাজনিত ব্যৱস্থা নহয়। ঔষধৰ পৰিৱৰ্তন কৰাৰ আগতে অনুগ্ৰহ কৰি চিকিৎসক ${doctorName}ৰ পৰামৰ্শ লওক! 🩺💊`,
        `প্রিয় ${firstName}, স্মৃতি একটি সহায়ক সঙ্গী, কোনো রোগ নির্ণয় ব্যবস্থা নয়। ওষুধের কোনো পরিবর্তনের আগে দয়া করে চিকিৎসক ${doctorName}-এর পরামর্শ নিন! 🩺💊`,
        `प्रिय ${firstName}, स्मृति एउटा सहयोगी साथी हो, कुनै निदान प्रणाली होइन। औषधि परिवर्तन गर्नुअघि कृपया आफ्ना डाक्टर ${doctorName}सँग सल्लाह लिनुहोस्! 🩺💊`,
        `Nungshiba ${firstName}, SMRITI asi mateng pangba marupni. Hidak hongdokpagi matangda Doctor ${doctorName}da tanabiyu! 🩺💊`
      );
    }

    // 3b. FAQ: Cognitive Scores Clarification (Scores !== Medical Diagnosis)
    if (text.includes('score') || text.includes('marks') || text.includes('result') || text.includes('accuracy') || text.includes('percent') || text.includes('fail') || text.includes('test') || text.includes('ank') || text.includes('स्कोर') || text.includes('नंबर') || text.includes('फेल')) {
      return pickLang(
        `Dear ${firstName}, your game scores are simply fun, gentle brain exercises, NOT a clinical diagnosis or medical test. Daily scores naturally fluctuate depending on sleep, rest, and mood. You are doing wonderfully just by participating! 🌸✨`,
        `प्रिय ${firstName}, खेल के ये अंक केवल आपके मानसिक मनोरंजन और हल्के अभ्यास के लिए हैं, यह कोई चिकित्सीय निदान या मेडिकल टेस्ट नहीं है। नींद, आराम और मनोदशा के अनुसार स्कोर में स्वाभाविक उतार-चढ़ाव आता रहता है। आपका प्रयास ही सबसे सुंदर है! 🌸✨`,
        `মৰমৰ ${firstName}, এই খেলৰ নম্বৰসমূহ কেৱল আনন্দদায়ক মানসিক অনুশীলনৰ বাবেহে, ই কোনো চিকিৎসাজনিত ৰোগ নিৰ্ণয় নহয়। টোপনি আৰু জিৰণি অনুসৰি নম্বৰৰ তাৰতম্য ঘটাটো একেবাৰে স্বাভাৱিক। আপোনাৰ প্ৰচেষ্টাই আমাৰ বাবে অমূল্য! 🌸✨`,
        `প্রিয় ${firstName}, এই খেলার স্কোরগুলি কেবল আনন্দদায়ক ব্রেন এক্সারসাইজের জন্য, এটি কোনো চিকিৎসাগত রোগ নির্ণয় বা পরীক্ষা নয়। ঘুম বা শারীরিক ক্লান্তিভেদে স্কোরে ওঠানামা হওয়া খুব স্বাভাবিক। আপনার হাসিখুশি অংশগ্রহণই সবচেয়ে বড় প্রাপ্তি! 🌸✨`,
        `प्रिय ${firstName}, खेलको यो प्राप्ताङ्क केवल रमाइलो मानसिक अभ्यासका लागि हो, कुनै चिकित्सकीय निदान होइन। निद्रा र आराम अनुसार स्कोरमा घटबढ हुनु एकदमै स्वाभाविक हो। हजुरको सक्रियता नै सबैभन्दा ठूलो कुरा हो! 🌸✨`,
        `Nungshiba ${firstName}, masigi scorsi nungaina pukning thouna amani, laigi test natte. Nangna saruk yabasi yamna phajei! 🌸✨`
      );
    }

    // 4. Predefined FAQ 1: What is Dementia?
    if (text.includes('dementia') || text.includes('what is dementia') || text.includes('डिमेंशिया') || text.includes('ডিমেনচিয়া') || text.includes('ডিমেনশিয়া') || text.includes('डिमेन्सिया')) {
      return pickLang(
        `Dementia is a gentle condition where memory and thinking abilities gradually shift over time, but please do not worry at all—we are all right here to care for you! 🌸❤️`,
        `Dementia ek aisi sthiti hai jismein yaadashth aur sochne ki kshamta dheere-dheere kam hone lagti hai, lekin hum sab yahan aapki dekhbhal ke liye hain। 🌸❤️`,
        `ডিমেনচিয়া হৈছে এনে এক অৱস্থা য’ত স্মৃতিশক্তি আৰু চিন্তা কৰাৰ ক্ষমতা লাহে লাহে কিছু কমি যায়, কিন্তু আমি সকলোৱে আপোনাৰ যত্নৰ বাবে ইয়াতেই আছোঁ। 🌸❤️`,
        `ডিমেনশিয়া এমন একটি অবস্থা যেখানে স্মৃতিশক্তি ও চিন্তাভাবনা করার ক্ষমতা ধীরে ধীরে কিছুটা কমে যায়, কিন্তু আমরা সবাই আপনার যত্নের জন্য পাশেই আছি। 🌸❤️`,
        `डिमेन्सिया एउटा यस्तो अवस्था हो जसमा स्मरणशक्ति र सोच्ने क्षमता बिस्तारै कम हुन थाल्छ, तर हामी सबै हजुरको स्याहार र साथका लागि यहाँ छौं। 🌸❤️`,
        `Dementia haiba asi pukning ningsingba amasung khangba-heiba tapna sontharba amani, adubu eikhoi pumnamak nangi senbaga leiri. 🌸❤️`
      );
    }

    // 5. Predefined FAQ 2: Jokes (Clean, Lighthearted, Family-Friendly)
    if (text.includes('joke') || text.includes('chutkula') || text.includes('hasao') || text.includes('hasao mujhe') || text.includes('হাসি') || text.includes('ধেমালি') || text.includes('मजाक') || text.includes('चुट्किला') || text.includes('funny') || text.includes('joke sunao')) {
      return pickLang(
        `Why did the scarecrow win an award? Because he was outstanding in his field! 😄 May your heart always stay light and cheerful!`,
        `एक सज्जन ने डॉक्टर से पूछा: "डॉक्टर साहब, क्या चश्मा लगाने के बाद मैं पढ़ सकूँगा?" डॉक्टर बोले: "हाँ, बिल्कुल!" सज्जन खुशी से बोले: "अरे वाह! पहले तो मुझे पढ़ना ही नहीं आता था!" 😄 सदा मुस्कुराते रहिए!`,
        `এজন মানুহে ডাক্টৰক ক’লে: "ডাক্টৰ বাবু, চশমা ল’লে মই কিতাপ পঢ়িব পাৰিমনে?" ডাক্টৰে ক’লে: "নিশ্চয় পাৰিব!" মানুহজনে ক’লে: "বৰ ভাল কথা, মইতো আগতে পঢ়িবই নাজানিছিলোঁ!" 😄 সদা হাঁহি থাকক!`,
        `এক ব্যক্তি ডাক্তারকে জিজ্ঞেস করলেন: "ডাক্তারবাবু, চশমা নিলে কি আমি বই পড়তে পারব?" ডাক্তার বললেন: "হ্যাঁ, নিশ্চয়ই!" ব্যক্তিটি খুশি হয়ে বললেন: "বাহ, দারুণ! আমি তো আগে লেখাপড়াই জানতাম না!" 😄 সর্বদা হাসিখুশি থাকুন!`,
        `एक जना व्यक्तिले डाक्टरलाई सोधेछन्: "डाक्टर साब, चश्मा लगाएपछि म पढ्न सक्छु?" डाक्टरले भने: "अँ, पक्कै सक्नुहुन्छ!" व्यक्तिले खुसी हुँदै भने: "आहा कति राम्रो, पहिले त मलाई पढ्नै आउँदैनथ्यो!" 😄 सधैं मुस्कुराइरहनुहोस्!`,
        `Doktorda meo amana hangkhi: "Ei mityeng mingshen unjaraba matungda lairik paba ngamlagadra?" Doktarna hairak-i: "Hoi, yaramgani!" Mahakna haraona haikhi: "Ehai, ngallengei eidi lairik pabasu heitabaduni!" 😄 Nungsina nokpiyu!`
      );
    }

    // 6. Predefined FAQ 3: Reminders & Schedule
    if (text.includes('reminder') || text.includes('routine') || text.includes('schedule') || text.includes('medicine') || text.includes('dawa') || text.includes('dawai') || text.includes('tablet') || text.includes('pill') || text.includes('what next') || text.includes('agla') || text.includes('next task') || text.includes('kya karna')) {
      return pickLang(
        `Dear ${firstName}, your schedule is well planned. Coming up: ${reminderDataSummary}. Take everything comfortably and at your own pace! ⏰💊`,
        `प्रिय ${firstName}, आपकी दिनचर्या का पूरा ध्यान रखा गया है। आपके आगामी कार्य: ${reminderDataSummary}। आप बिल्कुल तनाव न लें, सब आराम से समय पर होगा! ⏰💊`,
        `মৰমৰ ${firstName}, আপোনাৰ দিনটোৰ সূচী সুন্দৰকৈ সজোৱা আছে। আগন্তুক কাৰ্য: ${reminderDataSummary}। সকলো কাম শান্তিৰে কৰক! ⏰💊`,
        `প্রিয় ${firstName}, আপনার দিনের রুটিন সুন্দরভাবে সাজানো আছে। পরবর্তী কাজ: ${reminderDataSummary}। কোনো চিন্তা করবেন না, সবকিছু শান্তিমতো হয়ে যাবে! ⏰💊`,
        `प्रिय ${firstName}, हजुरको तालिका राम्रोसँग मिलाइएको छ। आगामी कार्य: ${reminderDataSummary}। हजुर ढुक्क हुनुहोस्, सबै समयमै आरामले हुनेछ! ⏰💊`,
        `Nungshiba ${firstName}, nangi thabak mayam semduna leire: ${reminderDataSummary}. Tapna nungaina toubiyu! ⏰💊`
      );
    }

    // 7. Predefined FAQ 4: Caretaker & Doctor Info
    if (text.includes('doctor') || text.includes('caretaker') || text.includes('caregiver') || text.includes('dekhbhal') || text.includes('who is my doctor') || text.includes('who takes care') || text.includes('care taker')) {
      return pickLang(
        `Your loving caretaker is ${caretakerName}, and your attending doctor is ${doctorName}. They both care deeply about your comfort and happiness! 🩺🤝`,
        `आपके स्नेही देखभालकर्ता ${caretakerName} हैं और आपके चिकित्सक ${doctorName} हैं। वे दोनों आपकी सेहत और खुशी का पूरा ध्यान रखते हैं! 🩺🤝`,
        `আপোনাৰ মৰমৰ তত্ত্বাৱধায়ক ${caretakerName} আৰু চিকিৎসক ডাঃ ${doctorName}। তেওঁলোকে সদায় আপোনাৰ সুস্বাস্থ্যৰ যত্ন লয়! 🩺🤝`,
        `আপনার স্নেহের সেবাকারী ${caretakerName} এবং চিকিৎসক ডাঃ ${doctorName}। তারা সর্বদা আপনার যত্ন ও মঙ্গলের খেয়াল রাখেন! 🩺🤝`,
        `हजुरको हेरचाहकर्ता ${caretakerName} र डाक्टर ${doctorName} हुनुहुन्छ। उहाँहरू सधैं हजुरको स्वास्थ्य र सहजताको ख्याल राख्नुहुन्छ! 🩺🤝`,
        `Nangi senbiba miudi ${caretakerName}ni, amasung doctorna ${doctorName}ni. Makhoi anina nangbu nungsina senbi! 🩺🤝`
      );
    }

    // Real-time Date and Time
    if (text.includes('time') || text.includes('clock') || text.includes('kitne baje') || text.includes('samay') || text.includes('সময়')) {
      return pickLang(
        `Dear ${firstName}, the current time is ${todayTimeStr} on ${todayDateStr}. A pleasant time to relax or enjoy a gentle memory game! ⏰✨`,
        `नमस्ते ${firstName}! इस समय ${todayTimeStr} (${todayDateStr}) हुआ है। यह समय आराम करने या एक हल्का दिमागी खेल खेलने के लिए बहुत अच्छा है! ⏰✨`,
        `নমস্কাৰ ${firstName}! এতিয়া সময় ${todayTimeStr} (${todayDateStr})। এয়া জিৰণি লোৱাৰ বা স্মৃতিৰ অনুশীলন কৰাৰ উত্তম সময়! ⏰✨`,
        `নমস্কার ${firstName}! এখন সময় ${todayTimeStr} (${todayDateStr})। এটি বিশ্রাম নেওয়া বা সহজ স্মৃতিচর্চার খুব সুন্দর সময়! ⏰✨`,
        `नमस्ते ${firstName}! अहिले समय ${todayTimeStr} भएको छ। यो समय आराम गर्न वा हल्का खेल खेल्नका लागि धेरै राम्रो छ! ⏰✨`
      );
    }

    if (text.includes('what date') || text.includes('today\'s date') || text.includes('which day') || text.includes('what day is today') || text.includes('aaj kaun sa din') || text.includes('aaj ki tarikh')) {
      return pickLang(
        `Today is ${todayDateStr}. May your day be filled with calm joy, good health, and comforting memories! 📅🌸`,
        `आज की तारीख ${todayDateStr} है। आपका दिन सुखद, शांत और स्वस्थ रहे! 📅🌸`,
        `আজিৰ তাৰিখ ${todayDateStr}। আপোনাৰ দিনটো শান্তিময় আৰু আনন্দদায়ক হওক! 📅🌸`,
        `আজকের তারিখ ${todayDateStr}। আপনার আজকের দিনটি সুন্দর ও শান্তিময় কাটুক! 📅🌸`,
        `आजको मिति ${todayDateStr} हो। हजुरको दिन शान्तिमय र सुखद रहोस्! 📅🌸`
      );
    }

    // Motivation & Thought
    if (text.includes('motivat') || text.includes('thought') || text.includes('quote') || text.includes('inspire') || text.includes('wisdom')) {
      const thought = this.generateGoodThought();
      return `Here is a special thought for you today, ${firstName}: "${thought.text}" 🌻`;
    }

    // Friendly greetings
    if (text.includes('hello') || text.includes('hi') || text.includes('namaste') || text.includes('pranam') || text.includes('nomoskar')) {
      return pickLang(
        `Namaste ${firstName}! I am Saathi, your 24/7 caring companion. It is ${todayTimeStr} on ${todayDateStr}. How can I bring a smile to your heart today? 🌸`,
        `नमस्ते ${firstName}! मैं 'साथी' हूँ, आपका 24/7 स्नेही साथी। आज ${todayDateStr} है और समय ${todayTimeStr}। आज मैं आपकी क्या सेवा करूँ? 🌸`,
        `নমস্কাৰ ${firstName}! মই 'সাথী', আপোনাৰ সহায়ক সংগী। এতিয়া সময় ${todayTimeStr}। আজি আপোনাৰ মনটো কেনেকৈ আনন্দিত কৰিব পাৰোঁ? 🌸`,
        `নমস্কার ${firstName}! আমি 'সাথী', আপনার ২৪/৭ ভালোবাসার সঙ্গী। এখন সময় ${todayTimeStr}। আজ আপনার জন্য আমি কী করতে পারি? 🌸`,
        `नमस्ते ${firstName}! म 'साथी' हुँ, हजुरको २४/७ स्नेही साथी। अहिले समय ${todayTimeStr} भएको छ। आज म हजुरको सेवा कसरी गरूँ? 🌸`,
        `Khurumjari ${firstName}! Ei Saathini, nangi 24/7 marupni. Matam ${todayTimeStr} tare. Eina karamba mateng pangge? 🌸`
      );
    }

    // 8. Predefined FALLBACK CONDITION for Unknown Queries
    // "Mujhe is baare mein abhi jankari nahi hai, lekin aap chinta mat kijiye, main iski khabar [Caretaker's Name] ko de deta hoon."
    return pickLang(
      `I don't have information about this right now, but please don't worry at all—I will inform ${caretakerName} right away. 🌸`,
      `Mujhe is baare mein abhi jankari nahi hai, lekin aap chinta mat kijiye, main iski khabar ${caretakerName} ko de deta hoon.`,
      `এই বিষয়ে মোৰ এতিয়া সঠিক তথ্য জনা নাই, কিন্তু আপুনি অকণো চিন্তা নকৰিব, মই এই কথা ${caretakerName}ক জনাই দিছোঁ। 🌸`,
      `আমার এই বিষয়ে এখন জানা নেই, তবে আপনি একদম চিন্তা করবেন না, আমি এই খবরটি ${caretakerName}-কে জানিয়ে দিচ্ছি। 🌸`,
      `मलाई यस विषयमा अहिले जानकारी छैन, तर हजुरले चिन्ता नलिनुहोस्, म यो कुरा ${caretakerName}लाई खबर गरिदिन्छु। 🌸`,
      `Masi eina khangjade, adubu nangna waba tounu, eina ${caretakerName}da pao pirage! 🌸`
    );
  },

  recommendActivity(overrideMood = null, customHistory = null) {
    const games = [
      { id: 'hornbill', name: 'Hornbill Memory Nest', icon: '🦅', tag: 'Visual Working Memory', route: '#/games/hornbill', desc: 'Match gentle nature cards in the forest', area: 'Visual Memory' },
      { id: 'memory-moments', name: 'Memory Moments', icon: '📖', tag: 'Episodic Story Recall', route: '#/games/memory-moments', desc: 'Recall pleasant daily life stories and details', area: 'Story Recall' },
      { id: 'familiar-faces', name: 'Familiar Faces', icon: '👨‍👩‍👧', tag: 'Social Recognition', route: '#/games/familiar-faces', desc: 'Connect friendly faces with warm hints', area: 'Face Recognition' },
      { id: 'remember-home', name: 'Remember My Home', icon: '🏠', tag: 'Spatial Focus', route: '#/games/remember-home', desc: 'Spot and remember household objects in rooms', area: 'Spatial Memory' },
      { id: 'my-day', name: 'My Day', icon: '☀️', tag: 'Routine Sequencing', route: '#/games/my-day', desc: 'Arrange healthy daily steps in sequential order', area: 'Executive Function' },
      { id: 'listen-remember', name: 'Listen & Remember', icon: '👂', tag: 'Auditory Attention', route: '#/games/listen-remember', desc: 'Listen to clear uplifting sentences and recall words', area: 'Auditory Memory' }
    ];

    const mood = overrideMood || (Storage.getTodayMood() ? Storage.getTodayMood().mood : null);
    const history = customHistory || Storage.getGameHistory() || [];
    const hour = new Date().getHours();

    if (mood === 'low' || mood === 'worried') {
      return { ...games[2], reason: 'Recommended because you felt low or worried today — connecting with familiar friendly faces brings comfort and reassurance.' };
    }
    if (mood === 'great' || mood === 'good') {
      return { ...games[0], reason: 'Recommended because of your great positive energy today — challenge your visual memory with Hornbill Memory Nest!' };
    }
    return { ...games[5], reason: 'Recommended for a peaceful memory workout — listening to gentle sounds to refresh your thoughts.' };
  }
};

export default AIService;
