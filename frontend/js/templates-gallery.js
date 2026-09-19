const MOBILE_TEMPLATE_CATEGORIES = [
    { id: 'indian', label: 'Indian Culture' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'romantic', label: 'Romantic' },
    { id: 'luxury', label: 'Regal & Luxe' }
];

function titleFromCategory(id) {
    return id.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
}

function cardCategories(card) {
    return (card.getAttribute('data-category') || '').split(/\s+/).filter(Boolean);
}

function buildMobileTemplateGroup(id, label, cards) {
    const section = document.createElement('section');
    section.className = 'tpl-mobile-group';
    section.setAttribute('aria-label', label);

    const title = document.createElement('h2');
    title.className = 'tpl-mobile-group-title';
    title.textContent = label;

    const carousel = document.createElement('div');
    carousel.className = 'section-carousel';
    carousel.setAttribute('data-section-carousel', '');

    const track = document.createElement('div');
    track.className = 'section-carousel-track';
    track.setAttribute('data-section-track', '');

    cards.forEach(card => {
        const slide = document.createElement('div');
        slide.className = 'section-carousel-slide';
        slide.appendChild(card.cloneNode(true));
        track.appendChild(slide);
    });

    carousel.appendChild(track);
    section.appendChild(title);
    section.appendChild(carousel);
    return section;
}

function initMobileCategoryGroups() {
    const catalog = document.querySelector('.tpl-catalog');
    const mount = document.getElementById('tpl-mobile-groups');
    if (!catalog || !mount || mount.dataset.ready === '1') return;

    const cards = [...catalog.querySelectorAll('.tpl-card')];
    if (!cards.length) return;

    const used = new Set();
    MOBILE_TEMPLATE_CATEGORIES.forEach(({ id, label }) => {
        const matches = cards.filter(card => cardCategories(card).includes(id));
        if (!matches.length) return;
        matches.forEach(card => used.add(card));
        mount.appendChild(buildMobileTemplateGroup(id, label, matches));
    });

    const leftoverGroups = new Map();
    cards.filter(card => !used.has(card)).forEach(card => {
        const id = cardCategories(card)[0] || 'more';
        if (!leftoverGroups.has(id)) leftoverGroups.set(id, []);
        leftoverGroups.get(id).push(card);
    });
    leftoverGroups.forEach((groupCards, id) => {
        mount.appendChild(buildMobileTemplateGroup(id, titleFromCategory(id), groupCards));
    });

    mount.dataset.ready = '1';
}

