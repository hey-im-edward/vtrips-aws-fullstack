# V-Trips AWS Fullstack

V-Trips is a full-scoring demo target for an AWS FCAJ/HUTECH internship submission. It is a travel planning and place discovery product with a React/Vite frontend, a Node.js/TypeScript backend, local JSON persistence, and AWS-ready documentation.

The FCJ-style Workshop Link website is intentionally split into `../vtrips-workshop`. This repo contains the main app, local demo, technical docs, submission docs, and workshop reference material that the workshop repo can link to.

## Public Links
- App GitHub repo: `https://github.com/hey-im-edward/vtrips-aws-fullstack`
- Workshop repo: `https://github.com/hey-im-edward/aws-fcj-workshop`
- Workshop URL: `https://hey-im-edward.github.io/aws-fcj-workshop/`
- App production HTTPS URL: `https://d3jokdtkqozo6v.cloudfront.net`
- API production HTTPS URL: `https://i00w4birlk.execute-api.ap-southeast-1.amazonaws.com`

## Implemented
- Local React + Vite + TypeScript frontend in `frontend/`.
- Local Node.js + TypeScript API in `backend/`.
- JSON-backed persistence at runtime in `backend/data/runtime-db.json`.
- Working slices for place discovery, place detail, create/edit place, saved places, reviews, trip list/detail, create trip, booking request, business dashboard, admin dashboard, export action, AI suggestion fallback, profile/demo auth.
- App-local AWS architecture, API, deploy, cleanup, testing, submission, and blog docs.

## Prototype/Fallback
- Auth is demo auth with a Cognito-ready contract, not a real Cognito user pool.
- AI suggestion is deterministic rule-based fallback, not Bedrock.
- Export PDF uses a print-ready HTML page and browser Print -> Save as PDF.
- AWS-SAFE-1 deployed the cost-safe production demo stack.
- Budget is a cost alert, not an automatic spending brake.

## Future Work
- Real Cognito hosted UI and social login.
- Bedrock-backed itinerary suggestions.
- Production DynamoDB single-table design and Lambda deployment package.
- Advanced moderation/reporting, claim listing, realtime chat, and payment/booking lifecycle.
- CI/CD and automated cloud environment provisioning.

## Local Run

```powershell
cd D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack
npm.cmd install
npm.cmd run dev
```

Open:
- Frontend: `http://127.0.0.1:5173`
- Backend health: `http://127.0.0.1:8787/api/health`

Run production build:

```powershell
npm.cmd run build
```

Run API smoke check after starting the backend:

```powershell
node scripts/smoke-api.mjs
```

## AWS Target Architecture
- S3 for frontend/static assets.
- CloudFront for HTTPS/CDN with default CloudFront domain acceptable for deadline.
- CloudFront `PriceClass_100` for the cost-safe demo; `PriceClass_200` can be considered later if APAC latency matters more than cost.
- API Gateway for HTTP API entrypoint.
- Lambda `nodejs22.x` for backend handler.
- DynamoDB on-demand for demo app state.
- CloudWatch Logs for Lambda logs.
- IAM least privilege.

Excluded from the cost-safe demo stack unless explicitly approved later: Bedrock, OpenSearch, RDS, WAF, NAT Gateway, EC2, Elastic Beanstalk, Cognito, and custom KMS keys.

See [AWS architecture](docs/architecture/aws-architecture.md), [production deploy guide](docs/deployment/aws-production-deploy.md), [production outputs](docs/deployment/aws-production-outputs.md), and [cleanup guide](docs/deployment/cleanup-guide.md).
For the future split path, see [microservices-ready architecture](docs/architecture/microservices-ready-architecture.md).

## AWS-SAFE-1 Production Demo

The cost-safe production demo stack is deployed in AWS:

- Stack: `vtrips-demo`
- Region: `ap-southeast-1`
- Services: S3, CloudFront, API Gateway HTTP API, Lambda, DynamoDB, IAM, and CloudWatch Logs.
- Not deployed: Cognito, Bedrock, RDS, OpenSearch, WAF, NAT Gateway, EC2, Elastic Beanstalk, or custom KMS keys.

Redeploy/update command:

```powershell
.\infra\aws\deploy.ps1 -Region ap-southeast-1 -StackName vtrips-demo
```

Cleanup command after the demo:

```powershell
.\infra\aws\cleanup.ps1 -Region ap-southeast-1 -StackName vtrips-demo -ConfirmCleanup
```

AWS Budget notification email is configured in AWS account, not stored in repository.
Cleanup should be run after the demo if you want to stop ongoing costs.

## Documentation Map
- API: `docs/api/endpoints.md`
- Testing: `docs/testing/test-plan.md`
- Submission checklist: `docs/submission/submission-checklist.md`
- Final report: `docs/submission/final-report.md`
- Blog drafts: `docs/submission/facebook-blog-draft-*.md`
- Workshop reference docs for separate workshop repo: `docs/workshop/`
- Cost-safe AWS infra preparation: `infra/aws/`
