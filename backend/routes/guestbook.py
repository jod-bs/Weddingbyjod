from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.schemas.guestbook import GuestbookCreateRequest, GuestbookMessageResponse
from backend.services.guestbook_service import guestbook_service

router = APIRouter(prefix="/api/guestbook", tags=["Guestbook"])

@router.get("")
def get_guestbook_messages(db: Session = Depends(get_db)):
    return guestbook_service.get_messages(db)

@router.post("", response_model=GuestbookMessageResponse)
def add_guestbook_message(data: GuestbookCreateRequest, db: Session = Depends(get_db)):
    return guestbook_service.add_message(db, data)
