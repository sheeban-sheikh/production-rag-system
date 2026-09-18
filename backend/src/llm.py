from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from src.config import LLM_MODEL
load_dotenv()
llm= ChatGoogleGenerativeAI(
    model=LLM_MODEL,

)
