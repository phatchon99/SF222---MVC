from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_db
from models import User
from schemas import UserResponse, UserCreate
from security import get_current_admin, get_password_hash

router = APIRouter(
    prefix="/users",
    tags=["User Management"]
)

@router.get("", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return db.query(User).all()

@router.post("", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    # Check if email exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if db_user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
