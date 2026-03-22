# Obsidian RAG System

A complete Retrieval-Augmented Generation (RAG) system for your Obsidian notes. This system provides a React-based interactive web UI to ask questions about your notes, backed by a FastAPI Python backend utilizing LangGraph and `pgvector` for vector similarity search.

## Prerequisites
- Node.js 18+
- Python 3.11+
- Make
- Docker and Docker Compose

## Quick Start

1. **Clone the repository.**
2. **Install Dependencies & Setup Environment**:
   Run the following from the root directory to install frontend and backend dependencies and generate a `.env` file:
   ```bash
   make install
   ```
3. **Configure Environment Variables**: Open the `.env` file and fill in your LLM API Key (`LLM_API_KEY`) and the corresponding API base URL (`LLM_API_BASE`). The default points to OpenAI, but can be changed to an API proxy like DeepSeek or Ollama. You can also specify the `EMBEDDING_MODEL` and `CHAT_MODEL`.
4. **Start the database**:
   ```bash
   docker-compose up -d
   ```
5. **Initialize DB**:
   ```bash
   cd backend && source venv/bin/activate
   PYTHONPATH=. python3 src/services/init_db.py
   ```
6. **Start Development Servers**:
   Run the following from the root directory to start both frontend and backend concurrently:
   ```bash
   make dev
   ```
   - Frontend will be available at `http://localhost:5173`
   - Backend API will be at `http://localhost:8000`

## Ingesting Notes

To ingest your Obsidian notes, use the provided API endpoint:
```bash
curl -X POST http://localhost:8000/api/v1/ingest \
     -H "Content-Type: application/json" \
     -d '{"directory_path": "/path/to/your/obsidian/vault"}'
```
