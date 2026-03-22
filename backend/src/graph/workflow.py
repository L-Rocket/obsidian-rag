from langgraph.graph import StateGraph, END
from src.graph.state import RAGState
from src.graph.nodes.retrieve import retrieve_node
from src.graph.nodes.generate import generate_node

def create_workflow() -> StateGraph:
    workflow = StateGraph(RAGState)
    
    workflow.add_node("retrieve", retrieve_node)
    workflow.add_node("generate", generate_node)
    
    workflow.set_entry_point("retrieve")
    workflow.add_edge("retrieve", "generate")
    workflow.add_edge("generate", END)
    
    return workflow.compile()

rag_app = create_workflow()
