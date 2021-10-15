import { useState } from "react";
import { Slider, Stack, Text } from "@fluentui/react";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";
import { ICqlExpression } from "pages/Explore/utils/cql/types";

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
  const keyPrefex = `rangecontrol-${field.property}`;

  return (
    <DropdownButton
      key={keyPrefex}
      label={label}
      iconProps={{ iconName: icon }}
      onRenderText={() => {
        return (
          <Text key={`${keyPrefex}-label`}>
            {label}: {field.value}
          </Text>
        );
      }}
      onDismiss={() => console.log(toCqlExpression(lowerValue, upperValue, field))}
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

const toCqlExpression = (
  lowerValue: number,
  upperValue: number,
  field: CqlExpressionParser<number>
): ICqlExpression => {
  if (field.fieldSchema?.minimum === lowerValue) {
    return toSingleValuePredicate("lte", field.property, upperValue);
  } else if (field.fieldSchema?.maximum === upperValue) {
    return toSingleValuePredicate("gte", field.property, lowerValue);
  } else {
    return toBetweenPredicate(field.property, lowerValue, upperValue);
  }
};

const toBetweenPredicate = (
  property: string,
  lowerValue: number,
  upperValue: number
): ICqlExpression => {
  return {
    between: {
      value: { property: property },
      lower: lowerValue,
      upper: upperValue,
    },
  };
};

const toSingleValuePredicate = (
  operator: "gte" | "lte",
  property: string,
  value: number
): ICqlExpression => {
  // TODO: type this properly to use `operator`
  return {
    lte: [
      {
        property: property,
      },
      value,
    ],
  };
};
