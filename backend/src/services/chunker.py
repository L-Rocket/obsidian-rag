from typing import List, Dict, Any

def chunk_document(document: Dict[str, Any], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Dict[str, Any]]:
    """
    Splits a document's content into smaller chunks.
    A naive character-level chunker for demonstration.
    For production, consider RecursiveCharacterTextSplitter from langchain.
    """
    text = document["content"]
    chunks = []
    
    if len(text) <= chunk_size:
        single = dict(document)
        single_metadata = dict(document.get("metadata", {}))
        single_metadata["chunk_index"] = 0
        single["metadata"] = single_metadata
        return [single]

    start = 0
    chunk_index = 0
    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end]
        chunk_metadata = dict(document["metadata"])
        chunk_metadata["chunk_index"] = chunk_index
        
        chunks.append({
            "content": chunk_text,
            "metadata": chunk_metadata,
            "filename": document["filename"]
        })
        
        start += chunk_size - chunk_overlap
        chunk_index += 1

    return chunks
