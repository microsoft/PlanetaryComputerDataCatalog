import { getTheme, IconButton, Separator, Stack, Text } from "@fluentui/react";
import TemporalExtent from "components/stac/TemporalExtent";
import { IMosaicRenderOption } from "pages/Explore/types";
import { IStacCollection } from "types/stac";

interface Props {
  collection: IStacCollection | null;
  renderOption: IMosaicRenderOption | null;
  handleClose: () => void;
}
export const AnimationIntro: React.FC<Props> = ({
  collection,
  renderOption,
  handleClose,
}) => {
  if (!collection) return null;

  return (
    <>
      <Stack horizontal horizontalAlign="space-between">
        <h3 style={headerStyles}>Timelapse Animation</h3>
        <IconButton
          title="Close"
          aria-label="Close animation export panel"
          styles={buttonStyles}
          iconProps={iconProps}
          onClick={handleClose}
        />
      </Stack>
      <Text>
        Generate an animated image of your current search over time. Start by
        selecting the area you want to capture on the map, then select the increment
        for each frame.
      </Text>
      <Text>
        Keep in mind that many datasets have irregular temporal availability, varied
        cloud cover, or other changes which might affect the quality of your results.
        You may need to experiment to get a good result!
      </Text>
      <Separator />
      <h4 style={headerStyles}>
        {collection.title || collection.id}, {renderOption?.name}
      </h4>
      <TemporalExtent extent={collection.extent.temporal} label="Valid date range" />
    </>
  );
};

const theme = getTheme();

const buttonStyles = {
  root: { color: theme.semanticColors.bodyText },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
const iconProps = { iconName: "Cancel" };
const headerStyles = { marginBottom: 4 };
