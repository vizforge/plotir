"use client";

import { VegaEmbed } from "react-vega";

export function VegaEmbedClient({
  spec,
}: {
  spec: object;
}): React.ReactElement {
  return (
    <VegaEmbed
      spec={spec as React.ComponentProps<typeof VegaEmbed>["spec"]}
      options={{ actions: false, mode: "vega-lite" }}
    />
  );
}
