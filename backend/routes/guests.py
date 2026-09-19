from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.services.guest_service import guest_service

router = APIRouter(prefix="/api/guests", tags=["Guests"])

@router.get("/search")
def search_guest(name: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    results = guest_service.search_guests(db, name)
    if not results:
        raise HTTPException(status_code=404, detail="Guest not found on invitation list.")
    return results

@router.get("/{token}")
def get_guest_by_token(token: str, db: Session = Depends(get_db)):
    guest = guest_service.get_by_token(db, token)
    if not guest:
        raise HTTPException(status_code=404, detail="Invalid or expired guest invitation token.")
    return guest
