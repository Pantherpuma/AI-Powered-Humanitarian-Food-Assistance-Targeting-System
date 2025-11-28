"""
App package for the AI-Powered Humanitarian Food Assistance Targeting System.

This module exposes the FastAPI factory when importing `app`.
"""

from .main import create_app

__all__ = ["create_app"]

