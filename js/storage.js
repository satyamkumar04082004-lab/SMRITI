/* ============================================================
   SMRITI — Storage Abstraction Layer
   localStorage wrapper with per-user namespacing & extended data models
   ============================================================ */

const Storage = {
  _prefix: 'smriti_',

  _key(key) {
    return this._prefix + key;
  },

  _userKey(key) {
    const user = this.getUser();
    const userId = user ? user.phone : 'guest';
    return `${this._prefix}${userId}_${key}`;
  },

  // --- Raw helpers ---
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
    } catch (e) {
      console.warn('Storage.set failed:', e);
    }
  },

  remove(key) {
    localStorage.removeItem(this._key(key));
  },

  // --- User-scoped helpers ---
  getUser() {
    try {
      const raw = localStorage.getItem(this._key('currentUser'));
      if (raw) return JSON.parse(raw);
      if (localStorage.getItem(this._key('loggedOut')) === 'true') return null;
      const defaultUser = { name: 'Meera Das', phone: '9876543210', role: 'patient' };
      this.setUser(defaultUser);
      return defaultUser;
    } catch { return { name: 'Meera Das', phone: '9876543210', role: 'patient' }; }
  },

  setUser(user) {
    try {
      localStorage.removeItem(this._key('loggedOut'));
    } catch {}
    this.set('currentUser', user);
  },

  clearUser() {
    this.remove('currentUser');
    try {
      localStorage.setItem(this._key('loggedOut'), 'true');
    } catch {}
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  // --- User-scoped data ---
  getUserData(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this._userKey(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  setUserData(key, value) {
    try {
      localStorage.setItem(this._userKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn('Storage.setUserData failed:', e);
    }
  },

  // --- Game Results ---
  saveGameResult(result) {
    const history = this.getUserData('gameHistory', []);
    result.date = result.date || new Date().toISOString();
    result.user = result.user || this.getUser()?.name || 'Player';
    history.push(result);
    this.setUserData('gameHistory', history);

    // Award XP towards Mind Journey
    const xpEarned = (result.score || 10) + Math.round((result.accuracy || 50) / 2);
    this.addJourneyXP(xpEarned);
  },

  getGameHistory(gameId = null) {
    const history = this.getUserData('gameHistory', []);
    if (gameId) return history.filter(h => h.gameId === gameId);
    return history;
  },

  // --- Coins ---
  getCoins() {
    return this.getUserData('coins', 0);
  },

  setCoins(amount) {
    this.setUserData('coins', Math.max(0, amount));
  },

  // --- Preferences ---
  getPreferences() {
    return this.getUserData('preferences', {
      language: 'en',
      preferredName: '',
      nativePlace: '',
      festivals: '',
      foodPreferences: '',
      languageNotes: '',
      memoryNotes: '',
    });
  },

  setPreferences(prefs) {
    this.setUserData('preferences', prefs);
  },

  getLanguage() {
    return this.getPreferences().language || 'en';
  },

  setLanguage(lang) {
    const prefs = this.getPreferences();
    prefs.language = lang;
    this.setPreferences(prefs);
  },

  // --- Caregiver routines ---
  getRoutines() {
    return this.getUserData('routines', null);
  },

  setRoutines(routines) {
    this.setUserData('routines', routines);
  },

  // --- Family contacts ---
  getFamilyContacts() {
    return this.getUserData('familyContacts', [
      { id: 'fc1', name: 'Raj', relation: 'Son', phone: '+91 98765 43210', photo: '👨', notes: 'Visits on weekends, loves tea' },
      { id: 'fc2', name: 'Ananya', relation: 'Daughter', phone: '+91 98765 43211', photo: '👩', notes: 'Calls every evening at 7 PM' },
      { id: 'fc3', name: 'Dr. Barua', relation: 'Family Doctor', phone: '+91 98765 43212', photo: '👨‍⚕️', notes: 'Clinic open 10am - 2pm' }
    ]);
  },

  setFamilyContacts(contacts) {
    this.setUserData('familyContacts', contacts);
  },

  // --- Emergency Contacts ---
  getEmergencyContacts() {
    return this.getUserData('emergencyContacts', {
      primaryName: 'Raj (Son)',
      primaryPhone: '+919876543210',
      relation: 'Son',
      doctorName: 'Dr. Barua',
      doctorPhone: '+919876543212',
      ambulancePhone: '112',
      transportPhone: '+919876543299',
    });
  },

  setEmergencyContacts(contacts) {
    this.setUserData('emergencyContacts', contacts);
  },

  // --- Daily Mood Tracking ---
  getMoodHistory() {
    return this.getUserData('moodHistory', [
      { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], mood: 'great', emoji: '😊', label: 'Great', note: 'Went for morning garden walk' },
      { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], mood: 'good', emoji: '🙂', label: 'Good', note: 'Enjoyed afternoon tea' },
      { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], mood: 'okay', emoji: '😐', label: 'Okay', note: 'Relaxed at home' },
      { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], mood: 'great', emoji: '😊', label: 'Great', note: 'Spoke with grandchildren' }
    ]);
  },

  addMoodEntry(moodKey, emoji, label, note = '') {
    const history = this.getMoodHistory();
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = history.findIndex(m => m.date === today);
    const newEntry = { date: today, mood: moodKey, emoji, label, note, timestamp: Date.now() };

    if (existingIndex >= 0) {
      history[existingIndex] = newEntry;
    } else {
      history.push(newEntry);
    }
    this.setUserData('moodHistory', history);
    this.addJourneyXP(15); // Mood check-in XP bonus
    return history;
  },

  getTodayMood() {
    const history = this.getMoodHistory();
    const today = new Date().toISOString().split('T')[0];
    return history.find(m => m.date === today) || null;
  },

  // --- Mind Journey / Smriti Levels ---
  getJourneyStats() {
    const stats = this.getUserData('journeyStats', {
      totalXP: 380,
      streak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: ['first_game', 'consistent_3day', 'cheerful_mood']
    });

    const levelInfo = this.calculateLevel(stats.totalXP);
    return { ...stats, ...levelInfo };
  },

  calculateLevel(xp) {
    const levels = [
      { level: 1, name: 'New Explorer', icon: '🌱', minXP: 0, nextXP: 200, desc: 'Beginning your mindful journey' },
      { level: 2, name: 'Curious Mind', icon: '🌿', minXP: 200, nextXP: 500, desc: 'Engaging your memory and attention daily' },
      { level: 3, name: 'Memory Explorer', icon: '🌸', minXP: 500, nextXP: 1000, desc: 'Building strong cognitive habits' },
      { level: 4, name: 'Mind Master', icon: '🌳', minXP: 1000, nextXP: 2000, desc: 'Consistent, sharp and joyful daily explorer' },
      { level: 5, name: 'Grand Companion', icon: '✨', minXP: 2000, nextXP: 5000, desc: 'Mastery of wellness and mindfulness' }
    ];

    let current = levels[0];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].minXP) {
        current = levels[i];
        break;
      }
    }

    const nextXP = current.nextXP;
    const levelXP = xp - current.minXP;
    const neededInLevel = nextXP - current.minXP;
    const progressPercent = Math.min(100, Math.round((levelXP / neededInLevel) * 100));

    return {
      level: current.level,
      levelName: current.name,
      levelIcon: current.icon,
      levelDesc: current.desc,
      currentXP: xp,
      nextLevelXP: nextXP,
      progressPercent
    };
  },

  addJourneyXP(xp) {
    const stats = this.getUserData('journeyStats', {
      totalXP: 0,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: []
    });

    const oldLevel = this.calculateLevel(stats.totalXP).level;
    stats.totalXP += Math.max(1, xp);
    const newLevel = this.calculateLevel(stats.totalXP).level;

    this.setUserData('journeyStats', stats);

    if (newLevel > oldLevel) {
      window.dispatchEvent(new CustomEvent('smritiLevelUp', {
        detail: this.calculateLevel(stats.totalXP)
      }));
    }
  },

  // --- Medicines & Prescriptions ---
  getMedicines() {
    return this.getUserData('medicines', [
      {
        id: 'med1',
        name: 'Pantoprazole',
        strength: '40 mg',
        instructions: '1 tablet in morning before food',
        frequency: 'Once daily (Morning)',
        duration: '30 days',
        doctor: 'Dr. Barua',
        date: '2026-08-15',
        notes: 'Take with full glass of warm water'
      },
      {
        id: 'med2',
        name: 'Multivitamin & B-Complex',
        strength: '1 capsule',
        instructions: '1 capsule after lunch',
        frequency: 'Once daily (Afternoon)',
        duration: '60 days',
        doctor: 'Dr. Barua',
        date: '2026-08-15',
        notes: 'Supports general energy'
      },
      {
        id: 'med3',
        name: 'Calcium + Vitamin D3',
        strength: '500 mg',
        instructions: '1 tablet after dinner',
        frequency: 'Once daily (Night)',
        duration: '90 days',
        doctor: 'Dr. Barua',
        date: '2026-08-15',
        notes: 'Bone strength supplement'
      }
    ]);
  },

  setMedicines(meds) {
    this.setUserData('medicines', meds);
  },

  addMedicine(med) {
    const meds = this.getMedicines();
    med.id = med.id || 'med_' + Date.now();
    meds.push(med);
    this.setMedicines(meds);
    return meds;
  },

  // --- Generic Daily Reminders (Meds, Hydration, Walks, Calls) ---
  getReminders() {
    return this.getUserData('dailyReminders', [
      { id: 'rem_1', title: 'Morning Blood Pressure Medicine', category: 'medication', icon: '💊', time: '08:30 AM', period: 'Morning', notes: '1 tablet with a warm glass of water', active: true, completedToday: false },
      { id: 'rem_2', title: 'Drink Warm Water & Stretch', category: 'hydration', icon: '💧', time: '09:30 AM', period: 'Morning', notes: '1 full glass of warm water', active: true, completedToday: false },
      { id: 'rem_3', title: 'Gentle Sunlight Garden Walk', category: 'activity', icon: '🚶', time: '10:30 AM', period: 'Morning', notes: 'Breathe fresh air in the sunlight', active: true, completedToday: false },
      { id: 'rem_4', title: 'Afternoon Water & Tea', category: 'hydration', icon: '🍵', time: '02:00 PM', period: 'Afternoon', notes: 'Rest and enjoy warm ginger tea', active: true, completedToday: false },
      { id: 'rem_5', title: 'Call Family / Grandchildren', category: 'call', icon: '📞', time: '05:30 PM', period: 'Evening', notes: 'Call Raj or Riya to hear their voices', active: true, completedToday: false },
      { id: 'rem_6', title: 'Night Calcium & Relaxing Rest', category: 'medication', icon: '🌙', time: '08:45 PM', period: 'Night', notes: '1 tablet after dinner with warm milk', active: true, completedToday: false }
    ]);
  },

  setReminders(reminders) {
    this.setUserData('dailyReminders', reminders);
  },

  addReminder(reminder) {
    const list = this.getReminders();
    reminder.id = reminder.id || 'rem_' + Date.now();
    reminder.active = reminder.active !== false;
    reminder.completedToday = false;
    list.push(reminder);
    this.setReminders(list);
    return list;
  },

  updateReminder(id, patch) {
    const list = this.getReminders().map(r => r.id === id ? { ...r, ...patch } : r);
    this.setReminders(list);
    return list;
  },

  deleteReminder(id) {
    const list = this.getReminders().filter(r => r.id !== id);
    this.setReminders(list);
    return list;
  },

  toggleReminder(id) {
    const list = this.getReminders().map(r => r.id === id ? { ...r, active: !r.active } : r);
    this.setReminders(list);
    return list;
  },

  markReminderDone(id) {
    const list = this.getReminders().map(r => r.id === id ? { ...r, completedToday: true, snoozedUntil: null } : r);
    this.setReminders(list);
    return list;
  },

  snoozeReminder(id, minutes = 10) {
    const snoozeTime = Date.now() + minutes * 60 * 1000;
    const list = this.getReminders().map(r => r.id === id ? { ...r, snoozedUntil: snoozeTime } : r);
    this.setReminders(list);
    return list;
  },

  // Backward compatibility aliases
  getMedicineReminders() {
    return this.getReminders().map(r => ({ id: r.id, medName: r.title, time: r.time, period: r.period, active: r.active, dose: r.notes }));
  },
  setMedicineReminders(reminders) {
    this.setUserData('medicineReminders', reminders);
  },
  addMedicineReminder(reminder) {
    return this.addReminder({
      title: reminder.medName || reminder.title,
      time: reminder.time,
      period: reminder.period || 'Morning',
      notes: reminder.dose || reminder.notes || '',
      category: 'medication',
      icon: '💊'
    });
  },
  deleteMedicineReminder(id) {
    return this.deleteReminder(id);
  },

  // --- AI & Voice Settings ---
  getAISettings() {
    return this.getUserData('aiSettings', {
      voiceEnabled: true,
      speechRate: 0.85,
      voiceGender: 'female',
      autoSpeak: true,
      soundEffects: true
    });
  },

  setAISettings(settings) {
    this.setUserData('aiSettings', settings);
  },

  getVoiceSettings() {
    return this.getUserData('voiceSettings', {
      voiceGuidanceEnabled: true,
      autoReadInstructions: true,
      voiceFeedback: true,
      voiceNavigation: true,
      speechRate: 0.85
    });
  },

  setVoiceSettings(settings) {
    this.setUserData('voiceSettings', settings);
  },

  // --- Life Story & Memory Gallery ---
  getMemories() {
    return this.getUserData('familyMemories', [
      {
        id: 'mem1',
        title: "Granddaughter Riya's Wedding",
        tag: 'Family',
        date: 'November 2024',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
        story: 'The most joyful day when our sweet Riya got married in Guwahati. The courtyard was decorated with fragrant marigold flowers, and everyone danced to traditional melodies until evening.',
        voiceNote: 'The whole family had gathered together, smiling and blessing our beloved Riya. What a golden, cherished memory.',
        question: 'Do you remember the traditional melodies everyone danced to?'
      },
      {
        id: 'mem2',
        title: 'Morning Walk at Jorhat Tea Gardens',
        tag: 'Nature',
        date: 'Spring 1988',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        story: 'Walking with Ashok along the lush green tea slopes in the cool morning mist. The scent of fresh tea leaves and warm ginger tea from our thermos flask made every morning special.',
        voiceNote: 'Ashok would always pick two fresh tea blossoms and smile. The morning breeze was so peaceful.',
        question: 'How did the fresh morning breeze feel as you walked?'
      },
      {
        id: 'mem3',
        title: 'Bihu Feast with Grandchildren',
        tag: 'Celebration',
        date: 'January 2022',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
        story: 'Making homemade coconut pitha and sesame laddoos for all our neighbors and grandchildren. Seeing the children smile with sweet sticky hands was pure happiness.',
        voiceNote: 'The aroma of roasted rice flour and jaggery filled our entire home.',
        question: 'Who enjoyed the homemade coconut pitha the most?'
      },
      {
        id: 'mem4',
        title: 'Old Courtyard Mango Tree',
        tag: 'Childhood',
        date: 'Summer 1965',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
        story: 'Sitting under the shade of our ancestral mango tree on warm summer afternoons, reading stories and sharing slices of raw green mango with a pinch of rock salt.',
        voiceNote: 'That giant old tree sheltered generations of our family with love and shade.',
        question: 'Who used to climb the big branches with you?'
      }
    ]);
  },

  setMemories(memories) {
    this.setUserData('familyMemories', memories);
  },

  addMemory(memory) {
    const list = this.getMemories();
    list.unshift(memory);
    this.setMemories(list);
    return list;
  },

  updateMemory(id, updatedFields) {
    const list = this.getMemories().map(m => m.id === id ? { ...m, ...updatedFields } : m);
    this.setMemories(list);
    return list;
  },

  deleteMemory(id) {
    const list = this.getMemories().filter(m => m.id !== id);
    this.setMemories(list);
    return list;
  },

  // --- Custom Familiar Faces Uploaded by User/Family ---
  getCustomFaces() {
    return this.getUserData('customFaces', [
      {
        id: 'face_custom_1',
        name: 'Raj',
        relation: 'Son',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        hints: ['He is your loving son', 'His name starts with R', 'He brings you hot ginger tea'],
        options: ['Raj (Son)', 'Amit (Neighbor)', 'Dr. Barua', 'Suresh (Friend)']
      },
      {
        id: 'face_custom_2',
        name: 'Ananya',
        relation: 'Daughter',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        hints: ['She calls you every evening', 'Her name starts with A', 'She is your daughter'],
        options: ['Ananya (Daughter)', 'Sunita (Nurse)', 'Riya (Granddaughter)', 'Pooja (Niece)']
      }
    ]);
  },

  setCustomFaces(faces) {
    this.setUserData('customFaces', faces);
  },

  addCustomFace(face) {
    const faces = this.getCustomFaces();
    faces.unshift(face);
    this.setCustomFaces(faces);
    return faces;
  },

  deleteCustomFace(id) {
    const faces = this.getCustomFaces().filter(f => f.id !== id);
    this.setCustomFaces(faces);
    return faces;
  },

  // --- Unique Username for Social & Family Connections ---
  getUsername() {
    const user = this.getUser();
    if (user && user.username) return user.username;
    const baseName = (user && user.name ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'meera') || 'senior';
    const num = user && user.phone ? user.phone.slice(-4) : '2026';
    const username = `@${baseName}_${num}`;
    if (user) {
      user.username = username;
      this.setUser(user);
    }
    return username;
  },

  // --- Social Smiles & Family Messages ---
  getSocialMessages() {
    return this.getUserData('socialMessages', [
      {
        id: 'msg_1',
        from: 'Raj (Son)',
        fromUsername: '@raj_4321',
        type: 'smile',
        content: 'Sending you the warmest morning smile and a big hug! Have a gentle day Ma! 🌸❤️',
        date: 'Today, 8:30 AM',
        avatar: '👨'
      },
      {
        id: 'msg_2',
        from: 'Ananya (Daughter)',
        fromUsername: '@ananya_1234',
        type: 'voice',
        content: '“Hi Ma! Don’t forget to drink your warm ginger tea after breakfast. Thinking of you always!”',
        date: 'Yesterday, 6:15 PM',
        avatar: '👩'
      },
      {
        id: 'msg_3',
        from: 'Riya (Granddaughter)',
        fromUsername: '@riya_9988',
        type: 'smile',
        content: 'Dadi, I scored well in my art exam today! Thinking of your delicious coconut laddoos! 🍬🎨',
        date: '2 days ago',
        avatar: '👧'
      }
    ]);
  },

  addSocialMessage(msg) {
    const msgs = this.getSocialMessages();
    msgs.unshift(msg);
    this.setUserData('socialMessages', msgs);
    return msgs;
  },

  // --- Family Encouragement & Weekly Goals ---
  getFamilyChallenge() {
    return this.getUserData('familyChallenge', {
      title: 'Family Storytelling Week',
      description: 'Share or listen to 3 favorite family memories together with loved ones.',
      target: 3,
      current: 2,
      participants: ['Meera (You)', 'Raj', 'Ananya'],
      status: 'active',
      badge: '🌟 Storyteller Family'
    });
  },

  updateFamilyChallenge(progress) {
    const challenge = this.getFamilyChallenge();
    challenge.current = Math.min(challenge.target, challenge.current + progress);
    this.setUserData('familyChallenge', challenge);
    return challenge;
  },

  // --- Reset / Demo Data Population ---
  resetDemoData() {
    const user = this.getUser() || { name: 'Meera Sharma', phone: '9876543210', role: 'patient' };
    this.setUser(user);
    this.setCoins(145);

    this.setUserData('gameHistory', [
      { gameId: 'hornbill', gameName: 'Hornbill Memory Nest', score: 90, accuracy: 95, timeTaken: 54, hintsUsed: 0, coinsEarned: 11, date: new Date(Date.now() - 3*86400000).toISOString() },
      { gameId: 'memory-moments', gameName: 'Memory Moments', score: 85, accuracy: 88, timeTaken: 62, hintsUsed: 1, coinsEarned: 10, date: new Date(Date.now() - 2*86400000).toISOString() },
      { gameId: 'familiar-faces', gameName: 'Familiar Faces', score: 95, accuracy: 100, timeTaken: 45, hintsUsed: 0, coinsEarned: 12, date: new Date(Date.now() - 2*86400000).toISOString() },
      { gameId: 'remember-home', gameName: 'Remember My Home', score: 80, accuracy: 85, timeTaken: 58, hintsUsed: 1, coinsEarned: 9, date: new Date(Date.now() - 1*86400000).toISOString() },
      { gameId: 'listen-remember', gameName: 'Listen & Remember', score: 90, accuracy: 92, timeTaken: 50, hintsUsed: 0, coinsEarned: 11, date: new Date().toISOString() },
      { gameId: 'my-day', gameName: 'My Day', score: 85, accuracy: 90, timeTaken: 40, hintsUsed: 0, coinsEarned: 10, date: new Date().toISOString() },
      { gameId: 'bamboo-sequence', gameName: 'Bamboo Sequence', score: 78, accuracy: 80, timeTaken: 70, hintsUsed: 2, coinsEarned: 8, date: new Date().toISOString() },
    ]);

    this.setUserData('journeyStats', {
      totalXP: 720,
      streak: 6,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: ['first_game', 'consistent_3day', 'cheerful_mood', 'memory_master']
    });

    this.setPreferences({
      language: 'en',
      preferredName: 'Meera',
      nativePlace: 'Guwahati, Assam',
      festivals: 'Bihu, Diwali',
      foodPreferences: 'Warm tea with ginger, Rice and fish curry',
      languageNotes: 'Speaks English and Assamese comfortably',
      memoryNotes: 'Loves classical music, tea gardens, and family albums'
    });

    this.getMoodHistory();
    this.getMedicines();
    this.getMedicineReminders();
    this.getEmergencyContacts();
    this.getFamilyContacts();

    return true;
  },

  // --- All users list (for leaderboard) ---
  getAllUsers() {
    return this.get('allUsers', []);
  },

  registerUser(user) {
    const users = this.getAllUsers();
    const existing = users.find(u => u.phone === user.phone);
    if (!existing) {
      users.push({ name: user.name, phone: user.phone, role: user.role });
      this.set('allUsers', users);
    }
  },
};

export default Storage;
