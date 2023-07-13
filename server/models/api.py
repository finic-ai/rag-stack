from models.models import (
    Document,
)
from pydantic import BaseModel
from typing import List, Optional, Dict, TypeVar, Union


class UpsertFilesResponse(BaseModel):
    success: bool

class AskQuestionRequest(BaseModel):
    question: str

class AskQuestionResponse(BaseModel):
    answer: str
