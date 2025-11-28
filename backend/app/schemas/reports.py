"""Schemas for community reporting workflows."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Location(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    settlement: Optional[str] = None


class CommunityReportCreate(BaseModel):
    reporter_name: str
    reporter_role: str
    county: str
    payam: str
    incident_type: str = Field(..., description="e.g., shortage, displacement, crop_failure, price_spike.")
    households_impacted: int = Field(..., ge=0)
    narrative: str
    location: Location
    attachments: List[str] = Field(default_factory=list, description="List of uploaded media URLs (optional).")


class CommunityReport(CommunityReportCreate):
    id: str
    created_at: datetime
    severity: str


class CommunityReportList(BaseModel):
    items: List[CommunityReport]
    total: int

