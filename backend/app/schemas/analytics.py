"""Schemas powering automated analytics and recommendations."""

from datetime import datetime
from typing import List

from pydantic import BaseModel


class DistributionPlan(BaseModel):
    region_id: str
    households_targeted: int
    tonnage_required_mt: float
    recommended_route: List[str]


class DistributionRecommendation(BaseModel):
    generated_at: datetime
    methodology: str
    plans: List[DistributionPlan]

