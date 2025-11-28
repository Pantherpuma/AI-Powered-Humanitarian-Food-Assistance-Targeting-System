"""In-memory community reporting service for early prototyping."""

from __future__ import annotations

from datetime import datetime, timedelta
from threading import Lock
from typing import List
from uuid import uuid4

from ..schemas import CommunityReport, CommunityReportCreate, CommunityReportList

_REPORTS: List[CommunityReport] = []
_LOCK = Lock()


def _seed_reports() -> None:
    if _REPORTS:
        return
    seed_payloads = [
        CommunityReport(
            id=str(uuid4()),
            created_at=datetime.utcnow() - timedelta(hours=2),
            severity="high",
            reporter_name="Nyamal A.",
            reporter_role="Village Chief",
            county="unity",
            payam="Rubkona",
            incident_type="flooding",
            households_impacted=850,
            narrative="Floodwaters have displaced three villages; stocks exhausted within one week.",
            location={"latitude": 9.257, "longitude": 29.798, "settlement": "Rubkona"},
            attachments=[],
        ),
        CommunityReport(
            id=str(uuid4()),
            created_at=datetime.utcnow() - timedelta(hours=5),
            severity="medium",
            reporter_name="James L.",
            reporter_role="Enumerator",
            county="jonglei",
            payam="Bor South",
            incident_type="price_spike",
            households_impacted=420,
            narrative="Sorghum prices rose 48% after river transport disruption; markets empty.",
            location={"latitude": 6.207, "longitude": 31.559, "settlement": "Bor"},
            attachments=[],
        ),
    ]
    _REPORTS.extend(seed_payloads)


def _derive_severity(payload: CommunityReportCreate) -> str:
    multiplier = 1
    if payload.incident_type in {"displacement", "flood", "flooding"}:
        multiplier += 1
    if payload.households_impacted > 500:
        multiplier += 1
    if payload.households_impacted > 1500:
        multiplier += 1

    return ["low", "medium", "high", "critical"][min(multiplier, 3)]


def create_report(payload: CommunityReportCreate) -> CommunityReport:
    """Persist a report to the in-memory store."""

    with _LOCK:
        report = CommunityReport(
            id=str(uuid4()),
            created_at=datetime.utcnow(),
            severity=_derive_severity(payload),
            **payload.model_dump(),
        )
        _REPORTS.append(report)
        return report


def list_reports(limit: int = 50) -> CommunityReportList:
    """Return the latest reports."""

    _seed_reports()
    with _LOCK:
        items = list(sorted(_REPORTS, key=lambda r: r.created_at, reverse=True))[:limit]
        return CommunityReportList(items=items, total=len(_REPORTS))

