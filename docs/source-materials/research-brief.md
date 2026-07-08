# Research Brief - V-Trips AWS Fullstack

## Deadline Context
Project nộp thực tập AWS FCAJ/HUTECH, deadline còn khoảng 1 ngày. Mục tiêu là full-scoring demo: có sản phẩm chạy được, giao diện chỉnh chu, backend/API rõ, kiến trúc AWS, workshop, blog, diagram, deploy guide, cleanup guide.

## Product
V-Trips là nền tảng du lịch kiểu “TripAdvisor nhẹ hơn”:
- tìm địa điểm/lịch trình
- tạo lịch trình du lịch
- upload/hiển thị ảnh
- review/rating
- like/save/comment
- booking request
- business/admin dashboard cơ bản
- export PDF
- AI suggestion panel dạng fallback nếu chưa dùng Bedrock thật

## Scope Strategy
Không làm production full marketplace trong 1 ngày.
Làm full-scoring demo breadth rộng, depth kiểm soát:
- Must work: core UI, local app, backend API, sample data, core modules.
- Prototype/fallback: Google OAuth thật, Bedrock thật, chat realtime, advanced moderation, claim listing sâu.
- Future work: microservices thật, Redis/OpenSearch thật, CI/CD production, advanced analytics.

## Architecture Decision
Recommended architecture:
Serverless-first modular architecture:
- S3 frontend/media
- CloudFront HTTPS/CDN
- API Gateway
- Lambda backend target
- DynamoDB target
- Cognito-ready auth
- CloudWatch logs/metrics
- IAM least privilege

Implementation demo:
- modular monolith/serverless-style modules để kịp deadline
- service boundaries rõ:
  Auth/User, Listing/Place, Review/Rating, Trip Planner, Social, Booking, Business/Admin, Export PDF, AI Suggestion

Backup plan:
Nếu AWS backend deploy bị kẹt, frontend vẫn có thể deploy S3/CloudFront, backend chạy local/demo, docs ghi rõ deploy path.

## CloudFront / HTTPS
Tối thiểu hợp lý:
- dùng default CloudFront domain có HTTPS
- không bắt buộc custom domain + ACM trong deadline
- ưu tiên CloudFront + S3 standard bucket origin + OAC nếu deploy thật
- không index/deploy AI-LifeOS root

## Repo Strategy
Dùng một monorepo:
frontend/
backend/
infra/
docs/
scripts/

GitHub repo chưa tạo ngay. Tạo/push sau khi local app chạy và docs khung ổn.

## UI Quality Requirement
Không được CRUD trắng trơn.
Cần travel app UI đẹp:
- hero section
- destination/trip cards
- filters/search
- dashboard cards
- badges/status
- loading/empty/error states
- responsive mobile
- screenshots để kiểm giao diện

## Codex Power Protocol
Khi chạy /goal:
- dùng Goal mode với stopping condition rõ
- nếu subagents/task delegation có sẵn, chia workstreams:
  frontend-ui, backend-api, aws-docs, visual-qa, submission-docs
- nếu skill liên quan có sẵn, dùng trước khi plan:
  using-superpowers, security-best-practices, UI/UX/design skill nếu có
- không claim dùng skill nếu chưa thật sự invoke/read skill
- dùng GitNexus cho source-code understanding/refactor/multi-file impact
- nếu GitNexus chưa indexed, chỉ index current repo, không index AI-LifeOS root
- dùng Playwright/browser automation hoặc screenshot-based visual QA để kiểm UI
- sau mỗi checkpoint chạy build/test/check nếu có
- update docs/ai LOG/TASKS
