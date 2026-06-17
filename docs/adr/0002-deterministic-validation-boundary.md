# ADR-0002: Deterministic validation boundary

- Status: Accepted
- Date: 2026-06-18

## Context

PlotIR may eventually receive input from multiple frontends, including nondeterministic systems. Backend adapters must remain testable and reproducible.

## Decision

All unknown input must pass through `PlotSchema.parse()` before adapter execution. The Vega-Lite and Tableau adapters accept a validated `Plot` and remain pure functions.

File I/O belongs in application or CLI boundaries, not in adapter packages.

## Consequences

- Invalid vocabulary is rejected before lowering.
- Adapter output is deterministic and unit-testable.
- New frontends can be added without changing backend trust assumptions.
- v0.1 schema vocabulary remains frozen.
