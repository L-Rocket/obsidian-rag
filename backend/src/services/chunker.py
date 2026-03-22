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
        return [document]

    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end]
        
        chunks.append({
            "content": chunk_text,
            "metadata": document["metadata"],
            "filename": document["filename"]
        })
        
        start += chunk_size - chunk_overlap

    return chunks
