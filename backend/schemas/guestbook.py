from typing import Optional
from pydantic import BaseModel

class GuestbookCreateRequest(BaseModel):
    author_name: str
    relation: Optional[str] = None
    message: str
    wedding_slug: Optional[str] = "krithish-priya"

class GuestbookMessageResponse(BaseModel):
    id: int
    author_name: str
    relation: Optional[str] = None
    message: str
    created_at: str
