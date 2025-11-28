"""Analytics and recommendation utilities."""

from __future__ import annotations

from datetime import datetime
from math import ceil
from typing import List

from ..schemas import CommunityReport, DistributionPlan, DistributionRecommendation
from . import reports as report_service
from . import vulnerability as vulnerability_service


def _estimate_households(score: float, reported_households: int) -> int:
    base = max(reported_households, 200)
    return int(base * (1 + score))


def generate_distribution_recommendations(regions: List[str]) -> DistributionRecommendation:
    """Combine AI scores and community intel for an illustrative plan."""

    plans: List[DistributionPlan] = []
    report_snapshot = report_service.list_reports().items
    report_by_region = {r.county.lower(): r for r in report_snapshot}

    for region in regions:
        score = vulnerability_service.score_region(region)
        reported = report_by_region.get(region.lower())
        households = _estimate_households(
            score.risk_score,
            reported.households_impacted if isinstance(reported, CommunityReport) else 300,
        )
        tonnage = round(households * 0.015, 2)  # 15kg per household
        route = [
            f"Warehouse-{region.title()}",
            f"Checkpoint-{ceil(score.risk_score * 5)}",
            f"Distribution-{region.title()}",
        ]
        plans.append(
            DistributionPlan(
                region_id=region,
                households_targeted=households,
                tonnage_required_mt=tonnage,
                recommended_route=route,
            )
        )

    return DistributionRecommendation(
        generated_at=datetime.utcnow(),
        methodology="Heuristic blend of AI risk scores and latest field intelligence.",
        plans=plans,
    )

