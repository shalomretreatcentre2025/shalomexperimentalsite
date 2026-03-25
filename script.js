// ===== RETREATS DATA =====
// Retreats are now managed via the Admin Panel (/retreat-manager.html)
// and stored in retreats.json — do not hardcode data here.

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== GOOGLE SHEETS INTEGRATION =====
const scriptURL = 'https://script.google.com/macros/s/AKfycbz3bWasgGFisq-HXqzneAX9Et6m7rHTARl3SNBAXFLDCyZHYdt98_6RG_jbxx0YCQjzaQ/exec';

function handleFormSubmit(formId, successId, errorId) {
    const form           = document.getElementById(formId);
    const successMessage = document.getElementById(successId);
    const errorMessage   = document.getElementById(errorId);
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const submitButton  = form.querySelector('button[type="submit"]');
        const originalText  = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled    = true;
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage)   errorMessage.style.display   = 'none';

        fetch(scriptURL, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
            .then(() => {
                if (successMessage) {
                    successMessage.style.display = 'flex';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
                }
                form.reset();
            })
            .catch(() => {
                if (errorMessage) {
                    errorMessage.style.display = 'flex';
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            })
            .finally(() => {
                submitButton.textContent = originalText;
                submitButton.disabled    = false;
            });
    });
}

// ===== RETREAT CARD RENDERER (shared by bookings.html and index.html) =====
function renderRetreatCards(retreats, containerId, limit) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = '';
    const items = limit ? retreats.slice(0, limit) : retreats;
    let delay = 1;
    items.forEach(retreat => {
        const card = document.createElement('div');
        card.className = 'retreat-card fade-in-delay-' + delay;
        card.innerHTML =
            '<div class="retreat-image">' +
                '<div class="retreat-tag">' + retreat.tag + '</div>' +
                '<img src="' + retreat.image + '" alt="' + retreat.name + '" loading="lazy">' +
            '</div>' +
            '<div class="retreat-content">' +
                '<h3>' + retreat.name + '</h3>' +
                '<div class="retreat-date">' +
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                        '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>' +
                        '<line x1="16" y1="2" x2="16" y2="6"></line>' +
                        '<line x1="8" y1="2" x2="8" y2="6"></line>' +
                        '<line x1="3" y1="10" x2="21" y2="10"></line>' +
                    '</svg>' +
                    retreat.date +
                '</div>' +
                '<p>' + retreat.description + '</p>' +
                '<a href="retreat-signup.html?retreat=' + retreat.id + '" class="btn-secondary">Learn More &amp; Register</a>' +
            '</div>';
        grid.appendChild(card);
        delay = (delay % 4) + 1;
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== LOAD RETREATS FROM JSON =====
async function loadRetreats() {
    try {
        // Cache-busting param ensures admin changes appear immediately
        const res = await fetch('retreats.json?v=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
    } catch (e) {
        console.warn('Could not load retreats.json, falling back to empty list.', e);
        return [];
    }
}

// ===== INITIALISE =====
document.addEventListener('DOMContentLoaded', async () => {
    // Set up all forms
    handleFormSubmit('stayUpdatedForm',  'stayUpdatedSuccess',  'stayUpdatedError');
    handleFormSubmit('facilityForm',     'facilitySuccess',     'facilityError');
    handleFormSubmit('contactPageForm',  'successMessage',      'errorMessage');
    handleFormSubmit('registrationForm', 'successMessage',      'errorMessage');

    // Load retreat data
    const retreatsData = await loadRetreats();

    // Build lookup map for the signup page
    const retreatInfo = retreatsData.reduce((map, r) => {
        map[r.id] = { name: r.name, sheetName: r.sheetName };
        return map;
    }, {});

    // Homepage highlights (first 3)
    renderRetreatCards(retreatsData, 'highlightsGrid', 3);

    // Bookings page (all retreats)
    renderRetreatCards(retreatsData, 'retreatsGrid');

    // ---- Retreat signup page ----
    const urlParams  = new URLSearchParams(window.location.search);
    const retreatId  = urlParams.get('retreat');
    const titleEl    = document.getElementById('retreatTitle');
    const nameInput  = document.getElementById('retreatName');
    const sheetInput = document.getElementById('sheetName');

    if (retreatId && retreatInfo[retreatId]) {
        const info = retreatInfo[retreatId];
        if (nameInput)  nameInput.value  = info.name;
        if (sheetInput) sheetInput.value = info.sheetName;
        if (titleEl)    titleEl.textContent = info.name;

        const retreat = retreatsData.find(r => r.id === retreatId);
        const hero    = document.getElementById('retreatHero');
        if (hero && retreat) {
            document.getElementById('retreatHeroImg').src         = retreat.image;
            document.getElementById('retreatHeroImg').alt         = retreat.name;
            document.getElementById('retreatHeroTag').textContent = retreat.tag;
            document.getElementById('retreatHeroTitle').textContent       = retreat.name;
            document.getElementById('retreatHeroDate').textContent        = retreat.date;
            document.getElementById('retreatHeroDescription').textContent = retreat.description;
            hero.style.display = '';
        }
    } else if (titleEl) {
        titleEl.textContent = 'Retreat Registration';
    }
});
