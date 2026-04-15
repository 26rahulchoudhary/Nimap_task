from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.role import RoleCreate, AssignRole
from app.services.role_service import create_role, assign_role, get_user_roles
from app.auth.rbac import ROLE_PERMISSIONS, has_permission
from app.dependencies.rbac import require_permission
from app.dependencies.auth import get_current_user
router = APIRouter(tags=["Roles"])


@router.post("/roles/create")
def create_role_api(
    role: RoleCreate,
    db: Session = Depends(get_db),
    user = Depends(require_permission("*"))
):
    new_role = create_role(db, role.name)
    return {"message": "Role created", "role_id": new_role.id}

@router.post("/users/assign-role")
def assign_role_api( data: AssignRole,
    db: Session = Depends(get_db),
    user = Depends(require_permission("*"))
):
    result = assign_role(db, data.user_id, data.role_id)

    if not result:
        raise HTTPException(status_code=404, detail="User or Role not found")

    return {"message": "Role assigned successfully"}


@router.get("/users/{user_id}/roles")
def get_roles(user_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    roles = get_user_roles(db, user_id)
    return {"user_id": user_id, "roles": roles}


@router.get("/users/{user_id}/permissions")
def get_permissions(user_id: int, db: Session = Depends(get_db)):
    roles = get_user_roles(db, user_id)

    permissions = set()
    for role in roles:
        perms = ROLE_PERMISSIONS.get(role, [])
        permissions.update(perms)

    return {"user_id": user_id, "permissions": list(permissions)}




