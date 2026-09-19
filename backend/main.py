import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.database.connection import init_db
from backend.routes import (
    weddings,
    guests,
    rsvp,
    seating,
    gallery,
    guestbook,
    concierge,
    platform,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("jod_weddings")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing JOD Weddings backend...")
    init_db()
    yield
    logger.info("Shutting down JOD Weddings backend...")

app = FastAPI(
    title="JOD Weddings API — Krithish & Priya",
    description="Luxury Wedding Website & Digital Experience Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(weddings.router)
app.include_router(guests.router)
app.include_router(rsvp.router)
app.include_router(seating.router)
app.include_router(gallery.router)
app.include_router(guestbook.router)
app.include_router(concierge.router)
app.include_router(platform.router)

# Health Check
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "wedding": "krithish-priya",
        "date": "2026-09-12",
        "platform": "JOD Weddings"
    }

# Mount static frontend directories
if settings.UPLOAD_DIR.exists():
    app.mount("/assets/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

if settings.FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(settings.FRONTEND_DIR), html=True), name="frontend")
else:
    logger.warning(f"Frontend directory not found at {settings.FRONTEND_DIR}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
