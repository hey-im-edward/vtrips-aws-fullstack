# AWS Deploy Guide

This compatibility guide points to the current production deployment guardrail document:

- `docs/deployment/aws-production-deploy.md`

Stage AWS-SAFE-0 prepares deployment artifacts only. Do not deploy app resources until the user explicitly approves a later deploy stage.

Prepared command for a later approved stage:

```powershell
cd D:\elros\Documents\AI-LifeOS\repos\vtrips-aws-fullstack
.\infra\aws\deploy.ps1
```

The deploy script now refuses unsafe identity/region, verifies AWS Budget `VTrips-Demo-Budget` at 5 USD/month before CloudFormation, runs local build and Lambda smoke validation before creating app resources, uses CloudFront `PriceClass_100`, and performs post-deploy checks for `/api/health`, `/api/saved`, and `/api/bookings`.

Mandatory cleanup command after any approved demo deployment:

```powershell
.\infra\aws\cleanup.ps1 -ConfirmCleanup
```
