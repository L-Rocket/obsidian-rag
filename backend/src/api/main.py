import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from src.api.routes.ingest import router as ingest_router
from src.api.routes.chat import router as chat_router
from src.api.routes.history import router as history_router
from src.api.routes.settings import router as settings_router
from src.api.routes.auth import router as auth_router

logger = logging.getLogger("app.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "%s %s -> %s (%.1fms)",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response

app = FastAPI(title="Obsidian RAG System API")
app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(ingest_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
