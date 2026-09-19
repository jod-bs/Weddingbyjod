from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.schemas.rsvp import RSVPSubmitRequest, RSVPResponse
from backend.services.rsvp_service import rsvp_service

router = APIRouter(prefix="/api/rsvp", tags=["RSVP"])

@router.post("", response_model=RSVPResponse)
def submit_rsvp(data: RSVPSubmitRequest, db: Session = Depends(get_db)):
    return rsvp_service.submit_rsvp(db, data)

@router.put("/{rsvp_id}", response_model=RSVPResponse)
def update_rsvp(rsvp_id: int, data: RSVPSubmitRequest, db: Session = Depends(get_db)):
    return rsvp_service.update_rsvp(db, rsvp_id, data)
