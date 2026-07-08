# V-Trips AWS Fullstack Codex Goal

Use this file as the handoff brief for the next Codex Goal run. The objective is to build a full-scoring demo (demo huong toi diem toi da) for the V-Trips AWS Fullstack submission while keeping local execution reliable and AWS work explicit.

## Objective

Complete V-Trips AWS Fullstack as a submission-ready travel product demo:

- A local app that runs and can be demonstrated.
- Frontend and backend both exist.
- Core travel workflows are implemented as working slices.
- UI looks like a polished travel product, not a plain CRUD dashboard.
- AWS architecture and deployment documentation are complete.
- Technical docs, blog drafts, testing docs, cleanup guide, and submission checklist are present for the app repo.
- Final report clearly separates what is working, what is prototype/fallback, and what remains future work.

## Current Repo

```text
D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack
```

## Workshop Repository Split

- The FCJ-style Workshop Link / internship report website is handled in `../vtrips-workshop`.
- Do not build the main workshop website in this app repo.
- This app repo should only produce technical docs/submission docs that the workshop repo can reference.
- Do not create another workshop repository from this Goal.

Before starting the implementation Goal, a baseline commit is recommended:

```powershell
git add .
git commit -m "chore: bootstrap vtrips planning materials"
```

## Required Reading Before Implementation

Read these files first, in this order:

1. `AGENTS.md`
2. `PLAN.md`
3. `docs/source-materials/research-action-summary.md`
4. `docs/source-materials/full-deep-research-report.md`
5. `docs/ai/CONTEXT.md`
6. `docs/ai/TASKS.md`

Also keep repo-local `docs/ai/` as the daily source of truth (nguon su that hang ngay) for context, task status, and progress logging.

## Operating Rules

- Use Codex Goal mode (che do muc tieu dai han) for the implementation run.
- Use subagents (tac nhan phu) if available for independent chunks such as frontend UI, backend/API, docs, and validation.
- Use relevant skills (ky nang) when available, especially for frontend implementation, testing/debugging, and plan execution.
- Use GitNexus only if code understanding (hieu code), tracing (truy vet), refactoring (tai cau truc), or impact analysis (phan tich pham vi anh huong) is needed. Do not run GitNexus `analyze` or `index` unless explicitly allowed for the current repo.
- Use Playwright/browser screenshots (anh chup trinh duyet) when UI exists. Do not assume the UI is good just because it compiles.
- Do not ask for AWS root password.
- Do not hard-code secrets.
- Do not commit secrets.
- Do not create cost-impacting AWS resources without explicit user approval.
- Do not perform destructive AWS cleanup without explicit user approval.
- Do not modify AI-LifeOS root metadata or unrelated vault content.
- Prefer the smallest safe change that gets the demo closer to submission.

## Product Requirements

V-Trips is a service-oriented modular travel platform demo. It should cover:

- Place discovery with search/filter.
- Trip planning with day itinerary.
- Reviews and ratings.
- Save/like/comment-style social interactions where feasible.
- Booking request basic flow.
- Business dashboard for listing owner perspective.
- Admin dashboard for moderation overview.
- Export PDF basic action.
- AI suggestion panel with deterministic fallback allowed.
- Demo auth or Cognito-ready auth.
- Local run as the first reliability target.

## Architecture

Implement as a modular monolith/serverless-style modules (monolith chia module, trien khai theo huong serverless) to reduce deadline risk while keeping clear service boundaries:

- Auth/User
- Listing/Place
- Review/Rating
- Trip Planner
- Social
- Booking
- Business/Admin
- Export PDF
- AI Suggestion

The README and architecture docs must explain that the demo is built with modular boundaries and is ready to map to serverless AWS components.

## AWS Target

Document and align the codebase with this AWS target architecture:

- S3 for frontend/static assets and media/export storage.
- CloudFront for HTTPS/CDN.
- API Gateway for HTTP API entrypoint.
- Lambda for backend handlers.
- DynamoDB for core data tables.
- Cognito-ready authentication.
- CloudWatch for logs, metrics, and basic operational visibility.
- IAM for least-privilege permissions.

If real AWS deployment is blocked, create a local/demo fallback and document exactly which parts are implemented versus conceptual.

## Frontend Screens Required

Build polished, responsive screens:

- Home/Search
- Login/Register or demo auth
- Profile
- Place listing
- Place detail
- Create/Edit place
- Trip list
- Trip detail/day itinerary
- Create/Edit trip
- Saved places
- Review list/form
- Booking page or My bookings
- Business dashboard basic
- Admin dashboard basic
- Export PDF action
- AI suggestion panel

UI quality bar:

