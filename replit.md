# LakeProof

LakeProof is a premium Lake Victoria seafood traceability frontend that records catch provenance, custody handovers, and public proof.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/lakeproof/src/App.tsx` — route-aware frontend experience and local session demo state
- `artifacts/lakeproof/src/index.css` — shared editorial Lake Victoria theme, typography, grain, and responsive rules
- `artifacts/lakeproof/public/images/` — approved Lake Victoria and fisher imagery used by the app
- `artifacts/api-server/` — shared API service scaffold
- `lib/api-spec/openapi.yaml` — shared API contract source of truth
- `lib/db/src/schema/` — shared PostgreSQL schema source of truth

## Architecture decisions

- The frontend preserves the uploaded LakeProof route structure and fixed lifecycle: Catch → Landing → Transport → Processing → Market.
- The visual system is shared across public, field, inspector, admin, and foundations routes rather than treating internal pages as a separate product.
- The first frontend build uses realistic local demo state so the visual workflows remain usable while backend contracts are finalized.

## Product

LakeProof gives fishers and landing-site agents a field-friendly catch register, gives inspectors a custody progression view, gives administrators a fisheries overview, and gives buyers, regulators, and consumers a redacted public proof timeline.

## User preferences

- Preserve the selected editorial reference design across all pages.
- Use Lake Victoria environment imagery and fisher imagery in place of generic people photography.
- Get image approval before placing image assets into the website.

## Gotchas

- Keep the evidence boundary visible: an intact chain proves the stored record was not changed after acceptance; it does not prove the first physical entry was truthful.
- Use the LakeProof artifact workflow for preview changes; the web service requires workflow-provided `PORT` and `BASE_PATH`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
