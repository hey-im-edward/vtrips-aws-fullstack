# V-Trips API Endpoints

Base URL for local demo: `http://127.0.0.1:8787`

## Health/Auth/Profile
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Service status and AWS target summary |
| POST | `/api/auth/demo-login` | Demo auth token and Cognito-ready user shape |
| GET | `/api/profile` | Current demo profile |
| PATCH | `/api/profile` | Update profile fields |

## Places
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/places?search=&category=&budget=` | Search/filter place listing |
| GET | `/api/places/:id` | Place detail |
| POST | `/api/places` | Create place draft |
| PUT | `/api/places/:id` | Edit place basics |
| POST | `/api/places/:id/save` | Save/like place |
| GET | `/api/saved` | Saved places |

## Trips/Reviews/Bookings
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/trips` | Trip list |
| GET | `/api/trips/:id` | Trip detail/day itinerary |
| POST | `/api/trips` | Create trip |
| PUT | `/api/trips/:id` | Edit trip basics |
| GET | `/api/reviews?placeId=` | Review list |
| POST | `/api/reviews` | Create review and recalculate place rating |
| GET | `/api/bookings` | Booking requests |
| POST | `/api/bookings` | Create booking request |

## Dashboards/Export/AI
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/business/summary` | Business owner dashboard metrics |
| GET | `/api/admin/summary` | Admin moderation/readiness metrics |
| POST | `/api/ai/suggestions` | Rule-based AI suggestion fallback |
| GET | `/api/export/trips/:id` | Print-ready itinerary export page |

## Validation Notes
- JSON payloads are parsed server-side.
- Required fields are validated for create flows.
- Demo auth and AI are explicitly prototype/fallback, not production services.
