import exampleJson from "../../../examples/example.json";
import { Playground } from "@/components/playground";
import { PlotSchema } from "@plotir/core";
import { toTableau } from "@plotir/tableau";
import { toVegaLite } from "@plotir/vegalite";

function ArchitectureDiagram(): React.ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[
        { output: "Vega-Lite", active: true },
        { output: "Tableau", active: true },
      ].map(({ output }) => (
        <div
          key={output}
          className="flex flex-col items-center rounded-lg border border-border bg-white px-4 py-4 font-mono text-xs text-slate-600"
        >
          <span className="text-slate-400">Natural Language</span>
          <span className="py-1 text-slate-400" aria-hidden="true">
            ↓
          </span>
          <span className="font-semibold text-slate-950">PlotIR</span>
          <span className="py-1 text-slate-400" aria-hidden="true">
            ↓
          </span>
          <span className="font-semibold text-slate-950">{output}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home(): React.ReactElement {
  const result = PlotSchema.safeParse(exampleJson);

  if (!result.success) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6">
        <div className="w-full rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-950">
            PlotIR validation failed
          </h1>
          <pre className="mt-4 overflow-auto text-xs text-red-800">
            {result.error.message}
          </pre>
        </div>
      </main>
    );
  }

  const plot = result.data;
  const vegaSpec = toVegaLite(plot);
  const tableauXml = toTableau(plot);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1480px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <header className="mb-10 border-b border-border pb-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded border border-slate-300 bg-white px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  v0.1 Playground
                </span>
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                PlotIR
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                One Intent, Many Outputs
              </p>
            </div>
            <div className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
              <p>
                A tool-neutral visualization compiler: CSV → PlotIR → compiler
                backends.
              </p>
              <p className="font-medium text-slate-700">
                Current scope: PlotIR → Vega-Lite and PlotIR → Tableau.
                Natural Language is not implemented.
              </p>
            </div>
          </div>
          <ArchitectureDiagram />
        </header>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Compiler pipeline
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              CSV → validated PlotIR → deterministic backend output
            </p>
          </div>
          <div className="hidden items-center gap-2 font-mono text-xs text-muted-foreground sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            examples/example.json
          </div>
        </div>

        <Playground
          plot={plot}
          vegaSpec={vegaSpec}
          tableauXml={tableauXml}
        />
      </div>
    </main>
  );
}
