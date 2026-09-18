import { useEffect, useRef, useState } from "react"
import {
  sendMessage,
  createChat,
  uploadDocument,
} from "../services/api"
function ChatInput({
  query,
  setQuery,
  selectedDocumentId,
  selectedChatId,
  setSelectedChatId,
  setMessages,
  loading,
  setLoading,
  setDocumentsRefresh,
  setSelectedDocumentId,
  setSelectedDocumentName,
  setSelectedDocument,
  setChatsRefresh,
}) {
    const [uploadStatus, setUploadStatus] = useState("")
    const [chatError, setChatError] = useState("")
    const textareaRef = useRef(null)
    useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height =
      `${Math.min(textareaRef.current.scrollHeight, 120)}px`
  }
}, [query])

  async function handleFileSelect(event) {
  const file = event.target.files[0]
  
  if (!file) {
    return
  }
   const MAX_FILE_SIZE = 100 * 1024 * 1024

  if (file.size > MAX_FILE_SIZE) {
    setUploadStatus(
      `"${file.name}" is too large. Maximum file size is 100 MB.`
    )
    event.target.value = ""
    return
  }

  if (file.type !== "application/pdf") {
    setUploadStatus(
  `"${file.name}" is not a PDF. Only PDF files are allowed.`
)
    event.target.value = ""
    return
  }

  try {
    setLoading(true)
    setUploadStatus("Uploading and indexing...")

    const response = await uploadDocument(file)

setUploadStatus(
  `"${file.name}" uploaded successfully.`
)

setSelectedDocumentId(
  response.document_id
)

setSelectedDocumentName(
  response.document_name
)

setSelectedDocument({
  document_id: response.document_id,
  document_name: response.document_name,
  status: "Indexed",
})

setMessages([])
setDocumentsRefresh((previous) => previous + 1)

  } catch (error) {
    console.error("Upload failed:", error)

    setUploadStatus(
  `Upload failed for "${file.name}". Please try again.`
)
  } finally {
    setLoading(false)
    event.target.value = ""

    setTimeout(() => {
      setUploadStatus("")
    }, 3000)
  }
}
 async function handleSubmit() {
  if (!query.trim()) {
    return
  }

  if (!selectedDocumentId) {
    return
  }

  setLoading(true)

  try {
    let chatId = selectedChatId

    if (!chatId) {
      const chat = await createChat(selectedDocumentId)
      chatId = chat.chat_id
      setSelectedChatId(chatId)
      setChatsRefresh((previous) => previous + 1)
    }

    const response = await sendMessage(
      query,
      chatId
    )
    setChatError("")
   const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    })

    setMessages((previousMessages) => [
    ...previousMessages,
    {
        role: "user",
        content: query,
        timestamp: currentTime,
    },
    {
        role: "assistant",
        content: response.answer,
        sources: response.sources,
        timestamp: currentTime,
    },
    ])

    setQuery("")
    setChatsRefresh((previous) => previous + 1)
 } catch (error) {
  console.error("Chat request failed:", error)

  setChatError(
    "Something went wrong while generating the answer. Please try again."
  )
} finally {
    setLoading(false)
  }
}

  return (
  <div className="chat-input">

    <div className="chat-input-box">

      <label
            className={`upload-button ${
                loading ? "upload-button-disabled" : ""
            }`}
            >
            <img
                src="/icons/attachment.png"
                alt="Attach"
            />

            <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                disabled={loading}
                hidden
            />
            </label>
            <textarea
                    ref={textareaRef}
                    
                    placeholder="Ask a question about your document..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                        }
                    }}
                    rows={1}
                    />

      <button
        className="send-button"
        onClick={handleSubmit}
        disabled={loading || !query.trim() || !selectedDocumentId}
        >
        ➤
      </button>

    </div>

    <div className="chat-input-hint">
      💡 Get accurate answers with sources from your document
    </div>
    {uploadStatus && (
    <div
        className={`upload-status ${
        uploadStatus.includes("successfully")
            ? "upload-success"
            : uploadStatus.includes("failed") ||
            uploadStatus.includes("Only")
            ? "upload-error"
            : "upload-loading"
        }`}
    >
        {uploadStatus.includes("successfully") && "✓"}
        {uploadStatus.includes("failed") && "!"}
        {uploadStatus.includes("Only") && "!"}

        {!uploadStatus.includes("successfully") &&
        !uploadStatus.includes("failed") &&
        !uploadStatus.includes("Only") && "⏳"}

        <span>{uploadStatus}</span>
    </div>
    
    )}
    {chatError && (
  <div className="chat-error">
    <span>!</span>

    <p>{chatError}</p>

    <button
      onClick={() => setChatError("")}
      title="Dismiss"
    >
      ×
    </button>
  </div>
)}
  </div>
)
}

export default ChatInput