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
import { CqlEqualExpression } from "pages/Explore/utils/cql/types";
import { stacFormatter } from "utils/stac";

type EnumFieldProps = {
  field: CqlExpressionParser<string[]>;
};

export const EnumArrayField = ({ field }: EnumFieldProps) => {
  const dispatch = useExploreDispatch();
  const [selectedKey, setSelectedKey] = useState<string[]>(field.value as string[]);

  if (!field.fieldSchema) return null;

  const handleChange = (
    _: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption | undefined
  ): void => {
    if (item) {
      const key = (item.key as string).split(",");
      setSelectedKey(key);
      handleUpdate(key);
    }
  };

  const handleUpdate = (key: string[]) => {
    const cql = parseKeysToCql(key, field);
    if (cql) {
      dispatch(setCustomCqlExpressions(cql));
    }
  };

  const title = field.fieldSchema.title || field.property;
  const options = enumToOptions(field.fieldSchema.enum, field.property);

  return (
    <Dropdown
      options={options}
      selectedKey={selectedKey.join(",")}
      ariaLabel={`${title} dropdown selector`}
      onRenderTitle={renderSegmentedTitle(title)}
      onRenderPlaceholder={renderSegmentedPlaceholder(title, "Include all")}
      onChange={handleChange}
      styles={dropdownStyles}
    />
  );
};

const enumToOptions = (
  enumValues: JSONSchema["enum"] = [],
  property: string
): IDropdownOption[] => {
  return enumValues.map(value => {
    const display = stacFormatter.format(String(value), property);
    const v = (value as string[]) || [];
    return { key: v.join(","), text: `[${display}]` };
  });
};

const parseKeysToCql = (
  selectedKey: string[],
  field: CqlExpressionParser<string[]>
): CqlEqualExpression<string[]> | null => {
  return { op: "=", args: [{ property: field.property }, selectedKey] };
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
