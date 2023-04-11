import { useState, useCallback, useMemo } from "react";
import {
  Dropdown,
  getTheme,
  IDropdownOption,
  IDropdownStyles,
  IStackTokens,
  ITextFieldStyles,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { debounce } from "lodash-es";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpressions } from "pages/Explore/state/mosaicSlice";
import DropdownLabel from "../components/DropdownLabel";
import { CqlOperator } from "pages/Explore/utils/cql/types";
import { getQueryableTitle } from "pages/Explore/utils/stac";

interface TextFieldProps<T extends string | number> {
  field: CqlExpressionParser<T>;
  operatorOptions: IDropdownOption[];
  onFormatValue: (value: any) => string;
  onParseOperatorKey: (key: CqlOperator) => string;
  onGenerateCqlExpression: (
    value: any,
    operator: string,
    field: CqlExpressionParser<any>
  ) => any;
  onRenderDisplay: (value: T) => string;
  instructions?: Record<string, JSX.Element>;
  disabled?: boolean;
}

export const TextFieldBase = ({
  field,
  operatorOptions,
  onFormatValue,
  onParseOperatorKey,
  onGenerateCqlExpression,
  instructions,
  disabled = false,
}: TextFieldProps<string> | TextFieldProps<number>) => {
  const dispatch = useExploreDispatch();

  const { fieldSchema } = field;
  const labelPrefix = getQueryableTitle(fieldSchema, field.property);
  const formattedValue = onFormatValue(field.value);
  const keyPrefix = `textstringcontrol-${field.property}`;

  const [value, setValue] = useState(formattedValue);
  const [selectedOperatorKey, setSelectedOperatorKey] = useState<string>(
    onParseOperatorKey(field.operator)
  );
  const [labeledValue, title] = getLabeledValue(
    selectedOperatorKey,
    formattedValue,
    operatorOptions
  );

  const applyCql = useCallback(
    (value: string, operator: string) => {
      const cql = onGenerateCqlExpression(value, operator, field);
      dispatch(setCustomCqlExpressions(cql));
    },
    [dispatch, field, onGenerateCqlExpression]
  );

  const handleOperatorChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption | undefined
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
        displayValue={labeledValue}
        title={title}
      />
    );
  };

  // TODO: use min/max if available for validation
  const isNumeric =
    fieldSchema?.type === "number" || fieldSchema?.type === "integer";

  const instruction = instructions?.[selectedOperatorKey];

  return (
    <DropdownButton
      key={keyPrefix}
      label={`${labelPrefix}: ${formattedValue}`}
      onRenderText={renderLabel}
      data-cy={keyPrefix}
      disabled={disabled}
    >
      <Stack styles={stackStyles} tokens={stackTokens}>
        <Stack horizontal tokens={stackTokens}>
          <Dropdown
            selectedKey={selectedOperatorKey}
            options={operatorOptions}
            styles={operatorStyles}
            onChange={handleOperatorChange}
          ></Dropdown>
          <TextField
            styles={inputStyles}
            value={value.toString()}
            onChange={handleValueChange}
            type={isNumeric ? "number" : "text"}
          />
        </Stack>
        {instruction && (
          <MessageBar messageBarType={MessageBarType.info}>{instruction}</MessageBar>
        )}
      </Stack>
    </DropdownButton>
  );
};

const getLabeledValue = (
  selectedOperatorKey: string,
  value: string,
  operatorOptions: IDropdownOption[]
): [string | JSX.Element, string] => {
  const emptyText = "(Empty)";
  const noPrefixRequired = ["="];
  const optionForPrefix = operatorOptions.find(o => o.key === selectedOperatorKey);
  const needsPrefix =
    !noPrefixRequired.includes(selectedOperatorKey) && Boolean(optionForPrefix);

  const valueText = needsPrefix ? `${optionForPrefix?.text} ${value}` : value;
  const emptyLabel = <Text styles={emptyStyles}>{emptyText}</Text>;

  const formattedValue = value === "" ? emptyLabel : valueText;
  const title = value === "" ? emptyText : value;

  return [formattedValue, title];
};

const theme = getTheme();
const stackStyles = {
  root: {
    width: 405,
    padding: 6,
    justifyContent: "space-between",
  },
};
const stackTokens: IStackTokens = {
  childrenGap: theme.spacing.s1,
};

const operatorStyles: Partial<IDropdownStyles> = {
  root: { minWidth: 120 },
};

const inputStyles: Partial<ITextFieldStyles> = {
  root: { width: "100%" },
};

const emptyStyles: Partial<ITextFieldStyles> = {
  root: {
    fontStyle: "italic",
  },
};
