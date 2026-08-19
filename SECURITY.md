# Security Policy

## Reporting a Vulnerability

Do not disclose a suspected vulnerability in a public issue. Share a private report with the repository owner or the designated security contact, including a concise impact description, affected paths or packages, reproduction steps, and any safe mitigation you have identified.

The project team should acknowledge a good-faith report promptly, validate the issue in a controlled environment, coordinate a fix, and agree on a disclosure timeline with the reporter.

## Secure Development Expectations

| Area | Expectation |
|---|---|
| Secrets | Keep credentials, tokens, and connection strings out of Git and client bundles. |
| Dependencies | Preserve the workspace minimum-release-age policy and dependency catalog. |
| API contracts | Validate inputs at the service boundary and keep contracts reviewed. |
| Public proof | Do not expose personally identifying, sensitive commercial, or operationally confidential data without an explicit policy. |
| Database | Use least-privilege credentials and review production schema/data changes. |
| Logging | Avoid recording secrets, private identifiers, or raw user data unnecessarily. |

## Scope Note

LakeProof’s traceability presentation should not overclaim physical-world certainty. Any future integrity or verification feature must distinguish tamper detection for stored data from proof that an original physical event was truthful.
