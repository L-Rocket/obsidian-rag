from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes.ingest import router as ingest_router
from src.api.routes.chat import router as chat_router
from src.api.routes.history import router as history_router
from src.api.routes.settings import router as settings_router

app = FastAPI(title="Obsidian RAG System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
