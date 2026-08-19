# Development Guide

## Local Setup

Use the repository’s prescribed package manager and retain the existing workspace policy.

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

Do not substitute npm or Yarn. The root preinstall script intentionally rejects them so the lockfile and workspace resolution remain consistent.

## Common Workflows

### Frontend Work

```bash
pnpm --filter @workspace/lakeproof run dev
```

Keep page, component, hook, and CSS changes within `artifacts/lakeproof/src/`. Preserve the fixed custody lifecycle and clearly distinguish local demo-state behavior from server-backed behavior.

### API Contract Work

```bash
pnpm --filter @workspace/api-spec run codegen
pnpm run typecheck
```

Start with `lib/api-spec/openapi.yaml`. Generated code in `lib/api-client-react/src/generated/` and `lib/api-zod/src/generated/` should be treated as output, not an editing surface.

### Database Work

```bash
export DATABASE_URL='postgres://...'
pnpm --filter @workspace/db run push
```

Use development-only databases for schema push operations. Before introducing production data changes, establish migration review, rollback, backup, and access-control practices appropriate for the operating environment.

### API Work

```bash
pnpm --filter @workspace/api-server run dev
```

The API runtime expects platform-provided `PORT` and `BASE_PATH`. Do not hardcode either value.

## Pre-Review Checklist

| Check | Why it matters |
|---|---|
| `pnpm run typecheck` passes | Prevents cross-workspace type contract drift. |
| `pnpm run build` passes | Confirms package build boundaries still resolve. |
| API changes begin in OpenAPI | Avoids typed-client and implementation divergence. |
| Generated files are regenerated | Maintains a reproducible contract workflow. |
| Sensitive data is absent from the diff | Protects credentials and production information. |
| Documentation reflects operational changes | Keeps handoff knowledge current. |

## Dependency Discipline

`pnpm-workspace.yaml` is a security-sensitive file. It centralizes dependency versions, enforces minimum package age, and restricts packages that may execute build scripts. Do not weaken these controls as a shortcut to an installation issue; document and review an exception instead.
