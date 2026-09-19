/* ============================================================
   SMRITI — Saathi AI Chatbot Knowledge Base (50 Predefined Q&As)
   Strictly follows Validation Therapy (comfort, validate, never argue).
   Categories:
   1. Memory and Daily Assistance (Q1 - Q10)
   2. Cognitive Games (Q11 - Q20)
   3. AI and Personalization (Q21 - Q28)
   4. Scores and Progress (Q29 - Q35)
   5. Dementia and Health-Related Questions (Q36 - Q42)
   6. Caregiver Questions (Q43 - Q50)
   ============================================================ */

export const SAATHI_FAQ_LIST = [
  // 1. MEMORY AND DAILY ASSISTANCE
  {
    id: 1,
    category: 'Memory and Daily Assistance',
    keywords: ['forgot what to do', 'supposed to do', 'what was i doing', 'kya karna tha', 'bhul gaya', 'help me remember'],
    question: 'I forgot what I was supposed to do. Can you help me?',
    answer: "Of course. Don't worry if you cannot remember right away. First, check your reminders or planned activities in SMRITI to see whether you have something scheduled. Try focusing on what you were doing just before you became unsure. If you still cannot remember, you can ask a family member or caregiver for help. It is completely okay to ask for assistance when you need it."
  },
  {
    id: 2,
    category: 'Memory and Daily Assistance',
    keywords: ['need to remember today', 'today schedule', 'what to remember', 'aaj kya hai', 'today plan'],
    question: 'What do I need to remember today?',
    answer: "You can check your reminders and scheduled activities in SMRITI to see what is planned for today. Look at one activity at a time rather than trying to remember everything together. If you have an important appointment, task, or event, make sure your caregiver or family member is also aware of it."
  },
  {
    id: 3,
    category: 'Memory and Daily Assistance',
    keywords: ['forgot where i put', 'lost item', 'where did i keep', 'kahan rakh diya', 'saman nahi mil raha', 'lost keys', 'lost glasses'],
    question: 'I forgot where I put something. What should I do?',
    answer: "Take a moment and try not to worry. Think about the last place where you remember using the item. Then slowly retrace your recent steps and check the places where you normally keep it. You can also ask a family member or caregiver to help you search. Keeping frequently used items in the same place every day can make them easier to find."
  },
  {
    id: 4,
    category: 'Memory and Daily Assistance',
    keywords: ['forgot name', 'forgot someone name', 'kiska naam', 'naam bhul gaya', 'person name'],
    question: "I forgot someone's name. What can I do?",
    answer: "Take your time and don't feel pressured to remember immediately. Try to think about where you know the person from, what you normally talk about with them, or any other information connected with them. Looking at familiar photographs may also help. If you still cannot remember, it is perfectly fine to politely ask the person or someone you trust for their name."
  },
  {
    id: 5,
    category: 'Memory and Daily Assistance',
    keywords: ['feeling confused', 'confusion', 'ghabrahat', 'uljhan', 'confuse ho raha', 'i am confused'],
    question: 'I am feeling confused. What should I do?',
    answer: "Take a moment to sit somewhere comfortable and focus on one thing at a time. Check SMRITI for your current reminder or activity. If you are still unsure about what you should do, please ask a trusted family member or caregiver for assistance. If confusion is sudden, severe, or unusual for you, tell someone nearby and seek appropriate medical help."
  },
  {
    id: 6,
    category: 'Memory and Daily Assistance',
    keywords: ['remember an appointment', 'doctor appointment', 'appointment reminder', 'milne jana hai'],
    question: 'Can you help me remember an appointment?',
    answer: "If appointment reminders are available in your version of SMRITI, you can use them to keep track of the appointment time and details. It can also help to keep important appointments written down or shared with a trusted family member or caregiver. For important medical appointments, having someone accompany or assist you may be useful."
  },
  {
    id: 7,
    category: 'Memory and Daily Assistance',
    keywords: ['remember important things', 'remember more easily', 'how to remember', 'yaad kaise rakhe'],
    question: 'How can I remember important things more easily?',
    answer: "Try keeping important information in one consistent place. You can use reminders, notes, calendars, photographs, or other memory aids. Following a familiar daily routine can also make everyday activities easier to remember. SMRITI can support your cognitive activities and available memory-support features, but it should be used alongside support from family members or caregivers when needed."
  },
  {
    id: 8,
    category: 'Memory and Daily Assistance',
    keywords: ['what i did earlier', 'earlier today', 'activity history', 'aaj kya kiya maine', 'check what i did'],
    question: 'I forgot what I did earlier today. Can I check it?',
    answer: "If your SMRITI version provides activity history, you can use it to review the activities you completed recently. Looking at your activity history can help you remember what you have already done. For things outside the application, such as meals, appointments, or visits, a caregiver, family member, calendar, or personal diary may provide additional information."
  },
  {
    id: 9,
    category: 'Memory and Daily Assistance',
    keywords: ['keep forgetting things', 'bar bar bhul jata', 'forgetting everything', 'memory failing'],
    question: 'I keep forgetting things. What should I do?',
    answer: "Occasional forgetfulness can happen, but if you are noticing persistent or increasing problems with memory, it is important to tell someone you trust. A family member or caregiver can help you keep track of changes and daily activities. If you are concerned about your memory, speak with a qualified healthcare professional. SMRITI can provide cognitive activities and support, but it cannot determine the medical reason for memory problems."
  },
  {
    id: 10,
    category: 'Memory and Daily Assistance',
    keywords: ['cannot remember something', 'unable to remember', 'yaad nahi aa raha', 'dimag me nahi aa raha'],
    question: 'What can I do when I cannot remember something?',
    answer: "Give yourself some time rather than becoming frustrated. Think about related information, look at your reminders or notes, and check familiar places if you are looking for an object. If you still cannot remember, ask someone you trust for help. Forgetting something does not mean you have failed."
  },

  // 2. COGNITIVE GAMES
  {
    id: 11,
    category: 'Cognitive Games',
    keywords: ['which game should i play', 'what game today', 'game recommendation', 'khel kaun sa khele', 'suggest game'],
    question: 'Which game should I play today?',
    answer: "SMRITI can recommend a suitable cognitive activity based on your previous performance and the difficulty level of your activities. You can follow the recommended activity and complete it at your own pace. The purpose is to provide regular cognitive engagement rather than to pressure you to achieve a particular score."
  },
  {
    id: 12,
    category: 'Cognitive Games',
    keywords: ['how can these games help', 'how games help', 'benefit of games', 'khelne se kya hoga', 'why play games'],
    question: 'How can these games help me?',
    answer: "SMRITI's cognitive activities provide opportunities to practice skills such as memory, attention, recognition, concentration, and problem-solving. Different games may focus on different cognitive abilities. The activities are intended to make cognitive practice more interactive and engaging. They should be considered supportive activities and not a replacement for professional medical care."
  },
  {
    id: 13,
    category: 'Cognitive Games',
    keywords: ['practice memory', 'game for memory', 'improve memory game', 'yaadashth ka khel'],
    question: 'Which game should I play if I want to practice memory?',
    answer: "Choose an activity that focuses on remembering, recognizing, or recalling information. SMRITI can use the available game information and your previous performance to recommend an appropriate activity and difficulty. Try to focus on the activity without worrying too much about your score."
  },
  {
    id: 14,
    category: 'Cognitive Games',
    keywords: ['practice concentration', 'focus game', 'improve focus', 'dhyan lagana', 'concentration game'],
    question: 'Which game can help me practice concentration?',
    answer: "Activities that require you to pay attention to information, identify patterns, recognize objects, or respond accurately can provide practice for concentration. SMRITI can recommend activities based on your previous performance. Remember to take breaks if you become tired."
  },
  {
    id: 15,
    category: 'Cognitive Games',
    keywords: ['cannot complete game', 'game too hard', 'stuck in game', 'khel pura nahi hua', 'game fail'],
    question: 'What should I do if I cannot complete a game?',
    answer: "That's okay. You do not need to become frustrated if a game feels difficult. Take your time and try the activity again later, or use the difficulty recommended by SMRITI. If you are tired, take a break and return when you feel comfortable."
  },
  {
    id: 16,
    category: 'Cognitive Games',
    keywords: ['play same game again', 'replay game', 'phir se khele', 'play again'],
    question: 'Can I play the same game again?',
    answer: "Yes, if the activity is available for replay, you can play it again. Repeating an activity allows you to become familiar with its rules and observe how your performance changes. SMRITI can use available performance information from your activities to personalize future recommendations."
  },
  {
    id: 17,
    category: 'Cognitive Games',
    keywords: ['different difficulty this time', 'why difficulty changed', 'level badal gaya', 'change difficulty'],
    question: 'Why did I get a different difficulty this time?',
    answer: "SMRITI is designed to adapt activities according to your performance. Factors such as accuracy, response time, previous attempts, previous scores, game type, and current difficulty can be considered when recommending a difficulty. This means the difficulty may change from one session to another as your performance changes."
  },
  {
    id: 18,
    category: 'Cognitive Games',
    keywords: ['game became harder', 'why harder', 'mushkil kyu ho gaya', 'difficult level'],
    question: 'Why did the game become harder?',
    answer: "The system may recommend a higher difficulty when your recent performance suggests that you are handling the current level comfortably. The purpose is to provide an appropriate challenge rather than simply making the game harder for everyone. If the new level feels uncomfortable, take your time and use the available options to continue at a suitable level."
  },
  {
    id: 19,
    category: 'Cognitive Games',
    keywords: ['game became easier', 'why easier', 'aasan kyu ho gaya', 'lower level'],
    question: 'Why did the game become easier?',
    answer: "SMRITI may recommend a lower difficulty when your recent performance suggests that the current level is challenging. This is not a failure. The goal of adaptive difficulty is to provide an activity that is appropriate for your current performance and allows you to participate comfortably."
  },
  {
    id: 20,
    category: 'Cognitive Games',
    keywords: ['after i finish game', 'what happens after game', 'khel khatam hone ke baad'],
    question: 'What happens after I finish a game?',
    answer: "After completing an activity, your available performance information can be recorded. This may include your score, accuracy, response time, and other relevant activity information. This information can contribute to your progress tracking and future difficulty recommendations."
  },

  // 3. AI AND PERSONALIZATION
  {
    id: 21,
    category: 'AI and Personalization',
    keywords: ['choose my difficulty', 'how difficulty chosen', 'adaptive difficulty logic', 'difficulty kaise tay hoti'],
    question: 'How does SMRITI choose my difficulty?',
    answer: "SMRITI uses an adaptive approach to recommend a difficulty based on your performance. The system can consider factors such as your accuracy, response time, previous attempts, previous score, game type, and current difficulty. These factors help the system understand whether an activity may be too easy, too difficult, or appropriately challenging for you."
  },
  {
    id: 22,
    category: 'AI and Personalization',
    keywords: ['everyone get same difficulty', 'same difficulty for all', 'kya sabka ek jaisa level'],
    question: 'Does everyone get the same difficulty?',
    answer: "Not necessarily. SMRITI is designed to personalize the difficulty based on individual performance. Two users may perform differently on the same activity, so the system can recommend different difficulty levels for them. This allows the experience to be more personalized instead of applying exactly the same level to everyone."
  },
  {
    id: 23,
    category: 'AI and Personalization',
    keywords: ['remember previous performance', 'remember my scores', 'pichla record yaad hai'],
    question: 'Does SMRITI remember my previous performance?',
    answer: "SMRITI can use your previous activity information, such as scores and attempts, to understand your performance over time. This information can help the system make future activity and difficulty recommendations. The purpose is to make the experience more personalized rather than treating every session as completely separate."
  },
  {
    id: 24,
    category: 'AI and Personalization',
    keywords: ['make many mistakes', 'lots of mistakes', 'galati ho gayi', 'wrong answers'],
    question: 'What happens if I make many mistakes?',
    answer: "Making mistakes is completely normal during cognitive activities. SMRITI can use your recent performance, including accuracy and other available information, when recommending a suitable difficulty. You can take your time, practice again, and continue at a comfortable level."
  },
  {
    id: 25,
    category: 'AI and Personalization',
    keywords: ['perform very well', 'high score', 'achha khela', 'great performance'],
    question: 'What happens if I perform very well?',
    answer: "If your performance indicates that the current activity is becoming comfortable, SMRITI can recommend a higher difficulty level. This provides an opportunity for continued cognitive engagement and challenge. A higher difficulty is simply a recommendation based on your activity performance and does not represent a medical assessment."
  },
  {
    id: 26,
    category: 'AI and Personalization',
    keywords: ['response time matter', 'speed matter', 'kitna samay lagta', 'slow answer'],
    question: 'Does my response time matter?',
    answer: "Yes. Response time can be one of the factors considered by SMRITI when adapting difficulty. Along with accuracy, previous scores, attempts, game type, and current difficulty, response time can provide additional information about how you performed during an activity."
  },
  {
    id: 27,
    category: 'AI and Personalization',
    keywords: ['personalization useful for elderly', 'why personalize', 'bujurg ke liye faydemand'],
    question: 'Why is personalization useful for elderly users?',
    answer: "Every person has different abilities, experience, comfort levels, and performance patterns. A fixed difficulty may be too easy for one person and too difficult for another. Personalization allows SMRITI to adjust the cognitive activities according to the user's observed performance and provide a more comfortable experience."
  },
  {
    id: 28,
    category: 'AI and Personalization',
    keywords: ['learn my abilities', 'learn over time', 'smriti seekhta hai'],
    question: 'Can SMRITI learn my abilities over time?',
    answer: "SMRITI can use the performance information collected from your activities to make future recommendations more personalized. As more activity results become available, the system has more information about your previous performance. However, these results should not be interpreted as a medical measurement of your cognitive health."
  },

  // 4. SCORES AND PROGRESS
  {
    id: 29,
    category: 'Scores and Progress',
    keywords: ['what does my score mean', 'score meaning', 'marks meaning', 'score ka kya matlab'],
    question: 'What does my score mean?',
    answer: "Your score represents your performance in a particular cognitive activity. It can help you understand how you performed during that session and can contribute to tracking your activity over time. A score should not be interpreted as a medical diagnosis or as a complete measure of your cognitive health."
  },
  {
    id: 30,
    category: 'Scores and Progress',
    keywords: ['is low score bad', 'bad score', 'kam number kharab hai', 'failed score'],
    question: 'Is a low score bad?',
    answer: "No. A lower score simply means that you found that particular activity more challenging during that session. Performance can change because of many factors, including tiredness, concentration, familiarity with the game, or the difficulty level. One score should not be used to make conclusions about your health."
  },
  {
    id: 31,
    category: 'Scores and Progress',
    keywords: ['score decrease', 'why score dropped', 'score kam kyu hua', 'marks decreased'],
    question: 'Why did my score decrease?',
    answer: "Scores can naturally change from one session to another. You may have been tired, distracted, unfamiliar with the activity, or working at a different difficulty level. Instead of focusing on one score, it can be more useful to look at your activity over time and discuss any health concerns with a healthcare professional."
  },
  {
    id: 32,
    category: 'Scores and Progress',
    keywords: ['score increase', 'why score went up', 'score badh gaya', 'marks increased'],
    question: 'Why did my score increase?',
    answer: "Your score may increase as you become more familiar with an activity, concentrate better, or perform more accurately during that session. Improvement in a game score is useful information about that particular activity, but it should not be interpreted as proof of a medical improvement or diagnosis."
  },
  {
    id: 33,
    category: 'Scores and Progress',
    keywords: ['see previous scores', 'view past scores', 'pichle score dekhna', 'score history'],
    question: 'Can I see my previous scores?',
    answer: "If your version of SMRITI provides performance history, you can review your previous scores and activity results. Looking at several sessions can give you a better understanding of your participation and performance than looking at only one result."
  },
  {
    id: 34,
    category: 'Scores and Progress',
    keywords: ['performance is improving', 'am i getting better', 'kya sudhar ho raha hai', 'progress check'],
    question: 'How can I know whether my performance is improving?',
    answer: "You can review your activity history and compare results from different sessions when that information is available. Look at patterns over time rather than focusing on a single score. If you or your caregiver notice significant or concerning changes in everyday memory or thinking, discuss them with a healthcare professional."
  },
  {
    id: 35,
    category: 'Scores and Progress',
    keywords: ['tell if i have dementia', 'score dementia test', 'kya score se bimari pata chalti'],
    question: 'Can my score tell me whether I have dementia?',
    answer: "No. A game score cannot diagnose dementia. Cognitive performance can be affected by many factors, and a proper assessment requires a qualified healthcare professional. SMRITI's scores are intended for activity tracking and personalization, not medical diagnosis."
  },

  // 5. DEMENTIA AND HEALTH-RELATED QUESTIONS
  {
    id: 36,
    category: 'Dementia and Health-Related Questions',
    keywords: ['can smriti diagnose dementia', 'diagnose dementia', 'dementia diagnosis', 'kya dementia ka pata lagata hai'],
    question: 'Can SMRITI diagnose dementia?',
    answer: "No. SMRITI is not a diagnostic tool and cannot determine whether someone has dementia. Its games and performance scores are designed for cognitive engagement and personalization. If you or your family notice concerning changes in memory, thinking, communication, or everyday functioning, please discuss them with a qualified healthcare professional."
  },
  {
    id: 37,
    category: 'Dementia and Health-Related Questions',
    keywords: ['can smriti cure dementia', 'cure dementia', 'ilaaj hai kya', 'can dementia be cured'],
    question: 'Can SMRITI cure dementia?',
    answer: "No. SMRITI does not claim to cure dementia. It is designed to provide cognitive activities, memory-support features, and an engaging digital experience. Medical conditions such as dementia require appropriate professional evaluation and care."
  },
  {
    id: 38,
    category: 'Dementia and Health-Related Questions',
    keywords: ['think i have dementia', 'mujhe dementia hai kya', 'do i have dementia', 'worried about dementia'],
    question: 'I think I may have dementia. What should I do?',
    answer: "If you are concerned about changes in your memory or thinking, please talk to someone you trust, such as a family member or caregiver, and consider speaking with a qualified healthcare professional. They can properly assess your symptoms and provide appropriate guidance. You can continue using SMRITI as a cognitive-support tool, but its game results should not be used to diagnose yourself."
  },
  {
    id: 39,
    category: 'Dementia and Health-Related Questions',
    keywords: ['memory getting worse', 'memory declining', 'yaadashth kamjor ho rahi', 'losing memory'],
    question: 'My memory seems to be getting worse. What should I do?',
    answer: "If you have noticed ongoing or significant changes in your memory, it is important to discuss them with a healthcare professional. You can also tell a trusted family member or caregiver so they can support you and help keep track of changes. SMRITI can provide cognitive activities and memory support, but it cannot determine the medical cause of memory changes."
  },
  {
    id: 40,
    category: 'Dementia and Health-Related Questions',
    keywords: ['trouble remembering things today', 'hard to remember today', 'aaj yaad nahi reh raha'],
    question: 'I am having trouble remembering things today. What should I do?',
    answer: "Start by checking your reminders, notes, and planned activities in SMRITI. Give yourself time and try to focus on one task at a time. If the difficulty is unusual, persistent, or concerning, tell someone you trust and seek appropriate medical advice."
  },
  {
    id: 41,
    category: 'Dementia and Health-Related Questions',
    keywords: ['replace my doctor', 'substitute doctor', 'doctor ki jagah', 'is smriti a doctor'],
    question: 'Can SMRITI replace my doctor?',
    answer: "No. SMRITI is a digital cognitive-support application and cannot replace a doctor or other qualified healthcare professional. A healthcare professional is needed for diagnosis, medical advice, treatment decisions, and evaluation of significant changes in memory or thinking."
  },
  {
    id: 42,
    category: 'Dementia and Health-Related Questions',
    keywords: ['replace my caregiver', 'substitute caregiver', 'caregiver ki jarurat nahi'],
    question: 'Can SMRITI replace my caregiver?',
    answer: "No. SMRITI is designed to support the user, not replace personal care or human assistance. Caregivers and family members can provide emotional support, help with daily activities, and assist when the user is confused or needs help."
  },

  // 6. CAREGIVER QUESTIONS
  {
    id: 43,
    category: 'Caregiver Questions',
    keywords: ['help someone use smriti', 'assist patient', 'kaise madat kare', 'guide user'],
    question: 'How can I help someone use SMRITI?',
    answer: "Encourage the person to use SMRITI at a comfortable pace and help them understand the activities when needed. Avoid putting pressure on them to achieve a particular score. You can also encourage regular routines, help them review reminders, and pay attention to concerns they may communicate about their memory or daily activities."
  },
  {
    id: 44,
    category: 'Caregiver Questions',
    keywords: ['user struggles with game', 'patient finding game hard', 'problem in game'],
    question: 'What should I do if the user struggles with a game?',
    answer: "Encourage the user to take their time and avoid making them feel pressured. SMRITI's adaptive system can recommend a more suitable difficulty based on performance. If the user becomes tired or frustrated, allow them to take a break. Remember that difficulty with a game does not automatically indicate a medical problem."
  },
  {
    id: 45,
    category: 'Caregiver Questions',
    keywords: ['force someone to complete', 'compel to play', 'dabav daalna', 'force game'],
    question: 'Should I force someone to complete a game?',
    answer: "No. Cognitive activities should be supportive rather than stressful. If the person becomes tired, frustrated, or uncomfortable, allow them to stop and take a break. Encourage participation without making the person feel that their score determines their health or ability."
  },
  {
    id: 46,
    category: 'Caregiver Questions',
    keywords: ['worried about one low score', 'single bad score', 'ek bar score kam aaya'],
    question: 'Should I be worried about one low score?',
    answer: "One low score does not by itself indicate a medical problem. Performance can vary because of tiredness, attention, unfamiliarity with the activity, or other everyday factors. It is more useful to look at broader patterns and, if you notice concerning changes in everyday functioning, discuss them with a healthcare professional."
  },
  {
    id: 47,
    category: 'Caregiver Questions',
    keywords: ['how often use smriti', 'frequency of play', 'kitni baar use kare', 'daily routine smriti'],
    question: 'How often should someone use SMRITI?',
    answer: "The user should follow a comfortable routine that suits their individual needs. Encourage regular engagement if they enjoy the activities, but allow sufficient breaks and avoid turning the application into a source of pressure. If the person has specific medical or care requirements, follow the guidance of their healthcare professional or caregiver."
  },
  {
    id: 48,
    category: 'Caregiver Questions',
    keywords: ['caregiver see progress', 'can i see user progress', 'track patient progress'],
    question: "Can a caregiver see the user's progress?",
    answer: "This depends on the caregiver and progress-sharing features available in your version of SMRITI. Where such features are provided, authorized caregivers can use the available information to support the user. User information should be handled carefully and shared only with appropriate authorization."
  },
  {
    id: 49,
    category: 'Caregiver Questions',
    keywords: ['major changes in memory', 'sudden memory loss', 'bada badlav', 'drastic decline'],
    question: "What should I do if I notice major changes in the user's memory?",
    answer: "Do not rely only on SMRITI scores to understand the change. Talk with the person and note any changes you observe in their everyday activities, memory, communication, or behavior. If the changes are concerning or persistent, contact a qualified healthcare professional for appropriate evaluation."
  },
  {
    id: 50,
    category: 'Caregiver Questions',
    keywords: ['help a person with dementia in daily life', 'smriti for dementia daily life', 'rojmarra ki zindagi me madad'],
    question: 'How can SMRITI help a person with dementia in daily life?',
    answer: "SMRITI can provide a structured digital environment for cognitive activities, memory-support features, and personalized difficulty. Its adaptive approach can adjust activities according to observed performance, while progress information can help users and authorized caregivers understand activity patterns. SMRITI is intended to support the person, not replace professional healthcare, family support, or caregiving."
  }
];

