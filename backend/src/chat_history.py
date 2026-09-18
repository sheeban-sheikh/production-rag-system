from langchain_core.chat_history import InMemoryChatMessageHistory
from src.llm import llm
from src.config import MAX_HISTORY_MESSAGES
from uuid import uuid4
chat_histories = {}
conversation_summaries = {}
chat_documents = {}
chat_titles = {}
def create_chat(document_id):
    chat_id = str(uuid4())

    chat_histories[chat_id] = InMemoryChatMessageHistory()
    conversation_summaries[chat_id] = ""
    chat_documents[chat_id] = document_id
    chat_titles[chat_id] = "New Chat"

    return chat_id

def update_chat_title(chat_id, title):
    if chat_id in chat_titles:
        chat_titles[chat_id] = title
def rename_chat(chat_id, title):
    if chat_id not in chat_histories:
        return False

    chat_titles[chat_id] = title.strip()
    return True
def get_chat_title(chat_id):
    return chat_titles.get(chat_id, "New Chat")

def get_chat_history_by_id(chat_id):
    return chat_histories.get(chat_id)

def get_chat_document(chat_id):
    return chat_documents.get(chat_id)

def get_chat_history(document_id):
    if document_id not in chat_histories:
        chat_histories[document_id] = InMemoryChatMessageHistory()

    return chat_histories[document_id]

def get_recent_messages(chat_history, max_messages=MAX_HISTORY_MESSAGES):
    return chat_history.messages[-max_messages:]

def update_summary(document_id, summary):
    conversation_summaries[document_id] = summary

def generate_summary(document_id, messages):

    conversation = "\n".join(
        f"{message.type}: {message.content}"
        for message in messages
    )

    prompt = f"""
Summarize the following conversation for future use.

Keep only important information needed to understand future questions,
including topics discussed, important facts, decisions, and references.

Do not invent information.

Conversation:
{conversation}

Summary:
"""

    response = llm.invoke(prompt)

    summary = response.content[0]["text"].strip()

    update_summary(document_id, summary)

    return summary

def trim_history(chat_history, max_messages=MAX_HISTORY_MESSAGES):
    if len(chat_history.messages) > max_messages:
        chat_history.messages = chat_history.messages[-max_messages:]

def get_summary(document_id):
    return conversation_summaries.get(document_id, "")

def get_all_chats():
    chats = []

    for chat_id, history in chat_histories.items():
        chats.append({
    "chat_id": chat_id,
    "document_id": chat_documents.get(chat_id),
    "title": chat_titles.get(chat_id, "New Chat"),
    "message_count": len(history.messages),
})

    return chats


def delete_chat(chat_id):
    chat_histories.pop(chat_id, None)
    conversation_summaries.pop(chat_id, None)
    chat_documents.pop(chat_id, None)
    chat_titles.pop(chat_id, None)


def chat_exists(chat_id):
    return chat_id in chat_histories
def delete_chats_by_document(document_id):
    chat_ids_to_delete = [
        chat_id
        for chat_id, chat_document_id in chat_documents.items()
        if chat_document_id == document_id
    ]

    for chat_id in chat_ids_to_delete:
        delete_chat(chat_id)

    return len(chat_ids_to_delete)