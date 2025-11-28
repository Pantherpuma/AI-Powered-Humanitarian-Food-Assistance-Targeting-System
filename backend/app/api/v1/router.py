"""Aggregates versioned API routers."""

from fastapi import APIRouter

from .endpoints import analytics, reports, vulnerability

api_router = APIRouter()
api_router.include_router(vulnerability.router, prefix="/vulnerability", tags=["vulnerability"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

