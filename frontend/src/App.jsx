import Sidebar from "./components/Sidebar"
import "./App.css"
import { useEffect, useState } from "react"
import ChatWindow from "./components/ChatWindow"
import ChatInput from "./components/ChatInput"
import DocumentInfo from "./components/DocumentInfo"
import Settings from "./components/Settings"

function App() {
  const [selectedDocumentId, setSelectedDocumentId] = useState(null)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [selectedDocumentName, setSelectedDocumentName] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [documentsRefresh, setDocumentsRefresh] = useState(0)
  const [activePage, setActivePage] = useState("chat")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [documentInfoOpen, setDocumentInfoOpen] = useState(false)
  const [chatsRefresh, setChatsRefresh] = useState(0)

  return (
    <div className={`app ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        selectedDocumentId={selectedDocumentId}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        setMessages={setMessages}
        setSelectedDocumentId={setSelectedDocumentId}
        setSelectedDocumentName={setSelectedDocumentName}
        setSelectedDocument={setSelectedDocument}
        documentsRefresh={documentsRefresh}
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        chatsRefresh={chatsRefresh}
        setChatsRefresh={setChatsRefresh}
      />

      <div className="main-area">

       <header className="chat-header">

          <div className="selected-document-header">
            {selectedDocument ? (
              <>
                <img
                  src="/icons/file.png"
                  alt="File"
                  className="header-file-icon"
                />

                <div className="header-document-info">
                  <h1>
                    {selectedDocument.document_name}
                  </h1>

                  <p>
                    {selectedDocument.pages} pages • Selected
                  </p>
                </div>
              </>
            ) : (
              <h1>RAG Assistant</h1>
            )}
          </div>

          <span className="ready-status">
            <span className="ready-dot"></span>
            Ready
          </span>
          {selectedDocument && (
            <button
              className="mobile-document-info-button"
              onClick={() => setDocumentInfoOpen(true)}
              title="Document Info"
            >
              <img
                src="/icons/info.png"
                alt="Document Info"
              />
            </button>
          )}

        </header>

        <div className="content-area">

          {activePage === "chat" ? (
              <main className="chat-area">

                <ChatWindow
                  selectedDocumentId={selectedDocumentId}
                  messages={messages}
                  loading={loading}
                />

                <ChatInput
                  query={query}
                  setQuery={setQuery}
                  selectedDocumentId={selectedDocumentId}
                  setMessages={setMessages}
                  loading={loading}
                  setLoading={setLoading}
                  setDocumentsRefresh={setDocumentsRefresh}
                  setSelectedDocumentId={setSelectedDocumentId}
                  setSelectedDocumentName={setSelectedDocumentName}
                  setSelectedDocument={setSelectedDocument}
                  selectedChatId={selectedChatId}
                  setSelectedChatId={setSelectedChatId}
                  setChatsRefresh={setChatsRefresh}
              />

              </main>
            ) : (
              <main className="chat-area">
                <Settings />
              </main>
            )}

          {activePage === "chat" && (
            <DocumentInfo
              selectedDocument={selectedDocument}
              setSelectedDocument={setSelectedDocument}
              setSelectedDocumentId={setSelectedDocumentId}
              setSelectedDocumentName={setSelectedDocumentName}
              setDocumentsRefresh={setDocumentsRefresh}
              setSelectedChatId={setSelectedChatId}
              setMessages={setMessages}
              setChatsRefresh={setChatsRefresh}
              documentInfoOpen={documentInfoOpen}
              setDocumentInfoOpen={setDocumentInfoOpen}
            />
          )}

        </div>

  </div>
</div>
  )
}

export default App