from fastapi import APIRouter, Depends, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.services.gallery_service import gallery_service

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])

@router.get("")
def get_gallery_photos(page: int = Query(1, ge=1), db: Session = Depends(get_db)):
    return gallery_service.get_photos(db, page)

@router.post("/upload")
async def upload_gallery_photo(
    file: UploadFile = File(...),
    guest_name: str = Form("Wedding Guest"),
    caption: str = Form(""),
    db: Session = Depends(get_db)
):
    return await gallery_service.upload_photo(db, file, guest_name, caption)
