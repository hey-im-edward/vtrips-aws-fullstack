# V-Trips App Overview

File này là tài liệu tham chiếu cho workshop repo riêng `../vtrips-workshop`, không phải website workshop chính trong repo app.

## Mục tiêu
V-Trips là demo fullstack du lịch: tìm địa điểm, lập lịch trình, review, lưu địa điểm, booking request, dashboard business/admin, export trip, và AI suggestion fallback.

## Kiến trúc
- Frontend: React + Vite + TypeScript.
- Backend: Node.js + TypeScript API.
- Local persistence: JSON runtime DB.
- AWS target: S3, CloudFront, API Gateway, Lambda, DynamoDB, Cognito, CloudWatch, IAM.

## Trạng thái
- Working locally: app frontend/backend và các flow chính.
- Prototype/fallback: Cognito, Bedrock, PDF native, deploy AWS.
