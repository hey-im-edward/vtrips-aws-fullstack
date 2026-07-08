# AWS Cleanup Guide

Run cleanup only after the demo/submission is complete and the user explicitly approves resource deletion.

## Order
1. Disable or delete CloudFront distribution after confirming no active submission link depends on it.
2. Empty S3 buckets for frontend/media/export artifacts.
3. Delete S3 buckets.
4. Delete API Gateway HTTP API.
5. Delete Lambda functions and versions.
6. Delete DynamoDB tables if no data retention is required.
7. Delete Cognito User Pool/app client if created.
8. Delete CloudWatch log groups if retention is not needed.
9. Delete IAM roles/policies created only for this project.

## Verification
- Confirm CloudFront distribution is gone or disabled.
- Confirm S3 buckets are deleted.
- Confirm Lambda/API Gateway/DynamoDB/Cognito resources no longer appear.
- Review AWS Billing and Cost Explorer after cleanup.

## Safety Notes
- Never use AWS root credentials for routine cleanup.
- Do not delete shared IAM roles, shared buckets, or shared log groups.
- Capture screenshots/evidence before cleanup if they are needed for submission.
