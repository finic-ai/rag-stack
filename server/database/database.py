import io
from fastapi import UploadFile
from typing import List, Optional
from models.models import AppConfig
from supabase import create_client, Client
import os
from storage3.utils import StorageException


class Database:
    def __init__(self):
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        self.supabase = create_client(supabase_url, supabase_key)

    async def get_config(self, bearer_token: str) -> Optional[AppConfig]:
        response = (
            self.supabase.table("ragstack_users")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(app_id=row["app_id"], user_id=row["id"])
        return None

    async def upsert(self, app_config: AppConfig, files: List[UploadFile]) -> bool:
        self.create_bucket_if_not_exists(app_config=app_config)

        for file in files:
            try:
                contents = await file.read()
                res = self.supabase.storage.from_(app_config.app_id).upload(
                    path="/uploads/{}".format(file.filename),
                    file=contents,
                )
                # Reset file cursor for any other file readers
                await file.seek(0)
                if res.status_code != 200:
                    print("Upload failed")
            except Exception as e:
                print(e)
                continue

    async def get_all_files_for_tenant(self, app_config: AppConfig) -> List[UploadFile]:
        files = self.supabase.storage.from_(app_config.app_id).list(path="uploads/")

        upload_files = []
        for file in files:
            try:
                file_name = file["name"]

                with open(file_name, "wb+") as f:
                    res = self.supabase.storage.from_(app_config.app_id).download(
                        path="uploads/{}".format(file_name)
                    )
                    file = UploadFile(file=io.BytesIO(res), filename=file_name)

                    upload_files.append(file)
            except Exception as e:
                print(e)
                continue

        return upload_files

    async def get_file_signed_url(self, app_config: AppConfig, file_name: str) -> str:
        res = self.supabase.storage.from_(app_config.app_id).create_signed_url(
            path="uploads/{}".format(file_name), expires_in=3600
        )
        return res["signedURL"]

    async def getFileNames(self, app_config: AppConfig) -> List[str]:
        pass

    # return file as base64 string
    async def getFile(self, app_config: AppConfig, fileName: str) -> str:
        pass

    # Creates a bucket per app_id if one doesn't exist already
    def create_bucket_if_not_exists(self, app_config: AppConfig):
        try:
            self.supabase.storage.get_bucket(app_config.app_id)
        except StorageException as e:
            self.supabase.storage.create_bucket(app_config.app_id)
