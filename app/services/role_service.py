from sqlalchemy.orm import Session
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.user import User

def create_role(db: Session, name: str):
    role = Role(name=name)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role


def assign_role(db: Session, user_id: int, role_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    role = db.query(Role).filter(Role.id == role_id).first()

    if not user or not role:
        return None

    user_role = UserRole(user_id=user_id, role_id=role_id)
    db.add(user_role)
    db.commit()
    return user_role


def get_user_roles(db: Session, user_id: int):
    roles = (
        db.query(Role.name)
        .join(UserRole, Role.id == UserRole.role_id)
        .filter(UserRole.user_id == user_id)
        .all()
    )
    return [r[0] for r in roles]