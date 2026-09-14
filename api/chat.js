/* ============================================================
   SMRITI — Serverless AI Chat API Route (/api/chat)
   Multi-Tier Resilient Fallback Engine:
     Tier 1: Local RAG (data/qa_knowledge.json)
     Tier 2: Primary LLM (OpenAI gpt-4o-mini with 16 Function Tools)
     Tier 3: Fallback LLM (Google Gemini 1.5 Flash)
     Tier 4: Dynamic Contextual Synthesis Engine
   Strict Persona System Prompt & Language Enforcement.
   ============================================================ */

const OPENAI_TOOLS = [
  {
    type: "function",
    function: {
      name: "getPatientProfile",
      description: "Get the current patient's profile details, stage of impairment, and preferences.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getFamilyMembers",
      description: "Get the list of family members, relations, and emergency contacts.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getTodayRoutine",
      description: "Get today's scheduled routines, tasks, and completion status.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "createReminder",
      description: "Create a new reminder or medicine task for the patient.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the reminder (e.g., Morning medicine, Drink water)" },
          time: { type: "string", description: "Time in HH:MM format (24h or 12h)" },
          category: { type: "string", description: "Category: medicine, hydration, routine, exercise, appointment" }
        },
        required: ["title", "time"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getGameProgress",
      description: "Get game history, total cognitive sessions, and average accuracy.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "startGame",
      description: "Launch or navigate to a specific cognitive game in SMRITI.",
      parameters: {
        type: "object",
        properties: {
          gameId: {
            type: "string",
            enum: ["hornbill", "memory-moments", "familiar-faces", "remember-home", "my-day", "listen-remember", "bamboo-sequence"],
            description: "Identifier of the game to start"
          }
        },
        required: ["gameId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCurrentDate",
      description: "Get the current date, day, and time in Indian Standard Time (IST).",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "triggerSOS",
      description: "Trigger an emergency SOS alert to caregivers and emergency services.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Optional reason for emergency" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getWeeklyInsights",
      description: "Get cognitive performance trends and weekly insights for the patient or caregiver.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "updateDifficulty",
      description: "Update the game difficulty setting.",
      parameters: {
        type: "object",
        properties: {
          level: { type: "string", enum: ["easy", "medium", "hard"], description: "Difficulty level" }
        },
        required: ["level"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "updateLanguage",
      description: "Change the platform and conversation language.",
      parameters: {
        type: "object",
        properties: {
          languageCode: {
            type: "string",
            enum: ["en", "hi", "as", "bn", "ta", "te", "mr", "gu", "kn", "mni", "kha", "lus"],
            description: "Language code"
          }
        },
        required: ["languageCode"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "updateAccessibilitySettings",
      description: "Update accessibility preferences such as high contrast, large text, or sound effects.",
      parameters: {
        type: "object",
        properties: {
          highContrast: { type: "boolean" },
          fontSize: { type: "string", enum: ["normal", "large", "extra-large"] },
          soundEnabled: { type: "boolean" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getGameRules",
      description: "Get the rules, objectives, and tips for any SMRITI game.",
      parameters: {
        type: "object",
        properties: {
          gameId: {
            type: "string",
            enum: ["hornbill", "memory-moments", "familiar-faces", "remember-home", "my-day", "listen-remember", "bamboo-sequence"],
            description: "Identifier of the game"
          }
        },
        required: ["gameId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCurrentGameState",
      description: "Get the state of the currently active game (if any).",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "giveGameHint",
      description: "Provide a helpful, encouraging hint for the current cognitive game.",
      parameters: {
        type: "object",
        properties: {
          gameId: { type: "string" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "saveGameResult",
      description: "Record and save the result of a completed cognitive game session.",
      parameters: {
        type: "object",
        properties: {
          gameId: { type: "string" },
          score: { type: "number" },
          accuracy: { type: "number" }
        },
        required: ["gameId", "accuracy"]
      }
    }
  }
];

function generateContextualResponse(message, profile, role, lang = 'en', todayDateStr, todayTimeStr) {
  const patient = (profile && profile.patient) || { name: 'Meera', state: 'Assam' };
  const firstName = (patient.preferredName || patient.name || 'Friend').split(' ')[0];
  const text = (message || '').trim().toLowerCase();

  const games = (profile && profile.gameHistory) || [];
  const totalGames = games.length;
  const avgAcc = totalGames > 0 ? Math.round(games.reduce((s, g) => s + (g.accuracy || 0), 0) / totalGames) : 90;
  const recentGame = games[games.length - 1];
  
  const memories = (profile && profile.memories) || [];
  const family = (profile && profile.familyMembers) || [];
  const reminders = (profile && profile.reminders) || [];
  const medicines = (profile && profile.medicines) || [];
  const state = profile?.preferences?.regionalState || patient.state || 'Assam';

  // 1. Safety, Crisis & Urgent Distress Handling
  if (text.includes('sos') || text.includes('emergency') || text.includes('help me') || text.includes('fall') || text.includes('chest pain') || text.includes('breathing problem') || text.includes('i am lost') || text.includes('lost')) {
    if (lang === 'hi') {
      return `कृपया शांत रहें ${firstName}, आप पूर्णतः सुरक्षित हैं। यदि आपको तुरंत सहायता चाहिए, तो ऊपर दिए गए लाल 🛟 SOS बटन को दबाएं या अपने बेटे राज दास को कॉल करें। हम हमेशा आपके साथ हैं। 🕊️❤️`;
    }
    if (lang === 'as') {
      return `অনুগ্ৰহ কৰি শান্ত থাকক ${firstName}, আপুনি সুৰক্ষিত। জৰুৰী সহায়ৰ বাবে ওপৰৰ ৰঙা 🛟 SOS বুটামটো টিপক বা পুত্ৰ ৰাজ দাসক যোগাযোগ কৰক। 🕊️❤️`;
    }
    if (lang === 'bn') {
      return `দয়া করে শান্ত থাকুন ${firstName}, আপনি নিরাপদ। জরুরি প্রয়োজনে ওপরের লাল 🛟 SOS বোতামটি চেপে আপনার পরিবার বা জরুরি সেবাকে জানান। 🕊️❤️`;
    }
    return `Please stay calm ${firstName}, you are completely safe. If you need immediate assistance, tap the bright red 🛟 SOS button on top to notify Emergency Services (112) or call your caregiver Raj Das right away. We are right here beside you. 🕊️❤️`;
  }

  // 2. Cognitive & Behavioral De-escalation (Validation Therapy over harsh reality-checking)
  if (text.includes('where is my mother') || text.includes('where is my father') || text.includes('where is my husband') || text.includes('where is my wife') || text.includes('i want to see my mother') || text.includes('where is mom') || text.includes('where is dad') || text.includes('maa kahan') || text.includes('pitaji kahan') || text.includes('dead') || text.includes('deceased')) {
    if (lang === 'hi') {
      return `आपकी बातें सुनकर बहुत अच्छा लगा ${firstName}। वे आपसे कितना अपार स्नेह करते थे! क्या आप मुझे उनके बारे में कुछ मीठी यादें सुनाना पसंद करेंगे? या हम साथ में बांसुरी का मधुर संगीत सुनें? 🌸✨`;
    }
    if (lang === 'as') {
      return `তেওঁলোকৰ কথা শুনি মনটো মৰমেৰে ভৰি পৰিল ${firstName}। তেওঁলোকে আপোনাক কিমান মৰম কৰিছিল! আপুনি তেওঁলোকৰ এটা সুন্দৰ স্মৃতি ক’ব নেকি বা আমি বাঁহীৰ সুৰ শুনো? 🌸✨`;
    }
    if (lang === 'bn') {
      return `তাদের কথা ভেবে মনটা ভালো হয়ে গেল ${firstName}। তারা আপনাকে কতটা ভালোবাসতেন! আপনি কি তাদের কোনো সুন্দর স্মৃতির কথা বলবেন, নাকি আমরা একসাথে মিষ্টি গান শুনব? 🌸✨`;
    }
    return `It brings so much warmth to hear you speak of them, ${firstName}. They loved you so very deeply. Would you like to share a sweet memory of them with me, or shall we listen to some calming bansuri music together? 🌸✨`;
  }

  // 3. Medical Liability Prevention
  if (text.includes('diagnose') || text.includes('cure') || text.includes('stop taking medicine') || text.includes('what disease do i have') || text.includes('dawa chhod')) {
    return `Dear ${firstName}, SMRITI is an assistive memory and cognitive companion, not a diagnostic or medical replacement system. Please consult your physician Dr. Barua before making any changes to your medication or healthcare plan! 🩺💊`;
  }

  // Role-specific clinical inquiry
  if (role === 'doctor') {
    return `Clinical Overview for ${patient.name} (${patient.stage || 'Mild MCI'}): ${totalGames} cognitive sessions recorded with ${avgAcc}% overall accuracy as of ${todayDateStr}. Adherence to prescribed routine is stable with ${medicines.length} active prescriptions. Recommended focus: episodic recall and gentle morning stimulation.`;
  }
  if (role === 'caregiver') {
    return `Caregiver Summary (${todayDateStr}, ${todayTimeStr}): ${patient.name} has played ${totalGames} sessions recently. Best consistency in ${recentGame ? recentGame.gameName : 'Visual Memory'}. ${reminders.filter(r => r.active).length} daily reminders are active.`;
  }

  // Date & Time queries
  if (text.includes('time') || text.includes('clock') || text.includes('kitne baje') || text.includes('samay') || text.includes('সময়')) {
    if (lang === 'hi') {
      return `नमस्ते ${firstName}! इस समय ${todayTimeStr} (${todayDateStr}) हुआ है। यह समय आराम करने या एक हल्का दिमागी खेल खेलने के लिए बहुत अच्छा है! ⏰✨`;
    }
    if (lang === 'as') {
      return `নমস্কাৰ ${firstName}! এতিয়া সময় ${todayTimeStr} (${todayDateStr})। এয়া জিৰণি লোৱাৰ বা স্মৃতিৰ অনুশীলন কৰাৰ উত্তম সময়! ⏰✨`;
    }
    if (lang === 'bn') {
      return `নমস্কার ${firstName}! এখন সময় ${todayTimeStr} (${todayDateStr})। এটি বিশ্রাম নেওয়া বা সহজ স্মৃতিচর্চার খুব সুন্দর সময়! ⏰✨`;
    }
    return `Dear ${firstName}, the current time is ${todayTimeStr} on ${todayDateStr}. It's a peaceful moment to relax or do a gentle memory exercise! ⏰✨`;
  }
  if (text.includes('what date') || text.includes('today\'s date') || text.includes('which day') || text.includes('what day is today') || text.includes('aaj kaun sa din') || text.includes('aaj ki tarikh')) {
    if (lang === 'hi') {
      return `आज की तारीख ${todayDateStr} है। आपका दिन सुखद और शांत रहे! 📅🌸`;
    }
    return `Today is ${todayDateStr}. May your day be filled with calm joy, good health, and comforting memories! 📅🌸`;
  }

  // Clinical & Memory Knowledge
  if (text.includes('dementia') || text.includes('what is dementia')) {
    return `Dementia is a gentle medical term describing shifts in how our brain processes memories, thoughts, and daily tasks over time. SMRITI is a memory assistance companion, not a medical diagnostic or replacement system. With loving routines, cognitive games, and a calm environment, seniors can live with high dignity! 🌸`;
  }

  if (text.includes('memory reduction') || text.includes('memory loss') || text.includes('why memory fades') || text.includes('forgetting') || text.includes('memory reduce')) {
    return `Memory reduction happens when neural connections slow down due to aging, natural shifts, or stress. Engaging your mind with games, recalling family memories, and sound sleep keeps those neuronal bridges active! 🧠✨`;
  }

  if (text.includes('daily exercise') || text.includes('memory retention') || text.includes('brain exercise') || text.includes('retention exercise') || text.includes('exercises for memory')) {
    return `Here are 4 daily exercises for memory retention: 1) Play a cognitive game like Hornbill Memory Nest or Familiar Faces for 10 minutes every morning; 2) Practice 4-4 diaphragmatic breathing; 3) Reminisce over a Memory Vault photo; 4) Take a fresh morning walk and stay well hydrated! 🚶‍♀️💧`;
  }

  if (text.includes('medicine') || text.includes('pill') || text.includes('tablet')) {
    const medNames = medicines.map(m => m.name).join(', ');
    return `Dear ${firstName}, according to your routine on ${todayDateStr}, you have ${medicines.length} prescribed items (${medNames || 'prescribed vitamins'}). Please take them as advised by Dr. Barua! 💊`;
  }

  if (text.includes('family') || text.includes('who is') || text.includes('children') || text.includes('son') || text.includes('daughter')) {
    const famNames = family.map(f => `${f.name} (${f.relation})`).join(', ');
    return `Your loving family members include ${famNames || 'Raj and Ananya'}. You are surrounded by so much warmth and care. 🌸👨‍👩‍👧`;
  }

  if (text.includes('memory') || text.includes('remember') || text.includes('photo') || text.includes('story')) {
    if (memories.length > 0) {
      const m = memories[Math.floor(Math.random() * memories.length)];
      return `I love reminiscing with you, ${firstName}! Do you remember ${m.title}? ${m.story.slice(0, 140)}... It is such a cherished treasure in your Memory Vault. 🖼️✨`;
    }
    return `Your life stories and memories are safely kept in your Memory Vault, ${firstName}. What favorite memory would you like to reflect on today?`;
  }

  if (text.includes('sad') || text.includes('lonely') || text.includes('low') || text.includes('upset') || text.includes('worried')) {
    return `I'm right here with you, ${firstName}. It is completely natural to have moments like this. Would you like to take a slow, calming breath together, or listen to a sweet folk story from ${state}? You are deeply cherished and never alone. 🌿❤️`;
  }

  if (text.includes('game') || text.includes('play') || text.includes('score') || text.includes('progress')) {
    return `You're doing wonderfully, ${firstName}! You have completed ${totalGames} mindful sessions with an average accuracy of ${avgAcc}%. How about playing Hornbill Memory Nest or visiting Familiar Faces today? 🦅✨`;
  }

  // Regional language fallback greetings
  if (lang === 'hi') {
    return `नमस्ते ${firstName}! इस समय ${todayTimeStr} बजा है। आपकी स्मृति अभ्यास यात्रा बहुत अच्छी चल रही है। आज मैं आपकी क्या सहायता करूँ? 🌸`;
  }
  if (lang === 'as') {
    return `নমস্কাৰ ${firstName}! এতিয়া সময় ${todayTimeStr}। আপোনাৰ স্মৃতিৰ অনুশীলন অতি সুন্দৰকৈ চলি আছে। আজি আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ? 🌸`;
  }
  if (lang === 'bn') {
    return `নমস্কার ${firstName}! এখন সময় ${todayTimeStr}। আপনার স্মৃতি অনুশীলন দারুণ চলছে। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি? 🌸`;
  }

  return `Namaste ${firstName}! It is ${todayTimeStr} on ${todayDateStr}. You have completed ${totalGames} memory sessions so far. How can I brighten your day right now? 🌻`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const data = body ? JSON.parse(body) : {};
      const { message, patientProfile, role, stream, currentLanguage, language } = data;
      const activeLang = currentLanguage || language || 'en';

      const langMap = {
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
      const activeLangName = langMap[activeLang] || activeLang;

      const istOptionsDate = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const istOptionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
      const todayDate = data.currentDate || new Date().toLocaleDateString('en-IN', istOptionsDate);
      const todayTime = data.currentTime || new Date().toLocaleTimeString('en-IN', istOptionsTime);

      const patient = patientProfile?.patient || { name: 'Meera Das', state: 'Assam' };
      const games = patientProfile?.gameHistory || [];
      const totalGames = games.length;
      const avgAcc = totalGames > 0 ? Math.round(games.reduce((s, g) => s + (g.accuracy || 0), 0) / totalGames) : 90;
      const reminders = patientProfile?.reminders || [];
      const completedTasks = reminders.filter(r => r.completedToday).length;
      const totalTasks = reminders.length;
      const moods = patientProfile?.moodHistory || [];
      const latestMood = moods.length > 0 ? moods[moods.length - 1].mood : 'good';

      // EXACT SYSTEM PROMPT REQUIRED BY ARCHITECTURE SPECIFICATION
      const systemPrompt = `You are SMRITI SAATHI, the AI companion of the SMRITI cognitive memory assistance platform. Answer questions about SMRITI, its website, games, memory vault, routines, reminders, accessibility, multilingual features, voice interaction, caregiver features, insights, AI architecture, RAG, SIH problem statement and project implementation. When connected to application functions, use real application data and function calls rather than inventing information. Never fabricate a user's family member, routine, score, reminder, medical condition or game result. For dementia-related questions, provide general educational information and clearly state that SMRITI is not a diagnostic, treatment or medical replacement system. Follow validation therapy principles: never harshly contradict, argue, or shock the senior (for example, if they ask about deceased loved ones, validate their deep emotional bond and gently redirect to comforting memories or peaceful music). For urgent emergencies, immediately reassure them and trigger triggerSOS or advise calling caregiver Raj Das. If the user asks something outside the available knowledge, say that you do not have verified information rather than hallucinating. Keep responses simple, warm, respectful and elderly-friendly. You must translate and respond ONLY in this exact language: ${activeLangName}. Never silently switch languages. When the user asks to perform an application action, use the appropriate function instead of merely explaining how to do it.

Real-Time Platform Context:
- Current Date & Time (IST): ${todayDate}, ${todayTime}
- Patient Profile: ${patient.name} (Role: ${role || 'patient'}, Stage: ${patient.stage || 'Mild Cognitive Impairment'})
- Region / Culture: ${patientProfile?.preferences?.regionalState || patient.state || 'Assam'}
- Total Cognitive Games Played: ${totalGames}, Average Accuracy: ${avgAcc}%
- Daily Tasks Completed: ${completedTasks} / ${totalTasks}
- Current Mood: ${latestMood}
- Family Members: ${JSON.stringify(patientProfile?.familyMembers || [])}
- Active Prescriptions: ${JSON.stringify(patientProfile?.medicines || [])}
- Cherished Memories: ${JSON.stringify(patientProfile?.memories || [])}`;

      // ==========================================================
      // TIER 1: LOCAL RAG KNOWLEDGE BASE MATCHING
      // ==========================================================
      try {
        const path = require('path');
        const fs = require('fs');
        const qaPath = path.join(__dirname, '../data/qa_knowledge.json');
        if (fs.existsSync(qaPath)) {
          const qaData = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
          const cleanMsg = (message || '').toLowerCase().trim();
          let matchedTopic = null;

          for (const topic of (qaData.topics || [])) {
            if (Array.isArray(topic.keywords) && topic.keywords.some(kw => cleanMsg.includes(kw.toLowerCase()))) {
              matchedTopic = topic;
              break;
            }
          }

          if (matchedTopic) {
            const topicReply = (matchedTopic.responses && (matchedTopic.responses[activeLang] || matchedTopic.responses.en)) || '';
            if (topicReply) {
              const toolCallsForTopic = [];
              if (cleanMsg.includes('play hornbill') || cleanMsg.includes('start hornbill') || (matchedTopic.id === 'game_rules_hornbill' && (cleanMsg.includes('play') || cleanMsg.includes('start') || cleanMsg.includes('want')))) {
                toolCallsForTopic.push({ name: 'startGame', args: { gameId: 'hornbill' } });
              } else if (cleanMsg.includes('play familiar') || cleanMsg.includes('start familiar') || (matchedTopic.id === 'game_rules_familiar_faces' && (cleanMsg.includes('play') || cleanMsg.includes('start')))) {
                toolCallsForTopic.push({ name: 'startGame', args: { gameId: 'familiar-faces' } });
              } else if (matchedTopic.id === 'emergency_help' && (cleanMsg.includes('sos') || cleanMsg.includes('emergency') || cleanMsg.includes('help'))) {
                toolCallsForTopic.push({ name: 'triggerSOS', args: { reason: 'User requested emergency assistance' } });
              }

              if (stream) {
                res.writeHead(200, {
                  'Content-Type': 'text/event-stream',
                  'Cache-Control': 'no-cache',
                  'Connection': 'keep-alive'
                });
                const words = topicReply.split(' ');
                let wIdx = 0;
                const timer = setInterval(() => {
                  if (wIdx < words.length) {
                    const chunk = (wIdx > 0 ? ' ' : '') + words[wIdx];
                    res.write('data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: chunk }] } }] }) + '\n\n');
                    wIdx++;
                  } else {
                    clearInterval(timer);
                    if (toolCallsForTopic.length > 0) {
                      res.write('data: ' + JSON.stringify({ tool_calls: toolCallsForTopic }) + '\n\n');
                    }
                    res.write('data: [DONE]\n\n');
                    res.end();
                  }
                }, 30);
                return;
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  reply: topicReply,
                  tool_calls: toolCallsForTopic.length > 0 ? toolCallsForTopic : undefined,
                  source: 'local_rag_knowledge'
                }));
                return;
              }
            }
          }
        }
      } catch (ragErr) {
        console.warn('Tier 1 Local RAG error:', ragErr.message);
      }

      // ==========================================================
      // TIER 2: PRIMARY LLM (OpenAI gpt-4o-mini with 16 Tools)
      // ==========================================================
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        try {
          const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message || 'Hello' }
              ],
              tools: OPENAI_TOOLS,
              tool_choice: 'auto',
              temperature: 0.6,
              max_tokens: 350
            })
          });

          if (openaiRes.ok) {
            const result = await openaiRes.json();
            const choice = result?.choices?.[0];
            const messageObj = choice?.message;

            if (messageObj) {
              const toolCalls = messageObj.tool_calls;
              const textContent = messageObj.content || '';

              if (toolCalls && toolCalls.length > 0) {
                // OpenAI issued one or more function calls!
                const parsedToolCalls = toolCalls.map(tc => ({
                  id: tc.id,
                  name: tc.function.name,
                  args: (() => {
                    try { return JSON.parse(tc.function.arguments); } catch { return {}; }
                  })()
                }));

                // Return both text (if any) and tool calls for client-side execution loop
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  reply: textContent || `Executing ${parsedToolCalls.map(t => t.name).join(', ')}...`,
                  tool_calls: parsedToolCalls,
                  source: 'openai_gpt4o_mini'
                }));
                return;
              }

              if (textContent) {
                if (stream) {
                  res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                  });
                  const words = textContent.split(' ');
                  let wIdx = 0;
                  const streamTimer = setInterval(() => {
                    if (wIdx < words.length) {
                      const chunk = (wIdx > 0 ? ' ' : '') + words[wIdx];
                      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`);
                      wIdx++;
                    } else {
                      clearInterval(streamTimer);
                      res.write('data: [DONE]\n\n');
                      res.end();
                    }
                  }, 25);
                  return;
                } else {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ reply: textContent, source: 'openai_gpt4o_mini' }));
                  return;
                }
              }
            }
          } else {
            console.warn('Tier 2 OpenAI response non-ok status:', openaiRes.status);
          }
        } catch (openaiErr) {
          console.warn('Tier 2 OpenAI error, falling back to Tier 3:', openaiErr.message);
        }
      }

      // ==========================================================
      // TIER 3: FALLBACK LLM (Google Gemini 1.5 Flash)
      // ==========================================================
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          if (stream) {
            const geminiStreamUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${geminiKey}`;
            const geminiRes = await fetch(geminiStreamUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: message || 'Namaste' }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
              })
            });

            if (geminiRes.ok && geminiRes.body) {
              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
              });

              const reader = geminiRes.body.getReader ? geminiRes.body.getReader() : null;
              if (reader) {
                const decoder = new TextDecoder();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const chunk = decoder.decode(value, { stream: true });
                  res.write(chunk);
                }
                res.end();
                return;
              }
            }
          } else {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: message || 'Namaste' }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
              })
            });

            if (geminiRes.ok) {
              const result = await geminiRes.json();
              const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ reply: text, source: 'gemini_fallback' }));
                return;
              }
            }
          }
        } catch (geminiErr) {
          console.warn('Tier 3 Gemini error, falling back to Tier 4:', geminiErr.message);
        }
      }

      // ==========================================================
      // TIER 4: DYNAMIC CONTEXTUAL SYNTHESIS ENGINE
      // ==========================================================
      const reply = generateContextualResponse(message, patientProfile, role, activeLang, todayDate, todayTime);

      // Check if message matched an action intent to provide tool_calls locally
      const cleanLower = (message || '').toLowerCase();
      let localToolCalls = [];
      if (cleanLower.includes('play hornbill') || cleanLower.includes('start hornbill') || cleanLower.includes('hornbill game')) {
        localToolCalls.push({ name: 'startGame', args: { gameId: 'hornbill' } });
      } else if (cleanLower.includes('play familiar') || cleanLower.includes('familiar faces')) {
        localToolCalls.push({ name: 'startGame', args: { gameId: 'familiar-faces' } });
      } else if (cleanLower.includes('play memory moments') || cleanLower.includes('story game')) {
        localToolCalls.push({ name: 'startGame', args: { gameId: 'memory-moments' } });
      } else if (cleanLower.includes('sos') || cleanLower.includes('emergency') || cleanLower.includes('help me call')) {
        localToolCalls.push({ name: 'triggerSOS', args: { reason: 'User requested emergency assistance' } });
      } else if (cleanLower.includes('switch to hindi') || cleanLower.includes('hindi language')) {
        localToolCalls.push({ name: 'updateLanguage', args: { languageCode: 'hi' } });
      }

      if (stream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        const words = reply.split(' ');
        let wordIndex = 0;
        const streamTimer = setInterval(() => {
          if (wordIndex < words.length) {
            const word = (wordIndex > 0 ? ' ' : '') + words[wordIndex];
            res.write(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: word }] } }] })}\n\n`);
            wordIndex++;
          } else {
            clearInterval(streamTimer);
            if (localToolCalls.length > 0) {
              res.write(`data: ${JSON.stringify({ tool_calls: localToolCalls })}\n\n`);
            }
            res.write('data: [DONE]\n\n');
            res.end();
          }
        }, 35);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        reply,
        tool_calls: localToolCalls.length > 0 ? localToolCalls : undefined,
        source: 'contextual_engine'
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body: ' + err.message }));
    }
  });
};
