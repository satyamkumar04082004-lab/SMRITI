import GameShell from '../gameShell.js';
import I18n from '../i18n.js';
import TTS from '../tts.js';

export default function RememberHome(container) {
    const config = {
        gameId: 'remember-home',
        titleKey: 'g4Title',
        instructionKey: 'g4Instruction',
        icon: '🏠',
        hasDifficulty: true,
        parTime: 120,
        onStart: startGame,
        onCleanup: cleanup
    };

    let currentController;
    let timer;
    
    const objectPool = [
        { emoji: '🕐', name: 'Clock' },
        { emoji: '🪑', name: 'Chair' },
        { emoji: '🌱', name: 'Plant' },
        { emoji: '📚', name: 'Books' },
        { emoji: '🖼️', name: 'Picture' },
        { emoji: '🛋️', name: 'Sofa' },
        { emoji: '💡', name: 'Lamp' },
        { emoji: '🏺', name: 'Vase' },
        { emoji: '📺', name: 'TV' },
        { emoji: '🧸', name: 'Teddy Bear' }
    ];

    const shell = GameShell.create(container, config);

    let userMemorizeTime = 8; // Default generous 8 seconds for elderly ease

    function startGame(difficulty, gameArea, controller) {
        currentController = controller;
        let numObjects, defaultTime, totalRounds;
        
        if (difficulty === 'easy') {
            numObjects = 4;
            defaultTime = 8;
            totalRounds = 5;
        } else if (difficulty === 'medium') {
            numObjects = 5;
            defaultTime = 7;
            totalRounds = 6;
        } else {
            numObjects = 7;
            defaultTime = 6;
            totalRounds = 7;
        }
        userMemorizeTime = defaultTime;

        let currentRound = 0;

        function startRound() {
            if (currentRound >= totalRounds) {
                controller.endGame();
                return;
            }
            currentRound++;
            
            gameArea.innerHTML = '';
            
            const roundIndicator = document.createElement('div');
            roundIndicator.className = 'round-indicator text-center mb-4 text-xl font-bold';
            roundIndicator.textContent = `Round ${currentRound} of ${totalRounds}`;
            gameArea.appendChild(roundIndicator);
            
            const gridContainer = document.createElement('div');
            gridContainer.className = 'room-grid grid grid-cols-3 gap-4 max-w-md mx-auto p-4 bg-cream rounded-xl shadow-md';
            
            const shuffledPool = [...objectPool].sort(() => Math.random() - 0.5);
            const selectedObjects = shuffledPool.slice(0, numObjects);
            
            const cells = Array(9).fill(null);
            const availableIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
            
            selectedObjects.forEach((obj, i) => {
                cells[availableIndices[i]] = obj;
            });
            
            cells.forEach((obj, index) => {
                const cell = document.createElement('div');
                cell.className = 'room-cell aspect-square flex flex-col items-center justify-center bg-white border-2 border-gray-200 rounded-lg text-4xl shadow-sm transition-all';
                if (obj) {
                    cell.innerHTML = `<div>${obj.emoji}</div><div class="text-sm font-semibold mt-1">${obj.name}</div>`;
                }
                gridContainer.appendChild(cell);
            });
            
            gameArea.appendChild(gridContainer);
            
            // Pace Control & Countdown Box
            const paceBox = document.createElement('div');
            paceBox.className = 'pace-control-box mt-4 p-3 bg-white rounded-xl shadow-sm border border-amber-200 max-w-sm mx-auto text-center';
            paceBox.innerHTML = `
                <div class="text-sm font-bold text-amber-900 mb-1">⏱️ Memorization Time Before Questions:</div>
                <div class="flex items-center justify-center gap-3 my-1">
                    <button type="button" id="btn-pace-dec" class="btn" style="width: 36px; height: 36px; border-radius: 50%; font-size: 1.3rem; line-height: 1; padding: 0; background: #FFF7ED; border: 2px solid #D97706; color: #B45309;">−</button>
                    <span id="pace-val" class="font-extrabold text-lg text-amber-800" style="min-width: 80px;">${userMemorizeTime}s</span>
                    <button type="button" id="btn-pace-inc" class="btn" style="width: 36px; height: 36px; border-radius: 50%; font-size: 1.3rem; line-height: 1; padding: 0; background: #FFF7ED; border: 2px solid #D97706; color: #B45309;">+</button>
                </div>
                <div id="status-countdown" class="text-base font-bold text-teal-800 mt-1">
                    Memorize carefully! Questions start in: <span id="countdown-num" style="font-size: 1.25rem; color: #9B2C2C;">${userMemorizeTime}</span>s
                </div>
            `;
            gameArea.appendChild(paceBox);

            let remainingTime = userMemorizeTime;
            const paceValEl = paceBox.querySelector('#pace-val');
            const countdownNumEl = paceBox.querySelector('#countdown-num');

            paceBox.querySelector('#btn-pace-dec').addEventListener('click', () => {
                if (userMemorizeTime > 4) {
                    userMemorizeTime -= 2;
                    remainingTime = Math.min(remainingTime, userMemorizeTime);
                    paceValEl.textContent = `${userMemorizeTime}s`;
                    countdownNumEl.textContent = remainingTime;
                }
            });

            paceBox.querySelector('#btn-pace-inc').addEventListener('click', () => {
                if (userMemorizeTime < 30) {
                    userMemorizeTime += 2;
                    remainingTime += 2;
                    paceValEl.textContent = `${userMemorizeTime}s`;
                    countdownNumEl.textContent = remainingTime;
                }
            });
            
            if (TTS.isSupported()) {
                const ttsBtn = TTS.createButton(`Memorize the objects in the room.`);
                ttsBtn.classList.add('mt-2', 'mx-auto', 'block');
                gameArea.appendChild(ttsBtn);
            }

            timer = setInterval(() => {
                remainingTime--;
                if (remainingTime > 0) {
                    if (countdownNumEl) countdownNumEl.textContent = remainingTime;
                } else {
                    clearInterval(timer);
                    hideAndAsk(selectedObjects, cells, gridContainer, gameArea, roundIndicator);
                }
            }, 1000);
        }
        
        function hideAndAsk(selectedObjects, cells, gridContainer, gameArea, roundIndicator) {
            gridContainer.innerHTML = '';
            cells.forEach((obj, index) => {
                const cell = document.createElement('div');
                cell.className = 'room-cell aspect-square flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-lg text-4xl shadow-sm cursor-pointer hover:bg-gray-200';
                cell.textContent = '?';
                cell.dataset.index = index;
                gridContainer.appendChild(cell);
            });
            
            gameArea.innerHTML = '';
            gameArea.appendChild(roundIndicator);
            gameArea.appendChild(gridContainer);
            
            const questionBox = document.createElement('div');
            questionBox.className = 'question-box mt-6 text-center';
            
            const questionType = Math.random() > 0.5 ? 'location' : 'presence';
            const targetObject = selectedObjects[Math.floor(Math.random() * selectedObjects.length)];
            
            const questionText = document.createElement('h3');
            questionText.className = 'question-text text-xl font-bold mb-4';
            
            if (questionType === 'location') {
                questionText.textContent = `Where was the ${targetObject.name} ${targetObject.emoji}? (Tap the grid)`;
                questionBox.appendChild(questionText);
                
                if (TTS.isSupported()) {
                    const ttsBtn = TTS.createButton(`Where was the ${targetObject.name}? Tap the grid.`);
                    ttsBtn.classList.add('mb-4', 'mx-auto', 'block');
                    questionBox.appendChild(ttsBtn);
                }
                
                gameArea.appendChild(questionBox);
                
                gridContainer.querySelectorAll('.room-cell').forEach(cell => {
                    cell.addEventListener('click', function handler(e) {
                        gridContainer.querySelectorAll('.room-cell').forEach(c => {
                            c.style.pointerEvents = 'none';
                            const idx = parseInt(c.dataset.index);
                            if (cells[idx]) {
                                c.innerHTML = `<div>${cells[idx].emoji}</div>`;
                            }
                        });
                        
                        const clickedIndex = parseInt(this.dataset.index);
                        const targetIndex = cells.indexOf(targetObject);
                        
                        if (clickedIndex === targetIndex) {
                            this.classList.add('bg-green-100', 'border-green-500');
                            controller.addScore(15);
                            controller.recordCorrect();
                            showFeedback(true, gameArea, startRound);
                        } else {
                            this.classList.add('bg-red-100', 'border-red-500');
                            gridContainer.children[targetIndex].classList.add('bg-green-100', 'border-green-500');
                            controller.recordWrong();
                            showFeedback(false, gameArea, startRound, `The ${targetObject.name} was there.`);
                        }
                    });
                });
            } else {
                questionText.textContent = `Which object was in the room?`;
                questionBox.appendChild(questionText);
                
                if (TTS.isSupported()) {
                    const ttsBtn = TTS.createButton(`Which object was in the room?`);
                    ttsBtn.classList.add('mb-4', 'mx-auto', 'block');
                    questionBox.appendChild(ttsBtn);
                }
                
                const optionsList = document.createElement('div');
                optionsList.className = 'options-list grid grid-cols-2 gap-4 max-w-sm mx-auto';
                
                const unselectedPool = objectPool.filter(obj => !selectedObjects.includes(obj));
                const wrongOptions = [...unselectedPool].sort(() => Math.random() - 0.5).slice(0, 3);
                
                const allOptions = [targetObject, ...wrongOptions].sort(() => Math.random() - 0.5);
                
                allOptions.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn btn bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 flex flex-col items-center p-3 rounded-lg text-lg';
                    btn.innerHTML = `<span class="text-3xl mb-1">${opt.emoji}</span><span>${opt.name}</span>`;
                    
                    btn.addEventListener('click', function handler() {
                        optionsList.querySelectorAll('.option-btn').forEach(b => b.style.pointerEvents = 'none');
                        
                        if (opt === targetObject) {
                            btn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
                            controller.addScore(15);
                            controller.recordCorrect();
                            showFeedback(true, gameArea, startRound);
                        } else {
                            btn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
                            controller.recordWrong();
                            showFeedback(false, gameArea, startRound, `The ${targetObject.name} was in the room.`);
                        }
                    });
                    
                    optionsList.appendChild(btn);
                });
                
                questionBox.appendChild(optionsList);
                gameArea.appendChild(questionBox);
                
                gridContainer.style.pointerEvents = 'none';
            }
        }
        
        function showFeedback(isCorrect, gameArea, nextCallback, message = '') {
            const feedback = document.createElement('div');
            feedback.className = `text-center mt-6 text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`;
            feedback.textContent = isCorrect ? 'Correct! Well done.' : `Not quite. ${message}`;
            gameArea.appendChild(feedback);
            
            if (TTS.isSupported()) {
                 TTS.speak(isCorrect ? 'Correct!' : `Not quite. ${message}`);
            }
            
            timer = setTimeout(nextCallback, 2500);
        }

        startRound();
    }

    function cleanup() {
        if (timer) {
            clearInterval(timer);
            clearTimeout(timer);
        }
    }

    return shell;
}
