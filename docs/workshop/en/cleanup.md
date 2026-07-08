# V-Trips App Cleanup Reference

Only clean up after user approval because this can delete AWS resources.

## Checklist
- Disable/delete CloudFront distribution if no submission link depends on it.
- Empty and delete S3 buckets.
- Delete API Gateway.
- Delete Lambda functions.
- Delete DynamoDB tables if retention is not required.
- Delete Cognito User Pool if created.
- Delete CloudWatch log groups and IAM roles that belong only to this project.
