# Implementation Plan: Shadcn UI Overhaul

**Branch**: `004-shadcn-ui-overhaul`
**Date**: 2026-03-22

## Summary
Migrate the custom Tailwind components to `shadcn/ui`, a collection of re-usable, accessible components built using Radix UI and Tailwind CSS. This will give the app a highly polished, standardized, and modern look.

## Technical Context
- **Frontend Stack Addition**: `shadcn/ui`, `lucide-react`, `clsx`, `tailwind-merge`.
- **Component Replacements**:
  - Raw `<button>` -> `Button`
  - Raw `<input>` -> `Input`
  - Raw `<textarea>` -> `Textarea`
  - Custom Modal -> `Dialog`
  - Avatars -> `Avatar`

## Action Plan
1. **Init**: Run `npx shadcn@latest init` to setup the environment (`components.json`, `lib/utils.ts`, globals).
2. **Install**: Add required components: `button`, `input`, `textarea`, `dialog`, `label`, `avatar`, `scroll-area`.
3. **Refactor**: 
   - `LoginPage.tsx`: Use `Input`, `Label`, `Button`, and `Card`.
   - `SettingsModal.tsx`: Use `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `Input`, `Label`.
   - `ChatInput.tsx`: Use `Textarea` or `Input` combined with a `Button` for submit.
   - `ChatMessage.tsx`: Use `Avatar`.
