from fastapi import UploadFile
from typing import List, Optional
from models.models import AppConfig
from supabase import create_client, Client
import os


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

    async def upsert(self, appConfig: AppConfig, files: List[UploadFile]) -> bool:
        self.create_bucket_if_not_exists(appConfig=appConfig)

        for file in files:
            file_content = await file.read()
            file_name = file.filename
            resp = await self.supabase.storage.upload(
                file_name, file_content, appConfig.app_id
            )
            if resp["data"]:
                return True
            else:
                return False

    async def getFileNames(self, appConfig: AppConfig) -> List[str]:
        pass

    # return file as base64 string
    async def getFile(self, appConfig: AppConfig, fileName: str) -> str:
        pass

    # Creates a bucket per app_id if one doesn't exist already
    async def create_bucket_if_not_exists(self, appConfig: AppConfig):
        existing_bucket = self.supabase.storage.get_bucket(appConfig.app_id)
        if not existing_bucket["data"]:
            self.supabase.storage.create_bucket(appConfig.app_id)
        return True
