"""Seed data and in-memory store for JOD-Weddings Platform and Anadaraman & Prathiksha Sri's Wedding."""

# ─── JOD-WEDDINGS PLATFORM DATA ──────────────────────────────

SEED_JOD_HISTORY = {
    "founded_year": 2009,
    "founder": "JOD Luxury Hospitality Group",
    "headline": "Over 15 Years of Crafting Regal & Unforgettable Celebrations",
    "story": (
        "Founded in 2009 in Chennai and expanding to Rajasthan, Kerala, and Dubai, "
        "JOD-Weddings was born with a single vision: to elevate traditional Indian weddings "
        "into world-class sensory celebrations. Over the last decade and a half, JOD-Weddings "
        "has designed and managed more than 350 bespoke weddings across 24 global destinations, "
        "seamlessly harmonizing ancient cultural rituals with modern architectural scenography, "
        "Michelin-inspired royal catering, and industry-first digital guest experiences."
    ),
    "milestones": [
        {
            "year": "2009",
            "title": "The Genesis in Chennai",
            "description": "Founded by a collective of luxury hoteliers, architectural designers, and temple artists to bring royal aesthetics to contemporary weddings."
        },
        {
            "year": "2014",
            "title": "Expansion into Destination Celebrations",
            "description": "Produced our first flagship coastal destination wedding in Mahabalipuram and palace wedding in Udaipur, establishing our signature beachside and royal pavilions."
        },
        {
            "year": "2019",
            "title": "Pioneering the Digital Guest Companion",
            "description": "Launched the first proprietary digital wedding companion platform in South Asia, merging physical luxury invites with interactive digital guestbooks and AI concierges."
        },
        {
            "year": "2024 - Present",
            "title": "Global Presence & Modern Heritage",
            "description": "Managing high-profile celebrity and heritage weddings across Chennai, Mahabalipuram, Jaipur, Bali, and Dubai with 100% bespoke planning."
        }
    ],
    "stats": [
        {"value": "350+", "label": "Luxury Weddings Planned"},
        {"value": "24+", "label": "Global Destinations"},
        {"value": "99.4%", "label": "Client Satisfaction"},
        {"value": "15+", "label": "Years of Heritage"}
    ]
}

