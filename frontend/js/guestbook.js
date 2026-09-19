/* ============================================================
   guestbook.js — Digital guestbook message wall & submission
   ============================================================ */

import { guestbookApi } from './api.js';
import { showToast } from './main.js';

const DEMO_MESSAGES = [
    {
        id: 1,
        author_name: 'Uncle Ramesh & Rajeshwari',
        relation: "Groom's Family",
        message: 'Wishing dear Anadaraman and Prathiksha Sri a lifetime of boundless joy, health, and laughter. May your bond grow stronger with each passing dawn!',
        created_at: '2026-09-12T14:30:00Z'
    },
    {
        id: 2,
        author_name: 'Ananya & Ashwin',
        relation: "Bride's Best Friend",
        message: 'From college library study breaks to walking down the aisle — Prathiksha Sri, you look utterly radiant! Anadaraman, welcome to our crazy family. Love you both to pieces!',
        created_at: '2026-09-12T16:15:00Z'
    },
    {
        id: 3,
        author_name: 'Siddharth V.',
        relation: "Anadaraman's Colleague & Friend",
        message: 'The calmest groom and the brightest bride! It was an honour witnessing your beautiful Muhurtham today. Here is to a grand celebration tonight!',
        created_at: '2026-09-12T18:00:00Z'
    },
    {
        id: 4,
        author_name: 'Deepa & Madhavan',
        relation: 'Family Friends',
        message: 'May the sacred Agni bless your home with harmony, prosperity, and endless love. Heartiest congratulations to Anadaraman and Prathiksha Sri!',
        created_at: '2026-09-12T19:45:00Z'
    },
    {
        id: 5,
        author_name: 'Aditya & Pooja',
        relation: 'Cousins',
        message: 'The Sangeet performances were legendary, but seeing the two of you exchange garlands stole our hearts. Congratulations brother and bhabhi!',
        created_at: '2026-09-13T10:20:00Z'
    }
];

let messages = [...DEMO_MESSAGES];

export async function initGuestbook() {
    const wall = document.getElementById('guestbook-wall');
    const form = document.getElementById('guestbook-form');

    if (!wall) return;

    // Load messages from API or fallback
    await loadMessages();

    // Form submission
    if (form) {
        form.addEventListener('submit', handleGuestbookSubmit);
    }
}

async function loadMessages() {
    try {
        const data = await guestbookApi.getMessages();
        if (Array.isArray(data) && data.length > 0) {
            messages = data;
        } else if (data && Array.isArray(data.messages) && data.messages.length > 0) {
            messages = data.messages;
        }
    } catch {
        // Fallback to DEMO_MESSAGES
    }
    renderMessages();
}

function renderMessages() {
    const wall = document.getElementById('guestbook-wall');
    if (!wall) return;

    wall.innerHTML = messages.map(msg => createMessageCardHtml(msg)).join('');
}

function createMessageCardHtml(msg) {
    const dateFormatted = formatDate(msg.created_at || new Date().toISOString());
    const relationBadge = msg.relation ? `<span class="badge badge-accent" style="margin-top: 4px; font-size: 11px; padding: 2px 8px;">${escapeHtml(msg.relation)}</span>` : '';

    return `
        <article class="guestbook-card">
            <span class="guestbook-quote-mark" aria-hidden="true">&ldquo;</span>
            <p class="guestbook-message">${escapeHtml(msg.message)}</p>
            <div style="margin-top: auto;">
                <div class="guestbook-author">${escapeHtml(msg.author_name || msg.name || 'Well-wisher')}</div>
                ${relationBadge}
                <div class="guestbook-date" style="margin-top: 6px;">${escapeHtml(dateFormatted)}</div>
            </div>
        </article>
    `;
}

async function handleGuestbookSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const nameInput = document.getElementById('guestbook-name');
    const relationInput = document.getElementById('guestbook-relation');
    const messageInput = document.getElementById('guestbook-message');
    const submitBtn = document.getElementById('guestbook-submit-btn');

    const author_name = nameInput?.value.trim();
    const relation = relationInput?.value.trim() || '';
    const message = messageInput?.value.trim();

    if (!author_name || !message) {
        showToast('Please enter your name and message.', 'warning');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    const payload = {
        author_name,
        relation,
        message,
        wedding_slug: 'anadaraman-prathisha'
    };

    try {
        const res = await guestbookApi.post(payload);
        const newMsg = res || {
            id: Date.now(),
            author_name,
            relation,
            message,
            created_at: new Date().toISOString()
        };
        messages.unshift(newMsg);
        renderMessages();
        form.reset();
        showToast('Your heartfelt message has been added to the guestbook! ✨', 'success');
    } catch {
        // Local fallback
        const newMsg = {
            id: Date.now(),
            author_name,
            relation,
            message,
            created_at: new Date().toISOString()
        };
        messages.unshift(newMsg);
        renderMessages();
        form.reset();
        showToast('Your message has been posted! (Saved locally) ✨', 'success');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Warm Wishes';
        }
    }
}

function formatDate(isoString) {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return 'September 2026';
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
