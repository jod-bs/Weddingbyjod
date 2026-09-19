function jodGet(obj, path) {
    return String(path).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function jodInterpolate(str, ctx) {
    return String(str).replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, path) => {
        const v = jodGet(ctx, path.trim());
        return v == null ? '' : v;
    });
}

function jodBind(root, data) {
    root.querySelectorAll('[data-repeat]').forEach(holder => {
        if (!holder.dataset.tpl) holder.dataset.tpl = holder.innerHTML;
        const items = jodGet(data, holder.dataset.repeat) || [];
        holder.innerHTML = items.map((item, i) => jodInterpolate(holder.dataset.tpl, {
            ...data,
            item,
            index: i,
            n: String(i + 1).padStart(2, '0')
        })).join('');
    });

    root.querySelectorAll('[data-text]').forEach(el => {
        const v = jodGet(data, el.dataset.text);
        if (v != null) el.textContent = v;
    });
    root.querySelectorAll('[data-html]').forEach(el => {
        const v = jodGet(data, el.dataset.html);
        if (v != null) el.innerHTML = v;
    });
    root.querySelectorAll('[data-src]').forEach(el => {
        const v = jodGet(data, el.dataset.src);
        if (v) el.setAttribute('src', v);
    });
    root.querySelectorAll('[data-alt]').forEach(el => {
        const v = jodGet(data, el.dataset.alt);
        if (v) el.setAttribute('alt', v);
    });
}

function jodCountdown(iso, root = document) {
    const target = new Date(iso).getTime();
    const tick = () => {
        const diff = Math.max(0, target - Date.now());
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        const map = { days, hours, mins, secs };
        Object.entries(map).forEach(([k, v]) => {
            root.querySelectorAll(`[data-count="${k}"]`).forEach(el => {
                el.textContent = String(v).padStart(2, '0');
            });
        });
    };
    tick();
    return setInterval(tick, 1000);
}

async function jodLoadWedding() {
    const res = await fetch('/data/wedding-demo.json', { cache: 'no-store' });
    const data = await res.json();
    window.JOD_WEDDING = data;
    jodBind(document, data);
    if (data.dateISO) jodCountdown(data.dateISO);
    document.querySelectorAll('.jod-rsvp').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            form.hidden = true;
            const thanks = form.parentElement?.querySelector('.jod-thanks');
            if (thanks) thanks.hidden = false;
        });
    });
    document.dispatchEvent(new CustomEvent('wedding:ready', { detail: data }));
    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    jodLoadWedding().catch(err => console.warn('Wedding data unavailable', err));
});
