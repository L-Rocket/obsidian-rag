import os
from sqlalchemy.orm import Session
from src.models.db_models import Setting
from typing import Dict, Optional

def get_setting(db: Session, key: str, default: Optional[str] = None) -> Optional[str]:
    setting = db.query(Setting).filter(Setting.key == key).first()
    if setting:
        return setting.value
    # Fallback to environment variable
    return os.getenv(key, default)

def set_setting(db: Session, key: str, value: str):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if setting:
        setting.value = value
    else:
        setting = Setting(key=key, value=value)
        db.add(setting)
    db.commit()

def get_all_settings(db: Session) -> Dict[str, str]:
    """Returns settings from DB with fallback to env for known keys"""
    keys = [
        "OBSIDIAN_VAULT_PATH",
        "CHAT_API_BASE",
        "CHAT_API_KEY",
        "CHAT_MODEL",
        "EMBEDDING_API_BASE",
        "EMBEDDING_API_KEY",
        "EMBEDDING_MODEL"
    ]
    result = {}
    for k in keys:
        result[k] = get_setting(db, k, "")
    return result

def update_all_settings(db: Session, settings: Dict[str, str]):
    for k, v in settings.items():
        set_setting(db, k, v)
