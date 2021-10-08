import { useCallback } from "react";
import { Dropdown, IDropdownOption, Icon, getTheme } from "@fluentui/react";
import { useExploreDispatch } from "../../../state/hooks";

type StateSelectorProps = {
  options: IDropdownOption[];
  action: Function;
  title: string;
  icon: string;
  selectedKey: string | null | undefined;
  disabled?: boolean;
  getStateValFn?: (key: string | number) => any;
  cyId: string;
};

const StateSelector = ({
  options,
  action,
  title,
  icon,
  selectedKey,
  disabled = false,
  cyId,
  getStateValFn,
}: StateSelectorProps) => {
  const dispatch = useExploreDispatch();

  const handleCollectionChange = useCallback(
    (_: any, option: IDropdownOption | undefined): void => {
      if (option) {
        const payload = getStateValFn ? getStateValFn(option.key) : option.key;
        dispatch(action(payload));
      }
    },
    [action, dispatch, getStateValFn]
  );

  return (
    <div>
      <Dropdown
        options={options}
        selectedKey={selectedKey}
        onChange={handleCollectionChange}
        onRenderTitle={renderTitle(icon)}
        onRenderPlaceholder={renderPlaceholder(icon, title)}
        ariaLabel={title}
        title={title}
        disabled={disabled}
        data-cy={cyId}
      />
    </div>
  );
};

export default StateSelector;

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

const { palette } = getTheme();
const iconStyles = { marginRight: 8, color: palette.themePrimary };
