from typing import Optional
from pydantic import BaseModel

class RSVPSubmitRequest(BaseModel):
    wedding_slug: Optional[str] = "krithish-priya"
    guest_id: Optional[int] = None
    guest_name: str
    token: Optional[str] = None
    attending: bool
    guest_count: int = 1
    meal_preference: Optional[str] = "veg"
    notes: Optional[str] = None

class RSVPResponse(BaseModel):
    id: int
    guest_id: Optional[int] = None
    guest_name: str
    attending: bool
    guest_count: int
    meal_preference: Optional[str] = "veg"
    notes: Optional[str] = None
    message: str = "RSVP confirmed successfully"
