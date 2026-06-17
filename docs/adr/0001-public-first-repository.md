# ADR-0001: Public-first repository strategy

- Status: Accepted
- Date: 2026-06-18

## Context

PlotIR began in a private lab repository while the v0.1 IR, adapters, tests, and Playground were being established. The engineering process benefits from public review, reproducible experiments, and visible design history. Competition strategy and personal working material do not have the same requirement and may contain private context.

## Decision

The public `plotir` repository is the default development space.

The following belong in public:

- PlotIR schemas and types
- adapters and tests
- examples and technical demos
- architecture decisions
- Tableau reverse-engineering notes
- curated technical experiments

Private repositories are restricted to competition strategy, presentation drafts, raw prompt experiments, personal TODOs, and uncurated notes.

Secrets, credentials, tokens, private identifiers, and account information are excluded from both migration and public history.

## Consequences

- Technical decisions are reviewable alongside code.
- The monorepo is the canonical source for builds, tests, and demos.
- Private material must not be used as an implicit dependency of public engineering work.
- Files are screened for sensitive content before migration or publication.
