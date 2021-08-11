import { useContext } from "react";
import { ActionTypes, ViewerMode } from "../state/reducers";
import { ExploreContext } from "../state";
import { Dropdown, IDropdownOption, Icon, useTheme } from "@fluentui/react";
import { IStacCollection } from "types/stac";

type StateSelectorProps = {
  options: IDropdownOption[];
  action: ActionTypes;
  title: string;
  icon: string;
  selectedKey: string | null | undefined;
  disabled?: boolean;
  getStateValFn?: (key: string | number) => IStacCollection | undefined;
};

const StateSelector = ({
  options,
  action,
  title,
  icon,
  selectedKey,
  disabled = false,
  getStateValFn,
}: StateSelectorProps) => {
  const { state, dispatch } = useContext(ExploreContext);
  const { palette } = useTheme();

  if (state.mode !== ViewerMode.mosaic) return null;

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
      dispatch({
        type: action,
        payload: getStateValFn ? getStateValFn(option.key) : option.key,
      });
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
