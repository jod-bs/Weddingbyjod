import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException

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

@app.middleware("http")
async def youtube_embed_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

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

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code != 404:
        return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)
    if request.url.path.startswith("/api"):
        return JSONResponse({"detail": exc.detail or "Not found"}, status_code=404)
    not_found = settings.FRONTEND_DIR / "404.html"
    if not_found.exists():
        return FileResponse(not_found, status_code=404, media_type="text/html")
    return JSONResponse({"detail": "Not found"}, status_code=404)

class SiteStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        request_path = scope.get("path", "")
        if request_path.startswith("/api"):
            raise StarletteHTTPException(status_code=404, detail="Not found")
        response = await super().get_response(path, scope)
        if request_path.endswith(".html") or request_path in ("", "/"):
            response.headers["Cache-Control"] = "no-store"
        elif request_path in ("/favicon.ico", "/favicon.png"):
            response.headers["Cache-Control"] = "public, max-age=0, must-revalidate"
        return response

# Mount static frontend directories
if settings.UPLOAD_DIR.exists():
    app.mount("/assets/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

if settings.FRONTEND_DIR.exists():
    app.mount("/", SiteStaticFiles(directory=str(settings.FRONTEND_DIR), html=True), name="frontend")
else:
    logger.warning(f"Frontend directory not found at {settings.FRONTEND_DIR}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
