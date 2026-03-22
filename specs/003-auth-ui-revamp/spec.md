# Feature Specification: Auth & UI Revamp

**Feature Branch**: `003-auth-ui-revamp`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Add login functionality with credentials from `.env` and revamp the UI to look like a modern, professional chat portal.

## User Scenarios & Testing

### User Story 1 - Secure Login (Priority: P1)
As an owner, I want to restrict access to my Obsidian RAG system so that only I can query my private notes.

**Acceptance Scenarios**:
1. **Given** an unauthenticated user visits the site, **When** they load the app, **Then** they are presented with a clean login screen.
2. **Given** the user enters the correct username and password (matching `.env`), **When** they click "Login", **Then** they are redirected to the chat interface.
3. **Given** an unauthenticated API request is made, **Then** the backend returns a 401 Unauthorized status.

### User Story 2 - Modern Chat Interface (Priority: P1)
As a user, I want the chat interface to be aesthetically pleasing, resembling modern AI chat applications (like ChatGPT or Claude) for better readability and UX.

**Acceptance Scenarios**:
1. **Given** the user is logged in, **Then** they see a responsive layout with a collapsible sidebar for history (UI placeholder or functional), and a centered chat view.
2. **Given** a message contains markdown formatting, **Then** it is rendered nicely with typography and distinct backgrounds for user vs. assistant.
3. **Given** the user types a query, **Then** the input area should look polished, ideally with an expanding textarea.

## Requirements

### Functional Requirements
- **FR-001**: Backend must have a `/api/v1/auth/login` endpoint generating a simple JWT or Bearer token.
- **FR-002**: Backend must read `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`.
- **FR-003**: All existing API routes (`/chat`, `/ingest`, `/settings`) must be protected by an authentication dependency.
- **FR-004**: Frontend must implement an `AuthProvider` (React Context) to manage login state.
- **FR-005**: Frontend styling must be completely revamped using TailwindCSS to match a modern AI Chat UI.

## Success Criteria
- The system is completely inaccessible without logging in.
- The UI feels polished, "alive", and similar in quality to consumer AI applications.
