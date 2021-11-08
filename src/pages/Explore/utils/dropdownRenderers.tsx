import {
  Icon,
  IDropdownOption,
  getTheme,
  Text,
  Stack,
  IIconStyles,
} from "@fluentui/react";
import DropdownLabel from "../components/query/components/DropdownLabel";

export const renderTitle = (iconName: string, prefix: string = "") => {
  return (options: IDropdownOption[] | undefined): JSX.Element | null => {
    if (!options) return null;

    const optionsText = options.map(o => o.text).join(", ");

    return (
      <div>
        <Icon styles={iconStyles} iconName={iconName} aria-hidden="true" />
        <Text>
          {prefix} {optionsText}
        </Text>
      </div>
    );
  };
};

export const renderPlaceholder = (iconName: string, title: string) => {
  return (): JSX.Element => {
    return (
      <div>
        <Icon styles={iconStyles} iconName={iconName} aria-hidden="true" />
        <Text>{title}</Text>
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
        <DropdownLabel label={label} displayValue={optionsText} />
      </Stack>
    );
  };
};

export const renderSegmentedPlaceholder = (label: string, displayValue: string) => {
  return (): JSX.Element => {
    return (
      <Stack horizontal>
        <DropdownLabel label={label} displayValue={displayValue} />
      </Stack>
    );
  };
};

const { palette } = getTheme();
export const iconStyles: IIconStyles = {
  root: {
    marginRight: 10,
    color: palette.themePrimary,
    width: 14,
    height: 14,
  },
};
