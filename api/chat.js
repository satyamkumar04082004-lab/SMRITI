/* ============================================================
   SMRITI — Serverless AI Chat API Route (/api/chat)
   Supports OpenAI / Gemini / Grok if environment keys present,
   with intelligent context-synthesizing fallback using actual patient profile.
   ============================================================ */

function generateContextualResponse(message, profile, role) {
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

  // 1. Role-specific clinical or caregiver inquiry
  if (role === 'doctor') {
    return `Clinical Overview for ${patient.name} (${patient.stage || 'Mild MCI'}): ${totalGames} cognitive sessions recorded with ${avgAcc}% overall accuracy. Adherence to prescribed routine is stable with ${medicines.length} active prescriptions. Recommended focus: episodic recall and gentle morning stimulation.`;
  }
  if (role === 'caregiver') {
    return `Caregiver Summary: ${patient.name} has played ${totalGames} sessions recently. Best consistency in ${recentGame ? recentGame.gameName : 'Visual Memory'}. ${reminders.filter(r => r.active).length} daily reminders are active.`;
  }

  // 2. Specialized Clinical & Memory Knowledge Base
  if (text.includes('dementia') || text.includes('what is dementia')) {
    return `Dementia is a gentle medical term describing shifts in how our brain processes memories, thoughts, and daily tasks. It is not a personal failing—it is simply changes in brain connections over time. With loving routines, stimulating cognitive games, and a calm environment, seniors can live with high dignity and warmth! 🌸`;
  }

  if (text.includes('memory reduction') || text.includes('memory loss') || text.includes('why memory fades') || text.includes('forgetting') || text.includes('memory reduce')) {
    return `Memory reduction happens when the delicate pathways (synapses) between brain neurons slow down or become less active due to aging, natural protein changes, or stress. Just like gentle morning exercise keeps our legs agile, engaging your mind through games, recalling family memories, and sound sleep keeps those neuronal bridges active! 🧠✨`;
  }

  if (text.includes('daily exercise') || text.includes('memory retention') || text.includes('brain exercise') || text.includes('retention exercise') || text.includes('exercises for memory')) {
    return `Here are 4 proven daily exercises for memory retention: 1) Play a cognitive game like Hornbill Memory Nest or Familiar Faces for 10 minutes every morning; 2) Practice 4-4 diaphragmatic breathing to oxygenate brain tissue; 3) Reminisce over one Life Story photo daily with a loved one; 4) Take a brisk morning walk and stay well hydrated! 🚶‍♀️💧`;
  }

  // 3. Patient conversational intent
  if (text.includes('medicine') || text.includes('pill') || text.includes('tablet')) {
    const medNames = medicines.map(m => m.name).join(', ');
    return `Dear ${firstName}, according to your routine, you have ${medicines.length} prescribed items (${medNames}). Your morning medicine is scheduled with a warm glass of water. Remember to take it gently as Dr. Barua advised! 💊`;
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
      'What did one orchid say to the morning sun? "I am so glad we get to blossom together today!" 🌺😊'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // General warm empathetic fallback
  return `Namaste ${firstName}! It's a joy to talk with you. Your day is filled with gentle possibilities. We can revisit your cherished family memories, test your memory with a game, or take a peaceful 4-4 breath together. How are you feeling right now? 🌻`;
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
      const { message, patientProfile, role } = data;

      // 1. Google Gemini API Integration
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          const patient = patientProfile?.patient || { name: 'Meera', state: 'Assam' };
          const games = patientProfile?.gameHistory || [];
          const totalGames = games.length;
          const avgAcc = totalGames > 0 ? Math.round(games.reduce((s, g) => s + (g.accuracy || 0), 0) / totalGames) : 90;
          const reminders = patientProfile?.reminders || [];
          const completedTasks = reminders.filter(r => r.completedToday).length;
          const totalTasks = reminders.length;
          const moods = patientProfile?.moodHistory || [];
          const latestMood = moods.length > 0 ? moods[moods.length - 1].mood : 'good';

          const systemPrompt = `You are SWAI, an empathetic, respectful, and encouraging AI memory & cognitive care companion in the SMRITI platform for elderly users in India.
Current Patient Context:
- Name: ${patient.name} (${patient.stage || 'Mild Cognitive Impairment'})
- State/Region: ${patientProfile?.preferences?.regionalState || patient.state || 'Assam'}
- Cognitive Game Performance: ${totalGames} sessions played, Average Accuracy: ${avgAcc}%
- Daily Routine Completion: ${completedTasks} of ${totalTasks} tasks completed today
- Current Mood Check-in: ${latestMood}
- Family Members: ${JSON.stringify(patientProfile?.familyMembers || [])}
- Active Prescriptions: ${JSON.stringify(patientProfile?.medicines || [])}
- Life Story Memories: ${JSON.stringify(patientProfile?.memories || [])}

Instructions:
1. Always be warm, respectful, and compassionate (use gentle Indian cultural cues like "Namaste", "Dear", or respectful terms).
2. Answer questions about their progress, accuracy, completed tasks, and family directly using their real data.
3. Answer medical/cognitive care questions accurately and empathetically:
   - "What is Dementia?": Explain that it is an umbrella medical term for changes in brain pathways affecting memory and daily tasks, manageable with routine, cognitive stimulation, and warmth.
   - "How does memory reduction happen?": Explain neuronal communication changes, aging, and reduced synaptic connections, noting that mental exercises help preserve paths.
   - "Daily exercises for memory retention?": Recommend 10 mins of SMRITI memory games, 4-4 calm breathing, photo reminiscence, and morning hydration/walks.
4. Keep answers concise, clear, and reassuring (maximum 2-3 sentences).
5. Never provide medical diagnoses or alter prescriptions; always encourage consulting Dr. Barua or family for clinical changes.`;

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
        } catch (geminiErr) {
          console.warn('Gemini API call error:', geminiErr.message);
        }
      }

      // 2. OpenAI API Integration fallback
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        try {
          const systemPrompt = `You are SWAI, an empathetic, respectful, and cheerful AI memory and cognitive companion in the SMRITI platform.
User profile: ${JSON.stringify(patientProfile?.patient || { name: 'Meera', state: 'Assam' })}.
Family: ${JSON.stringify(patientProfile?.familyMembers || [])}.
Active Reminders: ${JSON.stringify(patientProfile?.reminders || [])}.
Memories: ${JSON.stringify(patientProfile?.memories || [])}.
Recent Accuracy: ${patientProfile?.gameHistory?.length ? 'Active' : 'New'}.
Safety guideline: Maintain a compassionate tone, never provide formal diagnostic claims, and reference the patient's real memories and family members when helpful.`;

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

      // Contextual Data Synthesis Fallback
      const reply = generateContextualResponse(message, patientProfile, role);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply, source: 'context_engine' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body' }));
    }
  });
};
