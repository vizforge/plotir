import { ExportToolbar } from "@/components/export-toolbar";
import { PlotIRViewer } from "@/components/plotir-viewer";
import { VegaChart } from "@/components/vega-chart";
import { VegaSpecViewer } from "@/components/vega-spec-viewer";
import type { Plot } from "@plotir/core";

type PlaygroundProps = {
  plot: Plot;
  vegaSpec: object;
  tableauXml: string;
};

export function Playground({
  plot,
  vegaSpec,
  tableauXml,
}: PlaygroundProps): React.ReactElement {
  return (
    <>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
        <PlotIRViewer plot={plot} />
        <div className="grid gap-5">
          <VegaSpecViewer spec={vegaSpec} />
          <VegaChart spec={vegaSpec} />
        </div>
      </section>
      <ExportToolbar vegaSpec={vegaSpec} tableauXml={tableauXml} />
    </>
  );
}
