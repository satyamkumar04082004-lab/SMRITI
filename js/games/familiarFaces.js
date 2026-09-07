import GameShell from '../gameShell.js';
import I18n from '../i18n.js';
import Storage from '../storage.js';
import TTS from '../tts.js';

export default function FamiliarFaces(container) {
    const defaultFaces = [
        { emoji: '👵', name: 'Grandmother', relation: 'Family', hints: ['She is a family member', 'Starts with G', 'Grandmother'], options: ['Daughter', 'Grandmother', 'Teacher', 'Neighbor'] },
        { emoji: '👨‍⚕️', name: 'Doctor', relation: 'Healthcare', hints: ['Works in healthcare', 'Starts with D', 'Doctor'], options: ['Doctor', 'Teacher', 'Friend', 'Son'] },
        { emoji: '👧', name: 'Daughter', relation: 'Family', hints: ['She is a family member', 'Starts with D', 'Daughter'], options: ['Mother', 'Daughter', 'Friend', 'Nurse'] },
        { emoji: '👴', name: 'Grandfather', relation: 'Family', hints: ['He is a family member', 'Starts with G', 'Grandfather'], options: ['Father', 'Uncle', 'Grandfather', 'Neighbor'] },
        { emoji: '👨‍🏫', name: 'Teacher', relation: 'Community', hints: ['Works in education', 'Starts with T', 'Teacher'], options: ['Doctor', 'Father', 'Teacher', 'Son'] },
        { emoji: '👩‍⚕️', name: 'Nurse', relation: 'Healthcare', hints: ['Works in healthcare', 'Starts with N', 'Nurse'], options: ['Nurse', 'Mother', 'Daughter', 'Teacher'] },
        { emoji: '👦', name: 'Son', relation: 'Family', hints: ['He is a family member', 'Starts with S', 'Son'], options: ['Father', 'Son', 'Doctor', 'Teacher'] },
        { emoji: '👮', name: 'Police', relation: 'Community', hints: ['Works in security', 'Starts with P', 'Police'], options: ['Police', 'Teacher', 'Doctor', 'Neighbor'] },
        { emoji: '👩', name: 'Mother', relation: 'Family', hints: ['She is a family member', 'Starts with M', 'Mother'], options: ['Aunt', 'Sister', 'Mother', 'Friend'] },
        { emoji: '👨', name: 'Father', relation: 'Family', hints: ['He is a family member', 'Starts with F', 'Father'], options: ['Uncle', 'Brother', 'Father', 'Grandfather'] }
    ];

    let currentFaceIndex = 0;
    let activeFaces = [];
    let currentHintsUsed = 0;

    const config = {
        gameId: 'familiar-faces',
        titleKey: 'g3Title',
        instructionKey: 'g3Instruction',
        icon: '👨‍👩‍👧',
        hasDifficulty: true,
        parTime: 90,
        onStart: (difficulty, gameArea, controller) => {
            startGame(difficulty, gameArea, controller);
        }
    };

    const shell = GameShell.create(container, config);

    // Insert "📷 Add Photos of Your Loved Ones" button on the start screen
    setTimeout(() => {
        const startCard = container.querySelector('.card.card-elevated.text-center');
        if (startCard && !startCard.querySelector('#btn-open-face-upload')) {
            const uploadBtnBox = document.createElement('div');
            uploadBtnBox.style.marginBottom = '1.25rem';
            uploadBtnBox.innerHTML = `
                <button type="button" id="btn-open-face-upload" class="btn btn-secondary" style="font-size: 1.05rem; padding: 0.6rem 1.25rem; font-weight: 700; border-radius: 14px; display: inline-flex; align-items: center; gap: 0.5rem;">
                    📷 Add Photos of Your Loved Ones
                </button>
                <div style="font-size: 0.85rem; color: var(--gray-500); margin-top: 0.35rem;">
                    Include your real family members and friends in this game!
                </div>
            `;
            const timerBox = startCard.querySelector('.timer-config-box');
            if (timerBox) {
                startCard.insertBefore(uploadBtnBox, timerBox);
            } else {
                startCard.appendChild(uploadBtnBox);
            }

            uploadBtnBox.querySelector('#btn-open-face-upload').addEventListener('click', () => {
                renderUploadFaceModal();
            });
        }
    }, 50);

    function renderUploadFaceModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 520px; padding: 1.75rem; border-radius: 18px; max-height: 90vh; overflow-y: auto;">
                <h3 style="color: var(--maroon); margin-top: 0; font-size: 1.35rem;">📷 Add a Known Loved One</h3>
                <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1rem;">Upload a clear photo and use the zoom/crop controls so the face is easy for the senior to recognize.</p>

                <form id="form-add-face" style="display: flex; flex-direction: column; gap: 0.85rem;">
                    <div>
                        <label class="form-label" style="font-weight: 600;">Person's Name *</label>
                        <input type="text" id="face-name" class="form-input" placeholder="e.g. Raj Das" required />
                    </div>

                    <div>
                        <label class="form-label" style="font-weight: 600;">Relation / Role *</label>
                        <input type="text" id="face-relation" class="form-input" placeholder="e.g. Eldest Son" required />
                    </div>

                    <div style="background: #F8FAFC; padding: 14px; border-radius: 14px; border: 1.5px dashed #CBD5E1; text-align: center;">
                        <label class="form-label" style="font-weight: 700; color: var(--teal-dark); margin-bottom: 8px; font-size: 1rem; display: block; text-align: left;">
                            📸 Add Profile Picture
                        </label>
                        
                        <!-- Circular Avatar Placeholder / Preview -->
                        <div id="avatar-preview-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 12px;">
                            <div id="avatar-placeholder-circle" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--teal, #0D9488); background: #E6F4F1; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08); margin: 0 auto;">
                                <span id="avatar-default-icon">👤</span>
                                <img id="avatar-preview-img" src="" alt="Avatar Preview" style="display: none; width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <span style="font-size: 0.8rem; color: var(--gray-500); margin-top: 6px;">Profile Photo Preview</span>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 8px; text-align: left;">
                            <label for="face-file" class="btn btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; padding: 8px 14px; font-weight: 700; border-radius: 10px; font-size: 0.95rem; width: 100%;">
                                📁 Choose Photo from Device
                            </label>
                            <input type="file" id="face-file" accept="image/*" style="display: none;" />

                            <!-- Interactive Canvas Crop & Zoom Interface -->
                            <div id="crop-controls-box" style="display: none; margin-top: 10px; text-align: center;">
                                <div style="font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">
                                    🔍 Drag to position • Adjust zoom slider:
                                </div>
                                <div style="position: relative; width: 160px; height: 160px; margin: 0 auto; border-radius: 50%; overflow: hidden; border: 3px solid var(--teal, #0D9488); box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: #000; cursor: grab;">
                                    <canvas id="crop-canvas" width="160" height="160" style="display: block; width: 100%; height: 100%;"></canvas>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px;">
                                    <span style="font-size: 0.85rem; font-weight: 600;">Zoom:</span>
                                    <input type="range" id="zoom-slider" min="1" max="3" step="0.05" value="1" style="width: 130px; cursor: pointer;">
                                    <button type="button" id="btn-reset-crop" class="btn btn-ghost btn-sm" style="font-size: 0.8rem; padding: 2px 8px;">Reset</button>
                                </div>
                            </div>

                            <div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 4px;">Or paste image URL (never displayed as text):</div>
                            <input type="url" id="face-img-url" class="form-input" style="font-size: 0.85rem;" placeholder="https://example.com/photo.jpg" />
                        </div>
                    </div>

                    <div>
                        <label class="form-label" style="font-weight: 600;">Gentle Memory Clue / Hint</label>
                        <input type="text" id="face-hint" class="form-input" placeholder="e.g. He visits every Sunday with hot ginger tea" />
                    </div>

                    <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1; min-height: 48px; font-weight: 700;">✓ Save Loved One</button>
                        <button type="button" id="btn-cancel-face-modal" class="btn btn-ghost" style="flex: 1; min-height: 48px;">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        let activeImg = null;
        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        const fileInp = modal.querySelector('#face-file');
        const cropBox = modal.querySelector('#crop-controls-box');
        const canvas = modal.querySelector('#crop-canvas');
        const ctx = canvas.getContext('2d');
        const zoomSlider = modal.querySelector('#zoom-slider');
        const resetBtn = modal.querySelector('#btn-reset-crop');

        function drawCanvas() {
            if (!activeImg) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(offsetX, offsetY);
            ctx.drawImage(activeImg, -activeImg.width / 2, -activeImg.height / 2);
            ctx.restore();
        }

        function loadImgToCanvas(imgSrc) {
            activeImg = new Image();
            activeImg.crossOrigin = 'anonymous';
            activeImg.onload = () => {
                const baseScale = Math.max(canvas.width / activeImg.width, canvas.height / activeImg.height);
                scale = baseScale;
                zoomSlider.min = (baseScale * 0.8).toString();
                zoomSlider.max = (baseScale * 3.5).toString();
                zoomSlider.value = baseScale.toString();
                offsetX = 0;
                offsetY = 0;
                cropBox.style.display = 'block';
                drawCanvas();
                const prevImg = modal.querySelector('#avatar-preview-img');
                const defIcon = modal.querySelector('#avatar-default-icon');
                if (prevImg && defIcon) {
                    prevImg.src = imgSrc;
                    prevImg.style.display = 'block';
                    defIcon.style.display = 'none';
                }
            };
            activeImg.src = imgSrc;
        }

        fileInp.addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            if (f) {
                const r = new FileReader();
                r.onload = (evt) => loadImgToCanvas(evt.target.result);
                r.readAsDataURL(f);
            }
        });

        modal.querySelector('#face-img-url').addEventListener('change', (e) => {
            const val = e.target.value.trim();
            if (val) loadImgToCanvas(val);
        });

        zoomSlider.addEventListener('input', (e) => {
            scale = parseFloat(e.target.value);
            drawCanvas();
        });

        resetBtn.addEventListener('click', () => {
            if (!activeImg) return;
            const baseScale = Math.max(canvas.width / activeImg.width, canvas.height / activeImg.height);
            scale = baseScale;
            zoomSlider.value = baseScale.toString();
            offsetX = 0;
            offsetY = 0;
            drawCanvas();
        });

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - offsetX;
            startY = e.clientY - offsetY;
            canvas.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;
            drawCanvas();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        // Touch support for dragging
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX - offsetX;
                startY = e.touches[0].clientY - offsetY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            offsetX = e.touches[0].clientX - startX;
            offsetY = e.touches[0].clientY - startY;
            drawCanvas();
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        modal.querySelector('#btn-cancel-face-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#form-add-face').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = modal.querySelector('#face-name').value.trim();
            const relation = modal.querySelector('#face-relation').value.trim();
            const hint = modal.querySelector('#face-hint').value.trim() || `This is your ${relation}`;

            if (!name) return;

            // Generate cropped canvas base64 image if uploaded
            let finalImage = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80';
            if (activeImg) {
                finalImage = canvas.toDataURL('image/jpeg', 0.88);
            } else if (modal.querySelector('#face-img-url').value.trim()) {
                finalImage = modal.querySelector('#face-img-url').value.trim();
            }

            const newFace = {
                id: 'face_custom_' + Date.now(),
                name: `${name} (${relation})`,
                relation,
                image: finalImage,
                hints: [
                    `Relation: ${relation}`,
                    hint,
                    `Name starts with ${name.charAt(0)}`
                ],
                options: [
                    `${name} (${relation})`,
                    'Dr. Barua',
                    'Neighbor Amit',
                    'Friend Suresh'
                ]
            };

            Storage.addCustomFace(newFace);
            if (window.SmritiToast) {
                window.SmritiToast.show(`${name} added to your Familiar Faces! 🌸`, 'success');
            }
            modal.remove();
        });
    }

    function startGame(difficulty, gameArea, controller) {
        let numFaces = 4;
        if (difficulty === 'easy') {
            numFaces = 3;
        } else if (difficulty === 'medium') {
            numFaces = 4;
        } else {
            numFaces = 6;
        }

        const family = Storage.getFamilyMembers() || [];

        // If family list is empty or has only 1, display prompt to add family
        if (family.length === 0) {
            gameArea.innerHTML = `
                <div class="card question-box text-center" style="max-width: 540px; margin: 0 auto; padding: 2rem;">
                    <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">👨‍👩‍👧</div>
                    <h3 style="color: var(--maroon); margin-bottom: 0.5rem;">No Family Members Added Yet</h3>
                    <p class="text-muted" style="font-size: 1.05rem; margin-bottom: 1.5rem;">
                        This game is designed to help you recognize and remember your real loved ones and caregivers. Please add your first family member to begin!
                    </p>
                    <button id="btn-add-first-family" class="btn btn-primary" style="min-height: 52px; font-weight: 700;">
                        📷 Add Loved One Now
                    </button>
                </div>
            `;
            const addBtn = gameArea.querySelector('#btn-add-first-family');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    renderUploadFaceModal();
                });
            }
            return;
        }

        // Format family members into game face structure
        const formattedFamily = family.map(f => {
            const hints = f.hints && f.hints.length > 0 ? f.hints : [
                f.memoryCue || `This is your loving ${f.relation}.`,
                `Relation: ${f.relation}`,
                `Name starts with ${f.name.charAt(0)}`
            ];

            let options = f.options && f.options.length >= 3 ? f.options : [];
            if (options.length < 3) {
                const otherNames = family.filter(o => o.id !== f.id).map(o => `${o.name} (${o.relation})`);
                const pool = [`${f.name} (${f.relation})`, ...otherNames, 'Neighbor Amit', 'Dr. Barua', 'Friend Suresh'];
                const set = Array.from(new Set(pool)).slice(0, 4);
                options = set;
            }

            return {
                id: f.id,
                name: `${f.name} (${f.relation})`,
                relation: f.relation,
                image: f.photo || f.image,
                emoji: f.emoji || '👤',
                hints,
                options
            };
        });

        activeFaces = [...formattedFamily].sort(() => Math.random() - 0.5).slice(0, Math.min(numFaces, formattedFamily.length));
        currentFaceIndex = 0;

        showFace(gameArea, controller);
    }

    function showFace(gameArea, controller) {
        if (currentFaceIndex >= activeFaces.length) {
            controller.endGame();
            return;
        }

        currentHintsUsed = 0;
        const face = activeFaces[currentFaceIndex];
        const shuffledOptions = [...face.options].sort(() => Math.random() - 0.5);

        const isCustomImage = face.image && face.image.length > 5;
        gameArea.innerHTML = `
            <div class="card question-box" style="text-align: center; max-width: 600px; margin: 0 auto; padding: 2rem;">
                ${isCustomImage ? `
                    <div style="width: 140px; height: 140px; margin: 0 auto 1.25rem auto; border-radius: 50%; overflow: hidden; border: 4px solid #FCD34D; box-shadow: 0 6px 16px rgba(0,0,0,0.12);">
                        <img src="${face.image}" alt="Person" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'" />
                    </div>
                ` : `
                    <div style="font-size: 5rem; margin-bottom: 1rem;">${face.emoji || '👤'}</div>
                `}
                <h3 class="question-text" style="margin-bottom: 1rem; font-size: 1.6rem; color: var(--maroon);">Who is this?</h3>
                
                <div id="hint-display" style="min-height: 2rem; margin-bottom: 1rem; color: #B45309; font-weight: bold; font-size: 1.1rem;"></div>
                
                <button class="btn btn-secondary hint-btn" style="margin-bottom: 1.5rem; border-radius: 12px; font-weight: 700;">💡 Need a gentle hint?</button>
                
                <div class="options-list" style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;">
                    ${shuffledOptions.map(opt => `
                        <button class="btn btn-outline option-btn" data-answer="${opt}" style="padding: 1.2rem; font-size: 1.2rem; min-height: 60px; font-weight: 600; border-radius: 12px;">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;

        if (TTS && TTS.isSupported()) {
            TTS.speak("Who is this?");
        }

        const hintBtn = gameArea.querySelector('.hint-btn');
        const hintDisplay = gameArea.querySelector('#hint-display');

        hintBtn.addEventListener('click', () => {
            if (currentHintsUsed < face.hints.length) {
                const hintText = face.hints[currentHintsUsed];
                hintDisplay.textContent = `Hint: ${hintText}`;
                controller.recordHint();
                if (TTS && TTS.isSupported()) {
                    TTS.speak(hintText);
                }
                currentHintsUsed++;
                if (currentHintsUsed >= face.hints.length) {
                    hintBtn.disabled = true;
                    hintBtn.textContent = 'No more hints available';
                }
            }
        });

        const optionButtons = gameArea.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                optionButtons.forEach(b => b.disabled = true);
                hintBtn.disabled = true;

                const selected = btn.getAttribute('data-answer');
                const isCorrect = selected === face.name;

                if (isCorrect) {
                    btn.classList.remove('btn-outline');
                    btn.classList.add('correct');
                    btn.style.background = '#0D9488';
                    btn.style.color = '#FFFFFF';
                    btn.style.borderColor = '#0D9488';

                    let points = 15;
                    if (currentHintsUsed === 1) points = 12;
                    else if (currentHintsUsed === 2) points = 8;
                    else if (currentHintsUsed >= 3) points = 5;

                    controller.addScore(points);
                    controller.recordCorrect();

                    if (TTS && TTS.isSupported()) {
                        TTS.speak("Correct! Wonderful job.");
                    }
                } else {
                    btn.classList.remove('btn-outline');
                    btn.classList.add('wrong');
                    btn.style.background = '#DC2626';
                    btn.style.color = '#FFFFFF';
                    btn.style.borderColor = '#DC2626';

                    controller.recordWrong();

                    optionButtons.forEach(b => {
                        if (b.getAttribute('data-answer') === face.name) {
                            b.classList.remove('btn-outline');
                            b.classList.add('correct');
                            b.style.background = '#0D9488';
                            b.style.color = '#FFFFFF';
                            b.style.borderColor = '#0D9488';
                        }
                    });

                    if (TTS && TTS.isSupported()) {
                        TTS.speak(`That was ${face.name}.`);
                    }
                }

                setTimeout(() => {
                    currentFaceIndex++;
                    showFace(gameArea, controller);
                }, 1800);
            });
        });
    }

    return {
        cleanup() {
            if (TTS) TTS.stop();
        }
    };
}
