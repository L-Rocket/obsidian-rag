import os
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

router = APIRouter()

class IngestRequest(BaseModel):
    directory_path: Optional[str] = None

@router.post("/ingest")
def ingest_directory(req: IngestRequest, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    directory_path = req.directory_path or get_setting(db, "OBSIDIAN_VAULT_PATH")
    
    if not directory_path or not os.path.isdir(directory_path):
        raise HTTPException(status_code=400, detail=f"Directory does not exist or is not set: {directory_path}")

    all_chunks = []
    for root, _, files in os.walk(directory_path):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                doc = parse_obsidian_note(filepath)
                chunks = chunk_document(doc)
                all_chunks.extend(chunks)

    if not all_chunks:
        return {"message": "No markdown files found to ingest."}

    texts = [c["content"] for c in all_chunks]
    
    try:
        embeddings = get_embeddings(texts, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

    save_documents(db, all_chunks, embeddings)
    return {"message": f"Successfully ingested {len(all_chunks)} chunks from {directory_path}"}
