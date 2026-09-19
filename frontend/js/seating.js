/* ============================================================
   seating.js — Guest seating finder
   ============================================================ */

import { seatingApi } from './api.js';

export function initSeating() {
    const form = document.getElementById('seating-search-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('seating-name-input').value.trim();
        if (!name) return;
        await findSeat(name);
    });

    document.getElementById('seating-reset-btn')?.addEventListener('click', resetSeating);
}

async function findSeat(name) {
    const btn = document.getElementById('seating-search-btn');
    const resultEl = document.getElementById('seating-result');
    const notFoundEl = document.getElementById('seating-not-found');
    setLoading(btn, true);
    if (resultEl) resultEl.style.display = 'none';
    if (notFoundEl) notFoundEl.style.display = 'none';

    try {
        const data = await seatingApi.findSeat(name);
        renderResult(data);
    } catch (err) {
        if (err.status === 404) {
            if (notFoundEl) notFoundEl.style.display = 'block';
        } else {
            if (notFoundEl) {
                notFoundEl.style.display = 'block';
                notFoundEl.querySelector('p').textContent = 'Something went wrong. Please try again.';
            }
        }
    } finally {
        setLoading(btn, false);
    }
}

function renderResult(data) {
    const resultEl = document.getElementById('seating-result');
    if (!resultEl) return;

    document.getElementById('seating-guest-name').textContent = data.guest_name;
    document.getElementById('seating-table-number').textContent = data.table_number;
    document.getElementById('seating-table-name').textContent = data.table_name ? `"${data.table_name}"` : '';

    const companions = document.getElementById('seating-companions');
    if (companions && data.companions?.length) {
        companions.innerHTML = data.companions.map(c =>
            `<div class="seating-companion-chip">${c}</div>`
        ).join('');
        companions.style.display = 'flex';
    } else if (companions) {
        companions.style.display = 'none';
    }

    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetSeating() {
    document.getElementById('seating-name-input').value = '';
    document.getElementById('seating-result').style.display = 'none';
    document.getElementById('seating-not-found').style.display = 'none';
}

function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
        ? `<span class="spinner"></span>`
        : (btn.dataset.originalText || 'Find My Table');
    if (!loading && !btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
}
