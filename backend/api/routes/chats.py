from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.chat_history import (
    create_chat,
    get_all_chats,
    get_chat_history_by_id,
    get_chat_document,
    delete_chat,
    chat_exists,
    rename_chat,
)

router = APIRouter()


class CreateChatRequest(BaseModel):
    document_id: str

class RenameChatRequest(BaseModel):
    title: str
@router.post("/chats")
def create_new_chat(request: CreateChatRequest):
    chat_id = create_chat(request.document_id)

    return {
        "chat_id": chat_id,
        "document_id": request.document_id,
    }


@router.get("/chats")
def list_chats():
    return {
        "chats": get_all_chats()
    }


@router.get("/chats/{chat_id}")
def get_chat(chat_id: str):
    if not chat_exists(chat_id):
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    history = get_chat_history_by_id(chat_id)
    document_id = get_chat_document(chat_id)

    messages = [
        {
            "type": message.type,
            "content": message.content,
        }
        for message in history.messages
    ]

    return {
        "chat_id": chat_id,
        "document_id": document_id,
        "messages": messages,
    }


@router.delete("/chats/{chat_id}")
def remove_chat(chat_id: str):
    if not chat_exists(chat_id):
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    delete_chat(chat_id)

    return {
        "message": "Chat deleted successfully.",
        "chat_id": chat_id,
    }
@router.patch("/chats/{chat_id}")
def rename_chat_by_id(chat_id: str, request: RenameChatRequest):
    if not chat_exists(chat_id):
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    title = request.title.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Chat title cannot be empty."
        )

    if len(title) > 100:
        raise HTTPException(
            status_code=400,
            detail="Chat title cannot exceed 100 characters."
        )

    rename_chat(chat_id, title)

    return {
        "message": "Chat renamed successfully.",
        "chat_id": chat_id,
        "title": title,
    }