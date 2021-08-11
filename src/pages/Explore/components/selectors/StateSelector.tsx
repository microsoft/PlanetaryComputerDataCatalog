import { useContext } from "react";
import { ActionTypes, ViewerMode } from "../state/reducers";
import { ExploreContext } from "../state";
import {
  Dropdown,
  IDropdownOption,
  IDropdownProps,
  Icon,
  useTheme,
} from "@fluentui/react";

type StateSelectorProps = {
  options: IDropdownOption[];
  action: ActionTypes;
  title: string;
  icon: string;
  selectedKey: string | null;
};

const StateSelector = ({
  options,
  action,
  title,
  icon,
  selectedKey,
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
    return (props: IDropdownProps | undefined): JSX.Element => {
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
        payload: option.key,
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
      />
    </div>
  );
};

export default StateSelector;
