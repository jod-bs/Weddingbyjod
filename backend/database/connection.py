import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.config import settings

logger = logging.getLogger("jod_weddings.db")

Base = declarative_base()

engine = None
SessionLocal = None
is_db_connected = False

def init_db():
    global engine, SessionLocal, is_db_connected
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 3} if "postgresql" in settings.DATABASE_URL else {}
        )
        # Test connection
        with engine.connect() as conn:
            is_db_connected = True
            logger.info("Successfully connected to PostgreSQL database.")
        
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        logger.warning(
            f"Could not connect to PostgreSQL ({e}). "
            "Operating in high-resilience in-memory mode with full seed data."
        )
        is_db_connected = False

def get_db():
    if not is_db_connected or SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
