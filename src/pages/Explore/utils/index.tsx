import { Icon, IDropdownOption, IDropdownProps } from "@fluentui/react";

const iconStyles = { marginRight: "8px" };

export const renderTitle = (iconName: string) => {
  return (options: IDropdownOption[] | undefined): JSX.Element | null => {
    if (!options) return null;

    const option = options[0];

    return (
      <div>
        <Icon
          style={iconStyles}
          iconName={iconName}
          aria-hidden="true"
          title={option.title}
        />
        <span>{option.text}</span>
      </div>
    );
  };
};

export const renderPlaceholder = (iconName: string, title: string) => {
  return (props: IDropdownProps | undefined): JSX.Element => {
    return (
      <div>
        <Icon style={iconStyles} iconName={iconName} aria-hidden="true" />
        <span>{title}</span>
      </div>
    );
  };
};
