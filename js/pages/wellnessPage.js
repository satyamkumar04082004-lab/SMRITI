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
    const lang = I18n.lang || 'en';

    if (lang === 'bn') {
      return [
        {
          id: 'sleep',
          icon: '🌙',
          title: 'শান্তিময় ঘুম ও সন্ধ্যার প্রশান্তি',
          summary: 'নিয়মিত বিশ্রাম স্মৃতিশক্তি, মেজাজ ও প্রাত্যহিক শক্তিকে সতেজ করে।',
          whatItIs: 'ভালো মানের ঘুম মস্তিষ্ককে সারাদিনের স্মৃতি গুছিয়ে রাখতে এবং পরদিনের জন্য সতেজ হতে সাহায্য করে।',
          habits: [
            'ঘুমানোর আগে শান্ত পরিবেশ তৈরি করুন (ঈষদুষ্ণ দুধ, মৃদু সঙ্গীত বা বই পড়া)।',
            'শোবার ঘরটি মৃদু আলোকিত, শান্ত এবং আরামদায়ক রাখুন।',
            'শোবার ঠিক আগে ভারী খাবার বা মোবাইল স্ক্রিন দেখা এড়িয়ে চলুন।'
          ],
          whenToAskDoctor: 'যদি অনিদ্রা কয়েক সপ্তাহ ধরে থাকে বা দিনে অতিরিক্ত দুর্বলতা তৈরি করে।'
        },
        {
          id: 'hydration',
          icon: '💧',
          title: 'দৈনিক জলপান ও সতেজতা',
          summary: 'পর্যাপ্ত জল শরীরকে সতেজ, শান্ত ও মনকে সজাগ রাখে।',
          whatItIs: 'জল রক্ত সঞ্চালনে সাহায্য করে এবং মস্তিষ্কের প্রতিটি কোষকে সুস্থভাবে সচল রাখে।',
          habits: [
            'সারা দিন চোখের সামনে পরিষ্কার জলের জগ বা বোতল রাখুন।',
            'সাধারণ জল ভালো না লাগলে আদা চা বা লেবু জল পান করতে পারেন।',
            'তেষ্টা পাওয়ার অপেক্ষা না করে সারাদিন অল্প অল্প করে জল খান।'
          ],
          whenToAskDoctor: 'যদি মুখ অতিরিক্ত শুকিয়ে যায়, মাথা ঘোরে বা গিলতে সমস্যা হয়।'
        },
        {
          id: 'nutrition',
          icon: '🥗',
          title: 'পুষ্টিকর ও সুষম খাবার',
          summary: 'টাটকা শাকসবজি, ফলমূল ও ঘরে তৈরি সুষম আহার।',
          whatItIs: 'পুষ্টিগুণে সমৃদ্ধ খাবার শরীর ও মনকে সারাদিন সমান শক্তি যোগায়।',
          habits: [
            'সবুজ শাকসবজি, মরশুমি ফল ও গরম হালকা খাবার খান।',
            'আখরোট, বাদাম ও স্বাস্থ্যকর তেল পরিমিত পরিমাণে গ্রহণ করুন।',
            'পরিবারের সাথে নির্দিষ্ট সময়ে হাসিমুখে আহারের আনন্দ নিন।'
          ],
          whenToAskDoctor: 'যদি ক্ষুধামন্দা হঠাৎ দেখা দেয়, দ্রুত ওজন কমে যায় বা বদহজম চলতে থাকে।'
        },
        {
          id: 'movement',
          icon: '🚶',
          title: 'মৃদু শারীরিক সঞ্চালন ও প্রাতঃভ্রমণ',
          summary: 'দৈনিক ছোট পদচারণা, হালকা হাত-পা নাড়াচাড়া ও বাগানের যত্ন।',
          whatItIs: 'হালকা চলাফেরা মস্তিষ্কে রক্তপ্রবাহ বাড়ায় ও মেজাজ প্রফুল্ল রাখে।',
          habits: [
            'সকালে বা বিকেলে ১৫-২০ মিনিটের স্নিগ্ধ বাতাসে হাঁটুন।',
            'চেয়ারে বসে হাত, কাঁধ ও পায়ের গোড়ালি আলতো করে নাড়াচাড়া করুন।',
            'ঘরের বারান্দা বা বাগানের গাছে জল দিন।'
          ],
          whenToAskDoctor: 'যদি হাঁটার সময় গিঁটে তীব্র ব্যথা হয়, ভারসাম্য হারায় বা বুক ধড়ফড় করে।'
        },
        {
          id: 'breathing',
          icon: '🫁',
          title: 'প্রশান্ত শ্বাসপ্রশ্বাস ও শিথিলকরণ',
          summary: 'মানসিক চাপ দূর করতে এবং মনকে একাগ্র করতে সহজ ৪-৪ শ্বাসক্রিয়া।',
          whatItIs: 'ধীরগতির গভীর শ্বাস শরীরের স্নায়ুতন্ত্রকে তাৎক্ষণিক প্রশান্তি দেয়।',
          habits: [
            '৪-৪ শ্বাস অনুশীলন: ৪ গণনা পর্যন্ত ধীরে ধীরে শ্বাস নিন, ৪ গণনায় ধীরে ধীরে ছাড়ুন।',
            'কোলে হাত রেখে বুকের ওঠানামা শান্তভাবে অনুভব করুন।',
            'এক কাপ চায়ের সাথে ব্যালকনিতে বসে নিঃশ্বাস অনুভব করুন।'
          ],
          whenToAskDoctor: 'যদি বুকে অস্বাভাবিক চাপ, উদ্বেগ বা শ্বাসকষ্ট অনুভব হয়।'
        },
        {
          id: 'social',
          icon: '☕',
          title: 'সামাজিক আনন্দ ও প্রিয়জনদের সান্নিধ্য',
          summary: 'গল্প ভাগ করা, ফোনে কথা বলা ও প্রতিবেশীদের সাথে মেলামেশা।',
          whatItIs: 'স্নেহময় কথপোকথন মস্তিষ্ককে সক্রিয় রাখে এবং অন্তরে আনন্দ আনে।',
          habits: [
            'প্রতিদিন সন্তান, নাতি-নাতনি বা বন্ধুদের সাথে ফোনে ১০ মিনিট কথা বলুন।',
            'পুরানো পারিবারিক ছবির অ্যালবাম দেখে মধুর স্মৃতিগুলি মনে করুন।',
            'পাড়ার সান্ধ্য আড্ডা বা সামাজিক অনুষ্ঠানে অংশগ্রহণ করুন।'
          ],
          whenToAskDoctor: 'যদি দীর্ঘদিন একাকীত্ব ও মনমরা ভাব কাটিয়ে ওঠা সম্ভব না হয়।'
        }
      ];
    }

    if (lang === 'ne') {
      return [
        {
          id: 'sleep',
          icon: '🌙',
          title: 'शान्त निद्रा र साँझको विश्राम',
          summary: 'नियमित विश्रामले स्मरणशक्ति, मुड र दैनिक ऊर्जालाई नयाँ जीवन दिन्छ।',
          whatItIs: 'राम्रो निद्राले मस्तिष्कलाई दिनभरिका सम्झनाहरू व्यवस्थित गर्न र भोलिको लागि ताजा बनाउन मद्दत गर्छ।',
          habits: [
            'सुत्नुअघि शान्त वातावरण बनाउनुहोस् (मनतातो दूध, मधुर पुस्तक वा शान्त संगीत)।',
            'सुत्ने कोठा मधुर उज्यालो, शान्त र आरामदायक राख्नुहोस्।',
            'सुत्नुअघि धेरै भारी भोजन वा मोबाइल स्क्रिनबाट बच्नुहोस्।'
          ],
          whenToAskDoctor: 'यदि अनिद्रा हप्तौंसम्म रह्यो वा दिनमा अत्यधिक थकान भयो भने।'
        },
        {
          id: 'hydration',
          icon: '💧',
          title: 'दैनिक पानी पिउने बानी र ताजगी',
          summary: 'पर्याप्त पानीले शरीरलाई ताजा र दिमागलाई चनाखो राख्छ।',
          whatItIs: 'पानीले रक्तसञ्चार सुधार गर्छ र मस्तिष्कका कोशिकाहरूलाई राम्रोसँग काम गर्न मद्दत गर्छ।',
          habits: [
            'दिनभरि आँखा अगाडि सफा पानीको जग वा बोतल राख्नुहोस्।',
            'सादा पानी मन नपरे कागती पानी वा जडीबुटी चिया पिउनुहोस्।',
            'तिर्खा लाग्नु अगावै समय-समयमा थोरै-थोरै पानी पिउनुहोस्।'
          ],
          whenToAskDoctor: 'यदि मुख धेरै सुक्यो, चक्कर लाग्यो वा निल्न गाह्रो भयो भने।'
        },
        {
          id: 'nutrition',
          icon: '🥗',
          title: 'पौष्टिक र सन्तुलित खानपान',
          summary: 'ताजा सागसब्जी, फलफूल र घरमै बनेको सन्तुलित खाना।',
          whatItIs: 'पोषणयुक्त खानाले शरीर र मनलाई स्थिर ऊर्जा प्रदान गर्दछ।',
          habits: [
            'हरिया सागपात, मौसमी फलफूल र तातो घरको खाना समावेश गर्नुहोस्।',
            'ओखर, बदाम र स्वस्थ चिल्लो पदार्थ सन्तुलित मात्रामा लिनुहोस्।',
            'परिवारसँग मिलेर हाँसोखुसीका साथ खानाको आनन्द लिनुहोस्।'
          ],
          whenToAskDoctor: 'यदि भोक अचानक हराएमा वा तौल तीव्र गतिमा घट्न थालेमा।'
        },
        {
          id: 'movement',
          icon: '🚶',
          title: 'सहज शारीरिक हलचल र हिँडडुल',
          summary: 'बिहानीको छोटो पैदल यात्रा र बँगैचाको हेरचाह।',
          whatItIs: 'हल्का हिँडडुलले मस्तिष्कमा रगतको बहाव बढाउँछ र मनलाई प्रफुल्ल राख्छ।',
          habits: [
            'बिहान वा साँझ १५-२० मिनेट आनन्दपूर्वक हिँड्नुहोस्।',
            'कुर्सीमा बसेर हातखुट्टा र घाँटी बिस्तारै तन्काउनुहोस्।',
            'गमला वा बँगैचाका फूलहरूमा पानी हाल्नुहोस्।'
          ],
          whenToAskDoctor: 'यदि हिँड्दा जोर्नी दुख्ने, सास फुल्ने वा सन्तुलन गुम्ने समस्या भएमा।'
        },
        {
          id: 'breathing',
          icon: '🫁',
          title: 'प्रशान्त श्वासप्रश्वास र ध्यान',
          summary: 'तनाव कम गर्न र मन एकाग्र बनाउन सरल ४-४ श्वास अभ्यास।',
          whatItIs: 'बिस्तारै गहिरो श्वास लिँदा स्नायु प्रणाली शान्त हुन्छ।',
          habits: [
            '४-४ श्वास विधि: ४ सेकेन्ड बिस्तारै श्वास लिनुहोस्, ४ सेकेन्डमा बिस्तारै छोड्नुहोस्।',
            'काखमा हात राखेर छातीको चाल शान्तपूर्वक अनुभव गर्नुहोस्।',
            'बँगैचामा बसेर चियाको चुस्कीसँगै श्वासमा ध्यान दिनुहोस्।'
          ],
          whenToAskDoctor: 'यदि छातीमा भारीपन वा लगातार सास फेर्न कठिनाइ भएमा।'
        },
        {
          id: 'social',
          icon: '☕',
          title: 'सामाजिक सम्बन्ध र प्रियजनहरूसँग सामिप्यता',
          summary: 'कथाहरू साटासाट गर्ने, फोनमा कुरा गर्ने र आफन्त भेट्ने।',
          whatItIs: 'आत्मीय कुराकानीले मस्तिष्कलाई सक्रिय बनाउँछ र मनमा खुशी ल्याउँछ।',
          habits: [
            'दैनिक छोराछोरी वा साथीभाइसँग १० मिनेट फोनमा कुरा गर्नुहोस्।',
            'पुराना फोटोहरू हेर्दै रमाइला सम्झनाहरू ताजा गर्नुहोस्।',
            'छिमेकीहरूसँग चिया गफ वा धार्मिक-सांस्कृतिक कार्यक्रममा भाग लिनुहोस्।'
          ],
          whenToAskDoctor: 'यदि लामो समयसम्म एक्लोपन र उदासी महसुस भइरह्यो भने।'
        }
      ];
    }

    if (lang === 'brx') {
      return [
        {
          id: 'sleep',
          icon: '🌙',
          title: 'सान्थि उन्दुनाय आरो गोसोनि गोजोन',
          summary: 'सानफ्रोमबोनि मोजां उन्दुनाया गोसोखांनाय, गोसो आरो देहायारि शक्तिखौ गोदान खालामो।',
          whatItIs: 'मोजां उन्दुनाया मेगनाव गोसोखांफोरखौ सामलायनो आरो गाबोननि थाखाय गोदानै जागायनो हेफाजाब होयो।',
          habits: [
            'उन्दुनो थांनायनि सिगां गोजोन थासारि खालाम (दुदुं दुरुं गाइखेर लों, मोजां गान खनासं)।',
            'उन्दुग्रा खथाखौ गुसु, गोजोन आरो गोरोबथि लाखि।',
            'उन्दुनायनि सिगां मोबायल स्क्रिन नायनाय नागार।'
          ],
          whenToAskDoctor: 'जुदि उन्दुनायनि जेंना गोबाव जायोब्ला डाक्टरखौ सावराय।'
        },
        {
          id: 'hydration',
          icon: '💧',
          title: 'सानफ्रोमबो दै लोंनाय आरो गोसो साबसिन',
          summary: 'मोजां दै लोंनाया देहाखौ गोहो गोनां आरो सांग्रां लाखियो।',
          whatItIs: 'दैया थै दावबायनायखौ मोजां खालामो आरो मेगन-मोगोननि सेलफोरखौ खामानि मावनो हेफाजाब होयो।',
          habits: [
            'सानसेयाव नोंनि सिगांआव साफा दैनि जग लाखि।',
            'दैनि अनगायै साहा एबा लेबु दै लोंनो हागौ।',
            'दै गंनायखौ नेनानै थानायनि सोलाय सानफ्रोमबो इसे इसे दै लोंबाय था।'
          ],
          whenToAskDoctor: 'जुदि खुगा सुख्रोब जायो, खर’ गिदिङोब्ला डाक्टरखौ सावराय।'
        },
        {
          id: 'nutrition',
          icon: '🥗',
          title: 'नेवसिग्रा आदार आरो देहायारि शक्ति',
          summary: 'गोथां मेगं-थायगं, फिथाइ आरो नखरनि साबसिन आदार।',
          whatItIs: 'मोजां आदारा देहा आरो गोसोखौ मोजां शक्ति होयो।',
          habits: [
            'गोथां बिलाइ, बोथोरनि फिथाइ आरो नखरनि उन्दै आदार जा।',
            'बादाम आरो मोजां थाव इसे जा।',
            'नखरनि सुबुंफोरजों लोगोसे सानफ्रोमबो रंजानानै जा।'
          ],
          whenToAskDoctor: 'जुदि उखैनाय खम जायो एबा देहा गिलिर खम जायोब्ला सावराय।'
        },
        {
          id: 'movement',
          icon: '🚶',
          title: 'मोजाङै थाबायनाय आरो देहायारि सोलोंथाइ',
          summary: 'फुंनि थाबायनाय आरो बारिनि बिबारफोरखौ नायदिं खालामनाय।',
          whatItIs: 'इसे थाबायनाया मेगनाव थै दावबायनाय बारायहोयो आरो गोसो मोजां खालामो।',
          habits: [
            'फुं एबा बेलासियाव १५-२० मिनिट थाबाय।',
            'सिनिआव जिरायनानै आखाय-आथिं इसि लोरहो।',
            'बारिनि बिबार-लाइफांआव दै हो।'
          ],
          whenToAskDoctor: 'जुदि आथिंआव सानाय जायो एबा थाबायनायाव जेंना जायोब्ला सावराय।'
        },
        {
          id: 'breathing',
          icon: '🫁',
          title: 'गोजोन हाबनाय-एंगारनाय आरो गोसो',
          summary: 'गोसोखौ गोजोन खालामनो थाखाय ४-४ हाबनाय-एंगारनाय सोलोंथाइ।',
          whatItIs: 'लाहैनै हाबनाय लानाया देहाखौ गोजोन खालामो।',
          habits: [
            '४-४ सोलोंथाइ: ४ साननायाव लाहैनै हाबनाय ला, ४ साननायाव लाहैनै एंगार।',
            'आखायखौ खफिआव दोननानै गोसोखौ गोजोन खालाम।',
            'साहा लोंनानै बारिनि बारखौ लानो सोलों।'
          ],
          whenToAskDoctor: 'जुदि बिखा सानाय एबा हाबनायाव गोब्राब जायोब्ला डाक्टरखौ सावराय।'
        },
        {
          id: 'social',
          icon: '☕',
          title: 'लोगो-फोरजों सावरायनाय आरो अनलाइन',
          summary: 'खोथा रायलायनाय, फन खालामनाय आरो लोगोफोरखौ लोगो हमनाय।',
          whatItIs: 'मोजां खोथा रायलायनाया गोसोखांनायखौ गोहो गोनां खालामो।',
          habits: [
            'सानफ्रोमबो फिसा-फिसौ एबा लोगोफोरजों १० मिनिट फनाव रायलाय।',
            'गोजाम फथ’फोरखौ लोगोसे नाय आरो रंजा।',
            'नखरनि आरो गामिनि आखा-फाखायाव बाहागो ला।'
          ],
          whenToAskDoctor: 'जुदि गोबाव सम हारसिं मोनबाय थायोब्ला सावराय।'
        }
      ];
    }

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

  function getStrings(lang = I18n.lang) {
    const dict = {
      bn: {
        headerTitle: 'সুস্থতা ও মানসিক প্রশান্তি 🌿',
        headerSub: 'সুস্থ জীবন, মানসিক প্রশান্তি ও ইতিবাচক শক্তির সহজ প্রাত্যহিক অভ্যাস।',
        breathTitle: '🫁 ৪-৪ নির্দেশিত শ্বাস-প্রশ্বাস ব্যায়াম',
        breathSub: 'উদ্বেগ কমাতে ও হৃদস্পন্দন শান্ত করতে বৃত্তের প্রসারণ ও সংকোচন অনুসরণ করুন।',
        startBreathText: '▶ শ্বাস ব্যায়াম শুরু করুন',
        stopBreathText: '⏹ ব্যায়াম সমাপ্ত করুন',
        readyText: 'শান্ত শ্বাস নিতে প্রস্তুত?',
        disclaimerTitle: 'শিক্ষামূলক তথ্য:',
        disclaimerText: 'এই নির্দেশিকা সাধারণ স্বাস্থ্য সচেতনতা ও আত্ম-যত্নের জন্য। এটি ব্যক্তিগত চিকিৎসা পরামর্শ বা প্রেসক্রিপশন নয়। সর্বদা যোগ্য চিকিৎসকের পরামর্শ নিন।',
        backText: '🏠 হোমে ফিরে যান',
        whatIsLabel: '💡 এটি কী',
        habitsLabel: '🌱 কোমল উপকারী অভ্যাস',
        docLabel: '🩺 চিকিৎসকের সাথে কখন যোগাযোগ করবেন:',
        inhaleMsg: 'ধীরে ধীরে শ্বাস নিন... 🌸',
        exhaleMsg: 'ধীরে ধীরে শ্বাস ছাড়ুন... 🍃',
        doneMsg: 'চমৎকার! আপনি এখন শান্ত ও সতেজ অনুভব করছেন। ✨'
      },
      ne: {
        headerTitle: 'स्वास्थ्य र मानसिक शान्ति 🌿',
        headerSub: 'स्वस्थ जीवन, शान्ति र सकारात्मक ऊर्जाका लागि सरल दैनिक अभ्यासहरू।',
        breathTitle: '🫁 ४-४ निर्देशित श्वासप्रश्वास अभ्यास',
        breathSub: 'तनाव कम गर्न र मुटुको धड्कन शान्त पार्न फैलँदो वृत्तलाई पछ्याउनुहोस्।',
        startBreathText: '▶ श्वास अभ्यास सुरु गर्नुहोस्',
        stopBreathText: '⏹ अभ्यास बन्द गर्नुहोस्',
        readyText: 'शान्त श्वास लिन तयार हुनुहुन्छ?',
        disclaimerTitle: 'शैक्षिक जानकारी:',
        disclaimerText: 'यो मार्गदर्शन सामान्य स्वास्थ्य शिक्षा र आत्म-हेरचाहको लागि हो। यो व्यक्तिगत चिकित्सा सल्लाह वा उपचार होइन। कृपया योग्य चिकित्सकसँग परामर्श लिनुहोस्।',
        backText: '🏠 गृहपृष्ठमा फर्कनुहोस्',
        whatIsLabel: '💡 यो के हो',
        habitsLabel: '🌱 कोमल उपयोगी बानीहरू',
        docLabel: '🩺 डाक्टरसँग कहिले परामर्श लिने:',
        inhaleMsg: 'बिस्तारै श्वास भित्र लिनुहोस्... 🌸',
        exhaleMsg: 'बिस्तारै श्वास बाहिर छोड्नुहोस्... 🍃',
        doneMsg: 'धेरै राम्रो! तपाईं अहिले शान्त र ताजा महसुस गर्दै हुनुहुन्छ। ✨'
      },
      brx: {
        headerTitle: 'गोरोबथि आरो गोसोनि शान्ति 🌿',
        headerSub: 'मोजां जिउ, शान्ति आरो मोजां गोहोनि थाखाय गोरलै सानफ्रोमबोनि हाबा।',
        breathTitle: '🫁 ४-४ हां लानाय आनजाद',
        breathSub: 'गोसोनि दावराव खमायनो बे गुवार जानाय बेन्दोंखौ नाय।',
        startBreathText: '▶ हां लानाय आनजाद जागाय',
        stopBreathText: '⏹ आनजाद बन्द खालाम',
        readyText: 'शान्तियै हां लानो थियारि?',
        disclaimerTitle: 'सोंलोंथाइ मन्थार:',
        disclaimerText: 'बे गांगौआ देहानि सोंलोंथाइ आरो गावनो गाव नायदिंनि थाखायसो। बेयो डाक्टरनि बिथोन नङा। थाबैनो डाक्टरखौ सावराय।',
        backText: '🏠 नखर’ आव थांफिन',
        whatIsLabel: '💡 बेयो माथार',
        habitsLabel: '🌱 मोजां अखोलफोर',
        docLabel: '🩺 डाक्टरखौ माब्ला सावरायगोन:',
        inhaleMsg: 'लाहै-लाहै हां सिङाव ला... 🌸',
        exhaleMsg: 'लाहै-लाहै हां बाइज्राव गार... 🍃',
        doneMsg: 'जोबोत मोजां! नों गोसो शान्ति आरो गोदान गोहो मोनबाय। ✨'
      },
      hi: {
        headerTitle: 'स्वास्थ्य और शांत आदतें 🌿',
        headerSub: 'स्वस्थ जीवन, शांति और सकारात्मक ऊर्जा के लिए सरल दैनिक अभ्यास।',
        breathTitle: '🫁 ४-४ निर्देशित श्वास अभ्यास',
        breathSub: 'तनाव दूर करने और हृदय गति को शांत करने के लिए फैलते वृत्त का अनुसरण करें।',
        startBreathText: '▶ श्वास अभ्यास शुरू करें',
        stopBreathText: '⏹ अभ्यास समाप्त करें',
        readyText: 'शांत श्वास लेने के लिए तैयार?',
        disclaimerTitle: 'शैक्षणिक सूचना:',
        disclaimerText: 'यह मार्गदर्शिका सामान्य स्वास्थ्य शिक्षा और आत्म-देखभाल प्रेरणा प्रदान करती है। यह व्यक्तिगत चिकित्सा सलाह या निदान नहीं है। हमेशा अपने योग्य चिकित्सक से परामर्श लें।',
        backText: '🏠 होम पर वापस जाएं',
        whatIsLabel: '💡 यह क्या है',
        habitsLabel: '🌱 कोमल उपयोगी आदतें',
        docLabel: '🩺 डॉक्टर से कब संपर्क करें:',
        inhaleMsg: 'धीरे-धीरे सांस अंदर लें... 🌸',
        exhaleMsg: 'धीरे-धीरे सांस बाहर छोड़ें... 🍃',
        doneMsg: 'बहुत बढ़िया! आप शांत और तरोताजा महसूस कर रहे हैं। ✨'
      },
      as: {
        headerTitle: 'সুস্থতা আৰু মানসিক শান্তি 🌿',
        headerSub: 'সুস্থ জীৱন আৰু মনৰ আনন্দৰ বাবে দৈনিক সহজ অভ্যাস।',
        breathTitle: '🫁 ৪-৪ নিৰ্দেশিত উশাহ অনুশীলন',
        breathSub: 'মানসিক চাপ দূৰ কৰিবলৈ শান্ত বৃত্তটো লক্ষ্য কৰক।',
        startBreathText: '▶ উশাহ অনুশীলন আৰম্ভ কৰক',
        stopBreathText: '⏹ অনুশীলন সমাপ্ত কৰক',
        readyText: 'প্ৰশান্ত উশাহ লবলৈ সাজুনে?',
        disclaimerTitle: 'শিক্ষামূলক জাননী:',
        disclaimerText: 'এই পথপ্ৰদৰ্শনে সাধাৰণ সুস্থতা আৰু যত্নৰ বাবে সহায় কৰে। ব্যক্তিগত স্বাস্থ্যৰ বাবে চিকিৎসকৰ পৰামৰ্শ লওক।',
        backText: '🏠 ঘৰলৈ উভতি যাওক',
        whatIsLabel: '💡 ই কি',
        habitsLabel: '🌱 মৃদু উপকাৰী অভ্যাস',
        docLabel: '🩺 চিকিৎসকৰ ওচৰলৈ কেতিয়া যাব:',
        inhaleMsg: 'লাহেকৈ উশাহ ভিতৰলৈ লওক... 🌸',
        exhaleMsg: 'লাহেকৈ উশাহ এৰি দিয়ক... 🍃',
        doneMsg: 'বৰ সুন্দৰ! আপুনি এতিয়া শান্ত অনুভৱ কৰিছে। ✨'
      },
      en: {
        headerTitle: 'Wellness & Mindful Habits 🌿',
        headerSub: 'Simple, peaceful daily practices for healthy living and joyful energy.',
        breathTitle: '🫁 4-4 Guided Breathing Exercise',
        breathSub: 'Follow the soothing expanding circle to release tension and calm your heartbeat.',
        startBreathText: '▶ Start Breathing Exercise',
        stopBreathText: '⏹ Stop Exercise',
        readyText: 'Ready to breathe peacefully?',
        disclaimerTitle: 'Educational Notice:',
        disclaimerText: 'This guide provides general wellness education and self-care inspiration. It is not medical advice, diagnosis, or prescription. Always consult your qualified doctor or healthcare provider for personal medical guidance.',
        backText: '🏠 Back to Home',
        whatIsLabel: '💡 What it is',
        habitsLabel: '🌱 Gentle Helpful Habits',
        docLabel: '🩺 When to consult a professional:',
        inhaleMsg: 'Breathe in gently... 🌸',
        exhaleMsg: 'Breathe out slowly... 🍃',
        doneMsg: 'Wonderful job! You feel calmer and centered. ✨'
      }
    };
    return dict[lang] || dict.en;
  }

  function render() {
    const guides = getGuides();
    const txt = getStrings();
    const headerTitle = txt.headerTitle;
    const headerSub = txt.headerSub;
    const breathTitle = txt.breathTitle;
    const breathSub = txt.breathSub;
    const startBreathText = txt.startBreathText;
    const stopBreathText = txt.stopBreathText;
    const readyText = txt.readyText;
    const disclaimerTitle = txt.disclaimerTitle;
    const disclaimerText = txt.disclaimerText;
    const backText = txt.backText;
    const whatIsLabel = txt.whatIsLabel;
    const habitsLabel = txt.habitsLabel;
    const docLabel = txt.docLabel;

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
    const txt = getStrings();

    function startBreathing() {
      isBreathing = true;
      btnToggleBreath.textContent = txt.stopBreathText;
      btnToggleBreath.style.background = '#DC2626';
      cycleCount = 0;
      runPhase('inhale');
    }

    function stopBreathing() {
      isBreathing = false;
      clearTimeout(breathInterval);
      btnToggleBreath.textContent = txt.startBreathText;
      btnToggleBreath.style.background = '#2563EB';
      if (circle) circle.style.transform = 'scale(1)';
      if (timerText) timerText.textContent = '🕊️';
      if (instruction) instruction.textContent = txt.readyText;
    }

    function runPhase(phase) {
      if (!isBreathing) return;
      breathPhase = phase;
      let count = 4;

      if (phase === 'inhale') {
        if (circle) circle.style.transform = 'scale(1.4)';
        const inMsg = txt.inhaleMsg;
        if (instruction) instruction.textContent = inMsg;
        if (timerText) timerText.textContent = '4';
        if (TTS && TTS.isSupported() && cycleCount === 0) TTS.speak(inMsg);
      } else {
        if (circle) circle.style.transform = 'scale(1)';
        const outMsg = txt.exhaleMsg;
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
              const doneMsg = txt.doneMsg;
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

  // Reactive listener to languageChanged and smriti:languageChanged events
  const langChangeHandler = () => {
    render();
  };
  window.addEventListener('languageChanged', langChangeHandler);
  window.addEventListener('smriti:languageChanged', langChangeHandler);

  render();

  return {
    cleanup() {
      if (breathInterval) clearTimeout(breathInterval);
      window.removeEventListener('languageChanged', langChangeHandler);
      window.removeEventListener('smriti:languageChanged', langChangeHandler);
      TTS.stop();
    }
  };
}
