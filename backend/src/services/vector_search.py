from sqlalchemy.orm import Session
from src.models.db_models import Document
from src.services.embedder import get_embeddings
from typing import List, Dict, Any

def search_documents(db: Session, query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Embeds the query and performs a vector similarity search in the database.
    """
    # Embed the query
    query_embedding = get_embeddings([query])[0]

    # Perform cosine distance search (<=> operator in pgvector)
    # The lower the distance, the more similar.
    results = db.query(Document).order_by(
        Document.embedding.cosine_distance(query_embedding)
    ).limit(limit).all()

    return [
        {
            "id": str(doc.id),
            "filename": doc.filename,
            "content": doc.content,
            "metadata": doc.metadata_
        }
        for doc in results
    ]
