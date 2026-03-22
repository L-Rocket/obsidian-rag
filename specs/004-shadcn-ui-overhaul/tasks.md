# Implementation Tasks: Shadcn UI Overhaul

## Phase 1: Setup and Installation
- [x] T001 Run `npx shadcn@latest init` in the frontend directory.
- [x] T002 Install components via `npx shadcn@latest add button input textarea dialog label avatar card scroll-area`.
- [x] T003 Ensure Tailwind configuration and CSS globals are correctly updated by the init process.

## Phase 2: Refactoring Auth & Settings
- [x] T004 Refactor `LoginPage.tsx` to use `Card`, `Input`, `Label`, and `Button`.
- [x] T005 Refactor `SettingsModal.tsx` to use `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `Input`, `Label`, and `Button`.

## Phase 3: Refactoring Chat Interface
- [x] T006 Refactor `ChatInput.tsx` to use Shadcn's layout patterns, integrating `Button` for the send action.
- [x] T007 Refactor `ChatMessage.tsx` to use the `Avatar` component for the user and AI icons.
- [x] T008 Refactor `Layout.tsx` to ensure consistent sidebar styling using standardized spacing and colors provided by the new theme.
- [x] T009 Run `npm run build` to verify the frontend still builds correctly.
