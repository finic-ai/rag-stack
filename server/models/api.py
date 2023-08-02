from typing import List
from models.models import FilePreview
from pydantic import BaseModel


class AskQuestionRequest(BaseModel):
    question: str


class GetFileRequest(BaseModel):
    file_name: str


class UpsertFilesResponse(BaseModel):
    success: bool


class AskQuestionResponse(BaseModel):
    answer: str
    sources: List[str]


class GetFileResponse(BaseModel):
    signed_url: str


class GetPreviewsResponse(BaseModel):
    previews: List[FilePreview]
