import { IDropdownOption } from "@fluentui/react";
import { trim } from "lodash-es";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import {
  CqlEqualExpression,
  CqlInExpression,
  CqlLikeExpression,
  CqlOperator,
} from "pages/Explore/utils/cql/types";

const wildcard = "%";

export const operatorOptions: IDropdownOption[] = [
  { key: "=", text: "Equals" },
  { key: "like", text: "Like" },
  { key: "in", text: "In list" },
];

const stripWildcards = (value: string) => {
  const re = new RegExp(`^${wildcard}|${wildcard}$`, "g");
  return value.replace(re, "");
};

export const formatValue = (value: string | string[]): string => {
  const v = Array.isArray(value) ? value : [value];

  return v.map(stripWildcards).join(", ");
};

export const parseOperatorToKey = (operator: CqlOperator): string => {
  const validOperators = ["=", "like", "in"];

  if (validOperators.includes(operator)) {
    return operator;
  }
  throw new Error(`Unknown TextStringField operator: ${operator}`);
};

export const toCqlExpression = (
  value: string,
  operatorKey: string,
  field: CqlExpressionParser<string>
): CqlEqualExpression<string> | CqlLikeExpression | CqlInExpression<string> => {
  const property = { property: field.property };
  switch (operatorKey) {
    case "=":
      return { op: "=", args: [property, value] };
    case "like":
      const wildcardValue = `${wildcard}${value}${wildcard}`;
      return { op: "like", args: [property, wildcardValue] };
    case "in":
      const values = value.split(",").map(trim).filter(Boolean);
      return {
        op: "in",
        args: [property, values],
      };
    default:
      throw new Error(`Unknown TextStringField operator: ${operatorKey}`);
  }
};
