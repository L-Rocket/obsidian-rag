import logging
from sqlalchemy import text
from src.services.db import engine, Base
# Import models so they are registered with Base
from src.models.db_models import Document, Conversation, Message

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    logger.info("Initializing database...")
    with engine.connect() as conn:
        logger.info("Creating vector extension if not exists...")
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    
    logger.info("Creating tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database initialization complete.")

if __name__ == "__main__":
    init_db()
