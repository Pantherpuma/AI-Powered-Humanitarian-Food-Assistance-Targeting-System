"""Automated analytics endpoints."""

from typing import List

from fastapi import APIRouter, Query

from ....schemas import DistributionRecommendation
from ....services import analytics as service

router = APIRouter()


@router.get(
    "/distribution-plan",
    response_model=DistributionRecommendation,
    summary="Generate a recommended distribution plan for given regions.",
)
def get_distribution_plan(regions: List[str] = Query(..., description="List of county identifiers.")) -> DistributionRecommendation:
    return service.generate_distribution_recommendations(regions)

