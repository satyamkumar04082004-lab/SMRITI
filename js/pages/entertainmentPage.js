/* ============================================================
   SMRITI — Entertainment & Interactive Multimedia Quiz
   Senior-accessible gentle music, Bollywood nostalgia, bhajans,
   short stories, and an interactive multimedia cultural quiz
   ("Guess the Instrument", "Guess the Song", "Identify the Singer")
   with explicit user Play/Pause controls, 10-question sessions,
   route guard protections, and review screen.
   ============================================================ */

import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';
import Coins from '../coins.js';

// Top-level module-scoped Quiz Data pool (10 curated questions per category)
export const quizData = {
  instrument: [
    {
      id: 'q_inst_1',
      title: 'Listen carefully to this sweet, high-pitched wind instrument:',
      notes: [587.33, 659.25, 739.99, 880.00, 987.77, 880.00, 739.99, 659.25],
      wave: 'sine',
      tempo: 450,
      options: ['Bansuri (Bamboo Flute) 🪈', 'Tabla (Drums) 🥁', 'Sitar (Strings) 🪕', 'Shehnai 🎺'],
      correct: 'Bansuri (Bamboo Flute) 🪈',
      fact: 'The bamboo flute (Bansuri) has echoed across Indian classical music and Krishna folklore for thousands of years!'
    },
    {
      id: 'q_inst_2',
      title: 'Listen to the deep resonant rhythmic beats:',
      notes: [130.81, 146.83, 164.81, 130.81, 174.61, 146.83, 130.81],
      wave: 'triangle',
      tempo: 380,
      options: ['Tabla 🥁', 'Veena 🎼', 'Flute 🪈', 'Harmonium 🎹'],
      correct: 'Tabla 🥁',
      fact: 'The Tabla consists of the Dayan (treble) and Bayan (bass drum), creating the heartbeat of Indian music.'
    },
    {
      id: 'q_inst_3',
      title: 'Listen to these delicate acoustic strings with resonating sympathetic buzz:',
      notes: [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 493.88],
      wave: 'sawtooth',
      tempo: 500,
      options: ['Sitar 🪕', 'Shehnai 🎺', 'Dholak 🥁', 'Bansuri 🪈'],
      correct: 'Sitar 🪕',
      fact: 'Made world-famous by Pandit Ravi Shankar, the sitar has movable frets and sympathetic buzzing strings.'
    },
    {
      id: 'q_inst_4',
      title: 'Listen to this festive and auspicious reeded wind melody:',
      notes: [329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 493.88],
      wave: 'triangle',
      tempo: 600,
      options: ['Shehnai 🎺', 'Sarod 🎻', 'Bansuri 🪈', 'Jal Tarang 🥣'],
      correct: 'Shehnai 🎺',
      fact: 'Ustad Bismillah Khan brought the Shehnai from royal courtyards to international concert stages.'
    },
    {
      id: 'q_inst_5',
      title: 'Listen to the rippling hundred-stringed Himalayan zither:',
      notes: [349.23, 392.00, 440.00, 523.25, 587.33, 659.25, 523.25],
      wave: 'square',
      tempo: 400,
      options: ['Santoor 🌊', 'Guitar 🎸', 'Sitar 🪕', 'Tanpura 🎶'],
      correct: 'Santoor 🌊',
      fact: 'Pandit Shivkumar Sharma transformed the folk Kashmiri Santoor into a premier classical instrument.'
    },
    {
      id: 'q_inst_6',
      title: 'Listen to the deep resonant drone holding the pitch of classical vocalists:',
      notes: [196.00, 261.63, 261.63, 130.81],
      wave: 'sawtooth',
      tempo: 700,
      options: ['Tanpura (Tambura) 🎶', 'Harmonium 🎹', 'Sarangi 🎻', 'Mridangam 🥁'],
      correct: 'Tanpura (Tambura) 🎶',
      fact: 'The Tanpura provides the continuous harmonic drone (Sa-Pa-Sa) essential for Indian classical meditation.'
    },
    {
      id: 'q_inst_7',
      title: 'Listen to the folk barrel drum often played at harvest festivals and baithaks:',
      notes: [146.83, 164.81, 196.00, 146.83],
      wave: 'triangle',
      tempo: 320,
      options: ['Dholak 🪘', 'Sitar 🪕', 'Violin 🎻', 'Bansuri 🪈'],
      correct: 'Dholak 🪘',
      fact: 'The Dholak is the soul of rural Indian folk songs, qawwalis, and community celebrations.'
    },
    {
      id: 'q_inst_8',
      title: 'Listen to the bow gliding across the expressive bowed lute that mimics human voice:',
      notes: [293.66, 329.63, 369.99, 440.00, 493.88],
      wave: 'sawtooth',
      tempo: 520,
      options: ['Sarangi 🎻', 'Tabla 🥁', 'Flute 🪈', 'Ghatam 🏺'],
      correct: 'Sarangi 🎻',
      fact: 'Carved from a single block of wood, the Sarangi has over thirty sympathetic strings mimicking human singing.'
    },
    {
      id: 'q_inst_9',
      title: 'Listen to the earthen clay pot struck with fingers and thumbs:',
      notes: [174.61, 220.00, 174.61, 261.63],
      wave: 'triangle',
      tempo: 300,
      options: ['Ghatam 🏺', 'Harmonium 🎹', 'Santoor 🌊', 'Veena 🎼'],
      correct: 'Ghatam 🏺',
      fact: 'The Ghatam is an ancient Carnatic percussion pot made of clay mixed with brass or copper filings.'
    },
    {
      id: 'q_inst_10',
      title: 'Listen to the hand-pumped keyboard instrument accompanying bhajans:',
      notes: [261.63, 329.63, 392.00, 523.25, 392.00],
      wave: 'sawtooth',
      tempo: 480,
      options: ['Harmonium 🎹', 'Dhol 🥁', 'Sitar 🪕', 'Shehnai 🎺'],
      correct: 'Harmonium 🎹',
      fact: 'The harmonium was introduced to India in the 19th century and became an integral part of devotional music.'
    }
  ],
  song: [
    {
      id: 'q_song_1',
      title: 'Which golden evergreen classic has this melody?',
      notes: [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66],
      wave: 'sine',
      tempo: 600,
      options: ['Ajeeb Dastan Hai Yeh 📻', 'Chura Liya Hai Tumne 🎸', 'Lag Ja Gale 🌸', 'Yeh Dosti 🏍️'],
      correct: 'Ajeeb Dastan Hai Yeh 📻',
      fact: 'From the 1960 movie Dil Apna Aur Preet Parai, sung soulfully by Lata Mangeshkar.'
    },
    {
      id: 'q_song_2',
      title: 'Identify the iconic romantic rain tune:',
      notes: [392.00, 349.23, 329.63, 293.66, 261.63, 329.63, 392.00],
      wave: 'triangle',
      tempo: 550,
      options: ['Pyaar Hua Ikraar Hua ☔', 'Roop Tera Mastana 🔥', 'Ek Ladki Bheegi Bhaagi Si 🌧️', 'Rimjhim Gire Sawan 🌂'],
      correct: 'Pyaar Hua Ikraar Hua ☔',
      fact: 'Featuring Raj Kapoor and Nargis under the black umbrella in Shree 420 (1955).'
    },
    {
      id: 'q_song_3',
      title: 'Which timeless ghazal melody touches the soul with nostalgia?',
      notes: [293.66, 329.63, 349.23, 392.00, 440.00, 392.00, 349.23],
      wave: 'sine',
      tempo: 600,
      options: ['Lag Ja Gale 🌸', 'Kabhi Kabhie Mere Dil Mein 📜', 'Tere Bina Zindagi Se 🍁', 'Chaudhvin Ka Chand 🌙'],
      correct: 'Lag Ja Gale 🌸',
      fact: 'Composed by Madan Mohan in Woh Kaun Thi? (1964), it remains one of the most loved songs in history.'
    },
    {
      id: 'q_song_4',
      title: 'Which joyful acoustic strumming track celebrates friendship?',
      notes: [329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63],
      wave: 'sawtooth',
      tempo: 480,
      options: ['Yeh Dosti Hum Nahi Todenge 🏍️', 'Zindagi Ek Safar Hai Suhana 🚗', 'Mere Samne Wali Khidki 🪟', 'Kishore Ki Baatein 🎙️'],
      correct: 'Yeh Dosti Hum Nahi Todenge 🏍️',
      fact: 'From the epic film Sholay (1975), celebrating the eternal bond between Jai and Veeru.'
    },
    {
      id: 'q_song_5',
      title: 'Which poetic song asks for gentle blessings from the evening breeze?',
      notes: [261.63, 329.63, 392.00, 440.00, 493.88, 440.00, 392.00],
      wave: 'sine',
      tempo: 580,
      options: ['Chaudhvin Ka Chand Ho 🌙', 'Aap Ki Nazron Ne Samjha 👁️', 'Tere Mere Sapne 🌅', 'Aaja Re Pardesi 🌳'],
      correct: 'Chaudhvin Ka Chand Ho 🌙',
      fact: 'Sung by Mohammed Rafi in 1960, earning him the prestigious Filmfare Award.'
    },
    {
      id: 'q_song_6',
      title: 'Which classic RD Burman tune begins with glass tinkling and breezy acoustic guitar?',
      notes: [440.00, 493.88, 523.25, 587.33],
      wave: 'sawtooth',
      tempo: 460,
      options: ['Chura Liya Hai Tumne 🎸', 'Dum Maro Dum 🪕', 'O Mere Dil Ke Chain 📻', 'Piya Tu Ab To Aaja 🎷'],
      correct: 'Chura Liya Hai Tumne 🎸',
      fact: 'From Yaadon Ki Baaraat (1973), RD Burman created the glass clink using a spoon and water glass.'
    },
    {
      id: 'q_song_7',
      title: 'Which soulful Mukesh melody reflects on life with "Kal khel mein hum hon na hon"?',
      notes: [261.63, 293.66, 329.63, 392.00, 329.63],
      wave: 'triangle',
      tempo: 620,
      options: ['Jeena Yahan Marna Yahan 🎪', 'Kabhi Kabhie Mere Dil Mein 📜', 'Awara Hoon 🎩', 'Mera Joota Hai Japani 👞'],
      correct: 'Jeena Yahan Marna Yahan 🎪',
      fact: 'The legendary philosophical song from Raj Kapoor\'s Mera Naam Joker (1970).'
    },
    {
      id: 'q_song_8',
      title: 'Which song features Rajesh Khanna on an open jeep singing to Sharmila Tagore on a train?',
      notes: [329.63, 392.00, 440.00, 523.25],
      wave: 'sine',
      tempo: 420,
      options: ['Mere Sapnon Ki Rani 🚂', 'Roop Tera Mastana 🔥', 'Kora Kagaz Tha Yeh Man 📄', 'Yeh Sham Mastani 🌅'],
      correct: 'Mere Sapnon Ki Rani 🚂',
      fact: 'From Aradhana (1969), shot on the scenic Darjeeling Himalayan Toy Train.'
    },
    {
      id: 'q_song_9',
      title: 'Which romantic melody composed by RD Burman features Kishore Kumar expressing calm devotion?',
      notes: [261.63, 329.63, 392.00, 440.00],
      wave: 'sine',
      tempo: 530,
      options: ['O Mere Dil Ke Chain ☕', 'Yeh Jo Mohabbat Hai 🍷', 'Chingari Koi Bhadke 🕯️', 'Kuch To Log Kahenge 💬'],
      correct: 'O Mere Dil Ke Chain ☕',
      fact: 'From Mere Jeevan Saathi (1972), Kishore Kumar\'s velvety vocals won hearts nationwide.'
    },
    {
      id: 'q_song_10',
      title: 'Which evergreen prayer song begins with "Itni shakti hamein dena data"?',
      notes: [293.66, 329.63, 349.23, 392.00, 440.00],
      wave: 'sine',
      tempo: 640,
      options: ['Itni Shakti Hamein Dena Data 🕊️', 'Ae Malik Tere Bande Hum 🪷', 'Allah Tero Naam 🌸', 'Tumhi Ho Mata Pita Tumhi Ho 🌅'],
      correct: 'Itni Shakti Hamein Dena Data 🕊️',
      fact: 'Composed by Kuldeep Singh for Ankush (1986), now sung in morning assemblies across India.'
    }
  ],
  singer: [
    {
      id: 'q_sing_1',
      title: 'Who was revered as the "Nightingale of India" with timeless melodies?',
      notes: [440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00],
      wave: 'sine',
      tempo: 650,
      options: ['Lata Mangeshkar 🕊️', 'Asha Bhosle 🌸', 'Geeta Dutt 📻', 'M. S. Subbulakshmi 🪷'],
      correct: 'Lata Mangeshkar 🕊️',
      fact: 'Bharat Ratna Lata Mangeshkar recorded songs in over 36 languages across seven legendary decades.'
    },
    {
      id: 'q_sing_2',
      title: 'Which soulful maestro sang "Pal Pal Dil Ke Paas" and "Mere Sapnon Ki Rani"?',
      notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63],
      wave: 'sawtooth',
      tempo: 500,
      options: ['Kishore Kumar 🎙️', 'Mohammed Rafi 🎤', 'Mukesh 🎼', 'Hemant Kumar 🌊'],
      correct: 'Kishore Kumar 🎙️',
      fact: 'Kishore Kumar was an unmatched genius who could switch between soulful ballads and joyful yodeling!'
    },
    {
      id: 'q_sing_3',
      title: 'Which versatile legend sang "Kya Hua Tera Wada" and "Gulabi Aankhen"?',
      notes: [293.66, 329.63, 369.99, 440.00, 493.88, 440.00, 369.99],
      wave: 'triangle',
      tempo: 520,
      options: ['Mohammed Rafi 🎤', 'Kishore Kumar 🎙️', 'Manna Dey 🎼', 'Talat Mahmood 📻'],
      correct: 'Mohammed Rafi 🎤',
      fact: 'Mohammed Rafi possessed an extraordinary range and sang over 7,000 songs spanning every emotion.'
    },
    {
      id: 'q_sing_4',
      title: 'Known as the Queen of Indie & Bollywood versatility, singing "Dum Maro Dum":',
      notes: [329.63, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00],
      wave: 'sawtooth',
      tempo: 450,
      options: ['Asha Bhosle 🌸', 'Lata Mangeshkar 🕊️', 'Alka Yagnik 🌺', 'Anuradha Paudwal 🪷'],
      correct: 'Asha Bhosle 🌸',
      fact: 'Asha Bhosle entered the Guinness World Records for the most studio recordings in music history.'
    },
    {
      id: 'q_sing_5',
      title: 'Who is fondly called the "Voice of Raj Kapoor" for songs like "Jeena Yahan Marna Yahan"?',
      notes: [261.63, 293.66, 329.63, 392.00, 329.63, 293.66, 261.63],
      wave: 'triangle',
      tempo: 560,
      options: ['Mukesh 🎼', 'Mohammed Rafi 🎤', 'Hemant Kumar 🌊', 'Bhupen Hazarika 🎶'],
      correct: 'Mukesh 🎼',
      fact: 'Mukesh had a deeply comforting golden voice that resonated with poignant warmth.'
    },
    {
      id: 'q_sing_6',
      title: 'Which legendary singer and composer from Assam sang "Dil Hoom Hoom Kare" and "Ganga Behti Ho Kyun"?',
      notes: [261.63, 293.66, 349.23, 392.00],
      wave: 'sine',
      tempo: 580,
      options: ['Bhupen Hazarika 🌊', 'Manna Dey 🎼', 'Hemant Kumar 🎙️', 'Kishore Kumar 📻'],
      correct: 'Bhupen Hazarika 🌊',
      fact: 'Bharat Ratna Dr. Bhupen Hazarika was the musical bridge between Assam and the rest of the world.'
    },
    {
      id: 'q_sing_7',
      title: 'Which classical maestro sang "Poocho Na Kaise Maine Rain Bitai" and "Laga Chunari Mein Daag"?',
      notes: [293.66, 329.63, 369.99, 440.00],
      wave: 'sawtooth',
      tempo: 490,
      options: ['Manna Dey 🎼', 'Mohammed Rafi 🎤', 'Mukesh 📻', 'Talat Mahmood 🌸'],
      correct: 'Manna Dey 🎼',
      fact: 'Manna Dey blended intricate Indian classical music with Hindi film playback with unmatched finesse.'
    },
    {
      id: 'q_sing_8',
      title: 'Which baritone singer had a deep soothing voice in "Yeh Nayan Dare Dare" and "Hai Apna Dil To Aawara"?',
      notes: [220.00, 261.63, 293.66, 329.63],
      wave: 'sine',
      tempo: 590,
      options: ['Hemant Kumar 🌊', 'Mukesh 🎼', 'Kishore Kumar 🎙️', 'Bhupen Hazarika 🎶'],
      correct: 'Hemant Kumar 🌊',
      fact: 'Hemant Kumar was celebrated both as a peerless Rabindra Sangeet exponent and Bollywood composer.'
    },
    {
      id: 'q_sing_9',
      title: 'Known as the "King of Ghazals", who sang "Hothon Se Chhoo Lo Tum" and "Jhuki Jhuki Si Nazar"?',
      notes: [261.63, 293.66, 329.63, 349.23],
      wave: 'sine',
      tempo: 620,
      options: ['Jagjit Singh 📜', 'Pankaj Udhas 🍷', 'Ghulam Ali 🌙', 'Talat Mahmood 📻'],
      correct: 'Jagjit Singh 📜',
      fact: 'Jagjit Singh made classical Urdu and Hindi ghazals accessible to every Indian household.'
    },
    {
      id: 'q_sing_10',
      title: 'Which Carnatic classical diva was the first musician to be awarded the Bharat Ratna?',
      notes: [329.63, 392.00, 440.00, 523.25],
      wave: 'sine',
      tempo: 600,
      options: ['M. S. Subbulakshmi 🪷', 'Lata Mangeshkar 🕊️', 'Kishori Amonkar 🌸', 'Begum Akhtar 📜'],
      correct: 'M. S. Subbulakshmi 🪷',
      fact: 'M. S. Subbulakshmi\'s dawn recital of Venkateswara Suprabhatam is heard across millions of homes daily.'
    }
  ]
};

