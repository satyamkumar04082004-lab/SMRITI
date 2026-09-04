import TTS from '../tts.js';

export default function WellnessPage(container) {
  let isBreathing = false;
  let breathInterval = null;
  let breathPhase = 'ready'; // ready | inhale | hold | exhale
  let breathCount = 4;
  let cycleCount = 0;

  const guides = [
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

  container.innerHTML = `
    <div class="container page-enter" style="max-width: 720px; padding-bottom: 2rem;">
      <!-- Header Banner -->
      <div class="card card-elevated text-center" style="background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 1px solid #BBF7D0; padding: 1.5rem; margin-bottom: 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌿🌻</div>
        <h2 style="color: #065F46; font-size: 1.7rem; margin-bottom: 0.25rem;">Wellness & Mindful Habits</h2>
        <p style="color: #047857; font-size: 1.05rem; margin-bottom: 0;">Simple, peaceful daily practices for healthy living and joyful energy.</p>
      </div>

      <!-- Interactive 4-4 Guided Breathing Exercise -->
      <div class="card card-elevated mb-md text-center" style="background: linear-gradient(135deg, #EFF6FF, #DBEAFE); border: 2px solid #BFDBFE; padding: 2rem 1.25rem; border-radius: 20px;">
        <h3 style="color: #1E40AF; font-size: 1.35rem; margin-bottom: 0.25rem;">🫁 4-4 Guided Breathing Exercise</h3>
        <p style="color: #1E3A8A; font-size: 1rem; margin-bottom: 1.5rem;">Follow the soothing expanding circle to release tension and calm your heartbeat.</p>

        <!-- Animated Breathing Visual Circle -->
        <div style="display: flex; justify-content: center; align-items: center; margin: 1rem auto 1.5rem auto; height: 180px;">
          <div id="breath-circle" style="width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, #60A5FA, #3B82F6); box-shadow: 0 0 35px rgba(59, 130, 246, 0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.8rem; transition: transform 4s cubic-bezier(0.4, 0, 0.2, 1);">
            <span id="breath-timer-text">🕊️</span>
          </div>
        </div>

        <div id="breath-instruction" style="font-size: 1.25rem; font-weight: 700; color: #1E40AF; min-height: 36px; margin-bottom: 1rem;">
          Ready to breathe peacefully?
        </div>

        <button id="btn-toggle-breath" class="btn btn-primary" style="min-height: 52px; font-size: 1.15rem; font-weight: 700; padding: 0.6rem 2.2rem; background: #2563EB;">
          ▶ Start Breathing Exercise
        </button>
      </div>

      <!-- Medical Disclaimer -->
      <div class="safety-notice mb-md" style="background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E; border-radius: 12px; padding: 0.9rem 1.1rem;">
        <span class="notice-icon" style="font-size: 1.3rem;">ℹ️</span>
        <div style="font-size: 0.95rem; line-height: 1.5;">
          <strong>Educational Notice:</strong> This guide provides general wellness education and self-care inspiration. It is not medical advice, diagnosis, or prescription. Always consult your qualified doctor or healthcare provider for personal medical guidance.
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
                <strong style="color: var(--teal); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">💡 What it is</strong>
                <p style="margin-top: 0.25rem; font-size: 1rem; color: var(--gray-700);">${item.whatItIs}</p>
              </div>

              <div style="margin-bottom: 0.85rem;">
                <strong style="color: var(--green); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px;">🌱 Gentle Helpful Habits</strong>
                <ul style="margin-top: 0.35rem; padding-left: 1.25rem; font-size: 0.98rem; color: var(--gray-700); display: flex; flex-direction: column; gap: 0.35rem;">
                  ${item.habits.map(h => `<li>${h}</li>`).join('')}
                </ul>
              </div>

              <div style="background: #F8FAFC; padding: 0.75rem 1rem; border-radius: 8px; border-left: 4px solid var(--maroon);">
                <strong style="color: var(--maroon); font-size: 0.9rem;">🩺 When to consult a professional:</strong>
                <p style="margin: 0.2rem 0 0 0; font-size: 0.95rem; color: var(--gray-700);">${item.whenToAskDoctor}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Back / Quick Link Button -->
      <div class="text-center mt-lg">
        <button id="btn-wellness-back-home" class="btn btn-secondary" style="padding: 0.75rem 2rem;">
          🏠 Back to Home
        </button>
      </div>
    </div>
  `;

  const btnToggleBreath = container.querySelector('#btn-toggle-breath');
  const circle = container.querySelector('#breath-circle');
  const timerText = container.querySelector('#breath-timer-text');
  const instruction = container.querySelector('#breath-instruction');

  function startBreathing() {
    isBreathing = true;
    btnToggleBreath.textContent = '⏹ Stop Exercise';
    btnToggleBreath.style.background = '#DC2626';
    cycleCount = 0;
    runPhase('inhale');
  }

  function stopBreathing() {
    isBreathing = false;
    clearTimeout(breathInterval);
    btnToggleBreath.textContent = '▶ Start Breathing Exercise';
    btnToggleBreath.style.background = '#2563EB';
    if (circle) circle.style.transform = 'scale(1)';
    if (timerText) timerText.textContent = '🕊️';
    if (instruction) instruction.textContent = 'Ready to breathe peacefully?';
  }

  function runPhase(phase) {
    if (!isBreathing) return;
    breathPhase = phase;
    let count = 4;

    if (phase === 'inhale') {
      if (circle) circle.style.transform = 'scale(1.4)';
      if (instruction) instruction.textContent = 'Breathe in gently... 🌸';
      if (timerText) timerText.textContent = '4';
      if (TTS && TTS.isSupported() && cycleCount === 0) TTS.speak('Breathe in gently');
    } else {
      if (circle) circle.style.transform = 'scale(1)';
      if (instruction) instruction.textContent = 'Breathe out slowly... 🍃';
      if (timerText) timerText.textContent = '4';
      if (TTS && TTS.isSupported() && cycleCount === 0) TTS.speak('Breathe out slowly');
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
            if (instruction) instruction.textContent = 'Wonderful job! You feel calmer and centered. ✨';
            if (TTS && TTS.isSupported()) TTS.speak('Wonderful job. Notice how calm and centered you feel.');
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

  return {
    cleanup() {
      if (breathInterval) clearTimeout(breathInterval);
      TTS.stop();
    }
  };
}
