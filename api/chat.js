/* ============================================================
   SMRITI — Serverless AI Chat API Route (/api/chat)
   Multi-Tier Resilient Fallback Engine:
     Tier 1: Local RAG (data/qa_knowledge.json)
     Tier 2: Primary LLM (OpenAI gpt-4o-mini with 16 Function Tools)
     Tier 3: Fallback LLM (Google Gemini 1.5 Flash)
     Tier 4: Dynamic Contextual Synthesis Engine
   Strict Persona System Prompt & Language Enforcement.
   ============================================================ */

const OPENAI_TOOLS = [
  {
    type: "function",
    function: {
      name: "getPatientProfile",
      description: "Get the current patient's profile details, stage of impairment, and preferences.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getFamilyMembers",
      description: "Get the list of family members, relations, and emergency contacts.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "getTodayRoutine",
      description: "Get today's scheduled routines, tasks, and completion status.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "createReminder",
      description: "Create a new reminder or medicine task for the patient.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the reminder (e.g., Morning medicine, Drink water)" },
          time: { type: "string", description: "Time in HH:MM format (24h or 12h)" },
          category: { type: "string", description: "Category: medicine, hydration, routine, exercise, appointment" }
        },
        required: ["title", "time"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getGameProgress",
      description: "Get game history, total cognitive sessions, and average accuracy.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "startGame",
      description: "Launch or navigate to a specific cognitive game in SMRITI.",
      parameters: {
        type: "object",
        properties: {
          gameId: {
            type: "string",
            enum: ["hornbill", "memory-moments", "familiar-faces", "remember-home", "my-day", "listen-remember", "bamboo-sequence"],
            description: "Identifier of the game to start"
          }
        },
        required: ["gameId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCurrentDate",
      description: "Get the current date, day, and time in Indian Standard Time (IST).",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "triggerSOS",
      description: "Trigger an emergency SOS alert to caregivers and emergency services.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Optional reason for emergency" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getWeeklyInsights",
      description: "Get cognitive performance trends and weekly insights for the patient or caregiver.",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "updateDifficulty",
      description: "Update the game difficulty setting.",
      parameters: {
        type: "object",
        properties: {
          level: { type: "string", enum: ["easy", "medium", "hard"], description: "Difficulty level" }
        },
        required: ["level"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "updateLanguage",
      description: "Change the platform and conversation language.",
      parameters: {
        type: "object",
        properties: {
          languageCode: {
            type: "string",
            enum: ["en", "hi", "as", "bn", "ta", "te", "mr", "gu", "kn", "mni", "kha", "lus"],
            description: "Language code"
          }
        },
        required: ["languageCode"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "updateAccessibilitySettings",
      description: "Update accessibility preferences such as high contrast, large text, or sound effects.",
      parameters: {
        type: "object",
        properties: {
          highContrast: { type: "boolean" },
          fontSize: { type: "string", enum: ["normal", "large", "extra-large"] },
          soundEnabled: { type: "boolean" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getGameRules",
      description: "Get the rules, objectives, and tips for any SMRITI game.",
      parameters: {
        type: "object",
        properties: {
          gameId: {
            type: "string",
            enum: ["hornbill", "memory-moments", "familiar-faces", "remember-home", "my-day", "listen-remember", "bamboo-sequence"],
            description: "Identifier of the game"
          }
        },
        required: ["gameId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCurrentGameState",
      description: "Get the state of the currently active game (if any).",
      parameters: { type: "object", properties: {}, required: [] }
    }
  },
  {
    type: "function",
    function: {
      name: "giveGameHint",
      description: "Provide a helpful, encouraging hint for the current cognitive game.",
      parameters: {
        type: "object",
        properties: {
          gameId: { type: "string" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "saveGameResult",
      description: "Record and save the result of a completed cognitive game session.",
      parameters: {
        type: "object",
        properties: {
          gameId: { type: "string" },
          score: { type: "number" },
          accuracy: { type: "number" }
        },
        required: ["gameId", "accuracy"]
      }
    }
  }
];

function generateContextualResponse(message, profile, role, lang = 'en', todayDateStr, todayTimeStr, caretakerName = 'Rahul', doctorName = 'Dr. Sharma', reminderDataSummary = 'None pending') {
  const patient = (profile && profile.patient) || { name: 'Meera', state: 'Assam' };
  const firstName = (patient.preferredName || patient.name || 'Friend').split(' ')[0];
  const text = (message || '').trim().toLowerCase();

  const games = (profile && profile.gameHistory) || [];
  const totalGames = games.length;
  const avgAcc = totalGames > 0 ? Math.round(games.reduce((s, g) => s + (g.accuracy || 0), 0) / totalGames) : 90;
  const recentGame = games[games.length - 1];
  
  const memories = (profile && profile.memories) || [];
  const family = (profile && profile.familyMembers) || [];
  const reminders = (profile && profile.reminders) || [];
  const medicines = (profile && profile.medicines) || [];
  const state = profile?.preferences?.regionalState || patient.state || 'Assam';

  // Helper for language-appropriate string resolution (en, hi, as, bn, ne, mni)
  const pickLang = (enStr, hiStr, asStr, bnStr, neStr, mniStr) => {
    if (lang === 'hi') return hiStr;
    if (lang === 'as') return asStr;
    if (lang === 'bn') return bnStr;
    if (lang === 'ne') return neStr || hiStr;
    if (lang === 'mni') return mniStr || enStr;
    return enStr;
  };

  // 1. Safety, Crisis & Urgent Distress Handling
  if (text.includes('sos') || text.includes('emergency') || text.includes('help me') || text.includes('fall') || text.includes('chest pain') || text.includes('breathing problem') || text.includes('i am lost') || text.includes('lost')) {
    return pickLang(
      `Please stay calm ${firstName}, you are completely safe. If you need immediate assistance, tap the bright red 🛟 SOS button on top to notify Emergency Services (112) or call your caregiver ${caretakerName} right away. We are right here beside you. 🕊️❤️`,
      `कृपया शांत रहें ${firstName}, आप पूर्णतः सुरक्षित हैं। यदि आपको तुरंत सहायता चाहिए, तो ऊपर दिए गए लाल 🛟 SOS बटन को दबाएं या अपने देखभालकर्ता ${caretakerName} को कॉल करें। हम हमेशा आपके साथ हैं। 🕊️❤️`,
      `অনুগ্ৰহ কৰি শান্ত থাকক ${firstName}, আপুনি সুৰক্ষিত। জৰুৰী সহায়ৰ বাবে ওপৰৰ ৰঙা 🛟 SOS বুটামটো টিপক বা তত্ত্বাৱধায়ক ${caretakerName}ক যোগাযোগ কৰক। 🕊️❤️`,
      `দয়া করে শান্ত থাকুন ${firstName}, আপনি নিরাপদ। জরুরি প্রয়োজনে ওপরের লাল 🛟 SOS বোতামটি চেপে আপনার সেবাকারী ${caretakerName} বা জরুরি সেবাকে জানান। 🕊️❤️`,
      `कृपया शान्त रहनुहोस् ${firstName}, हजुर पूर्ण सुरक्षित हुनुहुन्छ। आपतकालीन सहयोगका लागि रातो 🛟 SOS बटन दबाउनुहोस् वा हेरचाहकर्ता ${caretakerName}लाई सम्पर्क गर्नुहोस्। 🕊️❤️`,
      `Ashangba lounu ${firstName}, nangbu ngak-shelbaga leiri. Awaba leirabadi angangba 🛟 SOS button nammu nattraga ${caretakerName}da call toubiyu. 🕊️❤️`
    );
  }

  // 2. Cognitive & Behavioral De-escalation (Validation Therapy over harsh reality-checking)
  if (text.includes('where is my mother') || text.includes('where is my father') || text.includes('where is my husband') || text.includes('where is my wife') || text.includes('i want to see my mother') || text.includes('where is mom') || text.includes('where is dad') || text.includes('maa kahan') || text.includes('pitaji kahan') || text.includes('dead') || text.includes('deceased')) {
    return pickLang(
      `It brings so much warmth to hear you speak of them, ${firstName}. They loved you so very deeply. Would you like to share a sweet memory of them with me, or shall we listen to some calming bansuri music together? 🌸✨`,
      `आपकी बातें सुनकर बहुत अच्छा लगा ${firstName}। वे आपसे कितना अपार स्नेह करते थे! क्या आप मुझे उनके बारे में कुछ मीठी यादें सुनाना पसंद करेंगे? या हम साथ में बांसुरी का मधुर संगीत सुनें? 🌸✨`,
      `তেওঁলোকৰ কথা শুনি মনটো মৰমেৰে ভৰি পৰিল ${firstName}। তেওঁলোকে আপোনাক কিমান মৰম কৰিছিল! আপুনি তেওঁলোকৰ এটা সুন্দৰ স্মৃতি ক’ব নেকি বা আমি বাঁহীৰ সুৰ শুনো? 🌸✨`,
      `তাদের কথা ভেবে মনটা ভালো হয়ে গেল ${firstName}। তারা আপনাকে কতটা ভালোবাসতেন! আপনি কি তাদের কোনো সুন্দর স্মৃতির কথা বলবেন, নাকি আমরা একসাথে মিষ্টি গান শুনব? 🌸✨`,
      `हजुरको कुरा सुनेर मन हर्षित भयो ${firstName}। उहाँहरूले हजुरलाई धेरै माया गर्नुहुन्थ्यो! के उहाँहरूको कुनै मीठो सम्झना बाँड्न चाहनुहुन्छ, कि हामी शान्त बाँसुरीको धुन सुनौं? 🌸✨`,
      `Makhoigi wafam taraga pukning nungaijei ${firstName}. Makhoina nangbu yamna nungshirammi! Makhoigi nungshiba ningsingba wafam amukta hairambiragera? 🌸✨`
    );
  }

  // 3. Medical Liability Prevention
  if (text.includes('diagnose') || text.includes('cure') || text.includes('stop taking medicine') || text.includes('what disease do i have') || text.includes('dawa chhod')) {
    return pickLang(
      `Dear ${firstName}, SMRITI is an assistive memory companion, not a diagnostic or medical replacement system. Please consult your physician ${doctorName} before making any changes to your medication or healthcare plan! 🩺💊`,
      `प्रिय ${firstName}, स्मृति एक सहायक संज्ञानात्मक साथी है, कोई नैदानिक प्रणाली नहीं। कृपया अपनी दवाओं में बदलाव से पहले अपने चिकित्सक ${doctorName} से परामर्श करें! 🩺💊`,
      `মৰমৰ ${firstName}, স্মৃতি এটি সহায়ক স্মৃতি সংগীহে, কোনো চিকিৎসাজনিত ব্যৱস্থা নহয়। ঔষধৰ পৰিৱৰ্তন কৰাৰ আগতে অনুগ্ৰহ কৰি চিকিৎসক ${doctorName}ৰ পৰামৰ্শ লওক! 🩺💊`,
      `প্রিয় ${firstName}, স্মৃতি একটি সহায়ক স্মৃতিসঙ্গী, কোনো রোগ নির্ণয় ব্যবস্থা নয়। ওষুধের কোনো পরিবর্তনের আগে দয়া করে চিকিৎসক ${doctorName}-এর পরামর্শ নিন! 🩺💊`,
      `प्रिय ${firstName}, स्मृति एउटा सहयोगी साथी हो, कुनै निदान प्रणाली होइन। औषधि परिवर्तन गर्नुअघि कृपया आफ्ना डाक्टर ${doctorName}सँग सल्लाह लिनुहोस्! 🩺💊`,
      `Nungshiba ${firstName}, SMRITI asi mateng pangba marupni. Hidak hongdokpagi matangda Doctor ${doctorName}da tanabiyu! 🩺💊`
    );
  }

  // 4. Predefined Guideline 1: What is Dementia? (Simple, warm, jargon-free)
  if (text.includes('dementia') || text.includes('what is dementia') || text.includes('डिमेंशिया') || text.includes('ডিমেনচিয়া') || text.includes('ডিমেনশিয়া') || text.includes('डिमेन्सिया')) {
    return pickLang(
      `Dementia is a condition where memory gradually becomes a little weaker over time, but please do not worry at all—we are all right here to care for you and stay by your side! 🌸❤️`,
      `Dementia ek aisi sthiti hai jismein yaadashth aur sochne ki kshamta dheere-dheere kam hone lagti hai, lekin hum sab yahan aapki dekhbhal ke liye hain। 🌸❤️`,
      `ডিমেনচিয়া হৈছে এনে এক অৱস্থা য’ত স্মৃতিশক্তি লাহে লাহে কিছু কমি যায়, কিন্তু আপুনি অকণো চিন্তা নকৰিব, আমি সকলোৱে আপোনাৰ যত্নৰ বাবে ইয়াতেই আছোঁ। 🌸❤️`,
      `ডিমেনশিয়া এমন একটি অবস্থা যেখানে স্মৃতিশক্তি ধীরে ধীরে কিছুটা কমে যায়, কিন্তু আপনি একদম চিন্তা করবেন না, আমরা সবাই আপনার যত্নের জন্য পাশেই আছি। 🌸❤️`,
      `डिमेन्सिया एउटा यस्तो अवस्था हो जसमा स्मरणशक्ति बिस्तारै कम हुन थाल्छ, तर हजुरले चिन्ता नलिनुहोस्, हामी सबै हजुरको स्याहार र साथका लागि यहाँ छौं। 🌸❤️`,
      `Dementia haiba asi pukning ningsingba tapna sontharba amani, adubu thamoiba tounu, eikhoi pumnamak nangi senbaga leiri. 🌸❤️`
    );
  }

  // 5. Predefined Guideline 2: Clean, Elderly-Friendly Jokes
  if (text.includes('joke') || text.includes('chutkula') || text.includes('hasao') || text.includes('hasao mujhe') || text.includes('হাসি') || text.includes('ধেমালি') || text.includes('मजाक') || text.includes('चुट्किला') || text.includes('funny') || text.includes('joke sunao')) {
    return pickLang(
      `Why did the scarecrow win an award? Because he was outstanding in his field! 😄 May your heart always stay light and cheerful!`,
      `एक सज्जन ने डॉक्टर से पूछा: "डॉक्टर साहब, क्या चश्मा लगाने के बाद मैं पढ़ सकूँगा?" डॉक्टर बोले: "हाँ, बिल्कुल!" सज्जन खुशी से बोले: "अरे वाह! पहले तो मुझे पढ़ना ही नहीं आता था!" 😄 सदा मुस्कुराते रहिए!`,
      `এজন মানুহে ডাক্টৰক ক’লে: "ডাক্টৰ বাবু, চশমা ল’লে মই কিতাপ পঢ়িব পাৰিমনে?" ডাক্টৰে ক’লে: "নিশ্চয় পাৰিব!" মানুহজনে ক’লে: "বৰ ভাল কথা, মইতো আগতে পঢ়িবই নাজানিছিলোঁ!" 😄 সদা হাঁহি থাকক!`,
      `এক ব্যক্তি ডাক্তারকে জিজ্ঞেস করলেন: "ডাক্তারবাবু, চশমা নিলে কি আমি বই পড়তে পারব?" ডাক্তার বললেন: "হ্যাঁ, নিশ্চয়ই!" ব্যক্তিটি খুশি হয়ে বললেন: "বাহ, দারুণ! আমি তো আগে লেখাপড়াই জানতাম না!" 😄 সর্বদা হাসিখুশি থাকুন!`,
      `एक जना व्यक्तिले डाक्टरलाई सोधेछन्: "डाक्टर साब, चश्मा लगाएपछि म पढ्न सक्छु?" डाक्टरले भने: "अँ, पक्कै सक्नुहुन्छ!" व्यक्तिले खुसी हुँदै भने: "आहा कति राम्रो, पहिले त मलाई पढ्नै आउँदैनथ्यो!" 😄 सधैं मुस्कुराइरहनुहोस्!`,
      `Doktorda meo amana hangkhi: "Ei mityeng mingshen unjaraba matungda lairik paba ngamlagadra?" Doktarna hairak-i: "Hoi, yaramgani!" Mahakna haraona haikhi: "Ehai, ngallengei eidi lairik pabasu heitabaduni!" 😄 Nungsina nokpiyu!`
    );
  }

  // 6. Predefined Guideline 3: Reminders & Schedule
  if (text.includes('reminder') || text.includes('routine') || text.includes('schedule') || text.includes('medicine') || text.includes('dawa') || text.includes('dawai') || text.includes('tablet') || text.includes('pill') || text.includes('what next') || text.includes('agla') || text.includes('next task') || text.includes('kya karna')) {
    return pickLang(
      `Dear ${firstName}, your schedule is well planned. Coming up: ${reminderDataSummary}. Take everything comfortably and at your own pace! ⏰💊`,
      `प्रिय ${firstName}, आपकी दिनचर्या का पूरा ध्यान रखा गया है। आपके आगामी कार्य: ${reminderDataSummary}। आप बिल्कुल तनाव न लें, सब आराम से समय पर होगा! ⏰💊`,
      `মৰমৰ ${firstName}, আপোনাৰ দিনটোৰ সূচী সুন্দৰকৈ সজোৱা আছে। আগন্তুক কাৰ্য: ${reminderDataSummary}। সকলো কাম শান্তিৰে কৰক! ⏰💊`,
      `প্রিয় ${firstName}, আপনার দিনের রুটিন সুন্দরভাবে সাজানো আছে। পরবর্তী কাজ: ${reminderDataSummary}। কোনো চিন্তা করবেন না, সবকিছু শান্তিমতো হয়ে যাবে! ⏰💊`,
      `प्रिय ${firstName}, हजुरको तालिका राम्रोसँग मिलाइएको छ। आगामी कार्य: ${reminderDataSummary}। हजुर ढुक्क हुनुहोस्, सबै समयमै आरामले हुनेछ! ⏰💊`,
      `Nungshiba ${firstName}, nangi thabak mayam semduna leire: ${reminderDataSummary}. Tapna nungaina toubiyu! ⏰💊`
    );
  }

  // 7. Predefined Guideline 4: Caretaker & Doctor Info
  if (text.includes('doctor') || text.includes('caretaker') || text.includes('caregiver') || text.includes('barua') || text.includes('raj') || text.includes('dekhbhal') || text.includes('who is my doctor') || text.includes('who takes care')) {
    return pickLang(
      `Your loving caretaker is ${caretakerName}, and your attending doctor is ${doctorName}. They both care deeply about your comfort and happiness! 🩺🤝`,
      `आपके स्नेही देखभालकर्ता ${caretakerName} हैं और आपके चिकित्सक ${doctorName} हैं। वे दोनों आपकी सेहत और खुशी का पूरा ध्यान रखते हैं! 🩺🤝`,
      `আপোনাৰ মৰমৰ তত্ত্বাৱধায়ক ${caretakerName} আৰু চিকিৎসক ডাঃ ${doctorName}। তেওঁলোকে সদায় আপোনাৰ সুস্বাস্থ্যৰ যত্ন লয়! 🩺🤝`,
      `আপনার স্নেহের সেবাকারী ${caretakerName} এবং চিকিৎসক ডাঃ ${doctorName}। তারা সর্বদা আপনার যত্ন ও মঙ্গলের খেয়াল রাখেন! 🩺🤝`,
      `हजुरको हेरचाहकर्ता ${caretakerName} र डाक्टर ${doctorName} हुनुहुन्छ। उहाँहरू सधैं हजुरको स्वास्थ्य र सहजताको ख्याल राख्नुहुन्छ! 🩺🤝`,
      `Nangi senbiba miudi ${caretakerName}ni, amasung doctorna ${doctorName}ni. Makhoi anina nangbu nungsina senbi! 🩺🤝`
    );
  }

  // Clinical inquiries by caregiver or doctor
  if (role === 'doctor') {
    return `Clinical Overview for ${patient.name} (${patient.stage || 'Mild MCI'}): ${totalGames} cognitive sessions recorded with ${avgAcc}% overall accuracy as of ${todayDateStr}. Prescriptions active: ${medicines.length}.`;
  }
  if (role === 'caregiver') {
    return `Caregiver Summary (${todayDateStr}, ${todayTimeStr}): ${patient.name} has completed ${totalGames} sessions with ${avgAcc}% accuracy. Active reminders: ${reminders.filter(r => !r.completedToday).length}.`;
  }

  // Date & Time queries
  if (text.includes('time') || text.includes('clock') || text.includes('kitne baje') || text.includes('samay') || text.includes('সময়')) {
    return pickLang(
      `Dear ${firstName}, the current time is ${todayTimeStr} on ${todayDateStr}. A pleasant time to relax or enjoy a gentle memory game! ⏰✨`,
      `नमस्ते ${firstName}! इस समय ${todayTimeStr} (${todayDateStr}) हुआ है। यह समय आराम करने या एक हल्का दिमागी खेल खेलने के लिए बहुत अच्छा है! ⏰✨`,
      `নমস্কাৰ ${firstName}! এতিয়া সময় ${todayTimeStr} (${todayDateStr})। এয়া জিৰণি লোৱাৰ বা স্মৃতিৰ অনুশীলন কৰাৰ উত্তম সময়! ⏰✨`,
      `নমস্কার ${firstName}! এখন সময় ${todayTimeStr} (${todayDateStr})। এটি বিশ্রাম নেওয়া বা সহজ স্মৃতিচর্চার খুব সুন্দর সময়! ⏰✨`,
      `नमस्ते ${firstName}! अहिले समय ${todayTimeStr} भएको छ। यो समय आराम गर्न वा हल्का खेल खेल्नका लागि धेरै राम्रो छ! ⏰✨`
    );
  }
  if (text.includes('what date') || text.includes('today\'s date') || text.includes('which day') || text.includes('what day is today') || text.includes('aaj kaun sa din') || text.includes('aaj ki tarikh')) {
    return pickLang(
      `Today is ${todayDateStr}. May your day be filled with calm joy, good health, and comforting memories! 📅🌸`,
      `आज की तारीख ${todayDateStr} है। आपका दिन सुखद, शांत और स्वस्थ रहे! 📅🌸`,
      `আজিৰ তাৰিখ ${todayDateStr}। আপোনাৰ দিনটো শান্তিময় আৰু আনন্দদায়ক হওক! 📅🌸`,
      `আজকের তারিখ ${todayDateStr}। আপনার আজকের দিনটি সুন্দর ও শান্তিময় কাটুক! 📅🌸`,
      `आजको मिति ${todayDateStr} हो। हजुरको दिन शान्तिमय र सुखद रहोस्! 📅🌸`
    );
  }

  // Family Members
  if (text.includes('family') || text.includes('who is') || text.includes('children') || text.includes('son') || text.includes('daughter')) {
    const famNames = family.map(f => `${f.name} (${f.relation})`).join(', ');
    return pickLang(
      `Your loving family members include ${famNames || 'Raj and Ananya'}. You are surrounded by so much warmth and care. 🌸👨‍👩‍👧`,
      `आपके स्नेही परिवार में ${famNames || 'राज और अनन्य'} शामिल हैं। आप हमेशा उनके अपार प्रेम और सुरक्षा में हैं। 🌸👨‍👩‍👧`,
      `আপোনাৰ মৰমৰ পৰিয়ালৰ সদস্যসকল হ'ল ${famNames || 'ৰাজ আৰু অনন্যা'}। আপুনি সদায় পৰিয়ালৰ মৰম আৰু সুৰক্ষাত আছে। 🌸👨‍👩‍👧`,
      `আপনার স্নেহশীল পরিবারের মধ্যে রয়েছেন ${famNames || 'রাজ ও অনন্যা'}। আপনি সর্বদা তাদের ভালোবাসা ও যত্নে আছেন। 🌸👨‍👩‍👧`,
      `हजुरको परिवारमा ${famNames || 'राज र अनन्य'} हुनुहुन्छ। हजुर सधैं परिवारको माया र सुरक्षामा हुनुहुन्छ। 🌸👨‍👩‍👧`
    );
  }

  // Memory Vault
  if (text.includes('memory') || text.includes('remember') || text.includes('photo') || text.includes('story') || text.includes('yaad')) {
    if (memories.length > 0) {
      const m = memories[Math.floor(Math.random() * memories.length)];
      return pickLang(
        `I love reminiscing with you, ${firstName}! Do you remember ${m.title}? ${m.story.slice(0, 140)}... It is such a cherished treasure in your Memory Vault. 🖼️✨`,
        `मुझे आपके साथ पुरानी यादें ताज़ा करना बहुत प्रिय है, ${firstName}! क्या आपको ${m.title} याद है? यह आपकी स्मृति तिजोरी का अनमोल ख़ज़ाना है। 🖼️✨`,
        `আপোনাৰ লগত পুৰণি স্মৃতি সোঁৱৰণ কৰিবলৈ বৰ ভাল লাগে, ${firstName}! আপোনাৰ ${m.title} মনত আছেনে? এয়া আপোনাৰ স্মৃতি ভঁৰালৰ বহুমূলীয়া সম্পদ। 🖼️✨`,
        `আপনার সাথে পুরনো কথা মনে করতে খুব আনন্দ হয়, ${firstName}! আপনার কি ${m.title} মনে আছে? এটি আপনার স্মৃতির ভাণ্ডারের এক অমূল্য রত্ন। 🖼️✨`,
        `हजुरसँग पुराना सम्झनाहरू ताजा गर्न पाउँदा खुसी लाग्छ, ${firstName}! के हजुरलाई ${m.title} सम्झना छ? यो हजुरको स्मृति भण्डारको अनमोल सम्झना हो। 🖼️✨`
      );
    }
    return pickLang(
      `Your life stories and memories are safely kept in your Memory Vault, ${firstName}. What favorite memory would you like to reflect on today?`,
      `आपकी जीवन गाथाएं और मधुर यादें आपकी स्मृति तिजोरी में सुरक्षित हैं, ${firstName}। आज आप किस प्रिय स्मृति को याद करना चाहेंगे?`,
      `আপোনাৰ জীৱনৰ মিঠা স্মৃতিবোৰ স্মৃতি ভঁৰালত সংৰক্ষিত আছে, ${firstName}। আজি কোনটো স্মৃতি মনত পেলাব বিচাৰে?`,
      `আপনার সুন্দর স্মৃতিগুলো স্মৃতি ভল্টে নিরাপদে রাখা আছে, ${firstName}। আজ কোন প্রিয় স্মৃতিটি মনে করতে চান?`,
      `हजुरका मीठा सम्झनाहरू स्मृति भण्डारमा सुरक्षित छन्, ${firstName}। आज कुन सम्झना ताजा गर्न चाहनुहुन्छ?`
    );
  }

  // Mood & Comfort
  if (text.includes('sad') || text.includes('lonely') || text.includes('low') || text.includes('upset') || text.includes('worried') || text.includes('udas') || text.includes('chinta')) {
    return pickLang(
      `I'm right here with you, ${firstName}. It is completely natural to have moments like this. Would you like to take a slow, calming breath together, or listen to sweet music? You are deeply loved. 🌿❤️`,
      `मैं बिल्कुल आपके साथ हूँ, ${firstName}। कभी-कभी ऐसा लगना स्वाभाविक है। क्या हम मिलकर एक शांत सांस लें, या मधुर संगीत सुनें? आप बहुत प्रिय हैं और कभी अकेले नहीं हैं। 🌿❤️`,
      `মই আপোনাৰ কাষতে আছোঁ, ${firstName}। এনেকুৱা অনুভৱ হোৱাটো স্বাভাৱিক। আহক আমি শান্তভাৱে দীঘল উশাহ লওঁ বা কোনো সুন্দৰ গীত শুনো। আপুনি কেতিয়াও অকলে নহয়। 🌿❤️`,
      `আমি আপনার পাশেই আছি, ${firstName}। মন খারাপ লাগা খুবই স্বাভাবিক। আসুন আমরা ধীরে ধীরে গভীর শ্বাস নিই বা মিষ্টি গান শুনি। আপনি সর্বদা আমাদের অত্যন্ত প্রিয়। 🌿❤️`,
      `म हजुरकै साथमा छु, ${firstName}। कहिलेकाहीँ यस्तो अनुभव हुनु स्वाभाविक हो। आउनुहोस् हामी मिलेर शान्त श्वास फेरौं वा मीठो सङ्गीत सुनौं। हजुर धेरै प्रिय हुनुहुन्छ। 🌿❤️`
    );
  }

  // Games & Cognition
  if (text.includes('game') || text.includes('play') || text.includes('score') || text.includes('khel')) {
    return pickLang(
      `You're doing wonderfully, ${firstName}! You have completed ${totalGames} mindful sessions with an average accuracy of ${avgAcc}%. How about playing Hornbill Memory Nest or visiting Familiar Faces today? 🦅✨`,
      `आप बहुत ही शानदार प्रदर्शन कर रहे हैं, ${firstName}! आपने ${avgAcc}% सटीकता के साथ ${totalGames} खेल पूरे किए हैं। क्या आज हॉर्नबिल मेमोरी या परिचित चेहरे खेलें? 🦅✨`,
      `আপুনি অতি সুন্দৰ প্ৰদৰ্শন কৰিছে, ${firstName}! আপুনি ${avgAcc}% শুদ্ধতাৰে ${totalGames} টা অনুশীলন সম্পন্ন কৰিছে। আজি ধনেশ পক্ষী বা চিনাকি মুখ খেলিম নেকি? 🦅✨`,
      `আপনি চমৎকার অনুশীলন করছেন, ${firstName}! আপনি ${avgAcc}% নির্ভুলতায় ${totalGames} টি খেলা শেষ করেছেন। আজ কি হর্নবিল মেমোরি বা পরিচিত মুখ খেলা যাক? 🦅✨`,
      `हजुरले धेरै राम्रो खेल्नुभएको छ, ${firstName}! हजुरले ${avgAcc}% शुद्धताका साथ ${totalGames} खेल पूरा गर्नुभएको छ। आज कुनै रमाइलो खेल खेलौं? 🦅✨`
    );
  }

  // Friendly greetings
  if (text.includes('hello') || text.includes('hi') || text.includes('namaste') || text.includes('pranam') || text.includes('nomoskar')) {
    return pickLang(
      `Namaste ${firstName}! I am Saathi, your 24/7 caring companion. It is ${todayTimeStr} on ${todayDateStr}. How can I bring a smile to your heart today? 🌸`,
      `नमस्ते ${firstName}! मैं 'साथी' हूँ, आपका 24/7 स्नेही साथी। आज ${todayDateStr} है और समय ${todayTimeStr}। आज मैं आपकी क्या सेवा करूँ? 🌸`,
      `নমস্কাৰ ${firstName}! মই 'সাথী', আপোনাৰ সহায়ক সংগী। এতিয়া সময় ${todayTimeStr}। আজি আপোনাৰ মনটো কেনেকৈ আনন্দিত কৰিব পাৰোঁ? 🌸`,
      `নমস্কার ${firstName}! আমি 'সাথী', আপনার ২৪/৭ ভালোবাসার সঙ্গী। এখন সময় ${todayTimeStr}। আজ আপনার জন্য আমি কী করতে পারি? 🌸`,
      `नमस्ते ${firstName}! म 'साथी' हुँ, हजुरको २४/७ स्नेही साथी। अहिले समय ${todayTimeStr} भएको छ। आज म हजुरको सेवा कसरी गरूँ? 🌸`,
      `Khurumjari ${firstName}! Ei Saathini, nangi 24/7 marupni. Matam ${todayTimeStr} tare. Eina karamba mateng pangge? 🌸`
    );
  }

  // 8. Predefined Guideline 5: Fallback Condition for Unknown Queries
  // "Mujhe is baare mein abhi jankari nahi hai, lekin aap chinta mat kijiye, main iski khabar [INSERT_CARETAKER_NAME] ko de deta hoon."
  return pickLang(
    `I don't have information about this right now, but please don't worry at all—I will inform ${caretakerName} right away. Stay comfortable and peaceful! 🌸`,
    `Mujhe is baare mein abhi jankari nahi hai, lekin aap chinta mat kijiye, main iski khabar ${caretakerName} ko de deta hoon.`,
    `এই বিষয়ে মোৰ এতিয়া সঠিক তথ্য জনা নাই, কিন্তু আপুনি অকণো চিন্তা নকৰিব, মই এই কথা ${caretakerName}ক জনাই দিছোঁ। আপুনি শান্তভাৱে থাকক! 🌸`,
    `আমার এই বিষয়ে এখন জানা নেই, তবে আপনি একদম চিন্তা করবেন না, আমি এই খবরটি ${caretakerName}-কে জানিয়ে দিচ্ছি। আপনি নিশ্চিন্তে থাকুন! 🌸`,
    `मलाई यस विषयमा अहिले जानकारी छैन, तर हजुरले चिन्ता नलिनुहोस्, म यो कुरा ${caretakerName}लाई खबर गरिदिन्छु। हजुर आरामसँग बस्नुहोस्! 🌸`,
    `Masi eina khangjade, adubu nangna waba tounu, eina ${caretakerName}da pao pirage! 🌸`
  );
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const data = body ? JSON.parse(body) : {};
      const { message, patientProfile, role, stream, currentLanguage, language } = data;
      const activeLang = currentLanguage || language || 'en';

      const langMap = {
        'en': 'English',
        'hi': 'Hindi (हिन्दी)',
        'as': 'Assamese (অসমীয়া)',
        'bn': 'Bengali (বাংলা)',
        'ne': 'Nepali (नेपाली)',
        'mni': 'Manipuri / Meitei (মৈতৈলোন্)',
        'kha': 'Khasi',
        'lus': 'Mizo',
        'ta': 'Tamil (தமிழ்)',
        'te': 'Telugu (తెలుగు)',
        'mr': 'Marathi (मराठी)',
        'gu': 'Gujarati (ગુજરાતી)',
        'kn': 'Kannada (ಕನ್ನಡ)'
      };
      const activeLangName = langMap[activeLang] || activeLang;

      const istOptionsDate = { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const istOptionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
      const todayDate = data.currentDate || new Date().toLocaleDateString('en-IN', istOptionsDate);
      const todayTime = data.currentTime || new Date().toLocaleTimeString('en-IN', istOptionsTime);

      const patient = patientProfile?.patient || { name: 'Meera Das', state: 'Assam' };
      const games = patientProfile?.gameHistory || [];
      const totalGames = games.length;
      const avgAcc = totalGames > 0 ? Math.round(games.reduce((s, g) => s + (g.accuracy || 0), 0) / totalGames) : 90;
      const reminders = patientProfile?.reminders || [];
      const completedTasks = reminders.filter(r => r.completedToday).length;
      const totalTasks = reminders.length;
      const moods = patientProfile?.moodHistory || [];
      const latestMood = moods.length > 0 ? moods[moods.length - 1].mood : 'good';

      // DYNAMIC ENTITIES & CONTEXT FOR SAATHI
      const caretakerName = patientProfile?.caretakerName || patientProfile?.caregiverName || patientProfile?.familyMembers?.find(f => f.relation === 'Caregiver' || f.relation === 'Son' || f.isCaregiver)?.name || 'Rahul';
      const doctorName = patientProfile?.doctorName || patientProfile?.doctor || patientProfile?.familyMembers?.find(f => f.relation?.toLowerCase().includes('doctor'))?.name || 'Dr. Sharma';
      const activeReminders = reminders.filter(r => !r.completedToday);
      const reminderDataSummary = activeReminders.length > 0 
        ? activeReminders.map(r => `${r.time || ''}: ${r.title || r.task || ''}`).join(', ')
        : 'All scheduled medicines and tasks are completed for now';

      const systemPrompt = `You are 'Saathi', a compassionate 24/7 AI companion for elderly and dementia patients on the SMRITI platform. You strictly use Validation Therapy—never argue, correct, or contradict the user; always comfort, listen, and validate their feelings.

LANGUAGE INSTRUCTION:
- You must reply strictly and accurately in the active UI language provided: ${activeLangName}.
- Fully supported regional languages include: Hindi, Bengali, Assamese, Manipuri (Meitei), and Nepali. Never default to English unless explicitly requested by the user.

DYNAMIC ENTITIES & CONTEXT:
- Caretaker's Name: ${caretakerName}
- Doctor's Name: ${doctorName}
- Current Active Reminders / Schedule: ${reminderDataSummary}
- Patient Profile: ${patient.name} (Role: ${role || 'patient'}, Stage: ${patient.stage || 'Mild Cognitive Impairment'})
- Region / Culture: ${patientProfile?.preferences?.regionalState || patient.state || 'Assam'}
- Current Date & Time (IST): ${todayDate}, ${todayTime}
- Total Cognitive Games Played: ${totalGames}, Average Accuracy: ${avgAcc}%
- Daily Tasks Completed: ${completedTasks} / ${totalTasks}
- Current Mood: ${latestMood}
- Family Members: ${JSON.stringify(patientProfile?.familyMembers || [])}
- Active Prescriptions: ${JSON.stringify(patientProfile?.medicines || [])}

PREDEFINED KNOWLEDGE & INTERACTION GUIDELINES:
1. What is Dementia?: If asked, respond simply, warmly, and without jargon (e.g., in Hindi/local translation: "Dementia ek aisi sthiti hai jismein yaadashth dheere-dheere kam hone lagti hai, lekin aap chinta mat kijiye, hum sab yahan aapki dekhbhal ke liye hain.").
2. Jokes: If asked for a joke, tell a clean, family-friendly, lighthearted joke suitable for an elderly person.
3. Reminders: If asked about routine, medication, or schedule, check active reminders and warmly state what is coming up next (${reminderDataSummary}).
4. Caretaker & Doctor Info: Reassure the user warmly about their caretaker (${caretakerName}) and doctor (${doctorName}).
5. Fallback condition (Unknown queries): If asked anything outside your scope or knowledge, reply warmly: "Mujhe is baare mein abhi jankari nahi hai, lekin aap chinta mat kijiye, main iski khabar ${caretakerName} ko de deta hoon." (translated into the active language: ${activeLangName}).

SAFETY & VALIDATION THERAPY:
- Never argue, correct, or contradict the user.
- If the patient asks about deceased loved ones, validate their deep love and gently reminisce or suggest calming music.
- In any physical distress or emergency (fall, chest pain, lost, SOS), reassure them immediately and trigger triggerSOS or advise contacting ${caretakerName}.`;

      // ==========================================================
      // TIER 1: LOCAL RAG KNOWLEDGE BASE MATCHING
      // ==========================================================
      try {
        const path = require('path');
        const fs = require('fs');
        const qaPath = path.join(__dirname, '../data/qa_knowledge.json');
        if (fs.existsSync(qaPath)) {
          const qaData = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
          const cleanMsg = (message || '').toLowerCase().trim();
          let matchedTopic = null;

          for (const topic of (qaData.topics || [])) {
            if (Array.isArray(topic.keywords) && topic.keywords.some(kw => cleanMsg.includes(kw.toLowerCase()))) {
              matchedTopic = topic;
              break;
            }
          }

          if (matchedTopic) {
            const topicReply = (matchedTopic.responses && (matchedTopic.responses[activeLang] || matchedTopic.responses.en)) || '';
            if (topicReply) {
              const toolCallsForTopic = [];
              if (cleanMsg.includes('play hornbill') || cleanMsg.includes('start hornbill') || (matchedTopic.id === 'game_rules_hornbill' && (cleanMsg.includes('play') || cleanMsg.includes('start') || cleanMsg.includes('want')))) {
                toolCallsForTopic.push({ name: 'startGame', args: { gameId: 'hornbill' } });
              } else if (cleanMsg.includes('play familiar') || cleanMsg.includes('start familiar') || (matchedTopic.id === 'game_rules_familiar_faces' && (cleanMsg.includes('play') || cleanMsg.includes('start')))) {
                toolCallsForTopic.push({ name: 'startGame', args: { gameId: 'familiar-faces' } });
              } else if (matchedTopic.id === 'emergency_help' && (cleanMsg.includes('sos') || cleanMsg.includes('emergency') || cleanMsg.includes('help'))) {
                toolCallsForTopic.push({ name: 'triggerSOS', args: { reason: 'User requested emergency assistance' } });
              }

              if (stream) {
                res.writeHead(200, {
                  'Content-Type': 'text/event-stream',
                  'Cache-Control': 'no-cache',
                  'Connection': 'keep-alive'
                });
                const words = topicReply.split(' ');
                let wIdx = 0;
                const timer = setInterval(() => {
                  if (wIdx < words.length) {
                    const chunk = (wIdx > 0 ? ' ' : '') + words[wIdx];
                    res.write('data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: chunk }] } }] }) + '\n\n');
                    wIdx++;
                  } else {
                    clearInterval(timer);
                    if (toolCallsForTopic.length > 0) {
                      res.write('data: ' + JSON.stringify({ tool_calls: toolCallsForTopic }) + '\n\n');
                    }
                    res.write('data: [DONE]\n\n');
                    res.end();
                  }
                }, 30);
                return;
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  reply: topicReply,
                  tool_calls: toolCallsForTopic.length > 0 ? toolCallsForTopic : undefined,
                  source: 'local_rag_knowledge'
                }));
                return;
              }
            }
          }
        }
      } catch (ragErr) {
        console.warn('Tier 1 Local RAG error:', ragErr.message);
      }

      // ==========================================================
      // TIER 2: PRIMARY LLM (OpenAI gpt-4o-mini with 16 Tools)
      // ==========================================================
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        try {
          const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message || 'Hello' }
              ],
              tools: OPENAI_TOOLS,
              tool_choice: 'auto',
              temperature: 0.6,
              max_tokens: 350
            })
          });

          if (openaiRes.ok) {
            const result = await openaiRes.json();
            const choice = result?.choices?.[0];
            const messageObj = choice?.message;

            if (messageObj) {
              const toolCalls = messageObj.tool_calls;
              const textContent = messageObj.content || '';

              if (toolCalls && toolCalls.length > 0) {
                // OpenAI issued one or more function calls!
                const parsedToolCalls = toolCalls.map(tc => ({
                  id: tc.id,
                  name: tc.function.name,
                  args: (() => {
                    try { return JSON.parse(tc.function.arguments); } catch { return {}; }
                  })()
                }));

                // Return both text (if any) and tool calls for client-side execution loop
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  reply: textContent || `Executing ${parsedToolCalls.map(t => t.name).join(', ')}...`,
                  tool_calls: parsedToolCalls,
                  source: 'openai_gpt4o_mini'
                }));
                return;
              }

              if (textContent) {
                if (stream) {
                  res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                  });
                  const words = textContent.split(' ');
                  let wIdx = 0;
                  const streamTimer = setInterval(() => {
                    if (wIdx < words.length) {
                      const chunk = (wIdx > 0 ? ' ' : '') + words[wIdx];
                      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`);
                      wIdx++;
                    } else {
                      clearInterval(streamTimer);
                      res.write('data: [DONE]\n\n');
                      res.end();
                    }
                  }, 25);
                  return;
                } else {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ reply: textContent, source: 'openai_gpt4o_mini' }));
                  return;
                }
              }
            }
          } else {
            console.warn('Tier 2 OpenAI response non-ok status:', openaiRes.status);
          }
        } catch (openaiErr) {
          console.warn('Tier 2 OpenAI error, falling back to Tier 3:', openaiErr.message);
        }
      }

      // ==========================================================
      // TIER 3: FALLBACK LLM (Google Gemini 1.5 Flash)
      // ==========================================================
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          if (stream) {
            const geminiStreamUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${geminiKey}`;
            const geminiRes = await fetch(geminiStreamUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: message || 'Namaste' }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
              })
            });

            if (geminiRes.ok && geminiRes.body) {
              res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
              });

              const reader = geminiRes.body.getReader ? geminiRes.body.getReader() : null;
              if (reader) {
                const decoder = new TextDecoder();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  const chunk = decoder.decode(value, { stream: true });
                  res.write(chunk);
                }
                res.end();
                return;
              }
            }
          } else {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: message || 'Namaste' }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: { maxOutputTokens: 250, temperature: 0.7 }
              })
            });

            if (geminiRes.ok) {
              const result = await geminiRes.json();
              const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ reply: text, source: 'gemini_fallback' }));
                return;
              }
            }
          }
        } catch (geminiErr) {
          console.warn('Tier 3 Gemini error, falling back to Tier 4:', geminiErr.message);
        }
      }

      // ==========================================================
      // TIER 4: DYNAMIC CONTEXTUAL SYNTHESIS ENGINE
      // ==========================================================
      const reply = generateContextualResponse(message, patientProfile, role, activeLang, todayDate, todayTime, caretakerName, doctorName, reminderDataSummary);

      // Check if message matched an action intent to provide tool_calls locally
      const cleanLower = (message || '').toLowerCase();
      let localToolCalls = [];
      if (cleanLower.includes('play hornbill') || cleanLower.includes('start hornbill') || cleanLower.includes('hornbill game')) {
        localToolCalls.push({ name: 'startGame', args: { gameId: 'hornbill' } });
      } else if (cleanLower.includes('play familiar') || cleanLower.includes('familiar faces')) {
        localToolCalls.push({ name: 'startGame', args: { gameId: 'familiar-faces' } });
      } else if (cleanLower.includes('play memory moments') || cleanLower.includes('story game')) {
        localToolCalls.push({ name: 'startGame', args: { gameId: 'memory-moments' } });
      } else if (cleanLower.includes('sos') || cleanLower.includes('emergency') || cleanLower.includes('help me call')) {
        localToolCalls.push({ name: 'triggerSOS', args: { reason: 'User requested emergency assistance' } });
      } else if (cleanLower.includes('switch to hindi') || cleanLower.includes('hindi language')) {
        localToolCalls.push({ name: 'updateLanguage', args: { languageCode: 'hi' } });
      }

      if (stream) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        const words = reply.split(' ');
        let wordIndex = 0;
        const streamTimer = setInterval(() => {
          if (wordIndex < words.length) {
            const word = (wordIndex > 0 ? ' ' : '') + words[wordIndex];
            res.write(`data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: word }] } }] })}\n\n`);
            wordIndex++;
          } else {
            clearInterval(streamTimer);
            if (localToolCalls.length > 0) {
              res.write(`data: ${JSON.stringify({ tool_calls: localToolCalls })}\n\n`);
            }
            res.write('data: [DONE]\n\n');
            res.end();
          }
        }, 35);
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        reply,
        tool_calls: localToolCalls.length > 0 ? localToolCalls : undefined,
        source: 'contextual_engine'
      }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body: ' + err.message }));
    }
  });
};
