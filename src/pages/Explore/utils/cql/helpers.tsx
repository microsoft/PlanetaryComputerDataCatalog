import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { TextField } from "@fluentui/react";

import { RangeField } from "pages/Explore/components/query/RangeField";
import { CqlExpressionParser } from ".";

export const getControlForField = (field: CqlExpressionParser) => {
  const schemaType = field.fieldSchema?.type;
  if (!schemaType) return null;

  if (schemaType === "string") {
    return getTextControl(field);
  } else if (schemaType === "number") {
    return getNumericControl(field);
  }
};

export const getTextControl = (fieldSchema: JSONSchema) => {
  return <TextField label={fieldSchema.title}></TextField>;
};

export const getNumericControl = (field: CqlExpressionParser) => {
  const { fieldSchema } = field;
  if (!fieldSchema) return null;

  if (
    fieldSchema.properties?.["min"] !== "undefined" &&
    fieldSchema.properties?.["max"] !== "undefined"
  ) {
    // Range control
    return <RangeField field={field} />;
  } else {
    return <TextField label={fieldSchema.title} type="number"></TextField>;
  }
};
