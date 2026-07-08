# Agent Rules

## Required Startup
- At the start of every coding task, read `docs/ai/CONTEXT.md` and `docs/ai/TASKS.md`.
- Use GitNexus when the task involves source-code understanding, tracing, refactoring, debugging, renaming, or multi-file impact analysis.
- Do not block simple Markdown/docs reads just because GitNexus exists.
- If GitNexus has no graph for the current repo, report that clearly and continue with focused file reads instead of broad repo scans.
- Do not read the whole repo blindly.

## Change Discipline
- Make the smallest safe change.
- Do not add dependencies without explaining why.
- Run relevant tests if available. If tests are not run, explain why.

## Documentation Discipline
- Before finishing, update `docs/ai/CONTEXT.md`, `docs/ai/TASKS.md`, and `docs/ai/LOG.md`.
- Update `docs/ai/DECISIONS.md` if a meaningful technical or product decision was made.
- A task is not complete until `docs/ai/` is updated.

## Final Response Format
Use this exact structure:

```text
Summary
- ...

Files changed
- ...

Tests run
- ...

Decisions/assumptions
- ...

Risks
- ...

Next action
- ...
```
