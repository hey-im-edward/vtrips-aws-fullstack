# Decisions

## 2026-07-08 - Separate Workshop Website Repository

### Decision
- Build the FCJ-style Workshop Link / internship report website in `../vtrips-workshop`.
- Keep `vtrips-aws-fullstack` focused on the main app frontend/backend, AWS architecture, local demo, and technical/submission docs.
- Do not create another workshop repo from the app repo.

### Reason
- The FCAJ/HUTECH portal has a separate Workshop Link field, so the workshop/report site needs a clean repo/site boundary.

### Alternatives Rejected
- Building the main workshop website inside the app repo.
- Mixing Hugo workshop content with the V-Trips frontend/backend implementation repo.

### Impact
- App repo docs can be referenced by the workshop repo, but the workshop website itself lives in `../vtrips-workshop`.
- Future app Goal runs should not recreate workshop site scaffolding.

## 2026-07-08 - Architecture Direction

### Decision
- Use serverless-first modular architecture as the broad AWS direction.
- Broad future target services: S3, CloudFront, API Gateway, Lambda, DynamoDB, Cognito-ready auth, CloudWatch, and IAM least privilege.
- AWS-SAFE-0 narrows the real cost-safe demo stack and excludes Cognito until separately approved.

### Reason
- This fits the AWS FCAJ/HUTECH scoring goal and keeps the deployment story clear within the deadline.

### Alternatives Rejected
- Full production marketplace architecture in the first deadline window.
- Microservices-first implementation with Redis/OpenSearch/production CI/CD as mandatory scope.

### Impact
- Documentation and diagrams should explain serverless boundaries clearly.
- Implementation can remain lean while still mapping to AWS services.

## 2026-07-08 - Demo Implementation Shape

### Decision
- Implement the demo as a modular monolith/serverless-style module layout.
- Keep clear service boundaries for Auth/User, Listing/Place, Review/Rating, Trip Planner, Social, Booking, Business/Admin, Export PDF, and AI Suggestion.

### Reason
- This gives enough breadth for a full-scoring demo without overbuilding infrastructure under a 1-day deadline.

### Alternatives Rejected
- Production microservices as the first implementation.
- CRUD-only app without visible domain modules.

### Impact
- Frontend/backend can be built quickly while preserving a credible AWS migration/deploy path.

## 2026-07-08 - Execution Order

### Decision
- Prioritize a local working demo before GitHub creation or AWS deployment.
- Create GitHub later.
- Ask user before AWS deploy or any cost-impacting resource creation.

### Reason
- The submission needs a reliable product demo first, and AWS/account steps can block or create cost/security risk.

### Alternatives Rejected
- Creating GitHub/AWS resources during Stage V0.
- Blocking local product work on cloud credentials.

### Impact
- Stage V0 remains scaffold/docs only.
- Future Goal runs should pause for AWS credential/account actions.

## 2026-07-08 - UI Verification

### Decision
- UI quality must be verified with browser automation or screenshots when possible.

### Reason
- A compiled UI is not enough for a travel product demo; layout, spacing, states, and responsiveness need visual inspection.

### Alternatives Rejected
- Treating build success as proof of UI quality.

### Impact
- Future implementation should capture screenshots into `docs/submission/screenshots/` and inspect desktop/mobile views.

## 2026-07-09 - AWS-SAFE-0 Cost-Safe Deployment Preparation

### Decision
- Prepare a future stack named `vtrips-demo` but do not deploy app resources in AWS-SAFE-0.
- Use only S3, CloudFront, API Gateway HTTP API, Lambda, DynamoDB on-demand, IAM, and CloudWatch Logs for the cost-safe demo stack.
- Use Lambda runtime `nodejs22.x`.
- Keep AWS Budget notification email configured only in AWS account, not in repository files.
- Use CloudFront `PriceClass_100` for the cost-safe demo stack.
- Require local build, local Lambda smoke test, and AWS Budget verification before CloudFormation deploy.
- Require post-deploy API checks for `/api/health`, `/api/saved`, and `/api/bookings` before publishing frontend assets.

### Reason
- The stage objective is to reduce cost risk before any real deploy.
- `nodejs22.x` is the user-approved Lambda runtime for this demo.
- `PriceClass_100` limits the CloudFront cost posture for a short demo.
- Pre-resource validation avoids creating AWS resources when local code is already broken.

### Alternatives Rejected
- Deploying app resources before Budget/identity/resource checks complete.
- Adding Cognito, Bedrock, OpenSearch, RDS, WAF, NAT Gateway, EC2, Elastic Beanstalk, or custom KMS keys to the demo stack.

### Impact
- `infra/aws/deploy.ps1` is prepared but must not be run in AWS-SAFE-0.
- Cleanup remains mandatory after any later approved demo deploy.
- If future deploy fails after resource creation may have started, `deploy.ps1` reports stack name, region, and cleanup command but does not run cleanup automatically.
