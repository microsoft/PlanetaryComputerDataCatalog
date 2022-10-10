import {
  IStackStyles,
  IStackTokens,
  ITextField,
  ITextFieldStyles,
  ITextStyles,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { createRef } from "react";
import { RangeType } from "./types";

interface TimeProps {
  time: string;
  onChange: (value: string) => void;
  rangeType: RangeType;
}

const defaultStart = "00:00:00Z";
const defaultEnd = "23:59:59Z";

export const Time: React.FC<TimeProps> = ({ time, rangeType, onChange }) => {
  const defaultTime = rangeType === "start" ? defaultStart : defaultEnd;
  const ref = createRef<ITextField>();

  const handleChange = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    onChange(ref.current?.value || defaultTime);
  };

  return (
    <Stack
      styles={containerStyles}
      tokens={containerTokens}
      horizontal
      verticalAlign="center"
    >
      <Text styles={textStyles}>Time (UTC)</Text>
      <TextField
        componentRef={ref}
        styles={inputStyles}
        defaultValue={time}
        onBlur={handleChange}
      />
    </Stack>
  );
};

const containerTokens: IStackTokens = {
  childrenGap: 4,
};

const containerStyles: IStackStyles = {
  root: {
    margin: 4,
    marginLeft: 8,
    marginTop: 0,
  },
};

const textStyles: ITextStyles = {
  root: {
    fontWeight: 600,
  },
};

const inputStyles: Partial<ITextFieldStyles> = {
  root: {
    width: 125,
  },
};
