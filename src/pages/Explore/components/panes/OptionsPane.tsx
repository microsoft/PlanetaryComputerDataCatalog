import { Icon, Stack, Toggle, TooltipHost } from "@fluentui/react";

const OptionsPane = () => {
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
        label={label(
          "Show item results",
          "Show individual STAC items returned by this filter"
        )}
        inlineLabel
      />
      <Toggle
        label={label("Edit filter", "Adjust the selected filter preset")}
        inlineLabel
      />
    </Stack>
  );
};

export default OptionsPane;
