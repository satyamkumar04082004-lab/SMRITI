/* ============================================================
   SMRITI — "I’m Feeling Lost" Emergency Calm & Orientation Screen
   Instant reassurance, familiar ground, family connection & peaceful actions
   ============================================================ */

import Storage from '../storage.js';
import TTS from '../tts.js';
import AmbientAudio from '../ambientAudio.js';

export default function FeelingLostPage(container) {
  const user = Storage.getUser();
  const prefs = Storage.getPreferences();
  const emergency = Storage.getEmergencyContacts();
  const displayName = prefs.preferredName || (user ? user.name.split(' ')[0] : 'Friend');

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Warm voice reassurance
  try {
    TTS.speak(`You are safe ${displayName}. Take a gentle breath. Everything is okay.`);
  } catch {}

  container.innerHTML = `
    <div class="container page-enter" style="max-width: 640px; padding: 20px 15px 3.5rem 15px;">
      
      <!-- Reassurance Hero Banner -->
      <div class="card card-elevated text-center mb-md" style="background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 2px solid #86EFAC; padding: 2rem 1.5rem; border-radius: 24px;">
        <div style="font-size: 3.8rem; margin-bottom: 0.5rem; animation: floatSlow 3s infinite ease-in-out;">🌸🕊️</div>
        <h1 style="color: #065F46; font-size: 2.1rem; margin-bottom: 0.5rem;">
          You are safe, ${displayName}.
        </h1>
        <p style="color: #166534; font-size: 1.2rem; margin: 0; line-height: 1.45; font-weight: 500;">
          Take a deep, gentle breath. Everything is okay, and we are right here with you.
        </p>
      </div>

      <!-- Current Orientation Info -->
      <div class="card card-elevated mb-md" style="padding: 1.25rem 1.5rem; border-radius: 18px; background: #FFFDF9; border: 1.5px solid #FDE68A;">
        <h3 style="margin: 0 0 0.85rem 0; color: #92400E; font-size: 1.15rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>🧭</span> Peaceful Grounding Information
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 1.05rem; color: var(--gray-700);">
          <div>📅 <strong>Today is:</strong> ${dateStr}</div>
          <div>⏰ <strong>Current Time:</strong> ${timeStr}</div>
          <div>📍 <strong>Home Location:</strong> ${prefs.nativePlace || 'Guwahati, Assam'}</div>
        </div>
      </div>

      <!-- 4 Prominent, Calm Action Cards -->
      <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
        
        <!-- 1. Direct Call to Family -->
        <a href="tel:${emergency.primaryPhone.replace(/[^0-9+]/g, '')}" class="card card-elevated" style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 18px; background: #FEF2F2; border: 2px solid #FCA5A5; text-decoration: none;">
          <div style="font-size: 2.4rem; background: #DC2626; color: white; width: 62px; height: 62px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            📞
          </div>
          <div>
            <h3 style="margin: 0; color: #991B1B; font-size: 1.3rem;">Call ${emergency.primaryName}</h3>
            <p style="margin: 0.2rem 0 0 0; color: #B91C1C; font-size: 1rem;">Tap to speak directly with your family.</p>
          </div>
        </a>

        <!-- 2. Soft Nature Sounds -->
        <button id="btn-lost-music" class="card card-elevated" style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 18px; background: #F0FDFA; border: 2px solid #99F6E4; text-align: left; cursor: pointer; width: 100%;">
          <div style="font-size: 2.4rem; background: #0D9488; color: white; width: 62px; height: 62px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            🎵
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0; color: #0F766E; font-size: 1.3rem;">Play Soft Calming Music</h3>
            <p style="margin: 0.2rem 0 0 0; color: #115E59; font-size: 1rem;">Gentle stream and peaceful chimes to soothe you.</p>
          </div>
        </button>

        <!-- 3. Family Memories -->
        <button class="card card-elevated" onclick="window.location.hash='#/memories'" style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 18px; background: #FFFBEB; border: 2px solid #FDE68A; text-align: left; cursor: pointer; width: 100%;">
          <div style="font-size: 2.4rem; background: #D97706; color: white; width: 62px; height: 62px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            🖼️
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0; color: #92400E; font-size: 1.3rem;">Look at Familiar Memories</h3>
            <p style="margin: 0.2rem 0 0 0; color: #78350F; font-size: 1rem;">Browse family photos, happy stories and voices.</p>
          </div>
        </button>

        <!-- 4. Gentle Breathing -->
        <button class="card card-elevated" onclick="window.location.hash='#/wellness'" style="display: flex; align-items: center; gap: 1rem; padding: 1.25rem; border-radius: 18px; background: #EFF6FF; border: 2px solid #BFDBFE; text-align: left; cursor: pointer; width: 100%;">
          <div style="font-size: 2.4rem; background: #2563EB; color: white; width: 62px; height: 62px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            🫁
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0; color: #1E40AF; font-size: 1.3rem;">Gentle Breathing Exercise</h3>
            <p style="margin: 0.2rem 0 0 0; color: #1E3A8A; font-size: 1rem;">Take 4 calm breaths with our guided circle.</p>
          </div>
        </button>

      </div>

      <!-- Return Home Button -->
      <button class="btn btn-secondary btn-block" onclick="window.location.hash='#/home'" style="min-height: 54px; font-size: 1.2rem; font-weight: 700;">
        🏠 Return to Home Screen
      </button>

    </div>
  `;

  const btnMusic = container.querySelector('#btn-lost-music');
  if (btnMusic) {
    btnMusic.addEventListener('click', () => {
      AmbientAudio.start();
      if (window.SmritiToast) {
        window.SmritiToast.show('Playing gentle nature sounds... 🍃', 'info');
      }
    });
  }

  return { cleanup() {} };
}
