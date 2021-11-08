import { useState } from "react";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import {
  renderSegmentedPlaceholder,
  renderSegmentedTitle,
} from "pages/Explore/utils/dropdownRenderers";
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
      const newKeys = item.selected
        ? [...selectedKeys, item.key as string]
        : selectedKeys.filter(key => key !== item.key);
      setSelectedKeys(newKeys);
      handleUpdate(newKeys);
    }
  };

  const handleUpdate = (keys: string[]) => {
    const cql = parseKeysToCql(keys, field);
    if (cql) {
      dispatch<any>(setCustomCqlExpression(cql));
    }
  };

  const title = field.fieldSchema.title || field.property;
  const options = enumToOptions(field.fieldSchema.enum);

  return (
    <Dropdown
      multiSelect
      options={options}
      selectedKeys={selectedKeys}
      ariaLabel={`${title} dropdown selector`}
      onRenderTitle={renderSegmentedTitle(title)}
      onRenderPlaceholder={renderSegmentedPlaceholder(title, "Include all")}
      onChange={handleChange}
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

  if (length === 1) {
    return { eq: [{ property: field.property }, selectedKeys[0]] };
  }
  // This may result in an empty `list` value, which is fine and will get
  // filtered out when optimizing the query
  return { in: { value: { property: field.property }, list: selectedKeys } };
};
