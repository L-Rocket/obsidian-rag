from typing import TypedDict, List, Dict, Any, Optional

class RAGState(TypedDict):
    """
    Represents the state of our LangGraph RAG workflow.
    """
    conversation_id: str
    query: str
    chat_history: List[Dict[str, Any]]
    context_documents: List[Dict[str, Any]]
    generation: Optional[str]
