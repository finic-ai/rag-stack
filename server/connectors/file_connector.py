from typing import List
from fastapi import FastAPI, File, HTTPException, Depends, Body, UploadFile
from models.models import Document


class FileConnector:

    def __init__(self, files: List[UploadFile]):
        self.files = files

    def load(self) -> List[Document]:
        documents = []
        for file in self.files:
            documents.append(Document(id=file.filename, title=file.filename, content=file.file.read().decode('utf-8')))
        return documents