SEED_JOD_PLANS = [
    {
        "id": "royal-heritage",
        "name": "The Royal Heritage Plan",
        "badge": "Signature Classic",
        "tagline": "Traditional Grandeur & Palatial Rituals",
        "price_range": "Bespoke Curation",
        "description": "Designed for families seeking timeless South Indian and North Indian royal traditions. Complete curation of temple ceremonies, authentic Kalyana Sappadu, antique brass and jasmine scenography.",
        "features": [
            "End-to-end wedding planning & timeline choreography",
            "Temple architecture & authentic floral mandap scenography",
            "Vedic priest & authentic classical Carnatic / Shehnai artists",
            "Curated traditional banana-leaf feast & artisanal dining",
            "Guest logistics, airport protocol & royal welcome entourage",
            "Full digital invitation suite & RSVP tracking"
        ],
        "ideal_for": "Palatial hotels, heritage resorts, and traditional temple weddings."
    },
    {
        "id": "coastal-grandeur",
        "name": "The Coastal Grandeur Plan",
        "badge": "Destination Special",
        "tagline": "Sea Breeze, Amber Sunsets & Coastal Romance",
        "price_range": "Destination Luxury",
        "description": "Perfect for coastal destination weddings in Mahabalipuram, ECR Chennai, Goa, or Sri Lanka. Marrying breezy oceanside aesthetics with opulent evening lighting and beach banquets.",
        "features": [
            "Beachfront mandap & weather-proof coastal production",
            "Multi-venue shuttle & luxury fleet transportation",
            "Sunset Mehendi by the shore & sundowner Sangeet stages",
            "Fresh coastal seafood & international fine-dining counters",
            "Resort accommodation blocks & round-the-clock hospitality desks",
            "Live Wedding Day companion mode for all guests"
        ],
        "ideal_for": "Beachside resorts, private coastal villas, and oceanfront sanctuaries."
    },
    {
        "id": "bespoke-imperial",
        "name": "The Bespoke Imperial Suite",
        "badge": "Ultra Luxury",
        "tagline": "The Pinnacle of Personalized Wedding Architecture",
        "price_range": "Private Consultation",
        "description": "Our most exclusive offering. An all-inclusive masterclass in wedding architecture, celebrity entertainment, international floral imports, Michelin-standard menus, and VIP protocol.",
        "features": [
            "Dedicated senior wedding director & 24/7 hospitality squad",
            "Custom 3D architectural renders & immersive set construction",
            "A-list celebrity artists, choreographers & international bands",
            "Private charter coordination, VIP security & royal car escorts",
            "Bespoke physical luxury stationery & custom digital platform",
            "Bespoke AI Wedding Concierge trained on your exact guest list"
        ],
        "ideal_for": "Multi-day high-profile celebrations with 500+ distinguished guests."
    },
    {
        "id": "digital-companion",
        "name": "Digital Wedding Experience Suite",
        "badge": "Proprietary Tech",
        "tagline": "Your Wedding, Online — The Digital Twin Experience",
        "price_range": "Turnkey Digital",
        "description": "Add our state-of-the-art interactive digital wedding experience to any celebration. Includes digital guestbook, live photo wall, AI concierge, seating finder, and token-based invitations.",
        "features": [
            "Bespoke single-page luxury wedding portal matching your theme",
            "Interactive RSVP engine with multi-event party counters",
            "Reception seating table locator with companion lists",
            "Live wedding-day mode with real-time schedule & directions",
            "Guest photo upload wall & digital blessings guestbook",
            "24/7 AI Wedding Concierge answering guest queries instantly"
        ],
        "ideal_for": "Couples wanting a modern, paperless, ultra-refined guest companion."
    }
]

SEED_JOD_SERVICES = [
    {
        "icon": "🏛️",
        "title": "Scenography & Mandap Architecture",
        "description": "Bespoke structural design, imperial floral installations, atmospheric light programming, and thematic stage architecture."
    },
    {
        "icon": "🚗",
        "title": "Guest Hospitality & Luxury Logistics",
        "description": "Chauffeur fleets, airport welcome protocols, hotel check-in concierges, and continuous inter-venue shuttles."
    },
    {
        "icon": "🍽️",
        "title": "Culinary Curation & Royal Feasts",
        "description": "Authentic regional masters, traditional banana-leaf Kalyana Sappadu, and international gourmet live cooking stations."
    },
    {
        "icon": "📱",
        "title": "Proprietary Digital Guest Experience",
        "description": "Tailored digital invitation suite, automated RSVP tracking, seating assignment finder, and live wedding-day mobile guide."
    },
    {
        "icon": "🎵",
        "title": "Entertainment & Cultural Choreography",
        "description": "Sangeet production, celebrity artists, classical Carnatic ensembles, traditional nadaswaram troupes, and DJ stages."
    },
    {
        "icon": "📸",
        "title": "Fine Art Cinematography & Keepsakes",
        "description": "Award-winning wedding photojournalism, 4K cinematic wedding films, same-day highlight reels, and heirloom albums."
    }
]

# ─── CURRENT FEATURED WEDDING: ANADARAMAN & PRATHISHA ─────────

