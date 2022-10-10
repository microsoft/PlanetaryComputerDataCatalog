import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { dayjs } from "utils";
import { CqlExpressionParser } from "..";
import {
  CqlEqualExpression,
  CqlGtExpression,
  CqlInExpression,
  CqlLteExpression,
  ICqlExpressionList,
} from "../types";

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

  // Date range is same calendar day?
  const isSameDay = date1.isSame(date2, "day");

  // Within calendar day, do the times represent a full day?
  const isFullDayRange =
    date1.format("HH:mm:ss") === "00:00:00" &&
    date2.format("HH:mm:ss") === "23:59:59";

  return isSameDay;
  return isSameDay && isFullDayRange;
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
    case "array":
      const defaultValue = fieldSchema?.enum ? fieldSchema.enum[0] : [];
      return { op: "=", args: [{ property: property }, defaultValue] };
    default:
      throw new Error(`Unsupported field type: ${fieldSchema.type}`);
  }
};

const defaultStringCql = (
  property: string,
  fieldSchema: JSONSchema
): CqlInExpression<string> | CqlEqualExpression<string> => {
  if (fieldSchema.enum) {
    return { op: "in", args: [{ property: property }, []] };
  }
  return { op: "=", args: [{ property: property }, ""] };
};

const defaultNumberCql = (
  property: string,
  fieldSchema: JSONSchema
): CqlLteExpression<number> | CqlGtExpression<number> => {
  if (fieldSchema.minimum !== undefined && fieldSchema.maximum !== undefined) {
    const midValue = (fieldSchema.minimum + fieldSchema.maximum) / 2;
    return { op: "<=", args: [{ property: property }, midValue] };
  }
  return { op: ">", args: [{ property: property }, 0] };
};
