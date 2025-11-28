"""FastAPI entrypoint for the humanitarian food assistance platform."""

from datetime import datetime
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import v1_router
from .core.config import get_settings


def create_app() -> FastAPI:
    """Application factory to keep settings testable."""

    settings = get_settings()
    app = FastAPI(
        title=settings.api_name,
        version=settings.api_version,
        contact={"name": settings.contact_name, "email": settings.contact_email},
        description=(
            "API services powering the AI-driven food assistance targeting and early warning system "
            "for South Sudan. Includes vulnerability scoring, community reporting, and analytics endpoints."
        ),
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(v1_router, prefix="/v1")

    @app.get("/healthz", tags=["ops"])
    def health_check() -> Dict[str, str]:
        """Lightweight health endpoint for probes."""

        return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

    return app


app = create_app()

