/* ============================================================
   SMRITI — Entertainment & Interactive Multimedia Quiz
   Senior-accessible gentle music, Bollywood nostalgia, bhajans,
   short stories, and an interactive multimedia cultural quiz
   ("Guess the Instrument", "Guess the Song", "Identify the Singer")
   with explicit user Play/Pause controls.
   ============================================================ */

import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';
import Coins from '../coins.js';

// Top-level module-scoped Quiz Data pool (prevents TDZ ReferenceErrors)
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
    }
  ]
};

export default function EntertainmentPage(container) {
  let activeTab = 'quiz'; // 'quiz' | 'music' | 'stories' | 'visuals'
  let currentPlayingAudio = null;
  let synthAudioCtx = null;
  let synthInterval = null;

  // --- Multimedia Quiz State ---
  let quizMode = 'instrument'; // 'instrument' | 'song' | 'singer'
  let currentQuestion = null;
  let quizScore = 0;
  let isQuizAudioPlaying = false;
  let quizAudioCtx = null;
  let quizInterval = null;
  
  // Track asked question IDs per mode so questions never repeat until pool is exhausted
  const askedQuestions = {
    instrument: new Set(),
    song: new Set(),
    singer: new Set()
  };

  function getRandomQuestion(mode) {
    const list = (quizData && quizData[mode]) || (quizData && quizData.instrument) || [];
    if (!list || list.length === 0) return null;

    const asked = askedQuestions[mode] || new Set();
    
    // If all questions in this mode have been asked, reset pool
    if (asked.size >= list.length) {
      asked.clear();
    }

    // Filter remaining unasked questions
    const available = list.filter(q => !asked.has(q.id));
    const chosen = available[Math.floor(Math.random() * available.length)] || list[0];
    if (chosen && chosen.id) {
      asked.add(chosen.id);
    }

    // Also shuffle options randomly for that question
    const optionsArray = chosen.options ? [...chosen.options] : [];
    const shuffledOptions = optionsArray.sort(() => Math.random() - 0.5);
    return {
      ...chosen,
      options: shuffledOptions
    };
  }

  // Initialize first question safely
  currentQuestion = getRandomQuestion(quizMode);

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
      desc: 'Resonant acoustic sitar plucks evoking spiritual awakening, temple dawns, and inner stillness.',
      defaultCover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'inst_shehnai',
      title: 'Shehnai — Mangal Dhwani',
      notes: [329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 493.88],
      waveType: 'triangle',
      tempo: 650,
      icon: '🎺',
      desc: 'Traditional auspicious wind melody bringing warmth, festive celebration, and fond family weddings.',
      defaultCover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
    },
    {
      id: 'inst_santoor',
      title: 'Santoor — Kashmiri Waters',
      notes: [349.23, 392.00, 440.00, 523.25, 587.33, 659.25, 523.25],
      waveType: 'square',
      tempo: 400,
      icon: '🌊',
      desc: 'Glistening struck zither notes mimicking crystalline Himalayan streams and gentle ripples.',
      defaultCover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80'
    }
  ];

  // Dynamic Stories List with Refresh
  const storiesPool = [
    {
      id: 'story_1',
      title: 'The Courtyard Jasmine of Jorhat',
      icon: '🌸',
      text: 'Every morning in early summer, Dadi would step into the red-brick courtyard with a brass bowl. The fragrant white jasmine blossoms would tumble onto the cool paving stones like stars. She would hum old songs and arrange the flowers by the veranda tea table, filling the entire morning with calm joy.'
    },
    {
      id: 'story_2',
      title: 'The Whistling Mountain Train of Darjeeling',
      icon: '🚂',
      text: 'The tiny blue train puffed slowly up the misty pine hills, blowing a cheerful steam whistle at every bend. Schoolchildren smiled and waved through open wooden windows as the aroma of roasted peanuts and cardamom tea drifted from the platform stalls into the morning breeze.'
    },
    {
      id: 'story_3',
      title: 'The Golden Bihu Kitchen Gathering',
      icon: '🥥',
      text: 'The warm aroma of roasted sticky rice and sweet coconut pitha filled every corner of the ancestral home. Three generations gathered around the earthen stove, laughing as sticky hands rolled sesame laddoos and shared memories of harvests celebrated under the clear winter moon.'
    },
    {
      id: 'story_4',
      title: 'Shillong Cherry Blossoms in Autumn',
      icon: '🌺',
      text: 'When November arrived, the hills around Shillong turned into a delicate sea of pink cherry blossoms. Grandfather would bring out his warm woolen shawl, hold a hot cup of Assam tea, and watch the small mountain birds feast happily on the sweet nectar.'
    }
  ];

  let displayStories = [...storiesPool];

  function shuffleStories() {
    displayStories = [...storiesPool].sort(() => Math.random() - 0.5);
    render();
    if (window.SmritiToast) {
      window.SmritiToast.show('Stories refreshed with new nostalgic tales! 📖✨', 'info');
    }
  }

  // Visuals Gallery Data (Greenery, Animals, Vegetation)
  const defaultVisuals = {
    greenery: [
      {
        id: 'vis_gr_1',
        title: 'Misty Tea Slopes of Upper Assam',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        caption: 'Endless rolling emerald green tea bushes basking peacefully under early morning sunlight and dew.'
      },
      {
        id: 'vis_gr_2',
        title: 'Lush Bamboo Groves of Majuli',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
        caption: 'Tall bamboo shoots gently swaying to the river breeze, providing cool shade and serenity.'
      }
    ],
    animals: [
      {
        id: 'vis_an_1',
        title: 'One-Horned Rhinoceros at Kaziranga',
        image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&auto=format&fit=crop&q=80',
        caption: 'A magnificent rhino grazing peacefully in the tall golden wetlands of Kaziranga National Park.'
      },
      {
        id: 'vis_an_2',
        title: 'Gentle Elephant Family at Sunset',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
        caption: 'Loving elephant herd walking together under a warm orange evening sky.'
      }
    ],
    vegetation: [
      {
        id: 'vis_veg_1',
        title: 'Golden Mustard Fields in Winter',
        image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80',
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

  // Audio for Quiz
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

        <!-- 1. MULTIMEDIA QUIZ TAB (Safeguarded against TDZ ReferenceErrors) -->
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

            <!-- Quiz Card Safeguarded -->
            ${(() => {
              const currentList = (quizData && quizData[quizMode]) || (quizData && quizData.instrument) || [];
              if (!currentList || currentList.length === 0) {
                return `
                  <div style="padding: 2rem; text-align: center; color: #64748B;">
                    <p>Loading cultural quiz questions...</p>
                  </div>
                `;
              }

              const q = currentQuestion || currentList[0];
              if (!q) {
                return `
                  <div style="padding: 2rem; text-align: center; color: #64748B;">
                    <p>No question available right now.</p>
                  </div>
                `;
              }

              const askedCount = (askedQuestions[quizMode] && askedQuestions[quizMode].size) || 1;
              const optionsToRender = (q.options && q.options.length > 0) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];

              return `
                <div style="background: #FFFFFF; border-radius: 16px; padding: 1.5rem; border: 1.5px solid #E2E8F0; text-align: center;">
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--teal-dark, #0F766E); margin-bottom: 0.5rem;">
                    Question ${askedCount} of ${currentList.length} • Score: ${quizScore} 🪙
                  </div>
                  <h4 style="font-size: 1.25rem; color: #1E293B; margin-bottom: 1.25rem; line-height: 1.4;">${q.title}</h4>

                  <!-- Explicit Play / Pause Button -->
                  <div style="margin-bottom: 1.5rem;">
                    <button id="btn-quiz-audio" class="btn" style="min-height: 56px; min-width: 220px; font-size: 1.15rem; font-weight: 700; border-radius: 999px; background: ${isQuizAudioPlaying ? '#DC2626' : '#0D9488'}; color: #FFFFFF; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                      ${isQuizAudioPlaying ? '⏸️ Pause Sound' : '▶️ Play Sound Clip'}
                    </button>
                    <div style="font-size: 0.85rem; color: #64748B; margin-top: 6px;">Tap to listen with headphones or device speakers</div>
                  </div>

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
          </div>
        ` : ''}

        <!-- 2. MELODIES TAB WITH CUSTOM COVER UPLOAD -->
        ${activeTab === 'music' ? `
          <div style="display: flex; flex-direction: column; gap: 1.15rem;">
            <div class="card" style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 14px; padding: 1rem; font-size: 0.95rem; color: #166534;">
              💡 <strong>Personalize Covers:</strong> You can upload custom album photos or personal nostalgic pictures for any melody using the 📷 button on each card!
            </div>

            ${defaultInstrumentals.map(m => {
              const coverImg = customCovers[m.id] || m.defaultCover;
              return `
                <div class="card card-elevated" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <!-- Circular Melody Thumbnail with Upload Overlay -->
                    <div style="position: relative; width: 68px; height: 68px; border-radius: 50%; overflow: hidden; border: 2.5px solid var(--teal, #0D9488); flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                      <img src="${coverImg}" alt="${m.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                      <label title="Upload Custom Melody Cover" style="position: absolute; bottom: 0; right: 0; left: 0; height: 26px; background: rgba(0,0,0,0.6); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; cursor: pointer;">
                        📷
                        <input type="file" accept="image/*" class="melody-cover-input" data-id="${m.id}" style="display: none;" />
                      </label>
                    </div>

                    <div>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 1.3rem;">${m.icon}</span>
                        <h4 style="margin: 0; font-size: 1.15rem; color: var(--maroon, #9B2C2C);">${m.title}</h4>
                      </div>
                      <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: #64748B;">${m.desc}</p>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn btn-primary btn-play-melody" data-id="${m.id}" style="min-height: 48px; min-width: 110px; font-weight: 700;">
                      ▶ Play Tune
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- 3. STORIES TAB WITH REFRESH BUTTON -->
        ${activeTab === 'stories' ? `
          <div style="display: flex; flex-direction: column; gap: 1.15rem;">
            <!-- Header with Refresh Stories (⟳) Button -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: #FFFDF9; padding: 0.85rem 1.25rem; border-radius: 14px; border: 1.5px solid #FDE68A;">
              <div>
                <h4 style="margin: 0; color: var(--maroon, #9B2C2C); font-size: 1.2rem;">📖 Heartwarming Short Stories</h4>
                <div style="font-size: 0.85rem; color: #64748B;">Short, relaxing reminiscence tales tailored for gentle reading or listening.</div>
              </div>
              <button id="btn-refresh-stories" class="btn btn-secondary" style="font-weight: 700; font-size: 1.1rem; padding: 0.5rem 1rem; border-radius: 12px; display: inline-flex; align-items: center; gap: 6px;">
                ⟳ Refresh Stories
              </button>
            </div>

            ${displayStories.map(s => `
              <div class="card card-elevated" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <span style="font-size: 2.2rem;">${s.icon}</span>
                  <h4 style="margin: 0; font-size: 1.25rem; color: var(--maroon, #9B2C2C);">${s.title}</h4>
                </div>
                <p style="font-size: 1.05rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">${s.text}</p>
                <button class="btn btn-secondary btn-read-story" data-text="${encodeURIComponent(s.text)}" style="min-height: 48px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
                  🔊 Listen Aloud
                </button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 4. VISUALS TAB WITH 3 SUB-TABS (Greenery, Animals, Vegetation) + CUSTOM UPLOAD -->
        ${activeTab === 'visuals' ? `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Sub-tabs for Visuals -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'greenery' ? 'btn-primary' : 'btn-outline'}" data-sub="greenery">🌿 Greenery</button>
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'animals' ? 'btn-primary' : 'btn-outline'}" data-sub="animals">🐘 Animals</button>
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'vegetation' ? 'btn-primary' : 'btn-outline'}" data-sub="vegetation">🌾 Vegetation</button>
              </div>
              <button id="btn-toggle-upload-vis" class="btn btn-secondary btn-sm" style="font-weight: 700;">
                + Add Custom Visual Photo
              </button>
            </div>

            <!-- Upload Custom Photo Panel (Hidden by default) -->
            <div id="panel-upload-vis" style="display: none; background: #FFFDF9; border: 1.5px dashed var(--teal, #0D9488); border-radius: 14px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.75rem 0; color: var(--teal, #0D9488);">Upload Nostalgic Nature Photo</h4>
              <form id="form-upload-vis" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Photo Title</label>
                  <input type="text" id="vis-title" class="form-input" placeholder="e.g. Grandma's Garden Marigolds" required />
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Category</label>
                  <select id="vis-cat" class="form-select">
                    <option value="greenery" ${visualSubTab === 'greenery' ? 'selected' : ''}>🌿 Greenery</option>
                    <option value="animals" ${visualSubTab === 'animals' ? 'selected' : ''}>🐘 Animals</option>
                    <option value="vegetation" ${visualSubTab === 'vegetation' ? 'selected' : ''}>🌾 Vegetation</option>
                  </select>
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Comforting Caption</label>
                  <input type="text" id="vis-caption" class="form-input" placeholder="e.g. Blooming marigolds under morning sunlight" />
                </div>
                <div>
                  <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Select Photo File</label>
                  <input type="file" id="vis-file" accept="image/*" class="form-input" required />
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px;">
                  <button type="button" id="btn-cancel-visual" class="btn btn-ghost btn-sm">Cancel</button>
                  <button type="submit" class="btn btn-primary btn-sm">Save Visual</button>
                </div>
              </form>
            </div>

            <!-- Visual Cards Grid -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${activeVisualsList.map(v => `
                <div class="card card-elevated" style="background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1.5px solid #CBD5E1;">
                  <img src="${v.image}" alt="${v.title}" style="width: 100%; height: 280px; object-fit: cover; display: block;">
                  <div style="padding: 1.25rem;">
                    <h4 style="margin: 0 0 6px 0; font-size: 1.2rem; color: var(--maroon, #9B2C2C);">${v.title}</h4>
                    <p style="margin: 0; font-size: 1rem; color: #475569;">${v.caption}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Tab buttons
    container.querySelectorAll('.ent-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        stopQuizAudio();
        stopSynthesizer();
        render();
      });
    });

    // Stop general audio
    const stopAudioBtn = container.querySelector('#btn-stop-audio');
    if (stopAudioBtn) {
      stopAudioBtn.addEventListener('click', () => {
        stopSynthesizer();
        stopQuizAudio();
        if (window.SmritiToast) {
          window.SmritiToast.show('Audio stopped 🌿', 'info');
        }
        render();
      });
    }

    // Quiz Mode Selector
    container.querySelectorAll('.btn-quiz-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        quizMode = btn.getAttribute('data-mode');
        currentQuestion = getRandomQuestion(quizMode);
        stopQuizAudio();
        render();
      });
    });

    // Quiz Audio Toggle
    const quizAudioBtn = container.querySelector('#btn-quiz-audio');
    if (quizAudioBtn) {
      quizAudioBtn.addEventListener('click', () => {
        const q = currentQuestion;
        if (q && q.notes) {
          toggleQuizAudio(q.notes, q.wave, q.tempo);
        }
      });
    }

    // Quiz Options Handlers with dynamic randomization and no repeats
    container.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = currentQuestion;
        if (!q) return;

        const selected = btn.getAttribute('data-answer');
        const feedback = container.querySelector('#quiz-feedback');
        const allOpts = container.querySelectorAll('.btn-quiz-opt');
        allOpts.forEach(b => b.disabled = true);

        stopQuizAudio();

        if (selected === q.correct) {
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
          currentQuestion = getRandomQuestion(quizMode);
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
    }
  };
}
