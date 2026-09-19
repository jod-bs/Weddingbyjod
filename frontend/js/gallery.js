/* ============================================================
   gallery.js — Guest photo wall, upload flow, lightbox
   ============================================================ */

import { galleryApi } from './api.js';
import { showToast } from './main.js';

const DEMO_PHOTOS = [
    {
        id: 1,
        image_url: 'assets/images/hero-couple.jpg',
        caption: 'Anadaraman & Prathiksha Sri — Forever begins here',
        guest_name: 'Anadaraman & Prathiksha Sri',
        created_at: '2026-09-12'
    },
    {
        id: 2,
        image_url: 'assets/images/event-mehendi.jpg',
        caption: 'Colour, laughter & intricate Mehendi magic',
        guest_name: 'Ananya Sharma',
        created_at: '2026-09-10'
    },
    {
        id: 3,
        image_url: 'assets/images/event-sangeet.jpg',
        caption: 'Unforgettable dance performances and music',
        guest_name: 'Rahul Verma',
        created_at: '2026-09-11'
    },
    {
        id: 4,
        image_url: 'assets/images/event-wedding.jpg',
        caption: 'The sacred Muhurtham ceremony & divine blessings',
        guest_name: 'Venkatesh Rao',
        created_at: '2026-09-12'
    },
    {
        id: 5,
        image_url: 'assets/images/event-reception.jpg',
        caption: 'A night of celebration under the chandeliers',
        guest_name: 'Sneha Patel',
        created_at: '2026-09-12'
    },
    {
        id: 6,
        image_url: 'assets/images/hero-couple.jpg',
        caption: 'A candid portrait after the evening celebrations',
        guest_name: 'Karthik & Divya',
        created_at: '2026-09-13'
    }
];

let currentPhotos = [...DEMO_PHOTOS];
let activeLightboxIndex = 0;

export async function initGallery() {
    const masonry = document.getElementById('gallery-masonry');
    if (!masonry) return;

    // Load photos from API or fallback
    await loadPhotos();

    // Upload Modal triggers
    initUploadModal();

    // Lightbox modal setup
    initLightbox();
}

async function loadPhotos() {
    const masonry = document.getElementById('gallery-masonry');
    try {
        const data = await galleryApi.getPhotos();
        if (data && Array.isArray(data) && data.length > 0) {
            currentPhotos = data;
        } else if (data && data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
            currentPhotos = data.photos;
        }
    } catch {
        // Use demo fallback silently
    }
    renderGallery();
}

function renderGallery() {
    const masonry = document.getElementById('gallery-masonry');
    if (!masonry) return;

    masonry.innerHTML = currentPhotos.map((photo, index) => `
        <div class="gallery-item" data-index="${index}" tabindex="0" role="button" aria-label="View photo by ${escapeHtml(photo.guest_name || 'Guest')}">
            <img src="${escapeHtml(photo.image_url || photo.url || '')}" alt="${escapeHtml(photo.caption || 'Wedding Photo')}" loading="lazy" />
            <div class="gallery-item-overlay">
                <div class="gallery-item-info">
                    <p class="gallery-uploader">${escapeHtml(photo.guest_name || photo.uploader_name || 'Guest')}</p>
                    ${photo.caption ? `<p class="gallery-caption-preview" style="font-size: 0.8rem; color: rgba(245,239,228,0.8); margin-top: 4px;">${escapeHtml(photo.caption)}</p>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // Attach click handlers for lightbox
    masonry.querySelectorAll('.gallery-item').forEach(item => {
        const openItem = () => {
            const idx = parseInt(item.getAttribute('data-index'), 10);
            openLightbox(idx);
        };
        item.addEventListener('click', openItem);
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openItem();
            }
        });
    });
}

