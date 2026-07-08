# AWS Architecture - V-Trips

## Summary
V-Trips is implemented locally as a modular monolith/serverless-style demo and documented as a serverless-first AWS architecture. The code keeps service boundaries clear so the backend can map to Lambda handlers and DynamoDB access patterns later.

## Service Boundaries
- Auth/User: demo login and profile now; Cognito-ready contract later.
- Listing/Place: place discovery, detail, create/edit, save/like.
- Review/Rating: review list/form and rating recalculation.
- Trip Planner: trip list, detail, day itinerary, create/edit.
- Social: saved places and like count.
- Booking: booking request state.
- Business/Admin: owner/admin dashboard summaries.
- Export PDF: print-ready trip export fallback.
- AI Suggestion: deterministic fallback, Bedrock later.

## Target AWS Services
- S3: frontend build artifacts, media files, exported itinerary artifacts.
- CloudFront: HTTPS/CDN in front of S3 and optionally `/api/*`.
- API Gateway: public HTTP API entrypoint.
- Lambda: backend module handlers.
- DynamoDB: users, places, trips, reviews, bookings, saved places.
- Cognito: authentication and identity.
- CloudWatch: Lambda/API logs, metrics, alarms.
- IAM: least-privilege execution roles and CloudFront OAC.

## CloudFront/HTTPS Strategy
- For the deadline demo, the default CloudFront domain is acceptable because it provides HTTPS.
- Custom domain + ACM is optional and should only be added if the domain/certificate is ready.
- Prefer CloudFront + standard S3 bucket origin + OAC over S3 website endpoint when deploying the frontend.

## Local-to-AWS Mapping
| Local Component | AWS Target |
|---|---|
| `frontend/dist` | S3 bucket behind CloudFront |
| Node API modules | Lambda handlers |
| `/api/*` routes | API Gateway routes |
| `backend/data/runtime-db.json` | DynamoDB tables |
| Demo auth token | Cognito User Pool JWT |
| Export HTML | S3 object or Lambda-generated response |
| Console logs | CloudWatch Logs |

## Honest Status
- Working locally: frontend, backend, local persistence, core demo workflows.
- Prototype/fallback: Cognito, Bedrock, production PDF, AWS deployment.
- Future work: production IAM policies, DynamoDB schema, CI/CD, monitoring alarms, and real cleanup automation.
