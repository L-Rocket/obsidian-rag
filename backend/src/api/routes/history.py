from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.services.db import get_db
from src.services.auth import get_current_user
from src.models.db_models import Conversation

router = APIRouter()

@router.get("/conversations/{conversation_id}/messages")
def get_conversation_history(conversation_id: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    messages = []
    for msg in sorted(conv.messages, key=lambda x: x.created_at):
        messages.append({
            "id": str(msg.id),
            "role": msg.role.value,
            "content": msg.content,
            "sources": msg.sources,
            "created_at": msg.created_at.isoformat()
        })
        
    return {"messages": messages}
