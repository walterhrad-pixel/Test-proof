# Changelog

All notable repository-level changes are documented here. Application releases and feature changes should use a separate, product-owned release process when that process is established.

## Unreleased

### Documentation and Repository Hygiene

- Added a root README with onboarding, workspace map, architecture, commands, and engineering rules.
- Added product, architecture, repository map, development, and organization-record documentation under `docs/`.
- Added contribution and security guidance.
- Added the MIT license text to match the root package metadata.
- Added a pull-request evidence template.

### Corrections

- Fixed the README Quick Start: added the one-time `pnpm approve-builds` / `pnpm rebuild esbuild` step needed because pnpm ignores the `esbuild` build script by default, and corrected the environment variable requirements for local dev. `@workspace/lakeproof` requires both `PORT` and `BASE_PATH`; `@workspace/api-server` requires only `PORT`. The prior README incorrectly implied the API scaffold also needed `BASE_PATH`.

### Integrity Statement

- No pre-existing application source, manifests, lockfiles, runtime configuration, generated output, database configuration, or assets were modified by this documentation-only organization pass.
