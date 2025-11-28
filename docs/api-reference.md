API Reference (MVP)
===================

Base URL
--------

- Local development (FastAPI): `http://localhost:8080`
- Vite proxy: `http://localhost:5173/api`
- Mobile (Expo): `http://localhost:8080/v1`

Authentication
--------------

The MVP ships without auth for simplicity. Production deployments enforce Auth0/Entra ID JWT validation via FastAPI dependency injection.

Endpoints
---------

### `GET /healthz`

Health probe for load balancers and uptime checks.

### `GET /v1/vulnerability/{region_id}`

Returns AI-derived vulnerability score for a county or payam.

Response:

```6:18:backend/app/schemas/vulnerability.py
class VulnerabilityScore(BaseModel):
    region_id: str
    risk_score: float
    risk_level: str
    updated_at: datetime
    indicators: Dict[str, float]
    feature_contributions: List[FeatureContribution]
```

### `GET /v1/reports?limit=50`

Fetch latest community reports captured via mobile app or dashboard.

### `POST /v1/reports`

Submit a community report. Body aligns with `CommunityReportCreate`.

### `GET /v1/analytics/distribution-plan?regions=unity&regions=jonglei`

Combines vulnerability scores + report intel to recommend distribution plans.

Future Extensions
-----------------

- `POST /v1/vulnerability/retrain` – trigger model retraining with Prefect.
- `POST /v1/integrations/hdx/sync` – refresh data from HDX/FEWS NET connectors.
- `GET /v1/datasets/{layer}` – stream map-ready vector tiles.

