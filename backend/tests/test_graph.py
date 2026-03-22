import pytest
from src.graph.state import RAGState
from src.graph.workflow import rag_app
from unittest.mock import patch

@patch("src.graph.nodes.retrieve.search_documents")
@patch("src.graph.nodes.generate.llm.invoke")
def test_rag_workflow(mock_invoke, mock_search):
    mock_search.return_value = [{"filename": "test.md", "content": "Test content", "metadata": {}}]
    class MockResponse:
        content = "This is a mock answer"
    mock_invoke.return_value = MockResponse()
    
    state = RAGState(
        conversation_id="test",
        query="What is test?",
        chat_history=[],
        context_documents=[],
        generation=""
    )
    
    result = rag_app.invoke(state)
    
    assert "generation" in result
    assert result["generation"] == "This is a mock answer"
    assert len(result["context_documents"]) == 1
    assert result["context_documents"][0]["filename"] == "test.md"
