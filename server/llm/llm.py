from models.models import Document as PsychicDocument, LLM
from typing import List, Any, Optional
import uuid
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
import os



embeddings = HuggingFaceEmbeddings(model_name=os.environ.get("embeddings_model") or "all-MiniLM-L6-v2")
embeddings_dimension = 384

class Gpt4AllLLM(LLM):

    def __init__(self):
        super().__init__()

    async def ask(self, documents: PsychicDocument, question: str) -> str:
        return "answer"