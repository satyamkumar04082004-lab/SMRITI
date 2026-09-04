/* ============================================================
   SMRITI — Reusable AI Service Module
   Local AI intelligence + simulated LLM/OCR fallback for Hackathons
   ============================================================ */

import Storage from './storage.js';

const AIService = {
  // ------------------------------------------------------------
  // 1. TODAY'S GOOD THOUGHT ENGINE (35+ Inspiring Thoughts)
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
    { text: "Small acts of gentleness make a huge difference in the world.", theme: "Kindness", author: "Heart" },
    { text: "Take three deep breaths right now. Feel the oxygen nourish every part of you.", theme: "Breath", author: "Relaxation" },
    { text: "Today has no mistakes yet. Greet it with an open and peaceful heart.", theme: "Fresh Start", author: "Calm" },
    { text: "A garden doesn't bloom overnight. Patience creates the sweetest fruits.", theme: "Nature", author: "Patience" },
    { text: "Memories are treasures that live forever in the warmth of our hearts.", theme: "Treasures", author: "Memory Care" },
    { text: "Drink a glass of fresh water and thank your body for all it does for you.", theme: "Health", author: "Hydration" },
    { text: "A kind word given to another always finds its way back home.", theme: "Generosity", author: "Wisdom" },
    { text: "Wisdom comes from living gently and cherishing every quiet afternoon.", theme: "Age & Grace", author: "Reflection" },
    { text: "You have weathered many seasons; today is a season for calm and comfort.", theme: "Strength", author: "Resilience" },
    { text: "Let go of what you cannot change, and enjoy what is right in front of you.", theme: "Peace", author: "Simplicity" },
    { text: "The scent of blooming orchids reminds us that beauty arrives in its own time.", theme: "NER Nature", author: "Beauty" },
    { text: "Happiness is not a destination, but the pleasant company we keep along the way.", theme: "Companionship", author: "Life" },
    { text: "Your curiosity keeps your world vibrant and exciting.", theme: "Curiosity", author: "Active Mind" },
    { text: "Count one blessing before you start your games today.", theme: "Gratitude", author: "Mindfulness" },
    { text: "Peace begins with a deep breath and a kind thought towards yourself.", theme: "Self-Compassion", author: "Serenity" }
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
  // 2. SMRITI AI COMPANION (EMPATHETIC, CHEERFUL, PLAYFUL)
  // ------------------------------------------------------------
  chatWithSmriti(userMessage, history = []) {
    const user = Storage.getUser() || { name: 'friend' };
    const firstName = user.name.split(' ')[0] || 'friend';
    const text = (userMessage || '').trim().toLowerCase();

    // 1. Sadness / Low Mood
    if (text.includes('sad') || text.includes('lonely') || text.includes('low') || text.includes('upset') || text.includes('crying') || text.includes('worried')) {
      const responses = [
        `I'm really glad you told me, ${firstName}. It's completely okay to feel this way sometimes. Would you like to hear a gentle story, or shall we just chat about a comforting memory?`,
        `Thank you for sharing your heart with me, ${firstName}. Please remember you are valued and loved. Would hearing something cheerful or taking a few calm breaths together help right now?`,
        `I am right here with you, ${firstName}. Take a slow, deep breath with me. Would you like me to tell you an uplifting tale from Assam's rolling tea hills?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // 2. Stories
    if (text.includes('story') || text.includes('tell me a tale') || text.includes('katha')) {
      const stories = [
        `Here is a sweet story for you: In a quiet village near Kaziranga, an elderly grandmother planted a small jasmine bush by her porch. Birds and butterflies visited her every morning, and she would hum old folk tunes while watering it. Soon, neighbors began gathering on her veranda just to share tea and stories. That small jasmine bush blossomed into the warmest meeting place in the entire village! 🌸`,
        `Once upon a time, high in the hills of Shillong, there was a playful puppy who loved watching the clouds. Every time rain clouds gathered, he would chase the raindrops and bring fresh pine cones to his family. It reminded everyone that even on rainy days, joy is always waiting to be discovered! 🌧️🐾`,
        `There was once a wise bamboo craftsman in Majuli Island who said, "Bamboo bends with the strongest wind, but never breaks. Its strength is in its gentleness." Like bamboo, your kindness and patience bring quiet strength to everyone around you. 🎋`
      ];
      return stories[Math.floor(Math.random() * stories.length)];
    }

    // 3. Jokes / Humor
    if (text.includes('joke') || text.includes('laugh') || text.includes('funny')) {
      const jokes = [
        `Why did the teapot whistle in the morning? Because it was so excited to start a brand new day with you! ☕😄`,
        `What did one garden orchid say to the other? "I'm so glad we get to blossom together!" 🌺😊`,
        `Why did the grandfather clock go to school? To learn how to make every second count! ⏰😁`
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // 4. Motivation / Good thought
    if (text.includes('motivat') || text.includes('thought') || text.includes('quote') || text.includes('inspire') || text.includes('wisdom')) {
      const thought = this.generateGoodThought();
      return `Here is a special thought for you today, ${firstName}: "${thought.text}" 🌻`;
    }

    // 5. Game recommendations & Activity requests
    if (text.includes('game') || text.includes('play') || text.includes('activity') || text.includes('exercise')) {
      return `I would love for you to play a game, ${firstName}! How about testing your memory with **Hornbill Memory Nest** 🦅, or exploring **Memory Moments** 📖? You can click the Games tab below anytime to start!`;
    }

    // 6. Greetings
    if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('namaste') || text.includes('morning') || text.includes('evening')) {
      return `Namaste and hello, ${firstName}! 😊 It's wonderful to talk with you. How is your day going? Would you like to hear an inspiring story, play a fun game, or just chat?`;
    }

    // 7. How are you / About Smriti
    if (text.includes('how are you') || text.includes('who are you') || text.includes('what can you do')) {
      return `I'm feeling cheerful and delighted to be with you, ${firstName}! I am Smriti, your personal memory and wellness companion. I can tell stories, share good thoughts, play games with you, or help you track medicines and routines. What's on your mind?`;
    }

    // 8. Medicines & Reminders
    if (text.includes('medicine') || text.includes('pill') || text.includes('doctor') || text.includes('prescription')) {
      return `You can view and manage all your medicines and reminder schedules in the **Medicines** section. Remember to always follow your doctor's instructions! Would you like me to guide you there? 💊`;
    }

    // 9. Emergency / Help
    if (text.includes('help') || text.includes('emergency') || text.includes('doctor') || text.includes('call')) {
      return `If you need assistance or want to call your saved family contact, tap the 🆘 button at the top right or open the **Emergency Help** section. I can also help you navigate there! ❤️`;
    }

    // Default conversational fallback
    const defaults = [
      `That sounds interesting, ${firstName}! Tell me more about that, or would you like to do a quick brain exercise together?`,
      `Thank you for sharing that with me! You always bring such pleasant thoughts to our conversations. Would you like a good thought or a relaxing story right now?`,
      `I enjoy chatting with you, ${firstName}. Every day is brighter when we connect. What would you like to explore next in Smriti?`
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  },

  // ------------------------------------------------------------
  // 3. SMART PRESCRIPTION OCR / EXTRACTION ENGINE
  // ------------------------------------------------------------
  extractPrescription(fileOrText) {
    // Simulated smart medical OCR with realistic fallback
    const sampleMedicines = [
      {
        name: 'Pantoprazole Gastro-Resistant',
        strength: '40 mg',
        instructions: '1 tablet once daily in the morning 30 minutes before food',
        frequency: 'Morning (Before Breakfast)',
        duration: '30 days',
        confidence: 'High (98%)',
        doctor: 'Dr. A. K. Barua, MD',
        date: '2026-08-15',
        pharmacy: 'Apollo Health Pharmacy',
        notes: 'Take with half glass of plain water'
      },
      {
        name: 'Multivitamin with Zinc & B-Complex',
        strength: '1 Capsule',
        instructions: '1 capsule once daily after lunch',
        frequency: 'Afternoon (After Food)',
        duration: '60 days',
        confidence: 'High (95%)',
        doctor: 'Dr. A. K. Barua, MD',
        date: '2026-08-15',
        pharmacy: 'Apollo Health Pharmacy',
        notes: 'Nutritional wellness supplement'
      },
      {
        name: 'Calcium Carbonate + Vit D3',
        strength: '500 mg / 400 IU',
        instructions: '1 tablet daily at night after dinner',
        frequency: 'Night (After Food)',
        duration: '90 days',
        confidence: 'High (92%)',
        doctor: 'Dr. A. K. Barua, MD',
        date: '2026-08-15',
        pharmacy: 'Apollo Health Pharmacy',
        notes: 'Bone strength supplement'
      }
    ];

    return new Promise((resolve) => {
      // Simulate fast OCR processing delay
      setTimeout(() => {
        resolve({
          success: true,
          medicines: sampleMedicines,
          doctorName: 'Dr. A. K. Barua, MD',
          prescriptionDate: '15 Aug 2026',
          disclaimer: 'Information extracted from your uploaded prescription — please verify against the original document before taking any medication.'
        });
      }, 1200);
    });
  },

  // ------------------------------------------------------------
  // 4. PERSONALIZED ACTIVITY RECOMMENDER
  // Considers: mood, performance history, weak cognitive areas, time of day
  // ------------------------------------------------------------
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

    // 1. If user is feeling Low or Worried, recommend comforting, non-stressful games
    if (mood === 'low' || mood === 'worried') {
      const comfortingGames = [
        {
          game: games.find(g => g.id === 'familiar-faces'),
          reason: 'Recommended because you felt low or worried today — connecting with familiar friendly faces brings comfort and reassurance.'
        },
        {
          game: games.find(g => g.id === 'hornbill'),
          reason: 'Recommended for your mood today — a gentle, peaceful nature card match to calm and refresh your thoughts.'
        }
      ];
      // Pick based on which has been played less recently
      const pick = comfortingGames[Math.floor(Date.now() / 3600000) % comfortingGames.length];
      return { ...pick.game, reason: pick.reason };
    }

    // 2. If user is feeling Great or Good, offer an engaging cognitive challenge
    if (mood === 'great' || mood === 'good') {
      const challengeGames = [
        {
          game: games.find(g => g.id === 'bamboo-sequence'),
          reason: 'Recommended because of your great positive energy today — challenge your pattern memory with glowing bamboo rhythms!'
        },
        {
          game: games.find(g => g.id === 'memory-moments'),
          reason: 'Recommended to match your cheerful spirits — engage your mind with delightful short stories and story recall.'
        }
      ];
      const pick = challengeGames[Math.floor(Date.now() / 3600000) % challengeGames.length];
      return { ...pick.game, reason: pick.reason };
    }

    // 3. Analyze weak cognitive areas from history
    if (history.length >= 3) {
      const statsByGame = {};
      history.forEach(h => {
        if (!statsByGame[h.gameId]) {
          statsByGame[h.gameId] = { totalAcc: 0, count: 0 };
        }
        statsByGame[h.gameId].totalAcc += (h.accuracy || 0);
        statsByGame[h.gameId].count++;
      });

      // Look for game with lowest accuracy below 85%
      let lowestAccGameId = null;
      let minAcc = 85;
      for (const [gid, s] of Object.entries(statsByGame)) {
        const avg = s.totalAcc / s.count;
        if (avg < minAcc) {
          minAcc = avg;
          lowestAccGameId = gid;
        }
      }

      if (lowestAccGameId) {
        const target = games.find(g => g.id === lowestAccGameId);
        if (target) {
          return {
            ...target,
            reason: `Recommended to strengthen your ${target.area} — a little daily practice builds remarkable confidence!`
          };
        }
      }

      // Check for an unplayed or least-played game
      const unplayed = games.find(g => !statsByGame[g.id]);
      if (unplayed) {
        return {
          ...unplayed,
          reason: `Recommended to explore new brain paths — you haven't tried ${unplayed.name} recently!`
        };
      }
    }

    // 4. Time of Day dynamic selection (varied by day of week so it never repeats daily)
    const dayOfWeek = new Date().getDay();
    if (hour < 12) {
      const morningGames = [games[0], games[3], games[4]]; // Hornbill, Remember Home, My Day
      const chosen = morningGames[dayOfWeek % morningGames.length];
      return {
        ...chosen,
        reason: `Recommended for your morning routine — gentle morning focus to awaken your mind.`
      };
    } else if (hour < 17) {
      const afternoonGames = [games[1], games[2], games[4]]; // Memory Moments, Familiar Faces, My Day
      const chosen = afternoonGames[dayOfWeek % afternoonGames.length];
      return {
        ...chosen,
        reason: `Recommended for your afternoon recharge — keeps your attention active and alert.`
      };
    } else if (hour < 21) {
      const eveningGames = [games[5], games[0], games[6]]; // Listen & Remember, Hornbill, Bamboo
      const chosen = eveningGames[dayOfWeek % eveningGames.length];
      return {
        ...chosen,
        reason: `Recommended for a peaceful evening — relaxing mindful recall before bedtime.`
      };
    } else {
      return {
        ...games[6],
        reason: `Recommended for gentle nighttime relaxation — glowing bamboo sequencing to wind down.`
      };
    }
  }
};

export default AIService;
