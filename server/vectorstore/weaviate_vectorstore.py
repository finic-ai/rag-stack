import os
import uuid
from collections import defaultdict
from typing import List, Optional

import weaviate
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer

from models.models import AppConfig
from models.models import Document as PsychicDocument
from models.models import VectorStore

embeddings_model = SentenceTransformer(
    os.environ.get("embeddings_model") or "all-MiniLM-L6-v2"
)
embeddings_dimension = 384


class WeaviateVectorStore(VectorStore):
    client: Optional[weaviate.Client] = None
    collection_name: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True

    def __init__(self):
        super().__init__()
        if not os.getenv("WEAVIATE_URL"):
            raise Exception("WEAVIATE_URL must be set as an environment variable.")

        api_key = os.getenv("WEAVIATE_API_KEY")
        self.client = weaviate.Client(
            url=os.getenv("WEAVIATE_URL"),
            auth_client_secret=weaviate.AuthApiKey(api_key),
        )

        self.collection_name = "MyDocuments"
        if not self.client.schema.exists(self.collection_name):
            self.client.schema.create_class(
                {
                    "class": self.collection_name,
                    "multiTenancyConfig": {
                        "enabled": True,
                    },
                    "properties": [
                        {
                            "name": "title",
                            "dataType": ["text"],
                        },
                        {
                            "name": "content",
                            "dataType": ["text"],
                        },
                        {
                            "name": "source",
                            "dataType": ["text"],
                            "tokenization": "field",
                        },
                        {
                            "name": "doc_id",
                            "dataType": ["text"],
                            "tokenization": "field",
                        },
                        {
                            "name": "chunk_id",
                            "dataType": ["text"],
                            "tokenization": "field",
                        },
                    ],
                }
            )

    async def upsert(
        self, documents: List[PsychicDocument], app_config: AppConfig
    ) -> bool:
        tenant = weaviate.Tenant(name=app_config.app_id)
        if tenant not in self.client.schema.get_class_tenants(self.collection_name):
            self.client.schema.add_class_tenants(
                self.collection_name, [weaviate.Tenant(name=app_config.app_id)]
            )

        langchain_docs = [
            Document(
                page_content=doc.content,
                metadata={"title": doc.title, "id": doc.id, "source": doc.uri},
            )
            for doc in documents
        ]
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=100
        )
        split_docs = text_splitter.split_documents(langchain_docs)

        seen_docs = defaultdict(int)

        with self.client.batch as batch:
            for doc in split_docs:
                doc_id = doc.metadata["id"]
                seen_docs[doc_id] += 1
                chunk_id = uuid.uuid5(
                    uuid.NAMESPACE_DNS, f"{doc_id}_{seen_docs[doc_id]}"
                )
                chunk_id = str(chunk_id)

                vector = embeddings_model.encode([doc.page_content])[0]
                data_object = {
                    "title": doc.metadata["title"],
                    "content": doc.page_content,
                    "source": doc.metadata["source"],
                    "doc_id": doc_id,
                    "chunk_id": chunk_id,
                }
                batch.add_data_object(
                    data_object=data_object,
                    class_name=self.collection_name,
                    uuid=chunk_id,
                    vector=vector,
                    tenant=app_config.app_id,
                )

        return True

    async def query(self, query: str, app_config: AppConfig) -> List[PsychicDocument]:
        query_vector = embeddings_model.encode([query])[0]
        tenant = app_config.app_id
        near_vector = {
            "vector": query_vector,
        }
        properties = ["title", "content", "source", "doc_id"]

        results = (
            self.client.query.get(
                self.collection_name,
                properties=properties,
            )
            .with_tenant(tenant)
            .with_near_vector(near_vector)
            .with_limit(5)
            .do()
        )

        results = results["data"]["Get"][self.collection_name]

        results = [
            PsychicDocument(
                id=result["doc_id"],
                title=result["title"],
                content=result["content"],
                uri=result["source"],
            )
            for result in results
        ]

        return results
