from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    
    # Relationship to users through user_roles junction table
    users = relationship(
        "User",
        secondary="user_roles",
        back_populates="roles"
    )
