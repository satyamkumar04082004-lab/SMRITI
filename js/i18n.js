/* ============================================================
   SMRITI (स्मृति) — Internationalization (i18n)
   Google Stitch Design System & Antigravity Workflow Engine
   Supports English (en), Hindi (hi), Bengali (bn), Assamese (as),
   and Northeastern regional dialects with robust fallback to English.
   ============================================================ */

import Storage from './storage.js';

export const stitchTranslations = {
  en: {
    // App & Branding
    appName: 'SMRITI',
    appTagline: 'Daily Memory & Wellness Sanctuary',
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

    // Header & Status
    status: {
      online: 'Online',
      offline: 'Offline Mode'
    },
    nav: {
      home: 'Home',
      games: 'Games',
      memories: 'Memories',
      wellness: 'Wellness',
      progress: 'Progress',
      settings: 'Settings',
      caregiver: 'Caregiver',
      sound: 'Sound',
      voice: 'Voice',
      sos: 'SOS'
    },
    coins: 'Coins',
    redeemed: '✨ Redeemed',
    navSettings: 'Settings',
    navSettingsDesc: 'Adjust language, audio, and caregiver options',
    settingsLanguage: 'Language',

    // Caregiver Banner
    caregiver: {
      connected: 'Caregiver Connected',
      status: 'Raj Das (Son) · Connected',
      viewReport: 'View Caregiver Report'
    },

    // Welcome Hero
    hero: {
      greeting: 'Good morning,',
      welcome_text: 'Welcome to your daily memory and wellness sanctuary.',
      tasks_completed: 'Daily Tasks: {completed} of {total} Completed',
      blossom: '🌸'
    },

    // Quick Actions
    quick: {
      call_loved: 'CALL LOVED ONE',
      son_name: 'Raj Das (Son)',
      ritual_title: 'DAILY RITUAL',
      ritual_action: '3-Step Guide →'
    },

    // Scheduled Routine & Medication Card
    routine: {
      badge: 'SCHEDULED ROUTINE REMINDER',
      time: '08:30 AM (Morning)',
      medicine_title: 'Morning Blood Pressure Medicine',
      medicine_instructions: '1 tablet with a warm glass of water',
      mark_done: 'Mark as Taken',
      completed: 'Completed ✓',
      snooze: 'Snooze 15m',
      coins_reward: '+10 Coins'
    },

    // 5-Emoji Mood Check-in
    mood: {
      question: 'How are you feeling today?',
      great: 'Great',
      good: 'Good',
      okay: 'Okay',
      low: 'Low',
      worried: 'Worried',
      feedback_title: 'Checked in as {mood}',
      feedback_great: 'Wonderful to see your bright positive energy! A great mood is the perfect foundation for memory exercises.',
      feedback_good: 'Glad to see you in good spirits! Engaging your mind now helps build long-term memory resilience.',
      feedback_okay: 'A calm, quiet day is a true gift. Take a gentle breath and enjoy peaceful moments.',
      feedback_low: 'We are sending you gentle warmth and care. Take your time; you are deeply cherished and supported.',
      feedback_worried: 'Take a deep breath with us. You are in a safe, peaceful sanctuary. Would you like to call Raj or listen to soothing music?',
      chip_hornbill: 'Play Hornbill Memory',
      chip_story: 'Visual Story Recall',
      chip_wellness: 'Daily Wellness Guide'
    },

    // Personalized Activity
    activity: {
      subhead: "TODAY'S PERSONALIZED ACTIVITY",
      title: 'Bamboo Sequence',
      category: 'Pattern Attention',
      description: 'Repeat peaceful glowing bamboo rhythm pads',
      reason: 'Recommended because of your great positive energy today — challenge your pattern memory with glowing bamboo rhythms!',
      start_btn: 'START ACTIVITY'
    },

    // Affirmation
    affirmation: {
      header: "Today's Good Thought",
      badge: 'Affirmation',
      listen: 'Listen',
      new: 'New Thought'
    },

    // Saathi Mascot & Drawer
    saathi: {
      name: 'Saathi',
      title: 'Saathi AI Companion',
      subtitle: 'Your empathetic voice and memory companion',
      badge: 'Online & Listening',
      welcome: 'Hello! I am Saathi, your memory and wellness companion. How can I help brighten your day?',
      placeholder: 'Ask Saathi anything or tap 🎤...',
      send: 'Send',
      listening: 'Listening...',
      thinking: 'Thinking...',
      voice_note: '💡 You can speak or type anytime. Saathi speaks responses aloud.',
      quick_meds: '💊 When is my medicine?',
      quick_sos: '🚨 Emergency SOS Help',
      quick_game: '🎋 Play Bamboo Game',
      quick_tips: '🌻 Good Thought Today'
    },

    // Quick Navigation Grid
    grid: {
      header: 'Quick Navigation',
      games: 'Games Hub',
      lifestory: 'Life Story',
      entertainment: 'Entertainment',
      family: 'Family Play',
      stars: 'Weekly Stars',
      wellness: 'Wellness',
      reminders: 'Reminders',
      medicines: 'Medicines',
      emergency: 'Emergency',
      rewards: 'Rewards & Badges',
      settings: 'Settings'
    },

    // Games Common
    gamesTitle: 'Cognitive Games',
    gamesSubtitle: 'Choose an activity to nourish your mind',
    play: 'Play',
    score: 'Score',
    accuracy: 'Accuracy',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    playAgain: 'Play Again',
    exitToHub: 'Exit to Games',
    hints: 'Hints',
    time: 'Time',
    coinsEarned: 'Coins Earned',
    startGame: 'Start Game',
    gameOver: 'Game Complete!',

    // Game Titles & Details (Natural English Titles)
    g1Title: 'Hornbill Memory Nest',
    g1Desc: 'Match pairs of nature cards',
    g1Tag: 'Memory',
    g1Instruction: 'Tap cards to find matching pairs',

    g2Title: 'Memory Moments',
    g2Desc: 'Remember the story sequence',
    g2Tag: 'Memory',
    g2Instruction: 'Remember what happened in the story',

    g3Title: 'Familiar Faces',
    g3Desc: 'Recognise loved ones around you',
    g3Tag: 'Recognition',
    g3Instruction: 'Identify people who love you',

    g4Title: 'Remember Home',
    g4Desc: 'Recall objects in a room',
    g4Tag: 'Spatial Memory',
    g4Instruction: 'Remember where items were placed',

    g5Title: 'My Day Routine',
    g5Desc: 'Put your daily routine in order',
    g5Tag: 'Routine',
    g5Instruction: 'Arrange daily activities in right sequence',

    g6Title: 'Listen & Remember',
    g6Desc: 'Listen and answer questions',
    g6Tag: 'Attention',
    g6Instruction: 'Listen to the audio and choose the right answer',

    g7Title: 'Bamboo Sequence',
    g7Desc: 'Repeat the glowing pattern',
    g7Tag: 'Pattern Memory',
    g7Instruction: 'Watch glowing bamboo pads and repeat pattern'
  },

  hi: {
    // App & Branding
    appName: 'स्मृति',
    appTagline: 'दैनिक स्मृति एवं स्वास्थ्य अभयारण्य',
    welcome: 'नमस्ते',
    hello: 'नमस्ते',
    greeting: 'आइए आज अपने मन का अभ्यास करें!',
    logout: 'लॉग आउट',
    settings: 'सेटिंग्स',
    back: 'वापस',
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',

    // Header & Status
    status: {
      online: 'ऑनलाइन',
      offline: 'ऑफ़लाइन मोड'
    },
    nav: {
      home: 'होम',
      games: 'खेल',
      memories: 'यादें',
      wellness: 'स्वास्थ्य',
      progress: 'प्रगति',
      settings: 'सेटिंग्स',
      caregiver: 'देखभालकर्ता',
      sound: 'ध्वनि',
      voice: 'आवाज़',
      sos: 'आपातकाल'
    },
    coins: 'सिक्के',
    redeemed: '✨ रिडीम किया गया',
    navSettings: 'सेटिंग्स',
    navSettingsDesc: 'भाषा, ध्वनि एवं प्राथमिकताओं को व्यवस्थित करें',
    settingsLanguage: 'भाषा',

    // Caregiver Banner
    caregiver: {
      connected: 'देखभालकर्ता जुड़े हैं',
      status: 'राज दास (सुपुत्र) · जुड़े हैं',
      viewReport: 'देखभाल रिपोर्ट देखें'
    },

    // Welcome Hero
    hero: {
      greeting: 'शुभ प्रभात,',
      welcome_text: 'आपके दैनिक स्मृति एवं स्वास्थ्य अभयारण्य में आपका स्वागत है।',
      tasks_completed: 'दैनिक कार्य: {total} में से {completed} पूर्ण',
      blossom: '🌸'
    },

    // Quick Actions
    quick: {
      call_loved: 'स्वजन को कॉल करें',
      son_name: 'राज दास (सुपुत्र)',
      ritual_title: 'दैनिक नियम',
      ritual_action: '3-चरणीय मार्गदर्शिका →'
    },

    // Scheduled Routine & Medication Card
    routine: {
      badge: 'निर्धारित दवा अनुस्मारक',
      time: 'सुबह 08:30 बजे',
      medicine_title: 'सुबह की रक्तचाप की दवा',
      medicine_instructions: 'गुनगुने पानी के साथ 1 गोली लें',
      mark_done: 'दवा ले ली',
      completed: 'पूर्ण ✓',
      snooze: '15 मिनट बाद याद दिलाएं',
      coins_reward: '+10 सिक्के'
    },

    // 5-Emoji Mood Check-in
    mood: {
      question: 'आज आप कैसा महसूस कर रहे हैं?',
      great: 'अति प्रसन्न',
      good: 'अच्छा',
      okay: 'सामान्य',
      low: 'उदास',
      worried: 'चिंतित',
      feedback_title: '{mood} दर्ज किया गया',
      feedback_great: 'आपकी सकारात्मक ऊर्जा देखकर मन प्रसन्न हो गया! सुखद मन स्मृति अभ्यास के लिए सर्वोत्तम है।',
      feedback_good: 'आपको प्रसन्न देखकर खुशी हुई! मन को सक्रिय रखने से याददाश्त मजबूत होती है।',
      feedback_okay: 'एक शांत और सहज दिन भी अनमोल उपहार है। गहरी सांस लें और शांति का अनुभव करें।',
      feedback_low: 'हम आपके साथ हैं। धीरे-धीरे सांस लें; आपका परिवार आपसे बहुत स्नेह करता है।',
      feedback_worried: 'कृपया शांत रहें। आप पूर्णतः सुरक्षित हैं। क्या आप राज से बात करना चाहते हैं या मधुर संगीत सुनना पसंद करेंगे?',
      chip_hornbill: 'हॉर्नबिल स्मृति खेलें',
      chip_story: 'कहानी स्मरण खेल',
      chip_wellness: 'दैनिक स्वास्थ्य मार्गदर्शिका'
    },

    // Personalized Activity
    activity: {
      subhead: 'आज की विशेष गतिविधि',
      title: 'बांस अनुक्रम खेल',
      category: 'पैटर्न ध्यान',
      description: 'चमकते बांस के पैड्स की लय दोहराएं',
      reason: 'आपकी आज की ऊर्जा को देखते हुए — बांस के सुरों से अपनी स्मरण शक्ति को जगाएं!',
      start_btn: 'गतिविधि शुरू करें'
    },

    // Affirmation
    affirmation: {
      header: 'आज का सुविचार',
      badge: 'शुभ विचार',
      listen: 'सुनें',
      new: 'नया विचार'
    },

    // Saathi Mascot & Drawer
    saathi: {
      name: 'साथी',
      title: 'साथी AI सहायक',
      subtitle: 'आपकी स्नेहमयी आवाज़ और स्मृति साथी',
      badge: 'ऑनलाइन एवं तत्पर',
      welcome: 'नमस्ते! मैं साथी हूँ, आपका स्मृति और स्वास्थ्य मित्र। आज मैं आपकी क्या सेवा करूँ?',
      placeholder: 'साथी से कुछ भी पूछें या 🎤 दबाएं...',
      send: 'भेजें',
      listening: 'सुन रहा हूँ...',
      thinking: 'सोच रहा हूँ...',
      voice_note: '💡 आप कभी भी बोल या लिख सकते हैं। साथी बोलकर उत्तर देता है।',
      quick_meds: '💊 मेरी दवा का समय क्या है?',
      quick_sos: '🚨 आपातकालीन SOS सहायता',
      quick_game: '🎋 बांस खेल खेलें',
      quick_tips: '🌻 आज का सुविचार'
    },

    // Quick Navigation Grid
    grid: {
      header: 'त्वरित नेविगेशन',
      games: 'खेल केंद्र',
      lifestory: 'जीवन कथा',
      entertainment: 'मनोरंजन',
      family: 'पारिवारिक खेल',
      stars: 'साप्ताहिक सितारे',
      wellness: 'स्वास्थ्य',
      reminders: 'अनुस्मारक',
      medicines: 'दवाइयाँ',
      emergency: 'आपातकाल',
      rewards: 'पुरस्कार एवं बैज',
      settings: 'सेटिंग्स'
    },

    // Games Common
    gamesTitle: 'संज्ञानात्मक खेल',
    gamesSubtitle: 'अपने मस्तिष्क को सक्रिय रखने के लिए खेल चुनें',
    play: 'खेलें',
    score: 'अंक',
    accuracy: 'सटीकता',
    difficulty: 'कठिनाई',
    easy: 'सरल',
    medium: 'मध्यम',
    hard: 'कठिन',
    playAgain: 'पुनः खेलें',
    exitToHub: 'खेल केंद्र पर लौटें',
    hints: 'संकेत',
    time: 'समय',
    coinsEarned: 'अर्जित सिक्के',
    startGame: 'खेल शुरू करें',
    gameOver: 'खेल पूरा हुआ!',

    // Game Titles & Details
    g1Title: 'हॉर्नबिल स्मृति घोंसला',
    g1Desc: 'प्रकृति कार्ड के जोड़े मिलाएं',
    g1Tag: 'स्मृति',
    g1Instruction: 'मिलान करने वाले कार्ड ढूंढें',

    g2Title: 'स्मृति क्षण',
    g2Desc: 'कहानी के क्रम को याद रखें',
    g2Tag: 'स्मृति',
    g2Instruction: 'कहानी के घटनाक्रम को याद करें',

    g3Title: 'परिचित चेहरे',
    g3Desc: 'अपने प्रियजनों को पहचानें',
    g3Tag: 'पहचान',
    g3Instruction: 'अपने परिवार और मित्रों को पहचानें',

    g4Title: 'मेरा घर याद करें',
    g4Desc: 'कमरे में रखी वस्तुओं को याद रखें',
    g4Tag: 'स्थानिक स्मृति',
    g4Instruction: 'वस्तुओं के सही स्थान को याद करें',

    g5Title: 'मेरी दिनचर्या',
    g5Desc: 'दिनचर्या को सही क्रम में लगाएं',
    g5Tag: 'दिनचर्या',
    g5Instruction: 'दैनिक कार्यों को सही क्रम में व्यवस्थित करें',

    g6Title: 'सुनें और याद रखें',
    g6Desc: 'ध्यान से सुनकर उत्तर दें',
    g6Tag: 'एकाग्रता',
    g6Instruction: 'ऑडियो सुनें और सही उत्तर चुनें',

    g7Title: 'बांस अनुक्रम',
    g7Desc: 'चमकदार पैटर्न को दोहराएं',
    g7Tag: 'पैटर्न स्मृति',
    g7Instruction: 'चमकते बांस पैड को देखें और क्रम दोहराएं'
  },

  bn: {
    // App & Branding
    appName: 'স্মৃতি',
    appTagline: 'দৈনিক স্মৃতি ও সুস্থতা আশ্রয়স্থল',
    welcome: 'স্বাগতম',
    hello: 'নমস্কার',
    greeting: 'আসুন আজ মন সতেজ করার চর্চা করি!',
    logout: 'লগ আউট',
    settings: 'সেটিংস',
    back: 'ফিরে যান',
    close: 'বন্ধ করুন',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত',
    loading: 'লোড হচ্ছে...',

    // Header & Status
    status: {
      online: 'অনলাইন',
      offline: 'অফলাইন মোড'
    },
    nav: {
      home: 'হোম',
      games: 'খেলা',
      memories: 'স্মৃতি',
      wellness: 'সুস্থতা',
      progress: 'অগ্রগতি',
      settings: 'সেটিংস',
      caregiver: 'তত্ত্বাবধায়ক',
      sound: 'সুর',
      voice: 'কণ্ঠ',
      sos: 'জরুরি'
    },
    coins: 'কয়েন',
    redeemed: '✨ রিডিম করা হয়েছে',
    navSettings: 'সেটিংস',
    navSettingsDesc: 'ভাষা, শব্দ ও ব্যক্তিগত পছন্দ পরিবর্তন করুন',
    settingsLanguage: 'ভাষা',

    // Caregiver Banner
    caregiver: {
      connected: 'তত্ত্বাবধায়ক সংযুক্ত',
      status: 'রাজ দাস (পুত্র) · সংযুক্ত',
      viewReport: 'যত্ন রিপোর্ট দেখুন'
    },

    // Welcome Hero
    hero: {
      greeting: 'সুপ্রভাত,',
      welcome_text: 'আপনার দৈনিক স্মৃতি ও সুস্থতার আলয়ে স্বাগতম।',
      tasks_completed: 'দৈনিক কাজ: {total}-এর মধ্যে {completed} সম্পন্ন',
      blossom: '🌸'
    },

    // Quick Actions
    quick: {
      call_loved: 'প্রিয়জনকে কল করুন',
      son_name: 'রাজ দাস (পুত্র)',
      ritual_title: 'দৈনিক নিয়ম',
      ritual_action: '৩-ধাপের নির্দেশিকা →'
    },

    // Scheduled Routine & Medication Card
    routine: {
      badge: 'নির্ধারিত ওষুধের সময়সূচি',
      time: 'সকাল ০৮:৩০ টা',
      medicine_title: 'সকালের রক্তচাপের ওষুধ',
      medicine_instructions: 'ঈষদুষ্ণ জলের সাথে ১টি ট্যাবলেট গ্রহণ করুন',
      mark_done: 'ওষুধ খেয়েছি',
      completed: 'সম্পন্ন ✓',
      snooze: '১৫ মিনিট পর স্মরণ করান',
      coins_reward: '+১০ কয়েন'
    },

    // 5-Emoji Mood Check-in
    mood: {
      question: 'আজ আপনার কেমন লাগছে?',
      great: 'খুব ভালো',
      good: 'ভালো',
      okay: 'স্বাভাবিক',
      low: 'মন খারাপ',
      worried: 'উদ্বিগ্ন',
      feedback_title: '{mood} হিসেবে চিহ্নিত',
      feedback_great: 'আপনার হাসিখুশি মন দেখে আনন্দিত হলাম! প্রফুল্ল মন স্মৃতিচর্চার জন্য শ্রেষ্ঠ।',
      feedback_good: 'আপনার ভালো লাগা দেখে শান্তি পেলাম! মন সক্রিয় রাখলে স্মৃতি সতেজ থাকে।',
      feedback_okay: 'একটি শান্ত স্নিগ্ধ দিনও ঈশ্বরের আশীর্বাদ। ধীরে শ্বাস নিন ও বিশ্রাম করুন।',
      feedback_low: 'আমরা আপনার পাশে আছি। কোনো চিন্তা করবেন না; আপনার পরিবার আপনাকে খুব ভালোবাসে।',
      feedback_worried: 'শান্তভাবে গভীর শ্বাস নিন। আপনি সম্পূর্ণ নিরাপদ। আপনি কি রাজের সাথে কথা বলতে চান?',
      chip_hornbill: 'হর্নবিল স্মৃতি খেলুন',
      chip_story: 'গল্প স্মরণ খেলা',
      chip_wellness: 'দৈনিক সুস্থতা নির্দেশিকা'
    },

    // Personalized Activity
    activity: {
      subhead: 'আজকের বিশেষ মানসিক অনুশীলন',
      title: 'বাঁশের সুর অনুক্রম',
      category: 'মনোযোগ ও প্যাটার্ন',
      description: 'উজ্জ্বল বাঁশের প্যাডের ছন্দ অনুসরণ করুন',
      reason: 'আপনার প্রফুল্ল মনের জন্য — বাঁশির মিষ্টি ছন্দে আপনার স্মৃতিচর্চা করুন!',
      start_btn: 'অনুশীলন শুরু করুন'
    },

    // Affirmation
    affirmation: {
      header: 'আজকের শুভ ভাবনা',
      badge: 'অনুপ্রেরণা',
      listen: 'শুনুন',
      new: 'নতুন ভাবনা'
    },

    // Saathi Mascot & Drawer
    saathi: {
      name: 'সাথী',
      title: 'সাথী AI সহায়ক',
      subtitle: 'আপনার প্রিয় কণ্ঠ ও স্মৃতি সঙ্গী',
      badge: 'অনলাইন ও প্রস্তুত',
      welcome: 'নমস্কার! আমি সাথী, আপনার স্মৃতি ও সুস্থতার বন্ধু। আজ আপনাকে কীভাবে সাহায্য করতে পারি?',
      placeholder: 'সাথীকে কিছু জিজ্ঞাসা করুন বা 🎤 চাপুন...',
      send: 'পাঠান',
      listening: 'শুনছি...',
      thinking: 'ভাবছি...',
      voice_note: '💡 আপনি যেকোনো সময় বলতে বা লিখতে পারেন। সাথী পড়ে শোনাবে।',
      quick_meds: '💊 আমার ওষুধের সময় কখন?',
      quick_sos: '🚨 জরুরি SOS সাহায্য',
      quick_game: '🎋 বাঁশের সুর খেলুন',
      quick_tips: '🌻 আজকের শুভ চিন্তা'
    },

    // Quick Navigation Grid
    grid: {
      header: 'দ্রুত নেভিগেশন',
      games: 'খেলার কেন্দ্র',
      lifestory: 'জীবন কথা',
      entertainment: 'বিনোদন',
      family: 'পারিবারিক খেলা',
      stars: 'সাপ্তাহিক তারা',
      wellness: 'সুস্থতা',
      reminders: 'স্মারক',
      medicines: 'ওষুধপত্র',
      emergency: 'জরুরি সাহায্য',
      rewards: 'পুরস্কার ও ব্যাজ',
      settings: 'সেটিংস'
    },

    // Games Common
    gamesTitle: 'মানসিক খেলা',
    gamesSubtitle: 'মন সতেজ রাখতে একটি খেলা বেছে নিন',
    play: 'খেলুন',
    score: 'স্কোর',
    accuracy: 'নির্ভুলতা',
    difficulty: 'কঠিনতা',
    easy: 'সহজ',
    medium: 'মাঝারি',
    hard: 'কঠিন',
    playAgain: 'আবার খেলুন',
    exitToHub: 'খেলার কেন্দ্রে ফিরুন',
    hints: 'ইঙ্গিত',
    time: 'সময়',
    coinsEarned: 'অর্জিত কয়েন',
    startGame: 'খেলা শুরু করুন',
    gameOver: 'খেলা সমাপ্ত!',

    // Game Titles & Details
    g1Title: 'হর্নবিল স্মৃতি বাসা',
    g1Desc: 'প্রকৃতি কার্ডের জোড়া মেলান',
    g1Tag: 'স্মৃতি',
    g1Instruction: 'একই কার্ডের জোড়া খুঁজে বের করুন',

    g2Title: 'স্মৃতির মুহূর্ত',
    g2Desc: 'গল্পের ক্রমটি মনে রাখুন',
    g2Tag: 'স্মৃতি',
    g2Instruction: 'গল্পের ঘটনাগুলি ক্রমানুসারে মনে রাখুন',

    g3Title: 'পরিচিত মুখ',
    g3Desc: 'প্রিয়জনদের চিনুন',
    g3Tag: 'পরিচয়',
    g3Instruction: 'আপনার ভালোবাসার মানুষদের শনাক্ত করুন',

    g4Title: 'আমার বাড়ি মনে রাখুন',
    g4Desc: 'ঘরের জিনিসপত্র মনে রাখুন',
    g4Tag: 'স্থানিক স্মৃতি',
    g4Instruction: 'জিনিসগুলি কোথায় ছিল তা মনে রাখুন',

    g5Title: 'আমার দৈনন্দিন নিয়ম',
    g5Desc: 'দৈনিক কাজগুলি সঠিক ক্রমে সাজান',
    g5Tag: 'নিয়ম',
    g5Instruction: 'নিয়মিত কাজগুলি একের পর এক সাজান',

    g6Title: 'শুনুন ও মনে রাখুন',
    g6Desc: 'মন দিয়ে শুনে উত্তর দিন',
    g6Tag: 'মনোযোগ',
    g6Instruction: 'শব্দ শুনুন এবং সঠিক উত্তরটি বাছুন',

    g7Title: 'বাঁশের সুর অনুক্রম',
    g7Desc: 'উজ্জ্বল নকশা অনুসরণ করুন',
    g7Tag: 'প্যাটার্ন স্মৃতি',
    g7Instruction: 'আলো জ্বলা প্যাডগুলি দেখে অনুক্রম পুনরাবৃত্তি করুন'
  },

  as: {
    // App & Branding
    appName: 'স্মৃতি',
    appTagline: 'দৈনিক স্মৃতি আৰু সুস্থতাৰ আশ্ৰয়স্থল',
    welcome: 'স্বাগতম',
    hello: 'নমস্কাৰ',
    greeting: 'আহক আজি মনটো সতেজ কৰোঁ!',
    logout: 'লগ আউট',
    settings: 'ছেটিংছ',
    back: 'উভতি যাওক',
    close: 'বন্ধ কৰক',
    save: 'সংৰক্ষণ',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত',
    loading: 'লোড হৈ আছে...',

    // Header & Status
    status: {
      online: 'অনলাইন',
      offline: 'অফলাইন মোড'
    },
    nav: {
      home: 'ঘৰ',
      games: 'খেল',
      memories: 'স্মৃতি',
      wellness: 'সুস্থতা',
      progress: 'অগ্ৰগতি',
      settings: 'ছেটিংছ',
      caregiver: 'তত্ত্বাৱধায়ক',
      sound: 'সুৰ',
      voice: 'মাত',
      sos: 'জৰুৰী'
    },
    coins: 'মুদ্ৰা',
    redeemed: '✨ ৰিডিম কৰা হ\'ল',
    navSettings: 'ছেটিংছ',
    navSettingsDesc: 'ভাষা, মাত আৰু পছন্দসমূহ সলনি কৰক',
    settingsLanguage: 'ভাষা',

    // Caregiver Banner
    caregiver: {
      connected: 'তত্ত্বাৱধায়ক সংযুক্ত',
      status: 'ৰাজ দাস (পুত্ৰ) · সংযুক্ত',
      viewReport: 'তত্ত্বাৱধান প্ৰতিবেদন চাওক'
    },

    // Welcome Hero
    hero: {
      greeting: 'শুভ প্ৰভাত,',
      welcome_text: 'আপোনাৰ দৈনিক স্মৃতি আৰু সুস্থতাৰ আশ্ৰয়স্থললৈ স্বাগতম।',
      tasks_completed: 'দৈনিক কাম: {total} টাৰ ভিতৰত {completed} টা সম্পন্ন',
      blossom: '🌸'
    },

    // Quick Actions
    quick: {
      call_loved: 'আপোনজনক কল কৰক',
      son_name: 'ৰাজ দাস (পুত্ৰ)',
      ritual_title: 'দৈনিক নিয়ম',
      ritual_action: '৩-ধাপৰ নিয়মিকা →'
    },

    // Scheduled Routine & Medication Card
    routine: {
      badge: 'নিৰ্ধাৰিত ঔষধৰ সোঁৱৰণী',
      time: 'পুৱা ০৮:৩০ বজাত',
      medicine_title: 'পুৱাৰ ৰক্তচাপৰ ঔষধ',
      medicine_instructions: 'কুহুমীয়া পানীৰে ১টা বড়ি খাওক',
      mark_done: 'ঔষধ খালোঁ',
      completed: 'সম্পন্ন ✓',
      snooze: '১৫ মিনিট পাছত মনত পেলাব',
      coins_reward: '+১০ মুদ্ৰা'
    },

    // 5-Emoji Mood Check-in
    mood: {
      question: 'আজি আপোনাৰ মনটো কেনে আছে?',
      great: 'অতি উত্তম',
      good: 'ভাল',
      okay: 'সাধাৰণ',
      low: 'মন মৰা',
      worried: 'চিন্তিত',
      feedback_title: '{mood} হিচাপে চিহ্নিত',
      feedback_great: 'আপোনাৰ মুখৰ হাঁহি দেখি বৰ আনন্দ পালোঁ! সতেজ মন স্মৃতি অনুশীলনৰ বাবে অতি উত্তম।',
      feedback_good: 'আপোনাৰ মনটো ভাল দেখি শান্তি পালোঁ! মগজু সক্ৰিয় ৰাখিলে স্মৃতিশক্তি সুদৃঢ় হয়।',
      feedback_okay: 'এটা শান্ত আৰু সহজ দিনো ঈশ্বৰৰ আশীৰ্বাদ। শান্তভাৱে দীঘলকৈ উশাহ লওক।',
      feedback_low: 'আমি আপোনাৰ কাষতে আছোঁ। চিন্তা নকৰিব; আপোনাৰ পৰিয়ালে আপোনাক বৰ মৰম কৰে।',
      feedback_worried: 'অনুগ্ৰহ কৰি শান্ত থাকক। আপুনি সম্পূৰ্ণ সুৰক্ষিত। আপুনি ৰাজৰ লগত কথা পাতিব নেকি?',
      chip_hornbill: 'ধনেশ পক্ষীৰ খেল',
      chip_story: 'কাহিনী স্মৰণ খেল',
      chip_wellness: 'দৈনিক সুস্থতা নিয়ম'
    },

    // Personalized Activity
    activity: {
      subhead: 'আজিৰ বিশেষ মানসিক অনুশীলন',
      title: 'বাঁহৰ সুৰ অনুক্ৰম',
      category: 'মনোযোগ আৰু বিন্যাস',
      description: 'উজ্বল বাঁহৰ ছন্দ অনুসৰণ কৰক',
      reason: 'আপোনাৰ আনন্দময় মনৰ বাবে — বাঁহীৰ সুমধুৰ সুৰেৰে স্মৃতি সতেজ কৰক!',
      start_btn: 'অনুশীলন আৰম্ভ কৰক'
    },

    // Affirmation
    affirmation: {
      header: 'আজিৰ শুভ চিন্তা',
      badge: 'অনুভৱ',
      listen: 'শুনক',
      new: 'নতুন চিন্তা'
    },

    // Saathi Mascot & Drawer
    saathi: {
      name: 'সাথী',
      title: 'সাথী AI সহায়ক',
      subtitle: 'আপোনাৰ মৰমিয়াল কণ্ঠ আৰু স্মৃতি সংগী',
      badge: 'অনলাইন আৰু প্ৰস্তুত',
      welcome: 'নমস্কাৰ! মই সাথী, আপোনাৰ মৰমৰ সংগী। আজি আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?',
      placeholder: 'সাথীক কিবা সোধক বা 🎤 টিপক...',
      send: 'প্ৰেৰণ',
      listening: 'শুনি আছোঁ...',
      thinking: 'ভাবি আছোঁ...',
      voice_note: '💡 আপুনি যিকোনো সময়তে ক’ব বা লিখিব পাৰে। সাথীয়ে মাত মাতি উত্তৰ দিয়ে।',
      quick_meds: '💊 মোৰ ঔষধৰ সময় কেতিয়া?',
      quick_sos: '🚨 জৰুৰীকালীন SOS সহায়',
      quick_game: '🎋 বাঁহৰ খেল খেলক',
      quick_tips: '🌻 আজিৰ শুভ চিন্তা'
    },

    // Quick Navigation Grid
    grid: {
      header: 'দ্ৰুত দিশনিৰ্দেশ',
      games: 'খেলৰ কেন্দ্ৰ',
      lifestory: 'জীৱন কাহিনী',
      entertainment: 'মনোৰঞ্জন',
      family: 'পৰিয়ালৰ খেল',
      stars: 'সাপ্তাহিক তৰা',
      wellness: 'সুস্থতা',
      reminders: 'সোঁৱৰণী',
      medicines: 'ঔষধপাতি',
      emergency: 'জৰুৰী সহায়',
      rewards: 'পুৰস্কাৰ আৰু বেজ',
      settings: 'ছেটিংছ'
    },

    // Games Common
    gamesTitle: 'মানসিক খেল',
    gamesSubtitle: 'মন সতেজ ৰাখিবলৈ খেল বাছক',
    play: 'খেলক',
    score: 'স্ক’ৰ',
    accuracy: 'শুদ্ধতা',
    difficulty: 'কঠিনতা',
    easy: 'সহজ',
    medium: 'মজলীয়া',
    hard: 'টান',
    playAgain: 'পুনৰ খেলক',
    exitToHub: 'খেলৰ কেন্দ্ৰলৈ উভতি যাওক',
    hints: 'ইংগিত',
    time: 'সময়',
    coinsEarned: 'অৰ্জিত মুদ্ৰা',
    startGame: 'খেল আৰম্ভ কৰক',
    gameOver: 'খেল সমাপ্ত!',

    // Game Titles & Details
    g1Title: 'ধনেশ পক্ষীৰ স্মৃতি বাহ',
    g1Desc: 'প্ৰকৃতিৰ কাৰ্ডৰ যোৰ মিলোৱা খেল',
    g1Tag: 'স্মৃতি',
    g1Instruction: 'একে কাৰ্ডৰ যোৰ বিচাৰি উলিয়াওক',

    g2Title: 'স্মৃতিৰ মুহূৰ্ত',
    g2Desc: 'কাহিনীৰ ক্ৰমটো মনত ৰাখক',
    g2Tag: 'স্মৃতি',
    g2Instruction: 'কাহিনীৰ ঘটনাৱলী ক্ৰমানুসাৰে মনত পেলাওক',

    g3Title: 'চিনাকি মুখ',
    g3Desc: 'আপোনজনক চিনাক্ত কৰক',
    g3Tag: 'চিনাকি',
    g3Instruction: 'আপোনাৰ পৰিয়াল আৰু মৰমৰ ব্যক্তিসকলক চিনক',

    g4Title: 'মোৰ ঘৰ মনত পেলাওক',
    g4Desc: 'কোঠাৰ সামগ্ৰী মনত ৰাখক',
    g4Tag: 'স্থানিক স্মৃতি',
    g4Instruction: 'সামগ্ৰীসমূহ ক’ত আছিল মনত পেলাওক',

    g5Title: 'মোৰ দৈনন্দিন নিয়ম',
    g5Desc: 'দৈনিক নিয়মবোৰ ক্ৰমত সজাওক',
    g5Tag: 'নিয়মিকা',
    g5Instruction: 'নিয়মীয়া কামবোৰ এটাৰ পাছত এটাকৈ সজাওক',

    g6Title: 'শুনক আৰু মনত ৰাখক',
    g6Desc: 'মন দি শুনি উত্তৰ দিয়ক',
    g6Tag: 'মনোযোগ',
    g6Instruction: 'মাত শুনক আৰু সঠিক উত্তৰ বাছক',

    g7Title: 'বাঁহৰ সুৰ অনুক্ৰম',
    g7Desc: 'উজ্বল বিন্যাস অনুসৰণ কৰক',
    g7Tag: 'বিন্যাস স্মৃতি',
    g7Instruction: 'পোহৰ হোৱা বাঁহৰ পেড চাই অনুক্ৰম পুনৰাবৃত্তি কৰক'
  },

  mni: {
    // App & Branding
    appName: 'স্মৃতি',
    appTagline: 'নুমিৎ খুদিংগী নিংসিংবা অমসুং হকশেলগী মফম',
    welcome: 'তরাম্না ওকচরি',
    hello: 'খুরুমজরি',
    greeting: 'ঙসি ঐখোই পুন্না ৱাখলবু চেকশিনহনসি!',
    logout: 'লোগ আউৎ',
    settings: 'সেটিংস',
    back: 'হঞ্জিনবা',
    close: 'থিংশিনবা',
    save: 'কনবা',
    cancel: 'তোকপা',
    confirm: 'চেকশিনবা',
    loading: 'লোদ তৌরি...',

    // Header & Status
    status: {
      online: 'ওনলাইন',
      offline: 'ওফলাইন মোদ'
    },
    nav: {
      home: 'য়ুম',
      games: 'শান্নপোৎ',
      memories: 'নীংসিংবা',
      wellness: 'হকশেল',
      progress: 'মাংজিল থাবা',
      settings: 'সেটিংস',
      caregiver: 'সেনবীবা',
      sound: 'খোল্লাও',
      voice: 'খোন্থোক',
      sos: 'অৱাবা'
    },
    coins: 'শেনয়েক',
    redeemed: '✨ লৌখৎলে',
    navSettings: 'সেটিংস',
    navSettingsDesc: 'লোন অমসুং অপাম্বশিং শেমদোকপা',
    settingsLanguage: 'লোন',

    // Caregiver Banner
    caregiver: {
      connected: 'সেনবীবা শম্নরে',
      status: 'রাজ দাস (মচা) · শম্নরে',
      viewReport: 'রিপোর্ত য়েংবা'
    },

    // Welcome Hero
    hero: {
      greeting: 'অয়ুক্কী খুরুমজরি,',
      welcome_text: 'নুমিৎ খুদিংগী নিংসিংবা অমসুং হকশেলগী মফমদা তরাম্না ওকচরি।',
      tasks_completed: 'নুমিৎকী থবক: {total} গী মনুংদা {completed} লোইরে',
      blossom: '🌸'
    },

    // Quick Actions
    quick: {
      call_loved: 'নংশিবা মীবু কোল তৌবা',
      son_name: 'রাজ দাস (মচা)',
      ritual_title: 'নুমিৎ খুদিংগী থবক',
      ritual_action: 'খোঙথাং ৩ গী লমজিং →'
    },

    // Scheduled Routine & Medication Card
    routine: {
      badge: 'হিদাক্কী নুমিৎ ৱাফম',
      time: 'অয়ুক ০৮:৩০ পুং',
      medicine_title: 'অয়ুক্কী বিপি হিদাক',
      medicine_instructions: 'ঈশিং চাবা ঈশিংগা লোয়ননা হিদাক ১ চাবা',
      mark_done: 'হিদাক চারে',
      completed: 'লোইরে ✓',
      snooze: 'মিনিত ১৫ কনবা',
      coins_reward: '+১০ শেনয়েক'
    },

    // 5-Emoji Mood Check-in
    mood: {
      question: 'ঙসি অদোমগী নুংঙাইবরা?',
      great: 'য়াম্না ফৈ',
      good: 'ফৈ',
      okay: 'চপ চাৈ',
      low: 'পুকনিং নুংঙাইতে',
      worried: 'ৱাজরি',
      feedback_title: '{mood} ওইনা খংলে',
      feedback_great: 'নহাক্কী হরাওবা উবদা থম্মোই নুংঙাইজেই! মসি ৱাখল চেৎহন্নবা ফবা মতমনি।',
      feedback_good: 'নুংঙাইবা ফাওবা উবদা থম্মোই হরাওই! মসি ৱাখলবু পাঙ্গল হাপ্পা ওইগনি।',
      feedback_okay: 'তন্থানা লৈবা নুমিৎ অসিমসু ইপা ঈশ্বরগী থৌজালনি। তপথনা হিংবা চাউই।',
      feedback_low: 'ঐখোই পুম্নমক নহাক্কা লোয়ননা লৈরি। ৱাবীরগনু; নহাক্কী ইমুংনা নহাকপু য়াম্না নংশি।',
      feedback_worried: 'থরোইনা লুনা ঈশিং থমদুনা শ্বাশ লৌবীয়ু। অদোম সুৰক্ষিতনি। রাজদা কোল তৌসিরা?',
      chip_hornbill: 'হোর্নবীল শান্নবা',
      chip_story: 'ৱারী নীংসিংবা',
      chip_wellness: 'হকশেলগী লমজিং'
    },

    // Personalized Activity
    activity: {
      subhead: 'ঙসিগী তোপ তোপ্পা ৱাখলগী থবক',
      title: 'ৱাগী খোন্থোক অনুক্রম',
      category: 'ৱাখল চেৎহনবা',
      description: 'মৈঙাল থোকপা ৱাগী পীদশিংগী মতুং ইনবা',
      reason: 'নহাক্কী হরাওবা ৱাখলগীদমক — ৱাগী সুরদা নিংসিংবা চেৎহল্লু!',
      start_btn: 'শান্নবা হৌবা'
    },

    // Affirmation
    affirmation: {
      header: 'ঙসিগী অফবা ৱাফম',
      badge: 'ইন্সপিরেশন',
      listen: 'তাবা',
      new: 'অনৌবা ৱাফম'
    },

    // Saathi Mascot & Drawer
    saathi: {
      name: 'সাথী',
      title: 'সাথী AI মরুপ',
      subtitle: 'নহাক্কী খ্বাইদগী নংশিবা খোন্থোক অমসুং নিংসিংগী মরুপ',
      badge: 'ওনলাইন লৈরে',
      welcome: 'খুরুমজরি! ঐ সাথীনি, নহাক্কী নিংসিংবা অমসুং হকশেলগী মরুপনি। ঙসি ঐনা করম্না মতেং পাংগে?',
      placeholder: 'সাথীদা হংবীয়ু নত্রগা 🎤 নম্মু...',
      send: 'থাবা',
      listening: 'তাজরি...',
      thinking: 'খল্লি...',
      voice_note: '💡 অদোমনা ৱা ঙাংবা নত্রগা ইবা য়াই। সাথীনা তাবা অমসুং পারকপা য়াগনি।',
      quick_meds: '💊 ঐগী হিদাক্কী মতম করম্বা?',
      quick_sos: '🚨 অৱাবা SOS মতেং',
      quick_game: '🎋 ৱাগী সুর শান্নবা',
      quick_tips: '🌻 ঙসিগী অফবা ৱাফম'
    },

    // Quick Navigation Grid
    grid: {
      header: 'থুনা চৎপগী মফম',
      games: 'শান্নপোৎ লৈফম',
      lifestory: 'পুন্সী ৱারী',
      entertainment: 'নুংঙাইবা',
      family: 'ইমুংগী শান্নবা',
      stars: 'চয়োলগী থৌজান',
      wellness: 'হকশেল',
      reminders: 'নীংসিংহনবা',
      medicines: 'হিদাক-লাংথক',
      emergency: 'অৱাবা মতেং',
      rewards: 'মনা অমসুং মেদল',
      settings: 'সেটিংস'
    },

    // Games Common
    gamesTitle: 'ৱাখলগী শান্নপোৎ',
    gamesSubtitle: 'ৱাখল চেৎহন্নবা শান্নপোৎ অমা খনবীয়ু',
    play: 'শান্নবা',
    score: 'স্কোর',
    accuracy: 'চুম্বা',
    difficulty: 'লূবা',
    easy: 'লাইবা',
    medium: 'চপ চাবা',
    hard: 'লূবা',
    playAgain: 'অমুক শান্নবা',
    exitToHub: 'শান্নফমদা হঞ্জিনবা',
    hints: 'ইঙ্গিৎ',
    time: 'মতম',
    coinsEarned: 'ফংলবা শেনয়েক',
    startGame: 'শান্নবা হৌবা',
    gameOver: 'শান্নবা লোইরে!',

    // Game Titles & Details
    g1Title: 'হোর্নবীল নীংসিং বাহ',
    g1Desc: 'মহৌশাগী কাৰ্দশিং মিল্লু',
    g1Tag: 'নীংসিংবা',
    g1Instruction: 'চপ মান্নবা কাৰ্দশিং পুন্না থিরু',

    g2Title: 'নীংসিংগী পুংফম',
    g2Desc: 'ৱারীগী খোঙথাং নিংসিংলু',
    g2Tag: 'নীংসিংবা',
    g2Instruction: 'ৱারীগী থবকশিং মতুং ইন্না নীংসিংলু',

    g3Title: 'চিনাকপা মমাই',
    g3Desc: 'নংশিরবা মীওইশিং খঙদোকলু',
    g3Tag: 'শকখঙবা',
    g3Instruction: 'নহাক্কী ইমুংগী মীওইশিং খঙদোকলু',

    g4Title: 'ঐগী য়ুম নীংসিংবা',
    g4Desc: 'কাগী পোৎলমশিং নীংসিংলু',
    g4Tag: 'মফম নীংসিংবা',
    g4Instruction: 'পোৎলমশিং কদায়দা লৈবগে খঙলু',

    g5Title: 'ঐগী নুমিৎ থবক',
    g5Desc: 'নুমিৎকী থবকশিং মতুং ইন্না থম্মু',
    g5Tag: 'নিয়ম',
    g5Instruction: 'নুমিৎকী খোঙথাংশিং চুম্না শেমজিল্লু',

    g6Title: 'তাবা অমসুং নীংসিংবা',
    g6Desc: 'মন থাদুনা তারগা পাউখুম পীবীয়ু',
    g6Tag: 'মন থাবা',
    g6Instruction: 'খোন্থোক তারগা অচুম্বা পাউখুম খনবীয়ু',

    g7Title: 'ৱাগী সুর অনুক্রম',
    g7Desc: 'ঙাল্লবা ৱাগী মতুং ইনবা',
    g7Tag: 'সুর নীংসিংবা',
    g7Instruction: 'ঙাল্লবা ৱাগী পীদশিং য়েংদুনা অমুক হন্না তৌবীয়ু'
  },

  brx: {
    // App & Branding
    appName: 'स्मृति',
    appTagline: 'सानफ्रोमबोनि गोसोखां आरो देहा फोसाबनाय',
    welcome: 'बरायबाय',
    hello: 'खुलुमबाय',
    greeting: 'फै दिनै जोंनि गोसोखौ सांग्रां खालामनो!',
    logout: 'लग आउत',
    settings: 'सेटिंफोर',
    back: 'उदां',
    close: 'बन्द खालाम',
    save: 'दोनथुम',
    cancel: 'नेरसिन',
    confirm: 'थार खालाम',
    loading: 'लोड जाबाय दं...',

    // Header & Status
    status: {
      online: 'अनलाइन',
      offline: 'अफलाइन मड'
    },
    nav: {
      home: 'नखर',
      games: 'गेलेनाय',
      memories: 'गोसोखांथि',
      wellness: 'देहा',
      progress: 'थांखि',
      settings: 'सेटिंफोर',
      caregiver: 'सामलायगिरि',
      sound: 'खोन्दो',
      voice: 'राव',
      sos: 'आपद'
    },
    coins: 'सिक्काफोर',
    redeemed: '✨ दाबि खालामबाय',
    navSettings: 'सेटिंफोर',
    navSettingsDesc: 'राव, सोंनाय आरो गावनि मोजां मोननाय मिलाय',
    settingsLanguage: 'राव',

    // Caregiver Banner
    caregiver: {
      connected: 'सामलायगिरि दाजाबाय',
      status: 'राज दास (फिसा) · दाजाबाय',
      viewReport: 'सामलायनाय रिपर्ट नाय'
    },

    // Welcome Hero
    hero: {
      greeting: 'फुंनि खुलुमबाय,',
      welcome_text: 'नोंथांनि सानफ्रोमबोनि गोसोखां आरो देहा फोसाबनायाव बरायबाय।',
      tasks_completed: 'साननि मावनाय: {total} नि गेजेराव {completed} जोबबाय',
      blossom: '🌸'
    },

    // Quick Actions
    quick: {
      call_loved: 'मोजां मोननायखौ कल खालाम',
      son_name: 'राज दास (फिसा)',
      ritual_title: 'सानफ्रोमबोनि नियम',
      ritual_action: '३-आगोमोन लामदिन्थि →'
    },

    // Scheduled Routine & Medication Card
    routine: {
      badge: 'थिसननाय मुलिनि समा',
      time: 'फुं ०८:३० रिंगायाव',
      medicine_title: 'फुंनि बिपि मुलि',
      medicine_instructions: 'दुंहासु दैजों १ टाब्लित लों',
      mark_done: 'मुलि जाबाय',
      completed: 'जोबबाय ✓',
      snooze: '१५ मिनिट उनाव गोसोखांहो',
      coins_reward: '+१० सिक्का'
    },

    // 5-Emoji Mood Check-in
    mood: {
      question: 'दिनै नोंथांनि गोसोआ माबोरै दं?',
      great: 'जोबोर मोजां',
      good: 'मोजां',
      okay: 'सादारन',
      low: 'गोसो गाज्रि',
      worried: 'चिन्ता',
      feedback_title: '{mood} हिसाबै सिनथाबाय',
      feedback_great: 'नोंथांनि रंजानाय गोसो नुनानै मोजां मोनबाय! मोजां गोसोआ गोसोखांथि गेलेनायनि थाखाय जोबोर मोजां।',
      feedback_good: 'नोंथांनि मोजां गोसोआ जोबोर सांग्रां! गोसोखौ हुदा खालामब्ला गोसोखांथि मोजां जायो।',
      feedback_okay: 'गोजोन सान आबो इसोरनि बान्था। लासै लासै हां ला आरो जिराय।',
      feedback_low: 'जों नोंथांनि सेराव दं। जेबो दागिन; नखरनि मानसिफोरा नोंखौ मोजां मोनो।',
      feedback_worried: 'गोजोनै गोथौ हां ला। नोंथाङा रैखाथि दं। राजजों रायलायनो सानो नामा?',
      chip_hornbill: 'हर्नबिल गोसोखांथि गेले',
      chip_story: 'सल’ गोसोखां गेले',
      chip_wellness: 'सानफ्रोमबोनि देहा लामदिन्थि'
    },

    // Personalized Activity
    activity: {
      subhead: 'दिनैनि जुनिया गोसोनि गेलेनाय',
      title: 'औवा सुर अनुक्रम',
      category: 'गोसो होनाय आरो महर',
      description: 'गोजों औवा प्याडनि रोखोमखो उनसं',
      reason: 'नोंथांनि रंजानाय गोसोनि थाखाय — औवा सुरा गोसोखांथिखौ मोजां खालामगोन!',
      start_btn: 'गेलेनाय जागाय'
    },

    // Affirmation
    affirmation: {
      header: 'दिनैनि मोजां साननाय',
      badge: 'सोंनाय',
      listen: 'खोनासोन',
      new: 'गोदान साननाय'
    },

    // Saathi Mascot & Drawer
    saathi: {
      name: 'साथी',
      title: 'साथी AI लोगो',
      subtitle: 'नोंथांनि मोजां राव आरो गोसोखां लोगो',
      badge: 'अनलाइन आरो थियारि',
      welcome: 'खुलुमबाय! आं साथी, नोंथांनि गोसोखांथि आरो देहानि लोगो। दिनै आं मा हेफाजाब होनो हागौ?',
      placeholder: 'साथीखौ सों एबा 🎤 थु...',
      send: 'थिनहर',
      listening: 'खोनासन्दों...',
      thinking: 'सानदों...',
      voice_note: '💡 नोंथाङा बुंनो एबा लिरनो हागोन। साथीया फरायना खोनासंलांगोन।',
      quick_meds: '💊 आंनि मुलि लोंनाय समा माब्ला?',
      quick_sos: '🚨 आपद SOS हेफाजाब',
      quick_game: '🎋 औवा सुर गेले',
      quick_tips: '🌻 दिनैनि मोजां साननाय'
    },

    // Quick Navigation Grid
    grid: {
      header: 'थाब थांनाय लामा',
      games: 'गेलेग्रा जायगा',
      lifestory: 'जिउ सल’',
      entertainment: 'रंजानाय',
      family: 'नखर गेलेनाय',
      stars: 'सप्तानि हाथर्खि',
      wellness: 'देहा',
      reminders: 'गोसोखांहोग्रा',
      medicines: 'मुलिफोर',
      emergency: 'आपद हेफाजाब',
      rewards: 'बान्था आरो मेदेल',
      settings: 'सेटिंफोर'
    },

    // Games Common
    gamesTitle: 'गोसोनि गेलेनाय',
    gamesSubtitle: 'गोसो मोजां थानो मोनसे गेलेनाय सायख’',
    play: 'गेले',
    score: 'अंक',
    accuracy: 'थारथि',
    difficulty: 'गोब्राब',
    easy: 'गोरलै',
    medium: 'गेजेर',
    hard: 'गोब्राब',
    playAgain: 'आरो गेले',
    exitToHub: 'गेलेग्रायाव थांफिन',
    hints: 'इसारा',
    time: 'समा',
    coinsEarned: 'मोननाय सिक्का',
    startGame: 'गेलेनाय जागाय',
    gameOver: 'गेलेनाय जोबबाय!',

    // Game Titles & Details
    g1Title: 'हर्नबिल गोसोखां बासा',
    g1Desc: 'मिथिंगा खार्दनि ज’रा मिलाय',
    g1Tag: 'गोसोखां',
    g1Instruction: 'रोखोमसे खार्दनि ज’रा नागिर',

    g2Title: 'गोसोखां समा',
    g2Desc: 'सल’नि रोखोमखौ गोसोआव लाबो',
    g2Tag: 'गोसोखां',
    g2Instruction: 'सल’नि जाथायखौ फारि फारि गोसोखां',

    g3Title: 'सिनाय मोखां',
    g3Desc: 'मोजां मोननायफोरखौ सिनाय',
    g3Tag: 'सिनायथि',
    g3Instruction: 'नोंथांनि नखरनि मानसिफोरखौ सिनाय',

    g4Title: 'आंनि नखौ गोसोखां',
    g4Desc: 'खथायाव थानाय बेसादखौ गोसोखां',
    g4Tag: 'जायगा गोसोखां',
    g4Instruction: 'बेसादफोरा बबेयाव दंमोन गोसोखां',

    g5Title: 'आंनि साननि नियम',
    g5Desc: 'साननि मावनायखौ थार फारियै साजाय',
    g5Tag: 'नियम',
    g5Instruction: 'सानफ्रोमबोनि मावनायखौ फारि फारि साजाय',

    g6Title: 'खोनासोन आरो गोसोखां',
    g6Desc: 'गोसो होना खोनासनानै फिननाय हो',
    g6Tag: 'गोसो होनाय',
    g6Instruction: 'राव खोनासनानै थार फिननाय सायख’',

    g7Title: 'औवा सुर अनुक्रम',
    g7Desc: 'गोजों औवा महरखौ उनसं',
    g7Tag: 'महर गोसोखां',
    g7Instruction: 'गोजों औवा प्याडफोरखौ नायनानै उनसं'
  },

  ne: {
    // App & Branding
    appName: 'स्मृति',
    appTagline: 'दैनिक स्मृति तथा कल्याण अभयारण्य',
    welcome: 'स्वागतम्',
    hello: 'नमस्ते',
    greeting: 'आउनुहोस् आज आफ्नो मनलाई सक्रिय राखौं!',
    logout: 'लग आउट',
    settings: 'सेटिङहरू',
    back: 'पछाडि',
    close: 'बन्द गर्नुहोस्',
    save: 'बचत गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    confirm: 'पुष्टि गर्नुहोस्',
    loading: 'लोड हुँदैछ...',

    // Header & Status
    status: {
      online: 'अनलाइन',
      offline: 'अफलाइन मोड'
    },
    nav: {
      home: 'गृह',
      games: 'खेलहरू',
      memories: 'सम्झनाहरू',
      wellness: 'कल्याण',
      progress: 'प्रगति',
      settings: 'सेटिङहरू',
      caregiver: 'हेरचाहकर्ता',
      sound: 'सङ्गीत',
      voice: 'आवाज',
      sos: 'आपतकालीन'
    },
    coins: 'सिक्काहरू',
    redeemed: '✨ दाबी गरियो',
    navSettings: 'सेटिङहरू',
    navSettingsDesc: 'भाषा, आवाज र प्राथमिकताहरू मिलाउनुहोस्',
    settingsLanguage: 'भाषा',

    // Caregiver Banner
    caregiver: {
      connected: 'हेरचाहकर्ता जोडिनुभयो',
      status: 'राज दास (छोरा) · जोडिनुभएको छ',
      viewReport: 'हेरचाह रिपोर्ट हेर्नुहोस्'
    },

    // Welcome Hero
    hero: {
      greeting: 'शुभ प्रभात,',
      welcome_text: 'हजुरको दैनिक स्मृति र कल्याण अभयारण्यमा हार्दिक स्वागत छ।',
      tasks_completed: 'दैनिक कार्यहरू: {total} मध्ये {completed} पूरा भयो',
      blossom: '🌸'
    },

    // Quick Actions
    quick: {
      call_loved: 'आफ्नालाई कल गर्नुहोस्',
      son_name: 'राज दास (छोरा)',
      ritual_title: 'दैनिक नियम',
      ritual_action: '३-चरणको मार्गनिर्देशन →'
    },

    // Scheduled Routine & Medication Card
    routine: {
      badge: 'निर्धारित औषधिको तालिका',
      time: 'बिहान ०८:३० बजे',
      medicine_title: 'बिहानको रक्तचापको औषधि',
      medicine_instructions: 'मनतातो पानीसँग १ चक्की खानुहोस्',
      mark_done: 'औषधि खाएँ',
      completed: 'पूरा भयो ✓',
      snooze: '१५ मिनेटपछि सम्झाउनुहोस्',
      coins_reward: '+१० सिक्का'
    },

    // 5-Emoji Mood Check-in
    mood: {
      question: 'आज हजुरलाई कस्तो महसुस भइरहेको छ?',
      great: 'धेरै राम्रो',
      good: 'राम्रो',
      okay: 'सामान्य',
      low: 'उदास',
      worried: 'चिन्तित',
      feedback_title: '{mood} रूपमा दर्ता भयो',
      feedback_great: 'हजुरको मुस्कुराउँदो मुहार देखेर खुसी लाग्यो! सकारात्मक सोच स्मरण अभ्यासका लागि उत्तम हुन्छ।',
      feedback_good: 'हजुरलाई राम्रो भएको देखेर शान्ति मिल्यो! मन सक्रिय राख्नाले स्मरणशक्ति ताजा रहन्छ।',
      feedback_okay: 'शान्त दिन पनि ईश्वरको उपहार हो। बिस्तारै गहिरो श्वास लिनुहोस् र आराम गर्नुहोस्।',
      feedback_low: 'हामी हजुरकै साथमा छौं। कुनै चिन्ता नलिनुहोस्; परिवारले हजुरलाई धेरै माया गर्छ।',
      feedback_worried: 'शान्त भएर गहिरो श्वास लिनुहोस्। हजुर पूर्ण सुरक्षित हुनुहुन्छ। के राजसँग कुरा गर्न चाहनुहुन्छ?',
      chip_hornbill: 'हर्नबिल स्मृति खेल्नुहोस्',
      chip_story: 'कथा स्मरण खेल',
      chip_wellness: 'दैनिक स्वास्थ्य मार्गनिर्देशन'
    },

    // Personalized Activity
    activity: {
      subhead: 'आजको विशेष स्मरण अभ्यास',
      title: 'बाँसको धुन अनुक्रम',
      category: 'ध्यान र ढाँचा',
      description: 'चम्किला बाँसका प्याडहरूको लय पछ्याउनुहोस्',
      reason: 'हजुरको प्रफुल्ल मनका लागि — बाँसुरीको मीठो धुनमा आफ्नो स्मरण अभ्यास गर्नुहोस्!',
      start_btn: 'अभ्यास सुरु गर्नुहोस्'
    },

    // Affirmation
    affirmation: {
      header: 'आजको शुभ विचार',
      badge: 'प्रेरणा',
      listen: 'सुन्नुहोस्',
      new: 'नयाँ विचार'
    },

    // Saathi Mascot & Drawer
    saathi: {
      name: 'साथी',
      title: 'साथी AI सहायक',
      subtitle: 'हजुरको प्यारो आवाज र सम्झनाको साथी',
      badge: 'अनलाइन र तयार',
      welcome: 'नमस्ते! म साथी हुँ, हजुरको स्मृति र कल्याणको मित्र। आज म हजुरको कसरी सेवा गरूँ?',
      placeholder: 'साथीलाई केही सोध्नुहोस् वा 🎤 थिच्नुहोस्...',
      send: 'पठाउनुहोस्',
      listening: 'सुन्दैछु...',
      thinking: 'सोच्दैछु...',
      voice_note: '💡 हजुरले बोल्न वा लेख्न सक्नुहुन्छ। साथीले पढेर सुनाउनेछ।',
      quick_meds: '💊 मेरो औषधिको समय कहिले हो?',
      quick_sos: '🚨 आपतकालीन SOS सहयोग',
      quick_game: '🎋 बाँसको धुन खेल्नुहोस्',
      quick_tips: '🌻 आजको शुभ विचार'
    },

    // Quick Navigation Grid
    grid: {
      header: 'द्रुत नेभिगेसन',
      games: 'खेल केन्द्र',
      lifestory: 'जीवन कथा',
      entertainment: 'मनोरञ्जन',
      family: 'पारिवारिक खेल',
      stars: 'साप्ताहिक तारा',
      wellness: 'कल्याण',
      reminders: 'अनुस्मारक',
      medicines: 'औषधिहरू',
      emergency: 'आपतकालीन सहयोग',
      rewards: 'पुरस्कार र ब्याज',
      settings: 'सेटिङहरू'
    },

    // Games Common
    gamesTitle: 'मानसिक खेलहरू',
    gamesSubtitle: 'मन ताजा राख्न एउटा खेल रोज्नुहोस्',
    play: 'खेल्नुहोस्',
    score: 'स्कोर',
    accuracy: 'शुद्धता',
    difficulty: 'कठिनाई',
    easy: 'सजिलो',
    medium: 'मध्यम',
    hard: 'कठिन',
    playAgain: 'फेरि खेल्नुहोस्',
    exitToHub: 'खेल केन्द्रमा फर्कनुहोस्',
    hints: 'सङ्केत',
    time: 'समय',
    coinsEarned: 'कमाइएका सिक्का',
    startGame: 'खेल सुरु गर्नुहोस्',
    gameOver: 'खेल समाप्त भयो!',

    // Game Titles & Details
    g1Title: 'हर्नबिल स्मृति गुँड',
    g1Desc: 'प्रकृतिका कार्डहरूको जोडी मिलाउनुहोस्',
    g1Tag: 'दृष्टि स्मृति',
    g1Instruction: 'उस्तै कार्डहरूको जोडी खोज्नुहोस्',

    g2Title: 'स्मृतिका पलहरू',
    g2Desc: 'कथाको क्रम सम्झनुहोस्',
    g2Tag: 'कथा स्मरण',
    g2Instruction: 'कथाका घटनाहरूलाई क्रमबद्ध सम्झनुहोस्',

    g3Title: 'परिचित अनुहारहरू',
    g3Desc: 'आफ्ना प्रियजनहरूलाई चिन्नुहोस्',
    g3Tag: 'पहिचान',
    g3Instruction: 'आफ्ना प्यारा मानिसहरूलाई पहिचान गर्नुहोस्',

    g4Title: 'मेरो घर सम्झनुहोस्',
    g4Desc: 'कोठाका सामानहरू सम्झनुहोस्',
    g4Tag: 'स्थानिक स्मृति',
    g4Instruction: 'सामानहरू कहाँ थिए सम्झनुहोस्',

    g5Title: 'मेरो दैनिक तालिका',
    g5Desc: 'दैनिक कार्यहरू सही क्रममा मिलाउनुहोस्',
    g5Tag: 'दैनिक नियम',
    g5Instruction: 'नियमित कामहरू एकपछि अर्को मिलाउनुहोस्',

    g6Title: 'सुन्नुहोस् र सम्झनुहोस्',
    g6Desc: 'ध्यान दिएर सुनेर उत्तर दिनुहोस्',
    g6Tag: 'एकाग्रता',
    g6Instruction: 'आवाज सुनेर सही उत्तर रोज्नुहोस्',

    g7Title: 'बाँसको धुन अनुक्रम',
    g7Desc: 'चम्किलो ढाँचा दोहोर्याउनुहोस्',
    g7Tag: 'ढाँचा स्मृति',
    g7Instruction: 'चम्किएका बाँसका प्याडहरू हेरेर क्रम दोहोर्याउनुहोस्'
  }

};

