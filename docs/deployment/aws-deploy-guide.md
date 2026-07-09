# AWS Deploy Guide

This compatibility guide points to the current production deployment guardrail document:

- `docs/deployment/aws-production-deploy.md`

Stage AWS-SAFE-1 deployed the approved cost-safe production demo stack.

Redeploy/update command:

```powershell
cd D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack
.\infra\aws\deploy.ps1 -Region ap-southeast-1 -StackName vtrips-demo
```

The deploy script now refuses unsafe identity/region, verifies AWS Budget `VTrips-Demo-Budget` at 5 USD/month before CloudFormation, runs local build and Lambda smoke validation before creating app resources, uses CloudFront `PriceClass_100`, and performs post-deploy checks for `/api/health`, `/api/saved`, and `/api/bookings`.

Current URLs:

- App production HTTPS URL: `https://d3jokdtkqozo6v.cloudfront.net`
- API production HTTPS URL: `https://i00w4birlk.execute-api.ap-southeast-1.amazonaws.com`

Mandatory cleanup command after any approved demo deployment:

```powershell
.\infra\aws\cleanup.ps1 -Region ap-southeast-1 -StackName vtrips-demo -ConfirmCleanup
```
