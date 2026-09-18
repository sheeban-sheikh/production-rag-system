from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from src.vector_store import load_vector_store
from src.rag_service import process_query
from src.chat_history import get_chat_document, chat_exists

router = APIRouter()


class ChatRequest(BaseModel):
    query: str
    chat_id: str


@router.post("/chat")
def chat(request: ChatRequest):
    if not chat_exists(request.chat_id):
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    document_id = get_chat_document(request.chat_id)

    if not document_id:
        raise HTTPException(
            status_code=404,
            detail="Document associated with chat not found."
        )
    vector_store = load_vector_store()
    
    try:
        response = process_query(
            query=request.query,
            document_id=document_id,
            chat_id=request.chat_id,
            vector_store=vector_store
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))