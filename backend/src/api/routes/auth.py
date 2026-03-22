import os
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv
from src.services.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

load_dotenv()

router = APIRouter()

@router.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    expected_username = os.getenv("ADMIN_USERNAME")
    expected_password = os.getenv("ADMIN_PASSWORD")
    
    if form_data.username != expected_username or form_data.password != expected_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
