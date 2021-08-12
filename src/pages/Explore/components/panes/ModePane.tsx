import { useCallback, useContext } from "react";
import {
  ChoiceGroup,
  DefaultButton,
  IChoiceGroupOption,
  IChoiceGroupOptionProps,
} from "@fluentui/react";
import { ExploreContext } from "../state";
import { ActionTypes, ViewerMode } from "../state/reducers";

const ModePane = () => {
  const { state, dispatch } = useContext(ExploreContext);

  const buttonStyles = { root: { pointerEvents: "none" } };
  const onRenderField = (opt: IChoiceGroupOptionProps | undefined) => {
    if (opt) {
      return (
        <DefaultButton
          primary={opt.checked}
          disabled={opt.disabled}
          styles={buttonStyles}
          // prevent focusing on the button
          // hide the button from screen readers to avoid reading both a <button>
          // and a radio <input>
          tabIndex={-1}
          aria-hidden
        >
          {opt.text}
        </DefaultButton>
      );
    }

    return null;
  };

  const handleChange = useCallback(
    (_, option: IChoiceGroupOption | undefined) => {
      if (option) {
        dispatch({ type: ActionTypes.mode, payload: option.key });
      }
    },
    [dispatch]
  );

  const options: IChoiceGroupOption[] = [
    {
      key: ViewerMode.mosaic,
      text: "Mosaic",
      title: "Select mosaic mode",
      onRenderField,
    },
    {
      key: ViewerMode.scenes,
      text: "Scenes",
      title: "Select scene mode",
      onRenderField,
    },
  ];

  return (
    <ChoiceGroup
      aria-label="Select mode"
      selectedKey={state.mode}
      onChange={handleChange}
      options={options}
      styles={{ flexContainer: { display: "flex" } }}
    />
  );
};

export default ModePane;
