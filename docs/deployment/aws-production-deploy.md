# AWS Production Deploy Guide

Stage AWS-SAFE-0 prepares deployment artifacts only. Do not deploy app resources until the user explicitly approves a later deploy stage.

## AWS-SAFE-0 Guardrails

- Expected account: `606163772198`.
- Expected IAM identity: non-root user/role.
- Region: `ap-southeast-1`.
- Stack name: `vtrips-demo`.
- AWS Budget name: `VTrips-Demo-Budget`.
- AWS Budget required limit: 5 USD/month, `COST`, `MONTHLY`.
- AWS Budget notification email is configured in AWS account, not stored in repository.
- CloudFront uses `PriceClass_100` for the cost-safe demo. `PriceClass_200` can be considered later if APAC latency matters more than cost.
- App resources are not deployed in AWS-SAFE-0.

## Allowed Demo Services

- S3 private frontend bucket.
- CloudFront with Origin Access Control, default HTTPS domain, and `PriceClass_100`.
- API Gateway HTTP API.
- Lambda `nodejs22.x`.
- DynamoDB PAY_PER_REQUEST.
- IAM least privilege.
- CloudWatch Logs.

Excluded unless explicitly approved later: Bedrock, OpenSearch, RDS, WAF, NAT Gateway, EC2, Elastic Beanstalk, Cognito, and custom KMS keys.

## Prepared Deploy Command

Do not run this command in AWS-SAFE-0. It is prepared for a later approved stage:

```powershell
cd D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack
.\infra\aws\deploy.ps1
```

The script will:

1. Resolve `aws.exe` from PATH or known AWS CLI v2 install paths.
2. Refuse wrong account, root identity, or wrong region.
3. Verify AWS Budget `VTrips-Demo-Budget` exists and is 5 USD/month.
4. Run `npm.cmd install` only if root `node_modules` is missing.
5. Run `npm.cmd run build` before CloudFormation.
6. Run `node infra/aws/test-lambda.mjs` before CloudFormation.
7. Build `infra/aws/lambda/index.mjs` into a Lambda zip.
8. Validate and deploy CloudFormation stack `vtrips-demo`.
9. Update Lambda code from the zip.
10. Rebuild frontend with `VITE_API_BASE_URL=<ApiUrl>`.
11. Verify `/api/health`, `/api/saved`, and `/api/bookings`.
12. Upload `frontend/dist` to the private S3 frontend bucket.
13. Invalidate CloudFront.
14. Save outputs to `infra/aws/outputs.json` and `docs/deployment/aws-production-outputs.md`.

If a failure happens after CloudFormation resource creation may have started, the script prints the stack name, region, and cleanup command. It does not run cleanup automatically.

## Cleanup Requirement

Cleanup is mandatory after any approved demo deployment:

```powershell
.\infra\aws\cleanup.ps1 -ConfirmCleanup
```

See `docs/deployment/cleanup-guide.md`.
