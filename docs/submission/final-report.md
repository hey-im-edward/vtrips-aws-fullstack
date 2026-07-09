# V-Trips Final Report

## Summary
V-Trips is a fullstack travel product demo with a React/Vite frontend, Node.js/TypeScript backend, local JSON persistence, and a deployed cost-safe AWS-SAFE-1 production demo stack.

## Public links
- App GitHub repo: `https://github.com/hey-im-edward/vtrips-aws-fullstack`
- Workshop repo: `https://github.com/hey-im-edward/aws-fcj-workshop`
- Workshop URL: `https://hey-im-edward.github.io/aws-fcj-workshop/`
- App production HTTPS URL: `https://d3jokdtkqozo6v.cloudfront.net`
- API production HTTPS URL: `https://i00w4birlk.execute-api.ap-southeast-1.amazonaws.com`

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

## AWS production demo
Follow `docs/deployment/aws-production-deploy.md` for deploy/update details. AWS-SAFE-1 deployed stack `vtrips-demo` in `ap-southeast-1`.

Redeploy/update command:

```powershell
.\infra\aws\deploy.ps1 -Region ap-southeast-1 -StackName vtrips-demo
```

Cleanup command after the demo:

```powershell
.\infra\aws\cleanup.ps1 -Region ap-southeast-1 -StackName vtrips-demo -ConfirmCleanup
```

## What is working
- Local frontend/backend build.
- Local API routes and JSON persistence.
- Core UI screens and workflows listed in `GOAL.md`.
- App-local technical and submission docs.
- Cost-safe AWS stack deployed with S3, CloudFront, API Gateway HTTP API, Lambda, DynamoDB, IAM, and CloudWatch Logs.
- Deploy guardrails: pre-CloudFormation build/test, AWS Budget verification, CloudFront `PriceClass_100`, and post-deploy API checks.

## What is prototype/fallback
- Demo auth instead of Cognito.
- Rule-based AI instead of Bedrock.
- Browser print HTML instead of native PDF generation.
- Cognito, Bedrock, RDS, OpenSearch, WAF, NAT Gateway, EC2, Elastic Beanstalk, and custom KMS keys are not part of the demo stack.

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
- AWS-SAFE-1 production verification passed for `/api/health`, `/api/saved`, `/api/bookings`, CloudFront HTTP 200, and production screenshot `docs/submission/screenshots/vtrips-production-cloudfront.png`.

## Risks
- Official FCAJ/HUTECH rules were not fully verifiable from public links in the source report.
- Remote Unsplash images require network access for best visual demo.
- Cognito, Bedrock, RDS/OpenSearch/WAF, and production-grade auth/search remain future implementation.
- Current architecture is microservices-ready modular monolith, not real production microservices.
- AWS Budget is a cost alert, not an automatic spending brake.
- Cleanup is mandatory after the demo if ongoing AWS costs should stop.

## What user must do before submission
- Run the local demo and capture final screenshots.
- Use the production CloudFront URL for demo/submission evidence.
- Run cleanup after demo if the AWS production URL is no longer needed.
- Keep the final Workshop Link website in `../vtrips-workshop`.

## AWS-SAFE-0 Update
- AWS CLI executable found at the standard AWS CLI v2 install path.
- AWS region configuration is `ap-southeast-1`.
- AWS identity verified for account `606163772198` with non-root ARN `arn:aws:iam::606163772198:user/admin`.
- AWS Budget `VTrips-Demo-Budget` exists at 5 USD/month with ACTUAL and FORECASTED notifications at 50%, 80%, and 100%.
- Read-only discovery found no existing VTrips app resources.
- AWS Budget notification email is configured in AWS account, not stored in repository.
- At AWS-SAFE-0 time, app resources were not deployed.
- Prepared target stack name: `vtrips-demo`.
- Prepared target services: S3, CloudFront `PriceClass_100`, API Gateway HTTP API, Lambda `nodejs22.x`, DynamoDB on-demand, IAM, and CloudWatch Logs.
- Prepared deploy script now validates local build, local Lambda smoke test, and AWS Budget before CloudFormation, then checks `/api/health`, `/api/saved`, and `/api/bookings` after deployment.

## AWS-SAFE-1 Deployment Update
- Stack `vtrips-demo` deployed in `ap-southeast-1`.
- CloudFormation status: `CREATE_COMPLETE`.
- CloudFront distribution `E1OJWPSPR0QY0E` status: `Deployed`.
- App production HTTPS URL: `https://d3jokdtkqozo6v.cloudfront.net`.
- API production HTTPS URL: `https://i00w4birlk.execute-api.ap-southeast-1.amazonaws.com`.
- Verified production API endpoints: `/api/health`, `/api/saved`, `/api/bookings`.
- Captured production screenshot: `docs/submission/screenshots/vtrips-production-cloudfront.png`.
- Cleanup command: `.\infra\aws\cleanup.ps1 -Region ap-southeast-1 -StackName vtrips-demo -ConfirmCleanup`.

## Post-Implementation Audit Update
- README local run was verified with `npm.cmd install` and `npm.cmd run dev`.
- Build and API smoke test were rerun after audit fixes.
- Mobile screenshot was refreshed after the nav clipping fix.
- Microservices-ready notes were added in `docs/architecture/microservices-ready-architecture.md`.
- `docs/workshop/` remains app reference material only; the main Workshop Link website belongs in `../vtrips-workshop`.
