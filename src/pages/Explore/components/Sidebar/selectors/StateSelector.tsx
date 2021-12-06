import { useCallback } from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { useExploreDispatch } from "../../../state/hooks";
import {
  renderPlaceholder,
  renderTitle,
} from "pages/Explore/utils/dropdownRenderers";

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
