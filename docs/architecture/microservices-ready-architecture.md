# Microservices-Ready Architecture

## Summary
V-Trips is intentionally implemented as a modular monolith for the demo, but the current modules are drawn as service boundaries so the codebase can be split into serverless services later. This keeps the local submission demo reliable while still showing a credible production architecture path.

## Why Modular Monolith for the Demo
- The deadline favors a working local product over distributed-system complexity.
- One backend process avoids premature network boundaries, deployment coordination, and cross-service debugging.
- Shared JSON persistence is acceptable for local proof of workflow, while the API/docs make the AWS migration path explicit.
- The implementation still separates domain capabilities by route group and data shape, which preserves the future split path.

## Service Boundaries
| Boundary | Current local capability | Future service responsibility |
|---|---|---|
| Auth/User | Demo login, profile read/update | Cognito integration, user profile service, JWT validation |
| Listing/Place | Search/filter, detail, create/edit, save/like | Place catalog service, owner listing workflow |
| Review/Rating | Review list/form, rating recalculation | Review moderation, rating aggregation, report workflow |
| Trip Planner | Trip list/detail, day itinerary, create/edit | Itinerary planning, trip sharing, export orchestration |
| Social | Saved places and like count | Save/like/comment activity service |
| Booking | Booking request create/list | Booking state machine and owner response workflow |
| Business/Admin | Summary dashboards | Owner analytics, moderation queues, admin controls |
| Export PDF | Print-ready trip export fallback | Lambda export renderer writing files to S3 |
| AI Suggestion | Deterministic fallback ideas | Bedrock-backed itinerary suggestions |

## Future Split Plan
1. Keep current API contract stable and add module-level handler files under each boundary.
2. Move persistence from `backend/data/runtime-db.json` to DynamoDB tables or a single-table design.
3. Extract stateless handlers boundary-by-boundary into Lambda functions behind API Gateway.
4. Move cross-boundary events such as review-created, booking-requested, and listing-approved to EventBridge or queues only after the core demo path is stable.
5. Add CI/CD, least-privilege IAM, CloudWatch alarms, and cleanup automation after the local app and docs are accepted.

## AWS Mapping
| Current module/route group | API Gateway route pattern | Lambda target | DynamoDB target |
|---|---|---|---|
| Auth/User | `/api/auth/*`, `/api/profile` | `authUserHandler` | `Users`, `Sessions` or Cognito claims |
| Listing/Place | `/api/places*`, `/api/saved` | `listingPlaceHandler` | `Places`, `SavedPlaces` |
| Review/Rating | `/api/reviews*` | `reviewRatingHandler` | `Reviews`, aggregate fields on `Places` |
| Trip Planner | `/api/trips*` | `tripPlannerHandler` | `Trips`, `TripDays` |
| Social | `/api/places/:id/save` | `socialActivityHandler` | `SavedPlaces`, `Activity` |
| Booking | `/api/bookings*` | `bookingHandler` | `Bookings` |
| Business/Admin | `/api/business/*`, `/api/admin/*` | `dashboardHandler` | Query/index reads across domain tables |
| Export PDF | `/api/export/trips/:id` | `exportHandler` | `Trips`, S3 export object metadata |
| AI Suggestion | `/api/ai/suggestions` | `aiSuggestionHandler` | Optional prompt/result cache |

## Demo vs Production Guardrail
- Do not split into real microservices during the current demo stage.
- Do not introduce Redis, OpenSearch, queues, or EventBridge until the local demo and submission docs are stable.
- Keep documentation honest: current state is modular monolith/serverless-ready, not production microservices.
