/* ============================================================
   SMRITI — Unified Patient Storage & Sync Abstraction Layer
   All modules connect through one unified patient data system.
   Dual persistence: localStorage + IndexedDB fallback + Offline Sync Queue.
   ============================================================ */

const DB_NAME = 'SmritiDB';
const DB_VERSION = 2;
const STORE_PATIENTS = 'patients';
const STORE_SYNC_QUEUE = 'syncQueue';

// IndexedDB Helper with safe fallback
let idbPromise = null;
function getIDB() {
  if (idbPromise) return idbPromise;
  idbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_PATIENTS)) {
          db.createObjectStore(STORE_PATIENTS, { keyPath: 'patientId' });
        }
        if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
          db.createObjectStore(STORE_SYNC_QUEUE, { autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (err) => {
        console.warn('Smriti IDB error:', err);
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
  return idbPromise;
}

// Default Unified Patient Profile Blueprint
function createDefaultPatientProfile(patientId = 'patient_meera_01') {
  return {
    patientId,
    patient: {
      id: patientId,
      name: 'Meera Das',
      preferredName: 'Meera',
      age: 72,
      gender: 'Female',
      phone: '9876543210',
      nativePlace: 'Guwahati, Assam',
      state: 'Assam',
      language: 'en',
      emergencyPhone: '+919876543210',
      caregiverPhone: '+919876543210',
      doctorPhone: '+919876543212',
      diagnosisNotes: 'Early-stage mild cognitive impairment (MCI). Independent in daily routines with gentle prompts.',
      stage: 'Mild MCI',
      createdAt: '2026-01-10T08:00:00.000Z'
    },
    familyMembers: [
      {
        id: 'fam_1',
        name: 'Raj Das',
        relation: 'Son',
        phone: '+91 98765 43210',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        memoryCue: 'Your eldest son who visits on weekends and brings warm ginger tea.',
        notes: 'Calls every morning at 8:30 AM',
        hints: ['He is your loving eldest son', 'His name starts with R', 'He brings you hot ginger tea on Sundays'],
        options: ['Raj Das (Son)', 'Dr. Barua (Doctor)', 'Amit (Neighbor)', 'Suresh (Brother)']
      },
      {
        id: 'fam_2',
        name: 'Ananya Das',
        relation: 'Daughter',
        phone: '+91 98765 43211',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
        memoryCue: 'Your daughter who lives in Shillong and calls every evening at 7 PM.',
        notes: 'Loves sharing pictures of the grandchildren',
        hints: ['She calls you every evening from Shillong', 'Her name starts with A', 'She is your daughter'],
        options: ['Ananya Das (Daughter)', 'Sunita (Nurse)', 'Riya (Granddaughter)', 'Pooja (Niece)']
      },
      {
        id: 'fam_3',
        name: 'Riya Das',
        relation: 'Granddaughter',
        phone: '+91 98765 43213',
        photo: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&auto=format&fit=crop&q=80',
        memoryCue: 'Your sweet granddaughter who got married in Guwahati and loves your homemade coconut pitha.',
        notes: 'Got married in Nov 2024',
        hints: ['She is your joyful granddaughter', 'You baked coconut pitha for her', 'Her name starts with R'],
        options: ['Riya Das (Granddaughter)', 'Ananya (Daughter)', 'Pooja (Nurse)', 'Rita (Neighbor)']
      },
      {
        id: 'fam_4',
        name: 'Dr. A. K. Barua',
        relation: 'Family Doctor',
        phone: '+91 98765 43212',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
        memoryCue: 'Your caring family physician at Guwahati Health Clinic.',
        notes: 'Clinic hours 10 AM - 2 PM',
        hints: ['He is your family physician', 'He checks your blood pressure and wellness', 'Dr. Barua'],
        options: ['Dr. A. K. Barua (Doctor)', 'Raj (Son)', 'Uncle Ramesh', 'Neighbor Amit']
      }
    ],
    memories: [
      {
        id: 'mem_1',
        title: "Granddaughter Riya's Wedding",
        tag: 'Family',
        date: 'November 2024',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
        story: 'The most joyful day when our sweet Riya got married in Guwahati. The courtyard was decorated with fragrant marigold flowers, and everyone danced to traditional melodies until evening.',
        voiceNote: 'The whole family had gathered together, smiling and blessing our beloved Riya. What a golden, cherished memory.',
        question: 'Do you remember the yellow marigold garlands and traditional melodies everyone danced to?'
      },
      {
        id: 'mem_2',
        title: 'Morning Walk at Jorhat Tea Gardens',
        tag: 'Nature',
        date: 'Spring 1988',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        story: 'Walking with Ashok along the lush green tea slopes in the cool morning mist. The scent of fresh tea leaves and warm ginger tea from our thermos flask made every morning special.',
        voiceNote: 'Ashok would always pick two fresh tea blossoms and smile. The morning breeze was so peaceful.',
        question: 'How did the crisp morning breeze and warm ginger tea feel as you walked?'
      },
      {
        id: 'mem_3',
        title: 'Bihu Feast with Grandchildren',
        tag: 'Celebration',
        date: 'January 2022',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
        story: 'Making homemade coconut pitha and sesame laddoos for all our neighbors and grandchildren. Seeing the children smile with sweet sticky hands was pure happiness.',
        voiceNote: 'The aroma of roasted rice flour and jaggery filled our entire home.',
        question: 'Who ate the sweet coconut pitha first with big smiles?'
      },
      {
        id: 'mem_4',
        title: 'Ancestral Courtyard Mango Tree',
        tag: 'Childhood',
        date: 'Summer 1965',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
        story: 'Sitting under the shade of our ancestral mango tree on warm summer afternoons, reading stories and sharing slices of raw green mango with a pinch of rock salt.',
        voiceNote: 'That giant old tree sheltered generations of our family with love and shade.',
        question: 'Do you remember the sweet and sour taste of green mango with rock salt?'
      }
    ],
    gameHistory: [
      { gameId: 'hornbill', gameName: 'Hornbill Memory Nest', score: 90, accuracy: 95, timeTaken: 54, hintsUsed: 0, coinsEarned: 11, domain: 'Visual Memory', date: new Date(Date.now() - 3 * 86400000).toISOString() },
      { gameId: 'memory-moments', gameName: 'Memory Moments', score: 85, accuracy: 88, timeTaken: 62, hintsUsed: 1, coinsEarned: 10, domain: 'Episodic Recall', date: new Date(Date.now() - 2 * 86400000).toISOString() },
      { gameId: 'familiar-faces', gameName: 'Familiar Faces', score: 95, accuracy: 100, timeTaken: 45, hintsUsed: 0, coinsEarned: 12, domain: 'Face Recognition', date: new Date(Date.now() - 2 * 86400000).toISOString() },
      { gameId: 'remember-home', gameName: 'Remember My Home', score: 80, accuracy: 85, timeTaken: 58, hintsUsed: 1, coinsEarned: 9, domain: 'Spatial Attention', date: new Date(Date.now() - 1 * 86400000).toISOString() },
      { gameId: 'listen-remember', gameName: 'Listen & Remember', score: 90, accuracy: 92, timeTaken: 50, hintsUsed: 0, coinsEarned: 11, domain: 'Auditory Memory', date: new Date().toISOString() },
      { gameId: 'my-day', gameName: 'My Day', score: 85, accuracy: 90, timeTaken: 40, hintsUsed: 0, coinsEarned: 10, domain: 'Executive Function', date: new Date().toISOString() },
      { gameId: 'bamboo-sequence', gameName: 'Bamboo Sequence', score: 78, accuracy: 80, timeTaken: 70, hintsUsed: 2, coinsEarned: 8, domain: 'Pattern Sequence', date: new Date().toISOString() }
    ],
    reminders: [
      { id: 'rem_1', title: 'Morning Blood Pressure Medicine', category: 'medication', icon: '💊', time: '08:30 AM', period: 'Morning', notes: '1 tablet with a warm glass of water', active: true, completedToday: false },
      { id: 'rem_2', title: 'Drink Warm Water & Stretch', category: 'hydration', icon: '💧', time: '09:30 AM', period: 'Morning', notes: '1 full glass of warm water', active: true, completedToday: false },
      { id: 'rem_3', title: 'Gentle Sunlight Garden Walk', category: 'activity', icon: '🚶', time: '10:30 AM', period: 'Morning', notes: 'Breathe fresh air in the sunlight', active: true, completedToday: false },
      { id: 'rem_4', title: 'Afternoon Water & Tea', category: 'hydration', icon: '🍵', time: '02:00 PM', period: 'Afternoon', notes: 'Rest and enjoy warm ginger tea', active: true, completedToday: false },
      { id: 'rem_5', title: 'Call Family / Grandchildren', category: 'call', icon: '📞', time: '05:30 PM', period: 'Evening', notes: 'Call Raj or Riya to hear their voices', active: true, completedToday: false },
      { id: 'rem_6', title: 'Night Calcium & Relaxing Rest', category: 'medication', icon: '🌙', time: '08:45 PM', period: 'Night', notes: '1 tablet after dinner with warm milk', active: true, completedToday: false }
    ],
    reminderLogs: [],
    moodHistory: [
      { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], mood: 'great', emoji: '😊', label: 'Great', note: 'Went for morning garden walk' },
      { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], mood: 'good', emoji: '🙂', label: 'Good', note: 'Enjoyed afternoon tea with Raj' },
      { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], mood: 'okay', emoji: '😐', label: 'Okay', note: 'Relaxed peacefully at home' },
      { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], mood: 'great', emoji: '😊', label: 'Great', note: 'Spoke with granddaughter Riya' },
      { date: new Date().toISOString().split('T')[0], mood: 'good', emoji: '🙂', label: 'Good', note: 'Feeling alert and cheerful today' }
    ],
    wellnessHistory: [
      { date: new Date().toISOString().split('T')[0], type: 'breathing', name: '4-4 Guided Breathing', durationSeconds: 180, completed: true }
    ],
    preferences: {
      language: 'en',
      regionalState: 'Assam',
      preferredName: 'Meera',
      nativePlace: 'Guwahati, Assam',
      festivals: 'Bihu, Diwali',
      foodPreferences: 'Warm tea with ginger, Rice and fish curry, Coconut pitha',
      languageNotes: 'Speaks English and Assamese comfortably',
      memoryNotes: 'Loves classical music, tea gardens, and family photo albums'
    },
    swaiRecommendations: [
      { id: 'rec_1', date: new Date().toISOString().split('T')[0], title: 'Gentle Pattern Practice', reason: 'To gently support sequential memory, try 2 rounds of Bamboo Sequence today.', gameId: 'bamboo-sequence' }
    ],
    doctorNotes: [
      {
        id: 'doc_1',
        doctorName: 'Dr. A. K. Barua',
        date: '2026-08-15',
        title: 'Quarterly Routine Review',
        notes: 'Meera demonstrates stable episodic recall. Recommended continuing daily engagement with Familiar Faces and gentle morning walks.',
        actionItems: ['Maintain 08:30 AM BP medication routine', 'Encourage evening family conversations', 'Repeat cognitive check-in in 90 days']
      }
    ],
    caregiverAlerts: [],
    coins: 145,
    journeyStats: {
      totalXP: 720,
      streak: 6,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: ['first_game', 'consistent_3day', 'cheerful_mood', 'memory_master']
    },
    medicines: [
      {
        id: 'med1',
        name: 'Pantoprazole',
        strength: '40 mg',
        instructions: '1 tablet in morning before food',
        frequency: 'Once daily (Morning)',
        duration: '30 days',
        doctor: 'Dr. A. K. Barua',
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
        doctor: 'Dr. A. K. Barua',
        date: '2026-08-15',
        notes: 'Supports general daily energy'
      },
      {
        id: 'med3',
        name: 'Calcium + Vitamin D3',
        strength: '500 mg',
        instructions: '1 tablet after dinner',
        frequency: 'Once daily (Night)',
        duration: '90 days',
        doctor: 'Dr. A. K. Barua',
        date: '2026-08-15',
        notes: 'Bone strength supplement'
      }
    ],
    emergencyContacts: {
      primaryName: 'Raj Das (Son)',
      primaryPhone: '+919876543210',
      relation: 'Son',
      doctorName: 'Dr. A. K. Barua',
      doctorPhone: '+919876543212',
      ambulancePhone: '112',
      transportPhone: '+919876543299'
    },
    aiSettings: {
      voiceEnabled: true,
      speechRate: 0.85,
      voiceGender: 'female',
      autoSpeak: true,
      soundEffects: true
    },
    voiceSettings: {
      voiceGuidanceEnabled: true,
      autoReadInstructions: true,
      voiceFeedback: true,
      voiceNavigation: true,
      speechRate: 0.85
    },
    routines: {
      easy: ['☀️ Wake up & stretch', '🪥 Brush teeth & wash', '🍳 Eat warm breakfast', '🚶 Gentle garden walk'],
      medium: ['☀️ Wake up & stretch', '🪥 Brush teeth & wash', '🍳 Eat warm breakfast', '🍵 Drink ginger tea', '🚶 Gentle garden walk'],
      hard: ['☀️ Wake up & stretch', '🪥 Brush teeth & wash', '🚿 Take warm bath', '🍳 Eat warm breakfast', '🍵 Drink ginger tea', '💊 Take morning medicine', '🚶 Gentle garden walk']
    },
    socialMessages: [
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
        content: 'Dadi, I baked coconut laddoos today following your recipe! Sending you so much love! 🍬🎨',
        date: '2 days ago',
        avatar: '👧'
      }
    ],
    familyChallenge: {
      title: 'Family Storytelling Week',
      description: 'Share or listen to 3 favorite family memories together with loved ones.',
      target: 3,
      current: 2,
      participants: ['Meera (You)', 'Raj', 'Ananya'],
      status: 'active',
      badge: '🌟 Storyteller Family'
    }
  };
}

