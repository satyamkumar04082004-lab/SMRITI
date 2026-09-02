# 🧠 SMRITI (स्मृति)
### AI-Powered Cognitive Care & Memory Companion

> **Smart India Hackathon (SIH26003, MDoNER)**  
> SMRITI is an AI-powered wellness, memory, and cognitive care companion designed for seniors and caregivers with a warm, consumer-friendly, non-clinical design.

---

## 🌟 Key Features

1. **🤖 Smriti — AI Voice & Chat Companion** (`#/smriti`)
   - Dual-mode input: Microphone voice input via Web Speech Recognition + Text chat.
   - Dual-mode output: Speaks responses aloud with Web Speech Text-to-Speech & replay audio buttons.
   - Tells gentle stories, cheerful jokes, motivational thoughts, and offers emotional comfort.

2. **🌻 Today's Good Thought**
   - Curated pool of 35+ inspiring, nature-inspired, non-toxic positive thoughts on the home page with instant speech playback.

3. **🌈 Daily Mood Check-In**
   - 5 accessible mood choices (`😊 Great`, `🙂 Good`, `😐 Okay`, `😔 Low`, `😟 Worried`) with instant Smriti companion chat handoff.

4. **🎮 7 Cognitive Training Games**
   - 🦅 **Hornbill Memory Nest**: Visual nature card matching (Northeast theme).
   - 📖 **Memory Moments**: Visual story recall and comprehension questions.
   - 👨‍👩‍👧 **Familiar Faces**: Person recognition with 3-tier gentle hint ladder.
   - 🏠 **Remember My Home**: Spatial/object memory in room grid layout.
   - ☀️ **My Day**: Daily routine sequencing with partial credit.
   - 👂 **Listen & Remember**: Auditory attention & recall with TTS voice reading.
   - 🎋 **Bamboo Sequence**: Simon-says glowing bamboo pads with gentle downward adaptation.

5. **🌿 General Wellness Guide** (`#/wellness`)
   - Educational, non-prescriptive daily habits on Sleep, Hydration, Nutrition, Movement, Breathing, and Social Joy with medical disclaimers.

6. **📈 My Improvement** (`#/improvement`)
   - Skill engagement breakdown (Memory, Listening, Sequencing, Recognition), 7-day streak tracker, and non-clinical progress metrics.

7. **🌱 Mind Journey & Smriti Levels** (`#/journey`)
   - Progression from Level 1 (`🌱 New Explorer`) to Level 5 (`✨ Grand Companion`), milestone XP meter, unlocked achievement badges, and celebratory animations.

8. **💊 My Medicines & Prescription Scanner** (`#/medicines`)
   - 📷 Scan / 📁 Upload prescription with smart OCR extraction into structured medication cards and interactive reminder alerts.

9. **🚨 Emergency Help Hub & Persistent 🆘 Button** (`#/emergency`)
   - Prominent **❤️ CALL [NAME]** button with safety confirmation dialog.
   - Emergency services (112), Doctor, and Transport direct links.
   - Unobtrusive persistent **🆘 Help** button on every screen.

10. **📋 Caregiver Hub** (`#/dashboard`)
    - Tabbed view: Overview stats, Family Contacts & Cultural Memories, Mood History, Medicines, AI Voice & Emergency Settings.

11. **🌟 Hackathon Demo Preset** (`#/settings`)
    - One-click button to load full realistic demo data for presentations.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### Run Locally
```bash
# Start the local server
node server.js
```

Open your browser and visit:
👉 **`http://localhost:5173`** (or **`http://localhost:5173/#/home`**)

---

## 📂 Project Structure

```
SMRITI/
├── index.html                    # SPA Shell with error boundaries
├── server.js                     # Static server with no-cache headers
├── package.json                  # Project metadata
├── README.md                     # Documentation
├── css/
│   └── styles.css                # Elderly-friendly theme & micro-interactions
└── js/
    ├── app.js                    # SPA Router & global events
    ├── aiService.js              # Reusable AI Intelligence (Thoughts, Companion, OCR)
    ├── auth.js                   # Single-OTP authentication
    ├── coins.js                  # Coin reward economy
    ├── gameShell.js              # Shared game wrapper
    ├── i18n.js                   # Multilingual fallback engine
    ├── leaderboard.js            # User rankings logic
    ├── storage.js                # LocalStorage abstraction layer
    ├── timer.js                  # Game timer engine
    ├── tts.js                    # Web Speech Text-to-Speech
    ├── games/
    │   ├── hornbillMemoryNest.js # Game 1: Visual Memory Match
    │   ├── memoryMoments.js      # Game 2: Visual Story Recall
    │   ├── familiarFaces.js      # Game 3: Person Recognition
    │   ├── rememberHome.js       # Game 4: Spatial/Object Memory
    │   ├── myDay.js              # Game 5: Routine Sequencing
    │   ├── listenRemember.js     # Game 6: Auditory Recall
    │   └── bambooSequence.js     # Game 7: Sequence Memory
    └── pages/
        ├── home.js               # Home Screen with Mood, Thought, Smriti widget
        ├── login.js              # Login & OTP verification
        ├── gamesHub.js           # 7-Game central hub
        ├── smritiPage.js         # Smriti Voice & Chat Companion
        ├── wellnessPage.js       # Educational Wellness Guide
        ├── improvementPage.js    # My Improvement progress bars & streak
        ├── journeyPage.js        # Mind Journey levels & badges
        ├── medicinesPage.js      # Medicines & Prescription Scanner
        ├── emergencyPage.js      # Emergency Help & Quick Call
        ├── dashboardPage.js      # Caregiver Hub
        ├── leaderboardPage.js    # Leaderboard rankings
        ├── historyPage.js        # Gameplay session history
        ├── personalisationPage.js# Cultural personalisation
        └── settingsPage.js       # Settings & Demo Preset Loader
```

---

## 🔒 Privacy & Offline Capability
- All data, mood entries, medicines, and game sessions are stored locally in the user's browser using `localStorage`.
- Fully functional in offline demo environments with built-in realistic fallbacks for AI and OCR.
