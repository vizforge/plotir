# Tableau `.twb` Reverse-engineering Notes

These notes record the public technical evidence behind the v0.1 Tableau adapter. They do not claim that generated workbooks open in every Tableau Desktop version.

## Required structure currently implemented

1. A federated connection wrapping named connections and a textscan connection.
2. Datasource-level column declarations.
3. Worksheet datasource dependencies containing used columns and column instances.
4. One matching column instance for every pill referenced by rows, columns, color, size, or text.
5. Fully qualified pill references in the form `[datasource].[instance]`.

## Current derivation mapping

| PlotIR | Tableau derivation | Pill prefix |
| --- | --- | --- |
| none | None | none |
| sum | Sum | sum |
| mean | Avg | avg |
| count | Count | cnt |
| min | Minimum | min |
| max | Maximum | max |
| median | Median | med |

## Open verification items

- Whether numeric source columns should use `real` or `integer`
- Version and `source-build` compatibility with the target Desktop release
- Environment-specific textscan attributes such as directory, separator, and header
- Exact wrapper hierarchy emitted by Tableau Desktop
- Stability of column-instance naming after Desktop re-save

The reproducible Desktop diff procedure and acceptance checklist live in [HARDENING.md](../../HARDENING.md).
