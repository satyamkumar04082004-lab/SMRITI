/* ============================================================
   SMRITI — Wellness & Mindful Habits
   Hooked into reactive global i18n state and spoken voice guidance
   ============================================================ */

import TTS from '../tts.js';
import I18n from '../i18n.js';

export default function WellnessPage(container) {
  let isBreathing = false;
  let breathInterval = null;
  let breathPhase = 'ready'; // ready | inhale | hold | exhale
  let breathCount = 4;
  let cycleCount = 0;

  function getGuides() {
    const lang = I18n.lang;
    if (lang === 'hi') {
      return [
        {
          id: 'sleep',
          icon: '🌙',
          title: 'आरामदायक नींद और संध्या शांति',
          summary: 'नियमित आराम याददाश्त, मूड और दैनिक ऊर्जा को पुनर्जीवित करता है।',
          whatItIs: 'अच्छी गुणवत्ता वाली नींद आपके मस्तिष्क को स्मृतियों को व्यवस्थित करने और अगली सुबह के लिए तरोताजा करने में मदद करती है।',
          habits: [
            'सोने से पहले शांत दिनचर्या बनाएं (हल्का गर्म दूध, मधुर वाचन, या शांत संगीत)।',
            'शयनकक्ष को मंद रोशनी, शांत और आरामदायक रखें।',
            'सोने से ठीक पहले भारी भोजन या अत्यधिक मोबाइल स्क्रीन से बचें।'
          ],
          whenToAskDoctor: 'यदि अनिद्रा कई हफ्तों तक बनी रहे या दिन में अत्यधिक थकान का कारण बने।'
        },
        {
          id: 'hydration',
          icon: '💧',
          title: 'दैनिक जलपान और ताज़ा पानी',
          summary: 'उचित जलयोजन आपको सतर्क, ऊर्जावान और शांत रखता है।',
          whatItIs: 'पानी रक्त परिसंचरण में सुधार करता है और सभी अंगों, विशेषकर मस्तिष्क की कोशिकाओं को सुचारू रखता है।',
          habits: [
            'दिन भर में एक सुंदर पानी का जग या फ्लास्क अपनी आसान पहुंच में रखें।',
            'सादा पानी अच्छा न लगे तो नींबू पानी या हर्बल चाय का आनंद लें।',
            'प्यास लगने का इंतजार करने के बजाय नियमित रूप से छोटे-छोटे घूंट लें।'
          ],
          whenToAskDoctor: 'यदि मुंह बहुत सूखा रहे, चक्कर आएं या तरल पदार्थ निगलने में कठिनाई हो।'
        },
        {
          id: 'nutrition',
          icon: '🥗',
          title: 'पौष्टिक एवं संतुलित आहार',
          summary: 'रंगीन सब्जियों, अनाजों और मौसमी फलों से भरपूर ताजा भोजन।',
          whatItIs: 'पोषक तत्वों से भरपूर भोजन शरीर और मन को स्थिर ऊर्जा प्रदान करता है।',
          habits: [
            'हरी पत्तेदार सब्जियां, मौसमी फल और गर्म घर का बना खाना शामिल करें।',
            'अखरोट, बादाम, बीज और हल्के तेल जैसे स्वास्थ्यवर्धक वसा शामिल करें।',
            'परिवार या प्रियजनों के साथ नियमित समय पर भोजन का आनंद लें।'
          ],
          whenToAskDoctor: 'यदि भूख में अचानक कमी आए, तेजी से वजन घटे या लगातार अपच रहे।'
        },
        {
          id: 'movement',
          icon: '🚶',
          title: 'सहज और कोमल शारीरिक गति',
          summary: 'दैनिक छोटी सैर, हल्का खिंचाव और बागवानी।',
          whatItIs: 'हल्की हलचल से मस्तिष्क में रक्त प्रवाह बढ़ता है और मूड प्रसन्न रहता है।',
          habits: [
            'सुबह या शाम को 15-20 मिनट की सुखद सैर करें।',
            'कुर्सी पर बैठकर धीरे-धीरे गर्दन और कंधों को हिलाएं।',
            'आंगन या बालकनी के पौधों को पानी दें।'
          ],
          whenToAskDoctor: 'यदि जोड़ों में अचानक दर्द हो, चलने पर सांस फूले या संतुलन बिगड़े।'
        },
        {
          id: 'breathing',
          icon: '🫁',
          title: 'शांत श्वास अभ्यास और विश्राम',
          summary: 'तनाव दूर करने और मन को एकाग्र करने के लिए सरल प्राणायाम।',
          whatItIs: 'धीमी, गहरी सांसें लेने से शरीर की प्राकृतिक विश्राम प्रणाली सक्रिय होती है।',
          habits: [
            '4-4 श्वास अभ्यास: 4 सेकंड तक धीरे-धीरे सांस लें, 4 सेकंड में धीरे-धीरे छोड़ें।',
            'हाथों को गोद में रखें और अपनी छाती के उठने-गिरने को महसूस करें।',
            'बगीचे में बैठकर या चाय की चुस्की के साथ शांत श्वास लें।'
          ],
          whenToAskDoctor: 'यदि लगातार घबराहट रहे, दिल की धड़कन तेज हो या सीने में भारीपन लगे।'
        },
        {
          id: 'social',
          icon: '☕',
          title: 'सामाजिक आनंद और अपनों से जुड़ाव',
          summary: 'कहानियां साझा करना, फोन पर बात करना और पड़ोसियों से मिलना।',
          whatItIs: 'स्नेहपूर्ण बातचीत से याददाश्त सक्रिय होती है और दिल को खुशी मिलती है।',
          habits: [
            'रोजाना किसी रिश्तेदार, बच्चे या मित्र को 10 मिनट का फोन कॉल करें।',
            'पुराने फोटो एलबम साथ मिलकर देखें और सुखद यादें ताजा करें।',
            'सामुदायिक चाय बैठक या सांस्कृतिक आयोजनों में भाग लें।'
          ],
          whenToAskDoctor: 'यदि लंबे समय तक अकेलापन महसूस हो या बातचीत से पूरी तरह दूरी बन जाए।'
        }
      ];
    }

    if (lang === 'as') {
      return [
        {
          id: 'sleep',
          icon: '🌙',
          title: 'শান্তিময় টোপনি আৰু সন্ধিয়াৰ প্ৰশান্তি',
          summary: 'নিয়মীয়া টোপনিয়ে স্মৃতিশক্তি, মনৰ আনন্দ আৰু শক্তি সতেজ ৰাখে।',
          whatItIs: 'উন্নত টোপনিয়ে মগজুক পুৰণি স্মৃতি সংৰক্ষণ কৰাত আৰু নতুন দিনৰ বাবে সাজু হোৱাত সহায় কৰে।',
          habits: [
            'শুবলৈ যোৱাৰ আগেয়ে শান্ত পৰিবেশ ৰাখক (কুহুমীয়া গাখীৰ বা মৃদু গান)।',
            'শোৱাকোঠাখন মৃদু পোহৰ আৰু শান্ত কৰি ৰাখক।',
            'শোৱাৰ ঠিক আগেয়ে মোবাইল বা টিভি চোৱাৰ পৰা বিৰত থাকক।'
          ],
          whenToAskDoctor: 'যদি অনিদ্ৰা বহু সপ্তাহ ধৰি থাকে বা দিনত অতিশয় ভাগৰ লাগে।'
        },
        {
          id: 'hydration',
          icon: '💧',
          title: 'দৈনিক পানী পান আৰু সতেজতা',
          summary: 'পৰ্যাপ্ত পানীয়ে শৰীৰ সতেজ আৰু মন সজাগ ৰাখে।',
          whatItIs: 'পানীয়ে মগজুৰ কোষসমূহক সুস্থভাৱে কাৰ্যক্ষম কৰি ৰখাত সহায় কৰে।',
          habits: [
            'চকুৰ আগতে এখন সুন্দৰ পানীৰ জগ বা বটল ৰাখক।',
            'আদা দিয়া ৰঙা চাহ বা নেমু পানী খাব পাৰে।',
            'পিয়াহ লগালৈ ৰৈ নাথাকি সঘনাই অলপ অলপকৈ পানী খাওক।'
          ],
          whenToAskDoctor: 'মুখ শুকাই থাকিলে বা মূৰ ঘূৰালে চিকিৎসকৰ পৰামৰ্শ লওক।'
        },
        {
          id: 'movement',
          icon: '🚶',
          title: 'মৃদু খোজকঢ়া আৰু প্ৰাতঃভ্ৰমণ',
          summary: 'দৈনিক পুৱাৰ চমু খোজ আৰু ফুলনিৰ যত্ন।',
          whatItIs: 'মৃদু খোজকঢ়াই মগজুলৈ তেজৰ চলাচল বৃদ্ধি কৰে আৰু মন ভাল ৰাখে।',
          habits: [
            'পুৱা বা সন্ধিয়া ১৫-২০ মিনিট প্ৰাতঃভ্ৰমণ কৰক।',
            'চকীত বহি হাত-ভৰিৰ লৰচৰ কৰক।',
            'বাৰীৰ ফুল-গছত পানী দিয়ক।'
          ],
          whenToAskDoctor: 'যদি গাঁঠিত বিষ অনুভৱ হয় বা খোজকাঢ়োঁতে উশাহ লবলৈ কষ্ট হয়।'
        },
        {
          id: 'breathing',
          icon: '🫁',
          title: 'প্ৰশান্ত উশাহ-নিশাহ আৰু শিথিলতা',
          summary: 'মানসিক চাপ কমাবলৈ সহজ ৪-৪ উশাহৰ অনুশীলন।',
          whatItIs: 'ধীৰে ধীৰে উশাহ ললে শৰীৰ আৰু স্নায়ুতন্ত্ৰ শান্ত হয়।',
          habits: [
            '৪ গণনাত লাহেকৈ উশাহ লওক, ৪ গণনাত লাহেকৈ এৰক।',
            'কোলাত হাত থৈ বুকুৰ ওঠন-নমন অনুভৱ কৰক।',
            'বাৰান্দাত বহি চাহৰ সৈতে শান্ত উশাহ লওক।'
          ],
          whenToAskDoctor: 'যদি বুকু ধপধপায় বা উশাহ চুটি হয়।'
        }
      ];
    }

    // Default English
    return [
      {
        id: 'sleep',
        icon: '🌙',
        title: 'Restful Sleep & Evening Peace',
        summary: 'Consistent rest rejuvenates memory, mood, and daily energy.',
        whatItIs: 'Good quality sleep allows your brain to organize memories and refresh your mind for the next morning.',
        habits: [
          'Maintain a calming bedtime routine (warm milk, soft reading, or gentle music).',
          'Keep bedroom dimly lit, quiet, and comfortable.',
          'Avoid heavy meals or excessive screen time right before sleeping.'
        ],
        whenToAskDoctor: 'If sleeplessness persists for multiple weeks or causes sudden extreme daytime fatigue.'
      },
      {
        id: 'hydration',
        icon: '💧',
        title: 'Daily Hydration & Fresh Water',
        summary: 'Proper hydration keeps you alert, energized, and clear-headed.',
        whatItIs: 'Water supports circulation and helps all body organs operate smoothly, especially brain cells.',
        habits: [
          'Keep a pleasant water flask or jug in easy sight throughout the day.',
          'Enjoy herbal teas or infused lemon water if plain water feels dull.',
          'Take small sips regularly rather than waiting until you feel thirsty.'
        ],
        whenToAskDoctor: 'If you experience severe dry mouth, dizziness, or difficulty swallowing liquids.'
      },
      {
        id: 'nutrition',
        icon: '🥗',
        title: 'Wholesome Everyday Eating',
        summary: 'Nourishing meals rich in colorful vegetables, grains, and fruits.',
        whatItIs: 'Nutrient-dense foods provide steady energy without sudden sugar spikes or sluggishness.',
        habits: [
          'Include leafy greens, seasonal berries/fruits, and warm home-cooked meals.',
          'Incorporate healthy fats like nuts, seeds, and light oils.',
          'Enjoy meals at steady, predictable times with family or friends.'
        ],
        whenToAskDoctor: 'If you experience a sharp loss of appetite, sudden unintended weight loss, or persistent indigestion.'
      },
      {
        id: 'movement',
        icon: '🚶',
        title: 'Gentle Physical Movement',
        summary: 'Daily short walks, light stretching, and gardening.',
        whatItIs: 'Movement increases blood flow to the brain, supports joint mobility, and elevates mood.',
        habits: [
          'Take a pleasant 15–20 minute stroll in the morning or early evening.',
          'Practice gentle seated ankle, neck, and shoulder stretches.',
          'Engage in light gardening or patio plant watering.'
        ],
        whenToAskDoctor: 'If you feel sudden joint pain, shortness of breath upon light walking, or balance instability.'
      },
      {
        id: 'breathing',
        icon: '🫁',
        title: 'Calming Breathing & Relaxation',
        summary: 'Simple breathwork to soothe stress and center the mind.',
        whatItIs: 'Taking conscious slow breaths activates your body’s natural relaxation response.',
        habits: [
          'Try the 4-4 breath: Inhale gently for 4 counts, exhale smoothly for 4 counts.',
          'Rest your hands on your lap and notice the rise and fall of your chest.',
          'Pair relaxing breathing with a soothing cup of tea or garden view.'
        ],
        whenToAskDoctor: 'If you feel persistent panic, chronic heart palpitations, or unexplained chest tightness.'
      },
      {
        id: 'social',
        icon: '☕',
        title: 'Social Joy & Connecting with Loved Ones',
        summary: 'Sharing stories, phone calls, and neighborly visits.',
        whatItIs: 'Warm conversations activate speech centers, recall memories, and nurture emotional happiness.',
        habits: [
          'Schedule a daily 10-minute check-in call with a child, relative, or friend.',
          'Look at old family photo albums together and recount fond adventures.',
          'Join group community tea sessions or temple/cultural gatherings.'
        ],
        whenToAskDoctor: 'If you feel prolonged emotional isolation, deep withdrawal from all social interaction, or hopelessness.'
      }
    ];
  }

  function render() {
    const guides = getGuides();
    const isHindi = I18n.lang === 'hi';
    const isAssamese = I18n.lang === 'as';

    const headerTitle = isHindi ? 'स्वास्थ्य और शांत आदतें 🌿' : (isAssamese ? 'সুস্থতা আৰু মানসিক শান্তি 🌿' : 'Wellness & Mindful Habits');
    const headerSub = isHindi ? 'स्वस्थ जीवन, शांति और सकारात्मक ऊर्जा के लिए सरल दैनिक अभ्यास।' : (isAssamese ? 'সুস্থ জীৱন আৰু মনৰ আনন্দৰ বাবে দৈনিক সহজ অভ্যাস।' : 'Simple, peaceful daily practices for healthy living and joyful energy.');
    const breathTitle = isHindi ? '🫁 ४-४ निर्देशित श्वास अभ्यास' : (isAssamese ? '🫁 ৪-৪ নিৰ্দেশিত উশাহ অনুশীলন' : '🫁 4-4 Guided Breathing Exercise');
    const breathSub = isHindi ? 'तनाव दूर करने और हृदय गति को शांत करने के लिए फैलते वृत्त का अनुसरण करें।' : (isAssamese ? 'মানসিক চাপ দূৰ কৰিবলৈ শান্ত বৃত্তটো লক্ষ্য কৰক।' : 'Follow the soothing expanding circle to release tension and calm your heartbeat.');
    const startBreathText = isHindi ? '▶ श्वास अभ्यास शुरू करें' : (isAssamese ? '▶ উশাহ অনুশীলন আৰম্ভ কৰক' : '▶ Start Breathing Exercise');
    const stopBreathText = isHindi ? '⏹ अभ्यास समाप्त करें' : (isAssamese ? '⏹ অনুশীলন সমাপ্ত কৰক' : '⏹ Stop Exercise');
    const readyText = isHindi ? 'शांत श्वास लेने के लिए तैयार?' : (isAssamese ? 'প্ৰশান্ত উশাহ লবলৈ সাজুনে?' : 'Ready to breathe peacefully?');
    const disclaimerTitle = isHindi ? 'शैक्षणिक सूचना:' : (isAssamese ? 'শিক্ষামূলক জাননী:' : 'Educational Notice:');
    const disclaimerText = isHindi ? 'यह मार्गदर्शिका सामान्य स्वास्थ्य शिक्षा और आत्म-देखभाल प्रेरणा प्रदान करती है। यह व्यक्तिगत चिकित्सा सलाह या निदान नहीं है। हमेशा अपने योग्य चिकित्सक से परामर्श लें।' : (isAssamese ? 'এই পথপ্ৰদৰ্শনে সাধাৰণ সুস্থতা আৰু যত্নৰ বাবে সহায় কৰে। ব্যক্তিগত স্বাস্থ্যৰ বাবে চিকিৎসকৰ পৰামৰ্শ লওক।' : 'This guide provides general wellness education and self-care inspiration. It is not medical advice, diagnosis, or prescription. Always consult your qualified doctor or healthcare provider for personal medical guidance.');
    const backText = isHindi ? '🏠 होम पर वापस जाएं' : (isAssamese ? '🏠 ঘৰলৈ উভতি যাওক' : '🏠 Back to Home');
    const whatIsLabel = isHindi ? '💡 यह क्या है' : (isAssamese ? '💡 ই কি' : '💡 What it is');
    const habitsLabel = isHindi ? '🌱 कोमल उपयोगी आदतें' : (isAssamese ? '🌱 মৃদু উপকাৰী অভ্যাস' : '🌱 Gentle Helpful Habits');
    const docLabel = isHindi ? '🩺 डॉक्टर से कब संपर्क करें:' : (isAssamese ? '🩺 চিকিৎসকৰ ওচৰলৈ কেতিয়া যাব:' : '🩺 When to consult a professional:');

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 720px; padding-bottom: 2rem;">
        <!-- Header Banner -->
        <div class="card card-elevated text-center" style="background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 1px solid #BBF7D0; padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌿🌻</div>
          <h2 style="color: #065F46; font-size: 1.7rem; margin-bottom: 0.25rem;">${headerTitle}</h2>
          <p style="color: #047857; font-size: 1.05rem; margin-bottom: 0;">${headerSub}</p>
        </div>

        <!-- Interactive 4-4 Guided Breathing Exercise -->
        <div class="card card-elevated mb-md text-center" style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border: 2px solid #BFDBFE; padding: 2rem 1.25rem; border-radius: 20px;">
          <h3 style="color: #1E40AF; font-size: 1.35rem; margin-bottom: 0.25rem;">${breathTitle}</h3>
          <p style="color: #1E3A8A; font-size: 1rem; margin-bottom: 1.5rem;">${breathSub}</p>

          <!-- Animated Breathing Visual Circle -->
          <div style="display: flex; justify-content: center; align-items: center; margin: 1rem auto 1.5rem auto; height: 180px;">
            <div id="breath-circle" style="width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, #60A5FA, #3B82F6); box-shadow: 0 0 35px rgba(59, 130, 246, 0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.8rem; transition: transform 4s cubic-bezier(0.4, 0, 0.2, 1);">
              <span id="breath-timer-text">🕊️</span>
            </div>
          </div>

          <div id="breath-instruction" style="font-size: 1.25rem; font-weight: 700; color: #1E40AF; min-height: 36px; margin-bottom: 1rem;">
            ${readyText}
          </div>

          <button id="btn-toggle-breath" class="btn btn-primary" style="min-height: 52px; font-size: 1.15rem; font-weight: 700; padding: 0.6rem 2.2rem; background: #2563EB;">
            ${isBreathing ? stopBreathText : startBreathText}
          </button>
        </div>

        <!-- Medical Disclaimer -->
        <div class="safety-notice mb-md" style="background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; border-radius: 12px; padding: 0.9rem 1.1rem;">
          <span class="notice-icon" style="font-size: 1.3rem;">ℹ️</span>
          <div style="font-size: 0.95rem; line-height: 1.5;">
            <strong>${disclaimerTitle}</strong> ${disclaimerText}
          </div>
        </div>

        <!-- Wellness Topics List -->
        <div class="wellness-list" style="display: flex; flex-direction: column; gap: 1rem;">
          ${guides.map(item => `
            <div class="card card-elevated wellness-card" style="padding: 1.25rem; border: 1px solid #E2E8F0; transition: transform 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 1rem; cursor: pointer;" class="wellness-toggle-header">
                <div style="font-size: 2.2rem; background: #FDF8F3; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
                  ${item.icon}
                </div>
                <div style="flex: 1;">
                  <h3 style="color: var(--maroon); margin-bottom: 0.2rem; font-size: 1.25rem;">${item.title}</h3>
                  <p class="text-muted" style="margin-bottom: 0; font-size: 0.95rem;">${item.summary}</p>
                </div>
                <div class="toggle-arrow" style="font-size: 1.2rem; color: var(--gray-500);">▼</div>
              </div>

              <div class="wellness-details" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #F1F5F9;">
                <div style="margin-bottom: 0.85rem;">
                  <strong style="color: var(--teal); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">${whatIsLabel}</strong>
                  <p style="margin-top: 0.25rem; font-size: 1rem; color: var(--gray-700);">${item.whatItIs}</p>
                </div>

                <div style="margin-bottom: 0.85rem;">
                  <strong style="color: var(--green); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">${habitsLabel}</strong>
                  <ul style="margin-top: 0.35rem; padding-left: 1.25rem; font-size: 0.98rem; color: var(--gray-700); display: flex; flex-direction: column; gap: 0.35rem;">
                    ${item.habits.map(h => `<li>${h}</li>`).join('')}
                  </ul>
                </div>

                <div style="background: #F8FAFC; padding: 0.75rem 1rem; border-radius: 8px; border-left: 4px solid var(--maroon);">
                  <strong style="color: var(--maroon); font-size: 0.9rem;">${docLabel}</strong>
                  <p style="margin: 0.2rem 0 0 0; font-size: 0.95rem; color: var(--gray-700);">${item.whenToAskDoctor}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Back / Quick Link Button -->
        <div class="text-center mt-lg">
          <button id="btn-wellness-back-home" class="btn btn-secondary" style="padding: 0.75rem 2rem;">
            ${backText}
          </button>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const btnToggleBreath = container.querySelector('#btn-toggle-breath');
    const circle = container.querySelector('#breath-circle');
    const timerText = container.querySelector('#breath-timer-text');
    const instruction = container.querySelector('#breath-instruction');
    const isHindi = I18n.lang === 'hi';
    const isAssamese = I18n.lang === 'as';

    function startBreathing() {
      isBreathing = true;
      btnToggleBreath.textContent = isHindi ? '⏹ अभ्यास समाप्त करें' : (isAssamese ? '⏹ সমাপ্ত কৰক' : '⏹ Stop Exercise');
      btnToggleBreath.style.background = '#DC2626';
      cycleCount = 0;
      runPhase('inhale');
    }

    function stopBreathing() {
      isBreathing = false;
      clearTimeout(breathInterval);
      btnToggleBreath.textContent = isHindi ? '▶ श्वास अभ्यास शुरू करें' : (isAssamese ? '▶ আৰম্ভ কৰক' : '▶ Start Breathing Exercise');
      btnToggleBreath.style.background = '#2563EB';
      if (circle) circle.style.transform = 'scale(1)';
      if (timerText) timerText.textContent = '🕊️';
      if (instruction) instruction.textContent = isHindi ? 'शांत श्वास लेने के लिए तैयार?' : (isAssamese ? 'প্ৰশান্ত উশাহ লবলৈ সাজুনে?' : 'Ready to breathe peacefully?');
    }

    function runPhase(phase) {
      if (!isBreathing) return;
      breathPhase = phase;
      let count = 4;

      if (phase === 'inhale') {
        if (circle) circle.style.transform = 'scale(1.4)';
        const inMsg = isHindi ? 'धीरे-धीरे सांस अंदर लें... 🌸' : (isAssamese ? 'লাহেকৈ উশাহ ভিতৰলৈ লওক... 🌸' : 'Breathe in gently... 🌸');
        if (instruction) instruction.textContent = inMsg;
        if (timerText) timerText.textContent = '4';
        if (TTS && TTS.isSupported() && cycleCount === 0) TTS.speak(inMsg);
      } else {
        if (circle) circle.style.transform = 'scale(1)';
        const outMsg = isHindi ? 'धीरे-धीरे सांस बाहर छोड़ें... 🍃' : (isAssamese ? 'লাহেকৈ উশাহ এৰি দিয়ক... 🍃' : 'Breathe out slowly... 🍃');
        if (instruction) instruction.textContent = outMsg;
        if (timerText) timerText.textContent = '4';
        if (TTS && TTS.isSupported() && cycleCount === 0) TTS.speak(outMsg);
      }

      const countdown = () => {
        if (!isBreathing) return;
        count--;
        if (count > 0) {
          if (timerText) timerText.textContent = count;
          breathInterval = setTimeout(countdown, 1000);
        } else {
          if (phase === 'inhale') {
            runPhase('exhale');
          } else {
            cycleCount++;
            if (cycleCount >= 4) {
              stopBreathing();
              const doneMsg = isHindi ? 'बहुत बढ़िया! आप शांत और तरोताजा महसूस कर रहे हैं। ✨' : (isAssamese ? 'বৰ সুন্দৰ! আপুনি এতিয়া শান্ত অনুভৱ কৰিছে। ✨' : 'Wonderful job! You feel calmer and centered. ✨');
              if (instruction) instruction.textContent = doneMsg;
              if (TTS && TTS.isSupported()) TTS.speak(doneMsg);
            } else {
              runPhase('inhale');
            }
          }
        }
      };

      breathInterval = setTimeout(countdown, 1000);
    }

    if (btnToggleBreath) {
      btnToggleBreath.addEventListener('click', () => {
        if (isBreathing) stopBreathing();
        else startBreathing();
      });
    }

    // Toggle card details
    container.querySelectorAll('.wellness-toggle-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.wellness-card');
        const details = card.querySelector('.wellness-details');
        const arrow = card.querySelector('.toggle-arrow');
        if (details) {
          const isHidden = details.style.display === 'none';
          details.style.display = isHidden ? 'block' : 'none';
          if (arrow) arrow.textContent = isHidden ? '▼' : '▶';
        }
      });
    });

    const backHomeBtn = container.querySelector('#btn-wellness-back-home');
    if (backHomeBtn) {
      backHomeBtn.addEventListener('click', () => {
        window.location.hash = '#/home';
      });
    }
  }

  // Reactive listener to languageChanged event
  const langChangeHandler = () => {
    render();
  };
  window.addEventListener('languageChanged', langChangeHandler);

  render();

  return {
    cleanup() {
      if (breathInterval) clearTimeout(breathInterval);
      window.removeEventListener('languageChanged', langChangeHandler);
      TTS.stop();
    }
  };
}
