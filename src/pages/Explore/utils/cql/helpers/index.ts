import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { dayjs } from "utils";
import { CqlExpressionParser } from "..";
import { ICqlExpressionList } from "../types";

export const rangeIsOnSameDay = (
  dateExpressionValue: string | string[] | undefined
) => {
  if (!dateExpressionValue) return false;

  if (!Array.isArray(dateExpressionValue)) {
    return false;
  }

  if (dateExpressionValue.length !== 2) {
    return false;
  }

  const [date1, date2] = dateExpressionValue.map(d => dayjs.utc(d));

  return date1.isSame(date2, "day");
};

// CQL expression lists that come from a restored searchId (i.e., from the query string)
// have expressions that don't need to be included in the "filter" expressions.
export const filterCoreExpressions = (expressions: ICqlExpressionList) => {
  const coreExpressionProperties = ["collection", "geometry"];

  return expressions.filter(e => {
    const property = new CqlExpressionParser(e).property;
    return !coreExpressionProperties.includes(property);
  });
};

export const makeDefaultCqlExpression = (
  property: string,
  fieldSchema: JSONSchema
) => {
  switch (fieldSchema.type) {
    case "string":
      return defaultStringCql(property, fieldSchema);
    case "number":
    case "integer":
      return defaultNumberCql(property, fieldSchema);
    default:
      throw new Error(`Unsupported field type: ${fieldSchema.type}`);
  }
};

const defaultStringCql = (property: string, fieldSchema: JSONSchema) => {
  if (fieldSchema.enum) {
    return { in: { value: { property: property }, list: [] } };
  }
  return { eq: [{ property: property }, ""] };
};

const defaultNumberCql = (property: string, fieldSchema: JSONSchema) => {
  if (fieldSchema.minimum !== undefined && fieldSchema.maximum !== undefined) {
    const midValue = (fieldSchema.minimum + fieldSchema.maximum) / 2;
    return { lte: [{ property: property }, midValue] };
  }
  return { gt: [{ property: property }, 0] };
};
