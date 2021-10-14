import { useState } from "react";
import { Slider, Stack, Text } from "@fluentui/react";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";

type RangeFieldProps = {
  field: CqlExpressionParser<number>;
  icon: string;
};
export const RangeField = ({ field, icon }: RangeFieldProps) => {
  // TODO: Handle min/max ranges
  const value = Array.isArray(field.value)
    ? parseInt(field.value[0].toString())
    : parseInt(field.value.toString());
  const [upperValue, setUpperValue] = useState<number>(value);
  const [lowerValue, setLowerValue] = useState<number>(0);

  const label = field.fieldSchema?.title || field.property;

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
      onDismiss={() => console.log(lowerValue, upperValue)}
    >
      <Stack styles={stackStyles}>
        <Slider
          ranged
          min={0}
          max={100}
          step={1}
          lowerValue={lowerValue}
          value={upperValue}
          onChange={(_: unknown, range: [number, number] | undefined) => {
            if (range) {
              const [lower, upper] = range;
              setLowerValue(lower);
              setUpperValue(upper);
            }
          }}
        />
      </Stack>
    </DropdownButton>
  );
};

const stackStyles = {
  root: {
    width: "100%",
  },
};
