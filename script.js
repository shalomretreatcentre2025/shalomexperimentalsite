// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-menu a').forEach(l => l.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// ===== BOOKING SUCCESS POPUP =====
(function createBookingPopup() {
    const popup = document.createElement('div');
    popup.id = 'bookingPopup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
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
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hideBookingPopup(); });
})();

function showBookingPopup() {
    const p = document.getElementById('bookingPopup');
    if (p) { p.style.display = 'flex'; document.body.style.overflow = 'hidden'; document.getElementById('bookingPopupClose').focus(); }
}
function hideBookingPopup() {
    const p = document.getElementById('bookingPopup');
    if (p) { p.style.display = 'none'; document.body.style.overflow = ''; }
}

// ===== GOOGLE SHEETS =====
const scriptURL = 'https://script.google.com/macros/s/AKfycbz3bWasgGFisq-HXqzneAX9Et6m7rHTARl3SNBAXFLDCyZHYdt98_6RG_jbxx0YCQjzaQ/exec';

function handleFormSubmit(formId, successId, errorId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const successMsg = document.getElementById(successId);
    const errorMsg   = document.getElementById(errorId);

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn  = form.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = 'Sending…'; btn.disabled = true;
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg)   errorMsg.style.display   = 'none';

        fetch(scriptURL, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
            .then(() => {
                showBookingPopup();
                if (successMsg) {
                    successMsg.style.display = 'flex';
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
                }
                form.reset();
            })
            .catch(() => {
                if (errorMsg) { errorMsg.style.display = 'flex'; errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
            })
            .finally(() => { btn.textContent = orig; btn.disabled = false; });
    });
}

// ===== RETREAT CARD RENDERER =====
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
                '<div class="retreat-tag" style="z-index:3;position:absolute;top:1rem;right:1rem">' + retreat.tag + '</div>' +
                '<img src="' + retreat.image + '" alt="' + retreat.name + '" loading="lazy" style="object-position:' + (retreat.imageFocus || 'center') + '">' +
            '</div>' +
            '<div class="retreat-content">' +
                '<h3>' + retreat.name + '</h3>' +
                '<div class="retreat-date">' +
                    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' +
                    retreat.date +
                '</div>' +
                '<div class="retreat-desc-wrap"><p>' + retreat.description.replace(/\n/g, '<br>') + '</p></div>' +
                (retreat.costEnabled && retreat.costText ? '<div class="retreat-cost-badge">' + retreat.costText + '</div>' : '') +
                '<a href="retreat-signup.html?retreat=' + retreat.id + '" class="btn-secondary">Learn More &amp; Register</a>' +
            '</div>';
        grid.appendChild(card);
        delay = (delay % 4) + 1;
    });
}

