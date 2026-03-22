import json
import asyncio
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uuid

from src.services.db import get_db
from src.models.db_models import Conversation, Message, RoleEnum
from src.graph.workflow import rag_app

router = APIRouter()

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    query: str

async def stream_rag_response(query: str, conversation_id: str, db: Session):
    state = {
        "conversation_id": conversation_id,
        "query": query,
        "chat_history": [],
        "context_documents": [],
        "generation": ""
    }
    
    # Save user message to db
    user_msg = Message(
        conversation_id=conversation_id,
        role=RoleEnum.user,
        content=query
    )
    db.add(user_msg)
    db.commit()
    
    # For a real streaming implementation, we would use an astream events approach from langgraph.
    # Here we will simulate SSE streaming by chunking the final generation or yielding graph events.
    # In LangGraph with Langchain, we can yield from `astream_events` or `astream`.
    
    # Using simple invoke for the MVP and then yielding chunks
    result = rag_app.invoke(state)
    
    generation = result.get("generation", "")
    sources = [{"filename": d["filename"], "metadata": d.get("metadata", {})} for d in result.get("context_documents", [])]
    
    # Save assistant message
    asst_msg = Message(
        conversation_id=conversation_id,
        role=RoleEnum.assistant,
        content=generation,
        sources=sources
    )
    db.add(asst_msg)
    db.commit()
    
    # Simulate streaming
    for i in range(0, len(generation), 10):
        chunk = generation[i:i+10]
        yield f"event: message\ndata: {json.dumps({'chunk': chunk})}\n\n"
        await asyncio.sleep(0.01)
        
    yield f"event: sources\ndata: {json.dumps(sources)}\n\n"
    yield f"event: done\ndata: {{}}\n\n"

@router.post("/chat/stream")
async def chat_stream(req: ChatRequest, db: Session = Depends(get_db)):
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
