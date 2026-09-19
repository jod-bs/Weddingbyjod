from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.services.wedding_service import wedding_service

router = APIRouter(prefix="/api/weddings", tags=["Weddings"])

@router.get("/{slug}")
def get_wedding_details(slug: str, db: Session = Depends(get_db)):
    return wedding_service.get_wedding(db, slug)

@router.get("/{slug}/events")
def get_wedding_events(slug: str, db: Session = Depends(get_db)):
    return wedding_service.get_events(db, slug)

@router.get("/{slug}/story")
def get_wedding_story(slug: str, db: Session = Depends(get_db)):
    return wedding_service.get_story(db, slug)

@router.get("/{slug}/venue")
def get_wedding_venue(slug: str, db: Session = Depends(get_db)):
    return wedding_service.get_venue(db, slug)

@router.get("/{slug}/faqs")
def get_wedding_faqs(slug: str, db: Session = Depends(get_db)):
    return wedding_service.get_faqs(db, slug)

@router.get("/{slug}/city-guide")
def get_wedding_city_guide(slug: str, db: Session = Depends(get_db)):
    return wedding_service.get_city_guide(db, slug)
