# AWS Cleanup Guide

Cleanup is mandatory after any approved V-Trips AWS demo deployment. Do not run cleanup automatically.

## Command

```powershell
cd D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack
.\infra\aws\cleanup.ps1 -Region ap-southeast-1 -StackName vtrips-demo -ConfirmCleanup
```

The script refuses to run without `-ConfirmCleanup`, wrong account, root identity, or wrong region.
If `deploy.ps1` fails after CloudFormation resource creation may have started, it prints this cleanup command with stack name and region. Cleanup is still manual and must not run automatically.

Equivalent command without the `cd` line:

```powershell
.\infra\aws\cleanup.ps1 -Region ap-southeast-1 -StackName vtrips-demo -ConfirmCleanup
```

## Cleanup Order

1. Empty the frontend S3 bucket.
2. Empty a media bucket only if a future stack output includes one.
3. Delete CloudFormation stack `vtrips-demo`.
4. Wait for CloudFront to disable/delete; this can take time because CloudFront propagates globally.
5. Confirm S3, CloudFront, API Gateway, Lambda, DynamoDB, IAM role, and CloudWatch log group are gone.
6. Review AWS Billing and Cost Explorer after cleanup.

## Safety Notes

- Never use AWS root credentials for routine cleanup.
- Do not delete shared IAM roles, shared buckets, shared log groups, or resources outside stack `vtrips-demo`.
- Capture screenshots/evidence before cleanup if needed for submission.
- AWS Budget notification email is configured in AWS account, not stored in repository.
- AWS Budget is a cost alert, not an automatic spending brake.
- Keep cleanup scoped to stack `vtrips-demo`; do not delete unrelated AWS resources.
