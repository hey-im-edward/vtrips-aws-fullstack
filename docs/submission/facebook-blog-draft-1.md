# Facebook Blog Draft 1 - V-Trips Overview

V-Trips is our AWS fullstack travel demo built for the FCAJ/HUTECH internship submission. The idea is a lighter TripAdvisor-style product where travelers can discover trusted local places, build day-by-day itineraries, save places, write reviews, request bookings, and export a trip plan.

For the deadline, we focused on a working local demo first. The app includes a React/Vite frontend, a Node.js/TypeScript backend, JSON persistence, sample travel data, and a polished travel UI. The backend exposes module-based APIs for places, trips, reviews, bookings, dashboards, export, and AI suggestion fallback.

The AWS target architecture is serverless-first: S3 and CloudFront for the frontend, API Gateway and Lambda for backend APIs, DynamoDB for data, Cognito-ready authentication, CloudWatch for logs/metrics, and IAM least privilege.

Some features are intentionally marked as prototype/fallback: Cognito is not wired yet, AI uses deterministic fallback instead of Bedrock, and PDF export uses browser Print -> Save as PDF. This keeps the demo honest while showing a clear production path.
