import Storage from '../storage.js';
import I18n from '../i18n.js';

export default function PersonalisationPage(container) {
  const prefs = Storage.getPreferences() || {};

  container.innerHTML = `
    <div class="personalisation-container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="color: #9B2C2C; margin: 0; font-size: 2rem;">Cultural Personalisation</h2>
        <button class="btn" onclick="window.history.back()" style="padding: 10px 20px; background: transparent; border: 1px solid #666; color: #666; border-radius: 8px; cursor: pointer; font-size: 1.1rem;">⬅ Back</button>
      </div>
      
      <p style="color: #555; margin-bottom: 25px; font-size: 1.1rem;">Customize the app experience to make it more familiar and comforting.</p>

      <form id="personalisation-form" class="card" style="background: #FDF8F3; padding: 30px; border-radius: 12px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; gap: 20px;">
        
        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Preferred Name</label>
          <input type="text" id="pref-name" name="preferredName" value="${prefs.preferredName || ''}" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Native Place / Hometown</label>
          <input type="text" id="pref-hometown" name="hometown" value="${prefs.hometown || ''}" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Favorite Festivals (comma separated)</label>
          <input type="text" id="pref-festivals" name="festivals" value="${prefs.festivals || ''}" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Food Preferences / Favorite Dishes</label>
          <input type="text" id="pref-food" name="food" value="${prefs.food || ''}" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box;">
        </div>
        
        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Language & Cultural Notes</label>
          <textarea id="pref-language-notes" name="languageNotes" rows="3" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box; resize: vertical;">${prefs.languageNotes || ''}</textarea>
        </div>

        <div>
          <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #333;">Key Memory Triggers</label>
          <textarea id="pref-memory-notes" name="memoryNotes" rows="3" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 8px; font-size: 1.1rem; box-sizing: border-box; resize: vertical;">${prefs.memoryNotes || ''}</textarea>
        </div>

        <button type="submit" class="btn" style="min-height: 56px; font-size: 1.2rem; background: #0D9488; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 10px;">Save Preferences</button>
        <div id="save-toast" style="display: none; padding: 15px; background: #E6F4F1; border-left: 4px solid #0D9488; color: #0D9488; font-weight: bold; border-radius: 4px; text-align: center;">Preferences saved successfully!</div>
      </form>
    </div>
  `;

  container.querySelector('#personalisation-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPrefs = {
      ...prefs,
      preferredName: document.getElementById('pref-name').value,
      hometown: document.getElementById('pref-hometown').value,
      festivals: document.getElementById('pref-festivals').value,
      food: document.getElementById('pref-food').value,
      languageNotes: document.getElementById('pref-language-notes').value,
      memoryNotes: document.getElementById('pref-memory-notes').value,
    };
    
    Storage.setPreferences(newPrefs);
    
    const toast = document.getElementById('save-toast');
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
  });

  return { cleanup() {} };
}
