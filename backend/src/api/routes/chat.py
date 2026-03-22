import json
import asyncio
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from src.services.db import get_db
from src.services.auth import get_current_user
from src.models.db_models import Conversation, Message, RoleEnum
from src.graph.nodes.generate import get_llm, format_context
from src.services.vector_search import search_documents

router = APIRouter()

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    query: str

def _build_history_messages(db: Session, conversation_id: str, limit: int = 12):
    history_rows = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )
    history_rows.reverse()

    history_messages = []
    for row in history_rows:
        if row.role == RoleEnum.user:
            history_messages.append(HumanMessage(content=row.content))
        else:
            history_messages.append(AIMessage(content=row.content))
    return history_messages


async def stream_rag_response(query: str, conversation_id: str, db: Session):
    history_messages = _build_history_messages(db, conversation_id)

    # Save current user message before generation.
    user_msg = Message(
        conversation_id=conversation_id,
        role=RoleEnum.user,
        content=query,
    )
    db.add(user_msg)
    db.commit()

    documents = search_documents(db, query)
    context_str = format_context(documents)
    system_prompt = (
        "You are a helpful assistant answering questions based on the provided Obsidian notes. "
        "Cite concrete files from the retrieved context when relevant.\n\n"
        f"Context:\n{context_str}"
    )

    messages = [
        SystemMessage(content=system_prompt),
        *history_messages,
        HumanMessage(content=query),
    ]

    sources = [
        {
            "filename": d["filename"],
            "metadata": d.get("metadata", {}),
            "score": d.get("score"),
        }
        for d in documents
    ]

    # Emit metadata events first so the frontend can show progress and references.
    yield f"event: conversation\ndata: {json.dumps({'conversation_id': conversation_id})}\n\n"
    yield (
        "event: trace\ndata: "
        + json.dumps(
            {
                "stage": "retrieve",
                "retrieved_count": len(documents),
                "files": [
                    {
                        "filename": s["filename"],
                        "source_path": (s.get("metadata") or {}).get("source_path"),
                        "score": s.get("score"),
                    }
                    for s in sources
                ],
            }
        )
        + "\n\n"
    )

    generation_parts = []
    llm = get_llm(db)
    async for chunk in llm.astream(messages):
        piece = chunk.content
        if isinstance(piece, list):
            piece = "".join(str(part) for part in piece)
        piece = piece or ""
        if not piece:
            continue
        generation_parts.append(piece)
        yield f"event: message\ndata: {json.dumps({'chunk': piece})}\n\n"
        await asyncio.sleep(0)

    generation = "".join(generation_parts)

    asst_msg = Message(
        conversation_id=conversation_id,
        role=RoleEnum.assistant,
        content=generation,
        sources=sources,
    )
    db.add(asst_msg)
    db.commit()

    yield f"event: sources\ndata: {json.dumps(sources)}\n\n"
    yield "event: done\ndata: {}\n\n"

@router.post("/chat/stream")
async def chat_stream(req: ChatRequest, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    # Create conversation if not exists
    if not req.conversation_id:
        conv = Conversation(title=req.query[:50])
        db.add(conv)
        db.commit()
        db.refresh(conv)
        conv_id = str(conv.id)
    else:
        conv_id = req.conversation_id
        
        # Verify conversation exists
        conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")

    return StreamingResponse(
        stream_rag_response(req.query, conv_id, db),
        media_type="text/event-stream"
    )
