/* ============================================================
   SMRITI — Serverless AI Chat API Route (/api/chat)
   Supports Gemini (with stream: true SSE), OpenAI, or dynamic context fallback.
   Dynamically injects date, time, medical context, and real patient profile.
   ============================================================ */

function generateContextualResponse(message, profile, role, lang = 'en') {
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

  const istOptionsDate = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const istOptionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
  const todayDateStr = new Date().toLocaleDateString('en-IN', istOptionsDate);
  const todayTimeStr = new Date().toLocaleTimeString('en-IN', istOptionsTime);

  // 1. Role-specific clinical or caregiver inquiry
  if (role === 'doctor') {
    return `Clinical Overview for ${patient.name} (${patient.stage || 'Mild MCI'}): ${totalGames} cognitive sessions recorded with ${avgAcc}% overall accuracy as of ${todayDateStr}. Adherence to prescribed routine is stable with ${medicines.length} active prescriptions. Recommended focus: episodic recall and gentle morning stimulation.`;
  }
  if (role === 'caregiver') {
    return `Caregiver Summary (${todayDateStr}, ${todayTimeStr}): ${patient.name} has played ${totalGames} sessions recently. Best consistency in ${recentGame ? recentGame.gameName : 'Visual Memory'}. ${reminders.filter(r => r.active).length} daily reminders are active.`;
  }

  // 2. Date & Time queries
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

  // 3. Specialized Clinical & Memory Knowledge Base
  if (text.includes('dementia') || text.includes('what is dementia')) {
    return `Dementia is a gentle medical term describing shifts in how our brain processes memories, thoughts, and daily tasks. It is not a personal failing—it is simply changes in brain connections over time. With loving routines, stimulating cognitive games, and a calm environment, seniors can live with high dignity and warmth! 🌸`;
  }

  if (text.includes('memory reduction') || text.includes('memory loss') || text.includes('why memory fades') || text.includes('forgetting') || text.includes('memory reduce')) {
    return `Memory reduction happens when the delicate pathways (synapses) between brain neurons slow down or become less active due to aging, natural protein changes, or stress. Just like gentle morning exercise keeps our legs agile, engaging your mind through games, recalling family memories, and sound sleep keeps those neuronal bridges active! 🧠✨`;
  }

  if (text.includes('daily exercise') || text.includes('memory retention') || text.includes('brain exercise') || text.includes('retention exercise') || text.includes('exercises for memory')) {
    return `Here are 4 proven daily exercises for memory retention: 1) Play a cognitive game like Hornbill Memory Nest or Familiar Faces for 10 minutes every morning; 2) Practice 4-4 diaphragmatic breathing to oxygenate brain tissue; 3) Reminisce over one Life Story photo daily with a loved one; 4) Take a brisk morning walk and stay well hydrated! 🚶‍♀️💧`;
  }

  // 4. Patient conversational intent
  if (text.includes('medicine') || text.includes('pill') || text.includes('tablet')) {
    const medNames = medicines.map(m => m.name).join(', ');
    return `Dear ${firstName}, according to your routine on ${todayDateStr}, you have ${medicines.length} prescribed items (${medNames}). Your morning medicine is scheduled with a warm glass of water. Remember to take it gently as Dr. Barua advised! 💊`;
  }

  if (text.includes('family') || text.includes('who is') || text.includes('children') || text.includes('son') || text.includes('daughter')) {
    const famNames = family.map(f => `${f.name} (${f.relation})`).join(', ');
    return `Your loving family members include ${famNames}. Raj often visits on weekends with tea, and Ananya loves calling you from Shillong! You are surrounded by so much warmth and care. 🌸👨‍👩‍👧`;
  }

  if (text.includes('memory') || text.includes('remember') || text.includes('photo') || text.includes('story')) {
    if (memories.length > 0) {
      const m = memories[Math.floor(Math.random() * memories.length)];
      return `I love reminiscing with you, ${firstName}! Do you remember ${m.title}? ${m.story.slice(0, 140)}... It is such a cherished treasure in your Life Story. 🖼️✨`;
    }
    return `Your life stories and memories are safely kept in your Life Story album, ${firstName}. What favorite memory would you like to reflect on today?`;
  }

  if (text.includes('sad') || text.includes('lonely') || text.includes('low') || text.includes('upset') || text.includes('worried')) {
    return `I'm right here with you, ${firstName}. It is completely natural to have moments like this. Would you like to take a slow, calming breath together, or listen to a sweet folk story from ${state}? You are deeply cherished and never alone. 🌿❤️`;
  }

  if (text.includes('game') || text.includes('play') || text.includes('score') || text.includes('progress')) {
    return `You're doing wonderfully, ${firstName}! You have completed ${totalGames} mindful sessions with an average accuracy of ${avgAcc}%. How about playing Hornbill Memory Nest or visiting Familiar Faces today? 🦅✨`;
  }

  if (text.includes('joke') || text.includes('laugh')) {
    const jokes = [
      'Why did the teapot whistle so merrily in Assam? Because it couldn\'t wait to pour out fresh joy for you! ☕😄',
      'What did one orchid say to the morning sun? "I am so glad we get to blossom together today!" 🌺😊',
      'Why did the grandfather clock go to school? To learn how to make every second count! ⏰😁'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // General warm, context-aware personalized fallback strictly in selected language
  if (lang === 'hi') {
    return `नमस्ते ${firstName}! इस समय ${todayTimeStr} बजा है। आपकी स्मृति अभ्यास यात्रा बहुत अच्छी चल रही है। आज मैं आपकी क्या सहायता करूँ? 🌸`;
  }
  if (lang === 'as') {
    return `নমস্কাৰ ${firstName}! এতিয়া সময় ${todayTimeStr}। আপোনাৰ স্মৃতিৰ অনুশীলন অতি সুন্দৰকৈ চলি আছে। আজি আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ? 🌸`;
  }
  if (lang === 'bn') {
    return `নমস্কার ${firstName}! এখন সময় ${todayTimeStr}। আপনার স্মৃতি অনুশীলন দারুণ চলছে। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি? 🌸`;
  }

  const generalGreetings = [
    `Namaste ${firstName}! It is ${todayTimeStr} on ${todayDateStr}. You have completed ${totalGames} memory sessions so far. How can I brighten your day right now? 🌻`,
    `Hello ${firstName}! I am right here with you. Your wellness journey in ${state} is going so well. Would you like to hear an inspiring story or revisit family photos? 🕊️`,
    `Joyful day to you, ${firstName}! We can practice deep breathing, review your morning routine, or share a cheerful laugh. What is on your mind? 🌸`
  ];
  return generalGreetings[Math.floor(Math.random() * generalGreetings.length)];
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

      // 1. DYNAMIC SYSTEM PROMPT WITH TIME, DATE, AND PATIENT PROFILE CONTEXT
      const systemPrompt = `You are SWAI (Smriti Wisdom AI), a warm, compassionate, and attentive memory care companion in the SMRITI elderly care platform.
Current Real-Time Context:
- Current Date: ${todayDate}
- Current Local Time: ${todayTime}
- User Profile: ${patient.name} (Role: ${role || 'patient'}, Stage: ${patient.stage || 'Mild Cognitive Impairment / Healthy Senior'})
- Region / Cultural State: ${patientProfile?.preferences?.regionalState || patient.state || 'Assam'}
- Cognitive Stats: ${totalGames} games completed, Average Accuracy: ${avgAcc}%
- Daily Routine: ${completedTasks} of ${totalTasks} tasks completed today
- Latest Mood: ${latestMood}
- Family Members: ${JSON.stringify(patientProfile?.familyMembers || [])}
- Prescriptions: ${JSON.stringify(patientProfile?.medicines || [])}
- Cherished Memories: ${JSON.stringify(patientProfile?.memories || [])}

Directives:
1. STRICT LANGUAGE ENFORCEMENT: You must respond ONLY in the following language: ${langName} (${activeLang}). All words, greetings, answers, and emotional cues MUST be completely written in ${langName}.
2. Always be warm, respectful, and empathetic (use culturally comforting Indian cues appropriate for ${langName}).
3. Answer questions about current time, date, family, and progress using the real-time context above.
4. Keep answers concise, clear, and reassuring (maximum 2-3 sentences).
5. Never provide medical diagnoses or alter prescriptions; always encourage consulting Dr. Barua or family for clinical changes.`;

      // 1.5 HYBRID LOCAL KNOWLEDGE BASE LOOKUP
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
                    res.write('data: [DONE]\n\n');
                    res.end();
                  }
                }, 30);
                return;
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ reply: topicReply, source: 'local_qa_knowledge' }));
                return;
              }
            }
          }
        }
      } catch (qaErr) {
        console.warn('Local QA knowledge match error:', qaErr.message);
      }

      // 2. Google Gemini API Integration (with stream: true SSE support)
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          if (stream) {
            // Streaming via Gemini generateContent SSE
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
                res.end(JSON.stringify({ reply: text, source: 'gemini' }));
                return;
              }
            }
          }
        } catch (geminiErr) {
          console.warn('Gemini API call error:', geminiErr.message);
        }
      }

      // 3. OpenAI API Integration fallback
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              max_tokens: 220,
              temperature: 0.7
            })
          });

          if (response.ok) {
            const apiRes = await response.json();
            const text = apiRes.choices[0]?.message?.content;
            if (text) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ reply: text, source: 'openai' }));
              return;
            }
          }
        } catch (llmErr) {
          console.warn('OpenAI call failed, falling back to contextual generator:', llmErr.message);
        }
      }

      // 4. Intelligent Context-Aware Synthesis Engine (Local / Server fallback)
      const reply = generateContextualResponse(message, patientProfile, role, activeLang);

      if (stream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        // Stream out words progressively to fulfill stream contracts
        const words = reply.split(' ');
        let wordIndex = 0;
        const streamTimer = setInterval(() => {
          if (wordIndex < words.length) {
            const word = (wordIndex > 0 ? ' ' : '') + words[wordIndex];
            res.write(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: word }] } }] })}\n\n`);
            wordIndex++;
          } else {
            clearInterval(streamTimer);
            res.write('data: [DONE]\n\n');
            res.end();
          }
        }, 35);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply, source: 'context_engine' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body: ' + err.message }));
    }
  });
};
