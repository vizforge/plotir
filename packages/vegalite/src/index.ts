import {
  CHANNELS,
  derivationOf,
  fieldOf,
  type Field,
  type Plot,
  type Transform,
} from "@plotir/core";

type VegaLiteType = "nominal" | "quantitative" | "temporal";
type VegaLiteEncoding = {
  field: string;
  type: VegaLiteType;
  aggregate?: Exclude<ReturnType<typeof derivationOf>, "none">;
  sort?: "-y" | "y";
};

function vegaLiteType(field: Field): VegaLiteType {
  if (field.dataType === "date") {
    return "temporal";
  }
  if (field.dataType === "number") {
    return "quantitative";
  }
  return "nominal";
}

function literal(value: string | number): string {
  return typeof value === "number" ? String(value) : JSON.stringify(value);
}

function filterExpression(
  plot: Plot,
  transform: Extract<Transform, { kind: "filter" }>,
): string {
  const field = fieldOf(plot, transform.field);
  const datum = `datum[${JSON.stringify(field.name)}]`;

  switch (transform.op) {
    case "eq":
      return `${datum} === ${literal(transform.value as string | number)}`;
    case "neq":
      return `${datum} !== ${literal(transform.value as string | number)}`;
    case "gt":
      return `${datum} > ${literal(transform.value as string | number)}`;
    case "lt":
      return `${datum} < ${literal(transform.value as string | number)}`;
    case "in":
      return `indexof([${(transform.value as (string | number)[])
        .map(literal)
        .join(",")}], ${datum}) >= 0`;
  }
}

export function toVegaLite(plot: Plot): object {
  const encoding: Partial<Record<(typeof CHANNELS)[number], VegaLiteEncoding>> =
    {};

  for (const channelName of CHANNELS) {
    const channel = plot.encoding[channelName];
    if (!channel) {
      continue;
    }

    const field = fieldOf(plot, channel.field);
    const derivation = derivationOf(plot, channel);
    encoding[channelName] = {
      field: field.name,
      type: vegaLiteType(field),
      ...(derivation === "none" ? {} : { aggregate: derivation }),
    };
  }

  for (const transform of plot.transforms ?? []) {
    if (transform.kind === "sort" && encoding.x) {
      encoding.x.sort = transform.order === "desc" ? "-y" : "y";
    }
  }

  const transform = (plot.transforms ?? [])
    .filter(
      (
        item,
      ): item is Extract<Transform, { kind: "filter" }> =>
        item.kind === "filter",
    )
    .map((item) => ({ filter: filterExpression(plot, item) }));

  return {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { url: plot.data.source },
    mark: plot.mark,
    encoding,
    ...(transform.length > 0 ? { transform } : {}),
  };
}
