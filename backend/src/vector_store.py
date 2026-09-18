from langchain_chroma import Chroma
from src.embeddings import embeddings
from src.config import CHROMA_COLLECTION_NAME, CHROMA_PERSIST_DIRECTORY, RETRIEVAL_K
from src.logger import logger

def create_vector_store(chunks):
    vector_store=Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=CHROMA_COLLECTION_NAME,
        persist_directory=CHROMA_PERSIST_DIRECTORY
    )
    return vector_store

def load_vector_store():
    vector_store=Chroma(
        collection_name=CHROMA_COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIRECTORY

    )
    return vector_store

def create_retriever(vector_store,document_id=None):
    search_kwargs = {
        "k": RETRIEVAL_K
    }

    if document_id:
        search_kwargs["filter"] = {
            "document_id": document_id
        }

    retriever = vector_store.as_retriever(
        search_kwargs=search_kwargs
    )

    return retriever


def search_documents(vector_store,query,document_id=None,k=RETRIEVAL_K):
    search_kwargs = {
        "k": k
    }

    if document_id:
        search_kwargs["filter"] = {
            "document_id": document_id
        }

    results = vector_store.similarity_search_with_score(
        query,
        **search_kwargs
    )
    logger.info(
    f"Vector search completed: query='{query}', "
    f"results={len(results)}"
    )

    for document, score in results:
        print(f"Score: {score:.4f}")

    return results

def filter_relevant_documents(results, max_distance=1.0):
    relevant_documents = []

    for document, score in results:
        if score <= max_distance:
            relevant_documents.append(document)

    return relevant_documents

def get_documents(vector_store):
    data=vector_store.get(
        include=["metadatas"]
    )
    documents={}

    for metadata in data["metadatas"]:
        document_id=metadata.get("document_id")
        document_name = metadata.get("document_name")

        if document_id and document_name:
            documents[document_id] = document_name

    return documents

def get_document_created_at(vector_store, document_id):
    data = vector_store.get(
        where={"document_id": document_id},
        include=["metadatas"]
    )

    for metadata in data["metadatas"]:
        created_at = metadata.get("created_at")

        if created_at:
            return created_at

    return None

def delete_document(vector_store, document_id):
    data = vector_store.get(
        where={"document_id": document_id}
    )

    ids = data["ids"]

    if ids:
        vector_store.delete(ids=ids)
        logger.info(
            f"Deleted document {document_id} with {len(ids)} chunks."
        )

    return len(ids)