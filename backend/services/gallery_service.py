import datetime
import shutil
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import UploadFile
from sqlalchemy.orm import Session
from backend.config import settings
from backend.database.seed import SEED_PHOTOS

class GalleryService:
    def __init__(self):
        self.photos: List[Dict[str, Any]] = list(SEED_PHOTOS)

    def get_photos(self, db: Optional[Session], page: int = 1) -> List[Dict[str, Any]]:
        return self.photos

    async def upload_photo(
        self,
        db: Optional[Session],
        file: UploadFile,
        guest_name: str,
        caption: str
    ) -> Dict[str, Any]:
        # Save file to upload directory
        ext = Path(file.filename or "upload.jpg").suffix or ".jpg"
        unique_name = f"photo_{int(datetime.datetime.utcnow().timestamp())}{ext}"
        destination = settings.UPLOAD_DIR / unique_name

        try:
            with open(destination, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            file_url = f"/assets/uploads/{unique_name}"
        except Exception:
            # Fallback relative asset if disk write has permissions issue
            file_url = "assets/images/hero-couple.jpg"

        new_record = {
            "id": len(self.photos) + 1,
            "image_url": file_url,
            "caption": caption,
            "guest_name": guest_name or "Wedding Guest",
            "created_at": datetime.datetime.utcnow().isoformat(),
            "is_approved": True
        }
        self.photos.insert(0, new_record)
        return new_record

gallery_service = GalleryService()
