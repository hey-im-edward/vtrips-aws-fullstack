# AWS Architecture - V-Trips

## Summary

V-Trips is implemented locally as a modular monolith/serverless-style demo and prepared for a cost-safe AWS stack. Stage AWS-SAFE-0 prepares infrastructure artifacts but does not deploy app resources.

## Cost-Safe Target Services

- S3: private frontend build assets.
- CloudFront: HTTPS/CDN with Origin Access Control and explicit `PriceClass_100` for cost control.
- API Gateway HTTP API: public API entrypoint.
- Lambda: `nodejs22.x` demo API handler.
- DynamoDB: PAY_PER_REQUEST demo state table.
- CloudWatch Logs: Lambda logs with short retention.
- IAM: least-privilege execution role and CloudFront access policy.

Excluded unless explicitly approved later: Bedrock, OpenSearch, RDS, WAF, NAT Gateway, EC2, Elastic Beanstalk, Cognito, and custom KMS keys.

## Service Boundaries

- Auth/User: demo auth/profile only; Cognito is a future extension, not part of the cost-safe stack.
- Listing/Place: place discovery, detail, create/edit, save/like.
- Review/Rating: review list/form and rating recalculation.
- Trip Planner: trip list, detail, day itinerary, create/edit.
- Booking: booking request state.
- Business/Admin: owner/admin dashboard summaries.
- Export PDF: print-ready trip export fallback.
- AI Suggestion: deterministic fallback; Bedrock is future work.

## CloudFront/HTTPS Strategy

- Use the default CloudFront domain for HTTPS during the demo.
- Keep the S3 frontend bucket private.
- Use CloudFront Origin Access Control rather than public S3 website hosting.
- Use `PriceClass_100` for the demo to reduce CloudFront cost exposure; `PriceClass_200` is a later option if APAC latency becomes more important than cost.
- Custom domain + ACM is future work only if explicitly approved.

## Local-to-AWS Mapping

| Local Component | AWS Target |
|---|---|
| `frontend/dist` | Private S3 bucket behind CloudFront |
| `infra/aws/lambda/index.mjs` | Lambda `nodejs22.x` handler |
| `/api/*` routes | API Gateway HTTP API |
| `backend/data/runtime-db.json` | DynamoDB PAY_PER_REQUEST table |
| Demo auth token | Demo-only Lambda response |
| Export HTML | Lambda-generated response |
| Console logs | CloudWatch Logs |

## Tags

All app resources that support tags must use:

- `Project=VTrips`
- `Owner=hey-im-edward`
- `Environment=demo`

## Honest Status

- Working locally: frontend, backend, local persistence, core demo workflows.
- Prepared in AWS-SAFE-0: CloudFormation template, Lambda handler, guarded deploy script, guarded cleanup script, and production outputs placeholder.
- Future deploy guardrails: local build, local Lambda smoke test, AWS Budget verification, CloudFront `PriceClass_100`, and post-deploy API checks.
- Not deployed yet: S3, CloudFront, API Gateway, Lambda, DynamoDB, IAM role, and CloudWatch Logs app resources.

For the service split path, see `docs/architecture/microservices-ready-architecture.md`.
