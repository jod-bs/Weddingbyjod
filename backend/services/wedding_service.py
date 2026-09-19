from typing import Optional
from sqlalchemy.orm import Session
from backend.database.seed import (
    SEED_WEDDING,
    SEED_EVENTS,
    SEED_CITY_GUIDE,
    SEED_FAQS
)

class WeddingService:
    def get_wedding(self, db: Optional[Session], slug: str):
        # Database query if DB connected
        if db:
            # can query models.Wedding
            pass
        # Graceful seed fallback
        return SEED_WEDDING

    def get_events(self, db: Optional[Session], slug: str):
        if db:
            pass
        return SEED_EVENTS

    def get_story(self, db: Optional[Session], slug: str):
        return SEED_WEDDING.get("story", [])

    def get_venue(self, db: Optional[Session], slug: str):
        return {
            "venue_name": SEED_WEDDING["venue_name"],
            "venue_address": SEED_WEDDING["venue_address"],
            "city": "Chennai",
            "state": "Tamil Nadu",
            "country": "India"
        }

    def get_faqs(self, db: Optional[Session], slug: str):
        return SEED_FAQS

    def get_city_guide(self, db: Optional[Session], slug: str):
        return SEED_CITY_GUIDE

wedding_service = WeddingService()
