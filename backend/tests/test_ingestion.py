import pytest
import os
from unittest.mock import patch
from fastapi.testclient import TestClient

from src.api.main import app
from src.api.routes.ingest import router as ingest_router
from src.services.auth import get_current_user

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
    
    mock_embed.return_value = [[0.1] * 1536]
    
    response = client.post("/ingest", json={"directory_path": str(tmpdir.join("notes"))})
    assert response.status_code == 200
    assert "Successfully ingested" in response.json()["message"]
    mock_save.assert_called_once()
