/* ============================================================
   SMRITI — Play with Friends & Family (Gentle Social Play)
   Turn-based shared activities, Smile Exchange, Voice Notes,
   Family Challenge of the Week & Username invite system
   ============================================================ */

import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';

export default function SocialPlayPage(container) {
  let user = Storage.getUser() || { name: 'Friend' };
  let username = Storage.getUsername();
  let messages = Storage.getSocialMessages() || [];
  let challenge = Storage.getFamilyChallenge();
  let contacts = Storage.getFamilyContacts() || [];

  // Partner selection
  let partnerName = contacts.length > 0 ? `${contacts[0].name} (${contacts[0].relation})` : 'Raj (Son)';

  // Turn-based Duo Gentle Memory Match state
  let currentTurn = 'you'; // 'you' | 'partner'
  let cards = shuffleCards();
  let flippedCards = [];
  let matchedPairs = 0;
  let statusMessage = "It's your turn! Tap any 2 cards to find a pair.";
  let isProcessing = false;

  function shuffleCards() {
    const symbols = ['🌸', '🌺', '🍃'];
    const deck = [...symbols, ...symbols].map((icon, idx) => ({
      id: idx,
      icon,
      flipped: false,
      matched: false
    }));
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function render() {
    container.innerHTML = `
      <div class="page-container" style="max-width: 800px; margin: 0 auto; padding: 1.5rem 1rem 3rem;">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a href="#/home" class="btn btn-secondary btn-icon" title="Back to Home" style="width: 48px; height: 48px; font-size: 1.2rem; border-radius: 50%;">←</a>
            <div>
              <h1 style="color: var(--maroon); font-size: 1.7rem; margin: 0; font-family: var(--font-heading);">👨‍👩‍👧 Play with Family</h1>
              <p class="text-muted" style="margin: 0; font-size: 1rem;">Gentle games, smiles & voice notes with loved ones</p>
            </div>
          </div>
          <span class="badge" style="background: var(--cream-dark); color: var(--maroon); font-size: 0.95rem; padding: 0.4rem 0.85rem; border-radius: 20px;">
            ❤️ Connected with Family
          </span>
        </div>

        <!-- Section 1: User Handle & Family Connect Bar -->
        <div class="card" style="background: linear-gradient(135deg, #FFF9F3 0%, #FFF2E8 100%); border: 2px solid #F8D8C4; padding: 1.25rem; margin-bottom: 1.5rem; border-radius: 16px;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
            <div>
              <div style="font-size: 0.9rem; color: var(--gray-600); font-weight: 500;">YOUR SMRITI FAMILY USERNAME</div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                <span id="my-username-display" style="font-family: monospace; font-size: 1.35rem; font-weight: 700; color: var(--maroon); background: #FFF; padding: 0.35rem 0.75rem; border-radius: 8px; border: 1px dashed var(--gold);">
                  ${username}
                </span>
                <button id="btn-copy-username" class="btn btn-secondary" style="min-height: 44px; padding: 0.4rem 0.9rem; font-size: 0.95rem;" title="Copy to clipboard">
                  📋 Copy Handle
                </button>
              </div>
              <p style="font-size: 0.85rem; color: var(--gray-600); margin: 0.35rem 0 0;">Share this with your son, daughter, or caregiver to connect instantly.</p>
            </div>
            <div style="min-width: 200px;">
              <label style="font-size: 0.9rem; color: var(--gray-600); font-weight: 500; display: block; margin-bottom: 0.25rem;">PLAYING TOGETHER WITH</label>
              <select id="select-partner" class="form-input" style="min-height: 44px; font-size: 1rem; border-radius: 10px; background: white;">
                ${contacts.map(c => `<option value="${c.name} (${c.relation})" ${partnerName.includes(c.name) ? 'selected' : ''}>${c.photo || '👤'} ${c.name} (${c.relation})</option>`).join('')}
                <option value="Family Member" ${!contacts.some(c => partnerName.includes(c.name)) ? 'selected' : ''}>👥 Other Family Member</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 2: Turn-Based Duo Memory Match -->
        <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 16px; background: var(--white); box-shadow: 0 4px 16px rgba(155, 44, 44, 0.06);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h2 style="color: var(--maroon); font-size: 1.35rem; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
                <span>🌸</span> Duo Gentle Memory Match
              </h2>
              <p class="text-muted" style="margin: 0.2rem 0 0; font-size: 0.95rem;">Take turns with ${partnerName} to find gentle flower pairs!</p>
            </div>
            <button id="btn-restart-duo" class="btn btn-secondary" style="min-height: 40px; padding: 0.35rem 0.8rem; font-size: 0.9rem;">
              🔄 New Game
            </button>
          </div>

          <!-- Turn & Status Pill -->
          <div style="text-align: center; margin-bottom: 1.25rem;">
            <div id="duo-turn-indicator" style="display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.55rem 1.2rem; border-radius: 25px; font-size: 1.1rem; font-weight: 600; ${currentTurn === 'you' ? 'background: #E6F4EA; color: #137333; border: 1px solid #CEEAD6;' : 'background: #FEF7E0; color: #B06000; border: 1px solid #FEEFC3;'}">
              <span>${currentTurn === 'you' ? '🌟' : '🤝'}</span>
              <span>${currentTurn === 'you' ? 'Your Turn' : partnerName + "'s Turn"}</span>
            </div>
            <div id="duo-status-text" style="font-size: 1rem; color: var(--gray-600); margin-top: 0.45rem;">
              ${statusMessage}
            </div>
          </div>

          <!-- Memory Cards Grid (2 rows x 3 columns) -->
          <div id="duo-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; max-width: 440px; margin: 0 auto;">
            ${cards.map((card, idx) => `
              <button class="duo-card-btn" data-index="${idx}" style="aspect-ratio: 1; border-radius: 14px; font-size: 2.2rem; border: 2px solid ${card.matched ? '#34A853' : card.flipped ? 'var(--gold)' : '#E0D6CC'}; background: ${card.matched ? '#E6F4EA' : card.flipped ? '#FFF' : '#FDF8F3'}; cursor: ${card.matched || card.flipped ? 'default' : 'pointer'}; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.05);" ${card.matched || card.flipped ? 'disabled' : ''}>
                ${card.flipped || card.matched ? card.icon : '❓'}
              </button>
            `).join('')}
          </div>

          <!-- Matched Counter -->
          <div style="text-align: center; margin-top: 1.25rem; font-size: 1rem; color: var(--gray-600);">
            Pairs matched: <strong>${matchedPairs}</strong> of 3
            ${matchedPairs === 3 ? ' 🎉 <span style="color: #137333; font-weight: 600;">Wonderful teamwork! Both of you won!</span>' : ''}
          </div>
        </div>

        <!-- Section 3: Family Challenge of the Week -->
        <div class="card" style="padding: 1.25rem; margin-bottom: 1.5rem; border-radius: 16px; background: linear-gradient(135deg, #FAF7F2 0%, #F5EFEB 100%); border: 1.5px solid #E6DBD1;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div>
              <div style="font-size: 0.85rem; color: var(--teal); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">🌟 WEEKLY FAMILY CHALLENGE</div>
              <h3 style="color: var(--maroon); margin: 0.25rem 0 0.4rem; font-size: 1.25rem;">${challenge.title}</h3>
              <p style="color: var(--gray-700); margin: 0 0 0.75rem; font-size: 0.95rem;">${challenge.description}</p>
              
              <!-- Progress bar -->
              <div style="display: flex; align-items: center; gap: 0.75rem; max-width: 360px;">
                <div style="flex: 1; height: 10px; background: #E0D6CC; border-radius: 5px; overflow: hidden;">
                  <div style="width: ${Math.min(100, Math.round((challenge.current / challenge.target) * 100))}%; height: 100%; background: var(--teal); border-radius: 5px; transition: width 0.3s ease;"></div>
                </div>
                <span style="font-weight: 600; font-size: 0.9rem; color: var(--teal);">${challenge.current}/${challenge.target} Done</span>
              </div>
            </div>

            <button id="btn-progress-challenge" class="btn btn-primary" style="min-height: 48px; padding: 0.5rem 1.1rem; font-size: 0.95rem; align-self: center;" ${challenge.current >= challenge.target ? 'disabled' : ''}>
              ${challenge.current >= challenge.target ? '✅ Challenge Completed!' : '✨ Mark 1 Shared Today'}
            </button>
          </div>
        </div>

        <!-- Section 4: Smile & Voice Note Exchange -->
        <div class="card" style="padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 16px;">
          <h2 style="color: var(--maroon); font-size: 1.35rem; margin: 0 0 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>💌</span> Smiles & Warm Voice Notes
          </h2>
          <p class="text-muted" style="margin: 0 0 1.25rem; font-size: 0.95rem;">Send a warm heart or listen to messages sent by your family.</p>

          <!-- Quick Smile Send Buttons -->
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.9rem; font-weight: 600; color: var(--gray-700); margin-bottom: 0.5rem;">SEND A QUICK SMILE TO ${partnerName.toUpperCase()}:</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-smile" data-emoji="🌸" data-text="Sending you beautiful flowers and fragrant morning blessings!" style="min-height: 46px; font-size: 1rem; border-radius: 20px;">
                🌸 Morning Flower
              </button>
              <button class="btn btn-secondary btn-smile" data-emoji="❤️" data-text="Sending you a big warm hug and endless love today!" style="min-height: 46px; font-size: 1rem; border-radius: 20px;">
                ❤️ Warm Hug
              </button>
              <button class="btn btn-secondary btn-smile" data-emoji="☕" data-text="Wishing you a peaceful tea time! Have your warm cup peacefully." style="min-height: 46px; font-size: 1rem; border-radius: 20px;">
                ☕ Tea Time
              </button>
              <button class="btn btn-secondary btn-smile" data-emoji="🌟" data-text="Thinking of you with lots of pride and happiness!" style="min-height: 46px; font-size: 1rem; border-radius: 20px;">
                🌟 Blessings
              </button>
            </div>
          </div>

          <!-- Custom Message Input -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            <input type="text" id="social-custom-input" class="form-input" placeholder="Type a gentle note to your family..." style="flex: 1; min-height: 48px; font-size: 1rem;" />
            <button id="btn-send-social-msg" class="btn btn-primary" style="min-height: 48px; padding: 0 1.25rem; font-size: 1rem;">
              Send ✉️
            </button>
          </div>

          <!-- Received Messages List with Voice Notes -->
          <div style="font-size: 0.95rem; font-weight: 600; color: var(--gray-700); margin-bottom: 0.75rem;">MESSAGES FROM LOVED ONES:</div>
          <div id="social-messages-list" style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${messages.map(m => `
              <div class="card" style="padding: 1rem; background: #FFFDF9; border: 1px solid #EFE4DC; border-radius: 12px; display: flex; align-items: flex-start; gap: 0.85rem;">
                <div style="font-size: 2rem; line-height: 1; background: #FFF4EC; padding: 0.5rem; border-radius: 50%;">
                  ${m.avatar || '👤'}
                </div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <div style="font-weight: 700; color: var(--maroon); font-size: 1.05rem;">${m.from}</div>
                    <span style="font-size: 0.8rem; color: var(--gray-500);">${m.date}</span>
                  </div>
                  <p style="margin: 0 0 0.5rem; font-size: 1rem; color: var(--gray-800); line-height: 1.4;">
                    ${m.content}
                  </p>
                  <button class="btn btn-secondary btn-listen-voice" data-text="${encodeURIComponent(m.content)}" style="min-height: 38px; padding: 0.25rem 0.75rem; font-size: 0.88rem; border-radius: 16px; display: inline-flex; align-items: center; gap: 0.4rem;">
                    🔊 Listen to Voice Note
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Copy Username
    const copyBtn = container.querySelector('#btn-copy-username');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(username).then(() => {
          copyBtn.textContent = '✅ Copied!';
          setTimeout(() => { copyBtn.textContent = '📋 Copy Handle'; }, 2000);
        }).catch(() => {
          copyBtn.textContent = '✅ ' + username;
        });
      });
    }

    // Partner Select
    const partnerSelect = container.querySelector('#select-partner');
    if (partnerSelect) {
      partnerSelect.addEventListener('change', (e) => {
        partnerName = e.target.value;
        statusMessage = `It's your turn! Tap any 2 cards to find a pair with ${partnerName}.`;
        render();
      });
    }

    // Duo Game: Restart
    const restartBtn = container.querySelector('#btn-restart-duo');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        cards = shuffleCards();
        flippedCards = [];
        matchedPairs = 0;
        currentTurn = 'you';
        statusMessage = "Fresh round started! Tap any 2 cards to begin.";
        render();
      });
    }

    // Duo Game: Card Clicks
    container.querySelectorAll('.duo-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (isProcessing || currentTurn !== 'you') return;
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const card = cards[idx];
        if (card.flipped || card.matched) return;

        // Flip card
        card.flipped = true;
        flippedCards.push({ idx, card });
        render();

        if (flippedCards.length === 2) {
          isProcessing = true;
          const [first, second] = flippedCards;

          if (first.card.icon === second.card.icon) {
            // Match found!
            first.card.matched = true;
            second.card.matched = true;
            matchedPairs++;
            flippedCards = [];
            isProcessing = false;
            statusMessage = `🎉 Great match! You found the ${first.card.icon}!`;
            if (matchedPairs === 3) {
              TTS.speak("Wonderful! You and your loved one matched all the cards together!");
            }
            render();
          } else {
            // No match -> Turn passes to partner after short pause
            statusMessage = `Not quite a pair. Passing turn to ${partnerName}...`;
            render();
            setTimeout(() => {
              first.card.flipped = false;
              second.card.flipped = false;
              flippedCards = [];
              currentTurn = 'partner';
              statusMessage = `🤝 ${partnerName} is taking their turn...`;
              render();

              // Simulate partner's gentle turn
              setTimeout(() => {
                simulatePartnerTurn();
              }, 1600);
            }, 1200);
          }
        }
      });
    });

    // Partner turn simulation (or collaborative turn)
    function simulatePartnerTurn() {
      const unmatched = cards.map((c, i) => ({ c, i })).filter(item => !item.c.matched);
      if (unmatched.length >= 2) {
        // Partner flips one card
        const pick1 = unmatched[0];
        pick1.c.flipped = true;
        render();

        setTimeout(() => {
          // Partner checks for matching pair
          const partnerMatch = unmatched.find(item => item.i !== pick1.i && item.c.icon === pick1.c.icon);
          const pick2 = partnerMatch || unmatched[1];
          pick2.c.flipped = true;
          render();

          setTimeout(() => {
            if (pick1.c.icon === pick2.c.icon) {
              pick1.c.matched = true;
              pick2.c.matched = true;
              matchedPairs++;
              statusMessage = `🌟 ${partnerName} found a matching ${pick1.c.icon}! Your turn next!`;
            } else {
              pick1.c.flipped = false;
              pick2.c.flipped = false;
              statusMessage = `${partnerName} tried their best. Now it's your turn!`;
            }
            currentTurn = 'you';
            isProcessing = false;
            render();
          }, 1200);
        }, 1000);
      } else {
        currentTurn = 'you';
        isProcessing = false;
        render();
      }
    }

    // Weekly Challenge progress
    const challengeBtn = container.querySelector('#btn-progress-challenge');
    if (challengeBtn) {
      challengeBtn.addEventListener('click', () => {
        challenge = Storage.updateFamilyChallenge(1);
        TTS.speak("Wonderful! Progress saved for your weekly family challenge.");
        render();
      });
    }

    // Quick Smile Buttons
    container.querySelectorAll('.btn-smile').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        const emoji = btn.getAttribute('data-emoji');
        const newMsg = {
          id: 'msg_' + Date.now(),
          from: `${user.name || 'Meera'} (You)`,
          fromUsername: username,
          type: 'smile',
          content: `${emoji} ${text}`,
          date: 'Just now',
          avatar: '👵'
        };
        messages = Storage.addSocialMessage(newMsg);
        TTS.speak("Warm smile sent to your family!");
        render();
      });
    });

    // Custom Message Send
    const customInput = container.querySelector('#social-custom-input');
    const sendMsgBtn = container.querySelector('#btn-send-social-msg');
    const sendHandler = () => {
      const text = customInput ? customInput.value.trim() : '';
      if (!text) return;
      const newMsg = {
        id: 'msg_' + Date.now(),
        from: `${user.name || 'Meera'} (You)`,
        fromUsername: username,
        type: 'voice',
        content: text,
        date: 'Just now',
        avatar: '👵'
      };
      messages = Storage.addSocialMessage(newMsg);
      customInput.value = '';
      TTS.speak("Your message has been sent to family!");
      render();
    };
    if (sendMsgBtn) sendMsgBtn.addEventListener('click', sendHandler);
    if (customInput) {
      customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendHandler();
      });
    }

    // Listen to Voice Notes
    container.querySelectorAll('.btn-listen-voice').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.getAttribute('data-text') || '');
        if (text) {
          TTS.speak(text);
        }
      });
    });
  }

  render();

  return {
    cleanup() {
      TTS.stop();
    }
  };
}
