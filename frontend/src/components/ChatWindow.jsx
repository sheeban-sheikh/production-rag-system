import Sources from "./Sources"
import ReactMarkdown from "react-markdown"
import { useEffect, useRef } from "react"

function ChatWindow({ selectedDocumentId, messages, loading }) {
     const chatContentRef = useRef(null)

useEffect(() => {
  const chatContainer = chatContentRef.current

  if (!chatContainer) {
    return
  }

  const scrollToBottom = () => {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    })
  }

  requestAnimationFrame(scrollToBottom)
}, [messages, loading])
  return (
    <div className="chat-content" ref={chatContentRef}>
      {selectedDocumentId ? (
        <>
          <div className="welcome-message">
            <h2>Ask questions about your document</h2>
            <p>
              Your document is ready. Ask anything about it.
            </p>
          </div>

        {messages.map((message, index) => (
            <div
                key={index}
                className={`message-wrapper ${
                message.role === "user"
                    ? "user-wrapper"
                    : "assistant-wrapper"
                }`}
            >
                <img
                src={
                    message.role === "user"
                    ? "/icons/user.png"
                    : "/icons/bot.png"
                }
                alt={
                    message.role === "user"
                    ? "User"
                    : "AI"
                }
                className="message-avatar"
                />

                <div className="message-content-wrapper">

                <div
                    className={`message ${
                    message.role === "user"
                        ? "user-message"
                        : "assistant-message"
                    }`}
                >
                    <ReactMarkdown>
                    {message.content}
                    </ReactMarkdown>
                </div>

                <div className="message-time">
                    {message.timestamp}
                </div>

                {message.role === "assistant" && (
                    <Sources sources={message.sources} />
                )}

                </div>
            </div>
            ))}
        {loading && (
            <div className="message-wrapper assistant-wrapper">
                <img
                src="/icons/bot.png"
                alt="AI"
                className="message-avatar"
                />

                <div className="message assistant-message typing-message">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                </div>
            </div>
            )}
        </>
      ) : (
        <div className="welcome-message">
            <div className="welcome-icon">
                <img
                src="/icons/book.png"
                alt="Documents"
                />
            </div>

            <h2>Select a document to get started</h2>

            <p>
                Choose a document from the sidebar and start asking
                questions using AI-powered document search.
            </p>

            <div className="welcome-hint">
                <span>1</span>
                <p>Select a PDF from your documents</p>
            </div>

            <div className="welcome-hint">
                <span>2</span>
                <p>Ask a question about the document</p>
            </div>

            <div className="welcome-hint">
                <span>3</span>
                <p>Get an answer with relevant sources</p>
            </div>
            </div>
      )}
    </div>
  )
}

export default ChatWindow