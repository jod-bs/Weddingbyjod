/* ============================================================
   weddingday.js — Live Wedding Day Companion Mode
   ============================================================ */

const WEDDING_EVENTS_SCHEDULE = [
    {
        id: 'mehendi',
        name: 'Mehendi Ceremony',
        time: '10:00 AM',
        endTime: '17:00',
        date: '2026-09-10',
        venue: 'Grand Ballroom, ITC Grand Chola',
        address: 'Mount Poonamallee Road, Guindy, Chennai',
        mapUrl: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai'
    },
    {
        id: 'sangeet',
        name: 'Musical Sangeet & Sangeetham',
        time: '07:00 PM',
        endTime: '23:30',
        date: '2026-09-11',
        venue: 'Crystal Hall, ITC Grand Chola',
        address: 'Mount Poonamallee Road, Guindy, Chennai',
        mapUrl: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai'
    },
    {
        id: 'ceremony',
        name: 'Traditional Muhurtham & Kalyanam',
        time: '09:30 AM',
        endTime: '13:00',
        date: '2026-09-12',
        venue: 'Temple Gardens, Mahabalipuram',
        address: 'Shore Temple Road, Mahabalipuram, TN',
        mapUrl: 'https://maps.google.com/?q=Mahabalipuram+Shore+Temple'
    },
    {
        id: 'reception',
        name: 'Grand Wedding Reception',
        time: '07:30 PM',
        endTime: '23:00',
        date: '2026-09-12',
        venue: 'Grand Ballroom, ITC Grand Chola',
        address: 'Mount Poonamallee Road, Guindy, Chennai',
        mapUrl: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai'
    }
];

let simulateLiveDay = false;

export function initWeddingDay() {
    const container = document.getElementById('weddingday-schedule');
    if (!container) return;

    renderSchedule();

    // Simulation toggle for reviewers
    const toggleBtn = document.getElementById('weddingday-toggle-mode');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            simulateLiveDay = !simulateLiveDay;
            toggleBtn.textContent = simulateLiveDay ? 'Showing: Live Mode (Simulated)' : 'Showing: Post-Wedding State';
            renderSchedule();
        });
    }
}

function renderSchedule() {
    const container = document.getElementById('weddingday-schedule');
    const badgeText = document.getElementById('weddingday-badge-text');
    if (!container) return;

    const now = new Date();
    // Actual wedding day was 12 Sep 2026
    const isActualWeddingDay = (now.getFullYear() === 2026 && now.getMonth() === 8 && now.getDate() === 12);
    const isLive = isActualWeddingDay || simulateLiveDay;

    if (badgeText) {
        badgeText.textContent = isLive ? 'Live Wedding Day Mode' : 'Celebration Completed';
    }

    container.innerHTML = WEDDING_EVENTS_SCHEDULE.map((event, index) => {
        let statusBadge = '';
        let itemClass = 'weddingday-event';

        if (isLive) {
            if (simulateLiveDay) {
                // In simulated mode, set Ceremony as active, Mehendi/Sangeet completed, Reception upcoming
                if (index < 2) {
                    itemClass += ' completed';
                    statusBadge = '<span class="badge badge-outline" style="font-size: 11px;">Completed ✓</span>';
                } else if (index === 2) {
                    itemClass += ' current';
                    statusBadge = '<span class="badge badge-accent" style="font-size: 11px; animation: pulse 2s infinite;">Live Now • Muhurtham</span>';
                } else {
                    statusBadge = '<span class="badge badge-secondary" style="font-size: 11px;">Upcoming (7:30 PM)</span>';
                }
            } else {
                // On real day
                itemClass += ' current';
                statusBadge = '<span class="badge badge-accent" style="font-size: 11px;">Today</span>';
            }
        } else {
            // Post-wedding state
            itemClass += ' completed';
            statusBadge = '<span class="badge badge-outline" style="font-size: 11px; color: var(--gold);">Concluded ✨</span>';
        }

        return `
            <div class="${itemClass}">
                <div class="weddingday-event-time">${event.time}</div>
                <div>
                    <h3 class="weddingday-event-name">${event.name}</h3>
                    <p class="weddingday-event-venue">
                        📍 ${event.venue} &bull; 
                        <a href="${event.mapUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--gold); text-decoration: underline; font-size: 0.8rem; margin-left: 4px;">Get Directions ↗</a>
                    </p>
                </div>
                <div class="weddingday-event-status">
                    ${statusBadge}
                </div>
            </div>
        `;
    }).join('');
}
