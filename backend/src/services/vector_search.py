from sqlalchemy.orm import Session
from src.models.db_models import Document
from src.services.embedder import get_embeddings
from typing import List, Dict, Any

def search_documents(db: Session, query: str, limit: int = 5) -> List[Dict[str, Any]]:
    """
    Embeds the query and performs a vector similarity search in the database.
    """
    # Embed the query
    query_embedding = get_embeddings([query], db)[0]

    # Perform cosine distance search (<=> operator in pgvector)
    # The lower the distance, the more similar.
    distance = Document.embedding.cosine_distance(query_embedding).label("distance")
    # Fetch a wider candidate set first, then keep top unique sources for diversity.
    candidate_limit = max(limit * 8, 20)
    results = (
        db.query(Document, distance)
        .order_by(distance)
        .limit(candidate_limit)
        .all()
    )

    selected: List[Dict[str, Any]] = []
    seen_sources = set()
    seen_filenames = set()

    ranked_results = sorted(
        results,
        key=lambda item: (
            float(item[1]) if item[1] is not None else 1.0,
            0 if (item[0].metadata_ or {}).get("source_path") else 1,
        ),
    )

    for doc, dist in ranked_results:
        metadata = doc.metadata_ or {}
        filename = doc.filename
        source_key = metadata.get("source_path") or doc.filename
        if source_key in seen_sources or filename in seen_filenames:
            continue

        seen_sources.add(source_key)
        seen_filenames.add(filename)
        selected.append(
            {
                "id": str(doc.id),
                "filename": filename,
                "content": doc.content,
                "metadata": metadata,
                "score": float(dist) if dist is not None else None,
            }
        )
        if len(selected) >= limit:
            break

    return selected
