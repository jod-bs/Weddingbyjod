/* ============================================================
   api.js — Centralized API client
   ============================================================ */

const API_BASE = 'http://localhost:8000/api';

const defaultHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
});

async function request(method, path, body = null, options = {}) {
    const config = {
        method,
        headers: { ...defaultHeaders(), ...(options.headers || {}) },
    };
    if (body) config.body = JSON.stringify(body);

    try {
        const res = await fetch(`${API_BASE}${path}`, config);

        if (!res.ok) {
            let errData;
            try { errData = await res.json(); } catch { errData = { detail: res.statusText }; }
            throw { status: res.status, message: errData.detail || 'Request failed', data: errData };
        }

        // 204 No Content
        if (res.status === 204) return null;
        return res.json();
    } catch (err) {
        if (err.status) throw err;
        throw { status: 0, message: 'Network error — please check your connection.', data: null };
    }
}

export const api = {
    get:    (path, opts)         => request('GET',    path, null, opts),
    post:   (path, body, opts)   => request('POST',   path, body, opts),
    put:    (path, body, opts)   => request('PUT',    path, body, opts),
    patch:  (path, body, opts)   => request('PATCH',  path, body, opts),
    delete: (path, opts)         => request('DELETE', path, null, opts),
};

// ─── TYPED ENDPOINTS ─────────────────────────────────────────

const SLUG = 'anadaraman-prathisha';

export const platformApi = {
    getPlans:       () => api.get('/platform/plans'),
    getHistory:     () => api.get('/platform/history'),
    getServices:    () => api.get('/platform/services'),
    submitInquiry:  (data) => api.post('/platform/inquiry', data),
};

export const weddingApi = {
    getWedding:  ()        => api.get(`/weddings/${SLUG}`),
    getEvents:   ()        => api.get(`/weddings/${SLUG}/events`),
    getStory:    ()        => api.get(`/weddings/${SLUG}/story`),
    getVenue:    ()        => api.get(`/weddings/${SLUG}/venue`),
    getFaqs:     ()        => api.get(`/weddings/${SLUG}/faqs`),
    getCityGuide:()        => api.get(`/weddings/${SLUG}/city-guide`),
};

export const guestApi = {
    getByToken:  (token)   => api.get(`/guests/${token}`),
    search:      (name)    => api.get(`/guests/search?name=${encodeURIComponent(name)}`),
};

export const rsvpApi = {
    submit:      (data)    => api.post('/rsvp', data),
    update:      (id, data)=> api.put(`/rsvp/${id}`, data),
};

export const seatingApi = {
    findSeat:    (name)    => api.get(`/seating/find?name=${encodeURIComponent(name)}`),
    getByToken:  (token)   => api.get(`/seating/${token}`),
};

export const galleryApi = {
    getPhotos:   (page=1)  => api.get(`/gallery?page=${page}`),
    upload:      (formData) => fetch(`${API_BASE}/gallery/upload`, {
        method: 'POST',
        body: formData,
    }).then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e))),
};

export const guestbookApi = {
    getMessages: ()        => api.get('/guestbook'),
    post:        (data)    => api.post('/guestbook', data),
};

export const conciergeApi = {
    ask: (question, context = {}) => api.post('/concierge/ask', { question, context }),
};
