/* ============================================================
   rsvp.js — RSVP search, form flow, submission
   ============================================================ */

import { guestApi, rsvpApi } from './api.js';
import { showToast } from './main.js';

// State
let currentGuest = null;
let currentRsvpId = null;
let guestCount = 1;

export function initRsvp() {
    const searchForm = document.getElementById('rsvp-search-form');
    const rsvpForm = document.getElementById('rsvp-form');

    if (!searchForm) return;

    // ─── Search Flow ────────────────────────────────────────
    searchForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('rsvp-name-input').value.trim();
        if (!name) return;
        await searchGuest(name);
    });

    // ─── Guest Counter ───────────────────────────────────────
    document.getElementById('count-minus')?.addEventListener('click', () => {
        if (guestCount > 1) {
            guestCount--;
            updateCounter();
        }
    });

    document.getElementById('count-plus')?.addEventListener('click', () => {
        const max = parseInt(currentGuest?.max_guests || 6);
        if (guestCount < max) {
            guestCount++;
            updateCounter();
        }
    });

    // ─── RSVP Form Submission ────────────────────────────────
    rsvpForm?.addEventListener('submit', async e => {
        e.preventDefault();
        await submitRsvp();
    });

    // ─── Radio options ───────────────────────────────────────
    document.querySelectorAll('.radio-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const input = opt.querySelector('input[type="radio"]');
            if (!input) return;
            input.checked = true;
            const name = input.name;
            document.querySelectorAll(`.radio-option input[name="${name}"]`).forEach(r => {
                r.closest('.radio-option').classList.remove('selected');
            });
            opt.classList.add('selected');

            // Show/hide form based on attendance
            if (name === 'attendance') {
                const formFields = document.getElementById('rsvp-attendance-fields');
                if (formFields) {
                    formFields.style.display = input.value === 'yes' ? 'flex' : 'none';
                }
            }
        });
    });

    // ─── Edit RSVP ───────────────────────────────────────────
    document.getElementById('rsvp-edit-btn')?.addEventListener('click', () => {
        showState('form');
    });
}

async function searchGuest(name) {
    const btn = document.getElementById('rsvp-search-btn');
    const errorEl = document.getElementById('rsvp-search-error');
    setLoading(btn, true);
    if (errorEl) errorEl.textContent = '';

    try {
        const data = await guestApi.search(name);
        currentGuest = data;
        currentRsvpId = data.rsvp_id || null;
        populateForm(data);
        showState('form');
    } catch (err) {
        if (err.status === 404) {
            showState('not-found');
        } else {
            if (errorEl) errorEl.textContent = 'Something went wrong. Please try again.';
        }
    } finally {
        setLoading(btn, false);
    }
}

function populateForm(guest) {
    const greeting = document.getElementById('rsvp-guest-greeting');
    if (greeting) {
        greeting.textContent = `Welcome, ${guest.name}`;
    }

    guestCount = guest.rsvp_count || guest.default_guests || 1;
    updateCounter();

    // Pre-fill existing RSVP
    if (guest.rsvp_status) {
        const attendanceInput = document.querySelector(
            `.radio-option input[name="attendance"][value="${guest.rsvp_status === 'confirmed' ? 'yes' : 'no'}"]`
        );
        if (attendanceInput) {
            attendanceInput.click();
        }
    }

    if (guest.meal_preference) {
        const mealInput = document.querySelector(
            `.radio-option input[name="meal"][value="${guest.meal_preference}"]`
        );
        if (mealInput) mealInput.click();
    }
}

async function submitRsvp() {
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
    const meal = document.querySelector('input[name="meal"]:checked')?.value;
    const notes = document.getElementById('rsvp-notes')?.value;
    const btn = document.getElementById('rsvp-submit-btn');

    if (!attendance) {
        showToast('Please select whether you will attend.', 'info');
        return;
    }

    const payload = {
        guest_id: currentGuest?.id,
        guest_name: currentGuest?.name,
        attendance,
        guest_count: guestCount,
        meal_preference: meal,
        notes,
    };

    setLoading(btn, true);

    try {
        if (currentRsvpId) {
            await rsvpApi.update(currentRsvpId, payload);
        } else {
            const result = await rsvpApi.submit(payload);
            currentRsvpId = result.id;
        }
        showState('success');
        showToast('RSVP confirmed! We cannot wait to celebrate with you.', 'success');
    } catch {
        showToast('Something went wrong. Please try again.', 'error');
    } finally {
        setLoading(btn, false);
    }
}

function showState(state) {
    document.getElementById('rsvp-search')?.style && (document.getElementById('rsvp-search').style.display = state === 'search' ? 'block' : 'none');
    document.getElementById('rsvp-form-wrap')?.style && (document.getElementById('rsvp-form-wrap').style.display = state === 'form' ? 'flex' : 'none');
    document.getElementById('rsvp-success')?.style && (document.getElementById('rsvp-success').style.display = state === 'success' ? 'block' : 'none');
    document.getElementById('rsvp-not-found')?.style && (document.getElementById('rsvp-not-found').style.display = state === 'not-found' ? 'block' : 'none');
}

function updateCounter() {
    const el = document.getElementById('rsvp-guest-count');
    if (el) el.textContent = guestCount;
}

function setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
        btn.dataset.originalText = btn.textContent;
        btn.innerHTML = `<span class="spinner"></span>`;
    } else {
        btn.innerHTML = btn.dataset.originalText || 'Submit';
    }
}
