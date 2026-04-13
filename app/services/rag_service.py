from sqlalchemy.orm import Session
from app.models.document_chunk import DocumentChunk
from app.rag.extractor import extract_text
from app.rag.chunker import chunk_text
from app.rag.embeddings import get_embedding
from app.rag.reranker import rerank

from sqlalchemy import asc


def index_document(db: Session, document_id: int, file_path: str):
    # 1. Extract text
    text = extract_text(file_path)

    # 2. Chunk
    chunks = chunk_text(text)

    # 3. Store each chunk
    for chunk in chunks:
        embedding = get_embedding(chunk)

        doc_chunk = DocumentChunk(
            document_id=document_id,
            content=chunk,
            embedding=embedding
        )

        db.add(doc_chunk)

    db.commit()


def remove_document_embeddings(db: Session, document_id: int):
    deleted_count = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .delete()
    )

    db.commit()

    return deleted_count


def search_documents(db: Session, query: str, top_k: int = 5):
    query_embedding = get_embedding(query)

    # Get TOP 20 from vector search
    results = (
        db.query(
            DocumentChunk,
            DocumentChunk.embedding.l2_distance(query_embedding).label("distance")
        )
        .order_by("distance")
        .limit(20)
        .all()
    )

    # Format initial results
    chunks = []
    for row in results:
        chunk = row[0]
        chunks.append({
            "document_id": chunk.document_id,
            "content": chunk.content,
            "score": float(row[1])  # vector score
        })

    # Step 3: Rerank
    reranked = rerank(query, chunks, top_k=top_k)

    return reranked


def get_document_context(db: Session, document_id: int, limit: int = 10):
    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.document_id == document_id)
        .order_by(DocumentChunk.id)  # or created order
        .limit(limit)
        .all()
    )

    return [c.content for c in chunks]