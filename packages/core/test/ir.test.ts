import { describe, expect, it } from "vitest";
import {
  PlotSchema,
  derivationOf,
  type Plot,
} from "../src/index.js";

const basePlot = {
  data: {
    source: "sales.csv",
    fields: [
      {
        id: "region",
        name: "Region",
        dataType: "string",
        role: "dimension",
      },
      {
        id: "sales",
        name: "Sales",
        dataType: "number",
        role: "measure",
      },
    ],
  },
  mark: "bar",
  encoding: {
    x: { field: "region" },
    y: { field: "sales" },
  },
} satisfies Plot;

describe("PlotSchema", () => {
  it("rejects an unknown mark", () => {
    expect(() =>
      PlotSchema.parse({ ...basePlot, mark: "area" }),
    ).toThrow();
  });

  it("rejects an unknown aggregate", () => {
    expect(() =>
      PlotSchema.parse({
        ...basePlot,
        encoding: {
          ...basePlot.encoding,
          y: { field: "sales", aggregate: "stdev" },
        },
      }),
    ).toThrow();
  });
});

describe("derivationOf", () => {
  it("uses no aggregate for a dimension", () => {
    const plot = PlotSchema.parse(basePlot);
    expect(derivationOf(plot, plot.encoding.x!)).toBe("none");
  });

  it("defaults a measure to sum", () => {
    const plot = PlotSchema.parse(basePlot);
    expect(derivationOf(plot, plot.encoding.y!)).toBe("sum");
  });
});