// ===== DATA LOADERS =====
async function loadRetreats() {
    try {
        const res = await fetch('retreats.json?v=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
    } catch (e) {
        console.warn('Could not load retreats.json', e);
        return [];
    }
}

async function loadSiteConfig() {
    try {
        const res = await fetch('site-config.json?v=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
    } catch (e) {
        console.warn('Could not load site-config.json', e);
        return {};
    }
}

// ===== NOTICE BANNER =====
function applyNoticeBanner(cfg) {
    const el = document.getElementById('noticeBanner');
    if (!el) return;
    if (cfg.noticeEnabled && cfg.noticeText && cfg.noticeText.trim()) {
        el.innerHTML =
            '<div class="notice-banner-inner">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
                '<span>' + cfg.noticeText + '</span>' +
            '</div>';
        el.style.display = '';
    } else {
        el.style.display = 'none';
    }
}

// ===== FACILITIES HERO IMAGE =====
function applyFacilitiesHero(cfg) {
    const banner   = document.getElementById('facilitiesHeroBanner');
    const fallback = document.getElementById('facilitiesHeroFallback');
    const img      = document.getElementById('facilitiesHeroImg');
    if (!banner || !fallback) return;

    if (cfg.facilitiesHeroImage && cfg.facilitiesHeroImage.trim()) {
        img.src = cfg.facilitiesHeroImage.trim();
        banner.style.display   = '';
        fallback.style.display = 'none';
    } else {
        banner.style.display   = 'none';
        fallback.style.display = '';
    }
}

// ===== FACILITIES CARD IMAGES =====
function applyFacilitiesCardImages(cfg) {
    const images = cfg.facilitiesCardImages || [];
    document.querySelectorAll('.facility-card[data-card-index]').forEach(card => {
        const idx    = parseInt(card.getAttribute('data-card-index'), 10);
        const url    = images[idx] && images[idx].trim();
        const imgWrap = card.querySelector('.facility-card-img');
        const imgEl   = imgWrap && imgWrap.querySelector('img');
        if (imgWrap && imgEl && url) {
            imgEl.src = url;
            imgWrap.style.display = '';
        } else if (imgWrap) {
            imgWrap.style.display = 'none';
        }
    });
}

// ===== FACILITIES CAROUSEL =====
function buildCarousel(cfg) {
    const wrap  = document.getElementById('facilitiesCarouselWrap');
    const track = document.getElementById('carouselTrack');
    const dots  = document.getElementById('carouselDots');
    const prev  = document.getElementById('carouselPrev');
    const next  = document.getElementById('carouselNext');
    if (!wrap || !track) return;

    const images = (cfg.facilitiesCarousel || []).filter(u => u && u.trim());
    if (images.length === 0) { wrap.style.display = 'none'; return; }

    wrap.style.display = '';
    track.innerHTML = '';
    if (dots) dots.innerHTML = '';

    images.forEach((url, i) => {
        // Each slide is a link (href = the image URL itself)
        const slide = document.createElement('a');
        slide.href   = url;
        slide.target = '_blank';
        slide.rel    = 'noopener';
        slide.className = 'carousel-slide' + (i === 0 ? ' active' : '');
        slide.setAttribute('aria-label', 'Facilities photo ' + (i + 1));
        const img  = document.createElement('img');
        img.src    = url;
        img.alt    = 'Shalom facilities photo ' + (i + 1);
        img.loading = 'lazy';
        slide.appendChild(img);
        track.appendChild(slide);

        if (dots) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
            dot.addEventListener('click', () => goToSlide(i));
            dots.appendChild(dot);
        }
    });

    let current = 0;
    let autoTimer = null;

    function goToSlide(n) {
        const slides = track.querySelectorAll('.carousel-slide');
        const dotEls = dots ? dots.querySelectorAll('.carousel-dot') : [];
        slides[current].classList.remove('active');
        if (dotEls[current]) dotEls[current].classList.remove('active');
        current = (n + images.length) % images.length;
        slides[current].classList.add('active');
        if (dotEls[current]) dotEls[current].classList.add('active');
        resetAuto();
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goToSlide(current + 1), 5000);
    }

    if (prev) prev.addEventListener('click', () => goToSlide(current - 1));
    if (next) next.addEventListener('click', () => goToSlide(current + 1));

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goToSlide(diff > 0 ? current + 1 : current - 1);
    });

    resetAuto();
}

// ===== SCROLL REVEAL (IntersectionObserver) =====
function initScrollReveal() {
    const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
                observer.unobserve(e.target);
            }
        });
    }, opts);
    document.querySelectorAll('.reveal, .reveal-up').forEach(el => observer.observe(el));
}

