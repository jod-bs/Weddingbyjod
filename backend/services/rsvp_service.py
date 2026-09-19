import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from backend.schemas.rsvp import RSVPSubmitRequest

class RSVPService:
    def __init__(self):
        self.rsvps: List[Dict[str, Any]] = []

    def submit_rsvp(self, db: Optional[Session], data: RSVPSubmitRequest) -> Dict[str, Any]:
        rsvp_record = {
            "id": len(self.rsvps) + 1,
            "guest_id": data.guest_id,
            "guest_name": data.guest_name,
            "attending": data.attending,
            "guest_count": data.guest_count,
            "meal_preference": data.meal_preference,
            "notes": data.notes,
            "created_at": datetime.datetime.utcnow().isoformat(),
            "message": "RSVP successfully recorded! Thank you for celebrating with us."
        }
        self.rsvps.append(rsvp_record)
        return rsvp_record

    def update_rsvp(self, db: Optional[Session], rsvp_id: int, data: RSVPSubmitRequest) -> Dict[str, Any]:
        for r in self.rsvps:
            if r["id"] == rsvp_id:
                r["attending"] = data.attending
                r["guest_count"] = data.guest_count
                r["meal_preference"] = data.meal_preference
                r["notes"] = data.notes
                return r
        return self.submit_rsvp(db, data)

rsvp_service = RSVPService()
