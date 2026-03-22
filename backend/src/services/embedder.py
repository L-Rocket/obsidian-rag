import os
from contextlib import contextmanager
from typing import List
from urllib.parse import urlsplit, urlunsplit

import httpx
from langchain_openai import OpenAIEmbeddings
from sqlalchemy.orm import Session

from src.services.config import get_setting


@contextmanager
def _without_unsupported_proxy_scheme():
    """
    Some SDK stacks choke on socks5h:// proxies without extra transport deps.
    Temporarily remove these env vars for the embedding call.
    """
    proxy_keys = [
        "HTTP_PROXY",
        "HTTPS_PROXY",
        "ALL_PROXY",
        "http_proxy",
        "https_proxy",
        "all_proxy",
    ]
    backup = {}
    for key in proxy_keys:
        value = os.environ.get(key)
        if value and value.startswith(("socks5://", "socks5h://")):
            backup[key] = value
            os.environ.pop(key, None)
    try:
        yield
    finally:
        for key, value in backup.items():
            os.environ[key] = value


def _normalize_ollama_base(api_base: str) -> str:
    parsed = urlsplit(api_base.rstrip("/"))
    path = parsed.path
    if path.endswith("/v1"):
        path = path[: -len("/v1")]
    return urlunsplit((parsed.scheme, parsed.netloc, path, "", "")).rstrip("/")


def _get_ollama_embeddings(texts: List[str], api_base: str, model: str, api_key: str) -> List[List[float]]:
    base = _normalize_ollama_base(api_base)
    headers = {}
    if api_key and api_key != "dummy-key":
        headers["Authorization"] = f"Bearer {api_key}"

    with httpx.Client(timeout=120, trust_env=False) as client:
        # Preferred endpoint for batching.
        embed_resp = client.post(
            f"{base}/api/embed",
            json={"model": model, "input": texts},
            headers=headers,
        )
        if embed_resp.status_code < 400:
            payload = embed_resp.json()
            vectors = payload.get("embeddings")
            if isinstance(vectors, list) and vectors and isinstance(vectors[0], list):
                return vectors

        # Backward-compatible fallback for older Ollama versions.
        vectors: List[List[float]] = []
        for text in texts:
            single_resp = client.post(
                f"{base}/api/embeddings",
                json={"model": model, "prompt": text},
                headers=headers,
            )
            if single_resp.status_code >= 400:
                raise RuntimeError(
                    f"Ollama embedding request failed ({single_resp.status_code}): {single_resp.text}"
                )
            payload = single_resp.json()
            vector = payload.get("embedding")
            if not isinstance(vector, list):
                raise RuntimeError("Ollama embeddings response missing 'embedding' array")
            vectors.append(vector)
        return vectors

def get_embeddings(texts: List[str], db: Session) -> List[List[float]]:
    """
    Generates embeddings for a list of text strings using the configured LLM.
    """
    api_key = get_setting(db, "EMBEDDING_API_KEY", "dummy-key")
    api_base = get_setting(db, "EMBEDDING_API_BASE")
    embedding_model = get_setting(db, "EMBEDDING_MODEL", "text-embedding-3-small")
    
    if api_base and "11434" in api_base:
        return _get_ollama_embeddings(texts, api_base, embedding_model, api_key)

    kwargs = {
        "model": embedding_model,
        "api_key": api_key,
    }

    if api_base:
        kwargs["openai_api_base"] = api_base

    try:
        with _without_unsupported_proxy_scheme():
            embeddings_model = OpenAIEmbeddings(**kwargs)
            return embeddings_model.embed_documents(texts)
    except Exception as exc:
        # Fallback for users pointing to Ollama via OpenAI-compatible /v1 URL.
        if api_base and "11434" in api_base:
            return _get_ollama_embeddings(texts, api_base, embedding_model, api_key)
        raise exc
