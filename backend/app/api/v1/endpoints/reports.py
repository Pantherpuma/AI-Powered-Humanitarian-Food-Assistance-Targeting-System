"""Community reporting endpoints."""

from fastapi import APIRouter

from ....schemas import CommunityReport, CommunityReportCreate, CommunityReportList
from ....services import reports as service

router = APIRouter()


@router.get("/", response_model=CommunityReportList, summary="List recent community reports.")
def list_reports(limit: int = 50) -> CommunityReportList:
    return service.list_reports(limit=limit)


@router.post(
    "/",
    response_model=CommunityReport,
    status_code=201,
    summary="Submit a new community intelligence report.",
)
def create_report(payload: CommunityReportCreate) -> CommunityReport:
    return service.create_report(payload)

