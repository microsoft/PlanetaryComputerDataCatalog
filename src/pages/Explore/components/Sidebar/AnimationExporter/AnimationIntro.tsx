import { getTheme, IconButton, Stack, Text } from "@fluentui/react";
import { IStacCollection } from "types/stac";

interface Props {
  collection: IStacCollection | null;
  handleClose: () => void;
}
export const AnimationIntro: React.FC<Props> = ({ collection, handleClose }) => {
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
      <h4 style={headerStyles}>{collection.title || collection.id}</h4>
      <Text>
        Generate an animated image of your current search over time. Start by drawing
        the area you want to capture on the map, and select the increment for each
        frame.
      </Text>
      <Text>
        Keep in mind that many datasets have irregular temporal availability, varied
        cloud cover, or other changes which might affect the quality of your results.
      </Text>
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
