import { useState } from "react";
import { getTheme, ISliderStyles, Slider, Stack, Text } from "@fluentui/react";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpression } from "pages/Explore/state/mosaicSlice";
import {
  getValueLabel,
  parseCqlValueToRange,
  schemaRange,
  toCqlExpression,
  formatValue,
} from "./helpers";

type RangeFieldProps = {
  field: CqlExpressionParser<number>;
  icon: string;
};

export const RangeField = ({ field, icon }: RangeFieldProps) => {
  const dispatch = useExploreDispatch();

  const { currentLower, currentUpper } = parseCqlValueToRange(field);
  const [lowerWorkingValue, setLowerValue] = useState<number>(currentLower);
  const [upperWorkingValue, setUpperValue] = useState<number>(currentUpper);

  const { fieldSchema } = field;
  const range = schemaRange(fieldSchema);
  const labelPrefix = fieldSchema?.title || field.property;
  const valueLabel = getValueLabel(field, currentLower, currentUpper);
  const keyPrefix = `rangecontrol-${field.property}`;

  const handleUpdate = () => {
    const cql = toCqlExpression(lowerWorkingValue, upperWorkingValue, field);
    dispatch(setCustomCqlExpression(cql));
  };

  const handleChange = (_: unknown, range: [number, number] | undefined) => {
    if (range) {
      const [lower, upper] = range;
      setLowerValue(lower);
      setUpperValue(upper);
    }
  };

  const renderLabel = () => {
    return (
      <Text key={`${keyPrefix}-label`}>
        {labelPrefix}: {valueLabel}
      </Text>
    );
  };

  return (
    <DropdownButton
      key={keyPrefix}
      label={`${labelPrefix}: ${valueLabel}`}
      iconProps={{ iconName: icon }}
      onRenderText={renderLabel}
      onDismiss={handleUpdate}
      data-cy={keyPrefix}
    >
      <Stack styles={stackStyles}>
        <Slider
          ranged
          min={range.minimum}
          max={range.maximum}
          step={1}
          lowerValue={lowerWorkingValue}
          value={upperWorkingValue}
          onChange={handleChange}
          valueFormat={formatValue(field)}
          styles={sliderStyles}
        />
      </Stack>
    </DropdownButton>
  );
};

const theme = getTheme();
const stackStyles = {
  root: {
    width: 330,
  },
};

const sliderStyles: Partial<ISliderStyles> = {
  thumb: { width: 14, height: 14, top: -5 },
  activeSection: {
    background: theme.palette.themePrimary,
  },
  inactiveSection: {
    background: theme.palette.themeLighter,
  },
};
