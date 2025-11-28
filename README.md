AI-Powered Humanitarian Food Assistance Targeting System
========================================================

Overview
--------

This repository hosts the initial architecture, documentation, and reference implementations for an AI-powered web and mobile platform that helps humanitarian actors in South Sudan target food assistance more accurately. The platform combines satellite, climate, conflict, and market data with community-reported signals to compute an AI-driven vulnerability index and power real-time coordination dashboards.

Repository Layout
-----------------

- `docs/` – Concept note, architecture diagrams, SDG alignment, prototyping, and go-to-market materials.
- `backend/` – FastAPI service exposing AI scoring, community report ingestion, analytics, and integration APIs.
- `web/` – Vite + React dashboard showing vulnerability layers, alerts, and coordination tooling.
- `mobile/` – Expo React Native app for offline-first field data collection and alerting.

Key Capabilities
----------------

1. **AI Vulnerability Index** – Ingests satellite, climate, conflict, and market datasets, fuses them through a modular pipeline, and serves composite vulnerability scores per county or grid.
2. **Community Reporting Tool** – Offline-first mobile workflows for chiefs, enumerators, and volunteers to submit shortages, displacement, crop failure, or price shocks with photos and GPS trails.
3. **Humanitarian Coordination Dashboard** – Web-based map, alert feed, and distribution planning workspace integrating feeds from UN OCHA, WFP, NGOs, and the national disaster management authority.
4. **Automated Analytics & Recommendations** – Optimization services that highlight priority locations, propose delivery routes, and run what-if simulations.
5. **Data Integration Layer** – Connectors and ETL jobs for HDX, FEWS NET, FAO, WFP SCOPE, and local market information systems.

Technology Stack
----------------

- **Backend** – FastAPI + SQLModel, PostGIS, Redis streams, Prefect orchestration, xgboost/pytorch models wrapped through ONNX Runtime for inference.
- **Web** – React (Vite), Mapbox GL JS, TanStack Query, TailwindCSS, Recharts for insights, Auth0/SAML SSO.
- **Mobile** – Expo (React Native), SQLite offline cache, Background sync + push notifications via Firebase Cloud Messaging.
- **Data & ML** – Prefect flow orchestrations, Rasterio & xarray for gridded data, Hugging Face transformers for text reports, scikit-learn pipelines for tabular fusion.

Getting Started
---------------

1. **Backend**
   - Create & activate a Python 3.11 virtual environment.
   - `pip install -r backend/requirements.txt`
   - `uvicorn app.main:app --reload --port 8080`

2. **Web Dashboard**
   - `cd web`
   - `npm install`
   - `npm run dev`

3. **Mobile App**
   - `cd mobile`
   - `npm install`
   - `npx expo start`

Next Steps
----------

- Populate `.env` templates with API keys (Mapbox, Auth0, data providers).
- Connect actual datasets via the Prefect ingestion flow.
- Integrate the AI model weights once training pipelines are finalized.
- Deploy reference stack via Terraform modules targeting Azure or AWS, with CloudFront/Static Web Apps for the dashboard and managed Postgres + AKS/EKS for backend services.

Contributing
------------

Contributions are welcome from humanitarian partners, NGOs, and technologists. Please propose enhancements via pull requests or issues, following the coding standards documented in `docs/contribution-guidelines.md`.

License
-------

Released under the MIT License to encourage collaboration across the humanitarian ecosystem.