function initTemplateFilters() {
    const chips = document.querySelectorAll('.tpl-filter');
    const cards = document.querySelectorAll('.tpl-card');
    if (!chips.length || !cards.length) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter') || 'all';
            chips.forEach(c => {
                c.classList.toggle('is-active', c === chip);
                c.setAttribute('aria-selected', String(c === chip));
            });
            cards.forEach(card => {
                const cats = (card.getAttribute('data-category') || '').split(/\s+/);
                const show = filter === 'all' || cats.includes(filter);
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
}

const LIVE_WIDTH = 1280;

function templateSrcFromPreview(preview) {
    const href = preview.getAttribute('href') || '';
    try {
        const slug = new URL(href, window.location.href).searchParams.get('t');
        return slug ? `/templates/${slug}/index.html` : '';
    } catch {
        return '';
    }
}

function fitLiveIframe(preview, iframe) {
    if (!iframe) return;
    const w = preview.clientWidth;
    const h = preview.clientHeight;
    if (!w || !h) return;
    const scale = w / LIVE_WIDTH;
    iframe.style.width = `${LIVE_WIDTH}px`;
    iframe.style.height = `${Math.ceil(h / scale)}px`;
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = '0 0';
}

function hideIframeScrollbars(iframe) {
    try {
        const doc = iframe.contentDocument;
        if (!doc || doc.getElementById('tpl-live-css')) return;
        const style = doc.createElement('style');
        style.id = 'tpl-live-css';
        style.textContent = 'html,body{scrollbar-width:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important}html{overflow-x:hidden}';
        doc.head.appendChild(style);
    } catch {
        /* same-origin only */
    }
}

function scrollRoot(iframe) {
    const doc = iframe.contentDocument;
    if (!doc) return null;
    return doc.scrollingElement || doc.documentElement;
}

function initLivePreviews() {
    const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hoverable) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.tpl-card-preview').forEach(preview => {
        const src = templateSrcFromPreview(preview);
        if (!src) return;

        const state = {
            wrap: null,
            iframe: null,
            raf: 0,
            hold: 0,
            playing: false,
            ready: false
        };

        const stopMotion = () => {
            state.playing = false;
            cancelAnimationFrame(state.raf);
            clearTimeout(state.hold);
            state.raf = 0;
            state.hold = 0;
        };

        const resetScroll = () => {
            try {
                state.iframe?.contentWindow?.scrollTo(0, 0);
            } catch {
                /* ignore */
            }
        };

        const play = () => {
            cancelAnimationFrame(state.raf);
            clearTimeout(state.hold);
            const iframe = state.iframe;
            const win = iframe?.contentWindow;
            const root = iframe && scrollRoot(iframe);
            if (!win || !root) return;
            hideIframeScrollbars(iframe);
            win.scrollTo(0, 0);
            if (reduceMotion) return;

            let last = performance.now();
            const speed = 0.42;

            const tick = now => {
                if (!state.playing) return;
                const dt = Math.min(40, now - last);
                last = now;
                const max = Math.max(0, root.scrollHeight - win.innerHeight);
                if (max < 8) {
                    state.raf = requestAnimationFrame(tick);
                    return;
                }
                const next = win.scrollY + dt * speed;
                if (next >= max) {
                    win.scrollTo(0, max);
                    state.hold = window.setTimeout(() => {
                        if (!state.playing) return;
                        win.scrollTo(0, 0);
                        last = performance.now();
                        state.raf = requestAnimationFrame(tick);
                    }, 700);
                    return;
                }
                win.scrollTo(0, next);
                state.raf = requestAnimationFrame(tick);
            };

            state.raf = requestAnimationFrame(tick);
        };

        const ensure = () => {
            if (state.iframe) {
                fitLiveIframe(preview, state.iframe);
                return;
            }
            const wrap = document.createElement('span');
            wrap.className = 'tpl-live';
            wrap.setAttribute('aria-hidden', 'true');
            const iframe = document.createElement('iframe');
            iframe.title = '';
            iframe.tabIndex = -1;
            iframe.setAttribute('aria-hidden', 'true');
            iframe.addEventListener('load', () => {
                try {
                    if (!iframe.contentWindow.location.pathname.includes('/templates/')) return;
                } catch {
                    return;
                }
                state.ready = true;
                hideIframeScrollbars(iframe);
                fitLiveIframe(preview, iframe);
                preview.classList.add('is-ready');
                if (state.playing) {
                    window.setTimeout(() => {
                        if (state.playing) play();
                    }, 280);
                }
            });
            wrap.appendChild(iframe);
            preview.appendChild(wrap);
            state.wrap = wrap;
            state.iframe = iframe;
            iframe.src = src;
            fitLiveIframe(preview, iframe);
        };

        preview.addEventListener('mouseenter', () => {
            state.playing = true;
            preview.classList.add('is-playing');
            ensure();
            if (state.ready) play();
        });

        preview.addEventListener('mouseleave', () => {
            stopMotion();
            preview.classList.remove('is-playing');
            resetScroll();
        });

        preview.closest('.tpl-card')?.addEventListener('mouseenter', ensure);

        if (typeof ResizeObserver === 'function') {
            new ResizeObserver(() => fitLiveIframe(preview, state.iframe)).observe(preview);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileCategoryGroups();
    initTemplateFilters();
    initLivePreviews();
    initPreviewModal();
});

const TEMPLATE_PALETTES = {
    editorial: [['#f4efe6','Background'],['#1a1814','Ink'],['#6b5344','Primary'],['#c9a96e','Accent']],
    cinematic: [['#070707','Background'],['#f3ece0','Ink'],['#111111','Primary'],['#c9a96e','Accent']],
    'split-screen': [['#efeee9','Background'],['#111111','Ink'],['#2a2a2a','Primary'],['#c9a96e','Accent']],
    scrapbook: [['#e8dcc8','Background'],['#3a2f28','Ink'],['#c45c4a','Primary'],['#fff8e8','Accent']],
    'black-tie': [['#0b0b0b','Background'],['#efe6d4','Ink'],['#c7a45a','Primary'],['#111111','Accent']],
    heritage: [['#f3ead7','Background'],['#3b2418','Ink'],['#8b5a2b','Primary'],['#efe3c9','Accent']],
    architectural: [['#fafafa','Background'],['#111111','Ink'],['#222222','Primary'],['#e8e8e8','Accent']],
    botanical: [['#f3f6ee','Background'],['#2c3a28','Ink'],['#6f8a5c','Primary'],['#cfe6d6','Accent']],
    destination: [['#f6f1e4','Background'],['#1d2a36','Ink'],['#c45c3a','Primary'],['#fffdf6','Accent']],
    typography: [['#ffffff','Background'],['#0e0e0e','Ink'],['#111111','Primary'],['#888888','Accent']],
    celestial: [['#07060a','Background'],['#f3ead8','Ink'],['#e0c48a','Primary'],['#14110c','Accent']],
    festival: [['#111111','Background'],['#ffffff','Ink'],['#ff3d6e','Primary'],['#ffe14a','Accent']],
    vermillion: [['#9d1c28','Background'],['#f8ebe3','Ink'],['#e8c872','Primary'],['#5a1218','Accent']],
    azure: [['#1d5fa8','Background'],['#f4fbff','Ink'],['#0e2a4a','Primary'],['#7eb6e8','Accent']],
    jade: [['#e7f3ea','Background'],['#143d2c','Ink'],['#1f6b4a','Primary'],['#cfe6d6','Accent']],
    marigold: [['#ffe566','Background'],['#5c3b00','Ink'],['#e24c00','Primary'],['#fff8dc','Accent']],
    orchid: [['#f4eef8','Background'],['#2d1248','Ink'],['#6b3fa0','Primary'],['#c9a6e8','Accent']],
    tide: [['#f7f3ea','Background'],['#16345a','Ink'],['#1e4f8a','Primary'],['#e7f1fb','Accent']],
    ridge: [['#f3ead6','Background'],['#2b261c','Ink'],['#c45c28','Primary'],['#4f5348','Accent']],
    'twin-stream': [['#f4e4d4','Background'],['#3a2418','Ink'],['#c45c3a','Primary'],['#2f6f8a','Accent']],
    neon: [['#07060d','Background'],['#f4e9ff','Ink'],['#ff4fd8','Primary'],['#8be7ff','Accent']],
    palms: [['#f7f4ee','Background'],['#1f3328','Ink'],['#3f6b52','Primary'],['#c9a96e','Accent']]
};

function slugFromHref(href) {
    try {
        return new URL(href, window.location.href).searchParams.get('t') || '';
    } catch {
        return '';
    }
}

function initPreviewModal() {
    const modal = document.getElementById('tpl-modal');
    const frame = document.getElementById('tpl-modal-frame');
    const stage = document.getElementById('tpl-modal-stage');
    const screen = document.getElementById('tpl-device-screen');
    if (!modal || !frame || !screen) return;

    const titleEl = document.getElementById('tpl-modal-title');
    const descEl = document.getElementById('tpl-modal-desc');
    const paletteEl = document.getElementById('tpl-modal-palette');
    const chipsEl = document.getElementById('tpl-modal-chips');
    const useEl = document.getElementById('tpl-modal-use');
    const fullEl = document.getElementById('tpl-modal-full');
    let view = 'desktop';
    const VIEWPORTS = {
        desktop: { w: 1280, h: 800 },
        mobile: { w: 390, h: 844 }
    };

    const fitFrame = () => {
        const dest = view === 'mobile' ? VIEWPORTS.mobile : VIEWPORTS.desktop;
        const w = screen.clientWidth;
        const h = screen.clientHeight;
        if (!w || !h) return;
        const scale = Math.min(w / dest.w, h / dest.h);
        frame.style.width = `${dest.w}px`;
        frame.style.height = `${dest.h}px`;
        frame.style.transform = `scale(${scale})`;
        frame.style.left = `${(w - dest.w * scale) / 2}px`;
        frame.style.top = `${(h - dest.h * scale) / 2}px`;
    };

    const setView = next => {
        view = next;
        stage.classList.toggle('is-mobile', view === 'mobile');
        modal.querySelectorAll('[data-view]').forEach(btn => {
            btn.classList.toggle('is-on', btn.dataset.view === view);
        });
        requestAnimationFrame(fitFrame);
        setTimeout(fitFrame, 80);
        setTimeout(fitFrame, 360);
    };

    const close = () => {
        modal.hidden = true;
        document.body.classList.remove('tpl-preview-open');
        document.body.style.overflow = '';
        frame.src = 'about:blank';
    };

    const open = (card, slug) => {
        const name = card.querySelector('.tpl-card-name')?.textContent?.trim() || 'Template';
        const desc = card.querySelector('.tpl-card-desc')?.textContent?.trim() || '';
        const badge = card.querySelector('.tpl-card-badge')?.textContent?.trim();
        const tags = [...card.querySelectorAll('.tpl-card-tags span')].map(s => s.textContent.trim());
        const chips = [...new Set([badge, ...tags].filter(Boolean))];
        titleEl.textContent = name;
        descEl.textContent = desc;
        paletteEl.innerHTML = (TEMPLATE_PALETTES[slug] || []).map(([hex, label]) =>
            `<span class="tpl-modal-swatch"><i style="background:${hex}"></i>${label}</span>`
        ).join('');
        chipsEl.innerHTML = chips.map(t => `<span>${t}</span>`).join('');
        useEl.href = `index.html?template=${encodeURIComponent(name)}#consultation`;
        fullEl.href = `preview.html?t=${encodeURIComponent(slug)}`;
        frame.src = `/templates/${slug}/index.html`;
        modal.hidden = false;
        document.body.classList.add('tpl-preview-open');
        document.body.style.overflow = 'hidden';
        const preferMobile = window.matchMedia('(max-width: 900px)').matches;
        setView(preferMobile ? 'mobile' : 'desktop');
    };

    document.querySelectorAll('.tpl-btn-preview, .tpl-card-preview').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href') || '';
            const slug = slugFromHref(href);
            const card = link.closest('.tpl-card');
            if (!slug || !card) return;
            e.preventDefault();
            open(card, slug);
        });
    });

    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.hidden) close();
    });
    modal.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', () => setView(btn.dataset.view));
    });
    frame.addEventListener('load', fitFrame);
    if (typeof ResizeObserver === 'function') {
        new ResizeObserver(fitFrame).observe(screen);
    }
    window.addEventListener('resize', fitFrame);
}
