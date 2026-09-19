from typing import Optional, List, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from backend.database.seed import SEED_JOD_PLANS, SEED_JOD_HISTORY, SEED_JOD_SERVICES

router = APIRouter(prefix="/api/platform", tags=["JOD-Weddings Platform"])

inquiries_store: List[Dict[str, Any]] = []

class InquiryRequest(BaseModel):
    client_name: str
    phone: str
    email: Optional[str] = None
    wedding_city: Optional[str] = None
    tentative_date: Optional[str] = None
    estimated_guests: Optional[str] = None
    preferred_plan: Optional[str] = "The Royal Heritage Plan"
    notes: Optional[str] = None

class InquiryResponse(BaseModel):
    id: int
    message: str
    status: str = "received"

@router.get("/plans")
def get_plans():
    return SEED_JOD_PLANS

@router.get("/history")
def get_history():
    return SEED_JOD_HISTORY

@router.get("/services")
def get_services():
    return SEED_JOD_SERVICES

@router.post("/inquiry", response_model=InquiryResponse)
def submit_inquiry(data: InquiryRequest):
    inquiry = {
        "id": len(inquiries_store) + 1,
        **data.model_dump()
    }
    inquiries_store.append(inquiry)
    return InquiryResponse(
        id=inquiry["id"],
        message="Thank you! A senior JOD-Weddings luxury planner will contact you within 24 hours.",
        status="received"
    )
