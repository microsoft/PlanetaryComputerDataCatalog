import { useContext } from "react";
import { ActionTypes, ViewerMode } from "../state/reducers";
import { ExploreContext } from "../state";
import { Dropdown, IDropdownOption } from "@fluentui/react";
import { renderPlaceholder, renderTitle } from "../../utils";

type StateSelectorProps = {
  options: IDropdownOption[];
  action: ActionTypes;
  title: string;
  icon: string;
};

const StateSelector = ({ options, action, title, icon }: StateSelectorProps) => {
  const { state, dispatch } = useContext(ExploreContext);

  if (state.mode !== ViewerMode.mosaic) return null;

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
        onChange={handleCollectionChange}
        onRenderTitle={renderTitle(icon)}
        onRenderPlaceholder={renderPlaceholder(icon, title)}
        ariaLabel="Selected Mosaic"
      />
    </div>
  );
};

export default StateSelector;