// Fisher-Yates shuffle helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function EntertainmentPage(container) {
  let activeTab = 'quiz'; // 'quiz' | 'music' | 'stories' | 'visuals'
  let currentPlayingAudio = null;
  let synthAudioCtx = null;
  let synthInterval = null;

  // --- Multimedia Quiz State (10 Question Session) ---
  const SESSION_LIMIT = 10;
  let quizMode = 'instrument'; // 'instrument' | 'song' | 'singer'
  let sessionQuestions = [];
  let currentQuestionIndex = 0;
  let quizScore = 0;
  let quizSessionReview = []; // Track { question, chosen, correct, isCorrect }
  let quizFinished = false;
  let isQuizAudioPlaying = false;
  let quizAudioCtx = null;
  let quizInterval = null;

  function initQuizSession(mode) {
    const pool = (quizData && quizData[mode]) || (quizData && quizData.instrument) || [];
    const shuffledPool = shuffleArray(pool);
    sessionQuestions = shuffledPool.slice(0, SESSION_LIMIT).map(q => ({
      ...q,
      options: shuffleArray(q.options || [])
    }));
    currentQuestionIndex = 0;
    quizScore = 0;
    quizSessionReview = [];
    quizFinished = false;
    stopQuizAudio();
  }

  // Initialize session
  initQuizSession(quizMode);

  // --- Route Guard Protection ---
  let isLeavingConfirmed = false;
  const handleBeforeUnload = (e) => {
    if (activeTab === 'quiz' && currentQuestionIndex > 0 && !quizFinished) {
      e.preventDefault();
      e.returnValue = 'You have a quiz in progress! Are you sure you want to leave?';
      return e.returnValue;
    }
  };

  const handleHashChange = (e) => {
    if (activeTab === 'quiz' && currentQuestionIndex > 0 && !quizFinished && !isLeavingConfirmed) {
      const confirmLeave = window.confirm('You have a quiz in progress! Are you sure you want to leave and forfeit your current progress?');
      if (!confirmLeave) {
        // Revert hash
        window.removeEventListener('hashchange', handleHashChange);
        window.location.hash = '#/entertainment';
        setTimeout(() => {
          window.addEventListener('hashchange', handleHashChange);
        }, 100);
      } else {
        isLeavingConfirmed = true;
      }
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('hashchange', handleHashChange);

  // --- Visuals Sub-tab State ---
  let visualSubTab = 'greenery'; // 'greenery' | 'animals' | 'vegetation'

  // Distinct Indian Instrumentals with custom covers support
  let customCovers = {};
  try {
    customCovers = JSON.parse(localStorage.getItem('smriti_custom_melody_covers') || '{}');
  } catch (e) {}

  const defaultInstrumentals = [
    {
      id: 'inst_flute',
      title: 'Bansuri (Bamboo Flute) — Raga Yaman',
      notes: [587.33, 659.25, 739.99, 880.00, 987.77, 880.00, 739.99, 659.25],
      waveType: 'sine',
      tempo: 600,
      icon: '🪈',
      desc: 'Serene bamboo flute notes resonating with peace, mountain breeze, and twilight clarity.',
      defaultCover: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'inst_sitar',
      title: 'Sitar Melody — Raga Bhairav',
      notes: [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 493.88],
      waveType: 'sawtooth',
      tempo: 550,
      icon: '🪕',
      desc: 'Classic acoustic pluck and resonating sympathetic buzz of morning meditation.',
      defaultCover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'inst_santoor',
      title: 'Santoor Ripples — Kashmiri Morning',
      notes: [349.23, 392.00, 440.00, 523.25, 587.33, 659.25, 523.25],
      waveType: 'square',
      tempo: 450,
      icon: '🌊',
      desc: 'Delicate light wooden hammers dancing over strings like a glistening Dal Lake fountain.',
      defaultCover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'inst_veena',
      title: 'Carnatic Saraswati Veena Harmony',
      notes: [220.00, 246.94, 277.18, 329.63, 369.99, 440.00],
      waveType: 'triangle',
      tempo: 580,
      icon: '🎼',
      desc: 'Deep noble resonance grounded in traditional South Indian temple sanctums.',
      defaultCover: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'inst_tabla',
      title: 'Gentle Tabla Rhythms — Teentaal 16 Beats',
      notes: [130.81, 146.83, 164.81, 130.81, 174.61, 146.83, 130.81],
      waveType: 'triangle',
      tempo: 420,
      icon: '🥁',
      desc: 'Mellow soothing rhythm that grounds the heart and invites peaceful relaxation.',
      defaultCover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
    }
  ];

  // 10 Curated Uplifting Nostalgic Stories
  const allStoriesPool = [
    {
      id: 'story_1',
      title: 'The Clay Chai Cup at the Village Station',
      icon: '☕',
      duration: '3 min read',
      moral: 'Simplicity and warmth linger longer in memory than speed.',
      text: 'Early morning at the quiet railway station was marked by the whistle of the tea vendor. He poured fresh ginger and cardamom tea into unglazed terracotta kulhars. The sweet fragrance of moist clay mingling with boiling milk and crushed cloves brought instant comfort to travelers wrapped in wool shawls. Taking that first warm sip with both hands reminded everyone that life\'s finest moments cost almost nothing and need never be rushed.'
    },
    {
      id: 'story_2',
      title: 'The Courtyard Banyan and Grandmother\'s Tales',
      icon: '🌳',
      duration: '4 min read',
      moral: 'Roots that run deep give shade to many generations.',
      text: 'Every summer afternoon when the sun warmed the red clay tiles, all the neighborhood children gathered beneath the sprawling banyan tree in Grandmother\'s courtyard. With a gentle brass fan in one hand and roasted grams in the other, she spun tales of brave kings, talking birds of the Brahmaputra, and playful rivers. The rustle of the leaves above sounded like whispers from old friends, assuring everyone that as long as stories are retold, love never fades.'
    },
    {
      id: 'story_3',
      title: 'The Brass Radio and Sunday Morning Melodies',
      icon: '📻',
      duration: '3 min read',
      moral: 'Music is the time machine that returns us to our youth.',
      text: 'Grandfather had a sturdy wooden Murphy radio with a shining round dial that glowed like amber. Every Sunday promptly at eight, the warm voice of the announcer introduced classic songs by Lata, Rafi, and Mukesh. Neighbors pausing outside the veranda would nod their heads in rhythm, humming along to every word. A single melody filled the house with joy, proving that harmony in a home begins with listening together.'
    },
    {
      id: 'story_4',
      title: 'The First Rain and the Dancing Peacocks',
      icon: '🦚',
      duration: '3 min read',
      moral: 'Nature celebrates every new beginning with open feathers.',
      text: 'After long summer days, the first dark monsoon clouds gathered over the hills. As the first giant raindrops tapped on tin roofs and dusty courtyard earth, the sudden sweet scent of petrichor filled the air. In the nearby meadow, a peacock unfurled its magnificent emerald and sapphire train, turning gracefully in the drizzle. Seeing that dance, everyone forgot their worries, reminded that renewal always arrives right on time.'
    },
    {
      id: 'story_5',
      title: 'The Golden Marigold Harvest of Bihu & Diwali',
      icon: '🌼',
      duration: '4 min read',
      moral: 'When we string together kindness, we brighten the darkest night.',
      text: 'In the week preceding the festival of lights, the whole household sat together stringing fresh orange and yellow marigolds onto white cotton threads. Hands turned fragrant with pollen as garlands were draped across doors, brass lamps were polished with tamarind, and small clay diyas were filled with sesame oil. When evening arrived and the flames flickered softly, every face glowed with peace and togetherness.'
    },
    {
      id: 'story_6',
      title: 'The River Ferry Across the Silver Brahmaputra',
      icon: '⛵',
      duration: '4 min read',
      moral: 'The river carries all burdens gently if we let it flow.',
      text: 'At sunrise, the wooden ferry pushed away from the riverbank, cutting quietly through morning mist. River dolphins occasionally surfaced with a gentle curve of silver. Old boatmen sang traditional songs celebrating the endless waters, while passengers shared roasted puffed rice and green tea. Watching the ripples broaden toward the horizon brought a profound stillness to every mind.'
    },
    {
      id: 'story_7',
      title: 'The Fragrant Mango Orchard Picnic',
      icon: '🥭',
      duration: '3 min read',
      moral: 'Sweetness shared with family multiplies with each smile.',
      text: 'Under the cool canopy of ripe Alphonso and Langra mango trees, white cotton sheets were spread across emerald grass. Elders rested against bolster pillows while children picked fallen raw mangoes to sprinkle with rock salt and roasted cumin. The laughter and sweet juice dripping from fingers made that sunny afternoon unforgettable.'
    },
    {
      id: 'story_8',
      title: 'The Weaver\'s Loom of Golden Muga Silk',
      icon: '🧵',
      duration: '4 min read',
      moral: 'Patience transforms simple threads into everlasting splendor.',
      text: 'In the gentle shade of the bamboo grove, the wooden loom clacked in a rhythmic, comforting cadence. Mother\'s deft fingers wove shimmering golden Muga silk, passing the shuttle back and forth like a song without words. With each passing hour, intricate motifs of flowers and hornbill wings appeared upon the cloth, a timeless heirloom created with devotion.'
    },
    {
      id: 'story_9',
      title: 'The Village Library of Forgotten Treasures',
      icon: '📚',
      duration: '3 min read',
      moral: 'Knowledge and kind words outlive kingdoms.',
      text: 'The small village library smelled of old paper, sandalwood bookmarks, and rainy day moisture. Master-ji, the retired teacher, would guide anyone who entered to ancient leather-bound books of poetry and geography. In that quiet room, hours slipped away as easily as water, leaving readers filled with wisdom and quiet contentment.'
    },
    {
      id: 'story_10',
      title: 'The Warm Fireplace on a Winter Hilltop',
      icon: '🔥',
      duration: '4 min read',
      moral: 'The warmest hearth is the circle of compassionate friends.',
      text: 'When winter winds swept across the pine hills of Shillong, pine cones crackled merrily in the open brick hearth. Family and neighbors huddled close in knitted sweaters, sharing steamed momos and hot ginger honey brew. With no hurry to be anywhere else, the warmth of the fire seeped into their bones, creating an oasis of peace.'
    }
  ];

  let visibleStories = allStoriesPool.slice(0, 4);

  function shuffleStories() {
    visibleStories = shuffleArray(allStoriesPool).slice(0, 4);
    render();
  }

  // Visuals Gallery: Curated Scenic Calm Nature Imagery
  const defaultVisuals = {
    greenery: [
      {
        id: 'vis_grn_1',
        title: 'Misty Tea Gardens of Kaziranga',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        caption: 'Rolling emerald green tea slopes bathed in tranquil morning fog and pure fresh air.'
      },
      {
        id: 'vis_grn_2',
        title: 'Lush Bamboo Groves of Meghalaya',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
        caption: 'Tall bamboo stalks whispering softly in the mountain breeze.'
      },
      {
        id: 'vis_grn_3',
        title: 'Silver Waterfalls of Cherrapunji',
        image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&auto=format&fit=crop&q=80',
        caption: 'Gentle cascading crystal waters flowing into a clear jade pool.'
      }
    ],
    animals: [
      {
        id: 'vis_anm_1',
        title: 'The Great Indian One-Horned Rhinoceros',
        image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&auto=format&fit=crop&q=80',
        caption: 'A majestic rhino grazing peacefully in the tall golden elephant grasses of Kaziranga.'
      },
      {
        id: 'vis_anm_2',
        title: 'The Great Hornbill of Arunachal',
        image: 'https://images.unsplash.com/photo-1550853024-fae8dd4be47f?w=600&auto=format&fit=crop&q=80',
        caption: 'A vibrant yellow and black hornbill perched proudly high up in the dense canopy.'
      }
    ],
    vegetation: [
      {
        id: 'vis_veg_1',
        title: 'Golden Mustard Fields of the Brahmaputra',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
        caption: 'Vibrant yellow mustard blooms glowing under the gentle winter morning sun.'
      },
      {
        id: 'vis_veg_2',
        title: 'Traditional Betel Nut & Coconut Palms',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
        caption: 'Slender palm trees standing gracefully against the clear blue sky outside the village veranda.'
      }
    ]
  };

  let userCustomVisuals = {};
  try {
    userCustomVisuals = JSON.parse(localStorage.getItem('smriti_user_custom_visuals') || '{}');
  } catch (e) {}

  // Web Audio Synthesizer for Instrumentals & Quiz Sounds
  function stopSynthesizer() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (synthAudioCtx) {
      try { synthAudioCtx.close(); } catch (e) {}
      synthAudioCtx = null;
    }
    currentPlayingAudio = null;
  }

  function playSynthesizedMelody(notes, title, waveType = 'sine', tempo = 500) {
    stopSynthesizer();
    stopQuizAudio();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      alert('Audio synthesizer is not supported on this browser.');
      return;
    }

    synthAudioCtx = new AudioContext();
    currentPlayingAudio = title;
    render();

    let noteIdx = 0;
    const playNext = () => {
      if (!synthAudioCtx || synthAudioCtx.state === 'closed') return;
      const freq = notes[noteIdx % notes.length];
      const osc = synthAudioCtx.createOscillator();
      const gain = synthAudioCtx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, synthAudioCtx.currentTime);

      gain.gain.setValueAtTime(0, synthAudioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.28, synthAudioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, synthAudioCtx.currentTime + (tempo / 1000) * 0.95);

      osc.connect(gain);
      gain.connect(synthAudioCtx.destination);

      osc.start(synthAudioCtx.currentTime);
      osc.stop(synthAudioCtx.currentTime + tempo / 1000);

      noteIdx++;
    };

    playNext();
    synthInterval = setInterval(playNext, tempo);
  }

  // Audio for Quiz (Strictly for Instrument mode)
  function stopQuizAudio() {
    if (quizInterval) {
      clearInterval(quizInterval);
      quizInterval = null;
    }
    if (quizAudioCtx) {
      try { quizAudioCtx.close(); } catch (e) {}
      quizAudioCtx = null;
    }
    isQuizAudioPlaying = false;
  }

  function toggleQuizAudio(notes, waveType = 'sine', tempo = 500) {
    if (isQuizAudioPlaying) {
      stopQuizAudio();
      render();
      return;
    }

    stopSynthesizer();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    quizAudioCtx = new AudioContext();
    isQuizAudioPlaying = true;
    render();

    let idx = 0;
    const playNote = () => {
      if (!quizAudioCtx || quizAudioCtx.state === 'closed') return;
      const freq = notes[idx % notes.length];
      const osc = quizAudioCtx.createOscillator();
      const gain = quizAudioCtx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, quizAudioCtx.currentTime);

      gain.gain.setValueAtTime(0, quizAudioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, quizAudioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, quizAudioCtx.currentTime + (tempo / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(quizAudioCtx.destination);

      osc.start(quizAudioCtx.currentTime);
      osc.stop(quizAudioCtx.currentTime + tempo / 1000);

      idx++;
    };

    playNote();
    quizInterval = setInterval(playNote, tempo);
  }

  function render() {
    // Current visual list combining defaults + custom uploads
    const activeVisualsList = [
      ...(userCustomVisuals[visualSubTab] || []),
      ...(defaultVisuals[visualSubTab] || [])
    ];

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 760px; padding-bottom: 3.5rem;">
        
        <!-- Header Banner -->
        <div class="card card-elevated text-center mb-md" style="background: linear-gradient(135deg, #FFF9F2, #FFF2E2); border: 2px solid #F3E8DC; padding: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.35rem;">🎭🎶</div>
          <h2 style="color: var(--maroon, #9B2C2C); margin: 0; font-size: 1.8rem; font-weight: 800;">Entertainment & Cultural Joy</h2>
          <p class="text-muted" style="margin: 0.35rem 0 0 0; font-size: 1.05rem;">
            Nostalgic melodies, cultural sound quiz, soothing stories & nature visuals
          </p>
        </div>

        <!-- 4 Primary Entertainment Tabs -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.5rem;">
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'quiz' ? 'btn-primary text-white' : ''}" data-tab="quiz" style="padding: 0.75rem 0.3rem; font-size: 0.95rem; font-weight: 700; flex-direction: column; gap: 4px;">
            <span>🎯</span> Quiz
          </button>
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'music' ? 'btn-primary text-white' : ''}" data-tab="music" style="padding: 0.75rem 0.3rem; font-size: 0.95rem; font-weight: 700; flex-direction: column; gap: 4px;">
            <span>🎵</span> Melodies
          </button>
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'stories' ? 'btn-primary text-white' : ''}" data-tab="stories" style="padding: 0.75rem 0.3rem; font-size: 0.95rem; font-weight: 700; flex-direction: column; gap: 4px;">
            <span>📖</span> Stories
          </button>
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'visuals' ? 'btn-primary text-white' : ''}" data-tab="visuals" style="padding: 0.75rem 0.3rem; font-size: 0.95rem; font-weight: 700; flex-direction: column; gap: 4px;">
            <span>🌿</span> Visuals
          </button>
        </div>

        <!-- Now Playing Status Bar -->
        ${currentPlayingAudio ? `
          <div class="card card-elevated mb-md" style="background: #ECFDF5; border: 2px solid #6EE7B7; border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="font-size: 1.8rem;">🎶</div>
              <div>
                <div style="font-size: 0.8rem; font-weight: 700; color: #047857; text-transform: uppercase;">Now Playing Gently</div>
                <div style="font-weight: 700; color: #064E3B; font-size: 1.05rem;">${currentPlayingAudio}</div>
              </div>
            </div>
            <button id="btn-stop-audio" class="btn btn-secondary btn-sm" style="background: #DC2626; color: white; border: none; font-weight: 700; padding: 0.5rem 1rem;">
              ⏹️ Stop
            </button>
          </div>
        ` : ''}

        <!-- 1. MULTIMEDIA QUIZ TAB (10 Questions & Results Screen) -->
        ${activeTab === 'quiz' ? `
          <div class="card card-elevated" style="background: #FFFDF9; border: 2px solid #FDE68A; border-radius: 18px; padding: 1.75rem; margin-bottom: 1.5rem;">
            <!-- Quiz Mode Selectors -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="color: var(--maroon, #9B2C2C); margin: 0; font-size: 1.3rem;">🎵 Interactive Cultural Sound Quiz</h3>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-sm btn-quiz-mode ${quizMode === 'instrument' ? 'btn-primary' : 'btn-outline'}" data-mode="instrument">🪈 Instrument</button>
                <button class="btn btn-sm btn-quiz-mode ${quizMode === 'song' ? 'btn-primary' : 'btn-outline'}" data-mode="song">📻 Song</button>
                <button class="btn btn-sm btn-quiz-mode ${quizMode === 'singer' ? 'btn-primary' : 'btn-outline'}" data-mode="singer">🎤 Singer</button>
              </div>
            </div>

            <!-- Quiz Body: Finished Screen vs Active Question -->
            ${quizFinished ? `
              <div style="background: #FFFFFF; border-radius: 16px; padding: 2rem 1.5rem; border: 1.5px solid #E2E8F0; text-align: center;">
                <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🏆</div>
                <h3 style="color: var(--maroon, #9B2C2C); font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem;">
                  Quiz Completed!
                </h3>
                <p style="color: #64748B; font-size: 1.05rem; margin-bottom: 1.5rem;">
                  You completed all 10 questions in the ${quizMode.toUpperCase()} challenge!
                </p>

                <!-- Stats summary cards -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1rem;">
                    <div style="font-size: 0.85rem; color: #64748B; font-weight: 700;">Score</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #0F766E;">${quizScore} / 100</div>
                  </div>
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1rem;">
                    <div style="font-size: 0.85rem; color: #64748B; font-weight: 700;">Accuracy</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #2563EB;">
                      ${Math.round((quizSessionReview.filter(r => r.isCorrect).length / SESSION_LIMIT) * 100)}%
                    </div>
                  </div>
                  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1rem;">
                    <div style="font-size: 0.85rem; color: #64748B; font-weight: 700;">Coins Earned</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #D97706;">${quizScore} 🪙</div>
                  </div>
                </div>

                <!-- Review of all 10 questions -->
                <h4 style="text-align: left; color: #334155; font-size: 1.15rem; margin-bottom: 0.75rem;">Question Review:</h4>
                <div style="display: flex; flex-direction: column; gap: 0.65rem; max-height: 240px; overflow-y: auto; text-align: left; margin-bottom: 1.5rem; padding-right: 0.5rem;">
                  ${quizSessionReview.map((r, i) => `
                    <div style="padding: 0.75rem; border-radius: 10px; background: ${r.isCorrect ? '#ECFDF5' : '#FEF2F2'}; border: 1px solid ${r.isCorrect ? '#A7F3D0' : '#FECACA'};">
                      <div style="font-weight: 700; font-size: 0.95rem; color: #1E293B;">
                        ${i + 1}. ${r.question}
                      </div>
                      <div style="font-size: 0.85rem; margin-top: 4px; color: ${r.isCorrect ? '#065F46' : '#991B1B'};">
                        ${r.isCorrect ? '✅ Correct:' : '❌ Selected: ' + r.chosen + ' | Correct:'} <strong>${r.correct}</strong>
                      </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                  <button id="btn-replay-quiz" class="btn btn-primary" style="font-size: 1.05rem; font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 12px;">
                    🔄 Play Again (10 New Questions)
                  </button>
                  <a href="#/games" class="btn btn-outline" style="font-size: 1.05rem; font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 12px; text-decoration: none;">
                    🎮 Back to Games Hub
                  </a>
                </div>
              </div>
            ` : `
              <!-- Active Question View -->
              ${(() => {
                const q = sessionQuestions[currentQuestionIndex];
                if (!q) {
                  return `
                    <div style="padding: 2rem; text-align: center; color: #64748B;">
                      <p>Loading questions...</p>
                    </div>
                  `;
                }

                const optionsToRender = q.options && q.options.length > 0 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];

                return `
                  <div style="background: #FFFFFF; border-radius: 16px; padding: 1.5rem; border: 1.5px solid #E2E8F0; text-align: center;">
                    <!-- Question Counter & Progress Bar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; font-weight: 700; color: var(--teal-dark, #0F766E); margin-bottom: 0.5rem;">
                      <span>Question ${currentQuestionIndex + 1} of ${SESSION_LIMIT}</span>
                      <span>Score: ${quizScore} 🪙</span>
                    </div>
                    
                    <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 999px; margin-bottom: 1.25rem; overflow: hidden;">
                      <div style="width: ${((currentQuestionIndex + 1) / SESSION_LIMIT) * 100}%; height: 100%; background: #0D9488; transition: width 0.3s ease;"></div>
                    </div>

                    <h4 style="font-size: 1.25rem; color: #1E293B; margin-bottom: 1.25rem; line-height: 1.4;">${q.title}</h4>

                    <!-- Strict Instrument Audio Button (Only shown in 'instrument' mode) -->
                    ${quizMode === 'instrument' ? `
                      <div style="margin-bottom: 1.5rem;">
                        <button id="btn-quiz-audio" class="btn" style="min-height: 56px; min-width: 220px; font-size: 1.15rem; font-weight: 700; border-radius: 999px; background: ${isQuizAudioPlaying ? '#DC2626' : '#0D9488'}; color: #FFFFFF; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                          ${isQuizAudioPlaying ? '⏸️ Pause Sound' : '▶️ Play Sound Clip'}
                        </button>
                        <div style="font-size: 0.85rem; color: #64748B; margin-top: 6px;">Tap to listen with headphones or device speakers</div>
                      </div>
                    ` : ''}

                    <!-- Options Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
                      ${optionsToRender.map(opt => `
                        <button class="btn btn-outline btn-quiz-opt" data-answer="${opt}" style="min-height: 56px; font-size: 1.05rem; font-weight: 700; border-radius: 12px; padding: 0.75rem; text-align: center;">
                          ${opt}
                        </button>
                      `).join('')}
                    </div>

                    <!-- Result and Fun Fact Box -->
                    <div id="quiz-feedback" style="display: none; padding: 12px; border-radius: 10px; margin-top: 1rem; font-weight: 600; font-size: 1rem;"></div>
                  </div>
                `;
              })()}
            `}
          </div>
        ` : ''}

        <!-- 2. MELODIES TAB WITH CUSTOM COVER UPLOAD -->
        ${activeTab === 'music' ? `
          <div style="display: flex; flex-direction: column; gap: 1.15rem;">
            <div class="card" style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 14px; padding: 1rem; font-size: 0.95rem; color: #166534;">
              💡 <strong>Personalize Covers:</strong> You can upload custom album photos or personal nostalgic pictures for any melody using the 📷 button on each card!
            </div>

            ${defaultInstrumentals.map(inst => {
              const coverImg = customCovers[inst.id] || inst.defaultCover;
              const isPlaying = currentPlayingAudio === inst.title;
              return `
                <div class="card card-elevated" style="display: flex; gap: 1.25rem; align-items: center; padding: 1.25rem; border-radius: 16px; border: 1.5px solid #F1F5F9; background: #FFFFFF;">
                  <!-- Melody Thumbnail with Upload Trigger -->
                  <div style="position: relative; width: 105px; height: 105px; min-width: 105px; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                    <img src="${coverImg}" alt="${inst.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    <label for="cover-inp-${inst.id}" style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.65); color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem;" title="Upload custom cover">
                      📷
                    </label>
                    <input type="file" id="cover-inp-${inst.id}" class="melody-cover-input" data-id="${inst.id}" accept="image/*" style="display: none;">
                  </div>

                  <!-- Details -->
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                      <span style="font-size: 1.35rem;">${inst.icon}</span>
                      <h4 style="margin: 0; color: #1E293B; font-size: 1.15rem; font-weight: 700;">${inst.title}</h4>
                    </div>
                    <p style="margin: 0 0 0.75rem 0; font-size: 0.92rem; color: #64748B; line-height: 1.4;">${inst.desc}</p>
                    
                    <button class="btn btn-sm btn-play-melody ${isPlaying ? 'btn-secondary' : 'btn-primary'}" data-id="${inst.id}" style="min-height: 40px; font-weight: 700; padding: 0.4rem 1.15rem; border-radius: 999px;">
                      ${isPlaying ? '⏹️ Stop' : '▶️ Play Melody'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- 3. STORIES TAB WITH READ ALOUD -->
        ${activeTab === 'stories' ? `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="color: var(--maroon, #9B2C2C); margin: 0; font-size: 1.35rem;">📖 Gentle Cultural Life Stories</h3>
              <button id="btn-refresh-stories" class="btn btn-outline btn-sm" style="border-radius: 999px; font-weight: 700;">
                ⟳ More Stories
              </button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${visibleStories.map(st => `
                <div class="card card-elevated" style="background: #FFFFFF; border-radius: 16px; border: 1.5px solid #F1F5F9; padding: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span style="font-size: 1.5rem;">${st.icon}</span>
                      <h4 style="margin: 0; color: #0F172A; font-size: 1.2rem; font-weight: 800;">${st.title}</h4>
                    </div>
                    <span style="font-size: 0.8rem; background: #F1F5F9; color: #475569; padding: 0.25rem 0.65rem; border-radius: 999px; font-weight: 600;">
                      ${st.duration}
                    </span>
                  </div>

                  <p style="color: #334155; font-size: 1.05rem; line-height: 1.65; margin: 0 0 1rem 0;">
                    ${st.text}
                  </p>

                  <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 0.75rem 1rem; border-radius: 4px 8px 8px 4px; margin-bottom: 1rem;">
                    <span style="font-weight: 700; color: #92400E; font-size: 0.9rem;">Gentle Thought:</span>
                    <span style="color: #B45309; font-size: 0.95rem;"> "${st.moral}"</span>
                  </div>

                  <button class="btn btn-outline btn-sm btn-read-story" data-text="${encodeURIComponent(st.text)}" style="border-radius: 999px; font-weight: 700; color: var(--teal-dark, #0F766E); border-color: #99F6E4;">
                    🔊 Read Story Aloud
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 4. VISUALS TAB -->
        ${activeTab === 'visuals' ? `
          <div>
            <!-- Visual sub-tabs -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'greenery' ? 'btn-primary' : 'btn-outline'}" data-sub="greenery">🍃 Tea & Forests</button>
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'animals' ? 'btn-primary' : 'btn-outline'}" data-sub="animals">🦏 Wildlife</button>
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'vegetation' ? 'btn-primary' : 'btn-outline'}" data-sub="vegetation">🌾 Fields & Flora</button>
              </div>

              <button id="btn-toggle-upload-vis" class="btn btn-sm btn-secondary" style="border-radius: 999px; font-weight: 700;">
                📷 Upload Nature Photo
              </button>
            </div>

            <!-- Upload Custom Visual Panel -->
            <div id="panel-upload-vis" class="card card-elevated mb-md" style="display: none; background: #F8FAFC; border: 2px dashed #94A3B8; border-radius: 14px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: #1E293B;">Add a Cherished Personal Nature Photo</h4>
              <form id="form-upload-vis" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <input type="text" id="vis-title" class="form-control" placeholder="Photo Title (e.g., Morning walk at tea garden)" required>
                <select id="vis-cat" class="form-control">
                  <option value="greenery">🍃 Tea & Forests</option>
                  <option value="animals">🦏 Wildlife</option>
                  <option value="vegetation">🌾 Fields & Flora</option>
                </select>
                <input type="text" id="vis-caption" class="form-control" placeholder="Short peaceful caption...">
                <input type="file" id="vis-file" class="form-control" accept="image/*" required>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                  <button type="button" id="btn-cancel-visual" class="btn btn-ghost btn-sm">Cancel</button>
                  <button type="submit" class="btn btn-primary btn-sm">Save Photo</button>
                </div>
              </form>
            </div>

            <!-- Visual Cards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
              ${activeVisualsList.map(item => `
                <div class="card card-elevated" style="overflow: hidden; border-radius: 16px; border: 1.5px solid #F1F5F9; background: #FFFFFF; padding: 0;">
                  <div style="width: 100%; height: 210px; overflow: hidden; background: #F1F5F9;">
                    <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" loading="lazy">
                  </div>
                  <div style="padding: 1.15rem;">
                    <h4 style="margin: 0 0 0.4rem 0; color: #1E293B; font-size: 1.1rem; font-weight: 700;">${item.title}</h4>
                    <p style="margin: 0; color: #64748B; font-size: 0.92rem; line-height: 1.45;">${item.caption}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    // --- Wire Event Handlers ---

    // Primary Tabs
    container.querySelectorAll('.ent-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        stopSynthesizer();
        stopQuizAudio();
        render();
      });
    });

    // Stop General Audio
    const btnStopAudio = container.querySelector('#btn-stop-audio');
    if (btnStopAudio) {
      btnStopAudio.addEventListener('click', () => {
        stopSynthesizer();
        render();
      });
    }

    // Quiz Mode Switchers
    container.querySelectorAll('.btn-quiz-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        quizMode = btn.getAttribute('data-mode');
        initQuizSession(quizMode);
        render();
      });
    });

    // Replay Quiz Button
    const btnReplayQuiz = container.querySelector('#btn-replay-quiz');
    if (btnReplayQuiz) {
      btnReplayQuiz.addEventListener('click', () => {
        initQuizSession(quizMode);
        render();
      });
    }

    // Quiz Audio Button (Strictly instrument mode)
    const btnQuizAudio = container.querySelector('#btn-quiz-audio');
    if (btnQuizAudio) {
      btnQuizAudio.addEventListener('click', () => {
        const q = sessionQuestions[currentQuestionIndex];
        if (q && q.notes) {
          toggleQuizAudio(q.notes, q.wave || 'sine', q.tempo || 500);
        }
      });
    }

    // Quiz Option Click Handler (With -5 coin deduction on wrong answer)
    container.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = sessionQuestions[currentQuestionIndex];
        if (!q) return;

        const selected = btn.getAttribute('data-answer');
        const feedback = container.querySelector('#quiz-feedback');
        const allOpts = container.querySelectorAll('.btn-quiz-opt');
        allOpts.forEach(b => b.disabled = true);

        stopQuizAudio();

        const isCorrect = selected === q.correct;
        quizSessionReview.push({
          question: q.title,
          chosen: selected,
          correct: q.correct,
          isCorrect
        });

        if (isCorrect) {
          btn.style.background = '#0D9488';
          btn.style.color = '#FFFFFF';
          quizScore += 10;
          Coins.add(10, 'Music Quiz');
          if (feedback) {
            feedback.style.display = 'block';
            feedback.style.background = '#ECFDF5';
            feedback.style.color = '#064E3B';
            feedback.style.border = '1.5px solid #6EE7B7';
            feedback.innerHTML = `🎉 <strong>Correct!</strong> ${q.fact}`;
          }
          if (TTS && TTS.isSupported()) TTS.speak("Correct! " + q.fact);
        } else {
          btn.style.background = '#DC2626';
          btn.style.color = '#FFFFFF';
          Coins.deduct(5, 'Wrong answer in quiz');
          if (feedback) {
            feedback.style.display = 'block';
            feedback.style.background = '#FEF2F2';
            feedback.style.color = '#991B1B';
            feedback.style.border = '1.5px solid #F87171';
            feedback.innerHTML = `Not quite! The correct answer was <strong>${q.correct}</strong>. ${q.fact}`;
          }
          allOpts.forEach(b => {
            if (b.getAttribute('data-answer') === q.correct) {
              b.style.background = '#0D9488';
              b.style.color = '#FFFFFF';
            }
          });
          if (TTS && TTS.isSupported()) TTS.speak("The correct answer was " + q.correct);
        }

        setTimeout(() => {
          if (currentQuestionIndex + 1 >= SESSION_LIMIT || currentQuestionIndex + 1 >= sessionQuestions.length) {
            quizFinished = true;
          } else {
            currentQuestionIndex++;
          }
          render();
        }, 2400);
      });
    });

    // Play Instrumental Melodies
    container.querySelectorAll('.btn-play-melody').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const m = defaultInstrumentals.find(item => item.id === id);
        if (m) {
          playSynthesizedMelody(m.notes, m.title, m.waveType, m.tempo);
        }
      });
    });

    // Custom Melody Cover Upload
    container.querySelectorAll('.melody-cover-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        const instId = inp.getAttribute('data-id');
        if (file && instId) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            customCovers[instId] = evt.target.result;
            try {
              localStorage.setItem('smriti_custom_melody_covers', JSON.stringify(customCovers));
            } catch (err) {}
            if (window.SmritiToast) {
              window.SmritiToast.show('Cover image updated! 🎵📸', 'success');
            }
            render();
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Refresh Stories (⟳)
    const btnRefreshStories = container.querySelector('#btn-refresh-stories');
    if (btnRefreshStories) {
      btnRefreshStories.addEventListener('click', () => {
        shuffleStories();
      });
    }

    // Read Aloud Stories
    container.querySelectorAll('.btn-read-story').forEach(btn => {
      btn.addEventListener('click', () => {
        stopSynthesizer();
        stopQuizAudio();
        const text = decodeURIComponent(btn.getAttribute('data-text'));
        if (TTS) TTS.speak(text);
      });
    });

    // Visuals Sub-tab Switcher
    container.querySelectorAll('.btn-vis-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        visualSubTab = btn.getAttribute('data-sub');
        render();
      });
    });

    // Toggle Custom Visual Upload Form
    const toggleUploadBtn = container.querySelector('#btn-toggle-upload-vis');
    const uploadPanel = container.querySelector('#panel-upload-vis');
    const cancelUploadBtn = container.querySelector('#btn-cancel-visual');
    if (toggleUploadBtn && uploadPanel) {
      toggleUploadBtn.addEventListener('click', () => {
        uploadPanel.style.display = uploadPanel.style.display === 'none' ? 'block' : 'none';
      });
    }
    if (cancelUploadBtn && uploadPanel) {
      cancelUploadBtn.addEventListener('click', () => {
        uploadPanel.style.display = 'none';
      });
    }

    // Save Custom Visual Photo
    const formUploadVis = container.querySelector('#form-upload-vis');
    if (formUploadVis) {
      formUploadVis.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#vis-title')?.value.trim();
        const cat = container.querySelector('#vis-cat')?.value || 'greenery';
        const caption = container.querySelector('#vis-caption')?.value.trim();
        const file = container.querySelector('#vis-file')?.files[0];

        if (!title || !file) {
          alert('Please enter a photo title and select an image file.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
          userCustomVisuals[cat] = userCustomVisuals[cat] || [];
          userCustomVisuals[cat].unshift({
            id: 'custom_vis_' + Date.now(),
            title,
            image: evt.target.result,
            caption: caption || 'Cherished personal memory'
          });

          try {
            localStorage.setItem('smriti_user_custom_visuals', JSON.stringify(userCustomVisuals));
          } catch (err) {}

          if (window.SmritiToast) {
            window.SmritiToast.show('Nature photo saved! 🌿📸', 'success');
          }

          visualSubTab = cat;
          render();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  render();

  return {
    cleanup() {
      stopSynthesizer();
      stopQuizAudio();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('hashchange', handleHashChange);
    }
  };
}
