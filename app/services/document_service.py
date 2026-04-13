import os
from sqlalchemy.orm import Session
from app.models.document import Document
import uuid
from fastapi import HTTPException
from app.models.document_chunk import DocumentChunk

UPLOAD_DIR = "uploads"

def save_file(file):
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files allowed")

    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path


def create_document(db: Session, data, file_path, user_id):
    doc = Document(
        title=data.title,
        company_name=data.company_name,
        document_type=data.document_type,
        file_path=file_path,
        uploaded_by=user_id
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def get_all_documents(db: Session):
    return db.query(Document).all()


def get_document(db: Session, doc_id: int):
    return db.query(Document).filter(Document.document_id == doc_id).first()


def delete_document(db: Session, document_id: int):
    doc = db.query(Document).filter(Document.document_id == document_id).first()

    if not doc:
        return None

    # Delete embeddings
    db.query(DocumentChunk).filter(
        DocumentChunk.document_id == document_id
    ).delete()

    # Delete file
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # Delete document
    db.delete(doc)

    db.commit()
    return doc


def search_documents(db: Session, company: str):
    results = (
        db.query(Document)
        .filter(Document.company_name.ilike(f"%{company}%"))
        .all()
    )

    return results