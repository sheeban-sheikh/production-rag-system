CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

RETRIEVAL_K = 5
RERANKER_TOP_N = 3

MAX_HISTORY_MESSAGES = 10

CHROMA_PERSIST_DIRECTORY = "./chroma_db"
CHROMA_COLLECTION_NAME = "documents"

LLM_MODEL = "gemini-3.5-flash-lite"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"