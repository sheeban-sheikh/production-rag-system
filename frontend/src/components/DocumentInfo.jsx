import {
  deleteDocument,
  getDocumentViewUrl,
  getDocumentDownloadUrl,
} from "../services/api"
import { useEffect, useState } from "react"
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
function DocumentInfo({ 
    selectedDocument,
    setSelectedDocument,
    setSelectedDocumentId,
    setSelectedDocumentName,
    setDocumentsRefresh,
    documentInfoOpen,
  setDocumentInfoOpen,
}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [, setCurrentTime] = useState(Date.now())

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(Date.now())
  }, 60 * 1000)

  return () => clearInterval(interval)
}, [])
if (!selectedDocument) {
  return (
    <>
      <aside
  className={`document-info ${documentInfoOpen ? "open" : ""}`}
>
  <div className="document-info-header">
    <h2>Document Info</h2>

    <button
      className="document-info-close"
      onClick={() => setDocumentInfoOpen(false)}
      aria-label="Close document info"
    >
      ×
    </button>
  </div>

        <p>Select a document to view its details.</p>
      </aside>

      {showSuccessMessage && (
        <div className="success-toast">
          <div className="success-toast-icon">
            ✓
          </div>

          <div>
            <strong>Document deleted</strong>
            <span>Document deleted successfully.</span>
          </div>
        </div>
      )}
    </>
  )
}

  const sizeInKB = (selectedDocument.size / 1024).toFixed(1)

  return (
   <aside
  className={`document-info ${documentInfoOpen ? "open" : ""}`}
>
  <div className="document-info-header">
    <h2>Document Info</h2>

    <button
      className="document-info-close"
      onClick={() => setDocumentInfoOpen(false)}
      aria-label="Close document info"
    >
      ×
    </button>
  </div>

      <div className="document-preview-card">
        <div className="document-preview-icon">
          <img
            src="/icons/file.png"
            alt="File"
        />
        </div>

        <div className="document-preview-content">
          <h3>{selectedDocument.document_name}</h3>

          <p>
            {selectedDocument.pages} pages • {sizeInKB} KB
          </p>

        </div>
      </div>

    <p className="document-description">
        PDF document indexed and ready for question answering.
    </p>

      <div className="document-details">

        <div className="detail-row document-id-row">
            <span>Document ID</span>

            <div className="document-id-value">
            <strong>{selectedDocument.document_id}</strong>

            <button
                className="copy-button"
                onClick={() =>
                navigator.clipboard.writeText(
                    selectedDocument.document_id
                )
                }
                title="Copy document ID"
            >
                <img
                src="/icons/copy.png"
                alt="Copy"
                />
            </button>
            </div>
        </div>

        <div className="detail-row">
            <span>Status</span>

            <strong className="status-badge">
            <span className="status-dot"></span>
            {selectedDocument.status}
            </strong>
        </div>

        <div className="detail-row">
            <span>Pages</span>
            <strong>{selectedDocument.pages}</strong>
        </div>

        <div className="detail-row">
            <span>Size</span>
            <strong>{sizeInKB} KB</strong>
        </div>

        <div className="detail-row">
            <span>Added</span>
            {formatRelativeTime(selectedDocument.created_at)}
        </div>

        </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>

        <button
            className="action-button"
            onClick={() =>
            window.open(
            getDocumentViewUrl(selectedDocument.document_id),
            "_blank"
        )
            }
        >
            <img
            src="/icons/view.png"
            alt="View"
            />

            <span>View Document</span>
        </button>

        <button
            className="action-button"
            onClick={() =>
            window.open(
            getDocumentDownloadUrl(selectedDocument.document_id),
            "_blank"
            )
            }
        >
            <img
            src="/icons/download.png"
            alt="Download"
            />

            <span>Download PDF</span>
        </button>

        <button
            className="action-button delete-button"
            onClick={() => setShowDeleteModal(true)}
        >
            <img
            src="/icons/delete.png"
            alt="Delete"
            />

            <span>Delete Document</span>
        </button>
        </div>
        {showDeleteModal && (
            <div className="delete-modal-overlay">
                <div className="delete-modal">

                <div className="delete-modal-icon">
                    <img
                    src="/icons/delete.png"
                    alt="Delete"
                    />
                </div>

                <h2>Delete Document?</h2>

                <p>
                    Are you sure you want to delete{" "}
                    <strong>{selectedDocument.document_name}</strong>?
                </p>

                <p className="delete-warning">
                    This action cannot be undone.
                </p>

                <div className="delete-modal-actions">

                    <button
                    className="modal-cancel-button"
                    onClick={() => setShowDeleteModal(false)}
                    >
                    Cancel
                    </button>

                   <button
                        className="modal-delete-button"
                        onClick={async () => {
                            try {
                            await deleteDocument(
                                selectedDocument.document_id
                            )

                            setShowDeleteModal(false)

                            setSelectedDocument(null)
                            setSelectedDocumentId(null)
                            setSelectedDocumentName("")

                            setDocumentsRefresh(
                                (previous) => previous + 1
                            )
                            setShowSuccessMessage(true)

                            setTimeout(() => {
                            setShowSuccessMessage(false)
                            }, 3000)
                        } catch (error) {
                            console.error("Delete failed:", error)
                            }
                    }}
                        >
                        Delete Document
                    </button>

                </div>

            </div>
        </div>
            )}
        {showSuccessMessage && (
            <div className="success-toast">
                <div className="success-toast-icon">
                ✓
                </div>

                <div>
                <strong>Document deleted</strong>
                <span>Document deleted successfully.</span>
                </div>
            </div>
        )}
    </aside>
  )
}

export default DocumentInfo