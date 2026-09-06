"""
Centralised settings loaded from environment variables via pydantic-settings.
Never hardcode secrets — always read from .env.

allowed_origins is stored as a plain string in .env and split here —
this avoids pydantic-settings version differences in list parsing.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./fairloan_dev.db"
    # Plain string in .env — parsed to list via property below.
    # Avoids pydantic-settings 2.x breaking changes on list fields.
    allowed_origins_raw: str = "http://localhost:3000"
    app_env: str = "development"
    debug: bool = True

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }

    @property
    def allowed_origins(self) -> list[str]:
        """Accept comma-separated string or JSON array from .env."""
        raw = self.allowed_origins_raw.strip()
        if raw.startswith("["):
            import json
            return json.loads(raw)
        return [o.strip() for o in raw.split(",") if o.strip()]


settings = Settings()