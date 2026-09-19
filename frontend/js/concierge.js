/* ============================================================
   concierge.js — AI Wedding Concierge Chat Widget
   ============================================================ */

import { conciergeApi } from './api.js';

// Pre-packaged smart knowledge base for instant answers if backend is offline
const KNOWLEDGE_BASE = [
    {
        keywords: ['dress', 'wear', 'attire', 'outfit', 'clothes', 'code'],
        handler: (q) => {
            const lower = q.toLowerCase();
            if (lower.includes('mehendi')) {
                return 'For the Mehendi (10 Sep), the dress code is **Pastel / Floral**. Light, comfortable, and vibrant colours are recommended. Please avoid all-white and all-black.';
            }
            if (lower.includes('sangeet')) {
                return 'For the Sangeet (11 Sep), dress in **Cocktail / Festive Indian**. Bold, jewel-toned colours, lehengas, kurtas, or cocktail suits are encouraged!';
            }
            if (lower.includes('wedding') || lower.includes('ceremony') || lower.includes('muhurtham')) {
                return 'For the Wedding Ceremony (12 Sep, 9:30 AM), traditional South Indian attire is preferred: **Silk Sarees / Kanjeevaram** for ladies and **Dhoti / Kurta / Sherwani** for men.';
            }
            if (lower.includes('reception')) {
                return 'For the Grand Reception (12 Sep, 7:30 PM), the dress code is **Formal Western / Indo-Western Glamour** — tuxedos, suits, evening gowns, or designer sarees.';
            }
            return 'Here is the dress code summary across all events:\n• **Mehendi**: Pastel / Floral\n• **Sangeet**: Festive Indian / Cocktail\n• **Wedding Ceremony**: Traditional South Indian (Silk Sarees & Kurta/Dhoti)\n• **Reception**: Black Tie / Indo-Western Glamour.';
        }
    },
    {
        keywords: ['where', 'venue', 'location', 'place', 'address', 'directions', 'map'],
        handler: (q) => {
            const lower = q.toLowerCase();
            if (lower.includes('wedding') || lower.includes('ceremony') || lower.includes('mahabalipuram')) {
                return 'The **Wedding Ceremony** will be held at **Temple Gardens, Mahabalipuram** (Shore Temple Road, Tamil Nadu 603104). It is a scenic beachside coastal venue approximately 1 hour drive from ITC Grand Chola.';
            }
            return 'Most celebrations (Mehendi, Sangeet, and Reception) take place at **ITC Grand Chola, Chennai** (Mount Poonamallee Road, Guindy, Chennai 600089). The Wedding Ceremony is held at **Temple Gardens, Mahabalipuram**. Valet parking and chauffeur assistance will be available at both venues!';
        }
    },
    {
        keywords: ['time', 'when', 'schedule', 'timing', 'date', 'start'],
        handler: (q) => {
            const lower = q.toLowerCase();
            if (lower.includes('mehendi')) return 'Mehendi is on **Thursday, 10 Sep 2026, from 10:00 AM to 5:00 PM** at ITC Grand Chola.';
            if (lower.includes('sangeet')) return 'Sangeet is on **Friday, 11 Sep 2026, starting at 7:00 PM** at Crystal Hall, ITC Grand Chola.';
            if (lower.includes('wedding') || lower.includes('ceremony')) return 'The Muhurtham is on **Saturday, 12 Sep 2026, at 9:30 AM** (please arrive by 9:00 AM) at Temple Gardens, Mahabalipuram.';
            if (lower.includes('reception')) return 'The Reception is on **Saturday, 12 Sep 2026, from 7:30 PM onwards** at Grand Ballroom, ITC Grand Chola.';
            return 'Here is the celebration timeline:\n• **Mehendi**: 10 Sep, 10:00 AM\n• **Sangeet**: 11 Sep, 7:00 PM\n• **Wedding Ceremony**: 12 Sep, 9:30 AM\n• **Grand Reception**: 12 Sep, 7:30 PM.';
        }
    },
    {
        keywords: ['park', 'parking', 'valet', 'car'],
        handler: () => 'Complimentary **valet parking** is available for all guests at both ITC Grand Chola and Temple Gardens Mahabalipuram. Dedicated attendants will assist you on arrival.'
    },
    {
        keywords: ['stay', 'hotel', 'accommodation', 'room'],
        handler: () => 'A block of rooms has been reserved for out-of-town guests at **ITC Grand Chola** and **Radisson Resort Temple Bay**. Please connect with our hospitality desk or check the Travel Guide section on this page.'
    },
    {
        keywords: ['gift', 'registry', 'present'],
        handler: () => 'Your presence, blessings, and warm smiles are the greatest gifts we could ever ask for! No boxed gifts please.'
    },
    {
        keywords: ['food', 'diet', 'vegan', 'vegetarian', 'jain', 'dinner', 'lunch'],
        handler: () => 'The wedding ceremony will feature an authentic, traditional South Indian vegetarian Kalyana Sappadu on banana leaves. For Sangeet and Reception, extensive multi-cuisine spreads with vegetarian, non-vegetarian, Jain, and vegan options are curated.'
    },
    {
        keywords: ['contact', 'help', 'phone', 'coordinator', 'emergency'],
        handler: () => 'For any immediate assistance during wedding festivities, please contact our Wedding Hospitality Desk: **+91 98765 43210** or reach out to event coordinators on-site wearing gold badges.'
    }
];

