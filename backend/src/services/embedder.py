import os
from typing import List
from langchain_openai import OpenAIEmbeddings
from sqlalchemy.orm import Session
from src.services.config import get_setting

def get_embeddings(texts: List[str], db: Session) -> List[List[float]]:
    """
    Generates embeddings for a list of text strings using the configured LLM.
    """
    api_key = get_setting(db, "EMBEDDING_API_KEY", "dummy-key")
    api_base = get_setting(db, "EMBEDDING_API_BASE")
    embedding_model = get_setting(db, "EMBEDDING_MODEL", "text-embedding-3-small")
    
    kwargs = {
        "model": embedding_model,
        "api_key": api_key,
    }
    
    if api_base:
        kwargs["openai_api_base"] = api_base
        
    embeddings_model = OpenAIEmbeddings(**kwargs)
    return embeddings_model.embed_documents(texts)
