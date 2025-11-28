Contribution Guidelines
=======================

1. **Branch Strategy**
   - `main` for production-ready code.
   - `develop` for integration testing.
   - Feature branches follow `feat/<component>-<short-description>`.

2. **Coding Standards**
   - Python: ruff + black formatting, type hints mandatory, FastAPI routers kept lean.
   - Web: TypeScript strict mode, hooks + functional components only, prefer TanStack Query for remote data.
   - Mobile: Expo function components, no class components, leverage AsyncStorage for offline state.

3. **Testing**
   - Backend: pytest with coverage ≥80%.
   - Web: Vitest + Testing Library for components, Playwright for flows.
   - Mobile: Jest + React Native Testing Library for business logic hooks.

4. **Security**
   - No credentials committed; use `.env.example`.
   - Document third-party dataset licenses when integrating connectors.

5. **Pull Requests**
   - Link to related issue + SDG impact.
   - Include screenshots/GIFs for UI changes.
   - Describe data migrations or infrastructure changes.

6. **Issue Triage**
   - Labels: `needs-design`, `data-pipeline`, `ai-model`, `frontend`, `mobile`, `good-first-issue`.
   - Weekly triage call with humanitarian partners for prioritisation.

