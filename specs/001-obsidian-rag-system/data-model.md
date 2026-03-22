# Phase 1: Data Model

## Entities

### 1. Document (Obsidian Note)
Represents a markdown file from Obsidian indexed in the system.
- `id`: UUID (Primary Key)
- `filename`: String (Original file name)
- `content`: Text (Full or chunked text content)
- `metadata`: JSONB (Tags, creation date, modification date from Obsidian)
- `embedding`: Vector (pgvector representation of the content)

### 2. Conversation
Represents a Q&A session with the RAG system.
- `id`: UUID (Primary Key)
- `created_at`: Timestamp
- `title`: String (Optional, auto-generated based on first query)

### 3. Message
Represents a single message in a conversation (user query or system response).
- `id`: UUID (Primary Key)
- `conversation_id`: UUID (Foreign Key to Conversation)
- `role`: Enum ('user' | 'assistant')
- `content`: Text
- `sources`: JSONB (Array of Document IDs or snippets used for the response, only for 'assistant' role)
- `created_at`: Timestamp
