# Repository Map

## Navigation Principle

The workspace is organized by responsibility. Application artifacts remain under `artifacts/`; reusable platform libraries remain under `lib/`; repository-only helpers remain under `scripts/`; operational knowledge remains under `docs/`.

## Directory Reference

| Path | Purpose | Edit policy |
|---|---|---|
| `artifacts/lakeproof/src/` | LakeProof interface, routes, components, hooks, and styles. | Product engineers edit reviewed source only. |
| `artifacts/lakeproof/public/images/` | Approved product imagery. | Preserve asset ownership and approvals. |
| `artifacts/api-server/src/` | API routes, middleware, and service code. | Backend engineers edit with contract review. |
| `artifacts/mockup-sandbox/` | Separate visual reference and mockup environment. | Do not ship as the LakeProof runtime by accident. |
| `lib/api-spec/openapi.yaml` | Canonical API specification. | Update before modifying generated API client/types. |
| `lib/api-client-react/src/generated/` | Generated React client output. | Generated; do not hand-edit. |
| `lib/api-zod/src/generated/` | Generated Zod validation/types. | Generated; do not hand-edit. |
| `lib/db/src/schema/` | Database schema boundary. | Change with migration and review discipline. |
| `scripts/src/` | Small repository automation scripts. | Keep utilities narrow and documented. |
| `attached_assets/` | Existing assets and visual references. | Not runtime source; preserve provenance. |
| `docs/` | Repository knowledge base. | Update when system or operational behavior changes. |

## Source-of-Truth Rules

| Concern | Canonical location |
|---|---|
| Product UI | `artifacts/lakeproof/src/` |
| HTTP API contract | `lib/api-spec/openapi.yaml` |
| Runtime API implementation | `artifacts/api-server/src/` |
| Typed client/validation output | Generated from `lib/api-spec/` |
| Database schema | `lib/db/src/schema/` |
| Shared dependency versions | `pnpm-workspace.yaml` catalog |
| Workspace dependency graph | `pnpm-lock.yaml` |
| Operating notes | `replit.md` and `docs/` |

## What Was Not Moved

No implementation folder, runtime configuration, package manifest, lockfile, asset directory, or generated file was moved during this organization pass. Moving those paths without coordinated import, build, and deployment updates would risk changing behavior and would violate the requested no-code-change boundary.
