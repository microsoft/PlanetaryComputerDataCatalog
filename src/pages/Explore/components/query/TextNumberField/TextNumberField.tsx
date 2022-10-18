import {
  formatValue,
  operatorOptions,
  parseOperatorToKey,
  toCqlExpression,
} from "./helpers";
import { TextFieldBase } from "../TextFieldBase/TextFieldBase";
import { CqlExpressionParser } from "pages/Explore/utils/cql";

type TextNumberFieldProps = {
  field: CqlExpressionParser<number>;
  disabled?: boolean;
};

export const TextNumberField = ({
  field,
  disabled = false,
}: TextNumberFieldProps) => {
  return (
    <TextFieldBase
      field={field}
      operatorOptions={operatorOptions}
      onFormatValue={formatValue}
      onParseOperatorKey={parseOperatorToKey}
      onGenerateCqlExpression={toCqlExpression}
      onRenderDisplay={formatValue}
      disabled={disabled}
    />
  );
};
