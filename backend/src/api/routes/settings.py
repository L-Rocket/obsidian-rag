from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict

from src.services.db import get_db
from src.services.config import get_all_settings, update_all_settings

router = APIRouter()

@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    return get_all_settings(db)

@router.post("/settings")
def save_settings(settings: Dict[str, str], db: Session = Depends(get_db)):
    update_all_settings(db, settings)
    return {"message": "Settings updated successfully"}
