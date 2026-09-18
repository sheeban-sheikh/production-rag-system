import { getDocumentViewUrl } from "../services/api"
function Sources({ sources }) {
  if (!sources || sources.length === 0) {
    return null
  }

  return (
    <div className="sources">
      <div className="sources-title">
        Sources ({sources.length})
      </div>

      <div className="sources-list">
        {sources.map((source, index) => (
          <div className="source-card" key={index}>

            <div className="source-icon">
              <img
                src="/icons/file.png"
                alt="File"
              />
            </div>

            <div className="source-info">
              <strong>Page {source.page}</strong>

              <span>
                {source.document.split("\\").pop()}
              </span>
            </div>

           <button
                className="source-view-button"
                title={`View Page ${source.page}`}
                onClick={() =>
                   window.open(
                    getDocumentViewUrl(
                    source.document_id,
                    source.page
                ),
                "_blank"
                )
                }
            >
              <img
                src="/icons/external link.png"
                alt="View"
              />
            </button>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Sources