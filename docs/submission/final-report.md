# V-Trips Final Report

## Summary
V-Trips is a local fullstack travel product demo with a React/Vite frontend, Node.js/TypeScript backend, local JSON persistence, and AWS-ready architecture documentation. Stage AWS-SAFE-0 prepares cost-safe AWS deploy artifacts but does not deploy app resources.

## Public links
- App GitHub repo: `https://github.com/hey-im-edward/vtrips-aws-fullstack`
- Workshop repo: `https://github.com/hey-im-edward/aws-fcj-workshop`
- Workshop URL: `https://hey-im-edward.github.io/aws-fcj-workshop/`
- App production HTTPS URL: `TODO CloudFront URL`

## What was built
- Frontend app shell with Explore, Trips, Saved, Business, and Admin tabs.
- Place discovery/search/filter, place detail, create/edit place, save/like.
- Trip list and day itinerary with create trip flow.
- Review list/form with rating recalculation.
- Booking request basic flow.
- Demo auth/profile.
- Business/admin dashboard summaries.
- AI suggestion fallback.
- Print-ready export action.
- AWS architecture, deploy, cleanup, API, testing, submission, blog docs, and cost-safe infra preparation.

## How to run local
```powershell
cd D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:5173`. Backend health runs at `http://127.0.0.1:8787/api/health`.

## AWS architecture covered
- S3 private frontend storage.
- CloudFront HTTPS/CDN with `PriceClass_100`.
- API Gateway HTTP API.
- Lambda `nodejs22.x` demo API handler.
- DynamoDB on-demand target persistence.
- CloudWatch Logs.
- IAM least privilege.
- Microservices-ready service boundaries and future split path in `docs/architecture/microservices-ready-architecture.md`.

## How to deploy AWS
Follow `docs/deployment/aws-production-deploy.md`. Do not run `infra/aws/deploy.ps1` until a later approved deployment stage. No V-Trips app resources were created in AWS-SAFE-0.

Prepared deploy command:

```powershell
.\infra\aws\deploy.ps1
```

Mandatory cleanup command after any approved demo deploy:

```powershell
.\infra\aws\cleanup.ps1 -ConfirmCleanup
```

## What is working
- Local frontend/backend build.
- Local API routes and JSON persistence.
- Core UI screens and workflows listed in `GOAL.md`.
- App-local technical and submission docs.
- Cost-safe AWS artifacts under `infra/aws/`.
- Future deploy guardrails: pre-CloudFormation build/test, AWS Budget verification, CloudFront `PriceClass_100`, and post-deploy API checks.

## What is prototype/fallback
- Demo auth instead of Cognito.
- Rule-based AI instead of Bedrock.
- Browser print HTML instead of native PDF generation.
- Local JSON persistence instead of DynamoDB.
- AWS production deployment is prepared but not executed.

## Files changed
- App code in `frontend/` and `backend/`.
- Workspace scripts in `scripts/`.
- Technical/submission docs in `docs/`.
- AWS-SAFE-0 infra artifacts in `infra/aws/`.
- Root README/package files.

## Commands run
- `npm.cmd install`
- `npm.cmd run build`
- `node scripts/smoke-api.mjs`
- Microsoft Edge headless screenshot commands for desktop/mobile QA.
- `rg` secret pattern scan.
- `node infra/aws/test-lambda.mjs`

## Tests/checks run
- TypeScript/backend build.
- TypeScript/frontend build.
- Vite production build.
- Backend health check returned `status=ok`.
- Desktop screenshot: `docs/submission/screenshots/vtrips-desktop.png`.
- Mobile screenshot: `docs/submission/screenshots/vtrips-mobile.png`.
- Additional tab screenshots: `vtrips-trips.png`, `vtrips-saved.png`, `vtrips-business.png`, `vtrips-admin.png`.
- Concept reference: `docs/submission/screenshots/vtrips-ui-concept.png`.
- Playwright MCP was unavailable because Chrome was missing; Edge headless was used as browser screenshot fallback.
- Secret pattern scan found no matches for the scanned patterns.
- Lambda handler local in-memory smoke test is part of AWS-SAFE-0 validation.

## Risks
- Official FCAJ/HUTECH rules were not fully verifiable from public links in the source report.
- Remote Unsplash images require network access for best visual demo.
- Real AWS deploy, Cognito, Bedrock, and production DynamoDB design remain future implementation.
- Current architecture is microservices-ready modular monolith, not real production microservices.
- Cleanup is mandatory after any approved demo deployment.

## What user must do before submission
- Run the local demo and capture final screenshots.
- Decide whether to approve AWS-SAFE-1 deployment for the cost-safe demo stack.
- Keep the final Workshop Link website in `../vtrips-workshop`.

## AWS-SAFE-0 Update
- AWS CLI executable found at the standard AWS CLI v2 install path.
- AWS region configuration is `ap-southeast-1`.
- AWS identity verified for account `606163772198` with non-root ARN `arn:aws:iam::606163772198:user/admin`.
- AWS Budget `VTrips-Demo-Budget` exists at 5 USD/month with ACTUAL and FORECASTED notifications at 50%, 80%, and 100%.
- Read-only discovery found no existing VTrips app resources.
- AWS Budget notification email is configured in AWS account, not stored in repository.
- App resources were not deployed.
- Prepared target stack name: `vtrips-demo`.
- Prepared target services: S3, CloudFront `PriceClass_100`, API Gateway HTTP API, Lambda `nodejs22.x`, DynamoDB on-demand, IAM, and CloudWatch Logs.
- Prepared deploy script now validates local build, local Lambda smoke test, and AWS Budget before CloudFormation, then checks `/api/health`, `/api/saved`, and `/api/bookings` after deployment.

## Post-Implementation Audit Update
- README local run was verified with `npm.cmd install` and `npm.cmd run dev`.
- Build and API smoke test were rerun after audit fixes.
- Mobile screenshot was refreshed after the nav clipping fix.
- Microservices-ready notes were added in `docs/architecture/microservices-ready-architecture.md`.
- `docs/workshop/` remains app reference material only; the main Workshop Link website belongs in `../vtrips-workshop`.
