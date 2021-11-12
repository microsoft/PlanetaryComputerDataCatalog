import { IDropdownOption } from "@fluentui/react";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { CqlOperator } from "pages/Explore/utils/cql/types";

export const operatorOptions: IDropdownOption[] = [
  { key: "eq", text: "Equals" },
  { key: "gt", text: "Greater than" },
  { key: "lt", text: "Less than" },
];

export const formatValue = (value: number | number[]): string => {
  const v = Array.isArray(value) ? value : [value];

  return v.join(", ");
};

export const parseOperatorToKey = (operator: CqlOperator): string => {
  switch (operator) {
    case "eq":
      return "eq";
    case "gt":
      return "gt";
    case "lt":
      return "lt";
    default:
      throw new Error(`Unknown TextStringField operator: ${operator}`);
  }
};

export const toCqlExpression = (
  value: number,
  operatorKey: string,
  field: CqlExpressionParser<number>
) => {
  const valueNum = Number(value);

  const property = { property: field.property };
  switch (operatorKey) {
    case "eq":
      return { eq: [property, valueNum] };
    case "gt":
      return { gt: [property, valueNum] };
    case "lt":
      return { lt: [property, valueNum] };
    default:
      throw new Error(`Unknown TextStringField operator: ${operatorKey}`);
  }
};
