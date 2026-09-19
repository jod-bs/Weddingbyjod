document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.tpl-burger');
    const links = document.querySelector('.tpl-links');
    burger?.addEventListener('click', () => {
        const open = links?.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(!!open));
    });
    links?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });

    const form = document.querySelector('.tpl-form');
    const thanks = document.querySelector('.tpl-thanks');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        form.style.display = 'none';
        if (thanks) thanks.style.display = 'block';
    });
});
