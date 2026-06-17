"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExportToolbarProps = {
  vegaSpec: object;
  tableauXml: string;
};

function download(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportToolbar({
  vegaSpec,
  tableauXml,
}: ExportToolbarProps): React.ReactElement {
  const [lastExport, setLastExport] = useState<"vega" | "tableau" | null>(null);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
        {lastExport
          ? `${lastExport === "vega" ? "Vega JSON" : "Tableau TWB"} exported`
          : "Compiler outputs are ready to export"}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => {
            download(
              `${JSON.stringify(vegaSpec, null, 2)}\n`,
              "plotir-output.vega.json",
              "application/json",
            );
            setLastExport("vega");
          }}
        >
          <Download className="h-4 w-4" />
          Export Vega JSON
        </Button>
        <Button
          onClick={() => {
            download(
              `${tableauXml}\n`,
              "plotir-output.twb",
              "application/xml",
            );
            setLastExport("tableau");
          }}
        >
          <Download className="h-4 w-4" />
          Export Tableau TWB
        </Button>
      </div>
    </div>
  );
}
