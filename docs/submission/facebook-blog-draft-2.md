# Facebook Blog Draft 2 - AWS Architecture

Our V-Trips project uses a serverless-first AWS architecture direction. The local demo is built as a modular monolith to move fast, but the service boundaries are clear: Auth/User, Listing/Place, Review/Rating, Trip Planner, Social, Booking, Business/Admin, Export PDF, and AI Suggestion.

The deployment target is:
- S3 for frontend/static assets and media.
- CloudFront for HTTPS/CDN.
- API Gateway for HTTP APIs.
- Lambda for backend modules.
- DynamoDB for app data.
- Cognito-ready auth.
- CloudWatch for monitoring.
- IAM least privilege.

For CloudFront/HTTPS, the default CloudFront domain is enough for the deadline demo. A custom domain with ACM can be added later if the domain is ready. The safer S3 setup is CloudFront with a standard S3 bucket origin and OAC.

This approach helps us show enough AWS coverage without overbuilding production microservices during a short submission window.