function getNested(obj, path) {
  if (!obj || !path) return undefined;
  if (obj[path] !== undefined) return obj[path];
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return curr;
}

const I18n = {
  _currentLang: 'en',

  init() {
    this._currentLang = Storage.getLanguage() || 'en';
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this._currentLang;
      document.body.setAttribute('data-lang', this._currentLang);
    }
    this.applyCulturalTheme(this._currentLang);
  },

  get lang() {
    return this._currentLang;
  },

  setLanguage(lang) {
    this._currentLang = lang;
    Storage.setLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.body.setAttribute('data-lang', lang);
    }
    this.applyCulturalTheme(lang);
    this.updateAllText();
  },

  applyCulturalTheme(lang) {
    if (typeof document === 'undefined') return;
    const regionMap = {
      as: 'Assam',
      hi: 'National',
      bn: 'Bengal',
      en: 'Assam',
      mni: 'Manipur',
      brx: 'Bodoland',
      ne: 'Sikkim'
    };
    const targetRegion = regionMap[lang] || Storage.getPreferences()?.regionalState || 'Assam';
    document.body.setAttribute('data-region', targetRegion);
  },

  t(key, vars = {}) {
    if (!key) return '';
    const activeCode = this._currentLang || 'en';
    
    // Check in active language stitchTranslations
    let val = getNested(stitchTranslations[activeCode], key);
    
    // Fallback to English stitchTranslations
    if (val === undefined || val === null) {
      val = getNested(stitchTranslations.en, key);
    }

    if (val === undefined || val === null) {
      val = key;
    }

    let template = typeof val === 'string' ? val : key;

    if (typeof template === 'string' && vars && typeof vars === 'object') {
      Object.keys(vars).forEach(varKey => {
        const regex = new RegExp('{ *' + varKey + ' *}', 'g');
        template = template.replace(regex, vars[varKey]);
      });
    }
    return template;
  },

  updateAllText() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text && text !== key) {
        el.textContent = text;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    const eventPayload = { lang: this._currentLang, language: this._currentLang };
    window.dispatchEvent(new CustomEvent('smriti:languageChanged', { detail: eventPayload }));
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: eventPayload }));
  },

  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'hi', name: 'हिन्दी (Hindi)', native: 'हिन्दी' },
      { code: 'bn', name: 'বাংলা (Bengali)', native: 'বাংলা' },
      { code: 'as', name: 'অসমীয়া (Assamese)', native: 'অসমীয়া' },
      { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)', native: 'মৈতৈলোন্' },
      { code: 'brx', name: 'बड़ो (Bodo)', native: 'बड़ो' },
      { code: 'ne', name: 'नेपाली (Nepali)', native: 'नेपाली' }
    ];
  },
};

