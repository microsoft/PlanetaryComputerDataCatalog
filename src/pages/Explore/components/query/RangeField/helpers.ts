import { stacFormatter } from "utils/stac";
import {
  CqlGteExpression,
  CqlLteExpression,
  CqlEqualExpression,
  CqlExpression,
  CqlBetweenExpression,
} from "pages/Explore/utils/cql/types";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { CqlExpressionParser } from "pages/Explore/utils/cql";

export const getValueLabel = (
  field: CqlExpressionParser<number>,
  lowerValue: number,
  upperValue: number
) => {
  const upper = stacFormatter.format(upperValue, field.property);
  const lower = stacFormatter.format(lowerValue, field.property);

  switch (field.operator) {
    case "=":
      return `Exactly ${lower}`;
    case ">=":
    case ">":
      return `Over ${lower}`;
    case "<=":
    case "<":
      return `Under ${upper}`;
    case "between":
      return `${lower} – ${upper}`;
    default:
      return "";
  }
};

export const formatValue = (field: CqlExpressionParser<number>) => {
  return (value: Number) => stacFormatter.format(value, field.property);
};

export const toCqlExpression = (
  lowerValue: number,
  upperValue: number,
  field: CqlExpressionParser<number>
): CqlExpression => {
  const isLowerClamped = field.fieldSchema?.minimum === lowerValue;
  const isUpperClamped = field.fieldSchema?.maximum === upperValue;

  if (isLowerClamped && isUpperClamped) {
    return toBetweenPredicate(field.property, lowerValue, upperValue);
  } else if (lowerValue === upperValue) {
    return toSingleValuePredicate("=", field.property, lowerValue);
  } else if (isLowerClamped) {
    return toSingleValuePredicate("<=", field.property, upperValue);
  } else if (isUpperClamped) {
    return toSingleValuePredicate(">=", field.property, lowerValue);
  } else {
    return toBetweenPredicate(field.property, lowerValue, upperValue);
  }
};

export const toBetweenPredicate = (
  property: string,
  lowerValue: number,
  upperValue: number
): CqlBetweenExpression => {
  return {
    op: "between",
    args: [{ property: property }, [lowerValue, upperValue]],
  };
};

export const toSingleValuePredicate = (
  operator: ">=" | "<=" | "=",
  property: string,
  value: number
):
  | CqlGteExpression<number>
  | CqlLteExpression<number>
  | CqlEqualExpression<number> => {
  // REFACTOR: can `operator` be successfully discriminated for use as a dynamic key in a single return type?

  switch (operator) {
    case ">=":
      return {
        op: ">=",
        args: [{ property: property }, value],
      };
    case "<=":
      return {
        op: "<=",
        args: [{ property: property }, value],
      };
    case "=":
      return {
        op: "=",
        args: [{ property: property }, value],
      };
  }
};

export const parseCqlValueToRange = (field: CqlExpressionParser<number>) => {
  const { value, fieldSchema } = field;
  let currentLower: number | undefined;
  let currentUpper: number | undefined;

  if (Array.isArray(value)) {
    currentLower = value[0];
    currentUpper = value[1];
  } else {
    const range = schemaRange(fieldSchema);
    switch (field.operator) {
      case "=":
        currentLower = value;
        currentUpper = value;
        break;
      case ">=":
      case ">":
        currentLower = value;
        currentUpper = range.maximum;
        break;
      case "<=":
      case "<":
        currentLower = range.minimum;
        currentUpper = value;
        break;
      default:
        throw new Error(`Unsupported operator: ${field.operator}`);
    }
  }
  return { currentLower, currentUpper };
};

export const schemaRange = (fieldSchema: JSONSchema | undefined) => {
  return {
    minimum: fieldSchema?.minimum || 0,
    maximum: fieldSchema?.maximum || 100,
  };
};
