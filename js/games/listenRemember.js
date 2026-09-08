/* ============================================================
   SMRITI — Game 6: Listen & Remember
   Auditory attention & recall with full reactive multilingual support
   ============================================================ */

import GameShell from '../gameShell.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';

const SENTENCES_BY_LANG = {
    en: {
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
    },
    hi: {
        easy: [
            { sentence: 'दादीजी ने अदरक वाली चाय बनाई।', question: 'दादीजी ने क्या बनाया?', options: ['कॉफ़ी', 'चाय', 'जूस', 'सूप'], correct: 1 },
            { sentence: 'लड़का बस से स्कूल गया।', question: 'लड़का स्कूल कैसे गया?', options: ['पैदल', 'बस से', 'कार से', 'साइकिल से'], correct: 1 },
            { sentence: 'पिताजी तीन लाल सेब खरीद कर लाए।', question: 'पिताजी ने कितने सेब खरीदे?', options: ['दो', 'तीन', 'चार', 'पाँच'], correct: 1 },
            { sentence: 'कुत्ता अजनबी पर जोर से भौंका।', question: 'कुत्ता किस पर भौंका?', options: ['बिल्ली पर', 'डाकिया पर', 'अजनबी पर', 'मालिक पर'], correct: 2 }
        ],
        medium: [
            { sentence: 'रीना मंगलवार को अपनी माताजी के साथ मंदिर गई।', question: 'रीना मंदिर कब गई थी?', options: ['सोमवार', 'मंगलवार', 'बुधवार', 'रविवार'], correct: 1 },
            { sentence: 'पूरे परिवार ने पीठा और नाच-गाने के साथ बिहू मनाया।', question: 'कौन सा त्योहार मनाया गया?', options: ['दिवाली', 'बिहू', 'होली', 'पोंगल'], correct: 1 },
            { sentence: 'किसान को खेत जोतते समय सोने का एक घड़ा मिला।', question: 'किसान को क्या मिला?', options: ['चांदी का सिक्का', 'सोने का घड़ा', 'खजाने का नक्शा', 'पुरानी तलवार'], correct: 1 },
            { sentence: 'बच्चों ने नीले आसमान में रंग-बिरंगी पतंगें उड़ाईं।', question: 'बच्चों ने क्या किया?', options: ['क्रिकेट खेला', 'पतंगें उड़ाईं', 'नदी में तैरे', 'पेड़ पर चढ़े'], correct: 1 }
        ],
        hard: [
            { sentence: 'दादाजी बरगद के पेड़ के नीचे अखबार पढ़ रहे थे और पोता लट्टू से खेल रहा था।', question: 'पोता किस चीज़ से खेल रहा था?', options: ['गेंद', 'पतंग', 'लकड़ी का लट्टू', 'गुड़िया'], correct: 2 },
            { sentence: 'सुनीता ने भाई के जन्मदिन पर केक बनाया और उसे स्ट्रॉबेरी से सजाया।', question: 'सुनीता ने केक को किस चीज़ से सजाया?', options: ['चेरी', 'स्ट्रॉबेरी', 'मोमबत्तियाँ', 'सौंफ़'], correct: 1 },
            { sentence: 'गाँव का हाट-बाज़ार हर शनिवार की सुबह नदी किनारे लगता है।', question: 'गाँव का बाज़ार कब लगता है?', options: ['रविवार शाम', 'शुक्रवार सुबह', 'शनिवार सुबह', 'सोमवार दोपहर'], correct: 2 },
            { sentence: 'सूर्यास्त से पहले हरे धान के खेतों के ऊपर सफ़ेद बगुले उड़े।', question: 'पक्षियों का रंग कैसा था?', options: ['काला', 'सफ़ेद', 'भूरा', 'स्लेटी'], correct: 1 }
        ]
    },
    as: {
        easy: [
            { sentence: 'আইতাই আদা দিয়া সুগন্ধি চাহ বনালে।', question: 'আইতাই কি বনালে?', options: ['কফি', 'চাহ', 'ৰস', 'চুপ'], correct: 1 },
            { sentence: 'ল’ৰাটো বাছেৰে বিদ্যালয়লৈ গ’ল।', question: 'ল’ৰাটো কেনেকৈ গ’ল?', options: ['খোজ কাঢ়ি', 'বাছেৰে', 'গাড়ীৰে', 'চাইকেলেৰে'], correct: 1 },
            { sentence: 'দেউতাই তিনিটা ৰঙা আপেল কিনি আনিলে।', question: 'দেউতাই কেইটা আপেল কিনিলে?', options: ['দুটা', 'তিনিটা', 'চাৰিটা', 'পাঁচটা'], correct: 1 }
        ],
        medium: [
            { sentence: 'ৰিনাই মঙলবাৰে মাকৰ লগত মন্দিৰলৈ গৈছিল।', question: 'ৰিনাই কেতিয়া মন্দিৰলৈ গৈছিল?', options: ['সোমবাৰে', 'মঙলবাৰে', 'বুধবাৰে', 'দেওবাৰে'], correct: 1 },
            { sentence: 'পৰিয়ালটোৱে পিঠা আৰু নাচেৰে বিহু উদযাপন কৰিলে।', question: 'কোনটো উৎসৱ উদযাপন কৰা হৈছিল?', options: ['দীপাৱলী', 'বিহু', 'হোলী', 'মাঘী'], correct: 1 }
        ],
        hard: [
            { sentence: 'ককা ডাঙৰ আঁহত গছৰ তলত বাতৰিকাকত পঢ়ি আছিল আৰু নাতিয়ে লাটুম খেলিছিল।', question: 'নাতিয়ে কি খেলি আছিল?', options: ['বল', 'চিলা', 'কাঠৰ লাটুম', 'পুতলা'], correct: 2 }
        ]
    }
};

