from models.models import Document as PsychicDocument, LLM
from typing import List, Any, Optional
import uuid
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.llms import GPT4All, LlamaCpp
import os
import requests
import json
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.chains.question_answering import load_qa_chain  
from langchain.docstore.document import Document


embeddings = HuggingFaceEmbeddings(model_name=os.environ.get("embeddings_model") or "all-MiniLM-L6-v2")
embeddings_dimension = 384
base_url = os.environ.get("base_url") or "http://localhost"

class Gpt4AllLLM(LLM):

    llm: Optional[GPT4All] = None

    def __init__(self):
        super().__init__()
        self.llm = GPT4All(model="llm/local/ggml-gpt4all-j-v1.3-groovy.bin", backend='gptj', n_batch=8, verbose=False)

    async def ask(self, documents: List[PsychicDocument], question: str) -> str:


        callbacks = [StreamingStdOutCallbackHandler()]
        print(os.getcwd())
        # llm = GPT4All(model="llm/local/ggml-gpt4all-j-v1.3-groovy.bin", backend='gptj', n_batch=8, verbose=False)


        chain = load_qa_chain(self.llm, chain_type="stuff")  

        print('hello')
        print(documents)

        docs = [
            Document(
                page_content=doc.content, 
                metadata={"title": doc.title, "id": doc.id, "source": doc.uri}
            ) for doc in documents
        ]

        result = chain.run(input_documents=docs, question=question)  

        return result