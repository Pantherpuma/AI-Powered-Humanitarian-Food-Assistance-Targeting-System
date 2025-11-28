"""API package exposing versioned routers."""

from .v1.router import api_router as v1_router

__all__ = ["v1_router"]

