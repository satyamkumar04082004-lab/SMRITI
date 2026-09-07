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
  let activeTab = 'quiz'; // 'quiz' | 'music' | 'stories' | 'devotional' | 'visuals'
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

  const quizData = {
    instrument: [
      {
        id: 'q_inst_1',
        title: 'Listen carefully to this sweet, high-pitched wind instrument:',
        notes: [293.66, 329.63, 369.99, 440.00, 493.88, 554.37, 587.33],
        wave: 'sine',
        tempo: 600,
        options: ['Bansuri (Bamboo Flute) 🪈', 'Tabla (Drums) 🥁', 'Sitar (Strings) 🪕', 'Shehnai 🎺'],
        correct: 'Bansuri (Bamboo Flute) 🪈',
        fact: 'The bamboo flute (Bansuri) has echoed across Indian classical music and Krishna folklore for thousands of years!'
      },
      {
        id: 'q_inst_2',
        title: 'Listen to the deep resonant rhythmic beats:',
        notes: [130.81, 146.83, 164.81, 130.81, 174.61, 146.83, 130.81],
        wave: 'sine',
        tempo: 500,
        options: ['Tabla 🥁', 'Veena 🎼', 'Flute 🪈', 'Harmonium 🎹'],
        correct: 'Tabla 🥁',
        fact: 'The Tabla consists of the Dayan (treble) and Bayan (bass drum), creating the heartbeat of Indian music.'
      },
      {
        id: 'q_inst_3',
        title: 'Listen to these delicate acoustic strings:',
        notes: [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 493.88],
        wave: 'triangle',
        tempo: 650,
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
        tempo: 750,
        options: ['Ajeeb Dastan Hai Yeh 📻', 'Chura Liya Hai Tumne 🎸', 'Lag Ja Gale 🌸', 'Yeh Dosti 🏍️'],
        correct: 'Ajeeb Dastan Hai Yeh 📻',
        fact: 'From the 1960 movie Dil Apna Aur Preet Parai, sung soulfully by Lata Mangeshkar.'
      },
      {
        id: 'q_song_2',
        title: 'Identify the iconic romantic rain tune:',
        notes: [392.00, 349.23, 329.63, 293.66, 261.63, 329.63, 392.00],
        wave: 'triangle',
        tempo: 700,
        options: ['Pyaar Hua Ikraar Hua ☔', 'Roop Tera Mastana 🔥', 'Ek Ladki Bheegi Bhaagi Si 🌧️', 'Rimjhim Gire Sawan 🌂'],
        correct: 'Pyaar Hua Ikraar Hua ☔',
        fact: 'Featuring Raj Kapoor and Nargis under the black umbrella in Shree 420 (1955).'
      }
    ],
    singer: [
      {
        id: 'q_sing_1',
        title: 'Who was revered as the "Nightingale of India" with timeless melodies?',
        notes: [440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00],
        wave: 'sine',
        tempo: 800,
        options: ['Lata Mangeshkar 🕊️', 'Asha Bhosle 🌸', 'Geeta Dutt 📻', 'M. S. Subbulakshmi 🪷'],
        correct: 'Lata Mangeshkar 🕊️',
        fact: 'Bharat Ratna Lata Mangeshkar recorded songs in over 36 languages across seven legendary decades.'
      },
      {
        id: 'q_sing_2',
        title: 'Which soulful maestro sang "Pal Pal Dil Ke Paas" and "Mere Sapnon Ki Rani"?',
        notes: [329.63, 349.23, 392.00, 440.00, 392.00, 349.23, 329.63],
        wave: 'sawtooth',
        tempo: 650,
        options: ['Kishore Kumar 🎙️', 'Mohammed Rafi 🎤', 'Mukesh 🎼', 'Hemant Kumar 🌊'],
        correct: 'Kishore Kumar 🎙️',
        fact: 'Kishore Kumar was an unmatched genius who could switch between soulful ballads and joyful yodeling!'
      }
    ]
  };

  const indianInstrumentals = [
    {
      id: 'inst_flute',
      title: 'Bansuri (Bamboo Flute) — Raga Yaman',
      notes: [293.66, 329.63, 369.99, 440.00, 493.88, 554.37, 587.33],
      waveType: 'sine',
      tempo: 900,
      icon: '🪈',
      desc: 'Serene bamboo flute notes resonating with peace and twilight clarity.'
    },
    {
      id: 'inst_sitar',
      title: 'Sitar Melody — Raga Bhairav',
      notes: [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 493.88],
      waveType: 'triangle',
      tempo: 750,
      icon: '🪕',
      desc: 'Resonant acoustic sitar plucks evoking spiritual awakening and inner stillness.'
    },
    {
      id: 'inst_shehnai',
      title: 'Shehnai — Mangal Dhwani',
      notes: [329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
      waveType: 'sawtooth',
      tempo: 900,
      icon: '🎺',
      desc: 'Traditional auspicious wind melody bringing warmth, celebration, and fond memories.'
    }
  ];

  const shortStories = [
    {
      title: 'The Ancestral Mango Tree',
      text: 'On warm summer afternoons, the whole courtyard would gather under the giant green canopy of our ancestral mango tree. Grandmother would bring slices of raw green mango sprinkled with rock salt and roasted cumin, while grandfather shared tales of rivers and harvests.',
      icon: '🌳'
    },
    {
      title: 'The Steaming Kettle at Jorhat',
      text: 'Early dawn over the Assam tea gardens smelled of wet leaves and morning rain. The kitchen kettle would begin to whistle softly, announcing fresh ginger tea brewed with rich buffalo milk and cardamoms, shared warm between cupped hands.',
      icon: '☕'
    }
  ];

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

  function playSynthesizedMelody(notes, title, waveType = 'sine', tempo = 900) {
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
      gain.gain.linearRampToValueAtTime(0.2, synthAudioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, synthAudioCtx.currentTime + (tempo / 1000) * 1.3);

      osc.connect(gain);
      gain.connect(synthAudioCtx.destination);

      osc.start();
      osc.stop(synthAudioCtx.currentTime + (tempo / 1000) * 1.4);
      step++;
    };

    playNote();
    synthInterval = setInterval(playNote, tempo);
    render();
  }

  function toggleQuizAudio(notes, waveType = 'sine', tempo = 650) {
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

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 720px; padding-bottom: 3.5rem;">
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
              const q = currentList[currentQuestionIndex % currentList.length];
              return `
                <div style="background: #FFFFFF; border-radius: 16px; padding: 1.5rem; border: 1.5px solid #E2E8F0; text-align: center;">
                  <div style="font-size: 0.95rem; font-weight: 700; color: var(--teal-dark, #0F766E); margin-bottom: 0.5rem;">
                    Question ${(currentQuestionIndex % currentList.length) + 1} of ${currentList.length} • Score: ${quizScore} 🪙
                  </div>
                  <h4 style="font-size: 1.25rem; color: #1E293B; margin-bottom: 1.25rem; line-height: 1.4;">${q.title}</h4>

                  <!-- Explicit Play / Pause Button with WCAG AAA Standards -->
                  <div style="margin-bottom: 1.5rem;">
                    <button id="btn-quiz-audio" class="btn" style="min-height: 56px; min-width: 200px; font-size: 1.15rem; font-weight: 700; border-radius: 999px; background: ${isQuizAudioPlaying ? '#DC2626' : '#0D9488'}; color: #FFFFFF; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                      ${isQuizAudioPlaying ? '⏸️ Pause Sound' : '▶️ Play Sound Clip'}
                    </button>
                    <div style="font-size: 0.85rem; color: #64748B; margin-top: 6px;">Tap to listen as many times as you like!</div>
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

        <!-- 2. MELODIES TAB -->
        ${activeTab === 'music' ? `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${indianInstrumentals.map(m => `
              <div class="card card-elevated" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="font-size: 2.8rem;">${m.icon}</div>
                  <div>
                    <h4 style="margin: 0 0 4px 0; font-size: 1.15rem; color: var(--maroon, #9B2C2C);">${m.title}</h4>
                    <p style="margin: 0; font-size: 0.9rem; color: #64748B;">${m.desc}</p>
                  </div>
                </div>
                <button class="btn btn-primary btn-play-melody" data-id="${m.id}" style="min-height: 48px; min-width: 100px; font-weight: 700;">
                  ▶ Play
                </button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 3. STORIES TAB -->
        ${activeTab === 'stories' ? `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${shortStories.map(s => `
              <div class="card card-elevated" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <span style="font-size: 2.2rem;">${s.icon}</span>
                  <h4 style="margin: 0; font-size: 1.25rem; color: var(--maroon, #9B2C2C);">${s.title}</h4>
                </div>
                <p style="font-size: 1.05rem; line-height: 1.6; color: #334155; margin-bottom: 1rem;">${s.text}</p>
                <button class="btn btn-secondary btn-read-story" data-text="${encodeURIComponent(s.text)}" style="min-height: 48px; font-weight: 700;">
                  🔊 Listen Aloud
                </button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 4. VISUALS TAB -->
        ${activeTab === 'visuals' ? `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div class="card card-elevated" style="background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1.5px solid #CBD5E1;">
              <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80" alt="Tea Hills" style="width: 100%; height: 260px; object-fit: cover;">
              <div style="padding: 1.25rem;">
                <h4 style="margin: 0 0 6px 0; font-size: 1.2rem; color: var(--maroon, #9B2C2C);">Serene Assam Tea Slopes</h4>
                <p style="margin: 0; font-size: 1rem; color: #475569;">“Take a slow breath. Like morning mist, all worries softly melt away.” 🌿</p>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

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
        toggleQuizAudio(q.notes, q.wave, q.tempo);
      });
    }

    // Quiz Options
    container.querySelectorAll('.btn-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentList = quizData[quizMode] || quizData.instrument;
        const q = currentList[currentQuestionIndex % currentList.length];
        const selected = btn.getAttribute('data-answer');
        const feedback = container.querySelector('#quiz-feedback');
        const allOpts = container.querySelectorAll('.btn-quiz-opt');
        allOpts.forEach(b => b.disabled = true);

        stopQuizAudio();

        if (selected === q.correct) {
          btn.style.background = '#0D9488';
          btn.style.color = '#FFFFFF';
          quizScore += 10;
          Coins.addCoins(10, 'Music Quiz');
          feedback.style.display = 'block';
          feedback.style.background = '#ECFDF5';
          feedback.style.color = '#064E3B';
          feedback.style.border = '1.5px solid #6EE7B7';
          feedback.innerHTML = `🎉 <strong>Correct!</strong> ${q.fact}`;
          if (TTS && TTS.isSupported()) TTS.speak("Correct! " + q.fact);
        } else {
          btn.style.background = '#DC2626';
          btn.style.color = '#FFFFFF';
          feedback.style.display = 'block';
          feedback.style.background = '#FEF2F2';
          feedback.style.color = '#991B1B';
          feedback.style.border = '1.5px solid #F87171';
          feedback.innerHTML = `Not quite! The correct answer was <strong>${q.correct}</strong>. ${q.fact}`;
          allOpts.forEach(b => {
            if (b.getAttribute('data-answer') === q.correct) {
              b.style.background = '#0D9488';
              b.style.color = '#FFFFFF';
            }
          });
          if (TTS && TTS.isSupported()) TTS.speak("The correct answer was " + q.correct);
        }

        setTimeout(() => {
          currentQuestionIndex++;
          render();
        }, 3000);
      });
    });

    // Play Instrumental Melodies
    container.querySelectorAll('.btn-play-melody').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const m = indianInstrumentals.find(item => item.id === id);
        if (m) {
          playSynthesizedMelody(m.notes, m.title, m.waveType, m.tempo);
        }
      });
    });

    // Read Aloud Stories
    container.querySelectorAll('.btn-read-story').forEach(btn => {
      btn.addEventListener('click', () => {
        stopSynthesizer();
        stopQuizAudio();
        const text = decodeURIComponent(btn.getAttribute('data-text'));
        if (TTS) TTS.speak(text);
      });
    });
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
