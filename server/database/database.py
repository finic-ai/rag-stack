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
            self.supabase.table("users")
            .select("*")
            .filter("secret_key", "eq", bearer_token)
            .execute()
        )
        if len(response.data) > 0:
            row = response.data[0]
            return AppConfig(app_id=row["app_id"], user_id=row["id"])
        return None

    async def upsert(self, files: List[UploadFile]) -> bool:
        pass

    async def getFileNames(self, appConfig: AppConfig) -> List[str]:
        pass

    # return file as base64 string
    async def getFile(self, appConfig: AppConfig, fileName: str) -> str:
        pass


