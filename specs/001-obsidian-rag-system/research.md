# Phase 0: Outline & Research

## Unknowns Resolved

### 1. Backend Web Framework
- **Decision**: FastAPI
- **Rationale**: The user specified Python and LangGraph. To serve the LangGraph workflow to a React frontend, a web API is needed. FastAPI is the modern standard for high-performance Python APIs, integrates well with LangGraph, and provides automatic OpenAPI docs.
- **Alternatives considered**: Flask (older, less performant, no native async), Django (too heavy for a simple API).

### 2. Storage & Vector Database
- **Decision**: PostgreSQL with pgvector
- **Rationale**: The repository is named `pgvector`, implying the use of this extension for vector similarity search. It's a robust choice for storing both document metadata and embeddings for RAG.
- **Alternatives considered**: ChromaDB, Pinecone, FAISS (rejected in favor of the implicit repo context).

### 3. Frontend Tooling
- **Decision**: Vite with React and TailwindCSS
- **Rationale**: The user requested React, CSS, and TailwindCSS. Vite is the current best practice for scaffolding React applications, providing fast builds and hot module replacement.
- **Alternatives considered**: Create React App (deprecated), Next.js (potentially overkill if SSR is not required, keeping it simple as a SPA).

### 4. API Communication Contract
- **Decision**: REST API with Server-Sent Events (SSE) for streaming
- **Rationale**: RAG responses from LLMs can take time. Streaming the response chunk-by-chunk improves perceived performance and UX. SSE is simple to implement with FastAPI and standard Web APIs (EventSource) in React.
- **Alternatives considered**: GraphQL (overkill for a simple Q&A interface), WebSockets (more complex to manage connections, SSE is better suited for one-way server-to-client streaming).

### 5. Makefile Setup
- **Decision**: Root Makefile orchestrating both frontend and backend
- **Rationale**: The user explicitly requested "makefile一键启动" (Makefile one-click startup).
- **Alternatives considered**: Docker Compose (good, but Makefile was explicitly requested for simplicity).
