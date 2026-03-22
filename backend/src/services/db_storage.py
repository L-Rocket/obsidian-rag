import hashlib
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from src.models.db_models import Document


def _build_chunk_fingerprint(chunk: Dict[str, Any]) -> str:
    metadata = chunk.get("metadata") or {}
    source_path = str(metadata.get("source_path") or chunk.get("filename") or "")
    chunk_index = str(metadata.get("chunk_index", 0))
    content = str(chunk.get("content") or "")
    payload = f"{source_path}|{chunk_index}|{content}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()

def save_documents(db: Session, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
    """
    Saves document chunks and embeddings while skipping duplicates by fingerprint.
    """
    if not chunks:
        return {"inserted": 0, "skipped": 0}

    fingerprint_expr = Document.metadata_["fingerprint"].astext
    seen_in_batch = set()
    prepared = []

    for chunk, embedding in zip(chunks, embeddings):
        metadata = dict(chunk.get("metadata") or {})
        prepared_chunk = {
            "filename": chunk["filename"],
            "content": chunk["content"],
            "metadata": metadata,
            "embedding": embedding,
        }
        fingerprint = _build_chunk_fingerprint(prepared_chunk)
        if fingerprint in seen_in_batch:
            continue
        seen_in_batch.add(fingerprint)
        metadata["fingerprint"] = fingerprint
        prepared_chunk["metadata"] = metadata
        prepared.append(prepared_chunk)

    if not prepared:
        return {"inserted": 0, "skipped": len(chunks)}

    fingerprints = [item["metadata"]["fingerprint"] for item in prepared]
    existing_fingerprints = {
        row[0]
        for row in db.query(fingerprint_expr)
        .filter(fingerprint_expr.in_(fingerprints))
        .all()
        if row[0]
    }

    docs_to_insert = []
    for item in prepared:
        fingerprint = item["metadata"]["fingerprint"]
        if fingerprint in existing_fingerprints:
            continue

        doc = Document(
            filename=item["filename"],
            content=item["content"],
            metadata_=item["metadata"],
            embedding=item["embedding"],
        )
        docs_to_insert.append(doc)

    if docs_to_insert:
        db.add_all(docs_to_insert)
        db.commit()

    inserted = len(docs_to_insert)
    skipped = len(chunks) - inserted
    return {"inserted": inserted, "skipped": skipped}