export const LanguageContext = {
  currentLanguage: 'en',
  subscribers: new Set(),

  init() {
    this.currentLanguage = Storage.getLanguage() || I18n.lang || 'en';
    I18n.init();
    return this.currentLanguage;
  },

  getLanguage() {
    return I18n.lang || this.currentLanguage || 'en';
  },

  setLanguage(lang) {
    if (!lang) return;
    this.currentLanguage = lang;
    
    // Update I18n engine
    I18n.setLanguage(lang);

    // Dispatch global events for DOM & external listeners
    if (typeof window !== 'undefined') {
      const detail = { lang, language: lang };
      window.dispatchEvent(new CustomEvent('smriti:languageChanged', { detail }));
      window.dispatchEvent(new CustomEvent('languageChanged', { detail }));
    }

    // Notify all subscribed components
    this.notify();
  },

  subscribe(callback) {
    if (typeof callback !== 'function') return () => {};
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  },

  notify() {
    const lang = this.getLanguage();
    this.subscribers.forEach(cb => {
      try {
        cb(lang);
      } catch (e) {
        console.warn('LanguageContext subscriber error:', e);
      }
    });
  },

  t(key, vars = {}) {
    return I18n.t(key, vars);
  },

  getAvailableLanguages() {
    return I18n.getAvailableLanguages();
  }
};

export function useLanguage() {
  return {
    language: LanguageContext.getLanguage(),
    setLanguage: (lang) => LanguageContext.setLanguage(lang),
    t: (key, vars) => LanguageContext.t(key, vars),
    availableLanguages: LanguageContext.getAvailableLanguages()
  };
}

if (typeof window !== 'undefined') {
  window.LanguageContext = LanguageContext;
  window.useLanguage = useLanguage;
}

export default I18n;
