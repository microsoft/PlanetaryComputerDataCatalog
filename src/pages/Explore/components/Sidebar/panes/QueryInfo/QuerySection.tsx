import { Text } from "@fluentui/react";

import { IMosaic } from "pages/Explore/types";
import { toUtcDate } from "utils";
import { stacFormatter } from "utils/stac";
import { opEnglish, operators } from "../../../query/constants";
import Section from "./Section";

interface QuerySectionProps {
  query: IMosaic;
}
const getDateLabel = (
  attr: any,
  property: string,
  value: any,
  op: keyof typeof operators
) => {
  if (Array.isArray(value)) {
    const oneDate = new Set(value.map(toUtcDate)).size === 1 || value.length === 1;

    const labelText = oneDate
      ? `${property} ${opEnglish[op]} ${toUtcDate(value[0])} `
      : `${property} between ${toUtcDate(value[0])} and ${toUtcDate(value[1])}`;

    return <Text>{labelText}</Text>;
  } else if (attr.property === "datetime" && !Array.isArray(value)) {
    const labelText = `${property} ${opEnglish[op]} ${toUtcDate(value)}`;
    return <Text>{labelText}</Text>;
  }
};

const QuerySection = ({ query }: QuerySectionProps) => {
  const expressions = (expression: any) => {
    const op = Object.keys(expression)[0] as keyof typeof operators;
    const [attr, value] = expression[op];
    const property = stacFormatter.label(attr.property);
    const opText = operators[op];

    // Special handling for datetime property
    const label =
      attr.property === "datetime" ? (
        getDateLabel(attr, property, value, op)
      ) : (
        <Text>
          {property} {opText} {value}
        </Text>
      );
    return <Text key={`exp-${property}-${op}`}>{label}</Text>;
  };

  const expressionsLabels = query.cql?.map(expressions);
  const implicitDateExpression = !query?.cql?.find((exp: any) => {
    // TODO: Typing 'expression'
    // @ts-ignore
    return Object.values(exp)[0][0].property === "datetime";
  })
    ? "All recent data items"
    : null;

  return (
    <Section title="Filters Applied" icon="PageListFilter">
      {implicitDateExpression}
      {expressionsLabels}
    </Section>
  );
};

export default QuerySection;
