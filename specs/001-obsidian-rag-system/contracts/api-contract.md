# API Contract

## Base URL
`/api/v1`

## Endpoints

### 1. Ask Question (Streaming)
Used to send a user query and stream back the response from the LangGraph RAG workflow.

- **Method**: `POST`
- **Path**: `/chat/stream`
- **Request Body**:
  ```json
  {
    "conversation_id": "uuid (optional, for existing sessions)",
    "query": "What are my notes on project X?"
  }
  ```
- **Response**: Server-Sent Events (SSE) stream
  ```text
  event: message
  data: {"chunk": "Based on "}
  
  event: message
  data: {"chunk": "your notes, "}
  
  event: sources
  data: [{"filename": "project_x.md", "snippet": "..."}]
  
  event: done
  data: {}
  ```

### 2. Conversation History
Retrieve past messages for a conversation.

- **Method**: `GET`
- **Path**: `/conversations/{conversation_id}/messages`
- **Response**:
  ```json
  {
    "messages": [
      {
        "id": "uuid",
        "role": "user",
        "content": "What are my notes on project X?",
        "created_at": "2026-03-22T10:00:00Z"
      },
      {
        "id": "uuid",
        "role": "assistant",
        "content": "Based on your notes, Project X is...",
        "sources": [{"filename": "project_x.md"}],
        "created_at": "2026-03-22T10:00:05Z"
      }
    ]
  }
  ```
