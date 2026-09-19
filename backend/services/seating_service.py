from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from backend.database.seed import SEED_GUESTS

class SeatingService:
    def __init__(self):
        self.guests: List[Dict[str, Any]] = list(SEED_GUESTS)

    def find_seat(self, db: Optional[Session], name: str) -> Optional[Dict[str, Any]]:
        name_clean = name.strip().lower()
        matched = None
        for g in self.guests:
            if name_clean in g["name"].lower():
                matched = g
                break

        if not matched or not matched.get("table_number"):
            return None

        # Find companions at the same table
        table_num = matched["table_number"]
        companions = [
            other["name"] for other in self.guests
            if other.get("table_number") == table_num and other["id"] != matched["id"]
        ]

        return {
            "guest_name": matched["name"],
            "table_number": table_num,
            "table_name": matched.get("table_name", f"Table {table_num}"),
            "companions": companions
        }

    def get_by_token(self, db: Optional[Session], token: str) -> Optional[Dict[str, Any]]:
        for g in self.guests:
            if g.get("token") == token:
                return self.find_seat(db, g["name"])
        return None

seating_service = SeatingService()
