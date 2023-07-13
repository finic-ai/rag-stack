from models.models import Document as PsychicDocument, VectorStore
from typing import List, Any
import uuid
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient
from langchain.docstore.document import Document
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from qdrant_client.models import PointStruct


embeddings = HuggingFaceEmbeddings(model_name=os.environ.get("embeddings_model") or "all-MiniLM-L6-v2")
embeddings_dimension = 384

class QdrantVectorStore(VectorStore):
    def __init__(self):
        
        # self.client = Qdrant.from_documents(
        #     [],
        #     embeddings,
        #     path="/tmp/local_qdrant",
        #     collection_name="my_documents",
        # )

        self.client = QdrantClient(path="/tmp/local_qdrant")
        self.client.create_collection(collection_name="my_documents", dimension=embeddings_dimension)
        self.collection_name = "my_documents"

    async def upsert(self, documents: List[PsychicDocument]) -> bool:
        langchain_docs = [
            Document(
                page_content=doc.content, 
                metadata={"title": doc.title, "id": doc.id, "source": doc.uri}
            ) for doc in documents
        ]
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        split_docs = text_splitter.split_documents(langchain_docs)

        points = []
        seen_docs = {}

        for doc in split_docs:
            doc_id = None
            if doc.metadata["id"] not in seen_docs:
                doc_id = doc.metadata["id"]
                seen_docs[doc.metadata["id"]] = 1
                chunk_id = f"{doc_id}_1" 
            else:
                doc_id = doc.metadata["id"]
                seen_docs[doc.metadata["id"]] += 1
                chunk_id = f"{doc_id}_{seen_docs[doc.metadata['id']]}"

            vector = embeddings.embed_documents([doc.page_content])[0]



            points.append(PointStruct(
                id=chunk_id,
                payload={
                    "metadata": {
                        "title": doc.metadata["title"],
                        "source": doc.metadata["source"],
                        "chunk_id": chunk_id,
                        "doc_id": doc_id,
                    },
                    
                    "content": doc.page_content
                },
                vector=vector
            ))


        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        return 

    async def answer_question(self, question: str) -> str:
        return "42"