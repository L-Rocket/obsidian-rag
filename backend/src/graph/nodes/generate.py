import os
from src.graph.state import RAGState
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage

# Ensure CHAT_API_KEY is configured
api_key = os.getenv("CHAT_API_KEY")
api_base = os.getenv("CHAT_API_BASE")
chat_model = os.getenv("CHAT_MODEL", "gpt-4o-mini")

llm_kwargs = {
    "model": chat_model, 
    "streaming": True,
    "api_key": api_key,
}
if api_base:
    llm_kwargs["base_url"] = api_base

llm = ChatOpenAI(**llm_kwargs)

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant answering questions based on the provided Obsidian notes.\n\nContext:\n{context}"),
    ("human", "{query}")
])

def format_context(documents):
    context_str = ""
    for i, doc in enumerate(documents):
        context_str += f"--- Document {i+1}: {doc['filename']} ---\n{doc['content']}\n\n"
    return context_str

def generate_node(state: RAGState) -> RAGState:
    """
    Generates an answer using an LLM and the retrieved context.
    """
    query = state["query"]
    context_documents = state.get("context_documents", [])
    
    context_str = format_context(context_documents)
    
    messages = prompt_template.format_messages(context=context_str, query=query)
    
    # Wait, we might need to invoke it directly if not streaming in the node itself
    # Actually, for streaming, we might yield chunks from the workflow execution,
    # or just store the full generation here if invoked normally.
    response = llm.invoke(messages)
    
    state["generation"] = response.content
    return state
