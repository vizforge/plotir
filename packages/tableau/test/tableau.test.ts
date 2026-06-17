import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PlotSchema } from "@plotir/core";
import { toTableau } from "../src/index.js";

const examplePath = fileURLToPath(
  new URL("../../../examples/example.json", import.meta.url),
);
const example = PlotSchema.parse(
  JSON.parse(readFileSync(examplePath, "utf8")) as unknown,
);

function referencedPills(xml: string): string[] {
  return [
    ...xml.matchAll(
      /<(?:rows|cols)>.*?\]\.(\[[^<]+\])<\/(?:rows|cols)>|<(?:color|size|text) column='.*?\]\.(\[[^']+\])'/g,
    ),
  ].map((match) => match[1] ?? match[2]);
}

function declaredInstances(xml: string): Set<string> {
  return new Set(
    [...xml.matchAll(/<column-instance\b[^>]*\bname='([^']+)'/g)].map(
      (match) => match[1],
    ),
  );
}

describe("toTableau", () => {
  it("includes the federated connection and worksheet dependencies", () => {
    const xml = toTableau(example);
    expect(xml).toContain("<connection class='federated'>");
    expect(xml).toContain("<datasource-dependencies");
  });

  it("declares a column-instance for every referenced pill", () => {
    const plot = PlotSchema.parse({
      ...example,
      encoding: {
        ...example.encoding,
        color: { field: "region" },
        size: { field: "sales", aggregate: "mean" },
        text: { field: "sales", aggregate: "max" },
      },
    });
    const xml = toTableau(plot);
    const references = referencedPills(xml);
    const instances = declaredInstances(xml);

    expect(references).toHaveLength(5);
    for (const reference of references) {
      expect(instances.has(reference), `missing instance ${reference}`).toBe(
        true,
      );
    }
  });

  it("matches the example Tableau XML snapshot", () => {
    expect(toTableau(example)).toMatchSnapshot();
  });

  it.skip("round-trips Tableau .twb back to PlotIR", () => {
    // Future seam: twb -> IR is outside the v0.1 scope.
  });
});
