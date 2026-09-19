/* ============================================================
   navigation.js — Sticky nav, scroll behavior, mobile menu
   ============================================================ */

export function initNavigation() {
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile-menu');
    const mobileLinks = mobileMenu?.querySelectorAll('.mobile-nav-link');

    if (!nav) return;

    // ─── SCROLL BEHAVIOR ────────────────────────────────────
    let lastScroll = 0;
    let ticking = false;

    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                nav.classList.toggle('scrolled', scrollY > 60);

                // Update active nav link
                updateActiveLink();

                lastScroll = scrollY;
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ─── ACTIVE LINK ─────────────────────────────────────────
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const scrollPos = window.scrollY + 120;

        let current = '';
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    // ─── SMOOTH SCROLL ───────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            closeMenu();
            const navH = nav.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ─── MOBILE HAMBURGER ─────────────────────────────────────
    function openMenu() {
        hamburger?.classList.add('open');
        mobileMenu?.classList.add('open');
        document.body.classList.add('no-scroll');
        hamburger?.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        hamburger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
        document.body.classList.remove('no-scroll');
        hamburger?.setAttribute('aria-expanded', 'false');
    }

    hamburger?.addEventListener('click', () => {
        const isOpen = mobileMenu?.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
    });

    mobileLinks?.forEach(link => link.addEventListener('click', closeMenu));

    // Close menu on escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu();
    });

    // Close on outside click
    mobileMenu?.addEventListener('click', e => {
        if (e.target === mobileMenu) closeMenu();
    });
}