- Must look like a travel product with strong imagery/content hierarchy.
- Must be responsive on desktop and mobile.
- Must include loading, empty, and error states where relevant.
- Must not be a plain white CRUD table app.
- Must avoid overbuilt marketing-only pages; the usable app should be visible quickly.

## Backend/API Requirements

Build a clear backend/API surface:

- Routes grouped by module.
- Validation for request payloads.
- Seed/sample data suitable for demo.
- Local persistence guaranteed, using the fastest stable option available in the repo context.
- Endpoint docs in `docs/api/endpoints.md`.
- Auth can be demo auth or Cognito-ready, but the final report must state the exact status.
- AI suggestion can be rule-based fallback, but it must be visible and documented honestly.

## Required Docs

These are app-local technical/submission docs. The FCJ-style workshop website belongs in `../vtrips-workshop`.

Create or update:

- `README.md`
- `docs/ai/CONTEXT.md`
- `docs/ai/TASKS.md`
- `docs/ai/DECISIONS.md`
- `docs/ai/LOG.md`
- `docs/architecture/aws-architecture.md`
- `docs/architecture/aws-architecture-diagram.mmd`
- `docs/api/endpoints.md`
- `docs/deployment/aws-deploy-guide.md`
- `docs/deployment/cleanup-guide.md`
- `docs/testing/test-plan.md`
- `docs/submission/submission-checklist.md`
- `docs/submission/facebook-blog-draft-1.md`
- `docs/submission/facebook-blog-draft-2.md`
- `docs/submission/facebook-blog-draft-3.md`
- `docs/workshop/vi/overview.md`
- `docs/workshop/vi/deployment.md`
- `docs/workshop/vi/cleanup.md`
- `docs/workshop/en/overview.md`
- `docs/workshop/en/deployment.md`
- `docs/workshop/en/cleanup.md`

The README and final report must use clear sections for:

- Implemented
- Prototype/Fallback
- Future Work

## Validation Loop

After each major checkpoint:

1. Run build/typecheck/lint/test commands if available.
2. Fix errors before continuing.
3. Run the local app when feasible.
4. Use Playwright/browser screenshots for key UI pages after screens exist.
5. Capture screenshots into `docs/submission/screenshots/` if feasible.
6. Inspect screenshots for layout, spacing, responsiveness, and visual polish.
7. Update `docs/ai/LOG.md` with a short progress entry.
8. Update `docs/ai/TASKS.md` to reflect current status.
9. Continue unless blocked by credentials, cost-impacting AWS action, destructive action, or a blocker that cannot be solved locally.

## Checkpoints

1. Read required docs and source materials.
2. Update product brief/task plan if needed.
3. Scaffold frontend/backend.
4. Make the local app boot.
5. Implement core modules: listing, trip planner, reviews, saved places/social basics, profile, demo auth.
6. Implement secondary thin slices: booking, business/admin dashboards, export PDF, AI suggestion fallback.
7. Polish UI and responsive states.
8. Run browser/screenshot-based visual QA.
9. Generate AWS architecture docs, diagram, deploy guide, and cleanup guide.
10. Generate app technical docs and three blog drafts; keep the Workshop Link website in `../vtrips-workshop`.
11. Run final checks.
12. Update `docs/ai/` and produce the final report.

## Pause Conditions

Pause and ask the user only when:

- AWS credential or account action is required.
- Cost-impacting AWS resource creation is needed.
- Destructive cloud action is about to happen.
- A blocker cannot be resolved locally.
- A requested action would violate repo/user constraints.

Do not pause for routine implementation choices that can be made conservatively from `PLAN.md` and source materials.

## Stopping Condition

The Goal is done only when:

- App runs locally, or exact verified local run instructions exist with commands and results.
- Frontend and backend both exist.
- Core screens exist and are connected to data/API behavior.
- Required docs listed above exist.
- AWS architecture diagram source exists.
- Deployment guide exists.
- Cleanup guide exists.
- App-local technical/submission docs exist so `../vtrips-workshop` can reference them.
- Three blog drafts exist.
- Final report in Vietnamese clearly separates working versus prototype/fallback.
- `docs/ai/CONTEXT.md`, `docs/ai/TASKS.md`, and `docs/ai/LOG.md` are updated.

## Final Report Format

Use this final report format in Vietnamese:

```text
Summary
- ...

What was built
- ...

How to run local
- ...

AWS architecture covered
- ...

How to deploy AWS
- ...

What is working
- ...

What is prototype/fallback
- ...

Files changed
- ...

Commands run
- ...

Tests/checks run
- ...

Risks
- ...

What user must do before submission
- ...
```
