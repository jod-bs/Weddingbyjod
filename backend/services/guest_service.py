from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from backend.database.seed import SEED_GUESTS

class GuestService:
    def __init__(self):
        self.guests: List[Dict[str, Any]] = list(SEED_GUESTS)

    def search_guests(self, db: Optional[Session], query: str) -> List[Dict[str, Any]]:
        query_clean = query.strip().lower()
        results = [
            g for g in self.guests
            if query_clean in g["name"].lower()
        ]
        return results

    def get_by_token(self, db: Optional[Session], token: str) -> Optional[Dict[str, Any]]:
        for g in self.guests:
            if g.get("token") == token:
                return g
        return None

guest_service = GuestService()
