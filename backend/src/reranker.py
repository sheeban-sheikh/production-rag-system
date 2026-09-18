

from src.config import (
    RERANKER_MODEL,
    RERANKER_TOP_N,
    USE_CROSS_ENCODER,
)
from src.logger import logger


reranker = None

if USE_CROSS_ENCODER:
    from sentence_transformers import CrossEncoder
    reranker = CrossEncoder(RERANKER_MODEL)


def rerank_documents(
    query,
    documents,
    top_n=RERANKER_TOP_N,
    score_threshold=0.0
):
    if not documents:
        return []

    if not USE_CROSS_ENCODER:
        logger.info(
            f"Cross-Encoder disabled: using vector search ranking, "
            f"candidates={len(documents)}, top_n={top_n}"
        )

        return documents[:top_n]

    pairs = [
        (query, document.page_content)
        for document in documents
    ]

    scores = reranker.predict(pairs)

    logger.info(
        f"Reranking completed: candidates={len(documents)}, "
        f"top_n={top_n}"
    )

    ranked_documents = sorted(
        zip(documents, scores),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        document
        for document, score in ranked_documents[:top_n]
        if score >= score_threshold
    ]