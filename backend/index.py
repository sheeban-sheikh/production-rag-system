from pathlib import Path

from src.ingestion import add_document


data_dir = Path("data")

for pdf_file in data_dir.glob("*.pdf"):
    add_document(pdf_file)