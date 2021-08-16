import { useCallback } from "react";
import {
  ChoiceGroup,
  DefaultButton,
  IChoiceGroupOption,
  IChoiceGroupOptionProps,
} from "@fluentui/react";
import { ViewerMode } from "../state/types";
import { useExploreDispatch, useExploreSelector } from "../state/hooks";
import { setMode } from "../state/mosaicSlice";

const ModePane = () => {
  const mode = useExploreSelector(s => s.mosaic.mode);
  const dispatch = useExploreDispatch();

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
        dispatch(setMode(ViewerMode[option.key as ViewerMode]));
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
      selectedKey={mode}
      onChange={handleChange}
      options={options}
      styles={{ flexContainer: { display: "flex" } }}
    />
  );
};

export default ModePane;
