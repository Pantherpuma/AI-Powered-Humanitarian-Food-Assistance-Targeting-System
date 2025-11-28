System Architecture
===================

High-Level View
---------------

```
[Data Sources] --> [Ingestion & ETL] --> [Feature Store / Data Lake] --> [ML Pipelines] --> [Inference APIs]
                                                                                         \--> [Analytics DB] --> [Web Dashboard]
[Community Mobile App] ---> [Sync API / Gateway] ----------------------------------------/
```

Key Subsystems
--------------

1. **Data Ingestion & Integration**
   - Prefect flows orchestrate ETL jobs pulling:
     - Satellite indices (Sentinel, Landsat, MODIS via Google Earth Engine exports)
     - Weather forecasts (NOAA, ECMWF), flood/drought severity (Dartmouth, GloFAS)
     - Conflict data (ACLED), displacement reports (IOM DTM)
     - Market price feeds (FAO, FEWS NET, local MIS)
     - Partner datasets via HDX/WFP APIs
   - Raw assets land in Azure Data Lake Storage (or Amazon S3) with metadata cataloged in OpenMetadata.
   - Validation rules run via Great Expectations before loading curated tables in Postgres/PostGIS.

2. **Feature Store & ML Pipelines**
   - Spatial-temporal feature engineering with xarray, Rasterio, and GeoPandas.
   - Feature store (Feast) manages entity definitions for counties, payams, and 5km grid cells.
   - Models:
     - Gradient boosted trees and temporal fusion transformers for vulnerability scoring.
     - Graph-based models to infer supply chain bottlenecks.
     - NLP classifiers on community narratives to auto-tag events.
   - MLflow tracks experiments; best models exported to ONNX for FastAPI serving.

3. **Backend Services**
   - FastAPI app with modular routers: `ingest`, `reports`, `v1/vulnerability`, `analytics`, `auth`.
   - PostgreSQL/PostGIS stores reports, scores, beneficiary registries; Redis caches hot tiles.
   - Message bus (Azure Service Bus / AWS SNS-SQS) handles alert fan-out.
   - Prefect Agents monitor scheduled scoring jobs; Celery workers manage heavy analytics.

4. **Web Dashboard**
   - React + Vite front-end served via Azure Static Web Apps or AWS CloudFront.
   - Mapbox GL JS renders vulnerability layers, field reports, warehouses, logistics routes.
   - TanStack Query caches API data; Zustand manages UI state; TailwindCSS for layout.
   - Modules: Early Warning feed, Tasking & distribution planner, Beneficiary registry filters, Analytics panel.

5. **Mobile App**
   - Expo/React Native; offline persistence via SQLite/WatermelonDB and encrypted storage.
   - Core flows: Rapid incident reporting, beneficiary verification, distribution logging, alerts.
   - Background sync merges queued reports when connectivity returns; push notifications use Firebase.

6. **Security & Governance**
   - Auth0 or Azure AD B2C for federated login; JWT scopes enforce role-based access.
   - Data encryption at rest (Postgres TDE, S3/Azure Storage SSE) and in transit (TLS1.2).
   - Audit logging to Azure Monitor / CloudWatch; immutable trail kept in AWS QLDB or Azure Confidential Ledger for sensitive actions.

7. **DevOps & Deployment**
   - Infrastructure-as-code via Terraform modules.
   - CI/CD (GitHub Actions/Azure DevOps) running tests, lint, vulnerability scans, container builds (Docker/Helm).
   - Blue/green deployments for backend, OTA updates for mobile via Expo EAS Update.

Data Flow Narrative
-------------------

1. Prefect orchestrates nightly/hourly ingestions, storing clean datasets in the data lake and curated tables.
2. MLflow-triggered pipelines train or refresh vulnerability models; best artifacts are pushed to the model registry.
3. FastAPI inference service consumes the registry, exposing `/v1/vulnerability/{region}` endpoints consumed by web/mobile.
4. Community mobile app works offline, queues reports, and syncs via `/v1/reports/sync` using delta tokens.
5. Web dashboard subscribes to SSE/WebSocket channels for alerts triggered by analytics thresholds.
6. Decision-makers export recommended distribution plans, while donors access transparency dashboards via SSO.

Scalability & Resilience
------------------------

- Horizontal scaling via Kubernetes HPA; GPU nodes for heavy inference if required.
- Read replicas for Postgres; CDN-cached tiles for map layers.
- Automated retries and dead-letter queues for ETL flows; chaos testing to validate failover.

Extensibility
-------------

- Connector SDK allows partners to plug new datasets with schema contracts.
- Feature store supports new entity types (e.g., settlement-level) without redesigning APIs.
- Modular UI widgets enable localization and custom workflows per partner.

