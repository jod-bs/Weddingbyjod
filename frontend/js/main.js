/* ============================================================
   main.js — Main application orchestrator & toast provider
   ============================================================ */

import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCountdown } from './countdown.js';
import { initStory } from './story.js';
import { initEvents } from './events.js';
import { initRsvp } from './rsvp.js';
import { initSeating } from './seating.js';
import { initWeddingDay } from './weddingday.js';
import { initGallery } from './gallery.js';
import { initGuestbook } from './guestbook.js';
import { initCityGuide } from './cityguide.js';
import { initConcierge } from './concierge.js';

// ─── GLOBAL TOAST NOTIFICATION ──────────────────────────────
export function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let icon = 'ℹ️';
    if (type === 'success') icon = '✨';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">${icon}</span>
        <span class="toast-text">${escapeHtml(message)}</span>
        <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const removeToast = () => {
        toast.classList.add('toast-exit');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.toast-close')?.addEventListener('click', removeToast);
    container.appendChild(toast);

    // Auto-dismiss
    setTimeout(removeToast, 4500);
}

// ─── FAQ ACCORDION HANDLER ──────────────────────────────────
function initFaq() {
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            if (!item) return;

            const isOpen = item.classList.contains('open');

            // Optional: close other open items in the same list
            const parent = item.parentElement;
            if (parent) {
                parent.querySelectorAll('.accordion-item.open').forEach(openItem => {
                    if (openItem !== item) {
                        openItem.classList.remove('open');
                        openItem.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
                    }
                });
            }

            if (isOpen) {
                item.classList.remove('open');
                header.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ─── HERO IMAGE SMOOTH REVEAL ───────────────────────────────
function initHero() {
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
        if (heroImg.complete) {
            heroImg.classList.add('loaded');
        } else {
            heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
        }
    }
}

// ─── INITIALIZATION ON DOM READY ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core utilities
    initTheme();
    initNavigation();
    initHero();

    // 2. Timeline & Content
    initCountdown();
    initStory();
    initEvents();

    // 3. Guest Features
    initRsvp();
    initSeating();
    initWeddingDay();

    // 4. Interactive Experiences
    initGallery();
    initGuestbook();
    initCityGuide();
    initFaq();
    initConcierge();

    // 5. Custom event for newly rendered dynamic elements
    window.addEventListener('jod:refresh-reveal', () => {
        initStory();
    });
});

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
