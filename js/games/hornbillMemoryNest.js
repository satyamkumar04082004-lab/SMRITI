import GameShell from '../gameShell.js';
import I18n from '../i18n.js';

export default function HornbillMemoryNest(container) {
    const emojis = ['🦅', '🌺', '🎋', '🦋', '🍃', '🪷', '🍵', '🪨', '🌸', '🐘'];
    let moves = 0;
    let pairsMatched = 0;
    let targetPairs = 0;
    let flippedCards = [];
    let isFlipping = false;
    let movesDisplay = null;

    const config = {
        gameId: 'hornbill',
        titleKey: 'g1Title',
        instructionKey: 'g1Instruction',
        icon: '🦅',
        hasDifficulty: true,
        parTime: 90,
        onStart: (difficulty, gameArea, controller) => {
            startGame(difficulty, gameArea, controller);
        }
    };

    const shell = GameShell.create(container, config);

    function startGame(difficulty, gameArea, controller) {
        moves = 0;
        pairsMatched = 0;
        flippedCards = [];
        isFlipping = false;

        let gridCols = 4;
        if (difficulty === 'easy') {
            targetPairs = 6;
            gridCols = 4;
        } else if (difficulty === 'medium') {
            targetPairs = 8;
            gridCols = 4;
        } else {
            targetPairs = 10;
            gridCols = 5;
        }

        const gameEmojis = emojis.slice(0, targetPairs);
        let cards = [...gameEmojis, ...gameEmojis];
        cards.sort(() => Math.random() - 0.5);

        gameArea.innerHTML = `
            <div class="game-header" style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 1.15rem; font-weight: 700; color: var(--maroon);">
                    🦅 Matches Found: <span id="matches-count">0</span> / ${targetPairs} &nbsp;•&nbsp; Moves: <span id="moves-count">0</span>
                </div>
            </div>
            <div class="memory-grid memory-grid-${gridCols}">
            </div>
        `;
        
        movesDisplay = gameArea.querySelector('#moves-count');
        const matchesDisplay = gameArea.querySelector('#matches-count');
        const grid = gameArea.querySelector('.memory-grid');

        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-face memory-card-back" title="Tap to flip">🪶</div>
                    <div class="memory-card-face memory-card-front">${emoji}</div>
                </div>
            `;

            card.addEventListener('click', () => handleCardClick(card, controller, matchesDisplay));
            grid.appendChild(card);
        });
    }

    function handleCardClick(card, controller, matchesDisplay) {
        if (isFlipping || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            if (movesDisplay) movesDisplay.textContent = moves;
            isFlipping = true;

            const [card1, card2] = flippedCards;
            if (card1.dataset.emoji === card2.dataset.emoji) {
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    controller.addScore(10);
                    controller.recordCorrect();
                    pairsMatched++;
                    if (matchesDisplay) matchesDisplay.textContent = pairsMatched;
                    flippedCards = [];
                    isFlipping = false;

                    if (pairsMatched === targetPairs) {
                        const accuracy = Math.round((targetPairs / moves) * 100);
                        controller.endGame({ accuracy: Math.min(100, accuracy) });
                    }
                }, 400);
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    controller.recordWrong();
                    flippedCards = [];
                    isFlipping = false;
                }, 800);
            }
        }
    }

    return {
        cleanup() {
            if (shell.cleanup) shell.cleanup();
        }
    };
}
