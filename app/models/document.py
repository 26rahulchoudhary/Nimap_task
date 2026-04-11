from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    document_type = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    uploaded_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)