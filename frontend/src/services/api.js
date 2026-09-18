const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`);

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}
export async function createChat(documentId) {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || "Failed to create chat")
  }

  return response.json()
}
export async function getChats() {
  const response = await fetch(`${API_BASE_URL}/chats`)

  if (!response.ok) {
    throw new Error("Failed to fetch chats")
  }

  return response.json()
}
export async function getChat(chatId) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || "Failed to fetch chat")
  }

  return response.json()
}

export async function renameChat(chatId, title) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || "Failed to rename chat")
  }

  return response.json()
}


export async function deleteChat(chatId) {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.detail || "Failed to delete chat")
  }

  return response.json()
}

export async function sendMessage(query, chatId) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      chat_id: chatId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Failed to send message");
  }

  return response.json();
}

export async function deleteDocument(documentId) {
  const response = await fetch(
    `${API_BASE_URL}/documents/${documentId}`,
    {
      method: "DELETE",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to delete document")
  }

  return response.json()
}
export async function uploadDocument(file) {
  const formData = new FormData()

  formData.append("file", file)

  const response = await fetch(
    `${API_BASE_URL}/documents/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.detail || "Failed to upload document"
    )
  }

  return response.json()
}
export async function getDocument(documentId) {
  const response = await fetch(
    `${API_BASE_URL}/documents`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch documents")
  }

  const data = await response.json()

  const document = data.documents.find(
    (item) => item.document_id === documentId
  )

  if (!document) {
    throw new Error("Uploaded document not found")
  }

  return document
}
export function getDocumentViewUrl(documentId, page = null) {
  const url = `${API_BASE_URL}/documents/${documentId}/view`

  return page
    ? `${url}#page=${page}`
    : url
}

export function getDocumentDownloadUrl(documentId) {
  return `${API_BASE_URL}/documents/${documentId}/download`
}

