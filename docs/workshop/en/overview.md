# V-Trips App Overview

This is reference material for the separate workshop repo `../vtrips-workshop`. It is not the main workshop website.

## Goal
V-Trips is a travel fullstack demo for place discovery, trip planning, reviews, saved places, booking requests, business/admin dashboards, trip export, and AI suggestion fallback.

## Architecture
- Frontend: React + Vite + TypeScript.
- Backend: Node.js + TypeScript API.
- Local persistence: JSON runtime DB.
- AWS target: S3, CloudFront, API Gateway, Lambda, DynamoDB, Cognito, CloudWatch, IAM.

## Status
- Working locally: frontend/backend app and core workflows.
- Prototype/fallback: Cognito, Bedrock, native PDF, AWS deployment.
