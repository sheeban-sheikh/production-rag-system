import { useEffect, useState } from "react"
import { getDocuments } from "../services/api"
function formatRelativeTime(timestamp) {
  if (!timestamp) return "Recently"

  const createdAt = new Date(timestamp)
  const now = new Date()

  const diffMs = now - createdAt
  const diffSeconds = Math.floor(diffMs / 1000)

  if (diffSeconds < 0 || diffSeconds < 60) {
    return "Just now"
  }

  const diffMinutes = Math.floor(diffSeconds / 60)

  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  }

  const diffDays = Math.floor(diffHours / 24)

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
  }

  const diffWeeks = Math.floor(diffDays / 7)

  if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`
  }

  return createdAt.toLocaleDateString()
}
function DocumentList({
  selectedDocumentId,
  setSelectedDocumentId,
  setSelectedDocumentName,
  setSelectedDocument,
  setSelectedChatId,
  setMessages,
  documentsRefresh,
}) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function loadDocuments() {
      try {
        const data = await getDocuments()
        setDocuments(data.documents)
      } catch (error) {
        console.error("Failed to load documents:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [documentsRefresh])

  const filteredDocuments = documents.filter((document) =>
    document.document_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <div className="documents-header">
          <h2>Your Documents</h2>

        </div>

        <div className="document-search">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <p>Loading documents...</p>
      </>
    )
  }

  return (
    <>
      <div className="documents-header">
        <h2>Your Documents</h2>

      </div>

      <div className="document-search">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredDocuments.map((document) => (
        <div
          className={`document-item ${
            selectedDocumentId === document.document_id
              ? "selected"
              : ""
          }`}
          key={document.document_id}
          onClick={() => {
  setSelectedDocumentId(document.document_id)
  setSelectedDocumentName(document.document_name)
  setSelectedDocument(document)

  setSelectedChatId(null)
  setMessages([])
}}
        >
          <div className="document-icon-wrapper">
            <img
              src="/icons/icons8-file-50.png"
              alt="File"
              className="file-icon"
            />
          </div>

          <div className="document-text">
            <span className="document-name">
              {document.document_name}
            </span>

           <span className="document-meta">
            {document.pages} pages • {formatRelativeTime(document.created_at)}
          </span>
          </div>
        </div>
      ))}

      {filteredDocuments.length === 0 && (
        <p className="no-documents">
          No documents found.
        </p>
      )}
    </>
  )
}

export default DocumentList