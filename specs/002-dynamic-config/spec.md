# Feature Specification: Dynamic Configuration & Frontend Fixes

**Feature Branch**: `002-dynamic-config`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Fix frontend startup, add UI to configure Obsidian path, Embedding model, and Chat model dynamically.

## User Scenarios & Testing

### User Story 1 - Fix Frontend Build (Priority: P1)
The frontend should build and run without TypeScript compilation errors (currently failing due to unused variables).

### User Story 2 - Dynamic Settings Configuration (Priority: P1)
Users can open a "Settings" modal in the frontend UI to configure their Obsidian Vault Path, Chat API (Key, Base, Model), and Embedding API (Key, Base, Model). These settings should persist across sessions.

**Acceptance Scenarios**:
1. **Given** the user is on the main chat page, **When** they click "Settings", **Then** a modal opens with current configurations.
2. **Given** the user updates the settings and clicks save, **Then** the backend updates its configuration and subsequent queries or ingestions use the new models/paths.

### User Story 3 - Lazy Loaded Models in Backend (Priority: P1)
The backend should no longer instantiate LangChain OpenAI models statically at startup from `.env`. Instead, it should instantiate them per-request or fetch the latest configuration from the database.

## Requirements

### Functional Requirements
- **FR-001**: Fix TypeScript errors in `App.tsx` and `useChatStream.ts`.
- **FR-002**: Add a `Settings` table to the database to store configurations as key-value pairs.
- **FR-003**: Create `GET /api/v1/settings` and `POST /api/v1/settings` endpoints.
- **FR-004**: Frontend `Layout.tsx` should include a Settings button and render a Settings modal.
- **FR-005**: `embedder.py` and `generate.py` must load configuration from the DB when invoked.

## Success Criteria
- Frontend runs successfully with `npm run dev` and `npm run build`.
- User can change the Obsidian vault path and click an "Ingest" button from the frontend (or at least change the setting successfully).
- RAG queries use the dynamically configured models.
