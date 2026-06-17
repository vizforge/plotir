import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PlotSchema } from "../packages/core/src/index.js";
import { toTableau } from "../packages/tableau/src/index.js";
import { toVegaLite } from "../packages/vegalite/src/index.js";

const inputPath = process.argv[2] ?? "examples/example.json";
const outputDirectory = resolve("dist");
const vegaLitePath = resolve(outputDirectory, "output.vega.json");
const tableauPath = resolve(outputDirectory, "output.twb");
const raw = JSON.parse(await readFile(inputPath, "utf8")) as unknown;
const plot = PlotSchema.parse(raw);

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    vegaLitePath,
    `${JSON.stringify(toVegaLite(plot), null, 2)}\n`,
    "utf8",
  ),
  writeFile(tableauPath, `${toTableau(plot)}\n`, "utf8"),
]);

console.log(`Vega-Lite: ${vegaLitePath}`);
console.log(`Tableau:   ${tableauPath}`);
