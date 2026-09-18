from langchain_core.prompts import ChatPromptTemplate


prompt = ChatPromptTemplate.from_template("""
You are a helpful document assistant.

Use the conversation history and the provided document context
to understand the user's question.

Answer using ONLY information supported by the document context.

If the answer is not present in the context, say:
"I don't know based on the provided document."

Conversation History:
{chat_history}

Document Context:
{context}

Current Question:
{question}

Answer:
""")