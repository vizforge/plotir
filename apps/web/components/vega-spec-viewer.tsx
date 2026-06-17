import { CodeViewer } from "@/components/code-viewer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VegaSpecViewer({
  spec,
}: {
  spec: object;
}): React.ReactElement {
  return (
    <Card className="flex min-h-[300px] flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Vega-Lite JSON</CardTitle>
        <span className="font-mono text-[11px] text-muted-foreground">
          compiler output
        </span>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-3">
        <CodeViewer value={spec} />
      </CardContent>
    </Card>
  );
}
