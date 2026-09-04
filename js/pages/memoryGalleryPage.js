/* ============================================================
   SMRITI — Life Story & Family Memory Gallery
   Senior-accessible photo memories, spoken stories & family contributor hub
   ============================================================ */

import Storage from '../storage.js';
import TTS from '../tts.js';
import I18n from '../i18n.js';

export default function MemoryGalleryPage(container) {
  let memories = Storage.getMemories() || [];
  let currentIndex = 0;
  let viewMode = 'slideshow'; // 'slideshow' | 'grid'
  let isSpeaking = false;
  let showAddModal = false;

  function render() {
    if (!memories.length) {
      container.innerHTML = `
        <div class="container page-enter" style="max-width: 680px; padding: 2rem 1rem; text-align: center;">
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🖼️✨</div>
          <h2 style="color: var(--maroon);">Life Story & Memories</h2>
          <p class="text-muted" style="font-size: 1.1rem; margin-bottom: 1.5rem;">No family memories added yet. Caregivers can add precious memories here.</p>
          <button id="btn-add-first-mem" class="btn btn-primary">+ Add First Memory</button>
        </div>
      `;
      const btn = container.querySelector('#btn-add-first-mem');
      if (btn) btn.addEventListener('click', () => { showAddModal = true; render(); });
      return;
    }

    const current = memories[currentIndex] || memories[0];

    container.innerHTML = `
      <div class="container page-enter" style="max-width: 720px; padding-bottom: 3rem;">
        
        <!-- Header & View Mode Switcher -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button id="btn-close-gallery-top" class="btn btn-outline btn-sm" style="border-radius: 12px; font-weight: 700; color: var(--maroon); border-color: var(--maroon); padding: 0.4rem 0.85rem; font-size: 1rem; display: flex; align-items: center; gap: 0.35rem;">
              ⬅ Back
            </button>
            <div>
              <h2 style="color: var(--maroon); margin: 0; font-size: 1.8rem; display: flex; align-items: center; gap: 0.5rem;">
                <span>🖼️</span> Life Story & Memories
              </h2>
              <p class="text-muted" style="margin: 0.2rem 0 0 0; font-size: 0.95rem;">Treasured moments with your loved ones</p>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button id="btn-toggle-view" class="btn btn-outline btn-sm" style="font-size: 0.95rem;">
              ${viewMode === 'slideshow' ? '📱 Grid View' : '📖 Story View'}
            </button>
            <button id="btn-open-add-memory" class="btn btn-secondary btn-sm" style="font-size: 0.95rem;">
              + Add Memory
            </button>
          </div>
        </div>

        ${viewMode === 'slideshow' ? `
          <!-- SLIDESHOW STORY MODE (Senior-Friendly, Large Cards) -->
          <div class="card card-elevated" style="padding: 1.5rem; border-radius: 20px; background: #FFFDF9; border: 2px solid #FDE68A; margin-bottom: 1.25rem;">
            
            <!-- Memory Tag & Date Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span style="background: #E6F4F1; color: var(--teal-dark); font-weight: 700; font-size: 0.9rem; padding: 4px 12px; border-radius: 20px;">
                🏷️ ${current.tag || 'Family'}
              </span>
              <span style="color: var(--gray-500); font-weight: 600; font-size: 0.95rem;">
                📅 ${current.date || 'Cherished Moment'}
              </span>
            </div>

            <!-- Big Memory Photo -->
            <div style="position: relative; width: 100%; border-radius: 16px; overflow: hidden; margin-bottom: 1.25rem; background: #E2E8F0; aspect-ratio: 16/10; box-shadow: 0 6px 16px rgba(0,0,0,0.08);">
              <img src="${current.image}" alt="${current.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80'" />
            </div>

            <!-- Memory Title -->
            <h3 style="color: var(--maroon); font-size: 1.6rem; margin: 0 0 0.75rem 0; line-height: 1.3;">
              ${current.title}
            </h3>

            <!-- Memory Story Text -->
            <p style="font-size: 1.2rem; line-height: 1.6; color: var(--gray-700); margin-bottom: 1.25rem; background: #FFF8EE; padding: 1rem 1.25rem; border-radius: 12px; border-left: 5px solid var(--gold);">
              ${current.story}
            </p>

            <!-- Personalized Reminiscence Question (if present or auto-generated) -->
            <div style="background: linear-gradient(135deg, #FEF3C7, #FFFBEB); border: 1.5px solid #FDE68A; border-radius: 14px; padding: 1rem 1.15rem; margin-bottom: 1.25rem;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #92400E; text-transform: uppercase; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.35rem;">
                <span>💭</span> Personalized Memory Question
              </div>
              <p style="margin: 0; color: #78350F; font-size: 1.05rem; font-weight: 600; line-height: 1.45;">
                “${current.question || `Do you remember what made ${current.title} so memorable with your family?`}”
              </p>
            </div>

            <!-- Spoken Voice Note Button -->
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <button id="btn-listen-story" class="btn ${isSpeaking ? 'btn-secondary' : 'btn-primary'} btn-block" style="min-height: 56px; font-size: 1.2rem; border-radius: 14px; gap: 0.5rem; display: flex; align-items: center; justify-content: center;">
                <span>${isSpeaking ? '⏹️ Stop Voice Story' : '🔊 Listen to Voice Story'}</span>
              </button>
            </div>

            <!-- Large Navigation Arrows -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F5EDE3; padding-top: 1rem;">
              <button id="btn-prev-memory" class="btn btn-outline" style="min-width: 110px; min-height: 52px; font-size: 1.1rem; border-radius: 12px;">
                ⬅ Previous
              </button>
              <div style="font-weight: 700; color: var(--gray-700); font-size: 1.05rem;">
                ${currentIndex + 1} / ${memories.length}
              </div>
              <button id="btn-next-memory" class="btn btn-outline" style="min-width: 110px; min-height: 52px; font-size: 1.1rem; border-radius: 12px;">
                Next ➔
              </button>
            </div>
          </div>
        ` : `
          <!-- GRID VIEW (Browse all photos) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            ${memories.map((m, idx) => `
              <div class="card card-elevated grid-memory-item" data-idx="${idx}" style="cursor: pointer; border-radius: 16px; overflow: hidden; padding: 0; background: #FFF; border: 1.5px solid #E2E8F0; transition: transform 0.2s ease;">
                <div style="width: 100%; aspect-ratio: 4/3; background: #E2E8F0; overflow: hidden;">
                  <img src="${m.image}" alt="${m.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80'" />
                </div>
                <div style="padding: 1rem;">
                  <div style="font-size: 0.8rem; color: var(--teal-dark); font-weight: 700; text-transform: uppercase;">${m.tag || 'Memory'}</div>
                  <h4 style="color: var(--maroon); margin: 0.25rem 0 0.4rem 0; font-size: 1.15rem;">${m.title}</h4>
                  <p style="color: var(--gray-500); font-size: 0.9rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${m.story}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Add Memory Modal for Family / Caregivers -->
        ${showAddModal ? `
          <div class="modal-overlay">
            <div class="modal-content" style="max-width: 500px; padding: 1.75rem; border-radius: 18px; max-height: 90vh; overflow-y: auto;">
              <h3 style="color: var(--maroon); margin-top: 0; font-size: 1.4rem;">📷 Add Precious Family Memory</h3>
              <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1.25rem;">Upload a photo from your device or paste an image link for your loved one to cherish and listen to.</p>

              <form id="form-add-memory" style="display: flex; flex-direction: column; gap: 0.85rem;">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;">Memory Title *</label>
                  <input type="text" id="new-mem-title" class="form-input" placeholder="e.g. Grandson Aryan's 5th Birthday" required />
                </div>

                <!-- Image Upload (Local File + URL Option) -->
                <div class="form-group" style="background: #F8FAFC; padding: 12px; border-radius: 12px; border: 1.5px dashed #CBD5E1;">
                  <label class="form-label" style="font-weight: 700; color: var(--teal-dark); margin-bottom: 6px;">
                    🖼️ Upload Photo from Device
                  </label>
                  <input type="file" id="new-mem-file" accept="image/*" class="form-input" style="padding: 6px; font-size: 0.95rem; background: white;" />
                  <div id="file-upload-preview" style="display: none; margin-top: 8px; border-radius: 8px; overflow: hidden; max-height: 140px;">
                    <img id="img-preview" src="" alt="Preview" style="width: 100%; height: 140px; object-fit: cover;" />
                  </div>
                  <div style="font-size: 0.85rem; color: var(--gray-500); margin-top: 6px;">
                    Or paste an image web link below:
                  </div>
                  <input type="url" id="new-mem-image" class="form-input" style="margin-top: 4px;" placeholder="https://example.com/photo.jpg" />
                </div>

                <div style="display: flex; gap: 10px;">
                  <div class="form-group" style="flex: 1;">
                    <label class="form-label" style="font-weight: 600;">Category</label>
                    <select id="new-mem-tag" class="form-select">
                      <option value="Family">Family 👨‍👩‍👧</option>
                      <option value="Childhood">Childhood 🧸</option>
                      <option value="Celebration">Celebration / Festival 🪔</option>
                      <option value="Nature">Travel & Nature 🌿</option>
                      <option value="Wedding">Wedding / Milestone 💍</option>
                    </select>
                  </div>

                  <div class="form-group" style="flex: 1;">
                    <label class="form-label" style="font-weight: 600;">Date or Era</label>
                    <input type="text" id="new-mem-date" class="form-input" placeholder="e.g. Diwali 2022" />
                  </div>
                </div>

                <div class="form-group">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <label class="form-label" style="font-weight: 600; margin: 0;">Story / Voice Narration Text *</label>
                    <span style="font-size: 0.8rem; color: var(--teal-dark); font-weight: 600;">💡 Spoken aloud</span>
                  </div>
                  <textarea id="new-mem-story" class="form-input" rows="3" placeholder="Write the story behind this moment. Smriti will narrate it whenever listened to." required></textarea>
                </div>

                <!-- Personalized Memory Reflection Questions -->
                <div class="form-group" style="background: #FEF3C7; padding: 10px 12px; border-radius: 10px; border: 1px solid #FDE68A;">
                  <div style="font-size: 0.85rem; font-weight: 700; color: #92400E; margin-bottom: 4px;">
                    💭 Suggested Reminiscence Question (Optional)
                  </div>
                  <input type="text" id="new-mem-question" class="form-input" style="font-size: 0.95rem; background: white;" placeholder="e.g. Do you remember who made the sweets that day?" />
                </div>

                <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                  <button type="submit" class="btn btn-primary" style="flex: 1; min-height: 50px; font-weight: 700;">
                    ✓ Save Memory
                  </button>
                  <button type="button" id="btn-cancel-add-memory" class="btn btn-ghost" style="flex: 1; min-height: 50px;">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ` : ''}

        <!-- Quick Back Link -->
        <div class="text-center mt-md">
          <button class="btn btn-ghost" onclick="window.location.hash='#/home'" style="color: var(--gray-500);">
            🏠 Back to Home
          </button>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    // Top Close/Back button
    const topCloseBtn = container.querySelector('#btn-close-gallery-top');
    if (topCloseBtn) {
      topCloseBtn.addEventListener('click', () => {
        TTS.stop();
        window.location.hash = '#/home';
      });
    }

    // File input preview handling
    let uploadedBase64 = null;
    const fileInput = container.querySelector('#new-mem-file');
    const filePreview = container.querySelector('#file-upload-preview');
    const imgPreview = container.querySelector('#img-preview');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            uploadedBase64 = evt.target.result;
            if (imgPreview) imgPreview.src = uploadedBase64;
            if (filePreview) filePreview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Mode toggle
    const toggleBtn = container.querySelector('#btn-toggle-view');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        TTS.stop();
        isSpeaking = false;
        viewMode = viewMode === 'slideshow' ? 'grid' : 'slideshow';
        render();
      });
    }

    // Modal open/close
    const openAddBtn = container.querySelector('#btn-open-add-memory');
    if (openAddBtn) {
      openAddBtn.addEventListener('click', () => {
        showAddModal = true;
        render();
      });
    }

    const cancelAddBtn = container.querySelector('#btn-cancel-add-memory');
    if (cancelAddBtn) {
      cancelAddBtn.addEventListener('click', () => {
        showAddModal = false;
        render();
      });
    }

    // Add Memory Form submit
    const form = container.querySelector('#form-add-memory');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = container.querySelector('#new-mem-title').value.trim();
        const image = uploadedBase64 || container.querySelector('#new-mem-image').value.trim() || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80';
        const tag = container.querySelector('#new-mem-tag').value;
        const date = container.querySelector('#new-mem-date').value.trim() || 'Precious Time';
        const story = container.querySelector('#new-mem-story').value.trim();
        const questionInput = container.querySelector('#new-mem-question');
        const question = questionInput ? questionInput.value.trim() : '';

        if (!title || !story) return alert('Please enter both title and story');

        const newMem = {
          id: 'mem_' + Date.now(),
          title,
          image,
          tag,
          date,
          story,
          question
        };

        Storage.addMemory(newMem);
        memories = Storage.getMemories();
        currentIndex = 0;
        showAddModal = false;
        viewMode = 'slideshow';

        if (window.SmritiToast) {
          window.SmritiToast.show('New family memory added with love!', 'success');
        }
        render();
      });
    }

    // Previous / Next in slideshow
    const prevBtn = container.querySelector('#btn-prev-memory');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        TTS.stop();
        isSpeaking = false;
        currentIndex = (currentIndex - 1 + memories.length) % memories.length;
        render();
      });
    }

    const nextBtn = container.querySelector('#btn-next-memory');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        TTS.stop();
        isSpeaking = false;
        currentIndex = (currentIndex + 1) % memories.length;
        render();
      });
    }

    // Grid card click
    container.querySelectorAll('.grid-memory-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-idx'), 10);
        currentIndex = idx;
        viewMode = 'slideshow';
        render();
      });
    });

    // Listen to voice story
    const listenBtn = container.querySelector('#btn-listen-story');
    if (listenBtn) {
      listenBtn.addEventListener('click', () => {
        if (isSpeaking) {
          TTS.stop();
          isSpeaking = false;
          render();
        } else {
          const current = memories[currentIndex];
          if (current && current.story) {
            isSpeaking = true;
            render();
            TTS.speak(current.story);
            // Poll speech end
            const checkEnd = setInterval(() => {
              if (!TTS.isSpeaking()) {
                isSpeaking = false;
                clearInterval(checkEnd);
                render();
              }
            }, 500);
          }
        }
      });
    }
  }

  render();

  return {
    cleanup() {
      TTS.stop();
      isSpeaking = false;
    }
  };
}
