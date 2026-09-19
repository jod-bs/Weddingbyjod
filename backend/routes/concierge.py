from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.concierge_service import concierge_service

router = APIRouter(prefix="/api/concierge", tags=["Concierge"])

class ConciergeAskRequest(BaseModel):
    question: str
    context: Optional[Dict[str, Any]] = None

class ConciergeAskResponse(BaseModel):
    answer: str

@router.post("/ask", response_model=ConciergeAskResponse)
def ask_concierge(data: ConciergeAskRequest):
    answer = concierge_service.answer_question(data.question, data.context)
    return ConciergeAskResponse(answer=answer)
