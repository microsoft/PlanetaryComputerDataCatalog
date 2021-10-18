import { stacFormatter } from "utils/stac";
import {
  CqlGteExpression,
  CqlLteExpression,
  CqlEqualExpression,
  ICqlExpression,
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
    case "eq":
      return `exactly ${lower}`;
    case "gte":
    case "gt":
      return `over ${lower}`;
    case "lte":
    case "lt":
      return `under ${upper}`;
    case "between":
      return `${lower} - ${upper}`;
  }
};

export const formatValue = (field: CqlExpressionParser<number>) => {
  return (value: Number) => stacFormatter.format(value, field.property);
};

export const toCqlExpression = (
  lowerValue: number,
  upperValue: number,
  field: CqlExpressionParser<number>
): ICqlExpression => {
  const isLowerClamped = field.fieldSchema?.minimum === lowerValue;
  const isUpperClamped = field.fieldSchema?.maximum === upperValue;

  if (isLowerClamped && isUpperClamped) {
    return toBetweenPredicate(field.property, lowerValue, upperValue);
  } else if (lowerValue === upperValue) {
    return toSingleValuePredicate("eq", field.property, lowerValue);
  } else if (isLowerClamped) {
    return toSingleValuePredicate("lte", field.property, upperValue);
  } else if (isUpperClamped) {
    return toSingleValuePredicate("gte", field.property, lowerValue);
  } else {
    return toBetweenPredicate(field.property, lowerValue, upperValue);
  }
};

export const toBetweenPredicate = (
  property: string,
  lowerValue: number,
  upperValue: number
): ICqlExpression => {
  return {
    between: {
      value: { property: property },
      lower: lowerValue,
      upper: upperValue,
    },
  };
};

export const toSingleValuePredicate = (
  operator: "gte" | "lte" | "eq",
  property: string,
  value: number
): CqlGteExpression | CqlLteExpression | CqlEqualExpression => {
  // REFACTOR: can `operator` be successfully discriminated for use as a dynamic key in a single return type?

  switch (operator) {
    case "gte":
      return {
        gte: [{ property: property }, value],
      };
    case "lte":
      return {
        lte: [{ property: property }, value],
      };
    case "eq":
      return {
        eq: [{ property: property }, value],
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
      case "eq":
        currentLower = value;
        currentUpper = value;
        break;
      case "gte":
      case "gt":
        currentLower = value;
        currentUpper = range.maximum;
        break;
      case "lte":
      case "lt":
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
