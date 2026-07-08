# V-Trips Test Plan

## Automated Checks
- `npm.cmd run build`: TypeScript and frontend production build.
- `node scripts/smoke-api.mjs`: backend health check after backend is running.

## Manual Functional Scenarios
1. Open `http://127.0.0.1:5173`.
2. Confirm place discovery loads cards from `/api/places`.
3. Search/filter by city/category/budget.
4. Select a place and inspect detail panel.
5. Save a place and confirm saved tab updates.
6. Add a review and confirm rating/review list updates.
7. Create a booking request.
8. Create a trip with a day itinerary.
9. Open export action and use browser Print -> Save as PDF.
10. Generate AI trip ideas and confirm fallback mode is visible.
11. Review business dashboard metrics.
12. Review admin dashboard metrics.

## Visual QA
- Desktop viewport: `1440x1000`.
- Mobile viewport: `390x844`.
- Capture screenshots into `docs/submission/screenshots/`.
- Inspect for overlap, clipped text, unreadable controls, broken imagery, and weak spacing.
- Implemented app tabs can be opened directly for QA with URL hashes: `#trips`, `#saved`, `#business`, and `#admin`.

## Known Prototype/Fallback Areas
- Demo auth instead of Cognito.
- Rule-based AI instead of Bedrock.
- Print-ready HTML instead of native PDF generator.
- Local JSON persistence instead of DynamoDB.
