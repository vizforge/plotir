"use client";

import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VegaEmbedClient = dynamic(
  () =>
    import("@/components/vega-embed-client").then(
      (module) => module.VegaEmbedClient,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="font-mono text-xs text-muted-foreground">
        Rendering Vega-Lite…
      </p>
    ),
  },
);

export function VegaChart({ spec }: { spec: object }): React.ReactElement {
  return (
    <Card className="min-h-[300px] overflow-hidden">
      <CardHeader>
        <CardTitle>Rendered Chart</CardTitle>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          react-vega
        </span>
      </CardHeader>
      <CardContent className="flex min-h-[250px] items-center justify-center overflow-auto bg-white">
        <VegaEmbedClient spec={spec} />
      </CardContent>
    </Card>
  );
}
