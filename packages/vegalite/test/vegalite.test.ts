import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { PlotSchema } from "@plotir/core";
import { toVegaLite } from "../src/index.js";

const examplePath = fileURLToPath(
  new URL("../../../examples/example.json", import.meta.url),
);
const example = PlotSchema.parse(
  JSON.parse(readFileSync(examplePath, "utf8")) as unknown,
);

describe("toVegaLite", () => {
  it("compiles the example into a Vega-Lite v5 specification", () => {
    const result = toVegaLite(example) as {
      mark: string;
      encoding: {
        x: { sort?: string };
        y: { aggregate?: string };
      };
    };

    expect(result.mark).toBe("bar");
    expect(result.encoding.y.aggregate).toBe("sum");
    expect(result.encoding.x.sort).toBe("-y");
    expect(result).toMatchSnapshot();
  });
});
