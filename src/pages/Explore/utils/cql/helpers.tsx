import { TextField } from "@fluentui/react";

import { RangeField } from "pages/Explore/components/query/RangeField";
import { CqlExpressionParser } from "./CqlExpressionParser";

export const getControlForField = (field: CqlExpressionParser<string | number>) => {
  const schemaType = field.fieldSchema?.type;
  if (!schemaType) return null;

  if (schemaType === "string") {
    return getTextControl(field as CqlExpressionParser<string>);
  } else if (schemaType === "number") {
    return getNumericControl(field as CqlExpressionParser<number>);
  }
};

export const getTextControl = (field: CqlExpressionParser<string>) => {
  const { fieldSchema } = field;
  if (!fieldSchema) return null;

  return (
    <TextField
      key={`textcontrol-${field.property}`}
      label={fieldSchema.title}
    ></TextField>
  );
};

export const getNumericControl = (field: CqlExpressionParser<number>) => {
  const { fieldSchema } = field;
  if (!fieldSchema) return null;

  if (fieldSchema.minimum !== undefined && fieldSchema.maximum !== undefined) {
    // Range control
    return (
      <RangeField
        key={`rangecontrol-${field.property}`}
        field={field}
        // TODO: icon lookup or generic
        icon="Cloud"
      />
    );
  } else {
    return (
      <TextField
        key={`numericcontrol-${field.property}`}
        label={fieldSchema.title}
        type="number"
      ></TextField>
    );
  }
};