SEED_WEDDING = {
    "id": 1,
    "slug": "anadaraman-prathisha",
    "couple_names": "Anadaraman & Prathiksha Sri",
    "partner1_name": "Anadaraman",
    "partner2_name": "Prathiksha Sri",
    "wedding_date": "2026-09-12",
    "venue_name": "ITC Grand Chola & Temple Gardens",
    "venue_address": "63 Mount Poonamallee Road, Guindy, Chennai, Tamil Nadu 600089",
    "story": [
        {
            "year": "Autumn 2021",
            "title": "A Serendipitous Hello",
            "text": "What was meant to be a brisk twenty-minute coffee at Amethyst in Chennai turned into four hours of sharing family traditions, favourite books, and childhood dreams. By sunset, both knew something extraordinary had begun.",
            "location": "Amethyst Cafe, Chennai",
            "image": "assets/images/event-mehendi.jpg"
        },
        {
            "year": "Winter 2023",
            "title": "Adventures & Shared Dreams",
            "text": "From spontaneous weekend drives along East Coast Road to discovering old temple towns and debating classical vs. indie music, each journey wove their families and lives closer together.",
            "location": "East Coast Road, Tamil Nadu",
            "image": "assets/images/event-sangeet.jpg"
        },
        {
            "year": "December 2025",
            "title": "The Shoreline Proposal",
            "text": "As the golden hour painted the 8th-century Shore Temple in shades of amber and rose, Anadaraman asked Prathiksha Sri to walk hand-in-hand forever. With tears of joy and the Bay of Bengal applauding, she said yes.",
            "location": "Shore Temple, Mahabalipuram",
            "image": "assets/images/event-wedding.jpg"
        },
        {
            "year": "September 2026",
            "title": "Forever Begins",
            "text": "Surrounded by the warmth of cherished family, lifelong friends, and the sacred fire, we begin our new life together. Thank you for walking this blessed path with us.",
            "location": "Temple Gardens • ITC Grand Chola",
            "image": "assets/images/event-reception.jpg"
        }
    ],
    "details": {
        "hashtag": "#AnadaramanWedsPrathiksha Sri",
        "primary_contact": "+91 98765 43210",
        "emergency_desk": "ITC Grand Chola Hospitality Desk, Ground Floor"
    }
}

SEED_EVENTS = [
    {
        "id": 1,
        "wedding_slug": "anadaraman-prathisha",
        "name": "Mehendi",
        "date": "2026-09-10",
        "time": "10:00 AM",
        "end_time": "5:00 PM",
        "venue": "Grand Ballroom, ITC Grand Chola",
        "address": "Nandambakkam Post, Mount Poonamallee Road, Chennai, TN 600089",
        "description": "A vibrant celebration of art, colour, and tradition. Join us as Prathiksha Sri's hands are adorned with intricate henna designs, surrounded by music, laughter, and loved ones.",
        "dress_code": "Pastel / Floral",
        "dress_colors": ["#F9C5C5", "#C5E5F9", "#C5F9D1", "#F9ECC5", "#DCC5F9"],
        "dress_note": "Light, comfortable, and colourful outfits are recommended. Avoid all-white and all-black.",
        "image": "assets/images/event-mehendi.jpg",
        "map_url": "https://maps.google.com/?q=ITC+Grand+Chola+Chennai"
    },
    {
        "id": 2,
        "wedding_slug": "anadaraman-prathisha",
        "name": "Sangeet",
        "date": "2026-09-11",
        "time": "7:00 PM",
        "end_time": "11:30 PM",
        "venue": "Crystal Hall, ITC Grand Chola",
        "address": "Nandambakkam Post, Mount Poonamallee Road, Chennai, TN 600089",
        "description": "An evening of music, dance, and celebration as both families come together to sing and dance for the couple. Expect stunning performances, great food, and unforgettable moments.",
        "dress_code": "Cocktail / Festive Indian",
        "dress_colors": ["#8B2FC9", "#C92F6B", "#2FC98B", "#C9882F", "#2F8BC9"],
        "dress_note": "Smart formal or traditional Indian attire. Bold and vibrant colours are encouraged.",
        "image": "assets/images/event-sangeet.jpg",
        "map_url": "https://maps.google.com/?q=ITC+Grand+Chola+Chennai"
    },
    {
        "id": 3,
        "wedding_slug": "anadaraman-prathisha",
        "name": "Wedding Ceremony",
        "date": "2026-09-12",
        "time": "9:30 AM",
        "end_time": "1:00 PM",
        "venue": "Temple Gardens, Mahabalipuram",
        "address": "Shore Temple Road, Mahabalipuram, Tamil Nadu 603104",
        "description": "The sacred union of Anadaraman and Prathiksha Sri in a traditional South Indian Hindu ceremony. Witness the ancient rituals that have joined generations of families across centuries.",
        "dress_code": "Traditional Indian / Saree / Sherwani",
        "dress_colors": ["#F5E6C8", "#C8D4F5", "#F5C8C8", "#C8F5E6", "#F5C8E6"],
        "dress_note": "Traditional attire strongly preferred. Please arrive by 9:00 AM. Saree or formal salwar for women, kurta/sherwani for men.",
        "image": "assets/images/event-wedding.jpg",
        "map_url": "https://maps.google.com/?q=Mahabalipuram+Shore+Temple"
    },
    {
        "id": 4,
        "wedding_slug": "anadaraman-prathisha",
        "name": "Reception",
        "date": "2026-09-12",
        "time": "7:30 PM",
        "end_time": "11:00 PM",
        "venue": "Grand Ballroom, ITC Grand Chola",
        "address": "Nandambakkam Post, Mount Poonamallee Road, Chennai, TN 600089",
        "description": "Join us for an elegant evening of dining, speeches, and celebration as Anadaraman and Prathiksha Sri make their grand entrance as a married couple.",
        "dress_code": "Formal / Black Tie / Indo-Western",
        "dress_colors": ["#11100F", "#C9A96E", "#8C6A55", "#F5EFE4", "#3D3A37"],
        "dress_note": "Formal evening wear. Tuxedos, suits, evening gowns, or elegant Indian formals welcome.",
        "image": "assets/images/event-reception.jpg",
        "map_url": "https://maps.google.com/?q=ITC+Grand+Chola+Chennai"
    }
]

