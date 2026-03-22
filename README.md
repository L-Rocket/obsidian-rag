# Obsidian RAG

An end-to-end local knowledge RAG system for Obsidian/Markdown notes, using pgvector retrieval and grounded answers with file citations.

![Obsidian RAG UI](docs/images/demo.png)

## English

### Overview

This project provides a production-style RAG workflow you can run locally:

- Frontend: React + TypeScript + Vite
- Backend: FastAPI + LangGraph + SQLAlchemy
- Vector DB: PostgreSQL + pgvector
- Model providers: OpenAI-compatible APIs or Ollama

In the chat UI, you can ask questions over your notes and see:

- Collapsible RAG retrieval-flow visualization
- Retrieved files and relevance scores
- File citations used by the final answer

### Data Flow (Prompt to Answer)

1. User submits a question to /api/v1/chat/stream.
2. Backend embeds the query and runs pgvector similarity search on documents.
3. Retrieved chunks are assembled into context for the system prompt.
4. Model generates a streaming response with conversation history.
5. Backend emits SSE events: conversation, trace, message, sources, done.
6. Frontend renders tokens in real time and shows retrieval/citation details.

### Project Structure

```text
backend/
  src/
   api/        # FastAPI routes (auth/chat/ingest/settings/history)
   graph/      # LangGraph workflow and nodes
   services/   # retrieval, embeddings, parsing, chunking, config
frontend/
  src/
   components/ # chat UI, source chips, RAG trace panel
   hooks/      # SSE streaming hook
```

### Requirements

- Node.js 18+
- Python 3.11+
- Docker and Docker Compose
- Make

### Quick Start

1. Install dependencies and initialize local env:

```bash
make install
```

2. Start PostgreSQL/pgvector:

```bash
docker-compose up -d
```

3. Initialize schema and pgvector extension:

```bash
cd backend
source venv/bin/activate
python -m src.services.init_db
```

4. Start backend + frontend:

```bash
make dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Key .env Settings

Validate these variables before running:

- POSTGRES_HOST POSTGRES_PORT POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB
- ADMIN_USERNAME ADMIN_PASSWORD SECRET_KEY
- CHAT_API_BASE CHAT_API_KEY CHAT_MODEL
- EMBEDDING_API_BASE EMBEDDING_API_KEY EMBEDDING_MODEL EMBEDDING_DIM
- OBSIDIAN_VAULT_PATH (can be overridden in Settings UI)

### Ingest Notes

You can trigger ingestion from the Settings page or by API:

```bash
curl -X POST http://localhost:8000/api/v1/ingest \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"directory_path":"data"}'
```

The pipeline chunks files, generates embeddings, writes to documents, and skips duplicate chunks.

### Features

- Streaming answers via SSE
- Conversation-aware context
- Collapsible RAG retrieval-flow UI
- Explicit file citations (name, path, score)
- Deduplicated ingestion (fingerprint-based)

### FAQ

1. Why does the answer miss my project details?
  - Ensure related docs are ingested and check retrieved file traces.

2. Why are retrieved docs sometimes not ideal?
  - Tune embedding model, chunking strategy, top-k, and relevance threshold.

3. Why are backend logs missing?
  - Start with make dev to enable access logs and request logs.

## 中文

### 项目说明

这是一个可本地运行的端到端 RAG 项目：把 Obsidian/Markdown 文档切片后写入 pgvector，并基于检索上下文生成带引用来源的回答。

- 前端：React + TypeScript + Vite
- 后端：FastAPI + LangGraph + SQLAlchemy
- 向量数据库：PostgreSQL + pgvector
- 模型接入：OpenAI 兼容接口 / Ollama

你可以在页面中看到：

- 可折叠的 RAG 检索流程可视化
- 检索文件及相关度分数
- 回答引用了哪些文件

### 数据流（提示词到输出）

1. 前端发起问题到 /api/v1/chat/stream
2. 后端向量化问题并在 documents 上做 pgvector 相似度检索
3. 将召回片段组装为上下文并注入系统提示词
4. 带会话历史调用模型进行流式生成
5. SSE 依次返回 conversation、trace、message、sources、done
6. 前端实时渲染文本并展示引用来源

### 快速启动

1. 安装依赖：

```bash
make install
```

2. 启动数据库：

```bash
docker-compose up -d
```

3. 初始化数据库：

```bash
cd backend
source venv/bin/activate
python -m src.services.init_db
```

4. 启动前后端：

```bash
make dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:8000

### 关键配置

- POSTGRES_HOST POSTGRES_PORT POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB
- ADMIN_USERNAME ADMIN_PASSWORD SECRET_KEY
- CHAT_API_BASE CHAT_API_KEY CHAT_MODEL
- EMBEDDING_API_BASE EMBEDDING_API_KEY EMBEDDING_MODEL EMBEDDING_DIM
- OBSIDIAN_VAULT_PATH（可在设置页覆盖）

### 导入知识库

```bash
curl -X POST http://localhost:8000/api/v1/ingest \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"directory_path":"data"}'
```

系统会自动切片、向量化并写入 documents，同时具备去重入库能力。
