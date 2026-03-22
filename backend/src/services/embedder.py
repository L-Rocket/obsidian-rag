import os
from typing import List
from langchain_openai import OpenAIEmbeddings

# Initialize the embedding model. Ensure LLM_API_KEY is in the environment.
def get_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generates embeddings for a list of text strings using the configured LLM.
    """
    api_key = os.getenv("EMBEDDING_API_KEY", "dummy-key") # some local providers don't need a key but Langchain requires a non-empty string
    api_base = os.getenv("EMBEDDING_API_BASE")
    embedding_model = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
    
    kwargs = {
        "model": embedding_model,
        "api_key": api_key,
    }
    
    if api_base:
        kwargs["openai_api_base"] = api_base
        
    embeddings_model = OpenAIEmbeddings(**kwargs)
    return embeddings_model.embed_documents(texts)