SEED_GUESTS = [
    {
        "id": 1,
        "name": "Ramesh Kumar",
        "email": "ramesh.kumar@example.com",
        "phone": "+91 98401 23456",
        "token": "kp-ramesh-101",
        "max_guests": 4,
        "custom_message": "Dearest Ramesh Uncle & Family, we cannot imagine our wedding day without your laughter and blessings!",
        "invited_events": ["mehendi", "sangeet", "ceremony", "reception"],
        "is_vip": True,
        "table_number": 12,
        "table_name": "The Royal Jasmine Table"
    },
    {
        "id": 2,
        "name": "Ananya Sharma",
        "email": "ananya.sharma@example.com",
        "phone": "+91 98402 34567",
        "token": "kp-ananya-102",
        "max_guests": 2,
        "custom_message": "Ananya! You have been there since our very first date. Get ready to dance non-stop at the Sangeet!",
        "invited_events": ["mehendi", "sangeet", "ceremony", "reception"],
        "is_vip": False,
        "table_number": 5,
        "table_name": "Temple Lotus"
    },
    {
        "id": 3,
        "name": "Rahul Verma",
        "email": "rahul.verma@example.com",
        "phone": "+91 98403 45678",
        "token": "kp-rahul-103",
        "max_guests": 2,
        "custom_message": "Brother Rahul, your choreography for the Sangeet better be top notch! Can't wait to celebrate.",
        "invited_events": ["sangeet", "ceremony", "reception"],
        "is_vip": False,
        "table_number": 8,
        "table_name": "Carnatic Strings"
    },
    {
        "id": 4,
        "name": "Venkatesh Rao",
        "email": "venkatesh.rao@example.com",
        "phone": "+91 98404 56789",
        "token": "kp-venkat-104",
        "max_guests": 3,
        "custom_message": "Respected Venkatesh Uncle & Family, your guidance and presence mean the world to us.",
        "invited_events": ["ceremony", "reception"],
        "is_vip": True,
        "table_number": 12,
        "table_name": "The Royal Jasmine Table"
    },
    {
        "id": 5,
        "name": "Sneha Patel",
        "email": "sneha.patel@example.com",
        "phone": "+91 98405 67890",
        "token": "kp-sneha-105",
        "max_guests": 2,
        "custom_message": "Sneha! Welcome to Chennai. So excited to celebrate every moment together with you.",
        "invited_events": ["mehendi", "sangeet", "ceremony", "reception"],
        "is_vip": False,
        "table_number": 7,
        "table_name": "Mahabalipuram Breeze"
    }
]

