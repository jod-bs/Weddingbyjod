from typing import List, Optional
from pydantic import BaseModel

class GuestResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    token: str
    max_guests: int = 2
    custom_message: Optional[str] = None
    invited_events: Optional[List[str]] = None
    is_vip: bool = False
    table_number: Optional[int] = None
    table_name: Optional[str] = None
