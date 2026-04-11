from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.auth import get_current_user
from app.database import get_db
from app.services.role_service import get_user_roles
from app.auth.rbac import has_permission


def require_permission(action: str):
    def checker(
        user = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        roles = get_user_roles(db, user.id)

        if not has_permission(roles, action):
            raise HTTPException(status_code=403, detail="Forbidden")

        return user

    return checker