const Storage = {
  _prefix: 'smriti_',

  _key(key) {
    return this._prefix + key;
  },

  // ------------------------------------------------------------
  // UNIFIED PATIENT PROFILE SYSTEM
  // ------------------------------------------------------------
  getActivePatientId() {
    try {
      return localStorage.getItem(this._key('active_patient_id')) || 'patient_meera_01';
    } catch {
      return 'patient_meera_01';
    }
  },

  setActivePatientId(id) {
    try {
      localStorage.setItem(this._key('active_patient_id'), id);
      window.dispatchEvent(new CustomEvent('smritiPatientChanged', { detail: { patientId: id } }));
    } catch (e) {
      console.warn('Failed to set active patient id:', e);
    }
  },

  _patientKey(patientId = null) {
    const pid = patientId || this.getActivePatientId();
    return `${this._prefix}patient_${pid}`;
  },

  getPatientProfile(patientId = null) {
    const pid = patientId || this.getActivePatientId();
    try {
      const raw = localStorage.getItem(this._patientKey(pid));
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading patient profile from localStorage:', e);
    }

    // Default initialized profile
    const defaultProfile = createDefaultPatientProfile(pid);
    this.savePatientProfile(defaultProfile, false);
    return defaultProfile;
  },

  savePatientProfile(profile, queueSync = true) {
    if (!profile || !profile.patientId) return;
    try {
      localStorage.setItem(this._patientKey(profile.patientId), JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save patient profile to localStorage:', e);
    }

    // Mirror to IndexedDB asynchronously
    getIDB().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction(STORE_PATIENTS, 'readwrite');
        tx.objectStore(STORE_PATIENTS).put(profile);
      } catch (err) {
        console.warn('IDB put error:', err);
      }
    });

    if (queueSync) {
      this.enqueueSync({
        type: 'PATIENT_PROFILE_UPDATE',
        patientId: profile.patientId,
        timestamp: Date.now()
      });
    }

    window.dispatchEvent(new CustomEvent('smritiDataUpdated', { detail: { patientId: profile.patientId } }));
  },

  // Partial update helper on the unified profile
  updatePatientProfile(patch, queueSync = true) {
    const profile = this.getPatientProfile();
    Object.assign(profile, patch);
    this.savePatientProfile(profile, queueSync);
    return profile;
  },

  // ------------------------------------------------------------
  // OFFLINE RESILIENCE & SYNC QUEUE
  // ------------------------------------------------------------
  enqueueSync(item) {
    try {
      const queue = this.getSyncQueue();
      queue.push({ id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4), ...item });
      localStorage.setItem(this._key('sync_queue'), JSON.stringify(queue));
      this.notifySyncStatus();
    } catch (e) {
      console.warn('Enqueue sync failed:', e);
    }
  },

  getSyncQueue() {
    try {
      const raw = localStorage.getItem(this._key('sync_queue'));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearSyncQueue() {
    try {
      localStorage.removeItem(this._key('sync_queue'));
      this.notifySyncStatus();
    } catch {}
  },

  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  notifySyncStatus() {
    const queue = this.getSyncQueue();
    window.dispatchEvent(new CustomEvent('smritiSyncStatus', {
      detail: {
        isOnline: this.isOnline(),
        pendingItems: queue.length
      }
    }));
  },

  async flushSyncQueue() {
    if (!this.isOnline()) return { success: false, reason: 'offline' };
    const queue = this.getSyncQueue();
    if (queue.length === 0) return { success: true, count: 0 };

    const profile = this.getPatientProfile();
    try {
      const resp = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientProfile: profile, queue })
      });
      if (resp.ok) {
        this.clearSyncQueue();
        return { success: true, count: queue.length };
      }
    } catch (e) {
      // Local server might not have sync API, silence gracefully
    }
    return { success: false, reason: 'sync_failed' };
  },

  // ------------------------------------------------------------
  // AUTH & SESSION MANAGEMENT (Role-based, unified profile)
  // ------------------------------------------------------------
  getUser() {
    try {
      const raw = localStorage.getItem(this._key('currentUser'));
      if (raw) return JSON.parse(raw);
      if (localStorage.getItem(this._key('loggedOut')) === 'true') return null;
      // Default initial session is patient
      const defaultUser = { name: 'Meera Das', phone: '9876543210', role: 'patient', patientId: 'patient_meera_01' };
      this.setUser(defaultUser);
      return defaultUser;
    } catch {
      return { name: 'Meera Das', phone: '9876543210', role: 'patient', patientId: 'patient_meera_01' };
    }
  },

  setUser(user) {
    try {
      localStorage.removeItem(this._key('loggedOut'));
      if (user && user.patientId) {
        this.setActivePatientId(user.patientId);
      }
      localStorage.setItem(this._key('currentUser'), JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('smritiUserChanged', { detail: { user } }));
    } catch (e) {
      console.warn('setUser failed:', e);
    }
  },

  clearUser() {
    try {
      localStorage.removeItem(this._key('currentUser'));
      localStorage.setItem(this._key('loggedOut'), 'true');
      window.dispatchEvent(new CustomEvent('smritiUserChanged', { detail: { user: null } }));
    } catch {}
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  // Backward-compatible generic get/set
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
    try {
      localStorage.removeItem(this._key(key));
    } catch {}
  },

  // ------------------------------------------------------------
  // GAME HISTORY & PROGRESS (Unified)
  // ------------------------------------------------------------
  saveGameResult(result) {
    const profile = this.getPatientProfile();
    result.date = result.date || new Date().toISOString();
    result.user = result.user || this.getUser()?.name || profile.patient.name || 'Player';
    
    // Assign cognitive domain if missing
    if (!result.domain) {
      const domainMap = {
        'hornbill': 'Visual Memory',
        'memory-moments': 'Episodic Recall',
        'familiar-faces': 'Face Recognition',
        'remember-home': 'Spatial Attention',
        'my-day': 'Executive Function',
        'listen-remember': 'Auditory Memory',
        'bamboo-sequence': 'Pattern Sequence'
      };
      result.domain = domainMap[result.gameId] || 'Cognitive Focus';
    }

    profile.gameHistory = profile.gameHistory || [];
    profile.gameHistory.push(result);

    // Coins and XP
    const coinsEarned = result.coinsEarned || Math.max(5, Math.round((result.score || 10) / 10));
    profile.coins = (profile.coins || 0) + coinsEarned;

    const xpEarned = (result.score || 10) + Math.round((result.accuracy || 50) / 2);
    const stats = profile.journeyStats || { totalXP: 0, streak: 1, lastActiveDate: new Date().toISOString().split('T')[0], unlockedBadges: [] };
    const oldLevel = this.calculateLevel(stats.totalXP).level;
    stats.totalXP += Math.max(1, xpEarned);
    const newLevel = this.calculateLevel(stats.totalXP).level;
    profile.journeyStats = stats;

    this.savePatientProfile(profile);

    if (newLevel > oldLevel) {
      window.dispatchEvent(new CustomEvent('smritiLevelUp', {
        detail: this.calculateLevel(stats.totalXP)
      }));
    }
  },

  getGameHistory(gameId = null) {
    const profile = this.getPatientProfile();
    const history = profile.gameHistory || [];
    if (gameId) return history.filter(h => h.gameId === gameId);
    return history;
  },

  // ------------------------------------------------------------
  // COINS & REWARDS
  // ------------------------------------------------------------
  getCoins() {
    const profile = this.getPatientProfile();
    return profile.coins || 0;
  },

  setCoins(amount) {
    const profile = this.getPatientProfile();
    profile.coins = Math.max(0, amount);
    this.savePatientProfile(profile);
  },

  // ------------------------------------------------------------
  // PREFERENCES & CULTURAL PROFILE
  // ------------------------------------------------------------
  getPreferences() {
    const profile = this.getPatientProfile();
    return profile.preferences || {
      language: 'en',
      regionalState: 'Assam',
      preferredName: 'Meera',
      nativePlace: 'Guwahati, Assam',
      festivals: 'Bihu, Diwali',
      foodPreferences: 'Warm tea with ginger',
      languageNotes: '',
      memoryNotes: ''
    };
  },

  setPreferences(prefs) {
    const profile = this.getPatientProfile();
    profile.preferences = Object.assign({}, profile.preferences, prefs);
    if (prefs.regionalState) {
      profile.patient.state = prefs.regionalState;
    }
    this.savePatientProfile(profile);
  },

  getLanguage() {
    return this.getPreferences().language || 'en';
  },

  setLanguage(lang) {
    const prefs = this.getPreferences();
    prefs.language = lang;
    this.setPreferences(prefs);
  },

  // ------------------------------------------------------------
  // ROUTINES & MY DAY SEQUENCING
  // ------------------------------------------------------------
  getRoutines() {
    const profile = this.getPatientProfile();
    return profile.routines || null;
  },

  setRoutines(routines) {
    const profile = this.getPatientProfile();
    profile.routines = routines;
    this.savePatientProfile(profile);
  },

  // ------------------------------------------------------------
  // FAMILY MEMBERS & FAMILIAR FACES (Single source of truth)
  // ------------------------------------------------------------
  getFamilyMembers() {
    const profile = this.getPatientProfile();
    return profile.familyMembers || [];
  },

  setFamilyMembers(members) {
    const profile = this.getPatientProfile();
    profile.familyMembers = members;
    this.savePatientProfile(profile);
  },

  addFamilyMember(member) {
    const profile = this.getPatientProfile();
    profile.familyMembers = profile.familyMembers || [];
    member.id = member.id || 'fam_' + Date.now();
    profile.familyMembers.unshift(member);
    this.savePatientProfile(profile);
    return profile.familyMembers;
  },

  updateFamilyMember(id, patch) {
    const profile = this.getPatientProfile();
    profile.familyMembers = (profile.familyMembers || []).map(m => m.id === id ? { ...m, ...patch } : m);
    this.savePatientProfile(profile);
    return profile.familyMembers;
  },

  deleteFamilyMember(id) {
    const profile = this.getPatientProfile();
    profile.familyMembers = (profile.familyMembers || []).filter(m => m.id !== id);
    this.savePatientProfile(profile);
    return profile.familyMembers;
  },

  // Aliases for legacy Familiar Faces callers
  getFamilyContacts() {
    return this.getFamilyMembers();
  },

  setFamilyContacts(contacts) {
    this.setFamilyMembers(contacts);
  },

  getCustomFaces() {
    return this.getFamilyMembers();
  },

  setCustomFaces(faces) {
    this.setFamilyMembers(faces);
  },

  addCustomFace(face) {
    return this.addFamilyMember(face);
  },

  deleteCustomFace(id) {
    return this.deleteFamilyMember(id);
  },

  // ------------------------------------------------------------
  // EMERGENCY CONTACTS
  // ------------------------------------------------------------
  getEmergencyContacts() {
    const profile = this.getPatientProfile();
    return profile.emergencyContacts || {
      primaryName: 'Raj Das (Son)',
      primaryPhone: '+919876543210',
      relation: 'Son',
      doctorName: 'Dr. A. K. Barua',
      doctorPhone: '+919876543212',
      ambulancePhone: '112',
      transportPhone: '+919876543299'
    };
  },

  setEmergencyContacts(contacts) {
    const profile = this.getPatientProfile();
    profile.emergencyContacts = contacts;
    this.savePatientProfile(profile);
  },

  // ------------------------------------------------------------
  // DAILY MOOD TRACKING
  // ------------------------------------------------------------
  getMoodHistory() {
    const profile = this.getPatientProfile();
    return profile.moodHistory || [];
  },

  addMoodEntry(moodKey, emoji, label, note = '') {
    const profile = this.getPatientProfile();
    profile.moodHistory = profile.moodHistory || [];
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = profile.moodHistory.findIndex(m => m.date === today);
    const newEntry = { date: today, mood: moodKey, emoji, label, note, timestamp: Date.now() };

    if (existingIndex >= 0) {
      profile.moodHistory[existingIndex] = newEntry;
    } else {
      profile.moodHistory.push(newEntry);
    }

    this.savePatientProfile(profile);
    this.addJourneyXP(15);
    return profile.moodHistory;
  },

  getTodayMood() {
    const history = this.getMoodHistory();
    const today = new Date().toISOString().split('T')[0];
    return history.find(m => m.date === today) || null;
  },

  // ------------------------------------------------------------
  // MIND JOURNEY & LEVELS
  // ------------------------------------------------------------
  getJourneyStats() {
    const profile = this.getPatientProfile();
    const stats = profile.journeyStats || {
      totalXP: 380,
      streak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      unlockedBadges: ['first_game', 'consistent_3day', 'cheerful_mood']
    };
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
    const profile = this.getPatientProfile();
    const stats = profile.journeyStats || { totalXP: 0, streak: 1, lastActiveDate: new Date().toISOString().split('T')[0], unlockedBadges: [] };
    const oldLevel = this.calculateLevel(stats.totalXP).level;
    stats.totalXP += Math.max(1, xp);
    const newLevel = this.calculateLevel(stats.totalXP).level;
    profile.journeyStats = stats;
    this.savePatientProfile(profile);

    if (newLevel > oldLevel) {
      window.dispatchEvent(new CustomEvent('smritiLevelUp', {
        detail: this.calculateLevel(stats.totalXP)
      }));
    }
  },

  // ------------------------------------------------------------
  // MEDICINES & PRESCRIPTIONS
  // ------------------------------------------------------------
  getMedicines() {
    const profile = this.getPatientProfile();
    return profile.medicines || [];
  },

  setMedicines(meds) {
    const profile = this.getPatientProfile();
    profile.medicines = meds;
    this.savePatientProfile(profile);
  },

  addMedicine(med) {
    const meds = this.getMedicines();
    med.id = med.id || 'med_' + Date.now();
    meds.push(med);
    this.setMedicines(meds);
    return meds;
  },

  // ------------------------------------------------------------
  // REMINDERS & ACTIVE REMINDER SCHEDULER LOGS
  // ------------------------------------------------------------
  getReminders() {
    const profile = this.getPatientProfile();
    return profile.reminders || [];
  },

  setReminders(reminders) {
    const profile = this.getPatientProfile();
    profile.reminders = reminders;
    this.savePatientProfile(profile);
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
    const profile = this.getPatientProfile();
    profile.reminders = (profile.reminders || []).map(r => r.id === id ? { ...r, completedToday: true, snoozedUntil: null } : r);
    profile.reminderLogs = profile.reminderLogs || [];
    profile.reminderLogs.push({
      reminderId: id,
      action: 'completed',
      timestamp: Date.now(),
      date: new Date().toISOString()
    });
    this.savePatientProfile(profile);
    return profile.reminders;
  },

  snoozeReminder(id, minutes = 10) {
    const snoozeTime = Date.now() + minutes * 60 * 1000;
    const profile = this.getPatientProfile();
    profile.reminders = (profile.reminders || []).map(r => r.id === id ? { ...r, snoozedUntil: snoozeTime } : r);
    profile.reminderLogs = profile.reminderLogs || [];
    profile.reminderLogs.push({
      reminderId: id,
      action: 'snoozed',
      snoozedUntil: snoozeTime,
      timestamp: Date.now(),
      date: new Date().toISOString()
    });
    this.savePatientProfile(profile);
    return profile.reminders;
  },

  // Backward compatibility aliases
  getMedicineReminders() {
    return this.getReminders().map(r => ({ id: r.id, medName: r.title, time: r.time, period: r.period, active: r.active, dose: r.notes }));
  },
  setMedicineReminders(reminders) {
    this.setReminders(reminders);
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

  // ------------------------------------------------------------
  // AI & VOICE SETTINGS
  // ------------------------------------------------------------
  getAISettings() {
    const profile = this.getPatientProfile();
    return profile.aiSettings || {
      voiceEnabled: true,
      speechRate: 0.85,
      voiceGender: 'female',
      autoSpeak: true,
      soundEffects: true
    };
  },

  setAISettings(settings) {
    const profile = this.getPatientProfile();
    profile.aiSettings = settings;
    this.savePatientProfile(profile);
  },

  getVoiceSettings() {
    const profile = this.getPatientProfile();
    return profile.voiceSettings || {
      voiceGuidanceEnabled: true,
      autoReadInstructions: true,
      voiceFeedback: true,
      voiceNavigation: true,
      speechRate: 0.85
    };
  },

  setVoiceSettings(settings) {
    const profile = this.getPatientProfile();
    profile.voiceSettings = settings;
    this.savePatientProfile(profile);
  },

  // ------------------------------------------------------------
  // LIFE STORY & MEMORIES
  // ------------------------------------------------------------
  getMemories() {
    const profile = this.getPatientProfile();
    return profile.memories || [];
  },

  setMemories(memories) {
    const profile = this.getPatientProfile();
    profile.memories = memories;
    this.savePatientProfile(profile);
  },

  addMemory(memory) {
    const list = this.getMemories();
    memory.id = memory.id || 'mem_' + Date.now();
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

  // ------------------------------------------------------------
  // DOCTOR NOTES & CLINICAL REPORTS
  // ------------------------------------------------------------
  getDoctorNotes() {
    const profile = this.getPatientProfile();
    return profile.doctorNotes || [];
  },

  addDoctorNote(note) {
    const profile = this.getPatientProfile();
    profile.doctorNotes = profile.doctorNotes || [];
    note.id = note.id || 'doc_' + Date.now();
    note.date = note.date || new Date().toISOString().split('T')[0];
    profile.doctorNotes.unshift(note);
    this.savePatientProfile(profile);
    return profile.doctorNotes;
  },

  // ------------------------------------------------------------
  // CAREGIVER ALERTS & WELLNESS LOGS
  // ------------------------------------------------------------
  getCaregiverAlerts() {
    const profile = this.getPatientProfile();
    return profile.caregiverAlerts || [];
  },

  addCaregiverAlert(alert) {
    const profile = this.getPatientProfile();
    profile.caregiverAlerts = profile.caregiverAlerts || [];
    alert.id = alert.id || 'alert_' + Date.now();
    alert.timestamp = alert.timestamp || Date.now();
    profile.caregiverAlerts.unshift(alert);
    this.savePatientProfile(profile);
    return profile.caregiverAlerts;
  },

  // ------------------------------------------------------------
  // SOCIAL MESSAGES & CHALLENGES
  // ------------------------------------------------------------
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

  getSocialMessages() {
    const profile = this.getPatientProfile();
    return profile.socialMessages || [];
  },

  addSocialMessage(msg) {
    const profile = this.getPatientProfile();
    profile.socialMessages = profile.socialMessages || [];
    profile.socialMessages.unshift(msg);
    this.savePatientProfile(profile);
    return profile.socialMessages;
  },

  getFamilyChallenge() {
    const profile = this.getPatientProfile();
    return profile.familyChallenge || {
      title: 'Family Storytelling Week',
      description: 'Share or listen to 3 favorite family memories together with loved ones.',
      target: 3,
      current: 2,
      participants: ['Meera (You)', 'Raj', 'Ananya'],
      status: 'active',
      badge: '🌟 Storyteller Family'
    };
  },

  updateFamilyChallenge(progress) {
    const challenge = this.getFamilyChallenge();
    challenge.current = Math.min(challenge.target, challenge.current + progress);
    const profile = this.getPatientProfile();
    profile.familyChallenge = challenge;
    this.savePatientProfile(profile);
    return challenge;
  },

  // Generic userData backward compatibility proxying to unified profile
  getUserData(key, fallback = null) {
    const profile = this.getPatientProfile();
    if (key in profile) return profile[key];
    // Specific legacy mapping
    if (key === 'gameHistory') return profile.gameHistory || fallback;
    if (key === 'coins') return profile.coins || 0;
    if (key === 'preferences') return profile.preferences || fallback;
    if (key === 'routines') return profile.routines || fallback;
    if (key === 'familyContacts') return profile.familyMembers || fallback;
    if (key === 'emergencyContacts') return profile.emergencyContacts || fallback;
    if (key === 'moodHistory') return profile.moodHistory || fallback;
    if (key === 'journeyStats') return profile.journeyStats || fallback;
    if (key === 'medicines') return profile.medicines || fallback;
    if (key === 'dailyReminders') return profile.reminders || fallback;
    if (key === 'aiSettings') return profile.aiSettings || fallback;
    if (key === 'voiceSettings') return profile.voiceSettings || fallback;
    if (key === 'familyMemories') return profile.memories || fallback;
    if (key === 'customFaces') return profile.familyMembers || fallback;
    if (key === 'socialMessages') return profile.socialMessages || fallback;
    if (key === 'familyChallenge') return profile.familyChallenge || fallback;

    // Fallback to local raw storage
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },

  setUserData(key, value) {
    const profile = this.getPatientProfile();
    if (key === 'gameHistory') profile.gameHistory = value;
    else if (key === 'coins') profile.coins = value;
    else if (key === 'preferences') profile.preferences = value;
    else if (key === 'routines') profile.routines = value;
    else if (key === 'familyContacts' || key === 'customFaces') profile.familyMembers = value;
    else if (key === 'emergencyContacts') profile.emergencyContacts = value;
    else if (key === 'moodHistory') profile.moodHistory = value;
    else if (key === 'journeyStats') profile.journeyStats = value;
    else if (key === 'medicines') profile.medicines = value;
    else if (key === 'dailyReminders') profile.reminders = value;
    else if (key === 'aiSettings') profile.aiSettings = value;
    else if (key === 'voiceSettings') profile.voiceSettings = value;
    else if (key === 'familyMemories') profile.memories = value;
    else if (key === 'socialMessages') profile.socialMessages = value;
    else if (key === 'familyChallenge') profile.familyChallenge = value;
    else {
      profile[key] = value;
    }
    this.savePatientProfile(profile);
  },

  // ------------------------------------------------------------
  // RESET DEMO DATA
  // ------------------------------------------------------------
  resetDemoData() {
    const defaultProfile = createDefaultPatientProfile('patient_meera_01');
    this.savePatientProfile(defaultProfile);
    this.setUser({ name: 'Meera Das', phone: '9876543210', role: 'patient', patientId: 'patient_meera_01' });
    return true;
  },

  getAllUsers() {
    return this.get('allUsers', [
      { name: 'Meera Das', phone: '9876543210', role: 'patient' },
      { name: 'Raj Das (Caregiver)', phone: '9876543210', role: 'caregiver' },
      { name: 'Dr. A. K. Barua', phone: '9876543212', role: 'doctor' }
    ]);
  },

  registerUser(user) {
    const users = this.getAllUsers();
    const existing = users.find(u => u.phone === user.phone && u.role === user.role);
    if (!existing) {
      users.push({ name: user.name, phone: user.phone, role: user.role });
      this.set('allUsers', users);
    }
  }
};

export default Storage;
