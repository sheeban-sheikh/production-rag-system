import DocumentList from "./DocumentList"
import ChatList from "./ChatList"
function Sidebar({
  selectedDocumentId,
  setSelectedDocumentId,
  setSelectedDocumentName,
  setSelectedDocument,
  documentsRefresh,
  activePage,
  setActivePage,
  sidebarCollapsed,
  setSidebarCollapsed,
  selectedChatId,
  setSelectedChatId,
  setMessages,
  chatsRefresh,
  setChatsRefresh,
}) {
  return (
    <>
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>

        <div className="logo">
          <img
            src="/icons/book.png"
            alt="RAG Assistant"
            className="logo-icon"
          />

          <div className="logo-text">
            <h1>RAG Assistant</h1>
            <p>Your Documents, Smarter Answers</p>
          </div>
        </div>

        <div className="documents">

          <div className="sidebar-navigation">

            <button
              className={`nav-item ${
                activePage === "chat" ? "active" : ""
              }`}
              onClick={() => setActivePage("chat")}
            >
              <img
                src="/icons/chat.png"
                alt="Chat"
              />

              <span>Chat</span>
            </button>

            <button
              className={`nav-item ${
                activePage === "settings" ? "active" : ""
              }`}
              onClick={() => setActivePage("settings")}
            >
              <img
                src="/icons/setting.png"
                alt="Settings"
              />

              <span>Settings</span>
            </button>

          </div>
          <ChatList
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            setSelectedDocumentId={setSelectedDocumentId}
            setSelectedDocumentName={setSelectedDocumentName}
            setSelectedDocument={setSelectedDocument}
            setMessages={setMessages}
            chatsRefresh={chatsRefresh}
            setChatsRefresh={setChatsRefresh}
          />
          <DocumentList
            selectedDocumentId={selectedDocumentId}
            setSelectedDocumentId={setSelectedDocumentId}
            setSelectedDocumentName={setSelectedDocumentName}
            setSelectedDocument={setSelectedDocument}
            documentsRefresh={documentsRefresh}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            setMessages={setMessages}
          />

        </div>

      </aside>
      {!sidebarCollapsed && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <button
        className={`sidebar-toggle ${
          sidebarCollapsed ? "sidebar-toggle-closed" : ""
        }`}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        title={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
      >
        {sidebarCollapsed ? "❯" : "❮"}
      </button>
    </>
  )
}

export default Sidebar