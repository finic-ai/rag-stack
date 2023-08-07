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
import openai

embeddings = HuggingFaceEmbeddings(
    model_name=os.environ.get("embeddings_model") or "all-MiniLM-L6-v2"
)
embeddings_dimension = 384
base_url = os.environ.get("LLM_URL") or "http://localhost"


def get_selected_llm() -> LLM:
    llm_type = os.environ.get("LLM_TYPE") or "falcon7b"
    if llm_type == "gpt4all":
        return Gpt4AllLLM()
    elif llm_type == "falcon7b":
        return Falcon7BLLM()
    elif llm_type == "gpt3.5":
        return GPT("gpt-3.5-turbo")
    elif llm_type == "gpt4":
        return GPT("gpt-4")
    else:
        raise Exception("Unknown LLM type: " + llm_type)


class Gpt4AllLLM(LLM):
    llm: Optional[GPT4All] = None

    def __init__(self):
        super().__init__()
        self.llm = GPT4All(
            model="llm/local/ggml-gpt4all-j-v1.3-groovy.bin",
            backend="gptj",
            n_batch=8,
            verbose=False,
        )

    async def ask(self, documents: List[PsychicDocument], question: str) -> str:
        # TODO: support streaming https://gist.github.com/jvelezmagic/03ddf4c452d011aae36b2a0f73d72f68
        callbacks = [StreamingStdOutCallbackHandler()]

        chain = load_qa_chain(self.llm, chain_type="stuff")

        docs = [
            Document(
                page_content=doc.content,
                metadata={"source": doc.title},
            )
            for doc in documents
        ]
        print(docs)
        result = chain.run(input_documents=docs, question=question, callbacks=callbacks)

        return result


class Falcon7BLLM(LLM):
    def __init__(self):
        super().__init__()

    async def ask(self, documents: List[PsychicDocument], question: str) -> str:
        context_str = ""

        doc = documents[0]
        context_str += f"{doc.title}: {doc.content}\n\n"

        prompt = (
            "Context: \n"
            "---------------------\n"
            f"{context_str}"
            "\n---------------------\n"
            f"Given the above context and no other information, answer the question: {question}\n"
        )

        data = {"prompt": prompt}

        res = requests.post(f"{base_url}:8080/v1/models/model:predict", json=data)

        res_json = res.json()
        print(res_json)

        return res_json["data"]["generated_text"][len(prompt) :]


class GPT(LLM):
    model_name: str = "gpt-3.5-turbo"

    def __init__(self, model_name="gpt-3.5-turbo"):
        super().__init__()
        self.model_name = model_name

    async def ask(self, documents: List[PsychicDocument], question: str) -> str:
        context_str = ""

        for doc in documents:
            context_str += f"{doc.title}: {doc.content}\n\n"

        prompt = (
            "Context: \n"
            "---------------------\n"
            f"{context_str}"
            "\n---------------------\n"
            f"Given the above context and no other information, answer the question: {question}\n"
        )

        res = openai.ChatCompletion.create(
            model=self.model_name,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions about the documents provided. If you get messages that aren't related to the documents, ask about how you can help the user with the documents.",
                },
                {"role": "user", "content": prompt},
            ],
        )

        return res["choices"][0]["message"]["content"]
