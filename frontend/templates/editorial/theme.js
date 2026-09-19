const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.15 });
document.querySelectorAll('.ed-spread, .ed-cols, .ed-folio, .ed-sub').forEach(el => {
    el.setAttribute('data-reveal', '');
    io.observe(el);
});
