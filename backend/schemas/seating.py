from typing import List, Optional
from pydantic import BaseModel

class SeatingFinderResponse(BaseModel):
    guest_name: str
    table_number: int
    table_name: Optional[str] = None
    companions: Optional[List[str]] = []
