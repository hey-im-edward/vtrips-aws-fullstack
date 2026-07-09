# Infra Notes

This folder contains cost-safe AWS deployment preparation for V-Trips.

## AWS-SAFE-1 Status

- App deployment resources are deployed in AWS for the cost-safe production demo.
- Stack: `vtrips-demo`.
- Region: `ap-southeast-1`.
- App URL: `https://d3jokdtkqozo6v.cloudfront.net`.
- API URL: `https://i00w4birlk.execute-api.ap-southeast-1.amazonaws.com`.
- AWS-SAFE-0 only allowed Budget creation/check; AWS-SAFE-1 deployed the approved cost-safe stack.
- AWS Budget notification email is configured in AWS account, not stored in repository.
- AWS Budget is a cost alert, not an automatic spending brake.
- Run cleanup after the demo if you want to stop ongoing costs.

## Prepared Artifacts

- `aws/cloudformation.yml`: future `vtrips-demo` stack for S3, CloudFront `PriceClass_100`, API Gateway HTTP API, Lambda, DynamoDB on-demand, IAM, and CloudWatch Logs.
- `aws/lambda/index.mjs`: Lambda handler for the cost-safe demo API.
- `aws/test-lambda.mjs`: local in-memory Lambda smoke test.
- `aws/deploy.ps1`: guarded deploy/update script; it verifies Budget, build, and Lambda smoke checks before CloudFormation.
- `aws/cleanup.ps1`: guarded cleanup script that requires `-ConfirmCleanup`.

Cleanup command:

```powershell
.\infra\aws\cleanup.ps1 -Region ap-southeast-1 -StackName vtrips-demo -ConfirmCleanup
```
