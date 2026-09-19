from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.schemas.seating import SeatingFinderResponse
from backend.services.seating_service import seating_service

router = APIRouter(prefix="/api/seating", tags=["Seating"])

@router.get("/find", response_model=SeatingFinderResponse)
def find_seating(name: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    result = seating_service.find_seat(db, name)
    if not result:
        raise HTTPException(status_code=404, detail="No seating assignment found for this guest.")
    return result

@router.get("/{token}", response_model=SeatingFinderResponse)
def get_seating_by_token(token: str, db: Session = Depends(get_db)):
    result = seating_service.get_by_token(db, token)
    if not result:
        raise HTTPException(status_code=404, detail="No seating assignment found for this invitation token.")
    return result
