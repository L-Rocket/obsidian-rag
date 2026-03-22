# Implementation Tasks: Auth & UI Revamp

## Phase 1: Backend Authentication
- [x] T001 Update `.env.example` to include `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SECRET_KEY`.
- [x] T002 Install `python-jose` and `passlib[bcrypt]` and `python-multipart` in `backend/requirements.txt`.
- [x] T003 Create `backend/src/services/auth.py` with JWT generation and token verification dependency (`get_current_user`).
- [x] T004 Create `backend/src/api/routes/auth.py` with the login endpoint using `OAuth2PasswordRequestForm`.
- [x] T005 Register the auth router in `backend/src/api/main.py`.
- [x] T006 Protect existing endpoints in `chat.py`, `history.py`, `ingest.py`, and `settings.py` by adding `Depends(get_current_user)`.

## Phase 2: Frontend Auth Infrastructure
- [x] T007 Install `lucide-react` for modern icons and `react-router-dom` for routing.
- [x] T008 Create `frontend/src/context/AuthContext.tsx` to handle login state and JWT storage.
- [x] T009 Create `frontend/src/api/interceptor.ts` to attach the Bearer token to all `fetch` requests and handle 401s.
- [x] T010 Create `frontend/src/pages/LoginPage.tsx` with a modern login form.
- [x] T011 Set up routing in `frontend/src/App.tsx` with protected routes.

## Phase 3: UI Revamp (Chat & Layout)
- [x] T012 Install `react-markdown` and `remark-gfm` in frontend to render AI responses cleanly.
- [x] T013 Redesign `Layout.tsx` with a collapsible/modern sidebar (darker, clean list) and header.
- [x] T014 Redesign `ChatPage.tsx` to center the conversation area (`max-w-3xl`) and fix scroll behavior.
- [x] T015 Redesign `ChatMessage.tsx` to visually distinguish user (aligned right, bubble) and AI (left aligned, markdown rendered).
- [x] T016 Redesign `ChatInput.tsx` to be a floating input area at the bottom with a shadow and an internal submit arrow icon.
- [x] T017 Redesign `SettingsModal.tsx` to match the new dark theme styling smoothly.

## Phase 4: Testing & Polish
- [x] T018 Verify backend tests still pass with authentication (mock auth or update tests).
- [x] T019 Test the login flow, token persistence, and logout flow in the browser.
- [x] T020 Ensure the UI is responsive on smaller screens.