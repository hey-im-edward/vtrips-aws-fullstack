# AWS Deploy Guide

This guide is deploy-ready documentation only. Do not create AWS resources without explicit user approval.

## Prerequisites
- AWS account with non-root administrative user/role.
- AWS CLI configured locally.
- Node.js 20+.
- No secrets committed to the repo.

## Local Build
```powershell
npm.cmd install
npm.cmd run build
```

Frontend output: `frontend/dist`
Backend output: `backend/dist`

## Frontend: S3 + CloudFront
1. Create a private S3 bucket for the React build.
2. Upload `frontend/dist` contents.
3. Create CloudFront distribution using a standard S3 bucket origin.
4. Enable Origin Access Control (OAC) and restrict bucket access to CloudFront.
5. Use the default CloudFront domain for HTTPS unless custom domain + ACM is ready.
6. Configure SPA fallback to `index.html` for app routes if direct client routes are added later.

## Backend: API Gateway + Lambda
1. Package `backend/dist` plus runtime dependencies.
2. Create Lambda function for API handler modules.
3. Create API Gateway HTTP API routes matching `docs/api/endpoints.md`.
4. Configure CORS for the CloudFront frontend domain.
5. Replace local JSON persistence with DynamoDB access.

## Data: DynamoDB
Suggested tables for v1:
- `VTripsUsers`
- `VTripsPlaces`
- `VTripsTrips`
- `VTripsReviews`
- `VTripsBookings`
- `VTripsSavedPlaces`

For deadline demo, document table intent before implementing a production single-table design.

## Auth: Cognito-ready
1. Create Cognito User Pool.
2. Configure app client and callback URLs.
3. Replace demo token with Cognito JWT validation at API Gateway/Lambda.
4. Keep demo auth documented as prototype/fallback until real Cognito is wired.

## Monitoring
- Enable API Gateway access logs.
- Send Lambda logs to CloudWatch.
- Add basic alarms for Lambda errors and API 5xx.

## Rollback
- Keep previous frontend build in S3 or versioned bucket.
- Use Lambda versions/aliases for backend rollback.
- Do not delete resources during submission window unless cleanup is explicitly approved.
