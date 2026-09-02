import GameShell from '../gameShell.js';
import I18n from '../i18n.js';
import TTS from '../tts.js';
import Storage from '../storage.js';

export default function MyDay(container) {
    const config = {
        gameId: 'my-day',
        titleKey: 'g5Title',
        instructionKey: 'g5Instruction',
        icon: '☀️',
        hasDifficulty: true,
        parTime: 90,
        onStart: startGame,
        onCleanup: cleanup
    };

    let currentController;
    let timer;

    const defaultRoutines = {
        easy: ['☀️ Wake up', '🪥 Brush teeth', '🍳 Eat breakfast', '🚶 Go for a walk'],
        medium: ['☀️ Wake up', '🪥 Brush teeth', '🍳 Eat breakfast', '🍵 Drink tea', '🚶 Go for a walk'],
        hard: ['☀️ Wake up', '🪥 Brush teeth', '🚿 Take a bath', '🍳 Eat breakfast', '🍵 Drink tea', '💊 Take medicine', '🚶 Go for a walk']
    };

    const shell = GameShell.create(container, config);

    function startGame(difficulty, gameArea, controller) {
        currentController = controller;
        
        let routine = [];
        if (Storage.getRoutines && typeof Storage.getRoutines === 'function') {
            const userRoutines = Storage.getRoutines();
            if (userRoutines && userRoutines[difficulty] && userRoutines[difficulty].length > 0) {
                routine = userRoutines[difficulty];
            }
        }
        
        if (routine.length === 0) {
            routine = defaultRoutines[difficulty] || defaultRoutines.easy;
        }

        showCorrectOrder(routine, gameArea, controller);
    }
    
    function showCorrectOrder(routine, gameArea, controller) {
        gameArea.innerHTML = '';
        
        const heading = document.createElement('h3');
        heading.className = 'text-2xl font-bold text-center mb-6 text-maroon';
        heading.textContent = 'Review your routine';
        gameArea.appendChild(heading);
        
        const listContainer = document.createElement('div');
        listContainer.className = 'max-w-md mx-auto space-y-3';
        
        routine.forEach((step, index) => {
            const item = document.createElement('div');
            item.className = 'p-3 bg-white border-2 border-teal rounded-lg shadow-sm flex items-center text-lg';
            item.innerHTML = `<span class="w-8 h-8 flex items-center justify-center bg-teal text-white rounded-full font-bold mr-4">${index + 1}</span> <span>${step}</span>`;
            listContainer.appendChild(item);
        });
        
        gameArea.appendChild(listContainer);
        
        const notice = document.createElement('p');
        notice.className = 'text-center text-sm text-gray-500 mt-6';
        notice.textContent = 'Memorize the order...';
        gameArea.appendChild(notice);
        
        if (TTS.isSupported()) {
            const textToSpeak = routine.map((step, i) => `Step ${i + 1}, ${step.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')}`).join('. ');
            const ttsBtn = TTS.createButton(textToSpeak, 'Read Routine');
            ttsBtn.classList.add('mt-4', 'mx-auto', 'block');
            gameArea.appendChild(ttsBtn);
        }
        
        timer = setTimeout(() => {
            playSortGame(routine, gameArea, controller);
        }, 4000);
    }
    
    function playSortGame(routine, gameArea, controller) {
        gameArea.innerHTML = '';
        
        const heading = document.createElement('h3');
        heading.className = 'text-xl font-bold text-center mb-4 text-maroon';
        heading.textContent = 'Tap the items in the correct order';
        gameArea.appendChild(heading);
        
        if (TTS.isSupported()) {
            const ttsBtn = TTS.createButton('Tap the items in the correct order from first to last.');
            ttsBtn.classList.add('mb-4', 'mx-auto', 'block');
            gameArea.appendChild(ttsBtn);
        }
        
        const shuffled = [...routine].map((step, index) => ({ step, originalIndex: index })).sort(() => Math.random() - 0.5);
        
        const listContainer = document.createElement('div');
        listContainer.className = 'sortable-list max-w-md mx-auto space-y-3 mb-6';
        
        let selectedOrder = [];
        
        function updateDisplay() {
            listContainer.innerHTML = '';
            shuffled.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'sortable-item tap-to-order p-3 bg-white border-2 border-gray-300 rounded-lg shadow-sm flex items-center justify-between text-lg cursor-pointer hover:bg-gray-50 transition-colors';
                
                const selectedPos = selectedOrder.indexOf(item);
                
                const textSpan = document.createElement('span');
                textSpan.textContent = item.step;
                itemEl.appendChild(textSpan);
                
                if (selectedPos !== -1) {
                    const badge = document.createElement('span');
                    badge.className = 'w-8 h-8 flex items-center justify-center bg-teal text-white rounded-full font-bold';
                    badge.textContent = selectedPos + 1;
                    itemEl.appendChild(badge);
                    itemEl.classList.add('bg-teal', 'bg-opacity-10', 'border-teal');
                } else {
                    const emptyBadge = document.createElement('span');
                    emptyBadge.className = 'w-8 h-8 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full text-transparent';
                    emptyBadge.textContent = '0';
                    itemEl.appendChild(emptyBadge);
                }
                
                itemEl.addEventListener('click', () => {
                    if (selectedPos !== -1) {
                        selectedOrder = selectedOrder.filter(i => i !== item);
                    } else {
                        selectedOrder.push(item);
                    }
                    updateDisplay();
                });
                
                listContainer.appendChild(itemEl);
            });
            
            checkBtn.disabled = selectedOrder.length !== routine.length;
            if (checkBtn.disabled) {
                checkBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                checkBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
        
        const controls = document.createElement('div');
        controls.className = 'flex justify-center gap-4 max-w-md mx-auto';
        
        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn bg-teal text-white flex-1 py-3 font-bold rounded-lg';
        checkBtn.textContent = 'Check My Order';
        checkBtn.disabled = true;
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn bg-gray-200 text-gray-800 px-4 py-3 font-bold rounded-lg';
        resetBtn.innerHTML = '↺ Reset';
        
        resetBtn.addEventListener('click', () => {
            selectedOrder = [];
            updateDisplay();
        });
        
        checkBtn.addEventListener('click', () => {
            let correctCount = 0;
            
            listContainer.innerHTML = '';
            selectedOrder.forEach((item, index) => {
                const isCorrect = item.originalIndex === index;
                if (isCorrect) correctCount++;
                
                const itemEl = document.createElement('div');
                itemEl.className = `p-3 border-2 rounded-lg shadow-sm flex items-center justify-between text-lg ${isCorrect ? 'bg-green-50 border-green-500 correct' : 'bg-red-50 border-red-500 wrong'}`;
                
                const textSpan = document.createElement('span');
                textSpan.textContent = item.step;
                
                const badgeInfo = document.createElement('div');
                badgeInfo.className = 'flex items-center gap-2';
                
                if (!isCorrect) {
                    const expectedBadge = document.createElement('span');
                    expectedBadge.className = 'text-sm text-gray-500';
                    expectedBadge.textContent = `(Should be ${item.originalIndex + 1})`;
                    badgeInfo.appendChild(expectedBadge);
                }
                
                const badge = document.createElement('span');
                badge.className = `w-8 h-8 flex items-center justify-center text-white rounded-full font-bold ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`;
                badge.textContent = index + 1;
                
                badgeInfo.appendChild(badge);
                
                itemEl.appendChild(textSpan);
                itemEl.appendChild(badgeInfo);
                
                listContainer.appendChild(itemEl);
            });
            
            controls.innerHTML = '';
            
            const accuracy = correctCount / routine.length;
            const scoreEarned = Math.round(accuracy * 100);
            controller.addScore(scoreEarned);
            
            if (accuracy === 1) {
                controller.recordCorrect();
                if (TTS.isSupported()) TTS.speak('Perfect! You got everything in the right order.');
            } else if (accuracy >= 0.5) {
                controller.recordCorrect();
                if (TTS.isSupported()) TTS.speak('Good job! Most of them are in the right order.');
            } else {
                controller.recordWrong();
                if (TTS.isSupported()) TTS.speak('Not quite right. Keep practicing.');
            }
            
            const feedback = document.createElement('div');
            feedback.className = 'text-center mt-6 text-xl font-bold mb-4';
            feedback.textContent = `You got ${correctCount} out of ${routine.length} right!`;
            gameArea.appendChild(feedback);
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn bg-teal text-white w-full max-w-md mx-auto block py-3 font-bold rounded-lg mt-4';
            nextBtn.textContent = 'Finish Game';
            nextBtn.addEventListener('click', () => {
                controller.endGame({ accuracy: Math.round(accuracy * 100) });
            });
            gameArea.appendChild(nextBtn);
        });
        
        controls.appendChild(resetBtn);
        controls.appendChild(checkBtn);
        
        gameArea.appendChild(listContainer);
        gameArea.appendChild(controls);
        
        const safetyNotice = document.createElement('div');
        safetyNotice.className = 'safety-notice mt-8 text-center text-sm text-gray-500 italic';
        safetyNotice.textContent = 'This is a practice activity, not medical advice.';
        gameArea.appendChild(safetyNotice);
        
        updateDisplay();
    }

    function cleanup() {
        if (timer) clearTimeout(timer);
    }

    return shell;
}
