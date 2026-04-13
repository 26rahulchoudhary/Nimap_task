from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import create_user, authenticate_user
from app.auth.jwt_handler import create_access_token
from app.models.user import User


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
    
    # Initialize empty roles and permissions
    roles = []
    permissions = []
    
    # Try to get roles if the relationship exists
    try:
        if hasattr(db_user, 'roles') and db_user.roles:
            roles = [{"id": role.id, "name": role.name} for role in db_user.roles]
            # Get permissions from roles
            for role in db_user.roles:
                if hasattr(role, 'permissions') and role.permissions:
                    for perm in role.permissions:
                        perm_name = perm.name if hasattr(perm, 'name') else str(perm)
                        if perm_name not in permissions:
                            permissions.append(perm_name)
    except Exception as e:
        # If there's any error getting roles/permissions, continue without them
        print(f"Note: Could not fetch roles/permissions: {e}")
    
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
