import pytest
import os
from unittest.mock import patch
from fastapi.testclient import TestClient

from src.api.main import app
from src.api.routes.ingest import router as ingest_router
from src.services.auth import get_current_user
from src.models.db_models import Document

app.include_router(ingest_router)

# Override auth dependency for tests
app.dependency_overrides[get_current_user] = lambda: "admin"

client = TestClient(app)

@patch("src.api.routes.ingest.get_embeddings")
@patch("src.api.routes.ingest.save_documents")
def test_ingest_directory(mock_save, mock_embed, tmpdir):
    # Setup dummy directory
    p = tmpdir.mkdir("notes").join("test_note.md")
    p.write("---\ntitle: Test Note\n---\nThis is a test note.")
    
    dim = getattr(getattr(Document, "embedding").type, "dim", 1024) or 1024
    mock_embed.return_value = [[0.1] * dim]
    
    response = client.post("/ingest", json={"directory_path": str(tmpdir.join("notes"))})
    assert response.status_code == 200
    body = response.json()
    assert "Ingestion complete" in body["message"]
    assert body["total_chunks"] >= 1
    mock_save.assert_called_once()
