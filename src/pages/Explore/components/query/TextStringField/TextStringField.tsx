import { ITextStyles, Text, FontSizes } from "@fluentui/react";
import {
  formatValue,
  operatorOptions,
  parseOperatorToKey,
  toCqlExpression,
} from "./helpers";
import { TextFieldBase } from "../TextFieldBase/TextFieldBase";
import { CqlExpressionParser } from "pages/Explore/utils/cql";

type TextStringFieldProps = {
  field: CqlExpressionParser<string>;
  disabled: boolean;
};

export const TextStringField = ({
  field,
  disabled = false,
}: TextStringFieldProps) => {
  return (
    <TextFieldBase
      field={field}
      operatorOptions={operatorOptions}
      onFormatValue={formatValue}
      onParseOperatorKey={parseOperatorToKey}
      onGenerateCqlExpression={toCqlExpression}
      onRenderDisplay={formatValue}
      instructions={instructionMap}
      disabled={disabled}
    />
  );
};

const textStyle: Partial<ITextStyles> = {
  root: {
    fontSize: FontSizes.small,
  },
};
const instructionMap = {
  like: (
    <Text styles={textStyle}>
      Input will be evaluated as a partial match against the full attribute value.
      Use <code>%</code> for additional wildcard characters.
    </Text>
  ),
  in: (
    <Text styles={textStyle}>
      Use comma separated values (e.g. <code>one</code>, <code>two</code>,{" "}
      <code>three</code>)
    </Text>
  ),
};
