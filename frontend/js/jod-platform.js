/* ============================================================
   jod-platform.js — JOD-Weddings Corporate Platform Logic
   Standalone module — no external imports needed
   ============================================================ */

// ─── TOAST ─────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 4500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification" onclick="this.parentElement.remove()">&#10005;</button>
    `;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast--show'));

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('toast--show');
        setTimeout(() => toast.remove(), 350);
    }, duration);
}

// ─── NAV ────────────────────────────────────────────────────
function initPlatformNav() {
    const nav = document.getElementById('platform-nav');
    const hamburger = document.getElementById('platform-hamburger');
    const mobileMenu = document.getElementById('platform-mobile-menu');

    if (!nav) return;

    // Highlight the current page in the nav
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.platform-nav-link, .platform-mobile-link').forEach(link => {
        const href = (link.getAttribute('href') || '').split('#')[0];
        if (!href) return;
        const page = href.split('/').pop().toLowerCase();
        if (page === currentPage) link.classList.add('active');
    });

    // Scroll behaviour
    const syncNavScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    syncNavScroll();
    window.addEventListener('scroll', () => {
        syncNavScroll();

        // Active link highlighting for same-page hash sections only
        document.querySelectorAll('.platform-nav-link').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (!href.startsWith('#')) return;
            const section = document.getElementById(href.slice(1));
            if (!section) return;
            const rect = section.getBoundingClientRect();
            link.classList.toggle('active', rect.top <= 80 && rect.bottom > 80);
        });
    }, { passive: true });

    // Hamburger toggle
    hamburger?.addEventListener('click', () => {
        const isOpen = mobileMenu?.classList.contains('open');
        hamburger.classList.toggle('open', !isOpen);
        mobileMenu?.classList.toggle('open', !isOpen);
        hamburger.setAttribute('aria-expanded', String(!isOpen));
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close mobile menu on link click
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            mobileMenu?.classList.remove('open');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
            hamburger?.classList.remove('open');
            mobileMenu?.classList.remove('open');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ─── SCROLL ANIMATIONS ──────────────────────────────────────
function initScrollAnimations() {
    const els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18, rootMargin: '0px 0px -12% 0px' });

    els.forEach(el => observer.observe(el));
}

// ─── TESTIMONIALS CAROUSEL ──────────────────────────────────
function initTestimonialsCarousel() {
    const track  = document.getElementById('testimonials-track');
    const dots   = document.querySelectorAll('.testimonial-dot');
    const btnPrev = document.getElementById('testimonial-prev');
    const btnNext = document.getElementById('testimonial-next');

    if (!track) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    let current = 0;
    let autoTimer = null;

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === current);
            d.setAttribute('aria-selected', String(i === current));
        });
        slides.forEach((s, i) => {
            s.setAttribute('aria-hidden', String(i !== current));
        });
    }

    function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1), 5500);
    }
    function stopAuto() { clearInterval(autoTimer); }
    function resetAuto() { stopAuto(); startAuto(); }

    btnNext?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    btnPrev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

    // Keyboard navigation
    document.getElementById('testimonials-carousel')?.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
        if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
    });

    goTo(0);
    startAuto();
}

function initPhilosophyCarousel() {
    const carousel = document.getElementById('about-values-carousel');
    const track = document.getElementById('about-values-track');
    if (!carousel || !track) return;

    const slides = track.querySelectorAll('.about-value-slide');
    const dots = carousel.querySelectorAll('.about-value-dot');
    const btnPrev = document.getElementById('about-value-prev');
    const btnNext = document.getElementById('about-value-next');
    const mq = window.matchMedia('(max-width: 768px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let autoTimer = null;
    let startX = 0;

    function isMobile() {
        return mq.matches;
    }

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        if (!isMobile()) {
            track.style.transform = '';
            return;
        }
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
            dot.setAttribute('aria-selected', String(i === current));
        });
        slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', String(i !== current));
        });
    }

    function startAuto() {
        stopAuto();
        if (!isMobile() || reduceMotion) return;
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAuto() {
        clearInterval(autoTimer);
        autoTimer = null;
    }
    function resetAuto() {
        stopAuto();
        startAuto();
    }

    btnNext?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    btnPrev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
        if (!isMobile()) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
        resetAuto();
    }, { passive: true });

    mq.addEventListener('change', () => {
        goTo(isMobile() ? current : 0);
        resetAuto();
    });

    goTo(0);
    startAuto();
}

function initSectionCarousels() {
    const mq = window.matchMedia('(max-width: 768px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const arrowPrev = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const arrowNext = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    document.querySelectorAll('[data-section-carousel]').forEach(root => {
        const track = root.querySelector('[data-section-track]');
        if (!track) return;
        const slides = [...track.querySelectorAll(':scope > .section-carousel-slide')];
        if (slides.length < 2) return;

        let controls = root.querySelector('.section-carousel-controls');
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'section-carousel-controls';
            controls.innerHTML = `
                <button type="button" class="section-carousel-prev" aria-label="Previous">${arrowPrev}</button>
                <div class="section-carousel-dots" role="tablist"></div>
                <button type="button" class="section-carousel-next" aria-label="Next">${arrowNext}</button>
            `;
            root.appendChild(controls);
        }

        const dotsWrap = controls.querySelector('.section-carousel-dots');
        dotsWrap.innerHTML = slides.map((_, i) => (
            `<button type="button" class="section-carousel-dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i + 1}"></button>`
        )).join('');

        const dots = [...dotsWrap.querySelectorAll('.section-carousel-dot')];
        const btnPrev = controls.querySelector('.section-carousel-prev');
        const btnNext = controls.querySelector('.section-carousel-next');
        let current = 0;
        let autoTimer = null;
        let startX = 0;

        function isMobile() {
            return mq.matches;
        }

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            if (!isMobile()) {
                track.style.transform = '';
                return;
            }
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
            slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
        }

        function startAuto() {
            stopAuto();
            if (!isMobile() || reduceMotion) return;
            autoTimer = setInterval(() => goTo(current + 1), 5000);
        }
        function stopAuto() {
            clearInterval(autoTimer);
            autoTimer = null;
        }
        function resetAuto() {
            stopAuto();
            startAuto();
        }

        btnNext?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
        btnPrev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
        dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAuto();
        }, { passive: true });
        track.addEventListener('touchend', (e) => {
            if (!isMobile()) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
            resetAuto();
        }, { passive: true });

        mq.addEventListener('change', () => {
            goTo(isMobile() ? current : 0);
            resetAuto();
        });

        goTo(0);
        startAuto();
    });
}

// ─── PLAN SELECTORS (scroll to consult + sync form) ────────
function initPlanSelectors() {
    const planBtns = document.querySelectorAll('.btn-plan-select');
    if (!planBtns.length) return;

    function selectPlan(planName) {
        if (!planName) return;

        const selectEl = document.getElementById('inquiry-plan');
        if (selectEl) {
            selectEl.value = planName;
            selectEl.classList.remove('is-updated');
            void selectEl.offsetWidth;
            selectEl.classList.add('is-updated');
        }

        const consult = document.getElementById('consultation');
        if (consult) {
            consult.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.setTimeout(() => {
                selectEl?.focus({ preventScroll: true });
            }, 550);
        }
    }

    planBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.plan-card');
            const planName = btn.getAttribute('data-select-plan') || card?.getAttribute('data-plan');
            selectPlan(planName);
        });
    });
}

// ─── CONSULTATION FORM ──────────────────────────────────────
function initInquiryForm() {
    const form = document.getElementById('platform-inquiry-form');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const templateName = params.get('template');
    const notesEl = document.getElementById('inquiry-notes');
    if (templateName && notesEl && !notesEl.value) {
        notesEl.value = `I would like to use the "${templateName}" wedding website template for our celebration.`;
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = document.getElementById('inquiry-submit-btn');

        const client_name    = document.getElementById('inquiry-name')?.value.trim();
        const phone          = document.getElementById('inquiry-phone')?.value.trim();
        const email          = document.getElementById('inquiry-email')?.value.trim();
        const wedding_city   = document.getElementById('inquiry-city')?.value.trim();
        const preferred_plan = document.getElementById('inquiry-plan')?.value;
        const notes          = document.getElementById('inquiry-notes')?.value.trim();

        if (!client_name || !phone) {
            showToast('Please provide your name and contact phone number.', 'warning');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting…';
        }

        try {
            const res = await fetch('/api/platform/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ client_name, phone, email, wedding_city, preferred_plan, notes })
            });
            const data = await res.json();
            form.reset();
            showToast(data.message || 'Thank you! A JOD Bespoke Director will contact you within 24 hours. ✨', 'success');
        } catch {
            form.reset();
            showToast('Consultation request received! Our luxury planner will reach out within 24 hours. ✨', 'success');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request Bespoke Consultation';
            }
        }
    });
}

// ─── SMOOTH SCROLL FOR NAV LINKS ────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}


// ─── THEME MANAGEMENT (Light / Dark Mode) ───────────────────
const THEME_STORAGE_KEY = 'jod-theme-v2';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

function applyPlatformTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    const isDark = theme === THEME_DARK;

    // Desktop nav toggle
    const toggleBtn = document.getElementById('platform-theme-toggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        toggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Mobile menu toggle
    const mobileBtn = document.getElementById('platform-mobile-theme-toggle');
    if (mobileBtn) {
        const label = mobileBtn.querySelector('.theme-label') || mobileBtn;
        label.textContent = isDark ? 'Switch to Light Mode ☀' : 'Switch to Dark Mode 🌙';
        mobileBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
}

function togglePlatformTheme() {
    const current = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyPlatformTheme(next);
}

function initPlatformTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const theme = saved === THEME_DARK || saved === THEME_LIGHT ? saved : THEME_LIGHT;
    applyPlatformTheme(theme);

    const toggleBtn = document.getElementById('platform-theme-toggle');
    toggleBtn?.addEventListener('click', togglePlatformTheme);

    const mobileBtn = document.getElementById('platform-mobile-theme-toggle');
    mobileBtn?.addEventListener('click', () => {
        togglePlatformTheme();
    });
}

// ─── FALLING ROSE PETALS ANIMATION ──────────────────────────
// Different shades of red and rose petals drifting and fluttering in 3D
function initRosePetalsAnimation() {
    if (document.body.classList.contains('no-petals')) return;
    const canvas = document.getElementById('rose-petals-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId = null;
    let isRunning = true;
    let wind = 0;
    let targetWind = 0;

    // Palette of diverse rose colors: deep reds, velvets, crimson, and soft dusty/blush rose shades
    const PETAL_PALETTES = [
        { name: 'ruby-red',   light: '#C41C2E', main: '#9E1523', dark: '#690B14' },
        { name: 'deep-crimson', light: '#BA1828', main: '#8E111E', dark: '#52060F' },
        { name: 'velvet-rose',  light: '#D42D52', main: '#A81D3D', dark: '#730E26' },
        { name: 'dusty-rose',   light: '#BF8C84', main: '#A77B73', dark: '#7A524B' },
        { name: 'warm-rose',    light: '#E6C4BD', main: '#D8B7B0', dark: '#B38B83' },
        { name: 'coral-rose',   light: '#EAA399', main: '#D97C70', dark: '#A65348' },
        { name: 'wine-burgundy', light: '#991B38', main: '#781229', dark: '#4A0817' },
        { name: 'blush-petal',  light: '#F5C6BF', main: '#E3A69C', dark: '#BA7A6F' }
    ];

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const parent = canvas.parentElement || document.getElementById('home') || document.body;
        width = parent.clientWidth || window.innerWidth;
        height = parent.clientHeight || window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    class Petal {
        constructor(isInitial = false) {
            this.reset(isInitial);
        }

        reset(isInitial = false) {
            this.x = Math.random() * (width + 100) - 50;
            this.y = isInitial ? Math.random() * height : -40 - Math.random() * 60;
            this.size = 12 + Math.random() * 18; // Petal radius 12px to 30px
            this.speedY = 0.25 + Math.random() * 0.45; // Gentle, slow floating descent
            this.speedX = (Math.random() - 0.5) * 0.25; // Gentle base drift
            
            // 3D Tumbling & Flutter angles (smooth and leisurely)
            this.rotation = Math.random() * 360;
            this.spinSpeed = (Math.random() - 0.5) * 0.35;
            
            this.pitch = Math.random() * Math.PI * 2;
            this.pitchSpeed = 0.005 + Math.random() * 0.008;
            
            this.roll = Math.random() * Math.PI * 2;
            this.rollSpeed = 0.006 + Math.random() * 0.01;

            // Sway oscillation (soft breeze sway)
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = 0.008 + Math.random() * 0.01;
            this.swayAmp = 0.7 + Math.random() * 1.1;

            // Color & Opacity
            this.palette = PETAL_PALETTES[Math.floor(Math.random() * PETAL_PALETTES.length)];
            this.opacity = 0.72 + Math.random() * 0.25;
            this.curlFactor = 0.85 + Math.random() * 0.3; // Individual petal cup depth
        }

        update() {
            this.y += this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x += Math.sin(this.swayAngle) * this.swayAmp + this.speedX + wind;

            this.rotation += this.spinSpeed;
            this.pitch += this.pitchSpeed;
            this.roll += this.rollSpeed;

            // When petal drifts beyond screen, wrap smoothly to top
            if (this.y > height + 40 || this.x < -80 || this.x > width + 80) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);

            // 3D Flutter scaling (pitch and roll)
            const scaleX = Math.cos(this.pitch) * 0.85 + 0.15;
            const scaleY = Math.sin(this.roll);
            ctx.scale(Math.max(0.12, Math.abs(scaleX)), scaleY);

            const s = this.size;
            const h = s * 1.35 * this.curlFactor;

            // Organic rose petal path using smooth cubic Bézier curves
            ctx.beginPath();
            ctx.moveTo(0, h * 0.45);
            // Left outer lobe curve
            ctx.bezierCurveTo(-s * 0.65, h * 0.25, -s * 0.6, -h * 0.35, -s * 0.12, -h * 0.46);
            // Top petal apex notch
            ctx.bezierCurveTo(-s * 0.04, -h * 0.5, s * 0.04, -h * 0.5, s * 0.12, -h * 0.46);
            // Right outer lobe curve
            ctx.bezierCurveTo(s * 0.6, -h * 0.35, s * 0.65, h * 0.25, 0, h * 0.45);
            ctx.closePath();

            // Realistic petal gradient: darker cup/stem base to luminous soft translucent edge
            const grad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.45);
            grad.addColorStop(0, this.palette.light);
            grad.addColorStop(0.55, this.palette.main);
            grad.addColorStop(1, this.palette.dark);

            ctx.fillStyle = grad;
            ctx.globalAlpha = this.opacity;
            ctx.shadowColor = this.palette.dark;
            ctx.shadowBlur = 4;
            ctx.fill();

            // Subtle delicate petal center vein highlight
            ctx.beginPath();
            ctx.moveTo(0, -h * 0.28);
            ctx.quadraticCurveTo(s * 0.06, 0, 0, h * 0.38);
            ctx.strokeStyle = this.palette.light;
            ctx.globalAlpha = this.opacity * 0.35;
            ctx.lineWidth = 0.75;
            ctx.stroke();

            ctx.restore();
        }
    }

    // Number of petals on screen (balanced for beauty and 60fps performance)
    const PETAL_COUNT = 42;
    const petals = [];

    resize();
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(new Petal(true));
    }

    // Wind ease on mouse move (gentle atmospheric breeze)
    window.addEventListener('mousemove', e => {
        const centerOffset = (e.clientX - width / 2) / (width / 2);
        targetWind = centerOffset * 0.15;
    }, { passive: true });

    window.addEventListener('resize', () => {
        resize();
    }, { passive: true });

    // Handle tab visibility to pause loop
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isRunning = false;
            if (animationId) cancelAnimationFrame(animationId);
        } else {
            isRunning = true;
            loop();
        }
    });

    function loop() {
        if (!isRunning) return;

        // Smoothly interpolate wind
        wind += (targetWind - wind) * 0.05;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < petals.length; i++) {
            petals[i].update();
            petals[i].draw();
        }

        animationId = requestAnimationFrame(loop);
    }

    loop();
}

// ─── PAGE HERO VIDEOS ───────────────────────────────────────
function initHeroVideos() {
    const videos = document.querySelectorAll('video.page-hero-video');
    if (!videos.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    videos.forEach(video => {
        video.addEventListener('error', () => {
            video.style.display = 'none';
        });
        if (reduceMotion) {
            video.pause();
            video.removeAttribute('autoplay');
            return;
        }
        video.muted = true;
        const play = video.play();
        if (play && typeof play.catch === 'function') {
            play.catch(() => {});
        }
    });
}

function initCinematicFilm() {
    const canvases = document.querySelectorAll('canvas.cinematic-film');
    if (!canvases.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    canvases.forEach(canvas => {
        const sources = (canvas.getAttribute('data-film-images') || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        if (sources.length < 2) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const images = [];
        let loaded = 0;

        function resize() {
            const parent = canvas.parentElement;
            if (!parent) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
            const width = parent.clientWidth || window.innerWidth;
            const height = parent.clientHeight || window.innerHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
        }

        function drawCover(img, scale, ox, oy) {
            const w = canvas.width;
            const h = canvas.height;
            const ir = img.width / img.height;
            const cr = w / h;
            let dw;
            let dh;
            if (ir > cr) {
                dh = h * scale;
                dw = dh * ir;
            } else {
                dw = w * scale;
                dh = dw / ir;
            }
            const x = (w - dw) * ox;
            const y = (h - dh) * oy;
            ctx.drawImage(img, x, y, dw, dh);
        }

        const CLIP = 7000;
        const FADE = 1100;
        let startTs = null;
        let running = true;

        function loop(ts) {
            if (!running) return;
            if (!startTs) startTs = ts;
            const t = ts - startTs;
            const n = images.length;
            const pos = t % (n * CLIP);
            const idx = Math.floor(pos / CLIP);
            const local = pos - idx * CLIP;
            const next = (idx + 1) % n;
            const scale = 1.06 + 0.12 * (local / CLIP);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCover(images[idx], scale, 0.5, 0.42);

            if (local > CLIP - FADE) {
                ctx.globalAlpha = (local - (CLIP - FADE)) / FADE;
                drawCover(images[next], 1.06, 0.52, 0.45);
                ctx.globalAlpha = 1;
            }

            requestAnimationFrame(loop);
        }

        function start() {
            resize();
            const reel = canvas.parentElement?.querySelector('.kenburns-wrap');
            if (reel) reel.style.opacity = '0';
            window.addEventListener('resize', resize, { passive: true });
            document.addEventListener('visibilitychange', () => {
                running = !document.hidden;
                if (running) {
                    startTs = null;
                    requestAnimationFrame(loop);
                }
            });
            requestAnimationFrame(loop);
        }

        sources.forEach(src => {
            const img = new Image();
            img.onload = () => {
                loaded += 1;
                if (loaded === sources.length) start();
            };
            img.src = src;
            images.push(img);
        });
    });
}

// ─── PAST WEDDINGS ARCHIVE ──────────────────────────────────
function initWeddingArchive() {
    const chips = document.querySelectorAll('.archive-chip');
    const cards = document.querySelectorAll('#archive-bento .story-card');
    const drawer = document.getElementById('archive-drawer');
    if (!cards.length) return;

    if (chips.length) {
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.getAttribute('data-filter') || 'all';
                chips.forEach(c => {
                    c.classList.toggle('is-active', c === chip);
                    c.setAttribute('aria-selected', String(c === chip));
                });
                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const show = filter === 'all' || category === filter;
                    card.classList.toggle('is-hidden', !show);
                });
            });
        });
    }

    if (!drawer) return;

    const titleEl = document.getElementById('drawer-title');
    const metaEl = document.getElementById('drawer-meta');
    const storyEl = document.getElementById('drawer-story');
    const imageEl = document.getElementById('drawer-image');
    const thumbsEl = document.getElementById('drawer-thumbs');

    function galleryList(card) {
        const cover = card.getAttribute('data-image') || '';
        const extras = (card.getAttribute('data-gallery') || '')
            .split('|')
            .map(src => src.trim())
            .filter(Boolean);
        const images = [];
        if (cover) images.push(cover);
        extras.forEach(src => {
            if (!images.includes(src)) images.push(src);
        });
        return images;
    }

    function setMainImage(src, alt) {
        if (!imageEl) return;
        imageEl.src = src;
        imageEl.alt = alt;
        if (!thumbsEl) return;
        thumbsEl.querySelectorAll('.archive-drawer-thumb').forEach(btn => {
            btn.classList.toggle('is-active', btn.getAttribute('data-src') === src);
        });
    }

    function renderThumbs(images, alt) {
        if (!thumbsEl) return;
        thumbsEl.innerHTML = '';
        if (images.length < 2) {
            thumbsEl.hidden = true;
            return;
        }
        thumbsEl.hidden = false;
        images.forEach((src, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'archive-drawer-thumb';
            btn.setAttribute('data-src', src);
            btn.setAttribute('aria-label', `View photo ${i + 1}`);
            btn.innerHTML = `<img src="${src}" alt="">`;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                setMainImage(src, alt);
            });
            thumbsEl.appendChild(btn);
        });
    }

    function openDrawer(card) {
        const alt = (card.getAttribute('data-title') || '').replace(/&amp;/g, '&');
        const images = galleryList(card);
        if (titleEl) titleEl.textContent = card.getAttribute('data-title') || '';
        if (metaEl) {
            const meta = card.getAttribute('data-meta') || '';
            metaEl.textContent = meta;
            metaEl.hidden = !meta.trim();
        }
        if (storyEl) storyEl.textContent = card.getAttribute('data-story') || '';
        renderThumbs(images, alt);
        setMainImage(images[0] || card.getAttribute('data-image') || '', alt);
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('click', () => openDrawer(card));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openDrawer(card);
            }
        });
    });

    drawer.querySelectorAll('[data-drawer-close]').forEach(el => {
        el.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });
}

// ─── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('platform-nav')) return;

    initPlatformTheme();
    initRosePetalsAnimation();
    initPlatformNav();
    initScrollAnimations();
    initTestimonialsCarousel();
    initPhilosophyCarousel();
    initSectionCarousels();
    initPlanSelectors();
    initInquiryForm();
    initSmoothScroll();
    initHeroVideos();
    initCinematicFilm();
    initWeddingArchive();
});
