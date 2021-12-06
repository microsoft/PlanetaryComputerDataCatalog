import { IDropdownOption } from "@fluentui/react";
import { trim } from "lodash-es";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { CqlOperator } from "pages/Explore/utils/cql/types";

const wildcard = "%";

export const operatorOptions: IDropdownOption[] = [
  { key: "eq", text: "Equals" },
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
  switch (operator) {
    case "eq":
      return "eq";
    case "like":
      return "like";
    case "in":
      return "in";
    default:
      throw new Error(`Unknown TextStringField operator: ${operator}`);
  }
};

export const toCqlExpression = (
  value: string,
  operatorKey: string,
  field: CqlExpressionParser<string>
) => {
  const property = { property: field.property };
  switch (operatorKey) {
    case "eq":
      return { eq: [property, value] };
    case "like":
      const wildcardValue = `${wildcard}${value}${wildcard}`;
      return { like: [property, wildcardValue] }; // TODO: nocase: true when available
    case "in":
      const values = value.split(",").map(trim).filter(Boolean);
      return {
        in: {
          value: property,
          list: values,
        },
      };
    default:
      throw new Error(`Unknown TextStringField operator: ${operatorKey}`);
  }
};
