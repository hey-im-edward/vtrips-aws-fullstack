# Research Action Summary - V-Trips Codex Goal

## Requirements nộp bài
- Ưu tiên full-scoring demo: app local chạy được, frontend/backend rõ, UI travel polished, AWS architecture docs, workshop, blog drafts, deployment guide, cleanup guide, submission checklist.
- Chuẩn bị cao hơn mức tối thiểu vì một số rule FCAJ/HUTECH chưa xác minh trực tiếp: ít nhất 1 blog chính hoàn chỉnh, thêm 2 blog backup ngắn, workshop tiếng Việt và bản tiếng Anh nếu kịp.
- README/final report phải tách rõ `Implemented`, `Prototype/Fallback`, và `Future Work`.

## Architecture decision
- Chọn serverless-first modular architecture: S3 + CloudFront, API Gateway, Lambda, DynamoDB, Cognito-ready auth, CloudWatch, IAM.
- Trình bày như service-oriented modular architecture, nhưng triển khai demo bằng modular monolith/serverless-style modules để giảm deployment risk trong deadline ngắn.
- Service boundaries cần rõ: Auth/User, Listing/Place, Review/Rating, Trip Planner, Social, Booking, Business/Admin, Export PDF, AI Suggestion.

## CloudFront/HTTPS strategy
- Dùng default CloudFront domain có HTTPS là đủ cho deadline; không bắt buộc custom domain + ACM.
- Nếu deploy thật, ưu tiên CloudFront + standard S3 bucket origin + OAC thay vì S3 website endpoint để giữ HTTPS và bucket access control sạch hơn.
- Backup plan: nếu backend AWS kẹt, frontend vẫn có thể deploy S3/CloudFront, backend chạy local/demo và docs ghi rõ deploy path.

## Workshop/blog requirement
- Cần workshop docs rõ ràng, ít nhất gồm overview, deployment, cleanup.
- Nên có song ngữ `docs/workshop/vi/` và `docs/workshop/en/` theo PLAN.md.
- Blog: làm 1 bài chính chất lượng cao, thêm 2 draft backup để an toàn khi official blog count chưa xác minh.

## Module scope
- Must work: Home/Search, place listing/detail/create/edit, trip list/detail/create/edit, saved places, review list/form, profile, demo auth/Cognito-ready auth, booking request basic, business dashboard basic, admin dashboard basic, export PDF basic, AI suggestion fallback, local run.
- Prototype/Fallback: Google OAuth thật, Bedrock thật, realtime chat, advanced moderation/report, claim listing deep workflow, Redis/OpenSearch/microservices production.
- Future work: production microservices, CI/CD production-grade, advanced analytics, full booking/payment workflow, advanced audit and role matrix.

## Repo strategy
- Dùng một monorepo: `frontend/`, `backend/`, `infra/`, `docs/`, `scripts/`.
- Không tạo GitHub repo trước khi local app và docs skeleton ổn.
- Không index/deploy AI-LifeOS root; mọi source of truth cho task nằm trong repo-local `docs/ai/` và `docs/source-materials/`.

## Deadline constraints
- Deadline cực sát, ưu tiên breadth đủ điểm và local demo chắc trước khi deploy cloud.
- Không npm install, không deploy AWS, không tạo GitHub repo trong Stage V0.1.
- Goal kế tiếp chỉ pause khi cần AWS credentials/account action, cost-impacting AWS resource creation, destructive action, hoặc blocker không xử lý local được.

## Risks
- Official FCAJ/HUTECH rules chưa xác minh đầy đủ trong report, nên docs phải ghi assumption rõ.
- Scope gốc rộng như marketplace; nếu làm quá sâu sẽ mất deadline.
- Cloud deploy backend có thể kẹt, cần fallback local/demo đã ghi rõ.
- Không được hard-code secret hoặc dùng AWS root credentials cho công việc thường ngày.

## Stopping condition
- Codex Goal kế tiếp chỉ coi là done khi app local chạy được, frontend/backend tồn tại, core screens/modules có thật, required docs trong PLAN.md tồn tại, diagram source có, deploy/cleanup guide có, workshop vi/en có, 3 blog drafts có, và final report tiếng Việt tách rõ working vs prototype/fallback.