export function initConcierge() {
    const fabBtn = document.getElementById('concierge-btn');
    const panel = document.getElementById('concierge-panel');
    const closeBtn = document.getElementById('concierge-close');
    const form = document.getElementById('concierge-form');
    const input = document.getElementById('concierge-input');
    const quickPrompts = document.querySelectorAll('.concierge-quick-btn');

    if (!panel) return;

    const togglePanel = () => {
        const isOpen = panel.classList.contains('open');
        isOpen ? closePanel() : openPanel();
    };

    const openPanel = () => {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        if (input) input.focus();
        // Welcome message if empty
        const messages = document.getElementById('concierge-messages');
        if (messages && messages.children.length === 0) {
            addBotMessage('Namaste & Welcome! 🙏 I am your digital Wedding Concierge for Anadaraman & Prathiksha Sri’s wedding celebrations. How may I assist you today?');
        }
    };

    const closePanel = () => {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
    };

    fabBtn?.addEventListener('click', togglePanel);
    closeBtn?.addEventListener('click', closePanel);

    // Quick prompts
    quickPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            const promptText = btn.getAttribute('data-prompt') || btn.textContent.trim();
            if (promptText) {
                handleUserQuestion(promptText);
            }
        });
    });

    // Form submit
    form?.addEventListener('submit', e => {
        e.preventDefault();
        const text = input?.value.trim();
        if (!text) return;
        input.value = '';
        handleUserQuestion(text);
    });
}

async function handleUserQuestion(questionText) {
    addUserMessage(questionText);

    const messagesEl = document.getElementById('concierge-messages');
    const typingId = showTypingIndicator();

    try {
        // First try API
        const response = await conciergeApi.ask(questionText);
        removeTypingIndicator(typingId);
        if (response && response.answer) {
            addBotMessage(response.answer);
            return;
        }
    } catch {
        // Fallback to local intelligent assistant
    }

    // Local smart resolution
    setTimeout(() => {
        removeTypingIndicator(typingId);
        const answer = getSmartAnswer(questionText);
        addBotMessage(answer);
    }, 450);
}

function getSmartAnswer(question) {
    const qLower = question.toLowerCase();

    for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some(kw => qLower.includes(kw))) {
            return item.handler(question);
        }
    }

    // Greetings
    if (qLower.includes('hello') || qLower.includes('hi') || qLower.includes('hey') || qLower.includes('vanakkam') || qLower.includes('namaste')) {
        return 'Vanakkam! ✨ How can I help you regarding Anadaraman & Prathiksha Sri’s wedding celebrations? You can ask about events, timings, dress codes, venues, or seating!';
    }

    // Thanks
    if (qLower.includes('thank') || qLower.includes('thx')) {
        return 'You are most welcome! We look forward to celebrating with you! ✨ If you have any other questions, feel free to ask anytime.';
    }

    return 'Thank you for asking! For specific arrangements regarding that, please check the Events and Venue sections on this page, or speak with our Hospitality Desk at **+91 98765 43210**.';
}

function addUserMessage(text) {
    const messagesEl = document.getElementById('concierge-messages');
    if (!messagesEl) return;

    const div = document.createElement('div');
    div.className = 'concierge-message user';
    div.innerHTML = `
        <div class="concierge-bubble">${escapeHtml(text)}</div>
    `;
    messagesEl.appendChild(div);
    scrollToBottom();
}

function addBotMessage(markdownText) {
    const messagesEl = document.getElementById('concierge-messages');
    if (!messagesEl) return;

    const div = document.createElement('div');
    div.className = 'concierge-message bot';
    div.innerHTML = `
        <div class="concierge-avatar" aria-hidden="true">AP</div>
        <div class="concierge-bubble">${formatBotMarkdown(markdownText)}</div>
    `;
    messagesEl.appendChild(div);
    scrollToBottom();
}

function showTypingIndicator() {
    const messagesEl = document.getElementById('concierge-messages');
    if (!messagesEl) return null;

    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'concierge-message bot';
    div.innerHTML = `
        <div class="concierge-avatar" aria-hidden="true">AP</div>
        <div class="concierge-bubble" style="padding: 10px 14px;">
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>
    `;
    messagesEl.appendChild(div);
    scrollToBottom();
    return id;
}

function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    const messagesEl = document.getElementById('concierge-messages');
    if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
}

function formatBotMarkdown(text) {
    if (!text) return '';
    let formatted = escapeHtml(text);
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    formatted = formatted.replace(/\n• (.*?)/g, '<br>• $1');
    // Newlines
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
