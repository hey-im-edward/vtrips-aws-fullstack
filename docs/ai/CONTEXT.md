# Context

## Project Goal
- Build V-Trips AWS Fullstack as a full-scoring AWS FCAJ/HUTECH internship submission demo.
- The demo should prioritize a working local product, polished travel UI, clear backend/API boundaries, AWS architecture documentation, workshop materials, blog drafts, deployment guide, and cleanup guide.

## Current Focus
- Post-implementation audit: verify local run, screenshots, submission docs, workshop-repo boundary, and microservices-ready architecture notes.
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
- Microservices-ready architecture notes are documented at `docs/architecture/microservices-ready-architecture.md`.
- README local run has been audited with `npm.cmd install` and `npm.cmd run dev`.

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
