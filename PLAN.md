# PLAN

## Objective
Build V-Trips AWS Fullstack as a full-scoring demo for AWS FCAJ/HUTECH submission.

Done means:
- app runs locally
- frontend and backend exist
- core screens/modules exist
- UI is visually polished
- technical docs/submission/blog/architecture/deploy/cleanup exist for app delivery
- final report clearly states working vs prototype/fallback

## Repository Split
- Workshop website is now a separate repo: `../vtrips-workshop`.
- This app repo does not build the main Workshop Link website anymore.
- This app repo only creates technical docs/submission docs that the workshop repo can reference.
- Do not create another workshop repo from this app repo.

## Stack
- Frontend: React + Vite + TypeScript
- UI: polished travel product UI, responsive
- Backend: Node.js + TypeScript API
- Local persistence: JSON/SQLite/simple file DB, whichever is fastest and stable
- AWS target: S3 + CloudFront + API Gateway + Lambda + DynamoDB + Cognito-ready + CloudWatch + IAM
- Visual QA: Playwright/browser screenshots if possible

## Must truly work
- Home/Search
- Place listing
- Place detail
- Create/Edit place
- Trip list
- Trip detail/day itinerary
- Create/Edit trip
- Saved places
- Review list/form
- Profile
- Demo auth or Cognito-ready auth
- Booking request basic
- Business dashboard basic
- Admin dashboard basic
- Export PDF basic
- AI suggestion fallback
- Local run

## Prototype/Fallback
- Google OAuth real integration
- Bedrock real integration
- chat realtime
- advanced moderation/report
- claim listing deep workflow
- Redis/OpenSearch/microservices production

## Required docs
These are app-local technical/submission docs. The FCJ-style Workshop Link website belongs in `../vtrips-workshop`.

- README.md
- docs/architecture/aws-architecture.md
- docs/architecture/aws-architecture-diagram.mmd
- docs/api/endpoints.md
- docs/deployment/aws-deploy-guide.md
- docs/deployment/cleanup-guide.md
- docs/testing/test-plan.md
- docs/submission/submission-checklist.md
- docs/submission/facebook-blog-draft-1.md
- docs/submission/facebook-blog-draft-2.md
- docs/submission/facebook-blog-draft-3.md
- docs/workshop/vi/overview.md
- docs/workshop/vi/deployment.md
- docs/workshop/vi/cleanup.md
- docs/workshop/en/overview.md
- docs/workshop/en/deployment.md
- docs/workshop/en/cleanup.md

## Visual QA
Codex must not assume UI is good just because it compiles.
It should:
- run the app locally
- use Playwright/browser automation if available
- capture screenshots of key pages into docs/submission/screenshots/
- inspect screenshots
- improve layout, spacing, states, responsiveness
- test desktop and mobile viewport

## Checkpoints
1. Read AGENTS.md, docs/ai, docs/source-materials, PLAN.md.
2. Update Product Brief and TASKS.
3. Scaffold frontend/backend.
4. Make local app boot.
5. Implement core modules.
6. Implement secondary thin slices.
7. Polish UI.
8. Add visual QA screenshots.
9. Generate AWS docs/diagram/deploy/cleanup.
10. Generate app technical docs and blog drafts; keep the Workshop Link website in `../vtrips-workshop`.
11. Run checks.
12. Update docs/ai and final report.

## Pause only when
- AWS credential/account action is needed
- cost-impacting AWS resource creation is needed
- destructive action is about to happen
- blocker cannot be solved locally