// ===== FACILITY ENQUIRY FORM TOGGLE =====
function initFacilityEnquiry() {
    const btn  = document.getElementById('btnFacilityEnquire');
    const wrap = document.getElementById('facilityEnquiryWrap');
    if (!btn || !wrap) return;

    // Wire up checkbox → FormData aggregation before submit
    const form = document.getElementById('facilityEnquiryForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const orig = submitBtn.textContent;
            submitBtn.textContent = 'Sending…'; submitBtn.disabled = true;

            // Collect checked facilities into one field
            const checked = Array.from(form.querySelectorAll('input[name="facilities"]:checked'))
                                 .map(c => c.value);
            const fd = new FormData(form);
            fd.delete('facilities');
            fd.append('facilities', checked.join(', ') || 'Not specified');

            const successEl = document.getElementById('facilityEnquirySuccess');
            const errorEl   = document.getElementById('facilityEnquiryError');
            if (successEl) successEl.style.display = 'none';
            if (errorEl)   errorEl.style.display   = 'none';

            const scriptURL = 'https://script.google.com/macros/s/AKfycbz3bWasgGFisq-HXqzneAX9Et6m7rHTARl3SNBAXFLDCyZHYdt98_6RG_jbxx0YCQjzaQ/exec';
            fetch(scriptURL, { method: 'POST', body: fd, mode: 'no-cors' })
                .then(() => {
                    if (successEl) successEl.style.display = 'flex';
                    form.reset();
                })
                .catch(() => {
                    if (errorEl) errorEl.style.display = 'flex';
                })
                .finally(() => { submitBtn.textContent = orig; submitBtn.disabled = false; });
        });
    }

    btn.addEventListener('click', () => {
        const open = wrap.classList.toggle('open');
        btn.textContent = open ? 'Close Form ✕' : 'Enquire Now';
        if (open) {
            wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            // Update button icon
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close Form';
        } else {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Enquire Now';
        }
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== INITIALISE =====
document.addEventListener('DOMContentLoaded', async () => {
    initScrollReveal();
    initFacilityEnquiry();

    handleFormSubmit('stayUpdatedForm',  'stayUpdatedSuccess',  'stayUpdatedError');
    handleFormSubmit('facilityForm',     'facilitySuccess',     'facilityError');
    handleFormSubmit('contactPageForm',  'successMessage',      'errorMessage');
    handleFormSubmit('registrationForm', 'successMessage',      'errorMessage');

    // Load both data files in parallel
    const [retreatsData, siteConfig] = await Promise.all([loadRetreats(), loadSiteConfig()]);

    // Apply site-wide config
    applyNoticeBanner(siteConfig);
    applyFacilitiesHero(siteConfig);
    applyFacilitiesCardImages(siteConfig);
    buildCarousel(siteConfig);

    // Render retreat cards
    const retreatInfo = retreatsData.reduce((map, r) => {
        map[r.id] = { name: r.name, sheetName: r.sheetName };
        return map;
    }, {});
    renderRetreatCards(retreatsData, 'highlightsGrid', 3);
    renderRetreatCards(retreatsData, 'retreatsGrid');

    // ── Retreat signup page ──────────────────────────────────────────────────
    const urlParams  = new URLSearchParams(window.location.search);
    const retreatId  = urlParams.get('retreat');
    const titleEl    = document.getElementById('retreatTitle');
    const nameInput  = document.getElementById('retreatName');
    const sheetInput = document.getElementById('sheetName');

    if (retreatId && retreatInfo[retreatId]) {
        const info = retreatInfo[retreatId];
        if (nameInput)  nameInput.value    = info.name;
        if (sheetInput) sheetInput.value   = info.sheetName;
        if (titleEl)    titleEl.textContent = info.name;

        const retreat = retreatsData.find(r => r.id === retreatId);

        const heroImgWrap = document.getElementById('retreatHeroImgWrap');
        if (heroImgWrap && retreat) {
            const img = document.getElementById('retreatHeroImg');
            const tag = document.getElementById('retreatHeroTag');
            if (img) {
                img.src = retreat.image;
                img.alt = retreat.name;
                // Always show from the very top of the image on the signup banner (req 3)
                img.style.objectPosition = 'top';
            }
            if (tag) tag.textContent = retreat.tag;
            heroImgWrap.style.display = '';
        }

        const heroInfo = document.getElementById('retreatHeroInfo');
        if (heroInfo && retreat) {
            const tagEl    = document.getElementById('retreatHeroInfoTag');
            const titleEl2 = document.getElementById('retreatHeroInfoTitle');
            const dateEl   = document.getElementById('retreatHeroInfoDate');
            const descEl   = document.getElementById('retreatHeroInfoDesc');
            const costEl   = document.getElementById('retreatCostBadge');
            if (tagEl)    tagEl.textContent    = retreat.tag;
            if (titleEl2) titleEl2.textContent  = retreat.name;
            if (dateEl)   dateEl.textContent    = retreat.date;
            if (descEl)   descEl.innerHTML      = retreat.description.replace(/\n/g, '<br>');
            if (costEl) {
                if (retreat.costEnabled && retreat.costText) {
                    costEl.textContent   = retreat.costText;
                    costEl.style.display = '';
                } else {
                    costEl.style.display = 'none';
                }
            }
            heroInfo.style.display = '';
        }
    } else if (titleEl) {
        titleEl.textContent = 'Retreat Registration';
    }
});