SEED_PHOTOS = [
    {
        "id": 1,
        "image_url": "assets/images/hero-couple.jpg",
        "caption": "Anadaraman & Prathiksha Sri — Forever begins here",
        "guest_name": "Anadaraman & Prathiksha Sri",
        "created_at": "2026-09-12T10:00:00Z",
        "is_approved": True
    },
    {
        "id": 2,
        "image_url": "assets/images/event-mehendi.jpg",
        "caption": "Colour, laughter & intricate Mehendi magic",
        "guest_name": "Ananya Sharma",
        "created_at": "2026-09-10T14:30:00Z",
        "is_approved": True
    },
    {
        "id": 3,
        "image_url": "assets/images/event-sangeet.jpg",
        "caption": "Unforgettable dance performances and music",
        "guest_name": "Rahul Verma",
        "created_at": "2026-09-11T21:00:00Z",
        "is_approved": True
    },
    {
        "id": 4,
        "image_url": "assets/images/event-wedding.jpg",
        "caption": "The sacred Muhurtham ceremony & divine blessings",
        "guest_name": "Venkatesh Rao",
        "created_at": "2026-09-12T11:15:00Z",
        "is_approved": True
    },
    {
        "id": 5,
        "image_url": "assets/images/event-reception.jpg",
        "caption": "A night of celebration under the chandeliers",
        "guest_name": "Sneha Patel",
        "created_at": "2026-09-12T20:45:00Z",
        "is_approved": True
    }
]

SEED_GUESTBOOK = [
    {
        "id": 1,
        "author_name": "Uncle Ramesh & Rajeshwari",
        "relation": "Groom's Family",
        "message": "Wishing dear Anadaraman and Prathiksha Sri a lifetime of boundless joy, health, and laughter. May your bond grow stronger with each passing dawn!",
        "created_at": "2026-09-12T14:30:00Z"
    },
    {
        "id": 2,
        "author_name": "Ananya & Ashwin",
        "relation": "Bride's Best Friend",
        "message": "From college library study breaks to walking down the aisle — Prathiksha Sri, you look utterly radiant! Anadaraman, welcome to our crazy family. Love you both to pieces!",
        "created_at": "2026-09-12T16:15:00Z"
    },
    {
        "id": 3,
        "author_name": "Siddharth V.",
        "relation": "Anadaraman's Colleague & Friend",
        "message": "The calmest groom and the brightest bride! It was an honour witnessing your beautiful Muhurtham today. Here is to a grand celebration tonight!",
        "created_at": "2026-09-12T18:00:00Z"
    },
    {
        "id": 4,
        "author_name": "Deepa & Madhavan",
        "relation": "Family Friends",
        "message": "May the sacred Agni bless your home with harmony, prosperity, and endless love. Heartiest congratulations to Anadaraman and Prathiksha Sri!",
        "created_at": "2026-09-12T19:45:00Z"
    }
]

