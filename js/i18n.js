/* ============================================================
   SMRITI — Internationalization (i18n)
   English default, NER language support, fallback system
   ============================================================ */

import Storage from './storage.js';

const translations = {
  en: {
    // App
    appName: 'SMRITI',
    appTagline: 'Cognitive Care & Memory Companion',
    welcome: 'Welcome',
    hello: 'Hello',
    greeting: "Let's exercise your mind today!",
    logout: 'Logout',
    settings: 'Settings',
    back: 'Back',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    loading: 'Loading...',
    
    // Auth
    login: 'Login',
    register: 'Register',
    loginTitle: 'Welcome to SMRITI',
    loginSubtitle: 'Sign in to continue your cognitive care journey',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter 10-digit phone number',
    roleLabel: 'I am a...',
    rolePatient: 'Patient',
    rolePatientDesc: 'I want to play cognitive games',
    roleCaregiver: 'Caregiver / ASHA',
    roleCaregiverDesc: 'I care for a patient',
    sendOtp: 'Send OTP',
    resendOtp: 'Resend OTP',
    otpSent: 'OTP sent! Check your phone',
    otpExpired: 'OTP expired. Please request a new one',
    otpInvalid: 'Invalid OTP. Please try again',
    otpVerified: 'Verified successfully!',
    enterOtp: 'Enter the 4-digit OTP',
    verifyOtp: 'Verify OTP',
    cooldownMsg: 'Resend in',
    demoOtp: 'Demo OTP:',
    
    // Navigation
    navHome: 'Home',
    navGames: 'Games',
    navLeaderboard: 'Ranks',
    navHistory: 'History',
    navDashboard: 'Dashboard',
    navProfile: 'Profile',
    
    // Games Hub
    gamesTitle: 'Cognitive Games',
    gamesSubtitle: 'Choose a game to train your mind',
    coins: 'Coins',
    leaderboard: 'Leaderboard',
    history: 'History',
    
    // Game Common
    play: 'Play',
    playAgain: 'Play Again',
    exitToHub: 'Back to Games',
    score: 'Score',
    time: 'Time',
    accuracy: 'Accuracy',
    level: 'Level',
    hints: 'Hints',
    coinsEarned: 'Coins Earned',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    readInstruction: '🔊 Read Instruction',
    startGame: 'Start Game',
    gameOver: 'Game Complete!',
    
    // Encouragement
    excellent: 'Excellent! 🌟',
    greatJob: 'Great job! 👏',
    wellDone: 'Well done! 😊',
    goodEffort: 'Good effort! 💪',
    keepTrying: "Keep trying, you're doing great! 🌈",
    tryAgain: "Let's try again!",
    
    // Game 1: Hornbill Memory Nest
    g1Title: 'Hornbill Memory Nest',
    g1Desc: 'Match pairs of nature cards',
    g1Tag: 'Memory',
    g1Instruction: 'Flip two cards to find matching pairs. Remember where each card is!',
    g1Matches: 'Matches',
    g1Moves: 'Moves',
    
    // Game 2: Memory Moments
    g2Title: 'Memory Moments',
    g2Desc: 'Remember the story sequence',
    g2Tag: 'Memory',
    g2Instruction: 'Watch the story unfold, then answer questions about what you saw.',
    g2Remember: 'Remember this sequence...',
    g2Question: 'Question',
    
    // Game 3: Familiar Faces
    g3Title: 'Familiar Faces',
    g3Desc: 'Recognise people around you',
    g3Tag: 'Recognition',
    g3Instruction: 'Look at the face and tell us who this person is. Use hints if you need help!',
    g3WhoIsThis: 'Who is this?',
    g3Hint: 'Get a Hint',
    
    // Game 4: Remember My Home
    g4Title: 'Remember My Home',
    g4Desc: 'Recall objects in a room',
    g4Tag: 'Memory',
    g4Instruction: 'Look at the room carefully, then answer questions about the objects you saw.',
    g4LookCarefully: 'Look at this room carefully...',
    g4WhereWas: 'Where was the',
    g4WhatObjects: 'Which objects were in the room?',
    
    // Game 5: My Day
    g5Title: 'My Day',
    g5Desc: 'Put your daily routine in order',
    g5Tag: 'Routine',
    g5Instruction: 'Arrange the daily activities in the correct order by tapping them.',
    g5TapOrder: 'Tap the activities in the correct order:',
    g5Safety: 'This is a practice activity, not medical advice.',
    g5CheckOrder: 'Check My Order',
    g5Reset: 'Reset',
    
    // Game 6: Listen & Remember
    g6Title: 'Listen & Remember',
    g6Desc: 'Listen and answer questions',
    g6Tag: 'Attention',
    g6Instruction: 'Listen to the sentence carefully, then answer the question about what you heard.',
    g6ListenCarefully: 'Listen carefully...',
    g6PlayAgainAudio: '🔊 Play Again',
    g6WhatDidYouHear: 'What did you hear?',
    
    // Game 7: Bamboo Sequence
    g7Title: 'Bamboo Sequence',
    g7Desc: 'Repeat the glowing sequence',
    g7Tag: 'Attention',
    g7Instruction: 'Watch the pads light up, then repeat the sequence in the same order.',
    g7Watch: 'Watch carefully...',
    g7YourTurn: 'Your turn! Repeat the sequence',
    g7Level: 'Level',
    g7BestLevel: 'Best Level',
    
    // Leaderboard
    lbTitle: 'Leaderboard',
    lbRank: 'Rank',
    lbPlayer: 'Player',
    lbCoins: 'Total Coins',
    lbSessions: 'Sessions',
    lbBestScore: 'Best Score',
    lbEmpty: 'Play some games to see rankings!',
    
    // History
    historyTitle: 'Game History',
    historyEmpty: 'No games played yet. Start playing to see your progress!',
    historyFilter: 'Filter by game',
    historyAll: 'All Games',
    
    // Dashboard
    dashTitle: 'Caregiver Dashboard',
    dashTotalSessions: 'Total Sessions',
    dashAvgAccuracy: 'Avg Accuracy',
    dashTotalCoins: 'Total Coins',
    dashBestGame: 'Best Game',
    dashRecentActivity: 'Recent Activity',
    dashCognitiveProfile: 'Cognitive Profile',
    dashNoData: 'No patient data available yet.',
    
    // Personalisation
    persTitle: 'Cultural Personalisation',
    persSubtitle: 'Help us personalise your experience',
    persPreferredName: 'Preferred Name',
    persNativePlace: 'Native Place',
    persFestivals: 'Favourite Festivals',
    persFood: 'Food Preferences',
    persLanguageNotes: 'Language Notes',
    persMemoryNotes: 'Memory Notes',
    persSaved: 'Preferences saved!',
    
    // Settings
    settingsTitle: 'Settings',
    settingsLanguage: 'Language',
    settingsProfile: 'Profile',
    settingsPersonalisation: 'Cultural Personalisation',
    
    // Language names
    langEn: 'English',
    langHi: 'हिन्दी (Hindi)',
    langAs: 'অসমীয়া (Assamese)',
    langBn: 'বাংলা (Bengali)',
    langMni: 'মৈতৈলোন্ (Manipuri)',
    langBrx: 'बड़ो (Bodo)',
    langLus: 'Mizo',
    langNag: 'Nagamese',
  },
  
  hi: {
    appName: 'स्मृति',
    appTagline: 'संज्ञानात्मक देखभाल और स्मृति साथी',
    welcome: 'स्वागत है',
    hello: 'नमस्ते',
    greeting: 'आज अपने दिमाग को व्यायाम दें!',
    logout: 'लॉग आउट',
    settings: 'सेटिंग्स',
    back: 'वापस',
    close: 'बंद करें',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    loginTitle: 'स्मृति में आपका स्वागत है',
    loginSubtitle: 'अपनी संज्ञानात्मक देखभाल यात्रा जारी रखने के लिए साइन इन करें',
    nameLabel: 'आपका नाम',
    namePlaceholder: 'अपना नाम दर्ज करें',
    phoneLabel: 'फ़ोन नंबर',
    phonePlaceholder: '10 अंकों का फ़ोन नंबर दर्ज करें',
    roleLabel: 'मैं हूँ...',
    rolePatient: 'मरीज़',
    rolePatientDesc: 'मैं संज्ञानात्मक खेल खेलना चाहता/चाहती हूँ',
    roleCaregiver: 'देखभालकर्ता / आशा',
    roleCaregiverDesc: 'मैं एक मरीज़ की देखभाल करता/करती हूँ',
    sendOtp: 'OTP भेजें',
    resendOtp: 'OTP दोबारा भेजें',
    otpSent: 'OTP भेजा गया! अपना फ़ोन जांचें',
    otpExpired: 'OTP समाप्त हो गया। कृपया नया अनुरोध करें',
    otpInvalid: 'गलत OTP। कृपया पुनः प्रयास करें',
    otpVerified: 'सफलतापूर्वक सत्यापित!',
    enterOtp: '4 अंकों का OTP दर्ज करें',
    verifyOtp: 'OTP सत्यापित करें',
    navHome: 'होम',
    navGames: 'खेल',
    navLeaderboard: 'रैंक',
    navHistory: 'इतिहास',
    navDashboard: 'डैशबोर्ड',
    navProfile: 'प्रोफ़ाइल',
    gamesTitle: 'संज्ञानात्मक खेल',
    gamesSubtitle: 'अपने दिमाग को प्रशिक्षित करने के लिए एक खेल चुनें',
    coins: 'सिक्के',
    play: 'खेलें',
    playAgain: 'फिर से खेलें',
    exitToHub: 'खेलों पर वापस जाएं',
    score: 'स्कोर',
    time: 'समय',
    accuracy: 'सटीकता',
    difficulty: 'कठिनाई',
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    readInstruction: '🔊 निर्देश सुनें',
    startGame: 'खेल शुरू करें',
    gameOver: 'खेल पूरा!',
    excellent: 'उत्कृष्ट! 🌟',
    greatJob: 'बहुत अच्छा! 👏',
    wellDone: 'शाबाश! 😊',
    goodEffort: 'अच्छा प्रयास! 💪',
    keepTrying: 'कोशिश जारी रखें, आप बहुत अच्छा कर रहे हैं! 🌈',
    tryAgain: 'फिर से कोशिश करें!',
    g1Title: 'हॉर्नबिल मेमोरी नेस्ट',
    g1Desc: 'प्रकृति कार्ड जोड़ी मिलाएं',
    g1Tag: 'स्मृति',
    g1Instruction: 'मिलान जोड़ी खोजने के लिए दो कार्ड पलटें। याद रखें हर कार्ड कहाँ है!',
    g2Title: 'मेमोरी मोमेंट्स',
    g2Desc: 'कहानी क्रम याद रखें',
    g2Tag: 'स्मृति',
    g2Instruction: 'कहानी देखें, फिर आपने जो देखा उसके बारे में सवालों के जवाब दें।',
    g3Title: 'परिचित चेहरे',
    g3Desc: 'अपने आसपास के लोगों को पहचानें',
    g3Tag: 'पहचान',
    g3Instruction: 'चेहरा देखें और बताएं कि यह व्यक्ति कौन है। ज़रूरत हो तो संकेत लें!',
    g4Title: 'मेरा घर याद करें',
    g4Desc: 'कमरे की वस्तुओं को याद करें',
    g4Tag: 'स्मृति',
    g4Instruction: 'कमरे को ध्यान से देखें, फिर वस्तुओं के बारे में सवालों के जवाब दें।',
    g5Title: 'मेरा दिन',
    g5Desc: 'दैनिक दिनचर्या को क्रम में रखें',
    g5Tag: 'दिनचर्या',
    g5Instruction: 'दैनिक गतिविधियों को सही क्रम में टैप करके व्यवस्थित करें।',
    g5Safety: 'यह एक अभ्यास गतिविधि है, चिकित्सा सलाह नहीं।',
    g6Title: 'सुनें और याद रखें',
    g6Desc: 'सुनें और सवालों के जवाब दें',
    g6Tag: 'ध्यान',
    g6Instruction: 'वाक्य ध्यान से सुनें, फिर सवाल का जवाब दें।',
    g7Title: 'बांस अनुक्रम',
    g7Desc: 'चमकते अनुक्रम को दोहराएं',
    g7Tag: 'ध्यान',
    g7Instruction: 'पैड को जलते देखें, फिर उसी क्रम में अनुक्रम दोहराएं।',
    lbTitle: 'लीडरबोर्ड',
    historyTitle: 'खेल इतिहास',
    historyEmpty: 'अभी तक कोई खेल नहीं खेला। अपनी प्रगति देखने के लिए खेलना शुरू करें!',
    dashTitle: 'देखभालकर्ता डैशबोर्ड',
    dashTotalSessions: 'कुल सत्र',
    dashAvgAccuracy: 'औसत सटीकता',
    dashTotalCoins: 'कुल सिक्के',
    persTitle: 'सांस्कृतिक व्यक्तिगतकरण',
    settingsTitle: 'सेटिंग्स',
    settingsLanguage: 'भाषा',
  },
};

const I18n = {
  _currentLang: 'en',

  init() {
    this._currentLang = Storage.getLanguage() || 'en';
  },

  get lang() {
    return this._currentLang;
  },

  setLanguage(lang) {
    this._currentLang = lang;
    Storage.setLanguage(lang);
    this.updateAllText();
  },

  t(key) {
    const langDict = translations[this._currentLang];
    if (langDict && langDict[key]) return langDict[key];
    // Fallback to English
    if (translations.en[key]) return translations.en[key];
    return key;
  },

  updateAllText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    // Dispatch event for dynamic components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this._currentLang } }));
  },

  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'हिन्दी (Hindi)' },
      { code: 'as', name: 'অসমীয়া (Assamese)' },
      { code: 'bn', name: 'বাংলা (Bengali)' },
      { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)' },
      { code: 'brx', name: 'बड़ो (Bodo)' },
      { code: 'lus', name: 'Mizo' },
      { code: 'nag', name: 'Nagamese' },
    ];
  },
};

export default I18n;
