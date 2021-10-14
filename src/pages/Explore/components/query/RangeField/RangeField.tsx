import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";

type RangeFieldProps = {
  field: CqlExpressionParser;
};
export const RangeField = ({ field }: RangeFieldProps) => {
  return (
    <DropdownButton
      key={`control-${field.property}`}
      label={field.fieldSchema?.title || field.property}
    ></DropdownButton>
  );
};
