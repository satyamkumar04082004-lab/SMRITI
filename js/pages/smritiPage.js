/* ============================================================
   SMRITI — AI Voice & Memory Companion Page
   Interactive conversational companion with dynamic context injection,
   streaming progressive token display, tool execution notifications,
   reactive language switching, and TTS.
   ============================================================ */

import AIService, { TOOL_HANDLERS } from '../aiService.js';
import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';
import UserState from '../userState.js';

export default function SmritiPage(container) {
  let firstName = UserState.getDisplayName() || 'Friend';
  const aiSettings = Storage.getAISettings();

  // Subscribe to live user-state changes
  const unsubscribeUser = UserState.subscribe(() => {
    firstName = UserState.getDisplayName() || 'Friend';
  });

  const getInitialGreeting = () => {
    const lang = I18n.lang || 'en';
    if (lang === 'hi') return `नमस्ते ${firstName}! 😊 मैं स्मृति साथी हूँ, आपकी संज्ञानात्मक स्मृति साथी। आज आप कैसा महसूस कर रहे हैं?`;
    if (lang === 'as') return `নমস্কাৰ ${firstName}! 😊 মই স্মৃতি সংগী, আপোনাৰ মৰমৰ সহায়ক। আজি আপোনাৰ মনটো কেনে আছে?`;
    if (lang === 'bn') return `নমস্কার ${firstName}! 😊 আমি স্মৃতি সাথী, আপনার প্রিয় স্মৃতি সহায়ক। আজ আপনার কেমন লাগছে?`;
    return `Hello ${firstName}! 😊 I'm Smriti Saathi, your cognitive care and memory companion. How are you feeling today?`;
  };

  let conversation = [
    { sender: 'smriti', text: getInitialGreeting() }
  ];

  let companionState = 'READY'; // READY | LISTENING... | THINKING... | SPEAKING...
  let isThinking = false;
  let recognition = null;
  let isListening = false;

  // Initialize Speech Recognition if available
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = I18n.lang === 'hi' ? 'hi-IN' : I18n.lang === 'bn' ? 'bn-IN' : I18n.lang === 'as' ? 'as-IN' : 'en-IN';

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

  // Reactive Language Event Listener (eliminating page reloads)
  const onLanguageChanged = () => {
    if (recognition) {
      recognition.lang = I18n.lang === 'hi' ? 'hi-IN' : I18n.lang === 'bn' ? 'bn-IN' : I18n.lang === 'as' ? 'as-IN' : 'en-IN';
    }
    render();
  };
  window.addEventListener('smriti:languageChanged', onLanguageChanged);
  window.addEventListener('languageChanged', onLanguageChanged);

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
          <h2 style="color: var(--maroon); margin-top: 0.5rem; font-size: 1.6rem;">${I18n.t('chatbotTitle')}</h2>
          <p class="text-muted" style="margin-bottom: 0.75rem; font-size: 1.05rem;">${I18n.t('chatbotSubtitle')}</p>
          
          <div class="companion-status-pill ${companionState.toLowerCase().replace(/[^a-z]/g, '')}">
            <span class="status-dot"></span>
            <span id="companion-state-text">${companionState}</span>
          </div>
        </div>

        <!-- Quick Action Prompt Chips -->
        <div class="quick-prompts-scroll" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.75rem; margin-bottom: 1rem;">
          <button class="chip-btn" data-msg="What date and time is it right now?">${I18n.t('chatbotPromptTime')}</button>
          <button class="chip-btn" data-msg="What are daily exercises for memory retention?">${I18n.t('chatbotPromptExercises')}</button>
          <button class="chip-btn" data-msg="Tell me an inspiring story">${I18n.t('chatbotPromptStory')}</button>
          <button class="chip-btn" data-msg="Give me a good thought for today">${I18n.t('chatbotPromptThought')}</button>
          <button class="chip-btn" data-msg="What game should I play today?">${I18n.t('chatbotPromptGame')}</button>
        </div>

        <!-- Conversation History -->
        <div id="chat-messages" class="card" style="min-height: 280px; max-height: 380px; overflow-y: auto; padding: 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.85rem; background: var(--white);">
          ${conversation.map((msg, idx) => `
            <div class="chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-smriti'}">
              <div class="chat-bubble-header">
                <strong>${msg.sender === 'user' ? firstName : '🤖 Smriti Saathi'}</strong>
                ${msg.sender === 'smriti' && msg.text ? `<button class="btn-replay-audio" data-idx="${idx}" title="Replay voice">🔊</button>` : ''}
              </div>
              <div class="chat-bubble-body">${msg.text}</div>
              ${msg.toolAction ? `
                <div style="margin-top: 0.4rem; padding: 0.3rem 0.6rem; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; font-size: 0.82rem; color: #047857; display: flex; align-items: center; gap: 0.35rem;">
                  <span>⚡</span>
                  <span><strong>${msg.toolAction.name}:</strong> ${msg.toolAction.message || 'Action executed'}</span>
                </div>
              ` : ''}
            </div>
          `).join('')}

          <!-- Typing Skeleton Indicator while fetching -->
          ${isThinking ? `
            <div id="chat-typing-skeleton" class="chat-bubble chat-bubble-smriti" style="display: flex; flex-direction: column; gap: 6px; width: 180px; padding: 0.75rem 1rem;">
              <div style="font-size: 0.8rem; opacity: 0.7; font-weight: 700;">${I18n.t('chatbotThinking')}</div>
              <div style="display: flex; gap: 5px; align-items: center; padding: 4px 0;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--teal); animation: blink 1s infinite alternate;"></span>
                <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--teal); animation: blink 1s infinite alternate 0.3s;"></span>
                <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--teal); animation: blink 1s infinite alternate 0.6s;"></span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Voice & Text Input Bar -->
        <div class="chat-input-bar card" style="display: flex; gap: 0.5rem; align-items: center; padding: 0.75rem;">
          <button id="btn-voice-toggle" class="btn ${isListening ? 'btn-primary' : 'btn-secondary'} btn-icon" title="Speak to Smriti" style="min-width: 56px; width: 56px; height: 56px; border-radius: 50%; font-size: 1.4rem;">
            ${isListening ? '⏹️' : '🎤'}
          </button>

          <input type="text" id="chat-text-input" class="form-input" placeholder="${I18n.t('chatbotInputPlaceholder')}" style="flex: 1; min-height: 52px; font-size: 1.05rem;" />
          
          <button id="btn-send-chat" class="btn btn-primary" style="min-height: 52px; padding: 0 1.25rem;">
            ${I18n.t('chatbotSend')}
          </button>
        </div>

        <!-- Helpful Voice Note -->
        <div class="text-center mt-sm" style="font-size: 0.85rem; color: var(--gray-500);">
          ${I18n.t('chatbotVoiceNote')}
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
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if (recognition) {
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
        } else {
          isListening = true;
          companionState = 'LISTENING...';
          updateUI();
          setTimeout(() => {
            isListening = false;
            companionState = 'READY';
            updateUI();
            handleUserMessage("Hello Smriti, what time is it and how is my progress today?");
          }, 1200);
        }
      });
    }
  }

  async function handleUserMessage(text) {
    if (!text) return;

    // Add user message
    conversation.push({ sender: 'user', text });
    isThinking = true;
    companionState = 'THINKING...';
    render();

    // Prepare placeholder assistant bubble for progressive streaming
    const assistantIndex = conversation.length;
    conversation.push({ sender: 'smriti', text: '' });

    try {
      // Use streaming enabled API call with tool callback
      await AIService.streamChatWithSmriti(
        text,
        (token, isFinal) => {
          isThinking = false;
          conversation[assistantIndex].text += token;
          companionState = 'SPEAKING...';
          
          const chatContainer = container.querySelector('#chat-messages');
          if (chatContainer) {
            const bubbles = chatContainer.querySelectorAll('.chat-bubble-smriti');
            const lastBubble = bubbles[bubbles.length - 1];
            if (lastBubble) {
              const body = lastBubble.querySelector('.chat-bubble-body');
              if (body) body.textContent = conversation[assistantIndex].text;
            }
            scrollChatToBottom();
          }

          if (isFinal) {
            render();
            if (aiSettings.autoSpeak !== false && conversation[assistantIndex].text) {
              TTS.speak(conversation[assistantIndex].text);
            }
            setTimeout(() => {
              companionState = 'READY';
              updateUI();
            }, 3500);
          }
        },
        (toolCall, toolResult) => {
          // Record tool execution visually in conversation
          conversation[assistantIndex].toolAction = {
            name: toolCall.name,
            message: toolResult?.message || `Completed ${toolCall.name}`
          };
          render();
        }
      );
    } catch (err) {
      console.warn('Streaming error, falling back to sync:', err);
      isThinking = false;
      const reply = AIService.chatWithSmriti(text, conversation);
      conversation[assistantIndex].text = reply;
      companionState = 'SPEAKING...';
      render();

      if (aiSettings.autoSpeak !== false) {
        TTS.speak(reply);
      }
      setTimeout(() => {
        companionState = 'READY';
        updateUI();
      }, 3000);
    }
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
      if (typeof unsubscribeUser === 'function') unsubscribeUser();
      window.removeEventListener('smriti:languageChanged', onLanguageChanged);
      window.removeEventListener('languageChanged', onLanguageChanged);
    }
  };
}
