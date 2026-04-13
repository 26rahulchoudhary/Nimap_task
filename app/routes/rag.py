from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.rag_service import index_document, remove_document_embeddings, search_documents, get_document_context
from app.schemas.rag import SearchRequest
from app.services.document_service import get_document
from app.dependencies.rbac import require_permission


router = APIRouter(prefix="/rag", tags=["RAG"])


@router.post("/index/{document_id}")
def index_doc(
    document_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("upload"))
):
    doc = get_document(db, document_id)

    if not doc:
        return {"error": "Document not found"}

    index_document(db, document_id, doc.file_path)

    return {"message": "Document indexed successfully"}


@router.delete("/remove-document/{document_id}")
def remove_embeddings(
    document_id: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("upload"))  # or Admin
):
    deleted = remove_document_embeddings(db, document_id)

    if deleted == 0:
        return {"message": "No embeddings found for this document"}

    return {
        "message": "Embeddings removed successfully",
        "deleted_chunks": deleted
    }


@router.post("/search")
def search(
    request: SearchRequest,
    db: Session = Depends(get_db)
):
    results = search_documents(db, request.query, request.top_k)
    return {"results": results}


@router.get("/context/{document_id}")
def get_context(
    document_id: int,
    db: Session = Depends(get_db)
):
    context = get_document_context(db, document_id)

    if not context:
        return {"message": "No context found for this document"}

    return {
        "document_id": document_id,
        "context": context
    }