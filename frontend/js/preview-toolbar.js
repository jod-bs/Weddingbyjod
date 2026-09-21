(function () {
    if (window.self !== window.top) return;
    if (document.getElementById('jod-preview-bar')) return;

    const params = new URLSearchParams(location.search);
    const name = document.body.getAttribute('data-template-name') || 'Template';
    const slug = document.body.getAttribute('data-template-slug') || '';

    const bar = document.createElement('div');
    bar.id = 'jod-preview-bar';
    bar.innerHTML = `
        <a class="jpb-back" href="/templates.html">← Templates</a>
        <span class="jpb-name">${name}</span>
        <div class="jpb-actions">
            <a class="jpb-use" href="/?template=${encodeURIComponent(name)}#consultation">Use this template</a>
        </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
        #jod-preview-bar{position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.55rem 1rem;background:#11100F;color:#F5EFE4;font-family:'Cormorant Garamond',Georgia,serif;font-size:14px;letter-spacing:.08em;text-transform:uppercase}
        #jod-preview-bar a{color:#C9A96E;text-decoration:none;font-weight:600}
        #jod-preview-bar .jpb-use{background:#C9A96E;color:#11100F;padding:.4rem .8rem}
        body{padding-top:42px !important}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
    `;
    document.head.appendChild(style);
    document.body.prepend(bar);
})();
