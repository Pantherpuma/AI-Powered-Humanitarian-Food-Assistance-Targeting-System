"""Application settings and configuration helpers."""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Centralised environment configuration."""

    api_name: str = "FoodReach API"
    api_version: str = "0.1.0"
    cors_origins: List[str] = Field(default_factory=lambda: ["*"])
    contact_name: str = "Humanitarian Data Lab"
    contact_email: str = "support@example.org"

    # ✅ Correct Pydantic v2 configuration (removes orange warning)
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