export default function ListenRemember(container) {
    let currentQuestions = [];
    let currentIndex = 0;
    let currentDifficulty = 'medium';
    let langChangeHandler = null;
    let currentShellController = null;
    let currentGameArea = null;
    let activeTurnTimer = null;
    let questionTimer = null;
    
    // Config
    const config = {
        gameId: 'listen-remember',
        titleKey: 'g6Title',
        instructionKey: 'g6Instruction',
        icon: '👂',
        hasDifficulty: true,
        parTime: 120,
        onStart: startGame,
        onCleanup: cleanup
    };

    const controller = GameShell.create(container, config);

    function getSentencesForCurrentLang() {
        const lang = I18n.lang;
        return SENTENCES_BY_LANG[lang] || SENTENCES_BY_LANG.en;
    }

    function startGame(difficulty, gameArea, shellController) {
        currentDifficulty = difficulty;
        currentShellController = shellController;
        currentGameArea = gameArea;

        const langData = getSentencesForCurrentLang();

        // Determine question count based on difficulty
        let questionCount = 3;
        let pool = langData.easy || SENTENCES_BY_LANG.en.easy;
        
        if (difficulty === 'medium') {
            questionCount = 4;
            pool = [...(langData.easy || []), ...(langData.medium || [])];
        } else if (difficulty === 'hard') {
            questionCount = 5;
            pool = [...(langData.medium || []), ...(langData.hard || langData.medium || [])];
        }
        
        // Shuffle and pick
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        currentQuestions = shuffled.slice(0, questionCount);
        currentIndex = 0;
        
        playCurrentTurn(gameArea, shellController);
    }

    // Subscribe to language change for active in-game re-render
    langChangeHandler = () => {
        if (currentShellController && currentGameArea && currentIndex < currentQuestions.length) {
            startGame(currentDifficulty, currentGameArea, currentShellController);
        }
    };
    window.addEventListener('languageChanged', langChangeHandler);

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
        messageEl.textContent = `🔊 ${I18n.t('g6ListenCarefully') || 'Listen carefully...'}`;
        
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
            const playBtn = TTS.createButton(data.sentence, I18n.t('g6PlayAgainAudio') || '🔊 Play Again');
            playBtn.className = 'btn tts-btn';
            actionArea.appendChild(playBtn);
            
            // Auto play
            activeTurnTimer = setTimeout(() => {
                TTS.speak(data.sentence);
            }, 400);
        } else {
            textFallback.style.display = 'block';
        }

        // Show question after hearing
        questionTimer = setTimeout(() => {
            showQuestion(wrapper, data, gameArea, shellController);
        }, 1800);
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
                    if (TTS.isSupported()) TTS.speak(I18n.t('wellDone') || 'Well done!');
                } else {
                    btn.classList.add('wrong');
                    if (optionsList.children[data.correct]) {
                        optionsList.children[data.correct].classList.add('correct');
                    }
                    shellController.recordWrong();
                    if (TTS.isSupported()) TTS.speak(I18n.t('tryAgain') || 'Keep practicing!');
                }
                
                setTimeout(() => {
                    currentIndex++;
                    playCurrentTurn(gameArea, shellController);
                }, 1600);
            });
            
            optionsList.appendChild(btn);
        });
        
        qContainer.appendChild(qText);
        qContainer.appendChild(optionsList);
        wrapper.appendChild(qContainer);
    }

    function cleanup() {
        if (activeTurnTimer) clearTimeout(activeTurnTimer);
        if (questionTimer) clearTimeout(questionTimer);
        if (langChangeHandler) {
            window.removeEventListener('languageChanged', langChangeHandler);
        }
        TTS.stop();
    }

    return controller;
}
