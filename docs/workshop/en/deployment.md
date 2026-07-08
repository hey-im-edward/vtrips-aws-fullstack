# V-Trips App Deployment Reference

The main workshop website lives in `../vtrips-workshop`. This file only records app deployment steps that the workshop repo can reference.

## Local
```powershell
npm.cmd install
npm.cmd run dev
```

## AWS target
1. Build frontend/backend with `npm.cmd run build`.
2. Upload `frontend/dist` to S3.
3. Put CloudFront in front of S3 with the default HTTPS domain.
4. Deploy `backend/dist` to Lambda after replacing JSON persistence with DynamoDB.
5. Create API Gateway routes matching `docs/api/endpoints.md`.
6. Add Cognito when ready.