SEED_CITY_GUIDE = [
    {
        "id": 1,
        "name": "ITC Grand Chola, Chennai",
        "category": "stay",
        "category_label": "Luxury Stay & Venue",
        "emoji": "🏨",
        "description": "Our primary venue for the Mehendi, Sangeet, and Reception. Inspired by the imperial architecture of the Chola dynasty, offering palatial luxury, grand ballrooms, and multiple award-winning restaurants.",
        "distance": "At Venue (Guindy)",
        "address": "63 Mount Poonamallee Road, Guindy, Chennai",
        "map_url": "https://maps.google.com/?q=ITC+Grand+Chola+Chennai"
    },
    {
        "id": 2,
        "name": "Radisson Resort Temple Bay",
        "category": "stay",
        "category_label": "Beachside Stay",
        "emoji": "🌴",
        "description": "Expansive 27-acre beach resort located right on the Bay of Bengal coastline, only 5 minutes from the Wedding Ceremony venue in Mahabalipuram.",
        "distance": "2 km from Ceremony",
        "address": "57 Covelong Road, Mahabalipuram",
        "map_url": "https://maps.google.com/?q=Radisson+Resort+Temple+Bay+Mahabalipuram"
    },
    {
        "id": 3,
        "name": "Shore Temple & Pancha Rathas",
        "category": "sights",
        "category_label": "UNESCO World Heritage",
        "emoji": "🏛️",
        "description": "7th-century granite monolithic rock temples overlooking the Bay of Bengal. Built during the Pallava dynasty, showcasing the highest achievement of Dravidian temple architecture.",
        "distance": "Adjacent to Ceremony",
        "address": "Shore Temple Road, Mahabalipuram",
        "map_url": "https://maps.google.com/?q=Mahabalipuram+Shore+Temple"
    },
    {
        "id": 4,
        "name": "Murugan Idli Shop",
        "category": "dining",
        "category_label": "Iconic South Indian",
        "emoji": "🥞",
        "description": "World-famous for melt-in-the-mouth steamed idlis, ghee podi dosa, and four varieties of fresh coconut and coriander chutneys served on banana leaves.",
        "distance": "6 km from ITC Chola",
        "address": "Besant Nagar & T. Nagar, Chennai",
        "map_url": "https://maps.google.com/?q=Murugan+Idli+Shop+Chennai"
    },
    {
        "id": 5,
        "name": "DakshinaChitra Heritage Museum",
        "category": "sights",
        "category_label": "Culture & Art",
        "emoji": "🎨",
        "description": "A vibrant open-air living heritage village with 18 authentic historic houses from Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh, with live folk artisans and craft workshops.",
        "distance": "20 km on ECR",
        "address": "East Coast Road, Muttukadu, Chennai",
        "map_url": "https://maps.google.com/?q=DakshinaChitra+Chennai"
    },
    {
        "id": 6,
        "name": "Kaya Kalp — The Royal Spa",
        "category": "salon",
        "category_label": "Wellness & Spa",
        "emoji": "💆",
        "description": "ITC Grand Chola’s 23,000 sq ft signature wellness haven offering indigenous Ayurvedic therapies, restorative massages, and wedding beauty preparation.",
        "distance": "Inside ITC Chola",
        "address": "ITC Grand Chola, Guindy, Chennai",
        "map_url": "https://maps.google.com/?q=ITC+Grand+Chola+Chennai"
    }
]

SEED_FAQS = [
    {
        "id": 1,
        "question": "What should I wear to each event?",
        "answer": "Mehendi: Pastel/Floral. Sangeet: Festive Indian / Cocktail. Ceremony: Traditional South Indian Silk Sarees / Kurta & Dhoti. Reception: Black Tie / Indo-Western Glamour."
    },
    {
        "id": 2,
        "question": "Is transportation provided between venues?",
        "answer": "Yes! Dedicated luxury coaches will depart ITC Grand Chola at 7:30 AM on September 12 to transport guests to Temple Gardens, Mahabalipuram."
    },
    {
        "id": 3,
        "question": "Can I bring boxed gifts?",
        "answer": "Your presence, prayers, and blessings are the greatest gifts we could ever ask for. We kindly request no boxed gifts."
    }
]
