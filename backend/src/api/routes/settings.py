from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict

from src.services.db import get_db
from src.services.config import get_all_settings, update_all_settings
from src.services.auth import get_current_user

router = APIRouter()

@router.get("/settings")
def get_settings(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return get_all_settings(db)

@router.post("/settings")
def save_settings(settings: Dict[str, str], db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    update_all_settings(db, settings)
    return {"message": "Settings updated successfully"}
