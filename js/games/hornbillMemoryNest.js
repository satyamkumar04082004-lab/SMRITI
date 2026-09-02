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
            <div class="game-header">
                <p>Moves: <span id="moves-count">0</span></p>
            </div>
            <div class="memory-grid" style="display: grid; gap: 10px; grid-template-columns: repeat(${gridCols}, 1fr);">
            </div>
        `;
        
        movesDisplay = gameArea.querySelector('#moves-count');
        const grid = gameArea.querySelector('.memory-grid');

        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.style.height = '100px';
            card.style.perspective = '1000px';
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <div class="memory-card-inner" style="width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; position: relative;">
                    <div class="memory-card-front memory-card-face card" style="width: 100%; height: 100%; position: absolute; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; font-size: 2rem; background: #9B2C2C; color: white;">?</div>
                    <div class="memory-card-back memory-card-face card" style="width: 100%; height: 100%; position: absolute; backface-visibility: hidden; transform: rotateY(180deg); display: flex; align-items: center; justify-content: center; font-size: 2rem; background: #FDF8F3;">${emoji}</div>
                </div>
            `;

            card.addEventListener('click', () => handleCardClick(card, controller));
            grid.appendChild(card);
        });
    }

    function handleCardClick(card, controller) {
        if (isFlipping || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        card.querySelector('.memory-card-inner').style.transform = 'rotateY(180deg)';
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
                    flippedCards = [];
                    isFlipping = false;

                    if (pairsMatched === targetPairs) {
                        const accuracy = Math.round((targetPairs / moves) * 100);
                        controller.endGame({ accuracy: Math.min(100, accuracy) });
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card1.querySelector('.memory-card-inner').style.transform = 'rotateY(0deg)';
                    card2.classList.remove('flipped');
                    card2.querySelector('.memory-card-inner').style.transform = 'rotateY(0deg)';
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
