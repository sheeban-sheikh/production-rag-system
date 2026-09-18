from pathlib import Path
from uuid import uuid4

from src.loader import load_pdf
from src.chunker import split_document
from src.vector_store import load_vector_store
from datetime import datetime, timezone

def add_document(file_path,original_filename=None):
    file_path = Path(file_path)
    display_name = original_filename or file_path.name

    print(f"Loading: {display_name}")

    # Generate unique ID for this document
    document_id = str(uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    # Load PDF
    documents = load_pdf(str(file_path))

    # Add metadata
    for document in documents:
        document.metadata["document_id"] = document_id
        document.metadata["document_name"] = display_name
        document.metadata["created_at"] = created_at

    # Split into chunks
    chunks = split_document(documents)

    # Load existing vector store
    vector_store = load_vector_store()

    # Add chunks to ChromaDB
    vector_store.add_documents(chunks)

    print(f"Document: {display_name}")
    print(f"Pages: {len(documents)}")
    print(f"Chunks: {len(chunks)}")
    print("Document indexed successfully!")

    return document_id