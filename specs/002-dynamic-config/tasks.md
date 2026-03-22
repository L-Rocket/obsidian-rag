# Implementation Tasks: Dynamic Configuration

## Phase 1: Frontend Fixes & Tests
- [x] T001 Remove unused `React` import in `frontend/src/App.tsx`.
- [x] T002 Remove or utilize `setConversationId` in `frontend/src/hooks/useChatStream.ts`.
- [x] T003 Ensure `npm run build` succeeds.

## Phase 2: Backend Configuration Storage
- [x] T004 Add `Setting` model (key: String, value: String) to `backend/src/models/db_models.py`.
- [x] T005 Implement helper functions to get/set settings in `backend/src/services/config.py` (with `.env` fallback).
- [x] T006 Implement `/api/v1/settings` GET and POST routes in `backend/src/api/routes/settings.py`.
- [x] T007 Register the settings router in `backend/src/api/main.py`.

## Phase 3: Dynamic Model Instantiation
- [x] T008 Update `backend/src/services/embedder.py` to accept `db: Session` and dynamically read `EMBEDDING_API_KEY`, etc.
- [x] T009 Update `backend/src/api/routes/ingest.py` to read `OBSIDIAN_VAULT_PATH` from config instead of request body (or allow body to override), and pass `db` to `get_embeddings`.
- [x] T010 Update `backend/src/graph/nodes/generate.py` to accept `db` context inside the state or instantiate models inside the node using a newly passed config. *Note: We need to pass the db session to the langgraph node. LangGraph state can carry config or we can just open a session in the node.*
- [x] T011 Update `backend/src/graph/nodes/retrieve.py` and `backend/src/services/vector_search.py` to pass `db` to embedder.

## Phase 4: Frontend UI for Settings
- [x] T012 Implement `getSettings` and `updateSettings` in `frontend/src/api/client.ts`.
- [x] T013 Create `SettingsModal.tsx` in frontend.
- [x] T014 Add Settings button to `Layout.tsx` and integrate modal state.
- [x] T015 (Optional but useful) Add "Trigger Ingestion" button to Settings modal to index the configured vault.