/**
 * Searches the 50 Q&As for the closest match to the user query
 * @param {string} userQuery
 * @returns {object|null} Matched FAQ item with confidence score or null
 */
export function findBestFAQMatch(userQuery) {
  if (!userQuery || typeof userQuery !== 'string') return null;
  const clean = userQuery.trim().toLowerCase().replace(/[?.,!']/g, '');
  const queryWords = clean.split(/\s+/).filter(w => w.length > 2);

  let bestMatch = null;
  let highestScore = 0;

  for (const faq of SAATHI_FAQ_LIST) {
    let score = 0;
    const qClean = faq.question.toLowerCase().replace(/[?.,!']/g, '');

    // Exact question match
    if (clean === qClean) {
      return { faq, score: 100 };
    }

    // Substring match
    if (clean.includes(qClean) || qClean.includes(clean)) {
      score += 40;
    }

    // Keyword match
    for (const kw of faq.keywords) {
      const kwClean = kw.toLowerCase();
      if (clean.includes(kwClean)) {
        score += 25;
      }
    }

    // Word overlap match
    const qWords = qClean.split(/\s+/).filter(w => w.length > 2);
    let overlap = 0;
    for (const w of queryWords) {
      if (qWords.includes(w)) overlap++;
    }
    if (queryWords.length > 0) {
      score += (overlap / queryWords.length) * 30;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  // Threshold to avoid false positives
  if (highestScore >= 18) {
    return { faq: bestMatch, score: highestScore };
  }
  return null;
}

export default {
  SAATHI_FAQ_LIST,
  findBestFAQMatch
};
