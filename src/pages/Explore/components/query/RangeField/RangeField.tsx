import { useState } from "react";
import {
  getTheme,
  ISliderStyles,
  IStackTokens,
  ITextFieldStyles,
  Slider,
  Stack,
} from "@fluentui/react";

import { CqlExpressionParser } from "pages/Explore/utils/cql";
import { DropdownButton } from "../DropdownButton";
import { useExploreDispatch } from "pages/Explore/state/hooks";
import { setCustomCqlExpressions } from "pages/Explore/state/mosaicSlice";
import {
  getValueLabel,
  parseCqlValueToRange,
  schemaRange,
  toCqlExpression,
  formatValue,
} from "./helpers";
import DropdownLabel from "../components/DropdownLabel";

type RangeFieldProps = {
  field: CqlExpressionParser<number>;
};

export const RangeField = ({ field }: RangeFieldProps) => {
  const dispatch = useExploreDispatch();

  const { currentLower, currentUpper } = parseCqlValueToRange(field);
  const [lowerWorkingValue, setLowerValue] = useState<number>(currentLower);
  const [upperWorkingValue, setUpperValue] = useState<number>(currentUpper);

  const { fieldSchema } = field;
  const range = schemaRange(fieldSchema);
  const labelPrefix = fieldSchema?.title || field.property;
  const valueLabel = getValueLabel(field, currentLower, currentUpper);
  const keyPrefix = `rangecontrol-${field.property}`;

  const handleUpdate = (
    _: any,
    __: number,
    range?: [number, number] | undefined
  ) => {
    if (range) {
      handleChange(null, range);

      const [lower, upper] = range;
      const cql = toCqlExpression(lower, upper, field);
      dispatch<any>(setCustomCqlExpressions(cql));
    }
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
      <DropdownLabel
        key={`rangefield-label-${labelPrefix}`}
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
        {/* <TextField
          underlined
          suffix="%"
          styles={inputStyles}
          value={lowerWorkingValue.toString()}
          onChange={(e, v) => {
            const n = Number(v);
            if (!Number.isNaN(n)) {
              setLowerValue(Number(v));
            }
          }}
        /> */}
        <Slider
          ranged
          min={range.minimum}
          max={range.maximum}
          step={1}
          lowerValue={lowerWorkingValue}
          value={upperWorkingValue}
          onChange={handleChange}
          onChanged={handleUpdate}
          valueFormat={formatValue(field)}
          styles={sliderStyles}
          showValue={true}
        />
        {/* <TextField
          underlined
          suffix="%"
          styles={inputStyles}
          value={upperWorkingValue.toString()}
          onChange={(e, v) => {
            const n = Number(v);
            if (!Number.isNaN(n)) {
              setUpperValue(Number(v));
            }
          }}
        /> */}
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

const sliderStyles: Partial<ISliderStyles> = {
  thumb: { width: 14, height: 14, top: -5 },
  activeSection: {
    background: theme.palette.themePrimary,
  },
  inactiveSection: {
    background: theme.palette.themeLighter,
  },
  root: {
    width: "100%",
  },
};

// TODO use for editable min/max inputs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inputStyles: Partial<ITextFieldStyles> = {
  root: {
    width: 95,
  },
  field: {
    textAlign: "center",
  },
  suffix: {
    padding: 0,
    backgroundColor: theme.semanticColors.bodyBackground,
  },
};
