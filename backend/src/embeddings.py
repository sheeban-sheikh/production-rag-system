from src.config import EMBEDDING_MODEL

from langchain_google_genai import GoogleGenerativeAIEmbeddings

embeddings = GoogleGenerativeAIEmbeddings(
    model=EMBEDDING_MODEL
)