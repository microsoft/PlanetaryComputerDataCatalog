import { IDropdownOption } from "@fluentui/react";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import {
  CqlEqualExpression,
  CqlGtExpression,
  CqlLtExpression,
  CqlOperator,
} from "pages/Explore/utils/cql/types";

export const operatorOptions: IDropdownOption[] = [
  { key: "=", text: "Equals" },
  { key: ">", text: "Greater than" },
  { key: "<", text: "Less than" },
];

export const formatValue = (value: number | number[]): string => {
  const v = Array.isArray(value) ? value : [value];

  return v.join(", ");
};

export const parseOperatorToKey = (operator: CqlOperator): string => {
  const validOperators = ["=", ">", "<"];

  if (validOperators.includes(operator)) {
    return operator;
  }
  throw new Error(`Unknown TextStringField operator: ${operator}`);
};

export const toCqlExpression = (
  value: number,
  operatorKey: string,
  field: CqlExpressionParser<number>
):
  | CqlEqualExpression<number>
  | CqlGtExpression<number>
  | CqlLtExpression<number> => {
  const valueNum = Number(value);

  const property = { property: field.property };
  switch (operatorKey) {
    case "=":
      return { op: "=", args: [property, valueNum] };
    case ">":
      return { op: ">", args: [property, valueNum] };
    case "<":
      return { op: "<", args: [property, valueNum] };
    default:
      throw new Error(`Unknown TextStringField operator: ${operatorKey}`);
  }
};
