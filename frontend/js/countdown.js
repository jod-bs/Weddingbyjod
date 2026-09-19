/* ============================================================
   countdown.js — Live countdown to wedding date
   ============================================================ */

const WEDDING_DATE = new Date('2026-09-12T09:00:00+05:30');

export function initCountdown() {
    const wrapper = document.getElementById('countdown-wrapper');
    if (!wrapper) return;

    const daysEl   = document.getElementById('cd-days');
    const hoursEl  = document.getElementById('cd-hours');
    const minsEl   = document.getElementById('cd-mins');
    const secsEl   = document.getElementById('cd-secs');
    const gridEl   = document.getElementById('countdown-grid');
    const msgEl    = document.getElementById('countdown-message');

    function pad(n) { return String(Math.floor(n)).padStart(2, '0'); }

    function animateChange(el, newVal) {
        if (!el || el.textContent === newVal) return;
        el.classList.add('flip');
        el.addEventListener('animationend', () => el.classList.remove('flip'), { once: true });
        el.textContent = newVal;
    }

    function tick() {
        const now = Date.now();
        const diff = WEDDING_DATE.getTime() - now;

        if (diff <= 0) {
            // Wedding has passed / is today
            if (gridEl) gridEl.style.display = 'none';
            if (msgEl) {
                msgEl.style.display = 'block';
                msgEl.innerHTML = `
                    <p class="countdown-message">We are married! ✨</p>
                    <p class="countdown-sub">Thank you for being part of our forever.</p>
                `;
            }
            return; // stop ticking
        }

        const days    = Math.floor(diff / 86400000);
        const hours   = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        animateChange(daysEl,  pad(days));
        animateChange(hoursEl, pad(hours));
        animateChange(minsEl,  pad(minutes));
        animateChange(secsEl,  pad(seconds));

        setTimeout(tick, 1000);
    }

    tick();
}
