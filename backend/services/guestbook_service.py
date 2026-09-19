import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.schemas.guestbook import GuestbookCreateRequest
from backend.database.seed import SEED_GUESTBOOK

class GuestbookService:
    def __init__(self):
        self.messages: List[Dict[str, Any]] = list(SEED_GUESTBOOK)

    def get_messages(self, db: Optional[Session]) -> List[Dict[str, Any]]:
        return self.messages

    def add_message(self, db: Optional[Session], data: GuestbookCreateRequest) -> Dict[str, Any]:
        new_msg = {
            "id": len(self.messages) + 1,
            "author_name": data.author_name,
            "relation": data.relation or "",
            "message": data.message,
            "created_at": datetime.datetime.utcnow().isoformat(),
            "is_approved": True
        }
        self.messages.insert(0, new_msg)
        return new_msg

guestbook_service = GuestbookService()
