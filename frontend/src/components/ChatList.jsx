import { useEffect, useState } from "react"
import {
  getChats,
  getChat,
  getDocument,
  renameChat,
  deleteChat,
} from "../services/api"

function ChatList({
  selectedChatId,
  setSelectedChatId,
  setSelectedDocumentId,
  setSelectedDocumentName,
  setSelectedDocument,
  setMessages,
  chatsRefresh,
}) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState(null)
  const [renameChatId, setRenameChatId] = useState(null)
  const [renameTitle, setRenameTitle] = useState("")
  const [deleteChatId, setDeleteChatId] = useState(null)
  const [deleteChatTitle, setDeleteChatTitle] = useState("")
  useEffect(() => {
    async function loadChats() {
      try {
        const data = await getChats()
        setChats(data.chats)
      } catch (error) {
        console.error("Failed to load chats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChats()
  }, [chatsRefresh])

  if (loading) {
    return (
      <div className="chat-list">
        <div className="chats-header">
            <h2>Your Chats</h2>

            <button
                className="new-chat-button"
                onClick={() => {
                setSelectedChatId(null)
                setMessages([])
                setSelectedDocumentId(null)
                setSelectedDocumentName("")
                setSelectedDocument(null)
                }}
                title="New Chat"
            >
                +
            </button>
</div>

        <p className="chat-list-loading">Loading chats...</p>
      </div>
    )
  }

  return (
    <div className="chat-list">
      <div className="chats-header">
  <h2>Your Chats</h2>

  <button
    className="new-chat-button"
    onClick={() => {
      setSelectedChatId(null)
      setMessages([])
      setSelectedDocumentId(null)
      setSelectedDocumentName("")
      setSelectedDocument(null)
    }}
    title="New Chat"
  >
    +
  </button>
</div>

      {chats.map((chat) => (
        <div
          className={`chat-item ${
            selectedChatId === chat.chat_id ? "selected" : ""
          }`}
          key={chat.chat_id}
          onClick={async () => {
            setSelectedChatId(chat.chat_id)

            try {
                const chatData = await getChat(chat.chat_id)

                setSelectedDocumentId(chatData.document_id)

                const document = await getDocument(chatData.document_id)

                setSelectedDocument(document)
                setSelectedDocumentName(document.document_name)

                setMessages(
                chatData.messages.map((message) => ({
                    role: message.type === "human" ? "user" : "assistant",
                    content: message.content,
                }))
                )
            } catch (error) {
                console.error("Failed to load chat:", error)
            }
            }}
        >
          <div className="chat-icon-wrapper">
            <img
              src="/icons/chat.png"
              alt="Chat"
              className="chat-icon"
            />
          </div>

          <div className="chat-text">
            <span className="chat-name">
              {chat.title || "New Chat"}
            </span>

            <span className="chat-meta">
              {chat.message_count} messages
            </span>
          </div>
          <div className="chat-actions">
            <button
                className="chat-menu-button"
                onClick={(event) => {
                event.stopPropagation()

                setActiveMenu(
                    activeMenu === chat.chat_id
                    ? null
                    : chat.chat_id
                )
                }}
                title="Chat options"
            >
                ⋮
            </button>

            {activeMenu === chat.chat_id && (
                <div
                className="chat-menu"
                onClick={(event) => event.stopPropagation()}
                >
               <button
                    onClick={() => {
                        setRenameChatId(chat.chat_id)
                        setRenameTitle(chat.title || "")
                        setActiveMenu(null)
                    }}
                    >
                    <img src="/icons/rename.png" alt="Rename" />
                    Rename
                    </button>

                <button
                    onClick={() => {
                        setDeleteChatId(chat.chat_id)
                        setDeleteChatTitle(chat.title || "New Chat")
                        setActiveMenu(null)
                    }}
                    >
                    <img src="/icons/delete.png" alt="Delete" />
                    Delete
                    </button>
                </div>
            )}
            </div>
        </div>
      ))}

      {chats.length === 0 && (
        <p className="no-chats">
          No chats yet.
        </p>
      )}
            {renameChatId && (
        <div className="rename-modal-overlay">
            <div className="rename-modal">
            <h3>Rename Chat</h3>

            <input
                type="text"
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                autoFocus
                onKeyDown={async (e) => {
                if (e.key === "Enter") {
                    const title = renameTitle.trim()

                    if (!title) return

                    try {
                    await renameChat(renameChatId, title)
                    setRenameChatId(null)
                    setRenameTitle("")
                    setChats((previousChats) =>
                            previousChats.map((chat) =>
                                chat.chat_id === renameChatId
                                ? { ...chat, title: title }
                                : chat
                            )
                            )
                } catch (error) {
                    console.error("Failed to rename chat:", error)
                    }
                }

                if (e.key === "Escape") {
                    setRenameChatId(null)
                    setRenameTitle("")
                }
                }}
            />

            <div className="rename-modal-actions">
                <button
                className="rename-cancel-button"
                onClick={() => {
                    setRenameChatId(null)
                    setRenameTitle("")
                }}
                >
                Cancel
                </button>

                <button
                className="rename-save-button"
                onClick={async () => {
                    const title = renameTitle.trim()

                    if (!title) return

                    try {
                    await renameChat(renameChatId, title)

                        setChats((previousChats) =>
                        previousChats.map((chat) =>
                            chat.chat_id === renameChatId
                            ? { ...chat, title: title }
                            : chat
                        )
                        )

                        setRenameChatId(null)
                        setRenameTitle("")
                    } catch (error) {
                    console.error("Failed to rename chat:", error)
                    }
                }}
                >
                Rename
                </button>
            </div>
            </div>
        </div>
        )}
                {deleteChatId && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">
                    <h3>Delete Chat?</h3>

                    <p>
                        This will delete <strong>{deleteChatTitle}</strong>
                    </p>

                    <div className="delete-modal-actions">
                        <button
                        className="delete-cancel-button"
                        onClick={() => {
                            setDeleteChatId(null)
                            setDeleteChatTitle("")
                        }}
                        >
                        Cancel
                        </button>

                        <button
                        className="delete-confirm-button"
                        onClick={async () => {
                            try {
                            await deleteChat(deleteChatId)

                            setChats((previousChats) =>
                                previousChats.filter(
                                (chat) => chat.chat_id !== deleteChatId
                                )
                            )

                            if (selectedChatId === deleteChatId) {
                                setSelectedChatId(null)
                                setMessages([])
                                setSelectedDocumentId(null)
                                setSelectedDocumentName("")
                                setSelectedDocument(null)
                            }

                            setDeleteChatId(null)
                            setDeleteChatTitle("")
                            } catch (error) {
                            console.error("Failed to delete chat:", error)
                            }
                        }}
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                </div>
                )}
    </div>
  )
}

export default ChatList