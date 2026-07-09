# Submission Checklist

## Product Demo
- [x] Local app has frontend and backend.
- [x] Place discovery/search/filter.
- [x] Place detail.
- [x] Create/Edit place flow.
- [x] Trip list/detail/day itinerary.
- [x] Create/Edit trip flow.
- [x] Saved places.
- [x] Review list/form.
- [x] Profile/demo auth.
- [x] Booking request basic.
- [x] Business dashboard basic.
- [x] Admin dashboard basic.
- [x] Export PDF basic via print-ready page.
- [x] AI suggestion fallback.

## Docs
- [x] README.
- [x] AWS architecture doc.
- [x] Mermaid architecture diagram source.
- [x] API endpoint docs.
- [x] AWS deploy guide.
- [x] AWS production deploy guardrail guide.
- [x] AWS cleanup guide.
- [x] Cost-safe AWS-SAFE-0 infra artifacts.
- [x] AWS production outputs placeholder.
- [x] Test plan.
- [x] Three Facebook blog drafts.
- [x] Final report.
- [x] Workshop reference docs for `../vtrips-workshop`.

## Before Submission
- [x] Run `npm.cmd run build`.
- [x] Start backend and verify `/api/health`.
- [x] Capture desktop, mobile, trips, saved, business, and admin screenshots.
- [x] Run secret pattern scan for common AWS/key/password patterns.
- [x] Create/push GitHub repo approved for Stage G0.
- [x] Prepare guarded deploy and cleanup commands.
- [x] Prepare pre-CloudFormation build/test and Budget guard in deploy script.
- [x] Verify AWS identity before Budget/resource checks.
- [x] Create/check AWS Budget `VTrips-Demo-Budget` after AWS identity is verified.
- [x] Run read-only discovery for existing VTrips app resources.
- [ ] Ask user before any app AWS deploy.
- [ ] Run cleanup after any approved demo deploy.

## Public Links
- App GitHub repo: `https://github.com/hey-im-edward/vtrips-aws-fullstack`
- Workshop repo: `https://github.com/hey-im-edward/aws-fcj-workshop`
- Workshop URL: `https://hey-im-edward.github.io/aws-fcj-workshop/`
- App production HTTPS URL: `TODO CloudFront URL`

## AWS-SAFE-0 Status
- Production AWS deployment is prepared but not yet deployed.
- AWS identity verified for account `606163772198` with non-root ARN.
- AWS Budget `VTrips-Demo-Budget` is configured at 5 USD/month.
- Read-only discovery found no existing VTrips app stack/resources.
- Target real services: S3, CloudFront, API Gateway HTTP API, Lambda, DynamoDB on-demand, IAM, and CloudWatch Logs.
- CloudFront target uses `PriceClass_100` for cost control.
- Future deploy script checks `/api/health`, `/api/saved`, and `/api/bookings` after deployment.
- Bedrock, OpenSearch, RDS, WAF, NAT Gateway, EC2, Elastic Beanstalk, Cognito, and custom KMS keys are future extensions only.
- AWS Budget notification email is configured in AWS account, not stored in repository.
