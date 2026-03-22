# Implementation Plan: Auth & UI Revamp

**Branch**: `003-auth-ui-revamp`
**Date**: 2026-03-22

## Summary
Introduce a JWT-based authentication system backed by `.env` credentials and perform a comprehensive visual overhaul of the React application to deliver a "ChatGPT-like" modern chat experience.

## Technical Context
- **Backend Auth**: We will use FastAPI's built-in `OAuth2PasswordBearer` alongside the `python-jose` library to issue and verify JSON Web Tokens (JWT).
- **Environment**: Read `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SECRET_KEY` (for JWT) from the `.env` file.
- **Frontend Auth State**: Use React Context (`AuthContext`) combined with `localStorage` to persist the token across sessions.
- **API Client**: Update `frontend/src/api/client.ts` to attach the `Authorization: Bearer <token>` header to all requests.
- **UI Design System**: 
  - **Sidebar**: Darker gray (`bg-gray-900`) with hover states for history items.
  - **Main Chat Area**: Slightly lighter dark gray (`bg-gray-800`), max-width container, distinct spacing.
  - **User Message**: Aligned or styled differently to distinguish from assistant.
  - **Assistant Message**: Clean markdown rendering, displaying `SourceSnippet` clearly at the bottom.
  - **Input Box**: Floating or docked input box with rounded corners (`rounded-2xl`), shadow, and internal send button.

## Architecture Decisions
- Single-user system: Since this is a personal RAG tool, a single admin account configured via environment variables is sufficient. We don't need a full database user table or registration flow.
- Token Storage: LocalStorage for the JWT token is acceptable for a locally hosted personal tool, though HttpOnly cookies would be more secure. For simplicity and API separation, Bearer tokens via LocalStorage will be used.
