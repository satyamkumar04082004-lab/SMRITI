/* ============================================================
   SMRITI — Game 5: My Day
   Daily routine sequencing with full reactive multilingual support
   ============================================================ */

import GameShell from '../gameShell.js';
import I18n from '../i18n.js';
import TTS from '../tts.js';
import Storage from '../storage.js';

export default function MyDay(container) {
    let currentController;
    let timer;
    let langChangeHandler = null;
    let currentGameArea = null;
    let currentDifficulty = 'medium';

    const defaultRoutineVariationsByLang = {
        en: {
            morning: {
                easy: ['☀️ Wake up & stretch', '🪥 Brush teeth & wash', '🍳 Eat warm breakfast', '🚶 Gentle garden walk'],
                medium: ['☀️ Wake up & stretch', '🪥 Brush teeth & wash', '🍳 Eat warm breakfast', '🍵 Drink ginger tea', '🚶 Gentle garden walk'],
                hard: ['☀️ Wake up & stretch', '🪥 Brush teeth & wash', '🚿 Take warm bath', '🍳 Eat warm breakfast', '🍵 Drink ginger tea', '💊 Take morning medicine', '🚶 Gentle garden walk']
            },
            afternoon: {
                easy: ['🥗 Eat healthy lunch', '💧 Drink a glass of water', '🛌 Take a restful nap', '📖 Read or listen to story'],
                medium: ['🥗 Eat healthy lunch', '💧 Drink a glass of water', '🛌 Take a restful nap', '🍵 Afternoon tea & snack', '📞 Call family member'],
                hard: ['🥗 Eat healthy lunch', '💧 Drink a glass of water', '🛌 Take a restful nap', '🍵 Afternoon tea & snack', '📞 Call family member', '🌸 Water veranda plants', '🚶 Short evening stroll']
            },
            evening: {
                easy: ['🌅 Watch the sunset', '🍲 Eat light dinner', '🥛 Drink warm milk', '😴 Sleep peacefully'],
                medium: ['🌅 Watch the sunset', '🍲 Eat light dinner', '💊 Take night medicine', '🥛 Drink warm milk', '😴 Sleep peacefully'],
                hard: ['🌅 Watch the sunset', '🧘 4-4 Guided breathing', '🍲 Eat light dinner', '💊 Take night medicine', '🥛 Drink warm milk', '📻 Listen to soft melody', '😴 Sleep peacefully']
            }
        },
        hi: {
            morning: {
                easy: ['☀️ सुबह उठना और अंगड़ाई लेना', '🪥 दाँत साफ़ करना और हाथ-मुँह धोना', '🍳 पौष्टिक नाश्ता करना', '🚶 बगीचे में हल्की सैर करना'],
                medium: ['☀️ सुबह उठना और अंगड़ाई लेना', '🪥 दाँत साफ़ करना और हाथ-मुँह धोना', '🍳 पौष्टिक नाश्ता करना', '🍵 अदरक वाली गरमा-गरम चाय पीना', '🚶 बगीचे में हल्की सैर करना'],
                hard: ['☀️ सुबह उठना और अंगड़ाई लेना', '🪥 दाँत साफ़ करना और हाथ-मुँह धोना', '🚿 स्नान करना', '🍳 पौष्टिक नाश्ता करना', '🍵 अदरक वाली चाय पीना', '💊 सुबह की दवा लेना', '🚶 बगीचे में हल्की सैर']
            },
            afternoon: {
                easy: ['🥗 दोपहर का भोजन करना', '💧 एक गिलास पानी पीना', '🛌 थोड़ी देर विश्राम (झपकी) लेना', '📖 प्रेरक कहानी सुनना'],
                medium: ['🥗 दोपहर का भोजन करना', '💧 एक गिलास पानी पीना', '🛌 विश्राम करना', '🍵 शाम की चाय और नाश्ता', '📞 परिवार से बातचीत करना'],
                hard: ['🥗 दोपहर का भोजन करना', '💧 पानी पीना', '🛌 विश्राम करना', '🍵 शाम की चाय', '📞 परिवार से बात करना', '🌸 पौधों में पानी देना', '🚶 शाम की सैर']
            },
            evening: {
                easy: ['🌅 सूर्यास्त देखना', '🍲 हल्का सुपाच्य रात का खाना', '🥛 गुनगुना दूध पीना', '😴 चैन की नींद सोना'],
                medium: ['🌅 सूर्यास्त देखना', '🍲 रात का खाना खाना', '💊 रात की दवा लेना', '🥛 गुनगुना दूध पीना', '😴 चैन की नींद सोना'],
                hard: ['🌅 सूर्यास्त देखना', '🧘 4-4 शांत साँस व्यायाम', '🍲 रात का खाना खाना', '💊 रात की दवा लेना', '🥛 दूध पीना', '📻 मधुर भजन सुनना', '😴 चैन की नींद सोना']
            }
        },
        as: {
            morning: {
                easy: ['☀️ ৰাতিপুৱা সাৰ পাই হাত-ভৰি মেলা', '🪥 মুখ-হাত ধোৱা আৰু দাঁত ঘঁহা', '🍳 গৰম পুষ্টিকৰ জলপান খোৱা', '🚶 ফুলনিত লাহে লাহে খোজ কঢ়া'],
                medium: ['☀️ ৰাতিপুৱা সাৰ পোৱা', '🪥 মুখ-হাত ধোৱা', '🍳 গৰম জলপান খোৱা', '🍵 আদা দিয়া সুগন্ধি চাহ খোৱা', '🚶 ফুলনিত খোজ কঢ়া'],
                hard: ['☀️ ৰাতিপুৱা সাৰ পোৱা', '🪥 মুখ ধোৱা', '🚿 গা ধোৱা', '🍳 জলপান খোৱা', '🍵 সুগন্ধি চাহ খোৱা', '💊 ৰাতিপুৱাৰ ঔষধ খোৱা', '🚶 ফুলনিত খোজ কঢ়া']
            },
            afternoon: {
                easy: ['🥗 দুপৰীয়াৰ ভাত খোৱা', '💧 এগিলাচ বিশুদ্ধ পানী খোৱা', '🛌 অলপ জিৰণি লোৱা', '📖 সাধু বা গান শুনা'],
                medium: ['🥗 দুপৰীয়াৰ আহাৰ গ্ৰহণ', '💧 এগিলাচ পানী খোৱা', '🛌 অলপ সময় জিৰণি লোৱা', '🍵 আবেলিৰ চাহ খোৱা', '📞 আপোনজনৰ লগত কথা পতা']
            },
            evening: {
                easy: ['🌅 বেলি লহিওৱা দৃশ্য উপভোগ কৰা', '🍲 লঘু ৰাতিৰ আহাৰ খোৱা', '🥛 গৰম গাখীৰ খোৱা', '😴 শান্তভাৱে টোপনি যোৱা'],
                medium: ['🌅 বেলি লহিওৱা দৃশ্য চোৱা', '🍲 ৰাতিৰ আহাৰ খোৱা', '💊 ৰাতিৰ ঔষধ সেৱন কৰা', '🥛 এগিলাচ গাখীৰ খোৱা', '😴 শান্তভাৱে টোপনি যোৱা']
            }
        }
    };

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

    const shell = GameShell.create(container, config);

    function getRoutinesForCurrentLang() {
        const lang = I18n.lang;
        return defaultRoutineVariationsByLang[lang] || defaultRoutineVariationsByLang.en;
    }

    function startGame(difficulty, gameArea, controller) {
        currentController = controller;
        currentGameArea = gameArea;
        currentDifficulty = difficulty;
        
        let routine = [];
        if (Storage.getRoutines && typeof Storage.getRoutines === 'function') {
            const userRoutines = Storage.getRoutines();
            if (userRoutines && userRoutines[difficulty] && userRoutines[difficulty].length > 0) {
                routine = [...userRoutines[difficulty]];
            }
        }
        
        if (routine.length === 0) {
            const hour = new Date().getHours();
            const periods = ['morning', 'afternoon', 'evening'];
            let period = 'morning';
            if (hour >= 12 && hour < 17) period = 'afternoon';
            else if (hour >= 17) period = 'evening';

            const langRoutines = getRoutinesForCurrentLang();
            const pool = langRoutines[period] || langRoutines.morning || defaultRoutineVariationsByLang.en.morning;
            routine = [...(pool[difficulty] || pool.easy || pool.medium)];

            // If family members exist, integrate personalized interaction
            const family = Storage.getFamilyMembers() || [];
            if (family.length > 0 && routine.length > 3) {
                const fam = family[Math.floor(Math.random() * family.length)];
                const isHi = I18n.lang === 'hi';
                const isAs = I18n.lang === 'as';
                const customStep = isHi 
                    ? `📞 ${fam.name} (${fam.relation}) को फ़ोन करना`
                    : (isAs ? `📞 ${fam.name}লৈ (${fam.relation}) ফোন কৰা` : `📞 Call ${fam.name} (${fam.relation})`);
                if (!routine.some(s => s.includes('Call') || s.includes('फ़ोन') || s.includes('ফোন'))) {
                    routine[routine.length - 2] = customStep;
                }
            }
        }

        showCorrectOrder(routine, gameArea, controller);
    }

    // Subscribe to language change for active in-game re-render
    langChangeHandler = () => {
        if (currentController && currentGameArea) {
            startGame(currentDifficulty, currentGameArea, currentController);
        }
    };
    window.addEventListener('languageChanged', langChangeHandler);
    
    function showCorrectOrder(routine, gameArea, controller) {
        gameArea.innerHTML = '';
        
        const isHi = I18n.lang === 'hi';
        const isAs = I18n.lang === 'as';

        const titleText = isHi ? 'अपनी दिनचर्या का क्रम देखें' : (isAs ? 'আপোনাৰ দিনলিপিৰ ক্ৰম চাওক' : 'Review your routine');
        const memoText = isHi ? 'क्रम को ध्यान से याद कर लें...' : (isAs ? 'ক্ৰমটো মনত ৰাখক...' : 'Memorize the order...');
        const readBtnText = isHi ? 'दिनचर्या सुनें' : (isAs ? 'দিনলিপি শুনক' : 'Read Routine');

        const heading = document.createElement('h3');
        heading.className = 'text-2xl font-bold text-center mb-6 text-maroon';
        heading.textContent = titleText;
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
        notice.textContent = memoText;
        gameArea.appendChild(notice);
        
        if (TTS.isSupported()) {
            const stepPrefix = isHi ? 'कदम' : (isAs ? 'পদক্ষেপ' : 'Step');
            const textToSpeak = routine.map((step, i) => `${stepPrefix} ${i + 1}, ${step.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')}`).join('. ');
            const ttsBtn = TTS.createButton(textToSpeak, readBtnText);
            ttsBtn.classList.add('mt-4', 'mx-auto', 'block');
            gameArea.appendChild(ttsBtn);
        }
        
        timer = setTimeout(() => {
            playSortGame(routine, gameArea, controller);
        }, 4200);
    }
    
    function playSortGame(routine, gameArea, controller) {
        gameArea.innerHTML = '';
        
        const isHi = I18n.lang === 'hi';
        const isAs = I18n.lang === 'as';

        const promptText = isHi ? 'गतिविधियों को पहले से आखिरी तक सही क्रम में टैप करें' : (isAs ? 'কাৰ্যসূচীবোৰ সঠিক ক্ৰমত টেপ কৰক' : (I18n.t('g5TapOrder') || 'Tap the activities in the correct order:'));
        const checkBtnText = I18n.t('g5CheckOrder') || (isHi ? 'क्रम जांचें' : 'Check My Order');
        const resetBtnText = I18n.t('g5Reset') || (isHi ? 'पुनः सेट करें' : 'Reset');

        const heading = document.createElement('h3');
        heading.className = 'text-xl font-bold text-center mb-4 text-maroon';
        heading.textContent = promptText;
        gameArea.appendChild(heading);
        
        if (TTS.isSupported()) {
            const ttsBtn = TTS.createButton(promptText);
            ttsBtn.classList.add('mb-4', 'mx-auto', 'block');
            gameArea.appendChild(ttsBtn);
        }
        
        const shuffled = [...routine].map((step, index) => ({ step, originalIndex: index })).sort(() => Math.random() - 0.5);
        
        const listContainer = document.createElement('div');
        listContainer.className = 'sortable-list max-w-md mx-auto space-y-3 mb-6';
        
        let selectedOrder = [];
        
        function updateDisplay() {
            listContainer.innerHTML = '';
            shuffled.forEach((item) => {
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
        checkBtn.textContent = checkBtnText;
        checkBtn.disabled = true;
        
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn bg-gray-200 text-gray-800 px-4 py-3 font-bold rounded-lg';
        resetBtn.innerHTML = `↺ ${resetBtnText}`;
        
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
                    expectedBadge.textContent = isHi ? `(क्रम ${item.originalIndex + 1} होना चाहिए था)` : `(Should be ${item.originalIndex + 1})`;
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
                if (TTS.isSupported()) TTS.speak(isHi ? 'अद्भुत! आपने सभी गतिविधियों को बिल्कुल सही क्रम में रखा।' : 'Perfect! You got everything in the right order.');
            } else if (accuracy >= 0.5) {
                controller.recordCorrect();
                if (TTS.isSupported()) TTS.speak(isHi ? 'बहुत अच्छा प्रयास! अधिकांश गतिविधियाँ सही क्रम में हैं।' : 'Good job! Most of them are in the right order.');
            } else {
                controller.recordWrong();
                if (TTS.isSupported()) TTS.speak(isHi ? 'कोई बात नहीं, अभ्यास से सब आसान हो जाता है।' : 'Good effort. Keep practicing.');
            }
            
            const feedback = document.createElement('div');
            feedback.className = 'text-center mt-6 text-xl font-bold mb-4';
            feedback.textContent = isHi ? `आपने ${routine.length} में से ${correctCount} सही किए!` : `You got ${correctCount} out of ${routine.length} right!`;
            gameArea.appendChild(feedback);
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn bg-teal text-white w-full max-w-md mx-auto block py-3 font-bold rounded-lg mt-4';
            nextBtn.textContent = isHi ? 'खेल समाप्त करें' : (isAs ? 'খেল সমাপ্ত কৰক' : 'Finish Game');
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
        safetyNotice.textContent = I18n.t('g5Safety') || 'This is a practice activity, not medical advice.';
        gameArea.appendChild(safetyNotice);
        
        updateDisplay();
    }

    function cleanup() {
        if (timer) clearTimeout(timer);
        if (langChangeHandler) {
            window.removeEventListener('languageChanged', langChangeHandler);
        }
        TTS.stop();
    }

    return shell;
}
