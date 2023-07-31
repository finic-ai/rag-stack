from typing import List
from models.models import FilePreview
from pydantic import BaseModel


class UpsertFilesResponse(BaseModel):
    success: bool


class AskQuestionRequest(BaseModel):
    question: str


class AskQuestionResponse(BaseModel):
    answer: str


class GetPreviewsResponse(BaseModel):
    previews: List[FilePreview]
