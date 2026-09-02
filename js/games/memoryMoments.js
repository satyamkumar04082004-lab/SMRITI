import GameShell from '../gameShell.js';
import I18n from '../i18n.js';

export default function MemoryMoments(container) {
    const storyData = [
        { sequence: ['👴', '🚌', '🌳', '🍦'], questions: [{ text: 'What came after the bus?', options: ['Park/Tree', 'Ice Cream', 'Grandpa', 'Sun'], correct: 'Park/Tree' }, { text: 'Who went on the trip?', options: ['Grandpa', 'Grandma', 'Child', 'Teacher'], correct: 'Grandpa' }] },
        { sequence: ['👩', '🍳', '🍚', '👨👩👧'], questions: [{ text: 'What was being cooked?', options: ['Rice', 'Bread', 'Soup', 'Meat'], correct: 'Rice' }, { text: 'Who was cooking?', options: ['Mother', 'Father', 'Chef', 'Child'], correct: 'Mother' }] },
        { sequence: ['☀️', '🌾', '🍵', '🌙'], questions: [{ text: 'What was the first thing shown?', options: ['Sun', 'Tea', 'Moon', 'Wheat'], correct: 'Sun' }, { text: 'What came before the moon?', options: ['Tea', 'Wheat', 'Sun', 'Star'], correct: 'Tea' }] },
        { sequence: ['👦', '🚲', '⚽', '💦', '🛏️'], questions: [{ text: 'What did the boy ride?', options: ['Bicycle', 'Car', 'Bus', 'Train'], correct: 'Bicycle' }, { text: 'What sport was played?', options: ['Football', 'Cricket', 'Tennis', 'Basketball'], correct: 'Football' }] },
        { sequence: ['👩', '🛒', '🍎', '💰', '🏠'], questions: [{ text: 'What fruit was bought?', options: ['Apple', 'Banana', 'Orange', 'Grapes'], correct: 'Apple' }, { text: 'Where did she go last?', options: ['Home', 'Shop', 'Bank', 'Park'], correct: 'Home' }] }
    ];

    let currentStoryIndex = 0;
    let currentQuestionIndex = 0;
    let activeStories = [];
    let numImages = 3;
    let numQuestions = 1;

    const config = {
        gameId: 'memory-moments',
        titleKey: 'g2Title',
        instructionKey: 'g2Instruction',
        icon: '📖',
        hasDifficulty: true,
        parTime: 120,
        onStart: (difficulty, gameArea, controller) => {
            startGame(difficulty, gameArea, controller);
        }
    };

    const shell = GameShell.create(container, config);

    function startGame(difficulty, gameArea, controller) {
        let numStories = 2;
        if (difficulty === 'easy') {
            numImages = 3;
            numQuestions = 1;
            numStories = 2;
        } else if (difficulty === 'medium') {
            numImages = 4;
            numQuestions = 2;
            numStories = 2;
        } else {
            numImages = 5;
            numQuestions = 2;
            numStories = 3;
        }

        activeStories = [...storyData].sort(() => Math.random() - 0.5).slice(0, numStories);
        currentStoryIndex = 0;
        currentQuestionIndex = 0;

        showNextStory(gameArea, controller);
    }

    function showNextStory(gameArea, controller) {
        if (currentStoryIndex >= activeStories.length) {
            controller.endGame();
            return;
        }

        const story = activeStories[currentStoryIndex];
        const sequence = story.sequence.slice(0, numImages);

        gameArea.innerHTML = `
            <div class="story-display" style="text-align: center; margin-bottom: 2rem;">
                <h3>Memorize this sequence!</h3>
                <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                    ${sequence.map(emoji => `<div class="story-card card" style="font-size: 3rem; padding: 1rem;">${emoji}</div>`).join('')}
                </div>
            </div>
            <div class="countdown" style="text-align: center; font-size: 1.5rem; color: #9B2C2C; font-weight: bold;"></div>
        `;

        let timeLeft = 5;
        const countdownEl = gameArea.querySelector('.countdown');
        countdownEl.textContent = `Time left: ${timeLeft}s`;

        const timer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                countdownEl.textContent = `Time left: ${timeLeft}s`;
            } else {
                clearInterval(timer);
                showQuestion(gameArea, controller);
            }
        }, 1000);
    }

    function showQuestion(gameArea, controller) {
        const story = activeStories[currentStoryIndex];
        const questions = story.questions.slice(0, numQuestions);
        
        if (currentQuestionIndex >= questions.length) {
            currentStoryIndex++;
            currentQuestionIndex = 0;
            showNextStory(gameArea, controller);
            return;
        }

        const question = questions[currentQuestionIndex];
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

        gameArea.innerHTML = `
            <div class="question-box card" style="text-align: center; max-width: 600px; margin: 0 auto;">
                <h3 class="question-text" style="margin-bottom: 1.5rem; font-size: 1.5rem;">${question.text}</h3>
                <div class="options-list" style="display: grid; gap: 1rem;">
                    ${shuffledOptions.map(opt => `<button class="btn option-btn" data-answer="${opt}">${opt}</button>`).join('')}
                </div>
            </div>
        `;

        const optionsList = gameArea.querySelector('.options-list');
        const buttons = optionsList.querySelectorAll('.option-btn');
        let answered = false;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                
                const selected = btn.dataset.answer;
                if (selected === question.correct) {
                    btn.classList.add('correct');
                    btn.style.backgroundColor = '#0D9488';
                    btn.style.color = 'white';
                    controller.addScore(20);
                    controller.recordCorrect();
                } else {
                    btn.classList.add('wrong');
                    btn.style.backgroundColor = '#9B2C2C';
                    btn.style.color = 'white';
                    buttons.forEach(b => {
                        if (b.dataset.answer === question.correct) {
                            b.style.backgroundColor = '#0D9488';
                            b.style.color = 'white';
                        }
                    });
                    controller.recordWrong();
                }

                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion(gameArea, controller);
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
