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
          
          ${c.hasDifficulty ? `
          <div class="difficulty-selector" id="diff-selector" style="margin-bottom: 1rem;">
            <button class="diff-btn" data-diff="easy">${I18n.t('easy')}</button>
            <button class="diff-btn active" data-diff="medium">${I18n.t('medium')}</button>
            <button class="diff-btn" data-diff="hard">${I18n.t('hard')}</button>
          </div>
          ` : ''}

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
          this.container.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.difficulty = btn.dataset.diff;
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
        <div class="game-header">
          <div class="game-score" id="game-score">
            ${I18n.t('score')}: <span id="score-value">0</span>
          </div>
          <div class="game-timer" id="game-timer">0:00</div>
        </div>
        <div id="game-area"></div>
      </div>
    `;

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
   * Record a wrong answer
   */
  recordWrong() {
    this.totalQuestions++;
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

    // Calculate coins
    const coinCalc = Coins.calculate(accuracy, timeTaken, this.config.parTime || 60);
    Coins.add(coinCalc.total, this.config.gameId);
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
      coinsEarned: coinCalc.total,
    });

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

    // Voice feedback on completion
    try {
      const vSettings = Storage.getVoiceSettings();
      if (vSettings.voiceGuidanceEnabled && vSettings.voiceFeedback) {
        const feedbackSentence = `${title}. You completed ${I18n.t(this.config.titleKey)} with ${accuracy} percent accuracy and earned ${coinCalc.total} coins. Wonderful job!`;
        TTS.speak(feedbackSentence);
      }
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

          <div class="result-coins">🪙 +${coinCalc.total} ${I18n.t('coins')}</div>

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

  /**
   * Cleanup resources
   */
  cleanup() {
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
