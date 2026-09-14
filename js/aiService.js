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
    const patient = profile.patient || { name: 'Meera', state: 'Assam' };
    const firstName = (patient.preferredName || patient.name || 'Friend').split(' ')[0];
    const text = (userMessage || '').trim().toLowerCase();

    const games = profile.gameHistory || [];
    const totalGames = games.length;
    const avgAcc = totalGames > 0 ? Math.round(games.reduce((s, g) => s + (g.accuracy || 0), 0) / totalGames) : 90;
    const memories = profile.memories || [];
    const family = profile.familyMembers || [];
    const medicines = profile.medicines || [];
    const istOptionsDate = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const istOptionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    const todayDateStr = new Date().toLocaleDateString('en-IN', istOptionsDate);
    const todayTimeStr = new Date().toLocaleTimeString('en-IN', istOptionsTime);

    // Safety & Crisis Handling
    if (text.includes('sos') || text.includes('emergency') || text.includes('help me') || text.includes('fall') || text.includes('chest pain') || text.includes('breathing problem') || text.includes('lost')) {
      if (currentLang === 'hi') {
        return `कृपया शांत रहें ${firstName}, आप पूर्णतः सुरक्षित हैं। तुरंत सहायता के लिए ऊपर दिए गए लाल 🛟 SOS बटन को दबाएं या राज दास को कॉल करें। हम आपके साथ हैं। 🕊️❤️`;
      }
      return `Please stay calm ${firstName}, you are safe. If this is an emergency, tap the bright red 🛟 SOS button on top to notify Emergency Services (112) or call your caregiver Raj Das immediately! 🕊️❤️`;
    }

    // Cognitive & Behavioral De-escalation (Validation over reality-checking)
    if (text.includes('mother') || text.includes('father') || text.includes('husband') || text.includes('wife') || text.includes('mom') || text.includes('dad') || text.includes('maa') || text.includes('pitaji')) {
      if (text.includes('where') || text.includes('want to see') || text.includes('kahan') || text.includes('dead') || text.includes('call')) {
        return `It brings so much warmth to hear you speak of them, ${firstName}. They loved you so very deeply. Would you like to share a sweet story of them with me, or shall we listen to some calming music together? 🌸✨`;
      }
    }

    // Medical Liability Prevention
    if (text.includes('diagnose') || text.includes('cure') || text.includes('stop medicine')) {
      return `Dear ${firstName}, SMRITI is an assistive companion, not a medical diagnostic or treatment system. Please consult your physician Dr. Barua before making any changes to your medications! 🩺💊`;
    }

    // Real-time Date and Time
    if (text.includes('time') || text.includes('clock') || text.includes('kitne baje') || text.includes('samay') || text.includes('সময়')) {
      if (currentLang === 'hi') {
        return `नमस्ते ${firstName}! इस समय ${todayTimeStr} (${todayDateStr}) हुआ है। यह समय आराम करने या एक हल्का दिमागी खेल खेलने के लिए बहुत अच्छा है! ⏰✨`;
      }
      if (currentLang === 'as') {
        return `নমস্কাৰ ${firstName}! এতিয়া সময় ${todayTimeStr} (${todayDateStr})। এয়া জিৰণি লোৱাৰ বা স্মৃতিৰ অনুশীলন কৰাৰ উত্তম সময়! ⏰✨`;
      }
      if (currentLang === 'bn') {
        return `নমস্কার ${firstName}! এখন সময় ${todayTimeStr} (${todayDateStr})। এটি বিশ্রাম নেওয়া বা সহজ স্মৃতিচর্চার খুব সুন্দর সময়! ⏰✨`;
      }
      return `Dear ${firstName}, the current time is ${todayTimeStr} on ${todayDateStr}. It's a peaceful moment to relax or do a gentle memory exercise! ⏰✨`;
    }

    if (text.includes('what date') || text.includes('today\'s date') || text.includes('which day') || text.includes('what day is today') || text.includes('aaj kaun sa din') || text.includes('aaj ki tarikh')) {
      if (currentLang === 'hi') {
        return `आज की तारीख ${todayDateStr} है। आपका दिन सुखद और शांत रहे! 📅🌸`;
      }
      return `Today is ${todayDateStr}. May your day be filled with calm joy, good health, and comforting memories! 📅🌸`;
    }

    // Dementia Education
    if (text.includes('dementia') || text.includes('what is dementia')) {
      return `Dementia is a gentle medical term describing shifts in how our brain processes memories, thoughts, and daily tasks over time. SMRITI is an assistive companion, not a diagnostic or medical replacement system. With loving routines, stimulating cognitive games, and a calm environment, seniors can live with high dignity and warmth! 🌸`;
    }

    if (text.includes('memory exercise') || text.includes('daily exercise') || text.includes('retention exercise')) {
      return `Here are 4 daily exercises for memory retention: 1) Play a cognitive game like Hornbill Memory Nest or Familiar Faces for 10 minutes every morning; 2) Practice 4-4 diaphragmatic breathing; 3) Reminisce over a Memory Vault photo; 4) Take a brisk morning walk and stay well hydrated! 🚶‍♀️💧`;
    }

    if (text.includes('game') || text.includes('play') || text.includes('score') || text.includes('progress')) {
      return `You have completed ${totalGames} cognitive sessions with ${avgAcc}% overall accuracy! I recommend playing Hornbill Memory Nest 🦅 or exploring Familiar Faces 👨‍👩‍👧 today!`;
    }

    if (text.includes('family') || text.includes('who is')) {
      const famList = family.map(f => `${f.name} (${f.relation})`).join(', ');
      return `Your loving family includes ${famList || 'Raj and Ananya'}. You are surrounded by so much warmth. 🌸👨‍👩‍👧`;
    }

    if (text.includes('medicine') || text.includes('pill')) {
      const medNames = medicines.map(m => m.name).join(', ');
      return `You have ${medicines.length} prescribed medicines in your schedule: ${medNames || 'prescribed vitamins'}. Always take them gently as Dr. Barua advised! 💊`;
    }

    if (text.includes('motivat') || text.includes('thought') || text.includes('quote') || text.includes('inspire') || text.includes('wisdom')) {
      const thought = this.generateGoodThought();
      return `Here is a special thought for you today, ${firstName}: "${thought.text}" 🌻`;
    }

    // Default regional greetings
    if (currentLang === 'hi') {
      return `नमस्ते ${firstName}! मैं आपकी क्या सहायता करूँ? हम मिलकर खेल खेल सकते हैं, सुविचार सुन सकते हैं या आपकी दिनचर्या देख सकते हैं। 🌸`;
    }
    if (currentLang === 'as') {
      return `নমস্কাৰ ${firstName}! মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ? আমি খেল খেলিব পাৰোঁ বা শুভ চিন্তা শুনিব পাৰোঁ। 🌸`;
    }
    if (currentLang === 'bn') {
      return `নমস্কার ${firstName}! আমি আপনাকে কীভাবে সাহায্য করতে পারি? আমরা খেলা খেলতে পারি বা শুভ ভাবনা শুনতে পারি। 🌸`;
    }

    return `Namaste ${firstName}! It is wonderful to chat with you. How can I assist you with your memory journey today? 🌻`;
  },

  recommendActivity(overrideMood = null, customHistory = null) {
    const games = [
      { id: 'hornbill', name: 'Hornbill Memory Nest', icon: '🦅', tag: 'Visual Working Memory', route: '#/games/hornbill', desc: 'Match gentle nature cards in the forest', area: 'Visual Memory' },
      { id: 'memory-moments', name: 'Memory Moments', icon: '📖', tag: 'Episodic Story Recall', route: '#/games/memory-moments', desc: 'Recall pleasant daily life stories and details', area: 'Story Recall' },
      { id: 'familiar-faces', name: 'Familiar Faces', icon: '👨‍👩‍👧', tag: 'Social Recognition', route: '#/games/familiar-faces', desc: 'Connect friendly faces with warm hints', area: 'Face Recognition' },
      { id: 'remember-home', name: 'Remember My Home', icon: '🏠', tag: 'Spatial Focus', route: '#/games/remember-home', desc: 'Spot and remember household objects in rooms', area: 'Spatial Memory' },
      { id: 'my-day', name: 'My Day', icon: '☀️', tag: 'Routine Sequencing', route: '#/games/my-day', desc: 'Arrange healthy daily steps in sequential order', area: 'Executive Function' },
      { id: 'listen-remember', name: 'Listen & Remember', icon: '👂', tag: 'Auditory Attention', route: '#/games/listen-remember', desc: 'Listen to clear uplifting sentences and recall words', area: 'Auditory Memory' },
      { id: 'bamboo-sequence', name: 'Bamboo Sequence', icon: '🎋', tag: 'Pattern Attention', route: '#/games/bamboo-sequence', desc: 'Repeat peaceful glowing bamboo rhythm pads', area: 'Sequential Memory' }
    ];

    const mood = overrideMood || (Storage.getTodayMood() ? Storage.getTodayMood().mood : null);
    const history = customHistory || Storage.getGameHistory() || [];
    const hour = new Date().getHours();

    if (mood === 'low' || mood === 'worried') {
      return { ...games[2], reason: 'Recommended because you felt low or worried today — connecting with familiar friendly faces brings comfort and reassurance.' };
    }
    if (mood === 'great' || mood === 'good') {
      return { ...games[6], reason: 'Recommended because of your great positive energy today — challenge your pattern memory with glowing bamboo rhythms!' };
    }
    return { ...games[0], reason: 'Recommended for a peaceful memory workout — matching nature cards to refresh your thoughts.' };
  }
};

export default AIService;
