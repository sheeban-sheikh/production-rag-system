function Settings() {
  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h2>Settings</h2>
          <p>
            Manage your RAG Assistant configuration.
          </p>
        </div>
      </div>

      {/* AI Configuration */}
      <section className="settings-section">
        <h3>AI Configuration</h3>

        <div className="settings-card">

          <div className="setting-row">
            <div>
              <strong>LLM Model</strong>
              <span>Language model used for answer generation</span>
            </div>

            <div className="setting-value">
              gemini-3.5-flash-lite
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Embedding Model</strong>
              <span>Model used to create document embeddings</span>
            </div>

            <div className="setting-value">
              all-MiniLM-L6-v2
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Retrieval K</strong>
              <span>Number of chunks retrieved before reranking</span>
            </div>

            <div className="setting-value">
              5
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Reranker Top N</strong>
              <span>Number of relevant chunks passed to the LLM</span>
            </div>

            <div className="setting-value">
              3
            </div>
          </div>

        </div>
      </section>

      {/* Chat Preferences */}
      <section className="settings-section">
        <h3>Chat Preferences</h3>

        <div className="settings-card">

          <div className="setting-row">
            <div>
              <strong>Show Sources</strong>
              <span>Display document sources below AI answers</span>
            </div>

            <div className="setting-toggle active">
              ON
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Show Timestamps</strong>
              <span>Display message timestamps in conversations</span>
            </div>

            <div className="setting-toggle active">
              ON
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Conversation History</strong>
              <span>Maintain context across multiple questions</span>
            </div>

            <div className="setting-toggle active">
              ON
            </div>
          </div>

        </div>
      </section>

      {/* Document Settings */}
      <section className="settings-section">
        <h3>Document Settings</h3>

        <div className="settings-card">

          <div className="setting-row">
            <div>
              <strong>Supported Format</strong>
              <span>File format accepted by the assistant</span>
            </div>

            <div className="setting-value">
              PDF
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Chunk Size</strong>
              <span>Maximum characters per document chunk</span>
            </div>

            <div className="setting-value">
              1000
            </div>
          </div>

          <div className="setting-row">
            <div>
              <strong>Chunk Overlap</strong>
              <span>Overlap between consecutive chunks</span>
            </div>

            <div className="setting-value">
              200
            </div>
          </div>

        </div>
      </section>

      {/* About */}
      <section className="settings-section">
        <h3>About</h3>

        <div className="about-card">

          <div className="about-icon">
            <img
              src="/icons/book.png"
              alt="RAG Assistant"
            />
          </div>

          <div>
            <strong>RAG Assistant</strong>
            <p>Version 1.0.0</p>

            <span>
              Built with Python • FastAPI • React • LangChain • Gemini • ChromaDB
            </span>
          </div>

        </div>
      </section>

    </div>
  )
}

export default Settings