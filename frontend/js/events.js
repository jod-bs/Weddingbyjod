/* ============================================================
   events.js — Event cards, modal, dress code, calendar
   ============================================================ */

import { weddingApi } from './api.js';

// Static fallback data (shown if backend unavailable)
const DEMO_EVENTS = [
    {
        id: 1,
        name: 'Mehendi',
        date: '2026-09-10',
        time: '10:00 AM',
        end_time: '5:00 PM',
        venue: 'Grand Ballroom, ITC Grand Chola',
        address: 'Nandambakkam Post, Mount Poonamallee Road, Chennai, TN 600089',
        description: 'A vibrant celebration of art, colour, and tradition. Join us as Prathiksha Sri\'s hands are adorned with intricate henna designs, surrounded by music, laughter, and loved ones.',
        dress_code: 'Pastel / Floral',
        dress_colors: ['#F9C5C5', '#C5E5F9', '#C5F9D1', '#F9ECC5', '#DCC5F9'],
        dress_note: 'Light, comfortable, and colourful outfits are recommended. Avoid white and black.',
        image: '/assets/images/event-mehendi.jpg',
        map_url: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai',
    },
    {
        id: 2,
        name: 'Sangeet',
        date: '2026-09-11',
        time: '7:00 PM',
        end_time: '11:30 PM',
        venue: 'Crystal Hall, ITC Grand Chola',
        address: 'Nandambakkam Post, Mount Poonamallee Road, Chennai, TN 600089',
        description: 'An evening of music, dance, and celebration as both families come together to sing and dance for the couple. Expect stunning performances, great food, and unforgettable moments.',
        dress_code: 'Cocktail / Festive Indian',
        dress_colors: ['#8B2FC9', '#C92F6B', '#2FC98B', '#C9882F', '#2F8BC9'],
        dress_note: 'Smart formal or traditional Indian attire. Bold and vibrant colours are encouraged.',
        image: '/assets/images/event-sangeet.jpg',
        map_url: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai',
    },
    {
        id: 3,
        name: 'Wedding Ceremony',
        date: '2026-09-12',
        time: '9:30 AM',
        end_time: '1:00 PM',
        venue: 'Temple Gardens, Mahabalipuram',
        address: 'Shore Temple Road, Mahabalipuram, Tamil Nadu 603104',
        description: 'The sacred union of Anadaraman and Prathiksha Sri in a traditional South Indian Hindu ceremony. Witness the ancient rituals that have joined generations of families across centuries.',
        dress_code: 'Traditional Indian / Saree / Sherwani',
        dress_colors: ['#F5E6C8', '#C8D4F5', '#F5C8C8', '#C8F5E6', '#F5C8E6'],
        dress_note: 'Traditional attire strongly preferred. Please arrive by 9:00 AM. Saree or formal salwar for women, kurta/sherwani for men.',
        image: '/assets/images/event-wedding.jpg',
        map_url: 'https://maps.google.com/?q=Mahabalipuram+Shore+Temple',
    },
    {
        id: 4,
        name: 'Reception',
        date: '2026-09-12',
        time: '7:30 PM',
        end_time: '11:00 PM',
        venue: 'Grand Ballroom, ITC Grand Chola',
        address: 'Nandambakkam Post, Mount Poonamallee Road, Chennai, TN 600089',
        description: 'An elegant evening reception celebrating the newly married couple. Dinner, dancing, and a night to remember with family and friends.',
        dress_code: 'Black Tie / Cocktail',
        dress_colors: ['#C9A96E', '#1A1A2E', '#2E1A1A', '#F5EFE4', '#8C6A55'],
        dress_note: 'Cocktail or formal evening attire. This is an elegant black-tie inspired celebration.',
        image: '/assets/images/event-reception.jpg',
        map_url: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai',
    },
];

let allEvents = [];

