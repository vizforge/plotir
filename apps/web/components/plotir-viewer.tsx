import { CodeViewer } from "@/components/code-viewer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Plot } from "@plotir/core";

export function PlotIRViewer({ plot }: { plot: Plot }): React.ReactElement {
  return (
    <Card className="flex min-h-[620px] flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>PlotIR JSON</CardTitle>
        <span className="font-mono text-[11px] text-muted-foreground">
          validated
        </span>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-3">
        <CodeViewer value={plot} />
      </CardContent>
    </Card>
  );
}
