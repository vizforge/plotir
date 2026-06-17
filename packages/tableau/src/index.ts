import {
  CHANNELS,
  derivationOf,
  fieldOf,
  type Channel,
  type Derivation,
  type Field,
  type Plot,
} from "@plotir/core";

const DATASOURCE_NAME = "federated.plotir01";
const CONNECTION_NAME = "textscan.plotir01";

const PREFIX: Record<Derivation, string> = {
  none: "none",
  sum: "sum",
  mean: "avg",
  count: "cnt",
  min: "min",
  max: "max",
  median: "med",
};

const DERIVATION: Record<Derivation, string> = {
  none: "None",
  sum: "Sum",
  mean: "Avg",
  count: "Count",
  min: "Minimum",
  max: "Maximum",
  median: "Median",
};

function xmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("'", "&apos;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function tableauDataType(field: Field): string {
  if (field.dataType === "number") {
    return "real";
  }
  if (field.dataType === "date") {
    return "date";
  }
  if (field.dataType === "boolean") {
    return "boolean";
  }
  return "string";
}

function tableauType(field: Field): "quantitative" | "nominal" {
  return field.role === "measure" || field.dataType === "number"
    ? "quantitative"
    : "nominal";
}

function instanceName(plot: Plot, channel: Channel): string {
  const field = fieldOf(plot, channel.field);
  const suffix = tableauType(field) === "quantitative" ? "qk" : "nk";
  return `[${PREFIX[derivationOf(plot, channel)]}:${field.name}:${suffix}]`;
}

function markClass(mark: Plot["mark"]): string {
  return {
    bar: "Bar",
    line: "Line",
    point: "Circle",
    text: "Text",
  }[mark];
}

export function toTableau(plot: Plot): string {
  const instances = new Map<string, { channel: Channel; field: Field }>();
  for (const channelName of CHANNELS) {
    const channel = plot.encoding[channelName];
    if (channel) {
      instances.set(instanceName(plot, channel), {
        channel,
        field: fieldOf(plot, channel.field),
      });
    }
  }

  const pillReference = (channel?: Channel): string => {
    if (!channel) {
      return "";
    }
    return `[${DATASOURCE_NAME}].${instanceName(plot, channel)}`;
  };

  const relationColumns = plot.data.fields
    .map(
      (field, ordinal) =>
        `          <column datatype='${tableauDataType(field)}' name='${xmlAttribute(field.name)}' ordinal='${ordinal}' />`,
    )
    .join("\n");

  const datasourceColumns = plot.data.fields
    .map(
      (field) =>
        `      <column datatype='${tableauDataType(field)}' name='[${xmlAttribute(field.name)}]' role='${field.role}' type='${tableauType(field)}' />`,
    )
    .join("\n");

  const dependencyColumns = plot.data.fields
    .map(
      (field) =>
        `          <column datatype='${tableauDataType(field)}' name='[${xmlAttribute(field.name)}]' role='${field.role}' type='${tableauType(field)}' />`,
    )
    .join("\n");

  const dependencyInstances = [...instances.entries()]
    .map(
      ([name, { channel, field }]) =>
        `          <column-instance column='[${xmlAttribute(field.name)}]' derivation='${DERIVATION[derivationOf(plot, channel)]}' name='${xmlAttribute(name)}' pivot='key' type='${tableauType(field)}' />`,
    )
    .join("\n");

  const markEncodings = [
    plot.encoding.color
      ? `              <color column='${xmlAttribute(pillReference(plot.encoding.color))}' />`
      : undefined,
    plot.encoding.size
      ? `              <size column='${xmlAttribute(pillReference(plot.encoding.size))}' />`
      : undefined,
    plot.encoding.text
      ? `              <text column='${xmlAttribute(pillReference(plot.encoding.text))}' />`
      : undefined,
  ].filter((line): line is string => line !== undefined);

  const encodingsBlock =
    markEncodings.length > 0
      ? `\n            <encodings>\n${markEncodings.join("\n")}\n            </encodings>`
      : "";

  const source = xmlAttribute(plot.data.source);

  return `<?xml version='1.0' encoding='utf-8' ?>
<!-- PlotIR v0.1 to Tableau .twb. Confirm hard-coded attributes with Tableau Desktop; see HARDENING.md. -->
<workbook version='18.1' xmlns:user='http://www.tableausoftware.com/xml/user'>
  <datasources>
    <datasource caption='${source}' inline='true' name='${DATASOURCE_NAME}' version='18.1'>
      <connection class='federated'>
        <named-connections>
          <named-connection caption='${source}' name='${CONNECTION_NAME}'>
            <connection class='textscan' filename='${source}' />
          </named-connection>
        </named-connections>
        <relation connection='${CONNECTION_NAME}' name='${source}' table='[${source}]' type='table'>
          <columns header='yes'>
${relationColumns}
          </columns>
        </relation>
      </connection>
${datasourceColumns}
    </datasource>
  </datasources>
  <worksheets>
    <worksheet name='Sheet 1'>
      <table>
        <view>
          <datasources>
            <datasource caption='${source}' name='${DATASOURCE_NAME}' />
          </datasources>
          <datasource-dependencies datasource='${DATASOURCE_NAME}'>
${dependencyColumns}
${dependencyInstances}
          </datasource-dependencies>
        </view>
        <panes>
          <pane>
            <view><breakdown value='auto' /></view>
            <mark class='${markClass(plot.mark)}' />${encodingsBlock}
          </pane>
        </panes>
        <rows>${xmlAttribute(pillReference(plot.encoding.y))}</rows>
        <cols>${xmlAttribute(pillReference(plot.encoding.x))}</cols>
      </table>
    </worksheet>
  </worksheets>
  <windows>
    <window class='worksheet' name='Sheet 1' />
  </windows>
</workbook>`;
}
