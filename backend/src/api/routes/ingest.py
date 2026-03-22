import os
import logging
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from src.services.db import get_db
from src.services.parser import parse_obsidian_note
from src.services.chunker import chunk_document
from src.services.embedder import get_embeddings
from src.services.db_storage import save_documents
from src.services.config import get_setting
from src.services.auth import get_current_user
from src.models.db_models import Document

router = APIRouter()
logger = logging.getLogger("app.ingest")

class IngestRequest(BaseModel):
    directory_path: Optional[str] = None

def _resolve_directory_path(raw_path: Optional[str]) -> str:
    if not raw_path:
        return ""

    expanded = os.path.expanduser(raw_path.strip())
    candidate = Path(expanded)

    if candidate.is_absolute():
        return str(candidate)

    repo_root = Path(__file__).resolve().parents[4]
    return str((repo_root / candidate).resolve())

@router.post("/ingest")
def ingest_directory(req: IngestRequest, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    raw_path = req.directory_path or get_setting(db, "OBSIDIAN_VAULT_PATH")
    directory_path = _resolve_directory_path(raw_path)

    logger.info("Ingestion requested by=%s path=%s", current_user, directory_path)
    
    if not directory_path or not os.path.isdir(directory_path):
        raise HTTPException(status_code=400, detail=f"Directory does not exist or is not set: {directory_path}")

    all_chunks = []
    md_count = 0
    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith(".md"):
                md_count += 1
                filepath = os.path.join(root, file)
                doc = parse_obsidian_note(filepath)
                chunks = chunk_document(doc)
                all_chunks.extend(chunks)

    logger.info("Discovered markdown files=%s chunks=%s", md_count, len(all_chunks))

    if not all_chunks:
        return {"message": "No markdown files found to ingest."}

    texts = [c["content"] for c in all_chunks]
    
    try:
        logger.info("Generating embeddings for chunks=%s model=%s", len(texts), get_setting(db, "EMBEDDING_MODEL", ""))
        embeddings = get_embeddings(texts, db)
    except Exception as e:
        logger.exception("Embedding generation failed")
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

    model_dim = getattr(getattr(Document, "embedding").type, "dim", None)
    actual_dim = len(embeddings[0]) if embeddings else 0
    if model_dim and actual_dim and model_dim != actual_dim:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Embedding dimension mismatch: database expects {model_dim}, "
                f"but current embedding model returned {actual_dim}. "
                "Please switch EMBEDDING_MODEL to a compatible dimension or reinitialize DB schema."
            ),
        )

    try:
        result = save_documents(db, all_chunks, embeddings)
        inserted = result.get("inserted", 0)
        skipped = result.get("skipped", 0)
        logger.info("Saved chunks inserted=%s skipped=%s", inserted, skipped)
    except Exception as e:
        logger.exception("Saving documents failed")
        raise HTTPException(status_code=500, detail=f"Error saving documents: {str(e)}")

    return {
        "message": f"Ingestion complete for {directory_path}",
        "total_chunks": len(all_chunks),
        "inserted_chunks": inserted,
        "skipped_chunks": skipped,
    }
