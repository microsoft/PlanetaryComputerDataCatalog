import { Icon, Label, Stack, TextField, TooltipHost } from "@fluentui/react";
import TemporalExtent from "components/stac/TemporalExtent";
import { IStacCollection } from "types/stac";
import { firstInputStyle, stackTokens } from "./AnimationExporter.index";

interface AnimationStartFieldProps {
  collection: IStacCollection | null;
  validations: string[];
  defaultValue: string;
  onChange: (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string | undefined
  ) => void;
}

export const AnimationStartField: React.FC<AnimationStartFieldProps> = ({
  collection,
  validations,
  defaultValue,
  onChange,
}) => {
  const tooltip = collection && (
    <Stack horizontal verticalAlign="center" tokens={stackTokens}>
      <Label>Start datetime (UTC)</Label>
      <TooltipHost
        content={
          <TemporalExtent
            extent={collection.extent.temporal}
            label="Valid date range"
          />
        }
      >
        <Icon iconName="Info" styles={{ root: { cursor: "pointer" } }} />
      </TooltipHost>
    </Stack>
  );

  const field = (
    <TextField
      title="Datetime to start the timelapse from, UTC (YYYY-MM-DDTHH:mm:ssZ)"
      name="start"
      placeholder="YYYY-MM-DD"
      defaultValue={defaultValue}
      onChange={onChange}
      errorMessage={validations[0]}
      styles={firstInputStyle}
      onRenderLabel={() => tooltip}
    />
  );

  return field;
};
