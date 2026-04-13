from sqlalchemy import Column, Integer, ForeignKey, Text
from pgvector.sqlalchemy import Vector
from app.database import Base

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.document_id"))

    content = Column(Text)
    embedding = Column(Vector(384))  # MiniLM size