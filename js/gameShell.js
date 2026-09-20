/* ============================================================
   SMRITI — Shared Game Shell
   Common game framework: start screen → play → result screen
   ============================================================ */

import I18n from './i18n.js';
import Coins from './coins.js';
import Timer from './timer.js';
import TTS from './tts.js';
import Storage from './storage.js';
import { TimerInstance } from './timer.js';

const GameShell = {
  /**
   * Render a complete game wrapper inside the container
   * @param {HTMLElement} container - #root or page container
   * @param {object} config
   * @param {string} config.gameId - unique game identifier
   * @param {string} config.titleKey - i18n key for title
   * @param {string} config.instructionKey - i18n key for instruction
   * @param {string} config.icon - emoji icon
   * @param {boolean} config.hasDifficulty - show difficulty selector
   * @param {number} config.parTime - expected completion time in seconds
   * @param {function} config.onStart - (difficulty, gameArea) => void — called when Play is pressed
   * @param {function} config.onCleanup - () => void — called on unmount
   * @returns {GameController}
   */
  create(container, config) {
    return new GameController(container, config);
  },
};

class GameController {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.timer = null;
    this.score = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    this.hintsUsed = 0;
    this.difficulty = 'medium';
    this.timeLimit = this.config.parTime || 90;
    this.phase = 'start'; // start | play | result
    this._voiceAnswerActive = false;
    this._voiceRec = null;

