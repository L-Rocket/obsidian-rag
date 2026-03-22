from src.graph.state import RAGState
from src.services.db import SessionLocal
from src.services.vector_search import search_documents

def retrieve_node(state: RAGState) -> RAGState:
    """
    Retrieves context documents based on the user's query.
    """
    query = state["query"]
    
    with SessionLocal() as db:
        documents = search_documents(db, query)
    
    state["context_documents"] = documents
    return state
