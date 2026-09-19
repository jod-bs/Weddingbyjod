# JOD Weddings — Luxury Wedding Website Platform
> **"Not just a wedding website. Your wedding, online."**

A bespoke, digital wedding experience built for **Krithish & Priya** celebrating their wedding in Chennai and Mahabalipuram on **September 12, 2026**.

Designed to look and feel like a **luxury printed physical wedding invitation transformed into an interactive digital experience**.

---

## ✨ Key Features & Architecture

### 🎨 Design System & Visual Aesthetics
- **Bespoke Palette**: Obsidian (`#11100F`), Champagne Cream (`#F5EFE4`), Brushed Gold (`#C9A96E`), Warm Earth (`#8C6A55`), and Crisp White (`#FFFFFF`).
- **Dynamic Theme Engine**: Light and dark modes with persisted preference (`localStorage`) and system media query listener.
- **Editorial Typography**: Cormorant Garamond (refined headings), DM Sans (modern body), and Great Vibes (flourished script accents).
- **Responsive Architecture**: Tested across mobile-first viewports (360px, 390px, 414px, 430px) through 4K displays.

### 🌟 Interactive Experiences
1. **Editorial Hero Section**: Cinematic photography, staggered fade-up animations, and floating scroll indicator.
2. **Auspicious Countdown**: High-precision flip countdown with graceful transition to celebratory post-wedding state ("We are married! ✨").
3. **Our Love Story Timeline**: Scroll-triggered IntersectionObserver timeline detailing the journey from Amethyst Cafe in 2021 to the Shoreline Proposal in Mahabalipuram.
4. **Celebration Journey & Itinerary**: Interactive event cards for Mehendi, Sangeet, Wedding Ceremony, and Reception with dress codes, color swatches, venue details, and "Add to Calendar" (.ics generation).
5. **Venue & Travel Guide**: Distance from Chennai airport, valet notes, and shuttle schedules with direct Google Maps routing.
6. **Bespoke RSVP Engine**: Guest list lookup with party counter, dietary preferences (Traditional South Indian, Jain, Non-Veg, Vegan), special wishes, and confirmation toast notifications.
7. **Reception Seating Finder**: Instant table locator displaying table name, badge, and fellow table companions.
8. **Live Wedding Day Companion**: Real-time event progression tracker, direct map links, and a built-in **Simulation Toggle** to experience the live day mode.
9. **Guest Photo Gallery & Lightbox**: Masonry photo wall, drag-and-drop file upload with live preview, and full-screen lightbox with keyboard navigation.
10. **Digital Guestbook**: Public message board with heartfelt wishes and real-time card addition animations.
11. **Chennai & Mahabalipuram Travel Guide**: Categorized recommendations (Stays, Iconic Dining, UNESCO Sights, Wellness Spas) with distance chips.
12. **AI Wedding Concierge**: Floating 24/7 assistant providing instant answers on dress codes, directions, timings, and accommodations with quick prompt chips.
13. **Personalized Guest Invite Page (`invite.html`)**: Token-based personal invitations with invited ceremonies checklist, reserved party size, and table assignment.

---

## 🛠️ Technology Stack

- **Frontend**: Pure Semantic HTML5, Vanilla CSS3 (Custom properties, grid, flexbox, animations), Vanilla ES Modules (Zero frameworks — no React/Vue/Tailwind/Bootstrap).
- **Backend**: Python FastAPI with Pydantic validation and modular routers.
- **Database**: PostgreSQL with SQLAlchemy ORM and seamless in-memory fallback when offline.
- **Serving**: FastAPI serves both the REST API at `/api` and the static frontend at `/`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- (Optional) PostgreSQL 14+

### 2. Running Locally with FastAPI
From the project root:

```bash
# Optional: create and activate virtual environment
python -m venv venv
venv\Scripts\activate   # On Windows
source venv/bin/activate # On macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Run server (serves frontend at http://localhost:8000)
python -m backend.main
```

Then open your browser to:
- **Main Wedding Website**: [http://localhost:8000/](http://localhost:8000/)
- **Personalized Guest Invitation**: [http://localhost:8000/invite.html?token=kp-ramesh-101](http://localhost:8000/invite.html?token=kp-ramesh-101)
- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Demo / Offline Mode
The frontend is completely self-contained with offline fallback data:
- If running without a backend, you can directly open `frontend/index.html` in any modern web browser or live server. All interactive modules (RSVP, Seating, Gallery, Guestbook, Concierge, Day Mode) function smoothly with fallback data.

---

## 📂 Project Directory Structure

```
d:/JOD-Weddings/
├── backend/
│   ├── database/
│   │   ├── connection.py     # Database engine & fallback connector
│   │   ├── models.py         # SQLAlchemy relational models
│   │   └── seed.py           # Seed data for Krithish & Priya
│   ├── routes/
│   │   ├── weddings.py       # Wedding details & events endpoints
│   │   ├── guests.py         # Guest search & token lookup
│   │   ├── rsvp.py           # RSVP submission & updates
│   │   ├── seating.py        # Seating finder
│   │   ├── gallery.py        # Photo gallery & uploads
│   │   ├── guestbook.py      # Digital guestbook wall
│   │   └── concierge.py      # AI Concierge question endpoint
│   ├── schemas/              # Pydantic request/response schemas
│   ├── services/             # Core business logic & in-memory stores
│   ├── config.py             # App environment configuration
│   ├── main.py               # FastAPI entrypoint & static mount
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment template
│
├── frontend/
│   ├── assets/
│   │   ├── images/           # High-resolution wedding assets
│   │   └── uploads/          # User-uploaded guest photos
│   ├── css/
│   │   ├── design-system.css # Colors, typography, spacing, utilities
│   │   ├── components.css    # Buttons, cards, modals, forms, toasts
│   │   ├── sections.css      # Section-specific styles
│   │   └── responsive.css    # Responsive breakpoints (360px - 1920px)
│   ├── js/
│   │   ├── api.js            # Centralized API client
│   │   ├── theme.js          # Light/Dark mode switcher
│   │   ├── navigation.js     # Sticky header & mobile menu
│   │   ├── countdown.js      # Auspicious countdown clock
│   │   ├── story.js          # IntersectionObserver scroll reveal
│   │   ├── events.js         # Events journey, modal, dress code
│   │   ├── rsvp.js           # Guest search & RSVP confirmation
│   │   ├── seating.js        # Table & companion locator
│   │   ├── weddingday.js     # Live companion & simulation toggle
│   │   ├── gallery.js        # Photo masonry, drag-and-drop upload, lightbox
│   │   ├── guestbook.js      # Digital guestbook wall & form
│   │   ├── cityguide.js      # Chennai & Mahabalipuram guide
│   │   ├── concierge.js      # Interactive AI chat assistant
│   │   └── main.js           # Application bootstrapper & toasts
│   ├── index.html            # Flagship single-page wedding website
│   └── invite.html           # Bespoke guest invite card
│
└── README.md
```

---

## 💍 Celebration Details
- **Couple**: Krithish & Priya
- **Wedding Date**: September 12, 2026
- **Celebrations**:
  - **Mehendi**: September 10, 2026 (Grand Ballroom, ITC Grand Chola)
  - **Sangeet**: September 11, 2026 (Crystal Hall, ITC Grand Chola)
  - **Wedding Ceremony**: September 12, 2026 (Temple Gardens, Mahabalipuram)
  - **Grand Reception**: September 12, 2026 (Grand Ballroom, ITC Grand Chola)
