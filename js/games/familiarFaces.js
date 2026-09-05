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
    let showUploadModal = false;

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

    // Insert "📷 Add Your Own Loved One Photo" button onto the start screen
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
            <div class="modal-content" style="max-width: 480px; padding: 1.75rem; border-radius: 18px; max-height: 90vh; overflow-y: auto;">
                <h3 style="color: var(--maroon); margin-top: 0; font-size: 1.35rem;">📷 Add a Known Person</h3>
                <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1.25rem;">Upload a photo of a family member, neighbor, or caregiver to recognize in the game.</p>

                <form id="form-add-face" style="display: flex; flex-direction: column; gap: 0.85rem;">
                    <div>
                        <label class="form-label" style="font-weight: 600;">Person's Name *</label>
                        <input type="text" id="face-name" class="form-input" placeholder="e.g. Raj" required />
                    </div>

                    <div>
                        <label class="form-label" style="font-weight: 600;">Relation / Role *</label>
                        <input type="text" id="face-relation" class="form-input" placeholder="e.g. Eldest Son" required />
                    </div>

                    <div style="background: #F8FAFC; padding: 10px; border-radius: 10px; border: 1.5px dashed #CBD5E1;">
                        <label class="form-label" style="font-weight: 700; color: var(--teal-dark); margin-bottom: 4px;">Photo from Device</label>
                        <input type="file" id="face-file" accept="image/*" class="form-input" style="padding: 4px; font-size: 0.9rem;" />
                        <div id="face-file-preview" style="display: none; margin-top: 6px; text-align: center;">
                            <img id="face-preview-img" src="" alt="Face" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid var(--teal);" />
                        </div>
                        <div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 6px;">Or image link:</div>
                        <input type="url" id="face-img-url" class="form-input" style="margin-top: 2px;" placeholder="https://..." />
                    </div>

                    <div>
                        <label class="form-label" style="font-weight: 600;">Gentle Clue / Hint</label>
                        <input type="text" id="face-hint" class="form-input" placeholder="e.g. He visits every Sunday with sweets" />
                    </div>

                    <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1; min-height: 48px; font-weight: 700;">✓ Save Person</button>
                        <button type="button" id="btn-cancel-face-modal" class="btn btn-ghost" style="flex: 1; min-height: 48px;">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        let uploadedFaceBase64 = null;
        const fileInp = modal.querySelector('#face-file');
        const prevBox = modal.querySelector('#face-file-preview');
        const prevImg = modal.querySelector('#face-preview-img');

        fileInp.addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            if (f) {
                const r = new FileReader();
                r.onload = (evt) => {
                    uploadedFaceBase64 = evt.target.result;
                    prevImg.src = uploadedFaceBase64;
                    prevBox.style.display = 'block';
                };
                r.readAsDataURL(f);
            }
        });

        modal.querySelector('#btn-cancel-face-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#form-add-face').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = modal.querySelector('#face-name').value.trim();
            const relation = modal.querySelector('#face-relation').value.trim();
            const img = uploadedFaceBase64 || modal.querySelector('#face-img-url').value.trim() || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80';
            const hint = modal.querySelector('#face-hint').value.trim() || `This is your ${relation}`;

            if (!name) return;

            const newFace = {
                id: 'face_custom_' + Date.now(),
                name: `${name} (${relation})`,
                relation,
                image: img,
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
            numFaces = 4;
        } else if (difficulty === 'medium') {
            numFaces = 6;
        } else {
            numFaces = 8;
        }

        const customFaces = Storage.getCustomFaces() || [];
        // Combine custom uploaded faces first, then default faces
        const combinedPool = [...customFaces, ...defaultFaces];

        activeFaces = [...combinedPool].sort(() => Math.random() - 0.5).slice(0, numFaces);
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
                    ${shuffledOptions.map(opt => `<button class="btn option-btn" data-answer="${opt}" style="min-height: 54px; font-size: 1.15rem; font-weight: 700; border-radius: 12px;">${opt}</button>`).join('')}
                </div>
            </div>
        `;

        const hintBtn = gameArea.querySelector('.hint-btn');
        const hintDisplay = gameArea.querySelector('#hint-display');
        const optionsList = gameArea.querySelector('.options-list');
        const buttons = optionsList.querySelectorAll('.option-btn');
        let answered = false;

        hintBtn.addEventListener('click', () => {
            if (currentHintsUsed < 3) {
                hintDisplay.textContent = face.hints[currentHintsUsed];
                currentHintsUsed++;
                controller.recordHint();
                if (currentHintsUsed === 3) {
                    hintBtn.style.display = 'none';
                }
            }
        });

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (answered) return;
                answered = true;
                
                const selected = btn.dataset.answer;
                if (selected === face.name) {
                    btn.classList.add('correct');
                    btn.style.backgroundColor = '#0D9488';
                    btn.style.color = 'white';
                    
                    let score = 15;
                    if (currentHintsUsed === 1) score = 12;
                    else if (currentHintsUsed === 2) score = 8;
                    else if (currentHintsUsed === 3) score = 5;
                    
                    controller.addScore(score);
                    controller.recordCorrect();
                } else {
                    btn.classList.add('wrong');
                    btn.style.backgroundColor = '#9B2C2C';
                    btn.style.color = 'white';
                    buttons.forEach(b => {
                        if (b.dataset.answer === face.name) {
                            b.style.backgroundColor = '#0D9488';
                            b.style.color = 'white';
                        }
                    });
                    controller.recordWrong();
                }

                setTimeout(() => {
                    currentFaceIndex++;
                    showFace(gameArea, controller);
                }, 1500);
            });
        });
    }

    return {
        cleanup() {
            if (shell.cleanup) shell.cleanup();
        }
    };
}
