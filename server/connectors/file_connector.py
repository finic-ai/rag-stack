import uuid
from typing import List
from fastapi import FastAPI, File, HTTPException, Depends, Body, UploadFile
from models.models import Document as PsychicDocument
import os
from langchain.document_loaders import (
    CSVLoader,
    EverNoteLoader,
    PyMuPDFLoader,
    TextLoader,
    UnstructuredEmailLoader,
    UnstructuredEPubLoader,
    UnstructuredHTMLLoader,
    UnstructuredMarkdownLoader,
    UnstructuredODTLoader,
    UnstructuredPowerPointLoader,
    UnstructuredWordDocumentLoader,
)


class FileConnector:
    def __init__(self, files: List[UploadFile]):
        self.files = files

    async def load(self) -> List[PsychicDocument]:
        documents = []
        for file in self.files:
            extension = os.path.splitext(file.filename)[1].lower()
            if extension == ".pdf":
                local_file_path = f"local_dir/{file.filename}"
                if not os.path.exists("local_dir"):
                    os.makedirs("local_dir")
                with open(local_file_path, "wb") as f:
                    # Await on the content being read to ensure it's fully read
                    content = await file.read()
                    f.write(content)
                loader = PyMuPDFLoader(local_file_path)
                content = ""
                for page in loader.load():
                    content += page.page_content
            else:
                content = file.file.read().decode("utf-8")
            documents.append(
                PsychicDocument(
                    id=str(uuid.uuid4()), title=file.filename, content=content
                )
            )
        return documents
