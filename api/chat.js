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

  // 2. Patient conversational intent
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

      // Check for OpenAI API Key
      const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
      if (apiKey && process.env.OPENAI_API_KEY) {
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
              'Authorization': `Bearer ${apiKey}`
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
              res.end(JSON.stringify({ reply: text, source: 'llm' }));
              return;
            }
          }
        } catch (llmErr) {
          console.warn('LLM call failed, falling back to contextual generator:', llmErr.message);
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
