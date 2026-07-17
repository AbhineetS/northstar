from pydantic import Field
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Pulse API"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    SUPABASE_URL: str = Field(default="http://localhost:54321")
    SUPABASE_KEY: str = Field(default="mock_key")
    GEMINI_API_KEY: str = Field(default="mock_key")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
