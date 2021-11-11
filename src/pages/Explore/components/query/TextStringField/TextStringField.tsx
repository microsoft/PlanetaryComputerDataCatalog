import { useState, useCallback, useMemo } from "react";
import {
  Dropdown,
  getTheme,
  IDropdownOption,
  IDropdownStyles,
  IStackTokens,
  ITextFieldStyles,
  Stack,
  TextField,
} from "@fluentui/react";
import { debounce } from "lodash-es";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpressions } from "pages/Explore/state/mosaicSlice";
import DropdownLabel from "../components/DropdownLabel";
import {
  formatValue,
  operatorOptions,
  parseOperatorToKey,
  toCqlExpression,
} from "./helpers";

type TextStringFieldProps = {
  field: CqlExpressionParser<string>;
};

export const TextStringField = ({ field }: TextStringFieldProps) => {
  const dispatch = useExploreDispatch();

  const { fieldSchema } = field;
  const labelPrefix = fieldSchema?.title || field.property;
  const valueLabel = formatValue(field.value);
  const keyPrefix = `textstringcontrol-${field.property}`;

  const [value, setValue] = useState(valueLabel);
  const [selectedOperatorKey, setSelectedOperatorKey] = useState<string>(
    parseOperatorToKey(field.operator)
  );
  const applyCql = useCallback(
    (value: string, operator: string) => {
      const cql = toCqlExpression(value, operator, field);
      dispatch<any>(setCustomCqlExpressions(cql));
    },
    [dispatch, field]
  );

  const handleOperatorChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption<any> | undefined
  ) => {
    setSelectedOperatorKey(option?.key as string);
    applyCql(value, option?.key as string);
  };

  const debouncedApply = useMemo(() => {
    return debounce((value, operator) => applyCql(value, operator), 500);
  }, [applyCql]);

  const handleValueChange = useCallback(
    (
      _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string | undefined
    ) => {
      const value = newValue || "";
      setValue(value);
      debouncedApply(value, selectedOperatorKey);
    },
    [debouncedApply, selectedOperatorKey]
  );

  const renderLabel = () => {
    return (
      <DropdownLabel
        key={`textstringfield-label-${labelPrefix}`}
        label={labelPrefix}
        displayValue={valueLabel}
      />
    );
  };

  return (
    <DropdownButton
      key={keyPrefix}
      label={`${labelPrefix}: ${valueLabel}`}
      onRenderText={renderLabel}
      data-cy={keyPrefix}
    >
      <Stack horizontal styles={stackStyles} tokens={stackTokens}>
        <Dropdown
          selectedKey={selectedOperatorKey}
          options={operatorOptions}
          styles={operatorStyles}
          onChange={handleOperatorChange}
        ></Dropdown>
        <TextField styles={inputStyles} value={value} onChange={handleValueChange} />
      </Stack>
    </DropdownButton>
  );
};

const theme = getTheme();
const stackStyles = {
  root: {
    width: 405,
    padding: 14,
    justifyContent: "space-between",
  },
};
const stackTokens: IStackTokens = {
  childrenGap: theme.spacing.m,
};

const operatorStyles: Partial<IDropdownStyles> = {
  root: { minWidth: 100 },
};

const inputStyles: Partial<ITextFieldStyles> = {
  root: { width: "100%" },
};
