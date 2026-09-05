/* ============================================================
   SMRITI — Entertainment & Soothing Melodies
   Senior-accessible gentle music, Bollywood nostalgia, bhajans,
   short life stories, calming visuals, custom user audio & mini-activities
   ============================================================ */

import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';
import AmbientAudio from '../ambientAudio.js';

export default function EntertainmentPage(container) {
  let activeTab = 'music'; // 'music' | 'stories' | 'videos' | 'devotional' | 'activities'
  let currentPlayingAudio = null;
  let synthAudioCtx = null;
  let synthInterval = null;
  let customSongs = Storage.getUserData('customSongs', []);

  const bollywoodClassics = [
    {
      id: 'bw_1',
      title: 'Ajeeb Dastan Hai Yeh',
      artist: 'Lata Mangeshkar • 1960',
      melodyNotes: [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66],
      icon: '📻',
      desc: 'Nostalgic, gentle acoustic chimes honoring the golden classic melody.'
    },
    {
      id: 'bw_2',
      title: 'Pyaar Hua Ikraar Hua',
      artist: 'Manna Dey & Lata Mangeshkar • 1955',
      melodyNotes: [392.00, 349.23, 329.63, 293.66, 261.63, 329.63, 392.00],
      icon: '☔',
      desc: 'Sweet romantic memories under the gentle raindrops of old cinema.'
    },
    {
      id: 'bw_3',
      title: 'Chhookar Mere Mann Ko',
      artist: 'Kishore Kumar • 1981',
      melodyNotes: [329.63, 349.23, 392.00, 440.00, 392.00, 349.23, 329.63],
      icon: '🕊️',
      desc: 'Soft heart-touching acoustic melody for relaxation and peace.'
    }
  ];

  const devotionalBhajans = [
    {
      id: 'dv_1',
      title: 'Vaishnava Jan To',
      theme: "Bapu's Favorite Bhajan",
      melodyNotes: [293.66, 329.63, 369.99, 392.00, 440.00, 369.99, 329.63],
      icon: '🪔',
      desc: 'Sacred, uplifting melody cultivating compassion, truth, and inner serenity.'
    },
    {
      id: 'dv_2',
      title: 'Om Jai Jagdish Hare',
      theme: 'Evening Aarti Harmony',
      melodyNotes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63],
      icon: '🔔',
      desc: 'Gentle temple bells and meditative vibrations to soothe the heart.'
    },
    {
      id: 'dv_3',
      title: 'Raghupati Raghav Raja Ram',
      theme: 'Peaceful Chant Melody',
      melodyNotes: [329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63],
      icon: '🌸',
      desc: 'A calming prayer bringing deep reassurance, family harmony, and strength.'
    }
  ];

  const shortStories = [
    {
      id: 'st_1',
      title: 'The Courtyard Sparrows of Childhood',
      era: 'Morning in 1968',
      text: "Every morning at sunrise, Grandmother would scatter golden grains of rice across the warm clay courtyard. Flocks of little brown sparrows fluttered down, chirping merrily. The courtyard buzzed with life as steam curled from the copper kettle of ginger cardamom tea, reminding us that life's sweetest treasures are simple and shared.",
      icon: '🐦'
    },
    {
      id: 'st_2',
      title: 'The Sweet Taste of First Mangoes',
      era: 'Summer Memories',
      text: 'Whenever summer broke across the orchard, the aroma of ripe Alphonso and Langra mangoes filled the air. Uncles and cousins gathered beneath the green canopy with tin buckets of cold well water. With sticky hands and bright joyful laughter, we ate until the sun sank behind the horizon.',
      icon: '🥭'
    },
    {
      id: 'st_3',
      title: 'The Village Train Journey',
      era: 'Autumn Reunion',
      text: 'The rhythmic chug-chug of the steam engine was music to our ears. Looking out through the open window, green paddy fields and mustard flowers blurred like a golden painting. Friendly passengers shared wrapped puri-bhaji and sweet stories that turned strangers into lifelong companions.',
      icon: '🚂'
    }
  ];

  const calmingVisuals = [
    {
      title: 'Serene Green Tea Hills',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      caption: 'Gentle morning fog rolling over calm rolling plantations.',
      quote: '“Take a slow breath. Like morning mist, all worries softly melt away.”'
    },
    {
      title: 'Golden Sunset over River Ganga',
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
      caption: 'Warm golden waters flowing serenely at dusk with gentle ripples.',
      quote: '“Still waters run deep. You are safe, cherished, and surrounded by light.”'
    },
    {
      title: 'Blossoming Lotus Garden',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      caption: 'Pink and white lotus flowers opening to the morning sun.',
      quote: '“With each sunrise comes fresh grace, health, and peaceful clarity.”'
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

  function playSynthesizedMelody(notes, title) {
    stopSynthesizer();
    TTS.stop();

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

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, synthAudioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, synthAudioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, synthAudioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, synthAudioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(synthAudioCtx.destination);

      osc.start();
      osc.stop(synthAudioCtx.currentTime + 1.3);

      step++;
    };

    playNote();
    synthInterval = setInterval(playNote, 900);
    render();
  }

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 720px; padding-bottom: 3.5rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h2 style="color: var(--maroon); margin: 0; font-size: 1.8rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎭</span> Entertainment & Peace
            </h2>
            <p class="text-muted" style="margin: 0.2rem 0 0 0; font-size: 0.95rem;">Soft music, golden memories, stories & calming visuals</p>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/home'">⬅ Home</button>
        </div>

        <!-- Entertainment Tabs (Large Touch Friendly Buttons) -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.4rem; margin-bottom: 1.25rem; background: #FFF; padding: 6px; border-radius: 16px; border: 1.5px solid #F3E8DC;">
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'music' ? 'btn-primary text-white' : ''}" data-tab="music" style="padding: 0.6rem 0.2rem; font-size: 0.85rem; font-weight: 700; flex-direction: column; gap: 2px;">
            <span>🎵</span> Music
          </button>
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'stories' ? 'btn-primary text-white' : ''}" data-tab="stories" style="padding: 0.6rem 0.2rem; font-size: 0.85rem; font-weight: 700; flex-direction: column; gap: 2px;">
            <span>📖</span> Stories
          </button>
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'videos' ? 'btn-primary text-white' : ''}" data-tab="videos" style="padding: 0.6rem 0.2rem; font-size: 0.85rem; font-weight: 700; flex-direction: column; gap: 2px;">
            <span>🌿</span> Visuals
          </button>
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'devotional' ? 'btn-primary text-white' : ''}" data-tab="devotional" style="padding: 0.6rem 0.2rem; font-size: 0.85rem; font-weight: 700; flex-direction: column; gap: 2px;">
            <span>🪔</span> Bhajans
          </button>
          <button class="btn btn-ghost ent-tab-btn ${activeTab === 'activities' ? 'btn-primary text-white' : ''}" data-tab="activities" style="padding: 0.6rem 0.2rem; font-size: 0.85rem; font-weight: 700; flex-direction: column; gap: 2px;">
            <span>✨</span> Play
          </button>
        </div>

        <!-- Now Playing Status Bar -->
        ${currentPlayingAudio ? `
          <div class="card card-elevated mb-md" style="background: #ECFDF5; border: 2px solid #6EE7B7; border-radius: 14px; padding: 0.85rem 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="font-size: 1.8rem; animation: floatSlow 2s ease-in-out infinite;">🎶</div>
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

        <!-- 1. MUSIC TAB -->
        ${activeTab === 'music' ? `
          <div>
            <!-- Nature Sound Stream Integration -->
            <div class="card card-elevated mb-md" style="background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 2px solid #BBF7D0; border-radius: 18px; padding: 1.25rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 2.2rem;">🍃🕊️</span>
                  <div>
                    <h3 style="color: #14532D; margin: 0; font-size: 1.25rem;">Live Healing Nature Sounds</h3>
                    <p style="margin: 0.15rem 0 0 0; color: #166534; font-size: 0.95rem;">Soft forest stream, morning birds & gentle wind chimes</p>
                  </div>
                </div>
                <button id="btn-toggle-nature" class="btn ${AmbientAudio.isPlaying() ? 'btn-secondary' : 'btn-primary'}" style="min-height: 48px; border-radius: 12px; font-weight: 700;">
                  ${AmbientAudio.isPlaying() ? '⏸️ Pause Nature' : '▶ Play Nature'}
                </button>
              </div>
            </div>

            <!-- Bollywood Golden Nostalgia Melodies -->
            <div class="card card-elevated mb-md" style="padding: 1.25rem; border-radius: 18px;">
              <h3 style="color: var(--maroon); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>📻</span> Golden Bollywood Melodies
              </h3>
              <p class="text-muted" style="margin-top: 0; margin-bottom: 1rem; font-size: 0.95rem;">
                Tap any melody to listen to its gentle chime acoustic arrangement.
              </p>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${bollywoodClassics.map(s => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #FFFDF9; border: 1.5px solid #F3E8DC; border-radius: 14px; gap: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="font-size: 2rem; background: #FEF3C7; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        ${s.icon}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: var(--maroon); font-size: 1.1rem;">${s.title}</div>
                        <div style="font-size: 0.85rem; color: var(--gray-500);">${s.artist}</div>
                        <div style="font-size: 0.85rem; color: #78350F; margin-top: 0.15rem;">${s.desc}</div>
                      </div>
                    </div>
                    <button class="btn btn-outline btn-play-melody" data-id="${s.id}" data-title="${s.title}" style="min-width: 90px; min-height: 48px; font-weight: 700; border-color: var(--teal); color: var(--teal-dark);">
                      ▶ Play
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Custom User Audio Upload -->
            <div class="card card-elevated mb-md" style="padding: 1.25rem; border-radius: 18px; background: #FFFBEB; border: 1.5px solid #FDE68A;">
              <h3 style="color: #92400E; font-size: 1.2rem; margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
                <span>📁</span> Add Your Own Favorite Song / Audio
              </h3>
              <p style="color: #78350F; font-size: 0.95rem; margin-bottom: 0.75rem;">
                Caregivers or family can upload an MP3 audio file or loved one’s personal voice singing here.
              </p>

              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <input type="file" id="input-custom-song" accept="audio/*" class="form-input" style="background: white; flex: 1; padding: 6px;" />
              </div>

              ${customSongs.length > 0 ? `
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
                  <div style="font-size: 0.85rem; font-weight: 700; color: #92400E;">YOUR SAVED AUDIO TRACKS:</div>
                  ${customSongs.map((cs, i) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 8px 12px; border-radius: 10px; border: 1px solid #FDE68A;">
                      <span style="font-weight: 600; color: var(--maroon);">🎵 ${cs.name}</span>
                      <button class="btn btn-ghost btn-sm btn-play-custom-audio" data-idx="${i}" style="color: var(--teal-dark); font-weight: 700;">▶ Listen</button>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- 2. SHORT LIFE STORIES TAB -->
        ${activeTab === 'stories' ? `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${shortStories.map(st => `
              <div class="card card-elevated" style="padding: 1.35rem; border-radius: 18px; background: #FFFDF9; border: 1.5px solid #FDE68A;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="font-size: 2.2rem;">${st.icon}</span>
                    <div>
                      <h3 style="color: var(--maroon); margin: 0; font-size: 1.3rem;">${st.title}</h3>
                      <span style="font-size: 0.85rem; color: #B45309; font-weight: 600;">📅 ${st.era}</span>
                    </div>
                  </div>
                </div>

                <p style="font-size: 1.1rem; line-height: 1.6; color: var(--gray-700); margin: 0.75rem 0 1rem 0;">
                  “${st.text}”
                </p>

                <div style="display: flex; gap: 0.75rem;">
                  <button class="btn btn-secondary btn-sm btn-listen-short-story" data-text="${encodeURIComponent(st.text)}" style="flex: 1; min-height: 48px; font-weight: 700; font-size: 1.05rem;">
                    🔊 Listen Aloud
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 3. CALMING VISUALS TAB -->
        ${activeTab === 'videos' ? `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${calmingVisuals.map(v => `
              <div class="card card-elevated" style="padding: 0; border-radius: 18px; overflow: hidden; background: white; border: 1.5px solid #E2E8F0;">
                <div style="width: 100%; aspect-ratio: 16/9; background: #CBD5E1; overflow: hidden;">
                  <img src="${v.image}" alt="${v.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="padding: 1.25rem;">
                  <h3 style="color: var(--maroon); margin: 0 0 0.35rem 0; font-size: 1.3rem;">${v.title}</h3>
                  <p style="color: var(--gray-500); font-size: 0.95rem; margin: 0 0 0.75rem 0;">${v.caption}</p>
                  <div style="background: #F0FDFA; border-left: 4px solid var(--teal); padding: 0.75rem 1rem; border-radius: 8px; color: #0F766E; font-size: 1.05rem; font-style: italic;">
                    ${v.quote}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- 4. DEVOTIONAL / BHAJAN TAB -->
        ${activeTab === 'devotional' ? `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="card card-elevated" style="padding: 1.25rem; border-radius: 18px; background: linear-gradient(135deg, #FEF3C7, #FFFBEB); border: 2px solid #FDE68A;">
              <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 3rem; margin-bottom: 0.25rem;">🪔✨</div>
                <h3 style="color: #78350F; margin: 0; font-size: 1.4rem;">Sacred Chants & Bhajans</h3>
                <p style="color: #B45309; margin: 0.2rem 0 0 0; font-size: 0.95rem;">Gentle acoustic harmonies to awaken peace and spiritual reassurance</p>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${devotionalBhajans.map(b => `
                  <div style="background: white; border: 1.5px solid #FCD34D; border-radius: 14px; padding: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div style="font-size: 2rem;">${b.icon}</div>
                      <div>
                        <div style="font-weight: 700; color: var(--maroon); font-size: 1.15rem;">${b.title}</div>
                        <div style="font-size: 0.85rem; color: #92400E; font-weight: 600;">${b.theme}</div>
                        <div style="font-size: 0.85rem; color: var(--gray-700); margin-top: 0.2rem;">${b.desc}</div>
                      </div>
                    </div>
                    <button class="btn btn-secondary btn-play-bhajan" data-id="${b.id}" data-title="${b.title}" style="min-width: 90px; min-height: 48px; font-weight: 700;">
                      ▶ Play
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 5. SOFT MINI-ACTIVITIES TAB -->
        ${activeTab === 'activities' ? `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- Gentle Flower Blooming Activity -->
            <div class="card card-elevated text-center" style="padding: 1.75rem 1.25rem; border-radius: 18px; background: #FFFDF9; border: 2px solid #FCD34D;">
              <div id="activity-flower" style="font-size: 5rem; margin-bottom: 0.5rem; transition: transform 0.6s ease; cursor: pointer;">🌸</div>
              <h3 style="color: var(--maroon); font-size: 1.35rem; margin: 0.25rem 0;">Gentle Blossom Tap</h3>
              <p class="text-muted" style="margin-bottom: 1.25rem; font-size: 1.05rem;">Tap the blossom to gently send love and warm wishes to your home.</p>
              <button id="btn-tap-flower" class="btn btn-primary" style="min-height: 52px; font-size: 1.15rem; font-weight: 700; border-radius: 14px; padding: 10px 28px;">
                ✨ Blossom & Smile
              </button>
            </div>

            <!-- Soft Music + Memory Activity Combination -->
            <div class="card card-elevated" style="padding: 1.5rem; border-radius: 18px; background: linear-gradient(135deg, #F0FDFA, #CCFBF1); border: 2px solid #99F6E4;">
              <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.75rem;">
                <span style="font-size: 2.5rem;">🎶🖼️</span>
                <div>
                  <h3 style="color: #0F766E; margin: 0; font-size: 1.3rem;">Musical Memory Reverie</h3>
                  <p style="color: #115E59; margin: 0.15rem 0 0 0; font-size: 0.95rem;">Combine soothing chimes with cherished life stories.</p>
                </div>
              </div>
              <p style="color: #134E4A; font-size: 1.05rem; line-height: 1.5; margin-bottom: 1.25rem;">
                Listening to sweet nostalgic tunes while browsing family photos stimulates positive recall, evokes joy, and reduces restlessness.
              </p>
              <button onclick="window.location.hash='#/memories'" class="btn btn-secondary btn-block" style="min-height: 52px; font-size: 1.15rem; font-weight: 700;">
                ▶ Open Musical Memories
              </button>
            </div>
          </div>
        ` : ''}

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Tab switching
    container.querySelectorAll('.ent-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.getAttribute('data-tab');
        render();
      });
    });

    // Nature Audio toggle
    const toggleNatureBtn = container.querySelector('#btn-toggle-nature');
    if (toggleNatureBtn) {
      toggleNatureBtn.addEventListener('click', async () => {
        stopSynthesizer();
        await AmbientAudio.toggle();
        render();
      });
    }

    // Stop current audio
    const stopAudioBtn = container.querySelector('#btn-stop-audio');
    if (stopAudioBtn) {
      stopAudioBtn.addEventListener('click', () => {
        stopSynthesizer();
        TTS.stop();
        render();
      });
    }

    // Play Bollywood Melody
    container.querySelectorAll('.btn-play-melody').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const song = bollywoodClassics.find(s => s.id === id);
        if (song) {
          playSynthesizedMelody(song.melodyNotes, song.title);
        }
      });
    });

    // Play Bhajan
    container.querySelectorAll('.btn-play-bhajan').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const bhajan = devotionalBhajans.find(b => b.id === id);
        if (bhajan) {
          playSynthesizedMelody(bhajan.melodyNotes, bhajan.title);
        }
      });
    });

    // Listen Short Story
    container.querySelectorAll('.btn-listen-short-story').forEach(btn => {
      btn.addEventListener('click', () => {
        stopSynthesizer();
        const text = decodeURIComponent(btn.getAttribute('data-text'));
        TTS.speak(text);
      });
    });

    // Custom song file input
    const songInput = container.querySelector('#input-custom-song');
    if (songInput) {
      songInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const newSong = {
            name: file.name.replace(/\.[^/.]+$/, ""),
            size: file.size
          };
          customSongs.push(newSong);
          Storage.setUserData('customSongs', customSongs);
          if (window.SmritiToast) {
            window.SmritiToast.show(`Audio track "${newSong.name}" added to your collection! 🎶`, 'success');
          }
          render();
        }
      });
    }

    // Mini activity blossom tap
    const flowerBtn = container.querySelector('#btn-tap-flower');
    const flowerEl = container.querySelector('#activity-flower');
    if (flowerBtn && flowerEl) {
      flowerBtn.addEventListener('click', () => {
        flowerEl.style.transform = 'scale(1.4) rotate(15deg)';
        const flowers = ['🌸', '🌺', '🌻', '🪷', '🌷', '🌼'];
        flowerEl.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        setTimeout(() => {
          flowerEl.style.transform = 'scale(1) rotate(0deg)';
        }, 500);

        if (TTS.isSupported()) {
          TTS.speak('Wishing you blooming peace, gentle health, and joy today.');
        }
      });
    }
  }

  render();

  return {
    cleanup() {
      stopSynthesizer();
      TTS.stop();
    }
  };
}
