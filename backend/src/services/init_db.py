import os
import logging
from sqlalchemy import text
from src.services.db import engine, Base
# Import models so they are registered with Base
from src.models.db_models import Document, Conversation, Message

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def _sync_embedding_dimension(expected_dim: int):
    with engine.connect() as conn:
        table_exists = conn.execute(text("SELECT to_regclass('public.documents') IS NOT NULL")).scalar()
        if not table_exists:
            return

        current_type = conn.execute(
            text(
                """
                SELECT format_type(a.atttypid, a.atttypmod)
                FROM pg_attribute a
                JOIN pg_class c ON a.attrelid = c.oid
                JOIN pg_namespace n ON c.relnamespace = n.oid
                WHERE n.nspname = 'public'
                  AND c.relname = 'documents'
                  AND a.attname = 'embedding'
                  AND a.attnum > 0
                  AND NOT a.attisdropped
                """
            )
        ).scalar()

        expected_type = f"vector({expected_dim})"
        if current_type == expected_type:
            return

        row_count = conn.execute(text("SELECT COUNT(*) FROM documents")).scalar() or 0
        if row_count > 0:
            logger.warning(
                "Embedding column type is %s but expected %s and documents has %s rows. "
                "Skipping auto-alter; clear/rebuild documents before changing dimensions.",
                current_type,
                expected_type,
                row_count,
            )
            return

        logger.info("Altering documents.embedding from %s to %s", current_type, expected_type)
        conn.execute(text(f"ALTER TABLE documents ALTER COLUMN embedding TYPE vector({expected_dim})"))
        conn.commit()

def init_db():
    logger.info("Initializing database...")
    expected_dim = int(os.getenv("EMBEDDING_DIM", "1024"))

    with engine.connect() as conn:
        logger.info("Creating vector extension if not exists...")
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    
    logger.info("Creating tables...")
    Base.metadata.create_all(bind=engine)
    _sync_embedding_dimension(expected_dim)
    logger.info("Database initialization complete.")

if __name__ == "__main__":
    init_db()
