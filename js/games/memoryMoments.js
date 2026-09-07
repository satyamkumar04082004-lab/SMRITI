/* ============================================================
   SMRITI — Game 2: Memory Moments
   Visual story recall with dynamic multilingual question generation
   ============================================================ */

import GameShell from '../gameShell.js';
import I18n from '../i18n.js';
import TTS from '../tts.js';

export default function MemoryMoments(container) {
    const storyDict = {
        en: [
            { sequence: ['👴', '🚌', '🌳', '🍦'], questions: [{ text: 'What came after the bus?', options: ['Park/Tree 🌳', 'Ice Cream 🍦', 'Grandpa 👴', 'Sun ☀️'], correct: 'Park/Tree 🌳' }, { text: 'Who went on the trip?', options: ['Grandpa 👴', 'Grandma 👵', 'Child 👦', 'Teacher 👨‍🏫'], correct: 'Grandpa 👴' }] },
            { sequence: ['👩', '🍳', '🍚', '👨‍👩‍👧'], questions: [{ text: 'What was being cooked?', options: ['Rice 🍚', 'Bread 🍞', 'Soup 🥣', 'Tea 🍵'], correct: 'Rice 🍚' }, { text: 'Who was cooking in the kitchen?', options: ['Mother 👩', 'Father 👨', 'Chef 🧑‍🍳', 'Child 👧'], correct: 'Mother 👩' }] },
            { sequence: ['☀️', '🌾', '🍵', '🌙'], questions: [{ text: 'What was the first thing shown?', options: ['Sun ☀️', 'Tea 🍵', 'Moon 🌙', 'Wheat 🌾'], correct: 'Sun ☀️' }, { text: 'What came before the moon?', options: ['Tea 🍵', 'Wheat 🌾', 'Sun ☀️', 'Star ⭐'], correct: 'Tea 🍵' }] },
            { sequence: ['👦', '🚲', '⚽', '💦', '🛏️'], questions: [{ text: 'What did the young boy ride?', options: ['Bicycle 🚲', 'Car 🚗', 'Bus 🚌', 'Train 🚆'], correct: 'Bicycle 🚲' }, { text: 'What sport was played in the afternoon?', options: ['Football ⚽', 'Cricket 🏏', 'Tennis 🎾', 'Badminton 🏸'], correct: 'Football ⚽' }] },
            { sequence: ['👩', '🛒', '🍎', '💰', '🏠'], questions: [{ text: 'What fruit was bought at the market?', options: ['Apple 🍎', 'Banana 🍌', 'Orange 🍊', 'Grapes 🍇'], correct: 'Apple 🍎' }, { text: 'Where did she go at the end?', options: ['Home 🏠', 'Shop 🏪', 'Temple 🛕', 'Park 🌳'], correct: 'Home 🏠' }] }
        ],
        hi: [
            { sequence: ['👴', '🚌', '🌳', '🍦'], questions: [{ text: 'बस के बाद क्या आया था?', options: ['पेड़/पार्क 🌳', 'आइसक्रीम 🍦', 'दादाजी 👴', 'सूर्य ☀️'], correct: 'पेड़/पार्क 🌳' }, { text: 'सफ़र पर कौन गए थे?', options: ['दादाजी 👴', 'दादीजी 👵', 'बच्चा 👦', 'अध्यापक 👨‍🏫'], correct: 'दादाजी 👴' }] },
            { sequence: ['👩', '🍳', '🍚', '👨‍👩‍👧'], questions: [{ text: 'रसोई में क्या पकाया जा रहा था?', options: ['चावल/भात 🍚', 'रोटी 🍞', 'सूप 🥣', 'चाय 🍵'], correct: 'चावल/भात 🍚' }, { text: 'रसोई में कौन खाना बना रहा था?', options: ['माताजी 👩', 'पिताजी 👨', 'शेफ़ 🧑‍🍳', 'बच्चा 👧'], correct: 'माताजी 👩' }] },
            { sequence: ['☀️', '🌾', '🍵', '🌙'], questions: [{ text: 'सबसे पहले क्या दिखाया गया था?', options: ['सूरज ☀️', 'गरम चाय 🍵', 'चाँद 🌙', 'गेहूँ 🌾'], correct: 'सूरज ☀️' }, { text: 'चाँद से ठीक पहले क्या दिखाया गया?', options: ['गरम चाय 🍵', 'गेहूँ 🌾', 'सूरज ☀️', 'तारे ⭐'], correct: 'गरम चाय 🍵' }] },
            { sequence: ['👦', '🚲', '⚽', '💦', '🛏️'], questions: [{ text: 'लड़के ने क्या चलाया?', options: ['साइकिल 🚲', 'गाड़ी 🚗', 'बस 🚌', 'रेल 🚆'], correct: 'साइकिल 🚲' }, { text: 'शाम को कौन सा खेल खेला गया?', options: ['फ़ुटबॉल ⚽', 'क्रिकेट 🏏', 'टेनिस 🎾', 'बैडमिंटन 🏸'], correct: 'फ़ुटबॉल ⚽' }] },
            { sequence: ['👩', '🛒', '🍎', '💰', '🏠'], questions: [{ text: 'बाज़ार से कौन सा फल खरीदा गया?', options: ['सेब 🍎', 'केला 🍌', 'संतरा 🍊', 'अंगूर 🍇'], correct: 'सेब 🍎' }, { text: 'अंत में वह कहाँ पहुँची?', options: ['घर 🏠', 'दुकान 🏪', 'मंदिर 🛕', 'पार्क 🌳'], correct: 'घर 🏠' }] }
        ],
        as: [
            { sequence: ['👴', '🚌', '🌳', '🍦'], questions: [{ text: 'বাছৰ পিছত কি আহিছিল?', options: ['গছ/উদ্যান 🌳', 'আইচক্ৰীম 🍦', 'ককা 👴', 'সূৰ্য ☀️'], correct: 'গছ/উদ্যান 🌳' }, { text: 'ভ্ৰমণলৈ কোন গৈছিল?', options: ['ককা 👴', 'আইতা 👵', 'ল’ৰা 👦', 'শিক্ষক 👨‍🏫'], correct: 'ককা 👴' }] },
            { sequence: ['👩', '🍳', '🍚', '👨‍👩‍👧'], questions: [{ text: 'কি ৰন্ধা হৈছিল?', options: ['ভাত 🍚', 'ৰুটি 🍞', 'চুপ 🥣', 'চাহ 🍵'], correct: 'ভাত 🍚' }, { text: 'ৰন্ধনশালাত কোনে ৰান্ধিছিল?', options: ['মা 👩', 'দেউতা 👨', 'ৰান্ধনী 🧑‍🍳', 'ছোৱালী 👧'], correct: 'মা 👩' }] },
            { sequence: ['☀️', '🌾', '🍵', '🌙'], questions: [{ text: 'প্ৰথমতে কি দেখুওৱা হৈছিল?', options: ['সূৰ্য ☀️', 'চাহ 🍵', 'জোন 🌙', 'ধান 🌾'], correct: 'সূৰ্য ☀️' }, { text: 'জোনৰ ঠিক আগেয়ে কি আছিল?', options: ['চাহ 🍵', 'ধান 🌾', 'সূৰ্য ☀️', 'তৰা ⭐'], correct: 'চাহ 🍵' }] }
        ]
    };

    function getStoryData() {
        const lang = I18n.lang;
        return storyDict[lang] || storyDict.en;
    }

    let currentStoryIndex = 0;
    let currentQuestionIndex = 0;
    let activeStories = [];
    let numImages = 3;
    let numQuestions = 1;
    let activeTimer = null;

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

        const pool = getStoryData();
        activeStories = [...pool].sort(() => Math.random() - 0.5).slice(0, numStories);
        currentStoryIndex = 0;
        currentQuestionIndex = 0;

        showNextStory(gameArea, controller);
    }

    function showNextStory(gameArea, controller) {
        if (currentStoryIndex >= activeStories.length) {
            controller.endGame();
            return;
        }

        const isHindi = I18n.lang === 'hi';
        const isAssamese = I18n.lang === 'as';

        const story = activeStories[currentStoryIndex];
        const sequence = story.sequence.slice(0, numImages);

        let userSequenceTime = 8;
        let timeLeft = userSequenceTime;

        const headerTitle = isHindi ? 'इस क्रम को ध्यान से याद रखें!' : (isAssamese ? 'এই ক্ৰমটো মনত ৰাখক!' : 'Memorize this sequence!');
        const paceTitle = isHindi ? '⏱️ याद रखने का समय समायोजित करें:' : (isAssamese ? '⏱️ মনত ৰখাৰ সময়:' : '⏱️ Adjust Memorization Time:');
        const countdownLabel = isHindi ? 'प्रश्न शुरू होंगे:' : (isAssamese ? 'প্ৰশ্ন আৰম্ভ হবলৈ বাকী:' : 'Questions start in:');

        gameArea.innerHTML = `
            <div class="story-display" style="text-align: center; margin-bottom: 1.5rem;">
                <h3 style="color: var(--maroon); font-size: 1.5rem;">${headerTitle}</h3>
                <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                    ${sequence.map(emoji => `<div class="story-card card" style="font-size: 3rem; padding: 1rem; border: 2px solid #FCD34D;">${emoji}</div>`).join('')}
                </div>
            </div>
            <div class="pace-control-box" style="margin: 0 auto 1.5rem auto; padding: 0.85rem 1.25rem; background: #FFFDF9; border: 2px solid #FCD34D; border-radius: 16px; max-width: 380px; text-align: center;">
                <div style="font-weight: 700; color: #78350F; font-size: 0.95rem; margin-bottom: 0.35rem;">
                    ${paceTitle}
                </div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                    <button type="button" id="btn-seq-dec" class="btn" style="width: 36px; height: 36px; border-radius: 50%; font-size: 1.3rem; line-height: 1; padding: 0; background: #FFF7ED; border: 2px solid #D97706; color: #B45309;">−</button>
                    <span id="seq-time-val" style="font-size: 1.2rem; font-weight: 800; color: #92400E; min-width: 70px;">${userSequenceTime}s</span>
                    <button type="button" id="btn-seq-inc" class="btn" style="width: 36px; height: 36px; border-radius: 50%; font-size: 1.3rem; line-height: 1; padding: 0; background: #FFF7ED; border: 2px solid #D97706; color: #B45309;">+</button>
                </div>
                <div class="countdown" style="text-align: center; font-size: 1.25rem; color: #9B2C2C; font-weight: bold; margin-top: 0.5rem;">
                    ${countdownLabel} <span id="countdown-num">${timeLeft}</span>s
                </div>
            </div>
        `;

        const countdownNum = gameArea.querySelector('#countdown-num');
        const seqValDisplay = gameArea.querySelector('#seq-time-val');

        gameArea.querySelector('#btn-seq-dec').addEventListener('click', () => {
            if (userSequenceTime > 4) {
                userSequenceTime -= 2;
                timeLeft = Math.min(timeLeft, userSequenceTime);
                seqValDisplay.textContent = `${userSequenceTime}s`;
                countdownNum.textContent = timeLeft;
            }
        });

        gameArea.querySelector('#btn-seq-inc').addEventListener('click', () => {
            if (userSequenceTime < 30) {
                userSequenceTime += 2;
                timeLeft += 2;
                seqValDisplay.textContent = `${userSequenceTime}s`;
                countdownNum.textContent = timeLeft;
            }
        });

        activeTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft > 0) {
                if (countdownNum) countdownNum.textContent = timeLeft;
            } else {
                clearInterval(activeTimer);
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
            <div class="question-box card" style="text-align: center; max-width: 600px; margin: 0 auto; padding: 1.5rem;">
                <h3 class="question-text" style="margin-bottom: 1.5rem; font-size: 1.45rem; color: var(--maroon);">${question.text}</h3>
                <div class="options-list" style="display: grid; gap: 0.85rem;">
                    ${shuffledOptions.map(opt => `<button class="btn option-btn" data-answer="${opt}" style="min-height: 52px; font-size: 1.15rem; font-weight: 700; border-radius: 12px;">${opt}</button>`).join('')}
                </div>
            </div>
        `;

        if (TTS && TTS.isSupported()) {
            TTS.speak(question.text);
        }

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
                    if (TTS && TTS.isSupported()) TTS.speak(I18n.lang === 'hi' ? 'बिल्कुल सही!' : (I18n.lang === 'as' ? 'একেবাৰে সঠিক!' : 'Correct!'));
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
                    if (TTS && TTS.isSupported()) TTS.speak(I18n.lang === 'hi' ? 'प्रयास अच्छा था!' : (I18n.lang === 'as' ? 'চেষ্টা ভাল আছিল!' : 'Good try!'));
                }

                setTimeout(() => {
                    currentQuestionIndex++;
                    showQuestion(gameArea, controller);
                }, 1800);
            });
        });
    }

    return {
        cleanup() {
            if (activeTimer) clearInterval(activeTimer);
            if (shell.cleanup) shell.cleanup();
            TTS.stop();
        }
    };
}