function initUploadModal() {
    const openBtn = document.getElementById('gallery-open-upload-btn');
    const modal = document.getElementById('gallery-upload-modal');
    const closeBtn = document.getElementById('gallery-upload-close');
    const dropzone = document.getElementById('gallery-dropzone');
    const fileInput = document.getElementById('gallery-file-input');
    const form = document.getElementById('gallery-upload-form');
    const previewContainer = document.getElementById('gallery-file-preview');

    if (!modal) return;

    const openModal = () => {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        if (form) form.reset();
        if (previewContainer) {
            previewContainer.innerHTML = '';
            previewContainer.style.display = 'none';
        }
        if (dropzone) dropzone.style.display = 'block';
    };

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    // Drag & Drop
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('drag-over');
            });
        });

        dropzone.addEventListener('drop', e => {
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelected(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
                handleFileSelected(fileInput.files[0]);
            }
        });
    }

    function handleFileSelected(file) {
        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (JPEG, PNG, or WebP).', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <div style="position: relative; max-width: 220px; margin: 0 auto;">
                        <img src="${e.target.result}" style="width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border);" alt="Preview" />
                        <button type="button" id="gallery-remove-file" style="position: absolute; top: -8px; right: -8px; background: var(--obsidian); color: var(--gold); border: 1px solid var(--gold-border); border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;">✕</button>
                    </div>
                `;
                previewContainer.style.display = 'block';
                if (dropzone) dropzone.style.display = 'none';

                document.getElementById('gallery-remove-file')?.addEventListener('click', () => {
                    fileInput.value = '';
                    previewContainer.innerHTML = '';
                    previewContainer.style.display = 'none';
                    dropzone.style.display = 'block';
                });
            }
        };
        reader.readAsDataURL(file);
    }

    // Form submit
    form?.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = document.getElementById('gallery-submit-btn');
        const nameInput = document.getElementById('gallery-uploader-name');
        const captionInput = document.getElementById('gallery-caption-input');

        if (!fileInput.files || !fileInput.files[0]) {
            showToast('Please choose a photo to upload.', 'warning');
            return;
        }

        const file = fileInput.files[0];
        const guestName = nameInput?.value.trim() || 'Wedding Guest';
        const caption = captionInput?.value.trim() || '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('guest_name', guestName);
        formData.append('caption', caption);

        try {
            const res = await galleryApi.upload(formData);
            const newPhoto = res || {
                id: Date.now(),
                image_url: URL.createObjectURL(file),
                caption,
                guest_name: guestName,
                created_at: new Date().toISOString()
            };
            currentPhotos.unshift(newPhoto);
            renderGallery();
            closeModal();
            showToast('Photo uploaded successfully! Thank you for sharing your memory ✨', 'success');
        } catch {
            // Local fallback for offline/demo
            const newPhoto = {
                id: Date.now(),
                image_url: URL.createObjectURL(file),
                caption,
                guest_name: guestName,
                created_at: new Date().toISOString()
            };
            currentPhotos.unshift(newPhoto);
            renderGallery();
            closeModal();
            showToast('Photo uploaded! (Saved locally for this session) ✨', 'success');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Upload Photo';
            }
        }
    });
}

function initLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;

    const closeBtn = document.getElementById('gallery-lightbox-close');
    const prevBtn = document.getElementById('gallery-lightbox-prev');
    const nextBtn = document.getElementById('gallery-lightbox-next');

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => navigateLightbox(-1));
    nextBtn?.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox || !currentPhotos[index]) return;

    activeLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
}

function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
}

function navigateLightbox(direction) {
    activeLightboxIndex = (activeLightboxIndex + direction + currentPhotos.length) % currentPhotos.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const photo = currentPhotos[activeLightboxIndex];
    if (!photo) return;

    const imgEl = document.getElementById('gallery-lightbox-img');
    const captionEl = document.getElementById('gallery-lightbox-caption');
    const uploaderEl = document.getElementById('gallery-lightbox-uploader');
    const counterEl = document.getElementById('gallery-lightbox-counter');

    if (imgEl) {
        imgEl.src = photo.image_url || photo.url || '';
        imgEl.alt = photo.caption || 'Wedding Photo';
    }
    if (captionEl) {
        captionEl.textContent = photo.caption || '';
        captionEl.style.display = photo.caption ? 'block' : 'none';
    }
    if (uploaderEl) {
        uploaderEl.textContent = `Shared by ${photo.guest_name || photo.uploader_name || 'Wedding Guest'}`;
    }
    if (counterEl) {
        counterEl.textContent = `${activeLightboxIndex + 1} / ${currentPhotos.length}`;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
