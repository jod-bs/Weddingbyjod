from typing import Optional
from pydantic import BaseModel

class PhotoResponse(BaseModel):
    id: int
    image_url: str
    caption: Optional[str] = None
    guest_name: Optional[str] = "Wedding Guest"
    created_at: Optional[str] = None
    is_approved: bool = True
