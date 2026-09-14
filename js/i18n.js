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
    hard: 'Hard'
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
    hard: 'कठिन'
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
    hard: 'কঠিন'
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
    hard: 'টান'
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
      en: 'Assam'
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
      { code: 'as', name: 'অসমীয়া (Assamese)', native: 'অসমীয়া' },
      { code: 'hi', name: 'हिन्दी (Hindi)', native: 'हिन्दी' },
      { code: 'bn', name: 'বাংলা (Bengali)', native: 'বাংলা' }
    ];
  }
};

export default I18n;
