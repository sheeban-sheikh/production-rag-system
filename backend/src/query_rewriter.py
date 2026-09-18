from langchain_core.prompts import ChatPromptTemplate
from src.llm import llm
from src.chat_history import get_recent_messages, get_summary
from src.config import MAX_HISTORY_MESSAGES

rewrite_prompt = ChatPromptTemplate.from_template("""
You are a query rewriting assistant for a document question-answering system.

Your task is to rewrite the user's latest question into a standalone question
that can be understood without the conversation history.

Use the conversation history to resolve references such as:
- it
- this
- that
- they
- them
- its
- their

Do not answer the question.

Return ONLY the rewritten standalone question.

If the question is already standalone, return it unchanged.

Conversation History:
{chat_history}

Latest Question:
{question}

Standalone Question:
""")
def rewrite_query(question,chat_history,document_id):
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

    formatted_prompt = rewrite_prompt.invoke({
        "chat_history": history,
        "question": question
    })

    response = llm.invoke(formatted_prompt)

    return response.content[0]['text'].strip()