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

export default function EntertainmentPage(container) {
  let activeTab = 'quiz'; // 'quiz' | 'music' | 'stories' | 'visuals'
  let currentPlayingAudio = null;
  let synthAudioCtx = null;
  let synthInterval = null;

  // --- Multimedia Quiz State ---
  let quizMode = 'instrument'; // 'instrument' | 'song' | 'singer'
  let currentQuestionIndex = 0;
  let quizScore = 0;
  let isQuizAudioPlaying = false;
  let quizAudioCtx = null;
  let quizInterval = null;

  // --- Visuals Sub-tab State ---
  let visualSubTab = 'greenery'; // 'greenery' | 'animals' | 'vegetation'

  // Quiz Data with distinct acoustic frequencies & wave patterns
  const quizData = {
    instrument: [
      {
        id: 'q_inst_1',
        title: 'Listen carefully to this sweet, high-pitched wind instrument:',
        notes: [587.33, 659.25, 739.99, 880.00, 987.77, 880.00, 739.99, 659.25], // Bansuri Raga Yaman
        wave: 'sine',
        tempo: 450,
        options: ['Bansuri (Bamboo Flute) 🪈', 'Tabla (Drums) 🥁', 'Sitar (Strings) 🪕', 'Shehnai 🎺'],
        correct: 'Bansuri (Bamboo Flute) 🪈',
        fact: 'The bamboo flute (Bansuri) has echoed across Indian classical music and Krishna folklore for thousands of years!'
      },
      {
        id: 'q_inst_2',
        title: 'Listen to the deep resonant rhythmic beats:',
        notes: [130.81, 146.83, 164.81, 130.81, 174.61, 146.83, 130.81], // Tabla rhythm
        wave: 'triangle',
        tempo: 380,
        options: ['Tabla 🥁', 'Veena 🎼', 'Flute 🪈', 'Harmonium 🎹'],
        correct: 'Tabla 🥁',
        fact: 'The Tabla consists of the Dayan (treble) and Bayan (bass drum), creating the heartbeat of Indian music.'
      },
      {
        id: 'q_inst_3',
        title: 'Listen to these delicate acoustic strings with resonating sympathetic buzz:',
        notes: [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 493.88], // Sitar Raga Bhairav
        wave: 'sawtooth',
        tempo: 500,
        options: ['Sitar 🪕', 'Shehnai 🎺', 'Dholak 🥁', 'Bansuri 🪈'],
        correct: 'Sitar 🪕',
        fact: 'Made world-famous by Pandit Ravi Shankar, the sitar has movable frets and sympathetic buzzing strings.'
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
      }
    ],
    singer: [
      {
        id: 'q_sing_1',
        title: 'Who was revered as the "Nightingale of India" with timeless melodies?',
        notes: [440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00], // Lata Nightingale high pure sine
        wave: 'sine',
        tempo: 650,
        options: ['Lata Mangeshkar 🕊️', 'Asha Bhosle 🌸', 'Geeta Dutt 📻', 'M. S. Subbulakshmi 🪷'],
        correct: 'Lata Mangeshkar 🕊️',
        fact: 'Bharat Ratna Lata Mangeshkar recorded songs in over 36 languages across seven legendary decades.'
      },
      {
        id: 'q_sing_2',
        title: 'Which soulful maestro sang "Pal Pal Dil Ke Paas" and "Mere Sapnon Ki Rani"?',
        notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63], // Kishore rich baritone
        wave: 'sawtooth',
        tempo: 500,
        options: ['Kishore Kumar 🎙️', 'Mohammed Rafi 🎤', 'Mukesh 🎼', 'Hemant Kumar 🌊'],
        correct: 'Kishore Kumar 🎙️',
        fact: 'Kishore Kumar was an unmatched genius who could switch between soulful ballads and joyful yodeling!'
      }
    ]
  };

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
  const masterStories = [
    {
      id: 'st_1',
      title: 'The Ancestral Mango Tree',
      text: 'On warm summer afternoons, the whole courtyard would gather under the giant green canopy of our ancestral mango tree. Grandmother would bring slices of raw green mango sprinkled with rock salt and roasted cumin, while grandfather shared tales of rivers and harvests.',
      icon: '🌳'
    },
    {
      id: 'st_2',
      title: 'The Steaming Kettle at Jorhat',
      text: 'Early dawn over the Assam tea gardens smelled of wet leaves and morning rain. The kitchen kettle would begin to whistle softly, announcing fresh ginger tea brewed with rich buffalo milk and cardamoms, shared warm between cupped hands.',
      icon: '☕'
    },
    {
      id: 'st_3',
      title: 'Evening Bells of Kamakhya',
      text: 'As the sun dipped behind the Nilachal hills, the evening temple bells began their rhythmic chime. Incense smoke drifted into the cool Brahmaputra breeze, carrying prayers of safety, peace, and long life for every family member.',
      icon: '🔔'
    },
    {
      id: 'st_4',
      title: 'Grandmother\'s Brass Box',
      text: 'Tucked inside the old carved wooden cupboard was a gleaming brass box with cardamom seeds, cloves, and betel leaves. Whenever grandchildren returned from school, grandmother would gently open it with a smile that felt like warm sunshine.',
      icon: '✨'
    }
  ];

  let displayStories = [...masterStories];

  // Visuals Categories with Custom Upload Support
  let customVisuals = [];
  try {
    customVisuals = JSON.parse(localStorage.getItem('smriti_custom_visuals') || '[]');
  } catch (e) {}

  const defaultVisuals = {
    greenery: [
      {
        id: 'vis_gr_1',
        title: 'Serene Assam Tea Slopes',
        caption: '“Take a slow breath. Like morning mist, all worries softly melt away.” 🌿',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'vis_gr_2',
        title: 'Lush Bamboo Groves of Meghalaya',
        caption: 'Gentle green bamboo stalks swaying with the mountain breeze. 🎋',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80'
      }
    ],
    animals: [
      {
        id: 'vis_an_1',
        title: 'Gentle Asian Elephant with Calf',
        caption: 'Walking peacefully through Kaziranga grasslands with maternal love. 🐘',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'vis_an_2',
        title: 'Colorful Great Hornbill',
        caption: 'The majestic guardian bird of the northeast forests soaring above canopies. 🦅',
        image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80'
      }
    ],
    vegetation: [
      {
        id: 'vis_vg_1',
        title: 'Golden Paddy Fields at Harvest',
        caption: 'Golden ripened rice stalks dancing beneath autumn skies. 🌾',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'vis_vg_2',
        title: 'Wild Foxtail Orchids (Kopou Phool)',
        caption: 'Vibrant spring blossom celebrated in Assam as a symbol of youth and joy. 🌸',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80'
      }
    ]
  };

  function stopSynthesizer() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (synthAudioCtx) {
      try { synthAudioCtx.close(); } catch {}
      synthAudioCtx = null;
    }
    currentPlayingAudio = null;
  }

  function stopQuizAudio() {
    if (quizInterval) {
      clearInterval(quizInterval);
      quizInterval = null;
    }
    if (quizAudioCtx) {
      try { quizAudioCtx.close(); } catch {}
      quizAudioCtx = null;
    }
    isQuizAudioPlaying = false;
  }

  function playSynthesizedMelody(notes, title, waveType = 'sine', tempo = 600) {
    stopSynthesizer();
    stopQuizAudio();
    if (TTS) TTS.stop();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    synthAudioCtx = new AudioContext();
    currentPlayingAudio = title;

    let step = 0;
    const playNote = () => {
      if (!synthAudioCtx) return;
      const freq = notes[step % notes.length];
      const osc = synthAudioCtx.createOscillator();
      const gain = synthAudioCtx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, synthAudioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, synthAudioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, synthAudioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, synthAudioCtx.currentTime + (tempo / 1000) * 1.2);

      osc.connect(gain);
      gain.connect(synthAudioCtx.destination);

      osc.start();
      osc.stop(synthAudioCtx.currentTime + (tempo / 1000) * 1.3);
      step++;
    };

    playNote();
    synthInterval = setInterval(playNote, tempo);
    render();
  }

  function toggleQuizAudio(notes, waveType = 'sine', tempo = 550) {
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

    let step = 0;
    const playStep = () => {
      if (!quizAudioCtx) return;
      const freq = notes[step % notes.length];
      const osc = quizAudioCtx.createOscillator();
      const gain = quizAudioCtx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, quizAudioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, quizAudioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22, quizAudioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, quizAudioCtx.currentTime + (tempo / 1000) * 1.2);

      osc.connect(gain);
      gain.connect(quizAudioCtx.destination);

      osc.start();
      osc.stop(quizAudioCtx.currentTime + (tempo / 1000) * 1.3);
      step++;
    };

    playStep();
    quizInterval = setInterval(playStep, tempo);
    render();
  }

  function shuffleStories() {
    displayStories = [...masterStories].sort(() => Math.random() - 0.5);
    if (window.SmritiToast) {
      window.SmritiToast.show('Refreshed comforting stories! 📖✨', 'success');
    }
    render();
  }

  function render() {
    // Determine active visuals list including custom uploads
    const activeVisualsList = [
      ...(defaultVisuals[visualSubTab] || []),
      ...customVisuals.filter(v => v.category === visualSubTab)
    ];

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 760px; padding-bottom: 3.5rem;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h2 style="color: var(--maroon, #9B2C2C); margin: 0; font-size: 1.8rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎭</span> Entertainment & Mind Games
            </h2>
            <p class="text-muted" style="margin: 0.2rem 0 0 0; font-size: 0.95rem;">Interactive music quiz, golden melodies & heartwarming stories</p>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/home'">⬅ Home</button>
        </div>

        <!-- Entertainment Tabs -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.25rem; background: #FFF; padding: 6px; border-radius: 16px; border: 1.5px solid #F3E8DC;">
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'quiz' ? 'btn-primary text-white' : ''}" data-tab="quiz" style="padding: 0.75rem 0.3rem; font-size: 0.95rem; font-weight: 700; flex-direction: column; gap: 4px;">
            <span>🧩</span> Music Quiz
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

        <!-- 1. MULTIMEDIA QUIZ TAB -->
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

            <!-- Quiz Card -->
            ${(() => {
              const currentList = quizData[quizMode] || quizData.instrument;
              const safeIndex = currentQuestionIndex % currentList.length;
              const q = currentList[safeIndex];
              return `
                <div style="background: #FFFFFF; border-radius: 16px; padding: 1.5rem; border: 1.5px solid #E2E8F0; text-align: center;">
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--teal-dark, #0F766E); margin-bottom: 0.5rem;">
                    Question ${safeIndex + 1} of ${currentList.length} • Score: ${quizScore} 🪙
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
                    ${q.options.map(opt => `
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
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; gap: 8px; background: #FFF; padding: 4px; border-radius: 12px; border: 1px solid #E2E8F0;">
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'greenery' ? 'btn-primary' : 'btn-ghost'}" data-sub="greenery">🌿 Greenery</button>
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'animals' ? 'btn-primary' : 'btn-ghost'}" data-sub="animals">🐘 Animals</button>
                <button class="btn btn-sm btn-vis-sub ${visualSubTab === 'vegetation' ? 'btn-primary' : 'btn-ghost'}" data-sub="vegetation">🌾 Vegetation</button>
              </div>
              <button id="btn-open-custom-visual" class="btn btn-secondary btn-sm" style="font-weight: 700;">
                📷 Add Custom Visual
              </button>
            </div>

            <!-- Upload Custom Visual Panel (Toggleable) -->
            <div id="panel-add-visual" style="display: none; background: #FFFDF9; border: 1.5px dashed var(--teal, #0D9488); border-radius: 14px; padding: 1.25rem;">
              <h4 style="margin: 0 0 0.5rem 0; color: var(--maroon, #9B2C2C);">📷 Add Your Scenic or Family Photo</h4>
              <p style="font-size: 0.85rem; color: #64748B; margin-bottom: 0.85rem;">Upload a comforting nature or family photo to enjoy during relaxation.</p>
              <form id="form-custom-visual" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label class="form-label" style="font-size: 0.85rem; font-weight: 700;">Title</label>
                  <input type="text" id="vis-title" class="form-input" placeholder="e.g. My Backyard Garden" required />
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
        currentQuestionIndex = 0;
        stopQuizAudio();
        render();
      });
    });

    // Quiz Audio Toggle
    const quizAudioBtn = container.querySelector('#btn-quiz-audio');
    if (quizAudioBtn) {
      quizAudioBtn.addEventListener('click', () => {
        const currentList = quizData[quizMode] || quizData.instrument;
        const q = currentList[currentQuestionIndex % currentList.length];
        if (q) {
          toggleQuizAudio(q.notes, q.wave, q.tempo);
        }
      });
    }

    // Quiz Options Handlers with safe indexing guard
    container.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentList = quizData[quizMode] || quizData.instrument;
        const safeIndex = currentQuestionIndex % currentList.length;
        const q = currentList[safeIndex];
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
          currentQuestionIndex = (currentQuestionIndex + 1) % currentList.length;
          render();
        }, 2800);
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

    // Visuals Sub-tab buttons
    container.querySelectorAll('.btn-vis-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        visualSubTab = btn.getAttribute('data-sub');
        render();
      });
    });

    // Custom Visual Upload Panel Toggle
    const btnOpenVisual = container.querySelector('#btn-open-custom-visual');
    const panelVisual = container.querySelector('#panel-add-visual');
    const btnCancelVisual = container.querySelector('#btn-cancel-visual');
    const formVisual = container.querySelector('#form-custom-visual');

    if (btnOpenVisual && panelVisual) {
      btnOpenVisual.addEventListener('click', () => {
        panelVisual.style.display = panelVisual.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (btnCancelVisual && panelVisual) {
      btnCancelVisual.addEventListener('click', () => {
        panelVisual.style.display = 'none';
      });
    }

    if (formVisual) {
      formVisual.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#vis-title').value.trim();
        const category = container.querySelector('#vis-cat').value;
        const caption = container.querySelector('#vis-caption').value.trim() || 'A peaceful cherished scene.';
        const fileInp = container.querySelector('#vis-file');
        const file = fileInp.files && fileInp.files[0];

        if (title && file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const newVis = {
              id: 'vis_custom_' + Date.now(),
              title,
              category,
              caption,
              image: evt.target.result
            };
            customVisuals.unshift(newVis);
            try {
              localStorage.setItem('smriti_custom_visuals', JSON.stringify(customVisuals));
            } catch (err) {}
            if (window.SmritiToast) {
              window.SmritiToast.show('Custom visual added! 🌿📷', 'success');
            }
            visualSubTab = category;
            render();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  render();

  return {
    cleanup() {
      stopSynthesizer();
      stopQuizAudio();
      if (TTS) TTS.stop();
    }
  };
}
