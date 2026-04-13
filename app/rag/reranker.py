from sentence_transformers import CrossEncoder

# Load once (important)
reranker_model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


def rerank(query, chunks, top_k=5):
    # Prepare pairs: (query, chunk)
    pairs = [(query, chunk["content"]) for chunk in chunks]

    # Get scores
    scores = reranker_model.predict(pairs)

    # Attach scores
    for i, score in enumerate(scores):
        chunks[i]["rerank_score"] = float(score)

    # Sort by rerank score (higher = better)
    ranked = sorted(chunks, key=lambda x: x["rerank_score"], reverse=True)

    return ranked[:top_k]