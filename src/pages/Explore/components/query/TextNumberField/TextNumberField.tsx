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
};

export const TextNumberField = ({ field }: TextNumberFieldProps) => {
  return (
    <TextFieldBase
      field={field}
      operatorOptions={operatorOptions}
      onFormatValue={formatValue}
      onParseOperatorKey={parseOperatorToKey}
      onGenerateCqlExpression={toCqlExpression}
      onRenderDisplay={formatValue}
    />
  );
};
