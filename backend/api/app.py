from fastapi import FastAPI
from api.routes.documents import router as documents_router
from api.routes.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from api.routes.chats import router as chats_router

app = FastAPI(
    title="RAG Assistant API",
    description="Backend API for the RAG Assistant",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://production-rag-frontend-4g46.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(chats_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}