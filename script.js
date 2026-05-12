// ===== RETREATS DATA =====
// Managed via /retreat-manager.html and stored in retreats.json

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

// ===== BOOKING SUCCESS POPUP =====
// Creates one shared popup element that any form can use.
(function createBookingPopup() {
    const popup = document.createElement('div');
    popup.id    = 'bookingPopup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Booking confirmation');
    popup.innerHTML =
        '<div class="booking-popup-overlay" id="bookingPopupOverlay">' +
            '<div class="booking-popup-box">' +
                '<div class="booking-popup-icon">' +
                    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                        '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>' +
                        '<polyline points="22 4 12 14.01 9 11.01"></polyline>' +
                    '</svg>' +
                '</div>' +
                '<h3 class="booking-popup-title">Booking Successful</h3>' +
                '<p class="booking-popup-msg">A confirmation email has been sent to your inbox. We will be in touch shortly to confirm your place.</p>' +
                '<button class="booking-popup-close btn-primary" id="bookingPopupClose">Close</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(popup);

    document.getElementById('bookingPopupClose').addEventListener('click', hideBookingPopup);
    document.getElementById('bookingPopupOverlay').addEventListener('click', function(e) {
        if (e.target === this) hideBookingPopup();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideBookingPopup();
    });
})();

function showBookingPopup() {
    const popup = document.getElementById('bookingPopup');
    if (popup) {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.getElementById('bookingPopupClose').focus();
    }
}

function hideBookingPopup() {
    const popup = document.getElementById('bookingPopup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
    }
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
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending…';
        submitButton.disabled    = true;
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage)   errorMessage.style.display   = 'none';

        fetch(scriptURL, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
            .then(() => {
                // Show the shared popup (requirement 3)
                showBookingPopup();

                // Also show the inline success message if it exists
                if (successMessage) {
                    successMessage.style.display = 'flex';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(() => { successMessage.style.display = 'none'; }, 6000);
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

// ===== RETREAT CARD RENDERER =====
// Description is now truncated with CSS ellipsis (3-line clamp).
// The old scroll-on-hover mechanic has been removed (requirement 4).
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
                // z-index:3 on the tag ensures it stays above the scaling image (req 5)
                '<div class="retreat-tag" style="z-index:3;position:absolute;top:1rem;right:1rem">' + retreat.tag + '</div>' +
                '<img src="' + retreat.image + '" alt="' + retreat.name + '" loading="lazy" style="object-position:' + (retreat.imageFocus || 'center') + '">' +
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
                '<div class="retreat-desc-wrap"><p>' + retreat.description + '</p></div>' +
                // Optional cost/donation text (requirement 6)
                (retreat.costEnabled && retreat.costText
                    ? '<div class="retreat-cost-badge">' + retreat.costText + '</div>'
                    : '') +
                '<a href="retreat-signup.html?retreat=' + retreat.id + '" class="btn-secondary">Learn More &amp; Register</a>' +
            '</div>';
        grid.appendChild(card);
        delay = (delay % 4) + 1;
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== LOAD RETREATS FROM JSON =====
async function loadRetreats() {
    try {
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
    handleFormSubmit('stayUpdatedForm',  'stayUpdatedSuccess',  'stayUpdatedError');
    handleFormSubmit('facilityForm',     'facilitySuccess',     'facilityError');
    handleFormSubmit('contactPageForm',  'successMessage',      'errorMessage');
    handleFormSubmit('registrationForm', 'successMessage',      'errorMessage');

    const retreatsData = await loadRetreats();

    const retreatInfo = retreatsData.reduce((map, r) => {
        map[r.id] = { name: r.name, sheetName: r.sheetName };
        return map;
    }, {});

    renderRetreatCards(retreatsData, 'highlightsGrid', 3);
    renderRetreatCards(retreatsData, 'retreatsGrid');

    // ── Retreat signup page ────────────────────────────────────────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const retreatId = urlParams.get('retreat');
    const titleEl   = document.getElementById('retreatTitle');
    const nameInput = document.getElementById('retreatName');
    const sheetInput= document.getElementById('sheetName');

    if (retreatId && retreatInfo[retreatId]) {
        const info = retreatInfo[retreatId];
        if (nameInput)  nameInput.value  = info.name;
        if (sheetInput) sheetInput.value = info.sheetName;
        if (titleEl)    titleEl.textContent = info.name;

        const retreat = retreatsData.find(r => r.id === retreatId);

        // Hero banner image (full-width, no text overlay)
        const heroImgWrap = document.getElementById('retreatHeroImgWrap');
        if (heroImgWrap && retreat) {
            const img = document.getElementById('retreatHeroImg');
            const tag = document.getElementById('retreatHeroTag');
            if (img) {
                img.src   = retreat.image;
                img.alt   = retreat.name;
                img.style.objectPosition = retreat.imageFocus || 'center';
            }
            if (tag) tag.textContent = retreat.tag;
            heroImgWrap.style.display = '';
        }

        // Info block BELOW the banner
        const heroInfo = document.getElementById('retreatHeroInfo');
        if (heroInfo && retreat) {
            const tagEl   = document.getElementById('retreatHeroInfoTag');
            const titleEl2= document.getElementById('retreatHeroInfoTitle');
            const dateEl  = document.getElementById('retreatHeroInfoDate');
            const descEl  = document.getElementById('retreatHeroInfoDesc');
            const costEl  = document.getElementById('retreatCostBadge');

            if (tagEl)   tagEl.textContent   = retreat.tag;
            if (titleEl2)titleEl2.textContent = retreat.name;
            if (dateEl)  dateEl.textContent  = retreat.date;
            if (descEl)  descEl.textContent  = retreat.description;

            // Cost / donation text (requirement 6)
            if (costEl) {
                if (retreat.costEnabled && retreat.costText) {
                    costEl.textContent    = retreat.costText;
                    costEl.style.display  = '';
                } else {
                    costEl.style.display  = 'none';
                }
            }

            heroInfo.style.display = '';
        }
    } else if (titleEl) {
        titleEl.textContent = 'Retreat Registration';
    }
});
