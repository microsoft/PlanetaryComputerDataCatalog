import { Text } from "@fluentui/react";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { rangeIsOnSameDay } from "pages/Explore/utils/cql/helpers";
import {
  CqlOperator,
  CqlExpression,
  ICqlExpressionList,
} from "pages/Explore/utils/cql/types";
import { toUtcDateString } from "utils";
import { stacFormatter } from "utils/stac";
import { opEnglish, operators } from "../../../query/constants";
import Section from "./Section";

interface QuerySectionProps {
  cql: ICqlExpressionList;
}
const QuerySection = ({ cql }: QuerySectionProps) => {
  const expressions = (expression: CqlExpression) => {
    const exp = new CqlExpressionParser(expression);
    const propertyLabel = stacFormatter.label(exp.property);
    const opText = operators[exp.operator];
    const dateValue = exp.value as string | string[];

    const value = Array.isArray(exp.value) ? exp.value.join(", ") : exp.value;

    // Special handling for datetime property
    const label =
      exp.property === "datetime" ? (
        getDateLabel(exp.property, propertyLabel, dateValue, exp.operator)
      ) : (
        <Text>
          {propertyLabel} {opText} {stacFormatter.format(value, exp.property)}
        </Text>
      );
    return <Text key={`exp-${propertyLabel}-${exp.operator}`}>{label}</Text>;
  };

  const expressionsLabels = cql.map(expressions);

  // If there is no date expression, use the implicit text that all recent items
  // are included
  const implicitDateExpression = !cql
    .map(exp => new CqlExpressionParser(exp))
    .find(exp => {
      return exp.property === "datetime";
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

const getDateLabel = (
  property: string,
  propertyLabel: string,
  value: string[] | string,
  op: CqlOperator
) => {
  if (Array.isArray(value)) {
    const isSingleDate = rangeIsOnSameDay(value);

    const labelText = isSingleDate
      ? `${propertyLabel} ${opEnglish[op]} ${toUtcDateString(value[0])} `
      : `${propertyLabel} between ${toUtcDateString(value[0])} and ${toUtcDateString(
          value[1]
        )}`;

    return <Text>{labelText}</Text>;
  } else if (property === "datetime" && !Array.isArray(value)) {
    const labelText = `${propertyLabel} ${opEnglish[op]} ${toUtcDateString(value)}`;
    return <Text>{labelText}</Text>;
  }
};
