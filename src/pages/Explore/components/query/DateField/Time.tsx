import {
  IStackStyles,
  IStackTokens,
  ITextFieldStyles,
  ITextStyles,
  MaskedTextField,
  Stack,
  Text,
} from "@fluentui/react";
import { useState } from "react";

import { RangeType } from "./types";

interface TimeProps {
  time: string;
  onChange: (value: string) => void;
  rangeType: RangeType;
}

const defaultStart = "00:00:00Z";
const defaultEnd = "23:59:59Z";

export const Time: React.FC<TimeProps> = ({ time, rangeType, onChange }) => {
  const [errorMsg, setErrorMessage] = useState<string>("");
  const defaultTime = rangeType === "start" ? defaultStart : defaultEnd;

  const handleChange = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void => {
    // An underscore indicates the mask hasn't been filled out yet
    if (!newValue || newValue.includes("_")) return;
    if (!validateTime(newValue)) {
      setErrorMessage("* 00:00:00 – 23:59:59");
      return;
    }

    setErrorMessage("");
    onChange(newValue || defaultTime);
  };

  const maskFormat: { [key: string]: RegExp } = {
    "*": /[0-9]/,
  };

  return (
    <Stack
      styles={containerStyles}
      tokens={containerTokens}
      horizontal
      verticalAlign="center"
    >
      <Text styles={textStyles}>Time (UTC)</Text>
      <MaskedTextField
        maskFormat={maskFormat}
        maskChar="_"
        mask="**:**:**"
        styles={inputStyles}
        value={time}
        onChange={handleChange}
        errorMessage={errorMsg}
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

const validateTime = (newValue: string): boolean => {
  try {
    const [hours, minutes, seconds] = newValue.split(":");
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const second = parseInt(seconds);

    if (hour > 23 || minute > 59 || second > 59) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
