from src.chat_history import (
    get_chat_history_by_id,
    generate_summary,
    trim_history,
    get_chat_title,
    update_chat_title,
)
from src.vector_store import search_documents
from src.rag import generate_answer
from src.query_rewriter import rewrite_query
from src.reranker import rerank_documents
from src.config import RETRIEVAL_K, RERANKER_TOP_N, MAX_HISTORY_MESSAGES
from src.logger import logger


def process_query(query, document_id, chat_id, vector_store):
    chat_history = get_chat_history_by_id(chat_id)
    if get_chat_title(chat_id) == "New Chat":
        title = query.strip()

        if len(title) > 40:
            title = title[:40].rstrip() + "..."

        update_chat_title(chat_id, title)

    if chat_history is None:
        raise ValueError("Chat history not found.")

    try:
        standalone_query = rewrite_query(
            query,
            chat_history,
            document_id
        )
    except Exception as e:
        logger.error(f"Query rewriting failed: {e}")
        raise

    results = search_documents(
        vector_store,
        standalone_query,
        document_id=document_id,
        k=RETRIEVAL_K
    )

    if not results:
        return {
            "answer": "I don't know based on the provided document.",
            "sources": []
        }

    retrieved_documents = [
        document
        for document, score in results
    ]

    try:
        reranked_documents = rerank_documents(
            standalone_query,
            retrieved_documents,
            top_n=RERANKER_TOP_N
        )
    except Exception as e:
        logger.error(f"Reranking failed: {e}")
        raise

    if not reranked_documents:
        answer = "I don't know based on the provided document."
        source_documents = []
    else:
        try:
            answer, source_documents = generate_answer(
                query,
                reranked_documents,
                chat_history,
                document_id
            )
        except Exception as e:
            logger.error(f"Answer generation failed: {e}")
            raise

    chat_history.add_user_message(query)
    chat_history.add_ai_message(answer)

    if len(chat_history.messages) > MAX_HISTORY_MESSAGES:
        old_messages = chat_history.messages[:-MAX_HISTORY_MESSAGES]

        try:
            generate_summary(
                chat_id,
                old_messages
            )
        except Exception as e:
            logger.error(
                f"Conversation summary generation failed: {e}"
            )

        trim_history(
            chat_history,
            max_messages=MAX_HISTORY_MESSAGES
        )

    unique_sources = set()

    for document in source_documents:
        source = document.metadata.get("source")
        page = document.metadata.get("page", 0) + 1
        unique_sources.add((source, page))

    sources = [
        {
            "document": source,
            "page": page,
            "document_id": document_id
        }
        for source, page in unique_sources
    ]

    return {
        "answer": answer,
        "sources": sources
    }