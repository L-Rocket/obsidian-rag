# Quickstart

## Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL with `pgvector` extension installed
- Make

## Environment Setup
1. Clone the repository.
2. Ensure PostgreSQL is running and accessible.
3. Create a `.env` file in the root based on `.env.example` with your database credentials and LLM API keys.

## One-Click Startup
To start both the frontend and backend development servers simultaneously, run:

```bash
make dev
```

This command will:
1. Install Python backend dependencies.
2. Install frontend npm dependencies.
3. Start the FastAPI backend server on `http://localhost:8000`.
4. Start the React frontend on `http://localhost:5173`.

## Accessing the Application
Open your browser and navigate to `http://localhost:5173` to access the Q&A interface.
