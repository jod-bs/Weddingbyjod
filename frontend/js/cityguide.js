/* ============================================================
   cityguide.js — Chennai & Mahabalipuram Travel Guide
   ============================================================ */

import { weddingApi } from './api.js';

const DEMO_GUIDE_ITEMS = [
    {
        id: 1,
        name: 'ITC Grand Chola, Chennai',
        category: 'stay',
        category_label: 'Luxury Stay & Venue',
        emoji: '🏨',
        description: 'Our primary venue for the Mehendi, Sangeet, and Reception. Inspired by the imperial architecture of the Chola dynasty, offering palatial luxury, grand ballrooms, and multiple award-winning restaurants.',
        distance: 'At Venue (Guindy)',
        address: '63 Mount Poonamallee Road, Guindy, Chennai',
        map_url: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai'
    },
    {
        id: 2,
        name: 'Radisson Resort Temple Bay',
        category: 'stay',
        category_label: 'Beachside Stay',
        emoji: '🌴',
        description: 'Expansive 27-acre beach resort located right on the Bay of Bengal coastline, only 5 minutes from the Wedding Ceremony venue in Mahabalipuram.',
        distance: '2 km from Ceremony',
        address: '57 Covelong Road, Mahabalipuram',
        map_url: 'https://maps.google.com/?q=Radisson+Resort+Temple+Bay+Mahabalipuram'
    },
    {
        id: 3,
        name: 'Shore Temple & Pancha Rathas',
        category: 'sights',
        category_label: 'UNESCO World Heritage',
        emoji: '🏛️',
        description: '7th-century granite monolithic rock temples overlooking the Bay of Bengal. Built during the Pallava dynasty, showcasing the highest achievement of Dravidian temple architecture.',
        distance: 'Adjacent to Ceremony',
        address: 'Shore Temple Road, Mahabalipuram',
        map_url: 'https://maps.google.com/?q=Mahabalipuram+Shore+Temple'
    },
    {
        id: 4,
        name: 'Murugan Idli Shop',
        category: 'dining',
        category_label: 'Iconic South Indian',
        emoji: '🥞',
        description: 'World-famous for melt-in-the-mouth steamed idlis, ghee podi dosa, and four varieties of fresh coconut and coriander chutneys served on banana leaves.',
        distance: '6 km from ITC Chola',
        address: 'Besant Nagar & T. Nagar, Chennai',
        map_url: 'https://maps.google.com/?q=Murugan+Idli+Shop+Chennai'
    },
    {
        id: 5,
        name: 'DakshinaChitra Heritage Museum',
        category: 'sights',
        category_label: 'Culture & Art',
        emoji: '🎨',
        description: 'A vibrant open-air living heritage village with 18 authentic historic houses from Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh, with live folk artisans and craft workshops.',
        distance: '20 km on ECR',
        address: 'East Coast Road, Muttukadu, Chennai',
        map_url: 'https://maps.google.com/?q=DakshinaChitra+Chennai'
    },
    {
        id: 6,
        name: 'Kaya Kalp — The Royal Spa',
        category: 'salon',
        category_label: 'Wellness & Spa',
        emoji: '💆',
        description: 'ITC Grand Chola’s 23,000 sq ft signature wellness haven offering indigenous Ayurvedic therapies, restorative massages, and wedding beauty preparation.',
        distance: 'Inside ITC Chola',
        address: 'ITC Grand Chola, Guindy, Chennai',
        map_url: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai'
    },
    {
        id: 7,
        name: 'Toni & Guy Essensuals',
        category: 'salon',
        category_label: 'Hair & Makeup',
        emoji: '✂️',
        description: 'Top-tier styling salon providing hair draping, blowouts, beard grooming, and wedding guest makeover packages.',
        distance: '4 km from Venue',
        address: 'Phoenix Marketcity & Alwarpet, Chennai',
        map_url: 'https://maps.google.com/?q=Phoenix+Marketcity+Chennai'
    },
    {
        id: 8,
        name: 'Madras Pavilion',
        category: 'dining',
        category_label: 'Fine Dining Buffet',
        emoji: '🍛',
        description: 'Lavish multi-cuisine dining featuring live cooking stations, artisanal curries, Chettinad specialties, European carvings, and decadent artisanal desserts.',
        distance: 'Inside ITC Chola',
        address: 'ITC Grand Chola, Guindy, Chennai',
        map_url: 'https://maps.google.com/?q=ITC+Grand+Chola+Chennai'
    }
];

let guideItems = [...DEMO_GUIDE_ITEMS];
let currentCategory = 'all';

export async function initCityGuide() {
    const grid = document.getElementById('cityguide-grid');
    const tabContainer = document.getElementById('cityguide-tabs');
    if (!grid) return;

    // Load from API or fallback
    await loadGuide();

    // Tab filter listeners
    if (tabContainer) {
        tabContainer.querySelectorAll('.cityguide-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabContainer.querySelectorAll('.cityguide-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.getAttribute('data-category') || 'all';
                renderGrid();
            });
        });
    }
}

async function loadGuide() {
    try {
        const data = await weddingApi.getCityGuide();
        if (Array.isArray(data) && data.length > 0) {
            guideItems = data;
        } else if (data && Array.isArray(data.items) && data.items.length > 0) {
            guideItems = data.items;
        }
    } catch {
        // Use demo fallback silently
    }
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('cityguide-grid');
    if (!grid) return;

    const filtered = currentCategory === 'all'
        ? guideItems
        : guideItems.filter(item => item.category === currentCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No recommendations found in this category.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <article class="cityguide-card">
            <div class="cityguide-card-img">
                <span class="cityguide-emoji" aria-hidden="true">${item.emoji || '✨'}</span>
            </div>
            <div class="cityguide-card-body">
                <span class="badge badge-accent" style="font-size: 10px; margin-bottom: 8px; display: inline-block;">${escapeHtml(item.category_label || item.category || 'Guide')}</span>
                <h3 class="cityguide-card-name">${escapeHtml(item.name)}</h3>
                <p class="cityguide-card-desc">${escapeHtml(item.description)}</p>
                <div class="cityguide-card-meta">
                    <span class="cityguide-distance">📍 ${escapeHtml(item.distance || item.address || '')}</span>
                    ${item.map_url ? `<a href="${item.map_url}" target="_blank" rel="noopener noreferrer" class="btn-text" style="font-size: 11px;">Directions ↗</a>` : ''}
                </div>
            </div>
        </article>
    `).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
