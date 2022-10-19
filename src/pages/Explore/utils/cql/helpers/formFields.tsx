import { CqlExpressionParser } from "../CqlExpressionParser";
import { EnumField } from "pages/Explore/components/query/EnumField";
import { RangeField } from "pages/Explore/components/query/RangeField";
import { TextNumberField } from "pages/Explore/components/query/TextNumberField/TextNumberField";
import { TextStringField } from "pages/Explore/components/query/TextStringField";
import { EnumArrayField } from "pages/Explore/components/query/EnumArrayField";

export const getControlForField = (
  field: CqlExpressionParser<string | number | string[]>,
  isDisabled: boolean
) => {
  const schemaType = field.fieldSchema?.type;
  if (!schemaType) return null;

  switch (schemaType) {
    case "array":
      if (fieldSchemaIsEnum(field)) {
        return getArrayControl(field as CqlExpressionParser<string[]>, isDisabled);
      }
      return null;
    case "string":
      if (fieldSchemaIsEnum(field)) {
        return getEnumControl(field as CqlExpressionParser<string>, isDisabled);
      }
      return getTextControl(field as CqlExpressionParser<string>, isDisabled);
    case "number":
    case "integer":
      return getNumericControl(field as CqlExpressionParser<number>, isDisabled);
    default:
      return getTextControl(field as CqlExpressionParser<string>, isDisabled);
  }
};

export const getTextControl = (
  field: CqlExpressionParser<string>,
  isDisabled: boolean
) => {
  const { fieldSchema } = field;
  if (!fieldSchema) return null;

  return (
    <TextStringField
      key={`textstringfield-${field.property}`}
      field={field}
      disabled={isDisabled}
    />
  );
};

export const getNumericControl = (
  field: CqlExpressionParser<number>,
  isDisabled: boolean
) => {
  const { fieldSchema } = field;
  if (!fieldSchema) return null;

  if (fieldSchema.minimum !== undefined && fieldSchema.maximum !== undefined) {
    // Range control
    return (
      <RangeField
        key={`rangecontrol-${field.property}`}
        field={field}
        disabled={isDisabled}
      />
    );
  } else {
    return (
      <TextNumberField
        key={`numericcontrol-${field.property}`}
        field={field}
        disabled={isDisabled}
      ></TextNumberField>
    );
  }
};

const getEnumControl = (field: CqlExpressionParser<string>, isDisabled: boolean) => {
  return (
    <EnumField
      field={field}
      key={`enumcontrol-${field.property}`}
      disabled={isDisabled}
    />
  );
};

const getArrayControl = (
  field: CqlExpressionParser<string[]>,
  isDisabled: boolean
) => {
  return (
    <EnumArrayField
      key={`arraycontrol-${field.property}`}
      field={field}
      disabled={isDisabled}
    />
  );
};

const fieldSchemaIsEnum = (
  field: CqlExpressionParser<string | number | string[]>
) => {
  return field.fieldSchema?.enum !== undefined;
};
