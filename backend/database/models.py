import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.connection import Base

class Wedding(Base):
    __tablename__ = "weddings"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    couple_names = Column(String(200), nullable=False)
    partner1_name = Column(String(100), nullable=False)
    partner2_name = Column(String(100), nullable=False)
    wedding_date = Column(String(50), nullable=False)
    venue_name = Column(String(200), nullable=False)
    venue_address = Column(Text, nullable=False)
    story_json = Column(JSON, nullable=True)
    details_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    events = relationship("Event", back_populates="wedding", cascade="all, delete-orphan")
    guests = relationship("Guest", back_populates="wedding", cascade="all, delete-orphan")
    photos = relationship("Photo", back_populates="wedding", cascade="all, delete-orphan")
    guestbook_messages = relationship("GuestbookMessage", back_populates="wedding", cascade="all, delete-orphan")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    name = Column(String(150), nullable=False)
    slug = Column(String(100), nullable=False)
    date = Column(String(50), nullable=False)
    start_time = Column(String(50), nullable=False)
    end_time = Column(String(50), nullable=True)
    venue = Column(String(200), nullable=False)
    address = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    dress_code = Column(String(100), nullable=True)
    dress_colors = Column(JSON, nullable=True)
    dress_note = Column(Text, nullable=True)
    map_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)

    wedding = relationship("Wedding", back_populates="events")

class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    name = Column(String(200), nullable=False, index=True)
    email = Column(String(200), nullable=True)
    phone = Column(String(50), nullable=True)
    token = Column(String(100), unique=True, index=True, nullable=False)
    max_guests = Column(Integer, default=2)
    custom_message = Column(Text, nullable=True)
    invited_events = Column(JSON, nullable=True)
    is_vip = Column(Boolean, default=False)
    table_number = Column(Integer, nullable=True)
    table_name = Column(String(100), nullable=True)

    wedding = relationship("Wedding", back_populates="guests")
    rsvp = relationship("RSVP", back_populates="guest", uselist=False, cascade="all, delete-orphan")

class RSVP(Base):
    __tablename__ = "rsvps"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=False)
    attending = Column(Boolean, nullable=False)
    guest_count = Column(Integer, default=1)
    meal_preference = Column(String(50), default="veg")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    guest = relationship("Guest", back_populates="rsvp")

class SeatingTable(Base):
    __tablename__ = "seating_tables"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    table_number = Column(Integer, nullable=False)
    table_name = Column(String(100), nullable=True)
    capacity = Column(Integer, default=8)

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    image_url = Column(String(500), nullable=False)
    caption = Column(Text, nullable=True)
    guest_name = Column(String(150), nullable=True)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    wedding = relationship("Wedding", back_populates="photos")

class GuestbookMessage(Base):
    __tablename__ = "guestbook_messages"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    author_name = Column(String(150), nullable=False)
    relation = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    wedding = relationship("Wedding", back_populates="guestbook_messages")

class CityGuideItem(Base):
    __tablename__ = "city_guide_items"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    category_label = Column(String(100), nullable=True)
    emoji = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)
    distance = Column(String(100), nullable=True)
    address = Column(String(300), nullable=True)
    map_url = Column(String(500), nullable=True)

class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    wedding_id = Column(Integer, ForeignKey("weddings.id"), nullable=False)
    question = Column(String(300), nullable=False)
    answer = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)
