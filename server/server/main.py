import os
from embedding_generation.local import SentenceTransformerEmbedding
from embedding_generation.models import ALL_MINILM_L6_V2, EmbeddingModel
from embedding_generation.services import HuggingfaceInferenceEndpoingEmbedding
import uvicorn
from fastapi import FastAPI, File, HTTPException, Depends, Body, UploadFile
from typing import List
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlparse
import fitz

from models.api import (
    GetFileRequest,
    GetFileResponse,
    GetPreviewsResponse,
    UpsertFilesResponse,
    AskQuestionRequest,
    AskQuestionResponse,
)

from models.models import AppConfig, FilePreview
import base64
from connectors import FileConnector
from vectorstore import QdrantVectorStore
from vectorstore import WeaviateVectorStore
from llm import get_selected_llm
from database import Database


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer()
embedding_model_override = EmbeddingModel(os.environ.get("embeddings_model"), os.environ.get("embeddings_size"))

embedding_model = embedding_model_override if embedding_model_override.name else ALL_MINILM_L6_V2

if os.environ.get("embeddings_local"):
    embedding_generator = SentenceTransformerEmbedding(embedding_model)
else:
    embedding_generator = HuggingfaceInferenceEndpoingEmbedding(embedding_model, os.environ.get("hf_token"))

# TODO: Waviate module needs to be refactored to use embedding abstraction as well
vector_store = WeaviateVectorStore() if os.environ.get('USE_WEAVIATE_VECTORSTORE') == 'true' else QdrantVectorStore(embedding_generator)
llm = get_selected_llm()
db = Database()


async def validate_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    use_api_key = os.environ.get("USE_API_KEY") or False
    print(use_api_key)
    if not use_api_key:
        print("not using api key")
        return AppConfig(app_id="test", user_id="test")

    try:
        app_config = await db.get_config(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or missing public key")
    if credentials.scheme != "Bearer" or app_config is None:
        raise HTTPException(status_code=401, detail="Invalid or missing public key")
    return app_config


@app.post(
    "/upsert-files",
    response_model=UpsertFilesResponse,
)
async def upsert_files(
    files: List[UploadFile] = File(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        await db.upsert(config, files)
        docs = await FileConnector(files).load()
        success = await vector_store.upsert(docs, config)
        response = UpsertFilesResponse(success=success)
        return response
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get(
    "/get-previews",
    response_model=GetPreviewsResponse,
)
async def get_previews(
    config: AppConfig = Depends(validate_token),
):
    try:
        upload_files = await db.get_all_files_for_tenant(app_config=config)

        previews: List[FilePreview] = []
        for upload_file in upload_files:
            try:
                pdf_document = fitz.open(upload_file.filename, upload_file.file)
                page = pdf_document.load_page(0)
                image = page.get_pixmap()
                image_bytes = image.tobytes()
                image_base64 = base64.b64encode(image_bytes).decode("utf-8")
                previews.append(
                    FilePreview(
                        file_name=upload_file.filename, file_preview_img=image_base64
                    )
                )
            except Exception as e:
                print(f'Issue creating preview for file {upload_file.filename}\nError: {e}')
        return GetPreviewsResponse(previews=previews)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/get-file",
    response_model=GetFileResponse,
)
async def get_file(
    request: GetFileRequest = Body(...), config: AppConfig = Depends(validate_token)
):
    try:
        signed_url = await db.get_file_signed_url(
            app_config=config, file_name=request.file_name
        )
        return GetFileResponse(signed_url=signed_url)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/ask-question",
    response_model=AskQuestionResponse,
)
async def ask_question(
    request: AskQuestionRequest = Body(...),
    config: AppConfig = Depends(validate_token),
):
    try:
        question = request.question
        documents = await vector_store.query(question, app_config=config)
        answer = await llm.ask(documents, question)
        print(answer)
        return AskQuestionResponse(
            answer=answer, sources=[doc.title for doc in documents]
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


def start():
    uvicorn.run("server.main:app", host="0.0.0.0", port=8080, reload=True)
