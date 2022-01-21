import {
  Icon,
  IDropdownOption,
  getTheme,
  Text,
  Stack,
  IIconStyles,
  ITextStyles,
  StackItem,
} from "@fluentui/react";
import DropdownLabel from "../components/query/components/DropdownLabel";

export const renderTitle = (iconName: string, prefix: string = "") => {
  return (options: IDropdownOption[] | undefined): JSX.Element | null => {
    if (!options) return null;

    const optionsText = options.map(o => o.text).join(", ");

    return (
      <Stack horizontal>
        <StackItem shrink={0}>
          <Icon styles={iconStyles} iconName={iconName} aria-hidden="true" />
        </StackItem>
        <Text block nowrap styles={textStyles} title={optionsText}>
          {prefix}
          {optionsText}
        </Text>
      </Stack>
    );
  };
};

export const renderPlaceholder = (
  iconName: string,
  title: string,
  textStyle: ITextStyles | undefined = undefined,
  iconStyle: IIconStyles = iconStyles
) => {
  return (): JSX.Element => {
    return (
      <div>
        <Icon styles={iconStyles} iconName={iconName} aria-hidden="true" />
        <Text styles={textStyles}>{title}</Text>
      </div>
    );
  };
};

export const renderSegmentedTitle = (label: string) => {
  return (options: IDropdownOption[] | undefined): JSX.Element | null => {
    if (!options) return null;

    const optionsText = options.map(o => o.text).join(", ");
    return (
      <Stack horizontal>
        <DropdownLabel
          label={label}
          displayValue={optionsText}
          title={optionsText}
        />
      </Stack>
    );
  };
};

export const renderSegmentedPlaceholder = (label: string, displayValue: string) => {
  return (): JSX.Element => {
    return (
      <Stack horizontal>
        <DropdownLabel
          label={label}
          displayValue={displayValue}
          title={displayValue}
        />
      </Stack>
    );
  };
};

const { palette } = getTheme();
export const iconStyles: IIconStyles = {
  root: {
    marginRight: 10,
    position: "relative",
    top: 4,
    width: 20,
    height: 20,
    color: palette.themePrimary,
    fill: palette.themePrimary,
  },
};

export const textStyles: ITextStyles = {
  root: {},
};
