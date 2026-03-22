# Implementation Plan: Obsidian RAG System

**Branch**: `001-obsidian-rag-system` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-obsidian-rag-system/spec.md`
**User Input**: 前端有问答界面，用 react + css + talandcss 框架。 后端用 Python 加 langgraph， makefile 一键启动

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a Retrieval-Augmented Generation (RAG) system for Obsidian notes with a React frontend (Q&A interface) styled with TailwindCSS and a Python backend utilizing LangGraph. The system will be orchestrable via a Makefile for one-click startup.

## Technical Context

**Language/Version**: Frontend: TypeScript/React, Backend: Python 3.11+
**Primary Dependencies**: React, TailwindCSS, Python, LangGraph, FastAPI (API layer)
**Storage**: PostgreSQL + pgvector (for document metadata and embeddings)
**Testing**: Jest (Frontend), pytest (Backend)
**Target Platform**: Web application (Local desktop usage, tailored for Obsidian notes)
**Project Type**: Web Application (Frontend SPA + Backend API)
**Performance Goals**: RAG retrieval and response generation < 2s
**Constraints**: Makefile for unified startup
**Scale/Scope**: Local or small-scale deployment for personal notes
**Extensibility Strategy**: Modular backend via LangGraph for easy addition of new RAG tools, separation of concerns between frontend UI and backend API

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Testing Standards**: Must include Jest for frontend and pytest for backend.
- **II. Commit Strategy & Incremental Development**: MVP phase so rapid commits are acceptable.
- **III. Future Extensibility & Architecture**: Frontend and backend decoupled via clear API contracts. LangGraph usage provides extensible workflow.
- **IV. Code Quality**: Standard linting (ESLint, flake8/black) to be applied.
- **V. User Experience Consistency**: TailwindCSS will ensure unified design language.
- **VI. Performance Requirements**: Efficient vector search via pgvector.

## Project Structure

### Documentation (this feature)

```text
specs/001-obsidian-rag-system/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── graph/         # LangGraph workflows
│   ├── api/           # FastAPI endpoints
│   └── services/      # Embedding and vector search (pgvector)
├── tests/
├── Makefile
└── requirements.txt

frontend/
├── src/
│   ├── components/    # React Q&A components
│   ├── pages/         # Main UI
│   └── api/           # API client
├── tests/
├── package.json
└── tailwind.config.js

Makefile               # Root makefile for one-click startup
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

None at this time.
