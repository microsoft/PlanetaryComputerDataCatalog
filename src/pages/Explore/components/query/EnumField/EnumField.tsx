import { useState } from "react";
import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import {
  Dropdown,
  getTheme,
  IDropdownOption,
  IDropdownStyles,
} from "@fluentui/react";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import {
  renderSegmentedPlaceholder,
  renderSegmentedTitle,
} from "pages/Explore/utils/dropdownRenderers";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpressions } from "pages/Explore/state/mosaicSlice";
import { CqlEqualExpression, CqlInExpression } from "pages/Explore/utils/cql/types";
import { stacFormatter } from "utils/stac";

type EnumFieldProps = {
  field: CqlExpressionParser<string>;
  disabled?: boolean;
};

export const EnumField = ({ field, disabled = false }: EnumFieldProps) => {
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
      dispatch(setCustomCqlExpressions(cql));
    }
  };

  const title = field.fieldSchema.title || field.property;
  const options = enumToOptions(field.fieldSchema.enum, field.property);

  return (
    <Dropdown
      multiSelect
      options={options}
      selectedKeys={selectedKeys}
      ariaLabel={`${title} dropdown selector`}
      onRenderTitle={renderSegmentedTitle(title)}
      onRenderPlaceholder={renderSegmentedPlaceholder(title, "Include all")}
      onChange={handleChange}
      styles={dropdownStyles}
      disabled={disabled}
    />
  );
};

const enumToOptions = (
  enumValues: JSONSchema["enum"] = [],
  property: string
): IDropdownOption[] => {
  return enumValues.map(value => {
    const display = stacFormatter.format(String(value), property);
    return { key: String(value), text: display };
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
    return { op: "=", args: [{ property: field.property }, selectedKeys[0]] };
  }
  // This may result in an empty `list` value, which is fine and will get
  // filtered out when optimizing the query
  return {
    op: "in",
    args: [{ property: field.property }, selectedKeys],
  };
};

const theme = getTheme();
const dropdownStyles: Partial<IDropdownStyles> = {
  title: {
    borderColor: theme.palette.neutralTertiaryAlt,
    ":hover": {
      borderColor: theme.palette.neutralTertiary + " !important",
    },
  },
};
