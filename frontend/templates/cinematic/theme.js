const scenes = document.querySelectorAll('.cin-scene');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function onScroll() {
    if (reduce) return;
    scenes.forEach(scene => {
        const img = scene.querySelector('.cin-bg');
        if (!img) return;
        const r = scene.getBoundingClientRect();
        const p = Math.max(-80, Math.min(80, (window.innerHeight / 2 - r.top) * 0.12));
        img.style.setProperty('--p', `${p}px`);
    });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
