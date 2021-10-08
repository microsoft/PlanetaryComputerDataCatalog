import {
  DefaultButton,
  Icon,
  IIconStyles,
  IStackStyles,
  Stack,
  getTheme,
  IButtonStyles,
} from "@fluentui/react";

const DropdownButton = ({ ...rest }) => {
  return (
    <Stack styles={stackStyle}>
      <DefaultButton {...rest} styles={buttonStyles} />
      <Icon iconName="ChevronDown" styles={chevronStyle} />
    </Stack>
  );
};

export default DropdownButton;

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
