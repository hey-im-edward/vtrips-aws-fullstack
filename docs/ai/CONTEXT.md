# Context

## Project Goal
- Build V-Trips AWS Fullstack as a full-scoring AWS FCAJ/HUTECH internship submission demo.
- The demo should prioritize a working local product, polished travel UI, clear backend/API boundaries, AWS architecture documentation, workshop materials, blog drafts, deployment guide, and cleanup guide.

## Current Focus
- Stage AWS-SAFE-0: prepare cost-safe AWS deployment artifacts without deploying app resources.
- The only AWS mutation allowed in AWS-SAFE-0 is AWS Budget create/check after identity preflight passes.
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
- Target app GitHub repo: `https://github.com/hey-im-edward/vtrips-aws-fullstack`.
- Target workshop repo: `https://github.com/hey-im-edward/aws-fcj-workshop`.
- Target workshop URL: `https://hey-im-edward.github.io/aws-fcj-workshop/`.
- Public app GitHub repo is created and branch `main` is pushed.
- App production HTTPS URL remains `TODO CloudFront URL` until a real AWS deploy is approved and completed.
- AWS CLI binary found at `C:\Program Files\Amazon\AWSCLIV2\aws.exe`.
- AWS region config is `ap-southeast-1`.
- AWS identity verified for account `606163772198` with non-root ARN `arn:aws:iam::606163772198:user/admin`.
- AWS Budget `VTrips-Demo-Budget` exists at 5 USD/month with notifications configured in AWS account.
- Read-only discovery found no existing VTrips app stack/resources.
- No app resources have been deployed in AWS-SAFE-0.
- AWS-SAFE-0 infra artifacts are under `infra/aws/`.
- Prepared future stack name: `vtrips-demo`.
- CloudFront target uses `PriceClass_100` for the cost-safe demo.
- Future `infra/aws/deploy.ps1` validates local build, local Lambda smoke test, and AWS Budget before CloudFormation.
- Future `infra/aws/deploy.ps1` checks `/api/health`, `/api/saved`, and `/api/bookings` after deploy before uploading frontend assets.

## Constraints
- GitHub repo creation/push is explicitly approved for Stage G0 only.
- Do not deploy AWS resources unless explicitly approved.
- Do not run GitNexus analyze/index from AI-LifeOS root.
- Do not modify AI-LifeOS root `.git`.
- Do not touch vault content outside the project memory created by `init-agent-project.ps1`.
- Do not ask for AWS password.
- Do not hard-code secrets.
- Do not store AWS Budget notification email in repo/docs.
- Do not deploy app resources in AWS-SAFE-0.
- Do not run `infra/aws/deploy.ps1` or `infra/aws/cleanup.ps1` in AWS-SAFE-0.
- Do not create Bedrock, OpenSearch, RDS, WAF, NAT Gateway, EC2, Elastic Beanstalk, Cognito, or custom KMS keys unless explicitly approved later.

## Do Not Change
- Do not change AI-LifeOS root git metadata.
- Do not deploy or create cost-impacting AWS resources without explicit user approval.
- Do not install dependencies until the implementation stage explicitly needs them.

## Open Questions
- Whether the user wants a real AWS deploy after AWS-SAFE-0 guardrails are verified.
