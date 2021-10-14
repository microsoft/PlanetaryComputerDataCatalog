import { Slider, Stack, Text } from "@fluentui/react";
import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";

type RangeFieldProps = {
  field: CqlExpressionParser;
  icon: string;
};
export const RangeField = ({ field, icon }: RangeFieldProps) => {
  const label = field.fieldSchema?.title || field.property;
  // TODO: Handle min/max ranges
  const value =
    typeof field.value === "string"
      ? parseInt(field.value)
      : parseInt(field.value[0]);

  return (
    <DropdownButton
      key={`control-${field.property}`}
      label={label}
      iconProps={{ iconName: icon }}
      onRenderText={() => {
        return (
          <Text>
            {label}: {field.value}
          </Text>
        );
      }}
    >
      <Stack styles={stackStyles}>
        <Slider min={0} max={100} step={1} defaultValue={value} />
      </Stack>
    </DropdownButton>
  );
};

const stackStyles = {
  root: {
    width: "100%",
  },
};
