# Implementation Plan: Dynamic Configuration & Frontend Fixes

**Branch**: `002-dynamic-config`
**Date**: 2026-03-22

## Summary
Resolve frontend build issues, introduce a dynamic settings management system, and allow runtime configuration of LLM models and the Obsidian vault path through the React UI.

## Technical Context
- **Database**: Add a new SQLAlchemy model `Setting` (`key` string, `value` string) to store configuration.
- **Backend API**: Add a settings router with `GET /settings` and `POST /settings`. Provide an `POST /ingest/start` to trigger ingestion using the saved path.
- **Backend Logic**: Update LangGraph nodes and Embedder services to accept the `db` session, fetch the latest settings, and dynamically instantiate `ChatOpenAI` and `OpenAIEmbeddings`.
- **Frontend UI**: Add a `SettingsModal.tsx`. Add a settings button in the sidebar or header. Update API client to fetch and save settings.

## Project Structure Changes
- `backend/src/models/db_models.py`: Add `Setting` class.
- `backend/src/api/routes/settings.py`: New endpoints.
- `backend/src/services/config.py`: Helper to get/set configs from DB.
- `frontend/src/components/SettingsModal.tsx`: New UI component.

## Architecture Decisions
Instead of relying on `os.getenv` once at application startup, the backend will now read from the `Setting` table. As a fallback, if a setting is not in the database, it can fall back to `os.getenv`.
