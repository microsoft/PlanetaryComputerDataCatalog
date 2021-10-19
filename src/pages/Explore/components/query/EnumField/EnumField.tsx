import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { Dropdown } from "@fluentui/react";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { renderPlaceholder, renderTitle } from "pages/Explore/utils/render";

type EnumFieldProps = {
  field: CqlExpressionParser<string>;
};

export const EnumField = ({ field }: EnumFieldProps) => {
  if (!field.fieldSchema) return null;

  const title = field.fieldSchema.title || field.property;
  const icon = "LocationFill";
  const options = enumToOptions(field.fieldSchema.enum);
  return (
    <Dropdown
      multiSelect
      options={options}
      onRenderTitle={renderTitle(icon)}
      onRenderPlaceholder={renderPlaceholder(icon, title)}
    />
  );
};

const enumToOptions = (enumValues: JSONSchema["enum"] = []) => {
  return enumValues.map(value => {
    return { key: String(value), text: String(value) };
  });
};
