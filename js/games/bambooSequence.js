import GameShell from '../gameShell.js';

export default function BambooSequence(container) {
    const PADS = ['🎋', '🌺', '💧', '☀️'];
    
    // Config
    const config = {
        gameId: 'bamboo-sequence',
        titleKey: 'g7Title',
        instructionKey: 'g7Instruction',
        icon: '🎋',
        hasDifficulty: true,
        parTime: 120,
        onStart: startGame
    };

    const controller = GameShell.create(container, config);

    function startGame(difficulty, gameArea, shellController) {
        let sequence = [];
        let playerSequence = [];
        let isPlayback = false;
        let startLength = difficulty === 'easy' ? 2 : (difficulty === 'medium' ? 3 : 4);
        let currentLength = startLength;
        
        let highestLevel = 0;
        let failsOnCurrent = 0;
        let totalAttempts = 0;
        let successfulLevels = 0;
        let consecutiveFailsAtMin = 0;

        gameArea.innerHTML = '';
        
        const statusMsg = document.createElement('h3');
        statusMsg.className = 'status-msg';
        gameArea.appendChild(statusMsg);

        const grid = document.createElement('div');
        grid.className = 'sequence-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = '1fr 1fr';
        grid.style.gap = '15px';
        grid.style.maxWidth = '300px';
        grid.style.margin = '20px auto';
        
        const padElements = [];
        
        for (let i = 0; i < 4; i++) {
            const pad = document.createElement('div');
            pad.className = `sequence-pad pad-${i}`;
            pad.textContent = PADS[i];
            pad.style.fontSize = '3rem';
            pad.style.padding = '30px';
            pad.style.borderRadius = '15px';
            pad.style.background = '#FDF8F3'; // cream
            pad.style.border = '2px solid #ccc';
            pad.style.textAlign = 'center';
            pad.style.cursor = 'pointer';
            pad.style.transition = 'all 0.3s';
            
            pad.addEventListener('click', () => handlePadClick(i));
            
            grid.appendChild(pad);
            padElements.push(pad);
        }
        
        gameArea.appendChild(grid);
        
        generateSequence(currentLength);
        playSequence();

        function generateSequence(length) {
            sequence = [];
            for (let i = 0; i < length; i++) {
                sequence.push(Math.floor(Math.random() * 4));
            }
        }

        async function playSequence() {
            isPlayback = true;
            playerSequence = [];
            statusMsg.textContent = failsOnCurrent > 0 ? 'Watch carefully... (Retry)' : 'Watch carefully...';
            statusMsg.style.color = '#333';
            
            grid.style.opacity = '1';
            
            await new Promise(r => setTimeout(r, 800));
            
            for (let i = 0; i < sequence.length; i++) {
                const padIdx = sequence[i];
                const pad = padElements[padIdx];
                
                pad.classList.add('lit');
                pad.style.transform = 'scale(1.05)';
                pad.style.background = '#D4AF37'; // gold highlight
                
                await new Promise(r => setTimeout(r, 600));
                
                pad.classList.remove('lit');
                pad.style.transform = 'scale(1)';
                pad.style.background = '#FDF8F3';
                
                await new Promise(r => setTimeout(r, 400));
            }
            
            isPlayback = false;
            statusMsg.textContent = 'Your turn!';
            statusMsg.style.color = '#0D9488'; // teal
            
            // Show subtle hint for next pad if failed before
            if (failsOnCurrent > 0) {
                const nextPadIdx = sequence[0];
                padElements[nextPadIdx].style.boxShadow = '0 0 10px 3px #0D9488';
                setTimeout(() => {
                    padElements[nextPadIdx].style.boxShadow = 'none';
                }, 1000);
            }
        }

        function handlePadClick(idx) {
            if (isPlayback) return;
            
            const expectedIdx = sequence[playerSequence.length];
            
            const pad = padElements[idx];
            pad.style.transform = 'scale(0.95)';
            setTimeout(() => pad.style.transform = 'scale(1)', 150);
            
            if (idx === expectedIdx) {
                // Correct tap
                playerSequence.push(idx);
                pad.style.background = '#bbf7d0'; // subtle green
                setTimeout(() => pad.style.background = '#FDF8F3', 200);
                
                if (playerSequence.length === sequence.length) {
                    levelComplete();
                }
            } else {
                // Wrong tap
                levelFailed();
            }
        }

        function levelComplete() {
            isPlayback = true;
            statusMsg.textContent = 'Great job!';
            statusMsg.style.color = '#15803d';
            
            shellController.addScore(8);
            shellController.recordCorrect();
            
            totalAttempts++;
            successfulLevels++;
            failsOnCurrent = 0;
            consecutiveFailsAtMin = 0;
            
            const levelAchieved = sequence.length - startLength + 1;
            if (levelAchieved > highestLevel) {
                highestLevel = levelAchieved;
            }
            
            if (highestLevel >= 10) {
                setTimeout(endGameData, 1000);
                return;
            }
            
            currentLength++;
            
            setTimeout(() => {
                statusMsg.textContent = `Level ${highestLevel + 1}`;
                generateSequence(currentLength);
                playSequence();
            }, 1000);
        }

        function levelFailed() {
            isPlayback = true;
            statusMsg.textContent = 'Almost! Let\'s try again.';
            statusMsg.style.color = '#9B2C2C'; // maroon
            
            shellController.recordWrong();
            totalAttempts++;
            failsOnCurrent++;
            
            if (currentLength === startLength) {
                consecutiveFailsAtMin++;
            } else {
                consecutiveFailsAtMin = 0;
            }
            
            if (consecutiveFailsAtMin >= 3) {
                setTimeout(endGameData, 1000);
                return;
            }
            
            if (failsOnCurrent >= 2 && currentLength > startLength) {
                currentLength--;
                failsOnCurrent = 0;
                setTimeout(() => {
                    statusMsg.textContent = 'Let\'s try an easier sequence.';
                    generateSequence(currentLength);
                    playSequence();
                }, 1500);
            } else {
                setTimeout(playSequence, 1500);
            }
        }

        function endGameData() {
            let acc = totalAttempts > 0 ? Math.round((successfulLevels / totalAttempts) * 100) : 0;
            let finalScore = highestLevel * 8;
            shellController.endGame({
                score: finalScore,
                accuracy: acc
            });
        }
    }

    return controller;
}
