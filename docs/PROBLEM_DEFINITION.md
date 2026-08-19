# Problem Definition: LakeProof

## The Core Problem

Seafood buyers, regulators, processors, and consumers need a credible account of where a fish was caught and how it moved through the supply chain. In many small-scale fisheries contexts, this evidence is incomplete, fragmented, difficult to verify, or unavailable to the people who need it. A buyer may receive a verbal assurance; an inspector may receive a disconnected handover record; a consumer may receive no provenance information at all.

LakeProof frames traceability as a continuous evidence journey rather than a collection of disconnected forms. It gives the product a shared language for catch registration, custody progression, and public proof.

## Who Is Affected

| Stakeholder | Need | LakeProof interaction |
|---|---|---|
| Fishers and landing-site agents | Fast, clear capture of initial catch information. | Use the field-oriented catch-registration experience. |
| Inspectors | A constrained way to review and progress handovers. | Use the custody progression workflow. |
| Processors and buyers | An understandable account of product provenance. | Review the custody history and supporting proof. |
| Regulators | Evidence that is structured, inspectable, and exportable. | Review traceability data and associated system records. |
| Consumers | A simple answer to “where did this come from?” | Open the public proof timeline. |

## The Product Question

> How can a Lake Victoria seafood supply chain record a catch and subsequent handovers in a way that remains clear to field users, useful to operational staff, and understandable to a public verifier?

## Product Approach

LakeProof centers the five-stage custody model below.

| Sequence | Stage | Purpose |
|---:|---|---|
| 1 | Catch | Record the initial catch and its provenance context. |
| 2 | Landing | Establish the landing-site acceptance or handover. |
| 3 | Transport | Record movement between operational actors or locations. |
| 4 | Processing | Record the transition into processing. |
| 5 | Market | Record the market-facing stage of the chain. |

The current product presentation gives each person a direct route: **Register**, **Progress custody**, or **Verify proof**. The interface is intentionally role-aware and field-oriented rather than presenting every user with the same controls.

## Integrity Boundary

LakeProof makes a disciplined claim about digital evidence. A valid, intact stored chain can indicate that the data accepted by the system was not subsequently changed without detection. It does **not** prove that an original physical observation was truthful, that a device was operated honestly, or that an event occurred exactly as reported. Physical inspection, identity controls, process controls, and data-quality governance remain necessary.

## Scope

The current workspace includes a polished frontend experience, API scaffold, OpenAPI source-of-truth, generated-client packages, and a Drizzle/PostgreSQL boundary. The frontend currently uses local demonstration state while backend contracts are finalized.

| In Scope | Not Yet Claimed as Complete |
|---|---|
| Field-oriented traceability UX | Production persistent traceability service |
| Five-stage custody model | Finalized operational schema and migrations |
| Public-facing proof presentation | Device trust, fraud detection, or physical audit |
| API, client, and database workspace boundaries | Full compliance certification or production monitoring |

## Intended Outcomes

LakeProof aims to make provenance understandable instead of opaque. A successful next implementation phase should preserve low-friction field entry, enforce coherent custody transitions, make public proof easy to read, and retain an honest boundary around what digital evidence can establish.

## One-Sentence Description

**LakeProof is a Lake Victoria seafood traceability workspace that guides fish from catch registration through custody handovers to a clear public proof timeline.**
