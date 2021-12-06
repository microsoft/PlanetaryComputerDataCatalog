import { CqlExpressionParser } from "../CqlExpressionParser";
import { EnumField } from "pages/Explore/components/query/EnumField";
import { RangeField } from "pages/Explore/components/query/RangeField";
import { TextNumberField } from "pages/Explore/components/query/TextNumberField/TextNumberField";
import { TextStringField } from "pages/Explore/components/query/TextStringField";

export const getControlForField = (field: CqlExpressionParser<string | number>) => {
  const schemaType = field.fieldSchema?.type;
  if (!schemaType) return null;

  switch (schemaType) {
    case "string":
      if (fieldSchemaIsEnum(field)) {
        return getEnumControl(field as CqlExpressionParser<string>);
      }
      return getTextControl(field as CqlExpressionParser<string>);
    case "number":
    case "integer":
      return getNumericControl(field as CqlExpressionParser<number>);
    default:
      return getTextControl(field as CqlExpressionParser<string>);
  }
};

export const getTextControl = (field: CqlExpressionParser<string>) => {
  const { fieldSchema } = field;
  if (!fieldSchema) return null;

  return <TextStringField key={`textstringfield-${field.property}`} field={field} />;
};

export const getNumericControl = (field: CqlExpressionParser<number>) => {
  const { fieldSchema } = field;
  if (!fieldSchema) return null;

  if (fieldSchema.minimum !== undefined && fieldSchema.maximum !== undefined) {
    // Range control
    return <RangeField key={`rangecontrol-${field.property}`} field={field} />;
  } else {
    return (
      <TextNumberField
        key={`numericcontrol-${field.property}`}
        field={field}
      ></TextNumberField>
    );
  }
};

const getEnumControl = (field: CqlExpressionParser<string>) => {
  return <EnumField field={field} key={`enumcontrol-${field.property}`} />;
};

const fieldSchemaIsEnum = (field: CqlExpressionParser<string | number>) => {
  return field.fieldSchema?.enum !== undefined;
};
