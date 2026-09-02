import GameShell from '../gameShell.js';
import I18n from '../i18n.js';

export default function FamiliarFaces(container) {
    const faceData = [
        { emoji: '👵', name: 'Grandmother', relation: 'Family', hints: ['She is a family member', 'Starts with G', 'Grandmother'], options: ['Daughter', 'Grandmother', 'Teacher', 'Neighbor'] },
        { emoji: '👨⚕️', name: 'Doctor', relation: 'Healthcare', hints: ['Works in healthcare', 'Starts with D', 'Doctor'], options: ['Doctor', 'Teacher', 'Friend', 'Son'] },
        { emoji: '👧', name: 'Daughter', relation: 'Family', hints: ['She is a family member', 'Starts with D', 'Daughter'], options: ['Mother', 'Daughter', 'Friend', 'Nurse'] },
        { emoji: '👴', name: 'Grandfather', relation: 'Family', hints: ['He is a family member', 'Starts with G', 'Grandfather'], options: ['Father', 'Uncle', 'Grandfather', 'Neighbor'] },
        { emoji: '👨🏫', name: 'Teacher', relation: 'Community', hints: ['Works in education', 'Starts with T', 'Teacher'], options: ['Doctor', 'Father', 'Teacher', 'Son'] },
        { emoji: '👩⚕️', name: 'Nurse', relation: 'Healthcare', hints: ['Works in healthcare', 'Starts with N', 'Nurse'], options: ['Nurse', 'Mother', 'Daughter', 'Teacher'] },
        { emoji: '👦', name: 'Son', relation: 'Family', hints: ['He is a family member', 'Starts with S', 'Son'], options: ['Father', 'Son', 'Doctor', 'Teacher'] },
        { emoji: '👮', name: 'Police', relation: 'Community', hints: ['Works in security', 'Starts with P', 'Police'], options: ['Police', 'Teacher', 'Doctor', 'Neighbor'] },
        { emoji: '👩', name: 'Mother', relation: 'Family', hints: ['She is a family member', 'Starts with M', 'Mother'], options: ['Aunt', 'Sister', 'Mother', 'Friend'] },
        { emoji: '👨', name: 'Father', relation: 'Family', hints: ['He is a family member', 'Starts with F', 'Father'], options: ['Uncle', 'Brother', 'Father', 'Grandfather'] }
    ];

    let currentFaceIndex = 0;
    let activeFaces = [];
    let currentHintsUsed = 0;

    const config = {
        gameId: 'familiar-faces',
        titleKey: 'g3Title',
        instructionKey: 'g3Instruction',
        icon: '👨👩👧',
        hasDifficulty: true,
        parTime: 90,
        onStart: (difficulty, gameArea, controller) => {
            startGame(difficulty, gameArea, controller);
        }
    };

    const shell = GameShell.create(container, config);

    function startGame(difficulty, gameArea, controller) {
        let numFaces = 4;
        if (difficulty === 'easy') {
            numFaces = 4;
        } else if (difficulty === 'medium') {
            numFaces = 6;
        } else {
            numFaces = 8;
        }

        activeFaces = [...faceData].sort(() => Math.random() - 0.5).slice(0, numFaces);
        currentFaceIndex = 0;

        showFace(gameArea, controller);
    }

    function showFace(gameArea, controller) {
        if (currentFaceIndex >= activeFaces.length) {
            controller.endGame();
            return;
        }

        currentHintsUsed = 0;
        const face = activeFaces[currentFaceIndex];
        const shuffledOptions = [...face.options].sort(() => Math.random() - 0.5);

        gameArea.innerHTML = `
            <div class="card question-box" style="text-align: center; max-width: 600px; margin: 0 auto; padding: 2rem;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${face.emoji}</div>
                <h3 class="question-text" style="margin-bottom: 1rem; font-size: 1.5rem;">Who is this?</h3>
                
                <div id="hint-display" style="min-height: 2rem; margin-bottom: 1rem; color: #D4AF37; font-weight: bold;"></div>
                
                <button class="btn btn-secondary hint-btn" style="margin-bottom: 1.5rem;">Need a hint?</button>
                
                <div class="options-list" style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;">
                    ${shuffledOptions.map(opt => `<button class="btn option-btn" data-answer="${opt}">${opt}</button>`).join('')}
                </div>
            </div>
        `;

        const hintBtn = gameArea.querySelector('.hint-btn');
        const hintDisplay = gameArea.querySelector('#hint-display');
        const optionsList = gameArea.querySelector('.options-list');
        const buttons = optionsList.querySelectorAll('.option-btn');
        let answered = false;

        hintBtn.addEventListener('click', () => {
            if (currentHintsUsed < 3) {
                hintDisplay.textContent = face.hints[currentHintsUsed];
                currentHintsUsed++;
                controller.recordHint();
                if (currentHintsUsed === 3) {
                    hintBtn.style.display = 'none';
                }
            }
        });

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                
                const selected = btn.dataset.answer;
                if (selected === face.name) {
                    btn.classList.add('correct');
                    btn.style.backgroundColor = '#0D9488';
                    btn.style.color = 'white';
                    
                    let score = 15;
                    if (currentHintsUsed === 1) score = 12;
                    else if (currentHintsUsed === 2) score = 8;
                    else if (currentHintsUsed === 3) score = 5;
                    
                    controller.addScore(score);
                    controller.recordCorrect();
                } else {
                    btn.classList.add('wrong');
                    btn.style.backgroundColor = '#9B2C2C';
                    btn.style.color = 'white';
                    buttons.forEach(b => {
                        if (b.dataset.answer === face.name) {
                            b.style.backgroundColor = '#0D9488';
                            b.style.color = 'white';
                        }
                    });
                    controller.recordWrong();
                }

                setTimeout(() => {
                    currentFaceIndex++;
                    showFace(gameArea, controller);
                }, 1500);
            });
        });
    }

    return {
        cleanup() {
            if (shell.cleanup) shell.cleanup();
        }
    };
}
