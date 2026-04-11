from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.document import DocumentCreate
from app.services.document_service import (
    save_file, create_document,
    get_all_documents, get_document,
    delete_document, search_documents
)
from app.dependencies.rbac import require_permission

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload")
def upload_document(
    title: str = Form(...),
    company_name: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user = Depends(require_permission("upload"))
):
    file_path = save_file(file)

    data = DocumentCreate(
        title=title,
        company_name=company_name,
        document_type=document_type
    )

    doc = create_document(db, data, file_path, user.id)
    return {"message": "Document uploaded", "doc_id": doc.document_id}


@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    user = Depends(require_permission("view"))
):
    return get_all_documents(db)

@router.get("/{doc_id}")
def get_single_document(
    doc_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("view"))
):
    doc = get_document(db, doc_id)

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return doc


@router.delete("/{doc_id}")
def delete_doc(
    doc_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("*"))  # Admin
):
    doc = delete_document(db, doc_id)

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    return {"message": "Deleted successfully"}


@router.get("/search/")
def search_docs(
    company: str,
    db: Session = Depends(get_db),
    user = Depends(require_permission("view"))
):
    return search_documents(db, company)