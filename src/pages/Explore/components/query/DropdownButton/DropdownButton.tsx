import React from "react";
import {
  DefaultButton,
  Icon,
  IIconStyles,
  IStackStyles,
  Stack,
  getTheme,
  IButtonStyles,
  IButtonProps,
} from "@fluentui/react";

interface DropdownButtonProps extends IButtonProps {
  label: string;
}

export const DropdownButton = ({ label, ...rest }: DropdownButtonProps) => {
  return (
    <Stack styles={stackStyle} aria-label={label} aria-haspopup="dialog">
      <DefaultButton {...rest} styles={buttonStyles} />
      <Icon iconName="ChevronDown" styles={chevronStyle} />
    </Stack>
  );
};

const theme = getTheme();

const stackStyle: IStackStyles = {
  root: {
    position: "relative",
    width: "100%",
  },
};
const buttonStyles: Partial<IButtonStyles> = {
  icon: {
    color: theme.palette.themePrimary,
    marginRight: 10,
  },
  flexContainer: {
    justifyContent: "start",
  },
  root: {
    paddingLeft: 5,
    paddingRight: 30,
  },
};

const chevronStyle: IIconStyles = {
  root: {
    position: "absolute",
    top: 1,
    right: 8,
    height: 32,
    lineHeight: 30,
    fontSize: 12,
    color: theme.palette.neutralSecondary,
    pointerEvents: "none",
    cursor: "pointer",
  },
};
