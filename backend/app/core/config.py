from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List


class Settings(BaseSettings):
    # Required — no defaults so startup fails loudly if .env is missing
    DATABASE_URL: str
    SECRET_KEY: str
    FIRST_ADMIN_EMAIL: str
    FIRST_ADMIN_PASSWORD: str

    # Optional with safe defaults
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    @field_validator("SECRET_KEY")
    @classmethod
    def secret_key_must_be_strong(cls, v: str) -> str:
        weak = {"change-this-secret", "change-this-to-a-random-secret-key-at-least-32-chars", ""}
        if v in weak or len(v) < 32:
            raise ValueError("SECRET_KEY is insecure. Run `python setup.py` to generate one.")
        return v

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
