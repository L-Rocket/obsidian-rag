from sqlalchemy.orm import Session
from src.models.db_models import Document
from typing import List, Dict, Any

def save_documents(db: Session, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
    """
    Saves document chunks and their corresponding embeddings to the database.
    """
    docs_to_insert = []
    for chunk, embedding in zip(chunks, embeddings):
        doc = Document(
            filename=chunk["filename"],
            content=chunk["content"],
            metadata_=chunk["metadata"],
            embedding=embedding
        )
        docs_to_insert.append(doc)
    
    db.add_all(docs_to_insert)
    db.commit()
