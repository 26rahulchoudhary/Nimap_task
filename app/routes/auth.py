from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import create_user, authenticate_user
from app.auth.jwt_handler import create_access_token
from app.models.user import User
from app.dependencies.auth import get_current_user


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = create_user(db, user.email, user.password)
    return {"message": "User created", "user_id": new_user.id}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})
    
    # Get roles and permissions from database
    roles = []
    permissions = []
    
    # Get user's roles from the relationship
    if db_user.roles:
        roles = [{"id": role.id, "name": role.name} for role in db_user.roles]
        
        # Get permissions based on roles
        from app.auth.rbac import ROLE_PERMISSIONS
        for role in db_user.roles:
            perms = ROLE_PERMISSIONS.get(role.name, [])
            permissions.extend(perms)
        
        # Remove duplicates
        permissions = list(set(permissions))
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "roles": roles,
            "permissions": permissions
        }
    }


@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    # Get roles and permissions from database
    roles = []
    permissions = []
    
    # Get user's roles from the relationship
    if current_user.roles:
        roles = [{"id": role.id, "name": role.name} for role in current_user.roles]
        
        # Get permissions based on roles
        from app.auth.rbac import ROLE_PERMISSIONS
        for role in current_user.roles:
            perms = ROLE_PERMISSIONS.get(role.name, [])
            permissions.extend(perms)
        
        # Remove duplicates
        permissions = list(set(permissions))
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "roles": roles,
        "permissions": permissions
    }
