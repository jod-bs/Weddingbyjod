from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class EventResponse(BaseModel):
    id: int
    wedding_slug: Optional[str] = "krithish-priya"
    name: str
    date: str
    time: str
    end_time: Optional[str] = None
    venue: str
    address: Optional[str] = None
    description: Optional[str] = None
    dress_code: Optional[str] = None
    dress_colors: Optional[List[str]] = None
    dress_note: Optional[str] = None
    image: Optional[str] = None
    image_url: Optional[str] = None
    map_url: Optional[str] = None

class StoryItem(BaseModel):
    year: str
    title: str
    text: str
    location: Optional[str] = None
    image: Optional[str] = None

class WeddingResponse(BaseModel):
    id: int
    slug: str
    couple_names: str
    partner1_name: str
    partner2_name: str
    wedding_date: str
    venue_name: str
    venue_address: str
    story: Optional[List[Dict[str, Any]]] = None
    details: Optional[Dict[str, Any]] = None

class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str

class CityGuideItemResponse(BaseModel):
    id: int
    name: str
    category: str
    category_label: Optional[str] = None
    emoji: Optional[str] = None
    description: Optional[str] = None
    distance: Optional[str] = None
    address: Optional[str] = None
    map_url: Optional[str] = None
