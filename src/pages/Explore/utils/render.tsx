import { Icon, IDropdownOption, getTheme, Text } from "@fluentui/react";

export const renderTitle = (iconName: string, prefix: string = "") => {
  return (options: IDropdownOption[] | undefined): JSX.Element | null => {
    if (!options) return null;

    const optionsText = options.map(o => o.text).join(", ");

    return (
      <div>
        <Icon style={iconStyles} iconName={iconName} aria-hidden="true" />
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
        <Icon style={iconStyles} iconName={iconName} aria-hidden="true" />
        <Text>{title}</Text>
      </div>
    );
  };
};

const { palette } = getTheme();
export const iconStyles = { marginRight: 8, color: palette.themePrimary };