    this._renderStart();
  }

  _formatTimerSetting() {
    if (!this.timeLimit || this.timeLimit <= 0) return 'No Rush 🕊️';
    const m = Math.floor(this.timeLimit / 60);
    const s = this.timeLimit % 60;
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m} min`;
    return `${m}m ${s}s`;
  }

  _renderStart() {
    this.phase = 'start';
    const c = this.config;

    this.container.innerHTML = `
      <div class="container page-enter">
        <button class="btn btn-ghost mb-md" id="game-back">← ${I18n.t('exitToHub')}</button>
        
        <div class="card card-elevated text-center" style="padding: 2rem 1.5rem;">
          <div style="font-size: 4rem; margin-bottom: 0.75rem;">${c.icon}</div>
          <h1 style="margin-bottom: 0.5rem;">${I18n.t(c.titleKey)}</h1>
          <p class="text-muted" style="margin-bottom: 1.25rem;">${I18n.t(c.instructionKey)}</p>
          
          <div id="tts-container" style="margin-bottom: 1.25rem;"></div>
          
          ${c.hasDifficulty ? (() => {
            const levelStatus = Storage.getGameLevelStatus(c.gameId);
            const isMediumUnlocked = levelStatus.level2 && levelStatus.level2.unlocked;
            const isHardUnlocked = levelStatus.level3 && levelStatus.level3.unlocked;
            if (!this.difficulty || (this.difficulty === 'hard' && !isHardUnlocked) || (this.difficulty === 'medium' && !isMediumUnlocked)) {
              this.difficulty = 'easy';
            }
            return `
            <div class="difficulty-selector" id="diff-selector" style="margin-bottom: 0.75rem;">
              <button class="diff-btn ${this.difficulty === 'easy' ? 'active' : ''}" data-diff="easy">${I18n.t('easy')}</button>
              <button class="diff-btn ${this.difficulty === 'medium' ? 'active' : ''} ${!isMediumUnlocked ? 'locked' : ''}" data-diff="medium" style="${!isMediumUnlocked ? 'opacity: 0.65;' : ''}">
                ${I18n.t('medium')} ${!isMediumUnlocked ? '🔒' : ''}
              </button>
              <button class="diff-btn ${this.difficulty === 'hard' ? 'active' : ''} ${!isHardUnlocked ? 'locked' : ''}" data-diff="hard" style="${!isHardUnlocked ? 'opacity: 0.65;' : ''}">
                ${I18n.t('hard')} ${!isHardUnlocked ? '🔒' : ''}
              </button>
            </div>
            ${(!isMediumUnlocked || !isHardUnlocked) ? `
              <div style="font-size: 0.82rem; color: #B45309; margin-bottom: 1rem; font-weight: 600;">
                ℹ️ Crucial Progression: Medium unlocks at ≥80% on Easy; Hard unlocks at ≥80% on Medium.
              </div>
            ` : ''}
            `;
          })() : ''}

          <!-- Large, Senior-Friendly Time Control Option -->
          <div class="timer-config-box" style="margin: 1rem auto 1.5rem auto; padding: 1rem; background: #FFFDF9; border: 2px solid #FCD34D; border-radius: 16px; max-width: 380px;">
            <div style="font-weight: 700; color: #78350F; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
              <span>⏱️</span> Time Limit / Target Pace
            </div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin: 0.6rem 0;">
              <button type="button" id="btn-timer-dec" class="btn" style="min-width: 52px; width: 52px; height: 52px; border-radius: 50%; font-size: 1.8rem; line-height: 1; padding: 0; display: flex; align-items: center; justify-content: center; background: #FDF8F3; border: 2px solid #D97706; color: #B45309; cursor: pointer;" title="Decrease time limit">−</button>
              <div id="timer-display-val" style="font-size: 1.35rem; font-weight: 800; color: var(--maroon); min-width: 140px; text-align: center;">
                ${this._formatTimerSetting()}
              </div>
              <button type="button" id="btn-timer-inc" class="btn" style="min-width: 52px; width: 52px; height: 52px; border-radius: 50%; font-size: 1.8rem; line-height: 1; padding: 0; display: flex; align-items: center; justify-content: center; background: #FDF8F3; border: 2px solid #D97706; color: #B45309; cursor: pointer;" title="Increase time limit">+</button>
            </div>
            <div style="font-size: 0.85rem; color: #92400E;">
              Tap − / + to adjust in 30s steps (or choose No Rush for calm play).
            </div>
          </div>
          
          <button class="btn btn-primary btn-block mt-md" id="game-start-btn" style="min-height: 56px; font-size: 1.25rem;">
            ${I18n.t('startGame')}
          </button>
        </div>
      </div>
    `;

    // TTS button
    const ttsContainer = this.container.querySelector('#tts-container');
    if (TTS.isSupported()) {
      ttsContainer.appendChild(TTS.createButton(I18n.t(c.instructionKey)));
    }

    // Back button
    this.container.querySelector('#game-back').addEventListener('click', () => {
      this.cleanup();
      window.location.hash = '#/games';
    });

    // Difficulty selector
    if (c.hasDifficulty) {
      this.container.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const diff = btn.dataset.diff;
          const levelStatus = Storage.getGameLevelStatus(c.gameId);
          const isMediumUnlocked = levelStatus.level2 && levelStatus.level2.unlocked;
          const isHardUnlocked = levelStatus.level3 && levelStatus.level3.unlocked;

          if (diff === 'medium' && !isMediumUnlocked) {
            alert('🔒 Medium level is locked. Achieve ≥80% accuracy on Easy level to unlock!');
            return;
          }
          if (diff === 'hard' && !isHardUnlocked) {
            alert('🔒 Hard level is locked. Achieve ≥80% accuracy on Medium level to unlock!');
            return;
          }

          this.container.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.difficulty = diff;
        });
      });
    }

    // Time adjustment controls
    const decBtn = this.container.querySelector('#btn-timer-dec');
    const incBtn = this.container.querySelector('#btn-timer-inc');
    const valDisplay = this.container.querySelector('#timer-display-val');

    if (decBtn && incBtn && valDisplay) {
      decBtn.addEventListener('click', () => {
        if (this.timeLimit > 30) {
          this.timeLimit -= 30;
        } else {
          this.timeLimit = 0; // No rush
        }
        valDisplay.textContent = this._formatTimerSetting();
      });

      incBtn.addEventListener('click', () => {
        if (this.timeLimit === 0) {
          this.timeLimit = 30;
        } else if (this.timeLimit < 360) {
          this.timeLimit += 30;
        }
        valDisplay.textContent = this._formatTimerSetting();
      });
    }

    // Start button
    this.container.querySelector('#game-start-btn').addEventListener('click', () => {
      this._startPlay();
    });
  }

  _startPlay() {
    this.phase = 'play';
    this.score = 0;
    this.totalQuestions = 0;
    this.correctAnswers = 0;
    this.hintsUsed = 0;

    this.container.innerHTML = `
      <div class="container page-enter">
        <div class="game-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <button id="btn-game-leave" class="btn btn-ghost btn-sm" style="font-weight: 700; color: var(--gray-700); font-size: 1rem; padding: 0.35rem 0.75rem; border: 1px solid #E2E8F0; border-radius: 8px;">
            ← Leave
          </button>

          <!-- Voice Answers for Patients with Motor Difficulties (Requirement 9) -->
          <button id="btn-game-voice-answer" class="btn btn-outline btn-sm" style="font-weight: 700; font-size: 0.88rem; padding: 0.35rem 0.85rem; border-radius: 20px; border-color: #CBD5E1; display: inline-flex; align-items: center; gap: 0.4rem; background: #FFFFFF; cursor: pointer; transition: all 0.2s;" title="Speak answers instead of clicking">
            <span>🎙️</span> <span id="voice-ans-label">Voice Answer: OFF</span>
          </button>

          <div class="game-score" id="game-score">
            ${I18n.t('score')}: <span id="score-value">0</span>
          </div>
          <div class="game-timer" id="game-timer">0:00</div>
        </div>

        <!-- Voice Answer Live Listening Indicator Banner -->
        <div id="voice-ans-banner" style="display: none; background: #EFF6FF; border: 1.5px solid #93C5FD; border-radius: 12px; padding: 0.5rem 1rem; margin-bottom: 0.85rem; text-align: center; font-size: 0.92rem; color: #1E40AF; font-weight: 700;">
          🎙️ <span id="voice-ans-status">Listening for spoken answer... Speak your choice clearly!</span>
        </div>

        <div id="game-area"></div>
      </div>
    `;

    // Exit confirmation on Leave button
    this.container.querySelector('#btn-game-leave').addEventListener('click', () => {
      this._showExitConfirmation(() => {
        this.cleanup();
        window.location.hash = '#/games';
      });
    });

    // Handle back button interception during active play
    try {
      history.pushState({ inGame: true }, '');
      this._popstateHandler = () => {
        if (this.phase === 'play') {
          history.pushState({ inGame: true }, '');
          this._showExitConfirmation(() => {
            if (this._popstateHandler) {
              window.removeEventListener('popstate', this._popstateHandler);
              this._popstateHandler = null;
            }
            this.cleanup();
            window.location.hash = '#/games';
          });
        }
      };
      window.addEventListener('popstate', this._popstateHandler);
    } catch {}

    // Create timer based on user selection
    if (this.timeLimit > 0) {
      this.timer = Timer.create('countdown', this.timeLimit);
      this.timer.onComplete = () => {
        if (window.SmritiToast) {
          window.SmritiToast.show('Time reached! Wonderful effort.', 'info');
        }
        this.endGame();
      };
    } else {
      this.timer = Timer.create('elapsed');
    }

    this.timer.bindDisplay(this.container.querySelector('#game-timer'));
    this.timer.start();
    this._initVoiceAnswers();

    // Spoken instruction if Voice Guidance is enabled
    try {
      const voiceSettings = Storage.getVoiceSettings();
      if (voiceSettings.voiceGuidanceEnabled && voiceSettings.autoReadInstructions) {
        TTS.speak(I18n.t(this.config.instructionKey));
      }
    } catch {}

    // Call game-specific start
    const gameArea = this.container.querySelector('#game-area');
    if (this.config.onStart) {
      this.config.onStart(this.difficulty, gameArea, this);
    }
  }

  _showExitConfirmation(onConfirm) {
    const existing = document.querySelector('.game-exit-confirm-overlay');
    if (existing) existing.remove();

    if (this.timer && typeof this.timer.pause === 'function') {
      this.timer.pause();
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay game-exit-confirm-overlay';
    modal.innerHTML = `
      <div class="modal-content text-center" style="max-width: 400px; padding: 2rem 1.5rem; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
        <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">🚪🤔</div>
        <h3 style="color: var(--maroon); font-size: 1.45rem; margin-bottom: 0.4rem;">Do you want to leave the game?</h3>
        <p style="color: var(--gray-600); font-size: 1.05rem; margin-bottom: 1.5rem; line-height: 1.4;">
          Your current game progress will be saved.
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <button id="btn-exit-cancel" class="btn btn-primary" style="min-height: 52px; font-size: 1.15rem; font-weight: 700; justify-content: center; background: #059669;">
            No, Keep Playing 😊
          </button>
          <button id="btn-exit-confirm" class="btn btn-outline" style="min-height: 52px; font-size: 1.05rem; font-weight: 600; justify-content: center; border-color: #CBD5E1; color: var(--gray-700);">
            Yes, Leave Game 🚪
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#btn-exit-cancel').addEventListener('click', () => {
      modal.remove();
      if (this.timer && typeof this.timer.resume === 'function') {
        this.timer.resume();
      }
    });

    modal.querySelector('#btn-exit-confirm').addEventListener('click', () => {
      modal.remove();
      onConfirm();
    });
  }

  _triggerGentleConfetti() {
    const confettiBox = document.createElement('div');
    confettiBox.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999; overflow: hidden;';
    document.body.appendChild(confettiBox);

    const colors = ['#FBCFE8', '#FED7AA', '#FEF08A', '#A7F3D0', '#BAE6FD', '#DDD6FE'];
    const count = 28;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      const size = Math.floor(Math.random() * 8) + 10;
      const left = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isRound = Math.random() > 0.4;
      const duration = Math.random() * 1.5 + 2.5;
      const delay = Math.random() * 0.6;

      piece.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${left}vw;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isRound ? '50%' : '4px'};
        opacity: 0.9;
        transform: rotate(${Math.random() * 360}deg);
        animation: gentleDrift ${duration}s ease-out ${delay}s forwards;
      `;
      confettiBox.appendChild(piece);
    }

    // Add keyframe style if not already present
    if (!document.getElementById('confetti-drift-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-drift-style';
      style.textContent = `
        @keyframes gentleDrift {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      confettiBox.remove();
    }, 4000);
  }

  /**
   * Update displayed score
   * @param {number} score
   */
  setScore(score) {
    this.score = score;
    const el = this.container.querySelector('#score-value');
    if (el) el.textContent = score;
  }

  /**
   * Add to score
   * @param {number} points
   */
  addScore(points) {
    this.setScore(this.score + points);
  }

  /**
   * Record a correct answer
   */
  recordCorrect() {
    this.correctAnswers++;
    this.totalQuestions++;
  }

  /**
   * Record a wrong answer (no live deduction — coins settled at session end)
   */
  recordWrong() {
    this.totalQuestions++;
    this.wrongAnswers = (this.wrongAnswers || 0) + 1;
  }

  /**
   * Record hint used
   */
  recordHint() {
    this.hintsUsed++;
  }

  /**
   * End the game and show results
   * @param {object} overrides - optional overrides for accuracy/score
   */
  endGame(overrides = {}) {
    const timeTaken = this.timer ? this.timer.stop() : 0;
    const accuracy = overrides.accuracy !== undefined 
      ? overrides.accuracy 
      : (this.totalQuestions > 0 ? Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0);
    const finalScore = overrides.score !== undefined ? overrides.score : this.score;

    // Calculate coins (Lump-Sum Session Settlement)
    let coinDelta = 0;
    let coinMessage = '';
    if (accuracy >= 70) {
      coinDelta = 15;
      Coins.add(coinDelta, `${this.config.gameId || 'game'} completion bonus`);
      coinMessage = `🪙 +${coinDelta} ${I18n.t('coins')} (Accuracy ≥ 70% Bonus!)`;
    } else {
      coinDelta = -10;
      Coins.deduct(10, `${this.config.gameId || 'game'} session adjustment`);
      coinMessage = `🪙 −10 ${I18n.t('coins')} (Accuracy < 70% Adjustment)`;
    }
    Coins.updateBadge();

    // Save result
    Storage.saveGameResult({
      gameId: this.config.gameId,
      gameName: I18n.t(this.config.titleKey),
      accuracy,
      score: finalScore,
      timeTaken,
      hintsUsed: this.hintsUsed,
      difficulty: this.difficulty,
      coinsEarned: coinDelta,
    });

    // Crucial Progression Logic: >=80% accuracy unlocks next level
    const diffToLevel = { easy: 1, medium: 2, hard: 3 };
    const currentLevel = diffToLevel[this.difficulty] || 1;
    Storage.recordGameLevelResult(this.config.gameId, currentLevel, accuracy);

    // Determine encouragement
    let emoji, title, message;
    if (accuracy >= 90) {
      emoji = '🏆'; title = I18n.t('excellent'); message = "You're amazing!";
    } else if (accuracy >= 70) {
      emoji = '🌟'; title = I18n.t('greatJob'); message = 'Wonderful performance!';
    } else if (accuracy >= 50) {
      emoji = '😊'; title = I18n.t('wellDone'); message = "You're doing great!";
    } else {
      emoji = '💪'; title = I18n.t('goodEffort'); message = I18n.t('keepTrying');
    }

    this.phase = 'result';

    // 1. Trigger Gentle, Senior-Friendly Confetti
    this._triggerGentleConfetti();

    // 2. Short Personalized Encouraging Voice Message (Localized)
    try {
      const user = Storage.getUser();
      const prefs = Storage.getPreferences();
      const userName = prefs.preferredName || (user ? user.name.split(' ')[0] : 'Friend');
      const lang = I18n.lang;
      let feedbackSentence = `Well done ${userName}! You did great today.`;

      if (lang === 'hi') {
        feedbackSentence = `शाबाश ${userName}! आज आपने बहुत अच्छा खेल खेला।`;
      } else if (lang === 'bn') {
        feedbackSentence = `খুব সুন্দর ${userName}! আজ আপনি দারুণ খেলেছেন।`;
      }

      TTS.speak(feedbackSentence);
    } catch {}

    this.container.innerHTML = `
      <div class="container page-enter">
        <div class="result-screen">
          <div class="result-emoji">${emoji}</div>
          <div class="result-title">${title}</div>
          <div class="result-message">${message}</div>

          <div class="result-stats">
            <div class="result-stat">
              <div class="result-stat-value">${finalScore}</div>
              <div class="result-stat-label">${I18n.t('score')}</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${accuracy}%</div>
              <div class="result-stat-label">${I18n.t('accuracy')}</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${TimerInstance.format(timeTaken)}</div>
              <div class="result-stat-label">${I18n.t('time')}</div>
            </div>
            <div class="result-stat">
              <div class="result-stat-value">${this.hintsUsed}</div>
              <div class="result-stat-label">${I18n.t('hints')}</div>
            </div>
          </div>

          <div class="result-coins" style="margin: 1.25rem 0; font-size: 1.25rem; font-weight: 700; color: ${coinDelta >= 0 ? '#0D9488' : '#DC2626'};">
            ${coinMessage}
            <div style="font-size: 0.9rem; font-weight: normal; color: var(--color-text-muted, #64748b); margin-top: 4px;">
              Correct: ${this.correctAnswers} | Wrong: ${this.wrongAnswers || 0}
            </div>
          </div>

          <div class="result-actions">
            <button class="btn btn-primary btn-block" id="result-replay">
              🔄 ${I18n.t('playAgain')}
            </button>
            <button class="btn btn-outline btn-block" id="result-exit">
              ← ${I18n.t('exitToHub')}
            </button>
          </div>
        </div>
      </div>
    `;

    this.container.querySelector('#result-replay').addEventListener('click', () => {
      this._renderStart();
    });

    this.container.querySelector('#result-exit').addEventListener('click', () => {
      this.cleanup();
      window.location.hash = '#/games';
    });
  }

  _initVoiceAnswers() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const btn = this.container.querySelector('#btn-game-voice-answer');
    const label = this.container.querySelector('#voice-ans-label');
    const banner = this.container.querySelector('#voice-ans-banner');

    if (!btn || !SpeechRecognition) return;

    btn.addEventListener('click', async () => {
      this._voiceAnswerActive = !this._voiceAnswerActive;
      if (this._voiceAnswerActive) {
        btn.style.background = '#ECFDF5';
        btn.style.borderColor = '#10B981';
        btn.style.color = '#065F46';
        if (label) label.textContent = 'Voice Answer: ON';
        if (banner) banner.style.display = 'block';

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try { await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) {}
        }
        this._startVoiceListening();
      } else {
        btn.style.background = '#FFFFFF';
        btn.style.borderColor = '#CBD5E1';
        btn.style.color = 'inherit';
        if (label) label.textContent = 'Voice Answer: OFF';
        if (banner) banner.style.display = 'none';
        if (this._voiceRec) {
          try { this._voiceRec.stop(); } catch {}
          this._voiceRec = null;
        }
      }
    });
  }

  _startVoiceListening() {
    if (!this._voiceAnswerActive || this.phase !== 'play') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (this._voiceRec) {
        try { this._voiceRec.stop(); } catch {}
      }
      this._voiceRec = new SpeechRecognition();
      this._voiceRec.continuous = true;
      this._voiceRec.interimResults = false;
      this._voiceRec.lang = I18n.lang === 'hi' ? 'hi-IN' : (I18n.lang === 'bn' ? 'bn-IN' : (I18n.lang === 'as' ? 'as-IN' : 'en-IN'));

      this._voiceRec.onresult = (e) => {
        const transcript = (e.results[e.results.length - 1][0].transcript || '').trim().toLowerCase();
        this._handleSpokenAnswer(transcript);
      };

      this._voiceRec.onerror = () => {
        if (this._voiceAnswerActive && this.phase === 'play') {
          setTimeout(() => this._startVoiceListening(), 1200);
        }
      };

      this._voiceRec.onend = () => {
        if (this._voiceAnswerActive && this.phase === 'play') {
          setTimeout(() => this._startVoiceListening(), 500);
        }
      };

      this._voiceRec.start();
    } catch (err) {
      console.warn('Voice answer start error:', err);
    }
  }

  _handleSpokenAnswer(transcript) {
    const statusText = this.container.querySelector('#voice-ans-status');
    if (statusText) statusText.textContent = `Heard: "${transcript}" — Searching match...`;

    const gameArea = this.container.querySelector('#game-area');
    if (!gameArea) return;

    const clickableCandidates = Array.from(gameArea.querySelectorAll('button, .card-item, .choice-btn, .option-btn, [data-choice], [data-card-id], .game-card, .quiz-option, .bamboo-item'));

    if (clickableCandidates.length === 0) return;

    let matchedElement = null;

    // Position-based matching ("first", "1", "one", "second", "2", "two", etc.)
    if (transcript.includes('first') || transcript.includes('1') || transcript.includes('one') || transcript.includes('pehla') || transcript.includes('ek') || transcript.includes('a')) {
      matchedElement = clickableCandidates[0];
    } else if (transcript.includes('second') || transcript.includes('2') || transcript.includes('two') || transcript.includes('dusra') || transcript.includes('do') || transcript.includes('b')) {
      matchedElement = clickableCandidates[1] || clickableCandidates[0];
    } else if (transcript.includes('third') || transcript.includes('3') || transcript.includes('three') || transcript.includes('teesra') || transcript.includes('teen') || transcript.includes('c')) {
      matchedElement = clickableCandidates[2] || clickableCandidates[0];
    } else if (transcript.includes('fourth') || transcript.includes('4') || transcript.includes('four') || transcript.includes('chautha') || transcript.includes('char') || transcript.includes('d')) {
      matchedElement = clickableCandidates[3] || clickableCandidates[0];
    } else {
      // Content-based matching: check element innerText against spoken phrase
      matchedElement = clickableCandidates.find(el => {
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        if (!text) return false;
        return transcript.includes(text) || text.includes(transcript);
      });
    }

    if (matchedElement) {
      if (statusText) statusText.innerHTML = `✨ Selected by Voice: <strong>${matchedElement.innerText || 'Matching Choice'}</strong>`;
      matchedElement.style.outline = '4px solid #10B981';
      matchedElement.style.transform = 'scale(1.05)';
      setTimeout(() => {
        matchedElement.click();
        setTimeout(() => {
          if (matchedElement) {
            matchedElement.style.outline = 'none';
            matchedElement.style.transform = 'none';
          }
        }, 400);
      }, 300);
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this._voiceRec) {
      try { this._voiceRec.stop(); } catch {}
      this._voiceRec = null;
    }
    this._voiceAnswerActive = false;
    if (this._popstateHandler) {
      window.removeEventListener('popstate', this._popstateHandler);
      this._popstateHandler = null;
    }
    const modal = document.querySelector('.game-exit-confirm-overlay');
    if (modal) modal.remove();

    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }
    if (this.config.onCleanup) {
      this.config.onCleanup();
    }
    TTS.stop();
  }
}

export default GameShell;