export async function initEvents() {
    try {
        const data = await weddingApi.getEvents();
        allEvents = data.events || DEMO_EVENTS;
    } catch {
        allEvents = DEMO_EVENTS;
    }

    renderEventJourney();
    initEventModal();
}

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function renderEventJourney() {
    const container = document.getElementById('events-journey');
    if (!container) return;

    container.innerHTML = allEvents.map((event, i) => `
        <div class="event-node reveal reveal-delay-${(i % 4) + 1}">
            <div class="event-card-interactive" 
                 role="button" 
                 tabindex="0" 
                 aria-label="View details for ${event.name}"
                 data-event-id="${event.id}">
                <div class="event-card-img">
                    <img src="${event.image}" alt="${event.name} event" loading="lazy">
                </div>
                <div class="event-card-info">
                    <div class="event-card-name">${event.name}</div>
                    <div class="event-card-meta">
                        <div class="event-meta-row">
                            <span class="event-meta-icon">📅</span>
                            <span>${formatDate(event.date)}</span>
                        </div>
                        <div class="event-meta-row">
                            <span class="event-meta-icon">🕐</span>
                            <span>${event.time}${event.end_time ? ' – ' + event.end_time : ''}</span>
                        </div>
                        <div class="event-meta-row">
                            <span class="event-meta-icon">📍</span>
                            <span>${event.venue}</span>
                        </div>
                    </div>
                    <div class="event-card-dress">
                        <span>👗</span>
                        <span>${event.dress_code}</span>
                    </div>
                    <div class="event-card-cta">
                        View details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </div>
                </div>
            </div>
            ${i < allEvents.length - 1 ? '<div class="event-connector"></div>' : ''}
        </div>
    `).join('');

    // Bind click/keydown
    container.querySelectorAll('.event-card-interactive').forEach(card => {
        card.addEventListener('click', () => openEventModal(parseInt(card.dataset.eventId)));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEventModal(parseInt(card.dataset.eventId));
            }
        });
    });

    // Trigger IntersectionObserver for new elements
    document.dispatchEvent(new CustomEvent('jod:refresh-reveal'));
}

// ─── EVENT MODAL ──────────────────────────────────────────────

function initEventModal() {
    const overlay = document.getElementById('event-modal-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeEventModal();
    });

    document.getElementById('event-modal-close')?.addEventListener('click', closeEventModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeEventModal();
    });
}

function openEventModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    const overlay = document.getElementById('event-modal-overlay');
    if (!overlay) return;

    // Populate modal
    const img = overlay.querySelector('#modal-event-img');
    if (img) { img.src = event.image; img.alt = event.name; }

    overlay.querySelector('#modal-event-name').textContent = event.name;
    overlay.querySelector('#modal-event-date').textContent = formatDate(event.date);
    overlay.querySelector('#modal-event-time').textContent = `${event.time}${event.end_time ? ' – ' + event.end_time : ''}`;
    overlay.querySelector('#modal-event-venue').textContent = event.venue;
    overlay.querySelector('#modal-event-dress').textContent = event.dress_code;
    overlay.querySelector('#modal-event-desc').textContent = event.description;

    // Dress code colors
    const swatchContainer = overlay.querySelector('#modal-dress-colors');
    if (swatchContainer && event.dress_colors) {
        swatchContainer.innerHTML = event.dress_colors.map(c => `
            <div class="swatch">
                <div class="swatch-circle" style="background:${c}" title="${c}"></div>
            </div>
        `).join('');
    }
    overlay.querySelector('#modal-dress-note').textContent = event.dress_note || '';

    // Directions button
    const directionsBtn = overlay.querySelector('#modal-directions-btn');
    if (directionsBtn) {
        directionsBtn.href = event.map_url || `https://maps.google.com/?q=${encodeURIComponent(event.address)}`;
    }

    // Add to Calendar
    const calBtn = overlay.querySelector('#modal-cal-btn');
    if (calBtn) {
        calBtn.href = buildCalendarUrl(event);
    }

    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    overlay.querySelector('#modal-event-name')?.focus();
}

function closeEventModal() {
    document.getElementById('event-modal-overlay')?.classList.remove('open');
    document.body.classList.remove('no-scroll');
}

function buildCalendarUrl(event) {
    const start = event.date.replace(/-/g, '') + 'T' + event.time.replace(':', '').replace(' AM', '').replace(' PM', '') + '0000';
    const title = encodeURIComponent(`Krithish & Priya — ${event.name}`);
    const location = encodeURIComponent(event.address || event.venue);
    const details = encodeURIComponent(event.description);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${start}&location=${location}&details=${details}`;
}

export { allEvents };
