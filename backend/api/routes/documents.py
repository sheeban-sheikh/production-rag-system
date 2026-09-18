from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from pypdf import PdfReader
from fastapi.responses import FileResponse
import uuid

from src.vector_store import (
    load_vector_store,
    get_documents,
    get_document_created_at,
    delete_document
)
from src.chat_history import delete_chats_by_document
from datetime import datetime, timezone
from src.ingestion import add_document

router = APIRouter()
MAX_FILE_SIZE = 100 * 1024 * 1024


@router.get("/documents")
def get_documents_list():
    vector_store = load_vector_store()

    documents = get_documents(vector_store)

    document_list = []

    for document_id, document_name in documents.items():
        file_path = Path("data") / document_name

        pages = 0
        size = 0
        created_at = get_document_created_at(
        vector_store,
        document_id
    )

        # Fallback for documents uploaded before created_at was added
        if not created_at and file_path.exists():
            created_at = datetime.fromtimestamp(
                file_path.stat().st_mtime,
                tz=timezone.utc
            ).isoformat()

        if file_path.exists():
            try:
                reader = PdfReader(str(file_path))
                pages = len(reader.pages)
                size = file_path.stat().st_size
            except Exception:
                pass

        document_list.append({
            "document_id": document_id,
            "document_name": document_name,
            "pages": pages,
            "size": size,
            "status": "Indexed",
            "created_at": created_at
        })

    return {
        "documents": document_list
    }

@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    upload_dir = Path("data")
    upload_dir.mkdir(exist_ok=True)

    file_path = upload_dir / file.filename

    if file_path.exists():
        file_path = upload_dir / (
            f"{file_path.stem}_{uuid.uuid4().hex[:8]}{file_path.suffix}"
        )

    try:
        contents = await file.read()

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File is too large. Maximum file size is 100 MB."
            )

        file_path.write_bytes(contents)

        document_id = add_document(file_path,original_filename=file.filename)
        reader = PdfReader(str(file_path))
        pages = len(reader.pages)
        size = file_path.stat().st_size

        created_at = get_document_created_at(
            load_vector_store(),
            document_id
        )

        return {
            "message": "Document uploaded and indexed successfully.",
            "document_id": document_id,
            "document_name": file.filename,
            "pages": pages,
            "size": size,
            "status": "Indexed",
            "created_at": created_at
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload document: {e}"
        )
@router.get("/documents/{document_id}/view")
def view_document(document_id: str):
    vector_store = load_vector_store()

    documents = get_documents(vector_store)

    if document_id not in documents:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    file_path = Path("data") / documents[document_id]

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF file not found."
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf"
    )


@router.get("/documents/{document_id}/download")
def download_document(document_id: str):
    vector_store = load_vector_store()

    documents = get_documents(vector_store)

    if document_id not in documents:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    file_path = Path("data") / documents[document_id]

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF file not found."
        )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=file_path.name
    )
@router.delete("/documents/{document_id}")
def delete_document_by_id(document_id: str):
    vector_store = load_vector_store()

    documents = get_documents(vector_store)
    print("DELETE REQUESTED:", document_id)
    print("AVAILABLE DOCUMENTS:", documents)

    if document_id not in documents:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    try:
        deleted_chunks = delete_document(
        vector_store,
        document_id
        )

        deleted_chats = delete_chats_by_document(
        document_id
        )

        return {
        "message": "Document deleted successfully.",
        "document_id": document_id,
        "deleted_chunks": deleted_chunks,
        "deleted_chats": deleted_chats
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete document: {e}"
        )