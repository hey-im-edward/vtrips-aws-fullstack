# Context

## Project Goal
- Build V-Trips AWS Fullstack as a full-scoring AWS FCAJ/HUTECH internship submission demo.
- The demo should prioritize a working local product, polished travel UI, clear backend/API boundaries, AWS architecture documentation, workshop materials, blog drafts, deployment guide, and cleanup guide.

## Current Focus
- Implementation Goal: build the main V-Trips app repo with frontend, backend, local demo, UI polish, AWS architecture docs, and submission docs.
- The FCJ-style Workshop Link website remains split into `../vtrips-workshop`; this repo only keeps app-local workshop reference docs.

## Current Status
- Project scaffold: initialized in `D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack`.
- Daily source of truth: repo-local `docs/ai/`.
- Product source material: `docs/source-materials/research-brief.md`.
- Execution plan for next stage: `PLAN.md`.
- Frontend: React + Vite + TypeScript app implemented in `frontend/`.
- Backend: Node.js + TypeScript API implemented in `backend/`.
- Local persistence: JSON runtime database generated at `backend/data/runtime-db.json` and ignored by git.
- Submission docs and screenshots are under `docs/submission/`.

## Constraints
- Do not create a GitHub repo unless explicitly asked.
- Do not deploy AWS resources unless explicitly approved.
- Do not run GitNexus analyze/index from AI-LifeOS root.
- Do not modify AI-LifeOS root `.git`.
- Do not touch vault content outside the project memory created by `init-agent-project.ps1`.
- Do not ask for AWS password.
- Do not hard-code secrets.

## Do Not Change
- Do not change AI-LifeOS root git metadata.
- Do not deploy or create cost-impacting AWS resources without explicit user approval.
- Do not install dependencies until the implementation stage explicitly needs them.

## Open Questions
- Whether GitHub should be created after the local demo and documentation skeleton are stable.
- Whether the user wants a real AWS frontend deploy after reviewing the local demo.
