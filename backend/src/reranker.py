from sentence_transformers import CrossEncoder
from src.config import RERANKER_MODEL, RERANKER_TOP_N
from src.logger import logger

reranker = CrossEncoder(
    RERANKER_MODEL
)


def rerank_documents(query, documents, top_n=RERANKER_TOP_N, score_threshold=0.0):
    if not documents:
        return []

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

    print("\n" + "=" * 50)
    print("RERANKING RESULTS")
    print("=" * 50)

    for i, (document, score) in enumerate(ranked_documents, start=1):
        print(f"\n--- Rank {i} ---")
        print(f"Reranker Score: {score:.4f}")
        print(document.page_content[:300])

    return [
        document
        for document, score in ranked_documents[:top_n]
        if score >= score_threshold
    ]