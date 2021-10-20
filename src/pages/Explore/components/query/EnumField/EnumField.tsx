import { useState } from "react";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { renderPlaceholder, renderTitle } from "pages/Explore/utils/render";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpression } from "pages/Explore/state/mosaicSlice";
import { CqlEqualExpression, CqlInExpression } from "pages/Explore/utils/cql/types";

type EnumFieldProps = {
  field: CqlExpressionParser<string>;
};

export const EnumField = ({ field }: EnumFieldProps) => {
  const dispatch = useExploreDispatch();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    parseCqlToEnumKeys(field)
  );

  if (!field.fieldSchema) return null;

  const handleChange = (
    _: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption | undefined
  ): void => {
    if (item) {
      setSelectedKeys(
        item.selected
          ? [...selectedKeys, item.key as string]
          : selectedKeys.filter(key => key !== item.key)
      );
    }
  };

  const handleDismiss = () => {
    const cql = parseKeysToCql(selectedKeys, field);
    if (cql) {
      dispatch(setCustomCqlExpression(cql));
    }
  };

  const title = field.fieldSchema.title || field.property;
  const icon = "LocationFill";
  const options = enumToOptions(field.fieldSchema.enum);
  return (
    <Dropdown
      multiSelect
      options={options}
      selectedKeys={selectedKeys}
      onRenderTitle={renderTitle(icon, `${title}:`)}
      onRenderPlaceholder={renderPlaceholder(icon, `${title}: (none)`)}
      onChange={handleChange}
      onDismiss={handleDismiss}
    />
  );
};

const enumToOptions = (enumValues: JSONSchema["enum"] = []) => {
  return enumValues.map(value => {
    return { key: String(value), text: String(value) };
  });
};

const parseCqlToEnumKeys = (field: CqlExpressionParser<string>) => {
  return Array.isArray(field.value) ? field.value : [field.value];
};

const parseKeysToCql = (
  selectedKeys: string[],
  field: CqlExpressionParser<string>
): CqlEqualExpression<string> | CqlInExpression<string> | null => {
  const length = selectedKeys.length;
  if (length === 0) {
    return null;
  }

  if (length === 1) {
    return { eq: [{ property: field.property }, selectedKeys[0]] };
  }

  return { in: { value: { property: field.property }, list: selectedKeys } };
};
