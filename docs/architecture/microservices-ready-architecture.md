# Microservices-Ready Architecture

## Summary

V-Trips remains a modular monolith for the demo. The AWS-SAFE-0 deployment preparation uses one Lambda handler and one DynamoDB PAY_PER_REQUEST table to keep cost and operational risk low.

## Why Not Real Microservices Now

- The cost-safe demo avoids always-on services and distributed-system overhead.
- One Lambda handler is enough to prove the API and AWS path.
- DynamoDB PAY_PER_REQUEST avoids capacity planning for a small demo.
- CloudFront `PriceClass_100` keeps the static frontend CDN cost posture explicit for the demo.
- Cognito, Bedrock, OpenSearch, RDS, queues, and EventBridge are future extensions only after the base demo is accepted.

## Service Boundaries

| Boundary | Current local capability | Cost-safe AWS target |
|---|---|---|
| Auth/User | Demo login, profile read/update | Demo auth response in Lambda |
| Listing/Place | Search/filter, detail, create/edit, save/like | Lambda route + DynamoDB item |
| Review/Rating | Review list/form, rating recalculation | Lambda route + DynamoDB item |
| Trip Planner | Trip list/detail, day itinerary, create/edit | Lambda route + DynamoDB item |
| Social | Saved places and like count | Lambda route + profile/place update |
| Booking | Booking request create/list | Lambda route + DynamoDB item |
| Business/Admin | Summary dashboards | Lambda read model |
| Export PDF | Print-ready trip export fallback | Lambda-generated HTML response |
| AI Suggestion | Deterministic fallback ideas | Lambda rule-based response |

## Future Split Plan

1. Keep the API contract stable.
2. Move from demo single-table JSON-shaped items to a production DynamoDB design only after the demo is accepted.
3. Split route groups into separate Lambda functions only if operational value outweighs complexity.
4. Add Cognito, Bedrock, queues/EventBridge, or search only after explicit approval.
5. Keep cleanup mandatory after demos.

## Guardrail

Current state is serverless-ready and cost-safe, not production microservices.
