const modal = document.getElementById('bt-modal');
document.getElementById('bt-open')?.addEventListener('click', () => { modal.hidden = false; });
document.getElementById('bt-close')?.addEventListener('click', () => { modal.hidden = true; });
modal?.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
