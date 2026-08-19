# Contributing to LakeProof

## Principle

Every change should be small, reviewable, reproducible, and traceable to the correct workspace boundary. Avoid “drive-by” formatting, generated-file edits, and unrelated refactors in the same pull request.

## Before You Start

Read [`README.md`](README.md), [`docs/REPOSITORY_MAP.md`](docs/REPOSITORY_MAP.md), and [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md). Identify the source of truth for the concern you are changing before editing any file.

## Contribution Workflow

1. Create a focused branch from the approved base branch.
2. Describe the problem and the intended behavior before implementation.
3. Make the smallest coherent change in the correct workspace.
4. Update the OpenAPI contract before generated API clients or validation types.
5. Run `pnpm run typecheck` and `pnpm run build`.
6. Update documentation when behavior, boundaries, or operating procedures change.
7. Submit a pull request using the repository template.

## Review Expectations

Reviewers should be able to answer four questions from the pull request: what changed, why it changed, where the source of truth is, and how the change was verified. High-risk changes—authentication, authorization, database migrations, event integrity, public proof, and dependency-policy exceptions—deserve dedicated review.

## Generated Artifacts

Do not edit `lib/api-client-react/src/generated/` or `lib/api-zod/src/generated/` directly. Update `lib/api-spec/openapi.yaml`, regenerate output, and include the resulting changes in the same review.

## Commit Guidance

Write concise imperative commit subjects, for example `docs: clarify API contract workflow` or `feat(api): add custody event endpoint`. Keep non-functional documentation work separate from application behavior changes whenever practical.
