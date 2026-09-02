/* ============================================================
   SMRITI — AI Voice & Memory Companion Page
   Interactive conversational companion with Voice/TTS support
   ============================================================ */

import AIService from '../aiService.js';
import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';

export default function SmritiPage(container) {
  const user = Storage.getUser() || { name: 'Friend' };
  const firstName = user.name.split(' ')[0] || 'Friend';
  const aiSettings = Storage.getAISettings();

  let conversation = [
    { sender: 'smriti', text: `Hello ${firstName}! 😊 I'm Smriti. Would you like to talk about your day, hear an inspiring story, or start a fun game together?` }
  ];

  let companionState = 'READY'; // READY | LISTENING... | THINKING... | SPEAKING...
  let recognition = null;
  let isListening = false;

  // Initialize Speech Recognition if available in browser
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = I18n.lang === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => {
      isListening = true;
      companionState = 'LISTENING...';
      updateUI();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      isListening = false;
      companionState = 'READY';
      handleUserMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      isListening = false;
      companionState = 'READY';
      updateUI();
    };

    recognition.onend = () => {
      isListening = false;
      if (companionState === 'LISTENING...') {
        companionState = 'READY';
      }
      updateUI();
    };
  }

  function render() {
    container.innerHTML = `
      <div class="container page-enter" style="max-width: 650px; padding-bottom: 2rem;">
        <!-- Top Companion Header -->
        <div class="card card-elevated text-center" style="background: linear-gradient(135deg, #FFF9F2, #FFF2E2); border: 2px solid #F3E8DC; padding: 1.5rem; margin-bottom: 1rem;">
          <div class="smriti-avatar-container" style="position: relative; display: inline-block;">
            <div class="smriti-avatar-pulse ${companionState === 'LISTENING...' || companionState === 'SPEAKING...' ? 'active' : ''}">
              <div style="font-size: 3.5rem;">🤖✨</div>
            </div>
          </div>
          <h2 style="color: var(--maroon); margin-top: 0.5rem; font-size: 1.6rem;">Smriti AI Companion</h2>
          <p class="text-muted" style="margin-bottom: 0.75rem; font-size: 1.05rem;">Your friendly voice and memory companion</p>
          
          <div class="companion-status-pill ${companionState.toLowerCase().replace(/[^a-z]/g, '')}">
            <span class="status-dot"></span>
            <span id="companion-state-text">${companionState}</span>
          </div>
        </div>

        <!-- Quick Action Prompt Chips -->
        <div class="quick-prompts-scroll" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.75rem; margin-bottom: 1rem;">
          <button class="chip-btn" data-msg="Tell me an inspiring story">📖 Tell a Story</button>
          <button class="chip-btn" data-msg="Give me a good thought for today">🌻 Good Thought</button>
          <button class="chip-btn" data-msg="Tell me a cheerful joke">😄 Tell a Joke</button>
          <button class="chip-btn" data-msg="I am feeling a little sad today">💭 Feeling Low</button>
          <button class="chip-btn" data-msg="What game should I play today?">🎮 Suggest Game</button>
        </div>

        <!-- Conversation History -->
        <div id="chat-messages" class="card" style="min-height: 280px; max-height: 380px; overflow-y: auto; padding: 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.85rem; background: var(--white);">
          ${conversation.map((msg, idx) => `
            <div class="chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-smriti'}">
              <div class="chat-bubble-header">
                <strong>${msg.sender === 'user' ? firstName : '🤖 Smriti'}</strong>
                ${msg.sender === 'smriti' ? `<button class="btn-replay-audio" data-idx="${idx}" title="Replay voice">🔊</button>` : ''}
              </div>
              <div class="chat-bubble-body">${msg.text}</div>
            </div>
          `).join('')}
        </div>

        <!-- Voice & Text Input Bar -->
        <div class="chat-input-bar card" style="display: flex; gap: 0.5rem; align-items: center; padding: 0.75rem;">
          ${recognition ? `
            <button id="btn-voice-toggle" class="btn ${isListening ? 'btn-primary' : 'btn-secondary'} btn-icon" title="Speak to Smriti" style="min-width: 56px; width: 56px; height: 56px; border-radius: 50%;">
              ${isListening ? '⏹️' : '🎤'}
            </button>
          ` : ''}

          <input type="text" id="chat-text-input" class="form-input" placeholder="Type a message to Smriti..." style="flex: 1; min-height: 52px; font-size: 1.05rem;" />
          
          <button id="btn-send-chat" class="btn btn-primary" style="min-height: 52px; padding: 0 1.25rem;">
            Send
          </button>
        </div>

        <!-- Helpful Voice Note -->
        <div class="text-center mt-sm" style="font-size: 0.85rem; color: var(--gray-500);">
          💡 You can speak or type anytime. Smriti speaks responses aloud automatically.
        </div>
      </div>
    `;

    attachEvents();
    scrollChatToBottom();
  }

  function updateUI() {
    const stateEl = container.querySelector('#companion-state-text');
    if (stateEl) stateEl.textContent = companionState;

    const pulseEl = container.querySelector('.smriti-avatar-pulse');
    if (pulseEl) {
      if (companionState === 'LISTENING...' || companionState === 'SPEAKING...') {
        pulseEl.classList.add('active');
      } else {
        pulseEl.classList.remove('active');
      }
    }

    const voiceBtn = container.querySelector('#btn-voice-toggle');
    if (voiceBtn) {
      voiceBtn.innerHTML = isListening ? '⏹️' : '🎤';
      if (isListening) {
        voiceBtn.className = 'btn btn-primary btn-icon';
      } else {
        voiceBtn.className = 'btn btn-secondary btn-icon';
      }
    }
  }

  function attachEvents() {
    // Quick prompt chips
    container.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.getAttribute('data-msg');
        handleUserMessage(msg);
      });
    });

    // Replay audio buttons
    container.querySelectorAll('.btn-replay-audio').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const item = conversation[idx];
        if (item && item.text) {
          companionState = 'SPEAKING...';
          updateUI();
          TTS.speak(item.text);
          setTimeout(() => { companionState = 'READY'; updateUI(); }, 2500);
        }
      });
    });

    // Text input send
    const input = container.querySelector('#chat-text-input');
    const sendBtn = container.querySelector('#btn-send-chat');

    const handleSend = () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUserMessage(text);
    };

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }

    // Voice recognition toggle button
    const voiceBtn = container.querySelector('#btn-voice-toggle');
    if (voiceBtn && recognition) {
      voiceBtn.addEventListener('click', () => {
        if (isListening) {
          recognition.stop();
          isListening = false;
          companionState = 'READY';
          updateUI();
        } else {
          try {
            recognition.start();
          } catch (e) {
            console.warn('Recognition start issue:', e);
          }
        }
      });
    }
  }

  function handleUserMessage(text) {
    if (!text) return;

    // Add user message
    conversation.push({ sender: 'user', text });
    companionState = 'THINKING...';
    render();

    // Generate AI response
    setTimeout(() => {
      const reply = AIService.chatWithSmriti(text, conversation);
      conversation.push({ sender: 'smriti', text: reply });
      companionState = 'SPEAKING...';
      render();

      if (aiSettings.autoSpeak !== false) {
        TTS.speak(reply);
      }

      // Return to ready state after short delay
      setTimeout(() => {
        companionState = 'READY';
        updateUI();
      }, 3000);
    }, 600);
  }

  function scrollChatToBottom() {
    const chatContainer = container.querySelector('#chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  render();

  return {
    cleanup() {
      if (recognition && isListening) {
        recognition.stop();
      }
      TTS.stop();
    }
  };
}
