# Infra Notes

This folder contains cost-safe AWS deployment preparation for V-Trips.

## AWS-SAFE-0 Status

- App deployment resources are prepared but not deployed.
- The only AWS mutation allowed in AWS-SAFE-0 is AWS Budget creation/check after identity preflight passes.
- AWS Budget notification email is configured in AWS account, not stored in repository.
- Do not run `infra/aws/deploy.ps1` until the user explicitly approves app deployment.

## Prepared Artifacts

- `aws/cloudformation.yml`: future `vtrips-demo` stack for S3, CloudFront `PriceClass_100`, API Gateway HTTP API, Lambda, DynamoDB on-demand, IAM, and CloudWatch Logs.
- `aws/lambda/index.mjs`: Lambda handler for the cost-safe demo API.
- `aws/test-lambda.mjs`: local in-memory Lambda smoke test.
- `aws/deploy.ps1`: guarded deploy script for the future approved deploy; it verifies Budget, build, and Lambda smoke checks before CloudFormation.
- `aws/cleanup.ps1`: guarded cleanup script that requires `-ConfirmCleanup`.
