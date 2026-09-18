from src.llm import llm
from src.prompt import prompt
from src.chat_history import get_recent_messages, get_summary
from src.config import MAX_HISTORY_MESSAGES

def generate_answer(query,documents,chat_history,document_id):
    context="\n\n".join(
        document.page_content
        for document in documents
    )
    recent_messages = get_recent_messages(chat_history, max_messages=MAX_HISTORY_MESSAGES)
    summary = get_summary(document_id)

    history_parts = []

    if summary:
        history_parts.append(f"Conversation Summary:\n{summary}")

    if recent_messages:
        recent_history = "\n".join(
            f"{message.type}: {message.content}"
            for message in recent_messages
        )
        history_parts.append(f"Recent Conversation:\n{recent_history}")

    history = "\n\n".join(history_parts)

    formatted_prompt = prompt.invoke({
        "context": context,
        "question": query,
        "chat_history": history
    })

    response = llm.invoke(formatted_prompt)

    return response.content[0]['text'], documents