import { Icon, Stack, Toggle, TooltipHost } from "@fluentui/react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useExploreDispatch } from "../state/hooks";
import { setShowEdit, setShowResults } from "../state/mosaicSlice";

const OptionsPane = () => {
  const dispatch = useExploreDispatch();

  const handleChange = (action: ActionCreatorWithPayload<boolean, string>) => {
    return (_: any, checked?: boolean) => {
      if (checked !== undefined) {
        dispatch(action(checked));
      }
    };
  };
  const label = (text: string, tip: string) => {
    return (
      <div>
        {text}{" "}
        <TooltipHost content={tip}>
          <Icon iconName="Info" aria-label={tip} />
        </TooltipHost>
      </div>
    );
  };

  return (
    <Stack horizontal horizontalAlign="space-between">
      <Toggle
        inlineLabel
        label={label("Edit filters", "Adjust the selected filter preset")}
        onChange={handleChange(setShowEdit)}
      />
      <Toggle
        inlineLabel
        label={label(
          "Show item results",
          "Show individual STAC items returned by this filter"
        )}
        onChange={handleChange(setShowResults)}
      />
    </Stack>
  );
};

export default OptionsPane;
