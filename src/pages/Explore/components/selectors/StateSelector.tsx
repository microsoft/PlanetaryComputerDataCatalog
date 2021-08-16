import { ViewerMode } from "../state/types";
import { Dropdown, IDropdownOption, Icon, useTheme } from "@fluentui/react";
import { useExploreDispatch, useExploreSelector } from "../state/hooks";

type StateSelectorProps = {
  options: IDropdownOption[];
  action: Function;
  title: string;
  icon: string;
  selectedKey: string | null | undefined;
  disabled?: boolean;
  allowedInModes?: ViewerMode[];
  getStateValFn?: (key: string | number) => any;
};

const StateSelector = ({
  options,
  action,
  title,
  icon,
  selectedKey,
  allowedInModes = [ViewerMode.mosaic],
  disabled = false,
  getStateValFn,
}: StateSelectorProps) => {
  const mode = useExploreSelector(state => state.mosaic.mode);
  const dispatch = useExploreDispatch();
  const { palette } = useTheme();

  if (!allowedInModes?.includes(mode)) return null;

  const iconStyles = { marginRight: "8px", color: palette.themePrimary };

  const renderTitle = (iconName: string) => {
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

  const renderPlaceholder = (iconName: string, title: string) => {
    return (): JSX.Element => {
      return (
        <div>
          <Icon style={iconStyles} iconName={iconName} aria-hidden="true" />
          <span>{title}</span>
        </div>
      );
    };
  };

  const handleCollectionChange = (
    _: any,
    option: IDropdownOption | undefined
  ): void => {
    if (option) {
      const payload = getStateValFn ? getStateValFn(option.key) : option.key;
      dispatch(action(payload));
    }
  };

  return (
    <div>
      <Dropdown
        options={options}
        selectedKey={selectedKey}
        onChange={handleCollectionChange}
        onRenderTitle={renderTitle(icon)}
        onRenderPlaceholder={renderPlaceholder(icon, title)}
        ariaLabel={title}
        disabled={disabled}
      />
    </div>
  );
};

export default StateSelector;
