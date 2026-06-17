import { z } from "zod";

export const MARKS = ["bar", "line", "point", "text"] as const;
export const AGGS = ["sum", "mean", "count", "min", "max", "median"] as const;

export const FieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  dataType: z.enum(["string", "number", "date", "boolean"]),
  role: z.enum(["dimension", "measure"]),
  defaultAggregate: z.enum(AGGS).optional(),
});

export const ChannelSchema = z.object({
  field: z.string(),
  aggregate: z.enum(AGGS).optional(),
});

export const TransformSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("filter"),
    field: z.string(),
    op: z.enum(["eq", "neq", "gt", "lt", "in"]),
    value: z.union([
      z.string(),
      z.number(),
      z.array(z.union([z.string(), z.number()])),
    ]),
  }),
  z.object({
    kind: z.literal("sort"),
    field: z.string(),
    order: z.enum(["asc", "desc"]),
  }),
]);

export const PlotSchema = z.object({
  data: z.object({
    source: z.string(),
    fields: z.array(FieldSchema),
  }),
  mark: z.enum(MARKS),
  encoding: z.object({
    x: ChannelSchema.optional(),
    y: ChannelSchema.optional(),
    color: ChannelSchema.optional(),
    size: ChannelSchema.optional(),
    text: ChannelSchema.optional(),
  }),
  transforms: z.array(TransformSchema).optional(),
});

export type Field = z.infer<typeof FieldSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type Transform = z.infer<typeof TransformSchema>;
export type Plot = z.infer<typeof PlotSchema>;
export type Aggregate = (typeof AGGS)[number];
export type Derivation = Aggregate | "none";
export type ChannelName = keyof Plot["encoding"];

export const CHANNELS: readonly ChannelName[] = [
  "x",
  "y",
  "color",
  "size",
  "text",
];

export function fieldOf(plot: Plot, reference: string): Field {
  const field = plot.data.fields.find((candidate) => candidate.id === reference);
  if (!field) {
    throw new Error(`unknown field id: ${reference}`);
  }
  return field;
}

export function derivationOf(plot: Plot, channel: Channel): Derivation {
  const field = fieldOf(plot, channel.field);
  if (field.role === "dimension") {
    return "none";
  }
  return channel.aggregate ?? field.defaultAggregate ?? "sum";
}
