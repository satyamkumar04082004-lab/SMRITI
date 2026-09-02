import GameShell from '../gameShell.js';
import TTS from '../tts.js';

const SENTENCES = {
    easy: [
        { sentence: 'Grandmother made tea with ginger.', question: 'What did grandmother make?', options: ['Coffee', 'Tea', 'Juice', 'Soup'], correct: 1 },
        { sentence: 'The boy went to school by bus.', question: 'How did the boy go to school?', options: ['Walking', 'By bus', 'By car', 'By bicycle'], correct: 1 },
        { sentence: 'Father bought three red apples.', question: 'How many apples did father buy?', options: ['Two', 'Three', 'Four', 'Five'], correct: 1 },
        { sentence: 'The dog barked at the stranger.', question: 'Who did the dog bark at?', options: ['The cat', 'The mailman', 'The stranger', 'The owner'], correct: 2 }
    ],
    medium: [
        { sentence: 'Rina visited the temple with her mother on Tuesday.', question: 'When did Rina visit the temple?', options: ['Monday', 'Tuesday', 'Wednesday', 'Sunday'], correct: 1 },
        { sentence: 'The family celebrated Bihu with rice cakes and dancing.', question: 'What festival was celebrated?', options: ['Diwali', 'Bihu', 'Holi', 'Pongal'], correct: 1 },
        { sentence: 'A farmer found a pot of gold while ploughing his field.', question: 'What did the farmer find?', options: ['A silver coin', 'A pot of gold', 'A treasure map', 'A rusty sword'], correct: 1 },
        { sentence: 'The children flew kites in the clear blue sky.', question: 'What did the children do?', options: ['Played cricket', 'Flew kites', 'Swam in the river', 'Climbed trees'], correct: 1 }
    ],
    hard: [
        { sentence: 'The old man sat under the banyan tree reading a newspaper while his grandson played with a wooden top.', question: 'What was the grandson playing with?', options: ['A ball', 'A kite', 'A wooden top', 'A doll'], correct: 2 },
        { sentence: 'Sunita baked a chocolate cake and decorated it with strawberries for her brother\'s birthday.', question: 'What did Sunita decorate the cake with?', options: ['Cherries', 'Strawberries', 'Candles', 'Sprinkles'], correct: 1 },
        { sentence: 'The village market is held every Saturday morning near the riverbank.', question: 'When is the village market held?', options: ['Sunday evening', 'Friday morning', 'Saturday morning', 'Monday afternoon'], correct: 2 },
        { sentence: 'A flock of white birds flew over the green paddy fields just before sunset.', question: 'What color were the birds?', options: ['Black', 'White', 'Brown', 'Grey'], correct: 1 },
        { sentence: 'The carpenter made a sturdy chair using teak wood and polished it until it shone.', question: 'What kind of wood did the carpenter use?', options: ['Pine', 'Oak', 'Teak', 'Bamboo'], correct: 2 }
    ]
};

export default function ListenRemember(container) {
    let currentQuestions = [];
    let currentIndex = 0;
    
    // Config
    const config = {
        gameId: 'listen-remember',
        titleKey: 'g6Title',
        instructionKey: 'g6Instruction',
        icon: '👂',
        hasDifficulty: true,
        parTime: 120,
        onStart: startGame
    };

    const controller = GameShell.create(container, config);

    function startGame(difficulty, gameArea, shellController) {
        // Determine number of questions based on difficulty
        let questionCount = 3;
        let pool = SENTENCES.easy;
        
        if (difficulty === 'medium') {
            questionCount = 4;
            pool = [...SENTENCES.easy, ...SENTENCES.medium];
        } else if (difficulty === 'hard') {
            questionCount = 5;
            pool = [...SENTENCES.medium, ...SENTENCES.hard];
        }
        
        // Shuffle and pick
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        currentQuestions = shuffled.slice(0, questionCount);
        currentIndex = 0;
        
        playCurrentTurn(gameArea, shellController);
    }

    function playCurrentTurn(gameArea, shellController) {
        if (currentIndex >= currentQuestions.length) {
            shellController.endGame();
            return;
        }

        const data = currentQuestions[currentIndex];
        
        gameArea.innerHTML = '';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'question-box';
        
        const messageEl = document.createElement('h3');
        messageEl.className = 'status-msg';
        messageEl.textContent = '🔊 Listen carefully...';
        
        const textFallback = document.createElement('p');
        textFallback.className = 'sentence-text';
        textFallback.style.display = 'none';
        textFallback.textContent = data.sentence;

        const actionArea = document.createElement('div');
        actionArea.className = 'action-area';
        
        wrapper.appendChild(messageEl);
        wrapper.appendChild(textFallback);
        wrapper.appendChild(actionArea);
        gameArea.appendChild(wrapper);

        let ttsSupported = TTS.isSupported();
        
        if (ttsSupported) {
            const playBtn = TTS.createButton(data.sentence, '🔊 Play Again');
            playBtn.className = 'btn tts-btn';
            actionArea.appendChild(playBtn);
            
            // Auto play
            setTimeout(() => {
                TTS.speak(data.sentence);
            }, 500);
        } else {
            textFallback.style.display = 'block';
        }

        // Show question after a short delay (or immediately if user reads)
        setTimeout(() => {
            showQuestion(wrapper, data, gameArea, shellController);
        }, 1500);
    }

    function showQuestion(wrapper, data, gameArea, shellController) {
        const qContainer = document.createElement('div');
        qContainer.className = 'question-container';
        qContainer.style.marginTop = '20px';
        
        const qText = document.createElement('h4');
        qText.className = 'question-text';
        qText.textContent = data.question;
        
        const optionsList = document.createElement('div');
        optionsList.className = 'options-list';
        
        let answered = false;

        data.options.forEach((optText, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn option-btn';
            btn.textContent = optText;
            
            btn.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                
                const isCorrect = (idx === data.correct);
                
                if (isCorrect) {
                    btn.classList.add('correct');
                    shellController.addScore(20);
                    shellController.recordCorrect();
                } else {
                    btn.classList.add('wrong');
                    // highlight correct
                    optionsList.children[data.correct].classList.add('correct');
                    shellController.recordWrong();
                }
                
                setTimeout(() => {
                    currentIndex++;
                    playCurrentTurn(gameArea, shellController);
                }, 1500);
            });
            
            optionsList.appendChild(btn);
        });
        
        qContainer.appendChild(qText);
        qContainer.appendChild(optionsList);
        wrapper.appendChild(qContainer);
    }

    return controller;
}
