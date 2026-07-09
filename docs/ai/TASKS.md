# Tasks

Do not put old completed history here; detailed history belongs in `LOG.md` or git history.

## Now
- Keep app AWS deployment as a future, separately approved step.

## Next
- If AWS-SAFE-1 is explicitly approved, run `infra/aws/deploy.ps1` to deploy stack `vtrips-demo`.
- After any demo deploy, run `infra/aws/cleanup.ps1 -ConfirmCleanup`.

## Later
- Ask user before any AWS deploy or cost-impacting resource creation.
- Consider GitNexus indexing only for the current project repo if code understanding/refactor impact is needed.

## Done
- Stage AWS-SAFE-0 prepared `infra/aws/cloudformation.yml`.
- Stage AWS-SAFE-0 prepared Lambda handler and local Lambda smoke test.
- Stage AWS-SAFE-0 prepared guarded `deploy.ps1` and `cleanup.ps1`.
- Stage AWS-SAFE-0 review fixes hardened `deploy.ps1` with pre-CloudFormation build/test, Budget guard, failure cleanup hints, and post-deploy API checks.
- Stage AWS-SAFE-0 review fixes added CloudFront `PriceClass_100`.
- Stage AWS-SAFE-0 review fixes validation passed: build, Lambda smoke, PowerShell syntax parse, secret/email scan, and `outputs.json` absence check.
- Stage AWS-SAFE-0 updated frontend API base handling for `VITE_API_BASE_URL`.
- Stage AWS-SAFE-0 updated AWS deployment, architecture, cleanup, submission, README, and docs/ai materials.
- Stage AWS-SAFE-0 verified AWS identity: account `606163772198`, non-root ARN `arn:aws:iam::606163772198:user/admin`, region `ap-southeast-1`.
- Stage AWS-SAFE-0 created/verified AWS Budget `VTrips-Demo-Budget` at 5 USD/month.
- Stage AWS-SAFE-0 completed read-only discovery and found no existing VTrips app resources.
- Stage AWS-SAFE-0 reran `npm.cmd run build` and `node infra/aws/test-lambda.mjs`.
- Stage G0 created `https://github.com/hey-im-edward/vtrips-aws-fullstack` and pushed branch `main`.
- Stage G0 local verification reran `npm.cmd install`, `npm.cmd run build`, and API smoke check before GitHub push.
- Post-implementation audit completed: README local run verified, screenshots checked, submission docs checked, and build/smoke test rerun.
- Added `docs/architecture/microservices-ready-architecture.md`.
- Fixed README dev script reliability on Windows background/redirected runs.
- Fixed mobile nav screenshot issue where `Admin` could be clipped.
- Implementation Goal local app completed: React/Vite frontend and Node/TypeScript backend exist.
- Core V-Trips workflows implemented locally: places, trips, saved places, reviews, booking, dashboards, export, AI fallback, demo auth/profile.
- Required app-local technical/submission docs created.
- Browser screenshot QA captured in `docs/submission/screenshots/`.
- Stage V0.2 workshop repository split recorded: Workshop Link website is `../vtrips-workshop`.
- Stage V0.2 Goal handoff file created at `GOAL.md`.
- Stage V0.1 Deep Research source material injected into `docs/source-materials/full-deep-research-report.md`.
- Stage V0.1 Codex Goal action summary created at `docs/source-materials/research-action-summary.md`.
- Stage V0 project scaffold created with repo-local `docs/ai`.
- Stage V0 folder structure prepared.
- Research brief created at `docs/source-materials/research-brief.md`.
- Goal-ready `PLAN.md` created at repo root.
